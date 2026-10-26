"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import styles from "./GroveCanvas.module.css";

/* A canvas you move around, as in FigJam. Drag or scroll to pan, Ctrl/⌘ + scroll or pinch to zoom,
   and use the buttons or arrow keys. It opens on the rectangle given as `start`. */

const MIN_SCALE = 0.15;
// Capped at 100%: the board is exported at its natural size, so zooming past it only stretches the pixels
const MAX_SCALE = 1;
const PAD = 60;
// The zoom the board opens at, and returns to from the Grove button
const OPEN_SCALE = 0.8;
// Things the canvas must not pan from: controls, and the board's own items (data-no-pan)
const NO_PAN = "button, input, a, select, textarea, [data-no-pan]";
// In hand mode or with space held, only real controls keep their own clicks
const PAN_ANYWHERE_SKIP = "button, input, a, select, textarea";
// How much one unit of wheel scroll zooms by (exponential, so trackpads and mice feel the same)
const WHEEL_ZOOM = 0.01;
// The most one wheel event can zoom by, so a big mouse-wheel step does not jump far
const WHEEL_STEP = 50;

type Rect = { x: number; y: number; w: number; h: number };

// Keeps the board on screen: centred when it is smaller than the view, otherwise its edge stays in view
function keepInView(pos: number, viewSize: number, boardSize: number) {
  if (boardSize + PAD * 2 <= viewSize) return (viewSize - boardSize) / 2;
  return Math.min(PAD, Math.max(viewSize - boardSize - PAD, pos));
}

export default function GroveCanvas({
  children,
  width,
  height,
  start,
  toolbar,
  handMode = false,
  openScale = OPEN_SCALE,
  startLabel = "Grove",
}: {
  children: ReactNode;
  width: number;
  height: number;
  start: Rect;
  // Optional tools shown at the bottom-left of the screen, outside the board
  // Tools shown in the bottom bar. A function gets whether the space bar is held, so the tools can show it.
  toolbar?: ReactNode | ((spaceHeld: boolean) => ReactNode);
  // Hand mode: dragging pans from anywhere on the board, even over its items
  handMode?: boolean;
  // The zoom the board opens at; defaults to OPEN_SCALE
  openScale?: number;
  // The name on the button that returns to the start view
  startLabel?: string;
}) {
  const BOARD_W = width;
  const BOARD_H = height;
  const viewRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  // Position and scale live in refs. Changes are applied once per animation frame, and nothing
  // re-renders while the board moves or zooms.
  const view = useRef({ x: PAD, y: PAD, s: OPEN_SCALE });
  const frame = useRef(0);
  const rect = useRef({ left: 0, top: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number } | null>(null);
  // The finger that drags the board, when one finger is on the empty board
  const panPointer = useRef<number | null>(null);
  // Holding the space bar also pans from anywhere, as in FigJam
  const spaceDown = useRef(false);
  const [spaceHeld, setSpaceHeld] = useState(false);

  const size = () => {
    const el = viewRef.current;
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 0, h: 0 };
  };

  // Writes the view to the page, once per frame
  const flush = () => {
    frame.current = 0;
    const stage = stageRef.current;
    if (!stage) return;
    const { w, h } = size();
    const v = view.current;
    v.x = keepInView(v.x, w, BOARD_W * v.s);
    v.y = keepInView(v.y, h, BOARD_H * v.s);
    stage.style.transform = `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.s})`;
    if (labelRef.current) labelRef.current.textContent = `${Math.round(v.s * 100)}%`;
  };

  const schedule = () => {
    if (!frame.current) frame.current = requestAnimationFrame(flush);
  };

  const measure = () => {
    const el = viewRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      rect.current = { left: r.left, top: r.top };
    }
  };

  // Zooms by a factor, keeping the point under (cx, cy) in place
  const zoomAt = (factor: number, cx: number, cy: number) => {
    const v = view.current;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.s * factor));
    const ratio = next / v.s;
    v.x = cx - (cx - v.x) * ratio;
    v.y = cy - (cy - v.y) * ratio;
    v.s = next;
    schedule();
  };

  const zoomCentre = (factor: number) => {
    const { w, h } = size();
    zoomAt(factor, w / 2, h / 2);
  };

  // The whole board on screen, centred
  const fit = () => {
    const { w, h } = size();
    const s = Math.min(1, (w - PAD * 2) / BOARD_W, (h - PAD * 2) / BOARD_H);
    view.current = { x: (w - BOARD_W * s) / 2, y: (h - BOARD_H * s) / 2, s };
    schedule();
  };

  // Opens with the start rectangle's centre in the middle of the screen
  const goTo = (r: Rect) => {
    const { w, h } = size();
    const s = openScale;
    view.current = { x: w / 2 - (r.x + r.w / 2) * s, y: h / 2 - (r.y + r.h / 2) * s, s };
    schedule();
  };

  useEffect(() => {
    const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isTyping(e.target)) {
        e.preventDefault();
        spaceDown.current = true;
        if (viewRef.current) viewRef.current.dataset.space = "";
        setSpaceHeld(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceDown.current = false;
        if (viewRef.current) delete viewRef.current.dataset.space;
        setSpaceHeld(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    measure();
    goTo(start);
    const onResize = () => {
      measure();
      schedule();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
    // goTo, schedule and measure only read refs, so they are safe to leave out of the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel: pan, or zoom with Ctrl/⌘. Native listener so the page does not scroll under the canvas.
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Firefox reports wheel steps in lines; convert them to pixels
      const unit = e.deltaMode === 1 ? 16 : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      if (e.ctrlKey || e.metaKey) {
        const r = el.getBoundingClientRect();
        const step = Math.max(-WHEEL_STEP, Math.min(WHEEL_STEP, dy));
        zoomAt(Math.exp(-step * WHEEL_ZOOM), e.clientX - r.left, e.clientY - r.top);
      } else {
        view.current.x -= dx;
        view.current.y -= dy;
        schedule();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // A finger always pans, as it does on a map. A mouse pans with the hand tool or the space bar.
    // Buttons, sliders, the phone's own controls and the board's own items (data-no-pan) work without starting a drag
    const finger = e.pointerType === "touch";
    if (!(finger || handMode || spaceDown.current)) return;
    if (target.closest(PAN_ANYWHERE_SKIP)) return;
    // A finger that lands on a board item moves that item, so it is left to the item. A second finger
    // that lands on the board or an item still joins in, to pinch
    const onItem = finger && !!target.closest("[data-no-pan]");
    if (onItem && pointers.current.size === 0) return;
    const el = viewRef.current;
    if (!el) return;
    measure();
    el.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) panPointer.current = e.pointerId;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
      // Two fingers zoom rather than pan
      panPointer.current = null;
    }
    el.dataset.dragging = "";
  };

  // Pressing on the board starts a drag, not a text selection or a browser drag of the text or picture
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only when panning: otherwise text can be highlighted and clicked as normal
    if (!(handMode || spaceDown.current)) return;
    if (!(e.target as HTMLElement).closest(PAN_ANYWHERE_SKIP)) e.preventDefault();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const { left, top } = rect.current;

    if (pointers.current.size === 2 && pinch.current) {
      // Two fingers: zoom by the change in distance, around the midpoint
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const factor = dist / pinch.current.dist;
      pinch.current.dist = dist;
      zoomAt(factor, (a.x + b.x) / 2 - left, (a.y + b.y) / 2 - top);
      return;
    }
    // One pointer: drag the board, unless it is an item's finger (those moves bubble up here too)
    if (e.pointerId !== panPointer.current) return;
    view.current.x += e.clientX - prev.x;
    view.current.y += e.clientY - prev.y;
    schedule();
  };

  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (panPointer.current === e.pointerId) panPointer.current = null;
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0 && viewRef.current) delete viewRef.current.dataset.dragging;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 80;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      view.current.x += move[0];
      view.current.y += move[1];
      schedule();
    }
    if (e.key === "+" || e.key === "=") zoomCentre(1.2);
    if (e.key === "-") zoomCentre(1 / 1.2);
  };

  return (
    <div
      ref={viewRef}
      className={styles.viewport}
      data-hand={handMode ? "" : undefined}
      tabIndex={0}
      role="application"
      aria-label="Case study board. Drag to move around, Ctrl or pinch to zoom, arrow keys to move."
      onPointerDown={onPointerDown}
      onMouseDown={onMouseDown}
      onDragStart={(e) => e.preventDefault()}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >

      <div ref={stageRef} className={styles.stage} style={{ width: BOARD_W, height: BOARD_H }}>
        {children}
      </div>

      <div className={styles.bottomRow}>
      <div className={styles.bar}>
      {typeof toolbar === "function" ? toolbar(spaceHeld) : toolbar}

      <div className={styles.controls}>
        <button type="button" className={styles.button} onClick={() => zoomCentre(1 / 1.2)} aria-label="Zoom out">
          −
        </button>
        <span ref={labelRef} className={styles.zoomLabel} aria-live="polite">
          {Math.round(OPEN_SCALE * 100)}%
        </span>
        <button type="button" className={styles.button} onClick={() => zoomCentre(1.2)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className={styles.button} onClick={fit} aria-label="Fit whole board">
          Fit
        </button>
        <button type="button" className={styles.button} onClick={() => goTo(start)} aria-label="Back to the start">
          {startLabel}
        </button>
      </div>
      </div>
      <div className={styles.hint}>Press space bar and drag to move</div>
      </div>
    </div>
  );
}

"use client";

import { Inter } from "next/font/google";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import GroveCanvas from "./GroveCanvas";
import { STICKERS } from "./stickers";
import styles from "./BoardWorkspace.module.css";

const inter = Inter({ subsets: ["latin"] });

// The sticky note colours, as in FigJam's sticky notes
const STICKY_COLORS = ["#FEE447", "#C5EA47", "#BFE3FF", "#E0CCFF", "#FFD9B0"];
const STICKY_SIZE = 160;
const PIN_SIZE = 167;
const STICKER_SIZE = 120;

type Tool = { kind: "sticky"; color: string } | { kind: "pin" } | { kind: "sticker"; src: string };
type Item =
  | { id: number; kind: "sticky"; x: number; y: number; color: string; text: string }
  | { id: number; kind: "pin"; x: number; y: number }
  | { id: number; kind: "sticker"; x: number; y: number; src: string };

// A board with the tools every case study shares: the arrow and hand, sticky notes, pins and stickers, zoom.
// The board's content is passed in as children. Items that visitors add live in the page only: nothing is saved.
type Rect = { x: number; y: number; w: number; h: number };

export default function BoardWorkspace({
  width,
  height,
  start,
  openScale,
  startLabel,
  children,
}: {
  width: number;
  height: number;
  start: Rect;
  openScale?: number;
  startLabel?: string;
  children: ReactNode;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [tool, setTool] = useState<Tool | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  // Arrow selects and places; hand pans from anywhere on the board
  const [mode, setMode] = useState<"arrow" | "hand">("arrow");
  const nextId = useRef(1);
  const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number; scale: number } | null>(null);
  // The last finger press on an item, so a quick second tap on it can start typing (touch has no double click)
  const lastTap = useRef<{ id: number; time: number }>({ id: -1, time: 0 });
  // The board's placing layer, where a dropped sticker lands
  const layerRef = useRef<HTMLDivElement>(null);
  // A sticker being dragged out of the picker, and the picture that follows the pointer
  const stickerDrag = useRef<{ id: number; src: string; sx: number; sy: number; moved: boolean } | null>(null);
  const stickerDragged = useRef(false);
  const [ghost, setGhost] = useState<{ x: number; y: number; src: string } | null>(null);

  // Pressing a sticker in the picker: a small move drags it out, a tap is left to the click
  const onStickerDown = (e: ReactPointerEvent<HTMLButtonElement>, src: string) => {
    stickerDragged.current = false;
    stickerDrag.current = { id: e.pointerId, src, sx: e.clientX, sy: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onStickerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = stickerDrag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 8) return;
      d.moved = true;
      // The layer that takes the drop only shows while a tool is active
      setTool({ kind: "sticker", src: d.src });
    }
    setGhost({ x: e.clientX, y: e.clientY, src: d.src });
  };

  // Releasing over the board places the sticker there; releasing anywhere else cancels
  const onStickerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = stickerDrag.current;
    stickerDrag.current = null;
    if (!d || d.id !== e.pointerId || !d.moved) return;
    stickerDragged.current = true;
    setGhost(null);
    const r = layerRef.current?.getBoundingClientRect();
    if (r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
      placeAt(e.clientX, e.clientY);
    } else {
      setTool(null);
    }
    setShowStickers(false);
  };

  // Escape stops placing and deselects; Delete removes the selected item (not while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTool(null);
        setSelected(null);
        setEditing(null);
        setShowStickers(false);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selected !== null && editing === null) {
        setItems((list) => list.filter((i) => i.id !== selected));
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, editing]);

  // Going Back or Forward can restore this page from the browser's cache, with the items still on it.
  // Reload instead, so every visit starts with an empty board.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // Start typing straight away when a sticky note is double-clicked
  useEffect(() => {
    if (editing === null) return;
    const el = document.getElementById(`sticky-${editing}`);
    if (el) {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  // A click or drop on the board while a tool is active places the item, centred on the point
  const placeAt = (clientX: number, clientY: number) => {
    const el = layerRef.current;
    if (!tool || !el) return;
    const r = el.getBoundingClientRect();
    const scale = r.width / el.offsetWidth;
    const x = (clientX - r.left) / scale;
    const y = (clientY - r.top) / scale;
    const id = nextId.current++;
    if (tool.kind === "sticky") {
      setItems((list) => [...list, { id, kind: "sticky", x: x - STICKY_SIZE / 2, y: y - STICKY_SIZE / 2, color: tool.color, text: "" }]);
    } else if (tool.kind === "pin") {
      setItems((list) => [...list, { id, kind: "pin", x: x - PIN_SIZE / 2, y: y - PIN_SIZE / 2 }]);
    } else {
      setItems((list) => [...list, { id, kind: "sticker", x: x - STICKER_SIZE / 2, y: y - STICKER_SIZE / 2, src: tool.src }]);
    }
    setSelected(id);
    // One item per choice, as in FigJam: pick the tool again to place another
    setTool(null);
  };

  // Pressing an item selects it and starts moving it, unless it is being typed into
  const onItemDown = (e: ReactPointerEvent<HTMLDivElement>, item: Item) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setSelected(item.id);
    if (editing === item.id) return;
    // Two quick taps on a sticky note start typing, as a double click does with a mouse
    const tapped = lastTap.current;
    const now = performance.now();
    if (e.pointerType === "touch" && item.kind === "sticky" && tapped.id === item.id && now - tapped.time < 350) {
      lastTap.current = { id: -1, time: 0 };
      setEditing(item.id);
      return;
    }
    lastTap.current = { id: item.id, time: now };
    e.preventDefault();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const r = el.getBoundingClientRect();
    drag.current = { id: item.id, sx: e.clientX, sy: e.clientY, ox: item.x, oy: item.y, scale: r.width / el.offsetWidth };
  };

  const onItemMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const x = d.ox + (e.clientX - d.sx) / d.scale;
    const y = d.oy + (e.clientY - d.sy) / d.scale;
    setItems((list) => list.map((i) => (i.id === d.id ? { ...i, x, y } : i)));
  };

  const onItemUp = () => {
    drag.current = null;
  };

  const setText = (id: number, text: string) => {
    setItems((list) => list.map((i) => (i.id === id && i.kind === "sticky" ? { ...i, text } : i)));
  };

  const remove = (id: number) => {
    setItems((list) => list.filter((i) => i.id !== id));
    setSelected(null);
    setEditing(null);
  };

  const renderToolbar = (space: boolean) => (
    <div className={`${styles.toolbar} ${inter.className}`} aria-label="Tools">
      <button
        type="button"
        aria-label="Select"
        aria-pressed={mode === "arrow" && !space}
        className={styles.iconButton}
        onClick={() => {
          setMode("arrow");
          setTool(null);
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 3.5 18.5 11 12.5 13 10 19.5z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Hand"
        aria-pressed={mode === "hand" || space}
        className={styles.iconButton}
        onClick={() => {
          setMode("hand");
          setTool(null);
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5V4a1.5 1.5 0 0 1 3 0v6m0-4.5a1.5 1.5 0 0 1 3 0V13m0-2.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a5 5 0 0 1-4-2l-3-4a1.5 1.5 0 0 1 2.3-1.9L8 14.5" />
        </svg>
      </button>
      <span className={styles.divider} aria-hidden="true" />
      {STICKY_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Sticky note, ${color}`}
          aria-pressed={tool?.kind === "sticky" && tool.color === color}
          className={styles.swatch}
          style={{ background: color }}
          onClick={() => setTool((t) => (t?.kind === "sticky" && t.color === color ? null : { kind: "sticky", color }))}
        />
      ))}
      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        aria-label="Pin"
        aria-pressed={tool?.kind === "pin"}
        className={styles.iconButton}
        onClick={() => setTool((t) => (t?.kind === "pin" ? null : { kind: "pin" }))}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <path d="M8.5 3.5h7l-1 5.5 2.5 3h-10l2.5-3z" />
          <path d="M12 12v8.5" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Stickers"
        aria-pressed={showStickers}
        aria-expanded={showStickers}
        className={styles.iconButton}
        onClick={() => setShowStickers((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 4.5h15v9.5l-5.5 5.5h-9.5z" />
          <path d="M14.5 19.5V14h5.5" />
        </svg>
      </button>

      {showStickers && (
        <div className={styles.popover} role="group" aria-label="Stickers">
          <div className={styles.stickerGrid}>
            {STICKERS.map((s) => (
              <button
                key={s.src}
                type="button"
                aria-label={`Sticker ${s.src.split("/").pop()?.replace(".png", "")}`}
                aria-pressed={tool?.kind === "sticker" && tool.src === s.src}
                className={styles.stickerButton}
                onPointerDown={(e) => onStickerDown(e, s.src)}
                onPointerMove={onStickerMove}
                onPointerUp={onStickerUp}
                onPointerCancel={onStickerUp}
                onClick={() => {
                  // A drag already placed the sticker; a tap picks it to place on the next click
                  if (stickerDragged.current) return;
                  setTool({ kind: "sticker", src: s.src });
                  setShowStickers(false);
                }}
              >
                <img src={s.src} alt="" draggable={false} />
              </button>
            ))}
          </div>
          <p className={styles.credit}>
            Stickers from{" "}
            <a href="https://github.com/seanprashad/slackmoji" target="_blank" rel="noreferrer">
              slackmoji
            </a>
            . Each set is the work of its own artists.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <GroveCanvas width={width} height={height} start={start} openScale={openScale} startLabel={startLabel} toolbar={renderToolbar} handMode={mode === "hand"}>
      {children}

      {tool && (
        <div
          ref={layerRef}
          data-no-pan
          className={styles.placeLayer}
          style={{ width, height }}
          onClick={(e) => placeAt(e.clientX, e.clientY)}
          aria-label="Click the board to place the item"
        />
      )}

      {ghost && <img src={ghost.src} alt="" draggable={false} className={styles.ghost} style={{ left: ghost.x, top: ghost.y }} />}

      {items.map((item) => {
        const isSelected = selected === item.id;
        const position = { left: item.x, top: item.y };
        if (item.kind === "pin") {
          return (
            <div
              key={item.id}
              data-no-pan
              className={styles.item}
              style={{ ...position, width: PIN_SIZE, height: PIN_SIZE }}
              onPointerDown={(e) => onItemDown(e, item)}
              onPointerMove={onItemMove}
              onPointerUp={onItemUp}
              onPointerCancel={onItemUp}
            >
              <img src="/projects/grove/board/pin.png" alt="" draggable={false} className={styles.pinImage} />
              {isSelected && (
                <button type="button" className={styles.remove} aria-label="Delete pin" onClick={() => remove(item.id)}>
                  ×
                </button>
              )}
            </div>
          );
        }
        if (item.kind === "sticker") {
          return (
            <div
              key={item.id}
              data-no-pan
              className={styles.item}
              style={{ ...position, width: STICKER_SIZE, height: STICKER_SIZE }}
              onPointerDown={(e) => onItemDown(e, item)}
              onPointerMove={onItemMove}
              onPointerUp={onItemUp}
              onPointerCancel={onItemUp}
            >
              <img src={item.src} alt="" draggable={false} className={styles.pinImage} />
              {isSelected && (
                <button type="button" className={styles.remove} aria-label="Delete sticker" onClick={() => remove(item.id)}>
                  ×
                </button>
              )}
            </div>
          );
        }
        const isEditing = editing === item.id;
        return (
          <div
            key={item.id}
            data-no-pan
            className={`${styles.sticky} ${inter.className}`}
            style={{ ...position, width: STICKY_SIZE, height: STICKY_SIZE, background: item.color }}
            data-selected={isSelected ? "" : undefined}
            onPointerDown={(e) => onItemDown(e, item)}
            onPointerMove={onItemMove}
            onPointerUp={onItemUp}
            onPointerCancel={onItemUp}
            onDoubleClick={() => setEditing(item.id)}
          >
            <div
              id={`sticky-${item.id}`}
              className={styles.stickyText}
              contentEditable={isEditing}
              suppressContentEditableWarning
              data-empty={!item.text && !isEditing ? "" : undefined}
              onBlur={(e) => {
                setText(item.id, e.currentTarget.textContent ?? "");
                setEditing(null);
              }}
            >
              {item.text}
            </div>
            {isSelected && (
              <button type="button" className={styles.remove} aria-label="Delete sticky note" onClick={() => remove(item.id)}>
                ×
              </button>
            )}
          </div>
        );
      })}
    </GroveCanvas>
  );
}

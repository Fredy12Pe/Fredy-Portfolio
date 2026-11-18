"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import styles from "./HappyStickers.module.css";

gsap.registerPlugin(Draggable);

/* The HAPPY letter stickers from the earlier header (Figma Header 89:648), brought back in the
   About card. Each one peels its top back on hover and bounces while it waits, folds further when
   pressed, and can be dragged and stuck anywhere in the section it sits in. The first time they come
   into view the Y peels a little as a cue that they can be moved. */

const LETTER_STICKERS = [
  { id: "h", src: "/images/portfolio-v3/stickers/h.png", width: 1047, height: 1563, className: styles.stickerH, rotate: 5.79 },
  { id: "a", src: "/images/portfolio-v3/stickers/a.png", width: 1310, height: 1431, className: styles.stickerA, rotate: 5.65 },
  { id: "p1", src: "/images/portfolio-v3/stickers/p1.png", width: 1070, height: 1386, className: styles.stickerP1, rotate: -4.73 },
  { id: "p2", src: "/images/portfolio-v3/stickers/p2.png", width: 1135, height: 1483, className: styles.stickerP2, rotate: 5.89 },
  { id: "y", src: "/images/portfolio-v3/stickers/y.png", width: 1247, height: 1411, className: styles.stickerY, rotate: -7.4 },
] as const;

/** Maps a screen point into a dock's own coordinates, using its three probes (see StickerDock).
    Also returns the dock's on-screen rotation, so a sticker can keep its angle when it moves in. */
function toDock(dock: HTMLElement, sx: number, sy: number) {
  const at = (name: string) => {
    const r = dock.querySelector(`[data-dock-probe="${name}"]`)!.getBoundingClientRect();
    return { x: r.left, y: r.top };
  };
  const o = at("o");
  const xp = at("x");
  const yp = at("y");
  const w = dock.offsetWidth || 1;
  const h = dock.offsetHeight || 1;
  const ex = { x: (xp.x - o.x) / w, y: (xp.y - o.y) / w };
  const ey = { x: (yp.x - o.x) / h, y: (yp.y - o.y) / h };
  const det = ex.x * ey.y - ex.y * ey.x || 1;
  const dx = sx - o.x;
  const dy = sy - o.y;
  return {
    x: (dx * ey.y - dy * ey.x) / det,
    y: (ex.x * dy - ex.y * dx) / det,
    angle: (Math.atan2(ex.y, ex.x) * 180) / Math.PI,
  };
}

const HOVER_PEEL = 46;
const PRESS_PEEL = 62;

type LetterPeelProps = {
  className: string;
  src: string;
  width: number;
  height: number;
  rotate: number;
  /** This sticker peels slightly after the set lands, as a cue that it can be moved */
  hint: boolean;
};

/**
 * Growing fold: --peel is a percent. The face clips back from the top and the pale underside
 * flap grows to the same size.
 */
function LetterPeel({ className, src, width, height, rotate, hint }: LetterPeelProps) {
  return (
    <div
      className={`${styles.sticker} ${styles.letterPeel} ${className}`}
      data-letter-peel
      data-peel-hint={hint ? "true" : undefined}
      role="button"
      aria-label="Move sticker"
    >
      <div className={styles.peelEnter}>
        <div className={styles.peelTilt} style={{ rotate: `${rotate}deg` }}>
          <div className={styles.peelHop}>
            <div className={styles.peelMain}>
              <Image className={styles.peelFace} src={src} alt="" width={width} height={height} priority unoptimized />
            </div>
            <div className={styles.peelFlap} aria-hidden>
              <Image className={styles.peelFlapImg} src={src} alt="" width={width} height={height} unoptimized />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HappyStickers() {
  const rootRef = useRef<HTMLDivElement>(null);

  // The first time the row is mostly on screen, the Y peels a little as a cue that they move
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        root.dispatchEvent(new Event("stickersplaced"));
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Peel, bounce and drag
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // They can be placed anywhere in the section they belong to
    const bounds = root.closest("section") ?? root.parentElement ?? root;
    const peels = root.querySelectorAll<HTMLElement>("[data-letter-peel]");
    const cleanups: Array<() => void> = [];
    let stack = 20;

    peels.forEach((peel) => {
      let hovering = false;
      let pressed = false;
      let dragging = false;
      let moved = false;
      // After a drag, ignore hover until the pointer leaves and comes back
      let suppress = false;
      const hopEl = peel.querySelector<HTMLElement>(`.${styles.peelHop}`);
      let intro: gsap.core.Timeline | null = null;
      let hop: gsap.core.Timeline | null = null;
      let peelTween: gsap.core.Tween | null = null;
      gsap.set(peel, { "--peel": 0 });

      const stopBounce = (immediate = false) => {
        hop?.kill();
        hop = null;
        if (!hopEl) return;
        if (immediate) {
          gsap.set(hopEl, { y: 0 });
          return;
        }
        gsap.to(hopEl, { y: 0, duration: 0.22, ease: "power2.out", overwrite: "auto" });
      };

      const startBounce = () => {
        if (reduced || !hopEl || !hovering || pressed || dragging || suppress) return;
        hop?.kill();
        hop = gsap.timeline({ repeat: -1, repeatDelay: 0.28 });
        hop
          .to(hopEl, { y: -12, duration: 0.22, ease: "power2.out" })
          .to(hopEl, { y: 0, duration: 0.42, ease: "bounce.out" });
      };

      const go = (amount: number) => {
        const current = parseFloat(gsap.getProperty(peel, "--peel") as string) || 0;
        peelTween?.kill();
        peelTween = gsap.to(peel, {
          "--peel": amount,
          duration: reduced || Math.abs(current - amount) < 0.5 ? 0 : 0.9,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            peelTween = null;
            if (amount === 0) delete peel.dataset.peelActive;
            if (amount === HOVER_PEEL) startBounce();
          },
        });
      };

      // Same close as hovering off: the fold eases shut instead of snapping
      const foldShut = () => {
        stopBounce();
        go(0);
      };

      const cancelIntro = () => {
        intro?.kill();
        intro = null;
      };

      // The hint sticker folds a little once the set has landed, then lays flat again.
      // Hovering or grabbing cancels it.
      if (peel.dataset.peelHint === "true" && !reduced) {
        intro = gsap.timeline({ paused: true, delay: 0.22 });
        intro
          .call(() => {
            peel.dataset.peelActive = "true";
          })
          .to(peel, { "--peel": 22, duration: 0.7, ease: "power2.inOut" })
          .to(peel, { "--peel": 0, duration: 0.8, ease: "power2.inOut" }, "+=0.4")
          .call(() => {
            delete peel.dataset.peelActive;
          });
        const playHint = () => intro?.play();
        root.addEventListener("stickersplaced", playHint);
        cleanups.push(() => root.removeEventListener("stickersplaced", playHint));
      }

      const enter = () => {
        cancelIntro();
        hovering = true;
        if (suppress || moved) return;
        peel.dataset.peelActive = "true";
        stopBounce(true);
        go(pressed ? PRESS_PEEL : HOVER_PEEL);
      };

      const leave = () => {
        if (dragging) return;
        hovering = false;
        pressed = false;
        suppress = false;
        moved = false;
        foldShut();
      };

      const down = () => {
        unstick();
        cancelIntro();
        stopBounce(true);
        pressed = true;
        peel.dataset.peelActive = "true";
        go(PRESS_PEEL);
      };

      const up = () => {
        if (!pressed) return;
        pressed = false;
        // Placing it plays the same fold-shut as hovering off. A click with no move returns to the hover peel.
        if (moved || suppress) {
          foldShut();
          return;
        }
        go(hovering ? HOVER_PEEL : 0);
      };

      peel.addEventListener("pointerenter", enter);
      peel.addEventListener("pointerleave", leave);
      peel.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);

      /* Moves the sticker into a dock, keeping where it is on screen. Its size came from the row,
         so that is fixed first and stays the same wherever it goes. */
      const moveInto = (dock: HTMLElement, rotation: number) => {
        const r = peel.getBoundingClientRect();
        const width = peel.offsetWidth;
        const height = peel.offsetHeight;
        const spot = toDock(dock, r.left + r.width / 2, r.top + r.height / 2);
        peel.style.width = `${width}px`;
        peel.style.marginRight = "0";
        peel.style.position = "absolute";
        peel.style.left = `${spot.x - width / 2}px`;
        peel.style.top = `${spot.y - height / 2}px`;
        if (peel.parentElement !== dock) dock.appendChild(peel);
        gsap.set(peel, { x: 0, y: 0, rotation });
        drag.update();
        return spot;
      };

      const docks = () => {
        const section = root.closest("section");
        return {
          surface: section?.querySelector<HTMLElement>("[data-sticker-surface]") ?? null,
          camera: section?.querySelector<HTMLElement>('[data-sticker-dock="camera"]') ?? null,
          free: section?.querySelector<HTMLElement>('[data-sticker-dock="free"]') ?? null,
        };
      };
      const rotationOf = () => Number(gsap.getProperty(peel, "rotation")) || 0;

      /* Dropped on the camera, the sticker moves into the camera's dock and rides along with its
         tilt and shuffle. Dropped anywhere else in the section, it moves into the free layer. */
      const place = (px: number, py: number) => {
        const { surface, camera, free } = docks();
        const s = surface?.getBoundingClientRect();
        const onCamera = !!s && px >= s.left && px <= s.right && py >= s.top && py <= s.bottom;
        if (onCamera && camera) {
          // Keep the angle it shows on screen, net of the camera's own tilt
          const angle = toDock(camera, 0, 0).angle;
          moveInto(camera, rotationOf() - angle);
        } else if (free) {
          moveInto(free, rotationOf());
        }
      };

      /* Picked up off the camera: it comes out into the free layer first, keeping its look on
         screen, so the camera settling back while it is dragged does not pull it along. */
      const unstick = () => {
        const { camera, free } = docks();
        if (!camera || !free || peel.parentElement !== camera) return;
        const angle = toDock(camera, 0, 0).angle;
        moveInto(free, rotationOf() + angle);
      };

      const drag = Draggable.create(peel, {
        type: "x,y",
        bounds: bounds,
        minimumMovement: 3,
        onPress() {
          stack += 1;
          gsap.set(peel, { zIndex: stack });
          peel.dataset.lifted = "true";
          if (!reduced) gsap.to(peel, { scale: 1.06, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        },
        onDragStart() {
          dragging = true;
          moved = true;
        },
        onRelease() {
          // pointerX/Y are page coordinates
          if (moved) place(this.pointerX - window.scrollX, this.pointerY - window.scrollY);
          dragging = false;
          delete peel.dataset.lifted;
          const stillOver = peel.matches(":hover");
          hovering = stillOver;
          pressed = false;
          if (moved) {
            suppress = stillOver;
            moved = false;
            foldShut();
          } else if (!stillOver) {
            foldShut();
          }
          if (!reduced) gsap.to(peel, { scale: 1, duration: 0.28, ease: "power2.out", overwrite: "auto" });
        },
      })[0];

      cleanups.push(() => {
        peel.removeEventListener("pointerenter", enter);
        peel.removeEventListener("pointerleave", leave);
        peel.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
        drag.kill();
        intro?.kill();
        hop?.kill();
        gsap.killTweensOf(peel);
        if (hopEl) gsap.killTweensOf(hopEl);
        delete peel.dataset.peelActive;
        delete peel.dataset.lifted;
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className={styles.stickerGroup}>
      <div ref={rootRef} className={styles.letterStickers}>
        {LETTER_STICKERS.map((sticker) => (
          <LetterPeel
            key={sticker.id}
            className={sticker.className}
            src={sticker.src}
            width={sticker.width}
            height={sticker.height}
            rotate={sticker.rotate}
            hint={sticker.id === "y"}
          />
        ))}
      </div>
      <p className={styles.caption}>Psst, these stickers peel off. Drag them anywhere around here.</p>
    </div>
  );
}

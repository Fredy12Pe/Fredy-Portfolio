"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./MagneticFilings.module.css";

/** Spacing between filing centers. */
const GAP = 28;
/** Drawn segment length. */
const LENGTH = 14;
const STROKE = 2;
/** Base stroke — stays quiet behind cards / dial. */
const STROKE_STYLE = "rgba(230, 230, 230, 0.14)";
/** How quickly filings ease toward the pointer angle. */
const ANGLE_LERP = 0.14;
/** Soft falloff: filings farther from the pointer are dimmer. */
const PROXIMITY = 480;

type Filing = { x: number; y: number; angle: number };

export default function MagneticFilings() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filingsRef = useRef<Filing[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const build = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: width, h: height };

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / GAP) + 1;
      const rows = Math.ceil(height / GAP) + 1;
      const offsetX = (width - (cols - 1) * GAP) / 2;
      const offsetY = (height - (rows - 1) * GAP) / 2;

      const next: Filing[] = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          next.push({
            x: offsetX + col * GAP,
            y: offsetY + row * GAP,
            angle: -Math.PI / 2,
          });
        }
      }
      filingsRef.current = next;

      if (!pointerRef.current.active) {
        pointerRef.current.x = width * 0.5;
        pointerRef.current.y = height * 0.42;
      }
    };

    const shortestAngleDelta = (from: number, to: number) => {
      let d = to - from;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = STROKE_STYLE;
      ctx.lineWidth = STROKE;
      ctx.lineCap = "round";

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const half = LENGTH / 2;
      const filings = filingsRef.current;

      for (let i = 0; i < filings.length; i++) {
        const f = filings[i];
        const dx = px - f.x;
        const dy = py - f.y;
        const target = Math.atan2(dy, dx);

        if (!reduced) {
          f.angle += shortestAngleDelta(f.angle, target) * ANGLE_LERP;
        }

        const dist = Math.hypot(dx, dy);
        const proximity = 1 - Math.min(dist / PROXIMITY, 1);
        const alpha = 0.07 + proximity * 0.12;
        ctx.globalAlpha = alpha;

        const cos = Math.cos(f.angle);
        const sin = Math.sin(f.angle);
        ctx.beginPath();
        ctx.moveTo(f.x - cos * half, f.y - sin * half);
        ctx.lineTo(f.x + cos * half, f.y + sin * half);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    build();
    draw();

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(wrap);

    // Track pointer on the section (parent), since this layer is pointer-events: none.
    const host = wrap.parentElement ?? wrap;
    if (!reduced) {
      host.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave);
      gsap.ticker.add(draw);
    }

    return () => {
      ro.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      gsap.ticker.remove(draw);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={styles.filings}
      aria-hidden
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

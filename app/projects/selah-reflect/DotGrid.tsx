"use client";

import { useRef, useEffect, useCallback, useMemo, CSSProperties } from "react";
import { gsap } from "gsap";
import styles from "./DotGrid.module.css";

type DotGridProps = {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  baseAlpha?: number;
  activeAlpha?: number;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  returnDuration?: number;
  className?: string;
  style?: CSSProperties;
};

const throttleMouse = (func: (e: MouseEvent) => void, limit: number) => {
  let lastCall = 0;
  return function (e: MouseEvent) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(e);
    }
  };
};

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

export default function DotGrid({
  dotSize = 16,
  gap = 32,
  baseColor = "#5227FF",
  activeColor = "#5227FF",
  baseAlpha = 0.08,
  activeAlpha = 0.45,
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  returnDuration = 1.5,
  className = "",
  style,
}: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Array<{ cx: number; cy: number; xOffset: number; yOffset: number; _anim?: gsap.core.Tween | null; _return?: gsap.core.Tween | null }>>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !("Path2D" in window)) return null as unknown as Path2D | null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p as Path2D;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Array<{ cx: number; cy: number; xOffset: number; yOffset: number; _anim?: gsap.core.Tween | null; _return?: gsap.core.Tween | null }> = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0 });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId: number;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        // color + alpha lerp with a subtle center boost
        let style = baseColor;
        let alpha = baseAlpha;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity; // 0..1
          const boost = Math.pow(t, 1.15);
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * boost);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * boost);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * boost);
          style = `rgb(${r},${g},${b})`;
          alpha = baseAlpha + (activeAlpha - baseAlpha) * boost;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = style;
        ctx.fill(circlePath as Path2D);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath, baseAlpha, activeAlpha]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if (typeof window !== "undefined") {
      if ("ResizeObserver" in window) {
        ro = new ResizeObserver(buildGrid);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
      } else {
        (window as Window & typeof globalThis).addEventListener(
          "resize",
          buildGrid as unknown as EventListener
        );
      }
    }
    return () => {
      if (ro) ro.disconnect();
      else if (typeof window !== "undefined")
        (window as Window & typeof globalThis).removeEventListener(
          "resize",
          buildGrid as unknown as EventListener
        );
    };
  }, [buildGrid, dotSize, gap]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity) {
          dot._anim?.kill();
          dot._return?.kill();

          // Softer, distance-weighted influence with strict clamping
          const closeness = Math.max(0, 1 - dist / proximity); // 0..1
          const influence = closeness * 0.18; // softer
          let pushX = (dot.cx - pr.x) * influence + vx * 0.0008;
          let pushY = (dot.cy - pr.y) * influence + vy * 0.0008;
          const maxOffset = Math.min(gap * 0.35, dotSize * 0.9);
          const mag = Math.hypot(pushX, pushY);
          if (mag > maxOffset && mag > 0) {
            const s = maxOffset / mag;
            pushX *= s;
            pushY *= s;
          }

          dot._anim = gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
              dot._return = gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
            },
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius) {
          dot._anim?.kill();
          dot._return?.kill();
          const falloff = Math.max(0, 1 - dist / shockRadius);
          let pushX = (dot.cx - cx) * shockStrength * falloff * 0.2;
          let pushY = (dot.cy - cy) * shockStrength * falloff * 0.2;
          const maxClickOffset = Math.min(gap * 0.6, dotSize * 1.2);
          const m = Math.hypot(pushX, pushY);
          if (m > maxClickOffset && m > 0) {
            const s = maxClickOffset / m;
            pushX *= s;
            pushY *= s;
          }
          dot._anim = gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              dot._return = gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
            },
          });
        }
      }
    };

    const throttledMove = throttleMouse(onMove, 50);
    window.addEventListener("mousemove", throttledMove as EventListener, { passive: true } as AddEventListenerOptions);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", throttledMove as EventListener);
      window.removeEventListener("click", onClick);
    };
  }, [maxSpeed, speedTrigger, proximity, returnDuration, shockRadius, shockStrength]);

  return (
    <section className={`${styles.dotGrid} ${className}`} style={style}>
      <div ref={wrapperRef} className={styles.dotGridWrap}>
        <canvas ref={canvasRef} className={styles.dotGridCanvas} />
      </div>
    </section>
  );
}



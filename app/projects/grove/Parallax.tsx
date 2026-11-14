"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

// Mouse parallax for the hero. The area sets two values (-1 to 1) from the cursor's position,
// and each layer moves a little with them, by its own depth. It only runs for a mouse on a
// screen that is not reduced-motion, and it eases back to rest when the cursor leaves.

export function ParallaxArea({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const set = (mx: number, my: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", String(mx));
    el.style.setProperty("--my", String(my));
  };

  // The hero picture is drawn at the 1320px design width; --s scales it down to fit a narrower card
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--s", String(Math.min(1, el.clientWidth / 1320)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => set(0, 0)}
    >
      {children}
    </div>
  );
}

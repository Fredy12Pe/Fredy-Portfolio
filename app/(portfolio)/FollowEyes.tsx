"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "motion/react";
import styles from "./FollowEyes.module.css";

/* Two eyes whose pupils follow the cursor anywhere on the page, from Framer's "Eye Follow Button"
   (FollowEyes): each pupil leans toward the pointer, up to 90% of the way to the eye's edge, on a
   soft spring (stiffness 100, damping 20). Pupils rest in the middle on touch screens and with
   reduced motion. Sizes come from CSS, so the eyes scale with whatever they sit in. */

const RANGE = 0.9;
const SPRING = { stiffness: 100, damping: 20 };

function Eye({ px, py }: { px: MotionValue<number>; py: MotionValue<number> }) {
  return (
    <span className={styles.eye}>
      <motion.span className={styles.pupil} style={{ x: px, y: py }} />
    </span>
  );
}

export default function FollowEyes({ className }: { className?: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const left = { x: useSpring(lx, SPRING), y: useSpring(ly, SPRING) };
  const right = { x: useSpring(rx, SPRING), y: useSpring(ry, SPRING) };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets: [MotionValue<number>, MotionValue<number>][] = [
      [lx, ly],
      [rx, ry],
    ];
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const eyes = rootRef.current?.children;
      if (!eyes) return;
      targets.forEach(([tx, ty], i) => {
        const eye = eyes[i] as HTMLElement | undefined;
        const pupil = eye?.firstElementChild as HTMLElement | null | undefined;
        if (!eye || !pupil) return;
        const box = eye.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance === 0) {
          tx.set(0);
          ty.set(0);
          return;
        }
        const reach = Math.min(distance, ((box.width - pupil.offsetWidth) / 2) * RANGE);
        tx.set((dx / distance) * reach);
        ty.set((dy / distance) * reach);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [lx, ly, rx, ry]);

  return (
    <span ref={rootRef} className={`${styles.eyes} ${className ?? ""}`} aria-hidden>
      <Eye px={left.x} py={left.y} />
      <Eye px={right.x} py={right.y} />
    </span>
  );
}

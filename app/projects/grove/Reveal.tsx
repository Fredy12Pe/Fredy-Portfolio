"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

// Fades a block in as it scrolls into view, sliding from the side or rising from below.
// It plays once, and not at all for people who ask their device to reduce motion.
type From = "up" | "left" | "right";

const START: Record<From, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
};

export function RevealBlock({
  as = "div",
  from = "up",
  delay = 0,
  mount = false,
  className,
  style,
  children,
}: {
  as?: "div" | "li" | "section" | "p";
  from?: From;
  delay?: number;
  mount?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const start = START[from];
  const timing = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay };
  // "mount" plays on page load (for the hero); otherwise it plays once when the block scrolls into view
  const motionProps = mount
    ? { initial: reduce ? false : { opacity: 0, x: start.x, y: start.y }, animate: { opacity: 1, x: 0, y: 0 }, transition: timing }
    : { initial: reduce ? false : { opacity: 0, x: start.x, y: start.y }, whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: timing };
  const common = { className, style, ...motionProps };

  if (as === "p") return <motion.p {...common}>{children}</motion.p>;
  if (as === "li") return <motion.li {...common}>{children}</motion.li>;
  if (as === "section") return <motion.section {...common}>{children}</motion.section>;
  return <motion.div {...common}>{children}</motion.div>;
}

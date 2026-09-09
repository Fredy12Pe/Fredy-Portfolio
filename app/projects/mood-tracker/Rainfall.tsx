"use client";

import { motion } from "framer-motion";
import { loopTimes } from "./motion";

type Drop = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const DROPS: Drop[] = [
  { left: 18, top: -36, width: 4, height: 14 },
  { left: 46, top: -50, width: 3, height: 21 },
  { left: 73, top: -64, width: 3, height: 28 },
  { left: 101, top: -78, width: 3, height: 20 },
  { left: 129, top: -92, width: 3, height: 27 },
  { left: 157, top: -36, width: 4, height: 19 },
  { left: 185, top: -50, width: 3, height: 26 },
  { left: 213, top: -64, width: 3, height: 18 },
  { left: 241, top: -78, width: 3, height: 25 },
  { left: 269, top: -92, width: 3, height: 17 },
  { left: 297, top: -36, width: 4, height: 24 },
  { left: 325, top: -50, width: 3, height: 16 },
  { left: 353, top: -64, width: 3, height: 23 },
  { left: 381, top: -78, width: 3, height: 15 },
  { left: 409, top: -92, width: 3, height: 22 },
  { left: 32, top: -36, width: 4, height: 14 },
  { left: 60, top: -50, width: 3, height: 21 },
  { left: 88, top: -64, width: 3, height: 28 },
  { left: 116, top: -78, width: 3, height: 20 },
  { left: 144, top: -92, width: 3, height: 27 },
  { left: 172, top: -36, width: 4, height: 19 },
  { left: 200, top: -50, width: 3, height: 26 },
  { left: 228, top: -64, width: 3, height: 18 },
  { left: 256, top: -78, width: 3, height: 25 },
  { left: 284, top: -92, width: 3, height: 17 },
  { left: 312, top: -36, width: 4, height: 24 },
  { left: 340, top: -50, width: 3, height: 16 },
  { left: 368, top: -64, width: 3, height: 23 },
  { left: 396, top: -78, width: 3, height: 15 },
  { left: 424, top: -92, width: 3, height: 22 },
  { left: 25, top: -36, width: 4, height: 14 },
  { left: 54, top: -50, width: 3, height: 21 },
  { left: 82, top: -64, width: 3, height: 28 },
  { left: 110, top: -78, width: 3, height: 20 },
  { left: 138, top: -92, width: 3, height: 27 },
  { left: 166, top: -36, width: 4, height: 19 },
  { left: 194, top: -50, width: 3, height: 26 },
  { left: 222, top: -64, width: 3, height: 18 },
  { left: 250, top: -78, width: 3, height: 25 },
  { left: 278, top: -92, width: 3, height: 17 },
  { left: 306, top: -36, width: 4, height: 24 },
  { left: 334, top: -50, width: 3, height: 16 },
  { left: 362, top: -64, width: 3, height: 23 },
  { left: 390, top: -78, width: 3, height: 15 },
  { left: 418, top: -92, width: 3, height: 22 },
  { left: 40, top: -36, width: 4, height: 14 },
  { left: 150, top: -50, width: 3, height: 21 },
  { left: 300, top: -64, width: 3, height: 28 },
];

const FIRST_PASS = [
  { x: 0, y: 90, drift: 10, end: 697.674 },
  { x: 2, y: 128, drift: 13, end: 609.302 },
  { x: 4, y: 166, drift: 16, end: 520.93 },
  { x: 0, y: 204, drift: 19, end: 432.558 },
  { x: 2, y: 242, drift: 10, end: 344.186 },
  { x: 4, y: 280, drift: 13, end: 255.814 },
  { x: 0, y: 318, drift: 16, end: 167.442 },
  { x: 2, y: 356, drift: 19, end: 79.07 },
];

function dropMotion(index: number) {
  const first = FIRST_PASS[index];
  if (first) {
    const end = first.end / 4000;
    return {
      initial: { opacity: 0.72, x: first.x, y: first.y },
      animate: {
        opacity: [0.72, 0.68, 0, 0],
        x: [first.x, first.drift, first.drift],
        y: [first.y, 390, 390],
      },
      transition: {
        opacity: loopTimes(4, [0, Math.max(50, first.end - 120) / 4000, end, 1], [[0.5, 0, 0.5, 1], "easeIn", "linear"]),
        x: loopTimes(4, [0, end, 1], [[0.25, 0.1, 0.25, 1], "linear"]),
        y: loopTimes(4, [0, end, 1], [[0.25, 0.1, 0.25, 1], "linear"]),
      },
    };
  }

  const startMs = 40 + (index - FIRST_PASS.length) * 90;
  const endMs = Math.min(startMs + 780 + ((index - FIRST_PASS.length) % 4) * 40, 4000);
  const drift = 9 + (((index - 10) % 5 + 5) % 5) * 2;
  const fadeStartMs = Math.min(endMs - 120, 3880);
  const completesBeforeLoop = endMs < 4000;

  return {
    initial: { opacity: 0, x: 0, y: 0 },
    animate: {
      opacity: completesBeforeLoop ? [0, 0, 0.8, 0.7, 0, 0] : [0, 0, 0.8, 0.7, 0],
      x: completesBeforeLoop ? [0, 0, drift, drift] : [0, 0, drift],
      y: completesBeforeLoop ? [0, 0, 390, 390] : [0, 0, 390],
    },
    transition: {
      opacity: loopTimes(
        4,
        completesBeforeLoop
          ? [0, startMs / 4000, (startMs + 80) / 4000, fadeStartMs / 4000, endMs / 4000, 1]
          : [0, startMs / 4000, (startMs + 80) / 4000, fadeStartMs / 4000, 1],
        completesBeforeLoop
          ? ["linear", "easeOut", [0.5, 0, 0.5, 1], "easeIn", "linear"]
          : ["linear", "easeOut", [0.5, 0, 0.5, 1], "easeIn"],
      ),
      x: loopTimes(
        4,
        completesBeforeLoop ? [0, startMs / 4000, endMs / 4000, 1] : [0, startMs / 4000, 1],
        completesBeforeLoop ? ["linear", [0.25, 0.1, 0.25, 1], "linear"] : ["linear", [0.25, 0.1, 0.25, 1]],
      ),
      y: loopTimes(
        4,
        completesBeforeLoop ? [0, startMs / 4000, endMs / 4000, 1] : [0, startMs / 4000, 1],
        completesBeforeLoop ? ["linear", [0.25, 0.1, 0.25, 1], "linear"] : ["linear", [0.25, 0.1, 0.25, 1]],
      ),
    },
  };
}

export default function Rainfall({ reduced }: { reduced?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 159,
        width: 440,
        height: 430,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {DROPS.map((drop, i) => {
        if (reduced) {
          return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: drop.left,
              top: 80 + (i % 7) * 40,
              width: drop.width,
              height: drop.height,
              borderRadius: 2,
              background: "rgba(168,214,255,0.55)",
            }}
          />
          );
        }

        const rain = dropMotion(i);
        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: drop.left,
              top: drop.top,
              width: drop.width,
              height: drop.height,
              borderRadius: 2,
              background: "rgba(168,214,255,0.82)",
            }}
            initial={rain.initial}
            animate={rain.animate}
            transition={rain.transition}
          />
        );
      })}
    </div>
  );
}

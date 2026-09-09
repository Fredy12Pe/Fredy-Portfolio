"use client";

import { motion } from "framer-motion";
import { loopTimes } from "./motion";

type SunBurstProps = {
  reduced?: boolean;
  color: string;
  left: number;
  top: number;
  disc: { left: number; top: number; size: number; src: string };
  rayWidth?: number;
  rayLength?: number;
  raySpan?: number;
};

const RAY_ANGLES = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5];

export default function SunBurst({
  reduced,
  color,
  left,
  top,
  disc,
  rayWidth = 6,
  rayLength = 36,
  raySpan = 184,
}: SunBurstProps) {
  const cx = disc.left + disc.size / 2 - left;
  const cy = disc.top + disc.size / 2 - top;
  const rayRadius = raySpan / 2;

  const sun = (
    <div style={{ position: "absolute", left, top, width: Math.max(220, raySpan), height: Math.max(220, raySpan), pointerEvents: "none" }}>
      {RAY_ANGLES.map((angle) => (
        <div
          key={angle}
          style={{
            position: "absolute",
            left: cx - rayWidth / 2,
            top: cy - rayRadius,
            width: rayWidth,
            height: raySpan,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: rayWidth,
              height: rayLength,
              borderRadius: 80,
              background: color,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: rayWidth,
              height: rayLength,
              borderRadius: 80,
              background: color,
            }}
          />
        </div>
      ))}
      <img
        alt=""
        src={disc.src}
        draggable={false}
        style={{
          position: "absolute",
          left: disc.left - left,
          top: disc.top - top,
          width: disc.size,
          height: disc.size,
          display: "block",
        }}
      />
    </div>
  );

  if (reduced) return sun;

  return (
    <motion.div
      initial={{ x: 190, y: -190 }}
      animate={{ x: [190, 0, 0], y: [-190, 0, 0] }}
      transition={loopTimes(9.6, [0, 0.3646, 1], ["easeInOut", "linear"])}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {sun}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { loopTimes } from "../motion";
import { Layer, asset, box, inset } from "../primitives";

export default function Tired({ reduced }: { reduced?: boolean }) {
  const mouthClipId = useId();

  const twinkle = (delay: number, rest = 0.72) => ({
    animate: reduced ? undefined : { opacity: [0, 0, 1, 0.32, 1, 0.45, 1, rest] },
    transition: loopTimes(4.8, [0, delay, delay + 0.07, delay + 0.26, delay + 0.37, delay + 0.53, delay + 0.65, 1]),
  });

  return (
    <>
      <Layer name="td-star-1" {...inset(4.08, 37.95, 89.12, 48.18)} reduced={reduced} animate={reduced ? undefined : { opacity: [0, 1, 1], y: [150, 0, 0] }} transition={{ opacity: loopTimes(4.8, [0, 0.0458, 1], ["easeOut", "linear"]), y: loopTimes(4.8, [0, 0.2188, 1], [[0.16, 1, 0.3, 1], "linear"]) }} />
      <Layer name="td-star-2" {...box(332, 92, 13, 15)} reduced={reduced} {...twinkle(0.1)} />
      <Layer name="td-star-3" {...inset(10.15, 85.23, 88.49, 12.27)} reduced={reduced} {...twinkle(0.1156, 0.86)} />
      <Layer name="td-star-4" {...box(184, 138, 10, 12)} reduced={reduced} {...twinkle(0.1313, 1)} />
      <Layer name="td-star-5" {...box(141, 98, 10, 12)} reduced={reduced} {...twinkle(0.1469)} />
      <Layer name="td-star-6" {...box(11, 126, 10, 12)} reduced={reduced} {...twinkle(0.1625, 0.86)} />
      {([
        [110, 124, 0.1781, 1],
        [288, 120, 0.1938, 0.72],
        [185, 92, 0.2094, 0.86],
        [371, 128, 0.225, 1],
        [414, 150, 0.2406, 0.72],
      ] as const).map(([l, t, d, rest], i) => (
        <Layer key={i} name={`td-dot-${i + 1}`} {...box(l, t, 4, 4)} reduced={reduced} {...twinkle(d, rest)} />
      ))}
      <motion.div
        style={{ position: "absolute", left: 0, top: 145, width: 440, height: 811, transformOrigin: "center top" }}
        animate={reduced ? undefined : { scaleX: [1, 1.006, 1.006, 0.997, 1], scaleY: [1, 1.012, 1.012, 0.995, 1], x: [0, -1.32, -1.32, 0.66, 0], y: [0, -10.25, -10.25, 4.25, 0] }}
        transition={loopTimes(4.8, [0, 0.375, 0.4375, 0.7708, 1], ["easeInOut", "linear", [0.16, 1, 0.3, 1], [0.4, 0, 0.2, 1]])}
      >
        <img alt="" src={asset("td-body")} draggable={false} style={{ width: "100%", height: "100%" }} />
        <motion.div
          style={{
            position: "absolute",
            left: 126,
            top: 112,
            width: 188,
            height: 89.267,
            clipPath: "inset(0 0 0 0)",
          }}
          animate={
            reduced
              ? undefined
              : {
                  clipPath: [
                    "inset(4.793px 0 0 0)",
                    "inset(10.793px 0 0 0)",
                    "inset(10.793px 0 0 0)",
                    "inset(42.793px 0 0 0)",
                    "inset(42.793px 0 0 0)",
                    "inset(4.793px 0 0 0)",
                  ],
                }
          }
          transition={loopTimes(4.8, [0, 0.375, 0.4375, 0.616680625, 0.7708333333, 1], ["easeInOut", "linear", [0.4, 0, 0.2, 1], "linear", [0.4, 0, 0.2, 1]])}
        >
          <img alt="" src={asset("td-eye")} draggable={false} style={{ position: "absolute", left: 0, top: 0, width: 94, height: 89.267 }} />
          <img alt="" src={asset("td-eye")} draggable={false} style={{ position: "absolute", left: 94, top: 0, width: 94, height: 89.267 }} />
        </motion.div>
        <div style={{ position: "absolute", left: 166, top: 237, width: 108, height: 103 }}>
          <svg width="108" height="103" viewBox="0 0 108 103" style={{ display: "block", overflow: "visible", pointerEvents: "none" }}>
            <defs>
              <clipPath id={mouthClipId} clipPathUnits="userSpaceOnUse">
                <motion.ellipse
                  cx={54}
                  cy={51.281}
                  rx={54}
                  ry={51.281}
                  animate={
                    reduced
                      ? undefined
                      : {
                          rx: [36.72, 31.32, 31.32, 56.7, 36.72],
                          ry: [34.871, 29.743, 29.743, 53.845, 34.871],
                          cy: [51.281, 45.281, 45.281, 56.281, 51.281],
                        }
                  }
                  transition={{
                    rx: loopTimes(4.8, [0, 0.375, 0.4375, 0.625, 1]),
                    ry: loopTimes(4.8, [0, 0.375, 0.4375, 0.625, 1]),
                    cy: loopTimes(4.8, [0, 0.375, 0.4375, 0.6667, 1]),
                  }}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${mouthClipId})`}>
              <rect x="-4" y="-4" width="116" height="111" fill="#000" />
              <image href={asset("td-tooth-1")} x="22" y="-17" width="29" height="47" />
              <image href={asset("td-tooth-2")} x="53" y="-17" width="29" height="47" />
              <image href={asset("td-tongue")} x="18" y="63" width="67" height="67" />
            </g>
          </svg>
        </div>
        <Layer name="td-freckles" {...box(339, 237, 39, 28)} reduced={reduced} />
        <Layer name="td-freckles" {...box(59, 237, 39, 28)} reduced={reduced} />
      </motion.div>
    </>
  );
}

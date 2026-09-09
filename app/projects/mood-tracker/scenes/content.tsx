"use client";

import { motion } from "framer-motion";
import { loop, loopTimes } from "../motion";
import { Layer, asset, box, inset } from "../primitives";

export default function Content({ reduced }: { reduced?: boolean }) {
  return (
    <>
      <motion.div
        style={{ position: "absolute", inset: 0, background: "#5d8961" }}
        animate={reduced ? undefined : { background: ["#5D8961", "#649069", "#5D8961", "#56815B", "#5D8961"] }}
        transition={loopTimes(9.6, [0, 0.25, 0.5, 0.75, 1], "easeInOut")}
      />
      <Layer name="ct-leaf-1" {...inset(29.29, -21.59, 31.28, 81.59)} reduced={reduced} animate={reduced ? undefined : { rotate: [0, 1.5, 0, -1.5, 0], x: [0, -9, 2, 10, 0], y: [0, -14, -3, 9, 0] }} transition={loop(9.6)} />
      <Layer name="ct-leaf-2" {...inset(10.15, -10.95, 66.1, 59.32)} reduced={reduced} flipX rotate={47.47} animate={reduced ? undefined : { x: [0, 12, 1, -10, 0], y: [0, -8, -2, 7, 0] }} transition={loop(9.6)} />
      <Layer name="ct-leaf-3" {...inset(7.83, 71.19, 71.62, -16.03)} reduced={reduced} rotate={-105} animate={reduced ? undefined : { x: [0, -12, -1, 10, 0], y: [0, 8, 2, -7, 0] }} transition={loop(9.6)} />
      <Layer name="ct-leaf-4" {...inset(24.58, 62.96, 45.24, -32.95)} reduced={reduced} animate={reduced ? undefined : { rotate: [0, -1.8, 0, 1.8, 0], x: [0, 10, 1, -9, 0], y: [0, -11, -2, 10, 0] }} transition={loop(9.6)} />
      <motion.div
        style={{ position: "absolute", left: -13, top: 121, width: 465, height: 859, transformOrigin: "50% 65%" }}
        animate={reduced ? undefined : { scaleX: [1, 1.006, 1], scaleY: [1, 1.012, 1], y: [0, -8, 0] }}
        transition={loop(6.4, [0.45, 0, 0.55, 1])}
      >
        <motion.div
          style={{ position: "absolute", inset: 0, transformOrigin: "50% 103px" }}
          animate={reduced ? undefined : { scaleX: [1, 1.008, 1], scaleY: [1, 1.018, 1], y: [0, -2.5, 0] }}
          transition={loop(6.4, [0.45, 0, 0.55, 1])}
        >
          <Layer name="ct-ear" {...box(257, 0, 103, 103)} reduced={reduced} />
          <Layer name="ct-ear" {...box(94, 0, 103, 103)} reduced={reduced} />
        </motion.div>
        <Layer name="ct-body" {...box(0, 19, 465, 840)} reduced={reduced} />
        <motion.div
          style={{
            position: "absolute",
            left: 139,
            top: 114,
            width: 188,
            height: 89.267,
            clipPath: "inset(0 0 0 0)",
          }}
          animate={
            reduced
              ? undefined
              : {
                  clipPath: [
                    "inset(0 0 0 0)",
                    "inset(36px 0 0 0)",
                    "inset(34px 0 0 0)",
                    "inset(36px 0 0 0)",
                    "inset(0 0 0 0)",
                  ],
                }
          }
          transition={loopTimes(8.8, [0, 0.32, 0.5, 0.68, 1], "easeInOut")}
        >
          <img alt="" src={asset("ct-eye-l")} draggable={false} style={{ position: "absolute", left: 0, top: 0, width: 94, height: 89.267 }} />
          <img alt="" src={asset("ct-eye-r")} draggable={false} style={{ position: "absolute", left: 94, top: 0, width: 94, height: 89.267 }} />
        </motion.div>
        <Layer name="ct-mouth" {...box(191, 232, 85, 32)} reduced={reduced} />
      </motion.div>
      <Layer
        name="ct-flower"
        {...box(190, 414, 80, 129)}
        reduced={reduced}
        animate={reduced ? undefined : { opacity: [0, 1, 1, 0, 0] }}
        transition={loopTimes(9.6, [0, 0.2292, 0.7083, 0.9583, 1], [[0.4, 0, 0.2, 1], "linear", [0.4, 0, 0.2, 1], "linear"])}
      />
    </>
  );
}

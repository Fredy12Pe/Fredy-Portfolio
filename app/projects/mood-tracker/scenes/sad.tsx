"use client";

import { motion } from "framer-motion";
import Rainfall from "../Rainfall";
import { loopTimes } from "../motion";
import { Eyes, Layer, asset, box, inset } from "../primitives";
import { Cloud } from "./shared";

export default function Sad({ reduced }: { reduced?: boolean }) {
  return (
    <>
      <Rainfall reduced={reduced} />
      <Cloud name="sad-cloud-1" box={inset(12.55, -7.56, 76.83, 70.23)} reduced={reduced} fromX={190} duration={4} times={[0, 0.055, 0.405, 1]} flipX />
      <Cloud name="sad-cloud-2" box={inset(8.37, 71.36, 83.26, -1.14)} reduced={reduced} fromX={-250} duration={4} times={[0, 0.03, 0.3625, 1]} />
      <motion.div
        style={{ position: "absolute", left: -231, top: 97, width: 900, height: 859 }}
        animate={reduced ? undefined : { x: [0, -1, 1, 0, 0], y: [0, 5, 8, 0, 0] }}
        transition={loopTimes(4, [0, 0.2625, 0.5375, 0.75, 1], [[0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], [0.55, 0, 0.35, 1], "linear"])}
      >
        <img alt="" src={asset("sad-body")} draggable={false} style={{ width: "100%", height: "100%", display: "block" }} />
        <Layer name="sad-headband" {...box(322, 58, 257, 43)} reduced={reduced} />
      </motion.div>
      <motion.div
        style={{ position: "absolute", left: 126, top: 254, width: 188, height: 220 }}
        animate={reduced ? undefined : { x: [0, 0, -3, -2, 0, 0], y: [0, 6, 12, 12, 0, 0] }}
        transition={loopTimes(4, [0, 0.175, 0.4, 0.6125, 0.75, 1])}
      >
        <Eyes
          left={0}
          top={0}
          eye="sad-eye"
          pupilL="sad-pupil-l"
          pupilR="sad-pupil-r"
          reduced={reduced}
          wanderL={{
            animate: { scaleX: [1, 1, 0.98, 0.96, 0.96], scaleY: [1, 1, 1.07, 1.12, 1.12], x: [0, 0, 1.5, 2.5, 2, 2], y: [0, 0, 8, 15, 18, 18] },
            transition: {
              scaleX: loopTimes(4, [0, 0.0375, 0.3125, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], "linear"]),
              scaleY: loopTimes(4, [0, 0.0375, 0.3125, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], "linear"]),
              x: loopTimes(4, [0, 0.0375, 0.3125, 0.5375, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], [0.55, 0, 0.35, 1], "linear"]),
              y: loopTimes(4, [0, 0.0375, 0.3125, 0.5375, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], [0.55, 0, 0.35, 1], "linear"]),
            },
          }}
          wanderR={{
            animate: { scaleX: [1, 1, 0.98, 0.96, 0.96], scaleY: [1, 1, 1.06, 1.1, 1.1], x: [0, 0, -1, -2.5, -2, -2], y: [0, 0, 7, 14, 17, 17] },
            transition: {
              scaleX: loopTimes(4, [0, 0.105, 0.375, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], "linear"]),
              scaleY: loopTimes(4, [0, 0.105, 0.375, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], "linear"]),
              x: loopTimes(4, [0, 0.105, 0.375, 0.5875, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], [0.55, 0, 0.35, 1], "linear"]),
              y: loopTimes(4, [0, 0.105, 0.375, 0.5875, 0.75, 1], ["linear", [0.22, 0.7, 0.3, 1], [0.55, 0, 0.35, 1], [0.55, 0, 0.35, 1], "linear"]),
            },
          }}
        />
        <motion.div
          style={{ position: "absolute", left: 4, top: 128, width: 179, height: 78, transformOrigin: "100% 50%" }}
          animate={reduced ? undefined : { rotate: [0, 0.35, 0.16, 0, 0], scaleX: [1, 1, 1.015, 1.008, 1, 1], scaleY: [0.58, 0.92, 0.86, 0.89, 0.92, 0.92] }}
          transition={loopTimes(4, [0, 0.18, 0.475, 0.6375, 0.75, 1])}
        >
          <img alt="" src={asset("sad-mouth")} draggable={false} style={{ width: "100%", height: "100%" }} />
          <img alt="" src={asset("sad-mouth-bg")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </motion.div>
      </motion.div>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { loopTimes, springC } from "../motion";
import { Eyes, Layer, MouthFill, asset, box, inset } from "../primitives";
import { BLINK, Cloud, PUPIL_WANDER } from "./shared";

export default function FreakingOut({ reduced }: { reduced?: boolean }) {
  const c1 = inset(0, 55.65, 78.4, -31.59);
  const c2 = inset(14.02, 79.74, 75.36, -17.08);
  const c3 = inset(3.14, -30.03, 65.77, 43.89);

  return (
    <>
      <Cloud
        name="fo-cloud-1"
        box={c1}
        reduced={reduced}
        fromX={-320}
        duration={4.2}
        times={[0, 0.1, 0.4571, 1]}
        rotate={-0.61}
        fromRotate={-1.81}
        opacityTimes={[0, 0.1286, 0.4571, 1]}
      />
      <Cloud
        name="fo-cloud-2"
        box={c2}
        reduced={reduced}
        fromX={-190}
        duration={4.2}
        times={[0, 0.0524, 0.3857, 1]}
        rotate={-0.61}
        fromRotate={-1.51}
        opacityTimes={[0, 0.081, 0.3857, 1]}
      />
      <Cloud
        name="fo-cloud-3"
        box={c3}
        reduced={reduced}
        fromX={250}
        duration={4.2}
        times={[0, 0.3452, 1]}
        opacityTimes={[0, 0.0286, 0.3452, 1]}
        flipX
        rotate={18.36}
        fromRotate={19.56}
      />
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          top: 168,
          width: 440,
          height: 788,
          borderRadius: "220px 220px 0 0",
          background: "linear-gradient(to bottom, #23367c, #0d214f)",
        }}
        animate={reduced ? undefined : { height: [788, 774, 788, 781, 788, 784, 788, 783, 788, 788], y: [0, 7, 0, 3.5, 0, 2, 0, 2.5, 0, 0] }}
        transition={loopTimes(4.2, [0, 0.0905, 0.1952, 0.2952, 0.4, 0.5238, 0.6476, 0.7714, 0.9, 1], [[0.37, 0, 0.2, 1], springC, "easeInOut", springC, "easeInOut", "easeInOut", "easeInOut", "easeInOut", "linear"])}
      />
      <Layer
        name="fo-hair"
        {...box(195, 68, 79, 96)}
        reduced={reduced}
        animate={reduced ? undefined : { x: [1.4, 1.4, 0, 0, 7, -7, 8, -5, 0], y: [-14, 7, 0, 0, -2, 1, -2, 1, 0] }}
        transition={loopTimes(4.2, [0, 0.0952, 0.2, 0.4048, 0.5667, 0.6714, 0.7762, 0.8762, 1])}
      />
      <motion.div
        style={{ position: "absolute", left: 126, top: 236, width: 188, height: 259, transformOrigin: "center top" }}
        animate={
          reduced
            ? undefined
            : { rotate: [0, 0, -3.2, 3.2, -3.8, 2.4, 0], x: [0, 0, -3, 0, 0, -15, 15, -17, 12, 0], y: [0, 12, 0, 3, 0, 0, 2, -1, 2, 0, 0] }
        }
        transition={{
          rotate: loopTimes(4.2, [0, 0.4881, 0.5667, 0.6714, 0.7762, 0.8762, 1]),
          x: loopTimes(4.2, [0, 0.1952, 0.3048, 0.4095, 0.4881, 0.5667, 0.6714, 0.7762, 0.8762, 1]),
          y: loopTimes(4.2, [0, 0.0905, 0.1952, 0.3048, 0.4095, 0.4881, 0.5667, 0.6714, 0.7762, 0.8762, 1]),
        }}
      >
        <Eyes left={0} top={0} eye="fo-eye" pupilL="fo-pupil-l" pupilR="fo-pupil-r" reduced={reduced} blink={BLINK} wander={PUPIL_WANDER} />
        <motion.div
          style={{ position: "absolute", left: 4, top: 136, width: 179, height: 78, transformOrigin: "100% 50%", overflow: "hidden" }}
          animate={
            reduced
              ? undefined
              : { rotate: [0, 1.4, -1.3, 1.5, -1.4, 1.1, 0, -2.2, 2.2, -2.6, 1.8, 0], scaleX: [1, 1, 0.985, 1.015, 0.985, 1, 1, 0.97, 1.03, 0.965, 1.025, 1], scaleY: [0.42, 1, 1.045, 0.96, 1.04, 1, 1, 1.08, 0.94, 1.1, 0.96, 1] }
          }
          transition={loopTimes(4.2, [0, 0.1071, 0.1714, 0.2429, 0.3143, 0.3952, 0.4881, 0.5667, 0.6714, 0.7762, 0.8762, 1])}
        >
          <img alt="" src={asset("fo-mouth")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <img alt="" src={asset("fo-mouth-bg")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            animate={reduced ? undefined : { opacity: [0, 1, 1] }}
            transition={loopTimes(4.2, [0, 0.0762, 1], [[0.37, 0, 0.2, 1], "linear"])}
          >
            <MouthFill mask="fo-tongue-mask">
              <img alt="" src={asset("fo-tongue")} draggable={false} style={{ position: "absolute", left: 34.5, top: 53, width: 110, height: 110 }} />
              <img alt="" src={asset("fo-tooth")} draggable={false} style={{ position: "absolute", left: 58, top: -28, width: 30.729, height: 49 }} />
              <img alt="" src={asset("fo-tooth")} draggable={false} style={{ position: "absolute", left: 90.729, top: -28, width: 30.729, height: 49 }} />
            </MouthFill>
          </motion.div>
        </motion.div>
        <Layer
          name="fo-tear-l"
          {...box(17, 94, 17, 25)}
          reduced={reduced}
          animate={reduced ? undefined : { opacity: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0], x: [0, 0, -4, -4, 0, -5, -5], y: [0, 0, 112, 112, 0, 118, 118] }}
          transition={{
            opacity: loopTimes(4.2, [0, 0.2262, 0.2571, 0.3905, 0.4381, 0.5952, 0.6238, 0.7571, 0.8095, 1]),
            x: loopTimes(4.2, [0, 0.2262, 0.4381, 0.5951, 0.5952, 0.8095, 1]),
            y: loopTimes(4.2, [0, 0.2262, 0.4381, 0.5951, 0.5952, 0.8095, 1]),
          }}
        />
        <Layer
          name="fo-tear-r"
          {...box(158, 94, 17, 25)}
          reduced={reduced}
          animate={reduced ? undefined : { opacity: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0], x: [0, 0, 4, 4, 0, 5, 5], y: [0, 0, 112, 112, 0, 118, 118] }}
          transition={{
            opacity: loopTimes(4.2, [0, 0.2619, 0.2929, 0.4238, 0.4714, 0.6476, 0.6762, 0.8143, 0.8667, 1]),
            x: loopTimes(4.2, [0, 0.2619, 0.4714, 0.6475, 0.6476, 0.8667, 1]),
            y: loopTimes(4.2, [0, 0.2619, 0.4714, 0.6475, 0.6476, 0.8667, 1]),
          }}
        />
      </motion.div>
    </>
  );
}

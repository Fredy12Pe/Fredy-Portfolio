"use client";

import { motion } from "framer-motion";
import { loopTimes, springA, springB } from "../motion";
import { Eyes, Layer, MouthFill, Tooth, asset, box } from "../primitives";

const BOUNCE_TIMES = [0, 0.1, 0.175, 0.2125, 0.2417, 0.2792, 0.3083, 0.3458, 0.375, 0.4208, 0.45, 0.4875, 0.5167, 0.5625, 0.5917, 0.6292, 0.6583, 0.7042, 0.7333, 0.7708, 0.8, 0.8458, 0.875, 0.9125, 0.9417, 1];
const ARM_TIMES = [0, 0.1, 0.1833, 0.2208, 0.2583, 0.2958, 0.3333, 0.375, 0.4167, 0.4583, 0.5, 0.5417, 0.5833, 0.625, 0.6667, 0.7083, 0.75, 0.7917, 0.8333, 0.8833, 0.9333, 1];
const ARM_EASE = ["easeInOut", "easeOut", springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, springA, "easeInOut", "easeOut"];
const SPARK_ROTATE = [0, 2.24, -1.96, 2.8, -1.68, 0];
const SPARK_ROTATE_FLIP = [0, -2.24, 1.96, -2.8, 1.68, 0];
const SPARK_ROTATE_EASE = ["easeOut", springA, springA, springA, "easeOut"];
const START_OFFSET = -1.2;

const excitedLoopTimes = (...args: Parameters<typeof loopTimes>) => ({
  ...loopTimes(...args),
  delay: START_OFFSET,
});

const SPARKS = [
  { name: "ex-spark-1", box: box(336, 47.59, 32.81, 38.07), rotate: -7.64, rotateOffset: SPARK_ROTATE, rotateTimes: [0, 0.1983, 0.4183, 0.7017, 0.85, 1] },
  { name: "ex-spark-2", box: box(20.37, 90.65, 36.84, 41.06), rotate: 164.11, flipY: true, rotateOffset: SPARK_ROTATE_FLIP, rotateTimes: [0, 0.2158, 0.4358, 0.7192, 0.8675, 1] },
  { name: "ex-spark-3", box: box(265.39, 0, 45.24, 69.95), rotate: -16.09, rotateOffset: SPARK_ROTATE_FLIP, rotateTimes: [0, 0.2042, 0.4242, 0.7075, 0.8558, 1] },
  { name: "ex-spark-4", box: box(66.9, 22.59, 36.58, 67.73), rotate: 172.56, flipY: true, rotateOffset: SPARK_ROTATE, rotateTimes: [0, 0.2217, 0.4417, 0.725, 0.8733, 1] },
  { name: "ex-spark-5", box: box(395, 115.59, 21.5, 25.63), rotate: 3.03, rotateOffset: SPARK_ROTATE, rotateTimes: [0, 0.21, 0.43, 0.7133, 0.8617, 1] },
  { name: "ex-spark-6", box: box(0, 173.6, 29.09, 31.04), rotate: 153.44, flipY: true, rotateOffset: SPARK_ROTATE_FLIP, rotateTimes: [0, 0.2275, 0.4475, 0.7308, 0.8792, 1] },
] as const;

export default function Excited({ reduced }: { reduced?: boolean }) {
  const blink = {
    animate: reduced ? undefined : { scaleY: [1, 1, 0.18, 1, 1, 0.2, 1, 1, 0.18, 1, 1, 0.22, 1, 1] },
    transition: excitedLoopTimes(12, [0, 0.1583, 0.1683, 0.1783, 0.4375, 0.4475, 0.4575, 0.7183, 0.7283, 0.7383, 0.9233, 0.9333, 0.9433, 1], [
      "linear",
      springA,
      springB,
      "linear",
      springA,
      springB,
      "linear",
      springA,
      springB,
      "linear",
      springA,
      springB,
      "linear",
    ]),
  };
  const wander = {
    animate: reduced ? undefined : { x: [0, 0, -10, 9, 3, -7, 10, -9, 0, 8, -8, 0], y: [0, 0, -3, -2, -8, 6, 5, -6, 8, -7, 3, 0] },
    transition: excitedLoopTimes(12, [0, 0.0833, 0.1667, 0.2625, 0.3542, 0.4417, 0.5375, 0.6333, 0.7292, 0.8208, 0.9125, 1]),
  };

  return (
    <>
      <motion.div
        style={{ position: "absolute", left: -41, top: 105, width: 501, height: 877, transformOrigin: "center" }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, 0.227, -0.227, 0.455, -0.455, 0.569, -0.569, 0.341, 0],
                scaleX: [1, 1.004, 1.014, 0.992, 1.016, 0.99, 1.014, 0.994, 1.016, 0.988, 1.016, 0.992, 1.014, 0.988, 1.018, 0.99, 1.016, 0.986, 1.018, 0.994, 1.014, 0.99, 1.016, 0.996, 1.008, 1],
                scaleY: [1, 0.996, 0.984, 1.016, 0.982, 1.02, 0.984, 1.012, 0.98, 1.023, 0.982, 1.018, 0.984, 1.025, 0.98, 1.021, 0.982, 1.027, 0.98, 1.014, 0.984, 1.021, 0.982, 1.01, 0.992, 1],
                y: [0, -1.82, 0, -12.74, 0, -16.38, 0, -10.92, 0, -18.655, 0, -13.65, 0, -20.02, 0, -15.47, 0, -20.93, 0, -13.195, 0, -17.745, 0, -10.01, 0, 0],
              }
        }
        transition={{
          rotate: excitedLoopTimes(12, [0, 0.1, 0.175, 0.3083, 0.45, 0.5917, 0.7333, 0.875, 1], ["easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeOut"]),
          scaleX: excitedLoopTimes(12, BOUNCE_TIMES, springB),
          scaleY: excitedLoopTimes(12, BOUNCE_TIMES, springB),
          y: excitedLoopTimes(12, BOUNCE_TIMES, [springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", springA, "easeIn", "linear"]),
        }}
      >
        <Layer
          name="ex-arm-l"
          {...box(0, 267.31, 126.55, 194.23)}
          reduced={reduced}
          origin="right center"
          animate={reduced ? undefined : { rotate: [0, 1.596, -2.128, 4.788, -3.192, 5.852, -3.724, 5.32, -4.256, 6.384, -3.724, 5.586, -4.788, 6.65, -3.99, 5.852, -4.522, 4.788, -3.192, 3.724, -2.128, 0] }}
          transition={excitedLoopTimes(12, ARM_TIMES, ARM_EASE)}
        />
        <Layer
          name="ex-arm-r"
          {...box(404.58, 182.45, 96.59, 236.91)}
          reduced={reduced}
          origin="left center"
          animate={reduced ? undefined : { rotate: [0, -1.596, 2.128, -4.788, 3.192, -5.852, 3.724, -5.32, 4.256, -6.384, 3.724, -5.586, 4.788, -6.65, 3.99, -5.852, 4.522, -4.788, 3.192, -3.724, 2.128, 0] }}
          transition={excitedLoopTimes(12, ARM_TIMES, ARM_EASE)}
        />
        <Layer name="ex-body" {...box(31.31, 79.77, 452.53, 797.23)} reduced={reduced} />
        <Layer
          name="ex-headpiece"
          {...box(139.97, 0, 137.12, 126.58)}
          reduced={reduced}
          animate={reduced ? undefined : { rotate: [0, 0.84, -1.4, 1.96, -1.68, 2.24, -1.96, 2.52, -2.24, 1.68, -1.4, 0], y: [0, 0, -2.8, 0, -3.36, 0, -3.92, 0, -2.8, 0, 0] }}
          transition={{
            rotate: excitedLoopTimes(12, [0, 0.125, 0.2083, 0.2917, 0.375, 0.4583, 0.5417, 0.625, 0.7083, 0.7917, 0.875, 1], ["easeInOut", "easeOut", springA, springA, springA, springA, springA, springA, springA, springA, "easeOut"]),
            y: excitedLoopTimes(12, [0, 0.175, 0.2125, 0.2417, 0.4208, 0.45, 0.6292, 0.6583, 0.8458, 0.875, 1], ["linear", springA, springB, springA, springB, springA, springB, springA, springB, "linear"]),
          }}
        />
        <motion.div
          style={{ position: "absolute", left: 140.6, top: 136.49, width: 221, height: 238, transformOrigin: "center top" }}
          animate={reduced ? undefined : { rotate: [0, 0, 0.6, -0.6, 0.75, -0.75, 0.6, 0], y: [0, 0.675, -1.687, 1.012, -2.025, 1.012, -2.363, 1.012, -1.687, 0.675, 0] }}
          transition={{
            rotate: excitedLoopTimes(12, [0, 0.175, 0.2792, 0.375, 0.5167, 0.6583, 0.8, 1], ["linear", "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeOut"]),
            y: excitedLoopTimes(12, [0, 0.1, 0.2125, 0.2417, 0.4208, 0.45, 0.6292, 0.6583, 0.8458, 0.875, 1], ["easeInOut", springA, springB, springA, springB, springA, springB, springA, springB, "easeOut"]),
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, width: 200.7, height: 123.09, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: "rotate(-9.28deg)" }}>
              <Eyes
                left={0}
                top={0}
                eye="ex-eye"
                pupilL="ex-pupil-l"
                pupilR="ex-pupil-r"
                reduced={reduced}
                blink={blink}
                wander={wander}
                style={{ position: "relative", left: "auto", top: "auto" }}
              />
            </div>
          </div>
          <motion.div
            style={{ position: "absolute", left: 29.4, top: 107.51, width: 191.85, height: 130.44, transformOrigin: "center" }}
            animate={
              reduced
                ? undefined
                : {
                    rotate: [0, 0, 0.6, -0.6, 0.75, -0.6, 0.9, -0.6, 0],
                    scaleX: [1, 1.006, 1.024, 1.042, 1.018, 1.048, 1.024, 1.054, 1.03, 1.042, 1],
                    scaleY: [1, 1.006, 1.036, 1.06, 1.024, 1.066, 1.03, 1.072, 1.036, 1.054, 1],
                  }
            }
            transition={{
              rotate: excitedLoopTimes(12, [0, 0.175, 0.2792, 0.375, 0.4875, 0.5917, 0.7042, 0.8, 1], ["linear", "easeOut", "easeInOut", "easeOut", "easeInOut", "easeOut", "easeInOut", "easeOut"]),
              scaleX: excitedLoopTimes(12, [0, 0.1, 0.175, 0.2792, 0.375, 0.4875, 0.5917, 0.7042, 0.8, 0.9125, 1], ["easeInOut", "easeOut", springB, "easeInOut", springB, "easeInOut", springB, "easeInOut", springB, "easeOut"]),
              scaleY: excitedLoopTimes(12, [0, 0.1, 0.175, 0.2792, 0.375, 0.4875, 0.5917, 0.7042, 0.8, 0.9125, 1], ["easeInOut", "easeOut", springB, "easeInOut", springB, "easeInOut", springB, "easeInOut", springB, "easeOut"]),
            }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 176.89, height: 101.01, transform: "rotate(-10.09deg) scaleY(-1)", position: "relative" }}>
                <img alt="" src={asset("ex-mouth")} draggable={false} style={{ width: "100%", height: "100%", display: "block" }} />
                <img alt="" src={asset("ex-mouth-bg")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <MouthFill mask="ex-tongue-mask">
                  <img alt="" src={asset("ex-tongue")} draggable={false} style={{ position: "absolute", left: 28, top: -98, width: 130, height: 142, display: "block" }} />
                  <Tooth name="ex-tooth-2" left={57} top={71} rotate={169.91} />
                  <Tooth name="ex-tooth-1" left={90} top={71} rotate={169.91} />
                </MouthFill>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div
        style={{ position: "absolute", left: -10, top: 82.41, width: 417, height: 205, transformOrigin: "center", pointerEvents: "none" }}
        animate={
          reduced
            ? undefined
            : {
                opacity: [0, 0, 0.576, 0.202, 0.576, 0.259, 0.576, 0.23, 0.576, 0.202, 0.576, 0.259, 0.576, 0.144, 0],
                scaleX: [0.926, 0.926, 1.029, 1, 1.039, 1, 1.044, 1, 1.029, 0.951],
                scaleY: [0.926, 0.926, 1.029, 1, 1.039, 1, 1.044, 1, 1.029, 0.951],
              }
        }
        transition={{
          opacity: excitedLoopTimes(12, [0, 0.1792, 0.1958, 0.2417, 0.2792, 0.375, 0.4208, 0.5167, 0.5625, 0.6583, 0.7042, 0.8, 0.8458, 0.9417, 1], ["linear", springA, "easeOut", springA, "easeOut", springA, "easeOut", springA, "easeOut", springA, "easeOut", springA, "easeOut", "easeOut"]),
          scaleX: excitedLoopTimes(12, [0, 0.1792, 0.1958, 0.2417, 0.4208, 0.5167, 0.7042, 0.8, 0.8458, 1], "easeOut"),
          scaleY: excitedLoopTimes(12, [0, 0.1792, 0.1958, 0.2417, 0.4208, 0.5167, 0.7042, 0.8, 0.8458, 1], "easeOut"),
        }}
      >
        {SPARKS.map((spark) => (
          <Layer
            key={spark.name}
            name={spark.name}
            {...spark.box}
            reduced={reduced}
            rotate={spark.rotate}
            flipY={"flipY" in spark && spark.flipY}
            origin="50% 50%"
            animate={reduced ? undefined : { rotate: [...spark.rotateOffset] }}
            transition={excitedLoopTimes(12, [...spark.rotateTimes], SPARK_ROTATE_EASE)}
          />
        ))}
      </motion.div>
    </>
  );
}

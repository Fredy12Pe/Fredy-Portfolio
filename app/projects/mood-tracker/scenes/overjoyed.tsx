"use client";

import { motion } from "framer-motion";
import SunBurst from "../SunBurst";
import { loopTimes } from "../motion";
import { Layer, MouthFill, Tooth, asset, box } from "../primitives";

const BODY_TIMES = [0, 0.0188, 0.0375, 0.0604, 0.0833, 0.1094, 0.1302, 0.1563, 0.1979, 0.2344, 0.2708, 0.3073, 0.3438, 0.3802, 0.4167, 0.4531, 0.4813, 0.5, 0.5188, 0.5365, 0.5625, 0.5885, 0.6146, 0.651, 0.6875, 0.724, 0.7604, 0.7969, 0.8333, 0.8698, 0.901, 0.9323, 0.9635, 1];
const BODY_X_TIMES = [0, 0.0188, 0.0375, 0.0604, 0.0833, 0.1094, 0.1302, 0.1563, 0.1979, 0.2344, 0.2708, 0.3073, 0.3438, 0.3802, 0.4167, 0.5, 0.5188, 0.5365, 0.5625, 0.5885, 0.6146, 0.651, 0.6875, 0.724, 0.7604, 0.7969, 0.8333, 0.8698, 0.9323, 0.9635, 1];
const BODY_X = [0, -2, 2, -1, 0, -1, 1, 0, -6, 7, -8, 8, -5, 5, 0, 0, -2, 2, -1, 1, 0, -7, 8, -8, 7, -5, 5, 0, 0, -4, 0];
const BODY_Y = [0, -10, 2, -7, 0, -8, 1, 0, -3, -5, -3, -6, -4, -8, 0, -14, 3, 0, -10, 2, -8, 1, 0, -5, -9, -4, -10, -3, -8, 0, -15, 3, -5, 0];
const BODY_SCALE_X = [1, 0.99, 1.025, 0.995, 1, 0.99, 1.02, 1, 1.012, 0.995, 1.015, 0.995, 1.012, 0.998, 1, 0.985, 1.025, 1, 0.99, 1.025, 0.995, 1.018, 1, 1.012, 0.994, 1.015, 0.995, 1.012, 0.997, 1, 0.985, 1.025, 1.01, 1];
const BODY_SCALE_Y = [1, 1.018, 0.985, 1.012, 1, 1.015, 0.988, 1, 0.995, 1.01, 0.994, 1.012, 0.996, 1.01, 1, 1.02, 0.985, 1, 1.018, 0.985, 1.012, 0.99, 1, 0.995, 1.012, 0.994, 1.014, 0.996, 1.01, 1, 1.022, 0.985, 0.997, 1];

const EYE_SCALE_Y = [1, 1, 0.1, 1, 1, 1.14, 1, 1, 0.52, 0.52, 1.15, 1, 1, 0.08, 1, 1, 1.12, 1, 0.48, 1, 1];
const EYE_Y = [0, 0, 42.3, 0, 0, -6.58, 0, 0, 22.56, 22.56, -7.05, 0, 0, 43.24, 0, 0, -5.64, 0, 24.44, 0, 0];
const LEFT_EYE_TIMES = [0, 0.1229, 0.1354, 0.149, 0.2448, 0.2625, 0.2938, 0.4531, 0.5, 0.5542, 0.5781, 0.6094, 0.7479, 0.7583, 0.7719, 0.8625, 0.8813, 0.9125, 0.9375, 0.9667, 1];
const RIGHT_EYE_TIMES = [0, 0.1255, 0.138, 0.1516, 0.2474, 0.2651, 0.2964, 0.4557, 0.5026, 0.5568, 0.5807, 0.612, 0.7505, 0.7609, 0.7745, 0.8651, 0.8839, 0.9151, 0.9401, 0.9693, 1];

const PUPIL_X = [0, -8, -8, 0, 10, 10, 0, 0, -10, -10, 10, 10, 0, 0];
const PUPIL_X_TIMES = [0, 0.0677, 0.1094, 0.1406, 0.2135, 0.2583, 0.3021, 0.5854, 0.6406, 0.6823, 0.7188, 0.7521, 0.776, 1];
const PUPIL_Y = [0, 1, 1, 0, 0, -8, -8, 0, 6, 6, 0, 0, 1, 1, 0, -7, -7, 4, 0, 0];
const PUPIL_Y_TIMES = [0, 0.0677, 0.1094, 0.1406, 0.3021, 0.3594, 0.4271, 0.4667, 0.5, 0.5573, 0.5854, 0.6823, 0.7188, 0.7521, 0.776, 0.8385, 0.8979, 0.9323, 0.9688, 1];

const SMILE_TIMES = [0, 0.0188, 0.0375, 0.0604, 0.0833, 0.1094, 0.1302, 0.1563, 0.5, 0.5188, 0.5365, 0.5625, 0.5885, 0.6146, 1];
const SMILE_SCALE_X = [1, 1.04, 0.98, 1.03, 1, 1.04, 0.98, 1, 1, 1.04, 0.98, 1.03, 0.99, 1, 1];
const SMILE_SCALE_Y = [1, 1.1, 0.92, 1.08, 1, 1.09, 0.94, 1, 1, 1.1, 0.92, 1.08, 0.94, 1, 1];

const BLUSH_OPACITY = [0, 1, 0.2, 1, 0, 0, 1, 0.15, 0, 0, 1, 0.2, 1, 0, 0];
const BLUSH_OPACITY_TIMES = [0, 0.0125, 0.0313, 0.0521, 0.0781, 0.099, 0.1125, 0.1354, 0.1563, 0.5, 0.5125, 0.5333, 0.5573, 0.5854, 1];
const BLUSH_X_TIMES = [0, 0.0125, 0.0313, 0.0521, 0.0781, 0.1125, 0.1354, 0.1563, 0.5, 0.5125, 0.5333, 0.5573, 0.5854, 1];
const BLUSH_Y_TIMES = [0, 0.0125, 0.0313, 0.0521, 0.0781, 0.1125, 0.1354, 0.5, 0.5125, 0.5333, 0.5573, 0.5854, 1];
const BLUSH_Y = [0, -5, 0, -3, 0, -4, 0, 0, -5, 0, -3, 0, 0];

const repeated = (times: number[]) => loopTimes(9.6, times, "easeInOut");

export default function Overjoyed({ reduced }: { reduced?: boolean }) {
  const bodyMotion = {
    animate: reduced
      ? undefined
      : { scaleX: BODY_SCALE_X, scaleY: BODY_SCALE_Y, x: BODY_X, y: BODY_Y },
    transition: {
      scaleX: repeated(BODY_TIMES),
      scaleY: repeated(BODY_TIMES),
      x: repeated(BODY_X_TIMES),
      y: repeated(BODY_TIMES),
    },
  };

  const pupilMotion = {
    animate: reduced ? undefined : { x: PUPIL_X, y: PUPIL_Y },
    transition: {
      x: repeated(PUPIL_X_TIMES),
      y: repeated(PUPIL_Y_TIMES),
    },
  };

  return (
    <>
      <SunBurst
        reduced={reduced}
        color="#fc7488"
        left={245}
        top={-130}
        rayWidth={10}
        rayLength={62}
        raySpan={321}
        disc={{ left: 327, top: -48, size: 157, src: asset("oj-sun") }}
      />
      <motion.div style={{ position: "absolute", left: -18, top: 150, width: 476, height: 828, transformOrigin: "center 70%" }} {...bodyMotion}>
        <img alt="" src={asset("oj-body")} draggable={false} style={{ width: "100%", height: "100%" }} />
      </motion.div>
      <motion.div
        style={{ position: "absolute", left: 126, top: 250, width: 188, height: 94, overflow: "hidden", transformOrigin: "center" }}
        animate={reduced ? undefined : { rotate: [0, 1.2, -1, 0.8, 0, 1, -0.8, 0, 0, 1.2, -1, 0.8, -0.7, 0, 0], x: BODY_X, y: BODY_Y }}
        transition={{
          rotate: repeated([0, 0.0188, 0.0375, 0.0604, 0.0833, 0.1094, 0.1302, 0.1563, 0.5, 0.5188, 0.5365, 0.5625, 0.5885, 0.6146, 1]),
          x: repeated(BODY_X_TIMES),
          y: repeated(BODY_TIMES),
        }}
      >
        <motion.div
          style={{ position: "absolute", left: 0, top: 43, width: 94, height: 94, overflow: "hidden", transformOrigin: "center" }}
          animate={reduced ? undefined : { scaleY: EYE_SCALE_Y, y: EYE_Y }}
          transition={{ scaleY: repeated(LEFT_EYE_TIMES), y: repeated(LEFT_EYE_TIMES) }}
        >
          <img alt="" src={asset("oj-eye")} draggable={false} style={{ width: 94, height: 94 }} />
          <motion.img alt="" src={asset("oj-pupil-l")} draggable={false} style={{ position: "absolute", left: 17, top: 17, width: 60, height: 60 }} {...pupilMotion} />
        </motion.div>
        <motion.div
          style={{ position: "absolute", left: 94, top: 43, width: 94, height: 94, overflow: "hidden", transformOrigin: "center" }}
          animate={reduced ? undefined : { scaleY: EYE_SCALE_Y, y: EYE_Y }}
          transition={{ scaleY: repeated(RIGHT_EYE_TIMES), y: repeated(RIGHT_EYE_TIMES) }}
        >
          <img alt="" src={asset("oj-eye")} draggable={false} style={{ width: 94, height: 94 }} />
          <motion.img alt="" src={asset("oj-pupil-r")} draggable={false} style={{ position: "absolute", left: 17, top: 17, width: 60, height: 60 }} {...pupilMotion} />
        </motion.div>
      </motion.div>
      <motion.div
        style={{ position: "absolute", left: 126, top: 400, width: 179, height: 78, transformOrigin: "center" }}
        animate={reduced ? undefined : { scaleX: SMILE_SCALE_X, scaleY: SMILE_SCALE_Y, x: BODY_X, y: BODY_Y }}
        transition={{
          scaleX: repeated(SMILE_TIMES),
          scaleY: repeated(SMILE_TIMES),
          x: repeated(BODY_X_TIMES),
          y: repeated(BODY_TIMES),
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: "scaleY(-1)" }}>
          <img alt="" src={asset("oj-mouth")} draggable={false} style={{ width: "100%", height: "100%" }} />
          <img alt="" src={asset("oj-mouth-bg")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <MouthFill mask="oj-tongue-mask">
            <div style={{ position: "absolute", inset: 0, transform: "scaleY(-1)" }}>
              <img alt="" src={asset("oj-tongue")} draggable={false} style={{ position: "absolute", left: 35, top: 58, width: 110, height: 80 }} />
              <Tooth name="oj-tooth" left={58} top={-16} />
              <Tooth name="oj-tooth" left={91} top={-16} />
            </div>
          </MouthFill>
        </div>
      </motion.div>
      <Layer
        name="oj-blush-r"
        {...box(339, 374, 56, 21)}
        reduced={reduced}
        rotate={13.88}
        animate={reduced ? undefined : { opacity: BLUSH_OPACITY, x: [0, 7, 2, 6, 0, 6, 2, 0, 0, 7, 2, 6, 0, 0], y: BLUSH_Y }}
        transition={{ opacity: repeated(BLUSH_OPACITY_TIMES), x: repeated(BLUSH_X_TIMES), y: repeated(BLUSH_Y_TIMES) }}
      />
      <Layer
        name="oj-blush-l"
        {...box(47, 374, 56, 21)}
        reduced={reduced}
        rotate={-13.88}
        animate={reduced ? undefined : { opacity: BLUSH_OPACITY, x: [0, -7, -2, -6, 0, -6, -2, 0, 0, -7, -2, -6, 0, 0], y: BLUSH_Y }}
        transition={{ opacity: repeated(BLUSH_OPACITY_TIMES), x: repeated(BLUSH_X_TIMES), y: repeated(BLUSH_Y_TIMES) }}
      />
    </>
  );
}

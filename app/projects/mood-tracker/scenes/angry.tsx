"use client";

import { motion } from "framer-motion";
import { loopTimes, springA } from "../motion";
import { Layer, MouthFill, asset, box, inset } from "../primitives";

const BOUNCE: number[] = [0.45, 1.45, 0.8, 1];
const FULL_TIMES = [0, 1 / 12, 11 / 60, 17 / 60, 23 / 60, 29 / 60, 7 / 12, 0.7, 1];
const FULL_EASE = ["easeInOut", BOUNCE, springA, springA, springA, springA, "easeInOut", "easeInOut"];
const SOFT_TIMES = [0, 1 / 12, 11 / 60, 23 / 60, 7 / 12, 0.7, 1];
const SOFT_EASE = ["easeInOut", BOUNCE, springA, "easeInOut", "easeInOut", "easeInOut"];
const IMPACT_TIMES = [0, 11 / 60, 17 / 60, 23 / 60, 29 / 60, 7 / 12, 1];
const IMPACT_EASE = [BOUNCE, springA, springA, springA, springA, "easeInOut"];

const fullLoop = () => loopTimes(1.2, FULL_TIMES, FULL_EASE);
const softLoop = () => loopTimes(1.2, SOFT_TIMES, SOFT_EASE);
const impactLoop = () => loopTimes(1.2, IMPACT_TIMES, IMPACT_EASE);

export default function Angry({ reduced }: { reduced?: boolean }) {
  return (
    <>
      <Layer
        name="ag-bolt"
        {...inset(10.46, 23.18, 83.37, 68.41)}
        reduced={reduced}
        initial={reduced ? undefined : { opacity: 0.38, scaleX: 0.82, scaleY: 0.82 }}
        animate={
          reduced
            ? undefined
            : {
                opacity: [0.38, 0.55, 1, 0.62, 1, 0.55, 0.82, 0.48, 0.38],
                scaleX: [0.82, 0.9, 1.34, 1.02, 1.24, 1.05, 0.9, 0.82],
                scaleY: [0.82, 0.9, 1.34, 1.02, 1.24, 1.05, 0.9, 0.82],
              }
        }
        transition={{
          opacity: fullLoop(),
          scaleX: loopTimes(1.2, [0, 1 / 12, 11 / 60, 17 / 60, 23 / 60, 7 / 12, 0.7, 1], [
            "easeInOut",
            BOUNCE,
            springA,
            springA,
            "easeInOut",
            "easeInOut",
            "easeInOut",
          ]),
          scaleY: loopTimes(1.2, [0, 1 / 12, 11 / 60, 17 / 60, 23 / 60, 7 / 12, 0.7, 1], [
            "easeInOut",
            BOUNCE,
            springA,
            springA,
            "easeInOut",
            "easeInOut",
            "easeInOut",
          ]),
        }}
      />
      <Layer
        name="ag-cloud-1"
        {...inset(3.14, 45.44, 65.77, -31.59)}
        reduced={reduced}
        initial={reduced ? undefined : { rotate: -18.361, x: 0 }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [-18.361, -18.661, -16.861, -19.561, -17.461, -18.961, -18.061, -18.361, -18.361],
                x: [0, 1.8, -9, 7.2, -5.4, 3.6, -1.8, 0, 0],
              }
        }
        transition={{ rotate: fullLoop(), x: fullLoop() }}
      />
      <Layer
        name="ag-cloud-2"
        {...inset(18.83, 48.4, 50.08, -34.55)}
        reduced={reduced}
        rotate={-18.361}
        initial={reduced ? undefined : { rotate: 0, x: 0 }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, 0.18, -0.9, 0.72, -0.54, 0.36, -0.18, 0, 0],
                x: [0, 1.2, -6, 4.8, -3.6, 2.4, -1.2, 0, 0],
              }
        }
        transition={{ rotate: fullLoop(), x: fullLoop() }}
      />
      <Layer
        name="ag-cloud-3"
        {...inset(-9.83, -33.67, 88.23, 57.73)}
        reduced={reduced}
        flipX
        rotate={0.61}
        initial={reduced ? undefined : { rotate: 0, x: 0 }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, 0.24, -1.2, 0.96, -0.72, 0.48, -0.24, 0, 0],
                x: [0, -1.6, 8, -6.4, 4.8, -3.2, 1.6, 0, 0],
              }
        }
        transition={{ rotate: fullLoop(), x: fullLoop() }}
      />

      <motion.div
        style={{ position: "absolute", left: -4, top: 373, width: 448, height: 593, transformOrigin: "center" }}
        initial={reduced ? undefined : { rotate: 0, x: 0, y: 0 }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, -0.5, 2.5, -2.2, 1.8, -1.3, 0.8, -0.25, 0],
                x: [0, 3, -13, 12, -10, 7, -4, 2, 0],
                y: [0, -5, -18, -14, -7, -2, 0],
              }
        }
        transition={{ rotate: fullLoop(), x: fullLoop(), y: softLoop() }}
      >
        <Layer name="ag-shoulders" {...box(0, 0, 448, 593)} reduced />
      </motion.div>

      <motion.div
        style={{ position: "absolute", left: -4, top: 175.02, width: 448, height: 780.979, transformOrigin: "center" }}
        initial={reduced ? undefined : { rotate: 0, x: 0, y: 0 }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, -0.4, 2.2, -2, 1.6, -1.2, 0.7, -0.25, 0],
                x: [0, 2, -11, 10, -8, 6, -4, 1, 0],
                y: [0, -1, 2, -2, 1.5, -1, 0.5, 0, 0],
              }
        }
        transition={{ rotate: fullLoop(), x: fullLoop(), y: fullLoop() }}
      >
        <Layer name="ag-body" {...box(0, 0, 448, 780.979)} reduced />
      </motion.div>

      <motion.div
        style={{ position: "absolute", left: 127.656, top: 381.276, width: 185.239, height: 79.913, transformOrigin: "100% 50%" }}
        initial={reduced ? undefined : { rotate: 0, scaleX: 1, scaleY: 1, x: 0, y: 0 }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, 2.2, -1.8, 1.4, -1, 0.5, 0],
                scaleX: [1, 1.02, 1.13, 1.1, 1.04, 1.01, 1],
                scaleY: [1, 0.95, 0.7, 0.78, 0.92, 0.98, 1],
                x: [0, 1, -6, 5, -4, 3, -1.5, 0.5, 0],
                y: [0, 2, 9, 7, 3.5, 1, 0],
              }
        }
        transition={{
          rotate: impactLoop(),
          scaleX: softLoop(),
          scaleY: softLoop(),
          x: fullLoop(),
          y: softLoop(),
        }}
      >
        <img alt="" src={asset("ag-mouth")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <img alt="" src={asset("ag-mouth-bg")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <MouthFill mask="ag-mouth-mask">
          <img
            alt=""
            src={asset("ag-tooth")}
            draggable={false}
            style={{ position: "absolute", left: 79.343, top: -20.276, width: 24.831, height: 39.595 }}
          />
        </MouthFill>
      </motion.div>

      <motion.div
        style={{ position: "absolute", left: 123, top: 269, width: 194.552, height: 120, transformOrigin: "center" }}
        initial={reduced ? undefined : { rotate: 0, scaleX: 1, scaleY: 1, x: 0, y: 0 }}
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, 1.6, -1.4, 1.1, -0.8, 0.4, 0],
                scaleX: [1, 1.01, 1.08, 1.06, 1.03, 1.01, 1],
                scaleY: [1, 0.96, 0.78, 0.84, 0.93, 0.98, 1],
                x: [0, 1, -5, 4, -3.2, 2.2, -1.2, 0.5, 0],
                y: [0, 2, 8, 6, 3, 1, 0],
              }
        }
        transition={{
          rotate: impactLoop(),
          scaleX: softLoop(),
          scaleY: softLoop(),
          x: fullLoop(),
          y: softLoop(),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 15,
            width: 194.552,
            height: 97.276,
            WebkitMaskImage: `url(${asset("ag-eye-mask")})`,
            maskImage: `url(${asset("ag-eye-mask")})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <img
            alt=""
            src={asset("ag-eye-l")}
            draggable={false}
            style={{ position: "absolute", left: 0, top: -22.767, width: 97.276, height: 97.276 }}
          />
          <img
            alt=""
            src={asset("ag-eye-r")}
            draggable={false}
            style={{ position: "absolute", left: 97.276, top: -22.767, width: 97.276, height: 97.276 }}
          />
        </div>
        <img
          alt=""
          src={asset("ag-brow-r")}
          draggable={false}
          style={{ position: "absolute", left: 97, top: 5, width: 97, height: 34, transform: "rotate(5.81deg)" }}
        />
        <img
          alt=""
          src={asset("ag-brow-l")}
          draggable={false}
          style={{ position: "absolute", left: 2, top: 5, width: 97, height: 34, transform: "rotate(174.19deg) scaleY(-1)" }}
        />
      </motion.div>
    </>
  );
}

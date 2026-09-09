"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { loopTimes } from "../motion";
import { Eyes, Layer, Pos, asset, box, inset } from "../primitives";
import { BLINK, Cloud, PUPIL_WANDER, blinkEase } from "./shared";

export default function Anxious({ reduced }: { reduced?: boolean }) {
  const mouthClipId = useId();

  return (
    <>
      <Cloud name="ax-cloud-1" box={inset(0, -30.03, 78.4, 54.09)} reduced={reduced} fromX={320} duration={4} times={[0, 0.105, 0.48, 1]} opacityTimes={[0, 0.135, 0.48, 1]} flipX />
      <Cloud name="ax-cloud-2" box={inset(14.02, -15.52, 75.36, 78.18)} reduced={reduced} fromX={190} duration={4} times={[0, 0.055, 0.405, 1]} opacityTimes={[0, 0.085, 0.405, 1]} flipX />
      <Cloud name="ax-cloud-3" box={inset(3.14, 45.44, 65.77, -31.59)} reduced={reduced} fromX={-250} duration={4} times={[0, 0.3625, 1]} opacityTimes={[0, 0.03, 0.3625, 1]} rotate={-18.36} fromRotate={-17.16} />
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        animate={reduced ? undefined : { x: [0, -1.5, 1.8, -1, 1.6, 0, -1.8, 1.7, -1.2, 1.4, -0.8, 0], y: [0, -1, 0, -1.2, 0, -0.8, 0] }}
        transition={{
          x: loopTimes(4, [0, 0.1125, 0.18, 0.255, 0.335, 0.43, 0.5875, 0.6575, 0.73, 0.8, 0.8875, 1], [0.55, 0, 0.35, 1]),
          y: loopTimes(4, [0, 0.18, 0.335, 0.5875, 0.73, 0.8875, 1], "easeInOut"),
        }}
      >
        <Pos left={45} top={130} width={350} height={350}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 175, background: "#ff5b6e" }} />
        </Pos>
        <Layer name="ax-union" {...box(0, 130, 440, 908)} reduced={reduced} />
        <Layer
          name="ax-hair"
          {...box(53, 85, 334, 156)}
          reduced={reduced}
          animate={reduced ? undefined : { y: [0, 1.2, -0.8, 0, 1.4, -0.7, 0.8, 0] }}
          transition={loopTimes(4, [0, 0.145, 0.27, 0.405, 0.62, 0.755, 0.895, 1], "easeInOut")}
        />
        <div style={{ position: "absolute", left: 370, top: 338, width: 50, height: 32, borderRadius: 80, background: "#276371" }} />
        <div style={{ position: "absolute", left: 20, top: 338, width: 50, height: 32, borderRadius: 80, background: "#276371" }} />
        <Layer
          name="ax-sweat-1"
          {...box(332, 241, 22, 33)}
          reduced={reduced}
          origin="50% 50%"
          animate={reduced ? undefined : { opacity: [0, 0, 1, 0, 0, 1, 0, 0], scale: [0.85, 1, 1.05, 0.85, 1, 1.05, 0.85], y: [-5, -5, 11, -5, 11, -5] }}
          transition={{
            opacity: loopTimes(4, [0, 0.045, 0.105, 0.3, 0.4875, 0.545, 0.755, 1], "easeInOut"),
            scale: loopTimes(4, [0, 0.105, 0.3, 0.4875, 0.545, 0.755, 1], "easeInOut"),
            y: loopTimes(4, [0, 0.045, 0.3, 0.4875, 0.755, 1], "easeInOut"),
          }}
        />
        <Layer
          name="ax-sweat-2"
          {...box(351, 230, 16, 23)}
          reduced={reduced}
          origin="50% 50%"
          animate={reduced ? undefined : { opacity: [0, 0, 1, 0, 0, 1, 0, 0], scale: [0.82, 0.82, 1, 1.04, 0.82, 1, 1.04, 0.82], y: [-4, -4, 9, -4, 9, -4] }}
          transition={{
            opacity: loopTimes(4, [0, 0.18, 0.24, 0.43, 0.6375, 0.7, 0.9, 1], "easeInOut"),
            scale: loopTimes(4, [0, 0.18, 0.24, 0.43, 0.6375, 0.7, 0.9, 1], "easeInOut"),
            y: loopTimes(4, [0, 0.18, 0.43, 0.6375, 0.9, 1], "easeInOut"),
          }}
        />
        <Eyes
          left={126}
          top={254}
          eye="ax-eye"
          pupilL="ax-pupil-l"
          pupilR="ax-pupil-r"
          reduced={reduced}
          blinkL={{ ...BLINK, transition: loopTimes(4.2, [0, 0.1143, 0.1429, 0.1714, 0.3571, 0.3857, 0.4143, 0.5476, 0.5762, 0.6024, 0.7333, 0.7619, 0.7905, 1], blinkEase) }}
          blinkR={{ ...BLINK, transition: loopTimes(4.2, [0, 0.1167, 0.1452, 0.1738, 0.3595, 0.3881, 0.4167, 0.55, 0.5786, 0.6048, 0.7357, 0.7643, 0.7929, 1], blinkEase) }}
          wander={PUPIL_WANDER}
        />
        <div style={{ position: "absolute", left: 178, top: 391, width: 84, height: 84 }}>
          <svg width="84" height="84" viewBox="0 0 84 84" style={{ display: "block", overflow: "visible", pointerEvents: "none" }}>
            <defs>
              <clipPath id={mouthClipId} clipPathUnits="userSpaceOnUse">
                <motion.circle
                  cx={42}
                  cy={42}
                  r={42}
                  animate={
                    reduced
                      ? undefined
                      : {
                          cx: [45.84, 41.52, 45.84, 41.52, 45.84],
                          cy: [45.84, 41.52, 45.84, 41.52, 45.84],
                          r: [28.56, 43.68, 28.56, 43.68, 28.56],
                        }
                  }
                  transition={loopTimes(4, [0, 0.25, 0.5, 0.75, 1], "easeInOut")}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${mouthClipId})`}>
              <rect x="-4" y="-4" width="92" height="92" fill="#000b23" />
              <image href={asset("ax-tongue")} x="9" y="46" width="65" height="65" />
              <image href={asset("ax-tooth-1")} x="17" y="-17" width="24" height="38" />
              <image href={asset("ax-tooth-2")} x="43" y="-17" width="24" height="38" />
            </g>
          </svg>
        </div>
      </motion.div>
    </>
  );
}

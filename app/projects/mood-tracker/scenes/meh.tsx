"use client";

import { motion } from "framer-motion";
import Rainfall from "../Rainfall";
import SunBurst from "../SunBurst";
import { loop, loopTimes, springA, springB, springC } from "../motion";
import { Art, Eyes, Layer, MouthFill, Pos, Tooth, asset, assetSize, box, inset } from "../primitives";
import { BLINK, Cloud, PUPIL_WANDER, blinkEase } from "./shared";

export default function Meh({ reduced }: { reduced?: boolean }) {
  const mehBlink = {
    animate: { scaleY: [1, 1, 0.08, 1, 1, 0.08, 1, 1] },
    transition: loopTimes(4.8, [0, 0.2542, 0.275, 0.3, 0.7542, 0.775, 0.8, 1]),
  };
  const mehPupil = {
    animate: { scaleY: [1, 0.94, 0.94], x: [0, -9, -9, 9, 9, 0, -4, 0, 0], y: [0, -2, -2, 1, 1, 0, 3, 0, 0] },
    transition: {
      scaleY: loopTimes(4.8, [0, 0.1458, 1]),
      x: loopTimes(4.8, [0, 0.1354, 0.2292, 0.3646, 0.5104, 0.6354, 0.7396, 0.8646, 1]),
      y: loopTimes(4.8, [0, 0.1354, 0.2292, 0.3646, 0.5104, 0.6354, 0.7396, 0.8646, 1]),
    },
  };

  return (
    <>
      <Cloud name="mh-cloud-1" box={inset(0, -30.03, 78.4, 54.09)} reduced={reduced} fromX={320} duration={4.8} times={[0, 0.0875, 0.4, 1]} flipX />
      <Cloud name="mh-cloud-2" box={inset(14.02, -15.52, 75.36, 78.18)} reduced={reduced} fromX={190} duration={4.8} times={[0, 0.0458, 0.3375, 1]} flipX />
      <Cloud name="mh-cloud-3" box={inset(3.14, 45.44, 65.77, -31.59)} reduced={reduced} fromX={-250} duration={4.8} times={[0, 0.025, 0.3021, 1]} rotate={-18.36} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 141,
          width: 440,
          height: 815,
          overflow: "hidden",
          borderRadius: "220px 220px 0 0",
          background: "linear-gradient(to bottom, #171b20, #2b3037)",
        }}
      >
        <Layer name="mh-sprout" {...box(181, -55, 78, 74)} reduced={reduced} />
        <Eyes left={126} top={105} eye="mh-eye" pupilL="mh-pupil-l" pupilR="mh-pupil-r" reduced={reduced} blink={mehBlink} wander={mehPupil} />
        <motion.div
          style={{ position: "absolute", left: 155, top: 238, width: 130, height: 48, borderRadius: 140, background: "#151515", transformOrigin: "center" }}
          animate={reduced ? undefined : { scaleY: [1, 1.04, 1, 1.04, 1], y: [0, -0.96, 0, -0.96, 0] }}
          transition={loopTimes(4.8, [0, 0.25, 0.5, 0.75, 1], [0.45, 0, 0.55, 1])}
        />
      </div>
    </>
  );
}

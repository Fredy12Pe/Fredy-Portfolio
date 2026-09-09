"use client";

import { motion } from "framer-motion";
import SunBurst from "../SunBurst";
import { loopTimes, springA, springB } from "../motion";
import { Layer, MouthFill, Pos, Tooth, asset, box } from "../primitives";

export default function Happy({ reduced }: { reduced?: boolean }) {
  const bounce = loopTimes(1.6, [0, 0.175, 0.325, 0.475, 0.638, 0.8, 1], [springA, "easeInOut", springA, "easeInOut", springB, "easeOut"]);

  return (
    <>
      <motion.div
        style={{ position: "absolute", left: -139, top: 134.58, width: 332, height: 203, transformOrigin: "top left" }}
        initial={false}
        animate={
          reduced
            ? { rotate: -18.36 }
            : {
                rotate: [-18.36, -18.66, -16.86, -19.56, -17.46, -18.96, -18.06, -18.36, -18.36],
                x: [0, 1.8, -9, 7.2, -5.4, 3.6, -1.8, 0, 0],
              }
        }
        transition={loopTimes(1.2, [0, 0.083, 0.183, 0.283, 0.383, 0.483, 0.583, 0.7, 1], ["easeInOut", [0.45, 1.45, 0.8, 1], springA, springA, springA, springA, "easeInOut", "linear"])}
      >
        <img alt="" src={asset("hp-cloud")} draggable={false} style={{ width: 332, height: 203, display: "block" }} />
      </motion.div>
      <SunBurst
        reduced={reduced}
        color="#fee081"
        left={285}
        top={-38}
        disc={{ left: 333.54, top: 10.54, size: 92.93, src: asset("hp-sun") }}
      />
      <motion.div
        style={{ position: "absolute", left: -18.11, top: 99.57, width: 475.11, height: 866.43, transformOrigin: "center 80%" }}
        animate={reduced ? undefined : { scaleX: [1, 0.98, 1.04, 0.99, 1.02, 1, 1], scaleY: [1, 1.025, 0.96, 1.015, 0.98, 1.005, 1], y: [0, -18, 0, -10, 0, -4, 0] }}
        transition={bounce}
      >
        <Layer
          name="hp-headpiece"
          {...box(125.37, 0, 143.33, 134.71)}
          reduced={reduced}
          animate={reduced ? undefined : { rotate: [6.76, 13.76, 0.76, 10.76, 3.76, 8.26, 6.76] }}
          transition={loopTimes(1.6, [0, 0.138, 0.3, 0.45, 0.625, 0.8, 1], [springA, springB, springB, springB, springB, "easeOut"])}
        />
        <Layer name="hp-body" {...box(0, 90.95, 475.11, 775.48)} reduced={reduced} />
        <Pos left={116.24} top={144.6} width={207.64} height={123.18}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 196.07,
              height: 98.04,
              display: "flex",
              alignItems: "center",
              transform: "translate(-50%, -50%) rotate(-7.13deg)",
              transformOrigin: "center",
            }}
          >
            <img alt="" src={asset("hp-eye-l")} draggable={false} style={{ width: 98.04, height: 98.04, flex: "none" }} />
            <img alt="" src={asset("hp-eye-r")} draggable={false} style={{ width: 98.04, height: 98.04, flex: "none" }} />
          </div>
        </Pos>
        <motion.div
          style={{ position: "absolute", left: 138.17, top: 264.68, width: 184.87, height: 115.74, transformOrigin: "center" }}
          animate={reduced ? undefined : { scaleX: [1, 1.055, 1, 1.035, 1, 1], scaleY: [1, 1.07, 1, 1.045, 1, 1] }}
          transition={loopTimes(1.6, [0, 0.15, 0.313, 0.488, 0.675, 1], [springA, springB, springA, springB, "linear"])}
        >
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 176.89, height: 101.01, transform: "rotate(-4.9deg) scaleY(-1)", position: "relative" }}>
              <img alt="" src={asset("hp-mouth")} draggable={false} style={{ width: "100%", height: "100%", display: "block" }} />
              <img alt="" src={asset("hp-mouth-bg")} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              <MouthFill mask="hp-tongue-mask">
                <img
                  alt=""
                  src={asset("hp-tongue")}
                  draggable={false}
                  style={{ position: "absolute", left: 35, top: -97, width: 130, height: 142, display: "block" }}
                />
                <Tooth name="hp-tooth-2" left={53} top={69} rotate={175.1} />
                <Tooth name="hp-tooth-1" left={86} top={72} rotate={175.1} />
              </MouthFill>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

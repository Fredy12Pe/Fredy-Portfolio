"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./bedroom.module.css";
import { useStageScale } from "./useStageScale";

const LIGHT_BTN = {
  off: "/projects/aarhus/wardrobe/light-btn-off.svg",
  on: "/projects/aarhus/wardrobe/light-btn-on.svg",
} as const;

export const HEADBOARDS = ["walnut", "upholstered"] as const;
export type Headboard = (typeof HEADBOARDS)[number];
export type Lamp = "off" | "on";
export type BedState = `${Headboard}-${Lamp}`;

export const BED_STATES: BedState[] = HEADBOARDS.flatMap((headboard) =>
  (["off", "on"] as const).map((lamp) => `${headboard}-${lamp}` as BedState),
);

const FADE_SECONDS = 0.22;
const FADE_EASE = [0.45, 0.05, 0.2, 1] as const;

export function bedRender(state: BedState) {
  return `/projects/aarhus/bedroom/${state}.webp`;
}

export function bedThumb(state: BedState) {
  return `/projects/aarhus/bedroom/${state}-thumb.webp`;
}

export default function BedroomStage({
  headboard,
  lampOn,
  onLampChange,
}: {
  headboard: Headboard;
  lampOn: boolean;
  onLampChange: (on: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const rootRef = useStageScale();
  const target: BedState = `${headboard}-${lampOn ? "on" : "off"}`;

  const [frame, setFrame] = useState<BedState>(target);
  const [settled, setSettled] = useState<BedState>(target);
  const frameRef = useRef<BedState>(target);
  const queue = useRef<BedState[]>([]);

  const playNext = useCallback(() => {
    const next = queue.current.shift();
    if (!next) {
      return;
    }
    frameRef.current = next;
    setFrame(next);
  }, []);

  useEffect(() => {
    const from = frameRef.current;
    if (from === target) {
      queue.current = [];
      return;
    }

    queue.current = [target];
    playNext();
  }, [target, playNext]);

  useEffect(() => {
    if (reduceMotion) {
      setSettled(frame);
    }
  }, [frame, reduceMotion]);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.scene}>
        <div className={styles.layer} aria-hidden>
          <img src={bedRender(settled)} alt="" width={840} height={680} draggable={false} />
        </div>

        {frame !== settled ? (
          <motion.div
            key={frame}
            className={styles.layer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: FADE_SECONDS, ease: FADE_EASE }}
            onAnimationComplete={() => {
              if (frameRef.current !== frame) {
                return;
              }
              setSettled(frame);
              playNext();
            }}
            aria-hidden
          >
            <img src={bedRender(frame)} alt="" width={840} height={680} draggable={false} />
          </motion.div>
        ) : null}

        <button
          type="button"
          className={styles.lightBtn}
          aria-label={lampOn ? "Turn off bedside lamp" : "Turn on bedside lamp"}
          aria-pressed={lampOn}
          onClick={() => onLampChange(!lampOn)}
        >
          <span className={styles.lightBtnBubble} aria-hidden>
            <img
              src={lampOn ? LIGHT_BTN.on : LIGHT_BTN.off}
              alt=""
              width={40}
              height={40}
              draggable={false}
            />
          </span>
          <span className={styles.lampPopup} aria-hidden>
            {lampOn ? "Turn off lamp" : "Turn on lamp"}
          </span>
        </button>

        <div className={styles.preload} aria-hidden>
          {BED_STATES.map((state) => (
            <img key={state} src={bedRender(state)} alt="" width={1} height={1} />
          ))}
        </div>
      </div>
    </div>
  );
}

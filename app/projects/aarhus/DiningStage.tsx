"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./dining.module.css";
import { useStageScale } from "./useStageScale";

export const TOPS = ["walnut", "stone"] as const;
export const SEATS = ["4", "8"] as const;

export type TableTop = (typeof TOPS)[number];
export type SeatCount = (typeof SEATS)[number];
export type DiningState = `${TableTop}-${SeatCount}`;
export type DiningImage = DiningState | `${TableTop}-6`;

export const DINING_STATES: DiningState[] = TOPS.flatMap((top) =>
  SEATS.map((seats) => `${top}-${seats}` as DiningState),
);

const FADE_SECONDS = 0.22;
const FADE_EASE = [0.45, 0.05, 0.2, 1] as const;

export function diningRender(state: DiningImage) {
  return `/projects/aarhus/dining/${state}.png`;
}

export default function DiningStage({
  top,
  seats,
}: {
  top: TableTop;
  seats: SeatCount;
}) {
  const reduceMotion = useReducedMotion();
  const rootRef = useStageScale();
  const target: DiningState = `${top}-${seats}`;

  const [frame, setFrame] = useState<DiningState>(target);
  const [settled, setSettled] = useState<DiningState>(target);
  const frameRef = useRef<DiningState>(target);
  const queue = useRef<DiningState[]>([]);

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
          <img
            src={diningRender(settled)}
            alt=""
            width={840}
            height={680}
            draggable={false}
          />
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
            <img
              src={diningRender(frame)}
              alt=""
              width={840}
              height={680}
              draggable={false}
            />
          </motion.div>
        ) : null}

        <div className={styles.preload} aria-hidden>
          {DINING_STATES.map((state) => (
            <img key={state} src={diningRender(state)} alt="" width={1} height={1} />
          ))}
        </div>
      </div>
    </div>
  );
}

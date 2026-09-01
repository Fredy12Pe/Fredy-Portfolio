"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./center-console.module.css";
import StageImage from "./StageImage";
import { useIdlePrefetch } from "./useIdlePrefetch";
import { useStageScale } from "./useStageScale";

const LIGHT_BTN = {
  off: "/projects/aarhus/wardrobe/light-btn-off.svg",
  on: "/projects/aarhus/wardrobe/light-btn-on.svg",
} as const;

const ROWS = ["closed", "open", "light"] as const;
const SLOTS = ["2door", "middle", "3door"] as const;

type ConsoleRow = (typeof ROWS)[number];
type ConsoleSlot = (typeof SLOTS)[number];

export type ConsoleState = `${ConsoleRow}-${ConsoleSlot}`;

/** "middle" is the in-between keyframe, so it is not selectable on its own. */
export type ConsoleConfig = Exclude<ConsoleSlot, "middle">;

export const CONSOLE_STATES: ConsoleState[] = ROWS.flatMap((row) =>
  SLOTS.map((slot) => `${row}-${slot}` as ConsoleState),
);

const FADE_SECONDS = 0.22;
const FADE_EASE = [0.45, 0.05, 0.2, 1] as const;

export function consoleRender(state: ConsoleState) {
  return `/projects/aarhus/console/${state}.webp`;
}

function slotOf(state: ConsoleState) {
  return state.slice(state.indexOf("-") + 1) as ConsoleSlot;
}

export default function CenterConsoleStage({
  config,
  opened,
  onOpenedChange,
  ledOn,
  onLedChange,
}: {
  config: ConsoleConfig;
  opened: boolean;
  onOpenedChange: (open: boolean) => void;
  ledOn: boolean;
  onLedChange: (on: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [playTv, setPlayTv] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const { ref: rootRef, scaled } = useStageScale();
  const row: ConsoleRow = !opened ? "closed" : ledOn ? "light" : "open";
  const target: ConsoleState = `${row}-${config}`;
  const ready = scaled && heroReady;
  useIdlePrefetch(
    CONSOLE_STATES.filter((state) => state !== target).map(consoleRender),
    ready,
  );

  const [frame, setFrame] = useState<ConsoleState>(target);
  // The settled layer stays opaque while the next frame dissolves in over it,
  // so the room never dips toward the empty stage mid-transition.
  const [settled, setSettled] = useState<ConsoleState>(target);
  const frameRef = useRef<ConsoleState>(target);
  // Frames still to play. Each one starts only once the previous fade has
  // finished, so a step can never cut the frame before it short.
  const queue = useRef<ConsoleState[]>([]);

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

    // Swapping door count morphs through the middle keyframe; opening the doors
    // or lighting the interior is a straight swap within the same row.
    const morphing = slotOf(from) !== config && !reduceMotion;
    const path: ConsoleState[] = morphing ? [`${row}-middle`, target] : [target];

    // Never queue the frame already on screen, or the chain would stall waiting
    // for a fade that has nothing to animate.
    queue.current = path.filter((entry) => entry !== from);
    playNext();
  }, [target, row, config, reduceMotion, playNext]);

  useEffect(() => {
    if (reduceMotion) {
      setSettled(frame);
    }
  }, [frame, reduceMotion]);

  useEffect(() => {
    if (!reduceMotion) {
      setPlayTv(true);
    }
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className={styles.root} data-ready={ready ? "true" : undefined}>
      <div className={styles.scene}>
        <div className={styles.layer} aria-hidden>
          <StageImage
            src={consoleRender(settled)}
            alt=""
            width={840}
            height={680}
            draggable={false}
            fetchPriority="high"
            decoding="async"
            onReady={() => setHeroReady(true)}
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
            <img src={consoleRender(frame)} alt="" width={840} height={680} draggable={false} />
          </motion.div>
        ) : null}

        <div className={styles.tv} aria-hidden>
          <div className={styles.tvScreen}>
            <video
              className={styles.tvVideo}
              poster="/projects/aarhus/console/tv-poster.webp"
              autoPlay={playTv}
              muted
              loop
              playsInline
              preload={playTv ? "metadata" : "none"}
              disablePictureInPicture
            >
              <source src="/projects/aarhus/console/tv.mp4" type="video/mp4" />
            </video>
          </div>
          <img
            className={styles.tvGlow}
            src="/projects/aarhus/console/tv-glow.svg"
            alt=""
            draggable={false}
          />
        </div>

        <button
          type="button"
          className={`${styles.hotspot} ${opened ? styles.hotspotClose : ""}`}
          aria-label={opened ? "Close cabinet doors" : "Open cabinet doors"}
          aria-pressed={opened}
          onClick={() => onOpenedChange(!opened)}
        >
          <span className={styles.hotspotBubble} aria-hidden>
            <span className={styles.hotspotRing} />
            <span className={styles.hotspotDot} />
          </span>
          <span className={styles.openPopup} aria-hidden>
            {opened ? "Close cabinet" : "Open cabinet"}
          </span>
        </button>

        {opened ? (
          <button
            type="button"
            className={styles.lightBtn}
            aria-label={ledOn ? "Turn off interior light" : "Turn on interior light"}
            aria-pressed={ledOn}
            onClick={() => onLedChange(!ledOn)}
          >
            <span className={styles.lightBtnBubble} aria-hidden>
              <img
                src={ledOn ? LIGHT_BTN.on : LIGHT_BTN.off}
                alt=""
                width={40}
                height={40}
                draggable={false}
              />
            </span>
          </button>
        ) : null}

      </div>
    </div>
  );
}

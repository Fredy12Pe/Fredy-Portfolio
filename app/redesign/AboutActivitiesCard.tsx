"use client";

import Image from "next/image";
import { motion, type Transition } from "motion/react";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

/** Bottom-left card — 759×502 at (120, 1476) */
const CARD = { w: 759, h: 502 } as const;
/** Item frame height in design px (icon + label). */
const ITEM_H = 120;
/**
 * Idle accent circle — centered, half-cropped by the card bottom.
 * Color matches activity icon discs (#99ef08). Desktop only (hidden on mobile).
 */
const ACCENT = { size: 500, left: (CARD.w - 500) / 2, top: 220 } as const;
/** Bust cache after re-exporting Figma assets. */
const ASSET_V = "3";
/** App icon frame (172:237) — 90×90; art overflows and clips */
const APP_ICON = { w: 90, h: 90 } as const;
/** Nested art — 117.61×105.34 at (−12.27, −7.16) */
const APP_ICON_ART = { left: -12.27, top: -7.16, w: 117.61, h: 105.34 } as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
/** Per-icon pop — a bit more bounce than the shared card spring. */
const ITEM_POP_SPRING = { type: "spring", duration: 0.45, bounce: 0.45 } as const;
const ITEM_POP_SCALE = 1.12;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

/**
 * Figma motion (loop timeline adapted to hover):
 * Rest = t=0 offsets; hover holds end pose (static frame left/top).
 * Offsets as % of each item’s own size so they scale with the card.
 * Easing in Figma was cubic-bezier(0.22, 1, 0.36, 1) over ~600ms — mapped to shared hover spring + stagger delays.
 */
const ACTIVITIES = [
  {
    id: "174:301",
    name: "Surfing",
    left: 132,
    top: 190,
    width: 90,
    icon: "/images/redesign/about/activities/surfing.svg",
    iconW: 30,
    iconH: 32,
    iconNodeId: "174:285",
    // start (2, 190) → end (132, 190); delay 120ms
    rest: { x: `${((2 - 132) / 90) * 100}%`, y: 0, opacity: 0 },
    delay: 0.12,
  },
  {
    id: "174:302",
    name: "Running",
    left: 334,
    top: 190,
    width: 90,
    icon: "/images/redesign/about/activities/running.png",
    iconW: 40,
    iconH: 40,
    iconNodeId: "174:287",
    // start (454, 190) → end (334, 190); delay 0
    rest: { x: `${((454 - 334) / 90) * 100}%`, y: 0, opacity: 0 },
    delay: 0,
  },
  {
    id: "174:304",
    name: "Reading",
    left: 536,
    top: 190,
    width: 90,
    icon: "/images/redesign/about/activities/reading.png",
    iconW: 40,
    iconH: 40,
    iconNodeId: "174:291",
    // start (666, 190) → end (536, 190); delay 200ms
    rest: { x: `${((666 - 536) / 90) * 100}%`, y: 0, opacity: 0 },
    delay: 0.2,
  },
  {
    id: "174:303",
    name: "Music Production",
    left: 192,
    top: 332,
    width: 155,
    icon: "/images/redesign/about/activities/music.png",
    iconW: 40,
    iconH: 40,
    iconNodeId: "174:289",
    // Figma start y 452; push fully past card bottom (+2px buffer for AA)
    rest: { x: 0, y: `${((CARD.h - 332 + 2) / ITEM_H) * 100}%`, opacity: 0 },
    delay: 0.08,
  },
  {
    id: "174:305",
    name: "Faith",
    left: 439,
    top: 332,
    width: 90,
    icon: "/images/redesign/about/activities/church.png",
    iconW: 40,
    iconH: 40,
    iconNodeId: "174:293",
    rest: { x: 0, y: `${((CARD.h - 332 + 2) / ITEM_H) * 100}%`, opacity: 0 },
    delay: 0.28,
  },
] as const;

const END = { x: 0, y: 0, opacity: 1 } as const;

type AboutActivitiesCardProps = {
  className?: string;
};

export default function AboutActivitiesCard({ className }: AboutActivitiesCardProps) {
  const { active, reduced, handlers } = useCardHover({
    respectReducedMotion: false,
  });
  const spring = (reduced
    ? { duration: 0 }
    : active
      ? HOVER_SPRING
      : REST_TRANSITION) as Transition;

  /** How far to slide the accent so it clears the card bottom (as % of its own size). */
  const accentHoverY =
    ((CARD.h - ACCENT.top + ACCENT.size * 0.2) / ACCENT.size) * 100;

  return (
    <section
      className={`${styles.card} ${styles.aboutActivities} ${className ?? ""}`}
      aria-label="Activities"
      data-node-id="145:574"
      {...handlers}
      tabIndex={0}
    >
      {/* Copy — 307×92 at (42, 42), gap 8 */}
      <div
        className={styles.aboutActivitiesCopy}
        data-node-id="172:251"
        style={{
          left: pct(42, CARD.w),
          top: pct(42, CARD.h),
          width: pct(307, CARD.w),
        }}
      >
        <h2 className={styles.aboutActivitiesTitle} data-node-id="172:238">
          ACTIVITIES
        </h2>
        <p className={styles.aboutActivitiesBody} data-node-id="172:240">
          Outside of design, these simple passions keep me inspired and balanced.
        </p>
      </div>

      {/* Activities app icon — 90×90 at (627, 42); art overflows & clips */}
      <div
        className={styles.aboutActivitiesIcon}
        data-node-id="172:237"
        data-name="Activities"
        style={{
          left: pct(627, CARD.w),
          top: pct(42, CARD.h),
          width: pct(APP_ICON.w, CARD.w),
          height: pct(APP_ICON.h, CARD.h),
        }}
      >
        <div
          className={styles.aboutActivitiesIconArt}
          style={{
            left: pct(APP_ICON_ART.left, APP_ICON.w),
            top: pct(APP_ICON_ART.top, APP_ICON.h),
            width: pct(APP_ICON_ART.w, APP_ICON.w),
            height: pct(APP_ICON_ART.h, APP_ICON.h),
          }}
        >
          <Image
            src={`/images/redesign/about/activities.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="120px"
            unoptimized
          />
        </div>
      </div>

      {/* Idle accent — desktop only; slides off on hover. Hidden on mobile. */}
      <motion.div
        className={styles.aboutActivitiesAccent}
        aria-hidden
        style={{
          left: pct(ACCENT.left, CARD.w),
          top: pct(ACCENT.top, CARD.h),
        }}
        initial={false}
        animate={{ y: active ? `${accentHoverY}%` : 0 }}
        transition={spring}
      />

      {ACTIVITIES.map((item) => (
        <motion.div
          key={item.id}
          className={styles.aboutActivitiesItem}
          data-node-id={item.id}
          style={{
            left: pct(item.left, CARD.w),
            top: pct(item.top, CARD.h),
            width: pct(item.width, CARD.w),
            height: pct(ITEM_H, CARD.h),
            pointerEvents: active ? "auto" : "none",
          }}
          initial={false}
          animate={active ? END : item.rest}
          transition={
            (reduced
              ? { duration: 0 }
              : active
                ? { ...HOVER_SPRING, delay: item.delay }
                : REST_TRANSITION) as Transition
          }
        >
          <motion.div
            className={styles.aboutActivitiesItemInner}
            initial={false}
            whileHover={reduced ? undefined : { scale: ITEM_POP_SCALE }}
            transition={ITEM_POP_SPRING as Transition}
          >
            <div className={styles.aboutActivitiesCircle} aria-hidden>
              {/* Icon size vs 90 circle (Figma: 40×40 or surfing 30×32) */}
              <div
                className={styles.aboutActivitiesGlyph}
                data-node-id={item.iconNodeId}
                data-name={item.name}
                style={{
                  width: `${(item.iconW / 90) * 100}%`,
                  height: `${(item.iconH / 90) * 100}%`,
                }}
              >
                <Image
                  src={`${item.icon}?v=${ASSET_V}`}
                  alt=""
                  fill
                  sizes="40px"
                  unoptimized
                />
              </div>
            </div>
            <p className={styles.aboutActivitiesLabel}>{item.name}</p>
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
}

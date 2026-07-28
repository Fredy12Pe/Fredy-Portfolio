"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import styles from "./redesign.module.css";

/** Bottom-right card — 900×502 at (899, 1476) */
const CARD = { w: 900, h: 502 } as const;
/**
 * Wheel column spans from left inset to just before the nav pills.
 * Buttons sit at x=820 so long labels have room.
 */
const FRAME = { left: 42, top: 94, w: 760, h: 400 } as const;
const WHEEL = { insetX: 16, top: 50, h: 300 } as const;
const BTN = { left: 820, w: 44, h: 70 } as const;

const SKILLS = [
  "User Experience",
  "User Interface",
  "Design Systems",
  "Information Architecture",
  "User Research",
  "Wireframing",
  "Rapid Prototyping",
  "Interaction Design",
  "Visual Design",
  "Front-End Development",
  "Motion Design",
  "Accessibility",
  "Product Thinking",
  "AI Workflows",
] as const;

/** Matches Figma mock — User Interface selected. */
const INITIAL_INDEX = 1;

const WHEEL_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;

/** Hold-to-repeat: delay before first repeat, then interval. */
const HOLD_DELAY_MS = 380;
const HOLD_INTERVAL_MS = 110;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

/** Row center Y in wheel coords for offsets −2…2 (Figma 192:226). */
function slotCenterY(offset: number): number {
  const table: Record<number, number> = {
    [-2]: 22,
    [-1]: 82,
    [0]: 150,
    [1]: 218,
    [2]: 278,
  };
  if (offset in table) return table[offset];
  if (offset < -2) return 22 + (offset + 2) * 60;
  return 278 + (offset - 2) * 60;
}

function slotStyle(offset: number) {
  const abs = Math.abs(offset);
  if (abs === 0) {
    return { fontSize: 34, fontWeight: 600, opacity: 1, height: 60 };
  }
  if (abs === 1) {
    return { fontSize: 24, fontWeight: 500, opacity: 0.5, height: 44 };
  }
  if (abs === 2) {
    return { fontSize: 20, fontWeight: 500, opacity: 0.2, height: 44 };
  }
  return { fontSize: 18, fontWeight: 500, opacity: 0, height: 44 };
}

type AboutSkillsCardProps = {
  className?: string;
};

export default function AboutSkillsCard({ className }: AboutSkillsCardProps) {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(INITIAL_INDEX);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  const clearHold = () => {
    if (holdRef.current != null) {
      clearTimeout(holdRef.current);
      holdRef.current = null;
    }
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => () => clearHold(), []);

  const step = (delta: number) => {
    setIndex((prev) => {
      const next = prev + delta;
      if (next < 0 || next >= SKILLS.length) return prev;
      return next;
    });
  };

  const startHold = (delta: number) => {
    clearHold();
    step(delta);
    holdRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const cur = indexRef.current;
        const next = cur + delta;
        if (next < 0 || next >= SKILLS.length) {
          clearHold();
          return;
        }
        setIndex(next);
      }, HOLD_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  };

  const canUp = index > 0;
  const canDown = index < SKILLS.length - 1;
  const wheelW = FRAME.w - WHEEL.insetX * 2;

  return (
    <section
      className={`${styles.card} ${styles.aboutSkills} ${className ?? ""}`}
      aria-label="Skills"
      data-node-id="145:573"
      data-name="Fredy - Portfolio - Skills"
    >
      <div className={styles.aboutSkillsScene}>
        <h2 className={styles.aboutSkillsTitle} data-node-id="191:460">
          SKILLS
        </h2>

        <div
          className={styles.aboutSkillsWheelFrame}
          data-node-id="192:223"
          data-name="ios-card"
          style={{
            left: pct(FRAME.left, CARD.w),
            top: pct(FRAME.top, CARD.h),
            width: pct(FRAME.w, CARD.w),
            height: pct(FRAME.h, CARD.h),
          }}
        >
          <div
            className={styles.aboutSkillsPill}
            data-node-id="192:225"
            data-name="selector-pill"
            aria-hidden
            style={{
              left: pct(12, FRAME.w),
              top: pct(170, FRAME.h),
              width: pct(FRAME.w - 24, FRAME.w),
              height: pct(60, FRAME.h),
            }}
          />

          <div
            className={styles.aboutSkillsWheel}
            data-node-id="192:226"
            data-name="skills-wheel"
            role="listbox"
            aria-label="Skills picker"
            aria-activedescendant={`skill-${index}`}
            style={{
              left: pct(WHEEL.insetX, FRAME.w),
              top: pct(WHEEL.top, FRAME.h),
              width: pct(wheelW, FRAME.w),
              height: pct(WHEEL.h, FRAME.h),
            }}
          >
            {SKILLS.map((skill, i) => {
              const offset = i - index;
              if (Math.abs(offset) > 3) return null;
              const style = slotStyle(offset);
              const centerY = slotCenterY(offset);
              const top = centerY - style.height / 2;

              return (
                <motion.div
                  key={skill}
                  id={`skill-${i}`}
                  role="option"
                  aria-selected={offset === 0}
                  className={styles.aboutSkillsItem}
                  initial={false}
                  animate={{
                    top: pct(top, WHEEL.h),
                    height: pct(style.height, WHEEL.h),
                    opacity: style.opacity,
                  }}
                  transition={
                    reduced
                      ? ({ duration: 0 } as Transition)
                      : (WHEEL_SPRING as Transition)
                  }
                >
                  <FitLabel
                    text={skill}
                    maxFontPx={style.fontSize}
                    fontWeight={style.fontWeight}
                    designCardW={CARD.w}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className={styles.aboutSkillsBtn}
          aria-label="Previous skill"
          disabled={!canUp}
          data-node-id="191:451"
          style={{
            left: pct(BTN.left, CARD.w),
            top: pct(209, CARD.h),
            width: pct(BTN.w, CARD.w),
            height: pct(BTN.h, CARD.h),
          }}
          onPointerDown={(e) => {
            if (e.button !== 0 || !canUp) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            startHold(-1);
          }}
          onPointerUp={clearHold}
          onPointerCancel={clearHold}
          onLostPointerCapture={clearHold}
        >
          <ArrowIcon direction="up" />
        </button>

        <button
          type="button"
          className={styles.aboutSkillsBtn}
          aria-label="Next skill"
          disabled={!canDown}
          data-node-id="191:454"
          style={{
            left: pct(BTN.left, CARD.w),
            top: pct(309, CARD.h),
            width: pct(BTN.w, CARD.w),
            height: pct(BTN.h, CARD.h),
          }}
          onPointerDown={(e) => {
            if (e.button !== 0 || !canDown) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            startHold(1);
          }}
          onPointerUp={clearHold}
          onPointerCancel={clearHold}
          onLostPointerCapture={clearHold}
        >
          <ArrowIcon direction="down" />
        </button>
      </div>

      <span className={styles.aboutSkillsLive} aria-live="polite">
        {SKILLS[index]}
      </span>
    </section>
  );
}

/**
 * Sets an explicit font-size that fits the row width.
 * Uses real layout measurement (not transform scale) so overflow:hidden
 * parents can't clip glyphs, and re-runs after webfonts load.
 */
function FitLabel({
  text,
  maxFontPx,
  fontWeight,
  designCardW,
}: {
  text: string;
  maxFontPx: number;
  fontWeight: number;
  designCardW: number;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const label = labelRef.current;
    if (!wrap || !label) return;

    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      const available = wrap.clientWidth;
      if (available <= 0) return;

      // Ideal size tracks the card scale (design px → rendered px).
      const cardW = wrap.closest(`.${styles.aboutSkills}`)?.clientWidth ?? available;
      const ideal = (maxFontPx / designCardW) * cardW;
      const min = ideal * 0.45;

      let lo = min;
      let hi = ideal;
      let best = min;

      // Binary search the largest size that fits with a little breathing room.
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        label.style.fontSize = `${mid}px`;
        if (label.scrollWidth <= available - 2) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }

      label.style.fontSize = `${best}px`;
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    const fontsReady =
      typeof document !== "undefined" && document.fonts?.ready
        ? document.fonts.ready.then(fit)
        : null;

    return () => {
      cancelled = true;
      ro.disconnect();
      void fontsReady;
    };
  }, [text, maxFontPx, fontWeight, designCardW]);

  return (
    <span ref={wrapRef} className={styles.aboutSkillsFit}>
      <span
        ref={labelRef}
        className={styles.aboutSkillsLabel}
        style={{ fontWeight }}
      >
        {text}
      </span>
    </span>
  );
}

function ArrowIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      className={`${styles.aboutSkillsArrow}${direction === "down" ? ` ${styles.aboutSkillsArrowDown}` : ""}`}
      viewBox="0 0 10 18"
      width="10"
      height="18"
      aria-hidden
    >
      <path
        d="M1 5.5 L5 1.5 L9 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 5.5 V16.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

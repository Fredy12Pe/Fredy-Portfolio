"use client";

import { type PointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  type Transition,
} from "motion/react";
import { CONTACT_LINKS } from "./contact-links";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

/** Figma Frame 333 (248:1305) — 458×543 */
const CARD = { w: 458, h: 543 } as const;
/** Portrait frame 248:1306 — used so pan stays inside the scaled overflow. */
const PORTRAIT = { w: 367, h: 459 } as const;

/** Bust Next/Image cache after re-exporting Figma assets. */
const ASSET_V = "4";

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
const hoverSpring = (delay = 0) => ({ ...HOVER_SPRING, delay });
/** Soft follow for pointer-driven parallax (separate from enter/leave spring). */
const PARALLAX_SPRING = { stiffness: 140, damping: 28, mass: 0.7 } as const;

/**
 * Hover grow leaves overflow room for the pan.
 * Shift is a fraction of the portrait box; rotate is degrees at the card edge.
 */
const PORTRAIT_HOVER_SCALE = 1.05;
const PARALLAX = {
  maxRotateX: 3.5,
  maxRotateY: 4.5,
  shift: 0.022,
} as const;

const REST = {
  portrait: { scale: 1 },
  blur: { scale: 1 },
  copy: { x: "-50%", y: "-50%", opacity: 0.88 },
  resume: { y: "0%", scale: 1 },
} as const;

const HOVER = {
  portrait: {
    transition: hoverSpring(0),
  },
  blur: {
    animate: { scale: 1.12 },
    transition: hoverSpring(0.03),
  },
  copy: {
    animate: { x: "-50%", y: "-50%", opacity: 1 },
    transition: hoverSpring(0.04),
  },
  resume: {
    animate: { y: "-6%", scale: 1.02 },
    transition: hoverSpring(0.06),
  },
} as const;

/** Arrow-only bounce while the card is hovered (tray stays put). */
const ARROW_BOUNCE = {
  transition: { duration: 0.72, repeat: Infinity, ease: "easeInOut" },
} as const;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type FredyCardProps = {
  className?: string;
};

export default function FredyCard({ className }: FredyCardProps) {
  const { active, reduced, isMobile, hovered, handlers } = useCardHover();
  const bounceArrow = hovered && !reduced && !isMobile;
  const spring = (hover: { transition: Transition }) =>
    (active ? hover.transition : REST_TRANSITION) as Transition;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);
  const rotateX = useSpring(rawRotateX, PARALLAX_SPRING);
  const rotateY = useSpring(rawRotateY, PARALLAX_SPRING);

  const resetParallax = () => {
    rawX.set(0);
    rawY.set(0);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
    const portraitW = rect.width * (PORTRAIT.w / CARD.w);
    const portraitH = rect.height * (PORTRAIT.h / CARD.h);
    rawX.set(nx * portraitW * PARALLAX.shift);
    rawY.set(ny * portraitH * PARALLAX.shift);
    rawRotateY.set(nx * PARALLAX.maxRotateY);
    rawRotateX.set(-ny * PARALLAX.maxRotateX);
  };

  return (
    <section
      className={`${styles.card} ${styles.intro} ${className ?? ""}`}
      aria-label="About Fredy"
      data-node-id="248:1305"
      tabIndex={0}
      onPointerEnter={handlers.onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        handlers.onPointerLeave();
        resetParallax();
      }}
      onFocus={handlers.onFocus}
      onBlur={() => {
        handlers.onBlur();
        resetParallax();
      }}
    >
      <div className={styles.introScene}>
        <motion.div
          className={styles.introPortrait}
          data-node-id="248:1306"
          data-name="Fredy-085 2"
          style={{
            left: pct(91, CARD.w),
            top: pct(6, CARD.h),
            width: pct(367, CARD.w),
            height: pct(459, CARD.h),
            rotateX,
            rotateY,
          }}
        >
          <motion.div
            className={styles.introPortraitArt}
            style={{ x, y }}
            initial={REST.portrait}
            animate={
              active
                ? { scale: isMobile ? 1.03 : PORTRAIT_HOVER_SCALE }
                : REST.portrait
            }
            transition={spring(HOVER.portrait)}
          >
            <Image
              src={`/images/redesign/fredy/portrait.png?v=${ASSET_V}`}
              alt="Fredy playing guitar"
              fill
              sizes="40vw"
              unoptimized
              priority
              className={styles.introPortraitImg}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.introBlur}
          data-node-id="248:1307"
          style={{
            left: pct((CARD.w - 1000) / 2, CARD.w),
            top: pct(306, CARD.h),
            width: pct(1000, CARD.w),
            height: pct(1000, CARD.h),
          }}
          initial={REST.blur}
          animate={active ? HOVER.blur.animate : REST.blur}
          transition={spring(HOVER.blur)}
        />

        <motion.p
          className={styles.introCopy}
          data-node-id="248:1312"
          initial={REST.copy}
          animate={active ? HOVER.copy.animate : REST.copy}
          transition={spring(HOVER.copy)}
        >
          Fredy is a UI/UX Designer &amp; Front-End
          <br />
          Developer creating intuitive, visually
          <br />
          engaging digital products from
          <br />
          concept to code.
        </motion.p>

        <motion.a
          className={styles.introResume}
          href={CONTACT_LINKS.resume}
          download="Fredy Pedro - Resume.pdf"
          data-node-id="248:1308"
          data-name="Link - Download resume"
          initial={REST.resume}
          animate={active ? HOVER.resume.animate : REST.resume}
          transition={spring(HOVER.resume)}
        >
          <span
            className={styles.introResumeIcon}
            data-node-id="248:1309"
            data-name="SVG"
          >
            <svg
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <motion.g
                initial={false}
                animate={bounceArrow ? { y: [0, -3.5, 0] } : { y: 0 }}
                transition={
                  bounceArrow ? ARROW_BOUNCE.transition : REST_TRANSITION
                }
              >
                <path
                  d="M9 3.5V11.5M12.25 8.25L9 11.5L5.75 8.25"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
              <path
                d="M3.5 14.5H14.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.introResumeLabel} data-node-id="248:1311">
            Download Resume
          </span>
        </motion.a>
      </div>
    </section>
  );
}

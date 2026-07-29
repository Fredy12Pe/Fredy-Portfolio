"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useSpring,
  type Transition,
} from "motion/react";
import { useCardHover, useIsMobileLayout } from "./useCardHover";
import styles from "./redesign.module.css";

const CARD = { w: 900, h: 720 } as const;
/** Bust cache after re-exporting Figma assets. */
const ASSET_V = "7";

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
/** Soft follow for pointer-driven parallax (separate from enter/leave spring). */
const PARALLAX_SPRING = { stiffness: 200, damping: 24, mass: 0.55 } as const;

/**
 * Shared tilt for the whole camera assembly (photo + body + LCD + borders + strap).
 * Rest = 0° (flat); hover = Figma design pose + mouse-follow parallax.
 * Locals are unrotated offsets so layers stay locked at every angle
 * (derived from Figma top-lefts via R_-θ around the camera origin).
 */
const TILT = 9.35;
/** Slight grow on hover — keeps the assembly readable without clipping the strap. */
const HOVER_SCALE = 1.045;
/** Extra 3D pitch/yaw from pointer (degrees at card edge). */
const PARALLAX = { maxRotateX: 12, maxRotateY: 14, maxShift: 18 } as const;

/**
 * Group placement — nudged left/down from Figma (92.11, 40) so the body
 * clears the Photos icon at (768, 42).
 */
const CAM = { x: 40, y: 100, w: 1001.78, h: 780 } as const;

/** Unrotated local positions inside CAM (see R_-θ derivation). */
const LOCAL = {
  photo: { x: 104.17, y: 82.17, w: 428.99, h: 343.19 },
  camera: { x: 0, y: 0, w: 749.64, h: 473.23 },
  lcd: { x: 110.39, y: 92.41, w: 411.62, h: 309.78 },
  borders: { x: 123.14, y: 100.61, w: 386.54, h: 294.03 },
  strap: { x: 86.59, y: 218.84, w: 835, h: 562 },
} as const;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type PhotoSlide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "color"; color: string; label: string };

const SLIDES: PhotoSlide[] = [
  {
    kind: "image",
    src: `/images/redesign/about/photos/fredy-1.jpg?v=${ASSET_V}`,
    alt: "Fredy smiling at a coastal overlook",
  },
  {
    kind: "image",
    src: `/images/redesign/about/photos/fredy-2.png?v=${ASSET_V}`,
    alt: "Fredy in a wetsuit carrying a surfboard",
  },
  {
    kind: "image",
    src: `/images/redesign/about/photos/fredy-3.png?v=${ASSET_V}`,
    alt: "Fredy sitting between large boulders under a clear sky",
  },
  {
    kind: "image",
    src: `/images/redesign/about/photos/fredy-4.png?v=${ASSET_V}`,
    alt: "Fredy playing a red electric guitar",
  },
];

type AboutPhotoCardProps = {
  className?: string;
};

export default function AboutPhotoCard({ className }: AboutPhotoCardProps) {
  const { active, reduced, handlers } = useCardHover();
  const isMobile = useIsMobileLayout();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index] ?? SLIDES[0];
  const count = SLIDES.length;
  const slideKey = slide.kind === "image" ? slide.src : slide.color;

  const tiltTransition = (active ? HOVER_SPRING : REST_TRANSITION) as Transition;
  const rotate = active ? TILT : 0;
  const scale = active ? HOVER_SCALE : 1;

  const rawRotateY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawShiftX = useMotionValue(0);
  const rawShiftY = useMotionValue(0);
  const rotateY = useSpring(rawRotateY, PARALLAX_SPRING);
  const rotateX = useSpring(rawRotateX, PARALLAX_SPRING);
  const shiftX = useSpring(rawShiftX, PARALLAX_SPRING);
  const shiftY = useSpring(rawShiftY, PARALLAX_SPRING);

  /** One-shot nudge on mobile prev/next — sits under tilt/parallax. */
  const shuffleX = useMotionValue(0);
  const shuffleY = useMotionValue(0);
  const shuffleRotate = useMotionValue(0);

  const resetParallax = () => {
    rawRotateY.set(0);
    rawRotateX.set(0);
    rawShiftX.set(0);
    rawShiftY.set(0);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
    rawRotateY.set(nx * PARALLAX.maxRotateY);
    rawRotateX.set(-ny * PARALLAX.maxRotateX);
    rawShiftX.set(nx * PARALLAX.maxShift);
    rawShiftY.set(ny * PARALLAX.maxShift);
  };

  const playShuffle = (dir: -1 | 1) => {
    if (!isMobile || reduced) return;
    const ease = "easeInOut" as const;
    const duration = 0.4;
    void animate(shuffleX, [0, dir * 14, dir * -8, dir * 4, 0], { duration, ease });
    void animate(shuffleY, [0, -6, 4, -2, 0], { duration, ease });
    void animate(shuffleRotate, [0, dir * 2.2, dir * -1.4, dir * 0.6, 0], {
      duration,
      ease,
    });
  };

  const go = (dir: -1 | 1) => {
    if (count < 2) return;
    setIndex((i) => (i + dir + count) % count);
    playShuffle(dir);
  };

  return (
    <section
      className={`${styles.card} ${styles.aboutPhoto} ${className ?? ""}`}
      aria-label="Photos"
      data-node-id="145:571"
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
      <div className={styles.aboutPhotoScene}>
        {/* Apple Photos icon — 90×90 at (768, 42); stays put */}
        <div
          className={styles.aboutPhotosIcon}
          data-node-id="145:581"
          data-name="Apple photos"
          style={{
            left: pct(768, CARD.w),
            top: pct(42, CARD.h),
            width: pct(90, CARD.w),
            height: pct(90, CARD.h),
          }}
        >
          <Image
            src={`/images/redesign/about/apple-photos.svg?v=${ASSET_V}`}
            alt=""
            fill
            sizes="90px"
            unoptimized
          />
        </div>

        {/* Full camera — base Figma tilt on hover + pointer parallax */}
        <motion.div
          className={styles.aboutPhotoCameraGroup}
          data-node-id="177:249"
          data-name="Camera Overlay"
          style={{
            left: pct(CAM.x, CARD.w),
            top: pct(CAM.y, CARD.h),
            width: pct(CAM.w, CARD.w),
            height: pct(CAM.h, CARD.h),
            x: shiftX,
            y: shiftY,
            rotateX,
            rotateY,
          }}
          initial={false}
          animate={{ rotate, scale }}
          transition={tiltTransition}
        >
          {/* Shuffle layer — mobile prev/next only; keeps tilt/parallax free */}
          <motion.div
            className={styles.aboutPhotoShuffle}
            style={{ x: shuffleX, y: shuffleY, rotate: shuffleRotate }}
          >
            {/* Photo behind LCD */}
            <div
              className={styles.aboutPhotoSlide}
              data-node-id="177:258"
              data-name="Fredy"
              style={{
                left: pct(LOCAL.photo.x, CAM.w),
                top: pct(LOCAL.photo.y, CAM.h),
                width: pct(LOCAL.photo.w, CAM.w),
                height: pct(LOCAL.photo.h, CAM.h),
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={slideKey}
                  className={styles.aboutPhotoSlideInner}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  {slide.kind === "image" ? (
                    <Image
                      className={styles.aboutPhotoImg}
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      priority
                      unoptimized
                    />
                  ) : (
                    <div
                      className={styles.aboutPhotoColorSlide}
                      style={{ background: slide.color }}
                      role="img"
                      aria-label={slide.label}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className={styles.aboutPhotoGrain} aria-hidden />
            </div>

            {/* Camera body — transparent LCD */}
            <div
              className={styles.aboutPhotoCamera}
              data-node-id="177:250"
              data-name="Exclude"
              style={{
                left: pct(LOCAL.camera.x, CAM.w),
                top: pct(LOCAL.camera.y, CAM.h),
                width: pct(LOCAL.camera.w, CAM.w),
                height: pct(LOCAL.camera.h, CAM.h),
              }}
            >
              <Image
                src={`/images/redesign/about/photos/camera.png?v=${ASSET_V}`}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>

            {/* LCD wash */}
            <div
              className={styles.aboutPhotoLcdGradient}
              data-node-id="177:253"
              data-name="Overlay"
              style={{
                left: pct(LOCAL.lcd.x, CAM.w),
                top: pct(LOCAL.lcd.y, CAM.h),
                width: pct(LOCAL.lcd.w, CAM.w),
                height: pct(LOCAL.lcd.h, CAM.h),
              }}
            />

            {/* Corner crop marks */}
            <div
              className={styles.aboutPhotoBorders}
              data-node-id="177:327"
              data-name="Borders"
              style={{
                left: pct(LOCAL.borders.x, CAM.w),
                top: pct(LOCAL.borders.y, CAM.h),
                width: pct(LOCAL.borders.w, CAM.w),
                height: pct(LOCAL.borders.h, CAM.h),
              }}
            >
              <Image
                src={`/images/redesign/about/photos/borders.svg?v=${ASSET_V}`}
                alt=""
                fill
                sizes="400px"
                unoptimized
              />
            </div>

            {/* Strap — tilts with camera so the cord stays attached */}
            <div
              className={styles.aboutPhotoStrap}
              data-node-id="177:333"
              data-name="Strap"
              style={{
                left: pct(LOCAL.strap.x, CAM.w),
                top: pct(LOCAL.strap.y, CAM.h),
                width: pct(LOCAL.strap.w, CAM.w),
                height: pct(LOCAL.strap.h, CAM.h),
              }}
            >
              <Image
                src={`/images/redesign/about/photos/strap.png?v=${ASSET_V}`}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                unoptimized
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Prev — overlays strap */}
        <button
          type="button"
          className={styles.aboutPhotoNav}
          data-node-id="177:325"
          style={{
            left: pct(18, CARD.w),
            top: pct(618, CARD.h),
            width: pct(98, CARD.w),
          }}
          onClick={() => go(-1)}
          disabled={count < 2}
          aria-label="Previous photo"
        >
          <span className={`${styles.aboutPhotoNavBtn} ${styles.aboutPhotoNavBtnPrev}`}>
            <span className={styles.aboutPhotoNavChevron} aria-hidden="true">
              <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.5 21L17.5 14L10.5 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
          <span className={styles.aboutPhotoNavLabel}>Prev</span>
        </button>

        {/* Next — overlays strap */}
        <button
          type="button"
          className={styles.aboutPhotoNav}
          data-node-id="177:326"
          style={{
            left: pct(140, CARD.w),
            top: pct(618, CARD.h),
            width: pct(98, CARD.w),
          }}
          onClick={() => go(1)}
          disabled={count < 2}
          aria-label="Next photo"
        >
          <span className={styles.aboutPhotoNavBtn}>
            <span className={styles.aboutPhotoNavChevron} aria-hidden="true">
              <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.5 21L17.5 14L10.5 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
          <span className={styles.aboutPhotoNavLabel}>Next</span>
        </button>
      </div>
    </section>
  );
}

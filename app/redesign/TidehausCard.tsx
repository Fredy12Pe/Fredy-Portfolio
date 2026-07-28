"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "motion/react";
import { getRedesignProject } from "./projects";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

const PROJECT = getRedesignProject("tidehaus");

const CARD = { w: 546, h: 437 } as const;
/** Desktop mockup (51:176) — 323×406 inside Frame 44 (73,93,401×192). */
const DESKTOP = { w: 323, h: 406 } as const;
/** Surfboard art (51:179) — 390×390 at (314.71, 337.89). */
const SURF = { w: 390.02, h: 390.02 } as const;
/** Snorkel art (51:182) — copy-as-code box with top-left origin. */
const SNORKEL = { w: 102.51, h: 102.51 } as const;

/** Bust Next/Image cache after re-exporting transparent Figma assets. */
const ASSET_V = "1";

const REST = {
  xy: { x: 0, y: 0 },
  snorkel: { rotate: -157.93, x: 0, y: 0 },
} as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
const hoverSpring = (delay = 0) => ({ ...HOVER_SPRING, delay });

const SURF_END_Y = `${(-196 / SURF.h) * 100}%`;
const SNORKEL_END_X = `${(73 / SNORKEL.w) * 100}%`;
const SNORKEL_END_Y = `${(21 / SNORKEL.h) * 100}%`;

const HOVER = {
  surfboard: {
    animate: { y: SURF_END_Y },
    transition: hoverSpring(0.08),
  },
  snorkel: {
    animate: { rotate: -171.019, x: SNORKEL_END_X, y: SNORKEL_END_Y },
    transition: HOVER_SPRING,
  },
};

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type TidehausCardProps = {
  className?: string;
};

export default function TidehausCard({ className }: TidehausCardProps) {
  const { active, handlers } = useCardHover();

  return (
    <Link
      href={PROJECT.href}
      className={`${styles.card} ${styles.tidehaus} ${className ?? ""}`}
      aria-label={`Open ${PROJECT.title} case study`}
      data-node-id="51:317"
      style={{
        ["--card-brand" as string]: PROJECT.brandColor,
        ["--card-brand-hover" as string]: PROJECT.brandHover ?? PROJECT.brandColor,
      }}
      {...handlers}
    >
      <div className={styles.tidehausScene}>
        <div className={styles.tidehausBg} />

        <div className={styles.tidehausText} data-node-id="51:172">
          <p className={styles.tidehausTitle} data-node-id="51:173">
            {PROJECT.title}
          </p>
          <p className={styles.tidehausTagline} data-node-id="51:174">
            {PROJECT.tagline}
          </p>
        </div>

        {/* Desktop mockup Frame 44 (51:175) — clips Tidehaus Desktop 1 (51:176). */}
        <div
          className={styles.tidehausDesktopFrame}
          data-node-id="51:175"
          data-name="Frame 44"
          style={{
            left: pct(73, CARD.w),
            top: pct(93, CARD.h),
            width: pct(401, CARD.w),
            height: pct(192, CARD.h),
          }}
        >
          <div
            className={styles.tidehausDesktopArt}
            data-node-id="51:176"
            data-name="Tidehaus Desktop 1"
            style={{
              left: pct(39, 401),
              top: 0,
              width: pct(DESKTOP.w, 401),
              height: pct(DESKTOP.h, 192),
            }}
          >
            <Image
              src={`/images/redesign/tidehaus/desktop.png?v=${ASSET_V}`}
              alt=""
              fill
              sizes="40vw"
              className="object-cover object-top"
              unoptimized
            />
          </div>
        </div>

        {/* Surfboard 51:177 / image 51:179 — slides up −196 design-px on hover.
            Mask rect ignored; card overflow + transparent raw PNG clip the tip. */}
        <motion.div
          className={styles.tidehausLayer}
          data-node-id="51:177"
          data-name="Surfboard"
          style={{
            left: pct(314.71, CARD.w),
            top: pct(337.89, CARD.h),
            width: pct(SURF.w, CARD.w),
            height: pct(SURF.h, CARD.h),
            zIndex: 3,
          }}
          initial={REST.xy}
          animate={active ? HOVER.surfboard.animate : REST.xy}
          transition={(active ? HOVER.surfboard.transition : REST_TRANSITION) as Transition}
        >
          <Image
            src={`/images/redesign/tidehaus/surfboard.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="40vw"
            className="object-contain"
            unoptimized
          />
        </motion.div>

        {/* Snorkel 51:180 / image 51:182 — copy-as-code top-left origin; rotate+translate on hover.
            Motion owns rotate (no CSS rotate on the motion node). */}
        <motion.div
          className={styles.tidehausSnorkel}
          data-node-id="51:180"
          data-name="Snorkel"
          style={{
            left: pct(18.24, CARD.w),
            top: pct(227.19, CARD.h),
            width: pct(SNORKEL.w, CARD.w),
            height: pct(SNORKEL.h, CARD.h),
            zIndex: 4,
          }}
          initial={REST.snorkel}
          animate={active ? HOVER.snorkel.animate : REST.snorkel}
          transition={(active ? HOVER.snorkel.transition : REST_TRANSITION) as Transition}
        >
          <Image
            src={`/images/redesign/tidehaus/snorkel.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="15vw"
            className="object-contain"
            unoptimized
          />
        </motion.div>
      </div>
    </Link>
  );
}

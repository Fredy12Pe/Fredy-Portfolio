"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "motion/react";
import { getRedesignProject } from "./projects";
import { useProjectCardNav } from "./useCardHover";
import styles from "./redesign.module.css";

const PROJECT = getRedesignProject("selah");

const CARD = { w: 547, h: 553 } as const;
/** Selah 1 (51:515 / 51:364) — home screen, static. */
const PHONE_1 = { w: 200, h: 431 } as const;
/** Selah 2 (51:514 / 51:363) — scripture screen, slides in on hover. */
const PHONE_2 = { w: 203, h: 431 } as const;
const CROSS = { w: 99, h: 99 } as const;
const CROSS_VECTOR = { w: 59.4, h: 79.2, x: 19.8, y: 9.9 } as const;

/** Bust Next/Image cache after re-exporting transparent Figma assets. */
const ASSET_V = "1";

/**
 * Figma motion on 51:514 (relative to static frame at 545, 116.75):
 *   t=0 rest → x: −196, y: −4  (abs ≈ 349 — tucked behind Selah 1 at 298)
 *   end     → x: −350, y: 0   (abs ≈ 195)
 */
const PHONE_2_REST_X = `${(-196 / PHONE_2.w) * 100}%`;
const PHONE_2_REST_Y = `${(-4 / PHONE_2.h) * 100}%`;
const PHONE_2_END_X = `${(-350 / PHONE_2.w) * 100}%`;

const REST = {
  xy: { x: PHONE_2_REST_X, y: PHONE_2_REST_Y },
  cross: { opacity: 0 },
} as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;

const HOVER = {
  phone2: {
    animate: { x: PHONE_2_END_X, y: 0 },
    transition: HOVER_SPRING,
  },
  cross: {
    animate: { opacity: 1 },
    transition: { type: "spring", duration: 0.3, bounce: 0, delay: 0.18 },
  },
};

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type SelahCardProps = {
  className?: string;
};

export default function SelahCard({ className }: SelahCardProps) {
  const { active, linkProps } = useProjectCardNav(PROJECT.href);

  return (
    <Link
      className={`${styles.card} ${styles.selah} ${className ?? ""}`}
      aria-label={`Open ${PROJECT.title} case study`}
      data-node-id="51:619"
      style={{
        ["--card-brand" as string]: PROJECT.brandColor,
        ["--card-brand-hover" as string]: PROJECT.brandHover ?? PROJECT.brandColor,
      }}
      {...linkProps}
    >
      <div className={styles.selahScene}>
        <div className={styles.selahBg} />

        <div className={styles.selahText} data-node-id="51:360">
          <p className={styles.selahTitle} data-node-id="51:361">
            {PROJECT.title}
          </p>
          <p className={styles.selahTagline} data-node-id="51:362">
            {PROJECT.tagline}
          </p>

          {/* Cross 51:365 — vector fill fades in after phone settles (~567ms). */}
          <div
            className={styles.selahCross}
            data-node-id="51:365"
            data-name="Cross"
            style={{
              left: 0,
              top: pct(185, 469),
              width: pct(CROSS.w, 417),
              height: pct(CROSS.h, 469),
            }}
          >
            <motion.div
              className={styles.selahCrossVector}
              data-node-id="51:366"
              data-name="Vector"
              style={{
                left: pct(CROSS_VECTOR.x, CROSS.w),
                top: pct(CROSS_VECTOR.y, CROSS.h),
                width: pct(CROSS_VECTOR.w, CROSS.w),
                height: pct(CROSS_VECTOR.h, CROSS.h),
              }}
              initial={REST.cross}
              animate={active ? HOVER.cross.animate : REST.cross}
              transition={(active ? HOVER.cross.transition : REST_TRANSITION) as Transition}
            >
              <Image
                src={`/images/redesign/selah/cross.svg?v=${ASSET_V}`}
                alt=""
                width={60}
                height={80}
                className={styles.selahCrossImg}
                unoptimized
              />
            </motion.div>
          </div>
        </div>

        {/* Selah 2 — scripture phone. Static box at (545, 116.75); rest translate
            −196/−4 (Figma t=0) tucks it behind Selah 1. Hover slides to −350 (abs 195).
            Rotation lives on the inner element so it never fights motion translate. */}
        <motion.div
          className={styles.selahLayer}
          data-node-id="51:363"
          data-name="Selah 2"
          style={{
            left: pct(545, CARD.w),
            top: pct(116.75, CARD.h),
            width: pct(PHONE_2.w, CARD.w),
            height: pct(PHONE_2.h, CARD.h),
            zIndex: 2,
          }}
          initial={REST.xy}
          animate={active ? HOVER.phone2.animate : REST.xy}
          transition={(active ? HOVER.phone2.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.selahPhoneArt} data-name="Selah 2 art">
            <Image
              src={`/images/redesign/selah/phone-2.png?v=${ASSET_V}`}
              alt=""
              fill
              sizes="40vw"
              className="object-cover object-left-top"
              unoptimized
            />
          </div>
        </motion.div>

        {/* Selah 1 — home phone, static at (298, 120.31). */}
        <div
          className={styles.selahLayer}
          data-node-id="51:364"
          data-name="Selah 1"
          style={{
            left: pct(298, CARD.w),
            top: pct(120.31, CARD.h),
            width: pct(PHONE_1.w, CARD.w),
            height: pct(PHONE_1.h, CARD.h),
            zIndex: 3,
          }}
        >
          <div className={`${styles.selahPhoneArt} ${styles.selahPhone1}`} data-name="Selah 1 art">
            <Image
              src={`/images/redesign/selah/phone-1.png?v=${ASSET_V}`}
              alt=""
              fill
              sizes="40vw"
              className="object-cover object-left-top"
              unoptimized
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

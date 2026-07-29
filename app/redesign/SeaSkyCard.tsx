"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "motion/react";
import { getRedesignProject } from "./projects";
import { useProjectCardNav } from "./useCardHover";
import styles from "./redesign.module.css";

const PROJECT = getRedesignProject("sea-sky");

const CARD = { w: 547, h: 600 } as const;
/** Phone art box (Figma: 1338×820.22 at card (−205.18, −84.81), rotated −7° from top-left). */
const PHONE = { w: 1338, h: 820.22 } as const;
/** Design chip is 159 — widened slightly so “Online Community” keeps padding. */
const CHIP = { w: 172, h: 48 } as const;
const CHIPS_FRAME = { w: 180, h: 209.41 } as const;

/** Bust Next/Image cache after re-exporting transparent Figma assets. */
const ASSET_V = "4";

const REST = {
  xy: { x: 0, y: 0 },
  chip: { x: 0, y: 0, rotate: 0 },
} as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;

const NEWS_END_X = `${(-10.086 / CHIP.w) * 100}%`;
const NEWS_END_Y = `${(-47.452 / CHIP.h) * 100}%`;
const RESOURCES_END_Y = `${(48 / CHIP.h) * 100}%`;
const PHONE_END_X = `${(53 / PHONE.w) * 100}%`;
const PHONE_END_Y = `${(10 / PHONE.h) * 100}%`;

const HOVER = {
  resources: {
    animate: { rotate: 12, y: RESOURCES_END_Y },
    transition: HOVER_SPRING,
  },
  news: {
    animate: { rotate: -12, x: NEWS_END_X, y: NEWS_END_Y },
    transition: HOVER_SPRING,
  },
  phone: {
    animate: { x: PHONE_END_X, y: PHONE_END_Y },
    transition: HOVER_SPRING,
  },
};

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type SeaSkyCardProps = {
  className?: string;
};

export default function SeaSkyCard({ className }: SeaSkyCardProps) {
  const { active, linkProps } = useProjectCardNav(PROJECT.href);

  return (
    <Link
      className={`${styles.card} ${styles.seaSky} ${className ?? ""}`}
      aria-label={`Open ${PROJECT.title} case study`}
      data-node-id="45:2175"
      style={{
        ["--card-brand" as string]: PROJECT.brandColor,
        ["--card-brand-hover" as string]: PROJECT.brandHover ?? PROJECT.brandColor,
      }}
      {...linkProps}
    >
      <div className={styles.seaSkyScene}>
        <div className={styles.seaSkyBg} />
        <div className={styles.seaSkyBgHover} aria-hidden />

        <div className={styles.seaSkyText} data-node-id="45:1562">
          <p className={styles.seaSkyTitle} data-node-id="45:1563">
            {PROJECT.title}
          </p>
          <p className={styles.seaSkyTagline} data-node-id="45:1564">
            {PROJECT.tagline}
          </p>
        </div>

        {/* Chips 45:1565 — stacked at rest; News + Resources fan on hover */}
        <div
          className={styles.seaSkyChips}
          data-node-id="45:1565"
          data-name="Frame 80"
          style={{
            left: pct(42, CARD.w),
            top: pct(231, CARD.h),
            width: pct(CHIPS_FRAME.w, CARD.w),
            height: pct(CHIPS_FRAME.h, CARD.h),
          }}
        >
          <motion.div
            className={`${styles.seaSkyChip} ${styles.seaSkyChipResources}`}
            data-node-id="45:1570"
            data-name="Resources"
            style={{
              left: 0,
              top: pct(48, CHIPS_FRAME.h),
              width: pct(CHIP.w, CHIPS_FRAME.w),
              height: pct(CHIP.h, CHIPS_FRAME.h),
              zIndex: 1,
            }}
            initial={REST.chip}
            animate={active ? HOVER.resources.animate : REST.chip}
            transition={(active ? HOVER.resources.transition : REST_TRANSITION) as Transition}
          >
            <Image
              src={`/images/redesign/sea-sky/icon-resources.svg?v=${ASSET_V}`}
              alt=""
              width={16}
              height={13}
              className={styles.seaSkyChipIcon}
              unoptimized
            />
            <span>Resources</span>
          </motion.div>

          <motion.div
            className={`${styles.seaSkyChip} ${styles.seaSkyChipNews}`}
            data-node-id="45:1566"
            data-name="News"
            style={{
              left: 0,
              top: pct(48, CHIPS_FRAME.h),
              width: pct(CHIP.w, CHIPS_FRAME.w),
              height: pct(CHIP.h, CHIPS_FRAME.h),
              zIndex: 2,
            }}
            initial={REST.chip}
            animate={active ? HOVER.news.animate : REST.chip}
            transition={(active ? HOVER.news.transition : REST_TRANSITION) as Transition}
          >
            <Image
              src={`/images/redesign/sea-sky/icon-news.svg?v=${ASSET_V}`}
              alt=""
              width={16}
              height={16}
              className={styles.seaSkyChipIcon}
              unoptimized
            />
            <span>News</span>
          </motion.div>

          <div
            className={`${styles.seaSkyChip} ${styles.seaSkyChipCommunity}`}
            data-node-id="45:1574"
            data-name="Online Community"
            style={{
              left: 0,
              top: pct(48, CHIPS_FRAME.h),
              width: pct(CHIP.w, CHIPS_FRAME.w),
              height: pct(CHIP.h, CHIPS_FRAME.h),
              zIndex: 3,
            }}
          >
            <Image
              src={`/images/redesign/sea-sky/icon-community.svg?v=${ASSET_V}`}
              alt=""
              width={16}
              height={16}
              className={styles.seaSkyChipIcon}
              unoptimized
            />
            <span>Online Community</span>
          </div>
        </div>

        {/* Phone art 45:1580 — image box in card coords (−205.18, −84.81, 1338×820.22);
            card clips overflow. phone.png is the prepped transparent Figma source image,
            used as-is (no background removal). The −7° top-left rotation lives on the
            inner element so it never fights framer-motion's translate. */}
        <motion.div
          className={styles.seaSkyLayer}
          data-node-id="45:1578"
          data-name="Phone Mockup"
          style={{
            left: pct(-205.18, CARD.w),
            top: pct(-84.81, CARD.h),
            width: pct(PHONE.w, CARD.w),
            height: pct(PHONE.h, CARD.h),
            zIndex: 4,
          }}
          initial={REST.xy}
          animate={active ? HOVER.phone.animate : REST.xy}
          transition={(active ? HOVER.phone.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.seaSkyPhoneArt} data-node-id="45:1580" data-name="Header 1">
            <Image
              src={`/images/redesign/sea-sky/phone.png?v=${ASSET_V}`}
              alt=""
              fill
              sizes="80vw"
              unoptimized
            />
          </div>
        </motion.div>
      </div>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "motion/react";
import { getRedesignProject } from "./projects";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

const PROJECT = getRedesignProject("ziplearn");

const CARD = { w: 546, h: 437 } as const;
/** Phone frame (Figma 45:2264) in card coords: Frame 65 (42,42) + (238,124). */
const PHONE = { w: 231, h: 448 } as const;
const CHIP = { w: 159, h: 48 } as const;
const CHIPS_FRAME = { w: 217, h: 156 } as const;

/** Bust Next/Image cache after re-exporting transparent Figma assets. */
const ASSET_V = "1";

const REST = {
  xy: { x: 0, y: 0 },
} as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
const hoverSpring = (delay = 0) => ({ ...HOVER_SPRING, delay });

const PHONE_END_Y = `${(-81 / PHONE.h) * 100}%`;
const ACCESS_END_X = `${(58 / CHIP.w) * 100}%`;
const ONLINE_END_X = `${(82 / CHIP.w) * 100}%`;
const SCHEDULE_END_X = `${(112 / CHIP.w) * 100}%`;

const HOVER = {
  phone: {
    animate: { y: PHONE_END_Y },
    transition: HOVER_SPRING,
  },
  access: {
    animate: { x: ACCESS_END_X },
    transition: HOVER_SPRING,
  },
  online: {
    animate: { x: ONLINE_END_X },
    transition: hoverSpring(0.07),
  },
  schedule: {
    animate: { x: SCHEDULE_END_X },
    transition: hoverSpring(0.14),
  },
};

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type ZiplearnCardProps = {
  className?: string;
};

export default function ZiplearnCard({ className }: ZiplearnCardProps) {
  const { active, handlers } = useCardHover();

  return (
    <Link
      href={PROJECT.href}
      className={`${styles.card} ${styles.ziplearn} ${className ?? ""}`}
      aria-label={`Open ${PROJECT.title} case study`}
      data-node-id="45:2516"
      style={{
        ["--card-brand" as string]: PROJECT.brandColor,
        ["--card-brand-hover" as string]: PROJECT.brandHover ?? PROJECT.brandColor,
      }}
      {...handlers}
    >
      <div className={styles.ziplearnScene}>
        <div className={styles.ziplearnBg} />

        <div className={styles.ziplearnText} data-node-id="45:2261">
          <p className={styles.ziplearnTitle} data-node-id="45:2262">
            {PROJECT.title}
          </p>
          <p className={styles.ziplearnTagline} data-node-id="45:2263">
            {PROJECT.tagline}
          </p>
        </div>

        {/* Cards Frame 45:2266 — chips slide in from the left on hover */}
        <div
          className={styles.ziplearnChips}
          data-node-id="45:2266"
          data-name="Cards Frame"
          style={{
            left: pct(-16, CARD.w),
            top: pct(86, CARD.h),
            width: pct(CHIPS_FRAME.w, CARD.w),
            height: pct(CHIPS_FRAME.h, CARD.h),
          }}
        >
          <motion.div
            className={styles.ziplearnChip}
            data-node-id="45:2267"
            data-name="Access"
            style={{
              left: pct(0, CHIPS_FRAME.w),
              top: pct(0, CHIPS_FRAME.h),
              width: pct(CHIP.w, CHIPS_FRAME.w),
              height: pct(CHIP.h, CHIPS_FRAME.h),
              zIndex: 3,
            }}
            initial={REST.xy}
            animate={active ? HOVER.access.animate : REST.xy}
            transition={(active ? HOVER.access.transition : REST_TRANSITION) as Transition}
          >
            <Image
              src={`/images/redesign/ziplearn/icon-world.svg?v=${ASSET_V}`}
              alt=""
              width={16}
              height={16}
              className={styles.ziplearnChipIcon}
              unoptimized
            />
            <span>Access Anywhere</span>
          </motion.div>

          <motion.div
            className={styles.ziplearnChip}
            data-node-id="45:2271"
            data-name="Onlin Tutoring"
            style={{
              left: pct(-24, CHIPS_FRAME.w),
              top: pct(54, CHIPS_FRAME.h),
              width: pct(CHIP.w, CHIPS_FRAME.w),
              height: pct(CHIP.h, CHIPS_FRAME.h),
              zIndex: 2,
            }}
            initial={REST.xy}
            animate={active ? HOVER.online.animate : REST.xy}
            transition={(active ? HOVER.online.transition : REST_TRANSITION) as Transition}
          >
            <Image
              src={`/images/redesign/ziplearn/icon-community.svg?v=${ASSET_V}`}
              alt=""
              width={16}
              height={16}
              className={styles.ziplearnChipIcon}
              unoptimized
            />
            <span>Online Tutoring</span>
          </motion.div>

          <motion.div
            className={styles.ziplearnChip}
            data-node-id="45:2275"
            data-name="Schedule"
            style={{
              left: pct(-54, CHIPS_FRAME.w),
              top: pct(108, CHIPS_FRAME.h),
              width: pct(CHIP.w, CHIPS_FRAME.w),
              height: pct(CHIP.h, CHIPS_FRAME.h),
              zIndex: 1,
            }}
            initial={REST.xy}
            animate={active ? HOVER.schedule.animate : REST.xy}
            transition={(active ? HOVER.schedule.transition : REST_TRANSITION) as Transition}
          >
            <Image
              src={`/images/redesign/ziplearn/icon-calendar.svg?v=${ASSET_V}`}
              alt=""
              width={16}
              height={16}
              className={styles.ziplearnChipIcon}
              unoptimized
            />
            <span>Your Own Schedule</span>
          </motion.div>
        </div>

        {/* Phone 45:2264 — abs card coords (280, 166); slides up −81 design-px on hover.
            phone.png is the prepped transparent Figma source image, used as-is. */}
        <motion.div
          className={styles.ziplearnLayer}
          data-node-id="45:2264"
          data-name="Phone"
          style={{
            left: pct(280, CARD.w),
            top: pct(166, CARD.h),
            width: pct(PHONE.w, CARD.w),
            height: pct(PHONE.h, CARD.h),
            zIndex: 4,
          }}
          initial={REST.xy}
          animate={active ? HOVER.phone.animate : REST.xy}
          transition={(active ? HOVER.phone.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.ziplearnPhoneArt} data-node-id="45:2265" data-name="Purple mobile 1">
            <Image
              src={`/images/redesign/ziplearn/phone.png?v=${ASSET_V}`}
              alt=""
              fill
              sizes="40vw"
              className="object-contain object-left-top"
              unoptimized
            />
          </div>
        </motion.div>
      </div>
    </Link>
  );
}

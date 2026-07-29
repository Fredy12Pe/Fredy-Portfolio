"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { getRedesignProject } from "./projects";
import { useProjectCardNav } from "./useCardHover";
import styles from "./redesign.module.css";

const PROJECT = getRedesignProject("grove");

const CARD = { w: 546, h: 478 } as const;
const PHONE = { w: 366.48264625655975, h: 550.9721820019049 } as const;
/** Progress Card rotated AABB (Figma); inner PNG is unrotated and CSS-tilted. */
const PROGRESS_AABB = { w: 223.526006452832, h: 149.31765098607502 } as const;

/** Bust Next/Image cache after re-exporting transparent Figma assets. */
const ASSET_V = "7";

/** Widgets layer size in design px — used so motion offsets scale with the card. */
const WIDGETS = { w: 155, h: 201 } as const;
/** Rest left −70 → text left 42 ⇒ +112 design-px; as % of layer width so it stays aligned when scaled. */
const WIDGETS_END_X = `${(112 / WIDGETS.w) * 100}%`;

const REST = {
  xy: { x: 0, y: 0 },
  scale: { scaleX: 1, scaleY: 1 },
} as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
const hoverSpring = (delay = 0) => ({ ...HOVER_SPRING, delay });

const HOVER = {
  widgets: {
    animate: { x: WIDGETS_END_X, y: -11 },
    transition: hoverSpring(0.03),
  },
  plant2: {
    animate: { x: 7, y: -19 },
    transition: HOVER_SPRING,
  },
  plant1: {
    animate: { x: 27.682, y: 1 },
    transition: HOVER_SPRING,
  },
  phone: {
    animate: { x: -12.804, y: -35 },
    transition: HOVER_SPRING,
  },
  progress: {
    animate: { scaleX: 1.3, scaleY: 1.3 },
    transition: HOVER_SPRING,
  },
} as const;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type GroveCardProps = {
  className?: string;
};

export default function GroveCard({ className }: GroveCardProps) {
  const { active, linkProps } = useProjectCardNav(PROJECT.href);

  return (
    <Link
      className={`${styles.card} ${styles.grove} ${className ?? ""}`}
      aria-label={`Open ${PROJECT.title} case study`}
      data-node-id="45:654"
      style={{
        ["--card-brand" as string]: PROJECT.brandColor,
        ["--card-brand-hover" as string]: PROJECT.brandHover ?? PROJECT.brandColor,
      }}
      {...linkProps}
    >
      <div className={styles.groveScene}>
        <div className={styles.groveBg} />

        <div className={styles.groveText} data-node-id="45:363">
          <p className={styles.groveTitle} data-node-id="45:364">
            {PROJECT.title}
          </p>
          <p className={styles.groveTagline} data-node-id="45:365">
            {PROJECT.tagline}
          </p>
        </div>

        {/* Widgets 45:367 — rest (-70, 155) → text left (42); offset scales with layer */}
        <motion.div
          className={`${styles.groveLayer} ${styles.groveWidgets}`}
          data-node-id="45:367"
          data-name="Widgets"
          style={{
            left: pct(-70, CARD.w),
            top: pct(155, CARD.h),
            width: pct(WIDGETS.w, CARD.w),
            height: pct(WIDGETS.h, CARD.h),
            zIndex: 3,
          }}
          initial={REST.xy}
          animate={active ? HOVER.widgets.animate : REST.xy}
          transition={active ? HOVER.widgets.transition : REST_TRANSITION}
        >
          <Image
            src={`/images/redesign/grove/widgets.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="20vw"
            className="object-contain object-left-top"
            unoptimized
          />
        </motion.div>

        {/* Plant 2 45:435 — rest (-16, 409) → (+7, -19) */}
        <motion.div
          className={styles.groveLayer}
          data-node-id="45:435"
          data-name="Plant 2"
          style={{
            left: pct(-16, CARD.w),
            top: pct(409, CARD.h),
            width: pct(46, CARD.w),
            height: pct(93, CARD.h),
            zIndex: 2,
          }}
          initial={REST.xy}
          animate={active ? HOVER.plant2.animate : REST.xy}
          transition={active ? HOVER.plant2.transition : REST_TRANSITION}
        >
          <Image
            src={`/images/redesign/grove/plant-2.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="8vw"
            className="object-contain"
            unoptimized
          />
        </motion.div>

        {/* Plant 1 45:436 — AABB rest (-23.68, 68); export includes 19° rotation */}
        <motion.div
          className={styles.groveLayer}
          data-node-id="45:436"
          data-name="Plant 1"
          style={{
            left: pct(-23.68, CARD.w),
            top: pct(68, CARD.h),
            width: pct(51.61479402809073, CARD.w),
            height: pct(71.59315995546831, CARD.h),
            zIndex: 2,
          }}
          initial={REST.xy}
          animate={active ? HOVER.plant1.animate : REST.xy}
          transition={active ? HOVER.plant1.transition : REST_TRANSITION}
        >
          <Image
            src={`/images/redesign/grove/plant-1.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="8vw"
            className="object-contain"
            unoptimized
          />
        </motion.div>

        {/* Phone 45:437 — AABB rest (247.8, 56) → (-12.8, -35) */}
        <motion.div
          className={styles.groveLayer}
          data-node-id="45:437"
          data-name="Phone"
          style={{
            left: pct(247.80441284179688, CARD.w),
            top: pct(56, CARD.h),
            width: pct(PHONE.w, CARD.w),
            height: pct(PHONE.h, CARD.h),
            zIndex: 4,
          }}
          initial={REST.xy}
          animate={active ? HOVER.phone.animate : REST.xy}
          transition={active ? HOVER.phone.transition : REST_TRANSITION}
        >
          <Image
            src={`/images/redesign/grove/phone.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="40vw"
            className="object-contain object-left-top"
            unoptimized
          />

          {/* Progress Card 45:447 — AABB slot; inner layer is -15° like the phone */}
          <motion.div
            className={styles.groveProgress}
            data-node-id="45:447"
            data-name="Progress Card"
            style={{
              left: pct(48.323, PHONE.w),
              top: pct(113.731, PHONE.h),
              width: pct(PROGRESS_AABB.w, PHONE.w),
              height: pct(PROGRESS_AABB.h, PHONE.h),
            }}
            initial={REST.scale}
            animate={active ? HOVER.progress.animate : REST.scale}
            transition={active ? HOVER.progress.transition : REST_TRANSITION}
          >
            <div className={styles.groveProgressInner}>
              <Image
                src={`/images/redesign/grove/progress-card.png?v=${ASSET_V}`}
                alt=""
                fill
                sizes="25vw"
                className="object-contain"
                unoptimized
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Link>
  );
}

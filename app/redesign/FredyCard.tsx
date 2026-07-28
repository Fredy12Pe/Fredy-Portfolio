"use client";

import Image from "next/image";
import { motion, type Transition } from "motion/react";
import AnimatedAvatar from "./AnimatedAvatar";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

const CARD = { w: 547, h: 200 } as const;
/** Location panel Frame 85 (112:666) — 158×140 */
const PANEL = { w: 158, h: 140 } as const;

/** Bust Next/Image cache after re-exporting Figma assets. */
const ASSET_V = "1";

const REST = {
  opacity: { opacity: 0.6 },
  panel: { x: 0 },
} as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;

/** Rest left 554 → end 168 ⇒ −386 design-px; as % of panel width so it scales. */
const PANEL_END_X = `${((168 - 554) / PANEL.w) * 100}%`;

const HOVER = {
  copy: {
    animate: { opacity: 0 },
    transition: { type: "spring", duration: 0.28, bounce: 0 },
  },
  panel: {
    animate: { x: PANEL_END_X },
    transition: { ...HOVER_SPRING, delay: 0.08 },
  },
};

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type FredyCardProps = {
  className?: string;
};

export default function FredyCard({ className }: FredyCardProps) {
  const { active, handlers } = useCardHover();

  return (
    <section
      className={`${styles.card} ${styles.intro} ${className ?? ""}`}
      aria-label="About Fredy"
      data-node-id="56:679"
      {...handlers}
      tabIndex={0}
    >
      <div className={styles.introScene}>
        <AnimatedAvatar className={styles.introAvatar} />

        <motion.p
          className={styles.introCopy}
          data-node-id="112:665"
          initial={REST.opacity}
          animate={active ? HOVER.copy.animate : REST.opacity}
          transition={(active ? HOVER.copy.transition : REST_TRANSITION) as Transition}
        >
          Fredy is a UI/UX Designer &amp; Front-End Developer creating intuitive, visually
          engaging digital products from concept to code.
        </motion.p>

        {/* Frame 85 — rests off-card at left 554; slides to 168 on hover */}
        <motion.div
          className={styles.introLocation}
          data-node-id="112:666"
          data-name="Frame 85"
          style={{
            left: pct(554, CARD.w),
            top: pct(31, CARD.h),
            width: pct(PANEL.w, CARD.w),
            height: pct(PANEL.h, CARD.h),
          }}
          initial={REST.panel}
          animate={active ? HOVER.panel.animate : REST.panel}
          transition={(active ? HOVER.panel.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.introLocationText} data-node-id="112:668">
            <p className={styles.introLocationTitle} data-node-id="112:669">
              Based in California
            </p>
            <p className={styles.introLocationSub} data-node-id="112:670">
              Los Angeles
            </p>
          </div>
          <div className={styles.introLocationImage} data-node-id="112:671" data-name="image 75">
            <Image
              src={`/images/redesign/fredy/california-flag.png?v=${ASSET_V}`}
              alt=""
              fill
              sizes="20vw"
              unoptimized
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

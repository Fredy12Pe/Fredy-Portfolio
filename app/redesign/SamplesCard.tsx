"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "motion/react";
import { getRedesignProject } from "./projects";
import { useProjectCardNav } from "./useCardHover";
import styles from "./redesign.module.css";

const PROJECT = getRedesignProject("samples");

const CARD = { w: 546, h: 478 } as const;
const STOREFRONT = { w: 329, h: 201 } as const;
const BADGE = { w: 60, h: 60 } as const;

/** Bust Next/Image cache after re-exporting Figma assets. */
const ASSET_V = "1";

const REST = {
  xy: { x: 0, y: 0 },
  scale: { scaleX: 1, scaleY: 1 },
  shopify: { rotate: -17.111, x: 0, y: 0 },
  figma: { rotate: 21.115, x: 0, y: 0 },
  photoshop: { rotate: -16.404, x: 0, y: 0 },
} as const;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
const hoverSpring = (delay = 0) => ({ ...HOVER_SPRING, delay });

const SHOPIFY_END_X = `${(-117 / BADGE.w) * 100}%`;
const SHOPIFY_END_Y = `${(-45 / BADGE.h) * 100}%`;
const FIGMA_END_X = `${(64 / BADGE.w) * 100}%`;
const FIGMA_END_Y = `${(77 / BADGE.h) * 100}%`;
const PS_END_X = `${(-146 / BADGE.w) * 100}%`;
const PS_END_Y = `${(48 / BADGE.h) * 100}%`;

const HOVER = {
  storefront: {
    animate: { scaleX: 1.1, scaleY: 1.1 },
    transition: HOVER_SPRING,
  },
  shopify: {
    animate: { rotate: -6.225, x: SHOPIFY_END_X, y: SHOPIFY_END_Y },
    transition: {
      rotate: HOVER_SPRING,
      x: hoverSpring(0.08),
      y: hoverSpring(0.08),
    },
  },
  figma: {
    animate: { rotate: -7.636, x: FIGMA_END_X, y: FIGMA_END_Y },
    transition: {
      rotate: HOVER_SPRING,
      x: hoverSpring(0.04),
      y: hoverSpring(0.04),
    },
  },
  photoshop: {
    animate: { rotate: 17.095, x: PS_END_X, y: PS_END_Y },
    transition: HOVER_SPRING,
  },
} as const;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type SamplesCardProps = {
  className?: string;
};

export default function SamplesCard({ className }: SamplesCardProps) {
  const { active, linkProps } = useProjectCardNav(PROJECT.href);

  return (
    <Link
      className={`${styles.card} ${styles.samples} ${className ?? ""}`}
      aria-label={`Open ${PROJECT.title} case study`}
      data-node-id="45:1215"
      style={{
        ["--card-brand" as string]: PROJECT.brandColor,
        ["--card-brand-hover" as string]: PROJECT.brandHover ?? PROJECT.brandColor,
      }}
      {...linkProps}
    >
      <div className={styles.samplesScene}>
        <div className={styles.samplesBg} />

        <div className={styles.samplesText} data-node-id="45:1216">
          <p className={styles.samplesTitle} data-node-id="45:1217">
            {PROJECT.title}
          </p>
          <p className={styles.samplesTagline} data-node-id="45:1218">
            {PROJECT.tagline}
          </p>
        </div>

        {/* Storefront 45:1219 — card coords (83, 111) = Text(42,42) + local(41,69) */}
        <motion.div
          className={styles.samplesLayer}
          data-node-id="45:1219"
          data-name="Samples Image"
          style={{
            left: pct(83, CARD.w),
            top: pct(111, CARD.h),
            width: pct(STOREFRONT.w, CARD.w),
            height: pct(STOREFRONT.h, CARD.h),
            zIndex: 2,
          }}
          initial={REST.scale}
          animate={active ? HOVER.storefront.animate : REST.scale}
          transition={(active ? HOVER.storefront.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.samplesStorefront}>
            <img
              src={`/images/redesign/samples/storefront.png?v=${ASSET_V}`}
              alt=""
              className={styles.samplesStorefrontCrop}
            />
          </div>
        </motion.div>

        {/* Shopify 45:1220 — rest (483, 329.65), origin top-left */}
        <motion.div
          className={styles.samplesBadge}
          data-node-id="45:1220"
          data-name="Shoppify Logo"
          style={{
            left: pct(483, CARD.w),
            top: pct(329.65, CARD.h),
            width: pct(BADGE.w, CARD.w),
            height: pct(BADGE.h, CARD.h),
            zIndex: 4,
          }}
          initial={REST.shopify}
          animate={active ? HOVER.shopify.animate : REST.shopify}
          transition={(active ? HOVER.shopify.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.samplesBadgeFace}>
            {/* Icon 42.86 — centered in 60 box (Figma offsets were optically off) */}
            <div
              className={styles.samplesBadgeIcon}
              style={{
                width: pct(42.86, BADGE.w),
                height: pct(42.86, BADGE.h),
              }}
            >
              <Image
                src={`/images/redesign/samples/icon-shopify.png?v=${ASSET_V}`}
                alt=""
                fill
                sizes="5vw"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </motion.div>

        {/* Figma 45:1223 — rest (−7.39, 104), origin top-left */}
        <motion.div
          className={styles.samplesBadge}
          data-node-id="45:1223"
          data-name="Figma Logo"
          style={{
            left: pct(-7.39, CARD.w),
            top: pct(104, CARD.h),
            width: pct(BADGE.w, CARD.w),
            height: pct(BADGE.h, CARD.h),
            zIndex: 4,
          }}
          initial={REST.figma}
          animate={active ? HOVER.figma.animate : REST.figma}
          transition={(active ? HOVER.figma.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.samplesBadgeFace}>
            {/* Icon 25.71×36.92 — centered in 60 box */}
            <div
              className={`${styles.samplesBadgeIcon} ${styles.samplesBadgeIconCrop}`}
              style={{
                width: pct(25.71, BADGE.w),
                height: pct(36.92, BADGE.h),
              }}
            >
              {/* Figma CROP: w 383.61% / h 145.97% / left −140.98% / top −24.12% */}
              <img
                src={`/images/redesign/samples/icon-figma.png?v=${ASSET_V}`}
                alt=""
                className={styles.samplesFigmaCrop}
              />
            </div>
          </div>
        </motion.div>

        {/* Photoshop 45:1226 — rest (500, 96.94), origin top-left */}
        <motion.div
          className={styles.samplesBadge}
          data-node-id="45:1226"
          data-name="Photoshop Logo"
          style={{
            left: pct(500, CARD.w),
            top: pct(96.94, CARD.h),
            width: pct(BADGE.w, CARD.w),
            height: pct(BADGE.h, CARD.h),
            zIndex: 4,
          }}
          initial={REST.photoshop}
          animate={active ? HOVER.photoshop.animate : REST.photoshop}
          transition={(active ? HOVER.photoshop.transition : REST_TRANSITION) as Transition}
        >
          <div className={styles.samplesBadgeFace}>
            <div
              className={`${styles.samplesBadgeIcon} ${styles.samplesBadgeIconCrop}`}
              style={{
                width: pct(56, BADGE.w),
                height: pct(56, BADGE.h),
              }}
            >
              {/* Photoshop CROP: w 183.63% / h 106.08% / left −41.81% / top −3.04% */}
              <img
                src={`/images/redesign/samples/icon-photoshop.png?v=${ASSET_V}`}
                alt=""
                className={styles.samplesPsCrop}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}

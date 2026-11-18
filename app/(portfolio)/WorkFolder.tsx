"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useId } from "react";
import styles from "./WorkFolder.module.css";

type WorkFolderProps = {
  title?: string;
  subtitle?: string;
  /** Draw the whole folder, or only its back or front. The home page stacks the two halves in
      separate layers so the case studies can come out from between them. */
  part?: "whole" | "back" | "front";
  /** 0 closed, 1 open: the front panel tips forward and the back leans away */
  open?: MotionValue<number>;
  className?: string;
  /** Opened by a scroll-driven CSS animation over this range (see scroll-timeline.ts) instead of `open` */
  openRange?: [number, number];
};

/* A milk-glass folder: a brushed-metal back with a tab, and a frosted front panel with a dip in
   its top edge. Drawn in SVG so it stays sharp at any size; the grain and the liquid warp of the
   metal come from SVG filters, so there are no image files to load. */
export default function WorkFolder({ title, subtitle, part = "whole", open, className, openRange }: WorkFolderProps) {
  // Filter and gradient ids must be unique on the page
  const id = useId().replace(/:/g, "");
  const closed = useMotionValue(0);
  const openness = open ?? closed;
  const frontTilt = useTransform(openness, [0, 1], [0, -38]);
  const backTilt = useTransform(openness, [0, 1], [0, 10]);
  // Scroll-driven: the CSS tips the halves open (home.module.css, [data-fold]); no inline transform
  const cssOpen = openRange
    ? {
        "data-range": openRange.join(","),
        style: { "--a": openRange[0], "--b": openRange[1] } as unknown as Record<string, number>,
      }
    : null;

  return (
    <div className={`${styles.folder} ${className ?? ""}`} aria-hidden>
      {part !== "front" && (
        <motion.svg
          className={styles.back}
          data-fold="back"
          {...(cssOpen ?? { style: { rotateX: backTilt } })}
          viewBox="0 0 556 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={`${id}-metal`}
              x1="0"
              y1="0"
              x2="120"
              y2="120"
              gradientUnits="userSpaceOnUse"
              spreadMethod="repeat"
            >
              <stop offset="0" stopColor="#f4f6f4" />
              <stop offset="0.18" stopColor="#9fb0a4" />
              <stop offset="0.34" stopColor="#e9eeea" />
              <stop offset="0.52" stopColor="#7d9384" />
              <stop offset="0.7" stopColor="#dfe6e1" />
              <stop offset="0.86" stopColor="#b7c4ba" />
              <stop offset="1" stopColor="#f4f6f4" />
            </linearGradient>
            {/* Warps the metal stripes into soft liquid ripples */}
            <filter id={`${id}-liquid`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="38" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            {/* Shade inside the pocket, seen when the front tips open */}
            <linearGradient id={`${id}-pocket`} x1="0" y1="100" x2="0" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1f2a23" stopOpacity="0" />
              <stop offset="1" stopColor="#1f2a23" stopOpacity="0.35" />
            </linearGradient>
            <clipPath id={`${id}-back`}>
              <path d={BACK_PATH} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}-back)`}>
            <rect x="-40" y="-40" width="640" height="500" fill={`url(#${id}-metal)`} filter={`url(#${id}-liquid)`} />
            <rect x="0" y="0" width="556" height="420" fill={`url(#${id}-pocket)`} />
          </g>
        </motion.svg>
      )}

      {part !== "back" && (
        <motion.div className={styles.front} data-fold="front" {...(cssOpen ?? { style: { rotateX: frontTilt } })}>
          <svg className={styles.frontArt} viewBox="0 0 556 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`${id}-glass`} x1="0" y1="112" x2="556" y2="420" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#c9d3cc" />
                <stop offset="0.38" stopColor="#f6f6f3" />
                <stop offset="0.72" stopColor="#d9dfda" />
                <stop offset="1" stopColor="#eef0ed" />
              </linearGradient>
              <radialGradient
                id={`${id}-sheen`}
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(250 250) rotate(90) scale(170 230)"
              >
                <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`${id}-floor`} x1="0" y1="300" x2="0" y2="420" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#fff" stopOpacity="0.85" />
              </linearGradient>
              {/* Fine grain over the frosted panel */}
              <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
                <feColorMatrix in="noise" type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.08" />
                </feComponentTransfer>
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            {/* Slightly see-through, so the tucked cards show faintly behind it */}
            <path d={FRONT_PATH} fill={`url(#${id}-glass)`} fillOpacity={0.72} />
            <path d={FRONT_PATH} fill={`url(#${id}-sheen)`} fillOpacity={0.7} />
            <path d={FRONT_PATH} fill={`url(#${id}-floor)`} />
            <path d={FRONT_PATH} fill="#000" filter={`url(#${id}-grain)`} />
            <path d={FRONT_PATH} stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" />
          </svg>

          {title || subtitle ? (
            <div className={styles.label}>
              {title ? <p className={styles.title}>{title}</p> : null}
              {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            </div>
          ) : null}

          <span className={styles.button}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M12 5v14M6 13l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.div>
      )}
    </div>
  );
}

const BACK_PATH =
  "M0 24C0 10.7 10.7 0 24 0H186C202 0 212 6 222 18L236 34C243 42 250 46 262 46H532C545.3 46 556 56.7 556 70V396C556 409.3 545.3 420 532 420H24C10.7 420 0 409.3 0 396Z";

const FRONT_PATH =
  "M0 136C0 122.7 10.7 112 24 112H226C240 112 246 118 254 126C262 134 270 140 284 140H306C320 140 328 134 336 126C344 118 350 112 364 112H532C545.3 112 556 122.7 556 136V396C556 409.3 545.3 420 532 420H24C10.7 420 0 409.3 0 396Z";

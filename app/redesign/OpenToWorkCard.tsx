"use client";

import { useReducedMotion } from "motion/react";
import { CONTACT_LINKS } from "./contact-links";
import styles from "./redesign.module.css";

const CARD = { w: 546, h: 437 } as const;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 3.5v8M9 11.5 5.75 8.25M9 11.5l3.25-3.25M3.5 14.5h11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type OpenToWorkCardProps = {
  className?: string;
};

export default function OpenToWorkCard({ className }: OpenToWorkCardProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={`${styles.card} ${styles.openToWork} ${className ?? ""}`}
      aria-label="Open to work"
      data-node-id="slot-open-to-work"
    >
      <div className={styles.openToWorkScene}>
        <div
          className={styles.openToWorkCopy}
          style={{
            left: pct(36, CARD.w),
            top: pct(40, CARD.h),
            width: pct(474, CARD.w),
          }}
        >
          <div className={styles.openToWorkStatus}>
            <span
              className={`${styles.openToWorkDot}${reduced ? "" : ` ${styles.openToWorkDotPulse}`}`}
              aria-hidden
            />
            <p className={styles.openToWorkTitle}>Open to Work</p>
          </div>
          <p className={styles.openToWorkRole}>UI/UX · Front-End · LA</p>
        </div>

        <a
          className={styles.openToWorkButton}
          href={CONTACT_LINKS.resume}
          download="Fredy Pedro - Resume.pdf"
          aria-label="Download resume"
          style={{
            left: pct(36, CARD.w),
            bottom: pct(40, CARD.h),
            width: pct(474, CARD.w),
            height: pct(68, CARD.h),
          }}
        >
          <DownloadIcon />
          <span>Download Resume</span>
        </a>
      </div>
    </section>
  );
}

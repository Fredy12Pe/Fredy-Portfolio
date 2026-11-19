"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/lib/reveal";
import { rangeStyle, useTimelineFallback } from "./scroll-timeline";
import { PROCESS_STEPS } from "./home-data";
import styles from "./ProcessSteps.module.css";

/* When each marker fills, as shares of the section's pin: one after another, each over a fifth of it */
const FILL_RANGE = PROCESS_STEPS.map((_, i): [number, number] => [0.12 + i * 0.2, 0.28 + i * 0.2]);

/* A marker's scroll range, for the stage's timeline (and the script fallback) */
function fillProps(i: number) {
  const { style, ...rest } = rangeStyle(FILL_RANGE[i]);
  return { ...rest, style: style as CSSProperties };
}

/* How I work: the process behind the skills above, in four steps joined by a line. The steps fade up
   one after another as they come into view (see .fade-up). The section holds while the markers fill:
   the whole section is pinned under the menu while the markers fill. */
export default function ProcessSteps() {
  const revealRef = useReveal<HTMLElement>(0.2);
  const stageRef = useRef<HTMLDivElement>(null);
  useTimelineFallback(stageRef);

  return (
    <section ref={revealRef} className={styles.section} aria-labelledby="process-heading">
      <div ref={stageRef} className={`${styles.inner} ${styles.stage}`}>
        <div className={styles.pinned}>
          <div className={`${styles.head} fade-up`}>
            <p className={styles.eyebrow}>Process</p>
            <h2 id="process-heading" className={styles.heading}>
              How I work
            </h2>
          </div>

          <ol className={styles.steps}>
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step.title}
                className={`${styles.step} fade-up`}
                style={{ "--fade-i": i + 1 } as CSSProperties}
              >
                <span className={styles.marker} aria-hidden {...fillProps(i)}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.pinRoom} aria-hidden />
      </div>
    </section>
  );
}

"use client";

import type { CSSProperties } from "react";
import { useReveal } from "@/lib/reveal";
import { PROCESS_STEPS } from "./home-data";
import styles from "./ProcessSteps.module.css";

/* How I work: the process behind the skills above, in four steps joined by a line. The steps fade up
   one after another as they come into view (see .fade-up). */
export default function ProcessSteps() {
  const revealRef = useReveal<HTMLElement>(0.2);

  return (
    <section ref={revealRef} className={styles.section} aria-labelledby="process-heading">
      <div className={styles.inner}>
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
              <span className={styles.marker} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

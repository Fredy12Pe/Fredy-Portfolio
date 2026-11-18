"use client";

import { OPEN_TO_WORK } from "./home-data";
import type { CSSProperties } from "react";
import { useReveal } from "@/lib/reveal";
import styles from "./OpenToWork.module.css";

/* Open to work: what Fredy is looking for, under Skills and before Contact. One row per
   preference, each a label beside its options. */
export default function OpenToWork() {
  // The heading fades up, then the rows slide in from the right one after another (see .fade-up)
  const revealRef = useReveal<HTMLElement>(0.2);
  return (
    <section ref={revealRef} id="open-to-work" className={styles.section} aria-labelledby="open-to-work-heading">
      <div className={styles.inner}>
        <div className={`${styles.head} fade-up`}>
          <p className={styles.status}>
            <span className={styles.dot} aria-hidden />
            Available now
          </p>
          <h2 id="open-to-work-heading" className={styles.heading}>
            Open to work
          </h2>
        </div>

        <dl className={styles.list}>
          {OPEN_TO_WORK.map((row, i) => (
            <div
              key={row.label}
              className={`${styles.row} ${styles.slideIn} fade-up`}
              style={{ "--fade-i": i + 1 } as CSSProperties}
            >
              <dt className={styles.label}>{row.label}</dt>
              <dd className={styles.options}>
                <ul>
                  {row.options.map((option) => (
                    <li key={option} className={styles.pill}>
                      {option}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

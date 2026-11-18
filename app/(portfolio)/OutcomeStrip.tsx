"use client";

import { SERVICES } from "./home-data";
import { useReveal } from "@/lib/reveal";
import styles from "./home.module.css";

/* A slow strip of Fredy's skills, under the hero. The list is rendered twice so the slide loops
   without a gap; the second copy is hidden from screen readers. */
// The skill titles from the Skills section. They are short, so each copy repeats them to stay
// wider than the widest screens.
const ITEMS = Array.from({ length: 3 }, () => SERVICES.map((service) => service.name)).flat();

export default function OutcomeStrip() {
  // The strip fades up into place as it comes into view (see .fade-up)
  const revealRef = useReveal<HTMLElement>(0.3);
  return (
    <section ref={revealRef} className={styles.strip} aria-label="Skills">
      <div className={`${styles.stripTrack} fade-up`} data-decor>
        {[false, true].map((copy) => (
          <ul key={String(copy)} className={styles.stripList} aria-hidden={copy || undefined}>
            {ITEMS.map((phrase, i) => (
              <li key={i} className={styles.stripItem}>
                {phrase}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

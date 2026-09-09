"use client";

import { useState } from "react";
import CheckinScreen from "./CheckinScreen";
import { fredoka } from "./fonts";
import { MOODS, MOOD_COUNT } from "./moods";
import PhoneMockup from "./PhoneMockup";
import styles from "./stage.module.css";

export default function MoodCarousel() {
  const [index, setIndex] = useState(() => MOODS.findIndex((mood) => mood.id === "meh"));
  const [direction, setDirection] = useState(1);

  const changeMood = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(MOOD_COUNT - 1, nextIndex));
    if (boundedIndex === index) return;

    setDirection(boundedIndex > index ? 1 : -1);
    setIndex(boundedIndex);
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black md:bg-[#F5F5F7] md:p-6 lg:p-10">
      <div className={styles.carouselShell}>
        <div className={styles.deviceViewport}>
          <PhoneMockup>
            <CheckinScreen
              index={index}
              direction={direction}
              onMoodChange={changeMood}
              reduced={false}
            />
          </PhoneMockup>
        </div>

        <section className={styles.projectInfo} aria-labelledby="checkin-title">
          <h1 id="checkin-title" className={fredoka.className}>
            Checkin
          </h1>
          <p>An expressive mood check-in that turns everyday emotions into playful, animated characters.</p>

          <div className={styles.navControls}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => changeMood(index - 1)}
              disabled={index === 0}
              aria-label="Previous mood"
            >
              <svg aria-hidden viewBox="0 0 24 24">
                <path d="m15 5-7 7 7 7" />
              </svg>
            </button>

            <button
              type="button"
              className={styles.navButton}
              onClick={() => changeMood(index + 1)}
              disabled={index === MOOD_COUNT - 1}
              aria-label="Next mood"
            >
              <svg aria-hidden viewBox="0 0 24 24">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

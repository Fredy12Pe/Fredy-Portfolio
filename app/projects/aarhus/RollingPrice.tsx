"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./aarhus.module.css";

const REEL = Array.from({ length: 80 }, (_, i) => i % 10);
const REEL_MID = 40;
const GLYPH_PX = 38;

function RollingDigit({
  digit,
  direction,
  reduceMotion,
}: {
  digit: number;
  direction: 1 | -1;
  reduceMotion: boolean;
}) {
  const [index, setIndex] = useState(REEL_MID + digit);
  const prevDigit = useRef(digit);

  useEffect(() => {
    if (digit === prevDigit.current) {
      return;
    }

    const forward = (digit - prevDigit.current + 10) % 10;
    const backward = (prevDigit.current - digit + 10) % 10;
    const steps = direction === 1 ? forward || 10 : backward || 10;
    setIndex((current) => current + direction * steps);
    prevDigit.current = digit;
  }, [digit, direction]);

  return (
    <span className={styles.priceDigit}>
      <motion.span
        className={styles.priceReel}
        initial={false}
        animate={{ y: reduceMotion ? -digit * GLYPH_PX : -index * GLYPH_PX }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 30, mass: 0.7 }
        }
      >
        {REEL.map((value, reelIndex) => (
          <span key={reelIndex} className={styles.priceGlyph}>
            {value}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export default function RollingPrice({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const formatted = value.toLocaleString("en-US");
  const prevValue = useRef(value);
  const direction: 1 | -1 = value >= prevValue.current ? 1 : -1;

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <p className={styles.price} aria-live="polite" aria-label={`$${formatted}`}>
      <span className={styles.priceTrack} aria-hidden>
        <span className={styles.priceCurrency}>$</span>
        {formatted.split("").map((char, index) =>
          /\d/.test(char) ? (
            <RollingDigit
              key={`d-${index}`}
              digit={Number(char)}
              direction={direction}
              reduceMotion={Boolean(reduceMotion)}
            />
          ) : (
            <span key={`s-${index}`} className={styles.priceComma}>
              {char}
            </span>
          ),
        )}
      </span>
    </p>
  );
}

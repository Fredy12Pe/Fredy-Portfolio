"use client";

/* eslint-disable @next/next/no-img-element -- small decorative SVGs sized by the design's insets, not photos */

import {
  cubicBezier,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./LocationNavCard.module.css";

/* The About section's location card: a night drive through Los Angeles, from the Figma "nav-glow"
   design (Portfolio-4, 55:8486). The design is a 560×678 card; here it is laid out for the wider
   map slot. The road is a 10 second video rendered from the design's 300 frames; the puck, glows,
   turn arrows and directions are drawn on top and follow the video's clock, so they stay in step and
   pause with it when the card is off screen. */

const ASSET = "/images/location-nav";
const LOOP = 10; // seconds

const inOut = cubicBezier(0.5, 0, 0.5, 1);
const settle = cubicBezier(0.22, 1, 0.36, 1);
const sway = cubicBezier(0.55, 0, 0.45, 1);
const linear = (n: number) => n;

/* Turn arrow and direction timing, as fractions of the loop (from the design) */
const RIGHT = {
  times: [0, 0.05, 0.075, 0.2216, 0.2416, 0.7364, 0.7614, 0.8754, 0.8954, 1],
  values: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  ease: [inOut, settle, inOut, sway, inOut, settle, inOut, sway, linear],
};
const LEFT = {
  times: [0, 0.4095, 0.4345, 0.5485, 0.5685, 1],
  values: [0, 0, 1, 1, 0, 0],
  ease: [inOut, settle, inOut, sway, linear],
};
const STRAIGHT = {
  times: [0, 0.03, 0.05, 0.2416, 0.2666, 0.3895, 0.4095, 0.5685, 0.5935, 0.7164, 0.7364, 0.8954, 0.9204, 1],
  values: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
  ease: [inOut, sway, inOut, settle, inOut, sway, inOut, settle, inOut, sway, inOut, settle, linear],
};

/* The puck leans into each turn (degrees) */
const PUCK_TIMES = [
  0, 0.1467, 0.15, 0.1533, 0.1567, 0.16, 0.1633, 0.1667, 0.17, 0.1733, 0.1767, 0.18, 0.1833, 0.1867, 0.19,
  0.1933, 0.1967, 0.2167, 0.22, 0.2233, 0.2267, 0.23, 0.2333, 0.2367, 0.24, 0.2433, 0.2467, 0.25, 0.2533,
  0.2567, 0.26, 0.2633, 0.2667, 0.27, 0.4733, 0.4767, 0.48, 0.4833, 0.4867, 0.49, 0.4933, 0.4967, 0.5, 0.5033,
  0.5067, 0.51, 0.5133, 0.5167, 0.52, 0.5233, 0.5433, 0.5467, 0.55, 0.5533, 0.5567, 0.56, 0.5633, 0.5667, 0.57,
  0.5733, 0.5767, 0.58, 0.5833, 0.5867, 0.59, 0.5933, 0.5967, 0.8, 0.8033, 0.8067, 0.81, 0.8133, 0.8167, 0.82,
  0.8233, 0.8267, 0.83, 0.8333, 0.8367, 0.84, 0.8433, 0.8467, 0.85, 0.87, 0.8733, 0.8767, 0.88, 0.8833, 0.8867,
  0.89, 0.8933, 0.8967, 0.9, 0.9033, 0.9067, 0.91, 0.9133, 0.9167, 0.92, 0.9233, 1,
];
const PUCK_ROTATE = [
  0, 0, -0.13, 2.926, 6.318, 9.404, 12.189, 14.672, 16.862, 18.756, 20.371, 21.718, 22.806, 23.642, 24.223,
  24.563, 24.666, 24.666, 24.713, 23.077, 19.93, 16.948, 14.156, 11.58, 9.245, 7.156, 5.324, 3.754, 2.457,
  1.437, 0.687, 0.208, 0.001, 0, 0, 0.112, -2.663, -6.079, -9.19, -11.995, -14.499, -16.708, -18.63, -20.263,
  -21.628, -22.733, -23.587, -24.191, -24.547, -24.666, -24.666, -24.705, -23.31, -20.155, -17.161, -14.356,
  -11.763, -9.406, -7.3, -5.45, -3.862, -2.542, -1.5, -0.732, -0.236, -0.011, 0, 0, -0.093, 2.4, 5.836, 8.975,
  11.801, 14.325, 16.554, 18.495, 20.155, 21.538, 22.66, 23.53, 24.155, 24.531, 24.666, 24.666, 24.697, 23.551,
  20.379, 17.373, 14.555, 11.948, 9.57, 7.444, 5.577, 3.971, 2.633, 1.564, 0.778, 0.263, 0.02, 0, 0,
];

const steps = (n: number) => Array.from({ length: n + 1 }, (_, i) => i / n);

/** A value keyed to the loop position t (0–1); easeAll applies one easing to every segment */
function useKeyframes(t: MotionValue<number>, times: number[], values: number[], ease?: ((n: number) => number)[]) {
  return useTransform(t, times, values, ease ? { ease } : undefined);
}

export default function LocationNavCard({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Loop position, 0–1, read from the video so everything stays in step with the road
  const t = useMotionValue(0);
  // Design px → screen px for the road scene (the design card is 560 wide)
  const [k, setK] = useState(0.8);
  const [reduced, setReduced] = useState(false);
  // On screen right now, and the clock to fall back on when the video won't play (see below)
  const visible = useRef(false);
  const fallbackClock = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(([entry]) => setK(entry.contentRect.width / 560));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Plays only while on screen, and not at all with reduced motion
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(motionOff);
    if (motionOff) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /* The drive follows the video's clock. If the video won't play while the card is on screen (a
     phone in low power mode, or a browser that blocks it), the puck, arrows, glows and directions keep
     moving on a clock of their own, over the road's still frame, so the card is never frozen. */
  useAnimationFrame((_, delta) => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const playing = !video.paused && video.readyState >= 2;
    if (playing) {
      const duration = video.duration || LOOP;
      t.set((video.currentTime % duration) / duration);
      fallbackClock.current = video.currentTime % duration;
      return;
    }
    if (!visible.current) return;
    fallbackClock.current = (fallbackClock.current + Math.min(delta, 50) / 1000) % LOOP;
    t.set(fallbackClock.current / LOOP);
  });

  const right = useKeyframes(t, RIGHT.times, RIGHT.values, RIGHT.ease);
  const left = useKeyframes(t, LEFT.times, LEFT.values, LEFT.ease);
  const straight = useKeyframes(t, STRAIGHT.times, STRAIGHT.values, STRAIGHT.ease);
  const puckRotate = useKeyframes(t, PUCK_TIMES, PUCK_ROTATE);
  // The bar fills across the loop, like the distance to the next turn counting down
  const progress = useTransform(t, [0, 1], [12 / 232, 1]);

  // Glows drift and breathe (design px, scaled to the card)
  const sixths = steps(6);
  const eighths = steps(8);
  const quarters = steps(4);
  const swayAll = (n: number) => Array(n).fill(sway);
  const coreScaleX = useKeyframes(t, sixths, [1, 1.15, 1, 1.15, 1, 1.15, 1], swayAll(6));
  const coreX = useTransform(useKeyframes(t, [0, 0.5, 1], [-25, 25, -25], swayAll(2)), (v) => v * k);
  const coreY = useTransform(useKeyframes(t, eighths, [0, -14, 0, -14, 0, -14, 0, -14, 0], swayAll(8)), (v) => v * k);
  const leftScale = useKeyframes(t, quarters, [1, 1.15, 1, 1.15, 1], swayAll(4));
  const leftX = useTransform(useKeyframes(t, quarters, [0, 40, 0, 40, 0], swayAll(4)), (v) => v * k);
  const leftY = useTransform(useKeyframes(t, sixths, [0, -24, 0, -24, 0, -24, 0], swayAll(6)), (v) => v * k);
  const rightScale = useKeyframes(t, eighths, [1.12, 1, 1.12, 1, 1.12, 1, 1.12, 1, 1.12], swayAll(8));
  const rightX = useTransform(useKeyframes(t, quarters, [0, -40, 0, -40, 0], swayAll(4)), (v) => v * k);
  const rightY = useTransform(useKeyframes(t, sixths, [-24, 0, -24, 0, -24, 0, -24], swayAll(6)), (v) => v * k);

  return (
    <div
      ref={rootRef}
      className={`${styles.card} ${className ?? ""}`}
      role="img"
      aria-label="Fredy's location: Los Angeles, shown as a night drive with turn-by-turn directions"
    >
      {/* The road, with the puck riding on it. Placed in design px so the two stay locked. */}
      <div className={styles.scene}>
        <video
          ref={videoRef}
          className={styles.road}
          src={`${ASSET}/road.mp4`}
          poster={`${ASSET}/road-poster.jpg`}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <motion.div className={styles.puck} style={{ rotate: puckRotate }}>
          <img src={`${ASSET}/puck.svg`} alt="" />
        </motion.div>
      </div>

      <div className={styles.turnFog} />
      <div className={styles.bottomHaze} />
      <motion.div className={`${styles.glow} ${styles.glowCore}`} style={{ scaleX: coreScaleX, x: coreX, y: coreY }}>
        <img src={`${ASSET}/glow-core.svg`} alt="" />
      </motion.div>
      <motion.div className={`${styles.glow} ${styles.glowLeft}`} style={{ scale: leftScale, x: leftX, y: leftY }}>
        <img src={`${ASSET}/glow-corner-l.svg`} alt="" />
      </motion.div>
      <motion.div className={`${styles.glow} ${styles.glowRight}`} style={{ scale: rightScale, x: rightX, y: rightY }}>
        <img src={`${ASSET}/glow-corner-r.svg`} alt="" />
      </motion.div>
      <div className={styles.horizonHaze} />

      {/* Turn arrow tile */}
      <div className={styles.tile}>
        <motion.img className={styles.arrowTurn} src={`${ASSET}/turn-arrow-right.svg`} alt="" style={{ opacity: right }} />
        <motion.img className={styles.arrowTurn} src={`${ASSET}/turn-arrow-left.svg`} alt="" style={{ opacity: left }} />
        <motion.div className={styles.arrowStraight} style={{ opacity: straight }}>
          <img src={`${ASSET}/turn-arrow-straight.svg`} alt="" />
        </motion.div>
      </div>

      {/* Where Fredy is, which stays put, over the turn-by-turn readout, which follows the drive:
          the bar fills toward the next turn and the distance changes with each arrow */}
      <div className={styles.info} aria-hidden>
        <p className={styles.action}>Location</p>
        <p className={styles.street}>Los Angeles</p>
        <div className={styles.meter}>
          <span className={styles.track}>
            <motion.span className={styles.fill} style={{ scaleX: progress }} />
          </span>
          <span className={styles.distances}>
            <motion.span className={styles.distance} style={{ opacity: right }}>0.2 mi</motion.span>
            <motion.span className={styles.distance} style={{ opacity: straight }}>0.4 mi</motion.span>
            <motion.span className={styles.distance} style={{ opacity: left }}>0.3 mi</motion.span>
          </span>
        </div>
      </div>
    </div>
  );
}

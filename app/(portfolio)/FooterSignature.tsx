"use client";

import { useLayoutEffect, useRef } from "react";
import {
  SIGNATURE_F_STROKES,
  SIGNATURE_REDY_STROKES,
  SIGNATURE_SWOOP,
  SIGNATURE_VIEWBOX,
} from "./WelcomeSignature";
import styles from "./FooterSignature.module.css";

// Where the drawing runs, as a share of the viewport height: it starts when the
// footer's top edge reaches the bottom of the screen and is finished when that
// edge has climbed to 30% from the top.
const START_AT = 0.6;
const END_AT = 0.15;

// Draws the mark stroke by stroke, the same way the loading screen does. The
// drawing follows the scroll position, so it is partly drawn when the footer
// first appears and keeps going as you scroll down.
export default function FooterSignature() {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const footer = svg.closest("footer") ?? svg;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));

    // The strokes are drawn one after another, so the pen travels through the whole mark.
    // Each stroke gets a share of the total length, which keeps the pace even.
    const lengths = paths.map((path) => path.getTotalLength());
    const total = lengths.reduce((sum, length) => sum + length, 0);
    let before = 0;
    const starts = lengths.map((length) => {
      const start = before;
      before += length;
      return start;
    });

    paths.forEach((path, index) => {
      path.style.strokeDasharray = `${lengths[index]}`;
      path.style.strokeDashoffset = `${lengths[index]}`;
      path.style.visibility = "hidden";
    });

    // The drawing is only redone when the progress actually moves, so a scroll that
    // leaves the mark untouched costs nothing beyond reading the footer's position.
    let drawnProgress = -1;
    const update = () => {
      const top = footer.getBoundingClientRect().top;
      const height = window.innerHeight;
      // On a tall screen (a portrait tablet) the page ends before the footer's top can climb to
      // END_AT, which left the mark unfinished. The end is the highest the footer can actually
      // reach, at the very bottom of the page, and the start keeps the same run before it.
      const lowest = height - (document.documentElement.scrollHeight - (top + window.scrollY));
      const end = Math.max(height * END_AT, lowest);
      const start = Math.max(height * START_AT, end + height * (START_AT - END_AT));
      const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
      if (Math.abs(progress - drawnProgress) < 0.002) return;
      drawnProgress = progress;
      const drawn = progress * total;
      paths.forEach((path, index) => {
        const amount = Math.min(lengths[index], Math.max(0, drawn - starts[index]));
        path.style.strokeDashoffset = `${lengths[index] - amount}`;
        path.style.visibility = amount > 0 ? "visible" : "hidden";
      });
    };

    // The scroll handler is only attached while the footer is near the screen. Everywhere
    // else on the page the mark is finished or untouched, so there is nothing to follow.
    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) window.addEventListener("scroll", update, { passive: true });
      else window.removeEventListener("scroll", update);
    };

    const nearby = new IntersectionObserver(
      ([entry]) => {
        listen(entry.isIntersecting);
        update();
      },
      { rootMargin: "100% 0px" },
    );
    nearby.observe(footer);

    update();
    window.addEventListener("resize", update);

    return () => {
      nearby.disconnect();
      listen(false);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={styles.mark}
      viewBox={SIGNATURE_VIEWBOX}
      overflow="visible"
      fill="none"
      role="img"
      aria-label="Fredy"
    >
      {SIGNATURE_F_STROKES.map((d, index) => (
        <path key={`f-${index}`} d={d} strokeWidth="1.8" />
      ))}
      {SIGNATURE_REDY_STROKES.map((d, index) => (
        <path key={`redy-${index}`} d={d} strokeWidth="1.8" />
      ))}
      <path d={SIGNATURE_SWOOP} strokeWidth="1.8" />
    </svg>
  );
}

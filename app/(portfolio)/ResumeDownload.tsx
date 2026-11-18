"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { CONTACT_LINKS } from "../redesign/contact-links";
import styles from "./ResumeDownload.module.css";

type Point = [number, number];

function arrowPath(points: Point[], smoothing: number) {
  const cp = (
    current: Point,
    previous: Point | undefined,
    next: Point | undefined,
    reverse: boolean,
  ) => {
    const p = previous || current;
    const n = next || current;
    const angle = Math.atan2(n[1] - p[1], n[0] - p[0]) + (reverse ? Math.PI : 0);
    const length = Math.hypot(n[0] - p[0], n[1] - p[1]) * smoothing;
    return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
  };

  return points.reduce((acc, point, i, all) => {
    if (i === 0) return `M ${point[0]},${point[1]}`;
    const cps = cp(all[i - 1], all[i - 2], point, false);
    const cpe = cp(point, all[i - 1], all[i + 1], true);
    return `${acc} C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
  }, "");
}

/* The resume button with its three states: Download Resume, Downloading, Downloaded.
   Moved out of the old About intro unchanged, so it can sit in the contact section. */
export default function ResumeDownload() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const path = pathRef.current;
    if (!button || !path) return;

    const duration = 3000;
    button.style.setProperty("--duration", String(duration));

    const state = { y: 20, smoothing: 0 };
    const chevron = () =>
      arrowPath(
        [
          [4, 12],
          [12, state.y],
          [20, 12],
        ],
        state.smoothing,
      );
    const render = () => path.setAttribute("d", chevron());
    render();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let markTimer = 0;

    const onClick = (event: MouseEvent) => {
      if (reduced) return;
      if (button.classList.contains(styles.loading)) {
        event.preventDefault();
        return;
      }
      button.classList.add(styles.loading);
      gsap.to(state, {
        smoothing: 0.3,
        duration: (duration * 0.065) / 1000,
        onUpdate: render,
      });
      gsap.to(state, {
        y: 12,
        duration: (duration * 0.265) / 1000,
        delay: (duration * 0.065) / 1000,
        ease: "elastic.out(1.12, 0.4)",
        onUpdate: render,
      });
      markTimer = window.setTimeout(() => {
        path.setAttribute(
          "d",
          arrowPath(
            [
              [3, 14],
              [8, 19],
              [21, 6],
            ],
            0,
          ),
        );
      }, duration / 2);
    };

    button.addEventListener("click", onClick);
    return () => {
      button.removeEventListener("click", onClick);
      window.clearTimeout(markTimer);
      gsap.killTweensOf(state);
    };
  }, []);

  return (
    <a
      ref={buttonRef}
      className={styles.download}
      href={CONTACT_LINKS.resume}
      download="Fredy_Pedro_Resume.pdf"
      aria-label="Download Resume"
    >
      <ul aria-hidden="true">
        <li>Download Resume</li>
        <li>Downloading</li>
        <li>Downloaded</li>
      </ul>
      <span className={styles.downloadIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path ref={pathRef} d="M 4,12 C 4,12 12,20 12,20 C 12,20 20,12 20,12" />
        </svg>
      </span>
    </a>
  );
}

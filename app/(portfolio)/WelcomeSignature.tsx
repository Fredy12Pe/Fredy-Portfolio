"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import styles from "./WelcomeSignature.module.css";

const F_PATH =
  "M0.90004 14.7909C4.94746 14.4946 11.3408 13.1443 15.7231 10.0103M15.7231 10.0103C17.1207 9.01076 18.3138 7.82985 19.161 6.44385C20.7544 3.8372 18.6825 0.850663 16.9063 3.37523C15.6403 5.17466 15.5119 7.53239 15.7231 10.0103ZM15.7231 10.0103C15.9919 13.1633 16.8108 16.511 16.536 19.1504C16.4286 20.1819 16.2845 21.2215 16.0974 22.2419M16.0974 22.2419C15.0899 27.7376 12.8368 32.678 8.36613 32.8154C6.62555 32.8688 5.09475 32.4163 4.16846 31.1963C2.02563 28.3741 1.48775 24.6657 15.0632 22.4859C15.4075 22.4056 15.7523 22.3243 16.0974 22.2419ZM16.0974 22.2419C28.9289 19.1785 42.3079 14.6274 56.1 8.54911";

const REDY_PATH =
  "M10.1001 17.7255C14.2984 16.7526 23.0588 13.6395 24.5138 8.96979C24.2489 12.5841 23.6685 18.5895 22.907 22.7229M22.907 22.7229C22.5919 24.4328 22.2459 25.8223 21.8785 26.5897C21.7755 26.8048 21.5869 26.7267 21.6578 26.5027C22.0136 25.3785 22.4386 24.0851 22.907 22.7229ZM22.907 22.7229C24.716 17.4618 27.1736 11.1735 28.8028 9.63826C29.0536 9.40188 29.3717 9.59495 29.3728 9.91064C29.3743 10.3283 29.4195 10.7811 29.5512 11.1044C29.7445 11.5786 30.3575 11.2633 30.6146 10.8107C31.2733 9.65102 32.2656 8.07333 33.0921 7.24344C33.2651 7.06972 33.5236 7.204 33.4624 7.42398C32.9305 9.33348 32.4904 12.2324 33.9703 12.3583C34.0131 12.362 34.0557 12.3469 34.0837 12.3196C34.2654 12.1428 34.4621 11.9334 34.6582 11.6955C36.2088 9.81401 35.8081 6.07438 38.4048 5.35224C38.4847 5.33002 38.4922 5.40542 38.4694 5.47305C38.0022 6.85756 37.4838 9.29201 38.8367 8.96979C39.8652 8.41816 41.9151 6.75906 42.292 4.37491M42.292 4.37491C42.3122 4.24716 42.3276 4.11733 42.3378 3.98548L42.292 4.37491ZM42.292 4.37491L41.8924 7.77583M41.8924 7.77583L40.1553 22.5582M13.5379 38.9001C31.0855 32.6162 43.6025 30.5748 53.1336 26.2111C64.8581 20.8432 70.5186 1.05238 57.7969 3.15782C57.5191 3.20378 57.2363 3.08731 57.1121 2.8751C55.0366 -0.669884 53.3271 1.2629 52.495 3.20416C52.3756 3.48265 51.9022 3.52771 51.7311 3.26869C51.5728 3.0291 51.1531 3.04711 51.0251 3.29899L50.5223 4.28871C50.4313 6.12324 47.4642 7.11252 47.203 6.31655C46.0936 2.93556 43.2003 5.88066 41.8924 7.77583M50.5223 4.28871V15.0154";

function subpaths(d: string) {
  return d
    .split(/(?=M)/)
    .map((part) => part.trim())
    .filter(Boolean);
}

// The file stores the final flourish tail-first, so playing it forward
// draws the underline before the letter it grows from. Reversed, the pen
// leaves the end of the name and travels down into the swoop.
const SWOOP_FROM_NAME =
  "M41.8924 7.77583C43.2003 5.88066 46.0936 2.93556 47.203 6.31655C47.4642 7.11252 50.4313 6.12324 50.5223 4.28871L51.0251 3.29899C51.1531 3.04711 51.5728 3.0291 51.7311 3.26869C51.9022 3.52771 52.3756 3.48265 52.495 3.20416C53.3271 1.2629 55.0366 -0.669884 57.1121 2.8751C57.2363 3.08731 57.5191 3.20378 57.7969 3.15782C70.5186 1.05238 64.8581 20.8432 53.1336 26.2111C43.6025 30.5748 31.0855 32.6162 13.5379 38.9001";

const F_STROKES = subpaths(F_PATH);
const redyParts = subpaths(REDY_PATH);
const REDY_STROKES = [0, 1, 2, 3, 4, 5, 7].map((index) => redyParts[index]);

type WelcomeSignatureProps = {
  logoRef: RefObject<HTMLAnchorElement | null>;
  onDone: () => void;
};

function destination(
  mark: SVGSVGElement,
  logoRef: RefObject<HTMLAnchorElement | null>,
) {
  const logo = logoRef.current?.querySelector("img");
  if (!logo) return null;

  const logoBox = logo.getBoundingClientRect();
  const markBox = mark.getBoundingClientRect();
  if (logoBox.width < 1 || markBox.width < 1) return null;

  return {
    x: logoBox.left + logoBox.width / 2 - (markBox.left + markBox.width / 2),
    y: logoBox.top + logoBox.height / 2 - (markBox.top + markBox.height / 2),
    scaleX: logoBox.width / markBox.width,
    scaleY: logoBox.height / markBox.height,
  };
}

export default function WelcomeSignature({
  logoRef,
  onDone,
}: WelcomeSignatureProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mark = markRef.current;
    if (!root || !mark) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDoneRef.current();
      return;
    }

    let alive = true;
    const ctx = gsap.context(() => {
      const scrim = root.querySelector<HTMLElement>("[data-scrim]");
      const strokes = mark.querySelectorAll<SVGPathElement>("path");
      if (!scrim || !strokes.length) return;

      gsap.set(mark, { xPercent: -50, yPercent: -50, x: 0, y: 0, scaleX: 1, scaleY: 1 });

      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          if (alive) onDoneRef.current();
        },
      });

      const drawStroke = (path: SVGPathElement, at: string) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          autoAlpha: 0,
          stroke: "#111111",
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.set(path, { autoAlpha: 1 }, at);
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: Math.max(0.08, length / 120),
            ease: "none",
          },
          "<",
        );
      };

      mark.querySelectorAll<SVGPathElement>("[data-stroke='f']").forEach((path, index) => {
        drawStroke(path, index === 0 ? ">" : "-=0.02");
      });
      mark.querySelectorAll<SVGPathElement>("[data-stroke='redy']").forEach((path, index) => {
        drawStroke(path, index === 0 ? "-=0.05" : "-=0.02");
      });
      mark.querySelectorAll<SVGPathElement>("[data-stroke='swoop']").forEach((path) => {
        drawStroke(path, "-=0.04");
      });

      let landing: NonNullable<ReturnType<typeof destination>> | null = null;
      const land = () => {
        landing ??= destination(mark, logoRef);
        return landing;
      };

      tl.to(
        mark,
        {
          duration: 0.55,
          ease: "power3.inOut",
          immediateRender: false,
          x: () => land()?.x ?? 0,
          y: () => land()?.y ?? 0,
          scaleX: () => land()?.scaleX ?? 1,
          scaleY: () => land()?.scaleY ?? 1,
        },
        "+=0.08",
      );
      tl.to(
        scrim,
        { opacity: 0, duration: 0.4, ease: "power2.inOut" },
        "<",
      );
      tl.to(
        strokes,
        { stroke: "#ffffff", duration: 0.16, ease: "power1.in" },
        "<0.4",
      );
    }, root);

    return () => {
      alive = false;
      ctx.revert();
    };
  }, [logoRef]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden>
      <div className={styles.scrim} data-scrim />
      <svg
        ref={markRef}
        className={styles.mark}
        viewBox="0 0 68.98 39.8003"
        overflow="visible"
        fill="none"
      >
        {F_STROKES.map((d, index) => (
          <path key={`f-${index}`} data-stroke="f" d={d} strokeWidth="1.8" />
        ))}
        {REDY_STROKES.map((d, index) => (
          <path key={`redy-${index}`} data-stroke="redy" d={d} strokeWidth="1.8" />
        ))}
        <path data-stroke="swoop" d={SWOOP_FROM_NAME} strokeWidth="1.8" />
      </svg>
    </div>
  );
}

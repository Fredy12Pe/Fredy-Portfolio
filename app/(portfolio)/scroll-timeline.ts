"use client";

import { useEffect, type RefObject } from "react";

/* Scroll-linked animations, run by the browser.

   Featured work and Skills each pin a stage with CSS (position: sticky) and animate what is inside
   it with CSS scroll-driven animations (animation-timeline). The browser runs those with its own
   scrolling, so nothing waits on JavaScript and nothing can fall behind the finger. Every animated
   element carries its scroll range as two numbers, --a and --b: where it starts and ends, as shares
   of the stage's pin length (--pin), counted from the moment the stage pins.

   Browsers without scroll-driven animations (older Safari, Firefox) get the same CSS animations,
   paused, and this file sets their position on each frame that scrolls. */

export function supportsScrollTimeline() {
  return typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
}

/** Sets an element's scroll range: --a and --b for the CSS, and data-range for the fallback.
    Several animations on one element take one pair each, in the order the CSS lists them. */
export function rangeStyle(...pairs: [number, number][]) {
  const style: Record<string, string | number> = { "--a": pairs[0][0], "--b": pairs[0][1] };
  pairs.slice(1).forEach(([a, b], i) => {
    style[`--a${i + 2}`] = a;
    style[`--b${i + 2}`] = b;
  });
  return { style, "data-range": pairs.map((pair) => pair.join(",")).join(";") };
}

/** For browsers without scroll-driven animations: drives the stage's paused animations from the
    scroll position. Does nothing where the browser can run them itself. */
export function useTimelineFallback(stageRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || supportsScrollTimeline()) return;
    stage.dataset.timeline = "script";

    let pinTop = 0;
    let pin = 1;
    let items: { animations: Animation[]; ranges: [number, number][] }[] = [];
    const measure = () => {
      // --pin and --pin-top are lengths; resolve them through a probe so svh and calc() work
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;height:var(--pin);width:var(--pin-top, 0px)";
      stage.appendChild(probe);
      pin = probe.offsetHeight || 1;
      pinTop = probe.offsetWidth;
      probe.remove();
      items = [...stage.querySelectorAll<HTMLElement>("[data-range]")].map((el) => {
        // The element's CSS animations, in the order its CSS lists them; held still, and placed below
        const animations = el.getAnimations().filter((a) => typeof CSSAnimation === "undefined" || a instanceof CSSAnimation);
        animations.forEach((a) => a.pause());
        return {
          animations,
          ranges: (el.dataset.range ?? "")
            .split(";")
            .map((pair) => pair.split(",").map(Number) as [number, number]),
        };
      });
      update();
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      // Read every frame (before any writes), so content above changing height can't put it out of step
      const at = (pinTop - stage.getBoundingClientRect().top) / pin;
      for (const { animations, ranges } of items) {
        // Each animation is 1s long: place it at its share of its range (before 0 and after 1 its
        // fill decides what shows)
        animations.forEach((animation, i) => {
          const [a, b] = ranges[i] ?? ranges[0];
          animation.currentTime = ((at - a) / (b - a)) * 1000;
        });
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      delete stage.dataset.timeline;
    };
  }, [stageRef]);
}

"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clearScrolling, markScrolling } from "./scroll-flag";

gsap.registerPlugin(ScrollTrigger);

// On a phone the address bar sliding away resizes the window mid-scroll. Re-measuring every pinned
// and scrubbed section on each of those resizes made the page hitch, so only real changes re-measure.
ScrollTrigger.config({ ignoreMobileResize: true });

// Wheel and trackpad scrolling is left to the browser. The earlier version (Lenis) turned every
// wheel tick into JavaScript that ran on each frame, on top of the scrubbed animations, which is
// what made a heavy page stutter. Native scrolling runs on the compositor, has the platform's own
// momentum, and costs the page nothing per frame. ScrollTrigger reads the native scroll position
// directly, so the scrubbed sections stay in step without any extra work here. Touch scrolling is
// the exception, handled below.
export default function SmoothScroll() {
  useEffect(() => {
    // Feeds the decorative-layer gate: the flag is held while the page moves and the
    // scrubbed sections keep it alive after the gesture ends (see scroll-flag.ts).
    const onScroll = () => markScrolling();
    window.addEventListener("scroll", onScroll, { passive: true });

    // In-page links (href="#about") glide to their target instead of snapping. The
    // browser's own smooth-scroll setting is not used globally because it also slows
    // programmatic jumps (such as the scroll restore on reload).
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      history.replaceState(history.state, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    // Keep animation timing steady when a frame runs late, so scrubbed sections don't skip
    gsap.ticker.lagSmoothing(0);

    // Touch screens (phones and tablets): a finger's scroll runs on its own thread, ahead of the
    // script that moves the pinned and scrubbed sections, so they trailed the page by a frame or more
    // and the header hand-off, the About pin and the sliding card row glitched. Normalizing hands the
    // touch scroll to ScrollTrigger, which moves the page and those sections in the same frame. Wheel
    // and trackpad scrolling are left native. Nested scrollers (the swipe rows) still scroll themselves,
    // and anything marked data-own-touch (the projects carousel) keeps its own swipes.
    const normalized = ScrollTrigger.isTouch === 1;
    if (normalized) {
      ScrollTrigger.normalizeScroll({ type: "touch", allowNestedScroll: true, ignore: "[data-own-touch]" });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      if (normalized) ScrollTrigger.normalizeScroll(false);
      clearScrolling();
    };
  }, []);

  return null;
}

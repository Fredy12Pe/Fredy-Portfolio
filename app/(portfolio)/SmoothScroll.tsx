"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clearScrolling, markScrolling } from "./scroll-flag";

gsap.registerPlugin(ScrollTrigger);

// On a phone the address bar sliding away resizes the window mid-scroll. Re-measuring every pinned
// and scrubbed section on each of those resizes made the page hitch, so only real changes re-measure.
ScrollTrigger.config({ ignoreMobileResize: true });

// Scrolling is left to the browser. The earlier version (Lenis) turned every wheel tick
// into JavaScript that ran on each frame, on top of the scrubbed animations, which is what
// made a heavy page stutter. Native scrolling runs on the compositor, has the platform's
// own momentum, and costs the page nothing per frame. ScrollTrigger reads the native scroll
// position directly, so the scrubbed sections stay in step without any extra work here.
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

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      clearScrolling();
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clearScrolling, markScrolling } from "./scroll-flag";
import { holdingReloadPosition } from "./reload-scroll";
import { glideTo } from "./nav-glide";

gsap.registerPlugin(ScrollTrigger);

// On a phone the address bar sliding away resizes the window mid-scroll. Re-measuring every pinned
// and scrubbed section on each of those resizes made the page hitch, so only real changes re-measure.
ScrollTrigger.config({ ignoreMobileResize: true });

// Scrolling is left to the browser. The earlier version (Lenis) turned every wheel tick
// into JavaScript that ran on each frame, on top of the scrubbed animations, which is what
// made a heavy page stutter. Native scrolling runs on the compositor, has the platform's
// own momentum, and costs the page nothing per frame. ScrollTrigger reads the native scroll
// position directly, so the scrubbed sections stay in step without any extra work here.
const HOME_RETURN_KEY = "portfolio-home-return";

/** After Back/Forward to the home page, scrolls to where the visitor left it, and keeps it there for
    a moment while the page finishes laying out. Stops as soon as the visitor scrolls. */
function restoreHomeReturn() {
  const popAt = (window as Window & { __portfolioPopAt?: number }).__portfolioPopAt;
  const cameBack = popAt !== undefined && performance.now() - popAt < 2000;
  if (location.pathname !== "/" || !cameBack || holdingReloadPosition()) return () => {};
  let y = NaN;
  try {
    y = Number(sessionStorage.getItem(HOME_RETURN_KEY));
  } catch {
    return () => {};
  }
  if (!(y > 0)) return () => {};

  let frame = 0;
  let stopped = false;
  const until = performance.now() + 1500;
  const stop = () => {
    stopped = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop, true);
    window.removeEventListener("touchmove", stop, true);
    window.removeEventListener("keydown", stop, true);
  };
  window.addEventListener("wheel", stop, { capture: true, passive: true });
  window.addEventListener("touchmove", stop, { capture: true, passive: true });
  window.addEventListener("keydown", stop, true);
  const place = () => {
    if (stopped) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (Math.abs(window.scrollY - y) > 1 && max + 1 >= y) window.scrollTo({ top: y, behavior: "instant" });
    if (performance.now() < until) frame = requestAnimationFrame(place);
    else stop();
  };
  place();
  return stop;
}

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
      // "#id", or "/#id" while already on the home page
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("/#") && location.pathname !== "/") return;
      const id = href.replace(/^\/?#/, "");
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      glideTo(target, `#${id}`);
    };
    document.addEventListener("click", onClick);

    /* Returning to the home page with Back. Moving to a case study and back doesn't reload the page,
       so the browser's own scroll restore can land at the top (the page is still measuring its tall,
       pinned sections when it tries). Instead, the position is noted when a link to another page is
       clicked, and put back here when the home page comes back through Back/Forward. A Home link,
       which is a fresh visit, still starts at the top. */
    const saveReturn = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href");
      if (!href || href.startsWith("#") || location.pathname !== "/") return;
      try {
        sessionStorage.setItem(HOME_RETURN_KEY, String(Math.round(window.scrollY)));
      } catch {
        // Storage blocked: Back simply lands where the browser puts it
      }
    };
    document.addEventListener("click", saveReturn, true);
    const stopReturn = restoreHomeReturn();

    // Keep animation timing steady when a frame runs late, so scrubbed sections don't skip
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", saveReturn, true);
      stopReturn();
      clearScrolling();
    };
  }, []);

  return null;
}

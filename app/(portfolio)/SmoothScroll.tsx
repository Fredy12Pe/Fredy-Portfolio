"use client";

import { useEffect } from "react";
import { holdingReloadPosition } from "./reload-scroll";
import { glideTo } from "./nav-glide";

// Scrolling is left entirely to the browser: nothing here listens to scroll events or changes the page
// while it moves. (A scroll flag on <html> and an unused GSAP ScrollTrigger used to run on every
// scroll; the flag made the browser recheck the page's styles right as each scroll began.)
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

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", saveReturn, true);
      stopReturn();
    };
  }, []);

  return null;
}

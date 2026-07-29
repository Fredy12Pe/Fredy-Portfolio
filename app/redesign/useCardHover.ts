"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";

/** Matches the stacked board breakpoint in redesign.module.css */
export const MOBILE_LAYOUT_MQ = "(max-width: 900px)";

/**
 * Time for hover springs (0.4s + max stagger ~0.18s) to reach the end pose
 * on mobile tap replay. Navigation starts earlier so the page transition
 * overlaps the second half of this play.
 */
export const PROJECT_CARD_PLAY_MS = 700;

/** Rest spring settle before replaying to the end pose on mobile tap. */
export const PROJECT_CARD_REST_MS = 300;

/**
 * How long after the end-pose replay starts before pushing the case study.
 * Shorter than PLAY_MS so the route transition begins mid-animation.
 */
export const PROJECT_CARD_NAV_AFTER_MS = 220;

function subscribeMobileLayout(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_LAYOUT_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMobileLayoutSnapshot() {
  return window.matchMedia(MOBILE_LAYOUT_MQ).matches;
}

function getMobileLayoutServerSnapshot() {
  return false;
}

/** True when the redesign board uses the stacked mobile/tablet layout. */
export function useIsMobileLayout() {
  return useSyncExternalStore(
    subscribeMobileLayout,
    getMobileLayoutSnapshot,
    getMobileLayoutServerSnapshot,
  );
}

function subscribeDarkTheme(onChange: () => void) {
  const root = document.querySelector("[data-theme]");
  if (!root) return () => {};
  const obs = new MutationObserver(onChange);
  obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

function getDarkThemeSnapshot() {
  return (
    document.querySelector("[data-theme]")?.getAttribute("data-theme") ===
    "dark"
  );
}

function getDarkThemeServerSnapshot() {
  return false;
}

/** True when the redesign page is in dark theme. */
export function useIsDarkTheme() {
  return useSyncExternalStore(
    subscribeDarkTheme,
    getDarkThemeSnapshot,
    getDarkThemeServerSnapshot,
  );
}

type UseCardHoverOptions = {
  /**
   * When true (default), layer motion stays at rest under prefers-reduced-motion.
   * CSS hover colors are still forced via the mobile media query.
   */
  respectReducedMotion?: boolean;
  /**
   * When true (default), mobile locks the card to its end/hover pose.
   * Set false for cards that should keep their idle content on touch (e.g. Fredy bio).
   */
  forceHoverOnMobile?: boolean;
};

/**
 * Card hover that stays locked to the end pose on mobile (no hover affordance).
 * Desktop: pointer/focus as usual.
 * Prefer `useProjectCardNav` for case-study project cards (play-then-navigate).
 */
export function useCardHover(options: UseCardHoverOptions = {}) {
  const { respectReducedMotion = true, forceHoverOnMobile = true } = options;
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobileLayout();
  const [hovered, setHovered] = useState(false);

  const forceHover = forceHoverOnMobile && isMobile;
  const motionOk = !respectReducedMotion || !reduced;
  const active = (hovered || forceHover) && motionOk;

  const onPointerEnter = useCallback(() => setHovered(true), []);
  const onPointerLeave = useCallback(() => setHovered(false), []);
  const onFocus = useCallback(() => setHovered(true), []);
  const onBlur = useCallback(() => setHovered(false), []);

  return {
    active,
    forceHover,
    hovered,
    reduced,
    isMobile,
    handlers: {
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
    },
  };
}

/**
 * Project case-study cards: desktop hover as usual.
 * Mobile light: full final hover pose at idle; tap rewinds to rest → plays to end → navigates.
 * Mobile dark: glass idle (desktop dark look); same rewind → play → navigate, so the
 * background goes from dark glass to brand on press.
 */
export function useProjectCardNav(href: string) {
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobileLayout();
  const isDark = useIsDarkTheme();
  const [hovered, setHovered] = useState(false);
  /** True while the tap sequence is holding the rest (initial) pose. */
  const [rewinding, setRewinding] = useState(false);
  /** Dark mobile: arms the end pose after a tap (idle stays at rest). */
  const [tapArmed, setTapArmed] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lockedRef = useRef(false);

  useEffect(() => {
    return () => {
      for (const id of timersRef.current) clearTimeout(id);
    };
  }, []);

  const motionOk = !reduced;
  // Light mobile idle = end pose; dark mobile idle = rest until tap arms the sequence.
  const active = isMobile
    ? (isDark ? tapArmed : true) && !rewinding && motionOk
    : hovered && motionOk;

  const onPointerEnter = useCallback(() => {
    if (!isMobile) setHovered(true);
  }, [isMobile]);
  const onPointerLeave = useCallback(() => {
    if (!isMobile) setHovered(false);
  }, [isMobile]);
  const onFocus = useCallback(() => {
    if (!isMobile) setHovered(true);
  }, [isMobile]);
  const onBlur = useCallback(() => {
    if (!isMobile) setHovered(false);
  }, [isMobile]);

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      if (!isMobile) return;

      event.preventDefault();
      if (lockedRef.current) return;
      lockedRef.current = true;

      if (reduced) {
        router.push(href);
        return;
      }

      // Same sequence in light and dark: rest → end; navigate mid-play.
      // Light starts at end pose (so this rewinds first); dark starts at rest.
      if (isDark) setTapArmed(true);
      setRewinding(true);

      const toEnd = setTimeout(() => {
        setRewinding(false);
      }, PROJECT_CARD_REST_MS);

      const toCaseStudy = setTimeout(() => {
        router.push(href);
      }, PROJECT_CARD_REST_MS + PROJECT_CARD_NAV_AFTER_MS);

      timersRef.current = [toEnd, toCaseStudy];
    },
    [href, isDark, isMobile, reduced, router],
  );

  return {
    active,
    isMobile,
    rewinding,
    reduced,
    linkProps: {
      href,
      onClick,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      "data-card-replaying": rewinding ? "true" : undefined,
      "data-card-active": active ? "true" : undefined,
    },
  };
}

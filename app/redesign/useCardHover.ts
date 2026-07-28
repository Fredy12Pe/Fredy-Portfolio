"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/** Matches the stacked board breakpoint in redesign.module.css */
export const MOBILE_LAYOUT_MQ = "(max-width: 900px)";

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

type UseCardHoverOptions = {
  /**
   * When true (default), layer motion stays at rest under prefers-reduced-motion.
   * CSS hover colors are still forced via the mobile media query.
   */
  respectReducedMotion?: boolean;
};

/**
 * Card hover that stays locked to the end pose on mobile (no hover affordance).
 * Desktop: pointer/focus as usual.
 */
export function useCardHover(options: UseCardHoverOptions = {}) {
  const { respectReducedMotion = true } = options;
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobileLayout();
  const [hovered, setHovered] = useState(false);

  const forceHover = isMobile;
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

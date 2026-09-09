"use client";

import { useLayoutEffect, useRef, useState } from "react";

export const FRAME_WIDTH = 440;
export const FRAME_HEIGHT = 956;

/**
 * Scales a fixed design-size element down to the width it is laid out at, so
 * everything inside can keep Figma's exact pixel geometry.
 */
export function useStageScale<T extends HTMLElement = HTMLDivElement>(designWidth: number) {
  const ref = useRef<T>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const apply = () => {
      const width = el.clientWidth || el.parentElement?.clientWidth || designWidth;
      el.style.setProperty("--stage-scale", String(width / designWidth));
      setReady(true);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }
    return () => observer.disconnect();
  }, [designWidth]);

  return { ref, ready };
}

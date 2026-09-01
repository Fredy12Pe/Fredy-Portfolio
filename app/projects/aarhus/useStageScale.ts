"use client";

import { useLayoutEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 840;

/** Keeps --stage-scale in sync with the stage's laid-out width. */
export function useStageScale<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [scaled, setScaled] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const apply = () => {
      const width = el.clientWidth || el.parentElement?.clientWidth || DESIGN_WIDTH;
      el.style.setProperty("--stage-scale", String(width / DESIGN_WIDTH));
      setScaled(true);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }
    return () => observer.disconnect();
  }, []);

  return { ref, scaled };
}

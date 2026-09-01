"use client";

import { useEffect } from "react";
import { isAppleTouchDevice } from "./device";

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

/** Warm the cache after first paint so extra scene frames do not fight the LCP image. */
export function useIdlePrefetch(urls: readonly string[]) {
  const key = urls.join("|");

  useEffect(() => {
    const unique = [...new Set(key.split("|").filter(Boolean))];
    if (unique.length === 0 || isAppleTouchDevice()) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      for (const src of unique) {
        if (cancelled) {
          return;
        }
        await loadImage(src);
      }
    };

    const idleId = window.requestIdleCallback(() => {
      void run();
    }, { timeout: 1200 });

    return () => {
      cancelled = true;
      window.cancelIdleCallback(idleId);
    };
  }, [key]);
}

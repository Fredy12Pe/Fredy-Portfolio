"use client";

import { useEffect } from "react";

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

/** Warm the cache after the hero is ready so extra frames do not fight first paint. */
export function useIdlePrefetch(urls: readonly string[], enabled = true) {
  const key = urls.join("|");

  useEffect(() => {
    const unique = [...new Set(key.split("|").filter(Boolean))];
    if (!enabled || unique.length === 0) {
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
    }, { timeout: 1800 });

    return () => {
      cancelled = true;
      window.cancelIdleCallback(idleId);
    };
  }, [key, enabled]);
}

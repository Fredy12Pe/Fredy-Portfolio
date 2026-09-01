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

function scheduleIdle(callback: () => void) {
  const requestIdle = (
    window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    }
  ).requestIdleCallback;

  if (typeof requestIdle === "function") {
    const id = requestIdle(callback, { timeout: 1800 });
    return () => {
      (
        window as Window & { cancelIdleCallback?: (id: number) => void }
      ).cancelIdleCallback?.(id);
    };
  }

  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
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

    const cancel = scheduleIdle(() => {
      void run();
    });

    return () => {
      cancelled = true;
      cancel();
    };
  }, [key, enabled]);
}

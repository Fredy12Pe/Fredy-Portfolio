"use client";

import { useEffect, useRef } from "react";

/* Fade-up on arrival. The element gets data-revealed the first time it is on screen, and
   the watching stops there, so it plays once. Children marked with the fade-up class (see
   app/globals.css) rise in when that attribute appears. */

export function useReveal<T extends HTMLElement>(threshold = 0.15, rootMargin = "0px") {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      element.setAttribute("data-revealed", "");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.setAttribute("data-revealed", "");
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

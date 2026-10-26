"use client";

import * as React from "react";

/* One place to answer "is this on screen?".
   Several things on the page animate forever: blurred blobs, an SVG radar, WebGL loops.
   Off screen they cost exactly as much as on screen, so each of them needs the same
   gate, and each one making its own IntersectionObserver adds up. These share. */

export type VisibilityOptions = {
  /** How far outside the viewport still counts as visible. The default gives the
      caller a screen of warning, so waking up happens before anyone is looking. */
  rootMargin?: string;
  threshold?: number;
  /** What to assume before the observer first reports. */
  initial?: boolean;
};

const DEFAULT_ROOT_MARGIN = "200px 0px";

type Entry = { observer: IntersectionObserver; callbacks: Map<Element, (visible: boolean) => void> };

// Observers are shared by their settings, so thirty callers cost one or two of them
const pool = new Map<string, Entry>();

function groupFor(rootMargin: string, threshold: number): Entry {
  const key = `${rootMargin}|${threshold}`;
  const existing = pool.get(key);
  if (existing) return existing;

  const callbacks = new Map<Element, (visible: boolean) => void>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) callbacks.get(entry.target)?.(entry.isIntersecting);
    },
    { rootMargin, threshold },
  );
  const group: Entry = { observer, callbacks };
  pool.set(key, group);
  return group;
}

/** Calls back whenever the element enters or leaves. Returns a function that stops watching. */
export function observeVisibility(
  element: Element,
  onChange: (visible: boolean) => void,
  options: VisibilityOptions = {},
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onChange(true);
    return () => {};
  }
  const rootMargin = options.rootMargin ?? DEFAULT_ROOT_MARGIN;
  const threshold = options.threshold ?? 0;
  const group = groupFor(rootMargin, threshold);
  group.callbacks.set(element, onChange);
  group.observer.observe(element);

  return () => {
    group.callbacks.delete(element);
    group.observer.unobserve(element);
    if (group.callbacks.size === 0) {
      group.observer.disconnect();
      pool.delete(`${rootMargin}|${threshold}`);
    }
  };
}

/** Visibility as state, for deciding a prop. This re-renders, which is the point:
    the WebGL components need a changed `paused` prop to stop drawing. */
export function useVisible<T extends Element>(
  options: VisibilityOptions = {},
): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T | null>(null);
  const [visible, setVisible] = React.useState(options.initial ?? false);
  const { rootMargin, threshold, initial } = options;

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeVisibility(element, setVisible, { rootMargin, threshold, initial });
  }, [rootMargin, threshold, initial]);

  return [ref, visible];
}

/** Visibility as an attribute, for gating in CSS. This never re-renders, so the ten
    components that only need their animations to stop don't pay a React cost to do it. */
export function useVisibleAttr<T extends Element>(
  attribute = "data-visible",
  options: VisibilityOptions = {},
): React.RefObject<T | null> {
  const ref = React.useRef<T | null>(null);
  const { rootMargin, threshold, initial } = options;

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.setAttribute(attribute, String(initial ?? false));
    return observeVisibility(
      element,
      (visible) => element.setAttribute(attribute, String(visible)),
      { rootMargin, threshold, initial },
    );
  }, [attribute, rootMargin, threshold, initial]);

  return ref;
}

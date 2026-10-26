"use client";

/* While the page is moving, <html> carries data-scrolling and the decorative layers
   hold still. The flag has one owner so that everything which keeps the page moving
   can extend it: the wheel is only the start of it, and a scrubbed timeline carries
   on animating well after the gesture has finished. Anything that drives motion calls
   markScrolling() as it goes, and the flag lifts once they have all gone quiet. */

const ATTRIBUTE = "data-scrolling";

// Long enough to bridge the gap between a scrubbed timeline's updates, short enough
// that the decoration comes back promptly once the page has actually settled.
const TAIL_MS = 250;

let timer = 0;

export function markScrolling(): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(ATTRIBUTE, "");
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    timer = 0;
    document.documentElement.removeAttribute(ATTRIBUTE);
  }, TAIL_MS);
}

/** True while the page is still moving. For loops that check per frame. */
export function isScrolling(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute(ATTRIBUTE);
}

/** Clears the flag and any pending tail. For teardown. */
export function clearScrolling(): void {
  if (typeof document === "undefined") return;
  if (timer) window.clearTimeout(timer);
  timer = 0;
  document.documentElement.removeAttribute(ATTRIBUTE);
}

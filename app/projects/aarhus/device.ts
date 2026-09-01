export function isAppleTouchDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    /iP(ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

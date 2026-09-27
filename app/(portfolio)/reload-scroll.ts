export function markPortfolioLayout(part: "about" | "projects") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("portfolio-layout", { detail: part }));
}

export function holdingReloadPosition() {
  if (typeof window === "undefined") return false;
  return (
    (window as Window & { __portfolioHoldScroll?: boolean }).__portfolioHoldScroll ===
    true
  );
}

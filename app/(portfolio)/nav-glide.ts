/* Glides the home page to a section (or the top) for a menu or footer link. The glide is marked on
   <html data-navigating> until it settles, so scroll-driven sections (the Featured work folder) let
   it pass instead of holding the page on the way. */
export function glideTo(target: HTMLElement | "top", hash: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  root.dataset.navigating = "";
  const settle = () => {
    delete root.dataset.navigating;
    window.removeEventListener("scrollend", settle);
  };
  window.addEventListener("scrollend", settle);
  window.setTimeout(settle, 2000);
  if (target === "top") window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  history.replaceState(history.state, "", hash);
}

/** Click handler for "/" and "/#id" links in the menus and footer: on the home page it glides
    there instead of letting the router jump. Elsewhere the link navigates as usual. */
export function glideOnHome(event: { preventDefault: () => void }, href: string) {
  if (window.location.pathname !== "/") return;
  if (href === "/") {
    event.preventDefault();
    glideTo("top", "/");
    return;
  }
  const target = href.startsWith("/#") ? document.getElementById(href.slice(2)) : null;
  if (!target) return;
  event.preventDefault();
  glideTo(target, href.slice(1));
}

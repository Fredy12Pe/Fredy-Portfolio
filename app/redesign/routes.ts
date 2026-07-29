/** Portfolio page routes (promoted from /redesign preview). */
export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
} as const;

export type PortfolioSection = keyof typeof ROUTES;

export function isAboutPath(pathname: string) {
  return pathname === ROUTES.about || pathname.startsWith(`${ROUTES.about}/`);
}

export function isContactPath(pathname: string) {
  return (
    pathname === ROUTES.contact || pathname.startsWith(`${ROUTES.contact}/`)
  );
}

export function activePortfolioSection(
  pathname: string,
): PortfolioSection {
  if (isAboutPath(pathname)) return "about";
  if (isContactPath(pathname)) return "contact";
  return "home";
}

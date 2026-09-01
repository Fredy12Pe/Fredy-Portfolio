"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import styles from "./aarhus.module.css";
import { aarhusSans, aarhusSerif } from "./fonts";
import { NAV_ITEMS, type NavLabel } from "./nav";

const CHROME_ASSETS = {
  logo: "/projects/aarhus/logo.svg",
  search: "/projects/aarhus/search.svg",
  heart: "/projects/aarhus/heart.svg",
  bag: "/projects/aarhus/shopping-bag.svg",
} as const;

export function Icon({
  src,
  alt = "",
  width,
  height,
}: {
  src: string;
  alt?: string;
  width: number;
  height: number;
}) {
  return (
    <span className={styles.icon} style={{ width, height }}>
      <img src={src} alt={alt} width={width} height={height} />
    </span>
  );
}

function navLabelFromPath(pathname: string): NavLabel | null {
  return NAV_ITEMS.find((item) => item.href === pathname)?.label ?? null;
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export default function ArborChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeNav = navLabelFromPath(pathname);
  const finishTransition = useRef<(() => void) | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    finishTransition.current?.();
    finishTransition.current = null;
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function go(href: string, event: MouseEvent<HTMLAnchorElement>) {
    if (isModifiedClick(event) || href === pathname) {
      return;
    }

    event.preventDefault();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof document.startViewTransition !== "function") {
      router.push(href);
      return;
    }

    document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          finishTransition.current = resolve;
          router.push(href);
          window.setTimeout(resolve, 800);
        }),
    );
  }

  return (
    <div
      className={`${styles.page} ${aarhusSans.variable} ${aarhusSerif.variable}`}
      data-aarhus-page
      id="top"
    >
      <div className={styles.canvas}>
        <header className={styles.navbar}>
          <div className={styles.navbarItems}>
            <Link className={styles.logo} href="/projects/aarhus" aria-label="Arbor & Co. home">
              <span className={styles.logoMark}>
                <img src={CHROME_ASSETS.logo} alt="" width={45.5} height={26} />
              </span>
              <span className={styles.logoText}>Arbor & Co.</span>
            </Link>

            <nav
              id={menuId}
              className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}
              aria-label="Collections"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${styles.menuItem} ${
                    activeNav === item.label ? styles.menuItemActive : ""
                  }`}
                  aria-current={activeNav === item.label ? "page" : undefined}
                  onClick={(event) => go(item.href, event)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className={styles.navActions}>
            <button type="button" className={styles.iconBtn} aria-label="Search">
              <Icon src={CHROME_ASSETS.search} width={18} height={18} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Wishlist">
              <Icon src={CHROME_ASSETS.heart} width={18} height={18} />
            </button>
            <button type="button" className={styles.cartBadge} aria-label="Cart, 2 items">
              <Icon src={CHROME_ASSETS.bag} width={18} height={18} />
              <span className={styles.cartCount}>2</span>
            </button>
            <button
              type="button"
              className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={styles.menuToggleBars} aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </header>

        {menuOpen ? (
          <button
            type="button"
            className={styles.menuScrim}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}

        {children}

        <footer className={styles.footer}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <Link className={styles.logo} href="/projects/aarhus" aria-label="Arbor & Co. home">
                <span className={styles.logoMark}>
                  <img src={CHROME_ASSETS.logo} alt="" width={45.5} height={26} />
                </span>
                <span className={styles.logoText}>Arbor & Co.</span>
              </Link>
              <p className={styles.footerTagline}>
                Modular furniture, made to last.
                <br aria-hidden />
                Designed in Copenhagen.
              </p>
            </div>

            <nav className={styles.footerNav} aria-label="Footer">
              <div className={styles.footerCol}>
                <p className={styles.footerHeading}>Shop</p>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={styles.footerLink}
                    onClick={(event) => go(item.href, event)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className={styles.footerCol}>
                <p className={styles.footerHeading}>Atelier</p>
                {["Our Story", "Craftsmanship", "Showrooms", "Careers"].map((item) => (
                  <button key={item} type="button" className={styles.footerLink}>
                    {item}
                  </button>
                ))}
              </div>
              <div className={styles.footerCol}>
                <p className={styles.footerHeading}>Support</p>
                {[
                  "Interior Consultations",
                  "Delivery & Assembly",
                  "Warranty",
                  "Contact",
                ].map((item) => (
                  <button key={item} type="button" className={styles.footerLink}>
                    {item}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className={styles.footerBar}>
            <p className={styles.footerCopy}>© {new Date().getFullYear()} Arbor & Co.</p>
            <div className={styles.footerLegal}>
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <button key={item} type="button" className={styles.footerLegalLink}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import {
  useEffect,
  useState,
  type ReactNode,
  type TransitionEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import OverlayMenu from "./OverlayMenu";
import BoardAtmosphere from "./BoardAtmosphere";
import BentoFooter from "./BentoFooter";
import {
  RedesignProviders,
  useBreathingSession,
  usePageFade,
} from "./redesign-nav";
import styles from "./redesign.module.css";

type Theme = "light" | "dark";

const STORAGE_KEY = "redesign-theme";
const FADE_EASE = [0.22, 1, 0.36, 1] as const;
const SCROLL_HINT_HIDE_Y = 72;

const NAV_ITEMS = [
  { id: "home" as const, label: "Home", href: "/redesign" },
  { id: "about" as const, label: "About Me", href: "/redesign/about" },
  { id: "contact" as const, label: "Contact", href: "/redesign/contact" },
];

export default function RedesignShell({ children }: { children: ReactNode }) {
  return (
    <RedesignProviders>
      <RedesignShellInner>{children}</RedesignShellInner>
    </RedesignProviders>
  );
}

function RedesignShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/redesign";
  const reduced = useReducedMotion();
  const { breathingActive } = useBreathingSession();
  const { contentVisible, onFadeOutComplete, fadeTo } = usePageFade();
  const [theme, setTheme] = useState<Theme>("light");
  const [scrollHintVisible, setScrollHintVisible] = useState(false);

  const compact =
    pathname.startsWith("/redesign/about") ||
    pathname.startsWith("/redesign/contact");
  const isContact = pathname.startsWith("/redesign/contact");
  const isDark = theme === "dark";

  const activeNav = pathname.startsWith("/redesign/about")
    ? "about"
    : pathname.startsWith("/redesign/contact")
      ? "contact"
      : "home";

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    function updateScrollHint() {
      const canScroll =
        document.documentElement.scrollHeight > window.innerHeight + 40;
      const nearTop = window.scrollY < SCROLL_HINT_HIDE_Y;
      setScrollHintVisible(canScroll && nearTop);
    }

    updateScrollHint();
    window.addEventListener("scroll", updateScrollHint, { passive: true });
    window.addEventListener("resize", updateScrollHint);
    return () => {
      window.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
    };
  }, [pathname, contentVisible]);

  function toggleTheme() {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  function onFadeTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "opacity") return;
    if (event.target !== event.currentTarget) return;
    if (!contentVisible) onFadeOutComplete();
  }

  function scrollDownOneViewport() {
    window.scrollBy({
      top: Math.round(window.innerHeight * 0.72),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <main
      className={styles.page}
      data-theme={theme}
      data-breathing={breathingActive ? "active" : undefined}
    >
      <BoardAtmosphere />

      <div
        className={`${styles.pageContent}${compact ? ` ${styles.pageContentCompact}` : ""}${isContact ? ` ${styles.pageContentContact}` : ""}`}
      >
        <div className={styles.topChrome}>
          <nav className={styles.mobileTopNav} aria-label="Portfolio">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={styles.mobileTopNavLink}
                  data-active={isActive ? "true" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={breathingActive ? -1 : undefined}
                  onClick={(event) => {
                    if (
                      breathingActive ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey ||
                      event.button !== 0
                    ) {
                      return;
                    }
                    event.preventDefault();
                    fadeTo(item.href);
                  }}
                >
                  {isActive ? (
                    <motion.span
                      className={styles.mobileTopNavPill}
                      layoutId="mobile-top-nav-pill"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", duration: 0.42, bounce: 0.18 }
                      }
                      aria-hidden
                    />
                  ) : null}
                  <span className={styles.mobileTopNavLabel}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            disabled={breathingActive}
          >
            <span className={styles.themeToggleTrack} aria-hidden>
              <span
                className={styles.themeToggleThumb}
                data-active={isDark ? "dark" : "light"}
              />
              <span className={styles.themeToggleIcon} data-side="light">
                <SunIcon />
              </span>
              <span className={styles.themeToggleIcon} data-side="dark">
                <MoonIcon />
              </span>
            </span>
          </button>
        </div>

        <div
          className={styles.pageFade}
          data-visible={contentVisible ? "true" : "false"}
          data-reduced={reduced ? "true" : undefined}
          onTransitionEnd={onFadeTransitionEnd}
        >
          {children}
          <BentoFooter />
        </div>
      </div>

      <button
        type="button"
        className={styles.scrollHint}
        data-visible={
          scrollHintVisible && !breathingActive ? "true" : "false"
        }
        data-reduced={reduced ? "true" : undefined}
        aria-label="Scroll down"
        tabIndex={scrollHintVisible && !breathingActive ? 0 : -1}
        onClick={scrollDownOneViewport}
      >
        <svg
          className={styles.scrollHintIcon}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 5v14M12 19l-5-5M12 19l5-5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <OverlayMenu />

      <AnimatePresence>
        {breathingActive ? (
          <motion.div
            key="breathing-overlay"
            className={styles.breathingOverlay}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: FADE_EASE }}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2.5v2.25M12 19.25V21.5M21.5 12h-2.25M4.75 12H2.5M18.72 5.28l-1.59 1.59M6.87 17.13l-1.59 1.59M18.72 18.72l-1.59-1.59M6.87 6.87 5.28 5.28"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.2 14.1A8.2 8.2 0 0 1 9.9 3.8 8.5 8.5 0 1 0 20.2 14.1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

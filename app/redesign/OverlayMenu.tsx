"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePageFade } from "./redesign-nav";
import styles from "./redesign.module.css";

type Section = "home" | "about" | "contact";

const ITEMS: { id: Section; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/redesign" },
  { id: "about", label: "About Me", href: "/redesign/about" },
  { id: "contact", label: "Contact", href: "/redesign/contact" },
];

export default function OverlayMenu() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { fadeTo } = usePageFade();
  const [active, setActive] = useState<Section>("home");

  useEffect(() => {
    function sync() {
      if (pathname?.startsWith("/redesign/about")) {
        setActive("about");
        return;
      }
      if (pathname?.startsWith("/redesign/contact")) {
        setActive("contact");
        return;
      }
      const hash = window.location.hash.replace("#", "");
      if (hash === "contact") {
        setActive("contact");
        return;
      }
      if (hash === "about") {
        setActive("about");
        return;
      }
      setActive("home");
    }

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <div className={styles.overlayMenu}>
      <nav className={styles.overlayMenuBar} aria-label="Portfolio">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              className={`${styles.overlayMenuItem}${isActive ? ` ${styles.overlayMenuItemActive}` : ""}`}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  event.button !== 0
                ) {
                  return;
                }
                event.preventDefault();
                setActive(item.id);
                fadeTo(item.href);
              }}
            >
              {isActive ? (
                <motion.span
                  className={styles.overlayMenuPill}
                  layoutId="overlay-menu-pill"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", duration: 0.42, bounce: 0.18 }
                  }
                  aria-hidden
                />
              ) : null}
              <span className={styles.overlayMenuLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

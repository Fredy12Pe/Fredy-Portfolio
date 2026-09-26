"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Inter } from "next/font/google";
import { RuixenGradientFooter } from "@/components/ui/ruixen-gradient-footer";
import { CONTACT_EMAIL } from "../redesign/contact-links";
import styles from "./SiteFooter.module.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Works" },
  { href: "/#about", label: "About Me" },
  { href: "/#contact", label: "Contact" },
] as const;

function onSamePageHash(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (window.location.pathname !== "/") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (href === "/") {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    window.history.pushState(null, "", href);
    return;
  }

  if (!href.startsWith("/#")) return;
  const target = document.getElementById(href.slice(2));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  window.history.pushState(null, "", href);
}

export default function SiteFooter() {
  return (
    <RuixenGradientFooter
      className={`${styles.footer} ${inter.className}`}
      gradientHeight="26vh"
      minReveal={0}
    >
      <div className={styles.stage}>
        <div className={styles.inner}>
          <h2 className={styles.headline}>
            Designing
            <br />
            products
            <br />
            people feel.
          </h2>

          <div className={styles.group}>
            <p className={styles.label}>/Quick links</p>
            <ul className={styles.links}>
              {LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    className={styles.pill}
                    href={item.href}
                    onClick={(event) => onSamePageHash(event, item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.group}>
            <p className={styles.label}>/Contact</p>
            <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </RuixenGradientFooter>
  );
}

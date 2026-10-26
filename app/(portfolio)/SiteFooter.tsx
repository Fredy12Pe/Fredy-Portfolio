"use client";

import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { roboto } from "@/lib/fonts";
import { useReveal } from "@/lib/reveal";
import FooterSignature from "./FooterSignature";
import { CONTACT_EMAIL } from "../redesign/contact-links";
import styles from "./SiteFooter.module.css";

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

/* The footer's contents fade up once the footer itself has finished fading in
   (its fade is 0.8s, see .fade-up in globals.css), staggered in order */
const AFTER_FOOTER_MS = 800;

function afterFooter(index: number) {
  return { "--fade-delay": `${AFTER_FOOTER_MS}ms`, "--fade-i": index } as CSSProperties;
}

export default function SiteFooter() {
  const revealRef = useReveal<HTMLElement>();

  return (
    <div className={styles.frame}>
      <footer ref={revealRef} className={`${styles.footer} ${roboto.className} fade-up`}>
        <div className={styles.stage}>
          <div className={styles.inner}>
            <h2 className={`${styles.headline} fade-up`} style={afterFooter(0)}>
              Designing
              <br />
              products
              <br />
              people feel.
            </h2>

            <div className={`${styles.group} fade-up`} style={afterFooter(1)}>
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

            <div className={`${styles.group} fade-up`} style={afterFooter(2)}>
              <p className={styles.label}>/Contact</p>
              <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Full-width signature, like a wordmark across the bottom of the page */}
          <div className={`${styles.wordmark} fade-up`} style={afterFooter(3)}>
            <FooterSignature />
          </div>
        </div>
      </footer>
    </div>
  );
}

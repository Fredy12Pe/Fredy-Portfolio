"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { inter } from "@/lib/fonts";
import { useReveal } from "@/lib/reveal";
import FooterSignature from "./FooterSignature";
import { CONTACT_EMAIL, CONTACT_LINKS } from "../redesign/contact-links";
import { glideOnHome } from "./nav-glide";
import styles from "./SiteFooter.module.css";

/* The home page's sections, in page order */
const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Featured work" },
  { href: "/#about", label: "About me" },
  { href: "/#skills", label: "Skills" },
  { href: "/#open-to-work", label: "Open to work" },
  { href: "/#contact", label: "Contact" },
] as const;

const ELSEWHERE = [
  { href: CONTACT_LINKS.linkedin, label: "LinkedIn" },
  { href: CONTACT_LINKS.github, label: "GitHub" },
  { href: CONTACT_LINKS.instagram, label: "Instagram" },
] as const;

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
      <footer ref={revealRef} className={`${styles.footer} ${inter.className} fade-up`}>
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
              <p className={styles.label}>Quick links</p>
              <ul className={styles.links}>
                {LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      className={styles.pill}
                      href={item.href}
                      onClick={(event) => glideOnHome(event, item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.group} fade-up`} style={afterFooter(2)}>
              <p className={styles.label}>Contact</p>
              <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <ul className={styles.elsewhere}>
                {ELSEWHERE.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={CONTACT_LINKS.resume} download>
                    Resume <span aria-hidden>↓</span>
                  </a>
                </li>
              </ul>
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

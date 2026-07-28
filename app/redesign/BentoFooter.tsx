"use client";

import { useEffect, useState } from "react";
import { CONTACT_LINKS } from "./contact-links";
import { useBreathingSession } from "./redesign-nav";
import styles from "./redesign.module.css";

const LA = {
  label: "Los Angeles",
  lat: 34.0522,
  lon: -118.2437,
  timeZone: "America/Los_Angeles",
} as const;

const LINKS = [
  { label: "LinkedIn", href: CONTACT_LINKS.linkedin, external: true },
  { label: "Instagram", href: CONTACT_LINKS.instagram, external: true },
  { label: "GitHub", href: CONTACT_LINKS.github, external: true },
  {
    label: "Resume",
    href: CONTACT_LINKS.resume,
    external: false,
    download: "Fredy Pedro - Resume.pdf",
  },
] as const;

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LA.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export default function BentoFooter() {
  const { breathingActive } = useBreathingSession();
  const [now, setNow] = useState<Date | null>(null);
  const [tempF, setTempF] = useState<number | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${LA.lat}&longitude=${LA.lon}` +
          `&current=temperature_2m&temperature_unit=fahrenheit`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = (await res.json()) as {
          current?: { temperature_2m?: number };
        };
        const t = data.current?.temperature_2m;
        if (!cancelled && typeof t === "number") {
          setTempF(Math.round(t));
        }
      } catch {
        /* keep footer usable without weather */
      }
    }

    loadWeather();
    const id = window.setInterval(loadWeather, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const clock = now ? formatClock(now) : "--:--:--";
  const statusParts = [
    LA.label,
    tempF !== null ? `${tempF}°F` : null,
    clock,
  ].filter(Boolean);

  return (
    <footer
      className={styles.bentoFooter}
      data-hidden={breathingActive ? "true" : undefined}
      aria-label="Status and links"
    >
      <p className={styles.bentoFooterStatus} aria-live="polite">
        {statusParts.join(" · ")}
      </p>

      <nav className={styles.bentoFooterLinks} aria-label="Social and resume">
        {LINKS.map((link, i) => (
          <span key={link.label} className={styles.bentoFooterLinkItem}>
            {i > 0 ? (
              <span className={styles.bentoFooterDivider} aria-hidden />
            ) : null}
            <a
              className={styles.bentoFooterLink}
              href={link.href}
              {...("download" in link && link.download
                ? { download: link.download }
                : {})}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          </span>
        ))}
      </nav>
    </footer>
  );
}

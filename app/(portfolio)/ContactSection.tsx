"use client";

import { CSSProperties, FormEvent, useState } from "react";
import { roboto } from "@/lib/fonts";
import { CursorTrail } from "@/components/ui/cursor-trail";
import { useReveal } from "@/lib/reveal";
import { CONTACT_EMAIL, CONTACT_LINKS } from "../redesign/contact-links";
import styles from "./ContactSection.module.css";

const SOCIALS = [
  { label: "Instagram", href: CONTACT_LINKS.instagram, icon: InstagramIcon },
  { label: "LinkedIn", href: CONTACT_LINKS.linkedin, icon: LinkedInIcon },
] as const;

type Status = { tone: "neutral" | "error"; text: string } | null;

/** Delay order for elements that fade up together (see .fade-up in globals.css) */
function stagger(index: number) {
  return { "--fade-i": index } as CSSProperties;
}

export default function ContactSection() {
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);
  const revealRef = useReveal<HTMLElement>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const project = String(data.get("project") ?? "").trim();

    if (!name || !email || !project) {
      setStatus({ tone: "error", text: "Fill in your name, email, and project." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ tone: "error", text: "Enter a valid email." });
      return;
    }

    setSending(true);
    setStatus(null);

    const subject = `Project inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${project}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus({ tone: "neutral", text: "Opening your email app." });
    setSending(false);
  }

  return (
    <section
      ref={revealRef}
      id="contact"
      className={`${styles.section} ${roboto.className}`}
      aria-label="Get in contact"
    >
      <CursorTrail className="absolute inset-0" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div>
            <h2 className={`${styles.heading} fade-up`} style={stagger(0)}>
              Let’s talk.
            </h2>
            <p className={`${styles.subhead} fade-up`} style={stagger(1)}>
              Have a project or need help? Fill out the form, and I’ll get back to you soon.
            </p>
          </div>
          <ul className={`${styles.socials} fade-up`} style={stagger(2)}>
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  className={styles.social}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              </li>
            ))}
            <li>
              <a
                className={styles.resume}
                href={CONTACT_LINKS.resume}
                download="Fredy Pedro - Resume.pdf"
              >
                <DownloadIcon />
                Download Resume
              </a>
            </li>
          </ul>
        </div>

        <form
          className={`${styles.form} fade-up`}
          style={stagger(1)}
          onSubmit={onSubmit}
          noValidate
        >
          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <input
              className={styles.input}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Your Project</span>
            <textarea
              className={styles.textarea}
              name="project"
              placeholder="Tell us about your project"
              required
            />
          </label>
          {status ? (
            <p className={styles.status} data-tone={status.tone} role="status">
              {status.text}
            </p>
          ) : null}
          <button className={styles.submit} type="submit" disabled={sending}>
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4v10.5M7.5 11.5 12 16l4.5-4.5M5 19.5h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.7 9.3H4V20h2.7V9.3ZM5.3 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20 20h-2.7v-5.6c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H10.6V9.3h2.6v1.5c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8V20Z" />
    </svg>
  );
}

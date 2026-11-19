"use client";

import { CSSProperties, FormEvent, useEffect, useRef, useState, type PointerEvent } from "react";
import { inter } from "@/lib/fonts";
import { useReveal } from "@/lib/reveal";
import { CONTACT_EMAIL, CONTACT_LINKS } from "../redesign/contact-links";
import ResumeDownload from "./ResumeDownload";
import { GitHubIcon, InstagramIcon, LinkedInIcon } from "./social-icons";
import styles from "./ContactSection.module.css";

const SOCIALS = [
  { label: "Instagram", href: CONTACT_LINKS.instagram, icon: InstagramIcon },
  { label: "LinkedIn", href: CONTACT_LINKS.linkedin, icon: LinkedInIcon },
  { label: "GitHub", href: CONTACT_LINKS.github, icon: GitHubIcon },
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
      className={`${styles.section} ${inter.className}`}
      aria-label="Get in contact"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div>
            <h2 className={`${styles.heading} ${inter.className} fade-up`} style={stagger(0)}>
              Let’s connect.
            </h2>
            <p className={`${styles.subhead} fade-up`} style={stagger(1)}>
              Have a project or a role in mind? Email me or fill out the form, and I’ll get back
              to you soon.
            </p>
            <div className={`${styles.emailRow} fade-up`} style={stagger(2)}>
              <a className={styles.email} href={CONTACT_LINKS.email}>
                {CONTACT_EMAIL}
              </a>
              <CopyEmailButton />
            </div>
          </div>
          <ul className={`${styles.socials} fade-up`} style={stagger(3)}>
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
            <li className={styles.resumeItem}>
              <ResumeDownload />
            </li>
          </ul>
        </div>

        <ContactForm onSubmit={onSubmit} status={status} sending={sending} />
      </div>
    </section>
  );
}

/* Starters for the message: picking one writes an opening line the visitor can keep or change */
const TOPICS = [
  { label: "Hiring for a role", text: "Hi Fredy, I'm hiring for a role and think you could be a great fit. " },
  { label: "A project", text: "Hi Fredy, I have a project I'd love your help with. " },
  { label: "Just saying hi", text: "Hi Fredy, I came across your portfolio and wanted to say hi. " },
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* The form. Sending is unchanged (onSubmit in ContactSection); this adds the interaction around it:
   a progress line that fills as the fields are completed, labels that float up, a check on each
   finished field, message starters, a message box that grows with the text, a soft light that
   follows the pointer, and a send button that lights up once everything is filled in. */
function ContactForm({
  onSubmit,
  status,
  sending,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: Status;
  sending: boolean;
}) {
  const [values, setValues] = useState({ name: "", email: "", project: "" });
  const [tried, setTried] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const done = {
    name: values.name.trim() !== "",
    email: EMAIL_PATTERN.test(values.email.trim()),
    project: values.project.trim() !== "",
  };
  const count = Object.values(done).filter(Boolean).length;
  const ready = count === 3;

  const update = (field: keyof typeof values) => (event: { currentTarget: { value: string } }) => {
    // Read now: the event's target is gone by the time the state update runs
    const value = event.currentTarget.value;
    setValues((v) => ({ ...v, [field]: value }));
  };

  // The message box grows with what is written in it
  useEffect(() => {
    const box = messageRef.current;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${box.scrollHeight}px`;
  }, [values.project]);

  const pickTopic = (label: string, text: string) => {
    setTopic(label);
    setValues((v) => {
      // Swaps out an earlier starter, but never what the visitor wrote themselves
      const starters = TOPICS.map((t) => t.text);
      const current = v.project;
      const own = starters.reduce((rest, s) => (rest.startsWith(s) ? rest.slice(s.length) : rest), current);
      return { ...v, project: text + own };
    });
    requestAnimationFrame(() => {
      const box = messageRef.current;
      if (!box) return;
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
    });
  };

  const follow = (event: PointerEvent<HTMLFormElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  };

  const invalid = (field: keyof typeof done) => (tried && !done[field] ? "" : undefined);

  return (
    <form
      className={`${styles.form} fade-up`}
      style={stagger(1)}
      onSubmit={(event) => {
        setTried(true);
        onSubmit(event);
      }}
      onPointerMove={follow}
      noValidate
    >
      <div className={styles.formHead}>
        <p className={styles.formTitle}>Send a message</p>
        <p className={styles.formCount} aria-live="polite">
          {count}/3
        </p>
      </div>
      <div className={styles.progress} aria-hidden>
        <span style={{ transform: `scaleX(${count / 3})` }} />
      </div>

      <div className={styles.topics} role="group" aria-label="What is this about?">
        {TOPICS.map((t) => (
          <button
            key={t.label}
            type="button"
            className={styles.topic}
            aria-pressed={topic === t.label}
            onClick={() => pickTopic(t.label, t.text)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label className={styles.field} data-done={done.name ? "" : undefined} data-invalid={invalid("name")}>
        <input
          className={styles.input}
          name="name"
          type="text"
          autoComplete="name"
          placeholder=" "
          required
          value={values.name}
          onChange={update("name")}
        />
        <span className={styles.label}>Your name</span>
        <Check />
      </label>
      <label className={styles.field} data-done={done.email ? "" : undefined} data-invalid={invalid("email")}>
        <input
          className={styles.input}
          name="email"
          type="email"
          autoComplete="email"
          placeholder=" "
          required
          value={values.email}
          onChange={update("email")}
        />
        <span className={styles.label}>Email</span>
        <Check />
      </label>
      <label className={styles.field} data-done={done.project ? "" : undefined} data-invalid={invalid("project")}>
        <textarea
          ref={messageRef}
          className={styles.textarea}
          name="project"
          placeholder=" "
          rows={4}
          required
          value={values.project}
          onChange={update("project")}
        />
        <span className={styles.label}>Tell me about the role or project</span>
        <Check />
      </label>

      {/* An error goes once the fields it was about are filled in */}
      {status && !(status.tone === "error" && ready) ? (
        <p className={styles.status} data-tone={status.tone} role="status">
          {status.text}
        </p>
      ) : null}
      <button className={styles.submit} type="submit" disabled={sending} data-ready={ready ? "" : undefined}>
        <span>Send message</span>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5" />
        </svg>
      </button>
    </form>
  );
}

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 24 24" aria-hidden>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

/* Copies the email address and confirms it, in words that a screen reader also hears */
function CopyEmailButton() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  }

  return (
    <button
      type="button"
      className={styles.copyButton}
      data-copied={state === "copied" ? "" : undefined}
      onClick={copy}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        {state === "copied" ? (
          <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="M15.5 5.5h-8a2 2 0 0 0-2 2v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy email"}
      </span>
    </button>
  );
}

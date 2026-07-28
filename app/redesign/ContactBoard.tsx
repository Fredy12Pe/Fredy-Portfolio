"use client";

/** Contact page board — Figma layout with brand link cards. */
import { useState, type MouseEvent, type ReactNode } from "react";
import { motion, type Transition } from "motion/react";
import { CONTACT_EMAIL, CONTACT_LINKS } from "./contact-links";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

const REST = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER = { type: "spring", duration: 0.4, bounce: 0.28 } as const;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M5 13L13 5M13 5H6.5M13 5V11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 3.5v8M9 11.5 5.75 8.25M9 11.5l3.25-3.25M3.5 14.5h11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect
        x="6"
        y="6"
        width="8.5"
        height="8.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 12V4.5A1.5 1.5 0 0 1 5.5 3H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4.5 9.5 7.5 12.5 13.5 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactArrow({
  cardW,
  cardH,
  left,
  top = 42,
}: {
  cardW: number;
  cardH: number;
  left: number;
  top?: number;
}) {
  return (
    <span
      className={styles.contactPageArrow}
      style={{
        left: pct(left, cardW),
        top: pct(top, cardH),
        width: pct(44, cardW),
      }}
      aria-hidden
    >
      <ArrowIcon />
    </span>
  );
}

function ContactActionBar({
  cardW,
  cardH,
  children,
  top = 42,
  right = 42,
}: {
  cardW: number;
  cardH: number;
  children: ReactNode;
  top?: number;
  right?: number;
}) {
  return (
    <div
      className={styles.contactPageActions}
      style={{
        top: pct(top, cardH),
        right: pct(right, cardW),
      }}
    >
      {children}
    </div>
  );
}

function ContactLabel({
  cardW,
  cardH,
  icon,
  label,
  left = 42,
  top,
  iconSize = 60,
}: {
  cardW: number;
  cardH: number;
  icon: ReactNode;
  label: string;
  left?: number;
  top: number;
  iconSize?: number;
}) {
  return (
    <span
      className={styles.contactPageMeta}
      style={{
        left: pct(left, cardW),
        top: pct(top, cardH),
      }}
    >
      <span
        className={styles.contactPageIcon}
        style={{ width: `${(iconSize / cardW) * 100}cqw` }}
      >
        {icon}
      </span>
      <span className={styles.contactPageLabel}>{label}</span>
    </span>
  );
}

function Orb({
  cardW,
  cardH,
  left,
  top,
  size,
  active,
  delay = 0,
  hover,
}: {
  cardW: number;
  cardH: number;
  left: number;
  top: number;
  size: number;
  active: boolean;
  delay?: number;
  hover?: { x?: string; y?: string; scale?: number };
}) {
  return (
    <motion.span
      className={styles.contactPageOrb}
      style={{
        left: pct(left, cardW),
        top: pct(top, cardH),
        width: pct(size, cardW),
      }}
      initial={false}
      animate={
        active && hover
          ? { x: hover.x ?? 0, y: hover.y ?? 0, scale: hover.scale ?? 1 }
          : { x: 0, y: 0, scale: 1 }
      }
      transition={
        {
          ...(active ? HOVER : REST),
          delay: active ? delay : 0,
        } as Transition
      }
      aria-hidden
    />
  );
}

/* ── Intro 574×244 ─────────────────────────────────────────────── */

function IntroCard() {
  const { active, handlers } = useCardHover();
  const TITLE = "Hey, let’s get in contact!";

  return (
    <section
      className={`${styles.card} ${styles.contactIntro}`}
      aria-label={TITLE}
      data-node-id="contact-intro"
      tabIndex={0}
      {...handlers}
    >
      <h1 className={styles.contactIntroTitle} aria-label={TITLE}>
        {TITLE.split("").map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className={styles.contactIntroChar}
            initial={false}
            animate={active ? { y: "-0.08em", scale: 1.03 } : { y: 0, scale: 1 }}
            transition={
              {
                ...(active ? HOVER : REST),
                delay: active ? i * 0.018 : (TITLE.length - 1 - i) * 0.01,
              } as Transition
            }
          >
            {char === " " ? "\u00a0" : char}
          </motion.span>
        ))}
      </h1>
    </section>
  );
}

/* ── Brand icons (self-contained 24×24 marks) ──────────────────── */

function InstagramIcon() {
  return (
    <svg
      className={`${styles.contactBrandSvg} ${styles.contactIgSvg}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <defs>
        <linearGradient id="ig-official" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FED576" />
          <stop offset="25%" stopColor="#F47133" />
          <stop offset="50%" stopColor="#BC3081" />
          <stop offset="100%" stopColor="#4C63D2" />
        </linearGradient>
      </defs>
      {/* Official Instagram logo path */}
      <path
        className={styles.contactIgMark}
        fill="url(#ig-official)"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      className={`${styles.contactBrandSvg} ${styles.contactGhSvg}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <rect className={styles.contactIconTile} width="24" height="24" rx="6.5" />
      <path
        className={styles.contactIconGlyph}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5.4c-3.64 0-6.6 2.97-6.6 6.63 0 2.93 1.89 5.41 4.51 6.29.33.06.45-.14.45-.32v-1.13c-1.84.4-2.23-.79-2.23-.79-.3-.77-.73-.98-.73-.98-.6-.41.05-.4.05-.4.66.05 1.01.68 1.01.68.59 1.02 1.54.72 1.92.55.06-.43.23-.72.42-.89-1.46-.17-3-.74-3-3.28 0-.72.25-1.32.67-1.78-.07-.17-.29-.84.06-1.75 0 0 .55-.18 1.8.67a6.2 6.2 0 0 1 3.28 0c1.25-.85 1.8-.67 1.8-.67.35.91.13 1.58.06 1.75.42.46.67 1.06.67 1.78 0 2.55-1.54 3.11-3.01 3.28.24.21.45.62.45 1.24v1.84c0 .18.12.39.46.32A6.63 6.63 0 0 0 18.6 12c0-3.66-2.96-6.6-6.6-6.6Z"
      />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg
      className={`${styles.contactBrandSvg} ${styles.contactResumeSvg}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <rect className={styles.contactIconTile} width="24" height="24" rx="5.5" />
      <path
        className={styles.contactIconGlyph}
        d="M8.25 4.5h5.4l3.6 3.6v11.4a1.35 1.35 0 0 1-1.35 1.35h-7.65A1.35 1.35 0 0 1 6.9 19.5V5.85A1.35 1.35 0 0 1 8.25 4.5Z"
      />
      <path className={styles.contactResumeFold} d="M13.65 4.5V8.1h3.6" />
      <path
        className={styles.contactResumeLines}
        strokeWidth="1.35"
        strokeLinecap="round"
        d="M9.3 12h5.4M9.3 14.7h5.4M9.3 17.4h3.6"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className={`${styles.contactBrandSvg} ${styles.contactLiSvg}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {/* Official LinkedIn logo (Simple Icons) */}
      <path
        className={styles.contactLiMark}
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg className={styles.contactBrandSvg} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="5.5" fill="#242938" />
      <g transform="translate(3.2 3.2) scale(0.733)">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </g>
    </svg>
  );
}

/* ── Instagram 546×478 ─────────────────────────────────────────── */

const IG = { w: 546, h: 478 } as const;

function InstagramCard() {
  const { active, handlers } = useCardHover();

  return (
    <a
      className={`${styles.card} ${styles.contactIg}`}
      href={CONTACT_LINKS.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      data-node-id="contact-instagram"
      {...handlers}
    >
      <div className={styles.contactPageScene}>
        <Orb
          cardW={IG.w}
          cardH={IG.h}
          left={374}
          top={293}
          size={272}
          active={active}
          hover={{ x: "6%", y: "-8%", scale: 1.06 }}
        />
        <ContactArrow cardW={IG.w} cardH={IG.h} left={460} />
        <ContactLabel
          cardW={IG.w}
          cardH={IG.h}
          icon={<InstagramIcon />}
          label="INSTAGRAM"
          top={376}
        />
      </div>
    </a>
  );
}

/* ── GitHub 546×478 ────────────────────────────────────────────── */

const GH = { w: 546, h: 478 } as const;

function GitHubCard() {
  const { active, handlers } = useCardHover();
  const cells = [
    { left: 26, top: -95, delay: 0 },
    { left: 166, top: -95, delay: 0.04 },
    { left: 26, top: 45, delay: 0.08 },
    { left: 166, top: 45, delay: 0.12 },
  ] as const;

  return (
    <a
      className={`${styles.card} ${styles.contactGh}`}
      href={CONTACT_LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      data-node-id="contact-github"
      {...handlers}
    >
      <div className={styles.contactPageScene}>
        {cells.map((cell, i) => (
          <Orb
            key={i}
            cardW={GH.w}
            cardH={GH.h}
            left={cell.left}
            top={cell.top}
            size={140}
            active={active}
            delay={cell.delay}
            hover={{ y: "12%", scale: 1.04 }}
          />
        ))}
        <ContactArrow cardW={GH.w} cardH={GH.h} left={460} />
        <ContactLabel
          cardW={GH.w}
          cardH={GH.h}
          icon={<GitHubIcon />}
          label="GITHUB"
          top={376}
        />
      </div>
    </a>
  );
}

/* ── Resume 574×341 ────────────────────────────────────────────── */

const CV = { w: 574, h: 341 } as const;

function ResumeCard() {
  const { active, handlers } = useCardHover();

  return (
    <section
      className={`${styles.card} ${styles.contactResume}`}
      aria-label="Resume"
      data-node-id="contact-resume"
      {...handlers}
    >
      <div className={styles.contactPageScene}>
        <Orb
          cardW={CV.w}
          cardH={CV.h}
          left={334}
          top={271}
          size={140}
          active={active}
          hover={{ x: "-4%", y: "-10%", scale: 1.08 }}
        />
        <Orb
          cardW={CV.w}
          cardH={CV.h}
          left={474}
          top={271}
          size={140}
          active={active}
          delay={0.06}
          hover={{ x: "6%", y: "-12%", scale: 1.08 }}
        />
        <ContactActionBar cardW={CV.w} cardH={CV.h}>
          <a
            className={styles.contactPageAction}
            href={CONTACT_LINKS.resume}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View resume"
          >
            <ArrowIcon />
          </a>
          <a
            className={styles.contactPageAction}
            href={CONTACT_LINKS.resume}
            download="Fredy Pedro - Resume.pdf"
            aria-label="Download resume"
          >
            <DownloadIcon />
          </a>
        </ContactActionBar>
        <ContactLabel
          cardW={CV.w}
          cardH={CV.h}
          icon={<ResumeIcon />}
          label="RESUME"
          top={239}
        />
      </div>
    </section>
  );
}

/* ── LinkedIn 574×312 ──────────────────────────────────────────── */

const LI = { w: 574, h: 312 } as const;

function LinkedInCard() {
  const { active, handlers } = useCardHover();
  const cells = [
    { left: 259, top: 180, w: 90, delay: 0 },
    { left: 349, top: 180, w: 91, delay: 0.03 },
    { left: 440, top: 180, w: 90, delay: 0.06 },
    { left: 530, top: 180, w: 91, delay: 0.09 },
    { left: 259, top: 271, w: 90, delay: 0.05 },
    { left: 349, top: 271, w: 91, delay: 0.08 },
    { left: 440, top: 271, w: 90, delay: 0.11 },
    { left: 530, top: 271, w: 91, delay: 0.14 },
  ] as const;

  return (
    <a
      className={`${styles.card} ${styles.contactLi}`}
      href={CONTACT_LINKS.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      data-node-id="contact-linkedin"
      {...handlers}
    >
      <div className={styles.contactPageScene}>
        {cells.map((cell, i) => (
          <Orb
            key={i}
            cardW={LI.w}
            cardH={LI.h}
            left={cell.left}
            top={cell.top}
            size={cell.w}
            active={active}
            delay={cell.delay}
            hover={{ y: "-14%", scale: 1.05 }}
          />
        ))}
        <ContactArrow cardW={LI.w} cardH={LI.h} left={488} />
        <ContactLabel
          cardW={LI.w}
          cardH={LI.h}
          icon={<LinkedInIcon />}
          label="LINKEDIN"
          top={212}
        />
      </div>
    </a>
  );
}

/* ── Email 1112×439 ────────────────────────────────────────────── */

const EM = { w: 1112, h: 439 } as const;

function EmailCard() {
  const { active, handlers } = useCardHover();
  const [copied, setCopied] = useState(false);

  async function copyEmail(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      className={`${styles.card} ${styles.contactEmail}`}
      aria-label="Email"
      data-node-id="contact-email"
      {...handlers}
    >
      <div className={styles.contactPageScene}>
        <Orb
          cardW={EM.w}
          cardH={EM.h}
          left={379}
          top={-383}
          size={603}
          active={active}
          hover={{ y: "6%", scale: 1.03 }}
        />
        <Orb
          cardW={EM.w}
          cardH={EM.h}
          left={857}
          top={175}
          size={603}
          active={active}
          delay={0.05}
          hover={{ x: "-4%", y: "-5%", scale: 1.03 }}
        />
        <ContactActionBar cardW={EM.w} cardH={EM.h}>
          <a
            className={styles.contactPageAction}
            href={CONTACT_LINKS.email}
            aria-label={`Email ${CONTACT_EMAIL}`}
          >
            <ArrowIcon />
          </a>
          <button
            type="button"
            className={styles.contactPageAction}
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : `Copy ${CONTACT_EMAIL}`}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </ContactActionBar>
        <ContactLabel
          cardW={EM.w}
          cardH={EM.h}
          icon={<GmailIcon />}
          label="Email"
          top={337}
        />
      </div>
    </section>
  );
}

export default function ContactBoard() {
  return (
    <div
      className={`${styles.board} ${styles.contactBoard}`}
      id="contact"
      data-node-id="contact-board"
      data-name="Contact"
    >
      <IntroCard />
      <InstagramCard />
      <GitHubCard />
      <ResumeCard />
      <LinkedInCard />
      <EmailCard />
    </div>
  );
}

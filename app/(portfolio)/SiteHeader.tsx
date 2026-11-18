"use client";

/* eslint-disable @next/next/no-img-element -- ticket artwork: small SVG shapes placed by the design's px */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from "motion/react";
import { fredoka, inter } from "@/lib/fonts";
import { MOODS } from "../projects/mood-tracker/moods";
import Link from "next/link";
import { CONTACT_LINKS } from "../redesign/contact-links";
import WelcomeSignature from "./WelcomeSignature";
import FollowEyes from "./FollowEyes";
import { holdingReloadPosition } from "./reload-scroll";
import { REPLY_DELAY_MS, REPLY_VISIBLE_MS, pickReply } from "./mood-replies";
import styles from "./SiteHeader.module.css";

// The signature draw only covers the header, and only while that header
// is the view. A reload further down the page keeps that exact position.
// The header's container is measured, not the header: on phones and tablets the header is sticky,
// so its own top stays at the top of the screen while the page scrolls past it.
function userIsAtHeader(header: HTMLElement) {
  const top = (header.parentElement ?? header).getBoundingClientRect().top;
  return top > -window.innerHeight * 0.45 && top < window.innerHeight * 0.25;
}

// The signature draws once per browser session; later visits to the home page skip it
const INTRO_SEEN_KEY = "portfolio-intro-seen";

function introSeen() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

// A reload plays the intro again, like a first visit; moving around within the site does not. The
// browser keeps reporting the page load as a reload for the life of the page, so it only counts for
// the header's first showing: within a moment of the intro first deciding to play (the header can
// set up twice in a row as the page loads), never on a later return from a case study.
function isReload() {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type !== "reload") return false;
  const w = window as Window & { __portfolioIntroAt?: number };
  w.__portfolioIntroAt ??= performance.now();
  return performance.now() - w.__portfolioIntroAt < 1500;
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Storage blocked: the intro simply plays again next time
  }
}

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const signatureRef = useRef<HTMLAnchorElement>(null);
  /* Where the intro's signature lands: the top bar's signature on tablet and up (it is the site's
     logo there), else the header's own. Read when the intro lands, so it finds the bar by then. */
  const landingRef = useRef<{ readonly current: HTMLElement | null }>({
    get current() {
      const bar = document.querySelector<HTMLElement>("[data-site-logo]");
      return bar && bar.offsetParent ? bar : signatureRef.current;
    },
  }).current;
  const [introOn, setIntroOn] = useState<boolean | null>(null);
  // While the ticket shows the mood activity, the heading's changing word holds still
  const [activityOn, setActivityOn] = useState(false);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let onScroll: (() => void) | null = null;

    // Decides whether the intro plays. Called once the page is settled and on screen.
    const decide = () => {
      if (reduced || !header || !userIsAtHeader(header) || (introSeen() && !isReload())) {
        setIntroOn(false);
        return;
      }
      markIntroSeen();
      setIntroOn(true);
      onScroll = () => {
        if (userIsAtHeader(header)) return;
        setIntroOn(false);
        // Once the intro is over this never fires again, so it stops reading layout on every scroll
        if (onScroll) window.removeEventListener("scroll", onScroll);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    // When the page is restoring a saved scroll position it is held black until the position
    // settles (see app/layout.tsx). The intro waits for that, so it plays on the visible page.
    let stopWaiting = () => {};
    if (holdingReloadPosition()) {
      const onReveal = () => flushSync(decide);
      window.addEventListener("portfolio-reveal", onReveal, { once: true });
      stopWaiting = () => window.removeEventListener("portfolio-reveal", onReveal);
    } else {
      decide();
    }

    return () => {
      stopWaiting();
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${inter.className}`}
      data-node-id="79:2814"
      data-intro={introOn === false ? undefined : ""}
    >
      {/* 1920×1080 board on wide screens, scaled with --u; a single column below that */}
      <div className={styles.frame}>
        <div className={styles.bar}>
          <Link ref={signatureRef} href="/" className={styles.signature} aria-label="Fredy, home">
            <Image src="/images/header-ticket/signature.svg" alt="Fredy" width={102} height={59} unoptimized priority />
          </Link>
          <nav className={styles.nav} aria-label="Sections">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={item.primary ? `${styles.pill} ${styles.pillPrimary}` : styles.pill}>
                <span>{item.label}</span>
                {/* "Let's connect" carries a pair of eyes that watch the cursor (Framer "Eye Follow Button") */}
                {item.primary ? (
                  <FollowEyes className={styles.pillEyes} />
                ) : (
                  <Image className={styles.pillIcon} src={item.icon} alt="" width={24} height={24} unoptimized />
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>
            I design things{" "}
            <span className={styles.titleLine}>
              that are <AccentWord paused={activityOn} />
            </span>
          </h1>
          <p className={styles.intro}>
            I&rsquo;m Fredy, a Design Engineer in Los Angeles. I have 4+ years of design experience and a
            year of building it in code, so I&nbsp;design products and ship them across web and mobile.
          </p>
          <div className={styles.actions}>
            <a className={styles.resume} href={CONTACT_LINKS.resume} download>
              <span className={styles.resumeLabel}>Download resume</span>
              {/* Slides in on hover, like the icons in the section pills */}
              <svg className={styles.resumeIcon} viewBox="0 0 24 24" aria-hidden>
                <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
              </svg>
            </a>
            <p className={styles.available}>
              <span className={styles.availableDot} aria-hidden />
              Available for work
            </p>
          </div>
        </div>

        <ProfileTicket onActivityChange={setActivityOn} />
      </div>

      {/* Part of the server-rendered page, so the black opening shows before the client has
          worked out whether the intro plays. It goes as soon as that is known, before paint. */}
      {introOn === null ? <div className={styles.cover} aria-hidden /> : null}

      {introOn ? <WelcomeSignature logoRef={landingRef} onDone={() => setIntroOn(false)} /> : null}
    </header>
  );
}

/* The purple word at the end of the heading fades through UI/UX qualities. Screen readers get one
   steady word; with reduced motion it stays on the first one, and it holds still while the ticket
   shows the mood activity. The second line never wraps (.titleLine), and every word here keeps
   "that are …" within the heading's width down to a 360px phone, so the heading stays on two
   lines. Check a new word's width before adding it: "seamless" is about the widest that fits. */
const ACCENT_WORDS = ["fun", "seamless", "responsive", "impactful", "playful", "effortless", "scalable", "accessible", "intuitive"];
const ACCENT_HOLD_MS = 2400;

function AccentWord({ paused }: { paused: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % ACCENT_WORDS.length), ACCENT_HOLD_MS);
    return () => window.clearInterval(timer);
  }, [paused]);
  const word = ACCENT_WORDS[index];
  return (
    <>
      <span className={styles.srOnly}>{ACCENT_WORDS[0]}</span>
      <span className={styles.titleAccentSlot} aria-hidden>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={word}
            className={styles.titleAccent}
            initial={{ opacity: 0, y: "0.18em", filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "-0.18em", filter: "blur(6px)" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}

const NAV = [
  { label: "Featured work", href: "#work", icon: "/images/header-ticket/icon-work.svg" },
  { label: "About me", href: "#about", icon: "/images/header-ticket/icon-about.svg" },
  { label: "Skills", href: "#skills", icon: "/images/header-ticket/icon-skills.svg" },
  { label: "Let\u2019s connect", href: "#contact", icon: "/images/header-ticket/icon-connect.svg", primary: true },
];

/* Barcode on the ticket stub: x in design px from the ticket's left edge, and bar width */
const BARS: [number, number][] = [
  [31.17, 3.325], [36.15, 3.325], [42.8, 3.325], [49.45, 4.987], [56.1, 1.662], [59.43, 3.325],
  [67.74, 1.662], [74.39, 1.662], [79.38, 3.325], [84.36, 1.662], [89.35, 4.987], [96, 3.325],
  [100.99, 3.325], [105.98, 1.662], [112.63, 3.325], [117.61, 4.987], [125.93, 1.662], [129.25, 3.325],
  [135.9, 1.662], [140.89, 3.325], [149.2, 1.662], [152.53, 3.325], [157.51, 4.987], [164.16, 3.325],
  [170.81, 1.662], [177.46, 1.662], [180.79, 3.325], [189.1, 1.662], [194.09, 1.662],
];

const MOOD_START = Math.max(0, MOODS.findIndex((mood) => mood.id === "happy"));
const swap = { duration: 0.32, ease: [0.22, 1, 0.36, 1] } as const;

/* The profile ticket (Figma "Fredy / Profile ticket"): a name strip with a punch hole, the photo
   and details, and a stub with a barcode. Every piece is placed in the design's px, scaled by --t.
   "Press for activity" turns the middle of the ticket into the mood check-in (Figma 79:2669): the
   mood tracker's characters, one at a time, with arrows to change mood. "Get info" turns it back. */
function ProfileTicket({ onActivityChange }: { onActivityChange: (on: boolean) => void }) {
  const [view, setView] = useState<"profile" | "mood">("profile");
  useEffect(() => onActivityChange(view === "mood"), [view, onActivityChange]);
  const [moodIndex, setMoodIndex] = useState(MOOD_START);
  const mood = MOODS[moodIndex];
  const changeMood = (next: number) => setMoodIndex(Math.max(0, Math.min(MOODS.length - 1, next)));
  const onMood = view === "mood";

  /* A mood held for a moment gets a line from its character, in a bubble beside it (as the old
     header widget did). Changing mood or leaving the mood view starts the wait again. */
  const [reply, setReply] = useState<string | null>(null);
  useEffect(() => {
    setReply(null);
    if (!onMood) return;
    const show = window.setTimeout(() => setReply(pickReply(MOODS[moodIndex].id)), REPLY_DELAY_MS);
    const hide = window.setTimeout(() => setReply(null), REPLY_DELAY_MS + REPLY_VISIBLE_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [onMood, moodIndex]);

  /* The ticket hangs from its lanyard and sways a little, around the top of the cord. Hovering it
     holds the swing where it is; it carries on from there when the pointer leaves. Wide screens
     only, and not with reduced motion. */
  const swing = useMotionValue(0);
  const held = useRef(false);
  const clock = useRef(0);
  const [swings, setSwings] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1101px) and (prefers-reduced-motion: no-preference)");
    const update = () => setSwings(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useAnimationFrame((_, delta) => {
    if (!swings) {
      if (swing.get() !== 0) swing.set(0);
      return;
    }
    if (held.current) return;
    clock.current += Math.min(delta, 50) / 1000;
    const t = clock.current;
    // Two slow waves together, so it drifts rather than ticking like a metronome (degrees)
    swing.set(1.3 * Math.sin((2 * Math.PI * t) / 5.6) + 0.35 * Math.sin((2 * Math.PI * t) / 2.3 + 1.1));
  });

  return (
    <motion.aside
      className={styles.ticket}
      aria-label="Profile"
      style={{ rotate: swing }}
      onPointerEnter={() => {
        held.current = true;
      }}
      onPointerLeave={() => {
        held.current = false;
      }}
    >
      <img className={styles.tHeaderBg} src="/images/header-ticket/header-bg.svg" alt="" />
      <img className={styles.tPunch} src="/images/header-ticket/punch-hole.svg" alt="" />
      {/* The lanyard: two strands from above the header, knotted, with a loop through the punch hole, drawn over the ring */}
      <svg className={styles.tCord} viewBox="0 -1400 372.926 1460" aria-hidden>
        <path className={styles.tCordStrand} d="M174 -1400 L182.5 14 M199 -1400 L190.5 14" />
        <path className={styles.tCordLoop} d="M182.5 18 C 176 36, 177 54, 186.5 56 C 196 54, 197 36, 190.5 18" />
        <rect className={styles.tCordKnot} x="179.5" y="4" width="14" height="20" rx="6" />
      </svg>
      <p className={styles.tName}>Fredy</p>
      <img className={styles.tFigma} src="/images/header-ticket/figma-logo.svg" alt="" />

      <img className={styles.tProfileBg} src="/images/header-ticket/profile-bg.svg" alt="" />
      <img className={styles.tTopPerf} src="/images/header-ticket/perforation.svg" alt="" />

      <AnimatePresence mode="wait" initial={false}>
        {onMood ? (
          <motion.div
            key="mood-panel"
            className={styles.tMoodPanel}
            style={{ background: mood.background }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={swap}
          >
            <div className={styles.tMoodArt}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mood.id}
                  className={styles.tMoodFrame}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* The mood's own animation, exported from its Figma frame (Mood-Tracker, 172:207) */}
                  <video
                    className={styles.tMoodVideo}
                    src={`/videos/moods/${mood.id}.mp4`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className={`${styles.tMoodQuestion} ${fredoka.className}`}>How do you feel today?</p>
          </motion.div>
        ) : (
          <motion.div
            key="portrait"
            className={styles.tPortrait}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={swap}
          >
            <Image
              src="/images/header-ticket/portrait.jpg"
              alt="Fredy smiling on a sunny clifftop above the ocean"
              fill
              sizes="(max-width: 1100px) 90vw, 360px"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
      <img className={styles.tPhotoDivider} src="/images/header-ticket/photo-divider.svg" alt="" />

      {/* The character's comment, popping out beside it over the edge of the ticket */}
      <AnimatePresence>
        {onMood && reply ? (
          <motion.p
            key={`${mood.id}-${reply}`}
            className={styles.tReply}
            role="status"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            {reply}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {onMood ? (
          <motion.div
            key="mood-row"
            className={styles.tMoodRow}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={swap}
          >
            <button
              type="button"
              className={styles.tMoodArrow}
              onClick={() => changeMood(moodIndex - 1)}
              disabled={moodIndex === 0}
              aria-label="Previous mood"
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>
            <span className={styles.tRule} aria-hidden />
            <div className={styles.tMoodName} aria-live="polite">
              <span>Mood</span>
              <strong>{mood.label}</strong>
            </div>
            <span className={styles.tRule} aria-hidden />
            <button
              type="button"
              className={styles.tMoodArrow}
              onClick={() => changeMood(moodIndex + 1)}
              disabled={moodIndex === MOODS.length - 1}
              aria-label="Next mood"
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </motion.div>
        ) : (
          <motion.dl
            key="details"
            className={styles.tDetails}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={swap}
          >
            <div className={styles.tRole}>
              <dt>Role</dt>
              <dd>
                Design
                <br />
                Engineer
              </dd>
            </div>
            <span className={styles.tRule} aria-hidden />
            <div className={styles.tLocation}>
              <dt>Location</dt>
              <dd>Los Angeles</dd>
            </div>
            <span className={styles.tRule} aria-hidden />
            <div className={styles.tExperience}>
              <dt>Experience</dt>
              <dd>4+ Years</dd>
            </div>
          </motion.dl>
        )}
      </AnimatePresence>

      <img className={styles.tStubBg} src="/images/header-ticket/stub-bg.svg" alt="" />
      <img className={styles.tBottomPerf} src="/images/header-ticket/perforation.svg" alt="" />
      <div className={styles.tBarcode} aria-hidden>
        {BARS.map(([x, w]) => (
          <span key={x} style={{ left: `calc(${x} * var(--t))`, width: `calc(${w} * var(--t))` }} />
        ))}
      </div>
      <p className={styles.tCode} aria-hidden>
        045437h3m3j8 · 35620
      </p>
      <span className={styles.tStubDivider} aria-hidden />
      <button
        type="button"
        className={styles.tActivity}
        onClick={() => setView(onMood ? "profile" : "mood")}
        aria-pressed={onMood}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {onMood ? "Get info" : "Press for activity"}
          </motion.span>
        </AnimatePresence>
      </button>
    </motion.aside>
  );
}

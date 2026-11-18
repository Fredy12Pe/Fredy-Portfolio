"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SERVICES } from "./home-data";
import { CONTACT_LINKS } from "../redesign/contact-links";

/** Skills listed on LinkedIn: Figma, and the three Skill Assessments Fredy passed */
const VERIFIED_SKILLS = ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe XD"];
import { useReveal } from "@/lib/reveal";
import styles from "./ServicesStack.module.css";

/* What I do: the services as a deck of cards. The deck is pinned while the section scrolls past,
   and each card in turn tips back and lifts away to reveal the next one underneath. On phones,
   and with reduced motion, the cards are a plain list. */

/** Card colour, the picture panel's colour, and its illustration (from Figma, Portfolio-4 72:372–376).
    width is the illustration's share of the panel's width in the 480px design panel. */
const PALETTE = [
  { bg: "#0f3d3e", tint: "#e0efe9", art: "/images/skills/ux-design.svg", w: 220.741, h: 278.925 },
  { bg: "#b4570f", tint: "#e0c5aa", art: "/images/skills/ui-design.svg", w: 361.256, h: 274.811 },
  { bg: "#7a1f4f", tint: "#d4b7c5", art: "/images/skills/design-systems.svg", w: 314.619, h: 285.551 },
  { bg: "#3b2a8f", tint: "#bbb7d0", art: "/images/skills/prototyping.svg", w: 296.041, h: 342.613 },
  { bg: "#1d4f30", tint: "#d6f0dc", art: "/images/skills/front-end.svg", w: 285.119, h: 361.476 },
];

/** Phone widths, where the deck is drawn without its 3D tip */
function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return phone;
}

/** The deck moves at every width, phones included, unless motion is reduced; matches ServicesStack.module.css */
function useStackMode() {
  const [stack, setStack] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setStack(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return stack;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeIn = (t: number) => t * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Share of the scroll spent peeling cards; the rest holds the last card in view */
const PEEL_SHARE = 0.86;

export default function ServicesStack() {
  const sectionRef = useRef<HTMLElement>(null);
  // The heading, its line and the LinkedIn row fade up as they come into view (see .fade-up)
  const headRef = useReveal<HTMLDivElement>();
  const verifiedRef = useReveal<HTMLDivElement>(0.4);
  const stack = useStackMode();
  const flat = usePhone();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // 0 → 4: how many cards have peeled away so far
  const peeled = useTransform(scrollYProgress, (p) => clamp01(p / PEEL_SHARE) * (SERVICES.length - 1));
  // The last card is up and the pile is gone: on phones the LinkedIn row only shows from here, as it
  // sits where the pile was (ServicesStack.module.css)
  const [deckDone, setDeckDone] = useState(false);
  useMotionValueEvent(peeled, "change", (v) => setDeckDone(v > SERVICES.length - 1.15));

  /* The page fades to black as the section comes up the screen, and stays black through Contact and
     the footer below. Scrolling back up fades it to white again. */
  const { scrollYProgress: dark } = useScroll({ target: sectionRef, offset: ["start 0.85", "start 0.25"] });
  const background = useTransform(dark, [0, 1], ["#ffffff", "#000000"]);
  const ink = useTransform(dark, [0, 1], ["#0b1314", "#ffffff"]);
  const inkMuted = useTransform(dark, [0, 1], ["rgba(11, 19, 20, 0.66)", "rgba(255, 255, 255, 0.68)"]);

  // The colour goes on the whole page, so the black reaches the screen's edges
  useMotionValueEvent(background, "change", (colour) => {
    const page = sectionRef.current?.closest("main");
    if (page) page.style.backgroundColor = colour;
  });
  useEffect(
    () => () => {
      const page = sectionRef.current?.closest("main");
      if (page) page.style.backgroundColor = "";
    },
    [],
  );

  return (
    <motion.section
      ref={sectionRef}
      id="skills"
      className={styles.section}
      aria-labelledby="services-heading"
      style={{ "--count": SERVICES.length, "--ink": ink, "--ink-muted": inkMuted } as unknown as CSSProperties}
    >
      <div className={styles.sticky}>
        <div ref={headRef} className={styles.head}>
          <h2 id="services-heading" className={`${styles.heading} fade-up`}>
            Skills that turn ideas into outcomes
          </h2>
          <p className={`${styles.subheading} fade-up`} style={{ "--fade-i": 1 } as CSSProperties}>
            From the first question to shipped code, the work I do to make products people understand,
            trust and enjoy.
          </p>
        </div>
        <ol className={styles.deck}>
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.name} index={index} peeled={peeled} stack={stack} flat={flat}>
              <div className={styles.text}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={styles.title}>{service.name}</h3>
                <p className={styles.description}>{service.description}</p>
              </div>
              <div className={styles.visual} aria-hidden>
                <Image
                  className={styles.art}
                  src={PALETTE[index].art}
                  alt=""
                  width={PALETTE[index].w}
                  height={PALETTE[index].h}
                  unoptimized
                  style={{ width: `${(PALETTE[index].w / 480) * 100}%`, maxHeight: `${(PALETTE[index].h / 480) * 100}%` }}
                />
              </div>
            </ServiceCard>
          ))}
        </ol>

        {/* Proof for the skills above: the LinkedIn Skill Assessments Fredy passed */}
        <div ref={verifiedRef} className={`${styles.verified} fade-up`} data-deck-done={deckDone ? "" : undefined}>
          <p className={styles.verifiedLabel}>Verified on LinkedIn</p>
          <ul className={styles.verifiedList}>
            {VERIFIED_SKILLS.map((skill) => (
              <li key={skill} className={styles.verifiedPill}>
                <svg viewBox="0 0 16 16" aria-hidden>
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {skill}
              </li>
            ))}
          </ul>
          <a
            className={styles.verifiedLink}
            href={`${CONTACT_LINKS.linkedin}/details/skills/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            See on LinkedIn <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}

/* One card. While cards above it remain it waits lower and smaller in the pile; its own turn tips
   it back and lifts it off the top of the screen. */
function ServiceCard({
  index,
  peeled,
  stack,
  flat,
  children,
}: {
  index: number;
  peeled: MotionValue<number>;
  stack: boolean;
  /** Phones: the cards peel away without the 3D tip, which flickered in mobile Safari while scrolling */
  flat: boolean;
  children: ReactNode;
}) {
  const last = index === SERVICES.length - 1;
  // How far this card has lifted away (0 still, 1 gone)
  const leave = useTransform(peeled, (n) => (last ? 0 : clamp01(n - index)));
  // How many cards are still above it
  const depth = useTransform(peeled, (n) => Math.max(0, index - n));

  // Phones: a smooth ease rather than an accelerating one, so a flick of the finger shows the card
  // slide away instead of vanishing in a frame or two
  const y = useTransform([leave, depth], ([l, d]) =>
    (l as number) > 0
      ? `${-150 * (flat ? easeInOut(l as number) : easeIn(l as number))}%`
      : `${Math.min(d as number, 3) * 5}%`,
  );
  const rotateX = useTransform(leave, (l) => 32 * l);
  const scale = useTransform([leave, depth], ([l, d]) =>
    (l as number) > 0 ? 1 - 0.06 * (l as number) : 1 - Math.min(d as number, 3) * 0.05,
  );
  const opacity = useTransform([leave, depth], ([l, d]) => {
    if ((d as number) > 3) return 0;
    // Gone before it reaches the heading above the deck (later on phones, so the slide is seen)
    return flat ? 1 - clamp01(((l as number) - 0.45) / 0.4) : 1 - clamp01(((l as number) - 0.3) / 0.4);
  });

  const colours = PALETTE[index % PALETTE.length];
  const style = {
    "--card": colours.bg,
    "--tint": colours.tint,
    // Phones: each card slides up over the one before it, so later cards sit on top
    zIndex: flat ? index + 1 : SERVICES.length - index,
    "--i": index,
  } as CSSProperties;

  return (
    <motion.li
      className={styles.card}
      style={
        /* Phones: no scroll-driven transforms at all. The cards are pinned by CSS (position: sticky) and
           stack as the page scrolls, which the browser does on its own scrolling thread, so it can't
           lag behind the finger or stall the way script-driven motion did in mobile Safari. */
        !stack || flat ? style : { ...style, y, rotateX, scale, opacity, transformPerspective: 1400 }
      }
    >
      {children}
    </motion.li>
  );
}

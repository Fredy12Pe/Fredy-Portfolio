"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SERVICES } from "./home-data";
import { CONTACT_LINKS } from "../redesign/contact-links";

/** Skills listed on LinkedIn: Figma, and the three Skill Assessments Fredy passed */
const VERIFIED_SKILLS = ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe XD"];
import { useReveal } from "@/lib/reveal";
import { rangeStyle, useTimelineFallback } from "./scroll-timeline";
import styles from "./ServicesStack.module.css";

/* What I do: the services as a deck of cards. The deck is pinned while the section scrolls past,
   and each card in turn tips back and lifts away to reveal the next one underneath. On phones,
   with reduced motion, the cards are a plain list. */

/** Card colour, the picture panel's colour, and its illustration (from Figma, Portfolio-4 72:372–376).
    width is the illustration's share of the panel's width in the 480px design panel. */
const PALETTE = [
  { bg: "#0f3d3e", tint: "#e0efe9", art: "/images/skills/ux-design.svg", w: 220.741, h: 278.925 },
  { bg: "#b4570f", tint: "#e0c5aa", art: "/images/skills/ui-design.svg", w: 361.256, h: 274.811 },
  { bg: "#7a1f4f", tint: "#d4b7c5", art: "/images/skills/design-systems.svg", w: 314.619, h: 285.551 },
  { bg: "#3b2a8f", tint: "#bbb7d0", art: "/images/skills/prototyping.svg", w: 296.041, h: 342.613 },
  { bg: "#1d4f30", tint: "#d6f0dc", art: "/images/skills/front-end.svg", w: 285.119, h: 361.476 },
];

/** Phone widths, where the deck is drawn without its 3D tip and each card takes more scrolling */
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

/** Share of the pinned scrolling spent peeling cards; the rest holds the last card in view */
const PEEL_SHARE = 0.86;
const STEP = PEEL_SHARE / (SERVICES.length - 1);
/** Scrolling per card, in screen heights; matches --pin in ServicesStack.module.css */
const PER_CARD = { desk: 0.7, phone: 0.9 };

/* The deck is pinned (sticky) while the section scrolls past, and each card in turn lifts away to show
   the next. Run by the browser from the scroll position (see scroll-timeline.ts): no script moves the
   cards, so they follow the finger exactly. */
export default function ServicesStack() {
  const sectionRef = useRef<HTMLElement>(null);
  // The heading, its line and the LinkedIn row fade up as they come into view (see .fade-up)
  const headRef = useReveal<HTMLDivElement>();
  const verifiedRef = useReveal<HTMLDivElement>(0.4);
  const phone = usePhone();
  useTimelineFallback(sectionRef);

  /* The page fades to black as the section comes up the screen (its top from 85% to 25% of the screen
     height), and stays black through Contact and the footer. In shares of the pin, which starts when
     the top reaches the top of the screen. */
  const pinScreens = (SERVICES.length - 1) * (phone ? PER_CARD.phone : PER_CARD.desk);
  const dark: [number, number] = [-0.85 / pinScreens, -0.25 / pinScreens];
  // Phones: the LinkedIn row sits where the pile was, so it shows once the last card is up
  const lastUp: [number, number] = [STEP * (SERVICES.length - 1.25), STEP * (SERVICES.length - 1.05)];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={styles.section}
      aria-labelledby="services-heading"
      style={{ "--count": SERVICES.length } as CSSProperties}
    >
      {/* The black behind the page from here down, faded in by the scroll */}
      <div className={styles.night} aria-hidden {...rangeProps(dark)} />
      <div className={styles.sticky}>
        <div ref={headRef} className={styles.head}>
          <h2 id="services-heading" className={`${styles.heading} ${styles.inked} fade-up`} {...rangeProps(dark)}>
            Skills that turn ideas into outcomes
          </h2>
          <p className={`${styles.subheading} ${styles.inked} fade-up`} {...rangeProps(dark, { "--fade-i": 1 })}>
            From the first question to shipped code, the work I do to make products people understand,
            trust and enjoy.
          </p>
        </div>
        <ol className={styles.deck}>
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.name} index={index}>
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
        <div ref={verifiedRef} className={`${styles.verified} ${styles.inked} fade-up`} {...rangeProps(dark, {}, lastUp)}>
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
    </section>
  );
}

/** Range props for an element: its CSS vars (plus any extra style) and the fallback's data-range */
function rangeProps(range: [number, number], extra: Record<string, string | number> = {}, second?: [number, number]) {
  const { style, ...rest } = second ? rangeStyle(range, second) : rangeStyle(range);
  return { style: { ...style, ...extra } as CSSProperties, ...rest };
}

/* One card. It waits lower and smaller in the pile while cards above it remain (moving up a place as
   each one goes), and on its own turn lifts off the top of the screen. Both are CSS animations on the
   scroll (ServicesStack.module.css): "approach" and then "leave". */
function ServiceCard({ index, children }: { index: number; children: ReactNode }) {
  const last = index === SERVICES.length - 1;
  // Approach: from its place in the pile (up to 3 deep) to the top, while the cards above it go
  const approach: [number, number] = index === 0 ? [0, 0.0001] : [STEP * Math.max(0, index - 3), STEP * index];
  // Leave: its own turn. The last card stays (its range is never reached).
  const leave: [number, number] = last ? [9, 10] : [STEP * index, STEP * (index + 1)];
  const colours = PALETTE[index % PALETTE.length];
  const depth = Math.min(index, 3);

  return (
    <li
      className={styles.card}
      {...rangeProps(approach, {
        "--card": colours.bg,
        "--tint": colours.tint,
        "--d": depth,
        // A fifth card waits hidden behind the pile until there is room for it
        "--o": index > 3 ? 0 : 1,
        zIndex: SERVICES.length - index,
      }, leave)}
    >
      {children}
    </li>
  );
}

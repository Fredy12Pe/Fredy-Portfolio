"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./GroveBoard.module.css";

/* The Grove case study as a FigJam-style board, after the Writer's Portfolio template. The cover
   sits at the top, six sections form a loop with a circular hub in the middle, and the app
   walkthrough sits at the bottom. Positions are in board units (--u), and GroveCanvas moves and
   scales the whole board. */

const BOARD_W = 1920;
const BOARD_H = 5000;

// Sections, clockwise from the top left. x/y/w/h in board units, tilt in degrees.
const STAGES = [
  { n: 1, name: "Discover", emoji: "🔍", x: 150, y: 1000, w: 470, h: 1250, tilt: -0.8 },
  { n: 2, name: "Define", emoji: "🧭", x: 750, y: 980, w: 430, h: 1210, tilt: 0.6 },
  { n: 3, name: "Design", emoji: "🌱", x: 1310, y: 1020, w: 490, h: 1240, tilt: -0.5 },
  { n: 4, name: "Build", emoji: "🛠️", x: 1330, y: 2700, w: 470, h: 1050, tilt: 0.8 },
  { n: 5, name: "Refine", emoji: "🔁", x: 760, y: 2700, w: 430, h: 1130, tilt: -0.6 },
  { n: 6, name: "Outcome", emoji: "📈", x: 150, y: 2700, w: 470, h: 930, tilt: 0.5 },
];

const COVER = { x: 150, y: 40, w: 1660, h: 940 };
const WALKTHROUGH = { x: 150, y: 3930, w: 1660, h: 1000 };

// Thick arcs round the loop, in board units
const ARROWS = [
  "M 628 1615 C 660 1300, 720 1300, 746 1575", // 1 → 2
  "M 1186 1575 C 1220 1250, 1280 1250, 1304 1650", // 2 → 3
  "M 1808 1650 C 1930 2300, 1930 3000, 1806 3215", // 3 → 4, down the right side
  "M 1322 3235 C 1290 3420, 1230 3420, 1196 3275", // 4 → 5
  "M 754 3275 C 720 3420, 660 3420, 626 3175", // 5 → 6
  "M 144 3175 C 20 2700, 20 2000, 144 1635", // 6 → 1, up the left side
];

// Hub: the circle sits in the middle of the loop
const HUB = { cx: 980, cy: 2480, d: 280 };

// Notes orbiting the hub, as offsets from its centre
const ORBIT = [
  { x: 0, y: -230, text: "Role: UI/UX designer & developer" },
  { x: 250, y: -60, text: "Platform: iOS & Android" },
  { x: 160, y: 150, text: "7 core screens, solo designer-developer" },
  { x: -160, y: 150, text: "Stack: React Native, Expo, Rive, Skia" },
  { x: -250, y: -60, text: "Coming soon to the App Store" },
];

const FRICTION = [
  {
    title: "Lack of emotional engagement",
    text: "Traditional habit trackers feel transactional and repetitive. Once the novelty fades, ticking a box every day gives no reason to come back, so people quietly drop the habit.",
  },
  {
    title: "Progress feels invisible",
    text: "Long-term consistency rarely feels rewarding. A streak counter is a number rather than a story, so months of effort look the same as one good day.",
  },
  {
    title: "Productivity burnout",
    text: "Many self-improvement apps prioritise pressure over encouragement. A missed day turns into guilt, and guilt makes people avoid the app altogether.",
  },
];

const EXECUTIVE_SUMMARY = [
  {
    title: "Problem",
    text: "Habit trackers feel repetitive and disconnected from emotional progress. People complete their tasks, but the app never shows the change those habits are making in their lives.",
  },
  {
    title: "Solution",
    text: "Habits grow a living garden. Each completed habit helps a plant grow, which turns tracking into a calm visual experience that rewards consistency instead of pressuring it.",
  },
  {
    title: "Outcome",
    text: "A mobile-first app that encourages consistency through daily visual growth, with gentle rewards and a clear reason to come back tomorrow.",
  },
];

const CORE_LOOP = [
  {
    title: "Complete habit",
    text: "Logging a habit is the trigger for the whole loop. The action is quick, and it is always answered with a visible response.",
  },
  {
    title: "Plant grows",
    text: "The plant linked to that habit grows to reflect the completion, so progress is specific to each routine and easy to notice.",
  },
  {
    title: "Garden evolves",
    text: "Steady completions across habits evolve the whole garden, so the environment itself tells the story of consistency.",
  },
  {
    title: "Daily consistency",
    text: "Keeping the loop going keeps the garden alive and thriving. A missed day never destroys progress, which keeps the tone encouraging.",
  },
];

const PRINCIPLES = ["Calm", "Minimal", "Nature-inspired", "Reward-driven"];

const DEV_JOURNEY = [
  {
    title: "React Native build",
    text: "The foundation is React Native with Expo and TypeScript, chosen for a fast, mobile-first workflow that one designer could maintain alone.",
  },
  {
    title: "Scalable UI systems",
    text: "Reusable screens and components were designed in Figma first, so the app stayed consistent as each new screen was added.",
  },
  {
    title: "Animation pipeline",
    text: "Rive and Skia produce lightweight interactions, letting the garden move and respond without heavy assets.",
  },
  {
    title: "AI-assisted iteration",
    text: "Cursor AI helped prototype ideas, refine components and test product directions quickly, which shortened each design cycle.",
  },
];

const CHALLENGES = [
  {
    title: "Balancing gamification",
    text: "Peaceful progression instead of competitive mechanics. Every reward was tested for whether it encouraged the user or pressured them.",
  },
  {
    title: "Maintaining simplicity",
    text: "Reduced UI complexity keeps interactions lightweight. Each screen was cut back until only the essential actions remained.",
  },
  {
    title: "Animation & performance",
    text: "Optimised animation workflows keep the app smooth on mobile, with motion kept short and purposeful.",
  },
];

const REAL_IMPACT = [
  "Designed for short daily engagement loops, so a habit takes seconds rather than minutes to log.",
  "Encourages consistency through visual progression, where small daily wins add up to something visible.",
  "Creates emotional connection through environmental feedback, so people come to care about their garden.",
  "Built as a scalable consumer mobile app, ready for more habits, themes and features.",
];

type Tone = "cream" | "mint" | "white" | "accent" | "grey";

function Note({
  tone = "cream",
  tilt = 0,
  tiny = false,
  children,
}: {
  tone?: Tone;
  tilt?: number;
  tiny?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.note} ${styles[tone]} ${tiny ? styles.tiny : ""}`}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
    >
      {children}
    </div>
  );
}

// A framed area on the board. Sections have a number; the cover and walkthrough do not.
function Frame({
  label,
  x,
  y,
  w,
  h,
  tilt = 0,
  children,
  label_aria,
}: {
  label: ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  tilt?: number;
  children: ReactNode;
  label_aria: string;
}) {
  return (
    <section
      aria-label={label_aria}
      className={styles.frame}
      style={
        {
          left: `calc(${x} * var(--u))`,
          top: `calc(${y} * var(--u))`,
          width: `calc(${w} * var(--u))`,
          height: `calc(${h} * var(--u))`,
          "--frame-tilt": `${tilt}deg`,
        } as CSSProperties
      }
    >
      <span className={styles.label}>{label}</span>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

function Section({
  n,
  name,
  emoji,
  x,
  y,
  w,
  h,
  tilt,
  children,
}: (typeof STAGES)[number] & { children: ReactNode }) {
  return (
    <Frame label={`${emoji} ${n} · ${name}`} label_aria={`${n}. ${name}`} x={x} y={y} w={w} h={h} tilt={tilt}>
      {children}
    </Frame>
  );
}

function Hub() {
  return (
    <div
      className={styles.hub}
      style={
        {
          left: `calc(${HUB.cx - HUB.d / 2} * var(--u))`,
          top: `calc(${HUB.cy - HUB.d / 2} * var(--u))`,
          width: `calc(${HUB.d} * var(--u))`,
          height: `calc(${HUB.d} * var(--u))`,
        } as CSSProperties
      }
    >
      <div className={styles.core}>
        <strong>Grove</strong>
        <span>Your habits grow your world.</span>
      </div>
      {ORBIT.map((item) => (
        <div
          key={item.text}
          className={styles.orbit}
          style={
            {
              left: `calc(${HUB.d / 2 + item.x} * var(--u))`,
              top: `calc(${HUB.d / 2 + item.y} * var(--u))`,
            } as CSSProperties
          }
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

export default function GroveBoard({ cover, walkthrough }: { cover: ReactNode; walkthrough: ReactNode }) {
  const [s1, s2, s3, s4, s5, s6] = STAGES;
  return (
    <div className={styles.board}>
      <svg className={styles.arrows} viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} aria-hidden>
        <defs>
          <marker id="grove-arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#11B30B" />
          </marker>
        </defs>
        {ARROWS.map((d) => (
          <path key={d} d={d} className={styles.arrow} markerEnd="url(#grove-arrowhead)" />
        ))}
      </svg>

      <Frame label="Cover" label_aria="Cover" x={COVER.x} y={COVER.y} w={COVER.w} h={COVER.h}>
        {cover}
      </Frame>

      <Hub />

      <Section {...s1}>
        <Note tone="white" tilt={-1}>
          Grove reimagines habit tracking as environmental storytelling. Instead of charts and productivity metrics,
          people maintain a virtual garden through daily habits, so every completion has a visible result.
        </Note>
        <div className={styles.chips}>
          {["7 core screens", "iOS & Android", "Solo designer-developer"].map((item) => (
            <span key={item} className={styles.chip}>
              {item}
            </span>
          ))}
        </div>
        {FRICTION.map((item, i) => (
          <Note key={item.title} tone="cream" tilt={i % 2 ? 1 : -1}>
            <strong>{item.title}</strong>
            {item.text}
          </Note>
        ))}
        <Note tone="grey" tiny>
          Research notes: habit apps, streak fatigue, calm interfaces, and what makes people return.
        </Note>
      </Section>

      <Section {...s2}>
        {EXECUTIVE_SUMMARY.map((item, i) => (
          <Note key={item.title} tone="mint" tilt={i % 2 ? -1 : 1}>
            <strong>{item.title}</strong>
            {item.text}
          </Note>
        ))}
        <Note tone="accent">
          <strong>Key decision</strong>
          Peaceful progression, not competitive mechanics. Leaderboards and penalties were left out so the garden stays
          a calm place rather than a source of pressure.
        </Note>
        <Note tone="cream" tiny>
          Scope: one core loop, seven screens, iOS and Android.
        </Note>
      </Section>

      <Section {...s3}>
        {CORE_LOOP.map((item, i) => (
          <Note key={item.title} tone="cream" tilt={i % 2 ? 1 : -1}>
            <span className={styles.num}>{i + 1}</span>
            <strong>{item.title}</strong>
            {item.text}
          </Note>
        ))}
        <div className={styles.tinyGrid}>
          {PRINCIPLES.map((principle) => (
            <Note key={principle} tone="white" tiny>
              {principle}
            </Note>
          ))}
        </div>
        <Note tone="mint" tiny>
          Focus: lightweight interactions, clear feedback, a cozy illustration language and mobile-first usability.
        </Note>
      </Section>

      <Section {...s4}>
        {DEV_JOURNEY.map((item, i) => (
          <Note key={item.title} tone="white" tilt={i % 2 ? -1 : 1}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
            {item.text}
          </Note>
        ))}
      </Section>

      <Section {...s5}>
        {CHALLENGES.map((item, i) => (
          <Note key={item.title} tone="cream" tilt={i % 2 ? 1 : -1}>
            <strong>{item.title}</strong>
            {item.text}
          </Note>
        ))}
        <Note tone="grey">
          <strong>Traditional habit apps</strong>
          Static checklists, data-heavy interfaces and productivity-focused experiences that feel like work.
        </Note>
        <Note tone="accent">
          <strong>Grove</strong>
          Living visual progression, environmental feedback and calm, game-inspired interactions.
        </Note>
      </Section>

      <Section {...s6}>
        {REAL_IMPACT.map((item, i) => (
          <Note key={item} tone="mint" tilt={i % 2 ? 1 : -1}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            {item}
          </Note>
        ))}
        <Note tone="accent">
          Grove became a polished habit tracker that blends gamification, calming visuals and lightweight interactions
          into a more emotionally engaging daily routine.
        </Note>
      </Section>

      <Frame
        label="🎬 App walkthrough"
        label_aria="App walkthrough"
        x={WALKTHROUGH.x}
        y={WALKTHROUGH.y}
        w={WALKTHROUGH.w}
        h={WALKTHROUGH.h}
      >
        {walkthrough}
      </Frame>
    </div>
  );
}

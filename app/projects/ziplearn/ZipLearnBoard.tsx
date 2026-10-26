"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  IconBooks,
  IconChartBar,
  IconCoin,
  IconSchool,
  IconSearch,
  IconWallet,
} from "@tabler/icons-react";
import StoryBoard, { Frame, type Arrow, type Branch } from "../board/StoryBoard";
import { BoardHead, Label, Panel } from "../board/BoardParts";
import heroRef from "./images/Header img.png";
import processRef from "./images/02.png";
import midFidelity from "./images/Mid-fi mockups.png";
import highFidelity from "./images/high-fi mockups.png";
import researchQualImg from "./images/research-qualitative.png";
import userPersonas from "./images/user-personas.png";
import mobile1 from "./images/app screens/Mobile 1.png";
import mobile2 from "./images/app screens/Mobile 2.png";
import mobile3 from "./images/app screens/Mobile 3.png";
import mobile4 from "./images/app screens/Mobile 4.png";
import mobile5 from "./images/app screens/Mobile 5.png";
import mobile6 from "./images/app screens/Mobile 6.png";

// ZipLearn's palette: its violet accent, the gradient for icons, and the pale lavender hero
const ZIP_ACCENT = "#6A32F9";
const ZIP_GRADIENT = "linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)";
const ZIP_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(167,139,250,0.35), transparent 42%), linear-gradient(145deg, #6A32F9 0%, #4527A8 100%)";
const ZIP_HERO_BG = "#F0EBFE";
const ZIP_TINT = "#F0EBFE";

// Every section's place on the board, in board px. Heights come from the content.
// The hero sits in the middle, and the story runs clockwise around it from the top left.
const LAYOUT = {
  hero: { x: 1548, y: 1522, w: 672 },
  brief: { x: 552, y: 578, w: 560 },
  summary: { x: 1312, y: 811, w: 1144 },
  insights: { x: 2656, y: 200, w: 560 },
  research: { x: 2656, y: 1560, w: 912 },
  solution: { x: 2656, y: 2395, w: 912 },
  stages: { x: 1312, y: 2700, w: 1144 },
  process: { x: 200, y: 2676, w: 912 },
  learnings: { x: 552, y: 1840, w: 560 },
  closing: { x: 1116, y: 4340, w: 1536 },
};

const HERO_H = 960;

// The board's size, and the card the canvas opens on (the ZipLearn hero)
export const ZIPLEARN_BOARD = { w: 3768, h: 5400 };
export const ZIPLEARN_START = { x: LAYOUT.hero.x, y: LAYOUT.hero.y, w: LAYOUT.hero.w, h: HERO_H };

// The story's reading order, clockwise from the hero's left edge
const LOOP: Arrow<keyof typeof LAYOUT>[] = [
  { from: { key: "hero", side: "left", t: 0.1 }, to: { key: "brief", side: "right", t: 0.9 }, bend: 0.2 },
  { from: { key: "brief", side: "right" }, to: { key: "summary", side: "left" }, bend: -0.25 },
  { from: { key: "summary", side: "right" }, to: { key: "insights", side: "left" }, bend: 0.2 },
  { from: { key: "insights", side: "bottom" }, to: { key: "research", side: "top" }, bend: 0 },
  { from: { key: "research", side: "bottom" }, to: { key: "solution", side: "top" }, bend: 0 },
  { from: { key: "solution", side: "left", t: 0.5 }, to: { key: "stages", side: "right", t: 0.5 }, bend: 0.2 },
  { from: { key: "stages", side: "left", t: 0.5 }, to: { key: "process", side: "right", t: 0.5 }, bend: 0.2 },
  { from: { key: "process", side: "top", t: 0.7 }, to: { key: "learnings", side: "bottom", t: 0.5 }, bend: 0.25 },
  { from: { key: "learnings", side: "right" }, to: { key: "hero", side: "left" }, bend: -0.25 },
];

// After the loop: a dashed branch from the learnings down the left margin to the closing notes
const BRANCH: Branch<keyof typeof LAYOUT> = {
  from: { key: "learnings", side: "left" },
  to: { key: "closing", side: "left", t: 0.3 },
  x: 100,
};

const AT_A_GLANCE = ["Concept iOS app", "2-month timeline", "Solo designer & researcher"];
const STACK = ["Figma", "Photoshop"];

const PROJECTED_IMPACT = [
  "Interviews (parents + students) revealed 80% struggled with trust and discovery.",
  "Prototype testing: ~90% scheduled a tutor in ≤2 minutes.",
  "Reviews/credentials increased booking confidence for ~70% of testers.",
  "Projected time savings of ~1 hour/week vs manual searching.",
];

const EXECUTIVE_SUMMARY_CARDS = [
  {
    title: "Problem",
    text: "Parents and students struggle to find trusted tutors quickly; discovery and vetting are manual and uncertain.",
    icon: <IconSearch size={24} stroke={1.5} />,
  },
  {
    title: "Solution",
    text: "I designed ZipLearn, a concept mobile app to browse, evaluate, and book tutors with confidence — using profiles, reviews, verified credentials, and simple scheduling.",
    icon: <IconSchool size={24} stroke={1.5} />,
  },
  {
    title: "Outcome",
    text: "User interviews indicated strong interest; prototype testing showed high task success for scheduling within minutes and increased trust from credential transparency.",
    icon: <IconChartBar size={24} stroke={1.5} />,
  },
];

const INSIGHTS = [
  {
    title: "Cost barriers",
    text: "Parents signal price sensitivity; teens lack funds for private sessions.",
    icon: <IconCoin size={22} stroke={1.5} />,
  },
  {
    title: "Willingness to pay",
    text: "Families hesitate to subscribe or pay per session without clear value.",
    icon: <IconWallet size={22} stroke={1.5} />,
  },
  {
    title: "Coverage gaps",
    text: "Interviews surfaced limited subject diversity across available tutors.",
    icon: <IconBooks size={22} stroke={1.5} />,
  },
];

const APP_SCREENS = [
  {
    image: mobile1,
    alt: "Home screen",
    title: "Home Screen",
    description:
      "An easy journey to start: hire a tutor, collaborate with other students, or watch online tutorials for 30+ subjects. The search bar helps you find exactly what you're looking for.",
  },
  {
    image: mobile2,
    alt: "Videos/Tutors and Filters",
    title: "Videos/Tutors",
    description: "Choose a subject, then decide whether you want to watch tutorials or set up a tutoring session.",
  },
  {
    image: mobile3,
    alt: "Tutor profile",
    title: "Tutors & Bio",
    description:
      "Tap on a tutor to see a page with their background and reviews, so you can decide if they're a good fit for your academic needs.",
  },
  {
    image: mobile4,
    alt: "Scheduling",
    title: "Tutoring Sessions",
    description:
      "Check the tutor's calendar and availability. Once you find an open time slot, go through the application process and set up a session.",
  },
  {
    image: mobile5,
    alt: "In-session experience",
    title: "In-session Experience",
    description:
      "Join sessions with built-in video and chat. Share notes and files in real time, annotate concepts together, and keep materials saved for later review.",
  },
  {
    image: mobile6,
    alt: "Notifications and completion",
    title: "Congratulations!",
    description:
      "The confirmation screen once you've successfully signed up for a tutoring session. From here you can go back to watch tutorials or explore other activities.",
  },
];

// A numbered badge in the ZipLearn gradient
function NumberBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: ZIP_GRADIENT }}
    >
      {children}
    </span>
  );
}

// An image in a white card, shown at its full shape up to a height cap
function ShotBox({ src, alt, label, maxH = 900 }: { src: typeof heroRef; alt: string; label?: string; maxH?: number }) {
  return (
    <Panel className="bg-white">
      {label ? <Label color={ZIP_ACCENT}>{label}</Label> : null}
      <div className="flex items-start justify-center overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white" style={{ maxHeight: maxH }}>
        <Image src={src} alt={alt} className="block h-auto w-full object-contain" sizes="520px" style={{ maxHeight: maxH }} priority />
      </div>
    </Panel>
  );
}

const brandStyle: CSSProperties = { background: ZIP_TILE_GRADIENT, color: "#ffffff" };

export default function ZipLearnBoard() {
  return (
    <StoryBoard width={ZIPLEARN_BOARD.w} height={ZIPLEARN_BOARD.h} layout={LAYOUT} arrows={LOOP} branch={BRANCH}>
      {/* Centre: the hero */}
      <Frame name="hero">
        <div className="flex flex-col rounded-[28px] p-12 shadow-[0_10px_30px_rgba(0,0,0,0.08)]" style={{ background: ZIP_HERO_BG, height: HERO_H }}>
          <span className="inline-flex self-start rounded-full bg-white/70 px-3 py-1 text-xs font-medium ring-1 ring-[#6A32F9]/20" style={{ color: ZIP_ACCENT }}>
            Concept Case Study
          </span>
          <h1 className="mt-6 text-[84px] font-extrabold leading-none tracking-tight" style={{ color: ZIP_ACCENT }}>
            ZipLearn
          </h1>
          <p className="mt-6 text-2xl font-semibold text-zinc-800">Personal Online Tutoring iOS App</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
            ZipLearn helps students find and book private tutors for their subjects with flexible, online sessions that fit busy
            schedules.
          </p>
          <p className="mt-3 max-w-xl text-sm italic text-zinc-500">Concept exploration — this is not a shipped product.</p>
          {/* The picture has empty margins around the phones, so it is enlarged from the bottom centre and its edges are cropped */}
          <div className="mt-auto -mb-12 flex h-[600px] items-end justify-center overflow-hidden">
            <Image src={heroRef} alt="ZipLearn hero devices" className="block h-[520px] w-auto max-w-none origin-bottom translate-y-[110px] scale-[1.6]" priority />
          </div>
        </div>
      </Frame>

      {/* Top left: the brief, the at a glance, and the role, timeline and stack */}
      <Frame name="brief">
        <BoardHead eyebrow="Project Brief" title="Challenge & Goal" accent={ZIP_ACCENT} />
        <Panel className="bg-white">
          <Label>Challenge</Label>
          <p className="text-base leading-7 text-zinc-700">
            Students often need extra support outside class but can&apos;t meet private tutors due to busy schedules and
            extracurriculars. Parents face high costs for private tutoring.
          </p>
          <Label>The Goal</Label>
          <p className="text-base leading-7 text-zinc-700">
            Design an accessible, inclusive mobile app that lets families hire private tutors for online sessions — and create an
            opportunity for teachers to earn extra income by tutoring students from their schools.
          </p>
        </Panel>
        <Panel style={{ background: ZIP_TINT }}>
          <Label color={ZIP_ACCENT}>At a glance</Label>
          <ul className="flex flex-col gap-2 text-sm font-medium" style={{ color: ZIP_ACCENT }}>
            {AT_A_GLANCE.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ZIP_ACCENT }} />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="bg-white">
          <Label>Role</Label>
          <p className="text-xl font-semibold text-zinc-900">UI/UX Designer &amp; Researcher</p>
          <Label>Timeline</Label>
          <p className="text-xl font-semibold text-zinc-900">2 months</p>
          <Label>Stack</Label>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tool) => (
              <span key={tool} className="inline-flex rounded-full px-3 py-1 text-xs font-medium" style={{ background: ZIP_TINT, color: ZIP_ACCENT }}>
                {tool}
              </span>
            ))}
          </div>
        </Panel>
      </Frame>

      {/* Top: the executive summary, in a row above the hero */}
      <Frame name="summary">
        <BoardHead eyebrow="Executive Summary" title="Problem · Solution · Outcome" accent={ZIP_ACCENT} />
        <div className="grid grid-cols-3 gap-8">
          {EXECUTIVE_SUMMARY_CARDS.map((card, i) => (
            <Panel key={card.title} className="bg-white">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: ZIP_GRADIENT }}>
                {card.icon}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: ZIP_ACCENT }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: ZIP_ACCENT }}>
                {card.title}
              </h3>
              <p className="text-base leading-7 text-zinc-700">{card.text}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Top right: the key insights from research */}
      <Frame name="insights">
        <BoardHead
          eyebrow="Key Insights"
          title="What we heard"
          kicker="Three friction points surfaced in research."
          accent={ZIP_ACCENT}
        />
        {INSIGHTS.map((card) => (
          <Panel key={card.title} className="bg-white">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: ZIP_TINT, color: ZIP_ACCENT }}>
              {card.icon}
            </span>
            <h4 className="text-xl font-semibold text-zinc-900">{card.title}</h4>
            <p className="text-base leading-7 text-zinc-600">{card.text}</p>
          </Panel>
        ))}
      </Frame>

      {/* Right: the research and the personas */}
      <Frame name="research">
        <BoardHead
          eyebrow="Research Overview"
          title="Qualitative research and personas"
          accent={ZIP_ACCENT}
        />
        <div className="grid grid-cols-2 gap-8">
          <ShotBox src={researchQualImg} alt="Qualitative research summary" label="Qualitative research" maxH={520} />
          <ShotBox src={userPersonas} alt="Primary personas" label="User personas" maxH={520} />
        </div>
      </Frame>

      {/* Bottom right: the solution and its app screens */}
      <Frame name="solution">
        <BoardHead
          eyebrow="Concept Solution"
          title="What the product provides"
          kicker="ZipLearn connects students with vetted tutors for flexible, online sessions. Students browse tutor bios, schedule sessions, and join directly in-app."
          accent={ZIP_ACCENT}
        />
        <Panel style={{ background: ZIP_TINT }}>
          <ul className="grid grid-cols-1 gap-3 text-sm font-medium" style={{ color: ZIP_ACCENT }}>
            {[
              "Flexible scheduling aligned to busy calendars",
              "School-linked tutors and subject coverage",
              "Clear reviews and bios for informed selection",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ZIP_ACCENT }} />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
        <Label color={ZIP_ACCENT}>App walkthrough</Label>
        <div className="grid grid-cols-3 gap-6">
          {APP_SCREENS.map((screen) => (
            <Panel key={screen.title} className="bg-white">
              <div className="flex h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                <Image src={screen.image} alt={screen.alt} className="h-full w-auto object-contain" sizes="280px" priority />
              </div>
              <h4 className="text-lg font-semibold" style={{ color: ZIP_ACCENT }}>
                {screen.title}
              </h4>
              <p className="text-sm leading-6 text-zinc-700">{screen.description}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Bottom: the design evolution, from mid-fidelity to high-fidelity */}
      <Frame name="stages">
        <BoardHead eyebrow="Design Stage" title="Design evolution" accent={ZIP_ACCENT} />
        <div className="grid grid-cols-2 gap-8">
          <ShotBox src={midFidelity} alt="Personas and mid-fidelity" label="Mid-fidelity mockups" maxH={820} />
          <ShotBox src={highFidelity} alt="Brand identity and high-fidelity" label="High-fidelity mockups" maxH={820} />
        </div>
      </Frame>

      {/* Bottom left: the design process */}
      <Frame name="process">
        <BoardHead
          eyebrow="Process"
          title="ZipLearn Design Process"
          kicker="From research to release."
          accent={ZIP_ACCENT}
        />
        <ShotBox src={processRef} alt="Design process" maxH={420} />
      </Frame>

      {/* Left: the learnings */}
      <Frame name="learnings">
        <BoardHead eyebrow="Concept Learnings" title="What I explored" accent={ZIP_ACCENT} />
        <Panel style={brandStyle}>
          <p className="leading-7 text-white/90">
            As a concept, ZipLearn let me test assumptions without the constraints of production scope. Through interviews and
            lightweight prototypes, I saw that cost and time were only surface problems — the deeper friction was uncertainty.
            Students and parents weren&apos;t sure who to trust, when sessions could actually happen, or what value they&apos;d get
            from the first booking.
          </p>
          <p className="leading-7 text-white/90">
            By surfacing availability, subject fit, and reviews earlier, and by turning the journey into a series of clear, single
            decisions, the experience felt more approachable. These explorations also highlighted how much reassurance comes from
            tight copy and unambiguous states: what happens before, during, and after a session. If this moved toward production,
            I&apos;d validate pricing cues, add more transparent tutor metrics, and refine scheduling to better reflect real-world
            constraints.
          </p>
        </Panel>
      </Frame>

      {/* Closing: the projected impact and the accessibility notes, below the loop */}
      <Frame name="closing">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <BoardHead eyebrow="Projected Impact" title="Projected Impact" accent={ZIP_ACCENT} />
            {PROJECTED_IMPACT.map((item, i) => (
              <Panel key={item} className="bg-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: ZIP_ACCENT }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-lg font-medium leading-snug text-zinc-900">{item}</p>
              </Panel>
            ))}
          </div>
          <div className="flex flex-col gap-8">
            <BoardHead eyebrow="Accessibility" title="Accessibility considerations" accent={ZIP_ACCENT} />
            <Panel className="bg-white">
              <ul className="flex flex-col gap-2 text-sm leading-6 text-zinc-700">
                {[
                  "Forms include labels, error states, and contextual help for screen readers.",
                  "Color + icon pairings for success/error states (not color alone).",
                  "Focus order structured for fast navigation through booking flow.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ZIP_ACCENT }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500">© {new Date().getFullYear()} ZipLearn · Case Study</p>
      </Frame>
    </StoryBoard>
  );
}

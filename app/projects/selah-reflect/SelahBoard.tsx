"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { IconBook, IconPencil, IconSparkles } from "@tabler/icons-react";
import StoryBoard, { Frame, type Arrow, type Branch } from "../board/StoryBoard";
import { BoardHead, Label, Panel } from "../board/BoardParts";
import heroImg from "./images/headerImg.png";
import imgDevotionalHub from "./images/DevotionalHub.png";
import imgHymn from "./images/Hymn.png";
import imgReflect from "./images/Reflect.png";
import imgScriptureOverview from "./images/scriptureOverview.png";
import compImgBefore from "./images/comparison/Group 2.png";
import compImgAfter from "./images/comparison/Group 3.png";

// Selah's palette: its purple accent, the gradient for icons and the hero, and the tint for light cards
const SELAH_ACCENT = "#6d4aff";
const SELAH_GRADIENT = "linear-gradient(223deg, #6d4aff 0%, #2b2266 100%)";
const SELAH_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(167,139,250,0.32), transparent 42%), linear-gradient(145deg, #4c33c4 0%, #221a52 100%)";
const SELAH_TINT = "#EFEBFF";

// Every section's place on the board, in board px. Heights come from the content.
// The hero sits in the middle, and the story runs clockwise around it from the top left.
const LAYOUT = {
  hero: { x: 1548, y: 1522, w: 672 },
  role: { x: 552, y: 900, w: 560 },
  summary: { x: 1312, y: 811, w: 1144 },
  problem: { x: 2656, y: 200, w: 560 },
  solution: { x: 2656, y: 1560, w: 912 },
  highlights: { x: 2656, y: 3380, w: 912 },
  process: { x: 1312, y: 2700, w: 1144 },
  dev: { x: 200, y: 2676, w: 912 },
  impact: { x: 552, y: 1568, w: 560 },
  closing: { x: 1116, y: 4280, w: 1536 },
};

const HERO_H = 960;

// The board's size, and the card the canvas opens on (the Selah hero)
export const SELAH_BOARD = { w: 3768, h: 5500 };
export const SELAH_START = { x: LAYOUT.hero.x, y: LAYOUT.hero.y, w: LAYOUT.hero.w, h: HERO_H };

// The story's reading order, clockwise from the hero's left edge
const LOOP: Arrow<keyof typeof LAYOUT>[] = [
  { from: { key: "hero", side: "left", t: 0.1 }, to: { key: "role", side: "bottom", t: 0.85 }, bend: 0.25 },
  { from: { key: "role", side: "right" }, to: { key: "summary", side: "left" }, bend: -0.25 },
  { from: { key: "summary", side: "right" }, to: { key: "problem", side: "left" }, bend: 0.2 },
  { from: { key: "problem", side: "bottom" }, to: { key: "solution", side: "top" }, bend: 0 },
  { from: { key: "solution", side: "bottom" }, to: { key: "highlights", side: "top" }, bend: 0 },
  { from: { key: "highlights", side: "left", t: 0.3 }, to: { key: "process", side: "right", t: 0.6 }, bend: 0.2 },
  { from: { key: "process", side: "left", t: 0.5 }, to: { key: "dev", side: "right", t: 0.5 }, bend: 0.2 },
  { from: { key: "dev", side: "top", t: 0.8 }, to: { key: "impact", side: "bottom", t: 0.5 }, bend: 0.25 },
  { from: { key: "impact", side: "right" }, to: { key: "hero", side: "left" }, bend: -0.25 },
];

// After the loop: a dashed branch from the impact card down the left margin to the closing notes
const BRANCH: Branch<keyof typeof LAYOUT> = {
  from: { key: "impact", side: "left" },
  to: { key: "closing", side: "left", t: 0.3 },
  x: 100,
};

const STACK = ["Next.js", "Tailwind CSS", "Firebase", "OpenAI", "Gemini"];

const PROJECTED_IMPACT = [
  "~92% prototype task success for starting and completing a daily devotional.",
  "Reduced setup from minutes to seconds by consolidating content and journaling.",
  "Designed to increase weekly devotional completion and journaling consistency.",
  "Focused typography and layouts to reduce cognitive load during reflection.",
];

const EXECUTIVE_SUMMARY_CARDS = [
  {
    title: "Problem",
    text: "Daily devotionals were split across PDFs, paper journals, and multiple apps — creating friction and lowering consistency.",
    icon: <IconBook size={24} stroke={1.5} />,
  },
  {
    title: "Solution",
    text: "I designed Selah Reflect, a mobile app that unifies scripture reading, guided reflection, journaling, and optional AI insights into one streamlined flow.",
    icon: <IconPencil size={24} stroke={1.5} />,
  },
  {
    title: "Outcome",
    text: "Prototype testing achieved high task success for completing a daily devotional. Testers described the flow as faster and more motivating than working from PDFs.",
    icon: <IconSparkles size={24} stroke={1.5} />,
  },
];

const FEATURES = [
  { t: "Daily Scripture & reflections", d: "The day's passage with clean verse typography and a clear starting point." },
  { t: "Guided journaling", d: "Reflection questions with quick journal entries saved in context." },
  { t: "Reflect with AI", d: "Optional prompts, interpretation, and application to deepen reflection." },
  { t: "Resource hub", d: "Hymns, devotional content, and resources gathered in one place." },
  { t: "Mobile-first + PWA", d: "Fast, installable experience designed for daily phone use." },
  { t: "Minimal onboarding", d: "Members start reading in seconds without setup overhead." },
];

const PROCESS_STEPS = [
  { stage: "Planning & Design", desc: "Sketches, flows, and a calm visual identity." },
  { stage: "Development", desc: "Next.js, Tailwind, Firebase, and AI integrations." },
  { stage: "Deployment", desc: "Fast, reliable hosting on Vercel." },
];

const DEV_JOURNEY_CARDS = [
  {
    title: "Starting out",
    description:
      "Design-first background with minimal code. I mostly tweaked front-end styles in no-code tools — development still felt like a \"black box.\"",
    meta: "01",
  },
  {
    title: "Practice-based learning",
    description:
      "Learned by shipping. With Cursor, I built small layouts, animations, and components — breaking problems down and asking \"what if.\" Confidence came from doing.",
    meta: "02",
  },
  {
    title: "Backend fundamentals",
    description:
      "To make apps work end-to-end I learned Firestore data modeling, creating and consuming APIs, auth and basic security, plus hosting and deployment.",
    meta: "03",
  },
  {
    title: "Full-stack confidence",
    description:
      "From sketch to production with Next.js, Tailwind, Firebase, and AI APIs — shipping polished, usable products on my own.",
    meta: "04",
  },
];

const SLIDES = [
  {
    image: imgScriptureOverview,
    alt: "Daily Scripture Overview screen",
    title: "Daily Scripture Overview",
    description:
      "Home screen greeting the user and highlighting the date. Focuses on the day's passage (1 Corinthians 3:10–17) with clean verse typography and a 'See Today's Reflection' call-to-action over a calm, nature-inspired background.",
  },
  {
    image: imgDevotionalHub,
    alt: "Daily Devotional Hub screen",
    title: "Daily Devotional Hub",
    description:
      "Central hub for the day's content: Hymn of the Month card, bold tappable daily scripture, Reflection Questions with 'Journal Entry' button, an AI reflection prompt, and a previewed Resources section.",
  },
  {
    image: imgHymn,
    alt: "Hymn of the Month full details",
    title: "Hymn of the Month",
    description:
      "Full hymn details for 'O Master, Let Me Walk With Thee' with attribution. Verses are presented in clean, scrollable text to support worship and reflection with strong readability.",
  },
  {
    image: imgReflect,
    alt: "Reflect with AI screen",
    title: "Reflect with AI",
    description:
      "Guided reflection powered by AI with prompts like 'What does the text apply to my daily life?' Generates an interpretation, application, and reflection prompts. Confirms saving the reflection to history.",
  },
];

// A numbered badge in the Selah gradient
function NumberBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: SELAH_GRADIENT }}
    >
      {children}
    </span>
  );
}

// The Selah brand panel: white text on the dark purple gradient
const brandStyle: CSSProperties = { background: SELAH_TILE_GRADIENT, color: "#ffffff" };

export default function SelahBoard() {
  return (
    <StoryBoard width={SELAH_BOARD.w} height={SELAH_BOARD.h} layout={LAYOUT} arrows={LOOP} branch={BRANCH}>
      {/* Centre: the hero */}
      <Frame name="hero">
        <div className="flex flex-col rounded-[28px] p-12 text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]" style={{ ...brandStyle, height: HERO_H }}>
          <span className="inline-flex self-start rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">
            Selah Case Study
          </span>
          <h1 className="mt-6 text-[84px] font-extrabold leading-none tracking-tight">A focused daily devotional</h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-zinc-300">
            Mobile-first reading, quick journaling, and simple reflection tools in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://www.selahdevotion.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              Visit selahdevotion.com
            </a>
            <a
              href="https://github.com/Fredy12Pe/selah-reflect-vercel"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white"
            >
              View on GitHub
            </a>
          </div>
          <div className="mt-auto overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
            <Image src={heroImg} alt="Selah hero image" className="block h-auto max-h-[340px] w-full object-contain" priority />
          </div>
        </div>
      </Frame>

      {/* Top left: the role, the timeline and the stack */}
      <Frame name="role">
        <Panel className="bg-white">
          <Label>Role</Label>
          <p className="text-2xl font-semibold leading-snug text-zinc-900">Full-stack + UI/UX</p>
          <Label>Timeline</Label>
          <p className="text-2xl font-semibold leading-snug text-zinc-900">2.5 weeks · Hosted on Vercel</p>
          <Label>Stack</Label>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tool) => (
              <span key={tool} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1" style={{ background: SELAH_TINT, color: SELAH_ACCENT, boxShadow: "inset 0 0 0 1px rgba(109,74,255,0.2)" }}>
                {tool}
              </span>
            ))}
          </div>
        </Panel>
      </Frame>

      {/* Top: the executive summary, in a row above the hero */}
      <Frame name="summary">
        <BoardHead eyebrow="Executive Summary" title="Problem · Solution · Outcome" accent={SELAH_ACCENT} />
        <div className="grid grid-cols-3 gap-8">
          {EXECUTIVE_SUMMARY_CARDS.map((card, i) => (
            <Panel key={card.title} className="bg-white">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: SELAH_GRADIENT }}>
                {card.icon}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: SELAH_ACCENT }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: SELAH_ACCENT }}>
                {card.title}
              </h3>
              <p className="text-base leading-7 text-zinc-700">{card.text}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Top right: the problem, with the original PDF */}
      <Frame name="problem">
        <BoardHead
          eyebrow="Problem"
          title="Where it began: static PDFs, static hearts"
          kicker="The challenge that sparked Selah."
          accent={SELAH_ACCENT}
        />
        <Panel className="bg-white">
          <Label>The friction</Label>
          <p className="text-base leading-7 text-zinc-700">
            At my church, devotions lived inside a <strong>Dropbox PDF</strong>. To engage, members juggled tablets, journals,
            and pinch-zoomed screens. Reflection was possible, but hardly inviting.
          </p>
          <ul className="flex flex-col gap-2 text-sm leading-6 text-zinc-600">
            {[
              "Awkward annotations on clunky PDFs",
              "No easy way to add notes or search past reflections",
              "Access limited to one rigid format",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SELAH_ACCENT }} />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-base leading-7 text-zinc-700">Selah was born to break that friction.</p>
        </Panel>
        <Panel className="bg-white">
          <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
            <Image src={compImgBefore} alt="Original PDF page" className="mx-auto block h-[420px] w-auto" sizes="560px" priority />
          </div>
          <p className="text-center text-xs text-zinc-500">The original Dropbox PDF.</p>
        </Panel>
      </Frame>

      {/* Right: the solution, as the app's screens */}
      <Frame name="solution">
        <BoardHead
          eyebrow="Solution"
          title="A living, breathing devotional"
          kicker="By parsing the church's PDF into structured JSON, Selah unlocked devotionals into a new medium: clean, mobile-first, and ready anywhere. With journaling and AI reflections built-in, members can go beyond reading — they can converse with Scripture."
          accent={SELAH_ACCENT}
        />
        <Label color={SELAH_ACCENT}>App walkthrough</Label>
        <div className="grid grid-cols-2 gap-8">
          {SLIDES.map((slide) => (
            <Panel key={slide.title} className="bg-white">
              <div className="flex h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                <Image src={slide.image} alt={slide.alt} className="h-full w-auto object-contain" sizes="440px" priority />
              </div>
              <h4 className="text-xl font-semibold" style={{ color: SELAH_ACCENT }}>
                {slide.title}
              </h4>
              <p className="text-sm leading-6 text-zinc-700">{slide.description}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Bottom right: the process, then the before and after */}
      <Frame name="process">
        <BoardHead eyebrow="Process" title="Crafting Selah" kicker="From sketches to sanctuary." accent={SELAH_ACCENT} />
        <div className="grid grid-cols-3 gap-8">
          {PROCESS_STEPS.map((item, i) => (
            <Panel key={item.stage} className="bg-white" style={{ background: SELAH_TINT }}>
              <NumberBadge>{i + 1}</NumberBadge>
              <h4 className="text-lg font-semibold" style={{ color: SELAH_ACCENT }}>
                {item.stage}
              </h4>
              <p className="text-sm leading-6 text-zinc-700">{item.desc}</p>
            </Panel>
          ))}
        </div>
        <Panel className="bg-white">
          <Label color={SELAH_ACCENT}>Before and After</Label>
          <div className="grid grid-cols-2 gap-6">
            <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
              <Image src={compImgBefore} alt="Before: the original PDF" className="block h-[420px] w-full object-contain" sizes="440px" priority />
            </div>
            <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
              <Image src={compImgAfter} alt="After: the Selah app" className="block h-[420px] w-full object-contain" sizes="440px" priority />
            </div>
          </div>
          <p className="text-center text-xs text-zinc-500">Optional AI assistant provides context without overwhelming the UI.</p>
        </Panel>
      </Frame>

      {/* Bottom: the highlights */}
      <Frame name="highlights">
        <BoardHead eyebrow="Highlights" title="Experiences that matter" accent={SELAH_ACCENT} />
        <div className="grid grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <Panel key={f.t} className="bg-white">
              <h4 className="text-lg font-semibold text-black">{f.t}</h4>
              <p className="text-sm leading-6 text-zinc-600">{f.d}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Bottom left: the dev journey */}
      <Frame name="dev">
        <BoardHead
          eyebrow="Dev Journey"
          title="Learning by building"
          kicker="From minimal code knowledge to full-stack delivery."
          accent={SELAH_ACCENT}
        />
        <div className="grid grid-cols-2 gap-8">
          {DEV_JOURNEY_CARDS.map((card) => (
            <Panel key={card.title} className="bg-white">
              <NumberBadge>{card.meta}</NumberBadge>
              <h4 className="text-xl font-semibold text-zinc-900">{card.title}</h4>
              <p className="text-sm leading-6 text-zinc-600">{card.description}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Left: the projected impact */}
      <Frame name="impact">
        <BoardHead eyebrow="Projected Impact" title="Projected Impact" accent={SELAH_ACCENT} />
        {PROJECTED_IMPACT.map((item, i) => (
          <Panel key={item} className="bg-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: SELAH_ACCENT }}>
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="text-lg font-medium leading-snug text-zinc-900">{item}</p>
          </Panel>
        ))}
      </Frame>

      {/* Closing: the outcome, the video, and the accessibility notes, below the loop */}
      <Frame name="closing">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <BoardHead eyebrow="Outcome" title="Impact in practice" kicker="A devotional that meets people where they are." accent={SELAH_ACCENT} />
            <Panel style={brandStyle}>
              <p className="leading-7 text-white/90">
                Selah turns daily devotion into a clear, repeatable routine. People can read the day&apos;s text, capture a quick
                thought, and return later to pick up where they left off — without jumping between apps. Notes are saved in
                context, so past reflections are easy to review and compare over time.
              </p>
              <p className="leading-7 text-white/90">
                When questions come up, built-in AI offers summaries or prompts to consider, keeping the focus on the passage
                rather than the tooling. The result is a lightweight flow that helps users stay consistent and engaged, whether
                they have two minutes or twenty.
              </p>
            </Panel>
          </div>
          <div className="flex flex-col gap-8">
            <Panel className="items-center bg-white">
              <div className="relative aspect-[9/19.5] w-64 rounded-[2rem] bg-black p-2 shadow-xl ring-1 ring-zinc-300/30">
                <div className="h-full w-full overflow-hidden rounded-[1.6rem] bg-black">
                  <video className="h-full w-full object-cover" src="/videos/selahRecord.mp4" autoPlay loop muted playsInline />
                </div>
              </div>
            </Panel>
          </div>
        </div>
        <BoardHead eyebrow="Accessibility" title="Accessibility considerations" accent={SELAH_ACCENT} />
        <Panel className="bg-white">
          <ul className="flex flex-col gap-2 text-sm leading-6 text-zinc-700">
            {[
              "Minimum 16px base font and generous line spacing for devotional reading.",
              "Semantic headings and clear focus order for assistive tech.",
              "Calming color palette with AA contrast for scripture text.",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SELAH_ACCENT }} />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
        <p className="text-center text-xs text-zinc-500">© {new Date().getFullYear()} Selah · Case Study</p>
      </Frame>
    </StoryBoard>
  );
}

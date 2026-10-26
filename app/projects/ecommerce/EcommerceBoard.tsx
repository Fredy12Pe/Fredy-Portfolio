"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { IconExternalLink, IconSearch, IconShoppingCart, IconUsers } from "@tabler/icons-react";
import StoryBoard, { Frame, type Arrow, type Branch } from "../board/StoryBoard";
import { BoardHead, Label, Panel } from "../board/BoardParts";

// The Samples Store's palette: near-black ink on a cool grey hero, with the store's dark gradient
const ARKTURA_ACCENT = "#1f2937";
const ARKTURA_GRADIENT = "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)";
const ARKTURA_HERO_BG = "#EDF0F4";
const ARKTURA_TINT = "#EDF0F4";

// Every section's place on the board, in board px. Heights come from the content.
// The hero sits in the middle, and the story runs clockwise around it from the top left.
const LAYOUT = {
  hero: { x: 1548, y: 1522, w: 672 },
  brief: { x: 552, y: 578, w: 560 },
  summary: { x: 1312, y: 811, w: 1144 },
  problem: { x: 2656, y: 200, w: 560 },
  solution: { x: 2656, y: 1560, w: 912 },
  features: { x: 2656, y: 2640, w: 912 },
  stages: { x: 1312, y: 2700, w: 1144 },
  process: { x: 200, y: 3193, w: 912 },
  results: { x: 552, y: 1992, w: 560 },
  closing: { x: 1116, y: 4436, w: 1536 },
};

const HERO_H = 960;

// The board's size, and the card the canvas opens on (the Samples Store hero)
export const SAMPLES_BOARD = { w: 3768, h: 5100 };
export const SAMPLES_START = { x: LAYOUT.hero.x, y: LAYOUT.hero.y, w: LAYOUT.hero.w, h: HERO_H };

// The story's reading order, clockwise from the hero's left edge
const LOOP: Arrow<keyof typeof LAYOUT>[] = [
  { from: { key: "hero", side: "left", t: 0.1 }, to: { key: "brief", side: "right", t: 0.9 }, bend: 0.2 },
  { from: { key: "brief", side: "right" }, to: { key: "summary", side: "left" }, bend: -0.25 },
  { from: { key: "summary", side: "right" }, to: { key: "problem", side: "left" }, bend: 0.2 },
  { from: { key: "problem", side: "bottom" }, to: { key: "solution", side: "top" }, bend: 0 },
  { from: { key: "solution", side: "bottom" }, to: { key: "features", side: "top" }, bend: 0 },
  { from: { key: "features", side: "left", t: 0.5 }, to: { key: "stages", side: "right", t: 0.5 }, bend: 0.2 },
  { from: { key: "stages", side: "left", t: 0.5 }, to: { key: "process", side: "right", t: 0.5 }, bend: 0.2 },
  { from: { key: "process", side: "top", t: 0.7 }, to: { key: "results", side: "bottom", t: 0.5 }, bend: 0.25 },
  { from: { key: "results", side: "right" }, to: { key: "hero", side: "left" }, bend: -0.25 },
];

// After the loop: a dashed branch from the results down the left margin to the closing notes
const BRANCH: Branch<keyof typeof LAYOUT> = {
  from: { key: "results", side: "left" },
  to: { key: "closing", side: "left", t: 0.3 },
  x: 100,
};

const AT_A_GLANCE = ["Shopify storefront", "4-month redesign", "Cross-team collaboration"];
const STACK = ["Shopify", "Figma", "Photoshop", "Illustrator"];

const EXECUTIVE_SUMMARY_CARDS = [
  {
    title: "Problem",
    text: "Sample requests previously required calls/emails, creating manual work, slow turnaround, and frequent errors.",
    icon: <IconSearch size={24} stroke={1.5} />,
  },
  {
    title: "Solution",
    text: "I led the redesign and front-end implementation of Arktura's Samples Store, transforming the manual process into a modern self-serve checkout with improved product discovery.",
    icon: <IconShoppingCart size={24} stroke={1.5} />,
  },
  {
    title: "Outcome",
    text: "We automated the majority of orders, reduced staff workload, and increased checkout completion — delivering faster fulfillment and a better customer experience.",
    icon: <IconUsers size={24} stroke={1.5} />,
  },
];

const PROBLEM_CARDS = [
  {
    title: "Navigation Complexity",
    text: "Products weren't categorized, making it difficult for reps and designers to locate specific samples.",
    icon: <IconSearch size={22} stroke={1.5} />,
  },
  {
    title: "Unclear Product Information",
    text: "With only diagrams and no photography, customers lacked the detail needed to confidently evaluate materials.",
    icon: <IconUsers size={22} stroke={1.5} />,
  },
  {
    title: "Inefficient Ordering",
    text: "No cart or checkout infrastructure existed, requiring reps to call the Sales team to place orders manually.",
    icon: <IconShoppingCart size={22} stroke={1.5} />,
  },
];

const RESULTS_IMPACT = [
  "~80% of sample orders moved from manual to automated checkout within the first 3 months.",
  "Staff time saved: ~10 hours/week, allowing focus on higher-value tasks.",
  "Checkout completion improved from ~60% → ~85%.",
  "Order errors reduced by ~30% via automation.",
  "Positive feedback from customers and internal teams on speed and clarity.",
];

const KEY_IMPROVEMENTS = [
  { t: "Intuitive Navigation", d: "Clear categories and grouping improved product discovery." },
  { t: "Product Photography", d: "High-quality images replaced diagrams, providing clarity and confidence." },
  { t: "Streamlined Checkout", d: "A cart + checkout flow automated the ordering process and reduced reliance on Sales." },
  { t: "Professional Branding", d: "A consistent design system aligned with Arktura's updated brand identity." },
];

const PROCESS_STEPS = [
  { stage: "Initial Wireframes", desc: "Created to demonstrate the value of a redesign and secure leadership approval." },
  { stage: "Photography & Assets", desc: "Secured budget to hire a photographer and edited hundreds of sample images in Photoshop and Illustrator." },
  { stage: "UI Design & Template", desc: "Customized a Shopify template to align with Arktura's brand and created a visual design system." },
  { stage: "Development & Launch", desc: "Collaborated with developers across teams to implement the checkout system and launch the redesigned store." },
];

const ACCESSIBILITY = [
  "Checkout forms built with labels, error messaging, and accessible inputs.",
  "CTAs and nav links color-tested for contrast.",
  "Product images paired with descriptive alt text for sample materials.",
];

// A numbered badge in the store's gradient
function NumberBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: ARKTURA_GRADIENT }}>
      {children}
    </span>
  );
}

// A screenshot in a white card, shown at its full shape with a caption under it when there is one
function Shot({ src, alt, label, caption, width = 1200, height = 800 }: { src: string; alt: string; label?: string; caption?: string; width?: number; height?: number }) {
  return (
    <Panel className="bg-white">
      {label ? <Label color={ARKTURA_ACCENT}>{label}</Label> : null}
      <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
        <Image src={src} alt={alt} width={width} height={height} className="block h-[420px] w-full object-contain" priority />
      </div>
      {caption ? <p className="text-center text-xs text-zinc-500">{caption}</p> : null}
    </Panel>
  );
}

const brandStyle: CSSProperties = { background: ARKTURA_GRADIENT, color: "#ffffff" };

export default function EcommerceBoard() {
  return (
    <StoryBoard width={SAMPLES_BOARD.w} height={SAMPLES_BOARD.h} layout={LAYOUT} arrows={LOOP} branch={BRANCH}>
      {/* Centre: the hero */}
      <Frame name="hero">
        <div className="flex flex-col rounded-[28px] p-12 shadow-[0_10px_30px_rgba(0,0,0,0.08)]" style={{ background: ARKTURA_HERO_BG, height: HERO_H }}>
          <span className="inline-flex self-start rounded-full bg-zinc-200/80 px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-900/10">
            Arktura Case Study
          </span>
          <h1 className="mt-6 text-[72px] font-extrabold leading-none tracking-tight" style={{ color: ARKTURA_ACCENT }}>
            Arktura Samples Store
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-zinc-600">
            Led the redesign of the Samples Store, leveraging a Shopify template to create a streamlined and user-friendly shopping
            journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://samples.arktura.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white"
              style={{ background: ARKTURA_GRADIENT }}
            >
              <IconExternalLink aria-hidden="true" size={18} stroke={1.8} />
              View Live Project
            </a>
          </div>
          <div className="mt-auto flex justify-center">
            <Image
              src="/projects/ecommerce/images/hero.png"
              alt="Arktura Samples Store hero"
              width={1200}
              height={800}
              className="block h-auto max-h-[380px] w-full object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </Frame>

      {/* Top left: the brief, at a glance, and the role, timeline and stack */}
      <Frame name="brief">
        <BoardHead eyebrow="Project Brief" title="Context" accent={ARKTURA_ACCENT} />
        <Panel className="bg-white">
          <Label>Overview</Label>
          <p className="text-base leading-7 text-zinc-700">
            Arktura is a leading manufacturer of architectural products including ceiling systems, wall panels, and lighting solutions.
            As part of their brand refresh, the company needed to modernize its Samples Store to improve usability and reduce the
            workload on internal sales teams.
          </p>
          <p className="text-base leading-7 text-zinc-700">
            The original store was little more than a static page of diagrams, with no product photography, categorization, or ordering
            system. Ordering required manual coordination with the sales team, creating unnecessary friction for architects, designers,
            and reps.
          </p>
          <p className="text-base leading-7 text-zinc-700">
            The redesign introduced product photography, structured navigation, and an automated checkout process — transforming the
            store into a user-friendly, modern experience aligned with Arktura&apos;s brand identity.
          </p>
        </Panel>
        <Panel style={{ background: ARKTURA_TINT }}>
          <Label color={ARKTURA_ACCENT}>At a glance</Label>
          <ul className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
            {AT_A_GLANCE.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="bg-white">
          <Label>Role</Label>
          <p className="text-xl font-semibold text-zinc-900">UI/UX Designer</p>
          <Label>Timeline</Label>
          <p className="text-xl font-semibold text-zinc-900">4 months</p>
          <Label>Stack</Label>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tool) => (
              <span key={tool} className="inline-flex rounded-full px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-300">
                {tool}
              </span>
            ))}
          </div>
        </Panel>
      </Frame>

      {/* Top: the executive summary, in a row above the hero */}
      <Frame name="summary">
        <BoardHead eyebrow="Executive Summary" title="Problem · Solution · Outcome" accent={ARKTURA_ACCENT} />
        <div className="grid grid-cols-3 gap-8">
          {EXECUTIVE_SUMMARY_CARDS.map((card, i) => (
            <Panel key={card.title} className="bg-white">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: ARKTURA_GRADIENT }}>
                {card.icon}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: ARKTURA_ACCENT }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: ARKTURA_ACCENT }}>
                {card.title}
              </h3>
              <p className="text-base leading-7 text-zinc-700">{card.text}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Top right: the problem, in three cards */}
      <Frame name="problem">
        <BoardHead
          eyebrow="Problem Statement"
          title="What customers struggled with"
          kicker="The original store presented three key issues."
          accent={ARKTURA_ACCENT}
        />
        {PROBLEM_CARDS.map((card) => (
          <Panel key={card.title} className="bg-white">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: ARKTURA_TINT, color: ARKTURA_ACCENT }}>
              {card.icon}
            </span>
            <h4 className="text-xl font-semibold text-zinc-900">{card.title}</h4>
            <p className="text-base leading-7 text-zinc-600">{card.text}</p>
          </Panel>
        ))}
      </Frame>

      {/* Right: the solution, with the old store for comparison */}
      <Frame name="solution">
        <BoardHead eyebrow="Solution" title="What the redesign provides" accent={ARKTURA_ACCENT} />
        <Panel className="bg-white">
          <Label>Approach</Label>
          <p className="text-base leading-7 text-zinc-700">
            The redesigned Samples Store leverages Shopify&apos;s capabilities while implementing a modern design system. By combining
            intuitive navigation, product photography, and automated ordering, the new site streamlined the process for users while
            reducing the sales team&apos;s workload.
          </p>
        </Panel>
        <Shot
          src="/projects/ecommerce/images/old-store.png"
          alt="Side-by-side comparison of old vs. new product page"
          caption="The original store: static diagrams, no checkout."
          width={1200}
          height={600}
        />
      </Frame>

      {/* Bottom right: the key improvements */}
      <Frame name="features">
        <BoardHead eyebrow="Highlights" title="Key Improvements" accent={ARKTURA_ACCENT} />
        <div className="grid grid-cols-2 gap-8">
          {KEY_IMPROVEMENTS.map((f) => (
            <Panel key={f.t} className="bg-white">
              <h4 className="text-lg font-semibold text-zinc-900">{f.t}</h4>
              <p className="text-sm leading-6 text-zinc-600">{f.d}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Bottom: the design stages, from wireframes to high fidelity */}
      <Frame name="stages">
        <BoardHead
          eyebrow="Design Stage"
          title="From wireframes to high fidelity"
          kicker="How the redesign evolved from early sketches to final screens."
          accent={ARKTURA_ACCENT}
        />
        <div className="grid grid-cols-3 gap-8">
          <Panel className="bg-white">
            <Label color={ARKTURA_ACCENT}>Low-Fidelity Wireframes</Label>
            <p className="text-sm leading-6 text-zinc-600">
              Early wireframes were created to persuade leadership to green-light the redesign by visualizing how a modern store could
              improve usability.
            </p>
            <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
              <Image src="/projects/ecommerce/images/wireframes.png" alt="Wireframe image" width={1200} height={800} className="block h-[380px] w-full object-contain" priority />
            </div>
          </Panel>
          <Panel className="bg-white">
            <Label color={ARKTURA_ACCENT}>Mid-Fidelity Mockups</Label>
            <p className="text-sm leading-6 text-zinc-600">
              Once a Shopify template was selected, mid-fidelity mockups refined the structure, navigation, and flow.
            </p>
            <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
              <Image src="/projects/ecommerce/images/midfi.png" alt="Mid-fi mockup" width={1200} height={800} className="block h-[380px] w-full object-contain" priority />
            </div>
          </Panel>
          <Panel className="bg-white">
            <Label color={ARKTURA_ACCENT}>High-Fidelity Designs</Label>
            <p className="text-sm leading-6 text-zinc-600">
              Final designs incorporated edited product photography, refined UI components, and the automated checkout system.
            </p>
          </Panel>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <Shot src="/projects/ecommerce/images/hifi.png" alt="Hi-fi design screen - Product pages" caption="Improved nav + search speed up material discovery." />
          <Shot src="/projects/ecommerce/images/hifi-2.png" alt="Hi-fi design screen - Additional views" caption="Clear confirmation & status reduce follow-up emails." />
        </div>
      </Frame>

      {/* Bottom left: the process */}
      <Frame name="process">
        <BoardHead eyebrow="Process" title="How it came together" accent={ARKTURA_ACCENT} />
        <div className="grid grid-cols-2 gap-8">
          {PROCESS_STEPS.map((item, i) => (
            <Panel key={item.stage} className="bg-white" style={{ background: ARKTURA_TINT }}>
              <NumberBadge>{i + 1}</NumberBadge>
              <h4 className="text-lg font-semibold text-zinc-900">{item.stage}</h4>
              <p className="text-sm leading-6 text-zinc-700">{item.desc}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Left: the results and impact */}
      <Frame name="results">
        <BoardHead eyebrow="Results & Impact" title="Results & Impact" accent={ARKTURA_ACCENT} />
        {RESULTS_IMPACT.map((text, i) => (
          <Panel key={text} className="bg-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: ARKTURA_ACCENT }}>
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="text-lg font-medium leading-snug text-zinc-900">{text}</p>
          </Panel>
        ))}
      </Frame>

      {/* Closing: the accessibility notes and the outcome, below the loop */}
      <Frame name="closing">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <BoardHead eyebrow="Accessibility" title="Accessibility considerations" accent={ARKTURA_ACCENT} />
            <Panel className="bg-white">
              <ul className="flex flex-col gap-2 text-sm leading-6 text-zinc-700">
                {ACCESSIBILITY.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
          <div className="flex flex-col gap-8">
            <BoardHead eyebrow="Outcome" title="Interested in more work?" accent={ARKTURA_ACCENT} />
            <Panel style={brandStyle}>
              <p className="leading-7 text-white/90">
                The redesigned Samples Store turned a manual, sales-driven process into a modern self-serve experience — automating the
                majority of orders while giving architects and designers the clarity they needed to evaluate materials with confidence.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://samples.arktura.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-900"
                >
                  View Live Project →
                </a>
                <a href="/#contact" className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white">
                  Get in Touch →
                </a>
              </div>
            </Panel>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500">© {new Date().getFullYear()} Arktura Samples Store · Case Study</p>
      </Frame>
    </StoryBoard>
  );
}

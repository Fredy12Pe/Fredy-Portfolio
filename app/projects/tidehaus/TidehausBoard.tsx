"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  IconChartBar,
  IconCode,
  IconExternalLink,
  IconPalette,
  IconShoppingCart,
  IconWaveSine,
} from "@tabler/icons-react";
import StoryBoard, { Frame, type Arrow, type Branch } from "../board/StoryBoard";
import { BoardHead, Label, Panel } from "../board/BoardParts";

// Tidehaus's palette: a sky-blue accent on a deep navy. Its cards are dark, inside the light blue frames.
const TIDE_ACCENT = "#38BDF8";
const TIDE_GRADIENT = "linear-gradient(223deg, #38BDF8 0%, #0B4A6E 100%)";
const TIDE_HERO_BG = "#07131D";
const TIDE_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(56,189,248,0.32), transparent 42%), linear-gradient(145deg, #0B4A6E 0%, #062A40 100%)";
const TIDE_CARD = "bg-zinc-950 text-zinc-200 ring-1 ring-white/10";
const TIDE_TINT = "#0B2536";

// Every section's place on the board, in board px. Heights come from the content.
// The hero sits in the middle, and the story runs clockwise around it from the top left.
const LAYOUT = {
  hero: { x: 1548, y: 1522, w: 672 },
  brief: { x: 552, y: 578, w: 560 },
  summary: { x: 1312, y: 811, w: 1144 },
  approach: { x: 2656, y: 200, w: 560 },
  highlights: { x: 2656, y: 1560, w: 912 },
  visuals: { x: 2656, y: 2600, w: 912 },
  tools: { x: 1312, y: 2700, w: 1144 },
  challenges: { x: 200, y: 3075, w: 912 },
  results: { x: 552, y: 1856, w: 560 },
  closing: { x: 1116, y: 4340, w: 1536 },
};

const HERO_H = 960;

// The board's size, and the card the canvas opens on (the Tidehaus hero)
export const TIDEHAUS_BOARD = { w: 3768, h: 5600 };
export const TIDEHAUS_START = { x: LAYOUT.hero.x, y: LAYOUT.hero.y, w: LAYOUT.hero.w, h: HERO_H };

// The story's reading order, clockwise from the hero's left edge
const LOOP: Arrow<keyof typeof LAYOUT>[] = [
  { from: { key: "hero", side: "left", t: 0.1 }, to: { key: "brief", side: "right", t: 0.9 }, bend: 0.2 },
  { from: { key: "brief", side: "right" }, to: { key: "summary", side: "left" }, bend: -0.25 },
  { from: { key: "summary", side: "right" }, to: { key: "approach", side: "left" }, bend: 0.2 },
  { from: { key: "approach", side: "bottom" }, to: { key: "highlights", side: "top" }, bend: 0 },
  { from: { key: "highlights", side: "bottom" }, to: { key: "visuals", side: "top" }, bend: 0 },
  { from: { key: "visuals", side: "left", t: 0.3 }, to: { key: "tools", side: "right", t: 0.5 }, bend: 0.2 },
  { from: { key: "tools", side: "left", t: 0.5 }, to: { key: "challenges", side: "right", t: 0.5 }, bend: 0.2 },
  { from: { key: "challenges", side: "top", t: 0.7 }, to: { key: "results", side: "bottom", t: 0.5 }, bend: 0.25 },
  { from: { key: "results", side: "right" }, to: { key: "hero", side: "left" }, bend: -0.25 },
];

// After the loop: a dashed branch from the results down the left margin to the closing notes
const BRANCH: Branch<keyof typeof LAYOUT> = {
  from: { key: "results", side: "left" },
  to: { key: "closing", side: "left", t: 0.3 },
  x: 100,
};

const AT_A_GLANCE = ["Concept e-commerce build", "1-month timeline", "Solo designer-developer"];
const STACK = ["Figma", "Illustrator", "Photoshop", "Cursor"];

const PROJECTED_IMPACT = [
  "Simplified checkout from 6 steps → 3, projecting ~20–25% abandonment reduction.",
  "Prototype mobile load times <2s, supporting conversion on cellular networks.",
  "12+ reusable UI components for faster scaling and cleaner dev handoffs.",
  "Filtering/sorting patterns speed up product discovery for surfboard variants.",
];

const EXECUTIVE_SUMMARY_CARDS = [
  {
    title: "Problem",
    text: "Surf e-commerce often suffers from slow loads, cluttered navigation, and long checkout flows that increase abandonment.",
    icon: <IconWaveSine size={24} stroke={1.5} />,
  },
  {
    title: "Solution",
    text: "I designed and built Tidehaus, a concept surf shop with a simplified 3-step checkout, responsive product media, and a reusable component library (Next.js + Tailwind).",
    icon: <IconShoppingCart size={24} stroke={1.5} />,
  },
  {
    title: "Outcome",
    text: "In informal tests (5 surfers), all participants completed checkout successfully; discovery-to-cart took under a minute. Prototype pages loaded in under ~2s on mobile.",
    icon: <IconChartBar size={24} stroke={1.5} />,
  },
];

const UI_DECISIONS = [
  { t: "Hero Section", d: "Full-screen surf video with CTA to immerse users immediately." },
  { t: "Product Cards", d: "Clean hover states, consistent ratios, quick-action buttons." },
  { t: "Product Details", d: "Modal-based exploration with gallery and variant selection." },
  { t: "Micro-interactions", d: "Smooth hover effects, typography scaling, subtle animations." },
];

const DESIGN_TOOLS = [
  "Figma for UI design",
  "Illustrator & Photoshop for visuals",
  "Cursor + ChatGPT for iteration",
  "Framer Motion for interactive prototyping",
];

const DEV_STACK = [
  "Next.js 13+ (TypeScript)",
  "Tailwind CSS for styling",
  "Prisma with PostgreSQL",
  "Cloudinary for image hosting",
  "NextAuth.js for authentication",
  "Vercel for deployment",
];

const RESULTS = [
  {
    title: "Key Achievements",
    text: "This project demonstrated how thoughtful design paired with scalable technology can deliver a premium e-commerce experience. It delivered a full-stack e-commerce concept showcasing premium UI/UX while strengthening React, TypeScript, and API integration skills.",
  },
  {
    title: "Learning Outcomes",
    text: "The project provided valuable experience in designing with scalability in mind through reusable UI components, learning Cloudinary integration for image management, and building comprehensive admin dashboards for product management.",
  },
  {
    title: "Future Opportunities",
    text: "Potential enhancements include advanced filtering and personalization features, AR product visualization, and expansion into a dedicated mobile app for an even more immersive shopping experience.",
  },
];

// A numbered badge in the Tidehaus gradient
function NumberBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: TIDE_GRADIENT }}>
      {children}
    </span>
  );
}

// A bulleted list in the sky-blue accent
function Bullets({ items, size = "text-sm" }: { items: string[]; size?: string }) {
  return (
    <ul className={`flex flex-col gap-2 leading-6 text-zinc-300 ${size}`}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: TIDE_ACCENT }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

const heroStyle: CSSProperties = { background: TIDE_HERO_BG, height: HERO_H };
const brandStyle: CSSProperties = { background: TIDE_TILE_GRADIENT, color: "#ffffff" };

export default function TidehausBoard() {
  return (
    <StoryBoard width={TIDEHAUS_BOARD.w} height={TIDEHAUS_BOARD.h} layout={LAYOUT} arrows={LOOP} branch={BRANCH}>
      {/* Centre: the hero */}
      <Frame name="hero">
        <div className="flex flex-col rounded-[28px] p-12 text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-white/10" style={heroStyle}>
          <span className="inline-flex self-start rounded-full bg-[#0B2536] px-3 py-1 text-xs font-medium ring-1 ring-[#38BDF8]/25" style={{ color: TIDE_ACCENT }}>
            Tidehaus Case Study
          </span>
          <h1 className="mt-6 text-[72px] font-extrabold leading-none tracking-tight" style={{ color: TIDE_ACCENT }}>
            Tidehaus Online Surf Shop
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-zinc-300">
            A premium surf gear and beachwear e-commerce platform designed as a concept project, creating a high-end, mobile-first
            shopping experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://online-surf-shop-a8b1mqoyh-fredys-projects-8feeb27c.vercel.app/#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              <IconExternalLink aria-hidden="true" size={18} stroke={1.8} />
              View Live Project
            </a>
          </div>
          <div className="mt-auto overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            <Image
              src="/projects/tidehaus/images/main-header.png"
              alt="Tidehaus Online Surf Shop hero mockup showing homepage on laptop + mobile"
              width={1200}
              height={800}
              className="block h-auto max-h-[340px] w-full object-contain"
              priority
            />
          </div>
        </div>
      </Frame>

      {/* Top left: the overview, at a glance, and the role, timeline and stack */}
      <Frame name="brief">
        <BoardHead eyebrow="Project Overview" title="Context" accent={TIDE_ACCENT} titleColor="#ffffff" />
        <Panel className={TIDE_CARD}>
          <Label color={TIDE_ACCENT}>Overview</Label>
          <p className="text-base leading-7 text-zinc-300">
            Tidehaus is a premium surf gear and beachwear e-commerce platform designed as a concept project. The goal was to create
            a high-end, mobile-first shopping experience while managing complex product variants like surfboard dimensions, wetsuit
            sizing, and accessories.
          </p>
          <p className="text-base leading-7 text-zinc-300">
            This project focused on design implementation, showcasing how thoughtful design paired with scalable technology can
            deliver a premium e-commerce experience. The dark theme provided a sleek aesthetic while making product photography stand
            out.
          </p>
        </Panel>
        <Panel style={{ background: TIDE_TINT }}>
          <Label color={TIDE_ACCENT}>At a glance</Label>
          <ul className="flex flex-col gap-2 text-sm font-medium" style={{ color: "#7DD3FC" }}>
            {AT_A_GLANCE.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: TIDE_ACCENT }} />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className={TIDE_CARD}>
          <Label color={TIDE_ACCENT}>Role</Label>
          <p className="text-xl font-semibold text-white">UI/UX Designer &amp; Frontend Developer</p>
          <Label color={TIDE_ACCENT}>Timeline</Label>
          <p className="text-xl font-semibold text-white">1 month</p>
          <Label color={TIDE_ACCENT}>Stack</Label>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tool) => (
              <span key={tool} className="inline-flex rounded-full px-3 py-1 text-xs font-medium" style={{ background: TIDE_TINT, color: "#7DD3FC" }}>
                {tool}
              </span>
            ))}
          </div>
        </Panel>
      </Frame>

      {/* Top: the executive summary, in a row above the hero */}
      <Frame name="summary">
        <BoardHead eyebrow="Executive Summary" title="Problem · Solution · Outcome" accent={TIDE_ACCENT} titleColor="#ffffff" />
        <div className="grid grid-cols-3 gap-8">
          {EXECUTIVE_SUMMARY_CARDS.map((card, i) => (
            <Panel key={card.title} className={TIDE_CARD}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: TIDE_GRADIENT }}>
                {card.icon}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: TIDE_ACCENT }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: TIDE_ACCENT }}>
                {card.title}
              </h3>
              <p className="text-base leading-7 text-zinc-300">{card.text}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Top right: the design direction and palette */}
      <Frame name="approach">
        <BoardHead eyebrow="Design Approach" title="Design Direction" accent={TIDE_ACCENT} titleColor="#ffffff" />
        <Panel className={TIDE_CARD}>
          <Label color={TIDE_ACCENT}>Direction</Label>
          <p className="text-base leading-7 text-zinc-300">
            The design direction was centered on surf culture while maintaining a modern e-commerce standard. Key decisions included
            a dark theme for premium aesthetics, ocean-inspired color palette with crisp whites and green accents, and the Outfit font
            family for modern readability.
          </p>
          <p className="text-base leading-7 text-zinc-300">
            The layout system used a 4px spacing grid with card-based product layouts and reusable components. Micro-interactions
            included smooth hover effects, typography scaling, and subtle animations to enhance the user experience.
          </p>
        </Panel>
        <Panel className={TIDE_CARD}>
          <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
            <Image
              src="/projects/tidehaus/images/color-palette.png"
              alt="Tidehaus color palette and typography board showing ocean-inspired colors and Outfit font family"
              width={1200}
              height={600}
              className="block h-auto w-full object-contain"
              priority
            />
          </div>
          <p className="text-center text-xs text-zinc-500">Ocean-inspired palette and the Outfit type family.</p>
        </Panel>
      </Frame>

      {/* Right: the design highlights */}
      <Frame name="highlights">
        <BoardHead eyebrow="Key UI Decisions" title="Design Highlights" accent={TIDE_ACCENT} titleColor="#ffffff" />
        <div className="grid grid-cols-2 gap-8">
          {UI_DECISIONS.map((f) => (
            <Panel key={f.t} className={TIDE_CARD}>
              <h4 className="text-lg font-semibold text-white">{f.t}</h4>
              <p className="text-sm leading-6 text-zinc-400">{f.d}</p>
            </Panel>
          ))}
        </div>
      </Frame>

      {/* Bottom right: the key design elements, the recording and the screens */}
      <Frame name="visuals">
        <BoardHead
          eyebrow="Design Stage"
          title="Key Design Elements"
          kicker="The interface showcases a modern e-commerce experience with intuitive navigation, product discovery, and seamless shopping interactions."
          accent={TIDE_ACCENT}
          titleColor="#ffffff"
        />
        <Panel className={TIDE_CARD}>
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <video
              className="h-auto w-full"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/projects/tidehaus/images/color-palette.png"
            >
              <source src="/projects/tidehaus/images/tidehaus-screen-record.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="text-center text-xs text-zinc-500">3-step checkout reduces cognitive load and form fatigue.</p>
        </Panel>
        <div className="grid grid-cols-2 gap-8">
          <Panel className={TIDE_CARD}>
            <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image
                src="/projects/tidehaus/images/product-cards.png"
                alt="Product card mockups with hover states showing surf gear"
                width={800}
                height={600}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
            <h4 className="font-medium text-white">Product Catalog</h4>
            <p className="text-sm text-zinc-400">
              Clean product grid showcasing surf gear with clear pricing, categories, and visual hierarchy for easy browsing.
            </p>
            <p className="text-xs text-zinc-500">Sticky cart summary keeps cost/CTA visible.</p>
          </Panel>
          <Panel className={TIDE_CARD}>
            <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image
                src="/projects/tidehaus/images/product-detail-modal.png"
                alt="Product detail modal with size/color selection for surfboard bag"
                width={800}
                height={600}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
            <h4 className="font-medium text-white">Product Detail Modal</h4>
            <p className="text-sm text-zinc-400">
              Detailed product view with specifications, features, stock availability, and clear call-to-action for purchase.
            </p>
          </Panel>
        </div>
      </Frame>

      {/* Bottom: the tools and the technical approach */}
      <Frame name="tools">
        <BoardHead eyebrow="Tools Used" title="Design & Development Stack" accent={TIDE_ACCENT} titleColor="#ffffff" />
        <div className="grid grid-cols-2 gap-8">
          <Panel style={{ background: TIDE_TINT }}>
            <Label color={TIDE_ACCENT}>Design Tools</Label>
            <Bullets items={DESIGN_TOOLS} />
          </Panel>
          <Panel style={{ background: TIDE_TINT }}>
            <Label color={TIDE_ACCENT}>Development Stack</Label>
            <Bullets items={DEV_STACK} />
          </Panel>
        </div>
        <Panel className={TIDE_CARD}>
          <Label color={TIDE_ACCENT}>Technical Approach</Label>
          <p className="text-base leading-7 text-zinc-300">
            The build was grounded in a component-driven approach with a modern frontend + backend stack. The frontend used Next.js
            13+ with TypeScript, Tailwind CSS for styling, and Framer Motion for animations.
          </p>
          <p className="text-base leading-7 text-zinc-300">
            The backend utilized Prisma with PostgreSQL for database management, Cloudinary for scalable image hosting, and
            NextAuth.js for authentication. The entire application was deployed on Vercel for optimal performance.
          </p>
        </Panel>
      </Frame>

      {/* Bottom left: the technical challenges */}
      <Frame name="challenges">
        <BoardHead eyebrow="Challenges & Solutions" title="Key Technical Challenges" accent={TIDE_ACCENT} titleColor="#ffffff" />
        {[
          {
            title: "Product Variants",
            text: "Created a flexible schema and UI to handle surfboard dimensions, wetsuit sizes, and accessories.",
            icon: <IconShoppingCart size={22} stroke={1.5} />,
          },
          {
            title: "Image Hosting",
            text: "Learned Cloudinary integration to store and optimize product media efficiently.",
            icon: <IconPalette size={22} stroke={1.5} />,
          },
          {
            title: "Admin Dashboard",
            text: "Built intuitive CRUD forms with validation and preview to simplify product management.",
            icon: <IconCode size={22} stroke={1.5} />,
          },
        ].map((card) => (
          <Panel key={card.title} className={TIDE_CARD}>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: TIDE_TINT, color: TIDE_ACCENT }}>
              {card.icon}
            </span>
            <h4 className="text-xl font-semibold text-white">{card.title}</h4>
            <p className="text-base leading-7 text-zinc-300">{card.text}</p>
          </Panel>
        ))}
      </Frame>

      {/* Left: the project outcomes */}
      <Frame name="results">
        <BoardHead eyebrow="Results & Takeaways" title="Project Outcomes" accent={TIDE_ACCENT} titleColor="#ffffff" />
        {RESULTS.map((item, i) => (
          <Panel key={item.title} className={TIDE_CARD}>
            <NumberBadge>{String(i + 1).padStart(2, "0")}</NumberBadge>
            <h4 className="text-lg font-semibold text-white">{item.title}</h4>
            <p className="text-sm leading-6 text-zinc-400">{item.text}</p>
          </Panel>
        ))}
      </Frame>

      {/* Closing: the projected impact, the final showcase, and the accessibility notes, below the loop */}
      <Frame name="closing">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <BoardHead eyebrow="Projected Impact" title="Projected Impact" accent={TIDE_ACCENT} titleColor="#ffffff" />
            {PROJECTED_IMPACT.map((item, i) => (
              <Panel key={item} className={TIDE_CARD}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: TIDE_ACCENT }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-lg font-medium leading-snug text-white">{item}</p>
              </Panel>
            ))}
          </div>
          <div className="flex flex-col gap-8">
            <BoardHead
              eyebrow="Final Showcase"
              title="Desktop & Mobile Views"
              kicker="The Tidehaus experience is optimized for both desktop and mobile users, ensuring a seamless shopping experience across all devices."
              accent={TIDE_ACCENT}
              titleColor="#ffffff"
            />
            <Panel className={TIDE_CARD}>
              <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <Image
                  src="/projects/tidehaus/images/desktop-mobile-views.png"
                  alt="Side-by-side desktop and mobile views showing Tidehaus responsive design"
                  width={1920}
                  height={1080}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </Panel>
            <BoardHead eyebrow="Accessibility" title="Accessibility considerations" accent={TIDE_ACCENT} titleColor="#ffffff" />
            <Panel className={TIDE_CARD}>
              <Bullets
                size="text-sm leading-6"
                items={[
                  "Alt text for all product images and hover states for variant selection.",
                  "Keyboard navigable checkout flow with clear focus outlines.",
                  "Price and CTA buttons checked against WCAG AA contrast standards.",
                ]}
              />
            </Panel>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500">© {new Date().getFullYear()} Tidehaus Online Surf Shop · Case Study</p>
      </Frame>
    </StoryBoard>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import BoardNav from "../board/BoardNav";
import OtherProjects from "@/components/sections/OtherProjects";
import { RevealBlock } from "../grove/Reveal";

// The Samples Store case study. It follows the same running order as the Grove case study:
// summary, hero visuals, research, interviews, role and team, constraints, three decisions,
// screens, results, how I built it, where it stands. Copy that is still missing is shown as
// a [bracketed placeholder] so it is easy to find.

const A = "/projects/ecommerce/images";
const INK = "#1f2937";
const INK_DEEP = "#0b0f14";
const HERO_BG = "#EDF0F4";
const GRADIENT = "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)";

const SECTION = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-[80px] lg:mt-[120px]";
const CARD = "rounded-3xl bg-white p-6 ring-1 ring-zinc-200 sm:p-8";
const LABEL = "text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500";
const BODY = "text-[17px] leading-[26px] text-zinc-700";

/* A missing piece of copy, left visible on purpose */
function Ph({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[0.95em] text-amber-900 ring-1 ring-amber-300">
      [{children}]
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-300">
      {children}
    </p>
  );
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">{children}</h2>;
}

/* A screen or photo inside a rounded frame, with an optional caption */
function Shot({ src, alt, caption, sizes = "(min-width: 1024px) 720px, 100vw" }: { src: string; alt: string; caption?: string; sizes?: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-zinc-200">
        <Image src={src} alt={alt} width={1200} height={800} sizes={sizes} className="block h-auto w-full object-contain" />
      </div>
      {caption ? <figcaption className="mt-3 text-sm text-zinc-600">{caption}</figcaption> : null}
    </figure>
  );
}

/* An empty slot where a screen or photo still needs to go */
function Slot({ label, h = "h-48" }: { label: ReactNode; h?: string }) {
  return (
    <div className={`flex ${h} items-center justify-center rounded-2xl border border-dashed border-zinc-400 bg-zinc-100 px-6 text-center text-sm text-zinc-600`}>
      {label}
    </div>
  );
}

/* ───────────── Hero (from the Figma "Arktura - Case Study" frame) ───────────── */

const HERO_META: { label: string; values: string[] }[] = [
  { label: "Timeline", values: ["4 Months"] },
  { label: "Roles", values: ["UI/UX Designer", "Researcher"] },
  { label: "Team", values: ["3 members"] },
  { label: "Status", values: ["Shipped"] },
];

const HERO_STATS = [
  ["~80%", "Of Sample orders automated in 3 months"],
  ["~10 hrs/week", "Sales team time saved"],
  ["~30%", "Fewer order errors"],
];

const SAGE = "#3b4a35";

function Hero() {
  return (
    <header className="mx-auto w-full max-w-[1320px] px-4 pt-10 sm:px-6 min-[1400px]:px-0">
      <div className="relative overflow-hidden rounded-[24px] bg-[#e3e9dd] xl:aspect-[1320/876]">
        <div className="flex flex-col gap-8 px-6 py-10 sm:px-12 sm:py-14 xl:absolute xl:inset-y-0 xl:left-[7.7%] xl:w-[58%] xl:justify-center xl:p-0">
          <RevealBlock mount delay={0} className="xl:absolute xl:left-0 xl:top-[11.2%]">
            <p className="text-[14px] leading-[20px] tracking-[1.8px]" style={{ color: SAGE }}>
              Arktura . Shipped . 2025
            </p>
          </RevealBlock>
          <div className="flex flex-col gap-8">
            <RevealBlock mount delay={0.12}>
              <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-1.5px] sm:text-[56px] min-[1360px]:text-[72px] min-[1360px]:leading-[76px] min-[1360px]:tracking-[-2.5px]" style={{ color: SAGE }}>
                Redesigning Arktura&apos;s Samples Store
              </h1>
            </RevealBlock>
            <RevealBlock mount delay={0.24}>
              <p className="max-w-[650px] text-[18px] leading-[26px] tracking-[-0.2px] text-black min-[1360px]:text-[22px] min-[1360px]:leading-[32px]">
                I led the redesign of the Samples Store, using a Shopify template to turn a static page of diagrams
                into a streamlined, self-serve shopping journey.
              </p>
            </RevealBlock>
          </div>
          <RevealBlock mount delay={0.36}>
            <dl className="grid w-fit gap-3 sm:grid-cols-[auto_auto] sm:gap-x-12">
              {HERO_META.map((m) => (
                <div key={m.label} className="flex items-center gap-4">
                  <dt className="w-[72px] shrink-0 font-mono text-[14px] uppercase leading-[20px] tracking-[-0.42px] text-black">{m.label}</dt>
                  <dd className="flex flex-wrap gap-2.5 min-[1100px]:flex-nowrap">
                    {m.values.map((v) => (
                      <span key={v} className="whitespace-nowrap rounded-[60px] bg-[#d4dfc9] px-[18px] py-2 text-[16px] leading-6 tracking-[-0.2px] text-black">
                        {v}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealBlock>
          <RevealBlock mount delay={0.44} className="xl:mt-8">
            <a
              href="https://samples.arktura.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[50px] w-[229px] items-center justify-center rounded-[110px] bg-[#3b4a35] text-[14px] tracking-[1px] text-white transition-transform hover:scale-[1.03]"
            >
              Check out live site
            </a>
          </RevealBlock>
        </div>

        <RevealBlock mount delay={0.2} className="relative mx-auto mt-2 aspect-[804/796] w-[min(100%,520px)] overflow-hidden xl:absolute xl:left-[67.35%] xl:top-[4.57%] xl:mt-0 xl:h-[90.9%] xl:w-[60.9%] xl:max-w-none xl:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Arktura sample tiles" src={`${A}/hero-figma.png`} className="absolute left-[-58.21%] top-[-28.35%] h-[150.02%] w-[222.77%] max-w-none" />
        </RevealBlock>

        <RevealBlock mount delay={0.5} className="flex flex-col gap-6 px-6 pb-10 pt-6 sm:flex-row sm:gap-[60px] sm:px-12 xl:absolute xl:bottom-[7.2%] xl:left-[7.7%] xl:p-0">
          {HERO_STATS.map(([v, t]) => (
            <p key={v} className="text-[16px] font-medium leading-6 tracking-[-0.2px]" style={{ color: "rgba(59,74,53,0.66)" }}>
              {v}
              <br />
              {t}
            </p>
          ))}
        </RevealBlock>
      </div>
    </header>
  );
}

/* Before and after, side by side */
function HeroVisuals() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="grid gap-6 md:grid-cols-2">
        <Shot src={`${A}/old-store.png`} alt="The original Samples Store: a static page of diagrams" caption="Before: a static page of diagrams, no checkout" />
        <Shot src={`${A}/hero.png`} alt="The redesigned Samples Store home page" caption="After: product photography, structured navigation, checkout" />
      </div>
    </RevealBlock>
  );
}

/* ───────────── Research ───────────── */

function Research() {
  return (
    <RevealBlock as="section" from="left" className={SECTION}>
      <div className="max-w-3xl">
        <Eyebrow>The problem</Eyebrow>
        <H2>The Challenge: A checkout process that had outgrown its original design</H2>
        <div className={`mt-6 space-y-4 ${BODY}`}>
          <p>
            The original store was little more than a static page of diagrams. It had no product photography, no
            categories and no ordering system.
          </p>
          <p>
            Ordering meant calling the sales team. That added friction for architects, designers and reps, and it
            kept the sales team busy with work a store should handle.
          </p>
        </div>
      </div>
      <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
        <Shot src={`${A}/old-store.png`} alt="Old store, static diagrams" caption="Before: diagrams only" />
        <Shot src={`${A}/order-flow.svg`} alt="Order flow before and after the redesign: manual steps through the sales rep, then a self-serve store" caption="The sales-team order flow, before and after the redesign" />
      </div>
    </RevealBlock>
  );
}

/* ───────────── Three problems ───────────── */

const PROBLEMS = [
  {
    title: "Navigation",
    problem: "Products weren't categorized, so reps and designers couldn't find a specific sample.",
    fix: "Clear categories and grouping made product discovery quicker.",
  },
  {
    title: "Product info",
    problem: "With only diagrams and no photography, customers couldn't judge the materials with confidence.",
    fix: "High-quality photography replaced the diagrams, so people could see what they were choosing.",
  },
  {
    title: "Ordering",
    problem: "There was no cart or checkout, so reps had to call Sales to place each order.",
    fix: "A cart and checkout flow automated ordering and took load off the sales team.",
  },
];

function Problems() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Problems</Eyebrow>
      <H2>Problems that users continued to encounter</H2>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <RevealBlock as="li" key={p.title} from="up" delay={i * 0.1} className="flex flex-col justify-center gap-10 rounded-[24px] bg-[#e3e9dd] px-[50px] py-10">
            <div className="flex flex-col gap-2.5">
              <h3 className="text-[20px] font-medium leading-normal" style={{ color: SAGE }}>{p.title}</h3>
              <p className="text-[14px] leading-normal text-black/90">{p.problem}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-[12px] font-medium uppercase leading-normal" style={{ color: "rgba(59,74,53,0.4)" }}>What changed</p>
              <p className="text-[14px] leading-normal text-black/90">{p.fix}</p>
            </div>
          </RevealBlock>
        ))}
      </ul>
      <RevealBlock delay={0.3} className="mt-4 rounded-[24px] bg-[#e3e9dd] px-[50px] py-10">
        <p className="text-[14px] leading-normal text-black/90">
          Takeaway: the main advantage of this redesign was that it improved the usability of the site and saved the sales team time on manual work that could be automated, leaving them more time to focus on their sales clients.
        </p>
      </RevealBlock>
    </RevealBlock>
  );
}

/* ───────────── Role and team ───────────── */

const ROLE_COLUMNS: { head: string; items: ReactNode[] }[] = [
  {
    head: "I owned",
    items: ["Redesign lead and UI/UX design", "Wireframes, then high-fidelity screens", "Design system and front-end implementation"],
  },
  {
    head: "Others owned",
    items: ["Developers: checkout system and launch", "Photographer: product shoot"],
  },
];

function RoleAndTeam() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Role and team</Eyebrow>
      <H2>My role and team</H2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {ROLE_COLUMNS.map((col, i) => (
          <RevealBlock key={col.head} from="up" delay={i * 0.1} className="rounded-[24px] bg-[#e3e9dd] px-[50px] py-10">
            <p className={LABEL}>{col.head}</p>
            <ul className="mt-4 space-y-3 text-[15px] leading-6 text-zinc-800">
              {col.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RevealBlock>
        ))}
      </div>
    </RevealBlock>
  );
}

/* ───────────── Constraints ───────────── */

const CONSTRAINTS = ["Shopify template", "4 months", "Photography budget", "Brand refresh"];

function Constraints() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Constraints</Eyebrow>
      <H2>Constraints</H2>
      <ul className="mt-6 flex flex-wrap gap-2">
        {CONSTRAINTS.map((c, i) => (
          <RevealBlock as="li" key={c} from="up" delay={i * 0.06}>
            <span className="inline-flex items-center rounded-full bg-zinc-200/80 px-4 py-2 text-sm font-medium text-zinc-800 ring-1 ring-zinc-900/10">
              {c}
            </span>
          </RevealBlock>
        ))}
      </ul>
    </RevealBlock>
  );
}

/* ───────────── Decisions ───────────── */

function DecisionBlock({
  title,
  rows,
  visual,
  reverse = false,
  wide = false,
}: {
  title: string;
  rows: { k: string; v: ReactNode }[];
  visual: ReactNode;
  reverse?: boolean;
  wide?: boolean;
}) {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className={`grid gap-8 ${wide ? "" : "md:grid-cols-2"} md:items-start ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <Eyebrow>Decision</Eyebrow>
          <H2>{title}</H2>
          <dl className="mt-6 space-y-5">
            {rows.map((r) => (
              <div key={r.k}>
                <dt className={LABEL}>{r.k}</dt>
                <dd className={`mt-1 ${BODY}`}>{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>{visual}</div>
      </div>
    </RevealBlock>
  );
}

function Decisions() {
  return (
    <>
      <DecisionBlock
        title="Bringing context into the conversation"
        rows={[
          { k: "Insight", v: "Leadership questioned whether a redesign would pay off, since orders already worked by phone and email." },
          { k: "What I did", v: "Built low-fidelity wireframes to show how a modern store would help before any budget was approved." },
          { k: "Chosen", v: "Approval to go ahead with the redesign." },
          { k: "Trade-off", v: "Some wireframe ideas changed once the template was chosen, so part of that work was redone." },
        ]}
        visual={<Shot src={`${A}/wireframes.png`} alt="Low-fidelity wireframes for the store" caption="Low-fidelity wireframes" />}
      />
      <DecisionBlock
        title="Shopify template vs. Custom build"
        rows={[
          { k: "Insight", v: "A custom build did not fit the four-month timeline, the budget (which also had to cover photography) or the developers' capacity, and a standard platform is easier to maintain." },
          { k: "Chosen", v: "A Shopify template, customised to Arktura's brand and a visual design system." },
          { k: "What it blocked", v: "The template limited layout flexibility, checkout customisation and some brand expression." },
          { k: "Trade-off", v: "I gave up full control of layout and checkout in exchange for a design that could ship within four months." },
        ]}
        reverse
        visual={<Shot src={`${A}/midfi.png`} alt="Mid-fidelity mockups on the Shopify template" caption="Mid-fidelity mockups on the template" />}
      />
      <DecisionBlock
        title="Photography over diagrams"
        rows={[
          { k: "Insight", v: "Customers couldn't judge the materials from diagrams alone." },
          { k: "Chosen", v: "Budget for a photographer, and hundreds of sample images edited in Photoshop and Illustrator." },
          { k: "Rejected", v: "Keeping the existing diagrams. They did not give customers enough detail to judge a material." },
        ]}
        wide
        visual={
          <div className="grid gap-8 rounded-[24px] bg-[#e3e9dd] p-6 sm:p-10 md:grid-cols-2 md:items-end">
            <Shot src={`${A}/old-store.png`} alt="The old store: diagrams with no detail pages" caption="No further detailed pages" />
            <Shot src={`${A}/hifi-2.png`} alt="The new product page with photography, colour options and project examples" caption="Detailed images with project examples and descriptions." />
          </div>
        }
      />
    </>
  );
}

/* ───────────── Screens ───────────── */

function Screens() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Solution</Eyebrow>
      <H2>The solution, screen by screen</H2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Shot src={`${A}/hifi.png`} alt="Hi-fi design: product pages with navigation and search" caption="Catalog and navigation. Better nav and search speed up finding materials." />
        <Shot src={`${A}/hifi-2.png`} alt="Hi-fi design: order confirmation and status" caption="Confirmation and status. Clear feedback reduces follow-up emails." />
      </div>
      <p className="mt-6 text-[15px] leading-6 text-zinc-700">
        Accessibility: checkout forms have labels and error messages, CTAs and nav links were colour-tested for contrast,
        and product images have descriptive alt text.
      </p>
    </RevealBlock>
  );
}

/* ───────────── Results ───────────── */

const RESULTS = [
  { value: "~80%", text: "of sample orders automated, first 3 months", source: "Sales team estimate, first 3 months" },
  { value: "~10 hrs/wk", text: "staff time saved", source: "Sales team estimate" },
  { value: "~30%", text: "fewer order errors", source: "Sales team estimate" },
];

function Results() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Results</Eyebrow>
      <H2>Results</H2>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {RESULTS.map((r, i) => (
          <RevealBlock as="li" key={r.value} from="up" delay={i * 0.1} className={`${CARD} flex flex-col`}>
            <p className="text-4xl font-bold tracking-tight" style={{ color: INK }}>
              {r.value}
            </p>
            <p className="mt-2 text-[15px] text-zinc-700">{r.text}</p>
            <p className="mt-auto pt-6 text-xs text-zinc-500">{r.source}</p>
          </RevealBlock>
        ))}
      </ul>
    </RevealBlock>
  );
}

/* ───────────── How I built it ───────────── */

const TIMELINE = [
  { t: "Wireframes", d: "Built to show the value of a redesign and secure leadership approval." },
  { t: "Photography", d: "Hired a photographer and edited hundreds of sample images." },
  { t: "UI and template", d: "Customised a Shopify template and built a visual design system." },
  { t: "Build and launch", d: "Worked with developers across teams to build the checkout and launch." },
];

function HowIBuiltIt() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>How I built it</Eyebrow>
      <H2>How I built it</H2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className={CARD}>
          <p className={LABEL}>Timeline</p>
          <ol className="mt-4 space-y-4">
            {TIMELINE.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: GRADIENT }}>
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-zinc-900">{s.t}</p>
                  <p className="text-[15px] leading-6 text-zinc-700">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-4">
          <div className={CARD}>
            <p className={LABEL}>Built with</p>
            <p className="mt-3 text-[15px] leading-6 text-zinc-800">Shopify, Figma, Photoshop, Illustrator</p>
          </div>
          <div className={CARD}>
            <p className={LABEL}>What went wrong</p>
            <p className="mt-3 text-[15px] leading-6 text-zinc-800">
              Editing hundreds of product photos took far longer than planned, and handoffs between the teams involved slowed the project down.
            </p>
          </div>
        </div>
      </div>
    </RevealBlock>
  );
}

/* ───────────── Where it stands ───────────── */

function WhereItStands() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Where it stands</Eyebrow>
      <H2>Where it stands and what I&apos;d change</H2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className={CARD}>
          <p className={LABEL}>Where it stands</p>
          <p className="mt-3 text-[15px] leading-6 text-zinc-800">
            Live at samples.arktura.com. Most sample orders now go through self-serve checkout.
          </p>
        </div>
        <div className={CARD}>
          <p className={LABEL}>What I&apos;d change</p>
          <p className="mt-3 text-[15px] leading-6 text-zinc-800">
            Test with real customers earlier, plan photography sooner, and involve the developers earlier.
          </p>
        </div>
        <div className={CARD}>
          <p className={LABEL}>What I&apos;d measure first</p>
          <p className="mt-3 text-[15px] leading-6 text-zinc-800">
            How many orders still need the sales team's help.
          </p>
        </div>
      </div>
    </RevealBlock>
  );
}

export default function EcommerceCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="bg-zinc-50 pb-12 pt-16 text-zinc-800">
        <Hero />
        <HeroVisuals />
        <Research />
        <Problems />
        <RoleAndTeam />
        <Constraints />
        <Decisions />
        <Screens />
        <Results />
        <HowIBuiltIt />
        <WhereItStands />

        <RevealBlock as="section" className={`${SECTION} mb-6`}>
          <Link href="/projects/grove" className="group flex items-center justify-between rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Next project</span>
              <span className="mt-2 block text-2xl font-semibold tracking-tight">Grove</span>
            </span>
            <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </RevealBlock>

        <OtherProjects currentProject="ecommerce" />
        <footer className="bg-black py-12 text-zinc-200">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs">© {new Date().getFullYear()} Arktura Samples Store · Case Study</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

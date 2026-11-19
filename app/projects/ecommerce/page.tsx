"use client";

import BoardNav from "../board/BoardNav";
import OtherProjects from "@/components/sections/OtherProjects";
import { RevealBlock } from "../grove/Reveal";
import {
  BODY,
  SECTION,
  CaseFooter,
  Constraints,
  DecisionBlock,
  Eyebrow,
  H2,
  HowIBuiltIt,
  NextProject,
  ProblemCards,
  Results,
  RoleAndTeam,
  Shot,
  WhereItStands,
  type Theme,
} from "../case-study/kit";

// The Samples Store case study. Its hero is drawn from the Figma frame; every section under it
// uses the shared case-study kit, so it matches the other case studies.

const A = "/projects/ecommerce/images";
const SAGE = "#3b4a35";

const THEME: Theme = {
  ink: SAGE,
  tint: "#e3e9dd",
  chip: "#d4dfc9",
  gradient: "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)",
};

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


function Hero() {
  return (
    <header className="mx-auto w-full max-w-[1320px] px-5 pt-10 sm:px-8 min-[1400px]:px-0">
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
                  <dt className="w-[80px] shrink-0 font-mono text-[12px] font-medium uppercase leading-[20px] tracking-[0.08em] text-zinc-800">{m.label}</dt>
                  <dd className="flex flex-wrap gap-2.5 min-[1100px]:flex-nowrap">
                    {m.values.map((v) => (
                      <span key={v} className="whitespace-nowrap rounded-full bg-[#d4dfc9] px-[18px] py-2 text-[16px] leading-6 tracking-[-0.2px] text-black">
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
              className="inline-flex h-[50px] w-[229px] items-center justify-center rounded-full bg-[#3b4a35] text-[14px] tracking-[1px] text-white transition-transform hover:scale-[1.03]"
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
            <p key={v} className="text-[16px] font-medium leading-6 tracking-[-0.2px]" style={{ color: SAGE }}>
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

export default function EcommerceCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="bg-zinc-50 pb-12 pt-16 text-zinc-800">
        <Hero />

        <RevealBlock as="section" className={SECTION}>
          <div className="grid gap-6 md:grid-cols-2">
            <Shot src={`${A}/old-store.png`} alt="The original Samples Store: a static page of diagrams" caption="Before: a static page of diagrams, no checkout" />
            <Shot src={`${A}/hero.png`} alt="The redesigned Samples Store home page" caption="After: product photography, structured navigation, checkout" />
          </div>
        </RevealBlock>

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

        <ProblemCards
          theme={THEME}
          title="Problems that users continued to encounter"
          items={[
            { title: "Navigation", problem: "Products weren't categorized, so reps and designers couldn't find a specific sample.", fix: "Clear categories and grouping made product discovery quicker." },
            { title: "Product info", problem: "With only diagrams and no photography, customers couldn't judge the materials with confidence.", fix: "High-quality photography replaced the diagrams, so people could see what they were choosing." },
            { title: "Ordering", problem: "There was no cart or checkout, so reps had to call Sales to place each order.", fix: "A cart and checkout flow automated ordering and took load off the sales team." },
          ]}
          takeaway="the main advantage of this redesign was that it improved the usability of the site and saved the sales team time on manual work that could be automated, leaving them more time to focus on their sales clients."
        />

        <RoleAndTeam
          theme={THEME}
          columns={[
            { head: "I owned", items: ["Redesign lead and UI/UX design", "Wireframes, then high-fidelity screens", "Design system and front-end implementation"] },
            { head: "Others owned", items: ["Developers: checkout system and launch", "Photographer: product shoot"] },
          ]}
        />

        <Constraints items={["Shopify template", "4 months", "Photography budget", "Brand refresh"]} />

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
            <div className="grid gap-8 rounded-[24px] p-6 sm:p-10 md:grid-cols-2 md:items-end" style={{ background: THEME.tint }}>
              <Shot src={`${A}/old-store.png`} alt="The old store: diagrams with no detail pages" caption="No further detailed pages" />
              <Shot src={`${A}/hifi-2.png`} alt="The new product page with photography, colour options and project examples" caption="Detailed images with project examples and descriptions." />
            </div>
          }
        />

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

        <Results
          theme={THEME}
          items={[
            { value: "~80%", text: "of sample orders automated, first 3 months", source: "Sales team estimate, first 3 months" },
            { value: "~10 hrs/wk", text: "staff time saved", source: "Sales team estimate" },
            { value: "~30%", text: "fewer order errors", source: "Sales team estimate" },
          ]}
        />

        <HowIBuiltIt
          theme={THEME}
          timeline={[
            { t: "Wireframes", d: "Built to show the value of a redesign and secure leadership approval." },
            { t: "Photography", d: "Hired a photographer and edited hundreds of sample images." },
            { t: "UI and template", d: "Customised a Shopify template and built a visual design system." },
            { t: "Build and launch", d: "Worked with developers across teams to build the checkout and launch." },
          ]}
          tools="Shopify, Figma, Photoshop, Illustrator"
          wentWrong="Editing hundreds of product photos took far longer than planned, and handoffs between the teams involved slowed the project down."
        />

        <WhereItStands
          stands="Live at samples.arktura.com. Most sample orders now go through self-serve checkout."
          change="Test with real customers earlier, plan photography sooner, and involve the developers earlier."
          measure="How many orders still need the sales team's help."
        />

        <NextProject href="/projects/grove" name="Grove" />
        <OtherProjects currentProject="ecommerce" />
        <CaseFooter />
      </main>
    </div>
  );
}

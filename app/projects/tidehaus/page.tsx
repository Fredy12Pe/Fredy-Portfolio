"use client";

import BoardNav from "../board/BoardNav";
import OtherProjects from "@/components/sections/OtherProjects";
import { RevealBlock } from "../grove/Reveal";
import {
  BODY,
  CARD,
  SECTION,
  CaseFooter,
  CaseHero,
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

// The Tidehaus case study, in the same running order as the Samples Store and Grove pages.

const A = "/projects/tidehaus/images";

const THEME: Theme = {
  ink: "#0B4A6E",
  tint: "#E6F6FE",
  chip: "#C6EBFC",
  gradient: "linear-gradient(223deg, #38BDF8 0%, #0B4A6E 100%)",
};

const UI_DETAILS = [
  { t: "Hero section", d: "A full-screen surf video with a call to action draws people in right away." },
  { t: "Product cards", d: "Clean hover states, consistent image ratios and quick-action buttons." },
  { t: "Product details", d: "A modal with a gallery and variant selection, so browsing isn't interrupted." },
  { t: "Micro-interactions", d: "Smooth hovers, type scaling and subtle animation." },
];

export default function TidehausCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="bg-zinc-50 pb-12 pt-16 text-zinc-800">
        <CaseHero
          theme={THEME}
          kicker="Tidehaus . Concept . Web"
          title="An online surf shop built for phones"
          summary="I designed and built Tidehaus, a concept surf gear and beachwear store with a 3-step checkout, fast product media and a reusable component library."
          meta={[
            { label: "Timeline", values: ["1 Month"] },
            { label: "Roles", values: ["UI/UX Designer", "Front-end Developer"] },
            { label: "Team", values: ["Solo"] },
            { label: "Status", values: ["Concept"] },
          ]}
          stats={[
            ["6 → 3", "Checkout steps"],
            ["<2s", "Mobile page loads in the prototype"],
            ["5 of 5", "Testers completed checkout"],
          ]}
          image={`${A}/main-header.png`}
          imageAlt="The Tidehaus home page on a laptop and phone"
          cta={{ href: "https://online-surf-shop.vercel.app/", label: "Check out live site" }}
        />

        {/* Research */}
        <RevealBlock as="section" from="left" className={SECTION}>
          <div className="max-w-3xl">
            <Eyebrow>The problem</Eyebrow>
            <H2>The Challenge: surf shops that are slow and hard to buy from</H2>
            <div className={`mt-6 space-y-4 ${BODY}`}>
              <p>
                Surf stores online often load slowly, have cluttered navigation and drag people through long checkouts, so
                many leave before buying. Surfers mostly shop on their phones, often on cellular data.
              </p>
              <p>
                Tidehaus is a concept store for premium surf gear and beachwear. The goal was a high-end, mobile-first
                shopping experience that could still handle complex product variants like surfboard dimensions, wetsuit
                sizes and accessories.
              </p>
            </div>
          </div>
        </RevealBlock>

        <ProblemCards
          theme={THEME}
          title="Problems that surf shoppers run into"
          items={[
            {
              title: "Checkout",
              problem: "Long, six-step checkouts with repeated forms lead people to abandon their cart.",
              fix: "A 3-step checkout cuts form fatigue, projected to reduce abandonment by about 20–25%.",
            },
            {
              title: "Product variants",
              problem: "Surfboard dimensions, wetsuit sizes and accessories are hard to compare and choose between.",
              fix: "A flexible data schema and variant picker in a product modal, with filtering and sorting.",
            },
            {
              title: "Speed",
              problem: "Heavy product photos make pages slow on cellular networks.",
              fix: "Cloudinary hosts and resizes product media, so prototype pages load in under 2 seconds on mobile.",
            },
          ]}
          takeaway="a premium look only helps if the store is fast and the path to buying is short, so performance and checkout came first."
        />

        <RoleAndTeam
          theme={THEME}
          columns={[
            { head: "I owned", items: ["Design direction, palette and type", "UI design and 12+ reusable components", "Front end, database and auth", "Admin dashboard and deployment"] },
            { head: "Others owned", items: ["Solo concept project, tested informally with 5 surfers"] },
          ]}
        />

        <Constraints items={["Concept, not shipped", "1 month", "Solo designer-developer", "Complex product variants", "Mobile first"]} />

        <DecisionBlock
          title="A surf-culture look on a standard store layout"
          rows={[
            { k: "Insight", v: "Surfers expect the brand to feel like surf culture, but still want a store they already know how to use." },
            { k: "Chosen", v: "Ocean-inspired colours with crisp whites and green accents, the Outfit font, a 4px spacing grid and card-based product layouts." },
            { k: "Trade-off", v: "Familiar e-commerce patterns over a more unusual layout, so less room for brand expression." },
          ]}
          visual={<Shot src={`${A}/color-palette.png`} alt="The Tidehaus colour palette and Outfit typography" caption="Colour palette and type" />}
        />
        <DecisionBlock
          title="Product details in a modal"
          rows={[
            { k: "Insight", v: "Shoppers compare several boards before choosing, and full page loads slowed that down." },
            { k: "Chosen", v: "A product modal with gallery, specs, stock and variant selection over the grid." },
            { k: "Rejected", v: "Separate product pages for every item. Better for sharing links, slower for comparing." },
            { k: "Trade-off", v: "Less room for long product stories, in exchange for faster browsing." },
          ]}
          reverse
          visual={<Shot src={`${A}/product-detail-modal.png`} alt="Product detail modal with size and colour selection" caption="Specs, stock and a clear call to action" />}
        />
        <DecisionBlock
          title="Reusable components from day one"
          rows={[
            { k: "Insight", v: "A one-month build with one person needed every screen to reuse the same parts." },
            { k: "Chosen", v: "12+ reusable UI components in Next.js and Tailwind, plus an admin dashboard with validated forms and previews." },
            { k: "Trade-off", v: "More time up front on components, in exchange for faster screens later and easier product management." },
          ]}
          wide
          visual={
            <div className="rounded-[24px] p-6 sm:p-10" style={{ background: THEME.tint }}>
              <Shot src={`${A}/product-cards.png`} alt="Product cards with hover states" caption="Product cards with clear pricing, categories and hierarchy" />
            </div>
          }
        />

        {/* Screens */}
        <RevealBlock as="section" className={SECTION}>
          <Eyebrow>Solution</Eyebrow>
          <H2>The solution, screen by screen</H2>
          <div className="mt-8 grid items-start gap-6 md:grid-cols-[3fr_2fr]">
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-zinc-200">
              <video
                className="block h-auto w-full"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={`${A}/color-palette.png`}
                aria-label="A screen recording of shopping on Tidehaus"
              >
                <source src={`${A}/tidehaus-screen-record.mp4`} type="video/mp4" />
              </video>
            </div>
            <ul className="grid gap-3">
              {UI_DETAILS.map((f, i) => (
                <RevealBlock as="li" key={f.t} from="up" delay={i * 0.05} className={`${CARD} !p-5`}>
                  <p className="font-semibold" style={{ color: THEME.ink }}>{f.t}</p>
                  <p className="mt-1 text-[14px] leading-6 text-zinc-700">{f.d}</p>
                </RevealBlock>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Shot src={`${A}/desktop-mobile-views.png`} alt="Tidehaus on desktop and mobile" caption="Designed for desktop and mobile" />
          </div>
          <p className="mt-6 text-[15px] leading-6 text-zinc-700">
            Accessibility: every product image has alt text, the checkout works by keyboard with clear focus outlines, and
            prices and buttons were checked against WCAG AA contrast.
          </p>
        </RevealBlock>

        <Results
          theme={THEME}
          intro="Tidehaus is a concept, so these come from the prototype and informal tests with 5 surfers."
          items={[
            { value: "5 of 5", text: "testers completed checkout", source: "Informal tests, 5 surfers" },
            { value: "<1 min", text: "from finding a product to adding it to the cart", source: "Informal tests" },
            { value: "<2s", text: "page loads on mobile", source: "Prototype measurement" },
            { value: "~20–25%", text: "projected drop in cart abandonment", source: "Projection, 6 steps down to 3" },
          ]}
        />

        <HowIBuiltIt
          theme={THEME}
          timeline={[
            { t: "Design direction", d: "Palette, type and layout grid built around surf culture." },
            { t: "UI and components", d: "Designed in Figma, then built as reusable components." },
            { t: "Back end and admin", d: "Product variants schema, image hosting, auth and an admin dashboard." },
            { t: "Test and deploy", d: "Informal tests with 5 surfers, then deployed on Vercel." },
          ]}
          tools="Figma, Illustrator, Photoshop, Cursor, ChatGPT, Next.js, TypeScript, Tailwind CSS, Framer Motion, Prisma, PostgreSQL, Cloudinary, NextAuth.js, Vercel"
          wentWrong="Modelling product variants took several tries before the schema handled boards, wetsuits and accessories cleanly. Cloudinary was new to me, so image hosting took longer than planned."
        />

        <WhereItStands
          stands="A working concept store, live as a demo. It is not a real shop taking orders."
          change="Test with more surfers, and add better filtering and personalisation. Later, try AR previews and a dedicated mobile app."
          measure="How many people who add to cart finish checkout, and how long they take."
        />

        <NextProject href="/projects/grove" name="Grove" />
        <OtherProjects currentProject="tidehaus" />
        <CaseFooter />
      </main>
    </div>
  );
}

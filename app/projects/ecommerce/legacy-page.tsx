"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { IconShoppingCart, IconUsers, IconSearch, IconExternalLink } from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";
import OtherProjects from "@/components/sections/OtherProjects";

const ARKTURA_GRADIENT = "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)";
const ARKTURA_HERO_BG = "#EDF0F4";
const ARKTURA_ACCENT = "#1f2937";
/* Dark tile gradient for tiles with white body text. */
const ARKTURA_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(148,163,184,0.28), transparent 42%), linear-gradient(145deg, #1f2937 0%, #0b0f14 100%)";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({
  id,
  eyebrow,
  title,
  kicker,
  children,
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  kicker?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <section id={id} className="relative py-10 sm:py-14">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl"
      >
        {eyebrow ? (
          <motion.div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-500 ring-1 ring-zinc-300">
            {eyebrow}
          </motion.div>
        ) : null}
        {title ? (
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">{title}</h2>
        ) : null}
        {kicker ? <p className="mt-3 text-base text-zinc-600">{kicker}</p> : null}
      </motion.div>
      <div className="mt-6 sm:mt-8">{children}</div>
    </Container>
  </section>
);

/* Bento layout spec shared across every case study: a six-column grid where
   content lives in rounded tiles of varying span, collapsing to one column. */

type TileSpan = 1 | 2 | 3 | 4 | 5 | 6;
type TileVariant = "white" | "tint" | "brand" | "dark";

const TILE_SPAN: Record<TileSpan, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
};

const TILE_VARIANT: Record<TileVariant, string> = {
  white: "bg-white ring-1 ring-zinc-200",
  tint: "bg-zinc-100/80 ring-1 ring-zinc-300",
  brand: "text-white ring-1 ring-zinc-900/20",
  dark: "bg-zinc-950 text-white ring-1 ring-white/10",
};

const BentoGrid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`grid grid-cols-1 gap-4 md:grid-cols-6 ${className}`}>{children}</div>
);

function BentoTile({
  span = 6,
  variant = "white",
  delay = 0,
  padded = true,
  interactive = true,
  className = "",
  style,
  onMouseMove,
  children,
}: {
  span?: TileSpan;
  variant?: TileVariant;
  delay?: number;
  padded?: boolean;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      onMouseMove={onMouseMove}
      className={`relative flex flex-col overflow-hidden rounded-3xl ${TILE_SPAN[span]} ${
        TILE_VARIANT[variant]
      } ${padded ? "p-6 sm:p-7" : ""} ${
        interactive ? "transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl" : ""
      } ${className}`}
      style={variant === "brand" ? { background: ARKTURA_TILE_GRADIENT, ...style } : style}
    >
      {children}
    </motion.div>
  );
}

const TileLabel = ({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "brand" }) => (
  <p
    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
      tone === "brand" ? "text-zinc-700" : "text-zinc-500"
    }`}
  >
    {children}
  </p>
);

const HeroMetaPill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-zinc-200/80 px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-900/10"
  >
    {children}
  </motion.span>
);

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: ARKTURA_GRADIENT }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left"
    />
  );
}

function useMouseGradient() {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };
  return { ref, onMouseMove };
}

const GlowCard = ({
  title,
  span = 3,
  delay = 0,
  children,
}: {
  title: string;
  span?: TileSpan;
  delay?: number;
  children: React.ReactNode;
}) => {
  const { onMouseMove } = useMouseGradient();
  return (
    <BentoTile span={span} delay={delay} onMouseMove={onMouseMove} className="group">
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(31,41,55,0.14), rgba(107,114,128,0.12), transparent 45%)",
        }}
      />
      <motion.div className="relative">
        <h4 className="text-base font-semibold text-black">{title}</h4>
        <div className="mt-3 text-sm leading-6 text-zinc-600">{children}</div>
      </motion.div>
    </BentoTile>
  );
};

function ProblemCard({
  title,
  text,
  icon,
  span = 2,
  delay = 0,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
  span?: TileSpan;
  delay?: number;
}) {
  return (
    <BentoTile span={span} delay={delay} className="group">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: ARKTURA_GRADIENT }}
      />
      <motion.div className="relative flex items-start gap-3">
        <motion.div className="mt-1 text-zinc-500 transition-colors group-hover:text-white">{icon}</motion.div>
        <motion.div>
          <h4 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-white">
            {title}
          </h4>
          <p className="mt-1 text-sm text-zinc-700 transition-colors group-hover:text-white/90">{text}</p>
        </motion.div>
      </motion.div>
    </BentoTile>
  );
}

const STACK = ["Shopify", "Figma", "Photoshop", "Illustrator"];

const AT_A_GLANCE = ["Shopify storefront", "4-month redesign", "Cross-team collaboration"];

const RESULTS_IMPACT: { text: string; span: TileSpan }[] = [
  { text: "~80% of sample orders moved from manual to automated checkout within the first 3 months.", span: 2 },
  { text: "Staff time saved: ~10 hours/week, allowing focus on higher-value tasks.", span: 2 },
  { text: "Checkout completion improved from ~60% → ~85%.", span: 2 },
  { text: "Order errors reduced by ~30% via automation.", span: 3 },
  { text: "Positive feedback from customers and internal teams on speed and clarity.", span: 3 },
];

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

const PROCESS_STEPS = [
  { stage: "Initial Wireframes", desc: "Created to demonstrate the value of a redesign and secure leadership approval." },
  { stage: "Photography & Assets", desc: "Secured budget to hire a photographer and edited hundreds of sample images in Photoshop and Illustrator." },
  { stage: "UI Design & Template", desc: "Customized a Shopify template to align with Arktura's brand and created a visual design system." },
  { stage: "Development & Launch", desc: "Collaborated with developers across teams to implement the checkout system and launch the redesigned store." },
];

const KEY_IMPROVEMENTS = [
  { t: "Intuitive Navigation", d: "Clear categories and grouping improved product discovery." },
  { t: "Product Photography", d: "High-quality images replaced diagrams, providing clarity and confidence." },
  { t: "Streamlined Checkout", d: "A cart + checkout flow automated the ordering process and reduced reliance on Sales." },
  { t: "Professional Branding", d: "A consistent design system aligned with Arktura's updated brand identity." },
];

function ImageTile({
  span = 6,
  delay = 0,
  src,
  alt,
  label,
  caption,
}: {
  span?: TileSpan;
  delay?: number;
  src: string;
  alt: string;
  label?: string;
  caption?: string;
}) {
  return (
    <BentoTile span={span} padded={false} interactive={false} delay={delay}>
      {label ? (
        <div className="px-6 pt-6 sm:px-8 sm:pt-8">
          <TileLabel>{label}</TileLabel>
        </div>
      ) : null}
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="block w-full h-auto object-contain"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>
        {caption ? <p className="mt-3 text-center text-xs text-zinc-500">{caption}</p> : null}
      </div>
    </BentoTile>
  );
}

export default function EcommerceCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <ProjectNav />
      <main className="bg-zinc-50 text-zinc-800 pt-16">
        <ProgressBar />

        {/* ── Hero ── */}
        <header className="relative isolate pt-6 sm:pt-10">
          <Container>
            <BentoGrid>
              <BentoTile span={6} padded={false} interactive={false} style={{ background: ARKTURA_HERO_BG }}>
                <div className="grid items-stretch gap-8 px-7 pt-10 sm:grid-cols-2 sm:px-12 sm:pt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-center pb-10 sm:pb-16"
                  >
                    <motion.div className="inline-flex items-center gap-2 self-start rounded-full bg-zinc-200/80 px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-900/10">
                      Arktura Case Study
                    </motion.div>
                    <h1
                      className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
                      style={{ color: ARKTURA_ACCENT }}
                    >
                      Arktura Samples Store
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
                      Led the redesign of the Samples Store, leveraging a Shopify template to create a
                      streamlined and user-friendly shopping journey.
                    </p>
                    <motion.div className="mt-8 flex flex-wrap items-center gap-4">
                      <a
                        href="https://samples.arktura.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.03]"
                        style={{ background: ARKTURA_GRADIENT }}
                      >
                        <IconExternalLink aria-hidden="true" size={18} stroke={1.8} />
                        View Live Project
                      </a>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative flex w-full flex-1 items-end justify-center"
                  >
                    <Image
                      src="/projects/ecommerce/images/hero.png"
                      alt="Arktura Samples Store hero"
                      width={1200}
                      height={800}
                      className="block w-full h-auto max-h-[420px] object-contain"
                      priority
                      style={{ objectPosition: "bottom" }}
                    />
                  </motion.div>
                </div>
              </BentoTile>

              <BentoTile span={2} delay={0.05}>
                <TileLabel>Role</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">UI/UX Designer</p>
              </BentoTile>
              <BentoTile span={2} delay={0.1}>
                <TileLabel>Timeline</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">4 months</p>
              </BentoTile>
              <BentoTile span={2} delay={0.15}>
                <TileLabel>Stack</TileLabel>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {STACK.map((tool) => (
                    <HeroMetaPill key={tool}>{tool}</HeroMetaPill>
                  ))}
                </div>
              </BentoTile>
            </BentoGrid>
          </Container>
        </header>

        {/* ── Executive Summary ── */}
        <Section id="executive-summary" eyebrow="Executive Summary" title="Problem · Solution · Outcome">
          <BentoGrid>
            {EXECUTIVE_SUMMARY_CARDS.map((card, i) => (
              <BentoTile key={card.title} span={2} delay={i * 0.08} className="group">
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at top left, rgba(148,163,184,0.24), transparent 34%), linear-gradient(135deg, rgba(237,240,244,0.9), rgba(255,255,255,0.96))",
                  }}
                />
                <motion.div className="relative flex h-full flex-col">
                  <motion.div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: ARKTURA_GRADIENT }}
                  >
                    {card.icon}
                  </motion.div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: ARKTURA_ACCENT }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight" style={{ color: ARKTURA_ACCENT }}>
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">{card.text}</p>
                </motion.div>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Results & Impact ── */}
        <Section id="impact" eyebrow="Results & Impact" title="Results & Impact">
          <BentoGrid>
            {RESULTS_IMPACT.map((item, i) => (
              <BentoTile key={item.text} span={item.span} delay={i * 0.06}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: ARKTURA_ACCENT }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium leading-snug text-zinc-900">{item.text}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Project Brief ── */}
        <Section id="brief" eyebrow="Project Brief" title="Context">
          <BentoGrid>
            <BentoTile span={4}>
              <TileLabel>Overview</TileLabel>
              <div className="mt-3 space-y-4 text-base leading-7 text-zinc-700">
                <p>
                  Arktura is a leading manufacturer of architectural products including ceiling systems, wall
                  panels, and lighting solutions. As part of their brand refresh, the company needed to
                  modernize its Samples Store to improve usability and reduce the workload on internal sales
                  teams.
                </p>
                <p>
                  The original store was little more than a static page of diagrams, with no product
                  photography, categorization, or ordering system. Ordering required manual coordination with
                  the sales team, creating unnecessary friction for architects, designers, and reps.
                </p>
                <p>
                  The redesign introduced product photography, structured navigation, and an automated checkout
                  process — transforming the store into a user-friendly, modern experience aligned with
                  Arktura&apos;s brand identity.
                </p>
              </div>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.08}>
              <TileLabel tone="brand">At a glance</TileLabel>
              <ul className="mt-3 space-y-2 text-sm font-medium text-zinc-800">
                {AT_A_GLANCE.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Problem Statement ── */}
        <Section
          id="problem"
          eyebrow="Problem Statement"
          title="What customers struggled with"
          kicker="The original store presented three key issues."
        >
          <BentoGrid>
            <ProblemCard
              title="Navigation Complexity"
              text="Products weren't categorized, making it difficult for reps and designers to locate specific samples."
              icon={<IconSearch size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Unclear Product Information"
              text="With only diagrams and no photography, customers lacked the detail needed to confidently evaluate materials."
              icon={<IconUsers size={22} stroke={1.5} />}
              delay={0.06}
            />
            <ProblemCard
              title="Inefficient Ordering"
              text="No cart or checkout infrastructure existed, requiring reps to call the Sales team to place orders manually."
              icon={<IconShoppingCart size={22} stroke={1.5} />}
              delay={0.12}
            />
          </BentoGrid>
        </Section>

        {/* ── Solution ── */}
        <Section id="solution" eyebrow="Solution" title="What the redesign provides">
          <BentoGrid>
            <BentoTile span={3}>
              <TileLabel>Approach</TileLabel>
              <p className="mt-3 text-base leading-7 text-zinc-700">
                The redesigned Samples Store leverages Shopify&apos;s capabilities while implementing a modern
                design system. By combining intuitive navigation, product photography, and automated ordering,
                the new site streamlined the process for users while reducing the sales team&apos;s workload.
              </p>
            </BentoTile>
            <BentoTile span={3} padded={false} interactive={false} delay={0.08}>
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/projects/ecommerce/images/old-store.png"
                    alt="Side-by-side comparison of old vs. new product page"
                    width={1200}
                    height={600}
                    className="block w-full h-auto object-contain"
                  />
                </div>
                <p className="mt-3 text-center text-xs text-zinc-500">The original store: static diagrams, no checkout.</p>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Key Improvements ── */}
        <Section id="features" eyebrow="Highlights" title="Key Improvements">
          <BentoGrid>
            {KEY_IMPROVEMENTS.map((f, i) => (
              <GlowCard key={f.t} title={f.t} span={3} delay={i * 0.06}>
                {f.d}
              </GlowCard>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Design Stages ── */}
        <Section
          id="stages"
          eyebrow="Design Stage"
          title="From wireframes to high fidelity"
          kicker="How the redesign evolved from early sketches to final screens."
        >
          <BentoGrid>
            <BentoTile span={6} interactive={false}>
              <TileLabel>Low-Fidelity Wireframes</TileLabel>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Early wireframes were created to persuade leadership to green-light the redesign by visualizing
                how a modern store could improve usability.
              </p>
            </BentoTile>
            <ImageTile span={6} delay={0.06} src="/projects/ecommerce/images/wireframes.png" alt="Wireframe image" />
            <BentoTile span={6} interactive={false} delay={0.12}>
              <TileLabel>Mid-Fidelity Mockups</TileLabel>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Once a Shopify template was selected, mid-fidelity mockups refined the structure, navigation,
                and flow.
              </p>
            </BentoTile>
            <ImageTile span={6} delay={0.18} src="/projects/ecommerce/images/midfi.png" alt="Mid-fi mockup" />
            <BentoTile span={6} interactive={false} delay={0.24}>
              <TileLabel>High-Fidelity Designs</TileLabel>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Final designs incorporated edited product photography, refined UI components, and the automated
                checkout system.
              </p>
            </BentoTile>
            <ImageTile
              span={3}
              delay={0.3}
              src="/projects/ecommerce/images/hifi.png"
              alt="Hi-fi design screen - Product pages"
              caption="Improved nav + search speed up material discovery."
            />
            <ImageTile
              span={3}
              delay={0.36}
              src="/projects/ecommerce/images/hifi-2.png"
              alt="Hi-fi design screen - Additional views"
              caption="Clear confirmation & status reduce follow-up emails."
            />
          </BentoGrid>
        </Section>

        {/* ── Process ── */}
        <Section id="process" eyebrow="Process" title="How it came together">
          <BentoGrid>
            {PROCESS_STEPS.map((item, i) => (
              <BentoTile key={item.stage} span={3} variant="tint" delay={i * 0.06}>
                <motion.div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: ARKTURA_GRADIENT }}
                >
                  {i + 1}
                </motion.div>
                <h4 className="text-lg font-semibold text-zinc-900">{item.stage}</h4>
                <p className="mt-2 text-sm text-zinc-700">{item.desc}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Accessibility ── */}
        <Section id="accessibility" eyebrow="Accessibility" title="Accessibility considerations">
          <BentoGrid>
            <BentoTile span={6} interactive={false}>
              <ul className="space-y-2 text-sm leading-6 text-zinc-700">
                {[
                  "Checkout forms built with labels, error messaging, and accessible inputs.",
                  "CTAs and nav links color-tested for contrast.",
                  "Product images paired with descriptive alt text for sample materials.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Outcome / CTA ── */}
        <Section id="outcome" eyebrow="Outcome" title="Interested in more work?">
          <BentoGrid className="pb-6">
            <BentoTile span={6} variant="brand" interactive={false}>
              <div className="max-w-3xl space-y-4 text-white/90">
                <p>
                  The redesigned Samples Store turned a manual, sales-driven process into a modern self-serve
                  experience — automating the majority of orders while giving architects and designers the
                  clarity they needed to evaluate materials with confidence.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://samples.arktura.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                  >
                    View Live Project →
                  </a>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                  >
                    Get in Touch →
                  </Link>
                </div>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        <OtherProjects currentProject="ecommerce" />
        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} Arktura Samples Store · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

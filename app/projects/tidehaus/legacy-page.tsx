"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import {
  IconShoppingCart,
  IconPalette,
  IconCode,
  IconExternalLink,
  IconWaveSine,
  IconChartBar,
} from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";
import OtherProjects from "@/components/sections/OtherProjects";

const TIDE_GRADIENT = "linear-gradient(223deg, #38BDF8 0%, #0B4A6E 100%)";
const TIDE_HERO_BG = "#07131D";
const TIDE_ACCENT = "#38BDF8";
/* Deeper gradient reserved for tiles with white body text. */
const TIDE_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(56,189,248,0.32), transparent 42%), linear-gradient(145deg, #0B4A6E 0%, #062A40 100%)";

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
          <motion.div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400 ring-1 ring-zinc-700">
            {eyebrow}
          </motion.div>
        ) : null}
        {title ? (
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        ) : null}
        {kicker ? <p className="mt-3 text-base text-zinc-400">{kicker}</p> : null}
      </motion.div>
      <div className="mt-6 sm:mt-8">{children}</div>
    </Container>
  </section>
);

/* Bento layout spec shared across every case study: a six-column grid where
   content lives in rounded tiles of varying span, collapsing to one column.
   Tidehaus runs the dark variant of the system to preserve its brand theme. */

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
  white: "bg-zinc-900 ring-1 ring-white/10",
  tint: "bg-[#0B2536]/80 ring-1 ring-[#38BDF8]/25",
  brand: "text-white ring-1 ring-[#38BDF8]/20",
  dark: "bg-black text-white ring-1 ring-white/10",
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
        interactive
          ? "transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5"
          : ""
      } ${className}`}
      style={variant === "brand" ? { background: TIDE_TILE_GRADIENT, ...style } : style}
    >
      {children}
    </motion.div>
  );
}

const TileLabel = ({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "brand" }) => (
  <p
    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
      tone === "brand" ? "text-[#38BDF8]/80" : "text-zinc-500"
    }`}
  >
    {children}
  </p>
);

const HeroMetaPill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-[#0B2536] px-3 py-1 text-xs font-medium text-[#38BDF8] ring-1 ring-[#38BDF8]/25"
  >
    {children}
  </motion.span>
);

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: TIDE_GRADIENT }}
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
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(56,189,248,0.14), rgba(11,74,110,0.14), transparent 45%)",
        }}
      />
      <motion.div className="relative">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <div className="mt-3 text-sm leading-6 text-zinc-400">{children}</div>
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
        style={{ background: TIDE_GRADIENT }}
      />
      <motion.div className="relative flex items-start gap-3">
        <motion.div className="mt-1 text-zinc-500 transition-colors group-hover:text-white">{icon}</motion.div>
        <motion.div>
          <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-white">{title}</h4>
          <p className="mt-1 text-sm text-zinc-400 transition-colors group-hover:text-white/90">{text}</p>
        </motion.div>
      </motion.div>
    </BentoTile>
  );
}

const STACK = ["Figma", "Illustrator", "Photoshop", "Cursor"];

const AT_A_GLANCE = ["Concept e-commerce build", "1-month timeline", "Solo designer-developer"];

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

export default function TidehausCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <ProjectNav />
      <main className="bg-zinc-950 text-zinc-100 pt-16">
        <ProgressBar />

        {/* ── Hero ── */}
        <header className="relative isolate pt-6 sm:pt-10">
          <Container>
            <BentoGrid>
              <BentoTile
                span={6}
                padded={false}
                interactive={false}
                className="ring-1 ring-white/10"
                style={{ background: TIDE_HERO_BG }}
              >
                <div className="grid items-stretch gap-8 px-7 pt-10 sm:grid-cols-2 sm:px-12 sm:pt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-center pb-10 sm:pb-16"
                  >
                    <motion.div className="inline-flex items-center gap-2 self-start rounded-full bg-[#0B2536] px-3 py-1 text-xs font-medium text-[#38BDF8] ring-1 ring-[#38BDF8]/25">
                      Tidehaus Case Study
                    </motion.div>
                    <h1
                      className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
                      style={{ color: TIDE_ACCENT }}
                    >
                      Tidehaus Online Surf Shop
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-300">
                      A premium surf gear and beachwear e-commerce platform designed as a concept project,
                      creating a high-end, mobile-first shopping experience.
                    </p>
                    <motion.div className="mt-8 flex flex-wrap items-center gap-4">
                      <a
                        href="https://online-surf-shop-a8b1mqoyh-fredys-projects-8feeb27c.vercel.app/#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-sm transition-transform hover:scale-[1.03]"
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
                    className="relative flex w-full flex-1 items-end justify-center pb-10 sm:pb-14"
                  >
                    <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
                      <Image
                        src="/projects/tidehaus/images/main-header.png"
                        alt="Tidehaus Online Surf Shop hero mockup showing homepage on laptop + mobile"
                        width={1200}
                        height={800}
                        className="block w-full h-auto max-h-[420px] object-contain"
                        priority
                      />
                    </div>
                  </motion.div>
                </div>
              </BentoTile>

              <BentoTile span={2} delay={0.05}>
                <TileLabel>Role</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-white">
                  UI/UX Designer &amp; Frontend Developer
                </p>
              </BentoTile>
              <BentoTile span={2} delay={0.1}>
                <TileLabel>Timeline</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-white">1 month</p>
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
                      "radial-gradient(circle at top left, rgba(56,189,248,0.16), transparent 34%), linear-gradient(135deg, rgba(11,37,54,0.9), rgba(24,24,27,0.96))",
                  }}
                />
                <motion.div className="relative flex h-full flex-col">
                  <motion.div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: TIDE_GRADIENT }}
                  >
                    {card.icon}
                  </motion.div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#38BDF8]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#38BDF8]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{card.text}</p>
                </motion.div>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Projected Impact ── */}
        <Section id="impact" eyebrow="Projected Impact" title="Projected Impact">
          <BentoGrid>
            {PROJECTED_IMPACT.map((item, i) => (
              <BentoTile key={item} span={3} delay={i * 0.06}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#38BDF8]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium leading-snug text-white">{item}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Project Brief ── */}
        <Section id="brief" eyebrow="Project Overview" title="Context">
          <BentoGrid>
            <BentoTile span={4}>
              <TileLabel>Overview</TileLabel>
              <div className="mt-3 space-y-4 text-base leading-7 text-zinc-300">
                <p>
                  Tidehaus is a premium surf gear and beachwear e-commerce platform designed as a concept
                  project. The goal was to create a high-end, mobile-first shopping experience while managing
                  complex product variants like surfboard dimensions, wetsuit sizing, and accessories.
                </p>
                <p>
                  This project focused on design implementation, showcasing how thoughtful design paired with
                  scalable technology can deliver a premium e-commerce experience. The dark theme provided a
                  sleek aesthetic while making product photography stand out.
                </p>
              </div>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.08}>
              <TileLabel tone="brand">At a glance</TileLabel>
              <ul className="mt-3 space-y-2 text-sm font-medium text-[#7DD3FC]">
                {AT_A_GLANCE.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Design Approach ── */}
        <Section id="approach" eyebrow="Design Approach" title="Design Direction">
          <BentoGrid>
            <BentoTile span={3}>
              <TileLabel>Direction</TileLabel>
              <div className="mt-3 space-y-4 text-base leading-7 text-zinc-300">
                <p>
                  The design direction was centered on surf culture while maintaining a modern e-commerce
                  standard. Key decisions included a dark theme for premium aesthetics, ocean-inspired color
                  palette with crisp whites and green accents, and the Outfit font family for modern
                  readability.
                </p>
                <p>
                  The layout system used a 4px spacing grid with card-based product layouts and reusable
                  components. Micro-interactions included smooth hover effects, typography scaling, and subtle
                  animations to enhance the user experience.
                </p>
              </div>
            </BentoTile>
            <BentoTile span={3} padded={false} interactive={false} delay={0.08}>
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
                  <Image
                    src="/projects/tidehaus/images/color-palette.png"
                    alt="Tidehaus color palette and typography board showing ocean-inspired colors and Outfit font family"
                    width={1200}
                    height={600}
                    className="block w-full h-auto object-contain"
                  />
                </div>
                <p className="mt-3 text-center text-xs text-zinc-500">Ocean-inspired palette and the Outfit type family.</p>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Key UI Decisions ── */}
        <Section id="ui-decisions" eyebrow="Key UI Decisions" title="Design Highlights">
          <BentoGrid>
            {UI_DECISIONS.map((f, i) => (
              <GlowCard key={f.t} title={f.t} span={3} delay={i * 0.06}>
                {f.d}
              </GlowCard>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Design Visuals ── */}
        <Section
          id="design-visuals"
          eyebrow="Design Stage"
          title="Key Design Elements"
          kicker="The interface showcases a modern e-commerce experience with intuitive navigation, product discovery, and seamless shopping interactions."
        >
          <BentoGrid>
            <BentoTile span={6} padded={false} interactive={false}>
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <video
                    className="w-full h-auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster="/projects/tidehaus/images/color-palette.png"
                  >
                    <source src="/projects/tidehaus/images/tidehaus-screen-record.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="mt-3 text-center text-xs text-zinc-500">
                  3-step checkout reduces cognitive load and form fatigue.
                </p>
              </div>
            </BentoTile>
            <BentoTile span={3} padded={false} interactive={false} delay={0.08}>
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <Image
                    src="/projects/tidehaus/images/product-cards.png"
                    alt="Product card mockups with hover states showing surf gear"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <h4 className="mt-4 font-medium text-white">Product Catalog</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Clean product grid showcasing surf gear with clear pricing, categories, and visual hierarchy
                  for easy browsing.
                </p>
                <p className="mt-2 text-xs text-zinc-500">Sticky cart summary keeps cost/CTA visible.</p>
              </div>
            </BentoTile>
            <BentoTile span={3} padded={false} interactive={false} delay={0.16}>
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <Image
                    src="/projects/tidehaus/images/product-detail-modal.png"
                    alt="Product detail modal with size/color selection for surfboard bag"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <h4 className="mt-4 font-medium text-white">Product Detail Modal</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Detailed product view with specifications, features, stock availability, and clear
                  call-to-action for purchase.
                </p>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Tools & Implementation ── */}
        <Section id="tools" eyebrow="Tools Used" title="Design & Development Stack">
          <BentoGrid>
            <BentoTile span={3} variant="tint">
              <TileLabel tone="brand">Design Tools</TileLabel>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-300">
                {DESIGN_TOOLS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={3} variant="tint" delay={0.08}>
              <TileLabel tone="brand">Development Stack</TileLabel>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-300">
                {DEV_STACK.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={6} delay={0.16} interactive={false}>
              <TileLabel>Technical Approach</TileLabel>
              <div className="mt-3 space-y-4 text-base leading-7 text-zinc-300">
                <p>
                  The build was grounded in a component-driven approach with a modern frontend + backend stack.
                  The frontend used Next.js 13+ with TypeScript, Tailwind CSS for styling, and Framer Motion for
                  animations.
                </p>
                <p>
                  The backend utilized Prisma with PostgreSQL for database management, Cloudinary for scalable
                  image hosting, and NextAuth.js for authentication. The entire application was deployed on
                  Vercel for optimal performance.
                </p>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Challenges & Solutions ── */}
        <Section id="challenges" eyebrow="Challenges & Solutions" title="Key Technical Challenges">
          <BentoGrid>
            <ProblemCard
              title="Product Variants"
              text="Created a flexible schema and UI to handle surfboard dimensions, wetsuit sizes, and accessories."
              icon={<IconShoppingCart size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Image Hosting"
              text="Learned Cloudinary integration to store and optimize product media efficiently."
              icon={<IconPalette size={22} stroke={1.5} />}
              delay={0.06}
            />
            <ProblemCard
              title="Admin Dashboard"
              text="Built intuitive CRUD forms with validation and preview to simplify product management."
              icon={<IconCode size={22} stroke={1.5} />}
              delay={0.12}
            />
          </BentoGrid>
        </Section>

        {/* ── Results & Takeaways ── */}
        <Section id="results" eyebrow="Results & Takeaways" title="Project Outcomes">
          <BentoGrid>
            {RESULTS.map((item, i) => (
              <BentoTile key={item.title} span={2} delay={i * 0.08}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#38BDF8]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-3 text-lg font-semibold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Final Showcase ── */}
        <Section
          id="showcase"
          eyebrow="Final Showcase"
          title="Desktop & Mobile Views"
          kicker="The Tidehaus experience is optimized for both desktop and mobile users, ensuring a seamless shopping experience across all devices."
        >
          <BentoGrid>
            <BentoTile span={6} padded={false} interactive={false}>
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <Image
                    src="/projects/tidehaus/images/desktop-mobile-views.png"
                    alt="Side-by-side desktop and mobile views showing Tidehaus responsive design"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Accessibility ── */}
        <Section id="accessibility" eyebrow="Accessibility" title="Accessibility considerations">
          <BentoGrid className="pb-6">
            <BentoTile span={6} interactive={false}>
              <ul className="space-y-2 text-sm leading-6 text-zinc-300">
                {[
                  "Alt text for all product images and hover states for variant selection.",
                  "Keyboard navigable checkout flow with clear focus outlines.",
                  "Price and CTA buttons checked against WCAG AA contrast standards.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        <OtherProjects currentProject="tidehaus" theme="dark" />
        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} Tidehaus Online Surf Shop · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

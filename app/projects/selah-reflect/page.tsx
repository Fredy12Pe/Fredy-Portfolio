"use client";

import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from "react";
import { Compare } from "@/components/ui/compare";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { IconBook, IconPencil, IconSparkles } from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";
import OtherProjects from "@/components/sections/OtherProjects";
import heroImg from "./images/headerImg.png";
import imgDevotionalHub from "./images/DevotionalHub.png";
import imgHymn from "./images/Hymn.png";
import imgReflect from "./images/Reflect.png";
import imgScriptureOverview from "./images/scriptureOverview.png";
import compImgBefore from "./images/comparison/Group 2.png";
import compImgAfter from "./images/comparison/Group 3.png";
const compVideoUrl = "/videos/selahRecord.mp4";

const SELAH_GRADIENT = "linear-gradient(223deg, #6d4aff 0%, #2b2266 100%)";
const SELAH_ACCENT = "#6d4aff";
/* Darker gradient reserved for tiles with white body text. */
const SELAH_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(167,139,250,0.32), transparent 42%), linear-gradient(145deg, #4c33c4 0%, #221a52 100%)";

const Container = ({ children }: { children: ReactNode }) => (
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
  eyebrow?: ReactNode;
  title?: ReactNode;
  kicker?: ReactNode;
  children?: ReactNode;
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
  tint: "bg-[#EFEBFF]/80 ring-1 ring-[#D6CBFF]",
  brand: "text-white ring-1 ring-[#6d4aff]/20",
  dark: "bg-zinc-950 text-white ring-1 ring-white/10",
};

const BentoGrid = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
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
  children: ReactNode;
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
      style={variant === "brand" ? { background: SELAH_TILE_GRADIENT, ...style } : style}
    >
      {children}
    </motion.div>
  );
}

const TileLabel = ({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "brand" }) => (
  <p
    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
      tone === "brand" ? "text-[#6d4aff]/70" : "text-zinc-500"
    }`}
  >
    {children}
  </p>
);

const HeroMetaPill = ({ children }: { children: ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-[#EFEBFF] px-3 py-1 text-xs font-medium text-[#6d4aff] ring-1 ring-[#6d4aff]/20"
  >
    {children}
  </motion.span>
);

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: SELAH_GRADIENT }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left"
    />
  );
}

function useMouseGradient() {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
  span = 2,
  delay = 0,
  children,
}: {
  title: string;
  span?: TileSpan;
  delay?: number;
  children: ReactNode;
}) => {
  const { onMouseMove } = useMouseGradient();
  return (
    <BentoTile span={span} delay={delay} onMouseMove={onMouseMove} className="group">
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(109,74,255,0.14), rgba(167,139,250,0.12), transparent 45%)",
        }}
      />
      <motion.div className="relative">
        <h4 className="text-base font-semibold text-black">{title}</h4>
        <div className="mt-3 text-sm leading-6 text-zinc-600">{children}</div>
      </motion.div>
    </BentoTile>
  );
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

function FluidCardStack() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-4 lg:h-[26rem] lg:flex-row"
    >
      {DEV_JOURNEY_CARDS.map((card, index) => {
        const isActive = activeCard === index;

        return (
          <motion.button
            key={card.title}
            type="button"
            onMouseEnter={() => setActiveCard(index)}
            onFocus={() => setActiveCard(index)}
            animate={{ flexGrow: isActive ? 2.3 : 0.85 }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className={`group relative min-h-64 basis-0 overflow-hidden rounded-3xl p-6 text-left outline-none transition-colors duration-300 lg:min-h-0 ${
              isActive ? "bg-[#6d4aff] text-white" : "bg-zinc-950 text-white/75 hover:text-white"
            }`}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(167,139,250,0.28), transparent 36%), linear-gradient(145deg, rgba(109,74,255,0.92), rgba(19,12,52,0.98))",
              }}
            />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${
                    isActive ? "bg-white text-[#6d4aff]" : "bg-[#EFEBFF] text-[#6d4aff]"
                  }`}
                >
                  {card.meta}
                </span>
              </div>
              <div className="mt-12">
                <h4 className="text-2xl font-semibold tracking-tight text-white">{card.title}</h4>
                <p
                  className={`mt-4 max-w-md text-sm leading-6 transition-opacity duration-300 ${
                    isActive ? "text-white/85 opacity-100" : "text-white/55 opacity-70 lg:opacity-0"
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// Solution screen carousel ----------------------------------------------------

type Slide = {
  image: StaticImageData;
  alt: string;
  title: string;
  description: string;
};

const slides: Slide[] = [
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

function SolutionShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  return (
    <motion.div aria-label="Selah app walkthrough" className="w-full">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-start lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex w-[min(72vw,20rem)] items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
                <Image src={slide.image} alt={slide.alt} className="block w-full h-auto object-cover" />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl bg-zinc-50/80 px-8 py-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Current View</p>
          <h5 className="mt-2 text-xl font-semibold text-zinc-900">{slide.title}</h5>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{slide.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeSlide === index
                    ? "bg-[#EFEBFF] text-[#6d4aff]"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}

export default function SelahCaseStudyPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <ProjectNav />
      <main className="bg-zinc-50 text-zinc-800 pt-16">
        <ProgressBar />

        {/* ── Hero ── */}
        <header className="relative isolate pt-6 sm:pt-10">
          <Container>
            <BentoGrid>
              <BentoTile span={6} padded={false} interactive={false} variant="dark">
                <div className="grid items-stretch gap-8 px-7 pt-10 sm:grid-cols-2 sm:px-12 sm:pt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-center pb-10 sm:pb-16"
                  >
                    <motion.div className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">
                      Selah Case Study
                    </motion.div>
                    <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                      A focused daily devotional
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-300">
                      Mobile-first reading, quick journaling, and simple reflection tools in one place.
                    </p>
                    <motion.div className="mt-8 flex flex-wrap items-center gap-4">
                      <a
                        href="https://www.selahdevotion.com"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-sm hover:bg-zinc-100"
                      >
                        Visit selahdevotion.com
                      </a>
                      <a
                        href="https://github.com/Fredy12Pe/selah-reflect-vercel"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/5"
                      >
                        View on GitHub
                      </a>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative flex w-full flex-1 items-end justify-center pb-10 sm:pb-14"
                  >
                    <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
                      <Image
                        src={heroImg}
                        alt="Selah hero image"
                        className="block w-full h-auto max-h-[420px] object-contain"
                        priority
                      />
                    </div>
                  </motion.div>
                </div>
              </BentoTile>

              <BentoTile span={2} delay={0.05}>
                <TileLabel>Role</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">Full-stack + UI/UX</p>
              </BentoTile>
              <BentoTile span={2} delay={0.1}>
                <TileLabel>Timeline</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">
                  2.5 weeks · Hosted on Vercel
                </p>
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
                      "radial-gradient(circle at top left, rgba(167,139,250,0.22), transparent 34%), linear-gradient(135deg, rgba(239,235,255,0.9), rgba(255,255,255,0.96))",
                  }}
                />
                <motion.div className="relative flex h-full flex-col">
                  <motion.div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: SELAH_GRADIENT }}
                  >
                    {card.icon}
                  </motion.div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d4aff]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#6d4aff]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">{card.text}</p>
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
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d4aff]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium leading-snug text-zinc-900">{item}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Problem ── */}
        <Section
          id="problem"
          eyebrow="Problem"
          title="Where it began: static PDFs, static hearts"
          kicker="The challenge that sparked Selah."
        >
          <BentoGrid>
            <BentoTile span={4}>
              <TileLabel>The friction</TileLabel>
              <div className="mt-3 space-y-3 text-base leading-7 text-zinc-700">
                <p>
                  At my church, devotions lived inside a <strong>Dropbox PDF</strong>. To engage, members
                  juggled tablets, journals, and pinch-zoomed screens. Reflection was possible, but hardly
                  inviting.
                </p>
                <ul className="space-y-2 text-sm leading-6 text-zinc-600">
                  {[
                    "Awkward annotations on clunky PDFs",
                    "No easy way to add notes or search past reflections",
                    "Access limited to one rigid format",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6d4aff]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>Selah was born to break that friction.</p>
              </div>
            </BentoTile>
            <BentoTile span={2} padded={false} interactive={false} delay={0.08}>
              <div className="p-4 sm:p-5">
                <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
                  <Image src={compImgBefore} alt="Original PDF page" className="w-full h-auto" />
                </div>
                <p className="mt-3 text-center text-xs text-zinc-500">The original Dropbox PDF.</p>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Solution ── */}
        <Section
          id="solution"
          eyebrow="Solution"
          title="A living, breathing devotional"
          kicker="By parsing the church's PDF into structured JSON, Selah unlocked devotionals into a new medium: clean, mobile-first, and ready anywhere. With journaling and AI reflections built-in, members can go beyond reading — they can converse with Scripture."
        >
          <BentoGrid>
            <BentoTile span={6} padded={false} interactive={false}>
              <div className="px-6 pt-6 sm:px-8 sm:pt-8">
                <TileLabel>App walkthrough</TileLabel>
              </div>
              <div className="p-6 sm:p-8">
                <SolutionShowcase />
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Features ── */}
        <Section id="features" eyebrow="Highlights" title="Experiences that matter">
          <BentoGrid>
            {FEATURES.map((f, i) => (
              <GlowCard key={f.t} title={f.t} span={2} delay={i * 0.05}>
                {f.d}
              </GlowCard>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Dev Journey ── */}
        <Section
          id="dev"
          eyebrow="Dev Journey"
          title="Learning by building"
          kicker="From minimal code knowledge to full-stack delivery."
        >
          <FluidCardStack />
        </Section>

        {/* ── Process ── */}
        <Section id="process" eyebrow="Process" title="Crafting Selah" kicker="From sketches to sanctuary.">
          <BentoGrid>
            {PROCESS_STEPS.map((item, i) => (
              <BentoTile key={item.stage} span={2} variant="tint" delay={i * 0.06}>
                <motion.div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: SELAH_GRADIENT }}
                >
                  {i + 1}
                </motion.div>
                <h4 className="text-lg font-semibold text-[#6d4aff]">{item.stage}</h4>
                <p className="mt-2 text-sm text-zinc-700">{item.desc}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Comparison ── */}
        <Section id="comparison" eyebrow="Comparison" title="Before and After" kicker="Drag or hover to compare.">
          <BentoGrid>
            <BentoTile span={6} interactive={false}>
              <div className="flex justify-center">
                <div
                  style={{
                    aspectRatio: compImgBefore.width / compImgBefore.height,
                    width: "min(100%, 520px)",
                  }}
                >
                  <Compare
                    className="w-full h-full"
                    firstImage={compImgBefore.src}
                    secondImage={compImgAfter.src}
                    slideMode="drag"
                    showHandlebar
                    autoplay={false}
                  />
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-zinc-500">
                Optional AI assistant provides context without overwhelming the UI.
              </p>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Outcome ── */}
        <Section
          id="outcome"
          eyebrow="Outcome"
          title="Impact in practice"
          kicker="A devotional that meets people where they are."
        >
          <BentoGrid>
            <BentoTile span={4} variant="brand" interactive={false}>
              <div className="space-y-4 text-white/90">
                <p className="leading-7">
                  Selah turns daily devotion into a clear, repeatable routine. People can read the day&apos;s
                  text, capture a quick thought, and return later to pick up where they left off — without
                  jumping between apps. Notes are saved in context, so past reflections are easy to review and
                  compare over time.
                </p>
                <p className="leading-7">
                  When questions come up, built-in AI offers summaries or prompts to consider, keeping the focus
                  on the passage rather than the tooling. The result is a lightweight flow that helps users stay
                  consistent and engaged, whether they have two minutes or twenty.
                </p>
              </div>
            </BentoTile>
            <BentoTile span={2} interactive={false} delay={0.08} className="items-center justify-center">
              <div className="relative w-48 md:w-52 aspect-[9/19.5] rounded-[2rem] bg-black p-2 shadow-xl ring-1 ring-zinc-300/30">
                <div className="absolute left-1/2 top-2 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-black" />
                <div className="h-full w-full overflow-hidden rounded-[1.6rem] bg-black">
                  <video
                    className="h-full w-full object-cover"
                    loop
                    muted
                    playsInline
                    controls={false}
                    preload="metadata"
                    src={compVideoUrl}
                    ref={videoRef}
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
              <ul className="space-y-2 text-sm leading-6 text-zinc-700">
                {[
                  "Minimum 16px base font and generous line spacing for devotional reading.",
                  "Semantic headings and clear focus order for assistive tech.",
                  "Calming color palette with AA contrast for scripture text.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6d4aff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        <OtherProjects currentProject="selah" />
        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} Selah · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

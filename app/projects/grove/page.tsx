"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  IconBrandApple,
  IconPlant,
  IconFlame,
  IconChartBar,
} from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";
import OtherProjects from "@/components/sections/OtherProjects";

const GroveHeroRive = dynamic(() => import("./GroveHeroRive"), { ssr: false });

const GROVE_PALETTE = {
  light: "#E5F7B3",
  muted: "#BEDA76",
  lime: "#C7EF13",
  bright: "#95E100",
  green: "#11B30B",
};

const GROVE_GRADIENT = `linear-gradient(223deg, ${GROVE_PALETTE.green} 0%, ${GROVE_PALETTE.bright} 52%, ${GROVE_PALETTE.lime} 100%)`;
const GROVE_HERO_BG = "#F0FBDB";
/* Darker gradient reserved for tiles with white body text — the full brand
   gradient ends in lime, which is too bright for readable white copy. */
const GROVE_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(199,239,19,0.32), transparent 42%), linear-gradient(145deg, #11B30B 0%, #0B8F07 100%)";

type ProjectBriefMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  description: string;
};

const PROJECT_BRIEF_MEDIA = [
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Main_screen.MP4",
    alt: "Grove welcome screen",
    title: "Welcome Screen",
    description: "Brand-forward entry screen with sign-in options and the main character.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Onboarding_screen.MP4",
    alt: "Grove onboarding walkthrough video",
    title: "Onboarding Flow",
    description: "First-time user experience introducing Grove's calming habit journey.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Habit_completion.MP4",
    alt: "Grove habit completion walkthrough video",
    title: "Habit Completion",
    description: "Completing a habit and seeing immediate feedback tied to garden growth.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Game_world_overview.MP4",
    alt: "Grove game world overview video",
    title: "Game World Overview",
    description: "A quick look at how user habits evolve the larger Grove environment.",
  },
  {
    type: "image",
    src: "/projects/grove/project-brief/images/Progress.PNG",
    alt: "Grove progress screen",
    title: "Progress Dashboard",
    description: "Monthly completion view showing streaks and consistency across habits.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Breathing_screen.MP4",
    alt: "Grove breathing screen walkthrough video",
    title: "Breathing Experience",
    description: "Mindful breathing flow designed to support calm and daily recovery.",
  },
  {
    type: "image",
    src: "/projects/grove/project-brief/images/Widgets.PNG",
    alt: "Grove home screen widgets",
    title: "Home Screen Widgets",
    description: "iOS widget surfaces that keep progress visible outside the app.",
  },
] satisfies ProjectBriefMedia[];

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
  tint: "bg-[#E5F7B3]/70 ring-1 ring-[#BEDA76]",
  brand: "text-white ring-1 ring-[#11B30B]/20",
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
      style={variant === "brand" ? { background: GROVE_TILE_GRADIENT, ...style } : style}
    >
      {children}
    </motion.div>
  );
}

const TileLabel = ({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "brand" }) => (
  <p
    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
      tone === "brand" ? "text-[#11B30B]/70" : "text-zinc-500"
    }`}
  >
    {children}
  </p>
);

const HeroMetaPill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-[#E5F7B3]/70 px-3 py-1 text-xs font-medium text-[#11B30B] ring-1 ring-[#11B30B]/20"
  >
    {children}
  </motion.span>
);

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: GROVE_GRADIENT }}
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
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(17,179,11,0.14), rgba(149,225,0,0.12), transparent 45%)",
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
        style={{ background: GROVE_GRADIENT }}
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

function ProjectBriefPhoneScreen({ media, activeMedia }: { media: ProjectBriefMedia; activeMedia: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2.85rem] bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={media.src}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {media.type === "image" ? (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              priority={activeMedia === 0}
              sizes="(max-width: 768px) 72vw, 352px"
              className="object-cover"
            />
          ) : (
            <video
              aria-label={media.alt}
              autoPlay
              controls={false}
              disablePictureInPicture
              loop
              muted
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
              controlsList="nodownload nofullscreen noremoteplayback"
            >
              <source src={media.src} type="video/mp4" />
            </video>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FramerPhoneMockup() {
  const [activeMedia, setActiveMedia] = useState(0);
  const media = PROJECT_BRIEF_MEDIA[activeMedia];

  return (
    <motion.div aria-label="iPhone mockup for Grove app walkthrough" className="w-full">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:justify-start lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-[min(72vw,22rem)] max-w-[442px] overflow-visible"
          style={{ aspectRatio: "442 / 914" }}
        >
          <div className="absolute left-[-0.7%] top-[16.6%] h-[4.6%] w-[7.2%] rounded-l-xl bg-black" />
          <div className="absolute left-[-0.7%] top-[24.3%] h-[7%] w-[7.2%] rounded-l-xl bg-black" />
          <div className="absolute left-[-0.7%] top-[33%] h-[7%] w-[7.2%] rounded-l-xl bg-black" />
          <div className="absolute right-[-0.7%] top-[28.9%] h-[10.9%] w-[7.2%] rounded-r-xl bg-black" />
          <div className="absolute inset-0 rounded-[3.9rem] bg-black p-[0.25%] shadow-2xl shadow-zinc-900/20">
            <div className="h-full w-full rounded-[3.8rem] bg-zinc-400 p-[0.25%]">
              <div className="h-full w-full rounded-[3.7rem] bg-zinc-800 p-[2%]">
                <div className="relative h-full w-full overflow-hidden rounded-[3.25rem] bg-black p-[2.5%]">
                  <div className="absolute left-1/2 top-[3%] z-10 h-[4%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
                  <ProjectBriefPhoneScreen media={media} activeMedia={activeMedia} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl bg-zinc-50/80 px-8 py-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Current View</p>
          <h5 className="mt-2 text-xl font-semibold text-zinc-900">{media.title}</h5>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{media.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {PROJECT_BRIEF_MEDIA.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setActiveMedia(index)}
                className={`rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeMedia === index
                    ? "bg-[#E5F7B3] text-[#11B30B]"
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

const GROWTH_STAGES = [
  { stage: "Complete Habit", desc: "User logs a daily habit — the action triggers the growth loop." },
  { stage: "Plant Grows", desc: "The associated plant visually grows to reflect the completed habit." },
  { stage: "Garden Evolves", desc: "Consistent completions evolve the full garden environment." },
  { stage: "Daily Consistency", desc: "Maintaining the loop keeps the garden alive and thriving." },
];

const STACK = ["React Native", "Expo", "TypeScript", "Rive", "Skia", "Figma"];

const AT_A_GLANCE = ["7 core screens", "iOS & Android", "Solo designer-developer"];

const REAL_IMPACT = [
  "Designed for short daily engagement loops",
  "Encourages consistency through visual progression",
  "Creates emotional connection through environmental feedback",
  "Built as a scalable consumer-facing mobile app",
];

const EXECUTIVE_SUMMARY_CARDS = [
  {
    title: "Problem",
    text: "Most habit trackers feel repetitive and disconnected from emotional progress.",
    icon: <IconFlame size={24} stroke={1.5} />,
  },
  {
    title: "Solution",
    text: "Grove transforms habit tracking into a calming visual experience where habits directly impact a living garden.",
    icon: <IconPlant size={24} stroke={1.5} />,
  },
  {
    title: "Outcome",
    text: "A mobile-first product designed to encourage consistency through daily visual growth and rewarding interactions.",
    icon: <IconChartBar size={24} stroke={1.5} />,
  },
];

const DEV_JOURNEY_CARDS = [
  {
    title: "React Native Build",
    description: "Built the app foundation with React Native, Expo, and TypeScript for a mobile-first workflow.",
    meta: "01",
  },
  {
    title: "Scalable UI Systems",
    description: "Designed reusable screens and component patterns in Figma to keep the product consistent.",
    meta: "02",
  },
  {
    title: "Animation Pipeline",
    description: "Explored Rive and Skia to create lightweight interactions that support the garden experience.",
    meta: "03",
  },
  {
    title: "AI-Assisted Iteration",
    description: "Used Cursor AI to rapidly prototype ideas, refine components, and test product directions.",
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
              isActive ? "bg-[#11B30B] text-white" : "bg-zinc-950 text-white/75 hover:text-white"
            }`}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(199,239,19,0.28), transparent 36%), linear-gradient(145deg, rgba(17,179,11,0.92), rgba(8,28,8,0.98))",
              }}
            />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${
                    isActive ? "bg-white text-[#11B30B]" : "bg-[#E5F7B3] text-[#11B30B]"
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

export default function GroveCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <ProjectNav />
      <main className="bg-zinc-50 text-zinc-800 pt-16">
        <ProgressBar />

        {/* ── Hero ── */}
        <header className="relative isolate pt-6 sm:pt-10">
          <Container>
            <BentoGrid>
              <BentoTile
                span={6}
                padded={false}
                interactive={false}
                style={{ background: GROVE_HERO_BG }}
              >
                <div className="grid items-stretch gap-8 px-7 pt-10 sm:grid-cols-2 sm:px-12 sm:pt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-center pb-10 sm:pb-16"
                  >
                    <motion.div className="inline-flex items-center gap-2 self-start rounded-full bg-[#E5F7B3]/70 px-3 py-1 text-xs font-medium text-[#11B30B] ring-1 ring-[#11B30B]/20">
                      Grove Case Study
                    </motion.div>
                    <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#11B30B] sm:text-6xl md:text-7xl">
                      Your habits grow your world.
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#11B30B]/80">
                      A gamified habit tracking app where daily consistency grows a living garden.
                    </p>
                    <motion.div className="mt-8 flex flex-wrap items-center gap-4">
                      <span
                        aria-disabled="true"
                        className="inline-flex items-center gap-2 rounded-full bg-[#11B30B] px-5 py-3 text-sm font-medium text-white shadow-sm"
                      >
                        <IconBrandApple aria-hidden="true" size={18} stroke={1.8} />
                        Coming soon to App Store
                      </span>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative flex w-full flex-1 items-end justify-start"
                  >
                    <GroveHeroRive />
                  </motion.div>
                </div>
              </BentoTile>

              <BentoTile span={2} delay={0.05}>
                <TileLabel>Role</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">
                  UI/UX Designer &amp; Developer
                </p>
              </BentoTile>
              <BentoTile span={2} delay={0.1}>
                <TileLabel>Platform</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">iOS &amp; Android</p>
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
                      "radial-gradient(circle at top left, rgba(199,239,19,0.26), transparent 34%), linear-gradient(135deg, rgba(229,247,179,0.88), rgba(255,255,255,0.96))",
                  }}
                />
                <motion.div className="relative flex h-full flex-col">
                  <motion.div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: GROVE_GRADIENT }}
                  >
                    {card.icon}
                  </motion.div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#11B30B]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#11B30B]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">{card.text}</p>
                </motion.div>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Project Brief ── */}
        <Section id="brief" eyebrow="Project Brief" title="Context">
          <BentoGrid>
            <BentoTile span={4}>
              <TileLabel>Overview</TileLabel>
              <p className="mt-3 text-base leading-7 text-zinc-700">
                Grove reimagines habit tracking through environmental storytelling and interactive progression
                systems. Instead of focusing on charts and productivity metrics, the app creates a peaceful
                experience where users maintain and grow a virtual garden through daily habits.
              </p>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.08}>
              <TileLabel tone="brand">At a glance</TileLabel>
              <ul className="mt-3 space-y-2 text-sm font-medium text-[#11B30B]">
                {AT_A_GLANCE.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#11B30B]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={6} padded={false} interactive={false} delay={0.12}>
              <div className="px-6 pt-6 sm:px-8 sm:pt-8">
                <TileLabel>App walkthrough</TileLabel>
              </div>
              <div className="p-6 sm:p-8">
                <FramerPhoneMockup />
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Problem Statement ── */}
        <Section
          id="problem"
          eyebrow="Problem Statement"
          title="Why habit apps lose people"
          kicker="Three friction points Grove addresses."
        >
          <BentoGrid>
            <ProblemCard
              title="Lack of Emotional Engagement"
              text="Traditional habit trackers often feel transactional and repetitive."
              icon={<IconFlame size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Progress Feels Invisible"
              text="Users struggle to feel rewarded by long-term consistency."
              icon={<IconChartBar size={22} stroke={1.5} />}
              delay={0.06}
            />
            <ProblemCard
              title="Productivity Burnout"
              text="Many self-improvement apps prioritize pressure over encouragement."
              icon={<IconPlant size={22} stroke={1.5} />}
              delay={0.12}
            />
          </BentoGrid>
        </Section>

        {/* ── Gamification System ── */}
        <Section
          id="gamification"
          eyebrow="Gamification System Design"
          title="The core loop"
          kicker="Habit data maps directly to a living visual environment."
        >
          <BentoGrid>
            {GROWTH_STAGES.map((item, i) => (
              <BentoTile key={item.stage} span={3} variant="tint" delay={i * 0.06}>
                <motion.div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: GROVE_GRADIENT }}
                >
                  {i + 1}
                </motion.div>
                <h4 className="text-lg font-semibold text-[#11B30B]">{item.stage}</h4>
                <p className="mt-2 text-sm text-[#11B30B]/80">{item.desc}</p>
              </BentoTile>
            ))}
            <BentoTile span={6} interactive={false} delay={0.24}>
              <p className="text-sm leading-6 text-zinc-600">
                The core loop focuses on visually maintaining a peaceful, living environment rather than
                maximizing productivity metrics.
              </p>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Real Impact ── */}
        <Section id="impact" eyebrow="Real Impact" title="Real Impact">
          <BentoGrid>
            {REAL_IMPACT.map((item, i) => (
              <BentoTile key={item} span={3} delay={i * 0.06}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#11B30B]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium leading-snug text-zinc-900">{item}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Design System ── */}
        <Section id="design-system" eyebrow="Design System" title="Design System">
          <BentoGrid>
            <GlowCard title="Principles">
              <motion.div className="flex flex-wrap gap-2">
                {["Calm", "Minimal", "Nature-inspired", "Reward-driven"].map((principle) => (
                  <span
                    key={principle}
                    className="rounded-full bg-[#E5F7B3]/70 px-3 py-1 text-sm font-medium text-[#11B30B] ring-1 ring-[#BEDA76]"
                  >
                    {principle}
                  </span>
                ))}
              </motion.div>
            </GlowCard>
            <GlowCard title="Focus Areas" delay={0.08}>
              <ul className="space-y-2">
                {[
                  "Lightweight interactions",
                  "Clear visual feedback",
                  "Cozy illustration language",
                  "Mobile-first usability",
                ].map((area) => (
                  <li key={area} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#11B30B]" />
                    {area}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </BentoGrid>
        </Section>

        {/* ── Dev Journey ── */}
        <Section
          id="dev"
          eyebrow="Dev Journey"
          title="Design to device"
          kicker="Building Grove as a solo designer-developer."
        >
          <FluidCardStack />
        </Section>

        {/* ── Challenges & Solutions ── */}
        <Section id="challenges" eyebrow="Challenges & Solutions" title="What we solved along the way">
          <BentoGrid>
            <ProblemCard
              title="Balancing Gamification"
              text="Focused on peaceful progression instead of competitive mechanics."
              icon={<IconPlant size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Maintaining Simplicity"
              text="Reduced unnecessary UI complexity to keep interactions lightweight and approachable."
              icon={<IconChartBar size={22} stroke={1.5} />}
              delay={0.06}
            />
            <ProblemCard
              title="Animation & Performance"
              text="Explored optimized animation workflows for smooth mobile performance."
              icon={<IconFlame size={22} stroke={1.5} />}
              delay={0.12}
            />
          </BentoGrid>
        </Section>

        {/* ── Comparison ── */}
        <Section id="comparison" eyebrow="Comparison" title="Grove vs. traditional habit apps">
          <BentoGrid>
            <BentoTile span={3}>
              <h4 className="mb-4 text-base font-semibold text-zinc-900">Traditional Habit Apps</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                {[
                  "Static checklists",
                  "Data-heavy interfaces",
                  "Productivity-focused experiences",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={3} variant="brand" delay={0.08}>
              <h4 className="mb-4 text-base font-semibold text-white">Grove</h4>
              <ul className="space-y-2 text-sm text-white/90">
                {[
                  "Living visual progression",
                  "Environmental feedback",
                  "Calm, game-inspired interactions",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Outcome ── */}
        <Section id="outcome" eyebrow="Outcome" title="Impact in practice">
          <BentoGrid className="pb-6">
            <BentoTile span={6} variant="brand" interactive={false}>
              <div className="max-w-3xl space-y-4 text-white/90">
                <p>
                  Grove evolved into a polished mobile habit tracking experience that blends gamification,
                  calming visuals, and lightweight interactions into a more emotionally engaging daily routine
                  system.
                </p>
                <p>
                  The project also became an exploration into combining product design, illustration systems,
                  animation, and front-end development into a unified consumer app experience.
                </p>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>
        <OtherProjects currentProject="grove" />
        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} Grove · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

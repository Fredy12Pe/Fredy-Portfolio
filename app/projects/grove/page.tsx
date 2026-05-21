"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
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
  bg = "bg-white",
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  kicker?: React.ReactNode;
  children?: React.ReactNode;
  bg?: string;
}) => (
  <section id={id} className={`relative py-20 sm:py-28 ${bg}`}>
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
      <div className="mt-10">{children}</div>
    </Container>
  </section>
);

function HorizontalScroller({
  children,
  top = 96,
  overflow = "hidden",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  top?: number;
  overflow?: React.CSSProperties["overflow"];
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sizerRef = useRef<HTMLDivElement | null>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    const sizerEl = sizerRef.current;
    if (!scrollEl || !sizerEl) return;

    const updateScrollMetrics = () => {
      setContentWidth(sizerEl.clientWidth);
      setScrollRange(scrollEl.scrollWidth);
    };
    updateScrollMetrics();

    const resizeObserver = new ResizeObserver(updateScrollMetrics);

    const mutationObserver = new MutationObserver(updateScrollMetrics);

    resizeObserver.observe(sizerEl);
    mutationObserver.observe(scrollEl, { attributes: true, attributeFilter: ["style"] });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const transform = useTransform(scrollYProgress, [0, 1], [0, Math.min(0, contentWidth - scrollRange)]);
  const spring = useSpring(transform, { damping: 60, mass: 1, stiffness: 500 });

  return (
    <div ref={containerRef} className={`relative ${className}`} {...props}>
      <div className="sticky" style={{ top }}>
        <div style={{ overflow }}>
          <motion.div ref={scrollRef} style={{ x: spring }}>
            {children}
          </motion.div>
        </div>
      </div>
      <div ref={sizerRef} aria-hidden="true" style={{ width: "100%", height: scrollRange }} />
    </div>
  );
}

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

const GlowCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { ref, onMouseMove } = useMouseGradient();
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      className="group relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow duration-300 hover:shadow-xl"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(17,179,11,0.14), rgba(149,225,0,0.12), transparent 45%)",
        }}
      />
      <motion.div className="relative">
        <h4 className="text-base font-semibold text-black">{title}</h4>
        <div className="mt-2 text-sm leading-6 text-zinc-600">{children}</div>
      </motion.div>
    </motion.div>
  );
};

function ProblemCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div className="group relative h-full overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-zinc-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
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
    </motion.div>
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
    <motion.div
      aria-label="iPhone mockup for Grove app walkthrough"
      className="w-full overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
    >
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:justify-start lg:gap-20">
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
                <motion.p
                  animate={{ opacity: isActive ? 1 : 0.72 }}
                  className={`mt-4 max-w-md text-sm leading-6 ${isActive ? "text-white/85" : "text-white/55"}`}
                >
                  {card.description}
                </motion.p>
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
    <div className="min-h-screen bg-white">
      <ProjectNav />
      <main className="bg-white text-zinc-800 pt-16">
        <ProgressBar />

        {/* ── Hero ── */}
        <header className="relative isolate overflow-x-clip" style={{ background: GROVE_HERO_BG }}>
          <Container>
            <motion.div className="grid items-stretch gap-8 py-20 sm:grid-cols-2 sm:py-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <motion.div className="inline-flex items-center gap-2 rounded-full bg-[#E5F7B3]/70 px-3 py-1 text-xs font-medium text-[#11B30B] ring-1 ring-[#11B30B]/20">
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
                <motion.div className="mt-6 flex flex-wrap items-center gap-3">
                  <HeroMetaPill>Role: UI/UX Designer & Developer</HeroMetaPill>
                  <HeroMetaPill>Platform: iOS & Android</HeroMetaPill>
                </motion.div>
                <motion.div className="mt-3 flex flex-wrap items-center gap-2">
                  {STACK.map((tool) => (
                    <HeroMetaPill key={tool}>{tool}</HeroMetaPill>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative flex w-full flex-1 items-end justify-start overflow-visible"
                style={{ background: GROVE_HERO_BG }}
              >
                <GroveHeroRive />
              </motion.div>
            </motion.div>
          </Container>
        </header>

        {/* ── Executive Summary ── */}
        <Section id="executive-summary" eyebrow="Executive Summary" title="Problem · Solution · Outcome">
          <HorizontalScroller overflow="visible" className="overflow-x-clip">
            <motion.div className="flex w-max gap-5 py-2 pr-[10vw]">
              {EXECUTIVE_SUMMARY_CARDS.map((card, i) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className="group relative flex min-h-64 w-[min(78vw,28rem)] flex-col justify-between overflow-hidden rounded-[2rem] border border-[#11B30B]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at top left, rgba(199,239,19,0.26), transparent 34%), linear-gradient(135deg, rgba(229,247,179,0.88), rgba(255,255,255,0.96))",
                    }}
                  />
                  <motion.div className="relative">
                    <motion.div
                      className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                      style={{ background: GROVE_GRADIENT }}
                    >
                      {card.icon}
                    </motion.div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#11B30B]">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#11B30B]">{card.title}</h3>
                    <p className="mt-4 text-base leading-7 text-zinc-700">{card.text}</p>
                  </motion.div>
                </motion.article>
              ))}
            </motion.div>
          </HorizontalScroller>
        </Section>

        {/* ── Project Brief ── */}
        <Section id="brief" eyebrow="Project Brief" title="Context">
          <motion.div className="max-w-3xl space-y-4">
            <p>
              Grove reimagines habit tracking through environmental storytelling and interactive progression
              systems. Instead of focusing on charts and productivity metrics, the app creates a peaceful
              experience where users maintain and grow a virtual garden through daily habits.
            </p>
          </motion.div>
          <motion.div className="mt-10">
            <h4 className="mb-4 text-sm font-semibold text-zinc-700">App walkthrough</h4>
            <FramerPhoneMockup />
          </motion.div>
        </Section>

        {/* ── Problem Statement ── */}
        <Section
          id="problem"
          eyebrow="Problem Statement"
          title="Why habit apps lose people"
          kicker="Three friction points Grove addresses."
        >
          <motion.div className="grid gap-5 sm:grid-cols-3">
            <ProblemCard
              title="Lack of Emotional Engagement"
              text="Traditional habit trackers often feel transactional and repetitive."
              icon={<IconFlame size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Progress Feels Invisible"
              text="Users struggle to feel rewarded by long-term consistency."
              icon={<IconChartBar size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Productivity Burnout"
              text="Many self-improvement apps prioritize pressure over encouragement."
              icon={<IconPlant size={22} stroke={1.5} />}
            />
          </motion.div>
        </Section>

        {/* ── Gamification System ── */}
        <Section
          id="gamification"
          eyebrow="Gamification System Design"
          title="The core loop"
          kicker="Habit data maps directly to a living visual environment."
        >
          <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GROWTH_STAGES.map((item, i) => (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-[#E5F7B3]/70 p-5 ring-1 ring-[#BEDA76]"
              >
                <motion.div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: GROVE_GRADIENT }}
                >
                  {i + 1}
                </motion.div>
                <h4 className="text-lg font-semibold text-[#11B30B]">{item.stage}</h4>
                <p className="mt-2 text-sm text-[#11B30B]/80">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <p className="mt-6 max-w-3xl text-sm text-zinc-600">
            The core loop focuses on visually maintaining a peaceful, living environment rather than
            maximizing productivity metrics.
          </p>
        </Section>

        {/* ── Real Impact ── */}
        <Section id="impact" eyebrow="Real Impact" title="Real Impact">
          <ul className="max-w-3xl list-disc space-y-2 pl-5 text-zinc-700">
            <li>Designed for short daily engagement loops</li>
            <li>Encourages consistency through visual progression</li>
            <li>Creates emotional connection through environmental feedback</li>
            <li>Built as a scalable consumer-facing mobile app</li>
          </ul>
        </Section>

        {/* ── Design System ── */}
        <Section id="design-system" eyebrow="Design System" title="Design System">
          <motion.div className="grid gap-6 md:grid-cols-2">
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
            <GlowCard title="Focus Areas">
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
          </motion.div>
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
          <motion.div className="grid gap-5 sm:grid-cols-3">
            <ProblemCard
              title="Balancing Gamification"
              text="Focused on peaceful progression instead of competitive mechanics."
              icon={<IconPlant size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Maintaining Simplicity"
              text="Reduced unnecessary UI complexity to keep interactions lightweight and approachable."
              icon={<IconChartBar size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Animation & Performance"
              text="Explored optimized animation workflows for smooth mobile performance."
              icon={<IconFlame size={22} stroke={1.5} />}
            />
          </motion.div>
        </Section>

        {/* ── Comparison ── */}
        <Section id="comparison" eyebrow="Comparison" title="Grove vs. traditional habit apps" bg="bg-zinc-50">
          <motion.div className="grid gap-6 sm:grid-cols-2">
            <motion.div className="rounded-2xl border border-zinc-200 bg-white p-6">
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
            </motion.div>
            <motion.div className="rounded-2xl bg-[#00B600] p-6 text-white">
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
            </motion.div>
          </motion.div>
        </Section>

        {/* ── Outcome ── */}
        <Section id="outcome" eyebrow="Outcome" title="Impact in practice">
          <motion.div className="max-w-2xl space-y-4 text-zinc-700">
            <p>
              Grove evolved into a polished mobile habit tracking experience that blends gamification, calming
              visuals, and lightweight interactions into a more emotionally engaging daily routine system.
            </p>
            <p>
              The project also became an exploration into combining product design, illustration systems,
              animation, and front-end development into a unified consumer app experience.
            </p>
          </motion.div>
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

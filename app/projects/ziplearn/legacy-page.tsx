"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";
import {
  IconCoin,
  IconWallet,
  IconBooks,
  IconSchool,
  IconChartBar,
  IconSearch,
} from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";
import OtherProjects from "@/components/sections/OtherProjects";
import heroRef from "./images/Header img.png";
import processRef from "./images/02.png";
import midFidelity from "./images/Mid-fi mockups.png";
import highFidelity from "./images/high-fi mockups.png";
import researchQualImg from "./images/research-qualitative.png";
import userPersonas from "./images/user-personas.png";
import mobile1 from "./images/app screens/Mobile 1.png";
import mobile2 from "./images/app screens/Mobile 2.png";
import mobile3 from "./images/app screens/Mobile 3.png";
import mobile4 from "./images/app screens/Mobile 4.png";
import mobile5 from "./images/app screens/Mobile 5.png";
import mobile6 from "./images/app screens/Mobile 6.png";

const ZIP_GRADIENT = "linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)";
const ZIP_HERO_BG = "#F0EBFE";
const ZIP_ACCENT = "#6A32F9";
/* Darker gradient reserved for tiles with white body text. */
const ZIP_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(167,139,250,0.35), transparent 42%), linear-gradient(145deg, #6A32F9 0%, #4527A8 100%)";

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
  tint: "bg-[#F0EBFE]/80 ring-1 ring-[#D8C9FC]",
  brand: "text-white ring-1 ring-[#6A32F9]/20",
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
      style={variant === "brand" ? { background: ZIP_TILE_GRADIENT, ...style } : style}
    >
      {children}
    </motion.div>
  );
}

const TileLabel = ({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "brand" }) => (
  <p
    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
      tone === "brand" ? "text-[#6A32F9]/70" : "text-zinc-500"
    }`}
  >
    {children}
  </p>
);

const HeroMetaPill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-[#F0EBFE] px-3 py-1 text-xs font-medium text-[#6A32F9] ring-1 ring-[#6A32F9]/20"
  >
    {children}
  </motion.span>
);

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: ZIP_GRADIENT }}
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
        style={{ background: ZIP_GRADIENT }}
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

const STACK = ["Figma", "Photoshop"];

const AT_A_GLANCE = ["Concept iOS app", "2-month timeline", "Solo designer & researcher"];

const PROJECTED_IMPACT = [
  "Interviews (parents + students) revealed 80% struggled with trust and discovery.",
  "Prototype testing: ~90% scheduled a tutor in ≤2 minutes.",
  "Reviews/credentials increased booking confidence for ~70% of testers.",
  "Projected time savings of ~1 hour/week vs manual searching.",
];

const EXECUTIVE_SUMMARY_CARDS = [
  {
    title: "Problem",
    text: "Parents and students struggle to find trusted tutors quickly; discovery and vetting are manual and uncertain.",
    icon: <IconSearch size={24} stroke={1.5} />,
  },
  {
    title: "Solution",
    text: "I designed ZipLearn, a concept mobile app to browse, evaluate, and book tutors with confidence — using profiles, reviews, verified credentials, and simple scheduling.",
    icon: <IconSchool size={24} stroke={1.5} />,
  },
  {
    title: "Outcome",
    text: "User interviews indicated strong interest; prototype testing showed high task success for scheduling within minutes and increased trust from credential transparency.",
    icon: <IconChartBar size={24} stroke={1.5} />,
  },
];

type AppScreen = {
  image: StaticImageData;
  alt: string;
  title: string;
  description: string;
};

const APP_SCREENS: AppScreen[] = [
  {
    image: mobile1,
    alt: "Home screen",
    title: "Home Screen",
    description:
      "An easy journey to start: hire a tutor, collaborate with other students, or watch online tutorials for 30+ subjects. The search bar helps you find exactly what you're looking for.",
  },
  {
    image: mobile2,
    alt: "Videos/Tutors and Filters",
    title: "Videos/Tutors",
    description:
      "Choose a subject, then decide whether you want to watch tutorials or set up a tutoring session.",
  },
  {
    image: mobile3,
    alt: "Tutor profile",
    title: "Tutors & Bio",
    description:
      "Tap on a tutor to see a page with their background and reviews, so you can decide if they're a good fit for your academic needs.",
  },
  {
    image: mobile4,
    alt: "Scheduling",
    title: "Tutoring Sessions",
    description:
      "Check the tutor's calendar and availability. Once you find an open time slot, go through the application process and set up a session.",
  },
  {
    image: mobile5,
    alt: "In-session experience",
    title: "In-session Experience",
    description:
      "Join sessions with built-in video and chat. Share notes and files in real time, annotate concepts together, and keep materials saved for later review.",
  },
  {
    image: mobile6,
    alt: "Notifications and completion",
    title: "Congratulations!",
    description:
      "The confirmation screen once you've successfully signed up for a tutoring session. From here you can go back to watch tutorials or explore other activities.",
  },
];

function AppScreenShowcase() {
  const [activeScreen, setActiveScreen] = useState(0);
  const screen = APP_SCREENS[activeScreen];

  return (
    <motion.div aria-label="ZipLearn app walkthrough" className="w-full">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-start lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex h-[480px] w-[min(72vw,20rem)] items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={screen.title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex h-full items-center justify-center"
            >
              <Image
                src={screen.image}
                alt={screen.alt}
                className="block h-full w-auto object-contain drop-shadow-xl"
                priority={activeScreen === 0}
              />
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
          <h5 className="mt-2 text-xl font-semibold text-zinc-900">{screen.title}</h5>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{screen.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {APP_SCREENS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveScreen(index)}
                className={`rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeScreen === index
                    ? "bg-[#F0EBFE] text-[#6A32F9]"
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
  src: StaticImageData;
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
          <Image src={src} alt={alt} className="block w-full h-auto object-contain" />
        </div>
        {caption ? <p className="mt-3 text-center text-xs text-zinc-500">{caption}</p> : null}
      </div>
    </BentoTile>
  );
}

export default function ZipLearnCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <ProjectNav />
      <main className="bg-zinc-50 text-zinc-800 pt-16">
        <ProgressBar />

        {/* ── Hero ── */}
        <header className="relative isolate pt-6 sm:pt-10">
          <Container>
            <BentoGrid>
              <BentoTile span={6} padded={false} interactive={false} style={{ background: ZIP_HERO_BG }}>
                <div className="grid items-stretch gap-8 px-7 pt-10 sm:grid-cols-2 sm:px-12 sm:pt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-center pb-10 sm:pb-16"
                  >
                    <motion.div className="inline-flex items-center gap-2 self-start rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#6A32F9] ring-1 ring-[#6A32F9]/20">
                      Concept Case Study
                    </motion.div>
                    <h1
                      className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
                      style={{ color: ZIP_ACCENT }}
                    >
                      ZipLearn
                    </h1>
                    <p className="mt-3 text-xl font-semibold text-zinc-800">
                      Personal Online Tutoring iOS App
                    </p>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600">
                      ZipLearn helps students find and book private tutors for their subjects with flexible,
                      online sessions that fit busy schedules.
                    </p>
                    <p className="mt-2 max-w-xl text-xs italic text-zinc-500">
                      Concept exploration — this is not a shipped product.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative flex w-full flex-1 items-end justify-center"
                  >
                    <Image
                      src={heroRef}
                      alt="ZipLearn hero devices"
                      className="block h-auto w-full max-h-[560px] origin-bottom scale-110 object-contain sm:scale-125"
                      priority
                    />
                  </motion.div>
                </div>
              </BentoTile>

              <BentoTile span={2} delay={0.05}>
                <TileLabel>Role</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">
                  UI/UX Designer &amp; Researcher
                </p>
              </BentoTile>
              <BentoTile span={2} delay={0.1}>
                <TileLabel>Timeline</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">2 months</p>
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
                      "radial-gradient(circle at top left, rgba(167,139,250,0.24), transparent 34%), linear-gradient(135deg, rgba(240,235,254,0.9), rgba(255,255,255,0.96))",
                  }}
                />
                <motion.div className="relative flex h-full flex-col">
                  <motion.div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: ZIP_GRADIENT }}
                  >
                    {card.icon}
                  </motion.div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6A32F9]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#6A32F9]">{card.title}</h3>
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
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6A32F9]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium leading-snug text-zinc-900">{item}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Project Brief ── */}
        <Section id="brief" eyebrow="Project Brief" title="Challenge & Goal">
          <BentoGrid>
            <BentoTile span={4}>
              <TileLabel>Challenge</TileLabel>
              <p className="mt-3 text-base leading-7 text-zinc-700">
                Students often need extra support outside class but can&apos;t meet private tutors due to busy
                schedules and extracurriculars. Parents face high costs for private tutoring.
              </p>
              <div className="mt-6">
                <TileLabel>The Goal</TileLabel>
                <p className="mt-3 text-base leading-7 text-zinc-700">
                  Design an accessible, inclusive mobile app that lets families hire private tutors for online
                  sessions — and create an opportunity for teachers to earn extra income by tutoring students
                  from their schools.
                </p>
              </div>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.08}>
              <TileLabel tone="brand">At a glance</TileLabel>
              <ul className="mt-3 space-y-2 text-sm font-medium text-[#6A32F9]">
                {AT_A_GLANCE.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6A32F9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Key Insights ── */}
        <Section
          id="insights"
          eyebrow="Key Insights"
          title="What we heard"
          kicker="Three friction points surfaced in research."
        >
          <BentoGrid>
            <ProblemCard
              title="Cost barriers"
              text="Parents signal price sensitivity; teens lack funds for private sessions."
              icon={<IconCoin size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Willingness to pay"
              text="Families hesitate to subscribe or pay per session without clear value."
              icon={<IconWallet size={22} stroke={1.5} />}
              delay={0.06}
            />
            <ProblemCard
              title="Coverage gaps"
              text="Interviews surfaced limited subject diversity across available tutors."
              icon={<IconBooks size={22} stroke={1.5} />}
              delay={0.12}
            />
          </BentoGrid>
        </Section>

        {/* ── Research Overview ── */}
        <Section id="research" eyebrow="Research Overview" title="Qualitative research and personas">
          <BentoGrid>
            <ImageTile span={3} src={researchQualImg} alt="Qualitative research summary" label="Qualitative research" />
            <ImageTile span={3} delay={0.08} src={userPersonas} alt="Primary personas" label="User personas" />
          </BentoGrid>
        </Section>

        {/* ── Solution / App Walkthrough ── */}
        <Section
          id="solution"
          eyebrow="Concept Solution"
          title="What the product provides"
          kicker="ZipLearn connects students with vetted tutors for flexible, online sessions. Students browse tutor bios, schedule sessions, and join directly in-app."
        >
          <BentoGrid>
            <BentoTile span={6} variant="tint" interactive={false}>
              <ul className="grid gap-3 text-sm font-medium text-[#6A32F9] sm:grid-cols-3">
                {[
                  "Flexible scheduling aligned to busy calendars",
                  "School-linked tutors and subject coverage",
                  "Clear reviews and bios for informed selection",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6A32F9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={6} padded={false} interactive={false} delay={0.08}>
              <div className="px-6 pt-6 sm:px-8 sm:pt-8">
                <TileLabel>App walkthrough</TileLabel>
              </div>
              <div className="p-6 sm:p-8">
                <AppScreenShowcase />
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Design Stages ── */}
        <Section id="stages" eyebrow="Design Stage" title="Design evolution">
          <BentoGrid>
            <ImageTile span={6} src={midFidelity} alt="Personas and mid-fidelity" label="Mid-fidelity mockups" />
            <ImageTile
              span={6}
              delay={0.08}
              src={highFidelity}
              alt="Brand identity and high-fidelity"
              label="High-fidelity mockups"
            />
          </BentoGrid>
        </Section>

        {/* ── Process ── */}
        <Section id="process" eyebrow="Process" title="ZipLearn Design Process" kicker="From research to release.">
          <BentoGrid>
            <ImageTile span={6} src={processRef} alt="Design process" />
          </BentoGrid>
        </Section>

        {/* ── Learnings ── */}
        <Section id="learnings" eyebrow="Concept Learnings" title="What I explored">
          <BentoGrid className="pb-2">
            <BentoTile span={6} variant="brand" interactive={false}>
              <div className="max-w-3xl space-y-4 text-white/90">
                <p>
                  As a concept, ZipLearn let me test assumptions without the constraints of production scope.
                  Through interviews and lightweight prototypes, I saw that cost and time were only surface
                  problems — the deeper friction was uncertainty. Students and parents weren&apos;t sure who to
                  trust, when sessions could actually happen, or what value they&apos;d get from the first
                  booking.
                </p>
                <p>
                  By surfacing availability, subject fit, and reviews earlier, and by turning the journey into a
                  series of clear, single decisions, the experience felt more approachable. These explorations
                  also highlighted how much reassurance comes from tight copy and unambiguous states: what
                  happens before, during, and after a session. If this moved toward production, I&apos;d
                  validate pricing cues, add more transparent tutor metrics, and refine scheduling to better
                  reflect real-world constraints.
                </p>
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
                  "Forms include labels, error states, and contextual help for screen readers.",
                  "Color + icon pairings for success/error states (not color alone).",
                  "Focus order structured for fast navigation through booking flow.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6A32F9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        <OtherProjects currentProject="ziplearn" />
        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} ZipLearn · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

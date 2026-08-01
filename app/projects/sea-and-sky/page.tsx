"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { IconUsers, IconFileCertificate, IconVideo } from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";
import OtherProjects from "@/components/sections/OtherProjects";
import heroImg from "./images/Project images/Header.png";
import mobilesImg from "./images/Project images/mobiles.png";
import lofiImg from "./images/Project images/stages/lofi.png";
import midfiImg from "./images/Project images/stages/midfi.png";
import hifiImg from "./images/Project images/stages/hifi.png";
import logoPng from "./images/logo.png";

const SEA_GRADIENT = "linear-gradient(223deg, #02ADEF 0%, #0B53CD 100%)";
const SEA_HERO_BG =
  "radial-gradient(circle at top left, rgba(2,173,239,0.35), transparent 42%), linear-gradient(145deg, #0B53CD 0%, #062C6E 100%)";
/* Darker gradient reserved for tiles with white body text. */
const SEA_TILE_GRADIENT =
  "radial-gradient(circle at top left, rgba(2,173,239,0.35), transparent 42%), linear-gradient(145deg, #0B53CD 0%, #083B93 100%)";

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
  tint: "bg-[#E8F5FE]/80 ring-1 ring-[#A5D8F8]",
  brand: "text-white ring-1 ring-[#0B53CD]/20",
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
      style={variant === "brand" ? { background: SEA_TILE_GRADIENT, ...style } : style}
    >
      {children}
    </motion.div>
  );
}

const TileLabel = ({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "brand" }) => (
  <p
    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
      tone === "brand" ? "text-[#0B53CD]/70" : "text-zinc-500"
    }`}
  >
    {children}
  </p>
);

const HeroMetaPill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-[#E8F5FE] px-3 py-1 text-xs font-medium text-[#0B53CD] ring-1 ring-[#0B53CD]/20"
  >
    {children}
  </motion.span>
);

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: SEA_GRADIENT }}
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
  span = 2,
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
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(2,173,239,0.16), rgba(11,83,205,0.12), transparent 45%)",
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
        style={{ background: SEA_GRADIENT }}
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

const AT_A_GLANCE = ["Concept mobile app", "Feb–Aug 2019", "Solo research & design"];

const PROJECTED_IMPACT = [
  "Validated desirability during prototype reviews; students expressed eagerness to join.",
  "Projected to reduce resource discovery time by 60%+ by consolidating search into one app.",
  "Community groups designed to increase peer connections and on-campus support.",
  "Demonstrated end-to-end design process across research, flows, and UI.",
];

const EXECUTIVE_SUMMARY_CARDS = [
  {
    title: "Problem",
    text: "First-generation and international students struggled to find reliable resources (scholarships, legal aid, campus services) scattered across multiple platforms, making it hard to get help or build community.",
    icon: <IconFileCertificate size={24} stroke={1.5} />,
  },
  {
    title: "Solution",
    text: "I designed Sea & Sky, a mobile concept that centralizes resources, peer groups, and curated media into one intuitive interface — reducing search overhead and enabling supportive connections.",
    icon: <IconUsers size={24} stroke={1.5} />,
  },
  {
    title: "Outcome",
    text: "Prototype reviews showed strong enthusiasm and stated intent to sign up if launched. Testers believed the unified design would significantly cut search time and help them connect with peers.",
    icon: <IconVideo size={24} stroke={1.5} />,
  },
];

const HIGHLIGHTS = [
  { t: "Community", d: "Profiles and messaging to find peers and stay connected." },
  { t: "Resources", d: "Scholarships, legal aid, and campus services in one place." },
  { t: "Media", d: "Motivational videos and podcasts tailored to students." },
  { t: "Events", d: "Campus and community events surfaced by location." },
  { t: "Onboarding", d: ".edu verification for a trusted student network." },
  { t: "Mobile-first", d: "Designed for quick, daily check-ins on the go." },
];

const PROCESS_STEPS = [
  { stage: "Research & Discovery", desc: "User interviews and scans of existing student communities." },
  { stage: "Design & Prototyping", desc: "Information architecture and mobile-first flows with clear, calm visuals." },
  { stage: "Iteration & Validation", desc: "Refined copy, edge cases, and accessibility to improve comprehension." },
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
          <Image
            src={src}
            alt={alt}
            className="block w-full h-auto object-contain"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>
        {caption ? <p className="mt-3 text-center text-xs text-zinc-500">{caption}</p> : null}
      </div>
    </BentoTile>
  );
}

export default function SeaSkyCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <ProjectNav />
      <main className="bg-zinc-50 text-zinc-800 pt-16">
        <ProgressBar />

        {/* ── Hero ── */}
        <header className="relative isolate pt-6 sm:pt-10">
          <Container>
            <BentoGrid>
              <BentoTile span={6} padded={false} interactive={false} style={{ background: SEA_HERO_BG }}>
                <div className="grid items-stretch gap-8 px-7 pt-10 sm:grid-cols-2 sm:px-12 sm:pt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-center pb-10 sm:pb-16"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-full">
                        <Image
                          src={logoPng}
                          alt="Sea & Sky logo"
                          width={100}
                          height={100}
                          className="h-full w-full object-cover"
                          priority
                          style={{ transform: "scale(2.2)", objectPosition: "center" }}
                        />
                      </div>
                      <motion.div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30">
                        Sea &amp; Sky Case Study
                      </motion.div>
                    </div>
                    <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                      Sea &amp; Sky
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                      An online community built for informing and empowering Hispanic, LatinX, and immigrant
                      students in higher education.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative flex w-full flex-1 items-end justify-center"
                  >
                    <Image
                      src={heroImg}
                      alt="Sea & Sky header"
                      className="block h-auto w-full max-h-[560px] origin-bottom scale-110 object-contain sm:scale-125"
                      priority
                    />
                  </motion.div>
                </div>
              </BentoTile>

              <BentoTile span={2} delay={0.05}>
                <TileLabel>Role</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">
                  Research &amp; UI/UX (solo)
                </p>
              </BentoTile>
              <BentoTile span={2} delay={0.1}>
                <TileLabel>Timeline</TileLabel>
                <p className="mt-2 text-lg font-semibold leading-snug text-zinc-900">Feb–Aug 2019</p>
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
                      "radial-gradient(circle at top left, rgba(2,173,239,0.22), transparent 34%), linear-gradient(135deg, rgba(232,245,254,0.9), rgba(255,255,255,0.96))",
                  }}
                />
                <motion.div className="relative flex h-full flex-col">
                  <motion.div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: SEA_GRADIENT }}
                  >
                    {card.icon}
                  </motion.div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0B53CD]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#0B53CD]">{card.title}</h3>
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
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0B53CD]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium leading-snug text-zinc-900">{item}</p>
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
                  Sea &amp; Sky is an idea that came into fruition by a group of students who identify as
                  immigrant, Latino, and Hispanic. They were unable to find a place where they could connect
                  with other students who could identify similarly to them.
                </p>
                <p>
                  In the following case study, you&apos;ll see the initial design and how it evolved throughout
                  a period of six months.
                </p>
              </div>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.08}>
              <TileLabel tone="brand">At a glance</TileLabel>
              <ul className="mt-3 space-y-2 text-sm font-medium text-[#0B53CD]">
                {AT_A_GLANCE.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B53CD]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── User Persona ── */}
        <Section id="persona" eyebrow="User Persona" title="Who we designed for">
          <BentoGrid>
            <BentoTile span={2} variant="brand" className="md:row-span-2">
              <h3 className="text-2xl font-bold text-white">Julie</h3>
              <dl className="mt-4 space-y-2 text-sm text-white/90">
                <div className="flex gap-2"><dt className="font-medium">Age:</dt><dd>20</dd></div>
                <div className="flex gap-2"><dt className="font-medium">Location:</dt><dd>Irvine</dd></div>
                <div className="flex gap-2"><dt className="font-medium">Education:</dt><dd>Undergraduate</dd></div>
              </dl>
              <div className="mt-5 text-xs text-white">
                <div className="font-semibold uppercase tracking-[0.18em] text-white/70">Personality</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["communicative", "open minded", "leadership"].map((trait) => (
                    <span key={trait} className="rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/25">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </BentoTile>
            <BentoTile span={4} delay={0.06}>
              <TileLabel>Bio</TileLabel>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-700">
                {[
                  "Julie was born in Argentina and came to the U.S. as a child.",
                  "Growing up, she wasn't aware of the burdens of being an immigrant until university.",
                  "At university she struggled to find a group of students who identified similarly.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B53CD]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.12}>
              <TileLabel tone="brand">Goals</TileLabel>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-700">
                {[
                  "Create a support group where undocumented students can get help.",
                  "Create resources for undocumented students who cannot afford university fees.",
                  "Graduate as an undocumented and first-generation student.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B53CD]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.18}>
              <TileLabel tone="brand">Behavior</TileLabel>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-700">
                {[
                  "Works alongside resource groups to provide resources to undocumented students.",
                  "Volunteers for programs that help people who lack resources.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B53CD]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={2} variant="tint" delay={0.24}>
              <TileLabel tone="brand">Frustrations</TileLabel>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-700">
                {[
                  "Wants to create more resource opportunities for students pursuing higher education.",
                  "Struggles to find opportunities catered to undocumented students.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B53CD]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
            <BentoTile span={4} variant="brand" delay={0.3} interactive={false}>
              <TileLabel tone="muted">
                <span className="text-white/70">Quote</span>
              </TileLabel>
              <p className="mt-3 text-base italic leading-7 text-white/95">
                &ldquo;When I&apos;ve graduated from university, I want to look back and know that I&apos;ve
                done something to improve the lives of students who are going through the same struggle of being
                undocumented as I am.&rdquo;
              </p>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Problem Statement ── */}
        <Section
          id="problem"
          eyebrow="Problem Statement"
          title="What students lacked"
          kicker="Three gaps surfaced: community, resources, and motivating media."
        >
          <BentoGrid>
            <ProblemCard
              title="Community"
              text="No platform for community building for immigrant, Latino, and Hispanic students within universities."
              icon={<IconUsers size={22} stroke={1.5} />}
            />
            <ProblemCard
              title="Resources"
              text="Non-existent singular platform where students can obtain resources such as scholarships, legal aid, and motivation."
              icon={<IconFileCertificate size={22} stroke={1.5} />}
              delay={0.06}
            />
            <ProblemCard
              title="Media"
              text="Non-existent media content such as videos and podcasts geared to educate and motivate first-generation, immigrant, Latino, or Hispanic students pursuing degrees in higher education."
              icon={<IconVideo size={22} stroke={1.5} />}
              delay={0.12}
            />
          </BentoGrid>
        </Section>

        {/* ── Solution ── */}
        <Section id="solution" eyebrow="Solution" title="What the app provides">
          <BentoGrid>
            <BentoTile span={3}>
              <TileLabel>Approach</TileLabel>
              <div className="mt-3 space-y-4 text-base leading-7 text-zinc-700">
                <p>The solution is an app that will foster an online community, provide resources, and create content.</p>
                <p>
                  Community will be fostered through the creation of online profiles with .edu emails that allow
                  students to connect with others in the same university or across different universities.
                </p>
                <p>
                  Students can stay up to date with current news through the app; this information is updated
                  based on the student&apos;s location.
                </p>
                <p>The media section creates motivation for students by surfacing motivational and informative content.</p>
              </div>
            </BentoTile>
            <BentoTile span={3} padded={false} interactive={false} delay={0.08}>
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl">
                  <Image src={mobilesImg} alt="Sea & Sky mobile screens" className="block w-full h-auto object-contain" />
                </div>
                <p className="mt-3 text-center text-xs text-zinc-500">
                  Unified hub: resources, groups, and media in one place to cut search time.
                </p>
              </div>
            </BentoTile>
          </BentoGrid>
        </Section>

        {/* ── Highlights ── */}
        <Section id="highlights" eyebrow="Highlights" title="Experiences that matter">
          <BentoGrid>
            {HIGHLIGHTS.map((f, i) => (
              <GlowCard key={f.t} title={f.t} span={2} delay={i * 0.05}>
                {f.d}
              </GlowCard>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Design Stages ── */}
        <Section
          id="stages"
          eyebrow="Design Stage"
          title="Design evolution"
          kicker="From low-fidelity sketches to high-fidelity screens over six months."
        >
          <BentoGrid>
            <ImageTile
              span={6}
              src={lofiImg}
              alt="Low fidelity mockups"
              label="Low-fidelity mockups"
              caption="Onboarding clarifies value props quickly to reduce drop-off."
            />
            <ImageTile span={6} delay={0.08} src={midfiImg} alt="Mid fidelity mockups" label="Mid-fidelity mockups" />
            <ImageTile
              span={6}
              delay={0.16}
              src={hifiImg}
              alt="High fidelity mockups"
              label="High-fidelity mockups"
              caption="Bottom-nav patterns support one-hand mobile use."
            />
          </BentoGrid>
        </Section>

        {/* ── Process ── */}
        <Section id="process" eyebrow="Process" title="Crafting Sea & Sky" kicker="From research to release.">
          <BentoGrid>
            {PROCESS_STEPS.map((item, i) => (
              <BentoTile key={item.stage} span={2} variant="tint" delay={i * 0.06}>
                <motion.div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: SEA_GRADIENT }}
                >
                  {i + 1}
                </motion.div>
                <h4 className="text-lg font-semibold text-[#0B53CD]">{item.stage}</h4>
                <p className="mt-2 text-sm text-[#0B53CD]/80">{item.desc}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </Section>

        {/* ── Learnings ── */}
        <Section id="learnings" eyebrow="Learnings & Outcomes" title="What I learned">
          <BentoGrid>
            <BentoTile span={6} variant="brand" interactive={false}>
              <div className="max-w-3xl space-y-4 text-white/90">
                <p>
                  The idea of the Sea &amp; Sky app was created out of necessity: students who identify as
                  undocumented needed a space designed for them.
                </p>
                <p>
                  Coming from a graphic design background with limited UI and UX experience, this was a learning
                  journey. I didn&apos;t fully know the rules of UI/UX, but by taking on the challenge I learned
                  the fundamentals while building the app.
                </p>
                <p>
                  A key challenge was prioritizing the problem over visual polish. At times I focused on
                  aesthetics more than effectiveness. Through iteration, I adjusted the design to solve the
                  underlying problems.
                </p>
                <p>
                  There was a lot of learning from this project — and as the saying goes: you learn and grow
                  from your mistakes. Thanks for reading this case study!
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
                  "Designed high-contrast resource cards to ensure readability across light/dark modes.",
                  "Large tap targets and bottom-nav for one-hand mobile use.",
                  "Simple onboarding flow with plain-language copy for ESL/international students.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B53CD]" />
                    {item}
                  </li>
                ))}
              </ul>
            </BentoTile>
          </BentoGrid>
        </Section>

        <OtherProjects currentProject="sea-sky" />
        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} Sea &amp; Sky · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

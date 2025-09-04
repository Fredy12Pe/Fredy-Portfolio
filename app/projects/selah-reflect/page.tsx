"use client";

import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Compare } from "@/components/ui/compare";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import dynamic from "next/dynamic";
import ProjectNav from "@/components/layout/ProjectNav";
import heroImg from "./images/headerImg.png";
import imgDevotionalHub from "./images/DevotionalHub.png";
import imgHymn from "./images/Hymn.png";
import imgReflect from "./images/Reflect.png";
import imgScriptureOverview from "./images/scriptureOverview.png";
import devImg1 from "./images/devJourney/figma.png";
import devImg2 from "./images/devJourney/cursor.png";
import devImg3 from "./images/devJourney/firebase.png";
import devImg4 from "./images/devJourney/headerImg.png";
import compImgBefore from "./images/comparison/Group 2.png";
import compImgAfter from "./images/comparison/Group 3.png";
const compVideoUrl = "/videos/selahRecord.mp4";
const DotGrid = dynamic(() => import("./DotGrid"), { ssr: false });

/**
 * Selah – Case Study Page (Creative Animated Edition)
 *
 * Option A: Original creative version with:
 * - Alternating soft background colors per section
 * - Black h1, gray body text
 * - Image placeholders instead of boxes with text
 * - Scroll-triggered animations
 */

// Utilities -----------------------------------------------------------------
const Container = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200"
  >
    {children}
  </motion.span>
);

// Header-dark variant pills (bubbles)
const HeaderPill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15"
  >
    {children}
  </motion.span>
);

const LogoPill = ({ src, alt, label }: { src: string; alt: string; label: string }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">
    <Image src={src} alt={alt} width={16} height={16} className="opacity-90" />
    {label}
  </span>
);

const ImagePlaceholder = (
  { height = 200, label = "Image" }: { height?: number; label?: string }
) => (
  <div
    role="img"
    aria-label={label}
    className="w-full overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-inset ring-zinc-200"
    style={{ height }}
  />
);

// Glowing hover card (Aceternity-style) -------------------------------------

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
  desc,
}: {
  title: string;
  desc: string;
}) => {
  const { ref, onMouseMove } = useMouseGradient();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="group relative h-full min-h-[160px] rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow duration-300 hover:shadow-xl"
    >
      {/* glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(59,130,246,0.15), rgba(16,185,129,0.12), rgba(245,158,11,0.12), transparent 40%)",
        }}
      />
      {/* content */}
      <div className="relative">
        <h4 className="text-base font-semibold text-black">{title}</h4>
        <p className="mt-2 text-sm text-zinc-600">{desc}</p>
      </div>
    </div>
  );
};

// Simple image carousel -------------------------------------------------------

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
    title: "Screen 1 – Daily Scripture Overview",
    description:
      "Home screen greeting the user and highlighting the date. Focuses on the day’s passage (1 Corinthians 3:10–17) with clean verse typography and a ‘See Today’s Reflection’ call-to-action over a calm, nature-inspired background.",
  },
  {
    image: imgDevotionalHub,
    alt: "Daily Devotional Hub screen",
    title: "Screen 2 – Daily Devotional Hub",
    description:
      "Central hub for the day’s content: Hymn of the Month card, bold tappable daily scripture, Reflection Questions with ‘Journal Entry’ button, an AI reflection prompt, and a previewed Resources section.",
  },
  {
    image: imgHymn,
    alt: "Hymn of the Month full details",
    title: "Screen 3 – Hymn of the Month",
    description:
      "Full hymn details for ‘O Master, Let Me Walk With Thee’ with attribution. Verses are presented in clean, scrollable text to support worship and reflection with strong readability.",
  },
  {
    image: imgReflect,
    alt: "Reflect with AI screen",
    title: "Screen 4 – Reflect with AI",
    description:
      "Guided reflection powered by AI with prompts like ‘What does the text apply to my daily life?’ Generates an interpretation, application, and reflection prompts. Confirms saving the reflection to history.",
  },
];

const Carousel = ({ index, onChange }: { index: number; onChange: (n: number) => void }) => {
  const [direction, setDirection] = useState(1);
  const go = (dir: number) => {
    setDirection(dir);
    onChange((index + dir + slides.length) % slides.length);
  };
  const slide = slides[index];
  return (
    <div className="mt-0 w-full max-w-[320px] mx-auto lg:mx-0">
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              className="block w-full h-auto object-cover"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
        >
          ‹
        </button>
        <div className="text-xs text-zinc-500">
          {index + 1} / {slides.length}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
        >
          ›
        </button>
      </div>
      {/* Title/description rendered on the left column */}
    </div>
  );
};

const Section = ({
  id,
  eyebrow,
  title,
  kicker,
  children,
  bg = "white",
}: {
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  kicker?: ReactNode;
  children?: ReactNode;
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
            {eyebrow}
          </div>
        ) : null}
        {title ? (
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            {title}
          </h2>
        ) : null}
        {kicker ? <p className="mt-3 text-base text-zinc-600">{kicker}</p> : null}
      </motion.div>
      <div className="mt-10">{children}</div>
    </Container>
  </section>
);

// Progress bar (top) --------------------------------------------------------
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"
    />
  );
}

// Timeline step -------------------------------------------------------------
const Step = ({ n, title, desc }: { n: number; title: string; desc: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, delay: n * 0.05 }}
    className="relative pl-10"
  >
    <div className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-black font-semibold text-white">
      {n}
    </div>
    <h4 className="text-sm font-semibold text-black">{title}</h4>
    <div className="mt-1 text-sm leading-7 text-zinc-600">{desc}</div>
  </motion.div>
);

// Vertical timeline item (for Process section) -------------------------------
function TimelineItem({
  n,
  title,
  desc,
  icon,
}: {
  n: number;
  title: string;
  desc: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="relative pl-14">
      <div className="absolute left-0 top-0 grid w-10 place-items-center">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-black text-sm font-semibold text-white shadow-sm">
          {n}
        </div>
      </div>
      {icon ? <div className="mb-2 text-2xl">{icon}</div> : null}
      <h4 className="text-xl font-semibold text-zinc-900">{title}</h4>
      <div className="mt-2 text-base leading-7 text-zinc-600">{desc}</div>
    </div>
  );
}

// Journey card ---------------------------------------------------------------
function JourneyCard({
  index,
  title,
  children,
  variant = "light",
}: {
  index: number;
  title: string;
  children: ReactNode;
  variant?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const frameClasses =
    "relative group rounded-3xl p-6 shadow-sm ring-1 transition-colors duration-300 bg-white text-zinc-900 ring-zinc-200 hover:bg-zinc-900 hover:text-white hover:ring-zinc-800";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.div
      className={frameClasses + " will-change-transform"}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.6 }}
    >
      <div className="text-violet-600 text-xs group-hover:text-violet-300">{`{ ${String(index).padStart(2, "0")} }`}</div>
      <div className="mt-3 flex items-start gap-4">
        <div className="min-w-0 flex-[2]">
          <h4 className="text-xl font-semibold text-zinc-900 group-hover:text-white transition-colors">{title}</h4>
          <div className="mt-2 text-sm leading-7 text-zinc-600 group-hover:text-white transition-colors">{children}</div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="block shrink-0 basis-1/3 rounded-xl ring-1 ring-zinc-200 hover:brightness-110 group-hover:ring-zinc-700"
          style={{ height: 176 }}
          aria-label="Enlarge preview"
        >
          <div className="h-full w-full overflow-hidden rounded-xl">
            <Image src={(index === 1 ? devImg1 : index === 2 ? devImg2 : index === 3 ? devImg3 : devImg4)} alt="Journey preview" className="h-full w-full object-cover" />
          </div>
        </button>
      </div>

      {open && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-6"
              onClick={() => setOpen(false)}
            >
              <div
                className="bg-white w-full max-w-3xl rounded-2xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ring-1 ring-zinc-200 rounded-xl overflow-hidden">
                  <Image src={(index === 1 ? devImg1 : index === 2 ? devImg2 : index === 3 ? devImg3 : devImg4)} alt="Journey enlarged preview" className="w-full h-auto object-cover" />
                </div>
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </motion.div>
  );
}

// Page ----------------------------------------------------------------------
export default function SelahCaseStudyPage() {
  const [solutionSlideIndex, setSolutionSlideIndex] = useState(0);
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
    <div className="relative min-h-screen bg-white text-zinc-800">
      <ProjectNav />
      <div className="pt-16">
        <ProgressBar />

      {/* Hero */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        {/* Dot grid background inspired by ReactBits: https://reactbits.dev/backgrounds/dot-grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 30%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 30%, black 60%, transparent 100%)",
          }}
        />
        {/* Interactive dot grid */}
        <div className="absolute inset-0 -z-10">
          <DotGrid
            dotSize={6}
            gap={12}
            baseColor="#8b8b93"
            activeColor="#6d4aff"
            baseAlpha={0.05}
            activeAlpha={0.6}
            proximity={130}
            shockRadius={260}
            shockStrength={4}
            returnDuration={1}
          />
        </div>
        <Container>
          <div className="grid items-center gap-8 py-20 sm:grid-cols-2 sm:py-28">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">
                Selah Case Study
              </div>
              <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                A focused daily devotional
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-300">
                Mobile‑first reading, quick journaling, and simple reflection tools in one place.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#problem" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-sm hover:bg-zinc-100">Explore Case Study</a>
                <a href="#outcome" className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/5">See Outcome</a>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <HeaderPill>Role: Full-stack + UI/UX</HeaderPill>
                <HeaderPill>Timeline: 2.5 weeks</HeaderPill>
                <HeaderPill>Hosted on Vercel</HeaderPill>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <LogoPill src="/projects/next.svg" alt="Next.js" label="Next.js" />
                <LogoPill src="/stack/tailwind.svg" alt="Tailwind CSS" label="Tailwind CSS" />
                <LogoPill src="/stack/firebase.svg" alt="Firebase" label="Firebase" />
                <LogoPill src="/stack/openai.svg" alt="OpenAI" label="OpenAI" />
                <LogoPill src="/stack/gemini.svg" alt="Gemini" label="Gemini" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-800/30">
                <Image
                  src={heroImg}
                  alt="Selah hero image"
                  className="block w-full h-auto object-cover"
                  priority
                  style={{ transform: "translateZ(0)" }}
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </header>

      {/* Problem */}
      <Section
        id="problem"
        eyebrow="Problem"
        title="Where it began: static PDFs, static hearts"
        kicker="The challenge that sparked Selah."
        bg="bg-white"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <p>
              At my church, devotions lived inside a <strong>Dropbox PDF</strong>. To engage, members juggled tablets,
              journals, and pinch-zoomed screens. Reflection was possible, but hardly inviting.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-zinc-600">
              <li>Awkward annotations on clunky PDFs</li>
              <li>No easy way to add notes or search past reflections</li>
              <li>Access limited to one rigid format</li>
            </ul>
            <p className="mt-3">Selah was born to break that friction.</p>
          </motion.div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white shadow">
            <Image src={compImgBefore} alt="Original PDF page" className="w-full h-auto" priority />
          </div>
        </div>
      </Section>

      {/* Solution */}
      <Section
        id="solution"
        eyebrow="Solution"
        title="A living, breathing devotional"
        kicker="Dynamic, accessible, and personal."
        bg="bg-white"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <p>
              By parsing the church’s PDF into <strong>structured JSON</strong>, Selah unlocked devotionals into a new
              medium: clean, mobile-first, and ready anywhere. With journaling and AI reflections built-in, members can
              go beyond reading—they can converse with Scripture.
            </p>
            {/* bullets removed per request */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-black">{slides[solutionSlideIndex].title}</h5>
              <p className="mt-2 text-sm text-zinc-600">{slides[solutionSlideIndex].description}</p>
              <div className="mt-4">
                <a
                  href="https://www.selahdevotion.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Checkout App
                </a>
              </div>
            </div>
          </motion.div>
          <div className="flex items-start justify-center lg:justify-end">
            <div className="mt-0 lg:-mt-24 w-full max-w-[280px] lg:max-w-[300px] self-start">
              <Carousel index={solutionSlideIndex} onChange={setSolutionSlideIndex} />
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features" eyebrow="Highlights" title="Experiences that matter" bg="bg-white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
          {[
            { t: "Daily Scripture & reflections", d: "Feature description for Daily Scripture & reflections." },
            { t: "Guided journaling", d: "Feature description for Guided journaling." },
            { t: "Reflect with AI", d: "Feature description for Reflect with AI." },
            { t: "Resource hub", d: "Feature description for Resource hub." },
            { t: "Mobile-first + PWA", d: "Feature description for Mobile-first + PWA." },
            { t: "Minimal onboarding", d: "Feature description for Minimal onboarding." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="h-full"
            >
              <GlowCard title={f.t} desc={f.d} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Dev Journey */}
      <Section
        id="dev"
        eyebrow="Dev Journey"
        title="Learning by building"
        kicker="From minimal code knowledge to full-stack delivery."
        bg="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <JourneyCard index={1} title="Starting out" variant="dark">
            Design-first background with minimal code. I mostly tweaked front-end styles in no‑code tools—development
            still felt like a “black box.”
          </JourneyCard>
          <JourneyCard index={2} title="Practice-based learning">
            Learned by shipping. With Cursor, I built small layouts, animations, and components—breaking problems down
            and asking “what if.” Confidence came from doing.
          </JourneyCard>
          <JourneyCard index={3} title="Backend fundamentals">
            To make apps work end‑to‑end I learned:
            <ul className="mt-1 list-disc pl-5">
              <li>Firestore data modeling and reads/writes</li>
              <li>Creating and consuming APIs</li>
              <li>Auth and basic security</li>
              <li>Hosting, deployment, and scalability basics</li>
            </ul>
          </JourneyCard>
          <JourneyCard index={4} title="Full-stack confidence">
            From sketch to production with Next.js, Tailwind, Firebase, and AI APIs—shipping polished, usable products
            on my own.
          </JourneyCard>
        </div>
      </Section>

      {/* Process */}
      <Section
        id="process"
        eyebrow="Process"
        title="Crafting Selah"
        kicker="From sketches to sanctuary."
        bg="bg-white"
      >
        <div className="relative space-y-10">
          <div className="pointer-events-none absolute left-[1.25rem] top-0 bottom-0 w-px bg-zinc-200" />
          <TimelineItem
            n={1}
            title="Planning & Design"
            icon={<span role="img" aria-label="planning">📝</span>}
            desc={<>
              Sketches, flows, and a calm visual identity.
            </>}
          />
          <TimelineItem
            n={2}
            title="Development"
            icon={<span role="img" aria-label="development">🛠️</span>}
            desc={<>
              Next.js, Tailwind, Firebase, and AI integrations.
            </>}
          />
          <TimelineItem
            n={3}
            title="Deployment"
            icon={<span role="img" aria-label="deployment">🚀</span>}
            desc={<>
              Fast, reliable hosting on Vercel.
            </>}
          />
        </div>
      </Section>

      {/* Comparison */}
      <Section
        id="comparison"
        eyebrow="Comparison"
        title="Before and After"
        kicker="Drag or hover to compare"
        bg="bg-white"
      >
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
      </Section>

      {/* Outcome */}
      <Section
        id="outcome"
        eyebrow="Outcome"
        title="Impact in practice"
        kicker="A devotional that meets people where they are."
        bg="bg-white"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <p className="leading-7">
              Selah turns daily devotion into a clear, repeatable routine. People can read the day’s text, capture a
              quick thought, and return later to pick up where they left off—without jumping between apps. Notes are
              saved in context, so past reflections are easy to review and compare over time.
            </p>
            <p className="mt-4 leading-7 text-zinc-700">
              When questions come up, built‑in AI offers summaries or prompts to consider, keeping the focus on the
              passage rather than the tooling. The result is a lightweight flow that helps users stay consistent and
              engaged, whether they have two minutes or twenty.
            </p>
          </motion.div>
          <div className="flex items-start justify-center">
            <div className="relative w-56 md:w-64 aspect-[9/19.5] rounded-[2rem] bg-black p-2 shadow-xl ring-1 ring-zinc-300/30">
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
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section bg="bg-white">
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <h3 className="text-2xl font-semibold text-black">See Selah in action</h3>
          <p className="max-w-xl text-sm text-zinc-600">Explore the live app and the source code below.</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.selahdevotion.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Visit selahdevotion.com
            </a>
            <a
              href="https://github.com/Fredy12Pe/selah-reflect-vercel"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </Section>

      <footer className="py-12 bg-black text-zinc-200">
        <Container>
          <p className="text-center text-xs">© {new Date().getFullYear()} Selah · Case Study by [Your Name]</p>
        </Container>
      </footer>
      </div>
    </div>
  );
}

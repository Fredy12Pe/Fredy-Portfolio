"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { IconUsers, IconFileCertificate, IconVideo } from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";

const DotGrid = dynamic(() => import("../selah-reflect/DotGrid"), { ssr: false });
import heroImg from "./images/Project images/Header.png";
import mobilesImg from "./images/Project images/mobiles.png";
import lofiImg from "./images/Project images/stages/lofi.png";
import midfiImg from "./images/Project images/stages/midfi.png";
import hifiImg from "./images/Project images/stages/hifi.png";
import logoPng from "./images/logo.png";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({
  id,
  eyebrow,
  title,
  kicker,
  children,
  bg = "white",
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
            {eyebrow}
          </div>
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

// Header pills ---------------------------------------------------------------
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
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} width={16} height={16} className="opacity-90" />
    {label}
  </span>
);

// Progress bar ---------------------------------------------------------------
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: "linear-gradient(223deg, #02ADEF 0%, #0B53CD 100%)" }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left"
    />
  );
}

// GlowCard (hover highlight) -------------------------------------------------
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

const GlowCard = ({ title, desc }: { title: string; desc: string }) => {
  const { ref, onMouseMove } = useMouseGradient();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="group relative h-full min-h-[160px] rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow duration-300 hover:shadow-xl"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(59,130,246,0.15), rgba(16,185,129,0.12), rgba(245,158,11,0.12), transparent 40%)",
        }}
      />
      <div className="relative">
        <h4 className="text-base font-semibold text-black">{title}</h4>
        <p className="mt-2 text-sm text-zinc-600">{desc}</p>
      </div>
    </div>
  );
};

// Timeline item --------------------------------------------------------------
function TimelineItem({ n, title, desc, icon }: { n: number; title: string; desc: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="relative pl-14">
      <div className="absolute left-0 top-0 grid w-10 place-items-center">
        <div
          className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white shadow-sm ring-1 ring-white/20"
          style={{ background: "linear-gradient(223deg, #02ADEF 0%, #0B53CD 100%)" }}
        >
          {n}
        </div>
      </div>
      {icon ? <div className="mb-2 text-2xl">{icon}</div> : null}
      <h4 className="text-xl font-semibold text-zinc-900">{title}</h4>
      <div className="mt-2 text-base leading-7 text-zinc-600">{desc}</div>
    </div>
  );
}

// Journey card (text-only variant) ------------------------------------------
function JourneyCard({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="relative group rounded-3xl p-6 shadow-sm ring-1 transition-colors duration-300 bg-white text-zinc-900 ring-zinc-200 hover:bg-zinc-900 hover:text-white hover:ring-zinc-800"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.6 }}
    >
      <div className="text-violet-600 text-xs group-hover:text-violet-300">{`{ ${String(index).padStart(2, "0")} }`}</div>
      <h4 className="mt-3 text-xl font-semibold text-zinc-900 group-hover:text-white transition-colors">{title}</h4>
      <div className="mt-2 text-sm leading-7 text-zinc-600 group-hover:text-white transition-colors">{children}</div>
    </motion.div>
  );
}

// Problem Statement card (minimal) ------------------------------------------
function ProblemCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-zinc-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(223deg, #02ADEF 0%, #0B53CD 100%)" }}
      />
      <div className="relative flex items-start gap-3">
        <div className="mt-1 text-zinc-500 transition-colors group-hover:text-white">{icon}</div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-white">{title}</h4>
          <p className="mt-1 text-sm text-zinc-700 transition-colors group-hover:text-white/90">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function SeaSkyCaseStudyPage() {
  return (
    <div className="min-h-screen bg-white">
      <ProjectNav />
      <main className="bg-white text-zinc-800 pt-16">
        <ProgressBar />
      {/* Hero */}
      <header className="relative isolate overflow-hidden" style={{ background: "linear-gradient(223deg, #02ADEF 0%, #0B53CD 100%)" }}>
        {/* subtle dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 60%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 60%, transparent 100%)",
          }}
        />
        {/* interactive grid */}
        <div className="absolute inset-0 -z-10">
          <DotGrid
            dotSize={6}
            gap={12}
            baseColor="#c5e3ff"
            activeColor="#ffffff"
            baseAlpha={0.06}
            activeAlpha={0.5}
            proximity={130}
            shockRadius={240}
            shockStrength={4}
            returnDuration={1}
          />
        </div>
        <Container>
          <div className="grid items-center gap-8 py-20 sm:grid-cols-2 sm:py-28">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="mt-4 h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full">
                <Image
                  src={logoPng}
                  alt="Sea & Sky logo"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                  priority
                  style={{ transform: "translateZ(0) scale(2.2)", objectPosition: "center" }}
                />
              </div>
              <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">Sea & Sky</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-200">
                An online community built for informing and empowering Hispanic, LatinX, and immigrant students in higher education.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <HeaderPill>Role: Research & UI/UX (solo)</HeaderPill>
                <HeaderPill>Timeline: Feb–Aug 2019</HeaderPill>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <LogoPill src="/stack/figma.svg" alt="Figma" label="Figma" />
                <LogoPill src="/stack/photoshop.svg" alt="Photoshop" label="Photoshop" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="self-start lg:-mt-2">
              <div className="overflow-hidden rounded-2xl origin-top w-full max-w-none h-[320px] md:h-[360px] lg:h-[380px]">
                <Image
                  src={heroImg}
                  alt="Sea & Sky header"
                  className="block w-full h-full object-cover"
                  priority
                  style={{ transform: "translateZ(0) scale(1.6)", objectPosition: "center" }}
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </header>

      {/* Project Brief */}
      <Section id="brief" eyebrow="Project Brief" title="Context" bg="bg-white">
        <div className="max-w-3xl space-y-4">
          <p>
            Sea & Sky is an idea that came into fruition by a group of students who identify as immigrant, Latino, and Hispanic. They were unable to find a place where they could connect with other students who could identify similarly to them.
          </p>
          <p>
            In the following case study, you’ll see the initial design and how it evolved throughout a period of six months.
          </p>
        </div>
      </Section>

      {/* User Persona (moved up for story flow) */}
      <Section id="persona" eyebrow="User Persona" title="Who we designed for" bg="bg-white">
        <div className="rounded-3xl p-5 ring-1 ring-white/10" style={{ background: "linear-gradient(223deg, #02ADEF 0%, #0B53CD 100%)" }}>
          <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
            {/* Profile card */}
            <div className="col-span-1 md:col-span-2 md:row-span-2 rounded-2xl bg-white/20 p-5 ring-1 ring-white/20">
              <h3 className="text-2xl font-bold text-white">Julie</h3>
              <dl className="mt-4 space-y-2 text-sm text-white">
                <div className="flex gap-2"><dt className="font-medium">Age:</dt><dd>20</dd></div>
                <div className="flex gap-2"><dt className="font-medium">Location:</dt><dd>Irvine</dd></div>
                <div className="flex gap-2"><dt className="font-medium">Education:</dt><dd>Undergraduate</dd></div>
              </dl>
              <div className="mt-4 text-xs text-white">
                <div className="font-medium text-white">Personality</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/20 text-white">communicative</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/20 text-white">open minded</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/20 text-white">leadership</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="col-span-1 md:col-span-4 rounded-2xl bg-white/20 p-5 ring-1 ring-white/20">
              <h4 className="text-base font-semibold text-white">Bio</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-white space-y-1">
                <li>Julie was born in Argentina and came to the U.S. as a child.</li>
                <li>Growing up, she wasn’t aware of the burdens of being an immigrant until university.</li>
                <li>At university she struggled to find a group of students who identified similarly.</li>
              </ul>
            </div>

            {/* Goals */}
            <div className="col-span-1 md:col-span-2 rounded-2xl bg-white/20 p-5 ring-1 ring-white/20">
              <h4 className="text-base font-semibold text-white">Goals</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-white space-y-1">
                <li>Create a support group where undocumented students can get help.</li>
                <li>Create resources for undocumented students who cannot afford university fees.</li>
                <li>Graduate as an undocumented and first‑generation student.</li>
              </ul>
            </div>

            {/* Behavior */}
            <div className="col-span-1 md:col-span-2 rounded-2xl bg-white/20 p-5 ring-1 ring-white/20">
              <h4 className="text-base font-semibold text-white">Behavior</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-white space-y-1">
                <li>Works alongside resource groups to provide resources to undocumented students.</li>
                <li>Volunteers for programs that help people who lack resources.</li>
              </ul>
            </div>

            {/* Frustrations */}
            <div className="col-span-1 md:col-span-2 rounded-2xl bg-white/20 p-5 ring-1 ring-white/20">
              <h4 className="text-base font-semibold text-white">Frustrations</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-white space-y-1">
                <li>Wants to create more resource opportunities for students pursuing higher education.</li>
                <li>Struggles to find opportunities catered to undocumented students.</li>
              </ul>
            </div>

            {/* Quote */}
            <div className="col-span-1 md:col-span-4 rounded-2xl bg-white/20 p-5 ring-1 ring-white/20">
              <h4 className="text-base font-semibold text-white">Quote</h4>
              <p className="mt-2 text-sm italic text-white">
                “When I’ve graduated from university, I want to look back and know that I’ve done something to improve the lives of students who are going through the same struggle of being undocumented as I am.”
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Problem Statement */}
      <Section id="problem" eyebrow="Problem Statement" title="What students lacked" bg="bg-white">
        <div className="mb-6 max-w-3xl">
          <h3 className="text-lg font-medium text-zinc-700">
            Three gaps surfaced: community, resources, and motivating media.
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <ProblemCard
            icon={<IconUsers size={22} stroke={1.8} />}
            title="Community"
            text="No platform for community building for immigrant, Latino, and Hispanic students within universities."
          />
          <ProblemCard
            icon={<IconFileCertificate size={22} stroke={1.8} />}
            title="Resources"
            text="Non‑existent singular platform where students can obtain resources such as scholarships, legal aid, and motivation."
          />
          <ProblemCard
            icon={<IconVideo size={22} stroke={1.8} />}
            title="Media"
            text="Non‑existent media content such as videos and podcasts geared to educate and motivate first‑generation, immigrant, Latino, or Hispanic students pursuing degrees in higher education."
          />
        </div>
      </Section>

      {/* Problem & Solution */}
      <Section id="solution" eyebrow="Solution" title="What the app provides" bg="bg-white">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <p>
              The solution is an app that will foster an online community, provide resources, and create content.
            </p>
            <p>
              Community will be fostered through the creation of online profiles with .edu emails that allow students to connect with others in the same university or across different universities.
            </p>
            <p>
              Students can stay up to date with current news through the app; this information is updated based on the student’s location.
            </p>
            <p>
              The media section creates motivation for students by surfacing motivational and informative content.
            </p>
          </div>
          <div className="flex items-start justify-center lg:justify-end">
            <div className="overflow-hidden rounded-2xl self-start w-full max-w-[520px] lg:-mt-20">
              <Image
                src={mobilesImg}
                alt="Sea & Sky mobile screens"
                className="block w-full h-auto object-cover"
                style={{ transform: "translateZ(0) scale(1.06)" }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Highlights */}
      <Section id="highlights" eyebrow="Highlights" title="Experiences that matter" bg="bg-white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
          {[{ t: "Community", d: "Profiles and messaging to find peers and stay connected." }, { t: "Resources", d: "Scholarships, legal aid, and campus services in one place." }, { t: "Media", d: "Motivational videos and podcasts tailored to students." }, { t: "Events", d: "Campus and community events surfaced by location." }, { t: "Onboarding", d: ".edu verification for a trusted student network." }, { t: "Mobile-first", d: "Designed for quick, daily check-ins on the go." }].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="h-full">
              <GlowCard title={f.t} desc={f.d} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Design Stages */}
      <Section id="lofi" eyebrow="Design Stage" title="Low‑fidelity mockups" bg="bg-white">
        <div className="flex justify-center">
          <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white max-w-5xl w-full">
            <Image
              src={lofiImg}
              alt="Low fidelity mockups"
              className="block w-full h-auto object-contain"
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
            />
          </div>
        </div>
      </Section>

      <Section id="midfi" eyebrow="Design Stage" title="Mid‑fidelity mockups" bg="bg-white">
        <div className="flex justify-center">
          <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white max-w-5xl w-full">
            <Image
              src={midfiImg}
              alt="Mid fidelity mockups"
              className="block w-full h-auto object-contain"
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
            />
          </div>
        </div>
      </Section>

      <Section id="hifi" eyebrow="Design Stage" title="High‑fidelity mockups" bg="bg-white">
        <div className="flex justify-center">
          <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white max-w-5xl w-full">
            <Image
              src={hifiImg}
              alt="High fidelity mockups"
              className="block w-full h-auto object-contain"
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
            />
          </div>
        </div>
      </Section>

      {/* Dev Journey removed for non‑dev case study */}

      {/* Process */}
      <Section id="process" eyebrow="Process" title="Crafting Sea & Sky" kicker="From research to release." bg="bg-white">
        <div className="relative space-y-10">
          <div className="pointer-events-none absolute left-[1.25rem] top-0 bottom-0 w-px bg-zinc-200" />
          <TimelineItem n={1} title="Research & Discovery" icon={<span role="img" aria-label="planning">📝</span>} desc={<><p>User interviews and scans of existing student communities.</p></>} />
          <TimelineItem n={2} title="Design & Prototyping" icon={<span role="img" aria-label="development">🛠️</span>} desc={<><p>Information architecture and mobile-first flows with clear, calm visuals.</p></>} />
          <TimelineItem n={3} title="Iteration & Validation" icon={<span role="img" aria-label="deployment">🚀</span>} desc={<><p>Refined copy, edge cases, and accessibility to improve comprehension.</p></>} />
        </div>
      </Section>

      {/* Logo section removed per request */}

      <Section id="learnings" eyebrow="Learnings & Outcomes" title="What I learned" bg="bg-white">
        <div className="space-y-4">
          <p>
            The idea of the Sea & Sky app was created out of necessity: students who identify as undocumented needed a space designed for them.
          </p>
          <p>
            Coming from a graphic design background with limited UI and UX experience, this was a learning journey. I didn’t fully know the rules of UI/UX, but by taking on the challenge I learned the fundamentals while building the app.
          </p>
          <p>
            A key challenge was prioritizing the problem over visual polish. At times I focused on aesthetics more than effectiveness. Through iteration, I adjusted the design to solve the underlying problems.
          </p>
          <p>
            There was a lot of learning from this project—and as the saying goes: you learn and grow from your mistakes. Thanks for reading this case study!
          </p>
        </div>
      </Section>
      {/* CTA */}
      <Section bg="bg-white">
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <h3 className="text-2xl font-semibold text-black">Interested in more work?</h3>
          <p className="max-w-xl text-sm text-zinc-600">Explore other case studies or reach out for a walkthrough.</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800">Back to home</Link>
          </div>
        </div>
      </Section>

      <footer className="py-12 bg-black text-zinc-200">
        <Container>
          <p className="text-center text-xs">© {new Date().getFullYear()} Sea & Sky · Case Study</p>
        </Container>
      </footer>
      </main>
    </div>
  );
}



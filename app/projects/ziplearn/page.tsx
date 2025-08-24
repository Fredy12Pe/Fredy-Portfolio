"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CardSpotlight } from "../../../components/ui/card-spotlight";
import heroRef from "./images/Header img.png";
import processRef from "./images/02.png";
import midFidelity from "./images/mid-fi mockups.png";
import empathyRef from "./images/04.png";
import highFidelity from "./images/high-fi mockups.png";
import researchQualImg from "./images/research-qualitative.png";
import userPersonas from "./images/user-personas.png";
import mobile1 from "./images/app screens/Mobile 1.png";
import mobile2 from "./images/app screens/Mobile 2.png";
import mobile3 from "./images/app screens/Mobile 3.png";
import mobile4 from "./images/app screens/Mobile 4.png";
import mobile5 from "./images/app screens/Mobile 5.png";
import mobile6 from "./images/app screens/Mobile 6.png";
const DotGrid = dynamic(() => import("../selah-reflect/DotGrid"), { ssr: false });

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
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-10"
      >
        {children}
      </motion.div>
    </Container>
  </section>
);

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, background: "linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)" }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left"
    />
  );
}

function SlideInPhone({ children, from }: { children: React.ReactNode; from: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 20%"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]);
  return (
    <motion.div
      ref={ref}
      style={{ y, scale, willChange: "transform" }}
      initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function ZipLearnCaseStudyPage() {
  return (
    <main className="bg-white text-zinc-800">
      <ProgressBar />
      {/* Hero */}
      <header className="relative isolate overflow-hidden" style={{ background: "linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)" }}>
        {/* static dotted mask */}
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
            baseColor="#cbb3ff"
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
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">Concept Case Study</div>
              <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">ZipLearn</h1>
              <h3 className="mt-3 text-xl font-semibold text-white">Personal Online Tutoring iOS App</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-100">ZipLearn helps students find and book private tutors for their subjects with flexible, online sessions that fit busy schedules.</p>
              <p className="mt-1 max-w-xl text-xs text-zinc-100/80 italic">Concept exploration — this is not a shipped product.</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 ring-1 ring-white/15">
                  Role: UI/UX Designer & Researcher
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 ring-1 ring-white/15">
                  Timeline: 2 months
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 ring-1 ring-white/15">
                  <span className="h-4 w-4 rounded-sm bg-transparent ring-1 ring-white/50" /> Figma
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 ring-1 ring-white/15">
                  <span className="h-4 w-4 rounded-sm bg-transparent ring-1 ring-white/50" /> Photoshop
                </span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="self-start">
              <div className="overflow-hidden rounded-2xl origin-top w-full max-w-[820px] h-[440px] md:h-[520px] lg:h-[600px]">
                <Image
                  src={heroRef}
                  alt="ZipLearn hero devices"
                  className="block w-full h-full object-cover"
                  priority
                  style={{ transform: "translateZ(0) scale(1.62)", objectPosition: "center" }}
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </header>

      {/* Project Brief */}
      <Section id="brief" bg="bg-white">
        <CardSpotlight
          className="rounded-3xl px-6 md:px-8 py-16 md:py-20 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(126,86,223,0.35)] backdrop-blur-sm"
          backgroundColor="linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)"
        >
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">Project Brief</div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Challenge &amp; Goal</h2>
            <p className="text-sm text-white/80 italic">This is a concept project intended to explore flows and UX—not a production release.</p>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Challenge</h3>
              <p className="text-zinc-100">
                Students often need extra support outside class but can’t meet private tutors due to busy schedules and extracurriculars. Parents face high costs for private tutoring.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">The Goal</h3>
              <p className="text-zinc-100">
                Design an accessible, inclusive mobile app that lets families hire private tutors for online sessions. Also create opportunity for teachers to earn extra income by tutoring students from their schools.
              </p>
            </div>
          </div>
        </CardSpotlight>
      </Section>

      {/* Key Insights */}
      <Section id="insights" eyebrow="Key Insights" title="What we heard" bg="bg-white">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { t: "Cost barriers", d: "Parents signal price sensitivity; teens lack funds for private sessions." },
            { t: "Willingness to pay", d: "Families hesitate to subscribe or pay per session without clear value." },
            { t: "Coverage gaps", d: "Interviews surfaced limited subject diversity across available tutors." },
          ].map((item, i) => (
            <div key={i} className="group relative h-full overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-zinc-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)" }}
              />
              <div className="relative">
                <h4 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-white">{item.t}</h4>
                <p className="mt-1 text-sm text-zinc-700 transition-colors group-hover:text-white/90">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Research Overview */}
      <Section id="research" eyebrow="Research Overview" title="Qualitative research and personas" bg="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2">
            <Image src={researchQualImg} alt="Qualitative research summary" className="block w-full h-auto max-h-[520px] object-contain" />
          </div>
          <div className="overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2">
            <Image src={userPersonas} alt="Primary personas" className="block w-full h-auto max-h-[520px] object-contain" />
          </div>
        </div>
      </Section>


      {/* Solution */}
      <Section id="solution" bg="bg-white">
        <CardSpotlight
          className="rounded-3xl px-6 md:px-8 py-16 md:py-20 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(126,86,223,0.35)] backdrop-blur-sm"
          backgroundColor="linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)"
        >
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-start">
            <div className="flex justify-end">
              <div className="w-full max-w-md space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">Concept Solution</div>
                <h2 className="text-3xl font-bold tracking-tight text-white">What the product provides</h2>
              </div>
            </div>
            <div />
          </div>
          <div className="mt-6">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-start">
              <div className="flex justify-end">
                <div className="w-full max-w-md space-y-4">
                  <p className="text-zinc-100">
                    ZipLearn connects students with vetted tutors for flexible, online sessions.<br /> Students browse tutor bios, schedule sessions, and join directly in-app.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-zinc-100/90 space-y-2">
                    <li>Flexible scheduling aligned to busy calendars</li>
                    <li>School‑linked tutors and subject coverage</li>
                    <li>Clear reviews and bios for informed selection</li>
                  </ul>
                </div>
              </div>
              <div />
            </div>
            {/* App screens narrative */}
            <div className="space-y-10">
              {/* 1 */}
              <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                <div className="flex justify-end">
                  <div className="w-full max-w-md rounded-2xl bg-white/10 p-4 md:p-6 ring-1 ring-white/10 min-h-[180px] md:min-h-[200px]">
                    <h3 className="text-xl font-semibold text-white">Home Screen</h3>
                    <p className="mt-2 text-sm text-zinc-100/90">Use home screen for an easy journey to start. Choose to hire a tutor, collaborate with other students, or watch online tutorials for 30+ sujects. Use the search bar to help you precisely find what you are exactly looking for.</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <SlideInPhone from="right">
                    <div className="overflow-hidden rounded-2xl h-[440px] inline-flex items-center justify-center">
                      <Image src={mobile1} alt="Home screen" className="block h-full w-auto object-contain" />
                    </div>
                  </SlideInPhone>
                </div>
              </div>
              {/* 2 */}
              <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                <div className="order-2 lg:order-1 flex justify-end">
                  <SlideInPhone from="left">
                    <div className="overflow-hidden rounded-2xl h-[440px] inline-flex items-center justify-center">
                      <Image src={mobile2} alt="Videos/Tutors and Filters" className="block h-full w-auto object-contain" />
                    </div>
                  </SlideInPhone>
                </div>
                <div className="order-1 lg:order-2 flex justify-start">
                  <div className="w-full max-w-md rounded-2xl bg-white/10 p-4 md:p-6 ring-1 ring-white/10 min-h-[180px] md:min-h-[200px]">
                    <h3 className="text-xl font-semibold text-white">Videos/Tutors</h3>
                    <p className="mt-2 text-sm text-zinc-100/90">In this section of the app, you must choose a subject. Once subject has been chosen, you must choose whether you want to watch tutorials or set up a tutoring session.</p>
                  </div>
                </div>
              </div>
              {/* 3 */}
              <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                <div className="flex justify-end">
                  <div className="w-full max-w-md rounded-2xl bg-white/10 p-4 md:p-6 ring-1 ring-white/10 min-h-[180px] md:min-h-[200px]">
                    <h3 className="text-xl font-semibold text-white">Tutors & Bio</h3>
                    <p className="mt-2 text-sm text-zinc-100/90">Once you have chosen your subject you can choose a tutor. Once you press on a tutor, you will be led to a page that gives you information about the tutor so you can decide for yourself if they are a good fit for your academic needs.</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <SlideInPhone from="right">
                    <div className="overflow-hidden rounded-2xl h-[440px] inline-flex items-center justify-center">
                      <Image src={mobile3} alt="Tutor profile" className="block h-full w-auto object-contain" />
                    </div>
                  </SlideInPhone>
                </div>
              </div>
              {/* 4 */}
              <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                <div className="order-2 lg:order-1 flex justify-end">
                  <SlideInPhone from="left">
                    <div className="overflow-hidden rounded-2xl h-[440px] inline-flex items-center justify-center">
                      <Image src={mobile4} alt="Scheduling" className="block h-full w-auto object-contain" />
                    </div>
                  </SlideInPhone>
                </div>
                <div className="order-1 lg:order-2 flex justify-start">
                  <div className="w-full max-w-md rounded-2xl bg-white/10 p-4 md:p-6 ring-1 ring-white/10 min-h-[180px] md:min-h-[200px]">
                    <h3 className="text-xl font-semibold text-white">Tutoring Sessions</h3>
                    <p className="mt-2 text-sm text-zinc-100/90">When you are ready to set-up a tutoring session. Check on the tutor’s calendar and their availability. Once you find an available time slot, you can go through the application process and set up a tutoring session.</p>
                  </div>
                </div>
              </div>
              {/* 5 */}
              <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                <div className="flex justify-end">
                  <div className="w-full max-w-md rounded-2xl bg-white/10 p-4 md:p-6 ring-1 ring-white/10 min-h-[180px] md:min-h-[200px]">
                    <h3 className="text-xl font-semibold text-white">In‑session Experience</h3>
                    <p className="mt-2 text-sm text-zinc-100/90">Join your tutoring session seamlessly with built‑in video and chat. Share notes and files with your tutor in real time, annotate concepts together, and keep all materials saved for later review. Each session ends with clear action items so you know exactly what to practice before your next meeting.</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <SlideInPhone from="right">
                    <div className="overflow-hidden rounded-2xl h-[440px] inline-flex items-center justify-center">
                      <Image src={mobile5} alt="In-session experience" className="block h-full w-auto object-contain" />
                    </div>
                  </SlideInPhone>
                </div>
              </div>
              {/* 6 */}
              <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                <div className="order-2 lg:order-1 flex justify-end">
                  <SlideInPhone from="left">
                    <div className="overflow-hidden rounded-2xl h-[440px] inline-flex items-center justify-center">
                      <Image src={mobile6} alt="Notifications and completion" className="block h-full w-auto object-contain" />
                    </div>
                  </SlideInPhone>
                </div>
                <div className="order-1 lg:order-2 flex justify-start">
                  <div className="w-full max-w-md rounded-2xl bg-white/10 p-4 md:p-6 ring-1 ring-white/10 min-h-[180px] md:min-h-[200px]">
                    <h3 className="text-xl font-semibold text-white">Congratulations!</h3>
                    <p className="mt-2 text-sm text-zinc-100/90">This is the screen that will pop up once you have successfully signed up for a tutoring session with an instrucxtor/tutor. After this, you can go back to the main screen to watch tutorials or do other activities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardSpotlight>
      </Section>


      {/* Design Stages */}
      <Section id="stages" eyebrow="Design Stage" title="Design evolution" bg="bg-white">
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Mid‑fidelity mockups</h3>
            <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white">
              <Image src={midFidelity} alt="Personas and mid-fidelity" className="block w-full h-auto object-contain" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">High‑fidelity mockups</h3>
            <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white">
              <Image src={highFidelity} alt="Brand identity and high-fidelity" className="block w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section id="process" eyebrow="Process" title="ZipLearn Design Process" kicker="From research to release." bg="bg-white">
        <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white">
          <Image src={processRef} alt="Design process" className="block w-full h-auto object-contain" />
        </div>
      </Section>

      {/* Learnings */}
      <Section id="learnings" eyebrow="Concept Learnings" title="What I explored" bg="bg-white">
        <p className="max-w-3xl">
          As a concept, ZipLearn let me test assumptions without the constraints of production scope. Through interviews and lightweight prototypes, I saw that cost and time were only surface problems—the deeper friction was uncertainty. Students and parents weren’t sure who to trust, when sessions could actually happen, or what value they’d get from the first booking. By surfacing availability, subject fit, and reviews earlier, and by turning the journey into a series of clear, single decisions, the experience felt more approachable. These explorations also highlighted how much reassurance comes from tight copy and unambiguous states: what happens before, during, and after a session. If this moved toward production, I’d validate pricing cues, add more transparent tutor metrics, and refine scheduling to better reflect real-world constraints.
        </p>
      </Section>
    </main>
  );
}



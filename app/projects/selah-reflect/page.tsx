"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { Compare } from "@/components/ui/compare";
import BoardNav from "../board/BoardNav";
import OtherProjects from "@/components/sections/OtherProjects";
import { RevealBlock } from "../grove/Reveal";
import {
  BODY,
  CARD,
  SECTION,
  CaseFooter,
  CaseHero,
  Constraints,
  DecisionBlock,
  Eyebrow,
  H2,
  HowIBuiltIt,
  NextProject,
  ProblemCards,
  Results,
  RoleAndTeam,
  Shot,
  WhereItStands,
  type Theme,
} from "../case-study/kit";
import heroImg from "./images/headerImg.png";
import imgDevotionalHub from "./images/DevotionalHub.png";
import imgHymn from "./images/Hymn.png";
import imgReflect from "./images/Reflect.png";
import imgScriptureOverview from "./images/scriptureOverview.png";
import compImgBefore from "./images/comparison/Group 2.png";
import compImgAfter from "./images/comparison/Group 3.png";

// The Selah Reflect case study, in the same running order as the Samples Store and Grove pages.

const compVideoUrl = "/videos/selahRecord.mp4";

const THEME: Theme = {
  ink: "#6d4aff",
  tint: "#EFEBFF",
  chip: "#DDD5FF",
  gradient: "linear-gradient(223deg, #6d4aff 0%, #2b2266 100%)",
};

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


/* The app recording in a phone frame; it plays only while on screen */
function PhoneClip() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="relative aspect-[9/19.5] w-48 rounded-[2rem] bg-black p-2 shadow-xl ring-1 ring-zinc-300/30 md:w-52">
      <div className="absolute left-1/2 top-2 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-black" />
      <div className="h-full w-full overflow-hidden rounded-[1.6rem] bg-black">
        <video className="h-full w-full object-cover" loop muted playsInline preload="metadata" src={compVideoUrl} ref={videoRef} aria-label="Selah app recording" />
      </div>
    </div>
  );
}

export default function SelahCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="bg-zinc-50 pb-12 pt-16 text-zinc-800">
        <CaseHero
          theme={THEME}
          kicker="Selah . Live . 2025"
          title="A focused daily devotional"
          summary="I designed and built Selah, a mobile-first web app that turns my church's PDF devotionals into daily reading, quick journaling and optional AI reflection in one place."
          meta={[
            { label: "Timeline", values: ["2.5 Weeks"] },
            { label: "Roles", values: ["UI/UX Designer", "Full-stack Developer"] },
            { label: "Stack", values: ["Next.js", "Tailwind", "Firebase", "OpenAI", "Gemini"] },
            { label: "Status", values: ["Live"] },
          ]}
          stats={[
            ["~92%", "Completed a daily devotional in testing"],
            ["Seconds", "To start reading, down from minutes"],
            ["1 app", "Instead of PDFs, journals and apps"],
          ]}
          image={heroImg}
          imageAlt="Selah shown on a phone"
          cta={{ href: "https://www.selahdevotion.com", label: "Check out live site" }}
        />

        {/* Research */}
        <RevealBlock as="section" from="left" className={SECTION}>
          <div className="grid items-start gap-10 md:grid-cols-[3fr_2fr]">
            <div>
              <Eyebrow>The problem</Eyebrow>
              <H2>The Challenge: devotions that lived in a Dropbox PDF</H2>
              <div className={`mt-6 space-y-4 ${BODY}`}>
                <p>
                  At my church, daily devotions lived inside a Dropbox PDF. To take part, members juggled tablets, paper
                  journals and pinch-zoomed screens. Reflection was possible, but hardly inviting.
                </p>
                <p>
                  I watched how members used it and talked with them about their routine. Annotating the PDF was awkward,
                  there was no way to add notes or search past reflections, and the one rigid format made it hard to keep
                  going day after day.
                </p>
              </div>
            </div>
            <Shot src={compImgBefore} alt="A page of the original devotional PDF" caption="Before: the original Dropbox PDF" sizes="(min-width: 768px) 420px, 100vw" />
          </div>
        </RevealBlock>

        <ProblemCards
          theme={THEME}
          title="Problems members kept running into"
          items={[
            {
              title: "Reading",
              problem: "The PDF had to be pinch-zoomed on a phone, and finding today's passage took minutes.",
              fix: "The PDF is parsed into structured data, so today's passage opens first, in clean type sized for a phone.",
            },
            {
              title: "Journaling",
              problem: "Notes lived in a separate paper journal or app, away from the passage they were about.",
              fix: "Reflection questions sit under the passage, with journal entries saved in context and easy to find later.",
            },
            {
              title: "Going deeper",
              problem: "When a passage raised questions, there was nowhere to explore it without leaving the devotional.",
              fix: "An optional Reflect with AI step offers interpretation, application and prompts, without crowding the page.",
            },
          ]}
          takeaway="the content was already good. The friction was the format, so Selah keeps the church's words and changes how people reach them."
        />

        <RoleAndTeam
          theme={THEME}
          columns={[
            { head: "I owned", items: ["Research with church members", "Flows, visual identity and UI", "Front end, Firebase data and auth", "AI integrations and deployment on Vercel"] },
            { head: "Others owned", items: ["Church leaders wrote the devotional content", "Members tested the app and gave feedback"] },
          ]}
        />

        <Constraints items={["2.5 weeks", "Solo designer and developer", "Content arrives as PDFs", "First full-stack build", "No budget"]} />

        <DecisionBlock
          title="Parse the PDF instead of replacing it"
          rows={[
            { k: "Insight", v: "Church leaders already wrote and shared devotionals as PDFs, and that wasn't going to change." },
            { k: "Chosen", v: "Parse each PDF into structured JSON, so the app gets clean, searchable content with no new work for the writers." },
            { k: "Rejected", v: "An editor for leaders to retype content. More control, but it adds work for volunteers." },
            { k: "Trade-off", v: "Parsing breaks when the PDF layout changes, so it needs checking each month." },
          ]}
          visual={<div className="mx-auto max-w-[340px]"><Shot src={imgDevotionalHub} alt="The Daily Devotional Hub screen" caption="The daily hub, built from the parsed PDF" sizes="340px" /></div>}
        />
        <DecisionBlock
          title="AI as an option, not the centre"
          rows={[
            { k: "Insight", v: "Members wanted help with hard passages, but didn't want a chatbot between them and Scripture." },
            { k: "Chosen", v: "A separate, optional Reflect with AI step that gives context and prompts, then saves to history." },
            { k: "Trade-off", v: "Fewer people discover the AI step, in exchange for a calmer reading page." },
          ]}
          reverse
          visual={
            <div className="flex flex-col items-center rounded-[24px] p-6 sm:p-10" style={{ background: THEME.tint }}>
              <div style={{ aspectRatio: compImgBefore.width / compImgBefore.height, width: "min(100%, 420px)" }}>
                <Compare className="h-full w-full" firstImage={compImgBefore.src} secondImage={compImgAfter.src} slideMode="drag" showHandlebar autoplay={false} />
              </div>
              <p className="mt-4 text-center text-sm text-zinc-600">Before and after. Drag to compare.</p>
            </div>
          }
        />

        {/* Screens */}
        <RevealBlock as="section" className={SECTION}>
          <Eyebrow>Solution</Eyebrow>
          <H2>The solution, screen by screen</H2>
          <p className={`mt-4 max-w-3xl ${BODY}`}>
            Read the day&apos;s passage, capture a quick thought and come back later to pick up where you left off. Tap
            through the screens below.
          </p>
          <div className={`mt-8 ${CARD}`}>
            <SolutionShowcase />
          </div>
          <p className="mt-6 text-[15px] leading-6 text-zinc-700">
            Accessibility: a 16px minimum base font with generous line spacing for reading, semantic headings and a clear
            focus order, and a calm palette with AA contrast for scripture text.
          </p>
        </RevealBlock>

        <Results
          theme={THEME}
          intro="From prototype testing with church members."
          items={[
            { value: "~92%", text: "started and completed a daily devotional", source: "Prototype testing" },
            { value: "Seconds", text: "to start reading, down from minutes in the PDF", source: "Prototype testing" },
            { value: "Faster", text: "testers called it faster and more motivating than the PDF", source: "Tester feedback" },
          ]}
        />

        <HowIBuiltIt
          theme={THEME}
          timeline={[
            { t: "Planning and design", d: "Sketches, flows and a calm visual identity." },
            { t: "Development", d: "Next.js, Tailwind, Firebase and AI integrations." },
            { t: "Deployment", d: "Hosted on Vercel as an installable web app." },
          ]}
          tools="Next.js, Tailwind CSS, Firebase, OpenAI, Gemini, Cursor, Vercel"
          wentWrong="I came in with almost no back-end experience, so data modelling, auth and APIs took most of the time. Parsing the PDFs reliably took more passes than planned."
          extra={
            <div>
              <p className="mb-4 text-[15px] font-medium text-zinc-800">Learning by building: from minimal code to full-stack delivery</p>
              <FluidCardStack />
            </div>
          }
        />

        <WhereItStands
          stands={
            <>
              Live at selahdevotion.com and used by members of my church.{" "}
              <a href="https://github.com/Fredy12Pe/selah-reflect-vercel" target="_blank" rel="noreferrer" className="underline">
                Code on GitHub
              </a>
              .
            </>
          }
          change="Automate checks on the PDF parsing, add search across past reflections, and test with members earlier in the build."
          measure="How many members complete a devotional on most days of the week, and how often they use journaling."
        />

        <RevealBlock as="section" className={`${SECTION} flex justify-center`}>
          <PhoneClip />
        </RevealBlock>

        <NextProject href="/projects/tidehaus" name="Tidehaus" />
        <OtherProjects currentProject="selah" />
        <CaseFooter />
      </main>
    </div>
  );
}

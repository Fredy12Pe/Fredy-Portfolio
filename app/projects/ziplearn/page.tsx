"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
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

// The ZipLearn case study, in the same running order as the Samples Store and Grove pages.

const THEME: Theme = {
  ink: "#6A32F9",
  tint: "#F0EBFE",
  chip: "#E0D5FD",
  gradient: "linear-gradient(223deg, #6A32F9 0%, #4F5A79 100%)",
};

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


export default function ZipLearnCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="bg-zinc-50 pb-12 pt-16 text-zinc-800">
        <CaseHero
          theme={THEME}
          kicker="ZipLearn . Concept . iOS"
          title="Making private tutoring easy to find and book"
          summary="I designed ZipLearn, a concept iOS app that helps students find, vet and book online tutors around busy schedules, with clear bios, reviews and verified credentials."
          meta={[
            { label: "Timeline", values: ["2 Months"] },
            { label: "Roles", values: ["UI/UX Designer", "Researcher"] },
            { label: "Team", values: ["Solo"] },
            { label: "Status", values: ["Concept"] },
          ]}
          stats={[
            ["~90%", "Booked a tutor in 2 minutes or less"],
            ["~70%", "More confident with credentials shown"],
            ["80%", "Struggled with trust and discovery"],
          ]}
          image={heroRef}
          imageAlt="ZipLearn shown on phones"
          imageClassName="xl:scale-[1.6]"
        />

        {/* Research */}
        <RevealBlock as="section" from="left" className={SECTION}>
          <div className="max-w-3xl">
            <Eyebrow>The problem</Eyebrow>
            <H2>The Challenge: support outside class that families could actually use</H2>
            <div className={`mt-6 space-y-4 ${BODY}`}>
              <p>
                Students often need extra help outside class, but busy schedules and extracurriculars make it hard to meet
                a private tutor. Parents face high costs, and finding someone they trust is slow and manual.
              </p>
              <p>
                I interviewed parents and students. 80% said trust and discovery were their biggest struggle: they didn&apos;t
                know who to pick, when sessions could happen, or what they&apos;d get from a first booking.
              </p>
            </div>
          </div>
          <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
            <Shot src={researchQualImg} alt="Summary of the qualitative research" caption="Qualitative research with parents and students" />
            <Shot src={userPersonas} alt="Primary personas" caption="The personas I designed for" />
          </div>
        </RevealBlock>

        <ProblemCards
          theme={THEME}
          eyebrow="What we heard"
          title="Three friction points from research"
          items={[
            {
              title: "Cost barriers",
              problem: "Parents are price-sensitive, and teens don't have money for private sessions.",
              fix: "School-linked tutors, including teachers earning extra income, keep sessions closer to home and easier to afford.",
            },
            {
              title: "Willingness to pay",
              problem: "Families hesitate to subscribe or pay per session without seeing clear value first.",
              fix: "Free tutorial videos sit beside booking, so families get value before paying for a session.",
            },
            {
              title: "Coverage gaps",
              problem: "Interviews surfaced limited subject variety across the tutors families could find.",
              fix: "Browsing by subject across 30+ subjects, with filters, makes it easy to see who covers what.",
            },
          ]}
          takeaway="cost and time were surface problems. The deeper friction was uncertainty, so the design focuses on showing trust signals and availability early."
        />

        <RoleAndTeam
          theme={THEME}
          columns={[
            { head: "I owned", items: ["Interviews with parents and students", "Personas and user flows", "Wireframes, mid- and high-fidelity screens", "Branding and prototype testing"] },
            { head: "Others owned", items: ["Solo concept project, with feedback from interviewees and test participants"] },
          ]}
        />

        <Constraints items={["Concept, not shipped", "2 months", "Solo designer", "Small interview pool", "iOS first"]} />

        <DecisionBlock
          title="Trust signals up front"
          rows={[
            { k: "Insight", v: "Families weren't sure who to trust, so price alone wasn't the real blocker." },
            { k: "Chosen", v: "Tutor bios, reviews and verified credentials on every profile, shown before scheduling." },
            { k: "Trade-off", v: "Longer profile pages, and a vetting process tutors would need to go through." },
          ]}
          visual={<Shot src={midFidelity} alt="Mid-fidelity mockups" caption="Mid-fidelity mockups" />}
        />
        <DecisionBlock
          title="One clear decision per screen"
          rows={[
            { k: "Insight", v: "Booking felt risky when too many choices came at once." },
            { k: "Chosen", v: "Subject, then tutor, then time slot, then confirm: one step at a time with plain copy at each state." },
            { k: "Rejected", v: "A single dense search-and-book screen. It was faster on paper but harder to trust." },
            { k: "Trade-off", v: "More taps to book, in exchange for fewer wrong bookings." },
          ]}
          reverse
          visual={<Shot src={highFidelity} alt="Brand identity and high-fidelity mockups" caption="High-fidelity mockups and brand" />}
        />

        {/* Screens */}
        <RevealBlock as="section" className={SECTION}>
          <Eyebrow>Solution</Eyebrow>
          <H2>The solution, screen by screen</H2>
          <p className={`mt-4 max-w-3xl ${BODY}`}>
            Students browse tutor bios, schedule a session and join it in the app. Tap through the screens below.
          </p>
          <div className={`mt-8 ${CARD}`}>
            <AppScreenShowcase />
          </div>
          <p className="mt-6 text-[15px] leading-6 text-zinc-700">
            Accessibility: forms have labels, error states and help text for screen readers; success and error states pair
            colour with an icon; and focus order follows the booking flow.
          </p>
        </RevealBlock>

        <Results
          theme={THEME}
          intro="ZipLearn is a concept, so these come from interviews and prototype testing, not live use."
          items={[
            { value: "~90%", text: "scheduled a tutor in 2 minutes or less", source: "Prototype testing" },
            { value: "~70%", text: "felt more confident booking with reviews and credentials shown", source: "Prototype testing" },
            { value: "~1 hr/wk", text: "projected time saved versus searching manually", source: "Projection from interviews" },
          ]}
        />

        <HowIBuiltIt
          theme={THEME}
          timeline={[
            { t: "Research", d: "Interviews with parents and students, then personas." },
            { t: "Mid-fidelity", d: "User flows and mid-fidelity screens for browsing and booking." },
            { t: "High-fidelity and brand", d: "Visual identity and high-fidelity screens in Figma." },
            { t: "Prototype testing", d: "Tested the booking flow and refined copy and states." },
          ]}
          tools="Figma, Photoshop"
          wentWrong="The interview pool was small, so the numbers are directional. Pricing was never tested, and that was the biggest open question from research."
          extra={<Shot src={processRef} alt="The ZipLearn design process" caption="The design process, from research to release" />}
        />

        <WhereItStands
          stands="A complete concept with a tested prototype. It is not a shipped product."
          change="Test pricing cues early, show more transparent tutor metrics, and make scheduling reflect real-world constraints like time zones and cancellations."
          measure="How many first-time visitors book a session, and how many come back for a second."
        />

        <NextProject href="/projects/sea-and-sky" name="Sea & Sky" />
        <OtherProjects currentProject="ziplearn" />
        <CaseFooter />
      </main>
    </div>
  );
}

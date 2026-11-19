"use client";

import BoardNav from "../board/BoardNav";
import OtherProjects from "@/components/sections/OtherProjects";
import { RevealBlock } from "../grove/Reveal";
import {
  BODY,
  CARD,
  LABEL,
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
import heroImg from "./images/Project images/Header.png";
import mobilesImg from "./images/Project images/mobiles.png";
import lofiImg from "./images/Project images/stages/lofi.png";
import midfiImg from "./images/Project images/stages/midfi.png";
import hifiImg from "./images/Project images/stages/hifi.png";

// The Sea & Sky case study, in the same running order as the Samples Store and Grove pages.

const THEME: Theme = {
  ink: "#0B53CD",
  tint: "#E8F5FE",
  chip: "#CBE9FC",
  gradient: "linear-gradient(223deg, #02ADEF 0%, #0B53CD 100%)",
};

const PERSONA: [string, string[]][] = [
  ["Background", ["Born in Argentina, came to the U.S. as a child.", "Wasn't aware of the burdens of being an immigrant until university.", "Struggled to find students who identified similarly."]],
  ["Goals", ["Create a support group where undocumented students can get help.", "Create resources for students who can't afford university fees.", "Graduate as an undocumented, first-generation student."]],
  ["Frustrations", ["Struggles to find opportunities for undocumented students.", "Wants more resources for students pursuing higher education."]],
];

const FEATURES = [
  { t: "Community", d: "Profiles and messaging to find peers and stay connected." },
  { t: "Resources", d: "Scholarships, legal aid and campus services in one place." },
  { t: "Media", d: "Motivational videos and podcasts made for these students." },
  { t: "Events", d: "Campus and community events, shown by location." },
  { t: "Onboarding", d: ".edu verification for a trusted student network." },
  { t: "Mobile-first", d: "Built for quick, daily check-ins on the go." },
];

export default function SeaAndSkyCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="bg-zinc-50 pb-12 pt-16 text-zinc-800">
        <CaseHero
          theme={THEME}
          kicker="Sea & Sky . Concept . iOS"
          title="A home online for immigrant students"
          summary="I designed Sea & Sky, an online community that informs and empowers Hispanic, Latinx and immigrant students in higher education, with peers, resources and media in one app."
          meta={[
            { label: "Timeline", values: ["6 Months"] },
            { label: "Roles", values: ["UI/UX Designer", "Researcher"] },
            { label: "Team", values: ["Solo"] },
            { label: "Status", values: ["Concept"] },
          ]}
          stats={[
            ["60%+", "Projected faster resource discovery"],
            ["1 app", "For community, resources and media"],
            ["6 months", "From sketches to high fidelity"],
          ]}
          image={heroImg}
          imageAlt="Sea & Sky shown on phones"
          imageClassName="xl:scale-[1.5]"
        />

        {/* Research */}
        <RevealBlock as="section" from="left" className={SECTION}>
          <div className="max-w-3xl">
            <Eyebrow>The problem</Eyebrow>
            <H2>The Challenge: no place to find people like them</H2>
            <div className={`mt-6 space-y-4 ${BODY}`}>
              <p>
                Sea &amp; Sky started with a group of students who identify as immigrant, Latino and Hispanic. They couldn&apos;t
                find a place to connect with other students like them, or one place for the scholarships, legal aid and
                support they needed.
              </p>
              <p>I talked with students and looked at existing student communities, then built a persona around what I heard.</p>
            </div>
          </div>
          <div className="mt-10 rounded-[24px] p-6 sm:p-10" style={{ background: THEME.tint }}>
            <p className="text-[20px] font-medium" style={{ color: THEME.ink }}>Julie, the student I designed for</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {PERSONA.map(([head, items]) => (
                <div key={head}>
                  <p className={LABEL}>{head}</p>
                  <ul className="mt-3 space-y-2 text-[15px] leading-6 text-zinc-800">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[17px] italic leading-7 text-zinc-800">
              &ldquo;When I&apos;ve graduated from university, I want to look back and know that I&apos;ve done something to improve
              the lives of students who are going through the same struggle of being undocumented as I am.&rdquo;
            </p>
          </div>
        </RevealBlock>

        <ProblemCards
          theme={THEME}
          eyebrow="Problems"
          title="What students lacked"
          items={[
            {
              title: "Community",
              problem: "There was no platform for immigrant, Latino and Hispanic students to build community within their universities.",
              fix: "Profiles verified with .edu emails let students connect with others at their university or across universities.",
            },
            {
              title: "Resources",
              problem: "There was no single place to find scholarships, legal aid and other support.",
              fix: "A unified hub puts resources, groups and media in one place, updated by the student's location.",
            },
            {
              title: "Media",
              problem: "There were no videos or podcasts made to educate and motivate first-generation and immigrant students.",
              fix: "A media tab with motivational videos and podcasts made for these students.",
            },
          ]}
          takeaway="students didn't need another general social app. They needed one trusted place made for them, so every feature points back to community, resources or motivation."
        />

        <RoleAndTeam
          theme={THEME}
          columns={[
            { head: "I owned", items: ["Research with students and existing communities", "Persona, information architecture and flows", "Low-, mid- and high-fidelity screens", "Logo and visual identity"] },
            { head: "Others owned", items: ["The founding student group shaped the idea and gave feedback on each round of designs"] },
          ]}
        />

        <Constraints items={["Concept, not shipped", "6 months", "Solo designer", "First UI/UX project", "Mobile first"]} />

        <DecisionBlock
          title="One hub instead of three apps"
          rows={[
            { k: "Insight", v: "Students were searching across many sites and group chats for resources, community and news." },
            { k: "Chosen", v: "One app with community, resources, media and events, each one tap away in the bottom nav." },
            { k: "Trade-off", v: "Each area is lighter than a dedicated app would be, in exchange for a single place to check daily." },
          ]}
          visual={<Shot src={lofiImg} alt="Low-fidelity mockups" caption="Low fidelity: onboarding explains the value quickly to reduce drop-off" />}
        />
        <DecisionBlock
          title="A verified student network"
          rows={[
            { k: "Insight", v: "Undocumented students need to feel safe before sharing anything about themselves." },
            { k: "Chosen", v: "Onboarding with a .edu email, so everyone in the network is a verified student." },
            { k: "Rejected", v: "Open sign-up. Easier to join, but it would make the space feel less safe." },
            { k: "Trade-off", v: "Students without a .edu email yet, like incoming freshmen, can't join right away." },
          ]}
          reverse
          visual={<Shot src={midfiImg} alt="Mid-fidelity mockups" caption="Mid fidelity" />}
        />
        <DecisionBlock
          title="Solving the problem before polishing"
          rows={[
            { k: "Insight", v: "Coming from graphic design, I first focused on how screens looked more than how well they worked." },
            { k: "Chosen", v: "Iterated on structure first: bottom-nav for one-handed use, plain-language copy and clear resource cards." },
            { k: "Trade-off", v: "Some early visual work was thrown away as the structure changed." },
          ]}
          wide
          visual={
            <div className="rounded-[24px] p-6 sm:p-10" style={{ background: THEME.tint }}>
              <Shot src={hifiImg} alt="High-fidelity mockups" caption="High fidelity: bottom-nav patterns support one-handed use" />
            </div>
          }
        />

        {/* Screens */}
        <RevealBlock as="section" className={SECTION}>
          <Eyebrow>Solution</Eyebrow>
          <H2>The solution, screen by screen</H2>
          <div className="mt-8 grid items-start gap-6 md:grid-cols-[3fr_2fr]">
            <Shot src={mobilesImg} alt="Sea & Sky app screens" caption="Community, resources and media, with news based on the student's location" />
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {FEATURES.map((f, i) => (
                <RevealBlock as="li" key={f.t} from="up" delay={i * 0.05} className={`${CARD} !p-5`}>
                  <p className="font-semibold" style={{ color: THEME.ink }}>{f.t}</p>
                  <p className="mt-1 text-[14px] leading-6 text-zinc-700">{f.d}</p>
                </RevealBlock>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-[15px] leading-6 text-zinc-700">
            Accessibility: high-contrast resource cards stay readable in light and dark modes, tap targets are large, and
            onboarding uses plain-language copy for students who speak English as a second language.
          </p>
        </RevealBlock>

        <Results
          theme={THEME}
          intro="Sea & Sky is a concept, so these come from prototype reviews and projections, not live use."
          items={[
            { value: "60%+", text: "projected cut in time spent finding resources", source: "Projection, one app instead of many searches" },
            { value: "Eager", text: "students in prototype reviews wanted to join", source: "Prototype reviews" },
            { value: "End to end", text: "research, flows and UI in one project", source: "Six-month design process" },
          ]}
        />

        <HowIBuiltIt
          theme={THEME}
          timeline={[
            { t: "Research and discovery", d: "Talked with students and looked at existing student communities." },
            { t: "Design and prototyping", d: "Information architecture and mobile-first flows with calm, clear visuals." },
            { t: "Iteration and validation", d: "Refined copy, edge cases and accessibility so the app was easier to understand." },
          ]}
          tools="Figma, Photoshop"
          wentWrong="This was my first UI/UX project. At times I put looks ahead of solving the problem, and several rounds went into fixing structure I could have planned earlier."
        />

        <WhereItStands
          stands="A complete concept with high-fidelity screens. It is not a shipped product."
          change="Test with more students earlier, plan the structure before the visuals, and work out how incoming students without a .edu email can join."
          measure="How long it takes a new student to find their first useful resource, and how many join a group in their first week."
        />

        <NextProject href="/projects/selah-reflect" name="Selah Reflect" />
        <OtherProjects currentProject="sea-sky" />
        <CaseFooter />
      </main>
    </div>
  );
}

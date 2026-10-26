"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { IconUsers, IconFileCertificate, IconVideo } from "@tabler/icons-react";
import StoryBoard, { Frame, type Arrow, type Branch } from "../board/StoryBoard";
import heroImg from "./images/Project images/Header.png";
import mobilesImg from "./images/Project images/mobiles.png";
import lofiImg from "./images/Project images/stages/lofi.png";
import midfiImg from "./images/Project images/stages/midfi.png";
import hifiImg from "./images/Project images/stages/hifi.png";
import techstarsImg from "./images/Project images/techstars.jpg";
import logoPng from "./images/logo.png";
import styles from "./SeaBoard.module.css";

const inter = Inter({ subsets: ["latin"] });

// Every section's place on the board, in board px. Heights come from the content.
// The hero sits in the middle, and the story runs clockwise around it from the top left,
// with 200px between neighbouring sections. The side columns line up with each other and
// stand clear of the wide rows above and below the hero; the middle row is centred on the hero.
const LAYOUT = {
  hero: { x: 1548, y: 1522, w: 672 },
  overview: { x: 552, y: 578, w: 560 },
  summary: { x: 1312, y: 811, w: 1144 },
  problem: { x: 2656, y: 200, w: 560 },
  persona: { x: 2656, y: 1416, w: 912 },
  process: { x: 2656, y: 2897, w: 560 },
  evolution: { x: 1312, y: 2682, w: 1144 },
  solution: { x: 200, y: 2676, w: 912 },
  impact: { x: 552, y: 1568, w: 560 },
  closing: { x: 1116, y: 4164, w: 1536 },
  // Beside the closing group, to the right, so the Techstars pitch reads as the next step after the learnings
  pitch: { x: 2852, y: 4164, w: 560 },
};

const HERO_H = 960;

// The board's size, and the card the canvas opens on (the Sea & Sky hero)
export const SEA_BOARD = { w: 3768, h: 4960 };
export const SEA_START = { x: LAYOUT.hero.x, y: LAYOUT.hero.y, w: LAYOUT.hero.w, h: HERO_H };

// The story's reading order, clockwise from the top left, ending back at the hero
const LOOP: Arrow<keyof typeof LAYOUT>[] = [
  { from: { key: "hero", side: "left", t: 0.1 }, to: { key: "overview", side: "bottom", t: 0.85 }, bend: 0.25 },
  { from: { key: "overview", side: "right" }, to: { key: "summary", side: "left" }, bend: -0.25 },
  { from: { key: "summary", side: "right" }, to: { key: "problem", side: "left" }, bend: 0.2 },
  { from: { key: "problem", side: "bottom" }, to: { key: "persona", side: "top", t: 0.31 }, bend: -0.25 },
  { from: { key: "persona", side: "bottom", t: 0.31 }, to: { key: "process", side: "top" }, bend: -0.25 },
  { from: { key: "process", side: "left" }, to: { key: "evolution", side: "right" }, bend: 0.2 },
  { from: { key: "evolution", side: "left" }, to: { key: "solution", side: "right" }, bend: 0.2 },
  { from: { key: "solution", side: "top", t: 0.8 }, to: { key: "impact", side: "bottom", t: 0.5 }, bend: 0.25 },
  { from: { key: "impact", side: "right" }, to: { key: "hero", side: "left" }, bend: -0.25 },
  { from: { key: "closing", side: "right", t: 0.5 }, to: { key: "pitch", side: "left", t: 0.5 }, bend: 0 },
];

// After the loop: a dashed branch from the impact card down the left margin to the closing notes
const BRANCH: Branch<keyof typeof LAYOUT> = {
  from: { key: "impact", side: "left" },
  to: { key: "closing", side: "left", t: 0.3 },
  x: 100,
};

// Card tones: white, a light blue tint, and the Sea & Sky blue
type Tone = "white" | "tint" | "brand";

function Card({ tone = "white", className = "", style, children }: { tone?: Tone; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  return (
    <div className={`${styles.card} ${styles[tone]} ${className}`} style={style}>
      {children}
    </div>
  );
}

function Label({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "brand" }) {
  return <p className={`${styles.label} ${tone === "brand" ? styles.labelBrand : ""}`}>{children}</p>;
}

// The heading above each group of cards: its eyebrow, title and an optional line
function SectionHead({ eyebrow, title, kicker }: { eyebrow: string; title: string; kicker?: string }) {
  return (
    <div className={styles.sectionHead}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
    </div>
  );
}

const AT_A_GLANCE = ["Concept mobile app", "Feb–Aug 2019", "Solo research & design"];
const STACK = ["Figma", "Photoshop"];

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

const PROJECTED_IMPACT = [
  "Validated desirability during prototype reviews; students expressed eagerness to join.",
  "Projected to reduce resource discovery time by 60%+ by consolidating search into one app.",
  "Community groups designed to increase peer connections and on-campus support.",
  "Demonstrated end-to-end design process across research, flows, and UI.",
];

const PROBLEM_CARDS = [
  {
    title: "Community",
    text: "No platform for community building for immigrant, Latino, and Hispanic students within universities.",
    icon: <IconUsers size={22} stroke={1.5} />,
  },
  {
    title: "Resources",
    text: "Non-existent singular platform where students can obtain resources such as scholarships, legal aid, and motivation.",
    icon: <IconFileCertificate size={22} stroke={1.5} />,
  },
  {
    title: "Media",
    text: "Non-existent media content such as videos and podcasts geared to educate and motivate first-generation, immigrant, Latino, or Hispanic students pursuing degrees in higher education.",
    icon: <IconVideo size={22} stroke={1.5} />,
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

const PERSONA_TRAITS = ["communicative", "open minded", "leadership"];

export default function SeaBoard() {
  return (
    <StoryBoard width={SEA_BOARD.w} height={SEA_BOARD.h} layout={LAYOUT} arrows={LOOP} branch={BRANCH} className={inter.className}>
      {/* Centre: the hero */}
      <Frame name="hero">
        <Card tone="brand" className={styles.heroCard} style={{ height: HERO_H }}>
          <div className={styles.heroBadgeRow}>
            <div className={styles.logoCircle}>
              <Image
                src={logoPng}
                alt="Sea & Sky logo"
                width={100}
                height={100}
                className={styles.logoImg}
                priority
                style={{ transform: "scale(2.2)" }}
              />
            </div>
            <span className={styles.pill}>Sea &amp; Sky Case Study</span>
          </div>
          <h1 className={styles.heroTitle}>Sea &amp; Sky</h1>
          <p className={styles.heroText2}>
            An online community built for informing and empowering Hispanic, LatinX, and immigrant students in higher
            education.
          </p>
          <div className={styles.heroArt}>
            <Image src={heroImg} alt="Sea & Sky header" className={styles.heroImg} sizes="1080px" priority />
          </div>
        </Card>
      </Frame>

      {/* 1. Top left: overview, at a glance, and the role, timeline and stack */}
      <Frame name="overview">
        <Card>
          <Label>Overview</Label>
          <p className={styles.body}>
            Sea &amp; Sky is an idea that came into fruition by a group of students who identify as immigrant, Latino, and
            Hispanic. They were unable to find a place where they could connect with other students who could identify
            similarly to them.
          </p>
          <p className={styles.body}>
            In the following case study, you&apos;ll see the initial design and how it evolved throughout a period of six
            months.
          </p>
        </Card>
        <Card tone="tint">
          <Label tone="brand">At a glance</Label>
          <ul className={styles.list}>
            {AT_A_GLANCE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <Label>Role</Label>
          <p className={styles.big}>Research &amp; UI/UX (solo)</p>
          <div className={styles.metaRow}>
            <div>
              <Label>Timeline</Label>
              <p className={styles.big}>Feb–Aug 2019</p>
            </div>
            <div>
              <Label>Stack</Label>
              <div className={styles.pills}>
                {STACK.map((tool) => (
                  <span key={tool} className={styles.toolPill}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Frame>

      {/* 2. Top: the executive summary, in a row above the hero */}
      <Frame name="summary">
        <SectionHead eyebrow="Executive Summary" title="Problem · Solution · Outcome" />
        <div className={styles.row3}>
          {EXECUTIVE_SUMMARY_CARDS.map((card) => (
            <Card key={card.title}>
              <div className={styles.iconBadge}>{card.icon}</div>
              <p className={styles.eyebrow}>{card.title}</p>
              <p className={styles.body}>{card.text}</p>
            </Card>
          ))}
        </div>
      </Frame>

      {/* 3. Top right: the problem */}
      <Frame name="problem">
        <SectionHead
          eyebrow="Problem Statement"
          title="What students lacked"
          kicker="Three gaps surfaced: community, resources, and motivating media."
        />
        {PROBLEM_CARDS.map((card) => (
          <Card key={card.title}>
            <div className={styles.iconBadge}>{card.icon}</div>
            <p className={styles.eyebrow}>{card.title}</p>
            <p className={styles.body}>{card.text}</p>
          </Card>
        ))}
      </Frame>

      {/* 4. Right: the persona, in two columns */}
      <Frame name="persona">
        <SectionHead eyebrow="User Persona" title="Who we designed for" />
        <div className={styles.row2}>
          <div className={styles.column}>
            <Card tone="brand">
              <h3 className={styles.personaName}>Julie</h3>
              <dl className={styles.profile}>
                <div>
                  <dt>Age:</dt>
                  <dd>20</dd>
                </div>
                <div>
                  <dt>Location:</dt>
                  <dd>Irvine</dd>
                </div>
                <div>
                  <dt>Education:</dt>
                  <dd>Undergraduate</dd>
                </div>
              </dl>
              <Label tone="brand">Personality</Label>
              <div className={styles.pills}>
                {PERSONA_TRAITS.map((trait) => (
                  <span key={trait} className={styles.traitPill}>
                    {trait}
                  </span>
                ))}
              </div>
            </Card>
            <Card>
              <Label>Bio</Label>
              <ul className={styles.list}>
                <li>Julie was born in Argentina and came to the U.S. as a child.</li>
                <li>Growing up, she wasn&apos;t aware of the burdens of being an immigrant until university.</li>
                <li>At university she struggled to find a group of students who identified similarly.</li>
              </ul>
            </Card>
            <Card tone="brand">
              <Label tone="muted">Quote</Label>
              <p className={styles.quote}>
                &ldquo;When I&apos;ve graduated from university, I want to look back and know that I&apos;ve done something
                to improve the lives of students who are going through the same struggle of being undocumented as I am.&rdquo;
              </p>
            </Card>
          </div>
          <div className={styles.column}>
            <Card tone="tint">
              <Label tone="brand">Goals</Label>
              <ul className={styles.list}>
                <li>Create a support group where undocumented students can get help.</li>
                <li>Create resources for undocumented students who cannot afford university fees.</li>
                <li>Graduate as an undocumented and first-generation student.</li>
              </ul>
            </Card>
            <Card tone="tint">
              <Label tone="brand">Behavior</Label>
              <ul className={styles.list}>
                <li>Works alongside resource groups to provide resources to undocumented students.</li>
                <li>Volunteers for programs that help people who lack resources.</li>
              </ul>
            </Card>
            <Card tone="tint">
              <Label tone="brand">Frustrations</Label>
              <ul className={styles.list}>
                <li>Wants to create more resource opportunities for students pursuing higher education.</li>
                <li>Struggles to find opportunities catered to undocumented students.</li>
              </ul>
            </Card>
          </div>
        </div>
      </Frame>

      {/* 5. Bottom right: the process */}
      <Frame name="process">
        <SectionHead eyebrow="Process" title="Crafting Sea & Sky" kicker="From research to release." />
        {PROCESS_STEPS.map((item, i) => (
          <Card key={item.stage} tone="tint">
            <div className={styles.stepNumber}>{i + 1}</div>
            <p className={styles.stepTitle}>{item.stage}</p>
            <p className={styles.body}>{item.desc}</p>
          </Card>
        ))}
      </Frame>

      {/* 6. Bottom: the design evolution, in a row below the hero */}
      <Frame name="evolution">
        <SectionHead
          eyebrow="Design evolution"
          title="Design evolution"
          kicker="From low-fidelity sketches to high-fidelity screens over six months."
        />
        <div className={styles.row3}>
          <Card>
            <Image src={lofiImg} alt="Low fidelity mockups" className={styles.fullImg} sizes="640px" priority />
            <Label>Low-fidelity mockups</Label>
            <p className={styles.caption}>Onboarding clarifies value props quickly to reduce drop-off.</p>
          </Card>
          <Card>
            <Image src={midfiImg} alt="Mid fidelity mockups" className={styles.fullImg} sizes="640px" priority />
            <Label>Mid-fidelity mockups</Label>
          </Card>
          <Card>
            <Image src={hifiImg} alt="High fidelity mockups" className={styles.fullImg} sizes="640px" priority />
            <Label>High-fidelity mockups</Label>
            <p className={styles.caption}>Bottom-nav patterns support one-hand mobile use.</p>
          </Card>
        </div>
      </Frame>

      {/* 7. Bottom left: the solution, then the highlights */}
      <Frame name="solution">
        <SectionHead eyebrow="Solution" title="What the app provides" />
        <div className={styles.row2}>
          <Card>
            <Label>Approach</Label>
            <p className={styles.body}>The solution is an app that will foster an online community, provide resources, and create content.</p>
            <p className={styles.body}>
              Community will be fostered through the creation of online profiles with .edu emails that allow students to
              connect with others in the same university or across different universities.
            </p>
            <p className={styles.body}>
              Students can stay up to date with current news through the app; this information is updated based on the
              student&apos;s location.
            </p>
            <p className={styles.body}>The media section creates motivation for students by surfacing motivational and informative content.</p>
          </Card>
          <Card>
            <Image src={mobilesImg} alt="Sea & Sky mobile screens" className={styles.fullImg} sizes="640px" priority />
            <p className={styles.caption}>Unified hub: resources, groups, and media in one place to cut search time.</p>
          </Card>
        </div>
        <div className={styles.subsection}>
          <SectionHead eyebrow="Highlights" title="Experiences that matter" />
        </div>
        <div className={styles.row3}>
          {HIGHLIGHTS.map((f) => (
            <Card key={f.t}>
              <p className={styles.eyebrow}>{f.t}</p>
              <p className={styles.body}>{f.d}</p>
            </Card>
          ))}
        </div>
      </Frame>

      {/* 8. Left: the projected impact, which leads back to the hero */}
      <Frame name="impact">
        <SectionHead eyebrow="Projected Impact" title="Projected Impact" />
        {PROJECTED_IMPACT.map((item) => (
          <Card key={item}>
            <p className={styles.big}>{item}</p>
          </Card>
        ))}
      </Frame>

      {/* Closing: the learnings and the accessibility notes, below the loop */}
      <Frame name="closing">
        <div className={styles.closingRow}>
          <div className={styles.column}>
            <SectionHead eyebrow="Learnings & Outcomes" title="What I learned" />
            <Card tone="brand">
              <p className={styles.bodyWhite}>
                The idea of the Sea &amp; Sky app was created out of necessity: students who identify as undocumented needed
                a space designed for them.
              </p>
              <p className={styles.bodyWhite}>
                Coming from a graphic design background with limited UI and UX experience, this was a learning journey. I
                didn&apos;t fully know the rules of UI/UX, but by taking on the challenge I learned the fundamentals while
                building the app.
              </p>
              <p className={styles.bodyWhite}>
                A key challenge was prioritizing the problem over visual polish. At times I focused on aesthetics more than
                effectiveness. Through iteration, I adjusted the design to solve the underlying problems.
              </p>
              <p className={styles.bodyWhite}>
                There was a lot of learning from this project — and as the saying goes: you learn and grow from your
                mistakes. Thanks for reading this case study!
              </p>
            </Card>
          </div>
          <div className={styles.column}>
            <SectionHead eyebrow="Accessibility" title="Accessibility considerations" />
            <Card>
              <ul className={styles.list}>
                <li>Designed high-contrast resource cards to ensure readability across light/dark modes.</li>
                <li>Large tap targets and bottom-nav for one-hand mobile use.</li>
                <li>Simple onboarding flow with plain-language copy for ESL/international students.</li>
              </ul>
            </Card>
          </div>
        </div>
        <p className={styles.footer}>© {new Date().getFullYear()} Sea &amp; Sky · Case Study</p>
      </Frame>

      {/* Beside the closing group: the team's pitch to investors */}
      <Frame name="pitch">
        <SectionHead eyebrow="Recognition" title="Pitching to investors" />
        <Card>
          <Image src={techstarsImg} alt="The team at the Blackstone LaunchPad and Techstars event" sizes="560px" className={styles.fullImg} priority />
          <p className={styles.caption}>
            Through the Entrepreneur Center at UC Irvine, my team and I earned the chance to travel to New York and pitch our
            idea to investors at Techstars, in partnership with Blackstone.
          </p>
        </Card>
      </Frame>
    </StoryBoard>
  );
}

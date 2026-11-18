// All of the home page's copy and lists, in one place.

export type FeaturedProject = {
  id: string;
  title: string;
  /** Badge at the top of the details card */
  category: string;
  description: string;
  year: string;
  role: string;
  href: string;
  /** Which media panel to draw: the Grove phone screens, or the Samples Store puzzle photo */
  media: "garden" | "materials";
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: "grove",
    title: "Grove",
    category: "Mobile app",
    description:
      "I designed and built Grove end to end, an iOS habit tracker where every completed habit grows a garden, shaped by interviews with 10 people.",
    year: "2026",
    role: "Product design, iOS development, research",
    href: "/projects/grove",
    media: "garden",
  },
  {
    id: "samples",
    title: "Samples Store",
    category: "E-commerce",
    description:
      "I led the redesign of Arktura's Samples Store from a static page of diagrams into a self-serve Shopify checkout that now handles about 80% of sample orders.",
    year: "2025",
    role: "Lead designer, research",
    href: "/projects/ecommerce",
    media: "materials",
  },
];

export type MoreProject = {
  id: string;
  title: string;
  caption: string;
  tag: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const MORE_PROJECTS: MoreProject[] = [
  {
    id: "sea-sky",
    title: "Sea & Sky",
    caption:
      "A community app connecting Hispanic, Latinx and immigrant students across universities.",
    tag: "Mobile app",
    href: "/projects/sea-and-sky",
    image: "/images/case-studies/seaSky-caseStudy.png",
    imageAlt: "Sea & Sky app screens",
  },
  {
    id: "selah",
    title: "Selah Devotional Journal",
    caption:
      "Daily reading, journaling and reflection in one mobile-first app, built in 2.5 weeks.",
    tag: "Web app",
    href: "/projects/selah-reflect",
    image: "/images/case-studies/selah-caseStudy.png",
    imageAlt: "Selah devotional screens",
  },
  {
    id: "mood-tracker",
    title: "Mood Tracker",
    caption:
      "Ten moods driven by a live slider, with Figma animations brought into code.",
    tag: "Motion study",
    href: "/projects/mood-tracker",
    image: "/images/case-studies/mood-tracker-caseStudy.png",
    imageAlt: "Mood Tracker check-in screen showing a happy character",
  },
  {
    id: "aarhus",
    title: "Aarhus",
    caption:
      "Four configurable furniture pieces in scenes you can open, light and rearrange.",
    tag: "Interaction study",
    href: "/projects/aarhus",
    image: "/images/portfolio-v3/furniture/interactive-furniture.png",
    imageAlt: "An open wardrobe from the Aarhus furniture study",
  },
  {
    id: "tidehaus",
    title: "Tidehaus",
    caption:
      "A concept surf shop with a dark, mobile-first storefront I designed and coded.",
    tag: "E-commerce concept",
    href: "/projects/tidehaus",
    image: "/images/case-studies/tidehaus-caseStudy.png",
    imageAlt: "Tidehaus storefront",
  },
  {
    id: "ziplearn",
    title: "Ziplearn",
    caption: "A concept iOS app for booking online tutors around busy schedules.",
    tag: "Concept",
    href: "/projects/ziplearn",
    image: "/images/case-studies/ziplearn-caseStudy.png",
    imageAlt: "Ziplearn category screen",
  },
];

export const ABOUT_SENTENCES = [
  "I'm Fredy, a Design Engineer in Los Angeles. I design and build web and mobile products.",
  "Being able to do both lets me think through the whole experience, from the first idea to a working product, and pay attention to the details that make it feel natural.",
  "Away from the screen I'm usually surfing, running or producing music.",
] as const;


/** What I do, shown as a stack of cards that peel away on scroll (ServicesStack) */
export const SERVICES = [
  {
    name: "UX design",
    description: "I start by listening: interviews, usability tests and a close look at what people already do. From there I map the flows and information structure, so the product makes sense the first time someone opens it and every step leads clearly to the next.",
  },
  {
    name: "UI design",
    description: "I design screens with a clear hierarchy, so the most important thing is always obvious. Type, colour, spacing and motion work as one system, giving the product a calm, consistent feel that people trust and come back to.",
  },
  {
    name: "Design systems",
    description: "I build shared foundations, from colour and type tokens to documented components, that designers and developers both use. It keeps the product consistent as it grows and lets teams ship new features faster without redesigning the basics.",
  },
  {
    name: "Prototyping",
    description: "I turn ideas into interactive prototypes, in Figma or in code, that feel close to the real thing. Putting them in front of people early shows what works and what doesn't before any time is spent building the wrong thing.",
  },
  {
    name: "Front-end development",
    description: "I build the interfaces I design, with React, Next.js and TypeScript. The result is responsive, fast and accessible, and it matches the design down to the details, because the person who designed it is the one writing the code.",
  },
] as const;

/** Open to work: what Fredy is looking for (OpenToWork.tsx). One row per preference. */
export const OPEN_TO_WORK = [
  {
    label: "Roles",
    options: ["Product Designer", "Design Engineer", "UI/UX Designer", "Web Designer", "Mobile Designer"],
  },
  {
    label: "Location",
    options: ["Los Angeles", "Remote", "Open to relocating for the right role"],
  },
  { label: "Employment", options: ["Full-time"] },
  { label: "Start date", options: ["Available immediately"] },
  { label: "Work authorization", options: ["Authorized to work in the US, no sponsorship needed"] },
] as const;

/** How I work: the process behind the skills (ProcessSteps.tsx), one line per step */
export const PROCESS_STEPS = [
  {
    title: "Research",
    text: "Interviews, usability tests and a close look at what people already do and where they get stuck, so I start from real needs.",
  },
  {
    title: "Design",
    text: "Flows, wireframes, then polished screens and a shared system, tested early in Figma or as coded prototypes.",
  },
  {
    title: "Build",
    text: "I build what I design in React, Next.js and React Native, using Figma's MCP to keep the code true to the design: responsive and accessible.",
  },
  {
    title: "Test & refine",
    text: "I watch and interview people as they use it, measure what changed and keep refining, so each release is easier to use than the last.",
  },
] as const;

export type CarouselProject = {
  id: string;
  title: string;
  tagline: string;
  /** CSS background for the card (gradient or solid) */
  background: string;
  href: string;
  /** Title/tagline color */
  textColor?: string;
  /** Full card image. When set, title and phone are already in the art. */
  cardArt?: string;
  /** Phone mockup on the card */
  phoneSrc?: string;
  phoneAlt?: string;
  /** Wide collage assets (e.g. Sea & Sky) need oversized cover placement */
  phoneWide?: boolean;
};

export const CAROUSEL_PROJECTS: CarouselProject[] = [
  {
    id: "grove",
    title: "Grove",
    tagline: "Daily Habit Tracker",
    background:
      "linear-gradient(0deg, #51a928 0%, #8ac130 47.5%, #edfa7a 100%)",
    textColor: "#fff",
    href: "/projects/grove",
    cardArt: "/images/portfolio-v3/grove-card.png",
  },
  {
    id: "sea-sky",
    title: "Sea & Sky",
    tagline: "Online Community",
    background:
      "linear-gradient(0deg, #0b6ad4 0%, #2085e9 55%, #6cbaff 100%)",
    textColor: "#d7ecff",
    href: "/projects/sea-and-sky",
    phoneSrc: "/images/redesign/sea-sky/phone.png",
    phoneAlt: "Sea & Sky app screens",
    phoneWide: true,
  },
  {
    id: "selah",
    title: "Selah",
    tagline: "Devotional Journal",
    background: "linear-gradient(0deg, #5c564c 0%, #878279 50%, #c4bdb0 100%)",
    textColor: "#1a1814",
    href: "/projects/selah-reflect",
    phoneSrc: "/images/redesign/selah/phone-1.png",
    phoneAlt: "Selah app screen",
  },
  {
    id: "ziplearn",
    title: "Ziplearn",
    tagline: "Tutoring Made Simple",
    background: "linear-gradient(0deg, #4a1fd0 0%, #763ef8 50%, #b794ff 100%)",
    textColor: "#efe8ff",
    href: "/projects/ziplearn",
    phoneSrc: "/images/redesign/ziplearn/phone.png",
    phoneAlt: "Ziplearn app screen",
  },
  {
    id: "tidehaus",
    title: "Tidehaus",
    tagline: "Surf Gear Shop",
    background: "linear-gradient(0deg, #061820 0%, #0a2d3d 45%, #1a6b7a 100%)",
    textColor: "#e8f6f8",
    href: "/projects/tidehaus",
    phoneSrc: "/images/redesign/tidehaus/desktop.png",
    phoneAlt: "Tidehaus storefront",
  },
  {
    id: "samples",
    title: "Samples",
    tagline: "Shopify Storefront",
    background: "linear-gradient(0deg, #0a3d3c 0%, #1a6b6a 45%, #9ee8e4 100%)",
    textColor: "#f2fffe",
    href: "/projects/ecommerce",
    phoneSrc: "/images/redesign/samples/storefront.png",
    phoneAlt: "Samples store",
  },
  {
    id: "furniture",
    title: "Interactive Furniture",
    tagline: "Modular living",
    background: "linear-gradient(#5f381c, #5f381c)",
    textColor: "#fff",
    href: "/projects/aarhus",
    cardArt: "/images/portfolio-v3/furniture/interactive-furniture.png",
  },
  {
    id: "mood-tracker",
    title: "Mood Tracker",
    tagline: "Daily check-in",
    background: "linear-gradient(#bf172c, #bf172c)",
    textColor: "#fff",
    href: "/projects/mood-tracker",
    cardArt: "/images/portfolio-v3/mood-tracker/mood-tracker-card.png",
  },
];

export type RedesignProject = {
  id: string;
  title: string;
  tagline: string;
  /** Idle text color; also hover background when brandHover is omitted */
  brandColor: string;
  /** Hover / focus-visible background (solid or CSS gradient). Defaults to brandColor. */
  brandHover?: string;
  href: string;
  /** Static fallback / current PNG card art */
  cardImage?: string;
  /** Animated card layers live under public/images/redesign/{id}/ when ready */
  animated?: boolean;
};

/**
 * Updatable catalog for redesign board project cards.
 * Edit title, tagline, brandColor, href, and cardImage here — not in card components.
 */
export const REDESIGN_PROJECTS: RedesignProject[] = [
  {
    id: "grove",
    title: "GROVE",
    tagline: "Grow Your Habits Into Something You Can See.",
    brandColor: "#000000",
    brandHover: "#78A723",
    href: "/projects/grove",
    animated: true,
  },
  {
    id: "samples",
    title: "SAMPLES STORE",
    tagline: "Shopify template craft for a streamlined, friendly shopping journey.",
    brandColor: "#000000",
    brandHover: "#DEFFFE",
    href: "/projects/ecommerce",
    animated: true,
  },
  {
    id: "sea-sky",
    title: "SEA & SKY",
    tagline: "Online community built to empower underrepresented students in higher education.",
    brandColor: "#000000",
    brandHover: "linear-gradient(0deg, #0B6AD4 0%, #37A1FF 100%)",
    href: "/projects/sea-and-sky",
    animated: true,
  },
  {
    id: "selah",
    title: "SELAH",
    tagline: "A devotional app that guides users through scripture, reflection, and journaling.",
    brandColor: "#000000",
    brandHover: "#878279",
    href: "/projects/selah-reflect",
    animated: true,
  },
  {
    id: "ziplearn",
    title: "ZIPLEARN",
    tagline: "An intuitive tutoring app that makes learning faster, simpler, and accessible.",
    brandColor: "#000000",
    brandHover: "#763EF8",
    href: "/projects/ziplearn",
    animated: true,
  },
  {
    id: "tidehaus",
    title: "TIDEHAUS",
    tagline:
      "A modern surf e-commerce site built to showcase gear with a clean, coastal aesthetic.",
    brandColor: "#000000",
    brandHover: "#0A2D3D",
    href: "/projects/tidehaus",
    animated: true,
  },
];

export function getRedesignProject(id: string): RedesignProject {
  const project = REDESIGN_PROJECTS.find((p) => p.id === id);
  if (!project) {
    throw new Error(`Unknown redesign project: ${id}`);
  }
  return project;
}

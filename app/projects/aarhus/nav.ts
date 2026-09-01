export const NAV_ITEMS = [
  { label: "LivingRoom", href: "/projects/aarhus/living-room" },
  { label: "Modular Systems", href: "/projects/aarhus/wardrobe" },
  { label: "Bedroom", href: "/projects/aarhus/bedroom" },
  { label: "DiningRoom", href: "/projects/aarhus/dining-room" },
] as const;

export type NavLabel = (typeof NAV_ITEMS)[number]["label"];

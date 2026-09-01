import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Aarhus Two-Door · Arbor & Co.",
  description:
    "A refined modular wardrobe offering customisable storage with timeless design. Handcrafted for lasting quality and everyday ease.",
};

export default function WardrobeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/projects/aarhus/wardrobe/wardrobe-closed.png"
        fetchPriority="high"
      />
      <link rel="preload" as="image" href="/projects/aarhus/wardrobe/closed-glass.png" />
      {children}
    </>
  );
}

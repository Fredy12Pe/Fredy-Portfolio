import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Skagen Platform Bed · Arbor & Co.",
  description:
    "A platform bed in fluted walnut, with a configurable headboard and a lamp that warms the room.",
};

export default function BedroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/projects/aarhus/bedroom/walnut-off.webp"
        fetchPriority="high"
      />
      {children}
    </>
  );
}

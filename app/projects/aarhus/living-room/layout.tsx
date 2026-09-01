import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Helsingør Center Console · Arbor & Co.",
  description:
    "A low media console for the living room, with customisable storage and a quiet, lasting silhouette.",
};

export default function LivingRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/projects/aarhus/console/closed-2door.webp"
        fetchPriority="high"
      />
      {children}
    </>
  );
}

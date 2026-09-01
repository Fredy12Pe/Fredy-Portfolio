import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Odense Dining Table · Arbor & Co.",
  description:
    "An oval dining table in fluted walnut, with a configurable top and seating for four to eight.",
};

export default function DiningRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/projects/aarhus/dining/walnut-4.png"
        fetchPriority="high"
      />
      {children}
    </>
  );
}

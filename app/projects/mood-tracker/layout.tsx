import type { Metadata } from "next";
import type { ReactNode } from "react";
import BoardNav from "../board/BoardNav";

export const metadata: Metadata = {
  title: "Mood Tracker · Fredy Design",
  description:
    "A mobile motion study: ten keyed Checkin moods driven by a live slider, with Figma idle animations imported into code.",
};

export default function MoodTrackerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          html, body { background: #000 !important; }
        }
      `}</style>
      {/* The site's bar, the same as on every other page. On phones this page is the app itself, full
          screen, so the site's phone controls stay off it. */}
      <BoardNav phone={false} />
      {children}
    </>
  );
}

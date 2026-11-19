import type { Metadata } from "next";
import type { ReactNode } from "react";

// The page is a client component, so its title and description (for tabs, search and link previews) live here
export const metadata: Metadata = {
  title: "Selah · Case Study · Fredy",
  description:
    "Selah, a devotional journal for daily reading, journaling and reflection in one mobile-first app, built in 2.5 weeks.",
};

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

// The page is a client component, so its title and description (for tabs, search and link previews) live here
export const metadata: Metadata = {
  title: "Tidehaus · Case Study · Fredy",
  description:
    "Tidehaus, a concept surf shop with a dark, mobile-first storefront that Fredy designed and coded.",
};

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return children;
}

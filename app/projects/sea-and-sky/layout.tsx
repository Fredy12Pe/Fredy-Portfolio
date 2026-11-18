import type { Metadata } from "next";
import type { ReactNode } from "react";

// The page is a client component, so its title and description (for tabs, search and link previews) live here
export const metadata: Metadata = {
  title: "Sea & Sky · Case Study · Fredy",
  description:
    "Sea & Sky, a community app connecting Hispanic, Latinx and immigrant students across universities.",
};

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return children;
}

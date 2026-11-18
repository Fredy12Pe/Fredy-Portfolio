import type { Metadata } from "next";
import type { ReactNode } from "react";

// The page is a client component, so its title and description (for tabs, search and link previews) live here
export const metadata: Metadata = {
  title: "Samples Store · Case Study · Fredy",
  description:
    "How I redesigned Arktura's Samples Store from a static page of diagrams into a self-serve Shopify checkout that now handles about 80% of sample orders.",
};

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return children;
}

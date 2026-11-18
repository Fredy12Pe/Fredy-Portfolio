import type { Metadata } from "next";
import type { ReactNode } from "react";

// The page is a client component, so its title and description (for tabs, search and link previews) live here
export const metadata: Metadata = {
  title: "Ziplearn · Case Study · Fredy",
  description:
    "Ziplearn, a concept iOS app for booking online tutors around busy schedules.",
};

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return children;
}

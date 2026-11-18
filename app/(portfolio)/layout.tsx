import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import SmoothScroll from "./SmoothScroll";

// The shared redesign cards read --font-roboto and --font-orbitron. Pointing both at Inter
// makes the whole portfolio, including those cards, set in Inter.
const interVars = {
  "--font-roboto": "var(--font-inter)",
  "--font-orbitron": "var(--font-inter)",
} as CSSProperties;

export const metadata: Metadata = {
  title: {
    default: "Fredy · Design Engineer",
    template: "Fredy · %s",
  },
  description:
    "Fredy is a Design Engineer in Los Angeles who designs and builds web and mobile products. Explore selected work, about, and contact.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-black antialiased`} style={interVars}>
      <SmoothScroll />
      {children}
    </div>
  );
}

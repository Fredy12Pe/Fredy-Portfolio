import type { Metadata } from "next";
import { getDuolingoStreak } from "@/lib/duolingo";
import AboutBoard from "../AboutBoard";

export const metadata: Metadata = {
  title: "Fredy · About Me",
  description: "About Fredy — portfolio redesign from Figma Portfolio-2",
};

export default async function AboutPage() {
  const { streak } = await getDuolingoStreak();
  return <AboutBoard duolingoStreak={streak} />;
}

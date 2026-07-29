import type { Metadata } from "next";
import { getDuolingoStreak } from "@/lib/duolingo";
import AboutBoard from "../../redesign/AboutBoard";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "About Fredy — UI/UX designer and front-end developer based in Los Angeles.",
};

export default async function AboutPage() {
  const { streak } = await getDuolingoStreak();
  return <AboutBoard duolingoStreak={streak} />;
}

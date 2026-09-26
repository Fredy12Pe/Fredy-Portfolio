import type { Metadata } from "next";
import AboutSection from "../AboutSection";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "About Fredy — UI/UX designer and front-end developer based in Los Angeles.",
};

export default function AboutPage() {
  return <AboutSection variant="page" />;
}

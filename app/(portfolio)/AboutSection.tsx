"use client";

import { useVisibleAttr } from "@/lib/visibility";
import AboutBoard from "../redesign/AboutBoard";
import AboutHorizontal from "./AboutHorizontal";
import BoardAtmosphere from "../redesign/BoardAtmosphere";
import RedesignShell from "../redesign/RedesignShell";
import shell from "../redesign/redesign.module.css";
import styles from "./AboutSection.module.css";

type AboutSectionProps = {
  /** Full About page chrome (nav, scroll hint). Embedded keeps the board. */
  variant?: "embedded" | "page";
};

export default function AboutSection({ variant = "embedded" }: AboutSectionProps) {
  if (variant === "page") {
    return (
      <RedesignShell>
        <AboutBoard />
      </RedesignShell>
    );
  }

  return <EmbeddedAbout />;
}

function EmbeddedAbout() {
  // The board's colour wash drifts and its cards are frosted glass. Together that is a
  // blur recomputed on every frame of the drift, for as long as the page is open. The
  // flag below lets the stylesheet switch both off while the section is out of view.
  // The margin is wide so the switch happens well before any of it can be seen.
  const sectionRef = useVisibleAttr<HTMLElement>("data-visible", {
    rootMargin: "400px 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`${shell.page} ${styles.section}`}
      data-theme="light"
      aria-label="About Me"
    >
      <BoardAtmosphere />
      <AboutHorizontal />
    </section>
  );
}

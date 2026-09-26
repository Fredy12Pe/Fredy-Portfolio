"use client";

import AboutBoard from "../redesign/AboutBoard";
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
  return (
    <section
      id="about"
      className={`${shell.page} ${styles.section}`}
      data-theme="light"
      aria-label="About Me"
    >
      <BoardAtmosphere />
      <div
        className={`${shell.pageContent} ${shell.pageContentCompact} ${styles.content}`}
      >
        <AboutBoard />
      </div>
    </section>
  );
}

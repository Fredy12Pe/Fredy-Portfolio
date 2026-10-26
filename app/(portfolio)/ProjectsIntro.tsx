"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { markPortfolioLayout } from "./reload-scroll";
import styles from "./ProjectsIntro.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ProjectsIntro() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      gsap.set(text, { autoAlpha: 1 });
      markPortfolioLayout("projects");
      return;
    }

    let split: SplitText | undefined;
    let timer = 0;

    const setup = () => {
      // After the about pin exists, so this start position is the real one.
      split = SplitText.create(text, {
        type: "words, chars",
        autoSplit: true,
        onSplit(self) {
          // Typewriter: each character appears in turn, with a caret while it types.
          // Trigger the paragraph, not the section, so it plays on screen
          // instead of underneath the pinned about panel.
          gsap.set(self.chars, { autoAlpha: 0 });
          // The caret is a zero-width element moved to sit after the newest character,
          // so it follows the text as it types instead of sitting at the end of the paragraph.
          const chars = self.chars;
          const caret = document.createElement("span");
          caret.className = styles.caret;
          caret.setAttribute("aria-hidden", "true");
          let tween: gsap.core.Tween | undefined;
          tween = gsap.to(chars, {
            autoAlpha: 1,
            duration: 0.01,
            stagger: 0.028,
            ease: "none",
            paused: true,
            onUpdate: () => {
              const typed = Math.floor((tween?.progress() ?? 0) * chars.length);
              const index = Math.min(chars.length - 1, Math.max(0, typed - 1));
              chars[index]?.after(caret);
            },
            onComplete: () => caret.remove(),
            scrollTrigger: {
              trigger: text,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
          return tween;
        },
      });
      ScrollTrigger.refresh();
      markPortfolioLayout("projects");
    };

    timer = window.setTimeout(setup, 0);

    return () => {
      window.clearTimeout(timer);
      split?.revert();
    };
  }, []);

  return (
    <section className={styles.section} aria-label="Projects">
      <p ref={textRef} className={styles.copy}>
        From the jobs that I’ve done to personal projects. This portfolio is
        here to give you a clear picture of what I do and how I can help.
      </p>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
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
      return;
    }

    let split: SplitText | undefined;
    let timer = 0;

    const setup = () => {
      // After the about pin exists, so this start position is the real one.
      split = SplitText.create(text, {
        type: "words, lines",
        autoSplit: true,
        onSplit(self) {
          // Word rise + fade from the GreenSock onSplit pen.
          // Trigger the paragraph, not the section, so it plays on screen
          // instead of underneath the pinned about panel.
          return gsap.from(self.words, {
            autoAlpha: 0,
            y: 25,
            duration: 1,
            stagger: { amount: 1 },
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        },
      });
      ScrollTrigger.refresh();
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

"use client";

import { motion, type Transition } from "motion/react";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.35 } as const;

const TITLE = "About Me";

type AboutBioCardProps = {
  className?: string;
};

export default function AboutBioCard({ className }: AboutBioCardProps) {
  const { active, handlers } = useCardHover();

  return (
    <section
      className={`${styles.card} ${styles.aboutBio} ${className ?? ""}`}
      aria-label="About Fredy"
      data-node-id="145:569"
      tabIndex={0}
      {...handlers}
    >
      <div className={styles.aboutBioScene}>
        <h2 className={styles.aboutBioHeading} aria-label={TITLE}>
          {TITLE.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              className={styles.aboutBioHeadingChar}
              initial={false}
              animate={
                active
                  ? { y: "-0.1em", scale: 1.04 }
                  : { y: 0, scale: 1 }
              }
              transition={{
                ...(active ? HOVER_SPRING : REST_TRANSITION) as Transition,
                delay: active ? i * 0.03 : (TITLE.length - 1 - i) * 0.02,
              }}
            >
              {char === " " ? "\u00a0" : char}
            </motion.span>
          ))}
        </h2>
        <div className={styles.aboutBioCopy}>
          <p>
            Hi, I&apos;m <strong>Fredy</strong>, a{" "}
            <strong>UI/UX designer and developer</strong> based in{" "}
            <strong>Los Angeles</strong>. I enjoy turning ideas into digital experiences that
            are easy to use and feel good to interact with. I&apos;m open to{" "}
            <strong>remote opportunities</strong> and willing to <strong>relocate</strong> for
            the right role.
          </p>
          <p>
            Whether I&apos;m mapping out a <strong>user flow</strong>, designing a screen, or
            building a prototype, I pay attention to the details that make a product feel
            natural. Being able to <strong>design and develop</strong> helps me think through
            the full experience, from the first idea to a{" "}
            <strong>working product</strong>.
          </p>
          <p>
            I&apos;m always learning, trying new things, and looking for better ways to solve
            problems through <strong>design and code</strong>.
          </p>
          <p>
            Outside of design, I&apos;m usually{" "}
            <strong>surfing, running, or producing music</strong>. Those are the things that
            keep me inspired and help me bring fresh energy back to my work.
          </p>
        </div>
      </div>
    </section>
  );
}

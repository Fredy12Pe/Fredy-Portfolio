"use client";

import type { CSSProperties } from "react";
import { useReveal } from "@/lib/reveal";
import { useVisibleAttr } from "@/lib/visibility";
import AboutActivitiesCard from "../redesign/AboutActivitiesCard";
import LocationNavCard from "./LocationNavCard";
import AboutPhotoCard, { StickerDock } from "../redesign/AboutPhotoCard";
import DuolingoCard from "../redesign/DuolingoCard";
import HappyStickers from "./HappyStickers";
import shell from "../redesign/redesign.module.css";
import { ABOUT_SENTENCES } from "./home-data";
import styles from "./home.module.css";

// A cell that keeps a card's designed proportions, and its place in the fade-up order
function cell(width: number, height: number, index: number) {
  return { "--pw": width, "--ph": height, "--fade-i": index } as CSSProperties;
}

/* About: a short introduction, then the photo carousel, Duolingo streak and location cards from the
   redesign board, laid out as a bento. */
export function AboutBento() {
  const revealRef = useReveal<HTMLDivElement>(0.08);
  // The cards' looping decoration holds still while the section is off screen (globals.css)
  const sectionRef = useVisibleAttr<HTMLElement>("data-visible", { rootMargin: "400px 0px" });

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`${styles.section} ${styles.stickerSection}`}
      aria-labelledby="about-heading"
    >
      <div ref={revealRef} className={styles.grid}>
        <div className={`${styles.aboutIntro} fade-up`}>
          <div className={styles.aboutBox}>
            <h2 id="about-heading" className={styles.aboutTitle}>
              About me
            </h2>
            <div className={styles.aboutCopy}>
              {ABOUT_SENTENCES.map((sentence) => (
                <p key={sentence}>{sentence}</p>
              ))}
            </div>
            {/* HAPPY stickers: peel on hover, and can be stuck anywhere in the About section */}
            <HappyStickers />
          </div>
        </div>

        <div className={`${shell.page} ${styles.aboutShell}`} data-theme="light">
          <div className={`${styles.cell} ${styles.cellPhoto} fade-up`} style={cell(900, 720, 1)}>
            <AboutPhotoCard />
          </div>
          <div className={styles.aboutRow}>
            <div className={`${styles.cell} fade-up`} style={cell(900, 586, 2)}>
              <DuolingoCard />
            </div>
            <div className={styles.aboutStack}>
              <div className={`${styles.cell} fade-up`} style={cell(759, 336, 3)}>
                <LocationNavCard />
              </div>
              <div className={`${styles.cell} ${styles.cellActivities} fade-up`} style={cell(759, 502, 4)}>
                <AboutActivitiesCard />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stickers placed anywhere in the section, other than the camera, live here */}
      <StickerDock free />
    </section>
  );
}

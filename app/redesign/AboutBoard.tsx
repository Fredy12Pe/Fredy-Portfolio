"use client";

import AboutActivitiesCard from "./AboutActivitiesCard";
import AboutBioCard from "./AboutBioCard";
import AboutMapCard from "./AboutMapCard";
import AboutPhotoCard from "./AboutPhotoCard";
import AboutSkillsCard from "./AboutSkillsCard";
import DuolingoCard from "./DuolingoCard";
import styles from "./redesign.module.css";

type AboutBoardProps = {
  duolingoStreak?: number;
};

export default function AboutBoard({ duolingoStreak }: AboutBoardProps) {
  return (
    <div
      className={`${styles.board} ${styles.aboutBoard}`}
      id="about"
      data-node-id="144:195"
      data-name="About Me"
    >
      <AboutBioCard />

      <AboutPhotoCard />

      <DuolingoCard initialStreak={duolingoStreak} />

      <AboutMapCard />

      <AboutActivitiesCard />

      <AboutSkillsCard />
    </div>
  );
}

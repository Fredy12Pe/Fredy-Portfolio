"use client";

import BreatheWithSprout from "./BreatheWithSprout";
import ContactCard from "./ContactCard";
import FavoriteStackCard from "./FavoriteStackCard";
import FredyCard from "./FredyCard";
import GroveCard from "./GroveCard";
import OpenToWorkCard from "./OpenToWorkCard";
import SamplesCard from "./SamplesCard";
import SeaSkyCard from "./SeaSkyCard";
import SelahCard from "./SelahCard";
import TidehausCard from "./TidehausCard";
import ZiplearnCard from "./ZiplearnCard";
import styles from "./redesign.module.css";

export default function RedesignBoard({
  breathingActive = false,
  onBreathingSessionChange,
}: {
  breathingActive?: boolean;
  onBreathingSessionChange?: (active: boolean) => void;
}) {
  return (
    <div className={styles.board} id="home" data-node-id="51:648">
      <FredyCard />

      <GroveCard />
      <SamplesCard />
      <SeaSkyCard />
      <SelahCard />
      <ZiplearnCard />
      <TidehausCard />

      <section
        className={`${styles.card} ${styles.breathe}${breathingActive ? ` ${styles.breatheSpotlight}` : ""}`}
        aria-label="Breathe with Sprout"
      >
        <BreatheWithSprout onSessionChange={onBreathingSessionChange} />
      </section>

      <OpenToWorkCard />
      <FavoriteStackCard />
      <ContactCard />
    </div>
  );
}

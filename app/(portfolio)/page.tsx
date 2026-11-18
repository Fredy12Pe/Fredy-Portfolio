"use client";

import { useEffect } from "react";
import { AboutBento } from "./AboutBento";
import ContactSection from "./ContactSection";
import OpenToWork from "./OpenToWork";
import OutcomeStrip from "./OutcomeStrip";
import ProcessSteps from "./ProcessSteps";
import ServicesStack from "./ServicesStack";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import StickyMenu from "./StickyMenu";
import { FeaturedWork, MoreWork } from "./WorkSections";
import { markPortfolioLayout } from "./reload-scroll";
import styles from "./home.module.css";

export default function HomePage() {
  // A reload further down the page is held until the layout is known (see app/layout.tsx).
  // Nothing here changes height after the first render, so both parts are ready at once.
  useEffect(() => {
    markPortfolioLayout("about");
    markPortfolioLayout("projects");
  }, []);

  return (
    <main className={styles.page}>
      <StickyMenu />
      <SiteHeader />
      <OutcomeStrip />
      <FeaturedWork />
      <MoreWork />
      <AboutBento />
      <ServicesStack />
      <ProcessSteps />
      <OpenToWork />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}

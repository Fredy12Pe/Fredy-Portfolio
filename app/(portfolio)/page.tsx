"use client";

import AboutIntro from "./AboutIntro";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import ProjectsCarousel from "./ProjectsCarousel";
import ProjectsIntro from "./ProjectsIntro";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.stickerRange} data-sticker-bounds>
        <SiteHeader />
        <AboutIntro />
      </div>
      <ProjectsIntro />
      <div className={styles.projects} id="work">
        <ProjectsCarousel />
      </div>
      <AboutSection />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}

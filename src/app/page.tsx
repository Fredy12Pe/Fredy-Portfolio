"use client";
import Header from "@/components/layout/Header";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import FavoriteStackSection from "@/components/sections/FavoriteStackSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative">
        <Header />
        <ProjectsSection />
        <main className="w-full px-0 py-8 md:py-16">
          <AboutSection />
          <FavoriteStackSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

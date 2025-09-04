"use client";
import { useEffect, useState } from "react";
// import SplineOverlay from "@/components/hero/SplineOverlay";
import Header from "@/components/layout/Header";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import FavoriteStackSection from "@/components/sections/FavoriteStackSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [showSpline, setShowSpline] = useState(false); // Temporarily disabled

  useEffect(() => {
    // Only skip Spline if coming from a project page (not for hash navigation)
    const fromProject = document.referrer.includes('/projects/');
    
    // Only skip Spline if coming from project page
    if (fromProject) {
      setShowSpline(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Temporarily disabled Spline to fix webpack error */}
      {/* {showSpline && <SplineOverlay />} */}
      <div className="relative">
        <Header />
        <main className="w-full px-0 py-8 md:py-16">
          <ProjectsSection />
          <AboutSection />
          <FavoriteStackSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}



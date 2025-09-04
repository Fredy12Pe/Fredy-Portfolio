"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import FavoriteStackSection from "@/components/sections/FavoriteStackSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

// Dynamically import SplineOverlay with no SSR to avoid webpack issues
const SplineOverlay = dynamic(() => import("@/components/hero/SplineOverlay"), {
  ssr: false,
  loading: () => (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #1828CA 0%, #030A48 100%)'
      }}
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-xl font-medium">Loading Experience...</div>
        <div className="text-white/80 text-sm mt-2">Preparing your journey</div>
      </div>
    </div>
  )
});

export default function Home() {
  const [showSpline, setShowSpline] = useState(false);

  useEffect(() => {
    // Check if coming from a project page via referrer
    const fromProject = document.referrer.includes('/projects/');
    
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('visited');
    
    // Show Spline only on:
    // 1. First visit (no sessionStorage flag)
    // 2. NOT coming from a project page (to allow Spline on refresh from other pages)
    if (!hasVisited && !fromProject) {
      setShowSpline(true);
      // Mark that user has visited to prevent showing Spline on subsequent navigations
      sessionStorage.setItem('visited', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen">
      {showSpline && <SplineOverlay />}
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



import SplineOverlay from "@/components/hero/SplineOverlay";
import Header from "@/components/layout/Header";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import FavoriteStackSection from "@/components/sections/FavoriteStackSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SplineOverlay />
      <div className="relative">
        <Header />
        <main className="w-full px-0 py-16">
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



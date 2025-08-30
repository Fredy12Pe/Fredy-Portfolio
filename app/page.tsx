import Header from "@/components/layout/Header";
import ProjectsSection from "@/components/sections/ProjectsSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full px-0 py-16">
        <ProjectsSection />
      </main>
    </>
  );
}



"use client";
import { useEffect, useRef } from "react";

// Tech Stack Images - using public folder paths
interface TechStackItem {
  name: string; // Title shown under the logo
  description: string; // Short blurb under the title
  image: string;
  category: "Development" | "Design" | "AI";
}

const techStack: TechStackItem[] = [
  {
    name: "Cursor",
    description: "AI-powered coding assistant that speeds up development.",
    image: "/images/tech-stack/Cursor.png",
    category: "Development",
  },
  {
    name: "ChatGPT",
    description: "Helps with ideation, copywriting, and dev problem-solving.",
    image: "/images/tech-stack/GPT.png",
    category: "AI",
  },
  {
    name: "Next.js",
    description: "A modern full-stack React framework for web apps.",
    image: "/images/tech-stack/NextJS.png",
    category: "Development",
  },
  {
    name: "React",
    description: "Component-based UI library for building interactive apps.",
    image: "/images/tech-stack/React.png",
    category: "Development",
  },
  {
    name: "Figma",
    description: "Collaborative UI/UX design and prototyping platform.",
    image: "/images/tech-stack/Figma.png",
    category: "Design",
  },
  {
    name: "Photoshop",
    description: "Industry-standard tool for image editing and visual design.",
    image: "/images/tech-stack/Photoshop.png",
    category: "Design",
  },
  {
    name: "Illustrator",
    description: "Vector-based design software for icons, graphics, and branding.",
    image: "/images/tech-stack/Illustrator.png",
    category: "Design",
  },
];

export default function FavoriteStackSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const items = section.querySelectorAll<HTMLElement>('[data-parallax]');
      const vh = window.innerHeight || 800;
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
        const speedAttr = el.getAttribute('data-speed');
        const speed = speedAttr ? parseFloat(speedAttr) : 0.25;
        const translate = (0.5 - progress) * speed * 180;
        el.style.willChange = 'transform, opacity';
        el.style.transform = `translateY(${translate.toFixed(2)}px)`;
        el.style.opacity = (0.6 + progress * 0.4).toFixed(2);
      });
    };
    
    onScroll();
    
    // Local reveal for Favorite Stack section
    const revealItems = Array.from(sectionRef.current?.querySelectorAll<HTMLElement>('[data-reveal]') || []);

    revealItems.forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 650ms ease, transform 650ms cubic-bezier(0.22,1,0.36,1)';
      el.style.transitionDelay = `${idx * 110}ms`;
    });
    
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    
    revealItems.forEach((el) => io.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      io.disconnect();
    };
  }, []);

  const developmentTools = techStack.filter(item => item.category === "Development");
  const designTools = techStack.filter(item => item.category === "Design");

  return (
    <section
      ref={sectionRef}
      id="favorite-stack"
      className="w-full bg-[#FFF4D5] pt-8 pb-16 md:pt-12 md:pb-24"
    >
      <div className="mx-auto max-w-[100rem] px-4 md:px-8">
        <h2 className="whitespace-nowrap text-left text-[36px] font-black uppercase tracking-tight text-zinc-900 sm:text-[56px] md:text-[72px] lg:text-[90px] xl:text-[110px]">
          Favorite Stack
        </h2>

        <div data-reveal>
          <div data-parallax data-speed="0.18" className="mt-6 w-full md:mt-0 md:w-4/6">
            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[22px] leading-relaxed md:leading-8 lg:leading-9 xl:leading-[34px] text-[#828282]">
              These are the <span className="font-semibold text-zinc-900">tools and technologies</span> that power my creative process. From design to development, each tool in my stack serves a specific purpose in bringing ideas to life with precision and efficiency.
            </p>
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-4 md:gap-8">
          {techStack.map((tech, index) => (
            <div key={tech.name} data-reveal>
              <div
                data-parallax
                data-speed="0.15"
                className="group relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#1A1A1A] p-4 transition-all duration-300 md:aspect-square md:border md:border-white/10 md:p-8 md:hover:border-white/20 md:hover:bg-[#222222]"
              >
                {/* Hover overlay background */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#121212",
                    boxShadow: "0px 0px 60px 10px rgba(67, 128, 255, 0.20) inset",
                    borderRadius: 20,
                    border: "1px rgba(162, 89, 255, 0.40) solid",
                    zIndex: 0,
                  }}
                />

                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center transition-all duration-300">
                  <div className="flex h-16 w-16 items-center justify-center transition-transform duration-300 md:h-36 md:w-36 md:group-hover:-translate-y-2 md:group-hover:scale-110">
                    <img
                      src={tech.image}
                      alt={tech.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="mt-4 max-h-24 overflow-hidden text-center opacity-100 transition-all duration-300 md:mt-0 md:max-h-0 md:opacity-0 md:group-hover:mt-4 md:group-hover:max-h-24 md:group-hover:opacity-100">
                    <h3 className="text-sm font-semibold tracking-wide text-zinc-100 md:text-base">
                      {tech.name}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#CFCFCF] md:text-sm">
                      {tech.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories removed as requested */}
      </div>
    </section>
  );
}

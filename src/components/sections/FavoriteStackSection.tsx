"use client";
import { useEffect, useRef, useState } from "react";

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const cardShadowColors = ["#4DA8A1", "#E66B6B", "#E5B548", "#7D65BD"];

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
        el.style.willChange = 'transform';
        el.style.transform = `translateY(${translate.toFixed(2)}px)`;
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

        <div data-reveal className="hidden md:block">
          <div data-parallax data-speed="0.18" className="mt-6 w-full md:mt-0 md:w-4/6">
            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[22px] leading-relaxed md:leading-8 lg:leading-9 xl:leading-[34px] text-[#828282]">
              These are the <span className="font-semibold text-zinc-900">tools and technologies</span> that power my creative process. From design to development, each tool in my stack serves a specific purpose in bringing ideas to life with precision and efficiency.
            </p>
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:mt-16 md:grid-cols-4 md:gap-10">
          {techStack.map((tech, index) => (
            <div
              key={tech.name}
              data-reveal
              className="favorite-stack-card-breathe"
              style={{ animationDelay: `${index * 180}ms` }}
            >
              <div
                onMouseEnter={() => setHoveredCard(tech.name)}
                onMouseLeave={() => setHoveredCard((active) => (active === tech.name ? null : active))}
                className={`group relative flex aspect-[5/4] items-center justify-center border-2 border-zinc-200 bg-[#121212] p-4 transition-transform duration-300 ease-out md:p-8 ${
                  hoveredCard === tech.name ? "z-20 scale-[1.05]" : "scale-100"
                }`}
                style={{ boxShadow: `8px 8px 0 ${cardShadowColors[index % cardShadowColors.length]}` }}
              >
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center transition-transform duration-300 group-hover:scale-110 md:h-28 md:w-28">
                    <img
                      src={tech.image}
                      alt={tech.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100 md:text-sm">
                      {tech.name}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories removed as requested */}
      </div>
      <style jsx>{`
        @keyframes cardBreathe {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .favorite-stack-card-breathe {
          animation: cardBreathe 4.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .favorite-stack-card-breathe {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

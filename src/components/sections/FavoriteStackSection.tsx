"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Tech Stack Images
import CursorImg from "../../../app/mainPage Assets/Tech Stack/Cursor.png";
import FigmaImg from "../../../app/mainPage Assets/Tech Stack/Figma.png";
import GPTImg from "../../../app/mainPage Assets/Tech Stack/GPT.png";
import IllustratorImg from "../../../app/mainPage Assets/Tech Stack/Illustrator.png";
import NextJSImg from "../../../app/mainPage Assets/Tech Stack/NextJS.png";
import PhotoshopImg from "../../../app/mainPage Assets/Tech Stack/Photoshop.png";
import ReactImg from "../../../app/mainPage Assets/Tech Stack/React.png";
import SplineImg from "../../../app/mainPage Assets/Tech Stack/Spline.png";

interface TechStackItem {
  name: string; // Title shown under the logo
  description: string; // Short blurb under the title
  image: any;
  category: "Development" | "Design" | "AI";
}

const techStack: TechStackItem[] = [
  {
    name: "Cursor",
    description: "AI-powered coding assistant that speeds up development.",
    image: CursorImg,
    category: "Development",
  },
  {
    name: "ChatGPT",
    description: "Helps with ideation, copywriting, and dev problem-solving.",
    image: GPTImg,
    category: "AI",
  },
  {
    name: "Next.js",
    description: "A modern full-stack React framework for web apps.",
    image: NextJSImg,
    category: "Development",
  },
  {
    name: "React",
    description: "Component-based UI library for building interactive apps.",
    image: ReactImg,
    category: "Development",
  },
  {
    name: "Figma",
    description: "Collaborative UI/UX design and prototyping platform.",
    image: FigmaImg,
    category: "Design",
  },
  {
    name: "Photoshop",
    description: "Industry-standard tool for image editing and visual design.",
    image: PhotoshopImg,
    category: "Design",
  },
  {
    name: "Illustrator",
    description: "Vector-based design software for icons, graphics, and branding.",
    image: IllustratorImg,
    category: "Design",
  },
  {
    name: "Spline",
    description: "3D design tool for interactive visuals and product mockups.",
    image: SplineImg,
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
    <section ref={sectionRef} id="favorite-stack" className="mx-auto mt-24 max-w-[100rem] px-4 md:px-8">
      <h2 className="whitespace-nowrap text-[36px] sm:text-[56px] md:text-[72px] lg:text-[90px] xl:text-[110px] font-black tracking-tight text-white uppercase">
        Favorite Stack
      </h2>

      <div data-reveal>
        <div data-parallax data-speed="0.18" className="mt-0 w-full md:w-4/6">
          <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[22px] leading-relaxed md:leading-8 lg:leading-9 xl:leading-[34px] text-[#828282]">
            These are the <span className="font-semibold text-white">tools and technologies</span> that power my creative process. From design to development, each tool in my stack serves a specific purpose in bringing ideas to life with precision and efficiency.
          </p>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {techStack.map((tech, index) => (
          <div key={tech.name} data-reveal>
            <div 
              data-parallax 
              data-speed="0.15" 
              className="group relative overflow-hidden rounded-2xl bg-[#1A1A1A] border border-white/10 md:hover:border-white/20 transition-all duration-300 aspect-square p-6 md:p-8 flex items-center justify-center md:hover:bg-[#222222]"
            >
              {/* Hover overlay background */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#121212',
                  boxShadow: '0px 0px 60px 10px rgba(67, 128, 255, 0.20) inset',
                  borderRadius: 20,
                  border: '1px rgba(162, 89, 255, 0.40) solid',
                  zIndex: 0,
                }}
              />

              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full transition-all duration-300">
                <div className="w-28 h-28 md:w-36 md:h-36 transition-transform duration-300 md:group-hover:scale-110 md:group-hover:-translate-y-2 flex items-center justify-center">
                  <Image
                    src={tech.image}
                    alt={tech.name}
                    width={144}
                    height={144}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="mt-4 max-h-24 opacity-100 overflow-hidden transition-all duration-300 md:mt-0 md:max-h-0 md:opacity-0 md:group-hover:max-h-24 md:group-hover:opacity-100 md:group-hover:mt-4 text-center">
                  <h3 className="text-white font-semibold tracking-wide text-sm md:text-base">
                    {tech.name}
                  </h3>
                  <p className="text-[#CFCFCF] text-[12px] md:text-sm leading-relaxed mt-1">
                    {tech.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories removed as requested */}
    </section>
  );
}

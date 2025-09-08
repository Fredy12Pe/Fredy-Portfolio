"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { IconShoppingCart, IconPalette, IconCode, IconRocket } from "@tabler/icons-react";
import ProjectNav from "@/components/layout/ProjectNav";

const DotGrid = dynamic(() => import("../selah-reflect/DotGrid"), { ssr: false });

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({
  id,
  eyebrow,
  title,
  kicker,
  children,
  bg = "bg-black",
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  kicker?: React.ReactNode;
  children?: React.ReactNode;
  bg?: string;
}) => (
  <section id={id} className={`relative py-20 sm:py-28 ${bg}`}>
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl"
      >
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 ring-1 ring-zinc-700">
            {eyebrow}
          </div>
        ) : null}
        {title ? (
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        ) : null}
        {kicker ? <p className="mt-3 text-base text-zinc-300">{kicker}</p> : null}
      </motion.div>
      <div className="mt-10">{children}</div>
    </Container>
  </section>
);

// Header pills ---------------------------------------------------------------
const HeaderPill = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15"
  >
    {children}
  </motion.span>
);

const LogoPill = ({ src, alt, label }: { src: string; alt: string; label: string }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">
    <Image src={src} alt={alt} width={16} height={16} className="opacity-90" />
    {label}
  </span>
);

// Progress bar ---------------------------------------------------------------
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"
    />
  );
}

// GlowCard (hover highlight) -------------------------------------------------
function useMouseGradient() {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };
  return { ref, onMouseMove };
}

const GlowCard = ({ title, desc }: { title: string; desc: string }) => {
  const { ref, onMouseMove } = useMouseGradient();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="group relative h-full min-h-[160px] rounded-2xl border border-zinc-700 bg-zinc-800 p-5 transition-shadow duration-300 hover:shadow-xl"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(31,41,55,0.15), rgba(11,15,20,0.12), rgba(107,114,128,0.12), transparent 40%)",
        }}
      />
      <div className="relative">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="mt-2 text-sm text-zinc-300">{desc}</p>
      </div>
    </div>
  );
};

// Timeline item --------------------------------------------------------------
function TimelineItem({ n, title, desc, icon }: { n: number; title: string; desc: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="relative pl-14">
      <div className="absolute left-0 top-0 grid w-10 place-items-center">
        <div
          className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white shadow-sm ring-1 ring-white/20"
          style={{ background: "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)" }}
        >
          {n}
        </div>
      </div>
      {icon ? <div className="mb-2 text-2xl">{icon}</div> : null}
      <h4 className="text-xl font-semibold text-white">{title}</h4>
      <div className="mt-2 text-base leading-7 text-zinc-300">{desc}</div>
    </div>
  );
}

// Problem Statement card (minimal) ------------------------------------------
function ProblemCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-zinc-800 p-5 ring-1 ring-zinc-700 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)" }}
      />
      <div className="relative flex items-start gap-3">
        <div className="mt-1 text-zinc-400 transition-colors group-hover:text-white">{icon}</div>
        <div>
          <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-white">{title}</h4>
          <p className="mt-1 text-sm text-zinc-300 transition-colors group-hover:text-white/90">{text}</p>
        </div>
      </div>
    </div>
  );
}

// Image placeholder component
const ImagePlaceholder = ({ height = 400, label = "Image placeholder", recommendedSize = "" }: { height?: number; label?: string; recommendedSize?: string }) => (
  <div
    role="img"
    aria-label={label}
    className="w-full overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-inset ring-zinc-700 flex items-center justify-center"
    style={{ height }}
  >
    <div className="text-center text-zinc-400">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs mt-1">Upload image here</div>
      {recommendedSize && (
        <div className="text-xs mt-2 text-zinc-500">Recommended: {recommendedSize}</div>
      )}
    </div>
  </div>
);

export default function TidehausCaseStudyPage() {
  // Hover state for Key Design Elements section
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const getOpacityClass = (elementId: string) => {
    // On mobile, always show all elements at full opacity
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'opacity-100';
    }
    
    if (hoveredElement === null) {
      // Default state: video full opacity, others reduced
      return elementId === 'video' ? 'opacity-100' : 'opacity-20';
    }
    // When hovering: only hovered element full opacity, others reduced
    return hoveredElement === elementId ? 'opacity-100' : 'opacity-20';
  };

  return (
    <div className="min-h-screen bg-black">
      <ProjectNav />
      <main className="bg-black text-zinc-100 pt-16">
        <ProgressBar />
        
        {/* Hero */}
        <header className="relative isolate overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
          {/* subtle dot grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 60%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 60%, transparent 100%)",
            }}
          />
          {/* interactive grid */}
          <div className="absolute inset-0 -z-10">
            <DotGrid
              dotSize={6}
              gap={12}
              baseColor="#6b7280"
              activeColor="#ffffff"
              baseAlpha={0.06}
              activeAlpha={0.5}
              proximity={130}
              shockRadius={240}
              shockStrength={4}
              returnDuration={1}
            />
          </div>
          <Container>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 py-20 sm:py-28">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="lg:flex-1 lg:pr-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl md:text-7xl">Tidehaus Online Surf Shop</h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-200">
                  A premium surf gear and beachwear e-commerce platform designed as a concept project, creating a high-end, mobile-first shopping experience.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <HeaderPill>Role: UI/UX Designer & Frontend Developer</HeaderPill>
                  <HeaderPill>Timeline: 1 month</HeaderPill>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <LogoPill src="/stack/figma.svg" alt="Figma" label="Figma" />
                  <LogoPill src="/stack/illustrator.svg" alt="Illustrator" label="Illustrator" />
                  <LogoPill src="/stack/photoshop.svg" alt="Photoshop" label="Photoshop" />
                  <LogoPill src="/stack/cursor.svg" alt="Cursor" label="Cursor" />
                </div>
                <div className="mt-6">
                  <a 
                    href="https://online-surf-shop-a8b1mqoyh-fredys-projects-8feeb27c.vercel.app/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-100 transition-colors"
                  >
                    View Live Project →
                  </a>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex items-center justify-center">
                <div className="overflow-hidden rounded-3xl w-full max-w-[450px] shadow-2xl ring-1 ring-white/10">
                  <Image
                    src="/projects/tidehaus/images/main-header.png"
                    alt="Tidehaus Online Surf Shop hero mockup showing homepage on laptop + mobile"
                    width={1200}
                    height={800}
                    className="block w-full h-auto object-contain"
                    priority
                    style={{ transform: "translateZ(0)" }}
                  />
                </div>
              </motion.div>
            </div>
          </Container>
        </header>

        {/* Project Brief */}
        <Section id="brief" eyebrow="Project Overview" title="Context" bg="bg-black">
          <div className="max-w-3xl space-y-4">
            <p>
              Tidehaus is a premium surf gear and beachwear e-commerce platform designed as a concept project. The goal was to create a high-end, mobile-first shopping experience while managing complex product variants like surfboard dimensions, wetsuit sizing, and accessories.
            </p>
            <p>
              This project focused on design implementation, showcasing how thoughtful design paired with scalable technology can deliver a premium e-commerce experience. The dark theme provided a sleek aesthetic while making product photography stand out.
            </p>
          </div>
        </Section>

        {/* Design Approach */}
        <Section id="approach" eyebrow="Design Approach" title="Design Direction" bg="bg-black">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p>
                The design direction was centered on surf culture while maintaining a modern e-commerce standard. Key decisions included a dark theme for premium aesthetics, ocean-inspired color palette with crisp whites and green accents, and the Outfit font family for modern readability.
              </p>
              <p>
                The layout system used a 4px spacing grid with card-based product layouts and reusable components. Micro-interactions included smooth hover effects, typography scaling, and subtle animations to enhance the user experience.
              </p>
            </div>
            <div className="flex items-start justify-center lg:justify-end">
              <div className="overflow-hidden rounded-2xl self-start w-full max-w-[520px]">
                <Image
                  src="/projects/tidehaus/images/color-palette.png"
                  alt="Tidehaus color palette and typography board showing ocean-inspired colors and Outfit font family"
                  width={1200}
                  height={600}
                  className="block w-full h-auto object-contain"
                  style={{ transform: "translateZ(0)" }}
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully');
                  }}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Key UI Decisions */}
        <Section id="ui-decisions" eyebrow="Key UI Decisions" title="Design Highlights" bg="bg-black">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch [grid-auto-rows:1fr]">
            {[
              { t: "Hero Section", d: "Full-screen surf video with CTA to immerse users immediately." },
              { t: "Product Cards", d: "Clean hover states, consistent ratios, quick-action buttons." },
              { t: "Product Details", d: "Modal-based exploration with gallery and variant selection." },
              { t: "Micro-interactions", d: "Smooth hover effects, typography scaling, subtle animations." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="h-full">
                <GlowCard title={f.t} desc={f.d} />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Design Visuals */}
        <Section id="design-visuals" eyebrow="Design Stage" title="Key Design Elements" bg="bg-[#000811]">
          <div className="space-y-8">
            <div className="max-w-3xl">
              <p className="text-zinc-300 text-lg leading-relaxed">
                The interface showcases a modern e-commerce experience with intuitive navigation, 
                product discovery, and seamless shopping interactions. Each screen demonstrates 
                key user flows and design patterns that enhance the shopping experience.
              </p>
            </div>
            <div className="flex justify-center">
              <div 
                className={`overflow-hidden rounded-3xl w-full max-w-6xl shadow-2xl ring-1 ring-white/10 transition-opacity duration-300 ${getOpacityClass('video')}`}
                onMouseEnter={() => {
                  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                    setHoveredElement('video');
                  }
                }}
                onMouseLeave={() => {
                  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                    setHoveredElement(null);
                  }
                }}
              >
                <video
                  className="w-full h-auto"
                  autoPlay
                  loop
                  muted
                  preload="metadata"
                  poster="/projects/tidehaus/images/color-palette.png"
                >
                  <source src="/projects/tidehaus/images/tidehaus-screen-record.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div 
                  className={`overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-opacity duration-300 ${getOpacityClass('product-cards')}`}
                  onMouseEnter={() => {
                    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                      setHoveredElement('product-cards');
                    }
                  }}
                  onMouseLeave={() => {
                    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                      setHoveredElement(null);
                    }
                  }}
                >
                  <Image
                    src="/projects/tidehaus/images/product-cards.png"
                    alt="Product card mockups with hover states showing surf gear"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium mb-2">Product Catalog</h4>
                  <p className="text-zinc-400 text-sm">
                    Clean product grid showcasing surf gear with clear pricing, 
                    categories, and visual hierarchy for easy browsing.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div 
                  className={`overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-opacity duration-300 ${getOpacityClass('product-modal')}`}
                  onMouseEnter={() => {
                    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                      setHoveredElement('product-modal');
                    }
                  }}
                  onMouseLeave={() => {
                    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                      setHoveredElement(null);
                    }
                  }}
                >
                  <Image
                    src="/projects/tidehaus/images/product-detail-modal.png"
                    alt="Product detail modal with size/color selection for surfboard bag"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium mb-2">Product Detail Modal</h4>
                  <p className="text-zinc-400 text-sm">
                    Detailed product view with specifications, features, 
                    stock availability, and clear call-to-action for purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Tools Used */}
        <Section id="tools" eyebrow="Tools Used" title="Design & Development Stack" bg="bg-black">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Design Tools</h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• Figma for UI design</li>
                <li>• Illustrator & Photoshop for visuals</li>
                <li>• Cursor + ChatGPT for iteration</li>
                <li>• Framer Motion for interactive prototyping</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Development Stack</h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• Next.js 13+ (TypeScript)</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Prisma with PostgreSQL</li>
                <li>• Cloudinary for image hosting</li>
                <li>• NextAuth.js for authentication</li>
                <li>• Vercel for deployment</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Implementation */}
        <Section id="implementation" eyebrow="Implementation" title="Technical Approach" bg="bg-black">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p>
                The build was grounded in a component-driven approach with a modern frontend + backend stack. The frontend used Next.js 13+ with TypeScript, Tailwind CSS for styling, and Framer Motion for animations.
              </p>
              <p>
                The backend utilized Prisma with PostgreSQL for database management, Cloudinary for scalable image hosting, and NextAuth.js for authentication. The entire application was deployed on Vercel for optimal performance.
              </p>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[520px]">
                <div className="grid grid-cols-2 gap-8 p-8 rounded-2xl ring-1 ring-inset ring-zinc-700 bg-zinc-800 h-[400px] items-center justify-items-center">
                  {/* Next.js */}
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-white rounded-lg flex items-center justify-center">
                      <div className="text-black font-bold text-lg">N</div>
                    </div>
                    <h4 className="text-white font-medium text-sm">Next.js</h4>
                    <p className="text-zinc-400 text-xs">Frontend Framework</p>
                  </div>
                  
                  {/* Prisma */}
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-[#2D3748] rounded-lg flex items-center justify-center">
                      <div className="text-white font-bold text-lg">P</div>
                    </div>
                    <h4 className="text-white font-medium text-sm">Prisma</h4>
                    <p className="text-zinc-400 text-xs">ORM & Database</p>
                  </div>
                  
                  {/* Cloudinary */}
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-[#3448C5] rounded-lg flex items-center justify-center">
                      <div className="text-white font-bold text-lg">C</div>
                    </div>
                    <h4 className="text-white font-medium text-sm">Cloudinary</h4>
                    <p className="text-zinc-400 text-xs">Image Hosting</p>
                  </div>
                  
                  {/* PostgreSQL */}
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-[#336791] rounded-lg flex items-center justify-center">
                      <div className="text-white font-bold text-lg">PG</div>
                    </div>
                    <h4 className="text-white font-medium text-sm">PostgreSQL</h4>
                    <p className="text-zinc-400 text-xs">Database</p>
                  </div>
                </div>
                
                {/* Connection Lines */}
                <div className="relative mt-4">
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1"></div>
                      <div className="text-xs text-emerald-400">API Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mb-1"></div>
                      <div className="text-xs text-blue-400">Data Flow</div>
                    </div>
                    <div className="text-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mx-auto mb-1"></div>
                      <div className="text-xs text-purple-400">Image Upload</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Challenges & Solutions */}
        <Section id="challenges" eyebrow="Challenges & Solutions" title="Key Technical Challenges" bg="bg-black">
          <div className="grid gap-6 md:grid-cols-3">
            <ProblemCard
              icon={<IconShoppingCart size={22} stroke={1.8} />}
              title="Product Variants"
              text="Created a flexible schema and UI to handle surfboard dimensions, wetsuit sizes, and accessories."
            />
            <ProblemCard
              icon={<IconPalette size={22} stroke={1.8} />}
              title="Image Hosting"
              text="Learned Cloudinary integration to store and optimize product media efficiently."
            />
            <ProblemCard
              icon={<IconCode size={22} stroke={1.8} />}
              title="Admin Dashboard"
              text="Built intuitive CRUD forms with validation and preview to simplify product management."
            />
          </div>
        </Section>

        {/* Results & Takeaways */}
        <Section id="results" eyebrow="Results & Takeaways" title="Project Outcomes" bg="bg-black">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Key Achievements</h3>
              <p>
                This project demonstrated how thoughtful design paired with scalable technology can deliver a premium e-commerce experience. It delivered a full-stack e-commerce concept showcasing premium UI/UX while strengthening React, TypeScript, and API integration skills.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Learning Outcomes</h3>
              <p>
                The project provided valuable experience in designing with scalability in mind through reusable UI components, learning Cloudinary integration for image management, and building comprehensive admin dashboards for product management.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Future Opportunities</h3>
              <p>
                Potential enhancements include advanced filtering and personalization features, AR product visualization, and expansion into a dedicated mobile app for an even more immersive shopping experience.
              </p>
            </div>
          </div>
        </Section>

        {/* Desktop & Mobile Views */}
        <Section id="showcase" eyebrow="Final Showcase" title="Desktop & Mobile Views" bg="bg-black">
          <div className="space-y-8">
            <div className="max-w-3xl">
              <p className="text-zinc-300 text-lg leading-relaxed">
                The Tidehaus experience is optimized for both desktop and mobile users, 
                ensuring a seamless shopping experience across all devices with responsive 
                design and touch-friendly interactions.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 max-w-6xl w-full">
                <Image
                  src="/projects/tidehaus/images/desktop-mobile-views.png"
                  alt="Side-by-side desktop and mobile views showing Tidehaus responsive design"
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section bg="bg-black">
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <h3 className="text-2xl font-semibold text-white">Interested in more work?</h3>
            <p className="max-w-xl text-sm text-zinc-300">Explore other case studies or reach out for a walkthrough.</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <a 
                href="https://online-surf-shop-a8b1mqoyh-fredys-projects-8feeb27c.vercel.app/#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-100"
              >
                View Live Project →
              </a>
              <Link 
                href="/"
                className="inline-flex items-center rounded-full border border-zinc-600 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Back to Home →
              </Link>
              <Link 
                href="/#contact"
                className="inline-flex items-center rounded-full border border-zinc-600 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </Section>

        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} Tidehaus Online Surf Shop · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { IconShoppingCart, IconUsers, IconSearch } from "@tabler/icons-react";
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
  bg = "white",
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
            {eyebrow}
          </div>
        ) : null}
        {title ? (
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">{title}</h2>
        ) : null}
        {kicker ? <p className="mt-3 text-base text-zinc-600">{kicker}</p> : null}
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
      style={{ scaleX, background: "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)" }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left"
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
      className="group relative h-full min-h-[160px] rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow duration-300 hover:shadow-xl"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(31,41,55,0.15), rgba(11,15,20,0.12), rgba(107,114,128,0.12), transparent 40%)",
        }}
      />
      <div className="relative">
        <h4 className="text-base font-semibold text-black">{title}</h4>
        <p className="mt-2 text-sm text-zinc-600">{desc}</p>
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
      <h4 className="text-xl font-semibold text-zinc-900">{title}</h4>
      <div className="mt-2 text-base leading-7 text-zinc-600">{desc}</div>
    </div>
  );
}

// Problem Statement card (minimal) ------------------------------------------
function ProblemCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-zinc-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)" }}
      />
      <div className="relative flex items-start gap-3">
        <div className="mt-1 text-zinc-500 transition-colors group-hover:text-white">{icon}</div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-white">{title}</h4>
          <p className="mt-1 text-sm text-zinc-700 transition-colors group-hover:text-white/90">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function EcommerceCaseStudyPage() {
  return (
    <div className="min-h-screen bg-white">
      <ProjectNav />
      <main className="bg-white text-zinc-800 pt-16">
        <ProgressBar />
        
        {/* Hero */}
        <header className="relative isolate overflow-hidden" style={{ background: "linear-gradient(223deg, #1f2937 0%, #0b0f14 100%)" }}>
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
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 py-20 sm:py-28">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="lg:flex-1 lg:pr-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-6xl">Arktura Samples Store</h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-200">
                  Led the redesign of the Samples Store, leveraging a Shopify template to create a streamlined and user-friendly shopping journey.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <HeaderPill>Role: UI/UX Designer</HeaderPill>
                  <HeaderPill>Timeline: 4 months</HeaderPill>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <LogoPill src="/stack/shopify.svg" alt="Shopify" label="Shopify" />
                  <LogoPill src="/stack/figma.svg" alt="Figma" label="Figma" />
                  <LogoPill src="/stack/photoshop.svg" alt="Photoshop" label="Photoshop" />
                  <LogoPill src="/stack/illustrator.svg" alt="Illustrator" label="Illustrator" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div className="overflow-hidden rounded-3xl w-full max-w-[600px] h-[400px] md:h-[450px] lg:h-[500px]">
                  <Image
                    src="/projects/ecommerce/images/hero.png"
                    alt="Arktura Samples Store hero"
                    width={1200}
                    height={800}
                    className="block w-full h-full object-contain"
                    priority
                    style={{ transform: "translateZ(0)", objectPosition: "bottom" }}
                  />
                </div>
              </motion.div>
            </div>
          </Container>
        </header>

        {/* Project Brief */}
        <Section id="brief" eyebrow="Project Brief" title="Context" bg="bg-white">
          <div className="max-w-3xl space-y-4">
            <p>
              Arktura is a leading manufacturer of architectural products including ceiling systems, wall panels, and lighting solutions. As part of their brand refresh, the company needed to modernize its Samples Store to improve usability and reduce the workload on internal sales teams.
            </p>
            <p>
              The original store was little more than a static page of diagrams, with no product photography, categorization, or ordering system. Ordering required manual coordination with the sales team, creating unnecessary friction for architects, designers, and reps.
            </p>
            <p>
              The redesign introduced product photography, structured navigation, and an automated checkout process — transforming the store into a user-friendly, modern experience that aligned with Arktura&apos;s brand identity.
            </p>
          </div>
        </Section>

        {/* Problem Statement */}
        <Section id="problem" eyebrow="Problem Statement" title="What customers struggled with" bg="bg-white">
          <div className="mb-6 max-w-3xl">
            <h3 className="text-lg font-medium text-zinc-700">
              The original store presented three key issues:
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <ProblemCard
              icon={<IconSearch size={22} stroke={1.8} />}
              title="Navigation Complexity"
              text="Products weren't categorized, making it difficult for reps and designers to locate specific samples."
            />
            <ProblemCard
              icon={<IconUsers size={22} stroke={1.8} />}
              title="Unclear Product Information"
              text="With only diagrams and no photography, customers lacked the detail needed to confidently evaluate materials."
            />
            <ProblemCard
              icon={<IconShoppingCart size={22} stroke={1.8} />}
              title="Inefficient Ordering"
              text="No cart or checkout infrastructure existed, requiring reps to call the Sales team to place orders manually."
            />
          </div>
        </Section>

        {/* Solution */}
        <Section id="solution" eyebrow="Solution" title="What the redesign provides" bg="bg-white">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p>
                The redesigned Samples Store leverages Shopify&apos;s capabilities while implementing a modern design system. By combining intuitive navigation, product photography, and automated ordering, the new site streamlined the process for users while reducing the sales team&apos;s workload.
              </p>
            </div>
            <div className="flex items-start justify-center lg:justify-end">
              <div className="overflow-hidden rounded-2xl self-start w-full max-w-[520px] lg:-mt-20">
                <Image
                  src="/projects/ecommerce/images/old-store.png"
                  alt="Side-by-side comparison of old vs. new product page"
                  width={1200}
                  height={600}
                  className="block w-full h-auto object-contain rounded-lg"
                  style={{ transform: "translateZ(0)" }}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Features */}
        <Section id="features" eyebrow="Highlights" title="Key Improvements" bg="bg-white">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch [grid-auto-rows:1fr]">
            {[
              { t: "Intuitive Navigation", d: "Clear categories and grouping improved product discovery." },
              { t: "Product Photography", d: "High-quality images replaced diagrams, providing clarity and confidence." },
              { t: "Streamlined Checkout", d: "A cart + checkout flow automated the ordering process and reduced reliance on Sales." },
              { t: "Professional Branding", d: "A consistent design system aligned with Arktura's updated brand identity." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="h-full">
                <GlowCard title={f.t} desc={f.d} />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Design Stages */}
        <Section id="wireframes" eyebrow="Design Stage" title="Low-Fidelity Wireframes" bg="bg-white">
          <div className="max-w-3xl space-y-4 mb-8">
            <p>Early wireframes were created to persuade leadership to green-light the redesign by visualizing how a modern store could improve usability.</p>
          </div>
          <div className="flex justify-center">
            <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white max-w-5xl w-full">
              <Image
                src="/projects/ecommerce/images/wireframes.png"
                alt="Wireframe image"
                width={1200}
                height={800}
                className="block w-full h-auto object-contain"
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
              />
            </div>
          </div>
        </Section>

        <Section id="midfi" eyebrow="Design Stage" title="Mid-Fidelity Mockups" bg="bg-white">
          <div className="max-w-3xl space-y-4 mb-8">
            <p>Once a Shopify template was selected, mid-fidelity mockups refined the structure, navigation, and flow.</p>
          </div>
          <div className="flex justify-center">
            <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white max-w-5xl w-full">
              <Image
                src="/projects/ecommerce/images/midfi.png"
                alt="Mid-fi mockup"
                width={1200}
                height={800}
                className="block w-full h-auto object-contain"
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
              />
            </div>
          </div>
        </Section>

        <Section id="hifi" eyebrow="Design Stage" title="High-Fidelity Designs" bg="bg-white">
          <div className="max-w-3xl space-y-4 mb-8">
            <p>Final designs incorporated edited product photography, refined UI components, and the automated checkout system.</p>
          </div>
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white max-w-5xl w-full">
                <Image
                  src="/projects/ecommerce/images/hifi.png"
                  alt="Hi-fi design screen - Product pages"
                  width={1200}
                  height={800}
                  className="block w-full h-auto object-contain"
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  priority
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-zinc-200 bg-white max-w-5xl w-full">
                <Image
                  src="/projects/ecommerce/images/hifi-2.png"
                  alt="Hi-fi design screen - Additional views"
                  width={1200}
                  height={800}
                  className="block w-full h-auto object-contain"
                  sizes="(min-width: 1024px) 1024px, 100vw"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Process */}
        <Section id="process" eyebrow="Process" title="Process" bg="bg-white">
          <div className="relative space-y-10">
            <div className="pointer-events-none absolute left-[1.25rem] top-0 bottom-0 w-px bg-zinc-200" />
            <TimelineItem n={1} title="Initial Wireframes" icon={<span role="img" aria-label="wireframes">📐</span>} desc={<><p>Created to demonstrate the value of a redesign and secure leadership approval.</p></>} />
            <TimelineItem n={2} title="Photography & Asset Preparation" icon={<span role="img" aria-label="photography">📸</span>} desc={<><p>Secured budget to hire a photographer and edited hundreds of sample images in Photoshop and Illustrator.</p></>} />
            <TimelineItem n={3} title="UI Design & Template Customization" icon={<span role="img" aria-label="design">🎨</span>} desc={<><p>Customized a Shopify template to align with Arktura&apos;s brand and created a visual design system.</p></>} />
            <TimelineItem n={4} title="Development & Launch" icon={<span role="img" aria-label="launch">🚀</span>} desc={<><p>Collaborated with developers across teams to implement the checkout system and launch the redesigned store.</p></>} />
          </div>
        </Section>

        {/* Learnings */}
        <Section id="learnings" eyebrow="Learnings & Outcome" title="Outcome" bg="bg-white">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Outcome</h3>
              <p>
                The automated checkout process was the most impactful outcome. It eliminated manual ordering, reduced staffing needs, and freed resources for other projects.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Learnings</h3>
              <p>
                This project reinforced the importance of patience and iteration. Waiting on leadership decisions slowed progress but created opportunities to refine designs and return with stronger solutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Future Improvements</h3>
              <p>
                With more time and resources, I would explore adding an AI-powered chatbot to provide instant answers about sample details and support users directly.
              </p>
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section bg="bg-white">
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <h3 className="text-2xl font-semibold text-black">Interested in more work?</h3>
            <p className="max-w-xl text-sm text-zinc-600">Explore other case studies or reach out for a walkthrough.</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <a 
                href="https://samples.arktura.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                View Live Project →
              </a>
              <Link 
                href="/#contact"
                className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </Section>

        <footer className="py-12 bg-black text-zinc-200">
          <Container>
            <p className="text-center text-xs">© {new Date().getFullYear()} Arktura Samples Store · Case Study</p>
          </Container>
        </footer>
      </main>
    </div>
  );
}

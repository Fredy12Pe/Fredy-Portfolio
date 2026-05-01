"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const PINK = "#F83D7C";
const CREAM = "#FFF4D5";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
      setIsScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".nav-container")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isMobileMenuOpen]);

  const navTextColor = scrolled ? "text-white" : "text-black";
  const linkBase =
    "relative font-poppins font-medium transition-colors duration-200 " +
    "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 " +
    "after:content-[''] after:transition-all after:duration-300 hover:after:w-full";
  const linkColor = scrolled
    ? "text-white/90 hover:text-white after:bg-white"
    : "text-black/90 hover:text-black after:bg-black";

  return (
    <>
      {/* ── Fixed nav ── */}
      <nav
        className={`nav-container fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="mx-auto max-w-[100rem] px-4 md:px-8">
          <div
            className="px-5 py-4"
            style={{
              background: scrolled ? "rgba(0,0,0,0.80)" : "transparent",
              borderRadius: 20,
              border: scrolled ? "1px rgba(255,255,255,0.20) solid" : "none",
              backdropFilter: scrolled ? "blur(12px)" : "none",
              WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
              transition: "all 0.3s ease-out",
            }}
          >
            <div className="flex items-center justify-between">
              <span className={`font-poppins text-sm font-bold uppercase tracking-[0.2em] transition-colors md:text-base ${navTextColor}`}>
                FREDY DESIGN
              </span>

              {/* Desktop links */}
              <div className="hidden items-center gap-8 lg:gap-10 md:flex">
                <a href="#about"          className={`${linkBase} ${linkColor} text-base md:text-lg`}>About</a>
                <a href="#projects"       className={`${linkBase} ${linkColor} text-base md:text-lg`}>Projects</a>
                <a href="#favorite-stack" className={`${linkBase} ${linkColor} text-base md:text-lg`}>Stack</a>
                <div className="flex items-center gap-4 lg:gap-5">
                  <a href="#contact" className={`${linkBase} ${linkColor} text-base md:text-lg`}>Contact</a>
                  <a
                    href="#contact"
                    className="inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 font-poppins text-sm font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: PINK }}
                  >
                    Leave a message
                  </a>
                </div>
              </div>

              {/* Hamburger */}
              <button
                type="button"
                className={`p-2 transition-colors md:hidden ${
                  isMobileMenuOpen || scrolled ? "text-white" : "text-black"
                }`}
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-black/95 backdrop-blur-sm md:hidden">
          <button
            type="button"
            className="absolute right-6 top-6 p-2 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {[["#about","About"],["#projects","Projects"],["#favorite-stack","Stack"],["#contact","Contact"]].map(([href, label]) => (
            <a key={href + label} href={href} className="font-poppins text-3xl font-medium text-white hover:text-white/80"
              onClick={() => setIsMobileMenuOpen(false)}>{label}</a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl px-8 py-4 font-poppins text-base font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: PINK }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Leave a message
          </a>
        </div>
      )}

      {/* ── Hero ── */}
      <header
        id="site-header"
        className="relative w-full overflow-hidden rounded-b-[clamp(2.5rem,8vw,4.75rem)]"
        style={{ height: "100svh", background: CREAM }}
      >
        {/* ── Desktop: art stays 50vw; text column capped so block centers + shorter intro measure ── */}
        <div className="absolute inset-0 hidden min-h-0 md:flex md:items-stretch md:justify-center">
          <div className="flex h-full min-h-0 min-w-0 max-w-full flex-nowrap">
            {/* Left — explicit half viewport so % circle matches original grid */}
            <div className="relative w-[50vw] shrink-0 min-h-0">
              <div
                className="pointer-events-none absolute z-0"
                style={{
                  bottom: "10%",
                  left: "48%",
                  transform: "translateX(-50%)",
                  width: "78%",
                  aspectRatio: "1",
                }}
              >
                <div
                  className="pointer-events-auto relative h-full w-full origin-center transition-[transform,filter] duration-300 ease-out hover:scale-[1.06] hover:drop-shadow-[0_0_40px_rgba(248,61,124,0.55)]"
                >
                  <Image src="/images/hero/Circle-BG.svg" alt="" fill className="object-contain" sizes="35vw" priority />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-center" style={{ height: "65svh" }}>
                <Image
                  src="/images/hero/Fredy-header.png"
                  alt="Fredy Pedro"
                  width={1200}
                  height={1500}
                  className="pointer-events-none h-full w-auto object-contain object-bottom"
                  priority
                  sizes="50vw"
                />
              </div>
            </div>

            {/* Right — width capped (never full remaining half); nudged left toward art */}
            <div
              className="box-border flex w-[min(36rem,calc(50vw-2rem))] shrink-0 flex-col justify-center pr-8 pl-4 md:-ml-6 md:pl-4 md:pr-10 lg:-ml-10 lg:pl-2 lg:pr-12"
              style={{ paddingTop: "5rem" }}
            >
              <h1
                className="font-bebas uppercase leading-[0.88] tracking-[0.02em]"
                style={{
                  color: PINK,
                  fontSize: "clamp(6.25rem, 9vw, 14rem)",
                  fontWeight: 900,
                  WebkitTextStroke: `2.75px ${PINK}`,
                  paintOrder: "stroke fill",
                }}
              >
                Hi, I&apos;m
                <br />
                Fredy
              </h1>
              <p className="mt-5 font-poppins text-xl font-bold uppercase tracking-[0.14em] text-black md:text-2xl">
                Designer &amp; Developer
              </p>
              <p className="mt-5 max-w-md font-poppins text-lg leading-relaxed text-black md:text-xl">
                I design and build digital experiences that are useful, interactive, and memorable.
              </p>
              <a
                href="#contact"
                className="mt-20 inline-flex w-fit items-center justify-center rounded-xl border-2 border-solid bg-transparent px-10 py-4 font-poppins text-base font-semibold uppercase tracking-[0.12em] text-[#F83D7C] transition-colors duration-200 hover:bg-[#F83D7C] hover:text-white md:text-lg"
                style={{ borderColor: PINK }}
              >
                Get in contact
              </a>
            </div>
          </div>
        </div>

        {/* ── Mobile: stacked layout ── */}
        <div className="flex h-full flex-col px-6 pt-24 md:hidden">
          <div className="flex flex-col justify-center">
            <h1
              className="font-bebas uppercase leading-[0.88] tracking-[0.02em]"
              style={{
                color: PINK,
                fontSize: "clamp(4.5rem, 18vw, 7.25rem)",
                fontWeight: 900,
                WebkitTextStroke: `2px ${PINK}`,
                paintOrder: "stroke fill",
              }}
            >
              Hi, I&apos;m<br />Fredy
            </h1>
            <p className="mt-4 font-poppins text-lg font-bold uppercase tracking-[0.14em] text-black">
              Designer &amp; Developer
            </p>
            <p className="mt-4 font-poppins text-base leading-relaxed text-black">
              I design and build digital experiences that are useful, interactive, and memorable.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-xl border-2 border-solid bg-transparent px-8 py-3.5 font-poppins text-sm font-semibold uppercase tracking-[0.12em] text-[#F83D7C] transition-colors duration-200 hover:bg-[#F83D7C] hover:text-white"
              style={{ borderColor: PINK }}
            >
              Get in contact
            </a>
          </div>
          {/* Mobile portrait */}
          <div className="relative mt-6 flex flex-1 items-end justify-center">
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2"
              style={{ bottom: 0, width: "67%", aspectRatio: "1" }}
            >
              <div className="pointer-events-auto relative h-full w-full origin-center transition-[transform,filter] duration-300 ease-out hover:scale-[1.06] hover:drop-shadow-[0_0_40px_rgba(248,61,124,0.55)]">
                <Image src="/images/hero/Circle-BG.svg" alt="" fill className="object-contain object-bottom" sizes="65vw" priority />
              </div>
            </div>
            <Image
              src="/images/hero/Fredy-header.png"
              alt="Fredy Pedro"
              width={600}
              height={750}
              className="pointer-events-none relative z-10 h-full w-auto object-contain object-bottom"
              priority
              sizes="100vw"
            />
          </div>
        </div>

      </header>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const PINK = "#F83D7C";
const CREAM = "#FFF4D5";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCircleHovered, setIsCircleHovered] = useState(false);
  const [isMobileThemePink, setIsMobileThemePink] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);

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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsMobileThemePink(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isMobileMenuOpen]);

  const heroIsPink = isCircleHovered || isMobileThemePink;
  const navIsLight = scrolled || heroIsPink;
  const navTextColor = navIsLight ? "text-white" : "text-black";
  const linkBase =
    "relative font-poppins font-medium transition-colors duration-200 " +
    "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 " +
    "after:content-[''] after:transition-all after:duration-300 hover:after:w-full";
  const linkColor = navIsLight
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
                  {/* <a
                    href="#contact"
                    className="inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 font-poppins text-sm font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: isCircleHovered ? "white" : PINK,
                      color: isCircleHovered ? PINK : "white",
                      transition: "background-color 0.4s ease, color 0.4s ease",
                    }}
                  >
                    Leave a message
                  </a> */}
                </div>
              </div>

              {/* Hamburger */}
              <button
                type="button"
                className={`p-2 transition-colors md:hidden ${
                  isMobileMenuOpen || navIsLight ? "text-white" : "text-black"
                }`}
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
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
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-black/95 backdrop-blur-sm md:hidden"
        >
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
      {/* Outer shell: 100lvh keeps page layout correct, background is transparent so black body shows in URL-bar region */}
      <header
        id="site-header"
        className="relative w-full"
        style={{ height: "100lvh", background: "transparent" }}
      >
        {/* Inner shell: cream/pink background stops at 100svh so it never reaches the URL-bar area */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden rounded-b-[1.25rem] md:rounded-b-[clamp(2.5rem,8vw,4.75rem)]"
          style={{
            height: "100svh",
            background: heroIsPink ? PINK : CREAM,
            transition: "background 0.4s ease",
          }}
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
                  className="pointer-events-auto relative h-full w-full origin-center"
                  style={{
                    transform: heroIsPink ? "scale(1.06)" : "scale(1)",
                    filter: heroIsPink
                      ? "brightness(0) invert(1) drop-shadow(0 0 40px rgba(255,255,255,0.6))"
                      : "none",
                    transition: "transform 0.3s ease-out, filter 0.4s ease",
                  }}
                  onMouseEnter={() => setIsCircleHovered(true)}
                  onMouseLeave={() => setIsCircleHovered(false)}
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
                  color: heroIsPink ? "white" : PINK,
                  fontSize: "clamp(6.25rem, 9vw, 14rem)",
                  fontWeight: 900,
                  WebkitTextStroke: heroIsPink ? "2.75px white" : `2.75px ${PINK}`,
                  paintOrder: "stroke fill",
                  transition: "color 0.4s ease, -webkit-text-stroke-color 0.4s ease",
                }}
              >
                Hi, I&apos;m
                <br />
                Fredy
              </h1>
              <p
                className="mt-5 font-poppins text-xl font-bold uppercase tracking-[0.14em] md:text-2xl"
                style={{ color: heroIsPink ? "white" : "black", transition: "color 0.4s ease" }}
              >
                Designer &amp; Developer
              </p>
              <p
                className="mt-5 font-poppins text-lg md:text-xl"
                style={{ color: heroIsPink ? "rgba(255,255,255,0.85)" : "black", transition: "color 0.4s ease", lineHeight: 1.75 }}
              >
                I mix design, code, and interaction<br />
                to build things that feel different<br />
                and drive results.
              </p>
              <a
                href="#contact"
                className="mt-20 inline-flex w-fit items-center justify-center rounded-xl border-2 border-solid px-10 py-4 font-poppins text-base font-semibold uppercase tracking-[0.12em] md:text-lg"
                style={{
                  backgroundColor: isContactHovered ? (heroIsPink ? "white" : PINK) : "transparent",
                  color: isContactHovered ? (heroIsPink ? PINK : "white") : (heroIsPink ? "white" : PINK),
                  borderColor: heroIsPink ? "white" : PINK,
                  transition: "color 0.4s ease, border-color 0.4s ease, background-color 0.25s ease",
                }}
                onMouseEnter={() => setIsContactHovered(true)}
                onMouseLeave={() => setIsContactHovered(false)}
              >
                Get in contact
              </a>
            </div>
          </div>
        </div>

        {/* ── Mobile: stacked layout ── */}
        <div className="flex h-full flex-col px-6 pt-28 md:hidden">
          <div className="relative z-20 flex flex-col justify-center">
            <h1
              className="font-bebas uppercase leading-[0.88] tracking-[0.06em]"
              style={{
                color: heroIsPink ? "white" : PINK,
                fontSize: "clamp(4.2rem, 17.5vw, 6.8rem)",
                fontWeight: 900,
                WebkitTextStroke: heroIsPink ? "2px white" : `2px ${PINK}`,
                paintOrder: "stroke fill",
                transition: "color 0.4s ease, -webkit-text-stroke-color 0.4s ease",
              }}
            >
              Hi, I&apos;m<br />Fredy
            </h1>
            <p
              className="mt-2 font-poppins text-base font-bold uppercase tracking-[0.14em]"
              style={{ color: heroIsPink ? "white" : "black", transition: "color 0.4s ease" }}
            >
              Designer &amp; Developer
            </p>
            <p
              className="mt-2 max-w-[31ch] font-poppins text-[0.95rem]"
              style={{ color: heroIsPink ? "rgba(255,255,255,0.85)" : "black", transition: "color 0.4s ease", lineHeight: 1.65 }}
            >
              I mix design, code, and interaction<br />
              to build things that feel different<br />
              and drive results.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#contact"
                className="inline-flex w-fit items-center justify-center rounded-xl border-2 border-solid px-8 py-3.5 font-poppins text-sm font-semibold uppercase tracking-[0.12em]"
                style={{
                  backgroundColor: isContactHovered ? (heroIsPink ? "white" : PINK) : "transparent",
                  color: isContactHovered ? (heroIsPink ? PINK : "white") : (heroIsPink ? "white" : PINK),
                  borderColor: heroIsPink ? "white" : PINK,
                  transition: "color 0.4s ease, border-color 0.4s ease, background-color 0.25s ease",
                }}
                onMouseEnter={() => setIsContactHovered(true)}
                onMouseLeave={() => setIsContactHovered(false)}
              >
                Get in contact
              </a>
              <button
                type="button"
                aria-label={isMobileThemePink ? "Switch to light theme" : "Switch to pink theme"}
                aria-pressed={isMobileThemePink}
                className="inline-flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-xl border-2 border-solid transition-colors"
                style={{
                  borderColor: heroIsPink ? "white" : PINK,
                  backgroundColor: heroIsPink ? "white" : PINK,
                  color: heroIsPink ? PINK : "white",
                }}
                onClick={() => setIsMobileThemePink((v) => !v)}
              >
                {isMobileThemePink ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7.1 7.1 0 0 0 9.8 9.8Z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4.5" />
                    <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Mobile portrait */}
          <div className="relative mt-1 flex flex-1 items-end justify-center">
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2"
              style={{ bottom: "-52%", width: "115%", aspectRatio: "1" }}
            >
              <div
                className="relative h-full w-full origin-center"
                style={{
                  transform: heroIsPink ? "scale(1.06)" : "scale(1)",
                  filter: heroIsPink
                    ? "brightness(0) invert(1) drop-shadow(0 0 40px rgba(255,255,255,0.6))"
                    : "none",
                  transition: "transform 0.3s ease-out, filter 0.4s ease",
                }}
              >
                <Image src="/images/hero/Circle-BG.svg" alt="" fill className="object-contain object-bottom" sizes="55vw" priority />
              </div>
            </div>
            <Image
              src="/images/hero/Fredy-header.png"
              alt="Fredy Pedro"
              width={600}
              height={750}
              className="pointer-events-none relative z-10 h-auto max-h-full w-auto max-w-[76%] translate-y-[12%] object-contain object-bottom"
              priority
              sizes="80vw"
            />
          </div>
        </div>

        </div>{/* end inner cream/pink shell */}
      </header>
    </>
  );
}

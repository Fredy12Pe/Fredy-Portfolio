"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { orbitron, roboto } from "@/lib/fonts";
import { DepthParallax } from "@/components/ui/depth-parallax";
import HeaderWidgets from "./HeaderWidgets";
import WelcomeSignature from "./WelcomeSignature";
import { holdingReloadPosition } from "./reload-scroll";
import { observeVisibility } from "@/lib/visibility";
import styles from "./SiteHeader.module.css";

// The signature draw only covers the header, and only while that header
// is the view. A reload further down the page keeps that exact position.
function userIsAtHeader(header: HTMLElement) {
  const top = header.getBoundingClientRect().top;
  return top > -window.innerHeight * 0.45 && top < window.innerHeight * 0.25;
}

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [introOn, setIntroOn] = useState<boolean | null>(null);

  // Moves the glow with the mouse. Writing the style directly avoids a re-render on every move.
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const glow = glowRef.current;
    if (!glow || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    glow.style.transform = `translate3d(${e.clientX - rect.left}px, ${e.clientY - rect.top}px, 0)`;
    glow.style.opacity = "1";
  };
  const onPointerLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };
  useLayoutEffect(() => {
    const header = headerRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let onScroll: (() => void) | null = null;

    // Decides whether the intro plays. Called once the page is settled and on screen.
    const decide = () => {
      if (reduced || !header || !userIsAtHeader(header)) {
        setIntroOn(false);
        return;
      }
      setIntroOn(true);
      onScroll = () => {
        if (userIsAtHeader(header)) return;
        setIntroOn(false);
        // Once the intro is over this never fires again, so it stops reading layout on every scroll
        if (onScroll) window.removeEventListener("scroll", onScroll);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    // When the page is restoring a saved scroll position it is held black until the position
    // settles (see app/layout.tsx). The intro waits for that, so it plays on the visible page.
    let stopWaiting = () => {};
    if (holdingReloadPosition()) {
      const onReveal = () => flushSync(decide);
      window.addEventListener("portfolio-reveal", onReveal, { once: true });
      stopWaiting = () => window.removeEventListener("portfolio-reveal", onReveal);
    } else {
      decide();
    }

    return () => {
      stopWaiting();
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // The header's textures, leaks and grain animate forever. Once the header has scrolled
  // away the browser is still compositing them, so they are switched off until it returns.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new IntersectionObserver(([entry]) => {
      header.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // The header is pinned while the About section grows over it, and that pin does not
  // release with native scrolling. Once the Projects section starts to come up the header
  // would sit on top of it, so it is hidden for as long as that section is on screen.
  useLayoutEffect(() => {
    const header = headerRef.current;
    const projects = header?.closest("[data-sticker-bounds]")?.nextElementSibling;
    if (!header || !projects) return;
    return observeVisibility(
      projects,
      (visible) => header.toggleAttribute("data-away", visible),
      { rootMargin: "0px" },
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${roboto.className}`}
      data-node-id="135:303"
      data-intro={introOn === false ? undefined : ""}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* The photo breathes with the bass of the playing track (scale set by the music player) */}
      <div className={styles.photo} data-music-photo>
        <DepthParallax
          className="pointer-events-none absolute inset-0 z-0 m-0"
          src="/images/depth-parallax/subway.webp"
          depthSrc="/images/depth-parallax/subway-depth.webp"
          alt=""
          fill
          showControls={false}
          initialSettings={{ strength: 0.1 }}
          zoom={0.95}
          liquid
          drift={introOn === false}
          tilt
          maxPixelRatio={1}
        />
      </div>

      {/* Binary texture sits over the photo (lighten, 30%) and is cropped to the board */}
      <div className={styles.texture} aria-hidden>
        <img className={styles.textureImg} src="/images/figma-header/texture-overlay.png" alt="" />
      </div>

      {/* Worn paper texture: warm fibres plus a soft edge wear, multiplied over the photo */}
      <div className={styles.paper} aria-hidden />

      {/* Gradient wash and noise (Figma "textture-Overlay") span the full header */}
      <div className={styles.wash} aria-hidden>
        <div className={styles.noise} />
      </div>

      {/* Analog texture: scanlines and moving film grain, then warm light leaks */}
      <div className={styles.scanlines} aria-hidden />
      <div className={styles.grain} aria-hidden />
      <div className={styles.leaks} aria-hidden />
      {/* Warm glow that swells with the bass of the playing track (--music-level, set by the music widget) */}
      <div className={styles.musicPulse} data-music-pulse aria-hidden />
      {/* Radial spectrum that bursts from the centre while a track plays (drawn by the music player) */}
      <canvas className={styles.visualizer} data-visualizer aria-hidden />

      {/* Soft light that trails the mouse; hidden until the pointer enters the header */}
      <div ref={glowRef} className={styles.cursorGlow} aria-hidden />

      {/* 1920×1080 board, scaled with --u. Shapes that extend past it are not clipped here. */}
      <div className={styles.frame}>
        <div ref={signatureRef} className={styles.signature}>
          <Image
            src="/images/figma-header/signature.svg"
            alt="Fredy"
            width={101}
            height={58}
            unoptimized
            priority
          />
        </div>

        <h1 className={`${styles.title} ${orbitron.className}`} data-text="DESIGN ENGINEER">
          DESIGN ENGINEER
        </h1>
        <p className={styles.intro}>
          I design and build products that feel clear and evoke emotion.
        </p>


        <HeaderWidgets />
      </div>



      {/* Part of the server-rendered page, so the black opening shows before the client has
          worked out whether the intro plays. It goes as soon as that is known, before paint. */}
      {introOn === null ? <div className={styles.cover} aria-hidden /> : null}

      {introOn ? (
        <WelcomeSignature logoRef={signatureRef} onDone={() => setIntroOn(false)} />
      ) : null}
    </header>
  );
}

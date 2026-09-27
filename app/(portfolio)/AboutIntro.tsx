"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import {
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InteractiveTiltCard } from "@/components/ui/tilt-card";
import { markPortfolioLayout } from "./reload-scroll";
import styles from "./AboutIntro.module.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  display: "swap",
});

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function scrollToContact(event: ReactMouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname !== "/") return;

  const target = document.getElementById("contact");
  if (!target) return;

  event.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const y = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
  const distance = Math.abs(y - window.scrollY);
  if (distance < 2) {
    window.history.pushState(null, "", "/#contact");
    return;
  }

  const root = document.documentElement;
  const restore = () => {
    root.style.scrollBehavior = "";
  };
  root.style.scrollBehavior = "auto";
  gsap.to(window, {
    duration: reduced ? 0 : gsap.utils.clamp(0.75, 1.35, distance / 1400),
    ease: "power2.inOut",
    scrollTo: { y, autoKill: true },
    overwrite: "auto",
    onInterrupt: restore,
    onComplete: () => {
      restore();
      window.history.pushState(null, "", "/#contact");
    },
  });
}

const PORTRAIT = "/images/portfolio-v3/about-portrait.png";

// The photo is cropped inside a 436×500 card, but the bitmap itself is drawn
// at ~2.42× the card (~1053px on the 1920 frame, larger on big screens).
const portraitImage = {
  src: PORTRAIT,
  width: 4094,
  height: 2053,
  quality: 90,
  sizes: "(max-width: 860px) 240vw, 1600px",
} as const;

type Point = [number, number];

function arrowPath(points: Point[], smoothing: number) {
  const cp = (
    current: Point,
    previous: Point | undefined,
    next: Point | undefined,
    reverse: boolean,
  ) => {
    const p = previous || current;
    const n = next || current;
    const angle =
      Math.atan2(n[1] - p[1], n[0] - p[0]) + (reverse ? Math.PI : 0);
    const length =
      Math.hypot(n[0] - p[0], n[1] - p[1]) * smoothing;
    return [
      current[0] + Math.cos(angle) * length,
      current[1] + Math.sin(angle) * length,
    ];
  };

  return points.reduce((acc, point, i, all) => {
    if (i === 0) return `M ${point[0]},${point[1]}`;
    const cps = cp(all[i - 1], all[i - 2], point, false);
    const cpe = cp(point, all[i - 1], all[i + 1], true);
    return `${acc} C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
  }, "");
}

function ResumeDownload() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const path = pathRef.current;
    if (!button || !path) return;

    const duration = 3000;
    button.style.setProperty("--duration", String(duration));

    const state = { y: 20, smoothing: 0 };
    const chevron = () =>
      arrowPath(
        [
          [4, 12],
          [12, state.y],
          [20, 12],
        ],
        state.smoothing,
      );
    const render = () => path.setAttribute("d", chevron());
    render();

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let markTimer = 0;

    const onClick = (event: MouseEvent) => {
      if (reduced) return;
      if (button.classList.contains(styles.loading)) {
        event.preventDefault();
        return;
      }
      button.classList.add(styles.loading);
      gsap.to(state, {
        smoothing: 0.3,
        duration: (duration * 0.065) / 1000,
        onUpdate: render,
      });
      gsap.to(state, {
        y: 12,
        duration: (duration * 0.265) / 1000,
        delay: (duration * 0.065) / 1000,
        ease: "elastic.out(1.12, 0.4)",
        onUpdate: render,
      });
      markTimer = window.setTimeout(() => {
        path.setAttribute(
          "d",
          arrowPath(
            [
              [3, 14],
              [8, 19],
              [21, 6],
            ],
            0,
          ),
        );
      }, duration / 2);
    };

    button.addEventListener("click", onClick);
    return () => {
      button.removeEventListener("click", onClick);
      window.clearTimeout(markTimer);
      gsap.killTweensOf(state);
    };
  }, []);

  return (
    <a
      ref={buttonRef}
      className={styles.download}
      href="/resume/resume.pdf"
      download="Fredy Pedro - Resume.pdf"
      aria-label="Download Resume"
    >
      <ul aria-hidden="true">
        <li>Download Resume</li>
        <li>Downloading</li>
        <li>Downloaded</li>
      </ul>
      <span className={styles.downloadIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path ref={pathRef} d="M 4,12 C 4,12 12,20 12,20 C 12,20 20,12 20,12" />
        </svg>
      </span>
    </a>
  );
}

function CardFace({ labelled = false }: { labelled?: boolean }) {
  return (
    <div className={styles.face} aria-hidden={labelled ? undefined : true}>
      <Image
        className={styles.photoImg}
        alt={labelled ? "Fredy smiling at a coastal overlook" : ""}
        {...portraitImage}
      />
      <div className={styles.overlay} data-bw>
        <Image className={styles.photoImg} alt="" aria-hidden {...portraitImage} />
      </div>
    </div>
  );
}

export default function AboutIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const [tiltReady, setTiltReady] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const lift = liftRef.current;
    const spin = spinRef.current;
    if (!root || !lift || !spin) return;

    const overlays = root.querySelectorAll<HTMLElement>("[data-bw]");
    let mm: ReturnType<typeof gsap.matchMedia> | null = null;
    let timer = 0;

    const setup = () => {
      mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(lift, { x: 0, y: 0, z: 0 });
        gsap.set(spin, { rotationX: 0, rotationY: 0, rotationZ: 0 });
        gsap.set(overlays, { autoAlpha: 0 });
      });

      const playSpin = (pin: boolean) => {
        const rig = lift.parentElement;
        const rigTop = rig
          ? rig.getBoundingClientRect().top - root.getBoundingClientRect().top
          : window.innerHeight * 0.34;
        // Desktop rides in from above the fold. On a phone the section leaves
        // a runway above the photo, and the card uses that runway to spin down
        // into place without sliding up into the header.
        const travel = pin
          ? Math.max(140, rigTop - 24)
          : Math.max(120, Math.min(220, rigTop - 28));

        // Translation and the half-turn live on different elements. A shared
        // matrix at ±180°, plus a Z offset, makes the first frame drop the
        // photo and then slide it back in from the side.
        gsap.set(lift, { x: 0, y: -travel, z: 0, force3D: true });
        gsap.set(spin, {
          rotationY: -179.8,
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          force3D: true,
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            // Phone: the photo only needs a short runway. A long scrub left
            // it still turning after the section had already moved on.
            trigger: pin ? root : (rig ?? root),
            start: pin ? "top top" : "top 92%",
            end: pin ? "+=170%" : "top 58%",
            pin,
            scrub: pin ? 1.4 : 0.25,
            anticipatePin: pin ? 1 : 0,
          },
        });

        tl.to(
          lift,
          { y: 0, duration: 1, ease: "sine.inOut", immediateRender: false },
          0,
        );
        tl.to(
          spin,
          {
            rotationY: 0,
            duration: 1,
            ease: "sine.inOut",
            immediateRender: false,
          },
          0,
        );

        tl.fromTo(
          overlays,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.38, ease: "sine.inOut" },
          0.62,
        );

        // Image only at rest. Copy fades in as soon as the pin starts moving.
        const copy = root.querySelectorAll<HTMLElement>("[data-copy]");
        tl.fromTo(
          copy,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: "sine.out" },
          0,
        );

        // The card holds, then the panel itself becomes the same solid black
        // as the projects section — finished before that section scrolls in.
        // The extra hold is only for the pinned desktop sequence.
        if (pin) {
          tl.set(spin, { rotationY: 0, immediateRender: false }, 1.9);
        }

        const wash = root.querySelector<HTMLElement>("[data-wash]");
        const grain = root.querySelector<HTMLElement>("[data-grain]");
        const paintBackground = (
          timeline: gsap.core.Timeline,
          at: number,
          duration: number,
        ) => {
          timeline.fromTo(
            root,
            { backgroundColor: "#f7f7f7" },
            { backgroundColor: "#000000", duration, ease: "sine.inOut" },
            at,
          );
          if (wash) {
            timeline.fromTo(
              wash,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration, ease: "sine.inOut" },
              at,
            );
          }
          if (grain) {
            timeline.to(grain, { opacity: 0, duration, ease: "sine.inOut" }, at);
          }
          if (copy.length) {
            timeline.to(
              copy,
              { color: "#ffffff", duration, ease: "sine.inOut" },
              at,
            );
          }
        };

        paintBackground(tl, 0.72, 0.4);

        // The spin finishes at t=1. Tilt stays off until the card is sitting there.
        let settled = false;
        tl.eventCallback("onUpdate", () => {
          const next = tl.time() >= 1;
          if (next === settled) return;
          settled = next;
          setTiltReady(next);
        });

        ScrollTrigger.refresh();
      };

      mm.add(
        "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
        () => {
          playSpin(true);
        },
      );

      mm.add(
        "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
        () => {
          const rig = lift.parentElement ?? root;
          const copy = root.querySelectorAll<HTMLElement>("[data-copy]");
          const wash = root.querySelector<HTMLElement>("[data-wash]");
          const grain = root.querySelector<HTMLElement>("[data-grain]");

          gsap.set(lift, { x: 0, y: -48, z: 0, force3D: true });
          gsap.set(spin, {
            rotationY: -179.8,
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            force3D: true,
          });

          // One scrub from the moment the photo enters until it sits in the
          // settled layout. The turn finishes early; the field reaches black
          // at the end of that same gesture.
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rig,
              start: "top 90%",
              end: "top 22%",
              scrub: 0.45,
            },
          });

          tl.to(
            lift,
            { y: 0, duration: 0.48, ease: "sine.inOut", immediateRender: false },
            0,
          );
          tl.to(
            spin,
            {
              rotationY: 0,
              duration: 0.48,
              ease: "sine.inOut",
              immediateRender: false,
            },
            0,
          );

          // Color comes in as the card opens past the edge-on sliver.
          tl.fromTo(
            overlays,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.2, ease: "sine.inOut" },
            0.28,
          );
          tl.fromTo(
            copy,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.26, ease: "sine.out" },
            0.24,
          );

          const washAt = 0.36;
          const washDur = 0.64;
          tl.fromTo(
            root,
            { backgroundColor: "#f7f7f7" },
            {
              backgroundColor: "#000000",
              duration: washDur,
              ease: "sine.inOut",
            },
            washAt,
          );
          if (wash) {
            tl.fromTo(
              wash,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: washDur, ease: "sine.inOut" },
              washAt,
            );
          }
          if (grain) {
            tl.to(
              grain,
              { opacity: 0, duration: washDur, ease: "sine.inOut" },
              washAt,
            );
          }
          if (copy.length) {
            tl.to(
              copy,
              { color: "#ffffff", duration: washDur, ease: "sine.inOut" },
              washAt,
            );
          }

          let settled = false;
          tl.eventCallback("onUpdate", () => {
            const next = tl.time() >= 0.48;
            if (next === settled) return;
            settled = next;
            setTiltReady(next);
          });
        },
      );
      markPortfolioLayout("about");
    };

    // After the layout effect (and a strict-mode remount) so the section is in normal flow.
    timer = window.setTimeout(setup, 0);

    return () => {
      window.clearTimeout(timer);
      mm?.revert();
      setTiltReady(false);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={`${styles.about} ${inter.className}`}
      aria-label="About"
      data-node-id="99:1003"
    >
      <div className={styles.wash} data-wash aria-hidden />
      <div className={styles.grain} data-grain aria-hidden />
      <div className={styles.stage}>
        <p className={styles.hey} data-copy>
          Hey!
        </p>

        <div className={styles.cardRig}>
          <div ref={liftRef} className={styles.card}>
            <div ref={spinRef} className={styles.spin}>
              <InteractiveTiltCard
                tiltFactor={12}
                perspective={900}
                borderRadius={40}
                backgroundColor="transparent"
                shadowColor="rgba(0, 0, 0, 0)"
                shadowIntensity={0.28}
                hoverScale={1.03}
                glareIntensity={0.42}
                glareSize={72}
                clipContent={false}
                enabled={tiltReady}
              >
                <CardFace labelled />
                <div className={`${styles.face} ${styles.back}`} aria-hidden>
                  <Image className={styles.photoImg} alt="" {...portraitImage} />
                  <div className={styles.overlay} data-bw>
                    <Image
                      className={styles.photoImg}
                      alt=""
                      aria-hidden
                      {...portraitImage}
                    />
                  </div>
                </div>
              </InteractiveTiltCard>
            </div>
          </div>
        </div>

        <p className={styles.bio} data-copy>
          I’m Fredy, a UI/UX Designer & Front-End vibe Coder based in{" "}
          <span className={styles.keepLine}>Los Angeles</span>.
        </p>
        <div className={styles.copyRight} data-copy>
          <p className={styles.lead}>
            I am a passionate designer dedicated to building modern, scaleable,
            interactive mobile and web experiences.
          </p>
          <p className={styles.invite}>
            If you’re interested in collaborating, or have any questions, feel
            free to{" "}
            <Link
              className={`${styles.reach} ${styles.keepLine}`}
              href="/#contact"
              onClick={scrollToContact}
            >
              reach out here.
            </Link>
          </p>
          <ResumeDownload />
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { roboto } from "@/lib/fonts";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InteractiveTiltCard } from "@/components/ui/tilt-card";
import Lightfall from "@/components/ui/lightfall";
import MetallicPaint from "@/components/ui/metallic-paint";
import { markPortfolioLayout } from "./reload-scroll";
import { isScrolling, markScrolling } from "./scroll-flag";
import { observeVisibility } from "@/lib/visibility";
import styles from "./AboutIntro.module.css";

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

// Wraps every word of an element in its own inline-block span so the words can be
// animated one at a time. Runs once per element; spaces stay as plain text.
function splitWords(el: HTMLElement) {
  if (el.dataset.split) return;
  el.dataset.split = "true";
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(part);
            return;
          }
          const word = document.createElement("span");
          word.dataset.word = "";
          word.style.display = "inline-block";
          word.textContent = part;
          fragment.append(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
}

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
  const [lightOn, setLightOn] = useState(false);
  // lightOn only ever turns on: it is set from the pin's timeline, which stops
  // reporting once the scroll has passed. So the two shaders are told whether the
  // section is near from here instead, which keeps answering for as long as the page is open.
  const [aboutNear, setAboutNear] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeVisibility(root, setAboutNear, { rootMargin: "200px 0px" });
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const lift = liftRef.current;
    const spin = spinRef.current;
    if (!root || !lift || !spin) return;

    const overlays = root.querySelectorAll<HTMLElement>("[data-bw]");
    root.querySelectorAll<HTMLElement>("[data-focus]").forEach(splitWords);
    let mm: ReturnType<typeof gsap.matchMedia> | null = null;
    let timer = 0;

    const setup = () => {
      mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(lift, { x: 0, y: 0, z: 0 });
        gsap.set(spin, { rotationX: 0, rotationY: 0, rotationZ: 0 });
        gsap.set(overlays, { autoAlpha: 0 });
      });

      // On a desktop the header holds still while the section appears over it. A script-driven pin
      // trails the finger on a phone or tablet, which made the scroll out of the header stutter, so
      // there the header just scrolls away as the box grows over it. It is created before the box's
      // timeline below, so the pin is measured first.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1280px)", () => {
        const header = root.parentElement?.querySelector("header") ?? null;
        if (!header) return;
        ScrollTrigger.create({
          trigger: header,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 0.6)}`,
          pin: true,
          pinSpacing: false,
        });
      });

      // The box pops into view (the top margin on .about puts it over the lower part
      // of the header), then expands to full size. On desktop the header is released
      // when the section reaches the top and the pin begins.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-stage]");
        const range = () => `+=${Math.round(window.innerHeight * 0.6)}`;
        // Until the box has fully opened, the section and its pin wrapper let clicks through,
        // so the header's controls underneath (such as the music player) stay usable.
        // This runs on every frame of the scrub but the answer only changes once, so the
        // last one is kept and an unchanged frame writes nothing: a style write here
        // invalidates a full-screen subtree.
        let clickThrough: boolean | null = null;
        const setClickThrough = (progress: number) => {
          const open = progress >= 1;
          if (open === clickThrough) return;
          clickThrough = open;
          root.style.pointerEvents = open ? "" : "none";
          const wrapper = root.parentElement;
          if (wrapper?.classList.contains("pin-spacer")) {
            wrapper.style.pointerEvents = open ? "" : "none";
          }
        };
        const grow = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            // The sticker range wraps the header and is never pinned, so it gives a
            // steady start point for the scrub while the header is held in place.
            trigger: root.parentElement ?? root,
            start: "top top",
            end: range,
            scrub: true,
            // Until the box has fully opened, the section and its pin wrapper let clicks through,
            // so the header's controls underneath (such as the music player) stay usable
            onRefresh: (self) => setClickThrough(self.progress),
            onUpdate: (self) => {
              // This scrub keeps animating after the wheel stops, so it keeps the
              // page marked as moving — otherwise the decoration would start up
              // again while the most expensive part of the sequence is still running.
              markScrolling();
              setClickThrough(self.progress);
            },
          },
        });
        // Appear: the box comes into view over the header in its resting spot.
        grow.fromTo(
          root,
          { clipPath: "inset(100% 20% 0% 20% round 32px)" },
          { clipPath: "inset(12% 20% 6% 20% round 32px)", duration: 0.2 },
          0,
        );
        // Expand: the box grows to the full section, with the copy scaling up too.
        grow.fromTo(
          root,
          { clipPath: "inset(12% 20% 6% 20% round 32px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 0.8,
            immediateRender: false,
          },
          0.2,
        );
        if (stage) {
          grow.fromTo(stage, { scale: 0.6 }, { scale: 1, duration: 1 }, 0);
        }
        // The white box comes in first. The photo fades in once the box has
        // appeared and is part-way open, and fades back out when scrolling up.
        const card = root.querySelector<HTMLElement>("[data-card]");
        // The photo starts lower in the box, where the open box has room for it,
        // and settles into its place as the box finishes expanding.
        if (card) {
          grow.fromTo(
            card,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 },
            0.35,
          );
          grow.fromTo(
            card,
            { y: 260 },
            { y: 0, duration: 0.65 },
            0.35,
          );
        }

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
            // The long scrub outlives the gesture, so it keeps the page marked as moving
            onUpdate: markScrolling,
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

        // Image only at rest. "Hey!" rises out of a mask, then the body copy comes
        // in word by word, each word going from soft and blurred to sharp.
        const copy = root.querySelectorAll<HTMLElement>("[data-copy]");
        const hey = root.querySelector<HTMLElement>("[data-hey]");
        const words = root.querySelectorAll<HTMLElement>("[data-word]");
        if (hey) {
          tl.fromTo(
            hey,
            // The mask is padded past the text box so descenders (the "y") aren't cut off.
            { autoAlpha: 0, yPercent: 40, clipPath: "inset(-30% -20% 100% -20%)" },
            {
              autoAlpha: 1,
              yPercent: 0,
              clipPath: "inset(-30% -20% -30% -20%)",
              duration: 0.5,
              ease: "power3.out",
            },
            0,
          );
        }
        // Everything except "Hey!" waits until the photo has landed (the lift and
        // spin above both finish at 1), then fades in. The bio and right-hand copy
        // are hidden by CSS until GSAP reveals them, so their containers fade too.
        const blocks = root.querySelectorAll<HTMLElement>("[data-copy]:not([data-hey])");
        if (blocks.length) {
          tl.fromTo(
            blocks,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.3, ease: "sine.out" },
            1,
          );
        }
        if (words.length) {
          // Fade and lift travel together: both are cheap to animate.
          tl.fromTo(
            words,
            { autoAlpha: 0, y: 6 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "sine.out",
              stagger: 0.01,
            },
            1,
          );

          // The blur is kept apart from them. Every word that carries one is a surface
          // the browser has to blur again each time the radius moves, and there are
          // about fifty of them going at once. Rounding to whole pixels and skipping
          // repeats cuts most of that work; the focus pull looks the same.
          words.forEach((word, index) => {
            word.style.filter = "blur(8px)";
            const focus = { blur: 8 };
            let written = 8;
            tl.to(
              focus,
              {
                blur: 0,
                duration: 0.45,
                ease: "sine.out",
                onUpdate: () => {
                  const next = Math.round(focus.blur);
                  if (next === written) return;
                  written = next;
                  word.style.filter = next > 0 ? `blur(${next}px)` : "";
                },
              },
              1 + index * 0.01,
            );
          });
        }

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
          // The wash below does this already: it covers the same box over the same
          // stretch and ends up solid black. Tinting the section underneath it as well
          // repainted the whole panel on every frame to produce a colour nothing could
          // see, while the wash only changes its opacity, which costs nothing.
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
        let lit = false;
        tl.eventCallback("onUpdate", () => {
          const next = tl.time() >= 1;
          if (next !== settled) {
            settled = next;
            setTiltReady(next);
          }
          // The light field mounts once the background has finished turning black (1.12).
          const nowLit = tl.time() >= 1.12;
          if (nowLit !== lit) {
            lit = nowLit;
            setLightOn(nowLit);
          }
        });

        ScrollTrigger.refresh();
      };

      // Every width, phones included: once the box has opened over the header, the section holds
      // while the photo turns in and the copy appears, as on desktop. A phone-only sequence that
      // ran without the hold played out while the box was still opening.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        playSpin(true);
      });

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
      className={`${styles.about} ${roboto.className}`}
      aria-label="About"
      data-node-id="99:1003"
    >
      <div className={styles.wash} data-wash aria-hidden />
      <div className={styles.grain} data-grain aria-hidden />
      {/* Light field: mounted only once the section has turned black, so it isn't running while the page is light */}
      {lightOn ? (
        <div className={styles.lightfall} aria-hidden>
          <Lightfall
            // One device pixel, not two: this is a soft field drawn at a third of full
            // strength over black, and the shader is costly per pixel, so rendering it
            // at screen density was four times the work for no visible gain. Touch screens
            // draw it smaller still, since it is soft and a phone's GPU is the limit.
            dpr={window.matchMedia("(pointer: coarse)").matches ? 0.6 : 1}
            // Stops entirely once the section is away, and holds still while the page
            // is moving. Without this it runs from the moment it appears until reload.
            paused={!aboutNear}
            shouldPause={isScrolling}
            colors={["#ffffff"]}
            backgroundColor="#94a3b8"
            speed={0.3}
            streakCount={2}
            streakWidth={0.8}
            twinkle={0.3}
            backgroundGlow={0.1}
            headGlow={0.6}
            bloom={0.35}
            mouseInteraction
            mouseStrength={0.15}
            lens={0.2}
            holdToWarp
            intro
          />
        </div>
      ) : null}
      <div className={styles.stage} data-stage>
        <div className={styles.hey} data-copy data-hey>
          {/* Metal paint once the section has turned black; plain text until then */}
          {lightOn ? (
            <div className={styles.heyMetal}>
              <MetallicPaint
                // Same treatment as the light field: the sheen only moves while the
                // heading is in front of someone and the page is still
                paused={!aboutNear}
                shouldPause={isScrolling}
                text="Hey!"
                fontFamily="Roboto, sans-serif"
                fontWeight={900}
                scale={1}
                density={2}
                edgeBend={0.9}
              />
            </div>
          ) : (
            "Hey!"
          )}
        </div>

        <div className={styles.cardRig} data-card>
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

        <p className={styles.bio} data-copy data-focus>
          I’m Fredy, a UI/UX Designer & Front-End vibe Coder based in{" "}
          <span className={styles.keepLine}>Los Angeles</span>.
        </p>
        <div className={styles.copyRight} data-copy>
          <p className={styles.lead} data-focus>
            I am a passionate designer dedicated to building modern, scaleable,
            interactive mobile and web experiences.
          </p>
          <p className={styles.invite} data-focus>
            If you’re interested in collaborating, or have any questions, feel
            free to{" "}
            <Link
              className={`${styles.reach} ${styles.keepLine}`}
              href="/#contact"
              onClick={scrollToContact}
            >
              reach out
              <span className={styles.desktopOnly}> here.</span>
            </Link>
            <span className={styles.touchOnly}>.</span>
          </p>
          <ResumeDownload />
        </div>
      </div>
    </section>
  );
}

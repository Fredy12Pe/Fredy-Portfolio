"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Roboto } from "next/font/google";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CAROUSEL_PROJECTS, type CarouselProject } from "./carousel-projects";
import MagneticFilings from "./MagneticFilings";
import styles from "./ProjectsCarousel.module.css";

gsap.registerPlugin(ScrollTrigger);

const robotoBold = Roboto({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

/** Degrees between neighboring cards on the ring. */
const ANGLE_STEP_DEG = 45;
/** Neighbor bottom-centers sit this many card-widths from the active card. */
const SPACING = 0.86;
/** How far a neighbor's bottom drops, as a fraction of card height. */
const ARC_DROP = 0.28;
/** Side cards sit smaller and scale up to this as they reach the active slot. */
const ACTIVE_SCALE = 1;
const NEIGHBOR_SCALE = 0.82;
const FAR_SCALE = 0.72;
const ACTIVE_OPACITY = 1;
const NEIGHBOR_OPACITY = 0.72;
/** Gap between the active card's bottom edge and the dial top (ticks sit lower inside). */
const DIAL_GAP_PX = 28;
/** Hash marks around the dial — denser reads closer to UICapsule. */
const TICK_COUNT = 120;
/** How far the tick ring travels per project step. */
const DIAL_DEGREES_PER_PROJECT = 36;
/** How quickly the tick ring catches the cards. Lower trails further behind. */
const DIAL_FOLLOW = 4.2;
/** Active-card hover — mouse-follow 3D tilt (degrees at card edges). */
const PARALLAX_MAX_Y = 14;
const PARALLAX_MAX_X = 10;
const CARD_PERSPECTIVE = 900;
/** Click → case-study 3D spin. Screen fade starts at this fraction of the spin. */
const SPIN_DURATION = 0.55;
const SPIN_FADE_AT = 0.75;
/** Horizontal px that advances the dial by one degree (UICapsule default). */
const PIXELS_PER_DEGREE = 5;
const TICK_CX = 500;
const TICK_CY = 500;
const TICK_R_OUTER = 500;
const TICK_R_INNER = 468;

type Props = {
  projects?: CarouselProject[];
};

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function shortestDelta(from: number, to: number, len: number) {
  let d = to - from;
  while (d > len / 2) d -= len;
  while (d < -len / 2) d += len;
  return d;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Place a card bottom on an arc whose top (θ=0) is the active slot.
 * The bottom-center rides the arc; the card rotates around that point
 * so neighbors fan outward and sit lower.
 */
function layoutCard(
  offset: number,
  cardW: number,
  cardH: number,
): {
  x: number;
  y: number;
  rotate: number;
  opacity: number;
  z: number;
  scale: number;
} {
  const angleDeg = offset * ANGLE_STEP_DEG;
  const angle = (angleDeg * Math.PI) / 180;
  const step = (ANGLE_STEP_DEG * Math.PI) / 180;
  const abs = Math.abs(offset);
  // Normalize so offset ±1 lands on the spacing / drop, and in-between
  // frames follow the same sine curve.
  const along = Math.sin(step) === 0 ? 0 : Math.sin(angle) / Math.sin(step);
  const drop =
    1 - Math.cos(step) === 0 ? 0 : (1 - Math.cos(angle)) / (1 - Math.cos(step));

  const x = along * cardW * SPACING;
  const y = drop * cardH * ARC_DROP;

  // Scale and opacity follow offset the whole way. A threshold here
  // snaps the card to full size in the last frames instead of growing in.
  const approach = clamp(abs, 0, 1);
  const depart = clamp(abs - 1, 0, 1);
  const scale = lerp(
    lerp(ACTIVE_SCALE, NEIGHBOR_SCALE, approach),
    FAR_SCALE,
    depart,
  );
  const opacity =
    abs <= 1
      ? lerp(ACTIVE_OPACITY, NEIGHBOR_OPACITY, approach)
      : NEIGHBOR_OPACITY * (1 - clamp((abs - 1) / 0.65, 0, 1));

  return {
    x,
    y,
    rotate: angleDeg,
    opacity,
    z: Math.round(200 - abs * 40),
    scale,
  };
}

export default function ProjectsCarousel({
  projects = CAROUSEL_PROJECTS,
}: Props) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const filingsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const ticksTravelRef = useRef<SVGGElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pivotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef({ value: 0 });
  const dialProgress = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const dialTweenRef = useRef<gsap.core.Tween | null>(null);
  const dialFollowing = useRef(false);
  const navigating = useRef(false);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);
  const dragStartProgress = useRef(0);
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const suppressClick = useRef(false);
  const swallowNavClick = useRef(false);
  const [active, setActive] = useState(0);

  const count = projects.length;

  // White ticks in an SVG mask; a fixed blue→yellow fill shows through.
  // Avoids mix-blend-mode (Safari drops it when ancestors use mask/overflow).
  const tickMaskLines = useMemo(
    () =>
      Array.from({ length: TICK_COUNT }, (_, i) => {
        const angle = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const round = (n: number) => Math.round(n * 100) / 100;
        return (
          <line
            key={i}
            x1={round(TICK_CX + TICK_R_INNER * cos)}
            y1={round(TICK_CY + TICK_R_INNER * sin)}
            x2={round(TICK_CX + TICK_R_OUTER * cos)}
            y2={round(TICK_CY + TICK_R_OUTER * sin)}
          />
        );
      }),
    [],
  );

  const applyLayout = useCallback(
    (raw: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const { width: w, height: h } = stage.getBoundingClientRect();
      const idx = wrapIndex(raw, count);
      const nearest = Math.round(idx) % count;
      const sample = cardRefs.current.find((el) => el);
      const cardW = sample?.offsetWidth ?? w * 0.28;
      const cardH = sample?.offsetHeight ?? cardW * (440 / 360);
      // Match .dial bottom: -2% (−1% on small screens) — the dial's bottom
      // edge sits that far below the stage. Cards sit just above the arc.
      const dialBottomFrac = w <= 900 ? 0.01 : 0.02;
      const dialW = Math.min(w * (w <= 900 ? 0.96 : 0.74), w <= 900 ? 560 : 840);
      const dialH = dialW * 0.5;
      const dialTop = h * (1 + dialBottomFrac) - dialH;
      const baseY = dialTop - DIAL_GAP_PX;

      projects.forEach((_, i) => {
        const el = cardRefs.current[i];
        const pivot = pivotRefs.current[i];
        if (!el) return;
        const offset = shortestDelta(idx, i, count);
        const layout = layoutCard(offset, cardW, cardH);

        gsap.set(el, {
          x: layout.x,
          y: baseY + layout.y,
          opacity: layout.opacity,
          zIndex: layout.z,
          force3D: true,
          pointerEvents:
            i === nearest && Math.abs(offset) < 0.4 ? "auto" : "none",
        });
        if (pivot) {
          gsap.set(pivot, {
            rotation: layout.rotate,
            scale: layout.scale,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
            force3D: true,
          });
        }

        el.dataset.active =
          i === nearest && Math.abs(offset) < 0.4 ? "true" : "false";
        el.style.setProperty("--shade", String(clamp(Math.abs(offset), 0, 1)));
        el.setAttribute("aria-hidden", layout.opacity < 0.2 ? "true" : "false");
      });

      setActive((prev) => (prev === nearest ? prev : nearest));
    },
    [count, projects],
  );

  const applyTicks = useCallback((raw: number) => {
    const ticks = ticksTravelRef.current;
    if (!ticks) return;
    const deg = -raw * DIAL_DEGREES_PER_PROJECT;
    ticks.setAttribute("transform", `rotate(${deg} ${TICK_CX} ${TICK_CY})`);
  }, []);

  // Exponential follow — the ring eases toward the cards instead of waiting, then starting.
  const stepDial = useCallback(() => {
    const target = progress.current.value;
    const current = dialProgress.current.value;
    const delta = target - current;
    const cardMoving = tweenRef.current?.isActive() ?? false;
    if (!cardMoving && Math.abs(delta) < 0.0008) {
      dialProgress.current.value = target;
      applyTicks(target);
      gsap.ticker.remove(stepDial);
      dialFollowing.current = false;
      return;
    }
    const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.05);
    const k = 1 - Math.exp(-DIAL_FOLLOW * dt);
    dialProgress.current.value = current + delta * k;
    applyTicks(dialProgress.current.value);
  }, [applyTicks]);

  const beginDialFollow = useCallback(() => {
    if (dialFollowing.current) return;
    dialFollowing.current = true;
    gsap.ticker.add(stepDial);
  }, [stepDial]);

  const stopDialFollow = useCallback(() => {
    if (!dialFollowing.current) return;
    gsap.ticker.remove(stepDial);
    dialFollowing.current = false;
  }, [stepDial]);

  const tiltCard = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>, i: number) => {
      // A touch tilt moves the card under the finger and iOS cancels the tap.
      if (e.pointerType !== "mouse") return;
      if (reducedMotion.current || navigating.current || dragging.current) return;
      const face = faceRefs.current[i];
      if (!face) return;
      const rect = face.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(face, {
        rotationY: nx * 2 * PARALLAX_MAX_Y,
        rotationX: -ny * 2 * PARALLAX_MAX_X,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [],
  );

  const leaveCard = useCallback((i: number) => {
    if (navigating.current) return;
    const face = faceRefs.current[i];
    if (!face) return;
    gsap.to(face, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, []);

  const openProject = useCallback(
    (i: number, href: string) => {
      if (navigating.current) return;
      if (reducedMotion.current) {
        router.push(href);
        return;
      }

      navigating.current = true;
      const face = faceRefs.current[i];
      if (!face) {
        router.push(href);
        return;
      }

      gsap.killTweensOf(face);
      openTimelineRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => router.push(href),
      });
      openTimelineRef.current = tl;
      tl.fromTo(
        face,
        { rotationX: 0, rotationY: gsap.getProperty(face, "rotationY") },
        {
          rotationX: 0,
          rotationY: "+=360",
          duration: SPIN_DURATION,
          ease: "power2.inOut",
        },
        0,
      );
      if (fadeRef.current) {
        tl.to(
          fadeRef.current,
          {
            opacity: 1,
            duration: SPIN_DURATION * (1 - SPIN_FADE_AT),
            ease: "power1.inOut",
          },
          SPIN_DURATION * SPIN_FADE_AT,
        );
      }
    },
    [router],
  );

  const openCard = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, i: number, href: string) => {
      // Let modifier / middle clicks open the case study normally.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }
      if (suppressClick.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      openProject(i, href);
    },
    [openProject],
  );

  const goTo = useCallback(
    (targetIndex: number) => {
      const from = progress.current.value;
      const delta = shortestDelta(from, targetIndex, count);
      const to = from + delta;

      tweenRef.current?.kill();
      dialTweenRef.current?.kill();

      if (needleRef.current && !reducedMotion.current) {
        gsap.fromTo(
          needleRef.current,
          { scaleY: 1 },
          {
            scaleY: 1.2,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            transformOrigin: "50% 0%",
            overwrite: "auto",
          },
        );
      }

      if (reducedMotion.current || Math.abs(delta) < 0.001) {
        stopDialFollow();
        progress.current.value = to;
        dialProgress.current.value = to;
        applyLayout(to);
        applyTicks(to);
        return;
      }

      tweenRef.current = gsap.to(progress.current, {
        value: to,
        duration: 1.15,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => applyLayout(progress.current.value),
        onComplete: () => applyLayout(progress.current.value),
      });

      beginDialFollow();
    },
    [applyLayout, applyTicks, beginDialFollow, count, stopDialFollow],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      goTo(Math.round(progress.current.value) + dir);
    },
    [goTo],
  );

  const snapToNearest = useCallback(() => {
    const nearest = Math.round(progress.current.value);
    tweenRef.current?.kill();
    dialTweenRef.current?.kill();

    if (reducedMotion.current) {
      progress.current.value = nearest;
      dialProgress.current.value = nearest;
      applyLayout(nearest);
      applyTicks(nearest);
      return;
    }

    tweenRef.current = gsap.to(progress.current, {
      value: nearest,
      duration: 0.55,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => applyLayout(progress.current.value),
      onComplete: () => applyLayout(progress.current.value),
    });

    dialTweenRef.current = gsap.to(dialProgress.current, {
      value: nearest,
      duration: 0.55,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => applyTicks(dialProgress.current.value),
      onComplete: () => applyTicks(dialProgress.current.value),
    });
  }, [applyLayout, applyTicks]);

  // Fade the composition up with the scroll into the section.
  // Cards keep their own arc transforms; this only moves their parent stage.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const filings = filingsRef.current;
    const stage = stageRef.current;
    const dial = dialRef.current;
    if (!section || !filings || !stage || !dial) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([filings, stage], { autoAlpha: 1, y: 0 });
        gsap.set(dial, { autoAlpha: 1, x: 0, xPercent: 0, y: 0 });
        return;
      }

      gsap.set(filings, { y: 40, autoAlpha: 0 });
      gsap.set(stage, { y: 72, autoAlpha: 0 });
      gsap.set(dial, { y: 56, autoAlpha: 0, x: 0, xPercent: 0 });

      const mm = gsap.matchMedia();

      const reveal = (start: string, end: string, scrub: number) => {
        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: section,
            start,
            end,
            scrub,
          },
        });

        tl.to(filings, { y: 0, autoAlpha: 1 }, 0)
          .to(stage, { y: 0, autoAlpha: 1 }, 0)
          .to(dial, { y: 0, autoAlpha: 1, x: 0, xPercent: 0 }, 0);
      };

      // Desktop cards sit high in a full-viewport section, so the fade
      // waits until that top has climbed into view.
      mm.add("(min-width: 861px)", () => {
        reveal("top 46%", "top 12%", 0.55);
      });

      // On a phone the cards live toward the bottom of a shorter section.
      // Finish the fade as the section arrives, not as it leaves.
      mm.add("(max-width: 860px)", () => {
        reveal("top 96%", "top 72%", 0.15);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Anchor each card by its bottom-center so the arc runs along the bottoms.
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { xPercent: -50, yPercent: -100 });
      const pivot = pivotRefs.current[i];
      if (pivot) {
        gsap.set(pivot, {
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
        });
      }
      const face = faceRefs.current[i];
      if (face) {
        gsap.set(face, {
          transformOrigin: "50% 50%",
          transformPerspective: CARD_PERSPECTIVE,
          transformStyle: "preserve-3d",
          rotationX: 0,
          rotationY: 0,
          force3D: true,
        });
      }
    });

    applyLayout(0);
    applyTicks(0);

    const onResize = () => {
      applyLayout(progress.current.value);
      applyTicks(dialProgress.current.value);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tweenRef.current?.kill();
      dialTweenRef.current?.kill();
      gsap.ticker.remove(stepDial);
      dialFollowing.current = false;
      faceRefs.current.forEach((face) => {
        if (face) gsap.killTweensOf(face);
      });
      openTimelineRef.current?.kill();
    };
  }, [applyLayout, applyTicks, stepDial]);

  // Horizontal drag on the dial — same interaction model as UICapsule.
  useEffect(() => {
    const dial = dialRef.current;
    if (!dial) return;

    let navPress: { id: number; x: number; y: number; dir: 1 | -1 } | null = null;

    const navDir = (target: EventTarget | null): 1 | -1 | null => {
      if (!(target instanceof Element)) return null;
      const button = target.closest("button");
      if (!button || !dial.contains(button)) return null;
      if (button.classList.contains(styles.navBtnPrev)) return -1;
      if (button.classList.contains(styles.navBtnNext)) return 1;
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const dir = navDir(e.target);
      if (dir) {
        // A click inside this drag surface is dropped on the first phone tap
        // (touch-action plus sticky hover). Record the press and step on release.
        navPress = { id: e.pointerId, x: e.clientX, y: e.clientY, dir };
        e.preventDefault();
        return;
      }
      dragging.current = true;
      dragStartX.current = e.clientX;
      dragStartProgress.current = progress.current.value;
      tweenRef.current?.kill();
      dialTweenRef.current?.kill();
      stopDialFollow();
      dialProgress.current.value = progress.current.value;
      applyTicks(dialProgress.current.value);
      dial.setPointerCapture(e.pointerId);
      dial.classList.add(styles.dialDragging);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const offsetX = e.clientX - dragStartX.current;
      const next =
        dragStartProgress.current -
        offsetX / (PIXELS_PER_DEGREE * DIAL_DEGREES_PER_PROJECT);
      progress.current.value = next;
      dialProgress.current.value = next;
      applyLayout(next);
      applyTicks(next);
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      dial.classList.remove(styles.dialDragging);
      try {
        dial.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      snapToNearest();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!navPress || e.pointerId !== navPress.id) {
        endDrag(e);
        return;
      }
      const press = navPress;
      navPress = null;
      const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y);
      if (moved > 18) return;
      swallowNavClick.current = true;
      step(press.dir);
      window.setTimeout(() => {
        swallowNavClick.current = false;
      }, 450);
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (navPress && e.pointerId === navPress.id) {
        navPress = null;
        return;
      }
      endDrag(e);
    };

    dial.addEventListener("pointerdown", onPointerDown);
    dial.addEventListener("pointermove", onPointerMove);
    dial.addEventListener("pointerup", onPointerUp);
    dial.addEventListener("pointercancel", onPointerCancel);

    return () => {
      dial.removeEventListener("pointerdown", onPointerDown);
      dial.removeEventListener("pointermove", onPointerMove);
      dial.removeEventListener("pointerup", onPointerUp);
      dial.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [applyLayout, applyTicks, snapToNearest, step, stopDialFollow]);

  // Phone: swipe the cards themselves. A vertical move still scrolls the page.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const mobileQuery = window.matchMedia("(max-width: 860px)");
    // Finger jitter is often ~15px. Below this is a tap; past it can be a swipe.
    const SWIPE_LOCK = 28;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let axis: "h" | "v" | null = null;

    const onPointerDown = (event: PointerEvent) => {
      if (!mobileQuery.matches || event.button !== 0) return;
      tracking = true;
      axis = null;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      dragStartX.current = event.clientX;
      dragStartProgress.current = progress.current.value;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!tracking || event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (!axis) {
        if (Math.hypot(dx, dy) < SWIPE_LOCK) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        if (axis === "v") {
          tracking = false;
          return;
        }
        dragging.current = true;
        tweenRef.current?.kill();
        dialTweenRef.current?.kill();
        stopDialFollow();
        dialProgress.current.value = progress.current.value;
        applyTicks(dialProgress.current.value);
        try {
          stage.setPointerCapture(event.pointerId);
        } catch {
          /* pointer already gone */
        }
      }

      if (axis !== "h" || !dragging.current) return;
      const offsetX = event.clientX - dragStartX.current;
      const next =
        dragStartProgress.current -
        offsetX / (PIXELS_PER_DEGREE * DIAL_DEGREES_PER_PROJECT);
      progress.current.value = next;
      dialProgress.current.value = next;
      applyLayout(next);
      applyTicks(next);
    };

    const openTappedCard = (event: PointerEvent) => {
      const active = cardRefs.current.find((el) => el?.dataset.active === "true");
      if (!active) return;
      const rect = active.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) return;
      const href = active.querySelector("a")?.getAttribute("href");
      const index = cardRefs.current.indexOf(active);
      if (!href || index < 0) return;
      // The synthesized click is unreliable on the 3D card, so open on release
      // and drop that click so the project doesn't open twice.
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 500);
      openProject(index, href);
    };

    const endSwipe = (event: PointerEvent, openTap: boolean) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const wasDrag = dragging.current;
      tracking = false;
      axis = null;
      pointerId = -1;
      if (!wasDrag) {
        if (openTap && Math.hypot(dx, dy) < SWIPE_LOCK) openTappedCard(event);
        return;
      }

      dragging.current = false;
      if (Math.abs(dx) > 10) suppressClick.current = true;
      try {
        stage.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }

      const delta = progress.current.value - dragStartProgress.current;
      const origin = Math.round(dragStartProgress.current);
      // A short flick still advances one project; a longer drag can pass several.
      if (Math.abs(dx) >= 36 && Math.abs(delta) < 0.5) {
        goTo(origin + (delta > 0 ? 1 : -1));
      } else {
        snapToNearest();
      }
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
    };

    const onPointerUp = (event: PointerEvent) => endSwipe(event, true);
    const onPointerCancel = (event: PointerEvent) => endSwipe(event, false);

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerCancel);
    stage.addEventListener("click", onClickCapture, true);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerCancel);
      stage.removeEventListener("click", onClickCapture, true);
    };
  }, [applyLayout, applyTicks, goTo, openProject, snapToNearest, stopDialFollow]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${robotoBold.variable}`}
      aria-label="Featured projects carousel"
    >
      <div ref={filingsRef} className={styles.filingsHost}>
        <MagneticFilings />
      </div>
      <div ref={fadeRef} className={styles.screenFade} aria-hidden />

      <div ref={stageRef} className={styles.stage}>
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={styles.card}
            data-active="false"
          >
            <div
              className={styles.cardPivot}
              ref={(el) => {
                pivotRefs.current[i] = el;
              }}
            >
              <Link
                href={project.href}
                className={styles.cardLink}
                tabIndex={active === i ? 0 : -1}
                aria-label={`${project.title} — ${project.tagline}`}
                onPointerMove={(e) => tiltCard(e, i)}
                onPointerLeave={() => leaveCard(i)}
                onClick={(e) => openCard(e, i, project.href)}
              >
                <div
                  className={styles.cardTilt}
                  ref={(el) => {
                    faceRefs.current[i] = el;
                  }}
                >
                  <div
                    className={styles.cardBack}
                    style={{ backgroundImage: project.background }}
                    aria-hidden
                  />
                  <div
                    className={styles.cardFace}
                    style={{
                      backgroundImage: project.background,
                      color: project.textColor ?? "#fff",
                    }}
                  >
                    {project.cardArt ? (
                      <Image
                        src={project.cardArt}
                        alt=""
                        width={360}
                        height={440}
                        className={styles.cardArt}
                        priority={i === 0}
                        unoptimized
                      />
                    ) : (
                      <>
                        <div className={styles.cardCopy}>
                          <h2 className={styles.cardTitle}>{project.title}</h2>
                          <p className={styles.cardTagline}>{project.tagline}</p>
                        </div>
                        {project.phoneSrc ? (
                          <div
                            className={`${styles.phoneWrap}${
                              project.phoneWide ? ` ${styles.phoneWrapWide}` : ""
                            }`}
                          >
                            <Image
                              src={project.phoneSrc}
                              alt={project.phoneAlt ?? ""}
                              width={204}
                              height={422}
                              className={styles.phone}
                              unoptimized
                            />
                          </div>
                        ) : null}
                      </>
                    )}
                    <div className={styles.cardShade} aria-hidden />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={dialRef}
        className={styles.dial}
        role="slider"
        aria-label="Browse projects"
        aria-valuemin={0}
        aria-valuemax={count - 1}
        aria-valuenow={active}
        aria-valuetext={projects[active]?.title}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            step(-1);
          } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            step(1);
          }
        }}
      >
        <div className={styles.dialArc} aria-hidden>
          <img src="/images/portfolio-v3/dial-arc.svg" alt="" />
        </div>

        <svg
          className={styles.tickSvg}
          viewBox="0 0 1000 260"
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="carouselTickTint"
              x1="0"
              y1="0"
              x2="1000"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="45%" stopColor="#e8e8e8" />
              <stop offset="55%" stopColor="#e8e8e8" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <mask
              id="carouselTickMask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1000"
              height="260"
            >
              <g ref={ticksTravelRef}>
                <g stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  {tickMaskLines}
                </g>
              </g>
            </mask>
          </defs>
          <rect
            width="1000"
            height="260"
            fill="url(#carouselTickTint)"
            mask="url(#carouselTickMask)"
          />
        </svg>

        <div ref={needleRef} className={styles.activeTick} aria-hidden />

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnPrev}`}
            aria-label="Previous project"
            onClick={() => {
              if (swallowNavClick.current) {
                swallowNavClick.current = false;
                return;
              }
              step(-1);
            }}
          >
            <img
              src="/images/portfolio-v3/nav-skip.svg"
              alt=""
              width={43}
              height={42}
            />
          </button>
          <span className={styles.navDivider} aria-hidden />
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnNext}`}
            aria-label="Next project"
            onClick={() => {
              if (swallowNavClick.current) {
                swallowNavClick.current = false;
                return;
              }
              step(1);
            }}
          >
            <img
              src="/images/portfolio-v3/nav-skip.svg"
              alt=""
              width={43}
              height={42}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

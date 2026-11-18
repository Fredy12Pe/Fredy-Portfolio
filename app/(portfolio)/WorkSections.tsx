"use client";

import Image from "next/image";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { inter } from "@/lib/fonts";
import { useReveal } from "@/lib/reveal";
import { FEATURED_PROJECTS, MORE_PROJECTS, type FeaturedProject } from "./home-data";
import WorkFolder from "./WorkFolder";
import styles from "./home.module.css";

/** Delay order for elements that fade up together (see .fade-up in globals.css) */
function stagger(index: number) {
  return { "--fade-i": index } as CSSProperties;
}

const ARROW_SRC = "/images/featured-work/project-link.svg";

/* How Featured work arrives.
   fly: desktop. The folder holds the middle of the screen and each case study flies out of it
        to its place as you scroll.
   rise: phones. The folder sits above the cards, which rise and fade in as they come into view.
   still: reduced motion, and the first render before the screen size is known. No movement. */
type Mode = "fly" | "rise" | "still";

function useArrivalMode(): Mode {
  const [mode, setMode] = useState<Mode>("still");

  useEffect(() => {
    // The folder fly-out plays at every width, phones included; only reduced motion keeps it still
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMode(reduced.matches ? "still" : "fly");
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  return mode;
}

/** Runs measure now, on window resize, and whenever the page's height changes (images and fonts
    loading above can move the section). Bumps the returned value so scroll-driven values recompute. */
function useMeasured(measure: () => void, active: boolean): MotionValue<number> {
  const tick = useMotionValue(0);
  const measureRef = useRef(measure);
  measureRef.current = measure;

  useEffect(() => {
    if (!active) return;
    // A phone's address bar sliding in and out changes the window's height by a little as the page
    // scrolls; re-measuring on that made the cards jump, so only width changes and big height changes
    // (a rotation, a real resize) count. Changes to the page's own height still re-measure.
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const run = () => {
      measureRef.current();
      tick.set(tick.get() + 1);
    };
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === lastW && Math.abs(h - lastH) < 160) return;
      lastW = w;
      lastH = h;
      run();
    };
    run();
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(run);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [active, tick]);

  return tick;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Fly-out timing, in fractions of the screen height scrolled into the section */
const OPEN_FROM = -0.1; // folder starts opening just before it settles in the middle
const TRIGGER = 0.45; // scrolling past this sends the case studies out
/* Scrolling back above this brings them home. Low enough that there is room to look at both case
   studies on the way up, high enough that the folder is still held in the middle of the screen. */
const RETURN = 0.2;
/** The case studies' flight: out of the pocket and up (first part), then down into place */
const RISE_SHARE = 0.36;

/** Holds the page at the position y() gives: wheel, touch and scroll keys are ignored, and any
    momentum still running is pulled back. Returns the function that lets go. */
function holdScroll(y: () => number) {
  const pin = () => {
    if (Math.abs(window.scrollY - y()) > 1) window.scrollTo({ top: y(), behavior: "instant" });
  };
  const block = (event: Event) => event.preventDefault();
  const blockKeys = (event: KeyboardEvent) => {
    if ([" ", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      event.preventDefault();
    }
  };
  pin();
  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  window.addEventListener("keydown", blockKeys);
  window.addEventListener("scroll", pin);
  return () => {
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", blockKeys);
    window.removeEventListener("scroll", pin);
  };
}

/** Gap left above the section title when the fly-out brings it into view, clear of the menu */
const TITLE_OFFSET = 120;

/** Size of the folder on screen; matches .folder in WorkFolder.module.css */
function folderSize(vw: number) {
  const width = Math.min(540, Math.max(260, vw * 0.32));
  return { width, height: (width * 420) / 556 };
}

/* Featured work: one case study per row, a details card beside a media panel. Rows alternate. */
export function FeaturedWork() {
  const mode = useArrivalMode();
  const fly = mode === "fly";
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  // hold: the folder stage's height (a full screen on desktop, less on phones), whose middle is where the folder is held
  const stage = useRef({ top: 0, vh: 1, hold: 1, holdTop: 0 });

  const tick = useMeasured(() => {
    const el = stageRef.current;
    if (!el) return;
    const sticky = el.querySelector<HTMLElement>(`.${styles.folderSticky}`);
    stage.current = {
      top: el.getBoundingClientRect().top + window.scrollY,
      vh: window.innerHeight,
      hold: sticky?.offsetHeight || window.innerHeight,
      // How far down the screen the stage sticks (0 on desktop; on phones it is centred on screen)
      holdTop: sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0,
    };
  }, fly);

  /* flight: 0 home in the folder, 1 out in place. Played on its own clock once a threshold is
     crossed, rather than tied to the scrollbar, so both case studies always finish together. */
  const flight = useMotionValue(0);
  const target = useRef<0 | 1>(0);
  const playing = useRef<ReturnType<typeof animate> | null>(null);
  const release = useRef<(() => void) | null>(null);

  const sendTo = (to: 0 | 1) => {
    if (target.current === to) return;
    target.current = to;
    playing.current?.stop();
    playing.current = animate(flight, to, {
      duration: to === 1 ? 1.4 : 1.1,
      ease: "linear", // the shaping happens per phase in FlyingPiece
    });
  };

  const lastY = useRef<number | null>(null);

  const sync = (y: number, instant = false) => {
    const previous = lastY.current;
    lastY.current = y;
    if (!fly || release.current) return;
    const { top, vh } = stage.current;
    const into = (y - top) / vh;
    /* Passing through rather than scrolling here: a menu link gliding to another section (marked by
       SmoothScroll), a jump of most of a screen, or a reload. Then the cards simply go out or home,
       and the page is never held or steered. A quick flick of the wheel or trackpad still counts as
       scrolling here, so it gets the pause in both directions. */
    /* On touch screens the page is never held or steered: holding it fought the finger and its
       momentum, which made the fly-out stutter on phones. The cards still fly out and back. */
    const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 700;
    const passing =
      touch ||
      previous === null ||
      document.documentElement.hasAttribute("data-navigating") ||
      Math.abs(y - previous) > vh * 0.6;
    if (into >= TRIGGER) {
      if (instant || into > TRIGGER + 0.6) {
        if (target.current === 1 && flight.get() === 1) return;
        playing.current?.stop();
        target.current = 1;
        flight.set(1);
        return;
      }
      if (target.current === 1) return;
      if (passing) {
        sendTo(1);
        return;
      }
      /* Going out: the page glides on its own until the title sits just under the menu, while
         the cards fly. Any scrolling the visitor does meanwhile is held, so the cards always
         finish with the title in view; scrolling carries on from there. */
      const slot = stageRef.current?.querySelector(`.${styles.headingSlot}`);
      const end = slot ? slot.getBoundingClientRect().top + y - TITLE_OFFSET : y;
      let at = y;
      const glide = animate(y, end, {
        duration: 1.4,
        ease: [0.65, 0, 0.35, 1],
        onUpdate: (v) => {
          at = v;
          window.scrollTo({ top: v, behavior: "instant" });
        },
      });
      release.current = holdScroll(() => at);
      sendTo(1);
      playing.current?.then(() => {
        glide.stop();
        release.current?.();
        release.current = null;
      });
    } else if (into < RETURN && target.current === 1) {
      if (passing || into < -0.6) {
        sendTo(0);
        return;
      }
      /* Going home: the page holds still with the folder in the middle while the cards go back
         in and the folder closes, then scrolling carries on. */
      release.current = holdScroll(() => top + RETURN * vh);
      sendTo(0);
      playing.current?.then(() => {
        release.current?.();
        release.current = null;
      });
    }
  };

  useMotionValueEvent(scrollY, "change", (y) => sync(y));
  // Arriving mid-page (reload, or a link into the section): start with the case studies already out
  useMotionValueEvent(tick, "change", () => sync(window.scrollY, true));
  useEffect(
    () => () => {
      playing.current?.stop();
      release.current?.();
    },
    [],
  );

  /* The folder opens as it settles in the middle, stays open while the case studies are out,
     and closes again once they are back inside. */
  const open = useTransform([scrollY, tick, flight], ([y, , f]) => {
    const { top, vh } = stage.current;
    const byScroll = clamp01(((y as number) - top - OPEN_FROM * vh) / ((TRIGGER - OPEN_FROM) * vh));
    return easeInOut(Math.max(byScroll, clamp01((f as number) / 0.25)));
  });
  /* Gone behind the cards once they have landed and cover it. Scrolling back up above the
     trigger shows it again, open and waiting, while the cards hold their places for a moment. */
  /* How far the folder has gone (0 shown, 1 gone): it eases out over the second half of the
     cards' flight, sinking and settling back a little as it fades, and eases back the same way. */
  const folderGone = useTransform([scrollY, tick, flight], ([y, , f]) => {
    const { top, vh } = stage.current;
    const into = ((y as number) - top) / vh;
    const landed = easeInOut(clamp01(((f as number) - 0.45) / 0.55));
    const covered = easeInOut(clamp01((into - RETURN) / (TRIGGER - RETURN)));
    return landed * covered;
  });
  const folderOpacity = useTransform(folderGone, (g) => 1 - g);
  const folderScale = useTransform(folderGone, (g) => 1 - 0.07 * g);
  const folderSink = useTransform(folderGone, (g) => g * 28);
  // The front panel covers the cards while they are in the pocket, then drops behind them
  const frontLayer = useTransform(flight, (f) => (f < RISE_SHARE * 0.85 ? 2 : 0));

  const subtitle = `${FEATURED_PROJECTS.length} case studies`;

  return (
    <section id="work" className={`${styles.section} ${inter.className}`} aria-labelledby="work-heading">
      <div ref={stageRef} className={styles.workStage}>
        {/* Desktop: the folder's back and front in separate layers, so the case studies come out
            from between them */}
        <div className={`${styles.folderLayer} ${styles.flyOnly}`}>
          <div className={styles.folderSticky}>
            <motion.div style={{ opacity: folderOpacity, scale: folderScale, y: folderSink }}>
              <WorkFolder part="back" open={open} />
            </motion.div>
          </div>
        </div>
        <motion.div className={`${styles.folderLayer} ${styles.flyOnly}`} style={{ zIndex: frontLayer }}>
          <div className={styles.folderSticky}>
            <motion.div style={{ opacity: folderOpacity, scale: folderScale, y: folderSink }}>
              <WorkFolder part="front" open={open} subtitle={subtitle} />
            </motion.div>
          </div>
        </motion.div>

        {/* Phones and reduced motion: the whole folder above the cards */}
        <div className={styles.inlineFolder}>
          <WorkFolder subtitle={subtitle} />
        </div>

        <div className={styles.workContent}>
          {/* One screen of folder on its own before the case studies come out */}
          <div className={`${styles.folderSpacer} ${styles.flyOnly}`} aria-hidden />

          <FlyHeading fly={fly} flight={flight} scrollY={scrollY} stage={stage} />

          <div className={styles.featuredList}>
            {FEATURED_PROJECTS.map((project, index) => (
              <ArrivingRow
                key={project.id}
                index={index}
                mode={mode}
                flight={flight}
                scrollY={scrollY}
                stage={stage}
              >
                <Link
                  href={project.href}
                  className={
                    index % 2 === 1 ? `${styles.featuredRow} ${styles.featuredRowReverse}` : styles.featuredRow
                  }
                  aria-label={`${project.title}: view case study`}
                >
                  <ProjectDetails project={project} />
                  <FeaturedMedia kind={project.media} />
                </Link>
              </ArrivingRow>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* The section title. In fly mode it waits above the folder at full size, and moves to its place
   above Grove as the cards fly out; on the way back it returns to its spot above the folder. */
function FlyHeading({
  fly,
  flight,
  scrollY,
  stage,
}: {
  fly: boolean;
  flight: MotionValue<number>;
  scrollY: MotionValue<number>;
  stage: { current: { top: number; vh: number; hold: number; holdTop: number } };
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const geo = useRef({ cx: 0, cy: 0, fontSize: 80, vw: 1, vh: 1 });

  const tick = useMeasured(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const r = slot.getBoundingClientRect();
    const heading = slot.firstElementChild;
    geo.current = {
      cx: r.left + r.width / 2,
      cy: r.top + window.scrollY + r.height / 2,
      fontSize: heading ? parseFloat(getComputedStyle(heading).fontSize) : 80,
      vw: document.documentElement.clientWidth,
      vh: window.innerHeight,
    };
  }, fly);

  const pose = (sy: number, f: number) => {
    const { cx, cy, fontSize, vw, vh } = geo.current;
    const t = easeInOut(clamp01(f));
    const folder = folderSize(vw);
    const half = stage.current.hold / 2;
    const folderY = Math.max(stage.current.holdTop + half, stage.current.top - sy + half);
    // Waiting: full size, centred above the folder and the cards peeking out of it
    const rest = { x: vw / 2, y: folderY - folder.height * 0.7 - fontSize * 0.6, s: 1 };
    const place = { x: cx, y: cy - sy, s: 1 };
    return {
      x: lerp(rest.x, place.x, t) - place.x,
      y: lerp(rest.y, place.y, t) - place.y,
      s: lerp(rest.s, place.s, t),
    };
  };

  const x = useTransform([scrollY, flight, tick], ([sy, f]) => pose(sy as number, f as number).x);
  const y = useTransform([scrollY, flight, tick], ([sy, f]) => pose(sy as number, f as number).y);
  const scale = useTransform([scrollY, flight, tick], ([sy, f]) => pose(sy as number, f as number).s);

  return (
    <div ref={slotRef} className={styles.headingSlot}>
      {fly ? (
        <motion.h2 id="work-heading" className={`${styles.featuredHeading} ${styles.flyCard}`} style={{ x, y, scale }}>
          Featured work
        </motion.h2>
      ) : (
        <h2 id="work-heading" className={styles.featuredHeading}>
          Featured work
        </h2>
      )}
    </div>
  );
}

/* Fly-out poses for the four cards, in order: Grove details, Grove media, Samples details,
   Samples media. Offsets are in folder widths/heights, angles in degrees. */
const TUCKED = [
  { x: -0.17, y: -0.24, r: -11 },
  { x: -0.06, y: -0.2, r: -4 },
  { x: 0.06, y: -0.22, r: 5 },
  { x: 0.17, y: -0.26, r: 11 },
];
const LIFTED = [
  { x: -0.48, r: -7 },
  { x: -0.16, r: -2 },
  { x: 0.16, r: 2 },
  { x: 0.48, r: 7 },
];

type FlyState = {
  row: number;
  flight: MotionValue<number>;
  scrollY: MotionValue<number>;
  stage: { current: { top: number; vh: number; hold: number; holdTop: number } };
  slotRef: RefObject<HTMLDivElement | null>;
};

const FlyContext = createContext<FlyState | null>(null);

/* One case study. In fly mode its two cards, the details and the media, are moved on their own
   by FlyPiece; this box never moves, so it is what they measure against. It only takes clicks
   once the cards have landed. */
function ArrivingRow({
  index,
  mode,
  flight,
  scrollY,
  stage,
  children,
}: {
  index: number;
  mode: Mode;
  flight: MotionValue<number>;
  scrollY: MotionValue<number>;
  stage: { current: { top: number; vh: number; hold: number; holdTop: number } };
  children: ReactNode;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const pointerEvents = useTransform(flight, (f) => (f > 0.98 ? "auto" : "none"));

  if (mode === "fly") {
    return (
      <FlyContext.Provider value={{ row: index, flight, scrollY, stage, slotRef }}>
        <motion.div ref={slotRef} className={styles.arrivalSlot} style={{ pointerEvents }}>
          {children}
        </motion.div>
      </FlyContext.Provider>
    );
  }

  return (
    <div ref={slotRef} className={styles.arrivalSlot}>
      {mode === "rise" ? (
        <motion.div
          initial={{ opacity: 0, y: 56, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </div>
  );
}

/* One card of a case study. In fly mode it waits small and tilted in the folder's pocket with
   its top showing, rises clear of the folder on its own path, then travels to its own place.
   Its place is read against the live scroll position, so it lands correctly while the page
   moves. Outside fly mode it is a plain box. */
function FlyPiece({ part, className, children }: { part: 0 | 1; className: string; children: ReactNode }) {
  const fly = useContext(FlyContext);
  if (!fly) return <div className={className}>{children}</div>;
  return (
    <FlyingPiece fly={fly} part={part} className={className}>
      {children}
    </FlyingPiece>
  );
}

function FlyingPiece({
  fly,
  part,
  className,
  children,
}: {
  fly: FlyState;
  part: 0 | 1;
  className: string;
  children: ReactNode;
}) {
  const { row, flight, scrollY, stage, slotRef } = fly;
  const ref = useRef<HTMLDivElement>(null);
  const geo = useRef({ cx: 0, cy: 0, width: 1, height: 1, vw: 1, vh: 1 });

  const tick = useMeasured(() => {
    const el = ref.current;
    const slot = slotRef.current;
    if (!el || !slot) return;
    // offsetLeft/Top ignore transforms, so the card's resting place is read correctly mid-flight
    const r = slot.getBoundingClientRect();
    geo.current = {
      cx: r.left + el.offsetLeft + el.offsetWidth / 2,
      cy: r.top + window.scrollY + el.offsetTop + el.offsetHeight / 2,
      width: el.offsetWidth,
      height: el.offsetHeight,
      vw: document.documentElement.clientWidth,
      vh: window.innerHeight,
    };
  }, true);

  const order = row * 2 + part;
  // Each card leaves a beat after the one before it
  const lag = order * 0.05;
  const tucked = TUCKED[order] ?? TUCKED[0];
  const lifted = LIFTED[order] ?? LIFTED[0];

  const pose = (sy: number, f: number) => {
    const { cx, cy, height, vw, vh } = geo.current;
    const t = clamp01((f - lag) / (1 - lag));
    const folder = folderSize(vw);
    // The folder's middle on screen: it rides up with the page until it settles in the middle
    const half = stage.current.hold / 2;
    const folderY = Math.max(stage.current.holdTop + half, stage.current.top - sy + half);
    // Card size in the folder, as a share of its height: larger on desktop, where the folder has room
    const wide = vw > 700;
    const pocket = {
      x: vw / 2 + tucked.x * folder.width,
      // On desktop the larger cards sit a little lower, deeper in the pocket
      y: folderY + (tucked.y + (wide ? 0.05 : 0)) * folder.height,
      s: (folder.height * (wide ? 0.68 : 0.58)) / height,
      r: tucked.r,
    };
    const lift = {
      x: vw / 2 + lifted.x * folder.width,
      y: folderY - folder.height * 0.7 - vh * 0.03,
      s: (folder.height * (wide ? 0.72 : 0.62)) / height,
      r: lifted.r,
    };
    const place = { x: cx, y: cy - sy, s: 1, r: 0 };

    const from = t < RISE_SHARE ? pocket : lift;
    const to = t < RISE_SHARE ? lift : place;
    const k = t < RISE_SHARE ? easeOut(t / RISE_SHARE) : easeInOut((t - RISE_SHARE) / (1 - RISE_SHARE));
    return {
      x: lerp(from.x, to.x, k) - place.x,
      y: lerp(from.y, to.y, k) - place.y,
      s: lerp(from.s, to.s, k),
      r: lerp(from.r, to.r, k),
    };
  };

  const x = useTransform([scrollY, flight, tick], ([sy, f]) => pose(sy as number, f as number).x);
  const y = useTransform([scrollY, flight, tick], ([sy, f]) => pose(sy as number, f as number).y);
  const scale = useTransform([scrollY, flight, tick], ([sy, f]) => pose(sy as number, f as number).s);
  const rotate = useTransform([scrollY, flight, tick], ([sy, f]) => pose(sy as number, f as number).r);

  return (
    <motion.div ref={ref} className={`${className} ${styles.flyCard}`} style={{ x, y, scale, rotate }}>
      {children}
    </motion.div>
  );
}

function ProjectDetails({ project }: { project: FeaturedProject }) {
  return (
    <FlyPiece part={0} className={styles.featuredDetails}>
      <span className={styles.featuredCategory}>{project.category}</span>

      <div className={styles.featuredContent}>
        <div className={styles.featuredCopy}>
          <h3 className={styles.featuredTitle}>{project.title}</h3>
          <p className={styles.featuredDescription}>{project.description}</p>
        </div>

        <div className={styles.featuredFooter}>
          <div className={styles.featuredFacts}>
            <span className={styles.featuredYear}>Year: {project.year}</span>
            {/* Phones show a short role, without the "Role:" label (its first two parts and "…"), so it
                fits beside the arrow */}
            <span aria-label={`Role: ${project.role}`}>
              <span className={styles.roleFull} aria-hidden>
                Role: {project.role}
              </span>
              <span className={styles.roleShort} aria-hidden>
                {shortRole(project.role)}
              </span>
            </span>
          </div>
          <Image className={styles.featuredArrow} src={ARROW_SRC} alt="" width={46} height={46} unoptimized />
        </div>
      </div>
    </FlyPiece>
  );
}

function FeaturedMedia({ kind }: { kind: FeaturedProject["media"] }) {
  if (kind === "garden") {
    return (
      <FlyPiece part={1} className={`${styles.featuredMedia} ${styles.featuredMediaGarden}`}>
        <div className={styles.gardenBackdrop}>
          <Image
            className={styles.gardenBackdropImage}
            src="/images/featured-work/grove-backdrop.png"
            alt=""
            fill
            sizes="(max-width: 1100px) 100vw, 760px"
          />
        </div>
        <div className={styles.gardenScreen}>
          <Image
            src="/images/featured-work/grove-garden-screen.png"
            alt="Grove garden screen with the island and its plots"
            fill
            sizes="(max-width: 1100px) 40vw, 300px"
          />
        </div>
        <div className={styles.habitWrap}>
          <div className={styles.habitPhone}>
            <Image
              src="/images/featured-work/grove-habit-progress.png"
              alt="Grove habit progress screen"
              fill
              sizes="(max-width: 1100px) 40vw, 290px"
            />
          </div>
        </div>
      </FlyPiece>
    );
  }

  return (
    <FlyPiece part={1} className={`${styles.featuredMedia} ${styles.featuredMediaMaterials}`}>
      <div className={styles.materialsFrame}>
        <Image
          className={styles.materialsImage}
          src="/images/featured-work/samples-materials.png"
          alt="A ring of coloured felt material samples"
          width={4096}
          height={2731}
          sizes="(max-width: 1100px) 90vw, 620px"
        />
      </div>
    </FlyPiece>
  );
}

/** The role's first two parts, with "…" when there are more ("Product design, iOS development…") */
function shortRole(role: string) {
  const parts = role.split(",").map((part) => part.trim());
  return parts.length > 2 ? `${parts.slice(0, 2).join(", ")}…` : role;
}

/* More work: six smaller cards, clearly secondary to the two above */
export function MoreWork() {
  const ref = useReveal<HTMLElement>(0.1);

  return (
    <section ref={ref} className={`${styles.section} ${styles.moreSection}`} aria-labelledby="more-work-heading">
      <div className={`${styles.sectionHead} fade-up`}>
        <h2 id="more-work-heading" className={styles.eyebrow}>
          More work
        </h2>
      </div>

      <ul className={`${styles.grid} ${styles.more}`}>
        {MORE_PROJECTS.map((project, index) => (
          <li key={project.id} className={`${styles.moreItem} fade-up`} style={stagger(index + 1)}>
            <Link href={project.href} className={`${styles.glass} ${styles.moreCard}`}>
              <span className={styles.moreThumb}>
                <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 700px) 45vw, 96px" />
              </span>
              <span className={styles.moreText}>
                <span className={styles.tag}>{project.tag}</span>
                <h3 className={styles.moreTitle}>{project.title}</h3>
                <p className={styles.moreCaption}>{project.caption}</p>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

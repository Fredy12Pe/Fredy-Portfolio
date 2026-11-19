"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { inter } from "@/lib/fonts";
import { useReveal } from "@/lib/reveal";
import { rangeStyle, useLandedRows, useTimelineFallback } from "./scroll-timeline";
import { FEATURED_PROJECTS, MORE_PROJECTS, type FeaturedProject } from "./home-data";
import WorkFolder from "./WorkFolder";
import styles from "./home.module.css";

/** Delay order for elements that fade up together (see .fade-up in globals.css) */
function stagger(index: number) {
  return { "--fade-i": index } as CSSProperties;
}

const ARROW_SRC = "/images/featured-work/project-link.svg";

/* Featured work's fly-out, run by the browser from the scroll position (see scroll-timeline.ts).

   The whole section (title, folder and both case studies) is pinned under the menu for --pin of
   scrolling. Over that stretch the folder opens, the four cards rise out of its pocket, and each
   travels down to its own place; then the folder fades and the section scrolls on. Everything moves
   inside the pinned section, so nothing has to keep up with the page: the cards' places never move
   while they fly. Scrolling back plays it in reverse.

   Script only measures: where each card sits and where the folder's pocket is, on load and when the
   layout changes. Those become each card's starting poses (--px, --py…), and the CSS does the rest. */

/** Each card's scroll range, as shares of the pin: each leaves a beat after the one before it */
const pieceRange = (order: number): [number, number] => [0.1 + order * 0.05, 0.72 + order * 0.05];
const FOLDER_OPEN: [number, number] = [-0.45, 0.12];
// Where each row's second card lands: the row is clickable from then on
const ROW_LANDED = FEATURED_PROJECTS.map((_, row) => pieceRange(row * 2 + 1)[1]);
// Gone while the cards are still on their way down, so it never shows behind them
const FOLDER_GONE: [number, number] = [0.36, 0.56];
const FRONT_DROP: [number, number] = [0, 0.5];

/* Poses for the four cards, in order: Grove details, Grove media, Samples details, Samples media.
   Offsets are in folder widths/heights, angles in degrees. */
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

/** An element's offset inside an ancestor, ignoring transforms (so a card is measured at its place
    even while it is posed in the folder) */
function offsetIn(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

const RowContext = createContext<number | null>(null);

/* Featured work: one case study per row, a details card beside a media panel. Rows alternate. */
export function FeaturedWork() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  useTimelineFallback(stageRef);
  useLandedRows(stageRef, ROW_LANDED);

  useEffect(() => {
    const pinned = pinnedRef.current;
    const folderBox = folderRef.current;
    if (!pinned || !folderBox) return;

    const measure = () => {
      const folder = folderBox.firstElementChild as HTMLElement | null;
      if (!folder || !folder.offsetWidth) return;
      const f = offsetIn(folder, pinned);
      const fw = folder.offsetWidth;
      const fh = folder.offsetHeight;
      const cx = f.x + fw / 2;
      const cy = f.y + fh / 2;
      const wide = window.innerWidth > 700;
      const pieces = pinned.querySelectorAll<HTMLElement>("[data-piece]");
      pieces.forEach((el) => {
        const order = Number(el.dataset.piece);
        const tucked = TUCKED[order] ?? TUCKED[0];
        const lifted = LIFTED[order] ?? LIFTED[0];
        const p = offsetIn(el, pinned);
        const ex = p.x + el.offsetWidth / 2;
        const ey = p.y + el.offsetHeight / 2;
        const h = el.offsetHeight || 1;
        const set = (name: string, value: number, unit: string) => el.style.setProperty(name, `${value.toFixed(3)}${unit}`);
        // In the pocket: small, tilted, the top showing above the front panel
        set("--px", cx + tucked.x * fw - ex, "px");
        set("--py", cy + (tucked.y + (wide ? 0.05 : 0)) * fh - ey, "px");
        set("--ps", (fh * (wide ? 0.68 : 0.58)) / h, "");
        set("--pr", tucked.r, "deg");
        // Lifted clear above the folder, fanned out
        set("--lx", cx + lifted.x * fw - ex, "px");
        set("--ly", f.y - fh * 0.2 - ey, "px");
        set("--ls", (fh * (wide ? 0.72 : 0.62)) / h, "");
        set("--lr", lifted.r, "deg");
      });
      pinned.dataset.measured = "";
    };

    measure();
    // Re-measure when the layout changes (images, fonts, a new width), never while scrolling
    const observer = new ResizeObserver(measure);
    observer.observe(pinned);
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return; // a phone's toolbar sliding doesn't move anything here
      width = window.innerWidth;
      measure();
    };
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const subtitle = `${FEATURED_PROJECTS.length} case studies`;

  return (
    <section id="work" className={`${styles.section} ${inter.className}`} aria-labelledby="work-heading">
      <div ref={stageRef} className={styles.workStage}>
        <div ref={pinnedRef} className={styles.workPinned}>
          {/* The folder's back and front in separate layers, so the cards come out from between them */}
          <div ref={folderRef} className={`${styles.folderBox} ${styles.flyOnly}`} aria-hidden>
            <div className={styles.folderFade} {...rangeStyle(FOLDER_GONE)}>
              <WorkFolder part="back" openRange={FOLDER_OPEN} />
            </div>
          </div>

          {/* Reduced motion: the whole folder above the cards */}
          <div className={styles.inlineFolder}>
            <WorkFolder subtitle={subtitle} hint={<ScrollHint />} />
          </div>

          <div className={styles.headingSlot}>
            <h2 id="work-heading" className={styles.featuredHeading}>
              Featured work
            </h2>
          </div>

          <div className={styles.featuredList}>
            {FEATURED_PROJECTS.map((project, index) => (
              <RowContext.Provider key={project.id} value={index}>
                <div className={styles.arrivalSlot}>
                  <Link
                    href={project.href}
                    data-row={index}
                    className={
                      index % 2 === 1 ? `${styles.featuredRow} ${styles.featuredRowReverse}` : styles.featuredRow
                    }
                    aria-label={`${project.title}: view case study`}
                  >
                    <ProjectDetails project={project} />
                    <FeaturedMedia kind={project.media} />
                  </Link>
                </div>
              </RowContext.Provider>
            ))}
          </div>

          <div className={`${styles.folderBox} ${styles.folderFront} ${styles.flyOnly}`} aria-hidden {...rangeStyle(FRONT_DROP)}>
            <div className={styles.folderFade} {...rangeStyle(FOLDER_GONE)}>
              <WorkFolder part="front" subtitle={subtitle} openRange={FOLDER_OPEN} hint={<ScrollHint />} />
            </div>
          </div>
        </div>
        {/* The scrolling the pinned section takes */}
        <div className={styles.pinRoom} aria-hidden />
      </div>
    </section>
  );
}

/* The arrow and "Scroll down", beside the folder; it fades with the folder */
function ScrollHint() {
  return (
    <span className={styles.scrollHint}>
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden>
        <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Scroll down</span>
    </span>
  );
}

/* One card of a case study: posed in the folder until its range, then flown to its place by the CSS */
function FlyPiece({ part, className, children }: { part: 0 | 1; className: string; children: ReactNode }) {
  const row = useContext(RowContext);
  if (row === null) return <div className={className}>{children}</div>;
  const order = row * 2 + part;
  const { style, ...rest } = rangeStyle(pieceRange(order));
  return (
    <div className={`${className} ${styles.flyCard}`} data-piece={order} style={style as CSSProperties} {...rest}>
      {children}
    </div>
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

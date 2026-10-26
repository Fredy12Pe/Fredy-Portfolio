import type { CSSProperties } from "react";
import styles from "./CaseStudyPreview.module.css";

/* A preview of a case study laid out as a FigJam-style board: sticky notes, image cards,
   dashed frames and connectors placed by hand on one fixed board. Placeholder content only. */

const BOARD_W = 1600;
const BOARD_H = 1200;

type Note = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  tone: "yellow" | "pink" | "blue" | "green";
  children: React.ReactNode;
};

function Sticky({ x, y, w, h, rot, tone, children }: Note) {
  return (
    <div
      className={`${styles.sticky} ${styles[tone]}`}
      style={
        {
          left: `calc(${x} * var(--u))`,
          top: `calc(${y} * var(--u))`,
          width: `calc(${w} * var(--u))`,
          minHeight: `calc(${h} * var(--u))`,
          "--rot": `${rot}deg`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

function Card({
  x,
  y,
  w,
  h,
  rot,
  src,
  alt,
  caption,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure
      className={styles.card}
      style={
        {
          left: `calc(${x} * var(--u))`,
          top: `calc(${y} * var(--u))`,
          width: `calc(${w} * var(--u))`,
          "--rot": `${rot}deg`,
        } as CSSProperties
      }
    >
      <img className={styles.cardImage} src={src} alt={alt} style={{ height: `calc(${h} * var(--u))` }} />
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

function Frame({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <div
      className={styles.frame}
      style={
        {
          left: `calc(${x} * var(--u))`,
          top: `calc(${y} * var(--u))`,
          width: `calc(${w} * var(--u))`,
          height: `calc(${h} * var(--u))`,
        } as CSSProperties
      }
    >
      <span className={styles.frameLabel}>{label}</span>
    </div>
  );
}

// Connector paths in board units, drawn under the blocks
const CONNECTORS = [
  "M 380 380 C 410 380, 410 430, 430 440",
  "M 1050 440 C 1080 440, 1080 360, 1100 350",
  "M 780 780 C 810 780, 810 740, 840 740",
  "M 1100 940 C 1140 940, 1200 960, 1250 980",
];

export default function CaseStudyPreviewPage() {
  return (
    <main className={styles.page}>
      <div className={styles.board} role="region" aria-label="Case study preview board">
        <svg
          className={styles.connectors}
          viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
          aria-hidden
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e1e1e" />
            </marker>
          </defs>
          {CONNECTORS.map((d) => (
            <path key={d} d={d} className={styles.connector} markerEnd="url(#arrow)" />
          ))}
        </svg>

        {/* Title, placed like a heading on a board */}
        <div className={styles.title} style={{ left: "calc(80 * var(--u))", top: "calc(70 * var(--u))" }}>
          <p className={styles.kicker}>Case study · 2026</p>
          <h1 className={styles.heading}>Project name</h1>
          <p className={styles.lede}>
            A one-line summary of the problem, the people it is for, and what changed.
          </p>
        </div>

        <Sticky x={80} y={300} w={300} h={170} rot={-2} tone="yellow">
          <strong>Overview</strong>
          <p>Role, timeline, team. Two or three short lines on scope.</p>
        </Sticky>

        <Card
          x={430}
          y={260}
          w={620}
          h={380}
          rot={1.5}
          src="/images/depth-parallax/subway.webp"
          alt="Placeholder hero image"
          caption="Hero screen"
        />

        <Sticky x={1100} y={240} w={400} h={190} rot={2} tone="pink">
          <strong>Problem</strong>
          <p>What was not working for people, and how we know it.</p>
        </Sticky>

        <Frame x={80} y={600} w={700} h={420} label="Research" />
        <Sticky x={120} y={660} w={220} h={150} rot={-3} tone="blue">
          <p>Interview insight one.</p>
        </Sticky>
        <Sticky x={380} y={680} w={220} h={150} rot={2} tone="green">
          <p>Survey finding two.</p>
        </Sticky>
        <Sticky x={200} y={850} w={260} h={150} rot={-1} tone="yellow">
          <p>Competitor gap noted in review.</p>
        </Sticky>

        <Card
          x={840}
          y={600}
          w={520}
          h={300}
          rot={-1}
          src="/images/redesign/about/photos/fredy-1.jpg"
          alt="Placeholder solution image"
          caption="Solution"
        />

        <Sticky x={1040} y={980} w={420} h={170} rot={1} tone="green">
          <strong>Outcome</strong>
          <p>The measurable result, and what we would do next.</p>
        </Sticky>
      </div>
    </main>
  );
}

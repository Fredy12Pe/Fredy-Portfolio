"use client";

import { Children, isValidElement, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import styles from "./StoryBoard.module.css";

// The light blue frame around each section, in board px. Its size is added outside each layout box.
export const SECTION_PAD = 32;
// The gap between an arrow's ends and the frame edges, so each arrowhead lands on the frame it points to
const ARROW_GAP = 6;

export type Box = { x: number; y: number; w: number };
type Side = "top" | "bottom" | "left" | "right";
export type Anchor<K extends string> = { key: K; side: Side; t?: number };
// A curved arrow from one frame to the next. bend bows the curve to one side.
export type Arrow<K extends string> = { from: Anchor<K>; to: Anchor<K>; bend: number };
// A dashed route with square corners: out of `from`, across to the vertical run at x, then into `to`
export type Branch<K extends string> = { from: Anchor<K>; to: Anchor<K>; x: number };

type Rect = { x: number; y: number; w: number; h: number };

// Marks one section of the board. StoryBoard reads `name` to place it and renders its children in the frame.
export function Frame({ children }: { name: string; children: ReactNode }) {
  return <>{children}</>;
}

function anchorPoint(r: Rect, a: Anchor<string>) {
  const t = a.t ?? 0.5;
  switch (a.side) {
    case "top":
      return { x: r.x + r.w * t, y: r.y - ARROW_GAP };
    case "bottom":
      return { x: r.x + r.w * t, y: r.y + r.h + ARROW_GAP };
    case "left":
      return { x: r.x - ARROW_GAP, y: r.y + r.h * t };
    case "right":
      return { x: r.x + r.w + ARROW_GAP, y: r.y + r.h * t };
  }
}

// A gentle curve between two anchors, bowed to one side like a hand-drawn FigJam arrow
function curvePath(a: { x: number; y: number }, b: { x: number; y: number }, bend: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = (a.x + b.x) / 2 - dy * bend;
  const cy = (a.y + b.y) / 2 + dx * bend;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

type FrameElement<K extends string> = ReactElement<{ name: K; children?: ReactNode }>;

export default function StoryBoard<K extends string>({
  width,
  height,
  layout,
  arrows,
  branch,
  className = "",
  children,
}: {
  width: number;
  height: number;
  layout: Record<K, Box>;
  arrows: Arrow<K>[];
  branch?: Branch<K>;
  className?: string;
  children: ReactNode;
}) {
  const refs = useRef<Partial<Record<K, HTMLDivElement | null>>>({});
  const [rects, setRects] = useState<Record<K, Rect> | null>(null);

  // The arrows join the frames' real edges, so measure each frame's height once laid out,
  // and again whenever one changes size (when an image or the font loads).
  // offsetHeight is in board px, unaffected by the canvas zoom, and includes the frame's padding.
  useLayoutEffect(() => {
    const measure = () => {
      const next = {} as Record<K, Rect>;
      for (const key of Object.keys(layout) as K[]) {
        const { x, y, w } = layout[key];
        next[key] = { x: x - SECTION_PAD, y: y - SECTION_PAD, w: w + SECTION_PAD * 2, h: refs.current[key]?.offsetHeight ?? 0 };
      }
      setRects(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const el of Object.values(refs.current) as (HTMLDivElement | null | undefined)[]) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [layout]);

  const frames = Children.toArray(children).filter(isValidElement) as FrameElement<K>[];

  return (
    <div className={`${styles.board} ${className}`} style={{ width, height }}>
      {rects ? (
        <svg className={styles.connectors} width={width} height={height} aria-hidden>
          <defs>
            <marker id="story-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="12" markerHeight="12" orient="auto">
              <path d="M 2 1.5 L 10 6 L 2 10.5" fill="none" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {arrows.map(({ from, to, bend }) => {
            const a = anchorPoint(rects[from.key], from);
            const b = anchorPoint(rects[to.key], to);
            return (
              <path
                key={`${from.key}-${to.key}`}
                d={curvePath(a, b, bend)}
                fill="none"
                stroke="#18181b"
                strokeWidth="3"
                strokeLinecap="round"
                markerEnd="url(#story-arrow)"
              />
            );
          })}
          {branch ? (() => {
            const a = anchorPoint(rects[branch.from.key], branch.from);
            const b = anchorPoint(rects[branch.to.key], branch.to);
            return (
              <path
                d={`M ${a.x} ${a.y} H ${branch.x} V ${b.y} H ${b.x}`}
                fill="none"
                stroke="#3f3f46"
                strokeWidth="3"
                strokeDasharray="12 10"
                markerEnd="url(#story-arrow)"
              />
            );
          })() : null}
        </svg>
      ) : null}

      {frames.map((frame) => {
        const name = frame.props.name;
        const box = layout[name];
        return (
          <div
            key={name}
            ref={(el) => {
              refs.current[name] = el;
            }}
            className={styles.section}
            data-section={name}
            style={{ left: box.x - SECTION_PAD, top: box.y - SECTION_PAD, width: box.w }}
          >
            {frame.props.children}
          </div>
        );
      })}
    </div>
  );
}

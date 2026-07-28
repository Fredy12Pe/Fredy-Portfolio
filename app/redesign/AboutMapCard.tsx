"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import styles from "./redesign.module.css";

/** Map card — 759×336 (matches .aboutMap layout) */
const VIEW = { w: 759, h: 336 } as const;
/** Bust cache after re-exporting Figma assets. */
const ASSET_V = "1";

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

/** Angular route: lower-left → upper-right destination (left of the map icon) */
const ROUTE_D =
  "M 52 286 H 166 V 232 H 322 V 190 H 390 V 148 H 472 V 112 H 540";

const DEST = { x: 540, y: 112 } as const;

/** Concentric radar ring radii (viewBox units) — ~matches reference look */
const RADAR_RINGS = [42, 72, 108] as const;

type BlockShade = 0 | 1 | 2;

/** Abstract city blocks — shade index maps to theme-aware CSS vars */
const BLOCKS: ReadonlyArray<{
  x: number;
  y: number;
  w: number;
  h: number;
  shade: BlockShade;
  rx?: number;
}> = [
  { x: 12, y: 12, w: 88, h: 52, shade: 1, rx: 10 },
  { x: 112, y: 12, w: 64, h: 52, shade: 0, rx: 10 },
  { x: 188, y: 12, w: 110, h: 40, shade: 2, rx: 12 },
  { x: 310, y: 12, w: 72, h: 52, shade: 0, rx: 10 },
  { x: 394, y: 12, w: 96, h: 36, shade: 1, rx: 10 },
  { x: 502, y: 12, w: 58, h: 52, shade: 0, rx: 10 },
  { x: 572, y: 12, w: 84, h: 40, shade: 2, rx: 12 },
  { x: 668, y: 12, w: 78, h: 52, shade: 1, rx: 10 },

  { x: 12, y: 76, w: 70, h: 48, shade: 0, rx: 10 },
  { x: 94, y: 76, w: 102, h: 36, shade: 2, rx: 12 },
  { x: 208, y: 64, w: 56, h: 60, shade: 0, rx: 10 },
  { x: 276, y: 76, w: 88, h: 48, shade: 1, rx: 10 },
  { x: 376, y: 60, w: 74, h: 48, shade: 2, rx: 10 },
  { x: 462, y: 76, w: 118, h: 40, shade: 0, rx: 12 },
  { x: 592, y: 64, w: 66, h: 52, shade: 1, rx: 10 },
  { x: 670, y: 76, w: 76, h: 48, shade: 0, rx: 10 },

  { x: 12, y: 140, w: 96, h: 44, shade: 1, rx: 10 },
  { x: 120, y: 128, w: 68, h: 56, shade: 0, rx: 10 },
  { x: 200, y: 140, w: 124, h: 40, shade: 2, rx: 12 },
  { x: 336, y: 128, w: 58, h: 56, shade: 0, rx: 10 },
  { x: 406, y: 140, w: 92, h: 44, shade: 2, rx: 10 },
  { x: 510, y: 128, w: 70, h: 56, shade: 0, rx: 10 },
  { x: 592, y: 140, w: 104, h: 36, shade: 1, rx: 12 },
  { x: 708, y: 140, w: 38, h: 56, shade: 0, rx: 8 },

  { x: 12, y: 200, w: 58, h: 52, shade: 0, rx: 10 },
  { x: 82, y: 212, w: 90, h: 40, shade: 1, rx: 12 },
  { x: 184, y: 200, w: 76, h: 52, shade: 0, rx: 10 },
  { x: 272, y: 212, w: 108, h: 36, shade: 1, rx: 12 },
  { x: 392, y: 200, w: 64, h: 52, shade: 2, rx: 10 },
  { x: 468, y: 212, w: 86, h: 40, shade: 0, rx: 10 },
  { x: 566, y: 200, w: 72, h: 52, shade: 0, rx: 10 },
  { x: 650, y: 212, w: 96, h: 40, shade: 2, rx: 12 },

  { x: 12, y: 268, w: 112, h: 48, shade: 1, rx: 10 },
  { x: 136, y: 280, w: 68, h: 36, shade: 0, rx: 10 },
  { x: 216, y: 268, w: 94, h: 48, shade: 1, rx: 10 },
  { x: 322, y: 280, w: 78, h: 36, shade: 0, rx: 12 },
  { x: 412, y: 268, w: 116, h: 48, shade: 1, rx: 10 },
  { x: 540, y: 280, w: 62, h: 36, shade: 0, rx: 10 },
  { x: 614, y: 268, w: 88, h: 48, shade: 1, rx: 10 },
  { x: 714, y: 280, w: 32, h: 36, shade: 0, rx: 8 },
];

const BLOCK_SHADE_CLASS = [
  styles.aboutMapBlockA,
  styles.aboutMapBlockB,
  styles.aboutMapBlockC,
] as const;

/** Layered street network with arterials, local roads, and T-intersections. */
const ROADS: ReadonlyArray<{
  d: string;
  width: number;
  kind: "major" | "arterial" | "local";
}> = [
  // Major east/west streets
  { d: "M 0 72 H 759", width: 11, kind: "major" },
  { d: "M 0 190 H 759", width: 14, kind: "major" },
  { d: "M 0 286 H 759", width: 9, kind: "major" },
  // Major north/south streets
  { d: "M 112 0 V 336", width: 10, kind: "major" },
  { d: "M 322 0 V 336", width: 12, kind: "major" },
  { d: "M 562 0 V 336", width: 10, kind: "major" },
  { d: "M 688 0 V 336", width: 8, kind: "major" },
  // A pair of straight LA-style diagonal arterials
  { d: "M -30 330 L 238 214 L 454 126 L 620 54", width: 13, kind: "arterial" },
  { d: "M 160 350 L 286 250 L 410 160 L 532 48 L 578 -10", width: 7, kind: "arterial" },
  // Local east/west streets with staggered blocks and intersections
  { d: "M 0 30 H 204 M 234 30 H 498 M 528 30 H 759", width: 4, kind: "local" },
  { d: "M 14 112 H 759", width: 5, kind: "local" },
  { d: "M 0 148 H 622 M 650 148 H 759", width: 4, kind: "local" },
  { d: "M 20 232 H 618 M 650 232 H 759", width: 5, kind: "local" },
  { d: "M 0 316 H 142 M 188 316 H 356 M 396 316 H 590 M 630 316 H 759", width: 4, kind: "local" },
  // Local north/south streets and visible right-angle intersections
  { d: "M 52 0 V 112 M 52 148 V 286", width: 4, kind: "local" },
  { d: "M 166 0 V 72 M 166 112 V 336", width: 5, kind: "local" },
  { d: "M 236 30 V 148 M 236 190 V 316", width: 4, kind: "local" },
  { d: "M 390 0 V 232 M 390 278 V 336", width: 5, kind: "local" },
  { d: "M 472 30 V 232 M 472 260 V 316", width: 4, kind: "local" },
  { d: "M 622 0 V 112 M 622 176 V 316", width: 5, kind: "local" },
  { d: "M 82 148 V 190 H 112 M 274 112 V 148 H 322 M 504 112 V 190 H 562", width: 4, kind: "local" },
];

const ROAD_KIND_CLASS = {
  major: styles.aboutMapRoadMajor,
  arterial: styles.aboutMapRoadArterial,
  local: styles.aboutMapRoadLocal,
} as const;

type AboutMapCardProps = {
  className?: string;
};

export default function AboutMapCard({ className }: AboutMapCardProps) {
  const reduced = useReducedMotion() ?? false;
  const routeRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);
  const glowId = useId();

  useLayoutEffect(() => {
    const path = routeRef.current;
    if (!path) return;
    setPathLen(path.getTotalLength());
  }, []);

  const routeReady = pathLen > 0;
  const animateRoute = routeReady && !reduced;

  return (
    <section
      className={`${styles.card} ${styles.aboutMap} ${className ?? ""}`}
      aria-label="Based in Los Angeles, California. 34.0522 degrees north, 118.2437 degrees west."
      data-node-id="145:576"
    >
      <div className={styles.aboutMapScene} aria-hidden>
        <svg
          className={styles.aboutMapSvg}
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id={glowId}
              x="-120%"
              y="-120%"
              width="340%"
              height="340%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            className={styles.aboutMapBg}
            width={VIEW.w}
            height={VIEW.h}
          />

          {BLOCKS.map((b, i) => (
            <rect
              key={`block-${i}`}
              className={BLOCK_SHADE_CLASS[b.shade]}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={b.rx ?? 10}
            />
          ))}

          {ROADS.map((road, i) => (
            <path
              key={`road-${i}`}
              className={ROAD_KIND_CLASS[road.kind]}
              d={road.d}
              fill="none"
              strokeWidth={road.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Concentric radar rings — breathe, then route draws */}
          {!reduced &&
            RADAR_RINGS.map((r, i) => (
              <circle
                key={`radar-${i}`}
                className={styles.aboutMapRadarRing}
                cx={DEST.x}
                cy={DEST.y}
                r={r}
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}

          <path
            ref={routeRef}
            className={`${styles.aboutMapRouteStroke}${animateRoute ? ` ${styles.aboutMapRoute}` : ""}`}
            d={ROUTE_D}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              {
                ["--route-len"]: routeReady ? pathLen : 2000,
                strokeDasharray: routeReady ? pathLen : 2000,
                strokeDashoffset: reduced ? 0 : routeReady ? pathLen : 2000,
              } as CSSProperties
            }
          />

          <circle
            className={styles.aboutMapPin}
            cx={DEST.x}
            cy={DEST.y}
            r={7}
            filter={`url(#${glowId})`}
          />
        </svg>
      </div>

      <div className={styles.aboutMapFade} aria-hidden />

      {/* Apple Maps icon — 90×90 at top-right, same 42px inset as photo/duo cards */}
      <div
        className={styles.aboutMapIcon}
        data-node-id="163:217"
        data-name="Apple Maps"
        style={{
          left: pct(VIEW.w - 90 - 42, VIEW.w),
          top: pct(42, VIEW.h),
          width: pct(90, VIEW.w),
          height: pct(90, VIEW.h),
        }}
      >
        <Image
          src={`/images/redesign/about/apple-maps.png?v=${ASSET_V}`}
          alt=""
          fill
          sizes="90px"
          unoptimized
        />
      </div>

      <div className={styles.aboutMapLabel}>
        <p className={styles.aboutMapCity}>Los Angeles</p>
        <p className={styles.aboutMapCoords}>34.0522° N, 118.2437° W</p>
      </div>
    </section>
  );
}

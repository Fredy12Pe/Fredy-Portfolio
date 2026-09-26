"use client";

// Ruixen Gradient Footer — a normal footer that sits at the bottom of the page.
// Its content reads first; the blurred rainbow is pinned to the bottom of the
// viewport and stretches up from the floor over the last stretch of scroll,
// hitting full height exactly when you reach the end of the page.
// Gradient design inspired by Dia Browser — https://www.diabrowser.com
// https://21st.dev/@ruixen.ui/components/ruixen-gradient-footer

import {
  useId,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type Stop = { offset: number; color: string };

const VBW = 1271;
const VBH = 599;

const RUIXEN_STOPS: Stop[] = [
  { offset: 0, color: "#340B05" },
  { offset: 0.1827, color: "#0358F7" },
  { offset: 0.2837, color: "#5092C7" },
  { offset: 0.4135, color: "#E1ECFE" },
  { offset: 0.5866, color: "#FFD400" },
  { offset: 0.6827, color: "#FA3D1D" },
  { offset: 0.8029, color: "#FD02F5" },
  { offset: 1, color: "#FFC0FD00" },
];

function bellHeights(n: number, peak: number, valley: number): number[] {
  const out: number[] = [];
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid;
    const eased = 1 - Math.pow(t, 1.24);
    out.push(peak * VBH * (valley + (1 - valley) * eased));
  }
  return out;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export interface RuixenGradientFooterProps {
  children?: ReactNode;
  /** Height of the glow. Also the scroll distance the reveal takes. */
  gradientHeight?: string;
  /** Resting strip before the reveal. 0 stays hidden until the last screen. */
  minReveal?: number;
  bars?: number;
  blur?: number;
  peak?: number;
  valley?: number;
  stops?: Stop[];
  className?: string;
  style?: CSSProperties;
}

export function RuixenGradientFooter({
  children,
  gradientHeight = "65vh",
  minReveal = 0.045,
  bars = 9,
  blur = 15,
  peak = 0.98,
  valley = 0.55,
  stops = RUIXEN_STOPS,
  className,
  style,
}: RuixenGradientFooterProps) {
  const uid = useId().replace(/:/g, "");
  const bandRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const doc = el.ownerDocument;
    const win = doc.defaultView ?? window;
    const reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const h = el.offsetHeight || 1;
      const left = doc.documentElement.scrollHeight - win.innerHeight - win.scrollY;
      const t = reduced ? 1 : clamp01((h - left) / h);
      el.style.transform = `scaleY(${minReveal + (1 - minReveal) * t})`;
    };

    measure();
    if (reduced) return;
    win.addEventListener("scroll", measure, { passive: true });
    win.addEventListener("resize", measure, { passive: true });
    return () => {
      win.removeEventListener("scroll", measure);
      win.removeEventListener("resize", measure);
    };
  }, [minReveal]);

  const colW = VBW / bars;

  return (
    <footer className={className} style={{ paddingBottom: gradientHeight, ...style }}>
      {children}
      <div
        ref={bandRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: gradientHeight,
          pointerEvents: "none",
          transformOrigin: "bottom",
          willChange: "transform",
        }}
      >
        <svg
          style={{ height: "100%", width: "100%", display: "block" }}
          viewBox={`0 0 ${VBW} ${VBH}`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={`grad-${uid}`}
              x1="0"
              y1={VBH}
              x2="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              {stops.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          </defs>
          <g filter={`url(#blur-${uid})`}>
            {bellHeights(bars, peak, valley).map((barH, i) => (
              <rect
                key={i}
                x={i * colW}
                y={VBH - barH}
                width={colW * 1.23}
                height={barH}
                fill={`url(#grad-${uid})`}
              />
            ))}
          </g>
        </svg>
      </div>
    </footer>
  );
}

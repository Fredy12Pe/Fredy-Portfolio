"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./HeaderNav.module.css";

export type HeaderNavItem = { label: string; href: string };

// The site's menu. The header and the menu that follows the page both use it.
export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: "Works", href: "/#work" },
  { label: "ABOUT ME", href: "/#about" },
  { label: "CONTACT", href: "/#contact" },
];

const PILL_BLUR = 6;
const PILL_CONTRAST = 18;

// Liquid nav: the highlight pill melts between items with an SVG goo filter
export default function HeaderNav({ items }: { items: HeaderNavItem[] }) {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // useId keeps the server and client markup identical
  const filterId = `goo-${useId().replace(/:/g, "")}`;
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  // Turns the pill's glide on one frame after its first position is in place. Turning it on in
  // the same render as that position would glide the pill in from the corner.
  const [ready, setReady] = useState(false);
  const displayIndex = hoverIndex ?? activeIndex;

  useEffect(() => {
    if (ready || rect.width === 0) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [ready, rect.width]);


  // Measured before the first paint, so the pill never shows at the corner and slides from there
  useLayoutEffect(() => {
    const measure = () => {
      const node = itemRefs.current[displayIndex];
      if (!node) return;
      setRect({
        left: node.offsetLeft,
        top: node.offsetTop,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [displayIndex, items.length]);

  return (
    <nav className={styles.nav} aria-label="Site" onMouseLeave={() => setHoverIndex(null)}>
      <svg className={styles.defs} aria-hidden>
        <defs>
          <filter
            id={filterId}
            x="-30%"
            y="-60%"
            width="160%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={PILL_BLUR} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${PILL_CONTRAST} -7`}
            />
          </filter>
        </defs>
      </svg>

      {/* Glass tint and blur sit on their own layer, like the header widgets */}
      <div className={styles.glass} aria-hidden />

      <div className={styles.pillLayer} style={{ filter: `url(#${filterId})` }}>
        <div
          className={styles.pill}
          data-ready={ready ? "" : undefined}
          style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        />
      </div>

      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className={styles.item}
          data-active={i === displayIndex}
          onMouseEnter={() => setHoverIndex(i)}
          onFocus={() => setHoverIndex(i)}
          onClick={() => setActiveIndex(i)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

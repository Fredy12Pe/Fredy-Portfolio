"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import FollowEyes from "./FollowEyes";
import { glideOnHome } from "./nav-glide";
import base from "./HeaderNav.module.css";
import styles from "./SiteNav.module.css";

export type SiteNavItem = { label: string; href: string; id: string };

/* The home page's sections, for the menu that follows the page and the phone menu */
export const HOME_NAV_ITEMS: SiteNavItem[] = [
  { label: "Featured work", href: "/#work", id: "work" },
  { label: "About me", href: "/#about", id: "about" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "Open to work", href: "/#open-to-work", id: "open-to-work" },
];

export const CONNECT_ITEM: SiteNavItem = {
  label: "Let’s connect",
  href: "/#contact",
  id: "contact",
};

const SPY_IDS = [...HOME_NAV_ITEMS.map((item) => item.id), CONNECT_ITEM.id];
/** A section counts as the one being read once its top passes this far down the screen */
const READ_LINE = 0.4;

/** Which section is being read (its id, or null above the first), and how far through it, 0–1 */
export function readSection() {
  const line = window.innerHeight * READ_LINE;
  let id: string | null = null;
  let progress = 0;
  for (const sectionId of SPY_IDS) {
    const el = document.getElementById(sectionId);
    if (!el) continue;
    const box = el.getBoundingClientRect();
    if (box.top <= line) {
      id = sectionId;
      progress = Math.min(
        1,
        Math.max(0, (line - box.top) / Math.max(1, box.height)),
      );
    }
  }
  return { id, progress };
}

/* The menu that follows the page down: the pill sits on the section being read (scroll spy)
   and fills left to right as you read through it; hovering moves it to the item under the pointer.
   "Let's connect" sits apart at the end, with the eyes that follow the cursor. */
export default function SiteNav() {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ready, setReady] = useState(false);

  const activeIndex = HOME_NAV_ITEMS.findIndex((item) => item.id === activeId);
  const displayIndex = hoverIndex ?? (activeIndex >= 0 ? activeIndex : null);

  // Scroll spy, read on each frame that scrolls. The fill is set directly, so reading doesn't re-render.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const { id, progress } = readSection();
      setActiveId(id);
      if (fillRef.current)
        fillRef.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (ready || rect.width === 0) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [ready, rect.width]);

  useLayoutEffect(() => {
    const measure = () => {
      const node =
        displayIndex === null ? null : itemRefs.current[displayIndex];
      if (!node) {
        setRect((r) => ({ ...r, width: 0 }));
        return;
      }
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
  }, [displayIndex]);

  // The reading fill shows only on the section being read, not while the pill follows the pointer
  const showFill = hoverIndex === null || hoverIndex === activeIndex;

  return (
    <div className={styles.wrap}>
      {/* The signature, back to the top of the page */}
      <Link
        href="/"
        className={styles.logo}
        data-site-logo
        aria-label="Fredy, back to top"
        onClick={(event) => glideOnHome(event, "/")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a small SVG mark */}
        <img src="/images/figma-header/signature.svg" alt="" />
      </Link>
      <div className={styles.middle}>
        <nav
          className={`${base.nav} ${styles.nav}`}
          aria-label="Site"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <div className={base.glass} aria-hidden />

          {/* A plain sliding pill. The gooey SVG filter the case study menu uses left traces of the
            pill's old place behind on this bar, whose blurred glass made the browser skip repaints. */}
          <div className={base.pillLayer}>
            <div
              className={base.pill}
              data-ready={ready ? "" : undefined}
              style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                opacity: rect.width ? 1 : 0,
              }}
            />
          </div>

          {/* Reading progress through the current section, laid over the pill */}
          <div
            className={styles.fillTrack}
            data-ready={ready ? "" : undefined}
            aria-hidden
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              opacity: rect.width && showFill && activeIndex >= 0 ? 1 : 0,
            }}
          >
            <span ref={fillRef} className={styles.fill} />
          </div>

          {HOME_NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`${base.item} ${styles.item}`}
              data-active={i === displayIndex}
              aria-current={item.id === activeId ? "location" : undefined}
              onMouseEnter={() => setHoverIndex(i)}
              onFocus={() => setHoverIndex(i)}
              onBlur={() => setHoverIndex(null)}
              onClick={(event) => glideOnHome(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={CONNECT_ITEM.href}
          className={styles.connect}
          aria-current={activeId === CONNECT_ITEM.id ? "location" : undefined}
          onClick={(event) => glideOnHome(event, CONNECT_ITEM.href)}
        >
          <span>{CONNECT_ITEM.label}</span>
          <FollowEyes className={styles.eyes} />
        </Link>
      </div>
    </div>
  );
}

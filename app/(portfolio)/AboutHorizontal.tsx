"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import AboutActivitiesCard from "../redesign/AboutActivitiesCard";
import AboutBioCard from "../redesign/AboutBioCard";
import AboutMapCard from "../redesign/AboutMapCard";
import AboutPhotoCard from "../redesign/AboutPhotoCard";
import AboutSkillsCard from "../redesign/AboutSkillsCard";
import DuolingoCard from "../redesign/DuolingoCard";
import { useReveal } from "@/lib/reveal";
import styles from "./AboutSection.module.css";

// The About cards laid out as one horizontal row. The section is as tall as the row's
// sideways travel plus one screen, and the viewport inside it sticks to the top of the page
// while the page scrolls through that travel. The row is moved along by the scroll position.
// Each card keeps its own design; it simply sits in a panel of its own.
//
// This uses plain sticky positioning and a scroll read, not a ScrollTrigger pin: the pin
// did not reliably hold or release with native scrolling.

// Sets a panel's size from its design width and height on the original board, and its place
// in the fade-up order (the cards rise one after another when the section comes into view)
function panelSize(width: number, height: number, index: number) {
  return { "--pw": width, "--ph": height, "--fade-i": index } as React.CSSProperties;
}

export default function AboutHorizontal() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // The cards fade up together, in order, once the row has risen to the middle of the screen
  // while scrolling down. The bottom 35% is ignored so the fade plays where it can be seen.
  const rowRef = useReveal<HTMLDivElement>(0, "0px 0px -35% 0px");

  // Reduced motion on phones and small tablets: the row is a native swipe. A finger and a trackpad already
  // move it; this lets a mouse or pen drag it too.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const small = window.matchMedia("(max-width: 860px) and (prefers-reduced-motion: reduce)");
    let down: { id: number; x: number; left: number } | null = null;

    const onDown = (e: PointerEvent) => {
      if (!small.matches || e.pointerType === "touch" || e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
      down = { id: e.pointerId, x: e.clientX, left: row.scrollLeft };
      // Snapping waits until the drag ends, then settles on the nearest card
      row.style.scrollSnapType = "none";
      row.style.userSelect = "none";
      row.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return;
      row.scrollLeft = down.left - (e.clientX - down.x);
    };
    const onUp = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return;
      down = null;
      row.style.scrollSnapType = "";
      row.style.userSelect = "";
    };

    row.addEventListener("pointerdown", onDown);
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerup", onUp);
    row.addEventListener("pointercancel", onUp);
    return () => {
      row.removeEventListener("pointerdown", onDown);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerup", onUp);
      row.removeEventListener("pointercancel", onUp);
    };
  }, [rowRef]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    // Pinned and slid with the page on every screen with motion allowed. Reduced motion keeps a native
    // swipe instead (see AboutSection.module.css).
    const wide = window.matchMedia("(prefers-reduced-motion: no-preference)");
    // How far the row slides, and how far the page scrolls while it does
    let distance = 0;
    let scrollLength = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!wide.matches) {
        track.style.transform = "";
        return;
      }
      // How far the section has been scrolled through its travel, from 0 to 1
      const top = wrap.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, -top / Math.max(1, scrollLength)));
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The screen's height with the toolbars hidden (100lvh). Unlike innerHeight it doesn't change while
    // a phone's or tablet's toolbars slide during a scroll, so the section keeps its length mid-scroll.
    const largeScreenHeight = () => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none";
      document.body.appendChild(probe);
      const height = probe.offsetHeight;
      probe.remove();
      return height || window.innerHeight;
    };

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      const phone = window.matchMedia("(max-width: 860px)").matches;
      // A hold after the slide: the last card stays on screen for a moment before the
      // section scrolls away, so it isn't cut off as the page moves on. Phones, where the frame is
      // only as tall as the row, need none.
      const hold = phone ? 0 : Math.round(largeScreenHeight());
      // On phones the row slides faster per scroll pixel, so the section is shorter
      scrollLength = distance * (phone ? 0.6 : 1);
      const sticky = wrap.firstElementChild as HTMLElement;
      // On phones the frame is held in the middle of the screen (never under the menu button), instead
      // of at the top with the rest of the screen empty below it. The CSS centres it from this height.
      sticky.style.setProperty("--frame-h", `${sticky.offsetHeight}px`);
      // The section is the scroll for the slide, plus the sticky frame, plus the hold
      wrap.style.height = wide.matches ? `${scrollLength + sticky.offsetHeight + hold}px` : "";
      update();
    };

    // A touch screen's window changes height as its toolbars slide during a scroll. Only a change of
    // width re-measures there, so the section doesn't change length under the finger.
    const coarse = window.matchMedia("(pointer: coarse)");
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (coarse.matches && window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      measure();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // The cards' height follows their content on phones, which settles after the fonts and images load
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      wrap.style.height = "";
      track.style.transform = "";
      (wrap.firstElementChild as HTMLElement | null)?.style.removeProperty("--frame-h");
    };
  }, []);

  return (
    <section ref={wrapRef} className={styles.hScroll}>
      <div className={styles.hSticky}>
        <div ref={rowRef} className={styles.hViewport}>
          <div ref={trackRef} className={styles.hTrack}>
            {/* Sizes are each card's design size on the original board, in artboard units.
                Activities and skills are estimates. */}
            <div className={`${styles.hPanel} fade-up`} style={panelSize(759, 720, 0)}>
              <AboutBioCard />
            </div>
            <div className={`${styles.hPanel} fade-up`} style={panelSize(900, 720, 1)}>
              <AboutPhotoCard />
            </div>
            <div className={`${styles.hPanel} fade-up`} style={panelSize(900, 586, 2)}>
              <DuolingoCard />
            </div>
            <div className={`${styles.hPanel} fade-up`} style={panelSize(759, 336, 3)}>
              <AboutMapCard />
            </div>
            <div className={`${styles.hPanel} fade-up`} style={panelSize(759, 502, 4)}>
              <AboutActivitiesCard />
            </div>
            <div className={`${styles.hPanel} fade-up`} style={panelSize(759, 502, 5)}>
              <AboutSkillsCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

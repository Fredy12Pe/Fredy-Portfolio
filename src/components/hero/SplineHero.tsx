"use client";
import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import Script from "next/script";

export default function SplineHero() {
  const [active, setActive] = useState(true);

  // Lock/unlock page scroll while overlay is active
  useEffect(() => {
    const lock = (on: boolean) => {
      document.documentElement.classList.toggle("body-locked", on);
      document.body.classList.toggle("body-locked", on);
    };
    lock(active);
    return () => lock(false);
  }, [active]);

  // Fade out overlay after meaningful scroll/touch/keys (avoid instant dismissal)
  useEffect(() => {
    if (!active) return;
    const INTENT_THRESHOLD = 200; // tune to taste
    const intentRef = { current: 0 } as { current: number };
    let touchY = 0;

    const maybeClose = () => {
      if (intentRef.current >= INTENT_THRESHOLD) setActive(false);
    };
    const onWheel = (e: WheelEvent) => {
      if (!active) return;
      e.preventDefault();
      intentRef.current += Math.abs(e.deltaY);
      maybeClose();
    };
    const onTouchStart = (e: TouchEvent) => { if (active) touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (!active) return;
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      intentRef.current += Math.abs(dy) * 2; // amplify touch
      maybeClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!active) return;
      const keys = ["ArrowDown", "PageDown", "Space"]; 
      if (keys.includes(e.key)) {
        e.preventDefault();
        intentRef.current += 120;
        maybeClose();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("keydown", onKeyDown as any);
    };
  }, [active]);
  return (
    <section className="relative h-0 w-full">
      <div
        className={`fixed inset-0 z-[100] h-screen w-full transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "transparent" }}
      >
        <Spline
          scene="https://prod.spline.design/yEhXdeYqw0-tnrZy/scene.splinecode"
          style={{ width: "100%", height: "100%", display: "block", background: "transparent", pointerEvents: "none" }}
        />
      </div>
    </section>
  );
}



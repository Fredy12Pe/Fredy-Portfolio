"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

const GROVE_HERO_RIV = "/projects/grove/hero/sprout_welcome_desktop.riv";

export default function GroveHeroRive() {
  const outerEl = useRef<HTMLDivElement | null>(null);
  const [containerReady, setContainerReady] = useState(false);

  const { RiveComponent, setContainerRef, rive } = useRive(
    {
      src: GROVE_HERO_RIV,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    },
    { shouldResizeCanvasToContainer: true }
  );

  const setInnerRef = useCallback(
    (node: HTMLDivElement | null) => {
      setContainerRef(node);
      setContainerReady(!!node);
    },
    [setContainerRef]
  );

  useEffect(() => {
    const el = outerEl.current;
    if (!rive || !el) return;

    const resize = () => rive.resizeDrawingSurfaceToCanvas();

    resize();

    const observer = new ResizeObserver(() => resize());
    observer.observe(el);
    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [rive, containerReady]);

  return (
    <div
      ref={outerEl}
      className="relative w-full overflow-visible"
      style={{ minHeight: "min(55vw, 480px)" }}
      aria-label="Grove sprout welcome animation"
    >
      {/*
        The canvas is sized to this div's layout dimensions (outer div size).
        CSS scale-[3.5] then zooms the rendered canvas 3.5× visually.
        transform-origin "50% 65%" keeps the zoom centred on the character's torso.
      */}
      <div
        ref={setInnerRef}
        className="absolute inset-0 origin-[50%_65%] translate-x-[-22%] translate-y-[40%] scale-[2] sm:translate-x-[-10%]"
      >
        <RiveComponent className="block h-full w-full" />
      </div>
    </div>
  );
}

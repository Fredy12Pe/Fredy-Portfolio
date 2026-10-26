"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

const GROVE_HERO_RIV = "/projects/grove/hero/sprout_welcome_desktop.riv";

export default function GroveHeroRive({ contained = false }: { contained?: boolean } = {}) {
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

  // On the board: the sprout card is CARD px (board units). The artwork is drawn larger, at a size
  // that puts the sprout's centre (SPROUT, measured on the artboard) at the middle of the card.
  // Sizing the canvas itself, rather than scaling it, keeps the drawing sharp.
  if (contained) {
    const CARD = { w: 503, h: 424 };
    const ZOOM = 1.7;
    const SPROUT = { x: 318, y: 168 };
    const w = CARD.w * ZOOM;
    const h = CARD.h * ZOOM;
    const left = CARD.w / 2 - (SPROUT.x - CARD.w / 2) * ZOOM - w / 2;
    const top = CARD.h / 2 - (SPROUT.y - CARD.h / 2) * ZOOM - h / 2;
    return (
      <div
        ref={outerEl}
        className="absolute"
        style={{ left, top, width: w, height: h }}
        aria-label="Grove sprout welcome animation"
      >
        <div ref={setInnerRef} className="absolute inset-0">
          <RiveComponent className="block h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={outerEl}
      className="relative w-full overflow-visible"
      style={{ minHeight: "min(55vw, 480px)" }}
      aria-label="Grove sprout welcome animation"
    >
      {/*
        The canvas is sized to this div's layout dimensions (outer div size).
        CSS scale-[2] then zooms the rendered canvas 2× visually.
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

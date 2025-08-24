"use client";

import * as React from "react";

type CardSpotlightProps = {
  className?: string;
  children: React.ReactNode;
  backgroundColor?: string;
};

export function CardSpotlight({ className, children, backgroundColor = "#7E56DF" }: CardSpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [spot, setSpot] = React.useState<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setSpot({ x, y, opacity: 1 });
  };

  const handleLeave = () => {
    setSpot((s) => ({ ...s, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className || ""}`}
      style={{ background: backgroundColor }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(260px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.20), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}



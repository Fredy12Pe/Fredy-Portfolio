"use client";

import * as React from "react";
import { motion } from "framer-motion";

type TiltImage = {
  src: string;
  alt: string;
};

type InteractiveTiltCardProps = {
  image?: TiltImage;
  children?: React.ReactNode;
  tiltFactor?: number;
  perspective?: number;
  borderRadius?: number;
  backgroundColor?: string;
  shadowColor?: string;
  shadowIntensity?: number;
  transitionDuration?: number;
  hoverScale?: number;
  glareEffect?: boolean;
  glareIntensity?: number;
  glareSize?: number;
  /** Keep overflow visible when this wraps a 3D card that already clips its faces. */
  clipContent?: boolean;
  /** When false, the card stays flat until the caller turns the effect on. */
  enabled?: boolean;
};

export function InteractiveTiltCard({
  image = {
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80",
    alt: "Blue flower",
  },
  children,
  tiltFactor = 15,
  perspective = 1000,
  borderRadius = 12,
  backgroundColor = "#FFFFFF",
  shadowColor = "rgba(0, 0, 0, 0.2)",
  shadowIntensity = 0.5,
  transitionDuration = 0.2,
  hoverScale = 1.05,
  glareEffect = true,
  glareIntensity = 0.5,
  glareSize = 80,
  clipContent = true,
  enabled = true,
}: InteractiveTiltCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [tiltValues, setTiltValues] = React.useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    if (enabled) return;
    setTiltValues({ x: 0, y: 0 });
  }, [enabled]);

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !cardRef.current || !isHovered || reducedMotion) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 100;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 100;
      setMousePosition({ x, y });
      const tiltX = -(y / 50) * tiltFactor;
      const tiltY = (x / 50) * tiltFactor;
      setTiltValues({ x: tiltX, y: tiltY });
    },
    [enabled, isHovered, reducedMotion, tiltFactor],
  );

  const handleMouseEnter = React.useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    setTiltValues({ x: 0, y: 0 });
  }, []);

  const glareX = mousePosition.x / 2 + 50;
  const glareY = mousePosition.y / 2 + 50;
  const active = enabled && isHovered && !reducedMotion;

  return (
    <motion.div
      ref={cardRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      animate={{ scale: active ? hoverScale : 1 }}
      transition={{ duration: transitionDuration, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: `${borderRadius}px`,
          overflow: clipContent ? "hidden" : "visible",
          backgroundColor,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: tiltValues.x,
          rotateY: tiltValues.y,
          boxShadow: active
            ? `0 25px 50px -12px rgba(0, 0, 0, ${shadowIntensity})`
            : `0 10px 30px -10px ${shadowColor}`,
        }}
        transition={{ duration: transitionDuration, ease: "easeOut" }}
      >
        {children ?? (
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "relative",
              zIndex: 1,
            }}
          />
        )}
        {glareEffect && active && (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: `${borderRadius}px`,
              zIndex: 2,
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareIntensity}) 0%, rgba(255, 255, 255, 0) ${glareSize}%)`,
              pointerEvents: "none",
            }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: transitionDuration }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

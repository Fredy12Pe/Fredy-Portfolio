"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { IconDotsVertical } from "@tabler/icons-react";
import { SparklesCore } from "./sparkles";

export interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  showHint?: boolean;
  hintText?: string;
}
export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  showHint = true,
  hintText = "Drag to compare",
  autoplay = false,
  autoplayDuration = 1600,
}: CompareProps) => {
  const sliderPercentRef = useRef(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const autoRafRef = useRef<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const handleStart = useCallback(() => {
    if (slideMode === "drag") setIsDragging(true);
    setHasInteracted(true);
    setHintVisible(false);
  }, [slideMode]);
  const handleEnd = useCallback(() => setIsDragging(false), []);
  const applyStyles = useCallback((p: number) => {
    const clamped = Math.max(0, Math.min(100, p));
    sliderPercentRef.current = clamped;
    if (overlayRef.current) {
      const inset = `inset(0 ${100 - clamped}% 0 0)`;
      overlayRef.current.style.clipPath = inset;
      // @ts-expect-error vendor property
      overlayRef.current.style.WebkitClipPath = inset;
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${clamped}%`;
    }
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => applyStyles(percent));
      }
    },
    [slideMode, isDragging, applyStyles]
  );

  useEffect(() => {
    applyStyles(initialSliderPercentage);
    const hide = setTimeout(() => setHintVisible(false), 2500);
    // gentle auto-oscillation demo
    if (autoplay && !hasInteracted) {
      const start = performance.now();
      const from = Math.max(10, initialSliderPercentage - 20);
      const to = Math.min(90, initialSliderPercentage + 20);
      const duration = autoplayDuration;
      const total = duration * 2; // two cycles
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / total);
        const wave = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);
        const p = from + (to - from) * wave;
        applyStyles(p);
        if (t < 1 && !hasInteracted) {
          autoRafRef.current = requestAnimationFrame(tick);
        }
      };
      autoRafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (autoRafRef.current) cancelAnimationFrame(autoRafRef.current);
      clearTimeout(hide);
    };
  }, [applyStyles, initialSliderPercentage, autoplay, autoplayDuration, hasInteracted]);

  return (
    <div
      ref={sliderRef}
      className={cn("overflow-hidden rounded-2xl", className)}
      style={{ position: "relative", cursor: slideMode === "drag" ? "grab" : "col-resize" }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseDown={() => handleStart()}
      onMouseUp={() => handleEnd()}
      onTouchStart={() => handleStart()}
      onTouchEnd={() => handleEnd()}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <AnimatePresence initial={false}>
        <div
          ref={handleRef}
          className="absolute top-0 h-full w-[3px] bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.15)] backdrop-blur-sm"
          style={{ left: `${initialSliderPercentage}%`, zIndex: 40 }}
        >
          {showHint && hintVisible ? (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 select-none">
              <div className="flex items-center gap-2 rounded-full bg-black/75 px-3 py-1.5 text-xs text-white backdrop-blur-md shadow-lg">
                <span className="i-heroicons-arrows-right-left h-3 w-3" />
                {hintText}
              </div>
            </div>
          ) : null}
          {showHandlebar && (
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-30 h-8 w-8 rounded-full bg-black text-white grid place-items-center shadow-lg ring-1 ring-white/30">
              <IconDotsVertical className="h-5 w-5" />
            </div>
          )}
        </div>
      </AnimatePresence>

      <div className="relative w-full h-full overflow-hidden pointer-events-none">
        {secondImage ? (
          <img
            className={cn("absolute inset-0 z-0 rounded-2xl w-full h-full select-none object-cover", secondImageClassname)}
            alt="second image"
            src={secondImage}
            draggable={false}
          />
        ) : null}
        {firstImage ? (
          <div
            ref={overlayRef}
            className={cn("absolute inset-0 z-10 rounded-2xl shrink-0 w-full h-full select-none overflow-hidden", firstImageClassName)}
            style={{
              clipPath: `inset(0 ${100 - initialSliderPercentage}% 0 0)`,
              WebkitClipPath: `inset(0 ${100 - initialSliderPercentage}% 0 0)`,
            }}
          >
            <img
              alt="first image"
              src={firstImage}
              className={cn("absolute inset-0 z-10 rounded-2xl w-full h-full select-none object-cover", firstImageClassName)}
              draggable={false}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};



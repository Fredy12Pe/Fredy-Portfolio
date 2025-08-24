"use client";
import React, { useState, useRef, useCallback } from "react";
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
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback(() => {
    if (slideMode === "drag") setIsDragging(true);
  }, [slideMode]);
  const handleEnd = useCallback(() => setIsDragging(false), []);
  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => setSliderXPercent(Math.max(0, Math.min(100, percent))));
      }
    },
    [slideMode, isDragging]
  );

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
        <motion.div
          className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent"
          style={{ left: `${sliderXPercent}%`, zIndex: 40 }}
          transition={{ duration: 0 }}
        >
          <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
            <SparklesCore background="transparent" minSize={0.4} maxSize={1} particleDensity={1200} className="w-full h-full" particleColor="#FFFFFF" />
          </div>
          {showHandlebar && (
            <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
              <IconDotsVertical className="h-4 w-4 text-black" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
        {firstImage ? (
          <motion.div
            className={cn("absolute inset-0 z-20 rounded-2xl shrink-0 w-full h-full select-none overflow-hidden", firstImageClassName)}
            style={{ clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)` }}
            transition={{ duration: 0 }}
          >
            <img alt="first image" src={firstImage} className={cn("absolute inset-0 z-20 rounded-2xl w-full h-full select-none object-cover", firstImageClassName)} draggable={false} />
          </motion.div>
        ) : null}
      </div>

      {secondImage ? (
        <motion.img className={cn("absolute top-0 left-0 z-[19] rounded-2xl w-full h-full select-none object-cover", secondImageClassname)} alt="second image" src={secondImage} draggable={false} />
      ) : null}
    </div>
  );
};



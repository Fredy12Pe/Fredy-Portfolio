"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number;
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number;
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#000000"
   */
  shineColor?: string | string[];
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 size-full rounded-[inherit]", className)}
      style={style}
      {...props}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] will-change-transform motion-safe:animate-spin"
        style={{
          padding: borderWidth,
          background: `conic-gradient(${Array.isArray(shineColor) ? shineColor.join(",") : shineColor})`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  );
}

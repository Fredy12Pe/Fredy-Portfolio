"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { observeVisibility } from "@/lib/visibility";

const flairImages = [
  "https://cdn.21st.dev/assets/mirror/7f/7fa03f07d6ecc851e6f9ecfc2fa3d401ee781e1c3ac345d57697b9792a349b32.png",
  "https://cdn.21st.dev/assets/mirror/eb/eb232a2025c87072e321d8b18a63130ebd6c2cf17360721a13152411548b8064.png",
  "https://cdn.21st.dev/assets/mirror/b8/b8d012bb9179f6ddf83cfb8e9f0d536bda7444a4838c5e691427c5f1a9e78d0e.png",
  "https://cdn.21st.dev/assets/mirror/61/6182e640b5507304132cfa3b61cc62ec45f0b0a85a883ad80a5ff5a397748a5a.png",
  "https://cdn.21st.dev/assets/mirror/b6/b636532c14ec5ec65e1bcb697a4d374f688783477a605ced41bca4606c38b9b0.png",
  "https://cdn.21st.dev/assets/mirror/7f/7f7a80245c0e9bbb97db3b452322f89b7666e27cf41eae1cf235a4c186637d5b.png",
  "https://cdn.21st.dev/assets/mirror/b2/b2d22aafe57a2ab515ef4f48cbc934db635b091d726ad3a946b3d0853bfd249e.png",
  "https://cdn.21st.dev/assets/mirror/bc/bc221d73136c58033b7c56f88f0de1874969299d8132b636e93279a9d1f5f0c3.png",
  "https://cdn.21st.dev/assets/mirror/ee/ee76d11e20654a6f2b0ab123614c71fbf74d82d5c2ac9563de88bcfcf195ee75.png",
  "https://cdn.21st.dev/assets/mirror/7f/7fa03f07d6ecc851e6f9ecfc2fa3d401ee781e1c3ac345d57697b9792a349b32.png",
  "https://cdn.21st.dev/assets/mirror/eb/eb232a2025c87072e321d8b18a63130ebd6c2cf17360721a13152411548b8064.png",
  "https://cdn.21st.dev/assets/mirror/b8/b8d012bb9179f6ddf83cfb8e9f0d536bda7444a4838c5e691427c5f1a9e78d0e.png",
  "https://cdn.21st.dev/assets/mirror/61/6182e640b5507304132cfa3b61cc62ec45f0b0a85a883ad80a5ff5a397748a5a.png",
  "https://cdn.21st.dev/assets/mirror/b6/b636532c14ec5ec65e1bcb697a4d374f688783477a605ced41bca4606c38b9b0.png",
  "https://cdn.21st.dev/assets/mirror/7f/7f7a80245c0e9bbb97db3b452322f89b7666e27cf41eae1cf235a4c186637d5b.png",
  "https://cdn.21st.dev/assets/mirror/b2/b2d22aafe57a2ab515ef4f48cbc934db635b091d726ad3a946b3d0853bfd249e.png",
  "https://cdn.21st.dev/assets/mirror/bc/bc221d73136c58033b7c56f88f0de1874969299d8132b636e93279a9d1f5f0c3.png",
  "https://cdn.21st.dev/assets/mirror/ee/ee76d11e20654a6f2b0ab123614c71fbf74d82d5c2ac9563de88bcfcf195ee75.png",
];

export interface CursorTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: string[];
  distance?: number;
  duration?: number;
  imageSize?: number;
}

export function CursorTrail({
  className,
  images = flairImages,
  distance = 80,
  duration = 1000,
  imageSize = 64,
  ...props
}: CursorTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const imgElements = Array.from(
      containerRef.current.querySelectorAll(".flair-image"),
    ) as HTMLElement[];
    let currentIndex = 0;

    let lastX = 0;
    let lastY = 0;
    let isInitial = true;

    const spawnImage = (x: number, y: number) => {
      const img = imgElements[currentIndex];
      if (!img) return;
      currentIndex = (currentIndex + 1) % imgElements.length;

      // Adjust to center the image on the cursor
      const targetX = x - imageSize / 2;
      const targetY = y - imageSize / 2;

      // Ensure any previous animation is cancelled safely
      if (typeof img.getAnimations === "function") {
        img.getAnimations().forEach((anim) => anim.cancel());
      }

      const randomRotation = Math.random() * 40 - 20;

      img.animate(
        [
          {
            opacity: 0,
            transform: `translate(${targetX}px, ${targetY}px) scale(0.2) rotate(0deg)`,
          },
          {
            opacity: 1,
            transform: `translate(${targetX}px, ${targetY}px) scale(1) rotate(${randomRotation / 2}deg)`,
            offset: 0.15,
          },
          {
            opacity: 0,
            transform: `translate(${targetX}px, ${targetY + 80}px) scale(0.8) rotate(${randomRotation}deg)`,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards",
        },
      );
    };

    // The container's box only moves when the page is resized or scrolled, so it is
    // measured then rather than on every mouse move. Measuring per move made every
    // movement anywhere on the page wait for layout, trail visible or not.
    let rect: DOMRect | null = containerRef.current?.getBoundingClientRect() ?? null;
    const measure = () => {
      rect = containerRef.current?.getBoundingClientRect() ?? null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!rect) return;
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const inside =
        currentX >= 0 &&
        currentY >= 0 &&
        currentX <= rect.width &&
        currentY <= rect.height;

      if (!inside) {
        isInitial = true;
        return;
      }

      if (isInitial) {
        lastX = currentX;
        lastY = currentY;
        isInitial = false;
        return;
      }

      const dist = Math.hypot(currentX - lastX, currentY - lastY);

      if (dist > distance) {
        const count = Math.floor(dist / distance);
        for (let i = 1; i <= count; i++) {
          const t = (i * distance) / dist;
          const x = lastX + (currentX - lastX) * t;
          const y = lastY + (currentY - lastY) * t;
          spawnImage(x, y);
        }

        // Update lastX and lastY to the last spawned point
        const totalT = (count * distance) / dist;
        lastX = lastX + (currentX - lastX) * totalT;
        lastY = lastY + (currentY - lastY) * totalT;
      }
    };

    // The listener is only attached while the trail's own section is near the screen.
    // It used to run for the whole page, so moving the mouse over the header paid for
    // a trail four screens further down.
    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        measure();
        window.addEventListener("mousemove", handleMouseMove);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };

    const host = containerRef.current;
    const stopObserving = host
      ? observeVisibility(host, listen, { rootMargin: "100px 0px" })
      : undefined;

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      stopObserving?.();
      listen(false);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [distance, duration, imageSize]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 overflow-hidden",
        className,
      )}
      {...props}
    >
      <div ref={containerRef} className="absolute inset-0">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            className="flair-image absolute left-0 top-0 object-cover pointer-events-none origin-center"
            style={{
              width: imageSize,
              height: imageSize,
              transform: "translate(-100%, -100%)",
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export default CursorTrail;

"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import type { CarouselProject } from "./carousel-projects";
import styles from "./ProjectsCarousel.module.css";

/** Design-px → percent of the old card, so layers scale with the carousel card. */
function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type Pose = gsap.TweenVars;

function Layer({
  name,
  box,
  rest,
  hover,
  delay = 0,
  origin = "50% 50%",
  className,
  children,
}: {
  name: string;
  box: CSSProperties;
  rest: Pose;
  hover: Pose;
  delay?: number;
  origin?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-layer={name}
      data-rest={JSON.stringify(rest)}
      data-hover={JSON.stringify(hover)}
      data-delay={delay}
      className={className ? `${styles.layer} ${className}` : styles.layer}
      style={{ ...box, transformOrigin: origin }}
    >
      {children}
    </div>
  );
}

const XY0: Pose = { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, autoAlpha: 1 };

/** Play the redesign hover poses. Layers live under the card face. */
export function playCardLayers(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("[data-layer]").forEach((el) => {
    if (!el.dataset.hover) return;
    el.dataset.posed = "hover";
    const pose = JSON.parse(el.dataset.hover) as Pose;
    const fade = "autoAlpha" in pose || "opacity" in pose;
    gsap.to(el, {
      ...pose,
      duration: fade ? 0.35 : 0.45,
      delay: Number(el.dataset.delay || 0),
      ease: fade ? "power2.out" : "back.out(1.4)",
      overwrite: "auto",
    });
  });
}

/** Return layers to the clipped rest pose. */
export function restCardLayers(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("[data-layer]").forEach((el) => {
    if (!el.dataset.rest || el.dataset.posed === "rest") return;
    el.dataset.posed = "rest";
    gsap.to(el, {
      ...(JSON.parse(el.dataset.rest) as Pose),
      duration: 0.28,
      delay: 0,
      ease: "power2.out",
      overwrite: "auto",
    });
  });
}

function useRestPose() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-layer]").forEach((el) => {
      if (!el.dataset.rest) return;
      gsap.set(el, JSON.parse(el.dataset.rest) as Pose);
      el.dataset.posed = "rest";
    });
    return () => {
      root.querySelectorAll("[data-layer]").forEach((el) => gsap.killTweensOf(el));
    };
  }, []);

  return ref;
}

function Img({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="40vw"
      className={styles.layerImg}
      unoptimized
    />
  );
}

export default function CarouselCardArt({ project }: { project: CarouselProject }) {
  const ref = useRestPose();

  return (
    <div ref={ref} className={styles.layer} style={{ inset: 0 }} aria-hidden>
      {project.id === "grove" ? <Grove /> : null}
      {project.id === "sea-sky" ? <SeaSky /> : null}
      {project.id === "ziplearn" ? <Ziplearn /> : null}
      {project.id === "selah" ? <Selah /> : null}
      {project.id === "tidehaus" ? <Tidehaus /> : null}
      {project.id === "samples" ? <Samples /> : null}
    </div>
  );
}

function Grove() {
  const card = { w: 546, h: 478 };
  const phone = { w: 366.48, h: 550.97 };
  return (
    <>
      <Layer
        name="widgets"
        delay={0.03}
        box={{
          left: pct(-70, card.w),
          top: pct(155, card.h),
          width: pct(155, card.w),
          height: pct(201, card.h),
          zIndex: 3,
        }}
        rest={XY0}
        hover={{ xPercent: (112 / 155) * 100, yPercent: (-11 / 201) * 100 }}
      >
        <Img src="/images/redesign/grove/widgets.png?v=7" />
      </Layer>
      <Layer
        name="plant2"
        box={{
          left: pct(-16, card.w),
          top: pct(409, card.h),
          width: pct(46, card.w),
          height: pct(93, card.h),
          zIndex: 2,
        }}
        rest={XY0}
        hover={{ xPercent: (7 / 46) * 100, yPercent: (-19 / 93) * 100 }}
      >
        <Img src="/images/redesign/grove/plant-2.png?v=7" />
      </Layer>
      <Layer
        name="plant1"
        box={{
          left: pct(-23.68, card.w),
          top: pct(68, card.h),
          width: pct(51.61, card.w),
          height: pct(71.59, card.h),
          zIndex: 2,
        }}
        rest={XY0}
        hover={{ xPercent: (27.682 / 51.61) * 100, yPercent: (1 / 71.59) * 100 }}
      >
        <Img src="/images/redesign/grove/plant-1.png?v=7" />
      </Layer>
      <Layer
        name="phone"
        box={{
          left: pct(247.8, card.w),
          top: pct(130, card.h),
          width: pct(phone.w, card.w),
          height: pct(phone.h, card.h),
          zIndex: 4,
        }}
        rest={XY0}
        hover={{
          xPercent: (-12.804 / phone.w) * 100,
          yPercent: (-35 / phone.h) * 100,
        }}
      >
        <Img src="/images/redesign/grove/phone.png?v=7" />
        <Layer
          name="progress"
          box={{
            left: pct(48.32, phone.w),
            top: pct(113.73, phone.h),
            width: pct(223.53, phone.w),
            height: pct(149.32, phone.h),
          }}
          rest={{ scale: 1 }}
          hover={{ scale: 1.3 }}
        >
          <div className={styles.progressInner}>
            <Img src="/images/redesign/grove/progress-card.png?v=7" />
          </div>
        </Layer>
      </Layer>
    </>
  );
}

function SeaSky() {
  const frame = { w: 180, h: 209.41 };
  const chip = { w: 172, h: 48 };
  return (
    <div
      className={styles.chips}
      style={{
        left: pct(42, 547),
        top: pct(231, 600),
        width: pct(frame.w, 547),
        height: pct(frame.h, 600),
        zIndex: 5,
      }}
    >
      <Layer
        name="resources"
        className={`${styles.chip} ${styles.chipMuted}`}
        box={{
          left: 0,
          top: pct(48, frame.h),
          width: pct(chip.w, frame.w),
          height: pct(chip.h, frame.h),
          zIndex: 1,
        }}
        rest={XY0}
        hover={{ rotation: 12, yPercent: (48 / chip.h) * 100 }}
      >
        <img src="/images/redesign/sea-sky/icon-resources.svg?v=4" alt="" />
        <span>Resources</span>
      </Layer>
      <Layer
        name="news"
        className={`${styles.chip} ${styles.chipMid}`}
        box={{
          left: 0,
          top: pct(48, frame.h),
          width: pct(chip.w, frame.w),
          height: pct(chip.h, frame.h),
          zIndex: 2,
        }}
        rest={XY0}
        hover={{
          rotation: -12,
          xPercent: (-10.086 / chip.w) * 100,
          yPercent: (-47.452 / chip.h) * 100,
        }}
      >
        <img src="/images/redesign/sea-sky/icon-news.svg?v=4" alt="" />
        <span>News</span>
      </Layer>
      <div
        className={styles.chip}
        style={{
          left: 0,
          top: pct(48, frame.h),
          width: pct(chip.w, frame.w),
          height: pct(chip.h, frame.h),
          zIndex: 3,
        }}
      >
        <img src="/images/redesign/sea-sky/icon-community.svg?v=4" alt="" />
        <span>Online Community</span>
      </div>
    </div>
  );
}

function Ziplearn() {
  const frame = { w: 217, h: 156 };
  const chip = { w: 159, h: 48 };
  return (
    <div
      className={styles.chips}
      style={{
        left: "4%",
        top: "34%",
        width: "62%",
        height: "46%",
        zIndex: 5,
      }}
    >
      <Layer
        name="access"
        className={styles.chip}
        box={{
          left: 0,
          top: 0,
          width: pct(chip.w, frame.w),
          height: pct(chip.h, frame.h),
          zIndex: 3,
        }}
        rest={XY0}
        hover={{ xPercent: (58 / chip.w) * 100 }}
      >
        <img src="/images/redesign/ziplearn/icon-world.svg?v=1" alt="" />
        <span>Access Anywhere</span>
      </Layer>
      <Layer
        name="online"
        delay={0.07}
        className={styles.chip}
        box={{
          left: pct(-24, frame.w),
          top: pct(54, frame.h),
          width: pct(chip.w, frame.w),
          height: pct(chip.h, frame.h),
          zIndex: 2,
        }}
        rest={XY0}
        hover={{ xPercent: (82 / chip.w) * 100 }}
      >
        <img src="/images/redesign/ziplearn/icon-community.svg?v=1" alt="" />
        <span>Online Tutoring</span>
      </Layer>
      <Layer
        name="schedule"
        delay={0.14}
        className={styles.chip}
        box={{
          left: pct(-54, frame.w),
          top: pct(108, frame.h),
          width: pct(chip.w, frame.w),
          height: pct(chip.h, frame.h),
          zIndex: 1,
        }}
        rest={XY0}
        hover={{ xPercent: (112 / chip.w) * 100 }}
      >
        <img src="/images/redesign/ziplearn/icon-calendar.svg?v=1" alt="" />
        <span>Your Own Schedule</span>
      </Layer>
    </div>
  );
}

function Selah() {
  return (
    <>
      <Layer
        name="cross"
        delay={0.18}
        box={{
          left: "8%",
          top: "62%",
          width: "14%",
          height: "16%",
          zIndex: 5,
        }}
        rest={{ autoAlpha: 0 }}
        hover={{ autoAlpha: 1 }}
      >
        <Img src="/images/redesign/selah/cross.svg?v=1" />
      </Layer>
      <Layer
        name="phone2"
        origin="0% 0%"
        box={{
          left: "58%",
          top: "36%",
          width: "48%",
          height: "72%",
          zIndex: 3,
        }}
        rest={{ xPercent: 36, yPercent: 6 }}
        hover={{ xPercent: -6, yPercent: 0 }}
      >
        <div className={styles.layer} style={{ inset: 0, transform: "rotate(-24deg)", transformOrigin: "0% 0%" }}>
          <Img src="/images/redesign/selah/phone-2.png?v=1" />
        </div>
      </Layer>
    </>
  );
}

function Tidehaus() {
  const surf = { w: 390.02, h: 390.02 };
  const snorkel = { w: 102.51, h: 102.51 };
  return (
    <>
      <Layer
        name="surfboard"
        delay={0.08}
        box={{
          left: pct(314.71, 546),
          top: pct(337.89, 437),
          width: pct(surf.w, 546),
          height: pct(surf.h, 437),
          zIndex: 3,
        }}
        rest={XY0}
        hover={{ yPercent: (-196 / surf.h) * 100 }}
      >
        <Img src="/images/redesign/tidehaus/surfboard.png?v=1" />
      </Layer>
      <Layer
        name="snorkel"
        origin="0% 0%"
        box={{
          left: pct(18.24, 546),
          top: pct(227.19, 437),
          width: pct(snorkel.w, 546),
          height: pct(snorkel.h, 437),
          zIndex: 4,
        }}
        rest={{ rotation: -157.93, xPercent: 0, yPercent: 0 }}
        hover={{
          rotation: -171.019,
          xPercent: (73 / snorkel.w) * 100,
          yPercent: (21 / snorkel.h) * 100,
        }}
      >
        <Img src="/images/redesign/tidehaus/snorkel.png?v=1" />
      </Layer>
    </>
  );
}

function Samples() {
  const badge = { w: 60, h: 60 };
  const box = (left: number, top: number): CSSProperties => ({
    left: pct(left, 546),
    top: pct(top, 478),
    width: pct(badge.w, 546),
    height: pct(badge.h, 478),
    zIndex: 5,
  });
  return (
    <>
      <Layer
        name="shopify"
        origin="0% 0%"
        delay={0.08}
        className={styles.badge}
        box={box(483, 329.65)}
        rest={{ rotation: -17.111, xPercent: 0, yPercent: 0 }}
        hover={{
          rotation: -6.225,
          xPercent: (-117 / badge.w) * 100,
          yPercent: (-45 / badge.h) * 100,
        }}
      >
        <img src="/images/redesign/samples/icon-shopify.png?v=1" alt="" />
      </Layer>
      <Layer
        name="figma"
        origin="0% 0%"
        delay={0.04}
        className={styles.badge}
        box={box(-7.39, 104)}
        rest={{ rotation: 21.115, xPercent: 0, yPercent: 0 }}
        hover={{
          rotation: -7.636,
          xPercent: (64 / badge.w) * 100,
          yPercent: (77 / badge.h) * 100,
        }}
      >
        <img src="/images/redesign/samples/icon-figma.png?v=1" alt="" />
      </Layer>
      <Layer
        name="photoshop"
        origin="0% 0%"
        className={styles.badge}
        box={box(500, 96.94)}
        rest={{ rotation: -16.404, xPercent: 0, yPercent: 0 }}
        hover={{
          rotation: 17.095,
          xPercent: (-146 / badge.w) * 100,
          yPercent: (48 / badge.h) * 100,
        }}
      >
        <img src="/images/redesign/samples/icon-photoshop.png?v=1" alt="" />
      </Layer>
    </>
  );
}

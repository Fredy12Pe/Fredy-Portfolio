"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { MoodId } from "../moods";

/**
 * Each mood is its own chunk so a single screen can be loaded and screenshotted
 * in isolation by scripts/shoot-screens.mjs.
 */
const SCENES: Record<MoodId, ComponentType<{ reduced?: boolean }>> = {
  "freaking-out": dynamic(() => import("./freaking-out"), { ssr: false }),
  sad: dynamic(() => import("./sad"), { ssr: false }),
  anxious: dynamic(() => import("./anxious"), { ssr: false }),
  tired: dynamic(() => import("./tired"), { ssr: false }),
  meh: dynamic(() => import("./meh"), { ssr: false }),
  content: dynamic(() => import("./content"), { ssr: false }),
  happy: dynamic(() => import("./happy"), { ssr: false }),
  excited: dynamic(() => import("./excited"), { ssr: false }),
  overjoyed: dynamic(() => import("./overjoyed"), { ssr: false }),
  angry: dynamic(() => import("./angry"), { ssr: false }),
};

export default function MoodArt({ mood, reduced }: { mood: MoodId; reduced?: boolean }) {
  const Scene = SCENES[mood];
  return <Scene reduced={reduced} />;
}

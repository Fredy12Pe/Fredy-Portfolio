"use client";

import type { ComponentType } from "react";
import type { MoodId } from "../moods";
import Angry from "./angry";
import Anxious from "./anxious";
import Content from "./content";
import Excited from "./excited";
import FreakingOut from "./freaking-out";
import Happy from "./happy";
import Meh from "./meh";
import Overjoyed from "./overjoyed";
import Sad from "./sad";
import Tired from "./tired";

/**
 * All moods ship in one chunk so dragging the slider only swaps colors /
 * mounts already-loaded scenes — no per-tick dynamic imports.
 */
const SCENES: Record<MoodId, ComponentType<{ reduced?: boolean }>> = {
  "freaking-out": FreakingOut,
  sad: Sad,
  anxious: Anxious,
  tired: Tired,
  meh: Meh,
  content: Content,
  happy: Happy,
  excited: Excited,
  overjoyed: Overjoyed,
  angry: Angry,
};

export default function MoodArt({ mood, reduced }: { mood: MoodId; reduced?: boolean }) {
  const Scene = SCENES[mood];
  return <Scene reduced={reduced} />;
}

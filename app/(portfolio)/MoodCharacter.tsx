"use client";

import * as React from "react";
import MoodArt from "../projects/mood-tracker/scenes";
import { CharacterOnlyContext } from "../projects/mood-tracker/primitives";
import type { MoodId } from "../projects/mood-tracker/moods";
import { MOOD_CHARACTER_BOX } from "./moodCharacterBoxes";

// The mood scenes are drawn on the Checkin phone frame, 440 x 956
const STAGE_WIDTH = 440;
const STAGE_HEIGHT = 956;
// The Figma frames for the ticket's mood panel: 323 wide, the stage scaled to 47.72% and centred
const FIGMA_FRAME_WIDTH = 323;
const FIGMA_STAGE_SCALE = 209.95 / 440;
const FIGMA_STAGE_LEFT = (323 - 209.95) / 2;
/* Moods whose character the Figma frames drew smaller than the rest: the stage's scale and its left
   and top, in frame units, matched to that character (Excited's sparks scale with it) */
const FIGMA_STAGE_OVERRIDE: Partial<Record<MoodId, { scale: number; left: number; top: number }>> = {
  happy: { scale: 173.035 / 475.11, left: 81.32, top: 33.74 },
  excited: { scale: 162.005 / 417, left: 75.0, top: 12.98 },
};
// Keep a little air at the sides of wide characters
const FIT_MARGIN = 0.94;

/**
 * One mood's character at the phone frame's proportions. It is scaled to the
 * box's width (shrunk only when a character is wider than the frame), centred
 * horizontally, and its top is aligned to the box. Anything below the box is
 * cropped, so the bottom of each character is cut off.
 */
export default function MoodCharacter({
  mood,
  scene = false,
}: {
  mood: MoodId;
  /** Show the whole scene around the character (sky, weather, light) at the stage's own scale */
  scene?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const art = MOOD_CHARACTER_BOX[mood];
  const fit = art.fit ?? "fit";
  const scale =
    size.width <= 0
      ? 0
      : fit === "fill"
        ? size.width / art.width
        : fit === "stage"
          ? size.width / STAGE_WIDTH
          : Math.min(size.width / STAGE_WIDTH, (size.width * FIT_MARGIN) / art.width);
  const sized = scale * (art.zoom ?? 1);
  const centerX = art.left + art.width / 2;
  const drop = art.drop ?? 0;

  /* Scene, as laid out in the "How do you feel today?" Figma frames (Mood-Tracker, 172:207): the
     440 x 956 stage is scaled to 47.72% of the 323 x 259 frame's units, centred (56.53 from the left)
     and top-aligned. Here the frame is the box, so everything scales with the box's width. */
  const frameUnit = size.width / FIGMA_FRAME_WIDTH;
  const override = FIGMA_STAGE_OVERRIDE[mood];
  const sceneScale = (override?.scale ?? FIGMA_STAGE_SCALE) * frameUnit;
  const sceneLeft = (override?.left ?? FIGMA_STAGE_LEFT) * frameUnit;
  const sceneOffset = (override?.top ?? 0) * frameUnit;
  const sceneMask = undefined;

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {scale > 0 && scene ? (
        <div style={{ position: "absolute", inset: 0, maskImage: sceneMask, WebkitMaskImage: sceneMask }}>
          <div
            style={{
              position: "absolute",
              left: sceneLeft,
              top: sceneOffset,
              width: STAGE_WIDTH,
              height: STAGE_HEIGHT,
              transform: `scale(${sceneScale})`,
              transformOrigin: "0 0",
            }}
          >
            <MoodArt mood={mood} />
          </div>
        </div>
      ) : scale > 0 ? (
        <div
          style={{
            position: "absolute",
            left: size.width / 2 - centerX * sized,
            top: (drop - art.top) * sized,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            transform: `scale(${sized})`,
            transformOrigin: "0 0",
          }}
        >
          <CharacterOnlyContext.Provider value={true}>
            <MoodArt mood={mood} />
          </CharacterOnlyContext.Provider>
        </div>
      ) : null}
    </div>
  );
}

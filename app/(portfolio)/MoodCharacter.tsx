"use client";

import * as React from "react";
import MoodArt from "../projects/mood-tracker/scenes";
import { CharacterOnlyContext } from "../projects/mood-tracker/primitives";
import type { MoodId } from "../projects/mood-tracker/moods";
import { MOOD_CHARACTER_BOX } from "./moodCharacterBoxes";

// The mood scenes are drawn on the Checkin phone frame, 440 x 956
const STAGE_WIDTH = 440;
const STAGE_HEIGHT = 956;
// Keep a little air at the sides of wide characters
const FIT_MARGIN = 0.94;

/**
 * One mood's character at the phone frame's proportions. It is scaled to the
 * box's width (shrunk only when a character is wider than the frame), centred
 * horizontally, and its top is aligned to the box. Anything below the box is
 * cropped, so the bottom of each character is cut off.
 */
export default function MoodCharacter({ mood }: { mood: MoodId }) {
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

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {scale > 0 ? (
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

import type { MoodId } from "../projects/mood-tracker/moods";

/**
 * How a character is scaled into the Emotions card.
 * - fit: shrink to the card's width only when the character is wider than the frame
 * - fill: stretch to the card's full width (uniform scale, may crop the sides)
 * - stage: use the phone frame's own scale, so the character keeps its natural size
 */
export type CharacterFit = "fit" | "fill" | "stage";

export type CharacterBox = {
  /** The character's artwork bounds on the 440 x 956 stage, measured from the scene. */
  left: number;
  top: number;
  width: number;
  height: number;
  fit?: CharacterFit;
  /** Extra stage px to move the character down inside the card (negative moves it up). */
  drop?: number;
  /** Multiplies the fitted size. Above 1 makes the character larger and crops more of it. */
  zoom?: number;
};

export const MOOD_CHARACTER_BOX: Record<MoodId, CharacterBox> = {
  "freaking-out": { left: 126, top: 66, width: 188, height: 469 },
  // The sad body is 900 wide on the stage, so it is fitted to the card's full width
  sad: { left: -231, top: 97, width: 900, height: 859, fit: "fill", zoom: 2 },
  anxious: { left: 0, top: 84, width: 440, height: 954 },
  tired: { left: 0, top: 92, width: 440, height: 864 },
  meh: { left: 126, top: 86, width: 188, height: 254 },
  content: { left: -14, top: 103, width: 467, height: 873, fit: "fill", drop: 60 },
  happy: { left: -19, top: 94, width: 477, height: 872 },
  excited: { left: -51, top: 82, width: 523, height: 900 },
  overjoyed: { left: -18, top: 150, width: 476, height: 828, fit: "fill", drop: 40 },
  angry: { left: -13, top: 175, width: 466, height: 791, fit: "fill" },
};

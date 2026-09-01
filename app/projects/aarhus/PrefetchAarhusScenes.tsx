"use client";

import { useIdlePrefetch } from "./useIdlePrefetch";

const NEXT_SCENES = [
  "/projects/aarhus/wardrobe/wardrobe-closed.png",
] as const;

/** After the intro cards paint, warm the wardrobe hero used on the next page. */
export default function PrefetchAarhusScenes() {
  useIdlePrefetch(NEXT_SCENES);
  return null;
}

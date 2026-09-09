"use client";

import { Layer, type Box } from "../primitives";
import { loopTimes } from "../motion";

export const blinkEase: (string | number[])[] = [
  "linear",
  [0.37, 0, 0.2, 1],
  "easeOut",
  "linear",
  [0.37, 0, 0.2, 1],
  "easeOut",
  "linear",
  [0.37, 0, 0.2, 1],
  "easeOut",
  "linear",
  [0.37, 0, 0.2, 1],
  "easeOut",
  "linear",
];

export const BLINK = {
  animate: { scaleY: [1, 1, 0.12, 1, 1, 0.18, 1, 1, 0.25, 1, 1, 0.16, 1, 1] },
  transition: loopTimes(
    4.2,
    [0, 0.1143, 0.1429, 0.1714, 0.3571, 0.3857, 0.4143, 0.5476, 0.5762, 0.6024, 0.7333, 0.7619, 0.7905, 1],
    blinkEase,
  ),
};

export const PUPIL_WANDER = {
  animate: {
    scaleX: [1, 1.02, 1.06, 1.06, 1.08, 1],
    scaleY: [1, 1.02, 0.97, 0.97, 0.96, 1],
    x: [0, 0, -10, -12, 11, 12, -13, 9, 0, 0],
    y: [0, -1, -1, -1.5, -1, -1.5, -1, -1.5, -1, 0],
  },
  transition: {
    scaleX: loopTimes(4.2, [0, 0.4524, 0.519, 0.6619, 0.8048, 1]),
    scaleY: loopTimes(4.2, [0, 0.4524, 0.519, 0.6619, 0.8048, 1]),
    x: loopTimes(4.2, [0, 0.4405, 0.519, 0.5905, 0.6619, 0.7333, 0.8048, 0.8762, 0.9381, 1]),
    y: loopTimes(4.2, [0, 0.4405, 0.519, 0.5905, 0.6619, 0.7333, 0.8048, 0.8762, 0.9381, 1]),
  },
};

/** A weather cloud that slides in from off-canvas once per loop. */
export function Cloud({
  name,
  box: b,
  reduced,
  fromX,
  duration,
  times,
  opacityTimes,
  flipX,
  rotate,
  fromRotate,
}: {
  name: string;
  box: Box;
  reduced?: boolean;
  fromX: number;
  duration: number;
  times: number[];
  opacityTimes?: number[];
  flipX?: boolean;
  rotate?: number;
  fromRotate?: number;
}) {
  const startRotation = fromRotate ?? rotate;
  const holdsBeforeEntering = times.length === 4;
  const translationKeyframes = holdsBeforeEntering ? [fromX, fromX, 0, 0] : [fromX, 0, 0];
  const rotationOffset = startRotation != null && rotate != null ? startRotation - rotate : 0;
  const rotationKeyframes = holdsBeforeEntering
    ? [rotationOffset, rotationOffset, 0, 0]
    : [rotationOffset, 0, 0];

  return (
    <Layer
      name={name}
      {...b}
      reduced={reduced}
      flipX={flipX}
      rotate={rotate}
      initial={reduced ? undefined : { opacity: 0, x: fromX, rotate: rotationOffset }}
      animate={
        reduced
          ? undefined
          : {
              opacity: [0, 0, 1, 1],
              x: translationKeyframes,
              rotate: rotationKeyframes,
            }
      }
      transition={{
        opacity: loopTimes(duration, opacityTimes ?? times, ["linear", [0.16, 1, 0.3, 1], "linear"]),
        x: loopTimes(duration, times, ["linear", [0.16, 1, 0.3, 1], "linear"]),
        rotate: loopTimes(duration, times, ["linear", [0.16, 1, 0.3, 1], "linear"]),
      }}
    />
  );
}

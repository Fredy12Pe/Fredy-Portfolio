"use client";

import { motion, type MotionProps } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { ASSET_SIZE } from "./assetSizes";
import { ASSET } from "./motion";

export const FRAME_WIDTH = 440;
export const FRAME_HEIGHT = 956;

export type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function box(left: number, top: number, width: number, height: number): Box {
  return { left, top, width, height };
}

/**
 * Figma reports a rotated layer through the inset of its *axis-aligned bounding
 * box*, as percentages of the 440x956 frame. Converting that to pixels gives the
 * box the artwork has to be centred inside — not the artwork's own size.
 */
export function inset(top: number, right: number, bottom: number, left: number): Box {
  const t = (top / 100) * FRAME_HEIGHT;
  const l = (left / 100) * FRAME_WIDTH;
  return {
    left: l,
    top: t,
    width: FRAME_WIDTH - l - (right / 100) * FRAME_WIDTH,
    height: FRAME_HEIGHT - t - (bottom / 100) * FRAME_HEIGHT,
  };
}

export function asset(name: string) {
  return `${ASSET}/${name}.svg`;
}

export function assetSize(name: string): readonly [number, number] {
  const size = ASSET_SIZE[name];
  if (!size) {
    throw new Error(`Missing intrinsic size for mood-tracker asset "${name}"`);
  }
  return size;
}

function transformOf(rotate?: number, flipX?: boolean, flipY?: boolean) {
  const parts = [
    rotate != null ? `rotate(${rotate}deg)` : "",
    flipX ? "scaleX(-1)" : "",
    flipY ? "scaleY(-1)" : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" ") : undefined;
}

export function Pos({
  left,
  top,
  width,
  height,
  children,
  style,
  className,
}: Box & { children?: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type ArtProps = Box &
  MotionProps & {
    name: string;
    reduced?: boolean;
    rotate?: number;
    flipX?: boolean;
    flipY?: boolean;
    /** Draw the asset stretched to the box instead of at its exported size. */
    stretch?: boolean;
    origin?: string;
    style?: CSSProperties;
  };

/**
 * One exported Figma layer.
 *
 * `left`/`top`/`width`/`height` describe the layer's bounding box in frame
 * coordinates. The asset itself is drawn at the size Figma exported it at and
 * centred in that box, so a rotated bounding box never distorts the artwork.
 */
export function Layer({
  name,
  left,
  top,
  width,
  height,
  reduced,
  rotate,
  flipX,
  flipY,
  stretch,
  origin,
  style,
  ...motionProps
}: ArtProps) {
  const [naturalWidth, naturalHeight] = assetSize(name);
  const drawWidth = stretch ? width : naturalWidth;
  const drawHeight = stretch ? height : naturalHeight;

  const img = (
    <img
      alt=""
      src={asset(name)}
      draggable={false}
      style={{
        position: "absolute",
        left: (width - drawWidth) / 2,
        top: (height - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
        maxWidth: "none",
        display: "block",
        pointerEvents: "none",
        userSelect: "none",
        transform: transformOf(rotate, flipX, flipY),
        transformOrigin: "center",
      }}
    />
  );

  const frame: CSSProperties = {
    position: "absolute",
    left,
    top,
    width,
    height,
    transformOrigin: origin ?? "center",
    ...style,
  };

  if (reduced) {
    return <div style={frame}>{img}</div>;
  }

  return (
    <motion.div {...motionProps} style={frame}>
      {img}
    </motion.div>
  );
}

/** A layer whose bounding box is taken straight from its exported size. */
export function Art({
  name,
  left,
  top,
  ...rest
}: Omit<ArtProps, "width" | "height"> & { width?: number; height?: number }) {
  const [width, height] = assetSize(name);
  return <Layer name={name} left={left} top={top} width={width} height={height} {...rest} />;
}

/** A tooth or tongue drawn inside a MouthFill, at its exported size. */
export function Tooth({
  name,
  left,
  top,
  rotate,
  flipX,
  flipY,
}: {
  name: string;
  left: number;
  top: number;
  rotate?: number;
  flipX?: boolean;
  flipY?: boolean;
}) {
  const [width, height] = assetSize(name);
  return (
    <img
      alt=""
      src={asset(name)}
      draggable={false}
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        maxWidth: "none",
        transform: transformOf(rotate, flipX, flipY),
        transformOrigin: "center",
        pointerEvents: "none",
      }}
    />
  );
}

/**
 * Clips its children to the alpha of a mask asset. Used for teeth and tongues,
 * which are painted inside the mouth shape.
 */
export function MouthFill({ mask, children }: { mask?: string; children?: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: mask ? "visible" : "hidden",
        pointerEvents: "none",
        ...(mask
          ? {
              WebkitMaskImage: `url(${asset(mask)})`,
              maskImage: `url(${asset(mask)})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }
          : null),
      }}
    >
      {children}
    </div>
  );
}

/**
 * A single eye: white at its exported size with the pupil centred on top, so
 * blink (scaleY on the eye) and wander (x/y on the pupil) stay independent.
 */
export function Eye({
  eye,
  pupil,
  reduced,
  blink,
  wander,
  pupilShift,
}: {
  eye: string;
  pupil: string;
  reduced?: boolean;
  blink?: MotionProps;
  wander?: MotionProps;
  pupilShift?: { x?: number; y?: number };
}) {
  const [eyeWidth, eyeHeight] = assetSize(eye);
  const [pupilWidth, pupilHeight] = assetSize(pupil);

  return (
    <motion.div
      style={{ position: "relative", width: eyeWidth, height: eyeHeight, flex: "none", transformOrigin: "center" }}
      {...(reduced ? {} : blink)}
    >
      <img
        alt=""
        src={asset(eye)}
        draggable={false}
        style={{ position: "absolute", inset: 0, width: eyeWidth, height: eyeHeight, maxWidth: "none", display: "block" }}
      />
      <motion.div
        style={{
          position: "absolute",
          left: (eyeWidth - pupilWidth) / 2 + (pupilShift?.x ?? 0),
          top: (eyeHeight - pupilHeight) / 2 + (pupilShift?.y ?? 0),
          width: pupilWidth,
          height: pupilHeight,
        }}
        {...(reduced ? {} : wander)}
      >
        <img
          alt=""
          src={asset(pupil)}
          draggable={false}
          style={{ width: pupilWidth, height: pupilHeight, maxWidth: "none", display: "block" }}
        />
      </motion.div>
    </motion.div>
  );
}

/** The two eyes sitting side by side, as they are grouped in Figma. */
export function Eyes({
  left,
  top,
  eye,
  pupilL,
  pupilR,
  eyeL = eye,
  eyeR = eye,
  reduced,
  blink,
  blinkL = blink,
  blinkR = blink,
  wander,
  wanderL = wander,
  wanderR = wander,
  rotate,
  style,
}: {
  left: number;
  top: number;
  eye: string;
  pupilL: string;
  pupilR: string;
  eyeL?: string;
  eyeR?: string;
  reduced?: boolean;
  blink?: MotionProps;
  blinkL?: MotionProps;
  blinkR?: MotionProps;
  wander?: MotionProps;
  wanderL?: MotionProps;
  wanderR?: MotionProps;
  rotate?: number;
  style?: CSSProperties;
}) {
  const [eyeWidth, eyeHeight] = assetSize(eyeL);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: eyeWidth * 2,
        height: eyeHeight,
        display: "flex",
        alignItems: "center",
        transform: rotate != null ? `rotate(${rotate}deg)` : undefined,
        transformOrigin: "center",
        ...style,
      }}
    >
      <Eye eye={eyeL} pupil={pupilL} reduced={reduced} blink={blinkL} wander={wanderL} />
      <Eye eye={eyeR} pupil={pupilR} reduced={reduced} blink={blinkR} wander={wanderR} />
    </div>
  );
}

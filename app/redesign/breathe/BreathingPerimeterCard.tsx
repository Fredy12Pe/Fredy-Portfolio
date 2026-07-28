/**
 * Rounded-square breath progress: track + white stroke revealed via dash offset.
 * Ported from grove-habit-tracker BreathingPerimeterCard (web SVG, no Reanimated).
 */

/** Design: 359×359 artboard; stroke centered on path inset by half stroke width. */
export const BREATHING_CARD_SIZE = 359;
const STROKE_WIDTH = 28;
const CORNER_RADIUS = 60;

const INSET = STROKE_WIDTH / 2;
const INNER_W = BREATHING_CARD_SIZE - STROKE_WIDTH;
const INNER_H = BREATHING_CARD_SIZE - STROKE_WIDTH;
const RX = CORNER_RADIUS;
const RY = CORNER_RADIUS;

/** Clockwise offset along the top-left quarter-circle from the leftmost point. */
const TOP_LEFT_ARC_START_RAD = 0.6;

function buildRoundedRectPathD(
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  ry: number,
): string {
  const right = x + w;
  const bottom = y + h;
  const cx = x + rx;
  const cy = y + ry;
  const t0 = TOP_LEFT_ARC_START_RAD;
  const sx = cx - rx * Math.cos(t0);
  const sy = cy - ry * Math.sin(t0);
  const f = (n: number) => n.toFixed(4);

  return [
    `M ${f(sx)} ${f(sy)}`,
    `A ${rx} ${ry} 0 0 1 ${x + rx} ${y}`,
    `L ${right - rx} ${y}`,
    `A ${rx} ${ry} 0 0 1 ${right} ${y + ry}`,
    `L ${right} ${bottom - ry}`,
    `A ${rx} ${ry} 0 0 1 ${right - rx} ${bottom}`,
    `L ${x + rx} ${bottom}`,
    `A ${rx} ${ry} 0 0 1 ${x} ${bottom - ry}`,
    `L ${x} ${y + ry}`,
    `A ${rx} ${ry} 0 0 1 ${f(sx)} ${f(sy)}`,
    "Z",
  ].join(" ");
}

function roundedRectPerimeter(w: number, h: number, r: number): number {
  return 2 * (w + h - 4 * r) + 2 * Math.PI * r;
}

const PATH_D = buildRoundedRectPathD(INSET, INSET, INNER_W, INNER_H, RX, RY);
const PATH_LENGTH = roundedRectPerimeter(INNER_W, INNER_H, RX);

export type BreathingPerimeterCardProps = {
  /** 0 = nothing visible, 1 = full lap (one 16s box cycle). */
  progress: number;
  timeLabel?: string;
  className?: string;
};

export default function BreathingPerimeterCard({
  progress,
  timeLabel,
  className,
}: BreathingPerimeterCardProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const dashOffset = (1 - clamped) * PATH_LENGTH;

  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      <div
        className="relative aspect-square w-full"
        style={{ borderRadius: CORNER_RADIUS }}
      >
        <svg
          className="block size-full"
          viewBox={`0 0 ${BREATHING_CARD_SIZE} ${BREATHING_CARD_SIZE}`}
          aria-hidden
        >
          {/* Track: Grove's #E2F1BA sits on the Rive artboard bg (#F3FBDE) */}
          <path
            d={PATH_D}
            fill="none"
            stroke="#E2F1BA"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={PATH_D}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
            strokeDashoffset={dashOffset}
          />
        </svg>
        {timeLabel ? (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(0.875rem,1.5vw,1.25rem)] font-semibold tracking-wide text-[#53b035]">
            {timeLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}

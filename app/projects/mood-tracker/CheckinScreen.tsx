"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { fredoka } from "./fonts";
import { MOODS, MOOD_COUNT, type Mood, type MoodHapticPattern } from "./moods";
import { asset } from "./primitives";
import MoodArt from "./scenes";
import { FRAME_HEIGHT, FRAME_WIDTH } from "./useStageScale";

/**
 * Chrome geometry, straight from the Figma frame (440x956).
 * The slider is a 370x60 pill with ten 10px ticks spaced 33px apart and a 31px
 * knob that sits on the active tick.
 */
const HEADER = { left: 34, top: 30, width: 372 };
const SLIDER = { left: 35, top: 765, width: 370, height: 60 };
const TICK_FIRST = 35;
const TICK_STEP = 33;
const TICK_SIZE = 10;
const KNOB_SIZE = 31;
const TRACK_FILL = "#d9d9d9";
const TICK_FILL = "#a1a1a1";
/** Wait for the mood enter transition to settle before ambient pulses. */
const AMBIENT_HAPTIC_DELAY_MS = 700;
const SCREEN_VARIANTS = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 24,
    scale: 1.015,
  }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -18,
    scale: 0.99,
  }),
};

function isAppleTouchDevice() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function canUseVibrationApi() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Mood-specific pattern via Vibration API (Android Chrome / etc.).
 * iOS has no vibrate — native ticks come only from a direct finger hit on
 * `<input type="checkbox" switch>` overlays (see NativeHapticSwitch).
 */
function triggerEmotionHaptic(pattern: MoodHapticPattern) {
  if (!canUseVibrationApi()) return;
  navigator.vibrate(0);
  navigator.vibrate(pattern);
}

/**
 * Same mechanism as the working slider: an invisible WebKit switch that the
 * finger actually hits. On iOS 26.5+ this is the only reliable web haptic.
 */
function NativeHapticSwitch({
  cursor = "grab",
  touchAction = "none",
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  cursor?: CSSProperties["cursor"];
  touchAction?: CSSProperties["touchAction"];
  style?: CSSProperties;
  onPointerDown?: (event: ReactPointerEvent<HTMLInputElement>) => void;
  onPointerMove?: (event: ReactPointerEvent<HTMLInputElement>) => void;
  onPointerUp?: (event: ReactPointerEvent<HTMLInputElement>) => void;
  onPointerCancel?: (event: ReactPointerEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type="checkbox"
      // @ts-expect-error WebKit `switch` control attribute
      switch=""
      aria-hidden
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onChange={(event) => {
        // Keep checked flipping so every press can tick again.
        event.stopPropagation();
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        border: 0,
        opacity: 0.01,
        cursor,
        touchAction,
        appearance: "auto",
        WebkitAppearance: "checkbox",
        ...style,
      }}
    />
  );
}

function Header({ mood }: { mood: Mood }) {
  return (
    <div
      style={{
        position: "absolute",
        left: HEADER.left,
        top: HEADER.top,
        width: HEADER.width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      <p style={{ margin: 0, fontSize: 30, fontWeight: 500, lineHeight: "normal", color: "#fff" }}>Checkin</p>
      <motion.div
        initial={false}
        animate={{ backgroundColor: mood.menu }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 53,
          height: 53,
          borderRadius: 35,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img alt="" src={asset("menu")} width={22} height={22} draggable={false} />
      </motion.div>
    </div>
  );
}

/** Minimum horizontal travel (CSS px) to count as a mood swipe. */
const SWIPE_MIN_DX = 56;
/** Horizontal motion must beat vertical by this ratio so page scroll still works. */
const SWIPE_HORIZONTAL_RATIO = 1.35;

function MoodSlider({
  index,
  mood,
  onChange,
}: {
  index: number;
  mood: Mood;
  onChange?: (index: number) => void;
}) {
  const interactive = Boolean(onChange);
  const trackRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const lastIndexRef = useRef(index);
  const appleTouch = typeof navigator !== "undefined" && isAppleTouchDevice();

  useEffect(() => {
    lastIndexRef.current = index;
  }, [index]);

  const updateFromClientX = (clientX: number, { haptic }: { haptic: boolean }) => {
    if (!onChange || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scale = rect.width / SLIDER.width;
    const designX = (clientX - rect.left) / scale;
    const next = Math.max(0, Math.min(MOOD_COUNT - 1, Math.round((designX - TICK_FIRST) / TICK_STEP)));

    if (next !== lastIndexRef.current) {
      lastIndexRef.current = next;
      // Android: per-tick pattern. iOS: native switch already ticked on press;
      // further drag ticks only vibrate where the API exists.
      if (haptic) triggerEmotionHaptic(MOODS[next].haptic);
      onChange(next);
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (!onChange) return;
    // Don't preventDefault on iOS — the native switch must toggle to fire a haptic.
    if (!appleTouch) event.preventDefault();
    activePointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX, { haptic: true });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    event.preventDefault();
    updateFromClientX(event.clientX, { haptic: true });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    activePointerId.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={trackRef}
      data-mood-slider=""
      style={{
        position: "absolute",
        left: SLIDER.left,
        top: SLIDER.top - 18,
        width: SLIDER.width,
        height: SLIDER.height + 36,
        padding: "18px 0",
        zIndex: 4,
        cursor: interactive ? "grab" : "default",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: SLIDER.width,
          height: SLIDER.height,
          borderRadius: SLIDER.height / 2,
          background: TRACK_FILL,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: MOOD_COUNT }, (_, tick) => {
          const distance = Math.abs(tick - index);
          const scale = distance === 0 ? KNOB_SIZE / TICK_SIZE : distance === 1 ? 1.65 : distance === 2 ? 1.25 : 1;
          const active = distance === 0;

          return (
            <motion.span
              key={tick}
              aria-hidden
              initial={false}
              animate={{
                scale,
                backgroundColor: active ? mood.knob : TICK_FILL,
              }}
              transition={{
                scale: { type: "spring", stiffness: 500, damping: 36, mass: 0.7 },
                backgroundColor: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              }}
              style={{
                position: "absolute",
                left: TICK_FIRST + tick * TICK_STEP - TICK_SIZE / 2,
                top: (SLIDER.height - TICK_SIZE) / 2,
                width: TICK_SIZE,
                height: TICK_SIZE,
                borderRadius: "50%",
                transformOrigin: "center",
                zIndex: active ? 1 : 0,
                pointerEvents: "none",
              }}
            />
          );
        })}
        {interactive ? (
          <>
            <input
              type="range"
              min={0}
              max={MOOD_COUNT - 1}
              step={1}
              value={index}
              aria-label="What's your mood like today"
              onInput={(event) => {
                const next = Number(event.currentTarget.value);
                if (next === lastIndexRef.current) return;
                lastIndexRef.current = next;
                triggerEmotionHaptic(MOODS[next].haptic);
                onChange?.(next);
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                margin: 0,
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <NativeHapticSwitch
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ zIndex: 2 }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Full-stage WebKit switch — same iOS haptic path as the slider.
 * Finger hits the switch on press/swipe; Android also gets the mood vibrate pattern.
 */
function MoodHapticSurface({
  mood,
  onMoodChange,
  index,
}: {
  mood: Mood;
  index: number;
  onMoodChange?: (index: number) => void;
}) {
  const appleTouch = typeof navigator !== "undefined" && isAppleTouchDevice();
  const swipeRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const lastPulseAt = useRef(0);

  const pulseMood = () => {
    // Throttle so a swipe doesn't stack press + release patterns on Android.
    const now = performance.now();
    if (now - lastPulseAt.current < 120) return;
    lastPulseAt.current = now;
    triggerEmotionHaptic(mood.haptic);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (event.button !== 0) return;
    // Don't preventDefault on iOS — the native switch must toggle to fire a haptic.
    if (!appleTouch) event.preventDefault();
    swipeRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    // Direct hit on this switch → iOS native tick. Android also gets the pattern.
    pulseMood();
  };

  const endPointer = (event: ReactPointerEvent<HTMLInputElement>) => {
    const start = swipeRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    swipeRef.current = null;
    if (!onMoodChange) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_DX) return;
    if (Math.abs(dx) < Math.abs(dy) * SWIPE_HORIZONTAL_RATIO) return;

    const next = dx < 0 ? index + 1 : index - 1;
    if (next < 0 || next >= MOOD_COUNT) return;
    // New mood pattern on Android; iOS already ticked from the switch press.
    triggerEmotionHaptic(MOODS[next].haptic);
    onMoodChange(next);
  };

  return (
    <NativeHapticSwitch
      cursor="default"
      touchAction="pan-y"
      onPointerDown={onPointerDown}
      onPointerUp={endPointer}
      onPointerCancel={() => {
        swipeRef.current = null;
      }}
      style={{
        // Below slider (4) and header (5); above art/copy.
        zIndex: 3,
      }}
    />
  );
}

/** One Checkin screen at Figma's exact 440x956 frame size. */
export default function CheckinScreen({
  index,
  direction = 1,
  onMoodChange,
  reduced = false,
}: {
  index: number;
  direction?: number;
  onMoodChange?: (index: number) => void;
  reduced?: boolean;
}) {
  const mood = MOODS[index];
  const currentDate = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Ambient emotion pulses: Vibration API only (Android). iOS cannot tick on a
  // timer — use the stage NativeHapticSwitch (same as the slider) instead.
  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!canUseVibrationApi()) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches && navigator.maxTouchPoints === 0) {
      return;
    }

    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      const pulse = () => {
        if (document.visibilityState === "hidden") return;
        triggerEmotionHaptic(mood.haptic);
      };

      pulse();
      intervalId = window.setInterval(pulse, mood.hapticEveryMs);
    }, AMBIENT_HAPTIC_DELAY_MS);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      navigator.vibrate(0);
    };
  }, [mood.haptic, mood.hapticEveryMs, mood.id, reduced]);

  return (
    <div
      className={fredoka.className}
      style={{
        position: "relative",
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        overflow: "hidden",
        isolation: "isolate",
        background: mood.background,
        color: "#fff",
        touchAction: "pan-y",
      }}
    >
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={mood.id}
          custom={direction}
          variants={SCREEN_VARIANTS}
          initial={reduced ? false : "enter"}
          animate="center"
          exit={reduced ? undefined : "exit"}
          transition={{ duration: reduced ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", inset: 0, background: mood.background }}
        >
          <MoodArt mood={mood.id} reduced={reduced} />

          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: 501,
              width: FRAME_WIDTH,
              height: 455,
              background: mood.fade,
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <Header mood={mood} />

      <p
        style={{
          position: "absolute",
          left: "50%",
          top: 515,
          zIndex: 3,
          margin: 0,
          width: 400,
          transform: "translateX(-50%)",
          fontSize: 48,
          fontWeight: 700,
          lineHeight: "normal",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        WHAT’S
        <br />
        YOUR MOOD
        <br />
        LIKE TODAY
      </p>

      <motion.p
        initial={false}
        animate={{ color: mood.date }}
        transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          left: "50%",
          top: 707,
          zIndex: 3,
          margin: 0,
          x: "-50%",
          fontSize: 22,
          fontWeight: 500,
          lineHeight: "normal",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {mood.label}
      </motion.p>

      {/* Same iOS switch-under-finger path as the slider, for taps + swipes. */}
      {onMoodChange ? <MoodHapticSurface mood={mood} index={index} onMoodChange={onMoodChange} /> : null}

      <MoodSlider index={index} mood={mood} onChange={onMoodChange} />

      <p
        style={{
          position: "absolute",
          left: "50%",
          top: 865,
          zIndex: 3,
          margin: 0,
          transform: "translateX(-50%)",
          fontSize: 20,
          fontWeight: 500,
          lineHeight: "normal",
          color: "#fff",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        <span suppressHydrationWarning>{currentDate}</span>
      </p>
    </div>
  );
}

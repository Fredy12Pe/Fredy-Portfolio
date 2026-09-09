"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
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
const AMBIENT_HAPTIC_DELAY_MS = 1000;
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

function canUseAmbientVibration() {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return false;
  if (typeof window === "undefined") return false;
  // Desktop mice shouldn't buzz; keep ambient pulses on touch-capable devices.
  if (window.matchMedia("(pointer: fine)").matches && navigator.maxTouchPoints === 0) return false;
  return true;
}

/** Off-screen WebKit switch for programmatic ticks (works on iOS 17.4–26.4 only). */
let iosProgrammaticSwitch: HTMLInputElement | null = null;

function getIOSProgrammaticSwitch() {
  if (typeof document === "undefined") return null;
  if (iosProgrammaticSwitch?.isConnected) return iosProgrammaticSwitch;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.setAttribute("aria-hidden", "true");
  input.tabIndex = -1;
  Object.assign(input.style, {
    position: "fixed",
    left: "-100vw",
    top: "0",
    width: "44px",
    height: "44px",
    opacity: "0.01",
    pointerEvents: "none",
    margin: "0",
  });
  document.body.appendChild(input);
  iosProgrammaticSwitch = input;
  return input;
}

/**
 * Per-tick feedback while dragging.
 * Android: Vibration API. Older iOS: programmatic switch click. iOS 26.5+: no-op —
 * the direct-tap overlay on the slider fires the only reliable native tick on press.
 */
function triggerMoodHaptic() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(12);
  }

  if (!isAppleTouchDevice()) return;

  try {
    getIOSProgrammaticSwitch()?.click();
  } catch {
    /* iOS 26.5+ ignores programmatic switch clicks */
  }
}

/** Soft ambient pulse tied to the active mood animation (Android Vibration API). */
function triggerAmbientHaptic(pattern: MoodHapticPattern) {
  if (!canUseAmbientVibration()) return;
  navigator.vibrate(pattern);
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
        zIndex: 3,
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
      if (haptic) triggerMoodHaptic();
      onChange(next);
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (!onChange) return;
    // Don't preventDefault on iOS — the native switch must toggle to fire a haptic.
    if (!appleTouch) event.preventDefault();
    activePointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    // On iOS the switch overlay already fired a native tick from this direct tap.
    updateFromClientX(event.clientX, { haptic: !appleTouch });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    event.preventDefault();
    updateFromClientX(event.clientX, { haptic: true });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
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
                triggerMoodHaptic();
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
            {/*
              iOS 26.5+ only haptics on a direct finger hit to a native WebKit switch.
              This fills the track so the first press ticks; drag ticks still need vibrate
              (Android) or the older programmatic path (iOS ≤26.4).
            */}
            <input
              type="checkbox"
              // @ts-expect-error WebKit `switch` control attribute
              switch=""
              aria-hidden
              tabIndex={-1}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onChange={(event) => {
                // Keep checked state flipping so every press can tick again.
                event.stopPropagation();
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                margin: 0,
                opacity: 0.01,
                cursor: "grab",
                appearance: "auto",
                WebkitAppearance: "checkbox",
                zIndex: 2,
              }}
            />
          </>
        ) : null}
      </div>
    </div>
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
  const swipeRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (reduced || !canUseAmbientVibration()) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      const pulse = () => {
        if (document.visibilityState === "hidden") return;
        triggerAmbientHaptic(mood.haptic);
      };

      pulse();
      intervalId = window.setInterval(pulse, mood.hapticEveryMs);
    }, AMBIENT_HAPTIC_DELAY_MS);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      navigator.vibrate?.(0);
    };
  }, [mood.haptic, mood.hapticEveryMs, mood.id, reduced]);

  const onSwipePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!onMoodChange || event.button !== 0) return;
    const target = event.target as Element | null;
    if (target?.closest?.("[data-mood-slider]")) return;
    swipeRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const endSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
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
    triggerMoodHaptic();
    onMoodChange(next);
  };

  return (
    <div
      className={fredoka.className}
      onPointerDown={onSwipePointerDown}
      onPointerUp={endSwipe}
      onPointerCancel={() => {
        swipeRef.current = null;
      }}
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
        }}
      >
        {mood.label}
      </motion.p>

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
        }}
      >
        <span suppressHydrationWarning>{currentDate}</span>
      </p>
    </div>
  );
}

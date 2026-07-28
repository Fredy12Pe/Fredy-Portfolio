"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

const RIV_SRC = "/images/redesign/breathe/sprout_breathing.riv";
/** Must match sprout_breathing.riv state machine + trigger names. */
const STATE_MACHINE_NAME = "State Machine 1";

const TRIGGER = {
  inhale: "breathe in",
  holdAfterInhale: "hold",
  exhale: "breathe out",
  holdAfterExhale: "hold",
} as const;

export type BreathingPhase =
  | "inhale"
  | "holdAfterInhale"
  | "exhale"
  | "holdAfterExhale";

type Props = {
  className?: string;
  paused: boolean;
  phase: BreathingPhase;
  /**
   * false = menu: SM free-loops from t=0 (parent remounts this component to rewind).
   * true  = session: fire inhale once loaded, then track the ring's phases.
   */
  sessionActive: boolean;
  /** Parent starts the wall-clock here so the ring aligns with the first inhale. */
  onPlaybackReady?: () => void;
};

/**
 * Parent MUST remount this component (change `key`) whenever a fresh timeline
 * is required — Start, End, or returning to menu. `rive.reset()` does not rewind
 * this file's state machine; only a new runtime instance starts at frame 0.
 */
export default function BreathingRivePlayer({
  className,
  paused,
  phase,
  sessionActive,
  onPlaybackReady,
}: Props) {
  const outerEl = useRef<HTMLDivElement | null>(null);
  const prevPhaseRef = useRef<BreathingPhase | null>(null);
  const sessionArmedRef = useRef(false);
  const wasPausedRef = useRef(false);

  const onPlaybackReadyRef = useRef(onPlaybackReady);
  onPlaybackReadyRef.current = onPlaybackReady;

  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src: RIV_SRC,
      stateMachines: STATE_MACHINE_NAME,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.BottomCenter,
      }),
    },
    { shouldResizeCanvasToContainer: true },
  );

  const riveRef = useRef(rive);
  riveRef.current = rive;

  const firePhase = useCallback((p: BreathingPhase) => {
    const instance = riveRef.current;
    if (!instance) return;
    try {
      const inputs = instance.stateMachineInputs(STATE_MACHINE_NAME);
      const input = inputs?.find((i) => i.name === TRIGGER[p]);
      input?.fire();
    } catch {
      /* SM / inputs not ready */
    }
  }, []);

  // Keep canvas sized to the panel as it animates.
  useEffect(() => {
    const el = outerEl.current;
    if (!rive || !el) return;

    const resize = () => rive.resizeDrawingSurfaceToCanvas();
    resize();

    const observer = new ResizeObserver(() => resize());
    observer.observe(el);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [rive]);

  // Fresh mount + session: fire opening inhale, then unlock the ring clock.
  useEffect(() => {
    if (!sessionActive || !rive || sessionArmedRef.current) return;

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        firePhase("inhale");
        sessionArmedRef.current = true;
        prevPhaseRef.current = "inhale";
        onPlaybackReadyRef.current?.();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [sessionActive, rive, firePhase]);

  // Fallback if inputs are slow to bind.
  useEffect(() => {
    if (!sessionActive) return;
    const timeoutId = window.setTimeout(() => {
      if (sessionArmedRef.current) return;
      sessionArmedRef.current = true;
      prevPhaseRef.current = "inhale";
      onPlaybackReadyRef.current?.();
    }, 800);
    return () => window.clearTimeout(timeoutId);
  }, [sessionActive]);

  // Pause freezes playback; resume continues (parent remounts for a full rewind).
  useEffect(() => {
    if (!rive || !sessionActive) return;

    if (paused) {
      wasPausedRef.current = true;
      try {
        rive.pause();
      } catch {
        /* not ready */
      }
      return;
    }

    if (!wasPausedRef.current) return;
    wasPausedRef.current = false;
    try {
      rive.play(STATE_MACHINE_NAME);
    } catch {
      /* not ready */
    }
  }, [paused, sessionActive, rive]);

  // Drive phase triggers from the ring clock (session only).
  useEffect(() => {
    if (!sessionActive || paused || !sessionArmedRef.current) return;

    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;

    if (prev === null || prev === phase) return;

    // New box lap: re-fire inhale on this same instance (SM transition).
    // Full timeline rewinds are handled by parent remount on Start/End.
    firePhase(phase);
  }, [phase, sessionActive, paused, firePhase]);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      outerEl.current = node;
      setContainerRef(node);
    },
    [setContainerRef],
  );

  return (
    <div ref={setRefs} className={className}>
      <RiveComponent className="block h-full w-full" />
    </div>
  );
}

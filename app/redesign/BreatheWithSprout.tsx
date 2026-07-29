"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BreathingPerimeterCard from "./breathe/BreathingPerimeterCard";
import BreathingRivePlayer, {
  type BreathingPhase,
} from "./breathe/BreathingRivePlayer";
import { useIsMobileLayout } from "./useCardHover";

const DURATIONS = [1, 2, 3, 5] as const;

const PATTERN = {
  inhale: 4,
  holdAfterInhale: 4,
  exhale: 4,
  holdAfterExhale: 4,
} as const;

const BOX_CYCLE_SECONDS =
  PATTERN.inhale +
  PATTERN.holdAfterInhale +
  PATTERN.exhale +
  PATTERN.holdAfterExhale;

const PHASE_SEGMENTS: { phase: BreathingPhase; duration: number }[] = [
  { phase: "inhale", duration: PATTERN.inhale },
  { phase: "holdAfterInhale", duration: PATTERN.holdAfterInhale },
  { phase: "exhale", duration: PATTERN.exhale },
  { phase: "holdAfterExhale", duration: PATTERN.holdAfterExhale },
];

const SPRING = { type: "spring" as const, duration: 0.55, bounce: 0.22 };
const HOVER_SPRING = { type: "spring" as const, duration: 0.4, bounce: 0.28 };
const HOVER_LEAVE = { type: "spring" as const, duration: 0.28, bounce: 0 };

/** Shared size for the breath square — buttons bottom-align to this. */
const SQUARE_SIZE = "min(44cqh, 72%, 170px)";

function phaseFromElapsedInCycle(elapsedSec: number): BreathingPhase {
  const p =
    ((elapsedSec % BOX_CYCLE_SECONDS) + BOX_CYCLE_SECONDS) % BOX_CYCLE_SECONDS;
  let acc = 0;
  for (const { phase, duration } of PHASE_SEGMENTS) {
    const end = acc + duration;
    if (p < end) return phase;
    acc = end;
  }
  return "inhale";
}

function cycleProgressFromElapsed(elapsedSec: number): number {
  const p =
    ((elapsedSec % BOX_CYCLE_SECONDS) + BOX_CYCLE_SECONDS) % BOX_CYCLE_SECONDS;
  return p / BOX_CYCLE_SECONDS;
}

function formatMmSs(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function phaseInstruction(phase: BreathingPhase): string {
  switch (phase) {
    case "inhale":
      return "Breathe In";
    case "holdAfterInhale":
    case "holdAfterExhale":
      return "Hold";
    case "exhale":
      return "Breathe Out";
  }
}

type BreatheWithSproutProps = {
  onSessionChange?: (active: boolean) => void;
};

export default function BreatheWithSprout({
  onSessionChange,
}: BreatheWithSproutProps) {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobileLayout();
  const [hovered, setHovered] = useState(false);
  const [minutes, setMinutes] = useState<(typeof DURATIONS)[number]>(1);
  const [mode, setMode] = useState<"setup" | "active">("setup");
  const [paused, setPaused] = useState(false);
  const [breathTimelineLive, setBreathTimelineLive] = useState(false);
  /**
   * Remount key for BreathingRivePlayer. `rive.reset()` does not rewind this
   * file — only destroying the runtime (React key change) starts at frame 0.
   * Bump on every Start and every return to menu.
   */
  const [riveMountKey, setRiveMountKey] = useState(0);

  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [phase, setPhase] = useState<BreathingPhase>("inhale");
  const [cycleProgress, setCycleProgress] = useState(0);

  const totalSeconds = minutes * 60;
  const isActive = mode === "active";
  const menuHover = !isActive && (hovered || isMobile) && !reduced;

  const wallSessionStartRef = useRef(0);
  const frozenElapsedMsRef = useRef(0);
  const prevPausedRef = useRef(false);
  const breathTimelinePrimedRef = useRef(false);
  const lastCycleProgressRef = useRef(-1);
  const lastPublishedRef = useRef<{
    sec: number;
    phase: BreathingPhase | null;
  }>({ sec: -1, phase: null });

  const remountRive = useCallback(() => {
    setRiveMountKey((k) => k + 1);
  }, []);

  const endSessionToSetup = useCallback(() => {
    remountRive();
    setMode("setup");
    setPaused(false);
  }, [remountRive]);

  useEffect(() => {
    onSessionChange?.(mode === "active");
  }, [mode, onSessionChange]);

  useEffect(() => {
    return () => onSessionChange?.(false);
  }, [onSessionChange]);

  const startSession = () => {
    frozenElapsedMsRef.current = 0;
    prevPausedRef.current = false;
    breathTimelinePrimedRef.current = false;
    setBreathTimelineLive(false);
    lastPublishedRef.current = { sec: -1, phase: null };
    setSecondsRemaining(totalSeconds);
    setPhase("inhale");
    lastCycleProgressRef.current = -1;
    setCycleProgress(0);
    setPaused(false);
    setHovered(false);
    remountRive();
    setMode("active");
  };

  const onBreathingRivePlaybackReady = useCallback(() => {
    if (breathTimelinePrimedRef.current) return;
    breathTimelinePrimedRef.current = true;
    wallSessionStartRef.current = Date.now();
    frozenElapsedMsRef.current = 0;
    lastPublishedRef.current = { sec: -1, phase: null };
    setBreathTimelineLive(true);
  }, []);

  useEffect(() => {
    if (mode !== "active") {
      setBreathTimelineLive(false);
      breathTimelinePrimedRef.current = false;
      lastCycleProgressRef.current = -1;
      setCycleProgress(0);
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "active") {
      prevPausedRef.current = paused;
      return;
    }
    const wasPaused = prevPausedRef.current;
    prevPausedRef.current = paused;

    if (!breathTimelineLive) return;

    if (!wasPaused && paused) {
      frozenElapsedMsRef.current += Date.now() - wallSessionStartRef.current;
    } else if (wasPaused && !paused) {
      wallSessionStartRef.current = Date.now();
    }
  }, [paused, mode, breathTimelineLive]);

  useEffect(() => {
    if (mode !== "active" || paused || !breathTimelineLive) return;

    let rafId = 0;

    const tick = () => {
      const elapsedMs =
        frozenElapsedMsRef.current + (Date.now() - wallSessionStartRef.current);
      const elapsedSec = elapsedMs / 1000;

      if (elapsedSec >= totalSeconds) {
        endSessionToSetup();
        return;
      }

      const sessionRem = Math.max(0, Math.ceil(totalSeconds - elapsedSec));
      const ph = phaseFromElapsedInCycle(elapsedSec);

      const last = lastPublishedRef.current;
      if (sessionRem !== last.sec) {
        last.sec = sessionRem;
        setSecondsRemaining(sessionRem);
      }
      if (ph !== last.phase) {
        last.phase = ph;
        setPhase(ph);
      }

      const cp = cycleProgressFromElapsed(elapsedSec);
      if (Math.abs(cp - lastCycleProgressRef.current) > 0.002) {
        lastCycleProgressRef.current = cp;
        setCycleProgress(cp);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mode, paused, breathTimelineLive, totalSeconds, endSessionToSetup]);

  useEffect(() => {
    if (mode !== "setup") return;
    setSecondsRemaining(totalSeconds);
  }, [mode, totalSeconds]);

  return (
    <div
      className="relative size-full overflow-hidden rounded-[20px] bg-[#F3FBDE]"
      style={{ containerType: "size" }}
      onPointerEnter={() => {
        if (!isActive) setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Sprout Rive — same size always; slides right when the session starts.
          Menu hover: gentle scale-up from the feet so Sprout leans into the card. */}
      <motion.div
        className={`pointer-events-none absolute z-[5] origin-bottom ${
          isMobile
            ? isActive
              ? "bottom-0 left-1/2 h-[40%] w-[85%]"
              : "bottom-0 left-1/2 h-[48%] w-[90%]"
            : "inset-y-0 w-[52%]"
        }`}
        initial={false}
        animate={
          isMobile
            ? {
                x: "-50%",
                y: isActive ? 4 : 0,
                scale: menuHover ? 1.04 : 1,
              }
            : {
                right: isActive ? "0%" : "10%",
                scale: menuHover ? 1.02 : 1,
              }
        }
        transition={
          isActive
            ? SPRING
            : menuHover
              ? HOVER_SPRING
              : HOVER_LEAVE
        }
      >
        <div
          className="absolute"
          style={
            isMobile
              ? {
                  width: "120%",
                  height: "140%",
                  left: "50%",
                  bottom: "-16%",
                  transform: "translateX(-50%)",
                }
              : {
                  width: "180%",
                  height: "180%",
                  left: "-38%",
                  bottom: "-44%",
                }
          }
        >
          <BreathingRivePlayer
            key={riveMountKey}
            className="absolute inset-0"
            paused={paused}
            phase={phase}
            sessionActive={isActive}
            onPlaybackReady={onBreathingRivePlaybackReady}
          />
        </div>
      </motion.div>

      {/* Mobile active session — centered column above Sprout */}
      <AnimatePresence>
        {isMobile && isActive ? (
          <motion.div
            key="mobile-active"
            className="absolute inset-x-0 top-0 bottom-[38%] z-20 flex flex-col items-center px-4 pt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={SPRING}
          >
            <h2 className="shrink-0 text-center text-[1.0625rem] font-bold uppercase leading-tight tracking-tight text-black">
              Breathe with Sprout
            </h2>

            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-4 py-3">
              <p className="text-[1rem] font-semibold text-[#53b035]">
                {phaseInstruction(phase)}
              </p>
              <BreathingPerimeterCard
                progress={cycleProgress}
                timeLabel={formatMmSs(secondsRemaining)}
                className="w-[min(42cqh,46%,168px)]"
              />
              <div className="mt-1 flex items-center justify-center gap-3">
                {!paused ? (
                  <button
                    type="button"
                    onClick={() => setPaused(true)}
                    className="flex size-12 items-center justify-center rounded-full bg-[#ace23b] text-white transition hover:brightness-95"
                    aria-label="Pause"
                  >
                    <PauseIcon />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaused(false)}
                      className="flex size-12 items-center justify-center rounded-full bg-[#ace23b] text-white transition hover:brightness-95"
                      aria-label="Continue"
                    >
                      <PlayIcon />
                    </button>
                    <button
                      type="button"
                      onClick={endSessionToSetup}
                      className="flex h-12 items-center justify-center rounded-full bg-white px-6 text-[14px] font-bold text-[#53b035] shadow-sm transition hover:brightness-95"
                    >
                      End
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Chrome: title always; setup controls when idle (desktop active uses left chrome) */}
      <div
        className={`absolute z-20 flex min-w-0 flex-col transition-[width,background-color,inset] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMobile
            ? isActive
              ? "pointer-events-none invisible inset-y-0 left-0 w-0 overflow-hidden opacity-0"
              : "inset-x-0 top-0 h-auto max-h-[58%] bg-gradient-to-b from-[#F3FBDE] from-70% to-transparent px-4 pt-5 pb-2"
            : isActive
              ? "inset-y-0 left-0 w-[min(28%,220px)] bg-transparent px-[clamp(1.25rem,4%,2rem)] pt-[clamp(1.35rem,4.5%,1.875rem)] pb-[clamp(1.35rem,4.5cqh,1.875rem)]"
              : "inset-y-0 left-0 w-[min(46%,340px)] bg-[#F3FBDE] px-[clamp(1.25rem,4%,2rem)] pt-[clamp(1.35rem,4.5%,1.875rem)] pb-[clamp(1.35rem,4.5cqh,1.875rem)]"
        }`}
      >
        <div
          className={`min-w-0 shrink-0 ${
            isMobile ? "mx-auto w-full max-w-[20rem] text-center" : ""
          }`}
        >
          <h2
            className={`font-bold uppercase tracking-tight text-black ${
              isMobile
                ? "text-[1.0625rem] leading-tight"
                : "text-[clamp(0.875rem,1.3vw,1.25rem)]"
            }`}
          >
            Breathe with Sprout
          </h2>
          <p
            className={`mt-1.5 font-medium leading-[1.35] text-black transition-opacity duration-320 ${
              isMobile
                ? "mx-auto max-w-[18rem] text-[0.8125rem]"
                : "max-w-[270px] text-[clamp(0.75rem,1vw,0.9375rem)]"
            } ${hovered || isMobile ? "opacity-100" : "opacity-60"}`}
          >
            Take a moment to slow down and reset
          </p>
        </div>

        <div
          className={`relative flex min-h-0 min-w-0 flex-1 flex-col ${
            isMobile ? "mt-6" : "mt-[clamp(1.25rem,4cqh,1.75rem)]"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isActive && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className={`flex min-w-0 w-full flex-col ${
                  isMobile ? "max-w-none items-center" : "h-full max-w-[302px]"
                }`}
              >
                <div
                  className={`flex min-w-0 flex-col ${
                    isMobile
                      ? "w-full max-w-[20rem] items-center gap-5"
                      : "gap-[clamp(1rem,3.2cqh,1.35rem)]"
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      isMobile
                        ? "w-full items-center gap-2"
                        : "w-fit items-center gap-1.5"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 font-medium text-[#ace23b] ${
                        isMobile
                          ? "text-[1.0625rem]"
                          : "text-[clamp(1rem,1.45vw,1.25rem)]"
                      }`}
                    >
                      <span>4</span>
                      <span className="size-1 rounded-full bg-[#ace23b]" />
                      <span>4</span>
                      <span className="size-1 rounded-full bg-[#ace23b]" />
                      <span>4</span>
                      <span className="size-1 rounded-full bg-[#ace23b]" />
                      <span>4</span>
                    </div>
                    <p
                      className={`font-medium text-[rgba(83,176,53,0.6)] ${
                        isMobile
                          ? "text-center text-[0.75rem]"
                          : "whitespace-nowrap text-center text-[clamp(0.6875rem,0.9vw,0.8125rem)]"
                      }`}
                    >
                      Inhale - Hold - Exhale - Hold
                    </p>
                  </div>

                  <div
                    className={
                      isMobile
                        ? "grid w-full min-w-0 grid-cols-4 gap-2"
                        : "flex w-full gap-2"
                    }
                  >
                    {DURATIONS.map((m) => {
                      const selected = minutes === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMinutes(m)}
                          className={`flex min-w-0 items-center justify-center rounded-[30px] font-medium transition ${
                            isMobile
                              ? "h-10 px-1 text-[0.6875rem] leading-none"
                              : "h-10 flex-1 text-[clamp(0.75rem,0.95vw,0.875rem)]"
                          } ${
                            selected
                              ? "bg-white text-[#ace23b]"
                              : "bg-[#e8f3c8] text-black/40 hover:bg-white/80"
                          }`}
                        >
                          {m} min
                        </button>
                      );
                    })}
                  </div>

                  {isMobile ? (
                    <motion.button
                      type="button"
                      onClick={startSession}
                      className="mx-auto mt-1 flex h-12 w-[min(100%,12rem)] shrink-0 items-center justify-center rounded-[30px] bg-[#ace23b] text-[0.9375rem] font-medium text-[#fefffd] hover:brightness-95"
                      animate={
                        reduced ? { scale: 1 } : { scale: [1, 1.045, 1] }
                      }
                      transition={
                        reduced
                          ? undefined
                          : {
                              duration: 1.7,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      whileHover={reduced ? undefined : { scale: 1.06 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Start
                    </motion.button>
                  ) : null}
                </div>

                {!isMobile ? (
                  <motion.button
                    type="button"
                    onClick={startSession}
                    className="mt-auto flex h-11 w-44 shrink-0 items-center justify-center rounded-[30px] bg-[#ace23b] text-[clamp(0.8125rem,1vw,0.9375rem)] font-medium text-[#fefffd] hover:brightness-95"
                    animate={
                      reduced ? { scale: 1 } : { scale: [1, 1.045, 1] }
                    }
                    transition={
                      reduced
                        ? undefined
                        : {
                            duration: 1.7,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                    whileHover={reduced ? undefined : { scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Start
                  </motion.button>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pause / End — desktop only (mobile uses the centered active column) */}
      <AnimatePresence>
        {isActive && !isMobile ? (
          <motion.div
            key="pause"
            className="absolute left-[clamp(1.25rem,4%,2rem)] z-20 flex items-center gap-3"
            style={{
              bottom: `calc(50% - (${SQUARE_SIZE}) / 2 - 0.85rem)`,
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={SPRING}
          >
            {!paused ? (
              <button
                type="button"
                onClick={() => setPaused(true)}
                className="flex size-[clamp(3.25rem,7.5cqh,4rem)] items-center justify-center rounded-full bg-[#ace23b] text-white transition hover:brightness-95"
                aria-label="Pause"
              >
                <PauseIcon />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setPaused(false)}
                  className="flex size-[clamp(3.25rem,7.5cqh,4rem)] items-center justify-center rounded-full bg-[#ace23b] text-white transition hover:brightness-95"
                  aria-label="Continue"
                >
                  <PlayIcon />
                </button>
                <button
                  type="button"
                  onClick={endSessionToSetup}
                  className="flex h-[clamp(3.25rem,7.5cqh,4rem)] items-center justify-center rounded-full bg-white px-6 text-[14px] font-bold text-[#53b035] shadow-sm transition hover:brightness-95"
                >
                  End
                </button>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Center square + phase label — desktop only */}
      <AnimatePresence>
        {isActive && !isMobile ? (
          <motion.div
            key="square"
            className="pointer-events-none absolute inset-y-0 left-[18%] right-[38%] z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.88, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, x: 16 }}
            transition={SPRING}
          >
            <p className="mb-2 text-[clamp(0.8125rem,1.2vw,1.0625rem)] font-semibold text-[#53b035]">
              {phaseInstruction(phase)}
            </p>
            <BreathingPerimeterCard
              progress={cycleProgress}
              timeLabel={formatMmSs(secondsRemaining)}
              className="w-[min(44cqh,72%,170px)]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <rect x="4" y="3" width="3.5" height="12" rx="1" />
      <rect x="10.5" y="3" width="3.5" height="12" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <path d="M5.5 3.2v11.6L14.5 9 5.5 3.2z" />
    </svg>
  );
}

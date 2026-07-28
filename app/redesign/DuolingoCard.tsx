"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, type Transition } from "motion/react";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

const CARD = { w: 900, h: 586 } as const;
/** Bust cache after re-exporting Figma assets. */
const ASSET_V = "1";
const SEED_STREAK = 101;
const STREAK_STORAGE_KEY = "fredy-duolingo-streak";

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

function readStoredStreak(): number | null {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { streak?: number };
    return typeof parsed.streak === "number" && Number.isFinite(parsed.streak)
      ? Math.floor(parsed.streak)
      : null;
  } catch {
    return null;
  }
}

function writeStoredStreak(streak: number, updatedAt: string | null) {
  try {
    localStorage.setItem(
      STREAK_STORAGE_KEY,
      JSON.stringify({ streak, updatedAt }),
    );
  } catch {
    // private mode / blocked storage
  }
}

/** Hover slide (−130 → 42) as % of the 122-wide language rail (shared so text+flags stay aligned). */
const LANG_COL_W = 122;
const LANG_HOVER_X = `${((42 - -130) / LANG_COL_W) * 100}%`;
const LANG_REST = { x: 0 } as const;
const LANG_HOVER = { x: LANG_HOVER_X } as const;

type DuolingoCardProps = {
  className?: string;
  /** Server-resolved streak (live → file cache → seed). */
  initialStreak?: number;
};

export default function DuolingoCard({
  className,
  initialStreak = SEED_STREAK,
}: DuolingoCardProps) {
  const { active, reduced, handlers } = useCardHover();
  const [streak, setStreak] = useState(initialStreak);
  const animateFire = !reduced;

  useEffect(() => {
    let cancelled = false;

    // Seed browser cache once so offline revisits still have a last-known value.
    if (readStoredStreak() == null) {
      writeStoredStreak(initialStreak, null);
    }

    async function refresh() {
      try {
        const res = await fetch("/api/duolingo", { cache: "no-store" });
        if (!res.ok) throw new Error(`duolingo ${res.status}`);
        const data = (await res.json()) as {
          streak?: number;
          updatedAt?: string | null;
        };
        if (
          cancelled ||
          typeof data.streak !== "number" ||
          !Number.isFinite(data.streak)
        ) {
          return;
        }
        const next = Math.floor(data.streak);
        setStreak(next);
        writeStoredStreak(next, data.updatedAt ?? new Date().toISOString());
      } catch {
        if (cancelled) return;
        const stored = readStoredStreak();
        if (stored != null) setStreak(stored);
        // else keep initialStreak / current state
      }
    }

    void refresh();
    const id = window.setInterval(refresh, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [initialStreak]);

  return (
    <section
      className={`${styles.card} ${styles.aboutDuo} ${className ?? ""}`}
      aria-label={`Duolingo ${streak} day streak`}
      data-node-id="156:258"
      {...handlers}
      tabIndex={0}
    >
      <div className={styles.aboutDuoScene}>
        {/* Duo app icon — 90×90 at (768, 42) */}
        <div
          className={styles.aboutDuoIcon}
          data-node-id="152:1570"
          data-name="Duo Icon"
          style={{
            left: pct(768, CARD.w),
            top: pct(42, CARD.h),
            width: pct(90, CARD.w),
            height: pct(90, CARD.h),
          }}
        >
          <Image
            src={`/images/redesign/about/duo-icon.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="90px"
            unoptimized
          />
        </div>

        {/* Fire Animation — Figma loop 2s */}
        <div
          className={styles.aboutDuoFire}
          data-node-id="152:1571"
          data-name="Fire Animation"
        >
          <motion.div
            className={styles.aboutDuoFlameOuter}
            data-node-id="152:1572"
            style={{
              left: pct(381.68, CARD.w),
              top: pct(148.41, CARD.h),
              width: pct(119.336, CARD.w),
              height: pct(144.588, CARD.h),
            }}
            animate={
              animateFire
                ? {
                    rotate: [0, -1.5, 1, -0.8, 0],
                    scaleX: [1, 0.98, 1.02, 0.99, 1.01, 1],
                    scaleY: [1, 1.04, 0.98, 1.03, 0.99, 1],
                  }
                : undefined
            }
            transition={
              animateFire
                ? {
                    rotate: {
                      duration: 2,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                    scaleX: {
                      duration: 2,
                      times: [0, 0.175, 0.375, 0.6, 0.8, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                    scaleY: {
                      duration: 2,
                      times: [0, 0.2, 0.4, 0.65, 0.85, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                  }
                : undefined
            }
          >
            <Image
              src={`/images/redesign/about/flame-outer.svg?v=${ASSET_V}`}
              alt=""
              fill
              sizes="120px"
              unoptimized
            />
          </motion.div>

          <motion.div
            className={styles.aboutDuoFlameInner}
            data-node-id="152:1573"
            style={{
              left: pct(416.48, CARD.w),
              top: pct(205.63, CARD.h),
              width: pct(49.433, CARD.w),
              height: pct(63.525, CARD.h),
            }}
            animate={
              animateFire
                ? {
                    opacity: [1, 0.8, 1, 0.85, 1, 1],
                    scaleX: [1, 0.94, 1.04, 0.96, 1.02, 1],
                    scaleY: [1, 1.08, 0.95, 1.06, 0.97, 1],
                  }
                : undefined
            }
            transition={
              animateFire
                ? {
                    opacity: {
                      duration: 2,
                      times: [0, 0.2, 0.4, 0.65, 0.85, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                    scaleX: {
                      duration: 2,
                      times: [0, 0.125, 0.3, 0.5, 0.7, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                    scaleY: {
                      duration: 2,
                      times: [0, 0.15, 0.35, 0.55, 0.75, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                  }
                : undefined
            }
          >
            <Image
              src={`/images/redesign/about/flame-inner.svg?v=${ASSET_V}`}
              alt=""
              fill
              sizes="50px"
              unoptimized
            />
          </motion.div>

          <Spark
            nodeId="152:1574"
            left={376}
            top={129.89}
            size={20.46}
            animate={animateFire}
            opacity={[1, 1, 0, 0, 1, 0, 0]}
            scale={[1, 1, 0.4, 0.4, 1, 0.5, 0.5]}
            y={[0, 0, -45, -45, 0, -30]}
            opacityTimes={[0, 0.075, 0.425, 0.5499, 0.55, 0.925, 1]}
            scaleTimes={[0, 0.075, 0.45, 0.5499, 0.55, 0.95, 1]}
            yTimes={[0, 0.075, 0.5, 0.5499, 0.55, 1]}
          />
          <Spark
            nodeId="152:1575"
            left={501.03}
            top={173.65}
            size={22.733}
            animate={animateFire}
            opacity={[1, 1, 0, 0, 1, 0, 0]}
            scale={[1, 1, 0.35, 0.35, 1, 0.5, 0.5]}
            x={[0, 0, -8, -8, 0, 5]}
            y={[0, 0, -50, -50, 0, -25]}
            opacityTimes={[0, 0.2, 0.575, 0.6999, 0.7, 0.95, 1]}
            scaleTimes={[0, 0.2, 0.6, 0.6999, 0.7, 0.975, 1]}
            xyTimes={[0, 0.2, 0.65, 0.6999, 0.7, 1]}
          />
          <Spark
            nodeId="152:1576"
            left={393.05}
            top={110}
            size={11.366}
            animate={animateFire}
            opacity={[1, 0, 0, 1, 0, 0, 1, 0, 0]}
            scale={[1, 0.3, 0.3, 1, 0.3, 0.3, 1, 0.5, 0.5]}
            x={[0, 6, 6, 0, -5, -5, 0, 4]}
            y={[0, -35, -35, 0, -40, -40, 0, -20]}
            opacityTimes={[0, 0.25, 0.3499, 0.35, 0.65, 0.7499, 0.75, 0.95, 1]}
            scaleTimes={[0, 0.275, 0.3499, 0.35, 0.675, 0.7499, 0.75, 0.975, 1]}
            xyTimes={[0, 0.3, 0.3499, 0.35, 0.7, 0.7499, 0.75, 1]}
          />
        </div>

        {/* Streak Counter — live text (Figma 152:1577), not a flattened image */}
        <div
          className={styles.aboutDuoStreak}
          data-node-id="152:1577"
          data-name="Streak Counter"
        >
          <p className={styles.aboutDuoCount} data-node-id="152:1578">
            {streak}
          </p>
          <p className={styles.aboutDuoLabel} data-node-id="152:1579">
            Days Streak
          </p>
        </div>

        {/* Duo owl — flipped horizontally; fades out on hover */}
        <motion.div
          className={styles.aboutDuoOwl}
          data-node-id="152:1580"
          data-name="Duo"
          style={{
            left: pct(-26, CARD.w),
            top: pct(370, CARD.h),
            width: pct(201, CARD.w),
            height: pct(228, CARD.h),
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: active ? 0 : 1 }}
          transition={(active ? { ...HOVER_SPRING, delay: 0 } : REST_TRANSITION) as Transition}
        >
          <Image
            src={`/images/redesign/about/duo-owl.png?v=${ASSET_V}`}
            alt=""
            fill
            sizes="200px"
            unoptimized
          />
        </motion.div>

        {/* Language rail — one column so labels + flags share the same left edge */}
        <motion.div
          className={styles.aboutDuoLangRail}
          style={{
            left: pct(-130, CARD.w),
            width: pct(LANG_COL_W, CARD.w),
          }}
          initial={LANG_REST}
          animate={active ? LANG_HOVER : LANG_REST}
          transition={(active ? HOVER_SPRING : REST_TRANSITION) as Transition}
        >
          <p
            className={styles.aboutDuoLangTitle}
            data-node-id="152:1712"
            style={{ top: pct(119, CARD.h) }}
          >
            Learning
          </p>
          <div
            className={styles.aboutDuoFlag}
            data-node-id="152:1716"
            data-name="image 87"
            style={{
              top: pct(171, CARD.h),
              height: pct(73, CARD.h),
            }}
          >
            <Image
              src={`/images/redesign/about/flag-germany.png?v=${ASSET_V}`}
              alt="German"
              fill
              sizes="122px"
              unoptimized
            />
          </div>

          <p
            className={styles.aboutDuoLangTitle}
            data-node-id="152:1718"
            style={{ top: pct(269, CARD.h) }}
          >
            Fluent
          </p>
          <div
            className={styles.aboutDuoFlag}
            data-node-id="152:1714"
            data-name="image 85"
            style={{
              top: pct(314, CARD.h),
              height: pct(64, CARD.h),
            }}
          >
            <Image
              src={`/images/redesign/about/flag-us.png?v=${ASSET_V}`}
              alt="English"
              fill
              sizes="122px"
              unoptimized
            />
          </div>
          <div
            className={styles.aboutDuoFlag}
            data-node-id="152:1715"
            data-name="image 86"
            style={{
              top: pct(386, CARD.h),
              height: pct(81, CARD.h),
            }}
          >
            <Image
              src={`/images/redesign/about/flag-spain.png?v=${ASSET_V}`}
              alt="Spanish"
              fill
              sizes="122px"
              unoptimized
            />
          </div>
        </motion.div>
        {/* Connect CTA — bottom center, fades in on hover */}
        <motion.a
          className={styles.aboutDuoConnect}
          href="https://invite.duolingo.com/BDHTZTB5CWWKTGVPXYHY5FMD3I"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect on Duolingo"
          initial={{ opacity: 0, y: 16, x: "-50%" }}
          animate={
            active
              ? { opacity: 1, y: 0, x: "-50%" }
              : { opacity: 0, y: 16, x: "-50%" }
          }
          transition={(active ? { ...HOVER_SPRING, delay: 0.06 } : REST_TRANSITION) as Transition}
          style={{ pointerEvents: active ? "auto" : "none" }}
          tabIndex={active ? 0 : -1}
        >
          Connect
        </motion.a>
      </div>
    </section>
  );
}

function Spark({
  nodeId,
  left,
  top,
  size,
  animate,
  opacity,
  scale,
  x,
  y,
  opacityTimes,
  scaleTimes,
  yTimes,
  xyTimes,
}: {
  nodeId: string;
  left: number;
  top: number;
  size: number;
  animate: boolean;
  opacity: number[];
  scale: number[];
  x?: number[];
  y: number[];
  opacityTimes: number[];
  scaleTimes: number[];
  yTimes?: number[];
  xyTimes?: number[];
}) {
  const posTimes = xyTimes ?? yTimes ?? scaleTimes;

  return (
    <motion.div
      className={styles.aboutDuoSpark}
      data-node-id={nodeId}
      style={{
        left: pct(left, CARD.w),
        top: pct(top, CARD.h),
        width: pct(size, CARD.w),
        height: pct(size, CARD.h),
      }}
      animate={
        animate
          ? {
              opacity,
              scaleX: scale,
              scaleY: scale,
              ...(x ? { x } : {}),
              y,
            }
          : undefined
      }
      transition={
        animate
          ? {
              opacity: {
                duration: 2,
                times: opacityTimes,
                ease: "easeInOut",
                repeat: Infinity,
              },
              scaleX: {
                duration: 2,
                times: scaleTimes,
                ease: "easeInOut",
                repeat: Infinity,
              },
              scaleY: {
                duration: 2,
                times: scaleTimes,
                ease: "easeInOut",
                repeat: Infinity,
              },
              ...(x
                ? {
                    x: {
                      duration: 2,
                      times: posTimes,
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                  }
                : {}),
              y: {
                duration: 2,
                times: posTimes,
                ease: "easeInOut",
                repeat: Infinity,
              },
            }
          : undefined
      }
    >
      <Image
        src={`/images/redesign/about/spark.svg?v=${ASSET_V}`}
        alt=""
        fill
        sizes="24px"
        unoptimized
      />
    </motion.div>
  );
}

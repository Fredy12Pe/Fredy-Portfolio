"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

const CARD = { w: 688, h: 435 } as const;
const TILE = { w: 139, h: 139 } as const;
/** Expanded panel from Figma Frame 276 (99:271) */
const EXPANDED = { left: 42, top: 110, w: 592, h: 325 } as const;
/** Hover logo mask box (99:272) relative to card */
const HOVER_LOGO = { left: 112, top: 188, w: 170, h: 170 } as const;
/** Hover copy frame (99:276) */
const HOVER_COPY = { left: 318, top: 219, w: 246 } as const;

const ASSET_V = "2";
const TILE_BG = `/images/redesign/stack/tile-bg.svg?v=${ASSET_V}`;

const REST_TRANSITION = { type: "spring", duration: 0.28, bounce: 0 } as const;
const HOVER_SPRING = { type: "spring", duration: 0.4, bounce: 0.28 } as const;
const hoverSpring = (delay = 0) => ({ ...HOVER_SPRING, delay });

/** Uniform scale from the clicked tile — keeps radius/border crisp. */
const EXPAND_SPRING = { type: "spring", duration: 0.42, bounce: 0.2 } as const;
const EXPAND_EXIT = { type: "spring", duration: 0.28, bounce: 0 } as const;

/** Scatter offsets in design-px; converted to % of tile so they scale with the card. */
function scatterPct(dx: number, dy: number) {
  return {
    x: `${(dx / TILE.w) * 100}%`,
    y: `${(dy / TILE.h) * 100}%`,
  };
}

type Tool = {
  id: string;
  name: string;
  description: string;
  image: string;
  /** Assembled grid position in card design px (Figma rest) */
  left: number;
  top: number;
  /** Off-side rest offset (design px) before card hover */
  scatter: { x: number; y: number };
  /** Stagger delay when assembling */
  delay: number;
  /** Idle logo box inside the tile (design px) */
  logo: { left: number; top: number; w: number; h: number };
};

const TOOLS: Tool[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "Where I write most of my code these days.",
    image: `/images/redesign/stack/cursor.png?v=${ASSET_V}`,
    left: 48,
    top: 105,
    scatter: { x: -72, y: -14 },
    delay: 0,
    logo: { left: 27.51, top: 27.11, w: 83.99, h: 83.99 },
  },
  {
    id: "claude",
    name: "Claude",
    description: "What I use to think through messy problems.",
    image: `/images/redesign/stack/claude.png?v=${ASSET_V}`,
    left: 199,
    top: 105,
    scatter: { x: -44, y: 22 },
    delay: 0.04,
    logo: { left: 33, top: 33, w: 73, h: 73 },
  },
  {
    id: "gpt",
    name: "ChatGPT",
    description: "Great for quick drafts and bouncing ideas around.",
    image: `/images/redesign/stack/gpt.png?v=${ASSET_V}`,
    left: 350,
    top: 105,
    scatter: { x: 48, y: -18 },
    delay: 0.06,
    logo: { left: 4.35, top: 33, w: 129.91, h: 73 },
  },
  {
    id: "react",
    name: "React",
    description: "How I build pretty much every interface.",
    image: `/images/redesign/stack/react.png?v=${ASSET_V}`,
    left: 501,
    top: 105,
    scatter: { x: 78, y: 16 },
    delay: 0.02,
    logo: { left: 33, top: 36.93, w: 72.61, h: 64.76 },
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "The framework behind this site and most of my apps.",
    image: `/images/redesign/stack/nextjs.png?v=${ASSET_V}`,
    left: 48,
    top: 256,
    scatter: { x: -80, y: 20 },
    delay: 0.05,
    logo: { left: 26.72, top: 26.72, w: 85.56, h: 85.56 },
  },
  {
    id: "figma",
    name: "Figma",
    description: "Where designs start before they become code.",
    image: `/images/redesign/stack/figma.png?v=${ASSET_V}`,
    left: 199,
    top: 256,
    scatter: { x: -36, y: -20 },
    delay: 0.08,
    logo: { left: 45.17, top: 33, w: 48.67, h: 73 },
  },
  {
    id: "photoshop",
    name: "Photoshop",
    description: "Still the best place to push pixels around.",
    image: `/images/redesign/stack/photoshop.png?v=${ASSET_V}`,
    left: 350,
    top: 256,
    scatter: { x: 42, y: 24 },
    delay: 0.03,
    logo: { left: 31.82, top: 32.61, w: 74.96, h: 73.39 },
  },
  {
    id: "illustrator",
    name: "Illustrator",
    description: "Icons, logos, and anything that needs clean vectors.",
    image: `/images/redesign/stack/illustrator.png?v=${ASSET_V}`,
    left: 501,
    top: 256,
    scatter: { x: 84, y: -12 },
    delay: 0.07,
    logo: { left: 31.82, top: 33, w: 74.96, h: 73 },
  },
];

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

/** Transform origin = clicked tile center, as % of the expanded panel. */
function expandOrigin(tool: Tool) {
  const cx = tool.left + TILE.w / 2;
  const cy = tool.top + TILE.h / 2;
  return {
    x: `${((cx - EXPANDED.left) / EXPANDED.w) * 100}%`,
    y: `${((cy - EXPANDED.top) / EXPANDED.h) * 100}%`,
  };
}

type FavoriteStackCardProps = {
  className?: string;
};

export default function FavoriteStackCard({ className }: FavoriteStackCardProps) {
  const { forceHover, reduced, handlers } = useCardHover();
  const [cardHovered, setCardHovered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = TOOLS.find((t) => t.id === selectedId) ?? null;
  /** Tiles sit in the Figma grid while the card is hovered, or a detail panel is open. */
  const assembled = reduced || forceHover || cardHovered || selectedId != null;

  return (
    <section
      className={`${styles.card} ${styles.favoriteStack} ${className ?? ""}`}
      aria-label="Favorite Tool Stack"
      data-node-id="120:3013"
      onPointerEnter={() => {
        handlers.onPointerEnter();
        setCardHovered(true);
      }}
      onPointerLeave={() => {
        handlers.onPointerLeave();
        setCardHovered(false);
      }}
      onFocus={() => {
        handlers.onFocus();
        setCardHovered(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          handlers.onBlur();
          setCardHovered(false);
        }
      }}
    >
      <div className={styles.favoriteStackScene}>
        <p className={styles.favoriteStackTitle} data-node-id="120:3014">
          Favorite Tool Stack
        </p>

        {TOOLS.map((tool) => {
          const isSelected = selectedId === tool.id;
          const dimmed = selectedId != null && selectedId !== tool.id;

          return (
            <ToolTile
              key={tool.id}
              tool={tool}
              assembled={assembled}
              hidden={isSelected}
              dimmed={dimmed}
              reduced={reduced}
              onOpen={() => setSelectedId(tool.id)}
            />
          );
        })}

        <AnimatePresence>
          {selected ? (
            <ExpandedPanel
              key={selected.id}
              tool={selected}
              reduced={reduced}
              onClose={() => setSelectedId(null)}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {selectedId ? (
            <motion.button
              type="button"
              className={styles.favoriteStackClose}
              aria-label="Close tool details"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
              onClick={() => setSelectedId(null)}
            >
              <span aria-hidden className={styles.favoriteStackCloseIcon}>
                ×
              </span>
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ToolTile({
  tool,
  assembled,
  hidden,
  dimmed,
  reduced,
  onOpen,
}: {
  tool: Tool;
  assembled: boolean;
  hidden: boolean;
  dimmed: boolean;
  reduced: boolean;
  onOpen: () => void;
}) {
  const scatter = scatterPct(tool.scatter.x, tool.scatter.y);

  const assembleTransition = reduced
    ? ({ duration: 0 } as Transition)
    : assembled
      ? (hoverSpring(tool.delay) as Transition)
      : (REST_TRANSITION as Transition);

  return (
    <motion.button
      type="button"
      className={styles.favoriteStackTile}
      aria-label={`Open ${tool.name} details`}
      aria-expanded={false}
      data-tool={tool.id}
      initial={false}
      style={{
        left: pct(tool.left, CARD.w),
        top: pct(tool.top, CARD.h),
        width: pct(TILE.w, CARD.w),
        height: pct(TILE.h, CARD.h),
        pointerEvents: dimmed || hidden ? "none" : "auto",
      }}
      animate={{
        x: assembled ? 0 : scatter.x,
        y: assembled ? 0 : scatter.y,
        opacity: hidden || dimmed ? 0 : 1,
        zIndex: 1,
        scale: 1,
      }}
      whileHover={
        assembled && !reduced && !hidden && !dimmed
          ? { scale: 1.06, zIndex: 3 }
          : undefined
      }
      whileFocus={
        assembled && !reduced && !hidden && !dimmed
          ? { scale: 1.06, zIndex: 3 }
          : undefined
      }
      transition={
        reduced
          ? ({ duration: 0 } as Transition)
          : ({
              x: assembleTransition,
              y: assembleTransition,
              opacity: { duration: 0.16, ease: "easeOut" },
              scale: HOVER_SPRING,
            } as Transition)
      }
      onClick={onOpen}
    >
      <img
        className={styles.favoriteStackTileBg}
        src={TILE_BG}
        alt=""
        draggable={false}
      />

      <div
        className={styles.favoriteStackLogo}
        style={{
          left: pct(tool.logo.left, TILE.w),
          top: pct(tool.logo.top, TILE.h),
          width: pct(tool.logo.w, TILE.w),
          height: pct(tool.logo.h, TILE.h),
        }}
      >
        <Image
          src={tool.image}
          alt=""
          fill
          sizes="(max-width: 900px) 40vw, 12vw"
          className={styles.favoriteStackLogoImg}
          unoptimized
        />
      </div>
    </motion.button>
  );
}

function ExpandedPanel({
  tool,
  reduced,
  onClose,
}: {
  tool: Tool;
  reduced: boolean;
  onClose: () => void;
}) {
  const origin = expandOrigin(tool);
  const openTransition = reduced
    ? ({ duration: 0 } as Transition)
    : (EXPAND_SPRING as Transition);
  const exitTransition = reduced
    ? ({ duration: 0 } as Transition)
    : (EXPAND_EXIT as Transition);

  return (
    <motion.button
      type="button"
      className={styles.favoriteStackExpanded}
      aria-label={`${tool.name} details`}
      aria-expanded
      data-tool={tool.id}
      style={{
        left: pct(EXPANDED.left, CARD.w),
        top: pct(EXPANDED.top, CARD.h),
        width: pct(EXPANDED.w, CARD.w),
        height: pct(EXPANDED.h, CARD.h),
        transformOrigin: `${origin.x} ${origin.y}`,
      }}
      initial={reduced ? false : { opacity: 0, scale: 0.42 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          opacity: { duration: reduced ? 0 : 0.22, ease: "easeOut" },
          scale: openTransition,
        },
      }}
      exit={
        reduced
          ? undefined
          : {
              opacity: 0,
              scale: 0.42,
              transition: {
                opacity: { duration: 0.16, ease: "easeIn" },
                scale: exitTransition,
              },
            }
      }
      onClick={onClose}
    >
      <span className={styles.favoriteStackExpandedChrome} aria-hidden />

      <motion.div
        className={styles.favoriteStackExpandedContent}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduced ? undefined : { opacity: 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.22, delay: 0.06, ease: "easeOut" }
        }
      >
        <motion.div
          className={styles.favoriteStackLogo}
          style={{
            left: pct(HOVER_LOGO.left - EXPANDED.left, EXPANDED.w),
            top: pct(HOVER_LOGO.top - EXPANDED.top, EXPANDED.h),
            width: pct(HOVER_LOGO.w, EXPANDED.w),
            height: pct(HOVER_LOGO.h, EXPANDED.h),
          }}
          initial={reduced ? false : { opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            reduced
              ? { duration: 0 }
              : { ...EXPAND_SPRING, delay: 0.04 }
          }
        >
          <Image
            src={tool.image}
            alt=""
            fill
            sizes="(max-width: 900px) 50vw, 20vw"
            className={styles.favoriteStackLogoImg}
            unoptimized
          />
        </motion.div>

        <motion.div
          className={styles.favoriteStackCopy}
          style={{
            left: pct(HOVER_COPY.left - EXPANDED.left, EXPANDED.w),
            top: pct(HOVER_COPY.top - EXPANDED.top, EXPANDED.h),
            width: pct(HOVER_COPY.w, EXPANDED.w),
          }}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { ...EXPAND_SPRING, delay: 0.08 }
          }
        >
          <p className={styles.favoriteStackToolName}>{tool.name}</p>
          <p className={styles.favoriteStackToolDesc}>{tool.description}</p>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

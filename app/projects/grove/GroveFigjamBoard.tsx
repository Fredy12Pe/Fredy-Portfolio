"use client";

import { Caveat, Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { useState, type CSSProperties } from "react";
import { FramerPhoneMockup, PROJECT_BRIEF_MEDIA } from "./GroveDevice";
import { BOARD_TEXT, type BoardText } from "./boardText";
import styles from "./GroveFigjamBoard.module.css";

const GroveHeroRive = dynamic(() => import("./GroveHeroRive"), { ssr: false });
const inter = Inter({ subsets: ["latin"] });
const handwriting = Caveat({ subsets: ["latin"] });

/* The Grove FigJam board, shown exactly as designed: the board is exported from Figma as one
   picture, so the layout, text, arrows and colours match it. The live components sit over the
   device areas, so the sprout and the app walkthrough keep their animations and interactions.
   Coordinates are FigJam coordinates shifted by OFFSET (the top-left of the exported picture). */

export const OFFSET = { x: 2570, y: 4575 };
export const BOARD = { w: 9754, h: 6847 };
// The Grove flow frame ("Group 1"), which the canvas opens on
export const GROVE_FRAME = { x: -162 + OFFSET.x, y: -4575 + OFFSET.y, w: 1440, h: 3103 };

// The sprout card: its size on the board, and how much bigger it is drawn (scaled from its centre)
const HERO_CARD = { x: 244, y: 52, w: 672, h: 960 };
const HERO_SCALE = 1.15;
// The card is taller than the exported one, so its content moves down to sit in the middle of it
const HERO_CONTENT_DY = 30;
// Where the board opens: the sprout card, in the middle of the screen (board px)
export const HERO_START = { x: HERO_CARD.x + OFFSET.x, y: HERO_CARD.y + OFFSET.y, w: HERO_CARD.w, h: HERO_CARD.h };

function at(fx: number, fy: number, w: number, h: number): CSSProperties {
  return { left: fx + OFFSET.x, top: fy + OFFSET.y, width: w, height: h };
}

// A piece of the board's live text, placed at (left, top) within its parent
function boardTextStyle(item: BoardText, left: number, top: number): CSSProperties {
  return {
    left,
    top,
    width: item.w,
    height: item.h,
    fontSize: item.fs,
    fontWeight: item.wt,
    color: item.c,
    letterSpacing: item.ls ? `${item.ls}em` : undefined,
    lineHeight: item.lh ? `${item.lh}px` : undefined,
    textAlign: item.al,
    justifyContent: item.al === "center" ? "center" : "flex-start",
    alignItems: item.va === "center" ? "center" : "flex-start",
  };
}

function boardTextClass(item: BoardText) {
  return `${styles.text} ${item.f === "hand" ? handwriting.className : inter.className}`;
}

export default function GroveFigjamBoard() {
  // The screen shown on the phone, chosen with the screen picker beside it
  const [screen, setScreen] = useState(0);
  const media = PROJECT_BRIEF_MEDIA[screen];

  const heroText = BOARD_TEXT.filter((item) => item.g === "hero");
  const boardText = BOARD_TEXT.filter((item) => item.g !== "hero");

  return (
    <div className={styles.board}>
      {/* The sprout card, drawn live and scaled up from its centre. It sits under the picture, whose
          own card area is transparent, so the picture's pushpin and the rest stay on top. */}
      <div
        style={{
          position: "absolute",
          left: HERO_CARD.x + OFFSET.x,
          top: HERO_CARD.y + OFFSET.y,
          width: HERO_CARD.w,
          height: HERO_CARD.h,
          transform: `scale(${HERO_SCALE})`,
          transformOrigin: "50% 50%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "#f3fbde", borderRadius: 80 }} />

        {/* The sprout: the live Rive animation */}
        <div
          className={styles.cover}
          style={{ left: 328 - HERO_CARD.x, top: 405 - HERO_CARD.y + HERO_CONTENT_DY, width: 503, height: 424 }}
        >
          <GroveHeroRive contained />
        </div>

        {/* The card's title, subtitle and caption: live text */}
        {heroText.map((item, i) => (
          <div
            key={`hero-${i}`}
            className={boardTextClass(item)}
            style={boardTextStyle(item, item.x - HERO_CARD.x, item.y - HERO_CARD.y + HERO_CONTENT_DY)}
          >
            {item.t}
          </div>
        ))}

        {/* The pushpin, on the card's top-right corner. It is part of the card, so it scales with it. */}
        <img
          src="/projects/grove/board/pin.png"
          alt=""
          draggable={false}
          style={{ position: "absolute", left: 831 - HERO_CARD.x, top: -8 - HERO_CARD.y, width: 167, height: 167 }}
        />
      </div>

      <img
        className={styles.base}
        src="/projects/grove/board/full-board-clean2.png"
        alt="Grove case study board: the Grove daily growth flow, the sprout character, the app walkthrough, the brainstorm, problem, solution and outcome, real impact and the brand guide"
        draggable={false}
        width={BOARD.w}
        height={BOARD.h}
      />

      {/* The phone in the app walkthrough: the live device, sized to the exported phone. The exported
          phone and its shadow are painted over in the picture, so no background sits behind it. */}
      <div style={{ position: "absolute", ...at(24, -1044, 372, 770) }}>
        <div style={{ position: "absolute", left: 15, top: 19, width: 342, height: 727 }}>
          <FramerPhoneMockup phoneOnly activeMedia={screen} onMediaChange={setScreen} />
        </div>
      </div>

      {/* The screen picker: the buttons choose the screen on the phone. Replaces the exported
          label, heading, description and buttons, which are painted over in the picture. */}
      <div className={`${styles.picker} ${inter.className}`} style={at(464, -800, 520, 380)}>
        <p className={styles.pickerLabel}>Current View</p>
        <h3 className={styles.pickerTitle}>{media.title}</h3>
        <p className={styles.pickerText}>{media.description}</p>
        <div className={styles.pickerGrid}>
          {PROJECT_BRIEF_MEDIA.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-pressed={i === screen}
              onClick={() => setScreen(i)}
              className={`${styles.pickerButton} ${i === screen ? styles.pickerButtonActive : ""}`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* The board's text, live and selectable. The picture behind it has the text removed.
          Drawn last so it sits above the walkthrough. */}
      {boardText.map((item, i) => (
        <div
          key={i}
          className={boardTextClass(item)}
          style={boardTextStyle(item, item.x + OFFSET.x, item.y + OFFSET.y)}
        >
          {item.t}
        </div>
      ))}
    </div>
  );
}

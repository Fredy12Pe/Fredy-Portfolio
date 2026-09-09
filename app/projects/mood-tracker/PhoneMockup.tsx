"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./stage.module.css";
import { FRAME_HEIGHT, FRAME_WIDTH, useStageScale } from "./useStageScale";

const MOCKUP_WIDTH = 1470;
const MOCKUP_HEIGHT = 3000;
const SCREEN_LEFT_FRACTION = 0.052381;
const SCREEN_TOP_FRACTION = 0.022667;
const SCREEN_WIDTH_FRACTION = 0.894558;
const SCREEN_HEIGHT_FRACTION = 0.954333;

// Normalize the official 1470px frame so its screen aperture is exactly 440px wide.
const MOCKUP_SCALE = FRAME_WIDTH / (MOCKUP_WIDTH * SCREEN_WIDTH_FRACTION);
const DESIGN_WIDTH = MOCKUP_WIDTH * MOCKUP_SCALE;
const DESIGN_HEIGHT = MOCKUP_HEIGHT * MOCKUP_SCALE;
const SCREEN_LEFT = MOCKUP_WIDTH * SCREEN_LEFT_FRACTION * MOCKUP_SCALE;
const SCREEN_TOP = MOCKUP_HEIGHT * SCREEN_TOP_FRACTION * MOCKUP_SCALE;
const SCREEN_HEIGHT = MOCKUP_HEIGHT * SCREEN_HEIGHT_FRACTION * MOCKUP_SCALE;
// Let the screen artwork sit slightly beneath the opaque bezel so the
// transparent antialiased edge of the frame never exposes the page behind it.
const SCREEN_RADIUS = MOCKUP_WIDTH * 0.115 * MOCKUP_SCALE;
const SCREEN_BLEED = 3;
const SCREEN_SCALE_X = (FRAME_WIDTH + SCREEN_BLEED * 2) / FRAME_WIDTH;
const SCREEN_SCALE_Y = (SCREEN_HEIGHT + SCREEN_BLEED * 2) / FRAME_HEIGHT;

/** A hardware frame around a 440x956 screen, scaled to the width it is given. */
export default function PhoneMockup({ children }: { children: ReactNode }) {
  const { ref, ready } = useStageScale(DESIGN_WIDTH);

  return (
    <div
      ref={ref}
      className={`${styles.root} ${styles.phoneRoot}`}
      data-ready={ready ? "" : undefined}
      style={
        {
          "--design-width": DESIGN_WIDTH,
          "--design-height": DESIGN_HEIGHT,
          "--phone-mobile-scale": DESIGN_WIDTH / FRAME_WIDTH,
        } as React.CSSProperties
      }
    >
      <div className={styles.stage}>
        <div
          className={styles.phoneShadow}
          aria-hidden
          style={{
            position: "absolute",
            inset: DESIGN_WIDTH * 0.018,
            borderRadius: DESIGN_WIDTH * 0.18,
            boxShadow: "0 34px 38px rgba(20, 22, 27, 0.3)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          className={styles.phoneScreen}
          style={{
            position: "absolute",
            left: SCREEN_LEFT - SCREEN_BLEED,
            top: SCREEN_TOP - SCREEN_BLEED,
            width: FRAME_WIDTH + SCREEN_BLEED * 2,
            height: SCREEN_HEIGHT + SCREEN_BLEED * 2,
            borderRadius: SCREEN_RADIUS + SCREEN_BLEED,
            overflow: "hidden",
            background: "#000",
            zIndex: 10,
          }}
        >
          <div
            className={styles.phoneContent}
            style={{
              position: "absolute",
              inset: 0,
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              transform: `scale(${SCREEN_SCALE_X}, ${SCREEN_SCALE_Y})`,
              transformOrigin: "top left",
            }}
          >
            {children}

            <span
              className={styles.homeIndicator}
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                bottom: 9,
                transform: "translateX(-50%)",
                width: 140,
                height: 5,
                borderRadius: 3,
                background: "rgba(255,255,255,0.65)",
                zIndex: 20,
              }}
            />
          </div>
        </div>

        <Image
          className={styles.phoneFrame}
          aria-hidden
          alt=""
          src="/projects/mood-tracker/iphone-16-pro-max-natural-titanium.png"
          draggable={false}
          width={MOCKUP_WIDTH}
          height={MOCKUP_HEIGHT}
          priority
          style={{
            position: "absolute",
            inset: 0,
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
}

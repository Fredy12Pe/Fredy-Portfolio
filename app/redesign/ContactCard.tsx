"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactLiquidBg, { type LiquidPreset } from "./ContactLiquidBg";
import { usePageFade } from "./redesign-nav";
import { ROUTES } from "./routes";
import { useCardHover } from "./useCardHover";
import styles from "./redesign.module.css";

/** Narrow right-column contact card — Figma 405×435 */
const CARD = { w: 405, h: 435 } as const;
/** Fredy-Photoroom 1 (103:342) — AABB in card coords */
const PHOTO = { left: 44.27, top: 0, w: 299.78, h: 374.73 } as const;

/** Bust cache after swapping contact assets. */
const ASSET_V = "4";
const FREDY_PHOTO = `/images/redesign/contact/fredy.png?v=${ASSET_V}`;
const LIQUID_PRESETS: LiquidPreset[] = [
  "Prism",
  "Lava",
  "Plasma",
  "Pulse",
  "Vortex",
  "Mist",
];
const CONTACT_HREF = ROUTES.contact;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

type ContactCardProps = {
  className?: string;
};

export default function ContactCard({ className }: ContactCardProps) {
  const { reduced, forceHover } = useCardHover();
  const { fadeTo } = usePageFade();
  const [buttonHovered, setButtonHovered] = useState(false);
  const [buttonLiquidMounted, setButtonLiquidMounted] = useState(false);
  const [buttonPreset, setButtonPreset] = useState<LiquidPreset>("Prism");
  const liquidActive = !reduced;
  const showLiquid = (buttonHovered || forceHover) && liquidActive;

  function onButtonEnter() {
    setButtonHovered(true);
    if (liquidActive) {
      setButtonLiquidMounted(true);
      setButtonPreset((current) => {
        const alternatives = LIQUID_PRESETS.filter((preset) => preset !== current);
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      });
    }
  }

  return (
    <Link
      id="contact"
      href={CONTACT_HREF}
      className={`${styles.card} ${styles.contact} ${className ?? ""}`}
      aria-label="Get in contact"
      data-node-id="contact"
      onClick={(event) => {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        event.preventDefault();
        fadeTo(CONTACT_HREF);
      }}
    >
      <div className={styles.contactScene}>
        {/* Media 405×278 — liquid gradient bg + Fredy photo */}
        <div
          className={styles.contactMedia}
          style={{
            left: pct(0, CARD.w),
            top: pct(0, CARD.h),
            width: pct(405, CARD.w),
            height: pct(278, CARD.h),
          }}
        >
          <ContactLiquidBg
            className={`${styles.contactLiquid}${showLiquid ? ` ${styles.contactLiquidActive}` : ""}`}
            active={showLiquid}
            preset={buttonPreset}
          />
          <div
            className={styles.contactPhoto}
            style={{
              left: pct(PHOTO.left, 405),
              top: pct(PHOTO.top, 278),
              width: pct(PHOTO.w, 405),
              height: pct(PHOTO.h, 278),
            }}
            data-node-id="103:342"
            data-name="Fredy-Photoroom 1"
          >
            <Image
              src={FREDY_PHOTO}
              alt=""
              fill
              sizes="(max-width: 900px) 80vw, 18vw"
              className={styles.contactPhotoImg}
              unoptimized
              priority
            />
          </div>
        </div>

        {/* CTA — liquid gradient on hover */}
        <div
          className={styles.contactButton}
          style={{
            left: pct(72, CARD.w),
            bottom: pct(42, CARD.h),
            width: pct(260, CARD.w),
            height: pct(68, CARD.h),
          }}
          onPointerEnter={onButtonEnter}
          onPointerLeave={() => setButtonHovered(false)}
        >
          {buttonLiquidMounted || forceHover ? (
            <ContactLiquidBg
              className={`${styles.contactButtonLiquid}${showLiquid ? ` ${styles.contactButtonLiquidActive}` : ""}`}
              active={showLiquid}
              preset={buttonPreset}
            />
          ) : null}
          <span className={styles.contactButtonLabel}>GET IN CONTACT</span>
        </div>
      </div>
    </Link>
  );
}

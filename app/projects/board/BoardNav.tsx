"use client";

import Link from "next/link";
import { roboto } from "@/lib/fonts";
import HeaderNav, { HEADER_NAV_ITEMS } from "../../(portfolio)/HeaderNav";
import { PhoneMenu, PhonePlayButton } from "../../(portfolio)/MobileMenu";
import styles from "./BoardNav.module.css";
import BoardMusic from "./BoardMusic";

// The site's menu on each case study. Tablet and up show the same liquid pill nav as the home page;
// phones get a round menu button instead, since the pill's labels are too small to read there.
// The logo links home, and the music plays the same audio as the home page, with the same mini player.
export default function BoardNav() {
  return (
    <div className={roboto.className}>
      <Link href="/" aria-label="Home" className="fixed left-4 top-5 z-50 md:left-6 md:top-3">
        {/* The logo is white on its file; the filter makes it black */}
        <img src="/images/figma-header/signature.svg" alt="Fredy" className="h-11 md:h-10" style={{ filter: "brightness(0)" }} />
      </Link>
      {/* The same dark glass and white text as the home page's menu, so it stands out from the light board */}
      <div className={`${styles.pill} fixed left-1/2 top-[14px] z-50 hidden -translate-x-1/2 md:block`}>
        <HeaderNav items={HEADER_NAV_ITEMS} />
      </div>
      <PhoneMenu tone="light" className="fixed right-4 top-3 z-50 md:right-[76px]" />
      {/* Phones: the round play button beside the menu, shown while music plays */}
      <PhonePlayButton className="fixed right-[76px] top-3 z-50 md:hidden" />
      {/* Tablet and up: the mini player at the top right, shown while music plays */}
      <BoardMusic />
    </div>
  );
}

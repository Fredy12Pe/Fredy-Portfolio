"use client";

import { useEffect, useState } from "react";
import { roboto } from "@/lib/fonts";
import { getMusicControls, useMusicMuted } from "./music-bridge";
import { coverForSource } from "./music";
import HeaderNav, { HEADER_NAV_ITEMS } from "./HeaderNav";
import { PhoneMenu, PhonePlayButton } from "./MobileMenu";
import styles from "./StickyMenu.module.css";

/* The site menu. It starts where the header's menu is, and CSS sticky keeps it at the top of the
   screen once the page has scrolled past it, so it follows the page without any JavaScript
   moving it. Once scrolled it glides to the centre. A single element, never remounted. */
const FOLLOW_AFTER_PX = 40;

export default function StickyMenu() {
  const [stuck, setStuck] = useState(false);
  // Diagnostic: ?nomenu=1 turns this menu off, to compare a page load with and without it
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("nomenu")) setDisabled(true);
  }, []);

  useEffect(() => {
    const update = () => setStuck(window.scrollY > FOLLOW_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (disabled) return null;

  return (
    <div className={`${styles.anchor} ${roboto.className}`} data-sticky-menu>
      {/* Phones: the menu and the play button sit in the top corners, where a thumb reaches them.
          The wrapper ignores touches, so the page under it still scrolls and taps through. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 flex items-start justify-end gap-2.5 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] md:hidden">
        {/* The play button shows only while music plays, to pause it; it sits beside the menu */}
        <PhonePlayButton className="pointer-events-auto" />
        <PhoneMenu className="pointer-events-auto" />
      </div>
      {/* Tablet and up: the pill nav with its mini player */}
      <div className={`${styles.menu} hidden md:block`} data-stuck={stuck ? "" : undefined}>
        <HeaderNav items={HEADER_NAV_ITEMS} />
        <MiniPlayer />
      </div>
    </div>
  );
}

/* Beside the menu: the album, then previous, play or pause, next and mute. It follows the
   audio's own play and pause events, so it never re-renders the page during playback. */
export function MiniPlayer({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [cover, setCover] = useState(coverForSource(""));
  const muted = useMusicMuted();

  useEffect(() => {
    const audio = document.querySelector<HTMLAudioElement>("[data-music-audio]");
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    const onTrack = () => setCover(coverForSource(audio.src));

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onStop);
    audio.addEventListener("ended", onStop);
    audio.addEventListener("loadstart", onTrack);
    setPlaying(!audio.paused);
    onTrack();

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onStop);
      audio.removeEventListener("ended", onStop);
      audio.removeEventListener("loadstart", onTrack);
    };
  }, []);

  return (
    <div className={`${styles.playhead} ${className}`} data-playing={playing ? "" : undefined}>
      <img className={styles.art} src={cover} alt="" />
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.button}
          aria-label="Previous track"
          onClick={() => getMusicControls()?.previous()}
        >
          <img src="/images/figma-header/skip-back.svg" alt="" width={20} height={20} />
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          onClick={() => getMusicControls()?.togglePlay()}
        >
          {playing ? (
            <svg className={styles.pause} viewBox="0 0 32 32" aria-hidden>
              <rect x="8" y="6" width="5" height="20" rx="1" />
              <rect x="19" y="6" width="5" height="20" rx="1" />
            </svg>
          ) : (
            <img src="/images/figma-header/play.svg" alt="" width={20} height={20} />
          )}
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label="Next track"
          onClick={() => getMusicControls()?.next()}
        >
          <img src="/images/figma-header/skip-forward.svg" alt="" width={20} height={20} />
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label={muted ? "Unmute" : "Mute"}
          aria-pressed={muted}
          onClick={() => getMusicControls()?.toggleMute()}
        >
          <svg className={styles.mute} viewBox="0 0 24 24" aria-hidden>
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
          </svg>
        </button>
      </div>
    </div>
  );
}

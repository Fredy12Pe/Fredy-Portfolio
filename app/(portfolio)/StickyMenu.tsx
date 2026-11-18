"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { inter } from "@/lib/fonts";
import { getMusicControls, useMusicMuted } from "./music-bridge";
import { coverForSource } from "./music";
import SiteNav, { HOME_NAV_ITEMS } from "./SiteNav";
import { PhoneMenu, PhonePlayButton } from "./MobileMenu";
import styles from "./StickyMenu.module.css";

/* The site's header bar, flush with the top of the screen from the first screen down and staying
   there while the page scrolls. On tablet and up it replaces the header's own logo and section
   buttons (hidden in SiteHeader.module.css once the intro has played). */

/* phoneLogo: pages without the home page's header (the case studies) show the signature at the top
   left on phones too, opposite the menu button. phone: false leaves out the phone controls, for a
   page that is a full-screen app on phones (the Mood Tracker). */
export default function StickyMenu({
  phoneLogo = false,
  phone = true,
}: {
  phoneLogo?: boolean;
  phone?: boolean;
}) {
  const [stuck, setStuck] = useState(false);
  // Diagnostic: ?nomenu=1 turns this menu off, to compare a page load with and without it
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("nomenu"))
      setDisabled(true);
  }, []);

  // In place from the first screen, as the site's header bar. Set after mounting, so it drops in.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setStuck(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (disabled) return null;

  return (
    <div className={`${styles.anchor} ${inter.className}`} data-sticky-menu>
      {/* Phones: the menu and the play button sit in the top corners, where a thumb reaches them.
          The wrapper ignores touches, so the page under it still scrolls and taps through. */}
      {phone ? (
        <div className="pointer-events-none fixed inset-x-0 top-0 flex items-start justify-end gap-2.5 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] md:hidden">
          {phoneLogo ? (
            <Link
              href="/"
              aria-label="Fredy, home"
              className="pointer-events-auto mr-auto inline-flex h-[52px] items-center rounded-full bg-black/55 px-4 ring-1 ring-white/15 backdrop-blur-md"
            >
              <img
                src="/images/figma-header/signature.svg"
                alt=""
                className="h-7 w-auto"
              />
            </Link>
          ) : null}
          {/* The play button shows only while music plays, to pause it; it sits beside the menu */}
          <PhonePlayButton className="pointer-events-auto" />
          <PhoneMenu
            className="pointer-events-auto"
            items={HOME_NAV_ITEMS}
            home
          />
        </div>
      ) : null}
      {/* Tablet and up: the section menu, Let's connect, and the mini player */}
      <div
        className={`${styles.menu} hidden md:block`}
        data-stuck={stuck ? "" : undefined}
      >
        <SiteNav />
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
    const audio =
      document.querySelector<HTMLAudioElement>("[data-music-audio]");
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
    <div
      className={`${styles.playhead} ${className}`}
      data-playing={playing ? "" : undefined}
    >
      <img className={styles.art} src={cover} alt="" />
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.button}
          aria-label="Previous track"
          onClick={() => getMusicControls()?.previous()}
        >
          <img
            src="/images/figma-header/skip-back.svg"
            alt=""
            width={20}
            height={20}
          />
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
            <img
              src="/images/figma-header/play.svg"
              alt=""
              width={20}
              height={20}
            />
          )}
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label="Next track"
          onClick={() => getMusicControls()?.next()}
        >
          <img
            src="/images/figma-header/skip-forward.svg"
            alt=""
            width={20}
            height={20}
          />
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
            {muted ? (
              <path d="M16 9l5 6M21 9l-5 6" />
            ) : (
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

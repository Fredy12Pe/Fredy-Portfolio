"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { inter } from "@/lib/fonts";
import { HEADER_NAV_ITEMS } from "./HeaderNav";
import { glideOnHome } from "./nav-glide";
import { CONNECT_ITEM, readSection } from "./SiteNav";
import { CONTACT_LINKS } from "../redesign/contact-links";
import { getMusicControls } from "./music-bridge";
import { getMusicAudio } from "./persistent-audio";
import { MUSIC_TRACKS } from "./music";

// The phone menu. Below the md breakpoint (768px) the pill nav is too small to tap, so a round
// menu button opens the same links as a full-screen sheet. Tablet and up keep the pill.

type Tone = "dark" | "light";

const toneClass: Record<Tone, string> = {
  dark: "bg-black/55 text-white ring-1 ring-white/15 backdrop-blur-md",
  light: "bg-white text-zinc-900 shadow-[0_4px_14px_rgba(0,0,0,0.12)]",
};

// 52px buttons: comfortable to tap, and large enough to read on a phone
const roundButton = "inline-flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full md:hidden";

type MenuItem = { label: string; href: string; id?: string };

/* items: the links in the sheet (the case studies' three by default). home: the home page's
   version, which marks the section being read and ends with Let's connect and the resume. */
export function PhoneMenu({
  className = "",
  tone = "dark",
  items = HEADER_NAV_ITEMS,
  home = false,
}: {
  className?: string;
  tone?: Tone;
  items?: MenuItem[];
  home?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Closing hands focus back to the button, so keyboard users land where they were
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => (open ? close() : setOpen(true))}
        className={`${roundButton} ${toneClass[tone]} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {/* Rendered at the end of <body>, above everything: inside the menu's own sticky layer, parts
          of the page painted over it and caught taps meant for its links */}
      {open ? createPortal(<MenuSheet onClose={close} items={items} home={home} />, document.body) : null}
    </>
  );
}

function MenuSheet({ onClose, items, home }: { onClose: () => void; items: MenuItem[]; home: boolean }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // The section on screen when the sheet opened, marked in the list
  const [current] = useState(() => (home ? readSection().id : null));

  // Stops the page behind the sheet from scrolling, takes focus, and closes on Escape
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={`fixed inset-0 z-[1100] flex flex-col bg-[#0b0b0c] text-white ${inter.className}`}
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-end px-4 pt-3">
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className={`${roundButton} bg-white/10 text-white`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <nav aria-label="Site" className="flex flex-1 flex-col justify-center gap-1 px-8">
        {items.map((item) => {
          const here = home && item.id === current;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={here ? "location" : undefined}
              onClick={(event) => {
                onClose();
                glideOnHome(event, item.href);
              }}
              className={`flex items-center gap-3 py-3 text-[32px] font-medium leading-tight tracking-tight ${
                here ? "text-white" : home ? "text-white/60" : "text-white"
              }`}
            >
              {here ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ffb45c]" aria-hidden /> : null}
              {item.label}
            </Link>
          );
        })}
      </nav>
      {home ? (
        <div className="flex flex-col gap-3 px-8 pb-8">
          <Link
            href={CONNECT_ITEM.href}
            onClick={(event) => {
              onClose();
              glideOnHome(event, CONNECT_ITEM.href);
            }}
            className="flex h-14 items-center justify-center rounded-full bg-white px-6 text-[17px] font-semibold text-[#0b1314]"
          >
            {CONNECT_ITEM.label}
          </Link>
          <a
            href={CONTACT_LINKS.resume}
            download
            className="flex h-14 items-center justify-center gap-2 rounded-full text-[17px] font-medium text-white ring-1 ring-white/25"
          >
            Download resume
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
            </svg>
          </a>
        </div>
      ) : null}
    </div>
  );
}

// Play and pause, beside the menu on phones. It drives the same audio as the header player and
// the case studies, so the music carries on from page to page.
export function PhonePlayButton({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = getMusicAudio();
    if (!audio) return;
    const sync = () => setPlaying(!audio.paused);
    sync();
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("ended", sync);
    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("ended", sync);
    };
  }, []);

  // The header's player is registered once it mounts; before that, play the audio directly
  const toggle = () => {
    const controls = getMusicControls();
    if (controls) {
      controls.togglePlay();
      return;
    }
    const audio = getMusicAudio();
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (!audio.getAttribute("src")) audio.src = `/music/${MUSIC_TRACKS[0].file}`;
    void audio.play();
  };

  // Hidden while the music is paused; it shows only to pause what is playing
  if (!playing) return null;

  return (
    <button
      type="button"
      aria-label="Pause music"
      aria-pressed={true}
      onClick={toggle}
      className={`${roundButton} ${toneClass.dark} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </button>
  );
}

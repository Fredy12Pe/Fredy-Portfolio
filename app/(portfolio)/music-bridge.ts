"use client";

import { useSyncExternalStore } from "react";

/* The header's music controls, shared with the menu beside the page so its buttons can drive
   the same player. Registered by the header's music widget on each render. */
export type MusicControls = {
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  toggleMute: () => void;
};

let controls: MusicControls | null = null;
let muted = false;
const listeners = new Set<() => void>();

export function registerMusicControls(next: MusicControls, isMuted: boolean) {
  controls = next;
  if (isMuted === muted) return;
  muted = isMuted;
  listeners.forEach((listen) => listen());
}

export function getMusicControls() {
  return controls;
}

function subscribe(listen: () => void) {
  listeners.add(listen);
  return () => {
    listeners.delete(listen);
  };
}

export function useMusicMuted() {
  return useSyncExternalStore(subscribe, () => muted, () => false);
}

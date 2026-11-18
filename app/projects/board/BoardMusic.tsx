"use client";

import { useEffect, useRef } from "react";
import { START_VOLUME, useMusicPlayer } from "../../(portfolio)/music";
import { registerMusicControls } from "../../(portfolio)/music-bridge";
import { getMusicAudio } from "../../(portfolio)/persistent-audio";

// The music on the case studies. The home page's header runs the player; here it is run from the
// case study's nav, on the same shared audio, so the music carries on from the home page.
export default function BoardMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(getMusicAudio());
  const music = useMusicPlayer(audioRef);

  // Shares these controls with the mini player and the phone's play button (see StickyMenu, MobileMenu)
  useEffect(() => {
    registerMusicControls(
      {
        togglePlay: music.togglePlay,
        next: music.next,
        previous: music.previous,
        toggleMute: music.toggleMute,
      },
      music.muted,
    );
  });

  // The same quiet start level as the home page's header
  useEffect(() => {
    music.setOutputLevel(START_VOLUME);
  }, [music.setOutputLevel]);

  // The player itself is the bar's mini player (StickyMenu); this only runs the music behind it
  return null;
}

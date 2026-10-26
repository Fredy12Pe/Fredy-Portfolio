// The music's audio element. It lives in the page body, outside React, so it keeps playing when
// the page changes between the home page and a case study.
export function getMusicAudio(): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  const existing = document.querySelector<HTMLAudioElement>("audio[data-music-audio]");
  if (existing) return existing;
  const audio = document.createElement("audio");
  audio.preload = "none";
  audio.setAttribute("data-music-audio", "");
  document.body.appendChild(audio);
  return audio;
}

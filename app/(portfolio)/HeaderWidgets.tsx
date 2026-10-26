"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MOODS, type MoodId } from "../projects/mood-tracker/moods";
import MoodCharacter from "./MoodCharacter";
import { START_VOLUME, useMusicPlayer } from "./music";
import { registerMusicControls } from "./music-bridge";
import { getMusicAudio } from "./persistent-audio";
import styles from "./HeaderWidgets.module.css";

/* Figma 145:1391, 146:1411 and 144:658 — weather and music widgets on the header board */
export default function HeaderWidgets() {
  // The shared element, so the music carries on from the case study pages
  const audioRef = React.useRef<HTMLAudioElement | null>(getMusicAudio());
  const music = useMusicPlayer(audioRef);
  const { setOutputLevel, playing } = music;

  // Shares these controls with the menu beside the page (see StickyMenu)
  React.useEffect(() => {
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

  // The music's output level. Browsers can't change the device volume, so this sets how
  // loud the page's own audio is. It starts quiet and is not adjustable from the header.
  React.useEffect(() => {
    setOutputLevel(START_VOLUME);
  }, [setOutputLevel]);

  return (
    <div className={styles.group}>
      <WeatherWidget />
      <MoodWidget />
      <MusicWidget
        music={music}
        expanded={playing}
      />
    </div>
  );
}

const WEATHER_CITY = { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 };
const WEATHER_REFRESH_MS = 15 * 60 * 1000;

// WMO weather codes from Open-Meteo, grouped into the words shown on the card
function describeWeather(code: number) {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Storm";
  return "Cloudy";
}

type WeatherData = { temp: number; high: number; low: number; condition: string };

function WeatherWidget() {
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${WEATHER_CITY.latitude}&longitude=${WEATHER_CITY.longitude}` +
      "&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min" +
      "&temperature_unit=fahrenheit&timezone=auto&forecast_days=1";

    const load = () =>
      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setWeather({
            temp: data.current.temperature_2m,
            high: data.daily.temperature_2m_max[0],
            low: data.daily.temperature_2m_min[0],
            condition: describeWeather(data.current.weather_code),
          });
          setFailed(false);
        })
        .catch(() => {
          if (!controller.signal.aborted) setFailed(true);
        });

    load();
    const timer = window.setInterval(load, WEATHER_REFRESH_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles.weather}>
      <div className={`${styles.card} ${styles.weatherCard}`}>
        <span className={styles.glassLayer} aria-hidden />
        <span className={styles.weatherClear} aria-hidden />
        <span className={styles.weatherOverlay} aria-hidden />

        <div className={styles.cityTemp}>
          <div className={styles.cityRow}>
            <p className={styles.city}>{WEATHER_CITY.name}</p>
            <Image
              className={styles.location}
              src="/images/figma-header/widget-location.svg"
              alt=""
              width={9}
              height={9}
              unoptimized
            />
          </div>
          <p className={styles.temp}>
            {weather ? `${Math.round(weather.temp)}°` : failed ? "--°" : ""}
          </p>
        </div>

        <div className={styles.summary}>
          <Image
            className={styles.sun}
            src="/images/figma-header/widget-sun.svg"
            alt=""
            width={19}
            height={19}
            unoptimized
          />
          <div className={styles.details}>
            <p>{weather ? weather.condition : failed ? "Unavailable" : "Loading…"}</p>
            <p>
              {weather ? `H:${Math.round(weather.high)}° L:${Math.round(weather.low)}°` : ""}
            </p>
          </div>
        </div>
      </div>
      <p className={`${styles.label} ${styles.weatherLabel}`}>Fredy&apos;s Location</p>
    </div>
  );
}

const MOOD_START_INDEX = MOODS.findIndex((mood) => mood.id === "happy");

// Ten witty lines per mood; one is picked at random each time a reply pops up
const MOOD_REPLIES: Record<MoodId, string[]> = {
  "freaking-out": [
    "Deep breaths. Mostly.",
    "Nothing is on fire. Probably.",
    "Let's pretend this is a calm day.",
    "Hair, pants, and feelings: all on fire.",
    "Maybe the snacks will help.",
    "Phone down, shoulders down.",
    "Panic is just excitement in a hurry.",
    "One thing at a time. Start with breathing.",
    "The bad news can wait until after lunch.",
    "This feeling is loud, but it's temporary.",
  ],
  sad: [
    "Rain never lasts forever. Usually.",
    "Hot chocolate is a valid response.",
    "Blankets have been known to help.",
    "Your feelings are allowed to take up space.",
    "Tomorrow is a fresh sheet of paper.",
    "Tea, a playlist, and no emails. Deal?",
    "Even clouds move along eventually.",
    "I'll be here if you need a minute.",
    "Sad days are for slow songs.",
    "Sunshine's on backorder. Hang in there.",
  ],
  anxious: [
    "Your to-do list can wait five minutes.",
    "Breathe in for four. Out for six.",
    "Most things we worry about never happen.",
    "Put the phone down. The world will wait.",
    "One small step is still a step.",
    "Your brain is just overachieving today.",
    "Sip some water. Shoulders down.",
    "You've handled hard days before. This one too.",
    "Worry is a lot of effort for nothing.",
    "Name three things you can see right now.",
  ],
  tired: [
    "Nap detected. Good call.",
    "Coffee has entered the chat.",
    "Sleep is a productivity hack, right?",
    "Horizontal is an acceptable position.",
    "Five more minutes of blankets. Earned.",
    "Your battery is at 4%. Time to charge.",
    "Yawns are contagious. Sorry.",
    "Let's be a potato for a bit.",
    "Dreams are waiting. Go get them.",
    "Snooze is a love language.",
  ],
  meh: [
    "Meh is a valid mood, honestly.",
    "Mediocre days are underrated.",
    "Not bad, not great. Just vibing.",
    "Lukewarm coffee, same energy.",
    "Sometimes meh is the plot twist.",
    "Even a plain sandwich is still lunch.",
    "Could be worse. Could be a Monday.",
    "A shrug is basically a full sentence.",
    "Mild is a flavour too.",
    "Let's aim for slightly better than meh.",
  ],
  content: [
    "Content looks good on you.",
    "Good vibes only, for now.",
    "Tiny joys are doing their job.",
    "Sitting back and enjoying the moment.",
    "Happiness is quietly showing up.",
    "This is what peace looks like.",
    "No notes. Just a nice Tuesday.",
    "Keep it cozy. You've earned it.",
    "A warm drink and a soft chair. Perfect.",
    "Life is good when nothing is urgent.",
  ],
  happy: [
    "Yep, it's Friday.",
    "Your smile is contagious.",
    "Sunshine looks good on you.",
    "Dancing is allowed. Encouraged, even.",
    "Who needs sunshine with that grin?",
    "Happiness looks great on you.",
    "Good mood detected. Spread it around.",
    "Okay, now the playlist is mandatory.",
    "Keep that energy. It's working.",
    "Somebody's having a good day.",
  ],
  excited: [
    "Okay, calm down. Actually, don't.",
    "Easy, you'll pop a spring.",
    "This energy is illegal in some countries.",
    "Save some confetti for later.",
    "Hold on, is that a dance break?",
    "Patience is also a superpower.",
    "Your excitement is contagious. Keep going.",
    "Zero to a hundred. Impressive.",
    "Good news? Tell me everything.",
    "Please don't spill the fizzy drink.",
  ],
  overjoyed: [
    "Somebody had a great coffee.",
    "Lottery numbers, anyone?",
    "Rainbows are jealous of this.",
    "This is peak main-character energy.",
    "You're basically glowing.",
    "Pure joy detected. Please bottle it.",
    "Confetti budget approved.",
    "Dancing in the kitchen counts, right?",
    "Scientists are studying this smile.",
    "I'll have what you're having.",
  ],
  angry: [
    "Step away from the keyboard.",
    "Breathe. Rage later, if you still want to.",
    "Deep breath. The coffee is just wrong.",
    "Your blood pressure has opinions.",
    "Pillows are great for screaming into.",
    "Is this a problem for future you?",
    "Let's shake it off with a walk.",
    "Tone it down. Your face is loud.",
    "Revenge is a dish best served cold.",
    "Take five. The mess will still be there.",
  ],
};

const pickReply = (mood: MoodId) => {
  const lines = MOOD_REPLIES[mood];
  return lines[Math.floor(Math.random() * lines.length)];
};

const REPLY_DELAY_MS = 2000;
const REPLY_VISIBLE_MS = 6000;

/* Emotions: the mood tracker's characters, one at a time, after pressing start */
function MoodWidget() {
  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(MOOD_START_INDEX);
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const mood = MOODS[index];
  const changeMood = (next: number) => setIndex(Math.max(0, Math.min(MOODS.length - 1, next)));

  // A mood that is held for a while gets a reply; changing mood starts the wait again
  React.useEffect(() => {
    if (!started) return;
    setReplyOpen(false);
    const show = window.setTimeout(() => {
      setReply(pickReply(MOODS[index].id));
      setReplyOpen(true);
    }, REPLY_DELAY_MS);
    const hide = window.setTimeout(() => setReplyOpen(false), REPLY_DELAY_MS + REPLY_VISIBLE_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [started, index]);

  return (
    <div className={styles.mood}>
      <div className={`${styles.card} ${styles.moodCard}`}>
        <span className={styles.glassLayer} aria-hidden />
        <span className={styles.musicTint} aria-hidden />
        <span className={styles.musicOverlay} aria-hidden />

        {started ? (
          <>
            <div className={styles.moodHeader}>
              <p className={styles.moodName}>{mood.label}</p>
              <button
                type="button"
                className={`${styles.moodArrow} ${styles.moodArrowPrev}`}
                onClick={() => changeMood(index - 1)}
                disabled={index === 0}
                aria-label="Previous mood"
              >
                <svg aria-hidden viewBox="0 0 24 24">
                  <path d="m15 5-7 7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.moodArrow} ${styles.moodArrowNext}`}
                onClick={() => changeMood(index + 1)}
                disabled={index === MOODS.length - 1}
                aria-label="Next mood"
              >
                <svg aria-hidden viewBox="0 0 24 24">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className={styles.moodArt}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mood.id}
                  className={styles.moodFrame}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MoodCharacter mood={mood.id} />
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <p className={styles.moodQuestion}>How are you feeling today?</p>
            <button type="button" className={styles.moodStart} onClick={() => setStarted(true)}>
              start
            </button>
          </>
        )}
      </div>
      <AnimatePresence>
        {started && replyOpen ? (
          <motion.div
            key={mood.id}
            className={styles.reply}
            role="status"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            {reply}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <p className={`${styles.label} ${styles.moodLabel}`}>Emotions</p>
    </div>
  );
}

function MusicWidget({
  music,
  expanded,
}: {
  music: ReturnType<typeof useMusicPlayer>;
  expanded: boolean;
}) {
  return (
    <div className={styles.music}>
      <div className={`${styles.card} ${styles.musicCard} ${expanded ? styles.musicCardExpanded : ""}`}>
        <span className={styles.glassLayer} aria-hidden />
        <span className={styles.musicTint} aria-hidden />
        <span className={styles.musicOverlay} aria-hidden />

        <div className={styles.musicMain}>
        <Image
          className={styles.albumArt}
          src={`/music/covers/${music.track.cover}`}
          alt={`${music.track.title} album cover`}
          width={1200}
          height={1200}
          unoptimized
        />

        <div className={styles.musicDetails}>
          <Image
            className={styles.appleMusic}
            src="/images/figma-header/widget-apple-music.svg"
            alt=""
            width={15}
            height={19}
            unoptimized
          />
          <div className={styles.trackText}>
            <p className={styles.status}>{music.playing ? "Now playing" : "Recently played"}</p>
            <p className={styles.trackTitle}>{music.track.title}</p>
            <p className={styles.trackArtist}>{music.track.artist}</p>
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.control} aria-label="Previous track" onClick={music.previous}>
              <Image src="/images/figma-header/skip-back.svg" alt="" width={28} height={28} unoptimized />
            </button>
            <button
              type="button"
              className={`${styles.control} ${styles.play}`}
              aria-label={music.playing ? "Pause" : "Play"}
              aria-pressed={music.playing}
              onClick={music.togglePlay}
            >
              {music.playing ? (
                <svg className={styles.pauseIcon} aria-hidden viewBox="0 0 32 32">
                  <rect x="8" y="6" width="5" height="20" rx="1" />
                  <rect x="19" y="6" width="5" height="20" rx="1" />
                </svg>
              ) : (
                <Image src="/images/figma-header/play.svg" alt="" width={32} height={32} unoptimized />
              )}
            </button>
            <button type="button" className={styles.control} aria-label="Next track" onClick={music.next}>
              <Image src="/images/figma-header/skip-forward.svg" alt="" width={28} height={28} unoptimized />
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label={music.muted ? "Unmute" : "Mute"}
              aria-pressed={music.muted}
              onClick={music.toggleMute}
            >
              <svg className={styles.muteIcon} aria-hidden viewBox="0 0 24 24">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                {music.muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
              </svg>
            </button>
          </div>
        </div>
        </div>

        {/* Scrub bar under the album: drag to seek, with elapsed and total time */}
        <div className={styles.progress}>
          <input
            type="range"
            className={styles.scrub}
            aria-label="Seek"
            min={0}
            max={music.duration || 0}
            step="any"
            value={Math.min(music.current, music.duration || 0)}
            disabled={!music.duration}
            onChange={(event) => music.seek(Number(event.target.value))}
            style={{
              "--fill": `${music.duration ? (music.current / music.duration) * 100 : 0}%`,
            } as React.CSSProperties}
          />
          <div className={styles.times}>
            <span>{formatTime(music.current)}</span>
            <span>{formatTime(music.duration)}</span>
          </div>
        </div>
      </div>
      <p className={`${styles.label} ${styles.musicLabel}`}>Music</p>
    </div>
  );
}


// m:ss for the scrub bar labels; zero until the track's length is known
function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

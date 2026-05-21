"use client";

/**
 * Projects-section images: ASSETS, CASE_BG, PROJECTS, spin overlay.
 * Full cassettes: one filmstrip (row-reverse) behind the player; miniCassettes on the controller.
 */
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import styles from "./ProjectsSection.module.css";

const ASSETS = {
  player:
    "/images/projects-section/cassettePlayer/Cassette%20Player.png",
  spin1: "/images/projects-section/cassettePlayer/cassette-spin-1.png",
  spin2: "/images/projects-section/cassettePlayer/cassette-spin-2.png",
  multiController:
    "/images/projects-section/mediaPlayer/multiMedia-controller.png",
  caseStudiesBg:
    "/images/projects-section/caseStudies/case-Studies/case-Studies-BG.png",
  btn: {
    play: "/images/projects-section/mediaPlayer/button-states/Play.png",
    playPressed:
      "/images/projects-section/mediaPlayer/button-states/Play%20-%20Pressed.png",
    prev: "/images/projects-section/mediaPlayer/button-states/Previous.png",
    prevPressed:
      "/images/projects-section/mediaPlayer/button-states/Previous%20-%20Pressed.png",
    next: "/images/projects-section/mediaPlayer/button-states/Next.png",
    nextPressed:
      "/images/projects-section/mediaPlayer/button-states/Next%20-%20Pressesd.png",
    mute: "/images/projects-section/mediaPlayer/button-states/Mute.png",
    mutePressed:
      "/images/projects-section/mediaPlayer/button-states/Mute%20-%20Pressed.png",
    volume: "/images/projects-section/mediaPlayer/button-states/Volume.png",
    volumePressed:
      "/images/projects-section/mediaPlayer/button-states/Volume%20-%20Pressed.png",
  },
} as const;

const CASE_BG = ASSETS.caseStudiesBg;

/** Matches `.cassetteStrip` / `.cassetteTape` transition (`0.55s` in ProjectsSection.module.css) */
const CASSETTE_STRIP_TRANSITION_MS = 550;

const CASSETTE_FX_PLAYBACK_RATE = 1.18;
const CASSETTE_FX_VOLUME = 1;

/** Pointerdown + click fire ~together — debounce stops double FX */
const CASSETTE_FX_DEBOUNCE_MS = 90;

const MUSIC_DUCK_VOLUME = 0.2;
const MUSIC_DUCK_MS = 240;

const CASSETTE_LATCH_WAV =
  "/Sounds/cassette%20change/CassetteIn.wav";

function playCassetteSfx(
  el: HTMLAudioElement | null,
  opts: { volume: number; playbackRate: number },
) {
  if (!el) return;
  el.muted = false;
  el.volume = opts.volume;
  el.playbackRate = opts.playbackRate;
  el.currentTime = 0;
  void el.play().catch(() => {});
}

/** mm:ss (or h:mm:ss) for HUD; invalid → `--:--` */
function formatAudioClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
  const totalSec = Math.floor(seconds);
  const s = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m = totalMin % 60;
  const h = Math.floor(totalMin / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

/** Theme MP3 per case study (paths under `public/Sounds/Music`) */
const MUSIC = {
  grove:
    "/Sounds/Music/Junior%20Senior%20-%20Move%20Your%20Feet.mp3",
  ecommerce:
    "/Sounds/Music/Daft%20Punk%20-%20Revolution%20909.mp3",
  seaSky:
    "/Sounds/Music/Electric%20Light%20Orchestra%20-%20Last%20Train%20To%20London.mp3",
  tidehaus:
    "/Sounds/Music/The%20Weekend-Michael%20Gray.mp3",
  selah:
    "/Sounds/Music/Hulvey,%20KB,%20Lecrae%20-%20Can%27t%20Tell%20It%20All.mp3",
  /** Filename on disk uses NFD (e + combining acute) */
  ziplearn:
    "/Sounds/Music/Eres%20-%20Cafe%CC%81%20Tacuba.mp3",
} as const;

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  cassette: string;
  miniCassette: string;
  caseStudy: string;
  href: string;
  /** Background loop for this case study in the projects media player */
  musicSrc: string;
  comingSoon?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "grove",
    title: "GROVE",
    category: "HABIT TRACKER APP",
    description:
      "Grow your habits into something you can see. A gamified habit tracker that turns daily routines into a growing, peaceful garden.",
    cassette:
      "/images/projects-section/cassettes/grove-Cassette-1.png",
    miniCassette:
      "/images/projects-section/miniCassettes/mini-grove-Cassette-1.png",
    caseStudy:
      "/images/projects-section/caseStudies/case-Studies/Grove-caseStudy.png",
    href: "/projects/grove",
    musicSrc: MUSIC.grove,
  },
  {
    id: "ecommerce",
    title: "E‑COMMERCE",
    category: "WEBSITE",
    description:
      "Redesign of the Samples Store—Shopify template craft for a streamlined, friendly shopping journey.",
    cassette:
      "/images/projects-section/cassettes/eCommerce-Cassette-4.png",
    miniCassette:
      "/images/projects-section/miniCassettes/mini-eCommerce-Cassette-4.png",
    caseStudy:
      "/images/projects-section/caseStudies/case-Studies/Ecommerce-caseStudy.png",
    href: "/projects/ecommerce",
    musicSrc: MUSIC.ecommerce,
  },
  {
    id: "sea-sky",
    title: "SEA & SKY",
    category: "WEBSITE",
    description:
      "Online community built to empower underrepresented students in higher education.",
    cassette:
      "/images/projects-section/cassettes/seaSky-Cassette-3.png",
    miniCassette:
      "/images/projects-section/miniCassettes/mini-seaSky-Cassette-3.png",
    caseStudy:
      "/images/projects-section/caseStudies/case-Studies/seaSky-caseStudy.png",
    href: "/projects/sea-and-sky",
    musicSrc: MUSIC.seaSky,
  },
  {
    id: "tidehaus",
    title: "TIDEHAUS",
    category: "WEBSITE",
    description:
      "A modern surf e-commerce site built to showcase gear with a clean, coastal aesthetic.",
    cassette:
      "/images/projects-section/cassettes/tideHaus-Cassette-6.png",
    miniCassette:
      "/images/projects-section/miniCassettes/mini-tideHaus-Cassette-6.png",
    caseStudy:
      "/images/projects-section/caseStudies/case-Studies/tidehaus-caseStudy.png",
    href: "/projects/tidehaus",
    musicSrc: MUSIC.tidehaus,
  },
  {
    id: "selah",
    title: "SELAH",
    category: "APP",
    description:
      "A devotional app that guides users through scripture, reflection, and journaling.",
    cassette:
      "/images/projects-section/cassettes/selah-Cassette-2.png",
    miniCassette:
      "/images/projects-section/miniCassettes/mini-selah-Cassette-2.png",
    caseStudy:
      "/images/projects-section/caseStudies/case-Studies/selah-caseStudy.png",
    href: "/projects/selah-reflect",
    musicSrc: MUSIC.selah,
  },
  {
    id: "ziplearn",
    title: "ZIPLEARN",
    category: "APP",
    description:
      "An intuitive tutoring app that makes learning faster, simpler, and accessible.",
    cassette:
      "/images/projects-section/cassettes/zipLearn-Cassette-5.png",
    miniCassette:
      "/images/projects-section/miniCassettes/mini-zipLearn-Cassette-5.png",
    caseStudy:
      "/images/projects-section/caseStudies/case-Studies/ziplearn-caseStudy.png",
    href: "/projects/ziplearn",
    musicSrc: MUSIC.ziplearn,
  },
];

function PressableIcon({
  normalSrc,
  pressedSrc,
  width,
  height,
  isDown,
}: {
  normalSrc: string;
  pressedSrc: string;
  width: number;
  height: number;
  isDown: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={isDown ? pressedSrc : normalSrc}
      alt=""
      width={width}
      height={height}
      draggable={false}
    />
  );
}

/** Pause bars sized to match neighbouring transport icons (no Pause artwork in bundle). */
function TransportPlayPauseFace({
  isPlaying,
  isDown,
  size,
  playNormal,
  playPressed,
}: {
  isPlaying: boolean;
  isDown: boolean;
  size: number;
  playNormal: string;
  playPressed: string;
}) {
  if (!isPlaying) {
    return (
      <PressableIcon
        normalSrc={playNormal}
        pressedSrc={playPressed}
        width={size}
        height={size}
        isDown={isDown}
      />
    );
  }
  const gap = Math.max(4, Math.round(size * 0.15));
  const bw = Math.max(5, Math.round(size * 0.145));
  const bh = Math.round(size * 0.458);
  return (
    <span
      className={`${styles.pauseGlyph}${isDown ? ` ${styles.pauseGlyphPressed}` : ""}`}
      style={
        {
          width: size,
          height: size,
          gap,
        } as CSSProperties
      }
      aria-hidden
    >
      <span
        className={styles.pauseGlyphBar}
        style={{ width: bw, height: bh }}
      />
      <span
        className={styles.pauseGlyphBar}
        style={{ width: bw, height: bh }}
      />
    </span>
  );
}

export default function ProjectsSection() {
  const [selected, setSelected] = useState(0);
  /** Starts muted; user hears audio after pressing the volume control */
  const [muted, setMuted] = useState(true);
  const [cassetteTransitioning, setCassetteTransitioning] = useState(false);
  const skipCassetteTransitionRef = useRef(true);

  const musicRef = useRef<HTMLAudioElement | null>(null);

  /** Two players so rapid Prev/Next doesn’t restart one clip mid‑playback */
  const cassetteFxARef = useRef<HTMLAudioElement | null>(null);
  const cassetteFxBRef = useRef<HTMLAudioElement | null>(null);
  const cassetteFxPoolFlipRef = useRef(false);
  const musicVolumeRestoreTimerRef = useRef<number | null>(null);

  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const duckMusicForFx = useCallback(() => {
    const music = musicRef.current;
    if (!music || mutedRef.current) return;
    music.volume = MUSIC_DUCK_VOLUME;
    if (musicVolumeRestoreTimerRef.current !== null) {
      window.clearTimeout(musicVolumeRestoreTimerRef.current);
    }
    musicVolumeRestoreTimerRef.current = window.setTimeout(() => {
      musicVolumeRestoreTimerRef.current = null;
      const el = musicRef.current;
      if (el && !mutedRef.current) el.volume = 1;
    }, MUSIC_DUCK_MS);
  }, []);

  const playCassetteLatchFxNow = useCallback(() => {
    cassetteFxPoolFlipRef.current = !cassetteFxPoolFlipRef.current;
    const el = cassetteFxPoolFlipRef.current
      ? cassetteFxARef.current
      : cassetteFxBRef.current;
    playCassetteSfx(el, {
      volume: CASSETTE_FX_VOLUME,
      playbackRate: CASSETTE_FX_PLAYBACK_RATE,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (musicVolumeRestoreTimerRef.current !== null) {
        window.clearTimeout(musicVolumeRestoreTimerRef.current);
      }
    };
  }, []);

  /** Prime decoded buffers after mount — avoids first‑tap silence */
  useEffect(() => {
    cassetteFxARef.current?.load();
    cassetteFxBRef.current?.load();
  }, []);

  const [playDown, setPlayDown] = useState(false);
  const [prevDown, setPrevDown] = useState(false);
  const [nextDown, setNextDown] = useState(false);
  const [muteDown, setMuteDown] = useState(false);
  const [nextEverClicked, setNextEverClicked] = useState(false);
  const [musicHud, setMusicHud] = useState<{
    currentSec: number;
    durationSec: number;
    playing: boolean;
  }>({ currentSec: 0, durationSec: Number.NaN, playing: false });

  const n = PROJECTS.length;
  const current = PROJECTS[selected];
  const canGoPrev = selected > 0;
  const canGoNext = selected < n - 1;

  const lastCassetteFxAtRef = useRef(0);

  const triggerCassetteFx = useCallback(() => {
    const now = performance.now();
    if (now - lastCassetteFxAtRef.current < CASSETTE_FX_DEBOUNCE_MS) return;
    lastCassetteFxAtRef.current = now;
    duckMusicForFx();
    playCassetteLatchFxNow();
  }, [duckMusicForFx, playCassetteLatchFxNow]);

  const goPrev = useCallback(() => {
    const i = selectedRef.current;
    if (i <= 0) return;
    triggerCassetteFx();
    setSelected(i - 1);
  }, [triggerCassetteFx]);

  const goNext = useCallback(() => {
    const i = selectedRef.current;
    if (i >= n - 1) return;
    triggerCassetteFx();
    setSelected(i + 1);
    setNextEverClicked(true);
  }, [triggerCassetteFx, n]);

  const onPrevPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (!canGoPrev || e.button !== 0) return;
      setPrevDown(true);
      triggerCassetteFx();
    },
    [canGoPrev, triggerCassetteFx],
  );

  const onNextPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (!canGoNext || e.button !== 0) return;
      setNextDown(true);
      triggerCassetteFx();
    },
    [canGoNext, triggerCassetteFx],
  );

  useLayoutEffect(() => {
    if (skipCassetteTransitionRef.current) {
      skipCassetteTransitionRef.current = false;
      return;
    }
    setCassetteTransitioning(true);
    const id = window.setTimeout(() => {
      setCassetteTransitioning(false);
    }, CASSETTE_STRIP_TRANSITION_MS);
    return () => window.clearTimeout(id);
  }, [selected]);

  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    if (!muted) {
      music.volume = 1;
      void music.play().catch(() => {});
    } else {
      if (musicVolumeRestoreTimerRef.current !== null) {
        window.clearTimeout(musicVolumeRestoreTimerRef.current);
        musicVolumeRestoreTimerRef.current = null;
      }
      music.pause();
      music.volume = 1;
    }
  }, [muted]);

  /** Resume the active loop after the `<audio>` src swaps with Prev/Next */
  useEffect(() => {
    const music = musicRef.current;
    if (!music || muted) return;
    void music.play().catch(() => {});
  }, [selected, muted]);

  useEffect(() => {
    const el = musicRef.current;
    if (!el) return;

    const sync = () => {
      const durationSec = el.duration;
      setMusicHud({
        currentSec: Number.isFinite(el.currentTime) ? el.currentTime : 0,
        durationSec: Number.isFinite(durationSec) ? durationSec : Number.NaN,
        playing: !el.paused,
      });
    };

    setMusicHud({
      currentSec: 0,
      durationSec: Number.NaN,
      playing: !el.paused,
    });

    el.addEventListener("loadedmetadata", sync);
    el.addEventListener("durationchange", sync);
    el.addEventListener("loadeddata", sync);
    el.addEventListener("timeupdate", sync);
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);

    sync();
    queueMicrotask(sync);

    return () => {
      el.removeEventListener("loadedmetadata", sync);
      el.removeEventListener("durationchange", sync);
      el.removeEventListener("loadeddata", sync);
      el.removeEventListener("timeupdate", sync);
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
    };
  }, [current.musicSrc]);

  const toggleMusicPlayback = useCallback(() => {
    const el = musicRef.current;
    if (!el) return;
    if (muted) {
      setMuted(false);
      void el.play().catch(() => {});
      return;
    }
    if (el.paused) {
      void el.play().catch(() => {});
    } else el.pause();
  }, [muted]);

  const muteNormal = muted ? ASSETS.btn.mute : ASSETS.btn.volume;
  const mutePressed = muted
    ? ASSETS.btn.mutePressed
    : ASSETS.btn.volumePressed;

  /** Whether the current project has a unique case study image (not just the BG placeholder) */
  const hasCaseStudy = current.caseStudy !== CASE_BG;

  const audioProgressPct =
    Number.isFinite(musicHud.durationSec) && musicHud.durationSec > 0
      ? Math.min(
          100,
          Math.max(0, (musicHud.currentSec / musicHud.durationSec) * 100),
        )
      : ((selected + 1) / n) * 100;

  return (
    <section
      id="projects"
      className={styles.section}
      aria-label="Projects"
    >
      <audio
        ref={musicRef}
        src={current.musicSrc}
        loop
        preload="metadata"
        playsInline
        aria-hidden
      />
      <audio
        ref={cassetteFxARef}
        src={CASSETTE_LATCH_WAV}
        preload="auto"
        playsInline
        aria-hidden
      />
      <audio
        ref={cassetteFxBRef}
        src={CASSETTE_LATCH_WAV}
        preload="none"
        playsInline
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.linesDecor}
        src="/images/projects-section/80s-lines/80s-lines.svg"
        alt=""
        aria-hidden
        draggable={false}
      />
      <div className={styles.inner}>
        <header className={styles.headlineGroup}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.headerBar}
            src="/images/projects-section/80s-lines/80s-lines-2.svg"
            alt=""
            aria-hidden
            draggable={false}
          />
          <div className={styles.headlineLead}>
            <h2 className={styles.title}>PROJECTS</h2>
            <p className={styles.subtitle}>
              Select a cassette, press play, and dive into the project
            </p>
          </div>
        </header>

        <div className={styles.mainRow}>
          <div className={styles.projectsTopRow}>
            <div className={styles.walkmanCol}>
              <div className={styles.walkmanStack}>
                <div className={styles.walkmanClip}>
                  <div className={styles.cassetteMount} aria-hidden>
                    <div
                      className={styles.cassetteStrip}
                      style={{ "--count": n, "--idx": selected } as CSSProperties}
                    >
                      {PROJECTS.map((p, i) => (
                        <div
                          key={p.id}
                          className={`${styles.cassetteCell}${i === selected ? ` ${styles.cassetteCellActive}` : ""}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className={styles.cassetteTape}
                            src={p.cassette}
                            alt=""
                            width={400}
                            height={300}
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.cassetteSpinSlot} aria-hidden>
                    <div
                      className={`${styles.spinReelPair}${cassetteTransitioning ? "" : ` ${styles.reelsRunning}`}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={styles.spinReel}
                        src={ASSETS.spin1}
                        alt=""
                        width={200}
                        height={200}
                        decoding="async"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={styles.spinReel}
                        src={ASSETS.spin1}
                        alt=""
                        width={200}
                        height={200}
                        decoding="async"
                      />
                    </div>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.walkmanBase}
                    src={ASSETS.player}
                    alt=""
                    width={800}
                    height={800}
                    decoding="async"
                  />
                </div>
              </div>

              <div className={styles.controlsDeck}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.controlsDeckArt}
                  src={ASSETS.multiController}
                  alt=""
                  width={1200}
                  height={280}
                  decoding="async"
                />
                <div
                  className={styles.cassetteStripViewport}
                  aria-hidden
                >
                  <div className={styles.cassetteStripHighlight} />
                  <div
                    className={styles.cassetteStripTrack}
                    style={
                      {
                        "--cassette-index": selected,
                      } as CSSProperties
                    }
                  >
                    {PROJECTS.map((p) => (
                      <div key={p.id} className={styles.cassetteStripCell}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={styles.cassetteStripMini}
                          src={p.miniCassette}
                          alt=""
                          width={312}
                          height={200}
                          draggable={false}
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.controlsBar}>
                  <div className={styles.transport}>
                    <button
                      type="button"
                      className={styles.transportBtn}
                      onPointerDown={() => setPlayDown(true)}
                      onPointerUp={() => setPlayDown(false)}
                      onPointerLeave={(e) => { if (e.buttons === 0) setPlayDown(false); }}
                      onPointerCancel={() => setPlayDown(false)}
                      onClick={toggleMusicPlayback}
                      aria-label={musicHud.playing ? "Pause music" : "Play music"}
                      aria-pressed={musicHud.playing}
                    >
                      <TransportPlayPauseFace
                        isPlaying={musicHud.playing}
                        isDown={playDown}
                        size={48}
                        playNormal={ASSETS.btn.play}
                        playPressed={ASSETS.btn.playPressed}
                      />
                      <span className={styles.transportLabel}>
                        {musicHud.playing ? "Pause" : "Play"}
                      </span>
                    </button>
                    <button
                      type="button"
                      className={styles.transportBtn}
                      disabled={!canGoPrev}
                      onPointerDown={onPrevPointerDown}
                      onPointerUp={() => setPrevDown(false)}
                      onPointerLeave={(e) => { if (e.buttons === 0) setPrevDown(false); }}
                      onPointerCancel={() => setPrevDown(false)}
                      onClick={goPrev}
                      aria-label={canGoPrev ? "Previous project" : "Previous project (already on first project)"}
                    >
                      <PressableIcon normalSrc={ASSETS.btn.prev} pressedSrc={ASSETS.btn.prevPressed} width={48} height={48} isDown={canGoPrev && prevDown} />
                      <span className={styles.transportLabel}>Prev</span>
                    </button>
                    <button
                      type="button"
                      className={`${styles.transportBtn}${!nextEverClicked ? ` ${styles.nextBtn}` : ""}`}
                      disabled={!canGoNext}
                      onPointerDown={onNextPointerDown}
                      onPointerUp={() => setNextDown(false)}
                      onPointerLeave={(e) => { if (e.buttons === 0) setNextDown(false); }}
                      onPointerCancel={() => setNextDown(false)}
                      onClick={goNext}
                      aria-label={canGoNext ? "Next project" : "Next project (already on last project)"}
                    >
                      <PressableIcon normalSrc={ASSETS.btn.next} pressedSrc={ASSETS.btn.nextPressed} width={48} height={48} isDown={canGoNext && nextDown} />
                      <span className={styles.transportLabel}>Next</span>
                    </button>
                    <button
                      type="button"
                      className={styles.transportBtn}
                      onPointerDown={() => setMuteDown(true)}
                      onPointerUp={() => setMuteDown(false)}
                      onPointerLeave={(e) => { if (e.buttons === 0) setMuteDown(false); }}
                      onPointerCancel={() => setMuteDown(false)}
                      onClick={() => setMuted((m) => !m)}
                      aria-label={muted ? "Unmute" : "Mute"}
                      aria-pressed={muted}
                    >
                      <PressableIcon normalSrc={muteNormal} pressedSrc={mutePressed} width={48} height={48} isDown={muteDown} />
                      <span className={styles.transportLabel}>{muted ? "Mute" : "Vol"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.mobileWalkmanControlsGroup}>
              <div className={styles.mobileWalkmanWrap}>
                <div className={styles.walkmanStack}>
                  <div className={styles.walkmanClip}>
                    <div className={styles.cassetteMount} aria-hidden>
                      <div
                        className={styles.cassetteStrip}
                        style={{ "--count": n, "--idx": selected } as CSSProperties}
                      >
                        {PROJECTS.map((p, i) => (
                          <div
                            key={`mobile-${p.id}`}
                            className={`${styles.cassetteCell}${i === selected ? ` ${styles.cassetteCellActive}` : ""}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              className={styles.cassetteTape}
                              src={p.cassette}
                              alt=""
                              width={400}
                              height={300}
                              decoding="async"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.cassetteSpinSlot} aria-hidden>
                      <div
                        className={`${styles.spinReelPair}${cassetteTransitioning ? "" : ` ${styles.reelsRunning}`}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={styles.spinReel}
                          src={ASSETS.spin1}
                          alt=""
                          width={200}
                          height={200}
                          decoding="async"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={styles.spinReel}
                          src={ASSETS.spin1}
                          alt=""
                          width={200}
                          height={200}
                          decoding="async"
                        />
                      </div>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.walkmanBase}
                      src={ASSETS.player}
                      alt=""
                      width={800}
                      height={800}
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.mobileTransport}>
                <button
                  type="button"
                  className={styles.mobileTransportBtn}
                  onPointerDown={() => setPlayDown(true)}
                  onPointerUp={() => setPlayDown(false)}
                  onPointerLeave={(e) => { if (e.buttons === 0) setPlayDown(false); }}
                  onPointerCancel={() => setPlayDown(false)}
                  onClick={toggleMusicPlayback}
                  aria-label={musicHud.playing ? "Pause music" : "Play music"}
                  aria-pressed={musicHud.playing}
                >
                  <TransportPlayPauseFace
                    isPlaying={musicHud.playing}
                    isDown={playDown}
                    size={40}
                    playNormal={ASSETS.btn.play}
                    playPressed={ASSETS.btn.playPressed}
                  />
                </button>
                <button
                  type="button"
                  className={styles.mobileTransportBtn}
                  disabled={!canGoPrev}
                  onPointerDown={onPrevPointerDown}
                  onPointerUp={() => setPrevDown(false)}
                  onPointerLeave={(e) => { if (e.buttons === 0) setPrevDown(false); }}
                  onPointerCancel={() => setPrevDown(false)}
                  onClick={goPrev}
                  aria-label={canGoPrev ? "Previous project" : "Previous project (already on first project)"}
                >
                  <PressableIcon normalSrc={ASSETS.btn.prev} pressedSrc={ASSETS.btn.prevPressed} width={40} height={40} isDown={canGoPrev && prevDown} />
                </button>
                <button
                  type="button"
                  className={`${styles.mobileTransportBtn}${!nextEverClicked ? ` ${styles.mobileNextBtn}` : ""}`}
                  disabled={!canGoNext}
                  onPointerDown={onNextPointerDown}
                  onPointerUp={() => setNextDown(false)}
                  onPointerLeave={(e) => { if (e.buttons === 0) setNextDown(false); }}
                  onPointerCancel={() => setNextDown(false)}
                  onClick={goNext}
                  aria-label={canGoNext ? "Next project" : "Next project (already on last project)"}
                >
                  <PressableIcon normalSrc={ASSETS.btn.next} pressedSrc={ASSETS.btn.nextPressed} width={40} height={40} isDown={canGoNext && nextDown} />
                </button>
                <button
                  type="button"
                  className={styles.mobileTransportBtn}
                  onPointerDown={() => setMuteDown(true)}
                  onPointerUp={() => setMuteDown(false)}
                  onPointerLeave={(e) => { if (e.buttons === 0) setMuteDown(false); }}
                  onPointerCancel={() => setMuteDown(false)}
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-pressed={muted}
                >
                  <PressableIcon normalSrc={muteNormal} pressedSrc={mutePressed} width={40} height={40} isDown={muteDown} />
                </button>
              </div>
            </div>

            {/* Case study card */}
            <div className={styles.displayCol}>
              <div
                className={styles.displayPanel}
                aria-live="polite"
                aria-atomic="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.casePanelBg}
                  src={CASE_BG}
                  alt=""
                  width={1120}
                  height={720}
                  decoding="async"
                  draggable={false}
                />
                <div className={styles.displayText}>
                  <span className={styles.nowPlaying}>Now playing</span>
                  <p className={styles.displayTitle}>{current.title}</p>
                  <div className={styles.progressCluster}>
                    <div className={styles.progressTrack} aria-hidden>
                      <div
                        className={styles.progressFill}
                        style={
                          { width: `${audioProgressPct}%` } as CSSProperties
                        }
                      />
                    </div>
                    <div className={styles.trackTimeRow} aria-hidden>
                      <span className={styles.trackTimeCurrent}>
                        {formatAudioClock(musicHud.currentSec)}
                      </span>
                      <span className={styles.trackTimeSep} aria-hidden>
                        /
                      </span>
                      <span className={styles.trackTimeTotal}>
                        {formatAudioClock(musicHud.durationSec)}
                      </span>
                    </div>
                  </div>
                  <span className={styles.category}>{current.category}</span>
                  <p className={styles.description}>{current.description}</p>
                  {current.comingSoon ? (
                    <div className={styles.comingSoonWrapper}>
                      <span className={styles.comingSoonBtn}>Coming Soon</span>
                      <p className={styles.comingSoonLabel}>Coming soon to App Store</p>
                    </div>
                  ) : (
                    <Link className={styles.viewLink} href={current.href}>
                      View Project<span aria-hidden> →</span>
                    </Link>
                  )}
                </div>
                <div className={styles.displayThumb}>
                  {hasCaseStudy && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={current.id}
                      className={styles.caseStudyImg}
                      src={current.caseStudy}
                      alt={`${current.title} case study`}
                      width={560}
                      height={720}
                      decoding="async"
                      draggable={false}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

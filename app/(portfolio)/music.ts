import * as React from "react";

// Tracks for the header music widget. Drop an mp3 into public/music/, its cover into
// public/music/covers/ with the same name (.jpg), and add a row here.
// gain is the track's level trim in dB, so quiet and loud masters play at a similar volume
export type MusicTrack = { title: string; artist: string; file: string; cover: string; gain: number };

export const MUSIC_TRACKS: MusicTrack[] = [
  { title: "Windows98", artist: "Gregory Dillon, frutiger dillon", file: "gregory-dillon-windows98.mp3", cover: "gregory-dillon-windows98.jpg", gain: -1.2 },
  { title: "Love And Appreciation", artist: "Agnes", file: "agnes-love-and-appreciation.mp3", cover: "agnes-love-and-appreciation.jpg", gain: -0.3 },
  { title: "I Remember (Vocal Mix)", artist: "deadmau5 & Kaskade", file: "deadmau5-kaskade-i-remember.mp3", cover: "deadmau5-kaskade-i-remember.jpg", gain: -4.2 },
  { title: "Canned Heat", artist: "Jamiroquai", file: "jamiroquai-canned-heat.mp3", cover: "jamiroquai-canned-heat.jpg", gain: 11.4 },
  { title: "The Weekend", artist: "Michael Gray", file: "michael-gray-the-weekend.mp3", cover: "michael-gray-the-weekend.jpg", gain: 0.8 },
  { title: "Stereo Love", artist: "Edward Maya & Vika Jigulina", file: "edward-maya-stereo-love.mp3", cover: "edward-maya-stereo-love.jpg", gain: -3.1 },
  { title: "Down Under", artist: "Men At Work", file: "men-at-work-down-under.mp3", cover: "men-at-work-down-under.jpg", gain: -0.3 },
  { title: "Sweet Disposition", artist: "The Temper Trap", file: "the-temper-trap-sweet-disposition.mp3", cover: "the-temper-trap-sweet-disposition.jpg", gain: 2.9 },
  { title: "Back On 74", artist: "Jungle", file: "jungle-back-on-74.mp3", cover: "jungle-back-on-74.jpg", gain: -0.5 },
  { title: "Notion", artist: "Kings Of Leon", file: "kings-of-leon-notion.mp3", cover: "kings-of-leon-notion.jpg", gain: 0.9 },
  { title: "Everlong", artist: "Foo Fighters", file: "foo-fighters-everlong.mp3", cover: "foo-fighters-everlong.jpg", gain: -1.2 },
  { title: "King of Sweden", artist: "Future Islands", file: "future-islands-king-of-sweden.mp3", cover: "future-islands-king-of-sweden.jpg", gain: -2 },
  { title: "Champagne Supernova", artist: "Oasis", file: "oasis-champagne-supernova.mp3", cover: "oasis-champagne-supernova.jpg", gain: 1.9 },
  { title: "Anomaly", artist: "Lecrae", file: "lecrae-anomaly.mp3", cover: "lecrae-anomaly.jpg", gain: -0.3 },
  { title: "Crack The Tomb", artist: "Hulvey ft. Torey D'Shaun", file: "hulvey-crack-the-tomb.mp3", cover: "hulvey-crack-the-tomb.jpg", gain: -1.3 },
  { title: "Love Theory", artist: "Kirk Franklin", file: "kirk-franklin-love-theory.mp3", cover: "kirk-franklin-love-theory.jpg", gain: -0.8 },
  { title: "God Made A Way", artist: "WHATUPRG", file: "whatuprg-god-made-a-way.mp3", cover: "whatuprg-god-made-a-way.jpg", gain: -4.7 },
  { title: "Looking For You", artist: "Kirk Franklin", file: "kirk-franklin-looking-for-you.mp3", cover: "kirk-franklin-looking-for-you.jpg", gain: -0.5 },
  { title: "Last Train to London", artist: "Electric Light Orchestra", file: "elo-last-train-to-london.mp3", cover: "elo-last-train-to-london.jpg", gain: 0.4 },
  { title: "Them Changes", artist: "Thundercat", file: "thundercat-them-changes.mp3", cover: "thundercat-them-changes.jpg", gain: -0.3 },
  { title: "Face to Face", artist: "Daft Punk", file: "daft-punk-face-to-face.mp3", cover: "daft-punk-face-to-face.jpg", gain: -0.3 },
  { title: "How Deep Is Your Love", artist: "Bee Gees", file: "bee-gees-how-deep-is-your-love.mp3", cover: "bee-gees-how-deep-is-your-love.jpg", gain: -0.6 },
  { title: "More Than A Woman", artist: "Bee Gees", file: "bee-gees-more-than-a-woman.mp3", cover: "bee-gees-more-than-a-woman.jpg", gain: -0.6 },
];

// The cover for the track an audio source is playing; the first track's cover when none matches
export function coverForSource(src: string) {
  const track = MUSIC_TRACKS.find((t) => src.endsWith(`/music/${t.file}`)) ?? MUSIC_TRACKS[0];
  return `/music/covers/${track.cover}`;
}

// The output level the music starts at, before the listener has any say in it
export const START_VOLUME = 0.12;

// Bass is the part of the spectrum the background follows
const BASS_BINS = 6;
const SMOOTHING = 0.25;
// Per frame, how far the loudest and quietest bass drift back toward the current level, and the
// smallest range they can span, so a quiet passage still moves without exaggerating its noise
const RANGE_DRIFT = 0.0015;
const MIN_SPAN = 0.12;

type AudioGraph = {
  context: AudioContext;
  trim: GainNode;
  analyser: AnalyserNode;
  gain: GainNode;
  data: Uint8Array<ArrayBuffer>;
};

// Butterchurn is a WebGL port of MilkDrop (MIT). It is loaded on first play, not with the page.
type Visualizer = {
  connectAudio: (node: AudioNode) => void;
  loadPreset: (preset: unknown, blendSeconds: number) => void;
  setRendererSize: (width: number, height: number) => void;
  render: () => void;
};

// The audio graph, shared by every visit to the header, so the music keeps its sound across pages
let sharedGraph: AudioGraph | null = null;
let sharedSource: MediaElementAudioSourceNode | null = null;
// The current track's trim in dB, kept here so it applies whether or not the graph exists yet
let trackGainDb = 0;

// Plays the tracks through the page's own audio element. While a track plays, the bass
// drives the glow and the photo, and a MilkDrop visualizer draws on the header canvas.
export function useMusicPlayer(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const indexRef = React.useRef(index);
  const graphRef = React.useRef<AudioGraph | null>(null);
  const sourceRef = React.useRef<MediaElementAudioSourceNode | null>(null);
  const visualizerRef = React.useRef<Visualizer | null>(null);
  const presetIndexRef = React.useRef<number | null>(null);
  // The output level from the volume widget. It is kept here so it applies once the graph exists.
  const outputLevelRef = React.useRef(1);
  const mutedRef = React.useRef(false);
  const [muted, setMuted] = React.useState(false);

  // Loads a track and, when asked, starts it. Calls to play must come from a click, so the
  // AudioContext is created here on the same gesture.
  const selectTrack = React.useCallback(
    (next: number, shouldPlay: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;
      const length = MUSIC_TRACKS.length;
      const safe = ((next % length) + length) % length;
      indexRef.current = safe;
      setIndex(safe);
      trackGainDb = MUSIC_TRACKS[safe].gain;
      if (sharedGraph) sharedGraph.trim.gain.value = 10 ** (trackGainDb / 20);
      audio.src = `/music/${MUSIC_TRACKS[safe].file}`;
      if (shouldPlay) startPlayback(audio);
    },
    [audioRef],
  );

  // Playback starts first, straight from the click, because Safari only allows it there.
  // The analyser is attached after that and never blocks the audio.
  const startPlayback = (audio: HTMLAudioElement) => {
    const started = audio.play();
    try {
      connectAnalyser(audio);
      // Browsers can leave a new audio context suspended, which mutes the element, so resume it too
      void graphRef.current?.context.resume();
    } catch (error) {
      console.warn("The visualizer could not be attached", error);
    }
    started.catch((error: unknown) => {
      console.warn("Could not start the track", error);
      setPlaying(false);
    });
  };

  // Source → analyser → gain → speakers. The gain sits after the analyser, so the
  // visualizer always sees the full signal and only the output level follows the widget.
  const connectAnalyser = (audio: HTMLAudioElement) => {
    if (graphRef.current) return;
    // The graph is kept for the whole visit: an element can only be connected once, and closing
    // the context would silence the music on the next page
    if (sharedGraph) {
      graphRef.current = sharedGraph;
      sourceRef.current = sharedSource;
      return;
    }
    const context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;
    const gain = context.createGain();
    gain.gain.value = mutedRef.current ? 0 : outputLevelRef.current;
    // The trim evens out the track's level. A limiter after it catches peaks that a quiet master
    // would clip once it is brought up to the others' level.
    const trim = context.createGain();
    trim.gain.value = 10 ** (trackGainDb / 20);
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -1;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.1;
    source.connect(trim);
    trim.connect(limiter);
    limiter.connect(analyser);
    analyser.connect(gain);
    gain.connect(context.destination);
    sourceRef.current = source;
    graphRef.current = { context, trim, analyser, gain, data: new Uint8Array(analyser.frequencyBinCount) };
    sharedGraph = graphRef.current;
    sharedSource = source;
  };

  // Sets the output level from the volume widget (0–1). Browsers can't change the device
  // volume, so this sets how loud the page's own audio is.
  // Muting sets the gain to zero and unmuting restores the level from the volume widget
  const applyGain = React.useCallback(() => {
    if (graphRef.current) graphRef.current.gain.gain.value = mutedRef.current ? 0 : outputLevelRef.current;
  }, []);

  const setOutputLevel = React.useCallback(
    (level: number) => {
      outputLevelRef.current = level;
      applyGain();
    },
    [applyGain],
  );

  const toggleMute = () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    applyGain();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (!audio.getAttribute("src")) {
      selectTrack(indexRef.current, true);
      return;
    }
    startPlayback(audio);
  };

  // Picks the MilkDrop preset at an index, wrapping around the list
  const presetList = async () => {
    const { default: presets } = await import("butterchurn-presets");
    const all = presets.getPresets();
    return { all, names: Object.keys(all) };
  };

  // Moves to the next or previous visualizer preset, used while paused
  const cyclePreset = async (step: number) => {
    const { all, names } = await presetList();
    const current = presetIndexRef.current ?? Math.floor(Math.random() * names.length);
    const target = (((current + step) % names.length) + names.length) % names.length;
    presetIndexRef.current = target;
    visualizerRef.current?.loadPreset(all[names[target]], 0.5);
  };

  // Next and previous do two things: change the track and cycle the visualizer background.
  // The track keeps playing if it was playing, and loads paused otherwise.
  const next = () => {
    void cyclePreset(1);
    selectTrack(indexRef.current + 1, !audioRef.current?.paused);
  };
  const previous = () => {
    void cyclePreset(-1);
    selectTrack(indexRef.current - 1, !audioRef.current?.paused);
  };

  // Keeps the React state in step with the element, including when it ends by itself
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => selectTrack(indexRef.current + 1, true);
    const onTime = () => setCurrent(audio.currentTime);
    const onDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    // Picks up a track that is already playing from another page
    setPlaying(!audio.paused);
    const playingIndex = MUSIC_TRACKS.findIndex((t) => audio.src.endsWith(`/music/${t.file}`));
    if (playingIndex >= 0) {
      indexRef.current = playingIndex;
      setIndex(playingIndex);
      trackGainDb = MUSIC_TRACKS[playingIndex].gain;
      if (sharedGraph) sharedGraph.trim.gain.value = 10 ** (trackGainDb / 20);
    }
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("loadedmetadata", onDuration);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("loadedmetadata", onDuration);
    };
  }, [audioRef, selectTrack]);

  // Drives the header while playing. Everything is written straight to elements (never to a
  // custom property on the document), so the page isn't restyled every frame.
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pulse = document.querySelector<HTMLElement>("[data-music-pulse]");
    const photo = document.querySelector<HTMLElement>("[data-music-photo]");
    const canvas = document.querySelector<HTMLCanvasElement>("[data-visualizer]");
    // The visuals sit at 25% opacity behind everything, so they don't need device pixels.
    // Capping the area keeps the shader's fill rate down, which is what costs on a big screen.
    const MAX_PIXELS = 1_100_000;

    // While a track plays the photo fades out, leaving the black header behind the visualizer.
    // The flag also drops the widgets' frosted glass: with the visuals changing every frame,
    // each glass panel would otherwise re-blur the whole background 60 times a second, and
    // over the black header there is nothing left for that blur to show.
    if (photo) photo.style.opacity = playing && !reduced ? "0" : "";
    document
      .querySelector("header")
      ?.toggleAttribute("data-music-playing", playing && !reduced);

    // The canvas matches the header's size in device pixels
    const resize = () => {
      if (!canvas) return;
      const cssWidth = canvas.clientWidth || 1;
      const cssHeight = canvas.clientHeight || 1;
      const scale = Math.min(1, Math.sqrt(MAX_PIXELS / (cssWidth * cssHeight)));
      const width = Math.max(1, Math.round(cssWidth * scale));
      const height = Math.max(1, Math.round(cssHeight * scale));
      canvas.width = width;
      canvas.height = height;
      visualizerRef.current?.setRendererSize(width, height);
    };

    const reset = () => {
      if (pulse) {
        pulse.style.opacity = "0";
        pulse.style.transform = "";
      }
      if (photo) photo.style.transform = "";
      if (canvas) canvas.style.opacity = "0";
    };

    if (!playing || reduced) {
      reset();
      return;
    }

    // Cleared back to the stylesheet value, which keeps the overlay translucent
    if (canvas) canvas.style.opacity = "";
    resize();
    window.addEventListener("resize", resize);

    let cancelled = false;
    let frame = 0;
    let level = 0;
    let peak = 0;
    let floor = 1;
    // The drawing loop only runs while the header is on screen
    let inView = true;

    // Creates the MilkDrop visualizer the first time it's needed, then reuses it
    const ensureVisualizer = async () => {
      const graph = graphRef.current;
      if (!canvas || !graph || visualizerRef.current) return;
      const [{ default: butterchurn }, { all, names }] = await Promise.all([
        import("butterchurn"),
        presetList(),
      ]);
      if (cancelled || visualizerRef.current) return;
      const visualizer = butterchurn.createVisualizer(graph.context, canvas, {
        width: canvas.width,
        height: canvas.height,
        pixelRatio: 1,
        textureRatio: 1,
      });
      visualizer.connectAudio(graph.analyser);
      presetIndexRef.current ??= Math.floor(Math.random() * names.length);
      visualizer.loadPreset(all[names[presetIndexRef.current]], 0);
      visualizerRef.current = visualizer;
    };
    ensureVisualizer().catch((error: unknown) => console.warn("The visualizer could not load", error));

    const tick = () => {
      if (!inView) {
        frame = 0;
        return;
      }
      const graph = graphRef.current;
      if (graph) {
        graph.analyser.getByteFrequencyData(graph.data);
        let sum = 0;
        for (let i = 0; i < BASS_BINS; i++) sum += graph.data[i];
        const target = sum / BASS_BINS / 255;
        level += (target - level) * SMOOTHING;
        // The loudest and quietest bass recently drift toward the current level, so the pulse is
        // scaled to the track's own range and moves on every track, not only the loud ones
        peak = Math.max(level, peak - RANGE_DRIFT);
        floor = Math.min(level, floor + RANGE_DRIFT);
        const span = Math.max(MIN_SPAN, peak - floor);
        const beat = Math.min(1, Math.max(0, (level - floor) / span));

        // The glow and the photo follow the bass; the photo only moves a little
        if (pulse) {
          pulse.style.opacity = (beat * 0.9).toFixed(3);
          pulse.style.transform = `scale(${(1 + beat * 0.15).toFixed(4)})`;
        }
        if (photo) photo.style.transform = `scale(${(1 + beat * 0.015).toFixed(4)})`;
      }
      visualizerRef.current?.render();
      frame = requestAnimationFrame(tick);
    };
    // Stops drawing when the header scrolls out of view, and starts again when it returns
    const header = document.querySelector<HTMLElement>("header");
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && frame === 0) frame = requestAnimationFrame(tick);
    });
    if (header) observer.observe(header);

    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      reset();
    };
  }, [playing]);

  // Release the audio context when the widget goes away
  React.useEffect(() => {
    return () => {
      visualizerRef.current = null;
    };
  }, []);

  // Jumps to a point in the track, from the scrub bar
  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time)) return;
    audio.currentTime = time;
    setCurrent(time);
  };

  return {
    track: MUSIC_TRACKS[index],
    playing,
    current,
    duration,
    togglePlay,
    next,
    previous,
    seek,
    setOutputLevel,
    muted,
    toggleMute,
  };
}

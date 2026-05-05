"use client";

/**
 * Projects-section images: ASSETS, CASE_BG, PROJECTS, spin overlay.
 * Full cassettes: one filmstrip (row-reverse) behind the player; miniCassettes on the controller.
 */
import Link from "next/link";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
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

/** Slightly longer than `.cassetteStrip` transition (0.38s) so reels resume after the slide settles */
const CASSETTE_STRIP_TRANSITION_MS = 400;

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  cassette: string;
  miniCassette: string;
  caseStudy: string;
  href: string;
  comingSoon?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "grove",
    title: "GROVE",
    category: "HABIT TRACKER APP",
    description:
      "Grow your habits into something you can see. A gamified habit tracker that turns daily routines into a growing, peaceful garden.",
    comingSoon: true,
    cassette:
      "/images/projects-section/cassettes/grove-Cassette-1.png",
    miniCassette:
      "/images/projects-section/miniCassettes/mini-grove-Cassette-1.png",
    caseStudy:
      "/images/projects-section/caseStudies/case-Studies/Grove-caseStudy.png",
    href: "/#contact",
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

export default function ProjectsSection() {
  const [selected, setSelected] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cassetteTransitioning, setCassetteTransitioning] = useState(false);
  const skipCassetteTransitionRef = useRef(true);

  const [playDown, setPlayDown] = useState(false);
  const [prevDown, setPrevDown] = useState(false);
  const [nextDown, setNextDown] = useState(false);
  const [muteDown, setMuteDown] = useState(false);
  const [nextEverClicked, setNextEverClicked] = useState(false);

  const n = PROJECTS.length;
  const current = PROJECTS[selected];
  const canGoPrev = selected > 0;
  const canGoNext = selected < n - 1;

  const goPrev = useCallback(() => {
    setSelected((i) => (i > 0 ? i - 1 : i));
  }, []);

  const goNext = useCallback(() => {
    setSelected((i) => (i < n - 1 ? i + 1 : i));
  }, [n]);

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

  const onPlay = useCallback(() => {}, []);

  const muteNormal = muted ? ASSETS.btn.mute : ASSETS.btn.volume;
  const mutePressed = muted
    ? ASSETS.btn.mutePressed
    : ASSETS.btn.volumePressed;

  /** Whether the current project has a unique case study image (not just the BG placeholder) */
  const hasCaseStudy = current.caseStudy !== CASE_BG;

  return (
    <section
      id="projects"
      className={styles.section}
      aria-label="Projects"
    >
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
          <h2 className={styles.title}>PROJECTS</h2>
          <p className={styles.subtitle}>
            Select a cassette, press play, and dive into the project
          </p>
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
                  onClick={onPlay}
                  aria-label="Play animation"
                >
                  <PressableIcon normalSrc={ASSETS.btn.play} pressedSrc={ASSETS.btn.playPressed} width={40} height={40} isDown={playDown} />
                </button>
                <button
                  type="button"
                  className={styles.mobileTransportBtn}
                  disabled={!canGoPrev}
                  onPointerDown={() => { if (!canGoPrev) return; setPrevDown(true); }}
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
                  onPointerDown={() => { if (!canGoNext) return; setNextDown(true); }}
                  onPointerUp={() => setNextDown(false)}
                  onPointerLeave={(e) => { if (e.buttons === 0) setNextDown(false); }}
                  onPointerCancel={() => setNextDown(false)}
                  onClick={() => { goNext(); setNextEverClicked(true); }}
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
                  <div className={styles.progressTrack} aria-hidden>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${((selected + 1) / n) * 100}%` } as CSSProperties}
                    />
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
                      View project<span aria-hidden> →</span>
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
                  onClick={onPlay}
                  aria-label="Play animation"
                >
                  <PressableIcon normalSrc={ASSETS.btn.play} pressedSrc={ASSETS.btn.playPressed} width={48} height={48} isDown={playDown} />
                  <span className={styles.transportLabel}>Play</span>
                </button>
                <button
                  type="button"
                  className={styles.transportBtn}
                  disabled={!canGoPrev}
                  onPointerDown={() => { if (!canGoPrev) return; setPrevDown(true); }}
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
                  onPointerDown={() => { if (!canGoNext) return; setNextDown(true); }}
                  onPointerUp={() => setNextDown(false)}
                  onPointerLeave={(e) => { if (e.buttons === 0) setNextDown(false); }}
                  onPointerCancel={() => setNextDown(false)}
                  onClick={() => { goNext(); setNextEverClicked(true); }}
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
      </div>
    </section>
  );
}

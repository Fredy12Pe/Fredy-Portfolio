"use client";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
    const mixHex = (from: string, to: string, t: number) => {
      const value = clamp(t);
      const a = from.replace("#", "");
      const b = to.replace("#", "");
      const ar = parseInt(a.slice(0, 2), 16);
      const ag = parseInt(a.slice(2, 4), 16);
      const ab = parseInt(a.slice(4, 6), 16);
      const br = parseInt(b.slice(0, 2), 16);
      const bg = parseInt(b.slice(2, 4), 16);
      const bb = parseInt(b.slice(4, 6), 16);
      const rr = Math.round(ar + (br - ar) * value);
      const rg = Math.round(ag + (bg - ag) * value);
      const rb = Math.round(ab + (bb - ab) * value);
      return `rgb(${rr}, ${rg}, ${rb})`;
    };

    const applyProgress = (progress: number) => {
      const section = sectionRef.current;
      if (!section) return;

      const stage = section.querySelector<HTMLElement>("[data-squares-stage]");
      const endTint = clamp((progress - 0.56) / 0.44);
      if (stage) {
        stage.style.backgroundColor = mixHex("#FFDC79", "#FFF4D5", Math.pow(endTint, 1.08));
      }

      const layers = section.querySelectorAll<HTMLElement>("[data-squares-layer]");
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0);
        const lag = depth * 0.06;
        const local = clamp((progress - lag) / (1 - lag));
        const eased = 1 - Math.pow(1 - local, 1.8);
        const scale = 0.04 + eased * 1.32;
        // Outer layer (depth=0) reaches full opacity so it completely covers the stage
        const opacity = clamp(0.14 + local * (1.0 - 0.14 - depth * 0.055));
        // All layers converge to the stage end color so no seams are visible
        const fill = mixHex("#C89B1F", "#FFF4D5", local);
        const borderAlpha = Math.max(0, 0.18 - depth * 0.02) * (1 - local * 0.8);

        layer.style.opacity = opacity.toFixed(3);
        layer.style.backgroundColor = fill;
        layer.style.boxShadow = borderAlpha > 0.01 ? `inset 0 0 0 1px rgba(0,0,0,${borderAlpha.toFixed(3)})` : "none";
        layer.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      });

      const heading = section.querySelector<HTMLElement>("[data-about-heading]");
      const copy = section.querySelector<HTMLElement>("[data-about-copy]");
      const images = section.querySelector<HTMLElement>("[data-about-images]");

      if (heading) {
        const inView = clamp((progress - 0.12) / 0.2);
        const out = clamp((progress - 0.9) / 0.1);
        heading.style.opacity = (inView * (1 - out * 0.4)).toFixed(2);
        heading.style.transform = `translateY(${((1 - inView) * 22).toFixed(1)}px)`;
      }
      if (copy) {
        const reveal = clamp((progress - 0.34) / 0.24);
        copy.style.opacity = (reveal * 0.98).toFixed(2);
        copy.style.transform = `translateY(${((1 - reveal) * 24).toFixed(1)}px)`;
      }
      if (images) {
        const reveal = clamp((progress - 0.52) / 0.2);
        images.style.opacity = reveal.toFixed(2);
        images.style.transform = `translateY(${((1 - reveal) * 26).toFixed(1)}px)`;
      }
    };

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const track = section.querySelector<HTMLElement>("[data-squares-track]");
      if (!track) return;
      const vh = window.innerHeight || 800;
      const rect = track.getBoundingClientRect();
      // progress = 0 when track top hits viewport top (sticky begins)
      // progress = 1 when track bottom hits viewport bottom (sticky ends) — no leftover space
      const travel = Math.max(rect.height - vh, 1);
      const progress = clamp(-rect.top / travel);
      applyProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#FFDC79]"
    >
      {/* Scroll track: 350svh gives ~250svh of animation travel — slow, deliberate */}
      <div className="relative h-[350svh]" data-squares-track="">
        {/* Sticky stage: clipped full-screen, stays pinned for the full track */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#FFDC79]" data-squares-stage="">

          {/* Subtle center highlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,244,209,0.22), rgba(255,244,209,0) 72%)",
            }}
          />

          {/* Concentric square layers */}
          <div className="absolute inset-0">
            {[132, 116, 100, 84, 68, 52, 36, 24].map((size, idx) => (
              <div
                key={size}
                data-squares-layer=""
                data-depth={idx}
                className="absolute left-1/2 top-1/2 bg-[#C89B1F]"
                style={{
                  width: `${size}%`,
                  aspectRatio: "1",
                  transform: "translate(-50%, -50%) scale(0.04)",
                  opacity: 0.14,
                  filter: "blur(0.2px)",
                }}
              />
            ))}
          </div>

          {/* Foreground content */}
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[110rem] flex-col justify-center overflow-y-auto px-4 py-10 md:px-8 md:py-14">
            <h2
              data-about-heading=""
              className="font-bebas text-[3.6rem] uppercase leading-none tracking-wide text-black sm:text-[5rem] md:text-[7rem] lg:text-[9rem]"
              style={{ opacity: 0 }}
            >
              About Me
            </h2>

            <div
              data-about-copy=""
              className="mt-4 max-w-3xl text-black/90 md:mt-6"
              style={{ opacity: 0 }}
            >
              <p className="text-[1.05rem] leading-relaxed md:text-[1.2rem] md:leading-[1.65]">
                I am a passionate <span className="font-semibold">UI/UX designer</span> focused on creating clear, intuitive, and visually engaging digital experiences. With a strong foundation in design and a growing skill set in development,{" "}
                <span className="font-semibold">I blend creativity with functionality to turn ideas into real, working products.</span>{" "}
                My work emphasizes usability and detail, ensuring that every interaction feels seamless and purposeful.
              </p>
              <p className="mt-6 text-[1rem] leading-relaxed text-black/75 md:mt-8 md:text-[1.1rem] md:leading-[1.6]">
                This portfolio takes on the identity of what a modern 80s/90s inspired design experience could be; an era defined by vibrant color, playful energy, and a willingness to break convention. While modern design often leans toward simplicity, this explores how reintroducing character and personality can create more engaging, memorable experiences that connect with users.
              </p>
              <p className="mt-6 text-[1rem] leading-relaxed text-black/75 md:mt-8 md:text-[1.1rem] md:leading-[1.6]">
                Outside of design, I enjoy surfing, running, and producing music. These simple passions keep me inspired and balanced.
              </p>
            </div>

            <div
              data-about-images=""
              className="mt-6 opacity-0 md:mt-8"
            >
              <Carousel />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

type Slide = { type: "image" | "video" | "youtube" | "placeholder"; src: string; alt?: string };

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.includes("youtu.be/")
    ? url.split("youtu.be/")[1].split("?")[0]
    : url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&loop=1&playlist=${videoId}`;
}

function Carousel() {
  const slides: Slide[] = [
    { type: "image", src: "/images/about/Fredy.png", alt: "Fredy smiling with ocean background" },
    { type: "image", src: "/images/about/Surf.png", alt: "Surfboard and street scene" },
    { type: "youtube", src: "https://youtu.be/NzhowvwpWyo", alt: "Fredy's video" },
  ];

  const track: Slide[] = [slides[slides.length - 1], ...slides, slides[0]];
  const [current, setCurrent] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const realIndex = (current - 1 + slides.length) % slides.length;
  const nextIndex = (realIndex + 1) % slides.length;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (slides[realIndex].type === "video") v.play().catch(() => {});
    else v.pause();
  }, [realIndex, slides]);

  const go = (dir: -1 | 1) => {
    setIsAnimating(true);
    setEnableTransition(true);
    setCurrent((i) => i + dir);
  };

  return (
    <div className="max-w-3xl">
      {/* Two-up image grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {/* Primary slide */}
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <div className="relative h-full w-full">
            <div
              className={`flex h-full w-full will-change-transform ${
                enableTransition ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""
              }`}
              style={{ transform: `translate3d(-${current * 100}%,0,0)` }}
              onTransitionEnd={() => {
                if (current === 0) {
                  setEnableTransition(false);
                  setCurrent(slides.length);
                  requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                      setEnableTransition(true);
                      setIsAnimating(false);
                    })
                  );
                } else if (current === slides.length + 1) {
                  setEnableTransition(false);
                  setCurrent(1);
                  requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                      setEnableTransition(true);
                      setIsAnimating(false);
                    })
                  );
                } else {
                  setIsAnimating(false);
                }
              }}
            >
              {track.map((s, i) => (
                <div key={`${s.src}-${i}`} className="relative h-full w-full shrink-0 grow-0 basis-full">
                  {s.type === "image" ? (
                    <img
                      src={s.src}
                      alt={s.alt || ""}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : s.type === "youtube" ? (
                    <iframe
                      className="h-full w-full"
                      src={getYouTubeEmbedUrl(s.src)}
                      title={s.alt || "YouTube video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/20">
                      <p className="text-black/60">Media</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Nav buttons — bottom-right of the primary image */}
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <button
              onClick={() => go(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-all hover:bg-black"
              style={{ opacity: realIndex === 0 ? 0.35 : 1 }}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => go(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-all hover:bg-black"
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview of next slide */}
        <div className="hidden aspect-square overflow-hidden rounded-2xl md:block">
          {(() => {
            const s = slides[nextIndex];
            return s.type === "image" ? (
              <img
                src={s.src}
                alt={s.alt || ""}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                  isAnimating ? "opacity-0" : "opacity-40"
                }`}
              />
            ) : s.type === "youtube" ? (
              <iframe
                className={`h-full w-full transition-opacity duration-500 ${
                  isAnimating ? "opacity-0" : "opacity-40"
                }`}
                src={getYouTubeEmbedUrl(s.src)}
                title={s.alt || "YouTube video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="h-full w-full rounded-2xl bg-black/10" />
            );
          })()}
        </div>
      </div>

    </div>
  );
}

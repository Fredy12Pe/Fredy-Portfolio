"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Local assets - using public folder paths

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const items = section.querySelectorAll<HTMLElement>('[data-parallax]');
      const vh = window.innerHeight || 800;
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
        const speedAttr = el.getAttribute('data-speed');
        const speed = speedAttr ? parseFloat(speedAttr) : 0.25;
        const translate = (0.5 - progress) * speed * 180; // stronger vertical drift
        el.style.willChange = 'transform, opacity';
        el.style.transform = `translateY(${translate.toFixed(2)}px)`;
        el.style.opacity = (0.6 + progress * 0.4).toFixed(2);
      });
    };
    onScroll();
    // Local reveal for About section
    const revealItems = Array.from(sectionRef.current?.querySelectorAll<HTMLElement>('[data-reveal]') || []);

    revealItems.forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 650ms ease, transform 650ms cubic-bezier(0.22,1,0.36,1)';
      el.style.transitionDelay = `${idx * 110}ms`;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    revealItems.forEach((el) => io.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="mx-auto mt-12 md:mt-24 max-w-[100rem] px-4 md:px-8">
      <h2 className="whitespace-nowrap text-[36px] sm:text-[56px] md:text-[72px] lg:text-[90px] xl:text-[110px] font-black tracking-tight text-white uppercase text-left">About Me</h2>

      <div data-reveal>
        <div data-parallax data-speed="0.18" className="mt-6 md:mt-0 w-full md:w-4/6">
          <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[22px] leading-relaxed md:leading-8 lg:leading-9 xl:leading-[34px] text-[#828282]">
            I am a passionate <span className="font-semibold text-white">UI/UX designer</span> focused on creating clear, intuitive, and visually engaging unique digital experiences. With a strong foundation in design and a growing skill set in development, <span className="font-semibold text-white">I blend creativity with functionality to turn ideas into real, working products.</span> My work emphasizes usability and detail, ensuring that every interaction feels seamless and purposeful.
          </p>
          <p className="mt-8 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[22px] leading-relaxed md:leading-8 lg:leading-9 xl:leading-[34px] text-[#6C6C6C]">
            Outside of design, I enjoy surfing, running, and producing music, simple passions that keep me inspired and balanced.
          </p>
        </div>
      </div>

      <Carousel />
    </section>
  );
}

type Slide = { type: "image" | "video" | "youtube" | "placeholder"; src: any; alt?: string };

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.includes('youtu.be/') 
    ? url.split('youtu.be/')[1].split('?')[0]
    : url.split('v=')[1]?.split('&')[0];
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&loop=1&playlist=${videoId}`;
}

function Carousel() {
  const slides: Slide[] = [
    { type: "image", src: "/images/test-image.png", alt: "I smiling with ocean background" },
    { type: "image", src: "/images/test-image.png", alt: "Surfboard and street scene" },
    // YouTube video embed
    { type: "youtube", src: "https://youtu.be/NzhowvwpWyo", alt: "Fredy's video" },
  ];
  
  const track: Slide[] = [slides[slides.length - 1], ...slides, slides[0]];
  const [current, setCurrent] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const realIndex = (current - 1 + slides.length) % slides.length;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (slides[realIndex].type === "video") {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [realIndex, slides]);

  const go = (dir: -1 | 1) => {
    setIsAnimating(true);
    setEnableTransition(true);
    setCurrent((i) => i + dir);
  };

  const nextIndex = (realIndex + 1) % slides.length;

  return (
    <div className="mt-6 md:mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div data-reveal>
        <div data-parallax data-speed="0.3" className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5 mt-2 md:mt-8 h-[500px] md:h-[580px] lg:h-[660px]">
          <div className="relative h-full w-full">
            <div
              className={`flex h-full w-full will-change-transform ${enableTransition ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""}`}
              style={{ transform: `translate3d(-${current * 100}%,0,0)` }}
              onTransitionEnd={() => {
                if (current === 0) {
                  setEnableTransition(false);
                  setCurrent(slides.length);
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setEnableTransition(true);
                      setIsAnimating(false);
                    });
                  });
                } else if (current === slides.length + 1) {
                  setEnableTransition(false);
                  setCurrent(1);
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setEnableTransition(true);
                      setIsAnimating(false);
                    });
                  });
                } else {
                  setIsAnimating(false);
                }
              }}
            >
              {track.map((s, i) => (
                <div key={i} className="relative h-full w-full shrink-0 grow-0 basis-full">
                  {s.type === "image" ? (
                    <img
                      src={s.src}
                      alt={s.alt || ""}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${i === current ? "opacity-100" : "opacity-20"}`}
                      onLoad={() => console.log('Image loaded successfully:', s.src)}
                      onError={(e) => console.error('Image failed to load:', s.src, e)}
                    />
                  ) : s.type === "video" ? (
                    <video
                      ref={i === current ? videoRef : undefined}
                      className={`about-media h-full w-full object-cover transition-opacity duration-300 ${i === current ? "opacity-100" : "opacity-20"}`}
                      src={s.src}
                      muted
                      controls
                      playsInline
                      autoPlay
                      loop
                    />
                  ) : s.type === "youtube" ? (
                    <iframe
                      className={`h-full w-full transition-opacity duration-300 ${i === current ? "opacity-100" : "opacity-20"}`}
                      src={getYouTubeEmbedUrl(s.src)}
                      title={s.alt || "YouTube video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center transition-opacity duration-300 ${i === current ? "opacity-100" : "opacity-20"}`}>
                      <div className="text-center text-white">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-lg font-medium">Video Coming Soon</p>
                        <p className="text-sm text-white/70 mt-2">Will be updated with YouTube embed</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform flex gap-2">
            <button
              onClick={() => go(-1)}
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/10 hover:bg-black/80"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/10 hover:bg-black/80"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div data-reveal className="hidden md:block">
        <div data-parallax data-speed="0.22" className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5 mt-8 h-[500px] md:h-[580px] lg:h-[660px]">
          {(() => {
            const s = slides[nextIndex];
            return s.type === "image" ? (
              <img
                src={s.src}
                alt={s.alt || ""}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-20"}`}
              />
            ) : s.type === "video" ? (
              <video
                className={`about-media h-full w-full object-cover transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-20"}`}
                src={s.src}
                muted
                playsInline
                loop
                // no controls on preview
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-20"}`}>
                <div className="text-center text-white/60">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-sm">Preview</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import styles from "./ProjectsSection.module.css";

// Import images statically - using public folder paths

type Tile = {
  title: string;
  description: string;
  href?: string;
  tileClass: string; // explicit grid placement at lg (col/row start and spans)
  backgroundClass: string;
};

const tiles: Tile[] = [
  {
    title: "SEA & SKY",
    description:
      "Online community built to empower underrepresented students in higher education.",
    href: "/projects/sea-and-sky",
    tileClass: "sea",
    backgroundClass:
      "bg-[linear-gradient(135deg,#1e90ff,#0a66c2)]",
  },
  {
    title: "TIDEHAUS",
    description:
      "Tidehaus is a modern surf e-commerce site built to showcase and sell surfboards and accessories with a clean, coastal aesthetic.",
    tileClass: "tidehaus",
    backgroundClass: "bg-[linear-gradient(135deg,#0ea5a6,#0b7285)]",
  },
  {
    title: "SELAH",
    description:
      "A devotional app that guides users through scripture, reflection, and journaling.",
    href: "/projects/selah-reflect",
    tileClass: "selah",
    backgroundClass:
      "bg-[linear-gradient(135deg,#1f766e,#2c8f7a)]",
  },
  {
    title: "ZIPLEARN",
    description:
      "An intuitive tutoring app that makes learning faster, simpler, and accessible.",
    href: "/projects/ziplearn",
    tileClass: "ziplearn",
    backgroundClass: "bg-[linear-gradient(135deg,#6d28d9,#7c3aed)]",
  },
  {
    title: "E‑COMMERCE",
    description:
      "Led the redesign of the Samples Store, leveraging a Shopify template to create a streamlined and user-friendly shopping journey.",
    tileClass: "ecommerce",
    backgroundClass: "bg-[linear-gradient(135deg,#1f2937,#0b0f14)]",
  },
];

export default function ProjectsSection() {
  useEffect(() => {
    const handleScroll = () => {
      const isSmall = window.innerWidth < 768;
      const elements = document.querySelectorAll<HTMLElement>(".js-parallax");
      elements.forEach((el) => {
        if (isSmall) {
          el.style.transform = "translateY(0px)";
          return;
        }
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight || 800;
        const progress = Math.min(Math.max((viewportH - rect.top) / (viewportH + rect.height), 0), 1);
        const translate = (progress - 0.5) * 40; // ~10% of typical card
        el.style.willChange = "transform";
        el.style.transform = `translateY(${translate.toFixed(2)}px)`;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const parents = Array.from(document.querySelectorAll<HTMLElement>(".js-tilt-parent, .js-tilt-parent-all"));
    const move = (parent: HTMLElement, e: MouseEvent) => {
      // Disable tilt effect on mobile devices
      if (window.innerWidth < 768) {
        return;
      }
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.2) * 4; // ~-4..4 deg (reduced)
      const rotateX = (0.2 - y) * 4; // ~-4..4 deg (reduced)
      parent.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    };
    const leave = (parent: HTMLElement) => {
      parent.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };
    parents.forEach((p) => {
      const onMove = (e: Event) => move(p, e as MouseEvent);
      const onLeave = () => leave(p);
      p.style.transformStyle = "preserve-3d";
      p.style.willChange = "transform";
      p.style.transition = "transform 250ms ease-out";
      p.addEventListener("mousemove", onMove);
      p.addEventListener("mouseleave", onLeave);
      (p as any)._tiltHandlers = { onMove, onLeave };
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      parents.forEach((p) => {
        const h = (p as any)._tiltHandlers;
        if (h) {
          p.removeEventListener("mousemove", h.onMove);
          p.removeEventListener("mouseleave", h.onLeave);
        }
      });
    };
  }, []);
  return (
    <section id="projects" className="mx-auto mt-12 md:mt-16 max-w-[100rem] px-4 md:px-8">
      <h2 className="whitespace-nowrap text-[36px] sm:text-[56px] md:text-[72px] lg:text-[90px] xl:text-[110px] font-black tracking-tight text-white uppercase text-center md:text-left">
        Featured Projects
      </h2>

      <div className={"mt-8 mx-auto w-full max-w-[100rem] px-0 " + styles.portfolioGrid}>
        {tiles.map((tile) => {
          const images: Record<string, any> = {
            sea: "/images/projects/seaSky-thumbnail.png",
            tidehaus: "/images/projects/tidehaus-thumbnail.png",
            selah: "/images/projects/selah-Thumbnail.png",
            ziplearn: "/images/projects/ziplearn-thumbnail.png",
            ecommerce: "/images/projects/ecommerce-bg.png",
          };
          const imgSrc = images[tile.tileClass];
          const isCover = tile.tileClass === "tidehaus" || tile.tileClass === "ecommerce";
          const wrapperPadding =
            tile.tileClass === "selah"
              ? "px-1 md:px-32 pt-16 md:pt-48 pb-0" // further increased image size on mobile only, bottom aligned
              : tile.tileClass === "ziplearn"
              ? "px-24 md:px-60 pt-28 md:pt-60 pb-0" // slightly smaller image size on mobile for ziplearn
              : isCover
              ? "p-0" // cover entire container
              : tile.tileClass === "sea"
              ? "px-0 md:px-8 pt-0 md:pt-8 pb-0" // maximum image size on mobile, bottom aligned
              : "p-6 md:p-8"; // default
          const objectFitClass = isCover ? "object-cover" : "object-contain";
          const objectPositionClass =
            tile.tileClass === "sea" || tile.tileClass === "selah" || tile.tileClass === "ziplearn"
              ? "object-bottom"
              : "object-center";
          const containerPadding = 
            tile.tileClass === "sea" || tile.tileClass === "selah" || tile.tileClass === "ziplearn"
              ? "px-6 pt-6 pb-0" // no bottom padding for bottom-aligned images
              : "p-6"; // normal padding for others
          const showHoverButton = ["sea", "selah", "ziplearn", "ecommerce", "tidehaus"].includes(tile.tileClass);
          const enableImageScale = ["sea", "selah", "ziplearn"].includes(tile.tileClass);
          const content = (
            <div className={
              "group js-tilt-parent relative h-full w-full overflow-hidden ring-1 ring-inset ring-white/10 transition-transform duration-300 " +
              containerPadding +
              " " + styles.cardBase + " " + (tile.tileClass === "ecommerce" ? styles.ecommerceMobile : "") + " " + tile.backgroundClass
            }>
              {imgSrc ? (
                isCover ? (
                  <div className="pointer-events-none absolute inset-0 p-0">
                    <Image
                      src={imgSrc}
                      alt={tile.title}
                      fill
                      className="h-full w-full object-cover object-center"
                      sizes="(min-width: 1024px) 819px, 100vw"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className={`pointer-events-none absolute inset-0 flex ${tile.tileClass === "sea" ? "items-end justify-center md:items-end" : "items-end"} js-tilt-parent-all ${wrapperPadding}`}>
                    <div className={`js-parallax relative w-full ${tile.tileClass === "sea" ? "h-3/5 md:h-auto" : "h-auto"} will-change-transform`}>
                      <div className={`relative w-full ${tile.tileClass === "sea" ? "h-full md:h-auto" : "h-auto"} ${enableImageScale ? "transition-transform duration-500 ease-in-out md:group-hover:scale-[1.10]" : ""}`}>
                        <Image
                          src={imgSrc}
                          alt={tile.title}
                          width={800}
                          height={600}
                          className={`w-full ${tile.tileClass === "sea" ? "h-full md:h-auto object-cover md:object-contain" : "h-auto object-contain"}`}
                          sizes="(min-width: 1024px) 819px, 100vw"
                          priority={false}
                        />
                      </div>
                    </div>
                  </div>
                )
              ) : null}
              {tile.tileClass === "tidehaus" ? (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 z-10 rounded-[1.25rem] opacity-0 transition-all duration-500 ease-in-out md:group-hover:opacity-100"
                    style={{ background: "rgba(0, 0, 0, 0.10)", backdropFilter: "blur(90px)" }}
                  />
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-10 opacity-0 translate-y-2 transition-all duration-500 ease-in-out md:group-hover:opacity-100 md:group-hover:translate-y-0 flex items-start justify-center"
                    style={{ top: "14rem", bottom: "2rem" }}
                  >
                    <div className="relative w-5/6 h-5/6 transform scale-95 transition-transform duration-500 ease-in-out md:group-hover:scale-100">
                      <Image
                        src="/images/projects/Tidehaus-imgOverlay.png"
                        alt="Tidehaus overlay"
                        fill
                        className="object-contain"
                        sizes="(min-width: 1024px) 819px, 100vw"
                      />
                    </div>
                  </div>
                </>
              ) : null}
              {showHoverButton ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center">
                  {tile.href ? (
                    <Link
                      href={tile.href}
                      className="pointer-events-auto inline-flex items-center justify-center gap-2 w-[300px] h-[66px] rounded-[1.25rem] bg-white/20 backdrop-blur-md text-white text-base font-medium font-poppins opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 transition-all duration-500 ease-in-out will-change-transform md:group-hover:opacity-100 md:group-hover:translate-y-0 md:hover:bg-white md:hover:text-black"
                    >
                      Check Out Project
                    </Link>
                  ) : (
                    <div className="pointer-events-auto inline-flex items-center justify-center gap-2 w-[300px] h-[72px] rounded-[1.25rem] bg-white/20 backdrop-blur-md text-white text-base font-medium font-poppins opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 transition-all duration-500 ease-in-out will-change-transform md:group-hover:opacity-100 md:group-hover:translate-y-0 md:hover:bg-white md:hover:text-black">
                      Check Out Project
                    </div>
                  )}
                </div>
              ) : null}
              {(() => {
                let overlayStyle: React.CSSProperties | undefined;
                if (tile.tileClass === "sea") {
                  overlayStyle = {
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(0deg, #003B76 0%, rgba(11, 114, 216, 0) 100%)",
                    borderRadius: "1.25rem",
                  };
                } else if (tile.tileClass === "selah") {
                  overlayStyle = {
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(0deg, #172528 0%, rgba(56.17, 107.84, 118.72, 0) 100%)",
                    borderRadius: "1.25rem",
                  };
                } else if (tile.tileClass === "ziplearn") {
                  overlayStyle = {
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(180deg, rgba(69.27, 36.40, 145, 0) 19%, #2D0096 100%)",
                    borderRadius: "1.25rem",
                  };
                } else if (tile.tileClass === "ecommerce") {
                  overlayStyle = {
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.86)",
                    borderRadius: "1.25rem",
                  };
                }
                return overlayStyle ? (
                  <div className="pointer-events-none absolute inset-0 z-10" style={overlayStyle} />
                ) : null;
              })()}
              {tile.tileClass === "tidehaus" ? (
                <div className={"absolute inset-0 z-0 hidden md:block " + styles.tideRegion}>
                  <div className={styles.bubble + " " + styles.delayNeg1 + " " + styles.speed2} style={{ top: "0rem", left: "0rem" }}>E-Commerce</div>
                  <div className={styles.bubble + " " + styles.delay3 + " " + styles.speed3 + " " + styles.variant2} style={{ top: "0rem", right: "0rem" }}>Responsive</div>
                  <div className={styles.bubble + " " + styles.delay7 + " " + styles.speed1} style={{ top: "9rem", left: "0rem" }}>User-Friendly</div>
                  <div className={styles.bubble + " " + styles.delay2 + " " + styles.speed2} style={{ top: "9rem", right: "0rem" }}>Modern Design</div>
                  <div className={styles.bubble + " " + styles.delay5 + " " + styles.speed3 + " " + styles.variant2} style={{ bottom: "20rem", left: "0rem" }}>Surf Gear</div>
                  <div className={styles.bubble + " " + styles.delay8 + " " + styles.speed1} style={{ bottom: "20rem", right: "0rem" }}>Wetsuits</div>
                </div>
              ) : null}
              {(() => {
                const textContainerClass = `relative z-20 ${isCover ? (tile.tileClass === "ecommerce" ? "text-center pt-6 px-6 md:text-left md:pt-10 md:px-10" : "text-left pt-3 pl-3 pr-32 md:pt-10 md:px-10") : "text-center pt-10 px-10"}`;
                const titleClass = "text-3xl md:text-4xl font-bold uppercase tracking-tight text-white font-poppins";
                const paragraphClass = `mt-2 max-w-[40ch] text-sm md:text-lg leading-6 md:leading-7 text-white/85 font-poppins ${isCover ? "" : "mx-auto"}`;
                return (
                  <div className={textContainerClass}>
                    <div className={titleClass}>{tile.title}</div>
                    <p className={paragraphClass}>{tile.description}</p>
                  </div>
                );
              })()}

              
            </div>
          );

          const wrapperClasses = `block ${styles[tile.tileClass as keyof typeof styles] || ""} ${tile.tileClass?.includes("tide") ? styles.tideTall : ""}`;

          return (
            <div key={tile.title} className={wrapperClasses}>
              {content}
            </div>
          );
        })}
      </div>

      {/* Bottom button temporarily removed until more projects are added */}
    </section>
  );
}



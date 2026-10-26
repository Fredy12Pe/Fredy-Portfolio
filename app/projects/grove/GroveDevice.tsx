"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type ProjectBriefMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  description: string;
};

export const PROJECT_BRIEF_MEDIA = [
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Main_screen.MP4",
    alt: "Grove welcome screen",
    title: "Welcome Screen",
    description: "Brand-forward entry screen with sign-in options and the main character.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Onboarding_screen.MP4",
    alt: "Grove onboarding walkthrough video",
    title: "Onboarding Flow",
    description: "First-time user experience introducing Grove's calming habit journey.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Habit_completion.MP4",
    alt: "Grove habit completion walkthrough video",
    title: "Habit Completion",
    description: "Completing a habit and seeing immediate feedback tied to garden growth.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Game_world_overview.MP4",
    alt: "Grove game world overview video",
    title: "Game World Overview",
    description: "A quick look at how user habits evolve the larger Grove environment.",
  },
  {
    type: "image",
    src: "/projects/grove/project-brief/images/Progress.PNG",
    alt: "Grove progress screen",
    title: "Progress Dashboard",
    description: "Monthly completion view showing streaks and consistency across habits.",
  },
  {
    type: "video",
    src: "/projects/grove/project-brief/videos/Breathing_screen.MP4",
    alt: "Grove breathing screen walkthrough video",
    title: "Breathing Experience",
    description: "Mindful breathing flow designed to support calm and daily recovery.",
  },
  {
    type: "image",
    src: "/projects/grove/project-brief/images/Widgets.PNG",
    alt: "Grove home screen widgets",
    title: "Home Screen Widgets",
    description: "iOS widget surfaces that keep progress visible outside the app.",
  },
] satisfies ProjectBriefMedia[];

function ProjectBriefPhoneScreen({ media, activeMedia }: { media: ProjectBriefMedia; activeMedia: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2.85rem] bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={media.src}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {media.type === "image" ? (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              priority={activeMedia === 0}
              sizes="(max-width: 768px) 72vw, 352px"
              className="object-cover"
            />
          ) : (
            <video
              aria-label={media.alt}
              autoPlay
              controls={false}
              disablePictureInPicture
              loop
              muted
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
              controlsList="nodownload nofullscreen noremoteplayback"
            >
              <source src={media.src} type="video/mp4" />
            </video>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

type PhoneMockupProps = {
  phoneOnly?: boolean;
  // Optional: the screen shown, controlled by the parent (the board's screen picker)
  activeMedia?: number;
  onMediaChange?: (index: number) => void;
};

export function FramerPhoneMockup({ phoneOnly = false, activeMedia: controlledMedia, onMediaChange }: PhoneMockupProps = {}) {
  const [ownMedia, setOwnMedia] = useState(0);
  const activeMedia = controlledMedia ?? ownMedia;
  const setActiveMedia = (next: number | ((index: number) => number)) => {
    const index = typeof next === "function" ? next(activeMedia) : next;
    if (onMediaChange) onMediaChange(index);
    else setOwnMedia(index);
  };
  const media = PROJECT_BRIEF_MEDIA[activeMedia];

  return (
    <motion.div aria-label="iPhone mockup for Grove app walkthrough" className={phoneOnly ? "h-full w-full" : "w-full"}>
      <div
        className={
          phoneOnly
            ? "h-full w-full"
            : "flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:justify-start lg:gap-16"
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={
            phoneOnly ? "relative h-full w-full overflow-visible" : "relative w-[min(72vw,22rem)] max-w-[442px] overflow-visible"
          }
          style={phoneOnly ? undefined : { aspectRatio: "442 / 914" }}
        >
          <div className="absolute left-[-0.7%] top-[16.6%] h-[4.6%] w-[7.2%] rounded-l-xl bg-black" />
          <div className="absolute left-[-0.7%] top-[24.3%] h-[7%] w-[7.2%] rounded-l-xl bg-black" />
          <div className="absolute left-[-0.7%] top-[33%] h-[7%] w-[7.2%] rounded-l-xl bg-black" />
          <div className="absolute right-[-0.7%] top-[28.9%] h-[10.9%] w-[7.2%] rounded-r-xl bg-black" />
          <div className="absolute inset-0 rounded-[3.9rem] bg-black p-[0.25%] shadow-2xl shadow-zinc-900/20">
            <div className="h-full w-full rounded-[3.8rem] bg-zinc-400 p-[0.25%]">
              <div className="h-full w-full rounded-[3.7rem] bg-zinc-800 p-[2%]">
                <div className="relative h-full w-full overflow-hidden rounded-[3.25rem] bg-black p-[2.5%]">
                  <div className="absolute left-1/2 top-[3%] z-10 h-[4%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
                  <div className="absolute inset-0">
                    <ProjectBriefPhoneScreen media={media} activeMedia={activeMedia} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {!phoneOnly && (
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl bg-zinc-50/80 px-8 py-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Current View</p>
          <h5 className="mt-2 text-xl font-semibold text-zinc-900">{media.title}</h5>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{media.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {PROJECT_BRIEF_MEDIA.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setActiveMedia(index)}
                className={`rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeMedia === index
                    ? "bg-[#E5F7B3] text-[#11B30B]"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </motion.aside>
        )}
      </div>
    </motion.div>
  );
}

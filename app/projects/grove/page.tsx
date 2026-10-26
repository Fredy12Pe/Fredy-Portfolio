"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { IconBrandApple } from "@tabler/icons-react";
import BoardWorkspace from "../board/BoardWorkspace";
import BoardNav from "../board/BoardNav";
import GroveFigjamBoard, { BOARD, HERO_START } from "./GroveFigjamBoard";

const GroveHeroRive = dynamic(() => import("./GroveHeroRive"), { ssr: false });

function CoverContent() {
  return (
    <div className="grid h-full items-center gap-6 px-10 sm:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col justify-center"
      >
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#E5F7B3]/70 px-3 py-1 text-xs font-medium text-[#11B30B] ring-1 ring-[#11B30B]/20">
          Grove Case Study
        </div>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#11B30B] sm:text-6xl">
          Your habits grow your world.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#11B30B]/80">
          A gamified habit tracking app where daily consistency grows a living garden. Grove replaces charts and
          streaks with a calm environment that responds to every habit you keep.
        </p>
        <div className="mt-8">
          <span
            aria-disabled="true"
            className="inline-flex items-center gap-2 rounded-full bg-[#11B30B] px-5 py-3 text-sm font-medium text-white shadow-sm"
          >
            <IconBrandApple aria-hidden="true" size={18} stroke={1.8} />
            Coming soon to App Store
          </span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative flex h-full w-full items-end justify-start"
      >
        <GroveHeroRive />
      </motion.div>
    </div>
  );
}

export default function GroveCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="h-screen overflow-hidden bg-[#f5f5f3] text-zinc-800">
        <section className="h-full w-full" aria-label="Case study">
          <BoardWorkspace width={BOARD.w} height={BOARD.h} start={HERO_START}>
            <GroveFigjamBoard />
          </BoardWorkspace>
        </section>

      </main>
    </div>
  );
}

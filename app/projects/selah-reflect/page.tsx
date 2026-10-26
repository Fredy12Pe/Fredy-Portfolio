"use client";

import BoardWorkspace from "../board/BoardWorkspace";
import BoardNav from "../board/BoardNav";
import SelahBoard, { SELAH_BOARD, SELAH_START } from "./SelahBoard";

// The Selah case study, on the same board as Grove and Sea & Sky: the canvas, the tools, the menu and the music
export default function SelahCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="h-screen overflow-hidden bg-[#f5f5f3] text-zinc-800">
        <section className="h-full w-full" aria-label="Case study">
          <BoardWorkspace width={SELAH_BOARD.w} height={SELAH_BOARD.h} start={SELAH_START} openScale={0.8} startLabel="Selah">
            <SelahBoard />
          </BoardWorkspace>
        </section>
      </main>
    </div>
  );
}

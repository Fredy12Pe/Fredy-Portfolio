"use client";

import BoardWorkspace from "../board/BoardWorkspace";
import BoardNav from "../board/BoardNav";
import EcommerceBoard, { SAMPLES_BOARD, SAMPLES_START } from "./EcommerceBoard";

// The Samples Store case study, on the same board as Grove and Sea & Sky: the canvas, the tools, the menu and the music
export default function EcommerceCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="h-screen overflow-hidden bg-[#f5f5f3] text-zinc-800">
        <section className="h-full w-full" aria-label="Case study">
          <BoardWorkspace width={SAMPLES_BOARD.w} height={SAMPLES_BOARD.h} start={SAMPLES_START} openScale={0.8} startLabel="Samples">
            <EcommerceBoard />
          </BoardWorkspace>
        </section>
      </main>
    </div>
  );
}

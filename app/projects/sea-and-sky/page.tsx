"use client";

import BoardWorkspace from "../board/BoardWorkspace";
import BoardNav from "../board/BoardNav";
import SeaBoard, { SEA_BOARD, SEA_START } from "./SeaBoard";

// The Sea & Sky case study, on the same board as Grove: the canvas, the tools, the menu and the music
export default function SeaSkyCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="h-screen overflow-hidden bg-[#f5f5f3] text-zinc-800">
        <section className="h-full w-full" aria-label="Case study">
          <BoardWorkspace width={SEA_BOARD.w} height={SEA_BOARD.h} start={SEA_START} openScale={0.8} startLabel="Sea & Sky">
            <SeaBoard />
          </BoardWorkspace>
        </section>
      </main>
    </div>
  );
}

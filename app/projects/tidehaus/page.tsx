"use client";

import BoardWorkspace from "../board/BoardWorkspace";
import BoardNav from "../board/BoardNav";
import TidehausBoard, { TIDEHAUS_BOARD, TIDEHAUS_START } from "./TidehausBoard";

// The Tidehaus case study, on the same board as Grove and Sea & Sky: the canvas, the tools, the menu and the music
export default function TidehausCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="h-screen overflow-hidden bg-[#f5f5f3] text-zinc-800">
        <section className="h-full w-full" aria-label="Case study">
          <BoardWorkspace width={TIDEHAUS_BOARD.w} height={TIDEHAUS_BOARD.h} start={TIDEHAUS_START} openScale={0.8} startLabel="Tidehaus">
            <TidehausBoard />
          </BoardWorkspace>
        </section>
      </main>
    </div>
  );
}

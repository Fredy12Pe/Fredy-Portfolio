"use client";

import BoardWorkspace from "../board/BoardWorkspace";
import BoardNav from "../board/BoardNav";
import ZipLearnBoard, { ZIPLEARN_BOARD, ZIPLEARN_START } from "./ZipLearnBoard";

// The ZipLearn case study, on the same board as Grove and Sea & Sky: the canvas, the tools, the menu and the music
export default function ZipLearnCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BoardNav />
      <main className="h-screen overflow-hidden bg-[#f5f5f3] text-zinc-800">
        <section className="h-full w-full" aria-label="Case study">
          <BoardWorkspace width={ZIPLEARN_BOARD.w} height={ZIPLEARN_BOARD.h} start={ZIPLEARN_START} openScale={0.8} startLabel="ZipLearn">
            <ZipLearnBoard />
          </BoardWorkspace>
        </section>
      </main>
    </div>
  );
}

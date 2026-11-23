import type { Metadata } from "next";
import Link from "next/link";
import BoardNav from "../../board/BoardNav";
import Shell from "./Shell";

export const metadata: Metadata = {
  title: "Grove Design System · Fredy",
  description:
    "The colors, type and components I designed for Grove, my habit tracker for iOS, and what held up once the app was built.",
  // OG image is a placeholder until one is exported
};

export default function GroveDesignSystemPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      <BoardNav />
      <main>
        <Shell />
        <div className="mx-auto mb-24 mt-16 max-w-[1320px] px-5 sm:px-8 min-[1400px]:px-0">
          <Link href="/projects/grove" className="inline-flex rounded-full px-4 py-2 text-[15px] font-medium text-zinc-900 ring-1 ring-zinc-300 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">← Back to Grove case study</Link>
        </div>
      </main>
    </div>
  );
}

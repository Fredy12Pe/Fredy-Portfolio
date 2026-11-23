"use client";

import { useEffect, useState } from "react";
import { SpecimenProvider, TOC } from "./parts";
import { Hero, Overview, Audit } from "./sectionsA";
import { Color, Typography, Spacing, Motion, Growth } from "./sectionsB";
import { Components, InAction, Reflection } from "./sectionsC";

/** Tracks which section is in view, for the contents rail and the phone section jump */
function useActiveSection() {
  const [active, setActive] = useState(TOC[0][0]);
  useEffect(() => {
    const els = TOC.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Shell() {
  const active = useActiveSection();
  return (
    <SpecimenProvider>
      <Hero />
      <div className="mx-auto max-w-[1320px] px-5 pb-10 sm:px-8 min-[1400px]:px-0">
        <div className="xl:grid xl:grid-cols-[190px_minmax(0,1fr)] xl:gap-14">
          <nav aria-label="On this page" className="sticky top-28 hidden self-start pt-24 xl:block">
            <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-wider text-zinc-500">On this page</p>
            <ol className="border-l border-zinc-200">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} aria-current={active === id ? "location" : undefined}
                    className={`-ml-px block border-l-2 px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-900 ${active === id ? "border-zinc-900 font-medium text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-900"}`}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="min-w-0">
            <Overview />
            <Audit />
            <Color />
            <Typography />
            <Spacing />
            <Motion />
            <Growth />
            <Components />
            <InAction />
            <Reflection />
          </div>
        </div>
      </div>
    </SpecimenProvider>
  );
}

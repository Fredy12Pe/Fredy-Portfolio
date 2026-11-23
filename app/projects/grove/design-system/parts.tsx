"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { tokens, type Mode } from "./tokens";

// Shared pieces for the design system page: specimen theme, copy-to-clipboard, tabs, badges.
// Page chrome uses the site's Tailwind classes. Grove colors only ever come from the tokens.

export const TOC: [string, string][] = [
  ["overview", "Overview"], ["audit", "What held up"], ["color", "Color"], ["typography", "Typography"],
  ["spacing", "Spacing and shape"], ["motion", "Motion and haptics"], ["growth", "Growth states"], ["components", "Components"],
  ["in-action", "System in action"], ["reflection", "Reflection"],
];

/* ───── specimen theme (Grove light / dark), separate from the site ───── */
const ModeCtx = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({ mode: "light", setMode: () => {} });
export const useMode = () => useContext(ModeCtx).mode;

const CopyCtx = createContext<(text: string) => void>(() => {});
export const useCopy = () => useContext(CopyCtx);

export function SpecimenProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = useCallback((text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setToast(text.length > 40 ? "Copied" : `Copied ${text}`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 1800);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <ModeCtx.Provider value={{ mode, setMode }}>
      <CopyCtx.Provider value={copy}>
        {children}
        <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          {toast ? <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</span> : null}
        </div>
      </CopyCtx.Provider>
    </ModeCtx.Provider>
  );
}

/* ───── tabs: keep long material one click away instead of one long scroll ───── */
export function TabGroup({ label, tabs }: { label: string; tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (n: number) => { setI(n); refs.current[n]?.focus(); };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (e.key in map) { e.preventDefault(); go(map[e.key]); }
  };
  const t = tabs[i];
  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {tabs.map((tab, n) => (
          <button key={tab.id} ref={(el) => { refs.current[n] = el; }} role="tab" type="button" id={`tab-${tab.id}`} aria-selected={i === n} aria-controls={`panel-${tab.id}`} tabIndex={i === n ? 0 : -1} onClick={() => setI(n)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${i === n ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} className="flex min-w-0 flex-col gap-6">{t.content}</div>
    </div>
  );
}

export function CopyButton({ text, label, className = "" }: { text: string; label?: string; className?: string }) {
  const copy = useCopy();
  return (
    <button type="button" onClick={() => copy(text)} aria-label={`Copy ${label ?? text}`}
      className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-[12px] text-zinc-700 hover:bg-zinc-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-900 ${className}`}>
      {label ?? text}
      <IconCopy size={12} aria-hidden />
    </button>
  );
}

export function Swatch({ color, name, note, className = "" }: { color: string; name: string; note?: string; className?: string }) {
  const copy = useCopy();
  return (
    <button type="button" onClick={() => copy(color)} aria-label={`${name}, ${color}. Copy hex`}
      className={`flex flex-col gap-2 rounded-[16px] bg-zinc-100 p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${className}`}>
      <span className="block h-14 w-full rounded-[8px] ring-1 ring-inset ring-black/10" style={{ backgroundColor: color }} />
      <span className="flex flex-col gap-0.5">
        <span className="break-all font-mono text-[12px] font-medium text-zinc-900">{name}</span>
        <span className="font-mono text-[12px] text-zinc-600">{color}</span>
        {note ? <span className="text-[12px] leading-[16px] text-zinc-600">{note}</span> : null}
      </span>
    </button>
  );
}

export function PassBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-900"><IconCheck size={12} aria-hidden />Passes AA</span>
  ) : (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-[12px] font-semibold text-red-900"><span aria-hidden>✕</span>Fails AA</span>
  );
}

export function AssetPlaceholder({ label, ratio = "16 / 10", className = "" }: { label: string; ratio?: string; className?: string }) {
  return (
    <div role="img" aria-label={`Placeholder: ${label}`} data-placeholder={label}
      className={`flex items-center justify-center rounded-[20px] border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 text-center ${className}`} style={{ aspectRatio: ratio }}>
      <span className="text-sm font-medium text-zinc-600">Placeholder<br /><span className="font-normal">{label}</span></span>
    </div>
  );
}

export function Section({ id, title, intro, badge, children }: { id: string; title: string; intro?: ReactNode; badge?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-32 border-t border-zinc-200 pt-12 mt-14 first:mt-10 first:border-t-0 first:pt-0 min-[1360px]:mt-16 min-[1360px]:pt-14">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id={`${id}-h`} className="text-[28px] font-semibold leading-[36px] tracking-[-0.8px] text-zinc-900 sm:text-[34px] sm:leading-[42px]">{title}</h2>
          {badge}
        </div>
        {intro ? <p className="max-w-[720px] text-[17px] leading-[27px] text-zinc-600">{intro}</p> : null}
      </div>
      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </section>
  );
}

export const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="text-[20px] font-semibold leading-[28px] tracking-[-0.2px] text-zinc-900">{children}</h3>
);

/** Renders Grove specimens on the active mode's own background */
export function Stage({ bg, color, children, className = "" }: { bg: string; color: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[24px] p-5 ring-1 ring-inset ring-black/10 sm:p-7 ${className}`} style={{ backgroundColor: bg, color, fontFamily: tokens.v1.typography.paragraph.$value.fontFamily }}>
      {children}
    </div>
  );
}

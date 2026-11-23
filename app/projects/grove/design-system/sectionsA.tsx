"use client";

import Image from "next/image";
import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { H3, PassBadge, Section, Swatch, TabGroup } from "./parts";
import { c, flatten, pairs as allPairs, tokens, type PairResult } from "./tokens";
import { fmt, threshold } from "./contrast";

const T = tokens;
const IMG = "/projects/grove/case-study";
const PRINCIPLES = [
  ["Friendly", "Rounded type, big rounded corners, and Sprout, a mascot who cheers you on instead of scolding you."],
  ["Nature themed", "Lime, sage, moss, olive and clay colors. Progress shows up as a plant growing, not a percentage."],
  ["Mindful clarity", "One main action per card and calm backgrounds, so the app never feels busy."],
] as const;

/* ───────── hero ───────── */
export function Hero() {
  const hero = ["accentLime", "primaryGreen", "limeMuted", "background", "cardBackground", "deepText"];
  return (
    <header id="top" className="mx-auto max-w-[1320px] px-5 pt-28 sm:px-8 min-[1400px]:px-0">
      <div className="grid overflow-hidden rounded-[32px] bg-zinc-50 ring-1 ring-zinc-200 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-zinc-600">Case study · Design system</p>
          <h1 className="text-[40px] font-semibold leading-[46px] tracking-[-1.2px] text-zinc-900 sm:text-[56px] sm:leading-[62px]">Grove Design System</h1>
          <p className="max-w-[540px] text-[18px] leading-[28px] text-zinc-600">
            The colors, type and components I designed for Grove, my habit tracker for iOS, and what held up once the app was built.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Brand colors from the Grove tokens">
            {hero.map((k) => (
              <li key={k} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 ring-1 ring-zinc-200">
                <span className="size-6 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c("light", k) }} />
                <span className="font-mono text-[12px] text-zinc-700">{k}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[1880/1410] w-full self-stretch lg:aspect-auto lg:min-h-[420px]">
          <Image src={`${IMG}/hero-phone-home.jpg`} alt="Grove home screen on an iPhone" fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
        </div>
        <dl className="grid grid-cols-2 gap-x-10 gap-y-5 border-t border-zinc-200 px-6 py-6 text-sm sm:px-10 md:flex md:flex-wrap md:gap-x-20 lg:col-span-2">
          {[["Role", "Designer and developer"], ["Platform", "iOS, React Native/Expo + SwiftUI widget"], ["Scope", "Colors, type, components"], ["Year", "2026"]].map(([k, v]) => (
            <div key={k}><dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{k}</dt><dd className="mt-1 font-medium text-zinc-900 md:whitespace-nowrap">{v}</dd></div>
          ))}
        </dl>
      </div>
    </header>
  );
}

/* ───────── overview (with v1 at a glance) ───────── */
export function Overview() {
  const roles = Object.keys(T.v1.color.light).length;
  const stats: [string, string][] = [
    [`${roles} × 2`, "colors, light and dark"],
    [String(T.v1.habitCardThemes.light.length + T.v1.habitCardThemes.dark.length), "habit card themes"],
    [String(Object.keys(T.v1.typography).length), "text styles"],
    [String(Object.keys(T.v1.radius).length), "corner sizes"],
    [String(Object.keys(T.v1.spacing).length), "spacing values"],
    ["1", "rule for custom colors"],
  ];
  return (
    <Section id="overview" title="Overview" intro="Grove turns your habits into a small island. Every habit you complete grows a plant, and if you skip a few days it wilts. I built it with React Native and Expo, plus a SwiftUI home screen widget, so the same colors have to work in both TypeScript and Swift.">
      <div>
        <div className="mb-4"><H3>At a glance</H3></div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([n, l]) => (
            <div key={l} className="flex flex-col-reverse justify-end rounded-[18px] bg-zinc-50 p-4 ring-1 ring-zinc-200"><dt className="mt-1 text-sm text-zinc-600">{l}</dt><dd className="text-[30px] font-semibold leading-[36px] tracking-tight text-zinc-900">{n}</dd></div>
          ))}
        </dl>
      </div>
      <TabGroup label="Overview details" tabs={[
        { id: "principles", label: "Principles", content: (
          <ul className="grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map(([n, d]) => (<li key={n} className="rounded-[20px] p-5 ring-1 ring-zinc-200"><p className="text-[18px] font-semibold text-zinc-900">{n}</p><p className="mt-2 text-zinc-600"><span className="font-medium text-zinc-800">This means: </span>{d}</p></li>))}
          </ul>) },
        { id: "audience", label: "How it is built", content: (
          <ul className="grid gap-4 md:grid-cols-3">
            {[["One theme file", "styles/theme.ts holds both color palettes, spacing, corner sizes and the type scale."], ["Light and dark mode", "useGroveColors() picks the light or dark palette based on the setting you choose in the app."], ["One text component", "AppText sets the size, weight and default color for each text style."]].map(([t, d]) => (
              <li key={t} className="rounded-[20px] bg-zinc-50 p-5 ring-1 ring-zinc-200"><p className="text-[18px] font-semibold text-zinc-900">{t}</p><p className="mt-1 text-zinc-600">{d}</p></li>))}
          </ul>) },
        { id: "files", label: "Source files", content: (
          <ul className="grid gap-2 font-mono text-[13px] text-zinc-800 sm:grid-cols-2">
            {["styles/theme.ts", "hooks/useGroveColors.ts", "components/ui/AppText.tsx", "components/habits/HabitRow.tsx", "app/(tabs)/_layout.tsx", "lib/habitHaptics.ts", "lib/game/plantGrowth.ts", "components/auth/auth-welcome-theme.ts", "targets/widget/GroveWidgets.swift"].map((f) => <li key={f} className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200">{f}</li>)}
          </ul>) },
      ]} />
    </Section>
  );
}

/* ───────── contrast table ───────── */
export function ContrastTable({ pairs, caption, initial = 8 }: { pairs: PairResult[]; caption: string; initial?: number }) {
  const [active, setActive] = useState(pairs[0]?.id);
  const [all, setAll] = useState(false);
  const shown = all ? pairs : pairs.slice(0, initial);
  const cur = pairs.find((p) => p.id === active) ?? pairs[0];
  return (
    <div className="flex flex-col gap-4">
      <div aria-live="polite" className="grid gap-3 rounded-[20px] bg-zinc-50 p-4 ring-1 ring-zinc-200 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex items-center gap-3 rounded-[14px] p-4 ring-1 ring-inset ring-black/10" style={{ backgroundColor: cur.bgHex, color: cur.fgHex }}>
          <span className="text-[26px] font-semibold leading-none" aria-hidden>Aa</span>
          <span className="text-[15px] font-medium">{cur.label.split(" · ")[1]}</span>
        </div>
        <p className="text-sm text-zinc-600"><span className="font-mono font-medium text-zinc-900">{fmt(cur.ratio)}:1</span> · needs {threshold(cur.kind)}:1 · {cur.fgHex} on {cur.bgHex}</p>
      </div>
      <div className="overflow-hidden rounded-[20px] ring-1 ring-zinc-200">
        <table className="block w-full text-left text-sm md:table">
          <caption className="sr-only">{caption}</caption>
          <thead className="sr-only bg-zinc-50 text-zinc-600 md:not-sr-only md:table-header-group">
            <tr><th scope="col" className="px-4 py-3 font-medium">Pair</th><th scope="col" className="px-4 py-3 font-medium">Ratio</th><th scope="col" className="px-4 py-3 font-medium">Needs</th><th scope="col" className="px-4 py-3 font-medium">Result</th></tr>
          </thead>
          <tbody className="block md:table-row-group">
            {shown.map((p) => (
              <tr key={p.id} tabIndex={0} onMouseEnter={() => setActive(p.id)} onFocus={() => setActive(p.id)}
                className={`grid grid-cols-[auto_1fr_auto] items-center gap-x-3 border-t border-zinc-200 px-4 py-3 outline-none md:table-row md:p-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-900 ${active === p.id ? "bg-zinc-100" : ""}`}>
                <th scope="row" className="col-span-3 mb-1 font-medium text-zinc-900 md:table-cell md:px-4 md:py-3">
                  <span className="inline-flex items-center gap-2"><span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[13px] font-semibold ring-1 ring-inset ring-black/10" style={{ backgroundColor: p.bgHex, color: p.fgHex }} aria-hidden>Aa</span>{p.label}</span>
                </th>
                <td className="font-mono md:table-cell md:px-4 md:py-3">{fmt(p.ratio)}:1</td>
                <td className="text-zinc-600 md:table-cell md:px-4 md:py-3">{threshold(p.kind)}:1 {p.kind === "text" ? "text" : "UI"}</td>
                <td className="md:table-cell md:px-4 md:py-3"><PassBadge ok={p.ok} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {pairs.length > initial ? (
          <button type="button" onClick={() => setAll(!all)} aria-expanded={all} className="w-full border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-900">
            {all ? "Show fewer" : `Show all ${pairs.length} pairs`}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ───────── decisions, tested ───────── */
// Leads with the calls that held up under measurement. The raw measurements sit underneath as evidence.
export function Audit() {
  const pairs = allPairs();
  const r = (id: string) => pairs.find((p) => p.id === id)!;
  const A = T.audit;
  const themeCount = T.v1.habitCardThemes.light.length + T.v1.habitCardThemes.dark.length;
  const kept: { title: string; proof: string; body: string; swatch?: string }[] = [
    { title: "Navy for every title", proof: `${fmt(r("l-deep-bg").ratio)}:1 on cream · ${fmt(r("l-deep-lime").ratio)}:1 on lime`, body: "deepText is the most readable color in the app. It works on every background, and even on the lime accent.", swatch: c("light", "deepText") },
    { title: "Each text style has its own color", proof: `${Object.keys(T.v1.typography).length} styles, each with a default color`, body: "AppText gives every text style a default color, so a heading always comes out navy without me setting it each time." },
    { title: "The active tab changes shape", proof: `Lime tint is only ${fmt(r("l-tab-active").ratio)}:1, the icon fills in`, body: "The lime tint on its own is hard to see, but the icon also switches from outline to filled, so you can still tell which tab you’re on." },
    { title: "One rule colors every habit", proof: `${themeCount} preset themes + any color you pick`, body: "habitCardThemeFromAccent takes one color and builds the whole card from it: the background, the icon circle and a darker accent." },
    { title: "Dark mode reads better", proof: `Active tab ${fmt(r("d-tab-active").ratio)}:1 dark vs ${fmt(r("l-tab-active").ratio)}:1 light`, body: `The lime stands out much more on the dark green backgrounds, and body text reaches ${fmt(r("d-secondary-card").ratio)}:1.` },
    { title: "A haptic for every action", proof: `${T.v1.haptics.length} moments, ${new Set(T.v1.haptics.map((h: { kind: string }) => h.kind)).size} kinds of feedback`, body: "A success tap when you complete a habit, a light tap for taps and undo, a medium one when you pick a card up, and an alarm pattern when a timer ends." },
  ];
  const outside = (g: "auth" | "widget") => flatten(`v1.color.${g}`);
  return (
    <Section id="audit" title="What held up"
      intro="Once the app was built, I went back and checked the design system. I measured the contrast of the main color pairs and counted how often the code used the theme instead of one-off values. These are the decisions that held up.">
      <div>
        <H3>Decisions that worked</H3>
        <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {kept.map((k) => (
            <li key={k.title} className="flex flex-col gap-2 rounded-[20px] bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-[17px] font-semibold leading-[24px] text-zinc-900">{k.title}</p>
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-[12px] text-zinc-800 ring-1 ring-zinc-200">
                {k.swatch ? <span aria-hidden className="size-3 rounded-full" style={{ backgroundColor: k.swatch }} /> : <IconCheck size={12} aria-hidden />}
                {k.proof}
              </p>
              <p className="text-sm leading-[21px] text-zinc-600">{k.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <H3>The numbers</H3>
        <p className="mb-5 mt-2 max-w-[720px] text-zinc-600">I calculated every ratio from the app’s real color values using the WCAG 2.2 formula. Text needs 4.5:1, and icons and controls need 3:1. Not every pair passes, and I’ve left those in.</p>
        <TabGroup label="Measurements" tabs={[
          { id: "contrast", label: "Contrast pairs", content: <ContrastTable pairs={pairs} caption="Measured contrast ratios for shipped color pairs" /> },
          { id: "adoption", label: "Theme use", content: (<>
            <p className="max-w-[720px] text-zinc-600">I searched the app’s code for colors, font sizes and corner sizes written straight into screens instead of coming from the theme, and for screens that use the light-only colors.</p>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {A.metrics.map((m: { value: number | string; label: string; detail?: string }) => (
                <div key={m.label} className="flex flex-col-reverse justify-end rounded-[18px] bg-zinc-50 p-5 ring-1 ring-zinc-200">
                  <dt className="mt-1 font-medium text-zinc-900">{m.label}{m.detail ? <span className="mt-1 block text-sm font-normal text-zinc-600">{m.detail}</span> : null}</dt>
                  <dd className="text-[32px] font-semibold leading-[38px] tracking-tight text-zinc-900">{m.value}</dd>
                </div>
              ))}
            </dl>
          </>) },
          { id: "outside", label: "Sign-in and widget colors", content: (<>
            <p className="max-w-[720px] text-zinc-600">Two parts of the app keep their own colors outside the theme file: the sign-in screens, and the SwiftUI widget, which sets its colors directly in Swift.</p>
            {(["auth", "widget"] as const).map((g) => (
              <div key={g}>
                <p className="mb-3 font-mono text-[12px] uppercase tracking-wider text-zinc-600">{g === "auth" ? "Sign-in screens" : "Home screen widget"}</p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {outside(g).map(([p, l]) => <li key={p}><Swatch color={String(l.$value)} name={p.split(".").pop()!} className="h-full w-full" /></li>)}
                </ul>
              </div>
            ))}
          </>) },
        ]} />
      </div>
    </Section>
  );
}

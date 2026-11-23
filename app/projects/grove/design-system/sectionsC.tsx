"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { IconChartBar, IconCheck, IconHome, IconHomeFilled, IconListCheck, IconMenu2, IconUser, IconUserFilled } from "@tabler/icons-react";
import { CopyButton, H3, Section, Stage, TabGroup, useMode } from "./parts";
import { c, cardThemes, generateTheme, leaf, px, tokens, type CardTheme, type Mode } from "./tokens";
import { mix } from "./contrast";

type State = "default" | "completed" | "pressed" | "dragging";
const DS = "/projects/grove/design-system";
const ICONS = ["Stretch", "DrinkWater", "Meditate", "ReadABook", "Exercise", "Journal", "Sleep7Hours", "PracticeGratitude"];
const NAMES = ["Stretch", "Drink water", "Meditate", "Read a book", "Exercise", "Journal", "Sleep 7 hours", "Practice gratitude"];
const HR = tokens.v1.component.habitRow;
const n = (p: string) => px(leaf(`v1.component.habitRow.${p}`).$value);

/* ───────── HabitRow, rebuilt from HabitRow.tsx ───────── */
function HabitRow({ theme, mode, state = "default", name, icon, week = 3 }: { theme: CardTheme; mode: Mode; state?: State; name: string; icon: string; week?: number }) {
  const done = state === "completed";
  const lift = leaf("v1.elevation.drag").$value as { color: string; offsetX: string; offsetY: string; blur: string };
  const sty: CSSProperties = {
    backgroundColor: theme.bg,
    minHeight: n("minHeight"),
    borderRadius: n("radius"),
    opacity: state === "pressed" ? HR.pressedOpacity.$value : 1,
    boxShadow: state === "dragging" ? `${lift.offsetX} ${lift.offsetY} ${lift.blur} ${lift.color}` : "none",
    transform: state === "dragging" ? "translateY(-2px)" : "none",
  };
  const nameTok = HR.name.$value;
  const progTok = HR.progress.$value;
  return (
    <div className="relative flex overflow-hidden" style={sty}>
      <div className="z-[1] flex min-w-0 flex-col justify-between" style={{ maxWidth: `${HR.contentMaxWidth.$value * 100}%`, padding: n("contentPadding"), paddingRight: 8 }}>
        <span role="img" aria-label={done ? "Completed" : "Not completed"} className="flex shrink-0 items-center justify-center rounded-full"
          style={{ width: n("checkbox.size"), height: n("checkbox.size"), borderWidth: n("checkbox.borderWidth"), borderStyle: "solid", borderColor: theme.accent, backgroundColor: done ? theme.accent : c(mode, "white"), color: c(mode, "onAccent") }}>
          {done ? <IconCheck size={n("checkbox.glyphSize")} stroke={3.2} aria-hidden /> : null}
        </span>
        <span className="my-3 flex flex-col gap-1">
          <span className="line-clamp-2" style={{ fontSize: nameTok.fontSize, fontWeight: nameTok.fontWeight, lineHeight: nameTok.lineHeight, color: c(mode, "deepText") }}>{name}</span>
          <span className="truncate" style={{ fontSize: progTok.fontSize, fontWeight: progTok.fontWeight, lineHeight: progTok.lineHeight, color: c(mode, "secondaryText") }}>{done ? "Done" : `Streak ${week}`}</span>
        </span>
        <span className="flex items-center" style={{ gap: n("weekDot.gap") }} aria-label={`${week} of 7 days this week`} role="img">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="rounded-full" style={{ width: n("weekDot.size"), height: n("weekDot.size"), backgroundColor: theme.accent, opacity: i >= week ? HR.weekDot.emptyOpacity.$value : 1 }} />
          ))}
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-[-8px] right-[-6px] top-1 flex w-[48%] items-center justify-center">
        <Image src={`${DS}/icons/${icon}.png`} alt="" width={261} height={288} className="h-[78%] w-auto object-contain" />
      </div>
      <span aria-hidden className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center" style={{ color: c(mode, "secondaryText"), opacity: HR.dragHandleOpacity.$value }}><IconMenu2 size={18} /></span>
    </div>
  );
}

function Spec({ title, children, notes }: { title: string; children: ReactNode; notes: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <H3>{title}</H3>
      {children}
      <ul className="grid gap-2 text-sm text-zinc-700 md:grid-cols-2">{notes.map((t) => <li key={t} className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200">{t}</li>)}</ul>
    </div>
  );
}

/* ───────── components section ───────── */
export function Components() {
  const mode = useMode();
  const themes = cardThemes(mode);
  const lid = useId();
  const [accent, setAccent] = useState<string>(cardThemes("light")[3].accent);
  const [heatPick, setHeatPick] = useState(0);
  const gen = generateTheme(accent, mode);
  const stage = { bg: c(mode, "background"), color: c(mode, "deepText") };
  const muted = c(mode, "secondaryText");
  const tabs: [string, ReactNode, ReactNode][] = [["Home", <IconHomeFilled key="a" size={24} />, <IconHome key="b" size={24} />], ["Habits", <IconListCheck key="c" size={24} />, <IconListCheck key="d" size={24} />], ["Progress", <IconChartBar key="e" size={24} />, <IconChartBar key="f" size={24} />], ["Profile", <IconUserFilled key="g" size={24} />, <IconUser key="h" size={24} />]];
  const heat = Array.from({ length: 35 }, (_, i) => ((i * 7 + 3) % 5) / 4);
  const T = tokens.v1.component.tabBar;
  return (
    <Section id="components" title="Components"
      intro="These are live versions of the components, built from the app’s real values. The habit card matches the one in the app: 148 pt tall, a round checkbox, the habit’s illustration on the right, and a drag handle.">
      <TabGroup label="Component specimens" tabs={[
        { id: "habitrow", label: "Habit card", content: (
          <Spec title="Habit card states" notes={["Each card has one main action, the round checkbox. Tapping anywhere else opens the habit.", "When you press a card it fades slightly, and when you drag it, it lifts with a shadow.", "Days you haven’t done yet show as faded dots in the same color.", "The label under the name shows your streak, “Done”, or a short summary like “10 min”."]}>
            <Stage {...stage}>
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                {(["default", "completed", "pressed", "dragging"] as State[]).map((s, i) => (
                  <li key={s} className="min-w-0"><p className="mb-1.5 font-mono text-[12px]" style={{ color: muted }}>{s}</p><HabitRow theme={themes[0]} mode={mode} state={s} name={NAMES[0]} icon={ICONS[0]} week={i + 2} /></li>
                ))}
              </ul>
            </Stage>
          </Spec>) },
        { id: "themes", label: "8 card themes", content: (
          <Stage {...stage}>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
              {themes.map((t, i) => (<li key={t.name} className="min-w-0"><p className="mb-1.5 font-mono text-[12px]" style={{ color: muted }}>{i + 1} · {t.name}</p><HabitRow theme={t} mode={mode} state={i % 3 === 1 ? "completed" : "default"} name={NAMES[i]} icon={ICONS[i]} week={(i * 2) % 7} /></li>))}
            </ul>
          </Stage>) },
        { id: "generator", label: "Custom colors", content: (<>
          <p className="max-w-[720px] text-zinc-600">Pick any color and Grove builds the whole card from it. The background is your color mixed 90% with cream (82% with dark green in dark mode), the icon circle 74%, and the darker accent adds 22% black.</p>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor={lid} className="text-sm font-medium text-zinc-800">Pick an accent</label>
            <input id={lid} type="color" value={accent.toLowerCase()} onChange={(e) => setAccent(e.target.value.toUpperCase())} className="h-9 w-12 cursor-pointer rounded-md" />
            <span className="flex flex-wrap gap-1.5" role="group" aria-label="Start from a theme accent">
              {cardThemes("light").map((t) => (<button key={t.name} type="button" onClick={() => setAccent(t.accent)} className="rounded-full bg-white px-2.5 py-1 text-[12px] text-zinc-800 ring-1 ring-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-900">{t.name}</button>))}
            </span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <Stage {...stage}><HabitRow theme={gen} mode={mode} name="Custom habit" icon="Journal" /></Stage>
            <ul className="grid grid-cols-2 gap-2">
              {(["accent", "bg", "iconWell", "accentDeep"] as const).map((k) => (
                <li key={k} className="flex items-center gap-2 rounded-[14px] bg-zinc-50 p-2.5 ring-1 ring-zinc-200"><span className="size-8 shrink-0 rounded-lg ring-1 ring-inset ring-black/10" style={{ backgroundColor: gen[k] }} aria-hidden /><span className="min-w-0"><span className="block font-mono text-[12px] font-medium text-zinc-900">{k}</span><CopyButton text={gen[k]} className="!px-0" /></span></li>
              ))}
            </ul>
          </div>
        </>) },
        { id: "progress", label: "Progress", content: (
          <Spec title="Today’s Progress" notes={["One segment per habit, filling in as you complete them.", "It sits on a light card with Sprout and a short message underneath."]}>
            <Stage bg={c(mode, "softSurface")} color={c(mode, "deepText")}>
              <p className="text-[20px] font-semibold leading-[26px]">Today’s Progress</p>
              <p className="mt-1 text-[16px] font-medium" style={{ color: muted }}>3 / 6 habits completed</p>
              <div className="mt-3 flex gap-2" role="img" aria-label="3 of 6 segments complete">
                {Array.from({ length: 6 }, (_, i) => <span key={i} className="h-[7px] w-10 rounded-full" style={{ backgroundColor: i < 3 ? c(mode, "accentLime") : c(mode, "mutedGray") }} />)}
              </div>
            </Stage>
          </Spec>) },
        { id: "tabbar", label: "Tab bar", content: (
          <Spec title="Floating tab bar" notes={["The active tab uses lime and a filled icon. The others use gray outlines.", `Every tab press gives a light haptic. The bar is ${px(T.height.$value)} pt tall with ${px(T.topRadius.$value)} pt rounded top corners.`]}>
            <Stage {...stage}>
              <ul className="mx-auto flex max-w-[400px] justify-around px-3 pb-5 pt-4" style={{ backgroundColor: c(mode, "tabBar"), borderTopLeftRadius: px(T.topRadius.$value), borderTopRightRadius: px(T.topRadius.$value) }}>
                {tabs.map(([t, on, off], i) => (<li key={t} className="flex flex-col items-center gap-0.5 text-[13px] font-semibold" style={{ color: i === 1 ? c(mode, "accentLimeSoft") : c(mode, "mutedGray") }}>{i === 1 ? on : off}<span>{t}</span></li>))}
              </ul>
            </Stage>
          </Spec>) },
        { id: "heatmap", label: "Heatmap", content: (
          <Spec title="Month heatmap" notes={["Each habit’s heatmap uses that habit’s own color, stronger on days you did more.", "Days with nothing done stay gray."]}>
            <Stage {...stage}>
              <ul className="grid max-w-[360px] grid-cols-7 gap-1.5" aria-label="Sample month heatmap">{heat.map((h, i) => <li key={i} className="aspect-square rounded-md" style={{ backgroundColor: h === 0 ? c(mode, "inactive") : mix(c(mode, "inactive"), themes[heatPick].accent, 0.35 + h * 0.65) }} />)}</ul>
              <label className="mt-3 flex items-center gap-2 text-sm">Habit color <select value={heatPick} onChange={(e) => setHeatPick(Number(e.target.value))} className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900">{themes.map((t, i) => <option key={t.name} value={i}>{t.name}</option>)}</select></label>
            </Stage>
          </Spec>) },
      ]} />
    </Section>
  );
}

/* ───────── system in action: the real Habits screen, annotated ───────── */
const SPOTS: { x: number; y: number; title: string; body: string }[] = [
  { x: 31.4, y: 41, title: "Selected day", body: "Today is marked in lime on the week calendar." },
  { x: 32.5, y: 47.1, title: "Navy titles", body: "Card titles use navy, the most readable color in the app." },
  { x: 33.8, y: 50.7, title: "Progress segments", body: "One segment per habit. Finished habits fill in lime." },
  { x: 23.9, y: 63, title: "Custom color", body: "I picked red for this habit. Grove built the pink background and the dots from that one color." },
  { x: 24.5, y: 68.2, title: "Progress label", body: "The label under the name shows your streak, “Done”, or a summary like “10 min”." },
  { x: 77.9, y: 62.2, title: "Drag handle", body: "Press and hold to reorder. You feel a medium haptic when the card lifts." },
  { x: 23.9, y: 75.1, title: "Completed habit", body: "A finished habit fills the checkbox with the card’s color and shows a white checkmark. Filled dots show the days you’ve done it." },
  { x: 42.4, y: 95.9, title: "Active tab", body: "The active tab is lime with a filled icon." },
];

export function InAction() {
  const [open, setOpen] = useState(0);
  const s = SPOTS[open];
  return (
    <Section id="in-action" title="System in action" intro="The Habits screen as it ships. Tap a number to see what’s behind it.">
      <div className="grid gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:items-start">
        <div className="relative mx-auto w-full max-w-[360px]">
          <Image src="/projects/grove/case-study/screen-habits.png" alt="Grove Habits screen: week calendar, Today’s Progress card and three habit cards" width={1885} height={4096} sizes="360px" className="h-auto w-full rounded-[24px]" />
          {SPOTS.map((p, i) => (
            <button key={p.title} type="button" aria-pressed={open === i} aria-label={`${i + 1}. ${p.title}`} onClick={() => setOpen(i)} onMouseEnter={() => setOpen(i)}
              className={`absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[12px] font-semibold ring-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${open === i ? "bg-zinc-900 text-white ring-white" : "bg-white text-zinc-900 ring-zinc-900"}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}>{i + 1}</button>
          ))}
        </div>
        <div className="flex flex-col gap-3 md:sticky md:top-36">
          <div aria-live="polite" className="rounded-[20px] bg-zinc-900 p-6 text-white">
            <p className="font-mono text-[12px] text-zinc-400">{open + 1} / {SPOTS.length}</p>
            <p className="mt-1 text-[20px] font-semibold">{s.title}</p>
            <p className="mt-2 text-zinc-300">{s.body}</p>
          </div>
          <ol className="hidden gap-1 md:grid">
            {SPOTS.map((p, i) => <li key={p.title}><button type="button" onClick={() => setOpen(i)} className={`w-full rounded-lg px-3 py-1.5 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-900 ${open === i ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-600 hover:bg-zinc-50"}`}>{i + 1}. {p.title}</button></li>)}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/* ───────── reflection ───────── */
export function Reflection() {
  const cols: [string, string[]][] = [
    ["What I’d do differently", ["Set up the theme before designing the first screen, so every screen uses it from the start.", "Check color contrast while picking colors, not after the app is built."]],
    ["What I learned", ["The decisions that lasted were about what each color is for: navy for text, lime for actions, and shape to show what’s selected.", "Making a design system was the easy part. Getting every screen to actually use it was harder."]],
  ];
  return (
    <Section id="reflection" title="Reflection" intro="This was my first design system, and I learned most of it by building the app.">
      <ul className="grid gap-4 md:grid-cols-2">{cols.map(([t, items]) => (<li key={t} className="rounded-[20px] bg-zinc-50 p-6 ring-1 ring-zinc-200"><p className="text-[19px] font-semibold text-zinc-900">{t}</p><ul className="mt-3 list-disc pl-5 text-zinc-700">{items.map((x) => <li key={x}>{x}</li>)}</ul></li>))}</ul>
      <p className="text-sm text-zinc-500">Every color, size and number on this page comes from the app’s real values.</p>
    </Section>
  );
}

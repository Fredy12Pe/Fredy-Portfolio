"use client";

import { useState, type ReactNode } from "react";
import { useRive } from "@rive-app/react-canvas";
import { IconAlarm, IconCheck, IconHandFinger, IconHandGrab, IconPlayerPlayFilled, IconRotateClockwise } from "@tabler/icons-react";
import { CopyButton, Section, Stage, TabGroup, useMode } from "./parts";
import { c, flatten, leaf, px, tokens, MODES } from "./tokens";

const T = tokens;
const DS = "/projects/grove/design-system";

/* ───────── color ───────── */
const GROUPS: [string, string[]][] = [
  ["Accents", ["primaryGreen", "accentLime", "accentLimeSoft", "limeMuted", "streakFlame", "error"]],
  ["Surfaces", ["background", "cardBackground", "softSurface", "white", "tabBar", "inactive"]],
  ["Text", ["deepText", "primaryText", "secondaryText", "mutedGray", "onAccent"]],
  ["Lines", ["outline", "divider", "borderSubtle"]],
];

export function Color() {
  const L = T.v1.color.light;
  const dark = T.v1.habitCardThemes.dark as Record<string, string>[];
  return (
    <Section id="color" title="Color" intro="Grove has 20 colors, each with a light version and a dark “Forest night” version. Lime is for actions and progress, cream and olive-gray keep the screens calm, and navy is for text. Click a value to copy it.">
      <TabGroup label="Color details" tabs={[
        { id: "roles", label: "Colors", content: (
          <div className="flex flex-col gap-6">
            {GROUPS.map(([g, keys]) => (
              <div key={g}>
                <p className="mb-2 font-mono text-[12px] uppercase tracking-wider text-zinc-600">{g}</p>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {keys.map((k) => (
                    <li key={k} className="flex items-center gap-3 rounded-[14px] bg-zinc-50 p-2.5 ring-1 ring-zinc-200">
                      <span className="flex shrink-0 overflow-hidden rounded-[10px] ring-1 ring-inset ring-black/10" aria-hidden>
                        {MODES.map((m) => <span key={m} className="block size-10" style={{ backgroundColor: c(m, k) }} />)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[13px] font-medium text-zinc-900">{k}</span>
                        <span className="block truncate text-[12px] text-zinc-600">{L[k].$description}</span>
                        <span className="flex flex-wrap gap-x-1"><CopyButton text={c("light", k)} className="!px-0" /><span className="text-zinc-400" aria-hidden>/</span><CopyButton text={c("dark", k)} className="!px-0" /></span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-sm text-zinc-500">Each chip shows light on the left and dark on the right.</p>
          </div>) },
        { id: "themes", label: "Habit card colors", content: (<>
          <p className="max-w-[720px] text-zinc-600">Each mode has eight card themes, used in order as you add habits. Each theme has four colors: the card background, the accent for the checkbox and week dots, a darker accent for expanded controls, and the circle behind the icon.</p>
          <div className="overflow-x-auto rounded-[20px] ring-1 ring-zinc-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Habit card themes, light and dark values</caption>
              <thead className="bg-zinc-50"><tr>{["Theme", "bg", "accent", "accentDeep", "iconWell"].map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {T.v1.habitCardThemes.light.map((t: Record<string, string>, i: number) => (
                  <tr key={t.name} className="border-t border-zinc-200">
                    <th scope="row" className="px-4 py-2 font-medium">{t.name}</th>
                    {["bg", "accent", "accentDeep", "iconWell"].map((k) => <td key={k} className="px-4 py-2"><span className="inline-flex items-center gap-2"><span className="flex overflow-hidden rounded-md ring-1 ring-inset ring-black/15" aria-hidden><span className="size-5" style={{ backgroundColor: t[k] }} /><span className="size-5" style={{ backgroundColor: dark[i][k] }} /></span><span className="font-mono text-[12px]">{t[k]}<span className="text-zinc-400"> / </span>{dark[i][k]}</span></span></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500">Each value shows light on the left and dark on the right.</p>
        </>) },
      ]} />
    </Section>
  );
}

/* ───────── typography ───────── */
const SAMPLE: Record<string, string> = { display: "Grow your mindful habits", h1: "Today’s Progress", h2: "Morning stretch", paragraph: "3 / 6 habits completed", paragraphRegular: "Playful prompts keep you connected to your routines.", small: "Streak 12" };
type TypeTok = { $value: { fontFamily: string; fontSize: string; fontWeight: number; lineHeight: string }; $description: string; $extensions: Record<string, string> };

export function Typography() {
  const mode = useMode();
  const v1 = Object.entries(T.v1.typography) as [string, TypeTok][];
  const HR = T.v1.component.habitRow;
  return (
    <Section id="typography" title="Typography" intro="Everything uses SF Pro Rounded, in six styles. Each style comes with a default color, so headings are navy and body text is olive-gray without extra work.">
      <Stage bg={c(mode, "background")} color={c(mode, "deepText")}>
        <ul className="flex flex-col">
          {v1.map(([k, t]) => (
            <li key={k} className="grid gap-1 border-b py-3 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-baseline sm:gap-4" style={{ borderColor: c(mode, "divider") }}>
              <p className="font-mono text-[12px]" style={{ color: c(mode, "secondaryText") }}><span className="font-semibold" style={{ color: c(mode, "deepText") }}>{k}</span> · {parseInt(t.$value.fontSize)}/{parseInt(t.$value.lineHeight)} · {t.$value.fontWeight} · {t.$extensions["com.grove.colorRole"]}</p>
              <p style={{ fontSize: t.$value.fontSize, lineHeight: t.$value.lineHeight, fontWeight: t.$value.fontWeight, color: c(mode, t.$extensions["com.grove.colorRole"]) }}>{SAMPLE[k]}</p>
            </li>
          ))}
        </ul>
      </Stage>
      <p className="max-w-[720px] text-zinc-600">Some components adjust a style. On habit cards the name is {parseInt(HR.name.$value.fontSize)}/{HR.name.$value.fontWeight} and the progress label {parseInt(HR.progress.$value.fontSize)}/{HR.progress.$value.fontWeight}, so the cards read a little bolder than lists.</p>
      <p className="text-sm text-zinc-500">The samples use the same font stack as the app’s web build. SF Pro Rounded only shows on Apple devices.</p>
    </Section>
  );
}

/* ───────── spacing, radius, elevation ───────── */
export function Spacing() {
  const mode = useMode();
  const space = flatten("v1.spacing");
  const radius = flatten("v1.radius");
  const drag = leaf("v1.elevation.drag");
  const d = drag.$value as { color: string; offsetX: string; offsetY: string; blur: string; spread: string };
  const tab = T.v1.component.tabBar;
  return (
    <Section id="spacing" title="Spacing and shape" intro="Grove uses a handful of spacing values and four corner sizes. I kept the corners big on purpose: 24 for cards and 48 for the home cards and tab bar make the app feel soft and friendly.">
      <TabGroup label="Spacing and shape details" tabs={[
        { id: "radius", label: "Radius", content: (
          <Stage bg={c(mode, "background")} color={c(mode, "deepText")}>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {radius.map(([p, l]) => (
                <li key={p} className="flex flex-col gap-2">
                  <span className="h-20 w-full" style={{ backgroundColor: c(mode, "cardBackground"), borderRadius: Math.min(px(l.$value), 48), border: `1px solid ${c(mode, "borderSubtle")}` }} />
                  <span className="font-mono text-[12px]">{p.split(".").pop()} · {px(l.$value)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm" style={{ color: c(mode, "secondaryText") }}>On iOS the cards and tab bar use Apple’s smoother “continuous” corners, so they look softer in the app than they do here.</p>
          </Stage>) },
        { id: "space", label: "Spacing", content: (
          <Stage bg={c(mode, "background")} color={c(mode, "deepText")}>
            <ul className="grid gap-3">
              {space.map(([p, l]) => (
                <li key={p} className="grid grid-cols-[minmax(0,190px)_1fr] items-center gap-4"><span className="truncate font-mono text-[12px]" style={{ color: c(mode, "secondaryText") }}>{p.split(".").pop()} · {px(l.$value)}</span><span className="h-3.5 rounded-sm" style={{ width: l.$value as string, backgroundColor: c(mode, "accentLime") }} /></li>
              ))}
            </ul>
          </Stage>) },
        { id: "elevation", label: "Elevation", content: (
          <div className="grid gap-3 md:grid-cols-2">
            <Stage bg={c(mode, "background")} color={c(mode, "deepText")}>
              <div className="flex h-24 items-center justify-center rounded-[24px] font-mono text-[12px]" style={{ backgroundColor: c(mode, "white"), boxShadow: `${d.offsetX} ${d.offsetY} ${d.blur} ${d.spread} ${d.color}` }}>dragging card</div>
              <p className="mt-3 text-[13px]" style={{ color: c(mode, "secondaryText") }}>A card you’re dragging lifts with a soft shadow: 8 pt down, 16 pt blur, 18% black.</p>
            </Stage>
            <Stage bg={c(mode, "background")} color={c(mode, "deepText")}>
              <div className="flex h-24 items-end justify-center">
                <div className="flex h-16 w-full items-center justify-center font-mono text-[12px]" style={{ backgroundColor: c(mode, "tabBar"), borderTopLeftRadius: px(tab.topRadius.$value), borderTopRightRadius: px(tab.topRadius.$value) }}>tab bar</div>
              </div>
              <p className="mt-3 text-[13px]" style={{ color: c(mode, "secondaryText") }}>{px(tab.height.$value)} pt tall with {px(tab.topRadius.$value)} pt rounded top corners and no shadow. It stands apart from the screen by its color alone, so the only shadow in the app is on a card you’re dragging.</p>
            </Stage>
          </div>) },
      ]} />
    </Section>
  );
}

/* ───────── motion & haptics ───────── */
function RivePlayer({ src, stateMachine, label, bg }: { src: string; stateMachine?: string; label: string; bg: string }) {
  const [run, setRun] = useState(0);
  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px]" style={{ backgroundColor: bg }}>
        {run ? <RiveCanvas key={run} src={src} stateMachine={stateMachine} label={label} /> : (
          <button type="button" onClick={() => setRun(1)} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30"><IconPlayerPlayFilled size={22} aria-hidden /></span>
            Play {label}
          </button>
        )}
        {run ? <button type="button" onClick={() => setRun(run + 1)} aria-label={`Replay ${label}`} className="absolute right-3 top-3 rounded-full bg-white/15 p-2 text-white ring-1 ring-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><IconRotateClockwise size={18} aria-hidden /></button> : null}
      </div>
      <figcaption className="text-sm text-zinc-600">{label}. Plays only when you press play.</figcaption>
    </figure>
  );
}
function RiveCanvas({ src, stateMachine, label }: { src: string; stateMachine?: string; label: string }) {
  const { RiveComponent } = useRive({ src, autoplay: true, ...(stateMachine ? { stateMachines: stateMachine } : {}) }, { shouldResizeCanvasToContainer: true });
  return <RiveComponent className="absolute inset-0" aria-label={`${label} animation`} role="img" />;
}

export function Motion() {
  const icons: Record<string, ReactNode> = { confirm: <IconCheck />, tap: <IconHandFinger />, grab: <IconHandGrab />, alarm: <IconAlarm /> };
  const haptics = T.v1.haptics as { moment: string; feedback: string; kind: string }[];
  return (
    <Section id="motion" title="Motion and haptics" intro="Most feedback in Grove is felt rather than seen. Every habit action has its own iOS haptic, and the bigger moments, finishing a habit and breathing with Sprout, are Rive animations.">
      <TabGroup label="Motion details" tabs={[
        { id: "haptics", label: "Haptics", content: (<>
          <ul className="grid gap-2">
            {haptics.map((h) => (
              <li key={h.moment} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-0.5 rounded-[16px] px-4 py-3 ring-1 ring-zinc-200 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)]">
                <span className="row-span-2 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 sm:row-span-1" aria-hidden>{icons[h.kind]}</span>
                <span className="font-medium text-zinc-900">{h.moment}</span>
                <span className="font-mono text-[13px] text-zinc-700">{h.feedback}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-zinc-600">Each haptic waits until the screen finishes updating before it plays. Without that, iOS was dropping some of them.</p>
        </>) },
        { id: "rive", label: "Rive moments", content: (<>
          <div className="grid gap-4 sm:grid-cols-2">
            <RivePlayer src={`${DS}/completion_popup.riv`} label="Habit completion popup" bg={c("dark", "background")} />
            <RivePlayer src="/images/redesign/breathe/sprout_breathing.riv" stateMachine="State Machine 1" label="Sprout breathing" bg={c("dark", "cardBackground")} />
          </div>
          <p className="text-sm text-zinc-600">Cards and lists move with one Reanimated spring (damping {(leaf("v1.motion.spring").$value as { damping: number }).damping}, stiffness {(leaf("v1.motion.spring").$value as { stiffness: number }).stiffness}).</p>
        </>) },
      ]} />
    </Section>
  );
}

/* ───────── growth states ───────── */
export function Growth() {
  const G = T.v1.growth;
  const frame = (n: number) => `${DS}/plants/aurora-sprout-${n}.png`;
  const states: [string, number, { opacity?: number; scale?: number }][] = [
    ["seed", 0, {}], ["sprout", 3, {}], ["bloom", 6, { scale: G.bloom.$value.scale }], ["wilt", 3, { opacity: G.wilt.$value.opacity }],
  ];
  const [week, setWeek] = useState(3);
  return (
    <Section id="growth" title="Growth states" intro="This is the heart of Grove. Instead of a percentage, each habit is a plant. It grows as you complete the habit during the week, and it wilts if you miss two days in a row, as a gentle reminder rather than a punishment. These are the real sprites from the app.">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {states.map(([n, f, fx]) => (
          <li key={n} className="flex flex-col gap-3 rounded-[20px] bg-zinc-50 p-4 ring-1 ring-zinc-200">
            <div className="flex aspect-[4/3] items-end justify-center rounded-[14px] pb-3" style={{ backgroundColor: c("light", "cardBackground") }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame(f)} alt={`Aurora Sprout, ${n}`} width={16} height={32} className="h-32 w-16 [image-rendering:pixelated]" style={{ opacity: fx.opacity ?? 1, transform: `scale(${fx.scale ?? 1})`, transformOrigin: "bottom" }} />
            </div>
            <div><p className="font-mono text-[17px] font-semibold text-zinc-900">{n}</p><p className="mt-1 text-sm text-zinc-600">{G[n].$value.rule}.</p></div>
          </li>
        ))}
      </ul>
      <div className="rounded-[20px] p-5 ring-1 ring-zinc-200">
        <label className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-900">
          Completions this week: <span className="font-mono">{week}</span>
          <input type="range" min={0} max={7} value={week} onChange={(e) => setWeek(Number(e.target.value))} className="w-48 accent-zinc-900" />
        </label>
        <ol className="mt-4 flex items-end gap-2" aria-label="Seven growth frames">
          {Array.from({ length: G.framesPerPlant.$value }, (_, n) => (
            <li key={n} className={`flex flex-col items-center gap-1 rounded-lg px-1.5 pb-1 pt-2 ${Math.min(week, 6) === n ? "bg-zinc-900 text-white" : "text-zinc-500"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame(n)} alt="" width={16} height={32} className="h-12 w-6 [image-rendering:pixelated]" />
              <span className="font-mono text-[11px]">{n}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-zinc-600">Each plant has seven frames. The more days you complete a habit this week, the further it grows.</p>
      </div>
    </Section>
  );
}


import raw from "./grove.tokens.json";
import { contrast, mix, passes, type PairKind } from "./contrast";

// Reads grove.tokens.json: the values as shipped in the Grove app, and the single source for
// every color, size and ratio on the page. The JSON is the only place hex values live.

export type Mode = "light" | "dark";
export const MODES: Mode[] = ["light", "dark"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokens: any = raw;

type Leaf = { $value: unknown; $type?: string; $description?: string; $extensions?: Record<string, unknown> };
const isLeaf = (x: unknown): x is Leaf => typeof x === "object" && x !== null && "$value" in x;

function walk(path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], tokens);
}

/** Resolve "{path}" to its final value; plain values pass through */
export function resolve(ref: string): string {
  let value = ref;
  for (let i = 0; i < 8; i++) {
    const m = value.match(/^\{([^}]+)\}$/);
    if (!m) return value;
    const l = walk(m[1]);
    if (!isLeaf(l)) throw new Error(`Unknown token ${m[1]}`);
    value = String(l.$value);
  }
  throw new Error(`Alias loop at ${ref}`);
}

export function leaf(path: string): Leaf {
  const l = walk(path);
  if (!isLeaf(l)) throw new Error(`Unknown token ${path}`);
  return l;
}

/** Flatten a subtree into [dotted.path, leaf] rows */
export function flatten(path: string): [string, Leaf][] {
  const out: [string, Leaf][] = [];
  const go = (node: unknown, p: string) => {
    if (isLeaf(node)) out.push([p, node]);
    else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) go(v, `${p}.${k}`);
  };
  go(walk(path), path);
  return out;
}

/** A shipped palette role, e.g. c("dark", "deepText") */
export const c = (mode: Mode, key: string): string => tokens.v1.color[mode][key].$value;
export const px = (v: unknown) => Number.parseFloat(String(v));

/* ───── contrast pairs ───── */
export type Pair = { id: string; label: string; fg: string; bg: string; kind: PairKind; expected?: number };
export type PairResult = Pair & { fgHex: string; bgHex: string; ratio: number; ok: boolean };

export function evalPair(p: Pair): PairResult {
  const fgHex = resolve(p.fg);
  const bgHex = resolve(p.bg);
  const ratio = contrast(fgHex, bgHex);
  return { ...p, fgHex, bgHex, ratio, ok: passes(ratio, p.kind) };
}
export const pairs = (): PairResult[] => (tokens.audit.v1Pairs as Pair[]).map(evalPair);

/* ───── habit card themes ───── */
export type CardTheme = { name: string; bg: string; accent: string; accentDeep: string; iconWell: string };
export const cardThemes = (mode: Mode): CardTheme[] => tokens.v1.habitCardThemes[mode];

/** A port of habitCardThemeFromAccent, using the mix amounts stored in the tokens */
export function generateTheme(accent: string, mode: Mode): CardTheme {
  const g = tokens.v1.generator;
  const a = accent.toUpperCase();
  return {
    name: "Custom",
    bg: mix(a, g.bg[mode].toward, g.bg[mode].amount),
    accent: a,
    accentDeep: mix(a, g.accentDeep.toward, g.accentDeep.amount),
    iconWell: mix(a, g.iconWell[mode].toward, g.iconWell[mode].amount),
  };
}

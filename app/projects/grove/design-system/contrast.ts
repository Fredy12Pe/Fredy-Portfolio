// WCAG 2.x contrast math. Pure, no dependencies, so the same file runs in the page and in the test script.

export type Rgb = { r: number; g: number; b: number };

export function parseColor(input: string): Rgb & { a: number } {
  const s = input.trim();
  if (s.startsWith("#")) {
    const raw = s.slice(1);
    const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
    const n = Number.parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b, a = "1"] = m[1].split(",").map((x) => x.trim());
    return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
  }
  throw new Error(`Cannot parse color: ${input}`);
}

export function toHex({ r, g, b }: Rgb): string {
  const h = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

export function luminance(color: string): number {
  const { r, g, b } = parseColor(color);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export type PairKind = "text" | "ui";
/** 4.5:1 for normal text (SC 1.4.3), 3:1 for non-text UI and state indicators (SC 1.4.11) */
export const threshold = (kind: PairKind) => (kind === "text" ? 4.5 : 3);
export const passes = (ratio: number, kind: PairKind) => Math.round(ratio * 100) / 100 >= threshold(kind);
export const fmt = (ratio: number) => ratio.toFixed(2);

/** Mix a toward b by t (0..1), the same math as Grove's habitCardThemeFromAccent */
export function mix(a: string, b: string, t: number): string {
  const x = parseColor(a);
  const y = parseColor(b);
  return toHex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t });
}

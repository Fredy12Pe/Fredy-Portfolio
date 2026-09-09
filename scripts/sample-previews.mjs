// Reads exact chrome colours out of the Figma preview exports so the coded
// screen chrome matches the source of truth instead of being eyeballed.
// Run with: node scripts/sample-previews.mjs
import { chromium } from "playwright";
import fs from "node:fs";

const MOODS = [
  "freaking-out",
  "sad",
  "anxious",
  "tired",
  "meh",
  "content",
  "happy",
  "excited",
  "overjoyed",
  "angry",
];

// Points are in 440x956 frame coordinates.
const POINTS = {
  bgTop: [220, 120],
  bgMid: [8, 480],
  bgBottom: [8, 950],
  track: [45, 795],
  trackRight: [396, 795],
  knob: [0, 795], // x filled in per mood
  menu: [360, 42],
  date: [0, 0], // resolved by scan
};

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<canvas id=c></canvas>");

const results = {};

for (const [index, mood] of MOODS.entries()) {
  const bytes = fs.readFileSync(`public/projects/mood-tracker/previews/${mood}.png`);
  const file = `data:image/png;base64,${bytes.toString("base64")}`;
  const knobX = 35 + (35 + index * 33);

  const points = { ...POINTS, knob: [knobX, 795] };
  delete points.date;

  results[mood] = await page.evaluate(
    async ([file, points]) => {
      const img = new Image();
      img.src = file;
      await img.decode();

      const canvas = document.getElementById("c");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const scale = img.naturalWidth / 440;
      const hex = (x, y) => {
        const d = ctx.getImageData(Math.round(x * scale), Math.round(y * scale), 1, 1).data;
        return "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
      };

      const out = { size: [img.naturalWidth, img.naturalHeight] };
      for (const [name, [x, y]] of Object.entries(points)) {
        out[name] = hex(x, y);
      }

      // Brightest non-white pixel on the date baseline row is the date colour.
      const row = ctx.getImageData(0, Math.round(711 * scale), img.naturalWidth, 1).data;
      let best = null;
      let bestScore = -1;
      for (let i = 0; i < row.length; i += 4) {
        const [r, g, b] = [row[i], row[i + 1], row[i + 2]];
        const score = r + g + b;
        if (score > bestScore && !(r > 248 && g > 248 && b > 248)) {
          bestScore = score;
          best = [r, g, b];
        }
      }
      out.date = "#" + best.map((v) => v.toString(16).padStart(2, "0")).join("");
      return out;
    },
    [file, points],
  );
}

await browser.close();
console.log(JSON.stringify(results, null, 2));

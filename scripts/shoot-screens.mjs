// Screenshots each coded Checkin screen at rest and diffs it against the Figma
// export in public/projects/mood-tracker/previews. Writes a side-by-side image
// per mood into .screens/ and prints a mismatch percentage.
//
// Requires `npm run dev` to be running.
// Run with: node scripts/shoot-screens.mjs [mood ...]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = ".screens";

const ALL = [
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

const moods = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 480, height: 1000 }, deviceScaleFactor: 1 });

const report = [];
let consoleErrors = [];

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text().split("\n")[0]);
});
page.on("pageerror", (error) => consoleErrors.push(String(error).split("\n")[0]));

for (const mood of moods) {
  consoleErrors = [];
  const response = await page.goto(`${BASE}/projects/mood-tracker/shot/${mood}`, { waitUntil: "networkidle" });
  if (!response?.ok()) {
    throw new Error(`${mood}: ${response?.status()} from dev server`);
  }
  await page.waitForTimeout(400);

  const shot = await page.locator("#shot").screenshot();
  const actual = path.join(OUT, `${mood}.actual.png`);
  fs.writeFileSync(actual, shot);

  const expected = fs.readFileSync(`public/projects/mood-tracker/previews/${mood}.png`);

  const diff = await page.evaluate(
    async ([a, b]) => {
      const load = async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = 440;
        canvas.height = 956;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 440, 956);
        return ctx.getImageData(0, 0, 440, 956).data;
      };

      const [x, y] = await Promise.all([load(a), load(b)]);
      let off = 0;
      for (let i = 0; i < x.length; i += 4) {
        const delta =
          Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]);
        if (delta > 45) off += 1;
      }
      return (off / (x.length / 4)) * 100;
    },
    [`data:image/png;base64,${shot.toString("base64")}`, `data:image/png;base64,${expected.toString("base64")}`],
  );

  // Side-by-side: Figma export on the left, coded render on the right.
  const sideBySide = await page.evaluate(
    async ([a, b]) => {
      const load = async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        return img;
      };
      const [coded, figma] = await Promise.all([load(a), load(b)]);
      const canvas = document.createElement("canvas");
      canvas.width = 892;
      canvas.height = 956;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(figma, 0, 0, 440, 956);
      ctx.drawImage(coded, 452, 0, 440, 956);
      return canvas.toDataURL("image/png");
    },
    [`data:image/png;base64,${shot.toString("base64")}`, `data:image/png;base64,${expected.toString("base64")}`],
  );

  fs.writeFileSync(
    path.join(OUT, `${mood}.compare.png`),
    Buffer.from(sideBySide.replace(/^data:image\/png;base64,/, ""), "base64"),
  );

  report.push({ mood, mismatch: `${diff.toFixed(2)}%`, errors: consoleErrors.length });
  console.log(`${mood.padEnd(14)} ${diff.toFixed(2)}% off  ->  ${OUT}/${mood}.compare.png`);
  for (const error of [...new Set(consoleErrors)]) {
    console.log(`  console: ${error}`);
  }
}

await browser.close();
console.log("\nFigma export is on the LEFT of each compare image, coded render on the RIGHT.");
console.table(report);

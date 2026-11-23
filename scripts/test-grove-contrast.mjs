// Contrast tests for the Grove design system page. Run: npm run test:grove
// Every audited pair must reproduce its measured ratio (±0.01) from the token values.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "app/projects/grove/design-system");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "grove-contrast-"));
const src = fs.readFileSync(path.join(dir, "contrast.ts"), "utf8");
fs.writeFileSync(path.join(tmp, "contrast.mjs"), ts.transpileModule(src, { compilerOptions: { module: "esnext", target: "es2020" } }).outputText);
const { contrast, passes, fmt } = await import(pathToFileURL(path.join(tmp, "contrast.mjs")).href);
const T = JSON.parse(fs.readFileSync(path.join(dir, "grove.tokens.json"), "utf8"));

const walk = (p) => p.split(".").reduce((o, k) => o?.[k], T);
function resolve(ref, mode = "light") {
  let v = ref;
  for (let i = 0; i < 8; i++) {
    const m = v.match(/^\{([^}]+)\}(?:@(light|dark))?$/);
    if (!m) return v;
    const l = walk(m[1]);
    const modes = l.$extensions?.["com.grove.modes"];
    v = String(modes ? modes[m[2] ?? mode] : l.$value);
  }
  throw new Error("alias loop " + ref);
}

let failed = 0;
for (const p of T.audit.v1Pairs) {
  const r = contrast(resolve(p.fg), resolve(p.bg));
  const ok = Math.abs(r - p.expected) <= 0.01;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${p.id.padEnd(18)} ${fmt(r)} (expected ${p.expected.toFixed(2)}, ${passes(r, p.kind) ? "passes" : "fails"} AA)`);
}
console.log(failed ? `\n${failed} problem(s)` : `\nAll ${T.audit.v1Pairs.length} audited ratios reproduce.`);
process.exit(failed ? 1 : 0);

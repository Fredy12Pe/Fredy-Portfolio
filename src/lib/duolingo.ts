import { promises as fs } from "fs";
import path from "path";
import os from "os";

export type DuolingoStreakPayload = {
  streak: number;
  updatedAt: string | null;
  /** Where the value came from for this response. */
  source: "live" | "cache" | "seed";
};

/** Public profile slug — safe default so production works without a host env var. */
const DEFAULT_USERNAME = "fredy187883";
const SEED_STREAK = 101;
const REVALIDATE_SECONDS = 60 * 60; // 1 hour

/** Committed fallback shipped with the repo (read-only on most hosts). */
const COMMITTED_CACHE_PATH = path.join(
  process.cwd(),
  "data",
  "duolingo-cache.json",
);
/** Writable on Vercel/serverless; survives warm instance reuse. */
const RUNTIME_CACHE_PATH = path.join(os.tmpdir(), "fredy-duolingo-cache.json");

type CacheFile = {
  streak: number;
  updatedAt: string | null;
  source?: string;
};

/** Last successful live value in this process (warm lambda / Node process). */
let memoryCache: CacheFile | null = null;

/** Strip @ / whitespace so `.env` values like `@fredy187883` still work. */
function normalizeUsername(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^@+/, "").trim();
  return cleaned || null;
}

function resolveUsername(): string {
  return (
    normalizeUsername(process.env.DUOLINGO_USERNAME) ?? DEFAULT_USERNAME
  );
}

function isValidStreak(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

async function readCacheAt(filePath: string): Promise<CacheFile | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as CacheFile;
    if (!isValidStreak(parsed.streak)) return null;
    return {
      streak: Math.floor(parsed.streak),
      updatedAt: parsed.updatedAt ?? null,
      source: parsed.source,
    };
  } catch {
    return null;
  }
}

async function writeCacheAt(
  filePath: string,
  streak: number,
  updatedAt: string,
): Promise<void> {
  const payload: CacheFile = {
    streak,
    updatedAt,
    source: "live",
  };
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(
      filePath,
      `${JSON.stringify(payload, null, 2)}\n`,
      "utf8",
    );
  } catch {
    // Read-only FS (e.g. committed path on Vercel) — other layers still apply.
  }
}

async function persistSuccess(streak: number, updatedAt: string): Promise<void> {
  memoryCache = { streak, updatedAt, source: "live" };
  await Promise.all([
    writeCacheAt(RUNTIME_CACHE_PATH, streak, updatedAt),
    writeCacheAt(COMMITTED_CACHE_PATH, streak, updatedAt),
  ]);
}

async function readBestCache(): Promise<CacheFile | null> {
  const candidates = [
    memoryCache,
    await readCacheAt(RUNTIME_CACHE_PATH),
    await readCacheAt(COMMITTED_CACHE_PATH),
  ].filter((c): c is CacheFile => c != null && isValidStreak(c.streak));

  if (candidates.length === 0) return null;

  // Prefer the most recently updated value when timestamps exist.
  candidates.sort((a, b) => {
    const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
    const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
    return tb - ta;
  });
  return candidates[0];
}

async function fetchLiveStreak(username: string): Promise<number | null> {
  const url = new URL("https://www.duolingo.com/2017-06-30/users");
  url.searchParams.set("username", username);
  // Do not pass `fields` — Duo often returns `{}` for field-filtered requests.

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
    // Hourly Next fetch cache — avoids hammering Duo on every about-page hit.
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    users?: Array<{
      streak?: number;
      streakData?: {
        currentStreak?: { length?: number };
        previousStreak?: { length?: number };
      };
    }>;
  };

  const user = data.users?.[0];
  if (!user) return null;

  const candidates = [
    user.streakData?.currentStreak?.length,
    user.streakData?.previousStreak?.length,
    user.streak,
  ].filter(isValidStreak);

  if (candidates.length === 0) return null;
  return Math.floor(Math.max(...candidates));
}

/**
 * Live Duolingo streak with durable fallbacks:
 * 1. Live API
 * 2. In-memory /tmp / committed last-known-good
 * 3. Seed default (101)
 */
export async function getDuolingoStreak(): Promise<DuolingoStreakPayload> {
  const username = resolveUsername();
  const cached = await readBestCache();

  try {
    const live = await fetchLiveStreak(username);
    if (live != null) {
      const updatedAt = new Date().toISOString();
      await persistSuccess(live, updatedAt);
      return { streak: live, updatedAt, source: "live" };
    }
  } catch {
    // fall through to cache / seed
  }

  if (cached) {
    return {
      streak: cached.streak,
      updatedAt: cached.updatedAt,
      source: cached.updatedAt ? "cache" : "seed",
    };
  }

  return { streak: SEED_STREAK, updatedAt: null, source: "seed" };
}

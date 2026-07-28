import { promises as fs } from "fs";
import path from "path";

export type DuolingoStreakPayload = {
  streak: number;
  updatedAt: string | null;
  /** Where the value came from for this response. */
  source: "live" | "cache" | "seed";
};

const CACHE_PATH = path.join(process.cwd(), "data", "duolingo-cache.json");
const SEED_STREAK = 101;
const REVALIDATE_SECONDS = 60 * 60; // 1 hour

type CacheFile = {
  streak: number;
  updatedAt: string | null;
  source?: string;
};

/** Strip @ / whitespace so `.env` values like `@fredy187883` still work. */
function normalizeUsername(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^@+/, "").trim();
  return cleaned || null;
}

async function readCacheFile(): Promise<CacheFile | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw) as CacheFile;
    if (typeof parsed.streak !== "number" || !Number.isFinite(parsed.streak)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function writeCacheFile(streak: number, updatedAt: string): Promise<void> {
  const payload: CacheFile = {
    streak,
    updatedAt,
    source: "live",
  };
  try {
    await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
    await fs.writeFile(CACHE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  } catch {
    // Serverless / read-only FS — in-memory + committed seed still cover fallbacks.
  }
}

async function fetchLiveStreak(username: string): Promise<number | null> {
  const url = new URL("https://www.duolingo.com/2017-06-30/users");
  url.searchParams.set("username", username);
  // Do not pass `fields` — Duo often returns `{}` for field-filtered requests.

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    users?: Array<{
      streak?: number;
      streakData?: { currentStreak?: { length?: number } };
    }>;
  };

  const user = data.users?.[0];
  if (!user) return null;

  const fromStreakData = user.streakData?.currentStreak?.length;
  const streak =
    typeof fromStreakData === "number" && Number.isFinite(fromStreakData)
      ? fromStreakData
      : user.streak;

  if (typeof streak !== "number" || !Number.isFinite(streak) || streak < 0) {
    return null;
  }

  return Math.floor(streak);
}

/**
 * Live Duolingo streak with durable fallbacks:
 * 1. Live API
 * 2. Last successful write (`data/duolingo-cache.json`)
 * 3. Seed default (101)
 */
export async function getDuolingoStreak(): Promise<DuolingoStreakPayload> {
  const username = normalizeUsername(process.env.DUOLINGO_USERNAME);
  const cached = await readCacheFile();

  if (username) {
    try {
      const live = await fetchLiveStreak(username);
      if (live != null) {
        const updatedAt = new Date().toISOString();
        await writeCacheFile(live, updatedAt);
        return { streak: live, updatedAt, source: "live" };
      }
    } catch {
      // fall through to cache / seed
    }
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

import { getDuolingoStreak } from "@/lib/duolingo";

export const runtime = "nodejs";

export async function GET() {
  const payload = await getDuolingoStreak();
  return Response.json(payload, {
    headers: {
      // Allow the card to refresh without hammering Duo.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

import { getDuolingoStreak } from "@/lib/duolingo";

export const runtime = "nodejs";
/** Align CDN / route cache with the Duo fetch revalidate window. */
export const revalidate = 3600;

export async function GET() {
  const payload = await getDuolingoStreak();
  return Response.json(payload, {
    headers: {
      // Allow the card to refresh without hammering Duo.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

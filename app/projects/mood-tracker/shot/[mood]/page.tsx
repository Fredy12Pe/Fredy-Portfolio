import { notFound } from "next/navigation";
import CheckinScreen from "../../CheckinScreen";
import { MOODS } from "../../moods";

/**
 * Renders one Checkin screen at Figma's exact frame size with motion held at
 * rest, so scripts/shoot-screens.mjs can diff it against the Figma export.
 */
export default async function MoodShotPage({ params }: { params: Promise<{ mood: string }> }) {
  const { mood } = await params;
  const index = MOODS.findIndex((entry) => entry.id === mood);

  if (index < 0) {
    notFound();
  }

  return (
    <div style={{ margin: 0, background: "#fff" }}>
      <div id="shot" style={{ width: 440, height: 956 }}>
        <CheckinScreen index={index} reduced />
      </div>
    </div>
  );
}

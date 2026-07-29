"use client";

import { useCallback } from "react";
import RedesignBoard from "../redesign/RedesignBoard";
import { useBreathingSession } from "../redesign/redesign-nav";

export default function HomePage() {
  const { breathingActive, setBreathingActive } = useBreathingSession();

  const onBreathingSessionChange = useCallback(
    (active: boolean) => {
      setBreathingActive(active);
    },
    [setBreathingActive],
  );

  return (
    <RedesignBoard
      breathingActive={breathingActive}
      onBreathingSessionChange={onBreathingSessionChange}
    />
  );
}

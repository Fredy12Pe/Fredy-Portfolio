"use client";

import { useCallback } from "react";
import RedesignBoard from "./RedesignBoard";
import { useBreathingSession } from "./redesign-nav";

export default function RedesignPage() {
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

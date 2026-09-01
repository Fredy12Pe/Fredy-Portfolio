"use client";

import styles from "./aarhus.module.css";

function ClosedDoorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect
        x="4.5"
        y="2.75"
        width="11"
        height="14.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M10 2.75v14.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8.15 10v1.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.85 10v1.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OpenedDoorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.75 4.5 8.25 3.25v13.5L2.75 15.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 3.25 17.25 4.5v11L11.75 16.75V3.25Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6.15 9.4v1.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13.85 9.4v1.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DoorToggle({
  opened,
  onOpenedChange,
  openLabel = "Open doors",
  closeLabel = "Close doors",
}: {
  opened: boolean;
  onOpenedChange: (open: boolean) => void;
  openLabel?: string;
  closeLabel?: string;
}) {
  return (
    <button
      type="button"
      className={`${styles.doorToggle} ${opened ? styles.doorToggleOpen : ""}`}
      aria-pressed={opened}
      aria-label={opened ? closeLabel : openLabel}
      onClick={() => onOpenedChange(!opened)}
    >
      {opened ? <OpenedDoorIcon /> : <ClosedDoorIcon />}
    </button>
  );
}

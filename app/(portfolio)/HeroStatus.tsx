"use client";

import { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";

const LA_TIME = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
});

/* Availability and the current time in Los Angeles. The time is filled in after the page loads,
   so the server's markup and the browser's first render match. */
export default function HeroStatus({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(LA_TIME.format(new Date()));
    update();
    const timer = window.setInterval(update, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className={className}>
      <span className={styles.available}>
        <span className={styles.availableDot} aria-hidden />
        Available for work
      </span>
      <span className={styles.localTime}>
        Los Angeles
        {time ? (
          <>
            {" · "}
            <time>{time}</time>
          </>
        ) : null}
      </span>
    </p>
  );
}

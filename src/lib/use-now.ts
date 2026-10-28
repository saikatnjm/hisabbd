"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

function subscribe(notify: () => void) {
  const timer = window.setInterval(notify, MINUTE);
  return () => window.clearInterval(timer);
}

/** The current time, rounded down to the minute and refreshed each minute. 0 during server rendering. */
export function useNow(): number {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / MINUTE) * MINUTE,
    () => 0,
  );
}

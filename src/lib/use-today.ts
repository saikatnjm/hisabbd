"use client";

import { useSyncExternalStore } from "react";
import { toIsoDate } from "@/lib/plain-date";

/*
 * The visitor's local calendar date as "YYYY-MM-DD". Pages are static, so
 * this is read in the browser only: "" during server rendering, then the real
 * date after hydration (no hydration mismatch, no effect needed).
 */
const subscribe = () => () => {};
function localToday(): string {
  const now = new Date();
  return toIsoDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
}
const serverToday = () => "";

export function useToday(): string {
  return useSyncExternalStore(subscribe, localToday, serverToday);
}

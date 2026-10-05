"use client";

import { useSyncExternalStore } from "react";
import { readSaved, serverSaved, subscribeSaved, type SavedList } from "@/lib/saved-calculators";

/** Saved calculator slugs for this browser. Empty during server rendering. */
export function useSavedCalculators(list: SavedList): readonly string[] {
  return useSyncExternalStore(subscribeSaved, () => readSaved(list), serverSaved);
}

"use client";

import { useCallback, useSyncExternalStore } from "react";
import { preferenceValue, prefsStore, setPreference, type Preference } from "@/lib/preferences";

/**
 * A remembered preference, like useState. The fallback is used during server
 * rendering; the stored choice applies right after hydration.
 */
export function usePreference<T extends string>(pref: Preference<T>): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    prefsStore.subscribe,
    () => preferenceValue(prefsStore.read(), pref),
    () => pref.fallback,
  );
  const set = useCallback((next: T) => setPreference(pref, next), [pref]);
  return [value, set];
}

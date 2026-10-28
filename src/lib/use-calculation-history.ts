"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useCalculatorSlug } from "@/components/calculator/calculator-context";
import { useLocale } from "@/i18n/locale-context";
import { historyEnabledPref, historyStore, recordCalculation, type HistoryEntry } from "@/lib/calculation-history";
import { usePreference } from "@/lib/use-preference";

/** Every saved calculation on this device, newest first. Empty during server rendering. */
export function useAllCalculationHistory(): readonly HistoryEntry[] {
  return useSyncExternalStore(historyStore.subscribe, historyStore.read, historyStore.server);
}

/**
 * The current calculator's saved calculations, and `record` to save one.
 * Use inside a calculator widget (it reads the slug from CalculatorProvider).
 */
export function useCalculationHistory() {
  const slug = useCalculatorSlug();
  const locale = useLocale();
  const all = useAllCalculationHistory();
  const [enabled] = usePreference(historyEnabledPref);
  const entries = useMemo(() => (slug ? all.filter((e) => e.slug === slug) : []), [all, slug]);

  /** Call after a successful Calculate with the raw form values and a one-line result summary. */
  const record = useCallback(
    (inputs: Record<string, string>, summary: string) => {
      if (slug) recordCalculation(slug, locale, inputs, summary);
    },
    [slug, locale],
  );

  return { entries, enabled: enabled === "on", record };
}

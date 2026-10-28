"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/locale-context";
import { ui } from "@/i18n/ui";
import { clearHistory, removeCalculation, setHistoryEnabled } from "@/lib/calculation-history";
import { formatTimeAgo } from "@/lib/format";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { useCalculatorSlug } from "@/components/calculator/calculator-context";
import { CloseIcon } from "@/components/ui/icons";
import { useNow } from "@/lib/use-now";

/**
 * "Your recent calculations" for the current calculator, from this browser's
 * history. "Use again" hands the saved form values back to the widget, which
 * fills its fields (and usually calculates straight away). Renders nothing
 * until there is something saved.
 */
export function RecentCalculations({ onRestore }: { onRestore: (inputs: Readonly<Record<string, string>>) => void }) {
  const locale = useLocale();
  const t = ui[locale].history;
  const slug = useCalculatorSlug();
  const now = useNow();
  const { entries, enabled } = useCalculationHistory();
  const [status, setStatus] = useState("");

  if (entries.length === 0 || now === 0) return null;

  return (
    <section aria-labelledby="recent-calculations-heading" className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 id="recent-calculations-heading" className="font-display text-lg font-semibold text-slate-900">
        {t.title}
      </h2>
      <ul className="mt-3 divide-y divide-slate-100">
        {entries.map((entry) => {
          const when = formatTimeAgo(entry.at, now, locale);
          return (
            <li key={entry.id} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p lang={entry.locale} className="text-sm text-pretty text-slate-800">
                  {entry.summary}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{when}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onRestore(entry.inputs);
                  setStatus(t.restored(when));
                }}
                className="inline-flex min-h-10 shrink-0 items-center rounded-lg border-2 border-slate-300 px-3 text-sm font-semibold text-slate-800 hover:border-brand-400 hover:text-brand-800"
              >
                {t.useAgain}
              </button>
              <button
                type="button"
                onClick={() => removeCalculation(entry.id)}
                aria-label={t.remove(when)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <CloseIcon className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
      <p role="status" className="min-h-5 text-sm text-brand-800">
        {status}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setHistoryEnabled(event.target.checked)}
            className="size-4 accent-brand-600"
          />
          {t.saveToggle}
        </label>
        <button
          type="button"
          onClick={() => slug && clearHistory(slug)}
          className="min-h-10 font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
        >
          {t.clear}
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-500">{enabled ? t.savedOnDevice : t.offNote}</p>
    </section>
  );
}

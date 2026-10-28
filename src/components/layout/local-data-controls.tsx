"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/locale-context";
import { ui } from "@/i18n/ui";
import { clearAllLocalData, historyEnabledPref, setHistoryEnabled } from "@/lib/calculation-history";
import { usePreference } from "@/lib/use-preference";

/**
 * On the privacy pages: turn saving of recent calculations on or off, and
 * clear everything HisabBD keeps in this browser (history, preferences,
 * recent and saved calculators).
 */
export function LocalDataControls() {
  const t = ui[useLocale()].history;
  const [history] = usePreference(historyEnabledPref);
  const [status, setStatus] = useState("");

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 font-medium text-slate-800">
        <input
          type="checkbox"
          checked={history === "on"}
          onChange={(event) => {
            setHistoryEnabled(event.target.checked);
            setStatus("");
          }}
          className="size-4 accent-brand-600"
        />
        {t.saveToggle}
      </label>
      <div>
        <Button
          variant="secondary"
          onClick={() => {
            clearAllLocalData();
            setStatus(t.clearedAll);
          }}
        >
          {t.clearAll}
        </Button>
      </div>
      <p role="status" className="min-h-5 text-sm text-brand-800">
        {status}
      </p>
    </div>
  );
}

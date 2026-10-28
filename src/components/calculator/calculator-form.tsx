"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/locale-context";
import { ui } from "@/i18n/ui";

/**
 * Card-style calculator form with the primary action and Reset.
 * Uses `noValidate` so the calculator's own messages replace browser popups.
 */
export function CalculatorForm({
  onSubmit,
  onReset,
  submitLabel,
  children,
}: {
  onSubmit: () => void;
  onReset: () => void;
  submitLabel: string;
  children: React.ReactNode;
}) {
  const t = ui[useLocale()].form;
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lift sm:p-6"
    >
      {children}
      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <Button type="submit" size="lg" className="grow sm:grow-0">
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={onReset}>
          {t.reset}
        </Button>
      </div>
    </form>
  );
}

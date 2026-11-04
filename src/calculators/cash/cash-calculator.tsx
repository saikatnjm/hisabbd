"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { FieldMessage, FormField, Input } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatTaka } from "@/lib/format";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { calculateCash, DENOMINATIONS, FIRST_FIELD, MAX_COUNT, type CashResult } from "./logic";

const fieldId = (id: string) => `cash-${id}`;

const STRINGS = {
  en: {
    submit: "Count cash",
    notesLegend: "Notes",
    coinsLegend: "Coins",
    label: (kind: "note" | "coin", value: number) => `৳${value} ${kind === "note" ? "notes" : "coins"}`,
    placeholder: "0",
    errLabel: "number of notes or coins",
    errMin: "0 or more",
    errMax: `${formatNumber(MAX_COUNT)} or less`,
    none: "Enter a count for at least one note or coin.",
    resultTitle: "Your cash adds up to",
    notesCount: (n: string) => `${n} notes`,
    coinsCount: (n: string) => `${n} coins`,
    tableCaption: "Value × count = subtotal for each note and coin",
    valueCol: "Value",
    countCol: "Count",
    subtotalCol: "Subtotal",
    rowName: (kind: "note" | "coin", value: number) => `৳${value} ${kind}`,
    note: "This only adds up the counts you type. It cannot tell a fake note from a real one.",
    announcement: (total: string) => `Total ${total}.`,
    placeholderTitleFirst: "Your total will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter how many notes and coins you have, then select Count cash.",
    placeholderFix: "Fix the highlighted count above and the total will show here.",
    shareTitle: "Cash counted with HisabBD",
    shareText: (total: string, notes: string, coins: string, lines: string) =>
      `Cash total ${total} (${notes}, ${coins}): ${lines}. Counted with HisabBD’s Cash Counter.`,
  },
  bn: {
    submit: "টাকা গুনুন",
    notesLegend: "নোট",
    coinsLegend: "কয়েন",
    label: (kind: "note" | "coin", value: number) => `৳${value} ${kind === "note" ? "নোট" : "কয়েন"}`,
    placeholder: "0",
    errLabel: "নোট বা কয়েনের সংখ্যা",
    errMin: "0 বা তার বেশি",
    errMax: `${formatNumber(MAX_COUNT)} বা তার কম`,
    none: "অন্তত একটি নোট বা কয়েনের সংখ্যা লিখুন।",
    resultTitle: "আপনার মোট টাকা",
    notesCount: (n: string) => `${n}টি নোট`,
    coinsCount: (n: string) => `${n}টি কয়েন`,
    tableCaption: "প্রতিটি নোট ও কয়েনের মূল্যমান × সংখ্যা = উপমোট",
    valueCol: "মূল্যমান",
    countCol: "সংখ্যা",
    subtotalCol: "উপমোট",
    rowName: (kind: "note" | "coin", value: number) => `৳${value} ${kind === "note" ? "নোট" : "কয়েন"}`,
    note: "এটি শুধু আপনার লেখা সংখ্যা যোগ করে। আসল ও জাল নোট আলাদা করতে পারে না।",
    announcement: (total: string) => `মোট ${total}।`,
    placeholderTitleFirst: "মোট টাকা এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "কোন নোট ও কয়েন কয়টি আছে লিখে “টাকা গুনুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত সংখ্যাটি ঠিক করলেই মোট টাকা এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে টাকা গোনা",
    shareText: (total: string, notes: string, coins: string, lines: string) =>
      `মোট টাকা ${total} (${notes}, ${coins}): ${lines}। HisabBD-র টাকা গণনায় হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function shareText(t: Strings, r: CashResult): string {
  const lines = r.rows.map((row) => `${row.count} × ${t.rowName(row.kind, row.value)} = ${formatTaka(row.subtotal)}`).join(", ");
  return t.shareText(formatTaka(r.total), t.notesCount(formatNumber(r.noteCount)), t.coinsCount(formatNumber(r.coinCount)), lines);
}

export function CashCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = useRef<Record<string, HTMLInputElement | null>>({});

  const calc = submitted ? calculateCash(counts) : null;
  const errors = calc && !calc.ok ? calc.errors : [];
  const noneError = errors.some((e) => e.code === "none");
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateCash(counts);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ counts: JSON.stringify(counts) }, shareText(t, check.result));
    } else {
      refs.current[check.errors[0]?.field ?? FIRST_FIELD]?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked). */
  function restore(saved: Readonly<Record<string, string>>) {
    const next: Record<string, string> = {};
    try {
      const parsed: unknown = JSON.parse(typeof saved.counts === "string" ? saved.counts : "{}");
      if (parsed && typeof parsed === "object") {
        for (const d of DENOMINATIONS) {
          const v = (parsed as Record<string, unknown>)[d.id];
          if (typeof v === "string") next[d.id] = v.slice(0, 12);
        }
      }
    } catch {
      // Ignore damaged saved data.
    }
    setCounts(next);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setCounts({});
    setSubmitted(false);
    setRevealCount(0);
    refs.current[FIRST_FIELD]?.focus();
  }

  function renderGroup(kind: "note" | "coin", legend: string) {
    return (
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">{legend}</legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {DENOMINATIONS.filter((d) => d.kind === kind).map((d) => {
            const error = errors.find((e) => e.field === d.id && e.code !== "none");
            return (
              <FormField
                key={d.id}
                id={fieldId(d.id)}
                label={t.label(d.kind, d.value)}
                error={
                  error && error.code !== "none"
                    ? numberErrorMessage(error.code, { label: t.errLabel, min: t.errMin, max: t.errMax }, locale)
                    : undefined
                }
              >
                {(control) => (
                  <Input
                    {...control}
                    ref={(el) => {
                      refs.current[d.id] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={t.placeholder}
                    value={counts[d.id] ?? ""}
                    onChange={(event) => setCounts((prev) => ({ ...prev, [d.id]: event.target.value }))}
                  />
                )}
              </FormField>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-6">
          {renderGroup("note", t.notesLegend)}
          {renderGroup("coin", t.coinsLegend)}
          {noneError && (
            <FieldMessage id="cash-counts-error" error>
              {t.none}
            </FieldMessage>
          )}
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(formatTaka(result.total)) : ""}
        result={result && <CashResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function CashResultView({ result: r }: { result: CashResult }) {
  const t = STRINGS[useLocale()];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={t.resultTitle}
        titleId="cash-result-heading"
        value={
          <div className="space-y-2">
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{formatTaka(r.total)}</p>
            <p className="text-base text-slate-700">
              {t.notesCount(formatNumber(r.noteCount))} · {t.coinsCount(formatNumber(r.coinCount))}
            </p>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 text-left font-medium">{t.valueCol}</th>
                <th scope="col" className="py-2 px-3 text-right font-medium">{t.countCol}</th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">{t.subtotalCol}</th>
              </tr>
            </thead>
            <tbody>
              {r.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">{t.rowName(row.kind, row.value)}</th>
                  <td className="py-2 px-3 text-right tabular-nums">{formatNumber(row.count)}</td>
                  <td className="py-2 pl-3 text-right tabular-nums">{formatTaka(row.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>
    </div>
  );
}

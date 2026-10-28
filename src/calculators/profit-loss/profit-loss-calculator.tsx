"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField } from "@/components/ui/form";
import { TrendingIcon } from "@/components/ui/icons";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatPercent, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import {
  calculateProfitLoss,
  MAX_PRICE,
  type ProfitLossError,
  type ProfitLossField,
  type ProfitLossResult,
  type ProfitLossStatus,
} from "./logic";

const FIELD_IDS: Record<ProfitLossField, string> = {
  cost: "profit-loss-cost",
  selling: "profit-loss-selling",
};

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

function percent(value: number): string {
  return formatPercent(value, { decimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate profit or loss",
    costPrice: "Cost price",
    sellingPrice: "Selling price",
    costPlaceholder: "e.g. 800",
    sellingPlaceholder: "e.g. 1,000",
    statusLabel: { profit: "Profit", loss: "Loss", "break-even": "Break-even" } as Record<ProfitLossStatus, string>,
    breakEvenSummary: "Break-even: no profit and no loss.",
    summary: (status: string, amount: string, pct: string) => `${status} of ${amount} (${pct} of the cost price).`,
    placeholderTitleFirst: "Your profit or loss will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the cost price and the selling price, then select Calculate profit or loss.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitle: "Result",
    pctOnCost: (noun: string) => `${noun} % on cost price`,
    marginOnSelling: (noun: string) => `${noun} margin on selling price`,
    marginUndefined: "Not defined when the selling price is ৳0",
    breakEvenNote: "The selling price equals the cost price, so there is no profit and no loss.",
    markupNote:
      "The percentage on cost (also called markup) divides by the cost price. The margin divides by the selling price, so it is a different number for the same deal.",
    paisaNote: "Prices are rounded to the nearest paisa.",
    errCostLabel: "cost price",
    errCostMin: "at least ৳0.01",
    errSellingLabel: "selling price",
    errSellingMin: "৳0 or more",
    errMax: (max: string) => `${max} or less`,
    shareMargin: (noun: string, pct: string) => ` ${noun} margin on selling price: ${pct}.`,
    shareText: (cost: string, selling: string, summary: string, margin: string) =>
      `Cost ${cost}, selling price ${selling}: ${summary}${margin} Calculated with HisabBD’s Profit and Loss Calculator.`,
    shareTitle: "Profit or loss calculated with HisabBD",
  },
  bn: {
    submit: "লাভ-ক্ষতি হিসাব করুন",
    costPrice: "ক্রয়মূল্য",
    sellingPrice: "বিক্রয়মূল্য",
    costPlaceholder: "যেমন 800",
    sellingPlaceholder: "যেমন 1,000",
    statusLabel: { profit: "লাভ", loss: "ক্ষতি", "break-even": "সমান সমান" } as Record<ProfitLossStatus, string>,
    breakEvenSummary: "সমান সমান: লাভও নেই, ক্ষতিও নেই।",
    summary: (status: string, amount: string, pct: string) => `${amount} ${status} (ক্রয়মূল্যের ${pct})।`,
    placeholderTitleFirst: "আপনার লাভ বা ক্ষতি এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "ক্রয়মূল্য ও বিক্রয়মূল্য লিখে “লাভ-ক্ষতি হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitle: "ফলাফল",
    pctOnCost: (noun: string) => `ক্রয়মূল্যের ওপর ${noun} %`,
    marginOnSelling: (noun: string) => `বিক্রয়মূল্যের ওপর ${noun} মার্জিন`,
    marginUndefined: "বিক্রয়মূল্য ৳0 হলে সংজ্ঞায়িত নয়",
    breakEvenNote: "বিক্রয়মূল্য আর ক্রয়মূল্য সমান, তাই লাভও নেই, ক্ষতিও নেই।",
    markupNote:
      "ক্রয়মূল্যের ওপর শতাংশ (যাকে মার্কআপও বলে) ভাগ হয় ক্রয়মূল্য দিয়ে। মার্জিন ভাগ হয় বিক্রয়মূল্য দিয়ে — তাই একই লেনদেনে দুটি সংখ্যা আলাদা।",
    paisaNote: "দামগুলো নিকটতম পয়সায় রাউন্ড করা।",
    errCostLabel: "ক্রয়মূল্য",
    errCostMin: "কমপক্ষে ৳0.01",
    errSellingLabel: "বিক্রয়মূল্য",
    errSellingMin: "৳0 বা তার বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    shareMargin: (noun: string, pct: string) => ` বিক্রয়মূল্যের ওপর ${noun} মার্জিন: ${pct}।`,
    shareText: (cost: string, selling: string, summary: string, margin: string) =>
      `ক্রয়মূল্য ${cost}, বিক্রয়মূল্য ${selling}: ${summary}${margin} HisabBD-র লাভ-ক্ষতি ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD দিয়ে লাভ-ক্ষতির হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: ProfitLossError): string {
  const max = t.errMax(formatTaka(MAX_PRICE));
  return error.field === "cost"
    ? numberErrorMessage(error.code, { label: t.errCostLabel, min: t.errCostMin, max }, locale)
    : numberErrorMessage(error.code, { label: t.errSellingLabel, min: t.errSellingMin, max }, locale);
}

/** Decorative; the status is always also written in words next to it. */
function StatusIcon({ status }: { status: ProfitLossStatus }) {
  if (status === "profit") return <TrendingIcon className="size-8" />;
  if (status === "loss") return <TrendingIcon className="size-8 -scale-y-100" />;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className="size-8"
    >
      <path d="M5 9h14M5 15h14" />
    </svg>
  );
}

function summary(t: Strings, r: ProfitLossResult): string {
  if (r.status === "break-even") return t.breakEvenSummary;
  return t.summary(t.statusLabel[r.status], money(r.amount), percent(r.percentOnCost));
}

function shareText(t: Strings, r: ProfitLossResult): string {
  const margin =
    r.marginPercent === null
      ? ""
      : t.shareMargin(t.statusLabel[r.status === "loss" ? "loss" : "profit"], percent(r.marginPercent));
  return t.shareText(money(r.costPrice), money(r.sellingPrice), summary(t, r), margin);
}

export function ProfitLossCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [cost, setCost] = useState("");
  const [selling, setSelling] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<ProfitLossField, React.RefObject<HTMLInputElement | null>> = {
    cost: useRef<HTMLInputElement>(null),
    selling: useRef<HTMLInputElement>(null),
  };

  const calc = submitted ? calculateProfitLoss(cost, selling) : null;
  const errorFor = (field: ProfitLossField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateProfitLoss(cost, selling);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setCost("");
    setSelling("");
    setSubmitted(false);
    setRevealCount(0);
    refs.cost.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.cost} label={t.costPrice} error={errorFor("cost")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.cost}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.costPlaceholder}
                value={cost}
                onChange={(event) => setCost(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.selling} label={t.sellingPrice} error={errorFor("selling")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.selling}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.sellingPlaceholder}
                value={selling}
                onChange={(event) => setSelling(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? summary(t, result) : ""}
        result={result && <ProfitLossResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function ProfitLossResultView({ result: r }: { result: ProfitLossResult }) {
  const t = STRINGS[useLocale()];
  const isBreakEven = r.status === "break-even";
  const noun = t.statusLabel[r.status === "loss" ? "loss" : "profit"];
  const stats = isBreakEven
    ? [
        { label: t.costPrice, value: money(r.costPrice) },
        { label: t.sellingPrice, value: money(r.sellingPrice) },
      ]
    : [
        { label: t.pctOnCost(noun), value: percent(r.percentOnCost) },
        {
          label: t.marginOnSelling(noun),
          value: r.marginPercent === null ? t.marginUndefined : percent(r.marginPercent),
        },
        { label: t.costPrice, value: money(r.costPrice) },
        { label: t.sellingPrice, value: money(r.sellingPrice) },
      ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="profit-loss-result-heading"
        value={
          <div>
            <p className="flex items-center gap-2 font-display text-2xl font-bold text-brand-800">
              <StatusIcon status={r.status} />
              <span>{t.statusLabel[r.status]}</span>
            </p>
            <p className="mt-1 font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {money(r.amount)}
            </p>
          </div>
        }
      >
        {isBreakEven && (
          <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">{t.breakEvenNote}</p>
        )}
        <ResultStats items={stats} className={isBreakEven ? "mt-5" : undefined} />
        {!isBreakEven && (
          <p className="mt-4 text-sm text-slate-600">{t.markupNote}</p>
        )}
        <p className="mt-3 text-sm text-slate-600">{t.paisaNote}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, r)} text={shareText(t, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

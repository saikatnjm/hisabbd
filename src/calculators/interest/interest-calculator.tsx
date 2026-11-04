"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPercent, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateInterest,
  COMPOUNDING,
  MAX_PRINCIPAL,
  MAX_YEARS,
  type Compounding,
  type InterestError,
  type InterestField,
  type InterestResult,
} from "./logic";

const SLUG = "interest-calculator";
/** Remembered in this browser: how often interest is compounded. */
const COMPOUNDING_PREF = choicePreference(SLUG, "compounding", COMPOUNDING, "yearly");

const FIELD_IDS: Record<InterestField, string> = {
  principal: "interest-principal",
  rate: "interest-rate",
  years: "interest-years",
};
const COMPOUNDING_ID = "interest-compounding";

/** ৳ with paisa only when there is a fraction: ৳45,000 or ৳53,862.40. */
function money(value: number): string {
  const rounded = roundTo(value, 2);
  return Number.isInteger(rounded) ? formatTaka(rounded) : formatTaka(rounded, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate interest",
    principal: "Principal (P)",
    principalPlaceholder: "e.g. 1,00,000",
    rate: "Interest rate a year (r)",
    ratePlaceholder: "e.g. 9",
    years: "Time (n)",
    yearsSuffix: "years",
    yearsHint: "Part years work too, e.g. 2.5.",
    yearsPlaceholder: "e.g. 5",
    compounding: "Compounding (for compound interest)",
    compoundingOptions: {
      yearly: "Yearly (textbook)",
      "half-yearly": "Half-yearly",
      quarterly: "Quarterly",
      monthly: "Monthly",
    } satisfies Record<Compounding, string>,
    errPrincipal: "principal",
    errRate: "interest rate",
    errYears: "time",
    errAmountMin: "more than ৳0",
    errMax: (max: string) => `${max} or less`,
    errRateMin: "0% or more",
    errRateMax: "100% or less",
    errYearsMin: "more than 0",
    errYearsMax: `${MAX_YEARS} years or less`,
    simpleTitle: "Simple interest",
    compoundTitle: "Compound interest",
    amount: (value: string) => `Amount (মুনাফা-আসল): ${value}`,
    resultTitle: (p: string, r: string, n: string) => `${p} at ${r} for ${n}`,
    yearsText: (n: number) => `${formatNumber(n)} ${n === 1 ? "year" : "years"}`,
    difference: "Compound earns more by",
    effectiveRate: "Effective yearly rate",
    compoundingUsed: "Compounding",
    seeTable: "See the year-by-year table",
    tableCaption: "Amount at the end of each year, simple and compound",
    yearCol: "Year",
    simpleCol: "Simple amount",
    compoundCol: "Compound amount",
    note: "Before any tax. Banks set their own rate and compounding; for an FDR or DPS with source tax, use those calculators.",
    announcement: (si: string, ci: string) => `Simple interest ${si}. Compound interest ${ci}.`,
    placeholderTitleFirst: "Your interest will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the principal, rate and time, then select Calculate interest.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Interest calculated with HisabBD",
    shareText: (head: string, si: string, sa: string, ci: string, ca: string, how: string) =>
      `${head}: simple interest ${si} (amount ${sa}); compound interest ${ci} (amount ${ca}, ${how}). Calculated with HisabBD’s Interest Calculator.`,
  },
  bn: {
    submit: "মুনাফা হিসাব করুন",
    principal: "আসল (P)",
    principalPlaceholder: "যেমন 1,00,000",
    rate: "বার্ষিক মুনাফার হার (r)",
    ratePlaceholder: "যেমন 9",
    years: "সময় (n)",
    yearsSuffix: "বছর",
    yearsHint: "বছরের ভগ্নাংশও দেওয়া যায়, যেমন 2.5।",
    yearsPlaceholder: "যেমন 5",
    compounding: "চক্রবৃদ্ধি (চক্রবৃদ্ধি মুনাফার জন্য)",
    compoundingOptions: {
      yearly: "বার্ষিক (পাঠ্যবই)",
      "half-yearly": "ষাণ্মাসিক",
      quarterly: "ত্রৈমাসিক",
      monthly: "মাসিক",
    } satisfies Record<Compounding, string>,
    errPrincipal: "আসল",
    errRate: "মুনাফার হার",
    errYears: "সময়",
    errAmountMin: "৳0-এর বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errRateMin: "0% বা তার বেশি",
    errRateMax: "100% বা তার কম",
    errYearsMin: "0-এর বেশি",
    errYearsMax: `${MAX_YEARS} বছর বা তার কম`,
    simpleTitle: "সরল মুনাফা",
    compoundTitle: "চক্রবৃদ্ধি মুনাফা",
    amount: (value: string) => `মুনাফা-আসল: ${value}`,
    resultTitle: (p: string, r: string, n: string) => `${p}, ${r} হারে, ${n}`,
    yearsText: (n: number) => `${formatNumber(n)} বছর`,
    difference: "চক্রবৃদ্ধিতে বেশি",
    effectiveRate: "কার্যকর বার্ষিক হার",
    compoundingUsed: "চক্রবৃদ্ধি",
    seeTable: "বছরওয়ারি টেবিল দেখুন",
    tableCaption: "প্রতি বছর শেষে মুনাফা-আসল, সরল ও চক্রবৃদ্ধি",
    yearCol: "বছর",
    simpleCol: "সরল মুনাফা-আসল",
    compoundCol: "চক্রবৃদ্ধি মূলধন",
    note: "কর বাদের আগের হিসাব। ব্যাংক নিজের হার আর চক্রবৃদ্ধির নিয়ম ঠিক করে; উৎসে করসহ এফডিআর বা ডিপিএসের জন্য সেই ক্যালকুলেটরগুলো ব্যবহার করুন।",
    announcement: (si: string, ci: string) => `সরল মুনাফা ${si}। চক্রবৃদ্ধি মুনাফা ${ci}।`,
    placeholderTitleFirst: "মুনাফা এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "আসল, হার আর সময় লিখে “মুনাফা হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে মুনাফা হিসাব",
    shareText: (head: string, si: string, sa: string, ci: string, ca: string, how: string) =>
      `${head}: সরল মুনাফা ${si} (মুনাফা-আসল ${sa}); চক্রবৃদ্ধি মুনাফা ${ci} (চক্রবৃদ্ধি মূলধন ${ca}, ${how})। HisabBD-র মুনাফা ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: InterestError): string {
  switch (error.field) {
    case "principal":
      return numberErrorMessage(error.code, { label: t.errPrincipal, min: t.errAmountMin, max: t.errMax(formatTaka(MAX_PRINCIPAL)) }, locale);
    case "rate":
      return numberErrorMessage(error.code, { label: t.errRate, min: t.errRateMin, max: t.errRateMax }, locale);
    case "years":
      return numberErrorMessage(error.code, { label: t.errYears, min: t.errYearsMin, max: t.errYearsMax }, locale);
  }
}

function heading(t: Strings, r: InterestResult): string {
  return t.resultTitle(money(r.principal), formatPercent(r.ratePercent, { decimals: 4 }), t.yearsText(r.years));
}

function shareText(t: Strings, r: InterestResult): string {
  return t.shareText(
    heading(t, r),
    money(r.simpleInterest),
    money(r.simpleAmount),
    money(r.compoundInterest),
    money(r.compoundAmount),
    t.compoundingOptions[r.compounding],
  );
}

export function InterestCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compounding, setCompounding] = usePreference(COMPOUNDING_PREF);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    principal: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
    years: useRef<HTMLInputElement>(null),
  };

  const calc = submitted ? calculateInterest(principal, rate, years, compounding) : null;
  const errorFor = (field: InterestField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateInterest(principal, rate, years, compounding);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ principal, rate, years, compounding }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    setPrincipal(text("principal"));
    setRate(text("rate"));
    setYears(text("years"));
    const savedCompounding = text("compounding");
    if (COMPOUNDING_PREF.isValid(savedCompounding)) setCompounding(savedCompounding);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered compounding stays. */
  function onReset() {
    setPrincipal("");
    setRate("");
    setYears("");
    setSubmitted(false);
    setRevealCount(0);
    refs.principal.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id={FIELD_IDS.principal} label={t.principal} error={errorFor("principal")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.principal}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.principalPlaceholder}
                value={principal}
                onChange={(event) => setPrincipal(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.rate} label={t.rate} error={errorFor("rate")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.rate}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix="%"
                placeholder={t.ratePlaceholder}
                value={rate}
                onChange={(event) => setRate(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.years} label={t.years} hint={t.yearsHint} error={errorFor("years")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.years}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix={t.yearsSuffix}
                placeholder={t.yearsPlaceholder}
                value={years}
                onChange={(event) => setYears(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={COMPOUNDING_ID} label={t.compounding}>
            {(control) => (
              <Select
                {...control}
                value={compounding}
                onChange={(event) => {
                  const next = COMPOUNDING.find((c) => c === event.target.value);
                  if (next) setCompounding(next);
                }}
              >
                {COMPOUNDING.map((value) => (
                  <option key={value} value={value}>
                    {t.compoundingOptions[value]}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(money(result.simpleInterest), money(result.compoundInterest)) : ""}
        result={result && <InterestResultView result={result} />}
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

function InterestResultView({ result: r }: { result: InterestResult }) {
  const t = STRINGS[useLocale()];
  const blocks = [
    { title: t.simpleTitle, interest: r.simpleInterest, amount: r.simpleAmount },
    { title: t.compoundTitle, interest: r.compoundInterest, amount: r.compoundAmount },
  ];
  const stats = [
    { label: t.difference, value: money(r.difference) },
    { label: t.compoundingUsed, value: t.compoundingOptions[r.compounding] },
    ...(r.compounding === "yearly"
      ? []
      : [{ label: t.effectiveRate, value: formatPercent(r.effectiveAnnualRatePercent, { decimals: 2 }) }]),
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={heading(t, r)}
        titleId="interest-result-heading"
        value={
          <div className="grid gap-4 sm:grid-cols-2">
            {blocks.map((block) => (
              <div key={block.title}>
                <p className="text-sm font-semibold text-slate-700">{block.title}</p>
                <p className="font-display text-4xl font-bold tracking-tight break-words sm:text-5xl">{money(block.interest)}</p>
                <p className="mt-1 text-sm text-slate-700">{t.amount(money(block.amount))}</p>
              </div>
            ))}
          </div>
        }
      >
        <ResultStats items={stats} />

        <details className="mt-5 rounded-xl bg-white/70 px-4 py-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-slate-900">{t.seeTable}</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[20rem] text-right text-sm">
              <caption className="sr-only">{t.tableCaption}</caption>
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th scope="col" className="py-2 pr-3 text-left font-medium">{t.yearCol}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.simpleCol}</th>
                  <th scope="col" className="py-2 pl-3 font-medium">{t.compoundCol}</th>
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((row) => (
                  <tr key={row.years} className="border-b border-slate-200 last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">
                      {formatNumber(row.years)}
                    </th>
                    <td className="px-3 py-2">{money(row.simpleAmount)}</td>
                    <td className="py-2 pl-3">{money(row.compoundAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>
    </div>
  );
}

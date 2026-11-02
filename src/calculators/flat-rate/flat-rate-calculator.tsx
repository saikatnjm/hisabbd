"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPercent, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateFlatRate,
  FREQUENCIES,
  MAX_AMOUNT,
  MAX_FLAT_RATE,
  MAX_TERM_MONTHS,
  type FlatRateError,
  type FlatRateField,
  type FlatRateResult,
  type Frequency,
} from "./logic";

const SLUG = "flat-rate-calculator";
/** Remembered in this browser: monthly or weekly instalments. */
const FREQUENCY_PREF = choicePreference(SLUG, "frequency", FREQUENCIES, "monthly");

const FIELD_IDS: Record<FlatRateField, string> = {
  amount: "flat-rate-amount",
  rate: "flat-rate-rate",
  months: "flat-rate-months",
  fee: "flat-rate-fee",
};

/** ৳ with paisa only when there is a fraction: ৳9,333.33 or ৳12,000. */
function money(value: number): string {
  const rounded = roundTo(value, 2);
  return Number.isInteger(rounded) ? formatTaka(rounded) : formatTaka(rounded, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Find the real rate",
    amount: "Loan amount",
    amountPlaceholder: "e.g. 1,00,000",
    rate: "Flat interest rate a year",
    ratePlaceholder: "e.g. 12",
    months: "Loan term",
    monthsSuffix: "months",
    monthsPlaceholder: "e.g. 12",
    frequency: "Instalments",
    frequencyOptions: { monthly: "Monthly", weekly: "Weekly (52 a year)" } satisfies Record<Frequency, string>,
    fee: "Upfront fee (optional)",
    feePlaceholder: "e.g. 2,000",
    feeHint: "Processing, insurance or form fee taken out of the loan.",
    errAmount: "loan amount",
    errRate: "flat rate",
    errMonths: "loan term",
    errFee: "upfront fee",
    errAmountMin: "more than ৳0",
    errMax: (max: string) => `${max} or less`,
    errRateMin: "0% or more",
    errRateMax: `${MAX_FLAT_RATE}% or less`,
    errMonthsMin: "1 month or more",
    errMonthsMax: `${MAX_TERM_MONTHS} months or less`,
    errFeeMin: "0 or more",
    errFeeTooLarge: "The upfront fee must be less than the loan amount.",
    realRate: "Real yearly rate",
    reducingNote: "on the reducing balance",
    instalmentLabel: (frequency: Frequency) => (frequency === "weekly" ? "Weekly instalment" : "Monthly instalment"),
    instalments: "Number of instalments",
    totalInterest: "Total flat interest",
    totalPayable: "Total you repay",
    received: "Money you receive",
    extraCost: "Extra paid over what you receive",
    effectiveRate: "Effective yearly rate",
    flatRateUsed: "Flat rate quoted",
    resultTitle: (a: string, r: string, m: string) => `${a} at ${r} flat for ${m}`,
    monthsText: (n: number) => `${formatNumber(n)} ${n === 1 ? "month" : "months"}`,
    note: "Instalments are assumed equal and paid at the end of each period. Weekly means 52 a year; your lender may count differently.",
    announcement: (real: string, flat: string) => `A flat rate of ${flat} is a real rate of ${real} a year.`,
    placeholderTitleFirst: "Your real rate will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the loan amount, flat rate and term, then select Find the real rate.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Flat rate to real rate with HisabBD",
    shareText: (head: string, instalment: string, real: string, effective: string) =>
      `${head}: instalment ${instalment}, real yearly rate ${real} (effective ${effective}). Calculated with HisabBD’s Flat Rate to Real Interest Rate Calculator.`,
  },
  bn: {
    submit: "আসল হার বের করুন",
    amount: "ঋণের পরিমাণ",
    amountPlaceholder: "যেমন 1,00,000",
    rate: "বার্ষিক ফ্ল্যাট সুদের হার",
    ratePlaceholder: "যেমন 12",
    months: "ঋণের মেয়াদ",
    monthsSuffix: "মাস",
    monthsPlaceholder: "যেমন 12",
    frequency: "কিস্তি",
    frequencyOptions: { monthly: "মাসিক", weekly: "সাপ্তাহিক (বছরে 52টি)" } satisfies Record<Frequency, string>,
    fee: "অগ্রিম ফি (ঐচ্ছিক)",
    feePlaceholder: "যেমন 2,000",
    feeHint: "ঋণ থেকে কেটে নেওয়া প্রসেসিং, বিমা বা ফর্ম ফি।",
    errAmount: "ঋণের পরিমাণ",
    errRate: "ফ্ল্যাট রেট",
    errMonths: "ঋণের মেয়াদ",
    errFee: "অগ্রিম ফি",
    errAmountMin: "৳0-এর বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errRateMin: "0% বা তার বেশি",
    errRateMax: `${MAX_FLAT_RATE}% বা তার কম`,
    errMonthsMin: "1 মাস বা তার বেশি",
    errMonthsMax: `${MAX_TERM_MONTHS} মাস বা তার কম`,
    errFeeMin: "0 বা তার বেশি",
    errFeeTooLarge: "অগ্রিম ফি ঋণের পরিমাণের চেয়ে কম হতে হবে।",
    realRate: "আসল বার্ষিক হার",
    reducingNote: "ক্রমহ্রাসমান স্থিতির ওপর",
    instalmentLabel: (frequency: Frequency) => (frequency === "weekly" ? "সাপ্তাহিক কিস্তি" : "মাসিক কিস্তি"),
    instalments: "কিস্তির সংখ্যা",
    totalInterest: "মোট ফ্ল্যাট সুদ",
    totalPayable: "মোট পরিশোধ",
    received: "আপনার হাতে পাওয়া টাকা",
    extraCost: "পাওয়া টাকার চেয়ে বাড়তি পরিশোধ",
    effectiveRate: "কার্যকর বার্ষিক হার",
    flatRateUsed: "বলা ফ্ল্যাট রেট",
    resultTitle: (a: string, r: string, m: string) => `${a}, ${r} ফ্ল্যাট রেটে, ${m}`,
    monthsText: (n: number) => `${formatNumber(n)} মাস`,
    note: "কিস্তি সমান ধরা হয়েছে আর প্রতি পর্বের শেষে দেওয়া হয়। সাপ্তাহিক মানে বছরে 52টি; আপনার ঋণদাতা আলাদাভাবে গুনতে পারে।",
    announcement: (real: string, flat: string) => `${flat} ফ্ল্যাট রেটের আসল হার বছরে ${real}।`,
    placeholderTitleFirst: "আসল হার এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "ঋণের পরিমাণ, ফ্ল্যাট রেট আর মেয়াদ লিখে “আসল হার বের করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে ফ্ল্যাট রেট থেকে আসল হার",
    shareText: (head: string, instalment: string, real: string, effective: string) =>
      `${head}: কিস্তি ${instalment}, আসল বার্ষিক হার ${real} (কার্যকর ${effective})। HisabBD-র ফ্ল্যাট রেট থেকে আসল সুদের হার ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: FlatRateError): string {
  if (error.code === "fee-too-large") return t.errFeeTooLarge;
  switch (error.field) {
    case "amount":
      return numberErrorMessage(error.code, { label: t.errAmount, min: t.errAmountMin, max: t.errMax(formatTaka(MAX_AMOUNT)) }, locale);
    case "rate":
      return numberErrorMessage(error.code, { label: t.errRate, min: t.errRateMin, max: t.errRateMax }, locale);
    case "months":
      return numberErrorMessage(error.code, { label: t.errMonths, min: t.errMonthsMin, max: t.errMonthsMax }, locale);
    case "fee":
      return numberErrorMessage(error.code, { label: t.errFee, min: t.errFeeMin, max: t.errMax(formatTaka(MAX_AMOUNT)) }, locale);
  }
}

const pct = (value: number) => formatPercent(value, { decimals: 2 });

function heading(t: Strings, r: FlatRateResult): string {
  return t.resultTitle(money(r.amount), formatPercent(r.flatRatePercent, { decimals: 4 }), t.monthsText(r.months));
}

function shareText(t: Strings, r: FlatRateResult): string {
  return t.shareText(heading(t, r), money(r.instalment), pct(r.realRatePercent), pct(r.effectiveAnnualRatePercent));
}

export function FlatRateCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [fee, setFee] = useState("");
  const [frequency, setFrequency] = usePreference(FREQUENCY_PREF);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    amount: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
    months: useRef<HTMLInputElement>(null),
    fee: useRef<HTMLInputElement>(null),
  };

  const calc = submitted ? calculateFlatRate(amount, rate, months, frequency, fee) : null;
  const errorFor = (field: FlatRateField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateFlatRate(amount, rate, months, frequency, fee);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ amount, rate, months, fee, frequency }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    setAmount(text("amount"));
    setRate(text("rate"));
    setMonths(text("months"));
    setFee(text("fee"));
    const savedFrequency = text("frequency");
    if (FREQUENCY_PREF.isValid(savedFrequency)) setFrequency(savedFrequency);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered frequency stays. */
  function onReset() {
    setAmount("");
    setRate("");
    setMonths("");
    setFee("");
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id={FIELD_IDS.amount} label={t.amount} error={errorFor("amount")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.amount}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.amountPlaceholder}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
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
          <FormField id={FIELD_IDS.months} label={t.months} error={errorFor("months")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.months}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix={t.monthsSuffix}
                placeholder={t.monthsPlaceholder}
                value={months}
                onChange={(event) => setMonths(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.fee} label={t.fee} hint={t.feeHint} error={errorFor("fee")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.fee}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.feePlaceholder}
                value={fee}
                onChange={(event) => setFee(event.target.value)}
              />
            )}
          </FormField>
        </div>
        <div className="mt-6">
          <SegmentedControl
            name="flat-rate-frequency"
            legend={t.frequency}
            value={frequency}
            onChange={setFrequency}
            options={FREQUENCIES.map((value) => ({ value, label: t.frequencyOptions[value] }))}
          />
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(pct(result.realRatePercent), pct(result.flatRatePercent)) : ""}
        result={result && <FlatRateResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–%</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function FlatRateResultView({ result: r }: { result: FlatRateResult }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.flatRateUsed, value: pct(r.flatRatePercent) },
    { label: t.instalmentLabel(r.frequency), value: money(r.instalment) },
    { label: t.instalments, value: formatNumber(r.instalmentCount) },
    { label: t.totalInterest, value: money(r.totalInterest) },
    { label: t.totalPayable, value: money(r.totalPayable) },
    ...(r.fee > 0 ? [{ label: t.received, value: money(r.received) }] : []),
    { label: t.extraCost, value: money(r.totalCost) },
    { label: t.effectiveRate, value: pct(r.effectiveAnnualRatePercent) },
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={heading(t, r)}
        titleId="flat-rate-result-heading"
        value={
          <div>
            <p className="text-sm font-semibold text-slate-700">{t.realRate}</p>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{pct(r.realRatePercent)}</p>
            <p className="mt-1 text-sm text-slate-700">{t.reducingNote}</p>
          </div>
        }
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

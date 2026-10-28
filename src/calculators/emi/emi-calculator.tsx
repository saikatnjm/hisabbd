"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatPercent, formatTaka, pluralize } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateLoan,
  MAX_LOAN,
  MAX_TENURE_MONTHS,
  MAX_TENURE_YEARS,
  type EmiError,
  type EmiField,
  type EmiResult,
  type RateUnit,
  type TenureUnit,
} from "./logic";

/** Remembered in this browser: whether the rate is per year or per month, and the tenure unit. */
const RATE_UNIT = choicePreference("emi-calculator", "rateUnit", ["year", "month"] as const, "year");
const TENURE_UNIT = choicePreference("emi-calculator", "tenureUnit", ["years", "months"] as const, "years");

const FIELD_IDS: Record<EmiField, string> = {
  amount: "emi-amount",
  rate: "emi-rate",
  tenure: "emi-tenure",
};

const STRINGS = {
  en: {
    submit: "Calculate EMI",
    loanAmount: "Loan amount",
    rateLegend: "Interest rate is",
    perYear: "per year",
    perMonth: "per month",
    interestRate: "Interest rate",
    tenureLegend: "Tenure is in",
    years: "years",
    months: "months",
    loanTenure: "Loan tenure",
    tenureHint: "A whole number.",
    amountPlaceholder: "e.g. 5,00,000",
    ratePlaceholder: "e.g. 9",
    tenureYearsPlaceholder: "e.g. 5",
    tenureMonthsPlaceholder: "e.g. 60",
    announcement: (emi: string, interest: string) => `Monthly EMI ${emi}. Total interest ${interest}.`,
    placeholderTitleFirst: "Your monthly EMI will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the loan amount, interest rate and tenure, then select Calculate EMI.",
    placeholderFix: "Fix the highlighted fields above and your EMI will show here.",
    resultTitle: "Monthly EMI",
    perMonthNote: "per month, rounded to the nearest Taka",
    totalInterest: "Total interest",
    totalPayment: "Total payment",
    statLoanAmount: "Loan amount",
    instalments: "Number of instalments",
    whereGoes: "Where your total payment goes",
    principal: "Principal",
    interest: "Interest",
    seeBreakdown: "See year-by-year breakdown",
    tableCaption: "Principal paid, interest paid and remaining balance for each loan year",
    year: "Year",
    principalPaid: "Principal paid",
    interestPaid: "Interest paid",
    remainingBalance: "Remaining balance",
    instalmentCount: (n: number) => pluralize(n, "instalment"),
    roundingNote: "Whole Taka. Rounded figures in a row may differ from their sum by ৳1.",
    methodNote: (months: number) =>
      `Standard reducing-balance method with ${months} equal monthly instalments. Actual bank EMIs can differ because of fees, insurance, rounding or rate type.`,
    tenureYears: (n: number) => pluralize(n, "year"),
    tenureMonths: (n: number) => pluralize(n, "month"),
    errAmountLabel: "loan amount",
    errAmountMin: "more than ৳0",
    errMax: (max: string) => `${max} or less`,
    errRateLabel: "interest rate",
    errRateMin: "0% or more",
    errRateMax: "100% or less",
    errTenureLabel: "loan tenure",
    errTenureMinYears: "at least 1 year",
    errTenureMinMonths: "at least 1 month",
    errTenureMaxYears: `${MAX_TENURE_YEARS} years or less`,
    errTenureMaxMonths: `${MAX_TENURE_MONTHS} months (${MAX_TENURE_YEARS} years) or less`,
    shareText: (amount: string, rate: string, tenure: string, emi: string, interest: string, total: string) =>
      `Loan of ${amount} at ${rate} for ${tenure}: monthly EMI about ${emi}, total interest ${interest}, total payment ${total} (reducing-balance method). Calculated with HisabBD’s EMI Calculator.`,
    shareTitle: "EMI calculated with HisabBD",
  },
  bn: {
    submit: "ইএমআই হিসাব করুন",
    loanAmount: "লোনের পরিমাণ",
    rateLegend: "সুদের হার",
    perYear: "বছরে",
    perMonth: "মাসে",
    interestRate: "সুদের হার",
    tenureLegend: "মেয়াদ",
    years: "বছর",
    months: "মাস",
    loanTenure: "লোনের মেয়াদ",
    tenureHint: "পূর্ণ সংখ্যায়।",
    amountPlaceholder: "যেমন 5,00,000",
    ratePlaceholder: "যেমন 9",
    tenureYearsPlaceholder: "যেমন 5",
    tenureMonthsPlaceholder: "যেমন 60",
    announcement: (emi: string, interest: string) => `মাসিক ইএমআই ${emi}। মোট সুদ ${interest}।`,
    placeholderTitleFirst: "আপনার মাসিক ইএমআই এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "লোনের পরিমাণ, সুদের হার ও মেয়াদ লিখে “ইএমআই হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ইএমআই এখানে দেখা যাবে।",
    resultTitle: "মাসিক ইএমআই",
    perMonthNote: "প্রতি মাসে, নিকটতম টাকায় রাউন্ড করা",
    totalInterest: "মোট সুদ",
    totalPayment: "মোট পরিশোধ",
    statLoanAmount: "লোনের পরিমাণ",
    instalments: "কিস্তির সংখ্যা",
    whereGoes: "মোট পরিশোধের টাকা কোথায় যায়",
    principal: "আসল",
    interest: "সুদ",
    seeBreakdown: "বছরভিত্তিক হিসাব দেখুন",
    tableCaption: "প্রতি বছরের পরিশোধিত আসল, পরিশোধিত সুদ ও অবশিষ্ট ব্যালান্স",
    year: "বছর",
    principalPaid: "আসল পরিশোধ",
    interestPaid: "সুদ পরিশোধ",
    remainingBalance: "অবশিষ্ট ব্যালান্স",
    instalmentCount: (n: number) => countBn(n, "কিস্তি"),
    roundingNote: "পুরো টাকায়। রাউন্ড করার কারণে কোনো সারির অঙ্কের যোগফল ৳1 এদিক-ওদিক হতে পারে।",
    methodNote: (months: number) =>
      `প্রচলিত রিডিউসিং-ব্যালান্স পদ্ধতিতে ${months}টি সমান মাসিক কিস্তি ধরা হয়েছে। ফি, বিমা, রাউন্ডিং বা হারের ধরনের কারণে ব্যাংকের আসল ইএমআই ভিন্ন হতে পারে।`,
    tenureYears: (n: number) => countBn(n, "বছর"),
    tenureMonths: (n: number) => countBn(n, "মাস"),
    errAmountLabel: "লোনের পরিমাণ",
    errAmountMin: "৳0-র বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errRateLabel: "সুদের হার",
    errRateMin: "0% বা তার বেশি",
    errRateMax: "100% বা তার কম",
    errTenureLabel: "লোনের মেয়াদ",
    errTenureMinYears: "কমপক্ষে 1 বছর",
    errTenureMinMonths: "কমপক্ষে 1 মাস",
    errTenureMaxYears: `${MAX_TENURE_YEARS} বছর বা তার কম`,
    errTenureMaxMonths: `${MAX_TENURE_MONTHS} মাস (${MAX_TENURE_YEARS} বছর) বা তার কম`,
    shareText: (amount: string, rate: string, tenure: string, emi: string, interest: string, total: string) =>
      `${amount} লোন, সুদ ${rate}, মেয়াদ ${tenure}: মাসিক ইএমআই প্রায় ${emi}, মোট সুদ ${interest}, মোট পরিশোধ ${total} (রিডিউসিং-ব্যালান্স পদ্ধতি)। HisabBD-র ইএমআই ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD দিয়ে ইএমআই হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function percent(value: number): string {
  return formatPercent(value, { decimals: 1 });
}

function rateText(t: Strings, r: EmiResult): string {
  return `${formatPercent(r.rateInput, { decimals: 4 })} ${r.rateUnit === "year" ? t.perYear : t.perMonth}`;
}

function tenureText(t: Strings, months: number): string {
  if (months % 12 === 0) return t.tenureYears(months / 12);
  return t.tenureMonths(months);
}

function errorMessage(t: Strings, locale: Locale, error: EmiError, tenureUnit: TenureUnit): string {
  switch (error.field) {
    case "amount":
      return numberErrorMessage(
        error.code,
        { label: t.errAmountLabel, min: t.errAmountMin, max: t.errMax(formatTaka(MAX_LOAN)) },
        locale,
      );
    case "rate":
      return numberErrorMessage(
        error.code,
        { label: t.errRateLabel, min: t.errRateMin, max: t.errRateMax },
        locale,
      );
    case "tenure":
      return numberErrorMessage(
        error.code,
        {
          label: t.errTenureLabel,
          min: tenureUnit === "years" ? t.errTenureMinYears : t.errTenureMinMonths,
          max: tenureUnit === "years" ? t.errTenureMaxYears : t.errTenureMaxMonths,
        },
        locale,
      );
  }
}

function shareText(t: Strings, r: EmiResult): string {
  return t.shareText(
    formatTaka(r.amount),
    rateText(t, r),
    tenureText(t, r.months),
    formatTaka(r.emi),
    formatTaka(r.totalInterest),
    formatTaka(r.totalPayment),
  );
}

export function EmiCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const rateUnits: readonly { value: RateUnit; label: string }[] = [
    { value: "year", label: t.perYear },
    { value: "month", label: t.perMonth },
  ];
  const tenureUnits: readonly { value: TenureUnit; label: string }[] = [
    { value: "years", label: t.years },
    { value: "months", label: t.months },
  ];
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [rateUnit, setRateUnit] = usePreference(RATE_UNIT);
  const [tenure, setTenure] = useState("");
  const [tenureUnit, setTenureUnit] = usePreference(TENURE_UNIT);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs: Record<EmiField, React.RefObject<HTMLInputElement | null>> = {
    amount: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
    tenure: useRef<HTMLInputElement>(null),
  };

  const inputs = { amount, rate, rateUnit, tenure, tenureUnit };
  const calc = submitted ? calculateLoan(inputs) : null;
  const errorFor = (field: EmiField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error, tenureUnit) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateLoan(inputs);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record(inputs, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedRateUnit = text("rateUnit");
    const savedTenureUnit = text("tenureUnit");
    setAmount(text("amount"));
    setRate(text("rate"));
    if (RATE_UNIT.isValid(savedRateUnit)) setRateUnit(savedRateUnit);
    setTenure(text("tenure"));
    if (TENURE_UNIT.isValid(savedTenureUnit)) setTenureUnit(savedTenureUnit);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  // Keeps the remembered rate and tenure units; clears only what was typed.
  function onReset() {
    setAmount("");
    setRate("");
    setTenure("");
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2 sm:max-w-[calc(50%-0.75rem)]">
            <FormField id={FIELD_IDS.amount} label={t.loanAmount} error={errorFor("amount")}>
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
          </div>

          <div className="space-y-4">
            <SegmentedControl
              name="emi-rate-unit"
              legend={t.rateLegend}
              options={rateUnits}
              value={rateUnit}
              onChange={setRateUnit}
            />
            <FormField id={FIELD_IDS.rate} label={t.interestRate} error={errorFor("rate")}>
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
          </div>

          <div className="space-y-4">
            <SegmentedControl
              name="emi-tenure-unit"
              legend={t.tenureLegend}
              options={tenureUnits}
              value={tenureUnit}
              onChange={setTenureUnit}
            />
            <FormField
              id={FIELD_IDS.tenure}
              label={t.loanTenure}
              hint={t.tenureHint}
              error={errorFor("tenure")}
            >
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.tenure}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  suffix={tenureUnit === "years" ? t.years : t.months}
                  placeholder={tenureUnit === "years" ? t.tenureYearsPlaceholder : t.tenureMonthsPlaceholder}
                  value={tenure}
                  onChange={(event) => setTenure(event.target.value)}
                />
              )}
            </FormField>
          </div>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(formatTaka(result.emi), formatTaka(result.totalInterest)) : ""}
        result={result && <EmiResultView result={result} />}
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

function EmiResultView({ result: r }: { result: EmiResult }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.totalInterest, value: formatTaka(r.totalInterest) },
    { label: t.totalPayment, value: formatTaka(r.totalPayment) },
    { label: t.statLoanAmount, value: formatTaka(r.amount) },
    { label: t.instalments, value: `${r.months} (${tenureText(t, r.months)})` },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="emi-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {formatTaka(r.emi)}
            </p>
            <p className="mt-1 text-sm text-slate-600">{t.perMonthNote}</p>
          </>
        }
      >
        <ResultStats items={stats} />

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-800">{t.whereGoes}</p>
          <div aria-hidden="true" className="mt-2 flex h-4 overflow-hidden rounded-full bg-slate-200">
            <div className="bg-brand-600" style={{ width: `${r.principalSharePercent}%` }} />
            <div className="bg-amber-500" style={{ width: `${r.interestSharePercent}%` }} />
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
            <li>
              <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-sm bg-brand-600" />
              {t.principal}: <strong>{percent(r.principalSharePercent)}</strong>
            </li>
            <li>
              <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-sm bg-amber-500" />
              {t.interest}: <strong>{percent(r.interestSharePercent)}</strong>
            </li>
          </ul>
        </div>

        <details className="mt-5 rounded-xl bg-white/70 px-4 py-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-slate-900">
            {t.seeBreakdown}
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-right text-sm">
              <caption className="sr-only">{t.tableCaption}</caption>
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th scope="col" className="py-2 pr-3 text-left font-medium">{t.year}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.principalPaid}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.interestPaid}</th>
                  <th scope="col" className="py-2 pl-3 font-medium">{t.remainingBalance}</th>
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((row) => (
                  <tr key={row.year} className="border-b border-slate-200 last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">
                      {row.year}
                      {row.instalments < 12 && (
                        <span className="block text-xs font-normal text-slate-600">
                          {t.instalmentCount(row.instalments)}
                        </span>
                      )}
                    </th>
                    <td className="px-3 py-2">{formatTaka(row.principalPaid)}</td>
                    <td className="px-3 py-2">{formatTaka(row.interestPaid)}</td>
                    <td className="py-2 pl-3">{formatTaka(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-600">{t.roundingNote}</p>
        </details>

        <p className="mt-4 text-sm text-slate-600">{t.methodNote(r.months)}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, r)} text={shareText(t, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

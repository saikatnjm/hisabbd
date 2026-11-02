"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import {
  calculateOvertime,
  MAX_DIVISOR,
  MAX_HOURS,
  MAX_WAGE,
  type OvertimeError,
  type OvertimeField,
  type OvertimeResult,
} from "./logic";

const FIELD_IDS: Record<OvertimeField, string> = {
  basic: "overtime-basic",
  allowance: "overtime-allowance",
  divisor: "overtime-divisor",
  hours: "overtime-hours",
};

/** ৳ with paisa only when there is a fraction: ৳1,250 or ৳1,634.62. */
function money(value: number): string {
  const rounded = roundTo(value, 2);
  return Number.isInteger(rounded) ? formatTaka(rounded) : formatTaka(rounded, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate overtime",
    basic: "Monthly basic wage",
    basicPlaceholder: "e.g. 10,000",
    allowance: "Dearness or ad hoc allowance (optional)",
    allowanceHint: "Leave blank if you have none. House rent, medical and food allowances are not counted.",
    allowancePlaceholder: "e.g. 400",
    divisor: "Hours in a month for the hourly rate",
    divisorHint: "Take it from your payslip, contract or wage notice. We do not assume a number.",
    divisorPlaceholder: "e.g. 208",
    divisorSuffix: "hours",
    hours: "Overtime hours this month",
    hoursHint: "Decimals work: 1.5 is 1 hour 30 minutes.",
    hoursPlaceholder: "e.g. 12.5",
    hoursSuffix: "hours",
    errBasic: "basic wage",
    errAllowance: "allowance",
    errDivisor: "hours in a month",
    errHours: "overtime hours",
    errAmountMin: "more than ৳0",
    errAllowanceMin: "৳0 or more",
    errMax: (max: string) => `${max} or less`,
    errPositive: "more than 0",
    errDivisorMax: `${MAX_DIVISOR} or less`,
    errHoursMax: `${MAX_HOURS} or less`,
    resultTitle: (hours: string) => `Overtime pay for ${hours} hours`,
    ordinaryRate: "Ordinary rate an hour",
    overtimeRate: "Overtime rate an hour (2×)",
    base: "Basic + dearness",
    formula: (base: string, divisor: string, hours: string) => `(${base} ÷ ${divisor}) × 2 × ${hours}`,
    note: "Section 108 of the Labour Act sets the 2× rate on basic wage, dearness allowance and ad hoc or interim wage. Your employer's payslip and the law decide the final figure.",
    announcement: (pay: string) => `Overtime pay ${pay}.`,
    placeholderTitleFirst: "Your overtime pay will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter your basic wage, the hours in a month and your overtime hours, then select Calculate overtime.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Overtime pay calculated with HisabBD",
    shareText: (pay: string, hours: string, rate: string, formula: string) =>
      `Overtime pay for ${hours} hours: ${pay} (${rate} an hour; ${formula}). Calculated with HisabBD’s Overtime Calculator.`,
  },
  bn: {
    submit: "ওভারটাইম হিসাব করুন",
    basic: "মাসিক মূল মজুরি",
    basicPlaceholder: "যেমন 10,000",
    allowance: "মহার্ঘভাতা বা এডহক ভাতা (ঐচ্ছিক)",
    allowanceHint: "না থাকলে ফাঁকা রাখুন। বাড়িভাড়া, চিকিৎসা ও খাদ্য ভাতা ধরা হয় না।",
    allowancePlaceholder: "যেমন 400",
    divisor: "ঘণ্টাপ্রতি হারের জন্য মাসের ঘণ্টা",
    divisorHint: "পে-স্লিপ, নিয়োগপত্র বা মজুরি বিজ্ঞপ্তি থেকে নিন। আমরা কোনো সংখ্যা ধরে নিই না।",
    divisorPlaceholder: "যেমন 208",
    divisorSuffix: "ঘণ্টা",
    hours: "এই মাসের ওভারটাইম ঘণ্টা",
    hoursHint: "দশমিকও চলবে: 1.5 মানে 1 ঘণ্টা 30 মিনিট।",
    hoursPlaceholder: "যেমন 12.5",
    hoursSuffix: "ঘণ্টা",
    errBasic: "মূল মজুরি",
    errAllowance: "ভাতা",
    errDivisor: "মাসের ঘণ্টা",
    errHours: "ওভারটাইম ঘণ্টা",
    errAmountMin: "৳0-এর বেশি",
    errAllowanceMin: "৳0 বা তার বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errPositive: "0-এর বেশি",
    errDivisorMax: `${MAX_DIVISOR} বা তার কম`,
    errHoursMax: `${MAX_HOURS} বা তার কম`,
    resultTitle: (hours: string) => `${hours} ঘণ্টার ওভারটাইম মজুরি`,
    ordinaryRate: "ঘণ্টাপ্রতি সাধারণ হার",
    overtimeRate: "ঘণ্টাপ্রতি ওভারটাইম হার (2×)",
    base: "মূল মজুরি + মহার্ঘভাতা",
    formula: (base: string, divisor: string, hours: string) => `(${base} ÷ ${divisor}) × 2 × ${hours}`,
    note: "শ্রম আইনের 108 ধারায় মূল মজুরি, মহার্ঘভাতা এবং এডহক বা অন্তর্বর্তী মজুরির দ্বিগুণ হার নির্ধারিত। চূড়ান্ত অঙ্ক মালিকের পে-স্লিপ আর আইন অনুযায়ী হবে।",
    announcement: (pay: string) => `ওভারটাইম মজুরি ${pay}।`,
    placeholderTitleFirst: "ওভারটাইম মজুরি এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "মূল মজুরি, মাসের ঘণ্টা আর ওভারটাইম ঘণ্টা লিখে “ওভারটাইম হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে ওভারটাইম হিসাব",
    shareText: (pay: string, hours: string, rate: string, formula: string) =>
      `${hours} ঘণ্টার ওভারটাইম মজুরি: ${pay} (ঘণ্টায় ${rate}; ${formula})। HisabBD-র ওভারটাইম ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: OvertimeError): string {
  switch (error.field) {
    case "basic":
      return numberErrorMessage(error.code, { label: t.errBasic, min: t.errAmountMin, max: t.errMax(formatTaka(MAX_WAGE)) }, locale);
    case "allowance":
      return numberErrorMessage(error.code, { label: t.errAllowance, min: t.errAllowanceMin, max: t.errMax(formatTaka(MAX_WAGE)) }, locale);
    case "divisor":
      return numberErrorMessage(error.code, { label: t.errDivisor, min: t.errPositive, max: t.errDivisorMax }, locale);
    case "hours":
      return numberErrorMessage(error.code, { label: t.errHours, min: t.errPositive, max: t.errHoursMax }, locale);
  }
}

function formulaText(t: Strings, r: OvertimeResult): string {
  return t.formula(money(r.base), formatNumber(r.divisor), formatNumber(r.hours));
}

function shareText(t: Strings, r: OvertimeResult): string {
  return t.shareText(money(r.overtimePay), formatNumber(r.hours), money(r.overtimeRate), formulaText(t, r));
}

export function OvertimeCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [basic, setBasic] = useState("");
  const [allowance, setAllowance] = useState("");
  const [divisor, setDivisor] = useState("");
  const [hours, setHours] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    basic: useRef<HTMLInputElement>(null),
    allowance: useRef<HTMLInputElement>(null),
    divisor: useRef<HTMLInputElement>(null),
    hours: useRef<HTMLInputElement>(null),
  };

  const calc = submitted ? calculateOvertime(basic, allowance, divisor, hours) : null;
  const errorFor = (field: OvertimeField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateOvertime(basic, allowance, divisor, hours);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ basic, allowance, divisor, hours }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    setBasic(text("basic"));
    setAllowance(text("allowance"));
    setDivisor(text("divisor"));
    setHours(text("hours"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setBasic("");
    setAllowance("");
    setDivisor("");
    setHours("");
    setSubmitted(false);
    setRevealCount(0);
    refs.basic.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id={FIELD_IDS.basic} label={t.basic} error={errorFor("basic")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.basic}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.basicPlaceholder}
                value={basic}
                onChange={(event) => setBasic(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.allowance} label={t.allowance} hint={t.allowanceHint} error={errorFor("allowance")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.allowance}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.allowancePlaceholder}
                value={allowance}
                onChange={(event) => setAllowance(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.divisor} label={t.divisor} hint={t.divisorHint} error={errorFor("divisor")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.divisor}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix={t.divisorSuffix}
                placeholder={t.divisorPlaceholder}
                value={divisor}
                onChange={(event) => setDivisor(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.hours} label={t.hours} hint={t.hoursHint} error={errorFor("hours")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.hours}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix={t.hoursSuffix}
                placeholder={t.hoursPlaceholder}
                value={hours}
                onChange={(event) => setHours(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(money(result.overtimePay)) : ""}
        result={result && <OvertimeResultView result={result} />}
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

function OvertimeResultView({ result: r }: { result: OvertimeResult }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.base, value: money(r.base) },
    { label: t.ordinaryRate, value: money(r.ordinaryRate) },
    { label: t.overtimeRate, value: money(r.overtimeRate) },
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(formatNumber(r.hours))}
        titleId="overtime-result-heading"
        value={<p className="font-display text-4xl font-bold tracking-tight break-words sm:text-5xl">{money(r.overtimePay)}</p>}
      >
        <p className="text-sm text-slate-700">{formulaText(t, r)}</p>
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

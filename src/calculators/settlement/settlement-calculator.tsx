"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { AffixInput, FormField, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import {
  calculateSettlement,
  EXIT_TYPES,
  MAX_DIVISOR,
  MAX_WAGE,
  MAX_YEARS,
  NOTICE_DAYS,
  type ExitType,
  type SettlementError,
  type SettlementField,
  type SettlementInput,
  type SettlementResult,
} from "./logic";

const FIELD_IDS: Record<SettlementField, string> = {
  exit: "settlement-exit",
  basic: "settlement-basic",
  allowance: "settlement-allowance",
  years: "settlement-years",
  months: "settlement-months",
  days: "settlement-days",
  divisor: "settlement-divisor",
};

/** ৳ with paisa only when there is a fraction: ৳40,000 or ৳46,666.67. */
function money(value: number): string {
  const rounded = roundTo(value, 2);
  return Number.isInteger(rounded) ? formatTaka(rounded) : formatTaka(rounded, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate job exit benefit",
    exit: "How did the job end?",
    exitChoose: "Choose one",
    exitOptions: {
      resignation: "I resigned (section 27)",
      termination: "Employer ended my job, not for misconduct (section 26)",
      retrenchment: "Retrenchment: job no longer needed (section 20)",
      discharge: "Discharge: ill health or incapacity (section 22)",
    } satisfies Record<ExitType, string>,
    basic: "Last monthly basic wage",
    basicPlaceholder: "e.g. 20,000",
    allowance: "Dearness or ad hoc allowance (optional)",
    allowanceHint: "Leave blank if you have none. House rent, medical and other allowances are not counted (section 14(3)).",
    allowancePlaceholder: "e.g. 1,000",
    years: "Years of continuous service",
    yearsPlaceholder: "e.g. 4",
    yearsSuffix: "years",
    months: "Extra months (optional)",
    monthsPlaceholder: "0 to 11",
    monthsSuffix: "months",
    days: "Extra days (optional)",
    daysPlaceholder: "0 to 30",
    daysSuffix: "days",
    divisor: "Days in a month for a day’s wage",
    divisorHint: "The Act does not say. Use what your employer or payslip uses, often 30 or 26. We do not assume a number.",
    divisorPlaceholder: "e.g. 30",
    divisorSuffix: "days",
    gratuity: "My employer pays gratuity (section 2(10)), if payable",
    gratuityHint: "Tick only if your contract or service rules give gratuity. The higher of gratuity and compensation is used.",
    noticeResignation: `I served the full ${NOTICE_DAYS.resignation} days’ written notice (section 27)`,
    noticeTermination: `The employer gave the full ${NOTICE_DAYS.termination} days’ written notice (section 26)`,
    noticeRetrenchment: "The employer gave one month’s written notice (section 20)",
    errExit: "Choose how the job ended.",
    errBasic: "basic wage",
    errAllowance: "allowance",
    errYears: "years of service",
    errMonths: "months",
    errDays: "days",
    errDivisor: "days in a month",
    errAmountMin: "more than ৳0",
    errAllowanceMin: "৳0 or more",
    errMax: (max: string) => `${max} or less`,
    errZeroMin: "0 or more",
    errYearsMax: `${MAX_YEARS} or less`,
    errMonthsMax: "11 or less",
    errDaysMax: "30 or less",
    errPositive: "more than 0",
    errDivisorMax: `${MAX_DIVISOR} or less`,
    resultTitle: "Estimated job exit benefit",
    totalLabel: "Estimated total",
    owedTitle: "You may owe",
    sectionWord: "Section",
    wageLine: "Wage used (basic + dearness or ad hoc)",
    dayLine: (divisor: string) => `A day’s wage (÷ ${divisor})`,
    serviceLine: "Service counted",
    serviceValue: (y: string, m: string, d: string) => `${y} completed years (${m} months ${d} days extra)`,
    compLine: "Compensation",
    compFormula: (years: string, days: string, daily: string) => `${years} years × ${days} days × ${daily}`,
    gratuityLine: "Gratuity",
    gratuityFormula: (years: string, days: string, daily: string) => `${years} years × ${days} days × ${daily}`,
    benefitLine: "Benefit used",
    basisCompensation: "compensation",
    basisGratuity: "gratuity (higher)",
    basisNone: "none",
    noticePaid: "Notice wages the employer pays you",
    noticeOwed: "Notice wages you owe the employer (set off)",
    noticeMonth: "1 month’s wage",
    noticeDaysFormula: (days: string, daily: string) => `${days} days × ${daily}`,
    noYear: "With less than one completed year of service the Act gives no compensation for this exit.",
    estimateNote:
      "An estimate from the Bangladesh Labour Act 2006 (as shown on bdlaws on 2 November 2026) for permanent workers paid monthly. Not legal advice. Your appointment letter, service rules, any settlement and the courts decide the real amount. Government employees and workers under other laws are outside this Act.",
    announcement: (total: string) => `Estimated total ${total}.`,
    placeholderTitleFirst: "Your job exit benefit will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Choose how the job ended, enter your wage, service and days in a month, then select Calculate job exit benefit.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Job exit benefit calculated with HisabBD",
    shareText: (total: string, exit: string, years: string) =>
      `Estimated job exit benefit (${exit}, ${years} completed years): ${total} under the Labour Act. Calculated with HisabBD’s Job Exit Benefit Calculator.`,
    exitShort: {
      resignation: "resignation",
      termination: "termination by employer",
      retrenchment: "retrenchment",
      discharge: "discharge",
    } satisfies Record<ExitType, string>,
  },
  bn: {
    submit: "চাকরি অবসানের সুবিধা হিসাব করুন",
    exit: "চাকরি কীভাবে শেষ হলো?",
    exitChoose: "একটি বেছে নিন",
    exitOptions: {
      resignation: "আমি ইস্তফা দিয়েছি (ধারা ২৭)",
      termination: "মালিক অসদাচরণ ছাড়া চাকরি শেষ করেছেন (ধারা ২৬)",
      retrenchment: "ছাঁটাই: প্রয়োজন অতিরিক্ততা (ধারা ২০)",
      discharge: "ডিসচার্জ: অসুস্থতা বা অক্ষমতা (ধারা ২২)",
    } satisfies Record<ExitType, string>,
    basic: "সর্বশেষ মাসিক মূল মজুরি",
    basicPlaceholder: "যেমন 20,000",
    allowance: "মহার্ঘভাতা বা এডহক ভাতা (ঐচ্ছিক)",
    allowanceHint: "না থাকলে ফাঁকা রাখুন। বাড়িভাড়া, চিকিৎসা ও অন্য ভাতা ধরা হয় না (ধারা ১৪(৩))।",
    allowancePlaceholder: "যেমন 1,000",
    years: "অবিচ্ছিন্ন চাকরির বছর",
    yearsPlaceholder: "যেমন 4",
    yearsSuffix: "বছর",
    months: "অতিরিক্ত মাস (ঐচ্ছিক)",
    monthsPlaceholder: "0 থেকে 11",
    monthsSuffix: "মাস",
    days: "অতিরিক্ত দিন (ঐচ্ছিক)",
    daysPlaceholder: "0 থেকে 30",
    daysSuffix: "দিন",
    divisor: "দৈনিক মজুরির জন্য মাসের দিন",
    divisorHint: "আইনে বলা নেই। মালিক বা পে-স্লিপে যা ধরা হয় তা লিখুন, প্রায়ই 30 বা 26। আমরা কোনো সংখ্যা ধরে নিই না।",
    divisorPlaceholder: "যেমন 30",
    divisorSuffix: "দিন",
    gratuity: "আমার মালিক গ্র্যাচুইটি দেন (ধারা ২(১০)), প্রদেয় হলে",
    gratuityHint: "শুধু তখনই টিক দিন যখন চাকরির চুক্তি বা বিধিতে গ্র্যাচুইটি আছে। গ্র্যাচুইটি ও ক্ষতিপূরণের মধ্যে বেশিটি ধরা হয়।",
    noticeResignation: `আমি পূর্ণ ${NOTICE_DAYS.resignation} দিনের লিখিত নোটিশ দিয়েছি (ধারা ২৭)`,
    noticeTermination: `মালিক পূর্ণ ${NOTICE_DAYS.termination} দিনের লিখিত নোটিশ দিয়েছেন (ধারা ২৬)`,
    noticeRetrenchment: "মালিক এক মাসের লিখিত নোটিশ দিয়েছেন (ধারা ২০)",
    errExit: "চাকরি কীভাবে শেষ হলো তা বেছে নিন।",
    errBasic: "মূল মজুরি",
    errAllowance: "ভাতা",
    errYears: "চাকরির বছর",
    errMonths: "মাস",
    errDays: "দিন",
    errDivisor: "মাসের দিন",
    errAmountMin: "৳0-এর বেশি",
    errAllowanceMin: "৳0 বা তার বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errZeroMin: "0 বা তার বেশি",
    errYearsMax: `${MAX_YEARS} বা তার কম`,
    errMonthsMax: "11 বা তার কম",
    errDaysMax: "30 বা তার কম",
    errPositive: "0-এর বেশি",
    errDivisorMax: `${MAX_DIVISOR} বা তার কম`,
    resultTitle: "আনুমানিক চাকরি অবসানের সুবিধা",
    totalLabel: "আনুমানিক মোট",
    owedTitle: "আপনাকে দিতে হতে পারে",
    sectionWord: "ধারা",
    wageLine: "ধরা মজুরি (মূল + মহার্ঘ বা এডহক)",
    dayLine: (divisor: string) => `দৈনিক মজুরি (÷ ${divisor})`,
    serviceLine: "ধরা চাকরিকাল",
    serviceValue: (y: string, m: string, d: string) => `${y} সম্পূর্ণ বছর (অতিরিক্ত ${m} মাস ${d} দিন)`,
    compLine: "ক্ষতিপূরণ",
    compFormula: (years: string, days: string, daily: string) => `${years} বছর × ${days} দিন × ${daily}`,
    gratuityLine: "গ্র্যাচুইটি",
    gratuityFormula: (years: string, days: string, daily: string) => `${years} বছর × ${days} দিন × ${daily}`,
    benefitLine: "ধরা সুবিধা",
    basisCompensation: "ক্ষতিপূরণ",
    basisGratuity: "গ্র্যাচুইটি (বেশি)",
    basisNone: "নেই",
    noticePaid: "নোটিশের বদলে মালিকের দেওয়া মজুরি",
    noticeOwed: "নোটিশের বদলে আপনার দেওয়া মজুরি (সমন্বয়)",
    noticeMonth: "1 মাসের মজুরি",
    noticeDaysFormula: (days: string, daily: string) => `${days} দিন × ${daily}`,
    noYear: "এক বছর সম্পূর্ণ চাকরি না হলে এই ক্ষেত্রে আইনে ক্ষতিপূরণ নেই।",
    estimateNote:
      "মাসিক মজুরির স্থায়ী শ্রমিকের জন্য বাংলাদেশ শ্রম আইন ২০০৬ (২ নভেম্বর ২০২৬ তারিখে বিডিলজ-এ প্রদর্শিত পাঠ) থেকে আনুমানিক হিসাব। আইনি পরামর্শ নয়। প্রকৃত অঙ্ক ঠিক হবে নিয়োগপত্র, চাকরি বিধি, কোনো মীমাংসা আর আদালতের মাধ্যমে। সরকারি কর্মচারী ও অন্য আইনের অধীন শ্রমিকরা এই আইনের বাইরে।",
    announcement: (total: string) => `আনুমানিক মোট ${total}।`,
    placeholderTitleFirst: "চাকরি অবসানের সুবিধা এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "চাকরি কীভাবে শেষ হলো বেছে মজুরি, চাকরিকাল ও মাসের দিন লিখে “চাকরি অবসানের সুবিধা হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে চাকরি অবসানের সুবিধার হিসাব",
    shareText: (total: string, exit: string, years: string) =>
      `আনুমানিক চাকরি অবসানের সুবিধা (${exit}, ${years} সম্পূর্ণ বছর): শ্রম আইনে ${total}। HisabBD-র চাকরি অবসানের সুবিধা ক্যালকুলেটরে হিসাব করা।`,
    exitShort: {
      resignation: "ইস্তফা",
      termination: "মালিক কর্তৃক অবসান",
      retrenchment: "ছাঁটাই",
      discharge: "ডিসচার্জ",
    } satisfies Record<ExitType, string>,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: SettlementError): string {
  const wageMax = t.errMax(formatTaka(MAX_WAGE));
  switch (error.field) {
    case "exit":
      return t.errExit;
    case "basic":
      return numberErrorMessage(error.code, { label: t.errBasic, min: t.errAmountMin, max: wageMax }, locale);
    case "allowance":
      return numberErrorMessage(error.code, { label: t.errAllowance, min: t.errAllowanceMin, max: wageMax }, locale);
    case "years":
      return numberErrorMessage(error.code, { label: t.errYears, min: t.errZeroMin, max: t.errYearsMax }, locale);
    case "months":
      return numberErrorMessage(error.code, { label: t.errMonths, min: t.errZeroMin, max: t.errMonthsMax }, locale);
    case "days":
      return numberErrorMessage(error.code, { label: t.errDays, min: t.errZeroMin, max: t.errDaysMax }, locale);
    case "divisor":
      return numberErrorMessage(error.code, { label: t.errDivisor, min: t.errPositive, max: t.errDivisorMax }, locale);
  }
}

function shareText(t: Strings, r: SettlementResult): string {
  return t.shareText(money(r.total), t.exitShort[r.exit], formatNumber(r.completedYears));
}

const COMPENSATION_SECTION: Record<ExitType, string> = {
  resignation: "27(4)",
  termination: "26(4)",
  retrenchment: "20(2)",
  discharge: "22(2)",
};

const flag = (on: boolean) => (on ? "1" : "0");

export function SettlementCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [exit, setExit] = useState("");
  const [basic, setBasic] = useState("");
  const [allowance, setAllowance] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [days, setDays] = useState("");
  const [divisor, setDivisor] = useState("");
  const [gratuity, setGratuity] = useState(false);
  const [notice, setNotice] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    exit: useRef<HTMLSelectElement>(null),
    basic: useRef<HTMLInputElement>(null),
    allowance: useRef<HTMLInputElement>(null),
    years: useRef<HTMLInputElement>(null),
    months: useRef<HTMLInputElement>(null),
    days: useRef<HTMLInputElement>(null),
    divisor: useRef<HTMLInputElement>(null),
  };

  const input = (): SettlementInput => ({ exit, basic, allowance, years, months, days, divisor, gratuity, notice });
  const calc = submitted ? calculateSettlement(input()) : null;
  const errorFor = (field: SettlementField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateSettlement(input());
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record(
        { exit, basic, allowance, years, months, days, divisor, gratuity: flag(gratuity), notice: flag(notice) },
        shareText(t, check.result),
      );
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    setExit(text("exit"));
    setBasic(text("basic"));
    setAllowance(text("allowance"));
    setYears(text("years"));
    setMonths(text("months"));
    setDays(text("days"));
    setDivisor(text("divisor"));
    setGratuity(text("gratuity") === "1");
    setNotice(text("notice") !== "0");
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setExit("");
    setBasic("");
    setAllowance("");
    setYears("");
    setMonths("");
    setDays("");
    setDivisor("");
    setGratuity(false);
    setNotice(true);
    setSubmitted(false);
    setRevealCount(0);
    refs.exit.current?.focus();
  }

  const noticeLabel =
    exit === "resignation"
      ? t.noticeResignation
      : exit === "termination"
        ? t.noticeTermination
        : exit === "retrenchment"
          ? t.noticeRetrenchment
          : null;

  const number = (
    field: Exclude<SettlementField, "exit">,
    label: string,
    value: string,
    setValue: (value: string) => void,
    extra: { placeholder: string; prefix?: string; suffix?: string; hint?: string },
  ) => (
    <FormField id={FIELD_IDS[field]} label={label} hint={extra.hint} error={errorFor(field)}>
      {(control) => (
        <AffixInput
          {...control}
          ref={refs[field]}
          type="text"
          inputMode={field === "basic" || field === "allowance" || field === "divisor" ? "decimal" : "numeric"}
          autoComplete="off"
          prefix={extra.prefix}
          suffix={extra.suffix}
          placeholder={extra.placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )}
    </FormField>
  );

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField id={FIELD_IDS.exit} label={t.exit} error={errorFor("exit")}>
              {(control) => (
                <Select {...control} ref={refs.exit} value={exit} onChange={(event) => setExit(event.target.value)}>
                  <option value="">{t.exitChoose}</option>
                  {EXIT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t.exitOptions[type]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>
          {number("basic", t.basic, basic, setBasic, { placeholder: t.basicPlaceholder, prefix: "৳" })}
          {number("allowance", t.allowance, allowance, setAllowance, {
            placeholder: t.allowancePlaceholder,
            prefix: "৳",
            hint: t.allowanceHint,
          })}
          {number("years", t.years, years, setYears, { placeholder: t.yearsPlaceholder, suffix: t.yearsSuffix })}
          {number("months", t.months, months, setMonths, { placeholder: t.monthsPlaceholder, suffix: t.monthsSuffix })}
          {number("days", t.days, days, setDays, { placeholder: t.daysPlaceholder, suffix: t.daysSuffix })}
          {number("divisor", t.divisor, divisor, setDivisor, {
            placeholder: t.divisorPlaceholder,
            suffix: t.divisorSuffix,
            hint: t.divisorHint,
          })}
        </div>

        <div className="mt-4 space-y-1">
          <div>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-base font-medium text-slate-800">
              <input
                type="checkbox"
                checked={gratuity}
                onChange={(event) => setGratuity(event.target.checked)}
                className="size-5 accent-brand-600"
              />
              {t.gratuity}
            </label>
            <p className="text-sm text-slate-600">{t.gratuityHint}</p>
          </div>
          {noticeLabel && (
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-base font-medium text-slate-800">
              <input
                type="checkbox"
                checked={notice}
                onChange={(event) => setNotice(event.target.checked)}
                className="size-5 accent-brand-600"
              />
              {noticeLabel}
            </label>
          )}
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(money(result.total)) : ""}
        result={result && <SettlementResultView result={result} />}
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

function Line({ label, section, detail, amount }: { label: string; section?: string | null; detail?: string; amount?: string }) {
  const t = STRINGS[useLocale()];
  return (
    <div className="border-t border-brand-200 pt-3 first:border-t-0 first:pt-0">
      <dt className="text-sm text-slate-600">
        {label}
        {section ? ` · ${t.sectionWord} ${section}` : ""}
      </dt>
      <dd className="font-semibold break-words text-slate-900">{amount}</dd>
      {detail && <dd className="text-sm text-slate-700">{detail}</dd>}
    </div>
  );
}

function SettlementResultView({ result: r }: { result: SettlementResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const text = shareText(t, r);
  const daily = money(r.dailyWage);
  const basisLabel = r.basis === "gratuity" ? t.basisGratuity : r.basis === "compensation" ? t.basisCompensation : t.basisNone;
  const owed = r.total < 0;

  return (
    <div className="space-y-4">
      <ResultPanel
        title={owed ? t.owedTitle : t.resultTitle}
        titleId="settlement-result-heading"
        value={
          <p className="font-display text-4xl font-bold tracking-tight break-words sm:text-5xl">
            {money(owed ? -r.total : r.total)}
          </p>
        }
      >
        <p className="text-sm text-slate-700">{t.totalLabel}</p>
        <dl className="mt-4 space-y-3">
          <Line label={t.wageLine} section="14(3)" amount={money(r.wage)} />
          <Line label={t.dayLine(formatNumber(r.divisor))} amount={daily} />
          <Line
            label={t.serviceLine}
            amount={t.serviceValue(formatNumber(r.completedYears), formatNumber(r.service.months), formatNumber(r.service.days))}
          />
          <Line
            label={t.compLine}
            section={COMPENSATION_SECTION[r.exit]}
            amount={money(r.compensation)}
            detail={r.eligible ? t.compFormula(formatNumber(r.completedYears), formatNumber(r.compensationDaysPerYear), daily) : t.noYear}
          />
          {r.gratuity && (
            <Line
              label={t.gratuityLine}
              section="2(10)"
              amount={money(r.gratuity.amount)}
              detail={t.gratuityFormula(formatNumber(r.gratuity.yearsCounted), formatNumber(r.gratuity.daysPerYear), daily)}
            />
          )}
          <Line label={t.benefitLine} section={r.benefitSection} amount={money(r.benefit)} detail={basisLabel} />
          {r.noticeKind !== "none" && (
            <Line
              label={r.noticeKind === "paid-to-worker" ? t.noticePaid : t.noticeOwed}
              section={r.noticeSection}
              amount={money(r.noticeAmount)}
              detail={r.noticeDays === null ? t.noticeMonth : t.noticeDaysFormula(formatNumber(r.noticeDays), daily)}
            />
          )}
        </dl>
        <p className="mt-4 text-sm text-slate-600">{t.estimateNote}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

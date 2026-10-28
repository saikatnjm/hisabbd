"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatNumber, formatPercent, formatPlainDate, formatTaka, pluralize } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  DEPOSIT_TAX_CHECKED_ON,
  EXCISE_MODES,
  EXCISE_TABLE,
  SOURCE_TAX_PRESETS,
  SOURCE_TAX_SOURCES,
  TAX_PRESET_IDS,
  type DepositSource,
  type ExciseMode,
  type TaxPresetId,
} from "./deposit-tax";
import {
  calculateFdr,
  COMPOUNDING_OPTIONS,
  MAX_EXCISE,
  MAX_PRINCIPAL,
  MAX_TERM_MONTHS,
  type Compounding,
  type FdrError,
  type FdrField,
  type FdrInputs,
  type FdrResult,
} from "./logic";

const SLUG = "fdr-calculator";
const TERM_PRESETS = ["3", "6", "12", "24", "36", "custom"] as const;
type TermPreset = (typeof TERM_PRESETS)[number];

/** Remembered in this browser: settings only, never the amounts typed. */
const TERM_PREF = choicePreference(SLUG, "term", TERM_PRESETS, "12");
const COMPOUNDING_PREF = choicePreference(SLUG, "compounding", COMPOUNDING_OPTIONS, "simple");
const TAX_PREF = choicePreference(SLUG, "tax", TAX_PRESET_IDS, "standard");
const EXCISE_PREF = choicePreference(SLUG, "excise", EXCISE_MODES, "bands");

const FIELD_IDS: Record<FdrField, string> = {
  principal: "fdr-principal",
  rate: "fdr-rate",
  term: "fdr-term-months",
  tax: "fdr-tax-custom",
  excise: "fdr-excise-amount",
};
const COMPOUNDING_ID = "fdr-compounding";
const TAX_PRESET_ID = "fdr-tax-preset";

const link = "font-semibold text-brand-700 underline underline-offset-4";

const STRINGS = {
  en: {
    submit: "Calculate FDR",
    principal: "Deposit amount",
    principalPlaceholder: "e.g. 1,00,000",
    rate: "Interest rate (per year)",
    rateHint: "Use the rate your bank quotes for this amount and term.",
    ratePlaceholder: "e.g. 9",
    termLegend: "Term",
    termOptions: { "3": "3 months", "6": "6 months", "12": "1 year", "24": "2 years", "36": "3 years", custom: "Other" },
    termMonths: "Term in months",
    monthsUnit: "months",
    termMonthsHint: `A whole number from 1 to ${MAX_TERM_MONTHS}.`,
    termMonthsPlaceholder: "e.g. 18",
    compounding: "Interest is",
    compoundingOptions: {
      simple: "Simple: paid out, or paid at maturity",
      monthly: "Reinvested every month",
      quarterly: "Reinvested every 3 months",
      yearly: "Reinvested every year",
    },
    compoundingHint: "Check your FDR receipt or ask the bank. If unsure, start with Simple.",
    taxPreset: "Tax at source",
    taxOptions: {
      standard: "10%: individual (standard)",
      noReturnProof: "15%: no proof of return (PSR) where required",
      custom: "Other rate",
    },
    taxHints: {
      standard: "Most individual depositors pay 10% of the interest.",
      noReturnProof: "50% more (15%) if you must file a tax return but give the bank no proof of submission.",
      custom: "Companies and trusts pay 20%. Enter any rate from 0 to 100.",
    },
    customTax: "Tax rate",
    customTaxPlaceholder: "e.g. 20",
    exciseLegend: "Excise duty",
    exciseOptions: { bands: "Estimate", custom: "Enter amount", none: "Leave out" },
    exciseHints: {
      bands:
        "Estimated once for each year of the term from the balance, using the FY2026-27 bands as reported: nil up to ৳4 lakh, ৳150 up to ৳5 lakh, ৳500 up to ৳10 lakh, ৳3,000 up to ৳50 lakh, more above.",
      custom: "Enter the total excise duty for the whole term, if you know it.",
      none: "Excise duty is left out of the result.",
    },
    exciseAmount: "Total excise duty",
    excisePlaceholder: "e.g. 500",
    sourcesLead: (date: string) => `Tax and excise figures checked on ${date}. Sources:`,
    sourcesTail: "They can change with each budget; your bank’s deduction is final.",
    announcement: (net: string, interest: string) => `You receive ${net}. Interest before tax ${interest}.`,
    placeholderTitleFirst: "Your FDR maturity will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the deposit amount and your bank’s rate, choose the term, then select Calculate FDR.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitle: "You receive at maturity",
    resultNote: "after tax and excise, rounded to the nearest Taka",
    maturityValue: "Maturity value before tax",
    grossInterest: "Interest before tax",
    tax: (rate: string) => `Tax at source (${rate})`,
    exciseEstimated: "Excise duty (estimate)",
    exciseEntered: "Excise duty (entered)",
    exciseNone: "Excise duty (left out)",
    netInterest: "Interest after tax and excise",
    effectiveRate: "Effective yearly rate before tax",
    termStat: "Term",
    seeBreakdown: "See year-by-year breakdown",
    tableCaption: "Interest earned, balance at the end of each year and estimated excise duty",
    year: "Year",
    interestCol: "Interest",
    balanceCol: "Balance at year end",
    exciseCol: "Excise",
    monthsInYear: (n: number) => pluralize(n, "month"),
    roundingNote: "Whole Taka, before tax. Rounded figures may differ from totals by ৳1.",
    methodNote: (compounding: string) =>
      `${compounding}. Your bank’s figures may differ slightly because of day count, rounding, when tax is deducted, or fees.`,
    methodNames: {
      simple: "Simple interest",
      monthly: "Interest reinvested every month",
      quarterly: "Interest reinvested every 3 months",
      yearly: "Interest reinvested every year",
    },
    termMonthsText: (n: number) => pluralize(n, "month"),
    termYearsText: (n: number) => pluralize(n, "year"),
    errPrincipalLabel: "deposit amount",
    errAmountMin: "more than ৳0",
    errMax: (max: string) => `${max} or less`,
    errRateLabel: "interest rate",
    errPercentMin: "0% or more",
    errPercentMax: "100% or less",
    errTermLabel: "term",
    errTermMin: "at least 1 month",
    errTermMax: `${MAX_TERM_MONTHS} months or less`,
    errTaxLabel: "tax rate",
    errExciseLabel: "excise duty",
    errExciseMin: "৳0 or more",
    shareText: (principal: string, rate: string, term: string, gross: string, net: string) =>
      `FDR of ${principal} at ${rate} for ${term}: interest ${gross} before tax, about ${net} received after tax and excise. Calculated with HisabBD’s FDR Calculator.`,
    shareTitle: "FDR calculated with HisabBD",
  },
  bn: {
    submit: "এফডিআর হিসাব করুন",
    principal: "জমার পরিমাণ",
    principalPlaceholder: "যেমন 1,00,000",
    rate: "বার্ষিক সুদের হার",
    rateHint: "এই অঙ্ক ও মেয়াদের জন্য আপনার ব্যাংক যে হার বলছে, সেটি দিন।",
    ratePlaceholder: "যেমন 9",
    termLegend: "মেয়াদ",
    termOptions: { "3": "3 মাস", "6": "6 মাস", "12": "1 বছর", "24": "2 বছর", "36": "3 বছর", custom: "অন্য" },
    termMonths: "মেয়াদ (মাস)",
    monthsUnit: "মাস",
    termMonthsHint: `1 থেকে ${MAX_TERM_MONTHS}-এর মধ্যে পূর্ণ সংখ্যা।`,
    termMonthsPlaceholder: "যেমন 18",
    compounding: "সুদ যেভাবে দেওয়া হয়",
    compoundingOptions: {
      simple: "সরল: তুলে নেওয়া হয় বা মেয়াদ শেষে একসাথে",
      monthly: "প্রতি মাসে জমায় যোগ হয়",
      quarterly: "প্রতি 3 মাসে জমায় যোগ হয়",
      yearly: "প্রতি বছরে জমায় যোগ হয়",
    },
    compoundingHint: "এফডিআর রসিদ দেখুন বা ব্যাংকে জিজ্ঞেস করুন। নিশ্চিত না হলে “সরল” দিয়ে শুরু করুন।",
    taxPreset: "উৎসে কর",
    taxOptions: {
      standard: "10%: ব্যক্তি (সাধারণ)",
      noReturnProof: "15%: প্রয়োজন থাকলেও রিটার্নের প্রমাণ (PSR) নেই",
      custom: "অন্য হার",
    },
    taxHints: {
      standard: "বেশিরভাগ ব্যক্তি আমানতকারীর সুদ থেকে 10% কাটে।",
      noReturnProof: "রিটার্ন দাখিল বাধ্যতামূলক হলেও ব্যাংকে জমার প্রমাণ না দিলে 50% বেশি (15%)।",
      custom: "কোম্পানি ও ট্রাস্টের হার 20%। 0 থেকে 100-এর মধ্যে যেকোনো হার লিখুন।",
    },
    customTax: "করের হার",
    customTaxPlaceholder: "যেমন 20",
    exciseLegend: "আবগারি শুল্ক",
    exciseOptions: { bands: "অনুমান করুন", custom: "অঙ্ক লিখুন", none: "বাদ দিন" },
    exciseHints: {
      bands:
        "মেয়াদের প্রতি বছরের জন্য একবার, ব্যালান্স থেকে 2026-27 অর্থবছরের প্রকাশিত স্ল্যাবে অনুমান: ৳4 লাখ পর্যন্ত শূন্য, ৳5 লাখ পর্যন্ত ৳150, ৳10 লাখ পর্যন্ত ৳500, ৳50 লাখ পর্যন্ত ৳3,000, এর বেশি হলে আরও বেশি।",
      custom: "জানা থাকলে পুরো মেয়াদের মোট আবগারি শুল্ক লিখুন।",
      none: "ফলাফলে আবগারি শুল্ক ধরা হবে না।",
    },
    exciseAmount: "মোট আবগারি শুল্ক",
    excisePlaceholder: "যেমন 500",
    sourcesLead: (date: string) => `কর ও আবগারির অঙ্কগুলো ${date}-এ যাচাই করা। সূত্র:`,
    sourcesTail: "প্রতি বাজেটে এগুলো বদলাতে পারে; ব্যাংক যা কাটে সেটিই চূড়ান্ত।",
    announcement: (net: string, interest: string) => `হাতে পাবেন ${net}। কর বাদের আগে সুদ ${interest}।`,
    placeholderTitleFirst: "এফডিআরের মেয়াদ শেষের হিসাব এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "জমার পরিমাণ ও ব্যাংকের হার লিখে মেয়াদ বেছে নিন, তারপর “এফডিআর হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitle: "মেয়াদ শেষে হাতে পাবেন",
    resultNote: "কর ও আবগারি বাদে, নিকটতম টাকায় রাউন্ড করা",
    maturityValue: "কর বাদের আগে মেয়াদ শেষের অঙ্ক",
    grossInterest: "কর বাদের আগে সুদ",
    tax: (rate: string) => `উৎসে কর (${rate})`,
    exciseEstimated: "আবগারি শুল্ক (অনুমান)",
    exciseEntered: "আবগারি শুল্ক (আপনার দেওয়া)",
    exciseNone: "আবগারি শুল্ক (বাদ)",
    netInterest: "কর ও আবগারি বাদে সুদ",
    effectiveRate: "কর বাদের আগে কার্যকর বার্ষিক হার",
    termStat: "মেয়াদ",
    seeBreakdown: "বছরভিত্তিক হিসাব দেখুন",
    tableCaption: "প্রতি বছরের সুদ, বছর শেষের ব্যালান্স ও আনুমানিক আবগারি শুল্ক",
    year: "বছর",
    interestCol: "সুদ",
    balanceCol: "বছর শেষের ব্যালান্স",
    exciseCol: "আবগারি",
    monthsInYear: (n: number) => countBn(n, "মাস"),
    roundingNote: "পুরো টাকায়, কর বাদের আগে। রাউন্ড করার কারণে যোগফল ৳1 এদিক-ওদিক হতে পারে।",
    methodNote: (compounding: string) =>
      `${compounding}। দিন গণনা, রাউন্ডিং, কখন কর কাটা হয় বা ফির কারণে আপনার ব্যাংকের অঙ্ক সামান্য আলাদা হতে পারে।`,
    methodNames: {
      simple: "সরল সুদ",
      monthly: "প্রতি মাসে সুদ জমায় যোগ",
      quarterly: "প্রতি 3 মাসে সুদ জমায় যোগ",
      yearly: "প্রতি বছরে সুদ জমায় যোগ",
    },
    termMonthsText: (n: number) => countBn(n, "মাস"),
    termYearsText: (n: number) => countBn(n, "বছর"),
    errPrincipalLabel: "জমার পরিমাণ",
    errAmountMin: "৳0-র বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errRateLabel: "সুদের হার",
    errPercentMin: "0% বা তার বেশি",
    errPercentMax: "100% বা তার কম",
    errTermLabel: "মেয়াদ",
    errTermMin: "কমপক্ষে 1 মাস",
    errTermMax: `${MAX_TERM_MONTHS} মাস বা তার কম`,
    errTaxLabel: "করের হার",
    errExciseLabel: "আবগারি শুল্ক",
    errExciseMin: "৳0 বা তার বেশি",
    shareText: (principal: string, rate: string, term: string, gross: string, net: string) =>
      `${principal} এফডিআর, ${rate} হারে, ${term}: কর বাদের আগে সুদ ${gross}, কর ও আবগারি বাদে হাতে প্রায় ${net}। HisabBD-র এফডিআর ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD দিয়ে এফডিআর হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function rateText(value: number): string {
  return formatPercent(value, { decimals: 4 });
}

function termText(t: Strings, months: number): string {
  return months % 12 === 0 ? t.termYearsText(months / 12) : t.termMonthsText(months);
}

/** "The Daily Star (7 Jun 2026)": the publisher part of a source title plus its date. */
function sourceLabel(source: DepositSource, locale: Locale): string {
  const date = parsePlainDate(source.published);
  const publisher = source.title.split(":")[0] ?? source.title;
  return date ? `${publisher} (${formatPlainDate(date, { locale })})` : publisher;
}

function errorMessage(t: Strings, locale: Locale, error: FdrError): string {
  const percent = { min: t.errPercentMin, max: t.errPercentMax };
  switch (error.field) {
    case "principal":
      return numberErrorMessage(
        error.code,
        { label: t.errPrincipalLabel, min: t.errAmountMin, max: t.errMax(formatTaka(MAX_PRINCIPAL)) },
        locale,
      );
    case "rate":
      return numberErrorMessage(error.code, { label: t.errRateLabel, ...percent }, locale);
    case "term":
      return numberErrorMessage(error.code, { label: t.errTermLabel, min: t.errTermMin, max: t.errTermMax }, locale);
    case "tax":
      return numberErrorMessage(error.code, { label: t.errTaxLabel, ...percent }, locale);
    case "excise":
      return numberErrorMessage(
        error.code,
        { label: t.errExciseLabel, min: t.errExciseMin, max: t.errMax(formatTaka(MAX_EXCISE)) },
        locale,
      );
  }
}

function shareText(t: Strings, r: FdrResult): string {
  return t.shareText(
    formatTaka(r.principal),
    rateText(r.ratePercent),
    termText(t, r.months),
    formatTaka(r.grossInterest),
    formatTaka(r.netAmount),
  );
}

export function FdrCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [termPreset, setTermPreset] = usePreference(TERM_PREF);
  const [customTerm, setCustomTerm] = useState("");
  const [compounding, setCompounding] = usePreference(COMPOUNDING_PREF);
  const [taxPreset, setTaxPreset] = usePreference(TAX_PREF);
  const [customTax, setCustomTax] = useState("");
  const [exciseMode, setExciseMode] = usePreference(EXCISE_PREF);
  const [exciseAmount, setExciseAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs: Record<FdrField, React.RefObject<HTMLInputElement | null>> = {
    principal: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
    term: useRef<HTMLInputElement>(null),
    tax: useRef<HTMLInputElement>(null),
    excise: useRef<HTMLInputElement>(null),
  };

  const inputs: FdrInputs = {
    principal,
    rate,
    termMonths: termPreset === "custom" ? customTerm : termPreset,
    compounding,
    taxRate: taxPreset === "custom" ? customTax : String(SOURCE_TAX_PRESETS[taxPreset].value),
    exciseMode,
    exciseAmount,
  };
  const calc = submitted ? calculateFdr(inputs) : null;
  const errorFor = (field: FdrField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;
  const checkedOn = parsePlainDate(DEPOSIT_TAX_CHECKED_ON);
  const sources = [...SOURCE_TAX_SOURCES, ...EXCISE_TABLE.sources];

  const termOptions = TERM_PRESETS.map((value) => ({ value, label: t.termOptions[value] }));
  const exciseOptions = EXCISE_MODES.map((value) => ({ value, label: t.exciseOptions[value] }));

  function onTaxPresetChange(value: string) {
    const next = TAX_PRESET_IDS.find((id) => id === value) ?? "standard";
    // Switching to "Other rate" starts from the rate that was showing, if the box is empty.
    if (next === "custom" && taxPreset !== "custom" && !customTax.trim()) {
      setCustomTax(String(SOURCE_TAX_PRESETS[taxPreset].value));
    }
    setTaxPreset(next);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateFdr(inputs);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      // Only the boxes that are shown (and used) are saved.
      record(
        {
          principal,
          rate,
          term: termPreset,
          compounding,
          tax: taxPreset,
          excise: exciseMode,
          ...(termPreset === "custom" ? { customTerm } : {}),
          ...(taxPreset === "custom" ? { customTax } : {}),
          ...(exciseMode === "custom" ? { exciseAmount } : {}),
        },
        shareText(t, check.result),
      );
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedTerm = text("term");
    const savedCompounding = text("compounding");
    const savedTax = text("tax");
    const savedExcise = text("excise");
    setPrincipal(text("principal"));
    setRate(text("rate"));
    if (TERM_PREF.isValid(savedTerm)) setTermPreset(savedTerm);
    if (COMPOUNDING_PREF.isValid(savedCompounding)) setCompounding(savedCompounding);
    if (TAX_PREF.isValid(savedTax)) setTaxPreset(savedTax);
    if (EXCISE_PREF.isValid(savedExcise)) setExciseMode(savedExcise);
    setCustomTerm(text("customTerm"));
    setCustomTax(text("customTax"));
    setExciseAmount(text("exciseAmount"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered term, compounding, tax and excise choices stay. */
  function onReset() {
    setPrincipal("");
    setRate("");
    setCustomTerm("");
    setCustomTax("");
    setExciseAmount("");
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
          <FormField id={FIELD_IDS.rate} label={t.rate} hint={t.rateHint} error={errorFor("rate")}>
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

          <div className="space-y-4 sm:col-span-2">
            <SegmentedControl
              name="fdr-term"
              legend={t.termLegend}
              options={termOptions}
              value={termPreset}
              onChange={(value: TermPreset) => setTermPreset(value)}
            />
            {termPreset === "custom" && (
              <div className="sm:max-w-[calc(50%-0.75rem)]">
                <FormField id={FIELD_IDS.term} label={t.termMonths} hint={t.termMonthsHint} error={errorFor("term")}>
                  {(control) => (
                    <AffixInput
                      {...control}
                      ref={refs.term}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      suffix={t.monthsUnit}
                      placeholder={t.termMonthsPlaceholder}
                      value={customTerm}
                      onChange={(event) => setCustomTerm(event.target.value)}
                    />
                  )}
                </FormField>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <FormField id={COMPOUNDING_ID} label={t.compounding} hint={t.compoundingHint}>
              {(control) => (
                <Select
                  {...control}
                  value={compounding}
                  onChange={(event) => {
                    const next = COMPOUNDING_OPTIONS.find((c) => c === event.target.value);
                    if (next) setCompounding(next);
                  }}
                >
                  {COMPOUNDING_OPTIONS.map((value: Compounding) => (
                    <option key={value} value={value}>
                      {t.compoundingOptions[value]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>

          <FormField id={TAX_PRESET_ID} label={t.taxPreset} hint={t.taxHints[taxPreset]}>
            {(control) => (
              <Select {...control} value={taxPreset} onChange={(event) => onTaxPresetChange(event.target.value)}>
                {TAX_PRESET_IDS.map((id: TaxPresetId) => (
                  <option key={id} value={id}>
                    {t.taxOptions[id]}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          {taxPreset === "custom" && (
            <FormField id={FIELD_IDS.tax} label={t.customTax} error={errorFor("tax")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.tax}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix="%"
                  placeholder={t.customTaxPlaceholder}
                  value={customTax}
                  onChange={(event) => setCustomTax(event.target.value)}
                />
              )}
            </FormField>
          )}

          <div className="space-y-4 sm:col-span-2">
            <SegmentedControl
              name="fdr-excise"
              legend={t.exciseLegend}
              options={exciseOptions}
              value={exciseMode}
              onChange={(value: ExciseMode) => setExciseMode(value)}
            />
            <p className="text-sm text-slate-600">{t.exciseHints[exciseMode]}</p>
            {exciseMode === "custom" && (
              <div className="sm:max-w-[calc(50%-0.75rem)]">
                <FormField id={FIELD_IDS.excise} label={t.exciseAmount} error={errorFor("excise")}>
                  {(control) => (
                    <AffixInput
                      {...control}
                      ref={refs.excise}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      prefix="৳"
                      placeholder={t.excisePlaceholder}
                      value={exciseAmount}
                      onChange={(event) => setExciseAmount(event.target.value)}
                    />
                  )}
                </FormField>
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-600">
          {t.sourcesLead(checkedOn ? formatPlainDate(checkedOn, { locale }) : DEPOSIT_TAX_CHECKED_ON)}{" "}
          {sources.map((source, index) => (
            <span key={source.url}>
              {index > 0 && "; "}
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {sourceLabel(source, locale)}
              </a>
            </span>
          ))}
          . {t.sourcesTail}
        </p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(formatTaka(result.netAmount), formatTaka(result.grossInterest)) : ""}
        result={result && <FdrResultView result={result} />}
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

function FdrResultView({ result: r }: { result: FdrResult }) {
  const t = STRINGS[useLocale()];
  const exciseLabel =
    r.exciseMode === "bands" ? t.exciseEstimated : r.exciseMode === "custom" ? t.exciseEntered : t.exciseNone;
  const stats = [
    { label: t.maturityValue, value: formatTaka(r.maturityValue) },
    { label: t.grossInterest, value: formatTaka(r.grossInterest) },
    { label: t.tax(formatPercent(r.taxPercent, { decimals: 4 })), value: formatTaka(r.tax) },
    { label: exciseLabel, value: formatTaka(r.excise) },
    { label: t.netInterest, value: formatTaka(r.netInterest) },
    { label: t.termStat, value: termText(t, r.months) },
    ...(r.compounding === "simple"
      ? []
      : [{ label: t.effectiveRate, value: formatPercent(r.effectiveAnnualRatePercent, { decimals: 2 }) }]),
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="fdr-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {formatTaka(r.netAmount)}
            </p>
            <p className="mt-1 text-sm text-slate-600">{t.resultNote}</p>
          </>
        }
      >
        <ResultStats items={stats} />

        <details className="mt-5 rounded-xl bg-white/70 px-4 py-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-slate-900">{t.seeBreakdown}</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[24rem] text-right text-sm">
              <caption className="sr-only">{t.tableCaption}</caption>
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th scope="col" className="py-2 pr-3 text-left font-medium">{t.year}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.interestCol}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.balanceCol}</th>
                  {r.exciseMode === "bands" && <th scope="col" className="py-2 pl-3 font-medium">{t.exciseCol}</th>}
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((row) => (
                  <tr key={row.year} className="border-b border-slate-200 last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">
                      {formatNumber(row.year)}
                      {row.months < 12 && (
                        <span className="block text-xs font-normal text-slate-600">{t.monthsInYear(row.months)}</span>
                      )}
                    </th>
                    <td className="px-3 py-2">{formatTaka(row.interest)}</td>
                    <td className="px-3 py-2">{formatTaka(row.balance)}</td>
                    {r.exciseMode === "bands" && <td className="py-2 pl-3">{formatTaka(row.excise)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-600">{t.roundingNote}</p>
        </details>

        <p className="mt-4 text-sm text-slate-600">{t.methodNote(t.methodNames[r.compounding])}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

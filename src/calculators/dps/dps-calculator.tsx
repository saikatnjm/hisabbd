"use client";

import { useRef, useState } from "react";
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
} from "@/calculators/fdr/deposit-tax";
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
  calculateDps,
  DPS_COMPOUNDING_OPTIONS,
  MAX_EXCISE,
  MAX_INSTALMENT,
  MAX_TENURE_YEARS,
  type DpsCompounding,
  type DpsError,
  type DpsField,
  type DpsInputs,
  type DpsResult,
} from "./logic";

const SLUG = "dps-calculator";

/** Remembered in this browser: settings only, never the amounts typed. */
const COMPOUNDING_PREF = choicePreference(SLUG, "compounding", DPS_COMPOUNDING_OPTIONS, "monthly");
const TAX_PREF = choicePreference(SLUG, "tax", TAX_PRESET_IDS, "standard");
const EXCISE_PREF = choicePreference(SLUG, "excise", EXCISE_MODES, "bands");

const FIELD_IDS: Record<DpsField, string> = {
  instalment: "dps-instalment",
  rate: "dps-rate",
  tenure: "dps-tenure",
  tax: "dps-tax-custom",
  excise: "dps-excise-amount",
};
const TAX_PRESET_ID = "dps-tax-preset";

const link = "font-semibold text-brand-700 underline underline-offset-4";

const STRINGS = {
  en: {
    submit: "Calculate DPS",
    instalment: "Monthly instalment",
    instalmentPlaceholder: "e.g. 5,000",
    rate: "Interest rate (per year)",
    rateHint: "Use the rate your bank quotes for this DPS tenure.",
    ratePlaceholder: "e.g. 9",
    tenure: "Tenure",
    tenureHint: `Whole years, 1 to ${MAX_TENURE_YEARS}.`,
    tenurePlaceholder: "e.g. 5",
    yearsUnit: "years",
    compoundingLegend: "Interest is compounded",
    compoundingOptions: { monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" },
    compoundingNote:
      "Monthly is the most common method in DPS tables, but banks differ. Check your DPS form or ask the bank.",
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
        "Estimated once a year from that year’s closing balance, using the FY2026-27 bands as reported: nil up to ৳4 lakh, ৳150 up to ৳5 lakh, ৳500 up to ৳10 lakh, ৳3,000 up to ৳50 lakh, more above.",
      custom: "Enter the total excise duty for the whole tenure, if you know it.",
      none: "Excise duty is left out of the result.",
    },
    exciseAmount: "Total excise duty",
    excisePlaceholder: "e.g. 500",
    sourcesLead: (date: string) => `Tax and excise figures checked on ${date}. Sources:`,
    sourcesTail: "They can change with each budget; your bank’s deduction is final.",
    announcement: (net: string, maturity: string) => `You receive ${net}. Maturity value before tax ${maturity}.`,
    placeholderTitleFirst: "Your DPS maturity will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the monthly instalment, your bank’s rate and the tenure, then select Calculate DPS.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitle: "You receive at maturity",
    resultNote: "after tax and excise, rounded to the nearest Taka",
    maturityValue: "Maturity value before tax",
    totalDeposits: "Total you deposit",
    grossInterest: "Interest before tax",
    tax: (rate: string) => `Tax at source (${rate})`,
    exciseEstimated: "Excise duty (estimate)",
    exciseEntered: "Excise duty (entered)",
    exciseNone: "Excise duty (left out)",
    netInterest: "Interest after tax and excise",
    instalments: "Instalments",
    instalmentsValue: (n: number, years: string) => `${formatNumber(n)} (${years})`,
    tableTitle: "Year by year",
    tableCaption: "Deposits, interest, total deposited, closing balance and estimated excise duty for each year",
    year: "Year",
    depositsCol: "Deposited",
    interestCol: "Interest",
    totalCol: "Total deposited",
    balanceCol: "Balance at year end",
    exciseCol: "Excise",
    roundingNote: "Whole Taka, before tax. Rounded figures may differ from totals by ৳1.",
    methodNote: (compounding: string) =>
      `Each instalment is paid at the start of the month and the DPS matures one month after the last instalment. Interest compounded ${compounding}. Your bank’s figures may differ slightly because of day count, rounding, when tax is deducted, or fees.`,
    methodNames: { monthly: "monthly", quarterly: "quarterly", yearly: "yearly" },
    yearsText: (n: number) => pluralize(n, "year"),
    errInstalmentLabel: "monthly instalment",
    errAmountMin: "more than ৳0",
    errMax: (max: string) => `${max} or less`,
    errRateLabel: "interest rate",
    errPercentMin: "0% or more",
    errPercentMax: "100% or less",
    errTenureLabel: "tenure",
    errTenureMin: "at least 1 year",
    errTenureMax: `${MAX_TENURE_YEARS} years or less`,
    errTaxLabel: "tax rate",
    errExciseLabel: "excise duty",
    errExciseMin: "৳0 or more",
    shareText: (instalment: string, rate: string, years: string, maturity: string, net: string) =>
      `DPS of ${instalment} a month at ${rate} for ${years}: about ${maturity} at maturity before tax, ${net} received after tax and excise. Calculated with HisabBD’s DPS Calculator.`,
    shareTitle: "DPS calculated with HisabBD",
  },
  bn: {
    submit: "ডিপিএস হিসাব করুন",
    instalment: "মাসিক কিস্তি",
    instalmentPlaceholder: "যেমন 5,000",
    rate: "বার্ষিক সুদের হার",
    rateHint: "এই মেয়াদের ডিপিএসের জন্য আপনার ব্যাংক যে হার বলছে, সেটি দিন।",
    ratePlaceholder: "যেমন 9",
    tenure: "মেয়াদ",
    tenureHint: `পূর্ণ বছরে, 1 থেকে ${MAX_TENURE_YEARS}।`,
    tenurePlaceholder: "যেমন 5",
    yearsUnit: "বছর",
    compoundingLegend: "সুদ চক্রবৃদ্ধি হয়",
    compoundingOptions: { monthly: "মাসিক", quarterly: "ত্রৈমাসিক", yearly: "বার্ষিক" },
    compoundingNote:
      "ডিপিএস টেবিলে মাসিক পদ্ধতিই বেশি দেখা যায়, তবে ব্যাংকভেদে আলাদা হয়। ডিপিএস ফর্ম দেখুন বা ব্যাংকে জিজ্ঞেস করুন।",
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
        "প্রতি বছর একবার, সেই বছর শেষের ব্যালান্স থেকে 2026-27 অর্থবছরের প্রকাশিত স্ল্যাবে অনুমান: ৳4 লাখ পর্যন্ত শূন্য, ৳5 লাখ পর্যন্ত ৳150, ৳10 লাখ পর্যন্ত ৳500, ৳50 লাখ পর্যন্ত ৳3,000, এর বেশি হলে আরও বেশি।",
      custom: "জানা থাকলে পুরো মেয়াদের মোট আবগারি শুল্ক লিখুন।",
      none: "ফলাফলে আবগারি শুল্ক ধরা হবে না।",
    },
    exciseAmount: "মোট আবগারি শুল্ক",
    excisePlaceholder: "যেমন 500",
    sourcesLead: (date: string) => `কর ও আবগারির অঙ্কগুলো ${date}-এ যাচাই করা। সূত্র:`,
    sourcesTail: "প্রতি বাজেটে এগুলো বদলাতে পারে; ব্যাংক যা কাটে সেটিই চূড়ান্ত।",
    announcement: (net: string, maturity: string) => `হাতে পাবেন ${net}। কর বাদের আগে মেয়াদ শেষের অঙ্ক ${maturity}।`,
    placeholderTitleFirst: "ডিপিএসের মেয়াদ শেষের হিসাব এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "মাসিক কিস্তি, ব্যাংকের হার ও মেয়াদ লিখে “ডিপিএস হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitle: "মেয়াদ শেষে হাতে পাবেন",
    resultNote: "কর ও আবগারি বাদে, নিকটতম টাকায় রাউন্ড করা",
    maturityValue: "কর বাদের আগে মেয়াদ শেষের অঙ্ক",
    totalDeposits: "আপনার মোট জমা",
    grossInterest: "কর বাদের আগে সুদ",
    tax: (rate: string) => `উৎসে কর (${rate})`,
    exciseEstimated: "আবগারি শুল্ক (অনুমান)",
    exciseEntered: "আবগারি শুল্ক (আপনার দেওয়া)",
    exciseNone: "আবগারি শুল্ক (বাদ)",
    netInterest: "কর ও আবগারি বাদে সুদ",
    instalments: "কিস্তির সংখ্যা",
    instalmentsValue: (n: number, years: string) => `${formatNumber(n)}টি (${years})`,
    tableTitle: "বছরভিত্তিক হিসাব",
    tableCaption: "প্রতি বছরের জমা, সুদ, মোট জমা, বছর শেষের ব্যালান্স ও আনুমানিক আবগারি শুল্ক",
    year: "বছর",
    depositsCol: "জমা",
    interestCol: "সুদ",
    totalCol: "মোট জমা",
    balanceCol: "বছর শেষের ব্যালান্স",
    exciseCol: "আবগারি",
    roundingNote: "পুরো টাকায়, কর বাদের আগে। রাউন্ড করার কারণে যোগফল ৳1 এদিক-ওদিক হতে পারে।",
    methodNote: (compounding: string) =>
      `প্রতিটি কিস্তি মাসের শুরুতে জমা ধরা হয়েছে, আর শেষ কিস্তির এক মাস পরে মেয়াদ পূর্ণ হয়। সুদ ${compounding} চক্রবৃদ্ধি। দিন গণনা, রাউন্ডিং, কখন কর কাটা হয় বা ফির কারণে আপনার ব্যাংকের অঙ্ক সামান্য আলাদা হতে পারে।`,
    methodNames: { monthly: "মাসিক", quarterly: "ত্রৈমাসিক", yearly: "বার্ষিক" },
    yearsText: (n: number) => countBn(n, "বছর"),
    errInstalmentLabel: "মাসিক কিস্তি",
    errAmountMin: "৳0-র বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errRateLabel: "সুদের হার",
    errPercentMin: "0% বা তার বেশি",
    errPercentMax: "100% বা তার কম",
    errTenureLabel: "মেয়াদ",
    errTenureMin: "কমপক্ষে 1 বছর",
    errTenureMax: `${MAX_TENURE_YEARS} বছর বা তার কম`,
    errTaxLabel: "করের হার",
    errExciseLabel: "আবগারি শুল্ক",
    errExciseMin: "৳0 বা তার বেশি",
    shareText: (instalment: string, rate: string, years: string, maturity: string, net: string) =>
      `মাসে ${instalment} ডিপিএস, ${rate} হারে, ${years}: কর বাদের আগে মেয়াদ শেষে প্রায় ${maturity}, কর ও আবগারি বাদে হাতে ${net}। HisabBD-র ডিপিএস ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD দিয়ে ডিপিএস হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

/** "The Daily Star (7 Jun 2026)": the publisher part of a source title plus its date. */
function sourceLabel(source: DepositSource, locale: Locale): string {
  const date = parsePlainDate(source.published);
  const publisher = source.title.split(":")[0] ?? source.title;
  return date ? `${publisher} (${formatPlainDate(date, { locale })})` : publisher;
}

function errorMessage(t: Strings, locale: Locale, error: DpsError): string {
  const percent = { min: t.errPercentMin, max: t.errPercentMax };
  switch (error.field) {
    case "instalment":
      return numberErrorMessage(
        error.code,
        { label: t.errInstalmentLabel, min: t.errAmountMin, max: t.errMax(formatTaka(MAX_INSTALMENT)) },
        locale,
      );
    case "rate":
      return numberErrorMessage(error.code, { label: t.errRateLabel, ...percent }, locale);
    case "tenure":
      return numberErrorMessage(
        error.code,
        { label: t.errTenureLabel, min: t.errTenureMin, max: t.errTenureMax },
        locale,
      );
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

function shareText(t: Strings, r: DpsResult): string {
  return t.shareText(
    formatTaka(r.instalment),
    formatPercent(r.ratePercent, { decimals: 4 }),
    t.yearsText(r.years),
    formatTaka(r.maturityValue),
    formatTaka(r.netAmount),
  );
}

export function DpsCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [instalment, setInstalment] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [compounding, setCompounding] = usePreference(COMPOUNDING_PREF);
  const [taxPreset, setTaxPreset] = usePreference(TAX_PREF);
  const [customTax, setCustomTax] = useState("");
  const [exciseMode, setExciseMode] = usePreference(EXCISE_PREF);
  const [exciseAmount, setExciseAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs: Record<DpsField, React.RefObject<HTMLInputElement | null>> = {
    instalment: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
    tenure: useRef<HTMLInputElement>(null),
    tax: useRef<HTMLInputElement>(null),
    excise: useRef<HTMLInputElement>(null),
  };

  const inputs: DpsInputs = {
    instalment,
    rate,
    tenureYears: tenure,
    compounding,
    taxRate: taxPreset === "custom" ? customTax : String(SOURCE_TAX_PRESETS[taxPreset].value),
    exciseMode,
    exciseAmount,
  };
  const calc = submitted ? calculateDps(inputs) : null;
  const errorFor = (field: DpsField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;
  const checkedOn = parsePlainDate(DEPOSIT_TAX_CHECKED_ON);
  const sources = [...SOURCE_TAX_SOURCES, ...EXCISE_TABLE.sources];

  const compoundingOptions = DPS_COMPOUNDING_OPTIONS.map((value: DpsCompounding) => ({
    value,
    label: t.compoundingOptions[value],
  }));
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
    const check = calculateDps(inputs);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      // Only the boxes that are shown (and used) are saved.
      record(
        {
          instalment,
          rate,
          tenure,
          compounding,
          tax: taxPreset,
          excise: exciseMode,
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
    const savedCompounding = text("compounding");
    const savedTax = text("tax");
    const savedExcise = text("excise");
    setInstalment(text("instalment"));
    setRate(text("rate"));
    setTenure(text("tenure"));
    if (COMPOUNDING_PREF.isValid(savedCompounding)) setCompounding(savedCompounding);
    if (TAX_PREF.isValid(savedTax)) setTaxPreset(savedTax);
    if (EXCISE_PREF.isValid(savedExcise)) setExciseMode(savedExcise);
    setCustomTax(text("customTax"));
    setExciseAmount(text("exciseAmount"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered compounding, tax and excise choices stay. */
  function onReset() {
    setInstalment("");
    setRate("");
    setTenure("");
    setCustomTax("");
    setExciseAmount("");
    setSubmitted(false);
    setRevealCount(0);
    refs.instalment.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id={FIELD_IDS.instalment} label={t.instalment} error={errorFor("instalment")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.instalment}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.instalmentPlaceholder}
                value={instalment}
                onChange={(event) => setInstalment(event.target.value)}
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
          <FormField id={FIELD_IDS.tenure} label={t.tenure} hint={t.tenureHint} error={errorFor("tenure")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.tenure}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                suffix={t.yearsUnit}
                placeholder={t.tenurePlaceholder}
                value={tenure}
                onChange={(event) => setTenure(event.target.value)}
              />
            )}
          </FormField>
          <div className="space-y-2">
            <SegmentedControl
              name="dps-compounding"
              legend={t.compoundingLegend}
              options={compoundingOptions}
              value={compounding}
              onChange={setCompounding}
            />
            <p className="text-sm text-slate-600">{t.compoundingNote}</p>
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
              name="dps-excise"
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
        announcement={result ? t.announcement(formatTaka(result.netAmount), formatTaka(result.maturityValue)) : ""}
        result={result && <DpsResultView result={result} />}
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

function DpsResultView({ result: r }: { result: DpsResult }) {
  const t = STRINGS[useLocale()];
  const exciseLabel =
    r.exciseMode === "bands" ? t.exciseEstimated : r.exciseMode === "custom" ? t.exciseEntered : t.exciseNone;
  const showExcise = r.exciseMode === "bands";
  const stats = [
    { label: t.maturityValue, value: formatTaka(r.maturityValue) },
    { label: t.totalDeposits, value: formatTaka(r.totalDeposits) },
    { label: t.grossInterest, value: formatTaka(r.grossInterest) },
    { label: t.tax(formatPercent(r.taxPercent, { decimals: 4 })), value: formatTaka(r.tax) },
    { label: exciseLabel, value: formatTaka(r.excise) },
    { label: t.netInterest, value: formatTaka(r.netInterest) },
    { label: t.instalments, value: t.instalmentsValue(r.months, t.yearsText(r.years)) },
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="dps-result-heading"
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

        <div className="mt-5 rounded-xl bg-white/70 px-4 py-3">
          <h3 className="font-semibold text-slate-900">{t.tableTitle}</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-right text-sm">
              <caption className="sr-only">{t.tableCaption}</caption>
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th scope="col" className="py-2 pr-3 text-left font-medium">{t.year}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.depositsCol}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.interestCol}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.totalCol}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t.balanceCol}</th>
                  {showExcise && <th scope="col" className="py-2 pl-3 font-medium">{t.exciseCol}</th>}
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((row) => (
                  <tr key={row.year} className="border-b border-slate-200 last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">
                      {formatNumber(row.year)}
                    </th>
                    <td className="px-3 py-2">{formatTaka(row.deposits)}</td>
                    <td className="px-3 py-2">{formatTaka(row.interest)}</td>
                    <td className="px-3 py-2">{formatTaka(row.totalDeposits)}</td>
                    <td className="px-3 py-2">{formatTaka(row.balance)}</td>
                    {showExcise && <td className="py-2 pl-3">{formatTaka(row.excise)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-600">{t.roundingNote}</p>
        </div>

        <p className="mt-4 text-sm text-slate-600">{t.methodNote(t.methodNames[r.compounding])}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

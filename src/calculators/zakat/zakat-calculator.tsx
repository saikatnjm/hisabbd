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
import { formatNumber, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import { gramsToBhori, MAX_WEIGHT_GRAMS } from "@/calculators/gold/units";
import {
  calculateZakat,
  MAX_AMOUNT,
  MAX_PRICE_PER_BHORI,
  NISAB_BHORI,
  ZAKAT_SOURCES,
  type NisabBasis,
  type ZakatError,
  type ZakatField,
  type ZakatResult,
  type ZakatWeightUnit,
} from "./logic";

const SLUG = "zakat-calculator";
/** Form order (also the order errors are reported in). */
const FIELDS: readonly ZakatField[] = [
  "cash",
  "bank",
  "goldWeight",
  "goldPrice",
  "silverWeight",
  "silverPrice",
  "business",
  "receivables",
  "other",
  "debts",
];
const FIELD_IDS: Record<ZakatField, string> = {
  cash: "zakat-cash",
  bank: "zakat-bank",
  goldWeight: "zakat-gold-weight",
  goldPrice: "zakat-gold-price",
  silverWeight: "zakat-silver-weight",
  silverPrice: "zakat-silver-price",
  business: "zakat-business",
  receivables: "zakat-receivables",
  other: "zakat-other",
  debts: "zakat-debts",
};
const BASIS_ORDER: readonly NisabBasis[] = ["silver", "gold"];
const UNIT_ORDER: readonly ZakatWeightUnit[] = ["bhori", "gram"];
/** The nisab basis and weight unit are remembered in this browser; amounts are not. */
const BASIS_PREF = choicePreference(SLUG, "basis", BASIS_ORDER, "silver");
const UNIT_PREF = choicePreference(SLUG, "unit", UNIT_ORDER, "bhori");

const EMPTY: Record<ZakatField, string> = {
  cash: "",
  bank: "",
  goldWeight: "",
  goldPrice: "",
  silverWeight: "",
  silverPrice: "",
  business: "",
  receivables: "",
  other: "",
  debts: "",
};

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate zakat",
    basisLegend: "Nisab based on",
    bases: { silver: "Silver (52.5 bhori)", gold: "Gold (7.5 bhori)" },
    basisSentence: {
      silver:
        "Nisab = the price of 52.5 bhori (612.36 g) of silver. The lower threshold, which many zakat organisations in Bangladesh use.",
      gold: "Nisab = the price of 7.5 bhori (87.48 g) of gold. A higher threshold that some scholars prefer for cash and savings.",
    },
    basisAdvice: "Scholars differ on which to use. Ask a scholar you trust for your situation.",
    unitLegend: "Gold and silver weight in",
    units: { bhori: "Bhori", gram: "Grams" },
    ownHeading: "What you own (held for a lunar year)",
    owedHeading: "Minus what you owe",
    labels: {
      cash: "Cash in hand",
      bank: "Bank balances and savings",
      goldWeight: "Gold weight",
      goldPrice: "Gold price per bhori",
      silverWeight: "Silver weight",
      silverPrice: "Silver price per bhori",
      business: "Business stock (sale value)",
      receivables: "Money owed to you",
      other: "Other zakatable assets",
      debts: "Debts and bills due now",
    },
    hints: {
      cash: "Leave blank anything that doesn’t apply.",
      bank: "Include DPS, FDR and Sanchayapatra principal.",
      goldWeight: { bhori: "Decimals are fine: 2 bhori 8 ana = 2.5 bhori.", gram: "1 bhori = 11.664 g." },
      goldPrice: "Today’s BAJUS price per bhori for your gold’s purity.",
      silverWeight: { bhori: "Decimals are fine: 60 bhori 8 ana = 60.5 bhori.", gram: "1 bhori = 11.664 g." },
      silverPrice: "Today’s BAJUS silver price per bhori.",
      business: "Goods held for sale, at what they would sell for today.",
      receivables: "Only loans you expect to get back.",
      other: "Anything else you count as zakatable, in Taka.",
      debts: "Loans, instalments and bills you must pay now.",
    },
    nisabNeeded: "Needed for the nisab.",
    unitSuffix: { bhori: "bhori", gram: "g" },
    sourcesLead: "No prices are filled in because they change often. Check today’s gold and silver prices at",
    bajusName: "BAJUS (bajus.org)",
    disclaimer:
      "A general calculation, not a fatwa. Ask a scholar about special cases, such as jewellery for personal use (scholars differ), pension and provident funds, shares, property and long-term loans.",
    announcement: (due: boolean, zakat: string) => (due ? `Zakat due: ${zakat}.` : "Zakat is not due on these figures."),
    placeholderTitleFirst: "Your zakat will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst:
      "Choose the nisab basis, enter what you own and owe, and the price per bhori of silver or gold, then select Calculate zakat.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    titleDue: "Zakat due (2.5%)",
    titleNotDue: "Zakat not due",
    sentenceDue: (net: string, nisab: string) =>
      `Your net zakatable wealth of ${net} is at or above the nisab of ${nisab}, so zakat is 2.5% of it.`,
    sentenceNotDue: (net: string, nisab: string) =>
      `Your net zakatable wealth of ${net} is below the nisab of ${nisab}, so no zakat is due on these figures.`,
    statNet: "Net zakatable wealth",
    statNisab: { silver: "Nisab (silver)", gold: "Nisab (gold)" },
    statAssets: "Total assets",
    statDebts: "Debts due now",
    breakdownTitle: "Breakdown",
    lineGold: (weight: string) => `Gold (${weight} bhori)`,
    lineSilver: (weight: string) => `Silver (${weight} bhori)`,
    lineTotal: "Total assets",
    lineDebts: "Minus debts and bills",
    lineNet: "Net zakatable wealth",
    workedOutAs: "Worked out as:",
    nisabWord: "Nisab",
    zakatWord: "Zakat",
    bhoriWord: "bhori",
    metal: { silver: "silver", gold: "gold" },
    yearNote: "Zakat is due once the wealth has been held for a full lunar (Hijri) year. Amounts are rounded to the paisa for display.",
    errLabels: {
      cash: "cash in hand",
      bank: "bank balances and savings",
      goldWeight: "gold weight",
      goldPrice: "gold price per bhori",
      silverWeight: "silver weight",
      silverPrice: "silver price per bhori",
      business: "business stock",
      receivables: "money owed to you",
      other: "other zakatable assets",
      debts: "debts and bills",
    },
    errNoAssets: "Enter at least one thing you own, such as cash in hand.",
    errNisab: {
      silver: "Enter the silver price per bhori: the nisab is 52.5 bhori of silver.",
      gold: "Enter the gold price per bhori: the nisab is 7.5 bhori of gold.",
    },
    errZero: "0 or more",
    errMax: (max: string) => `${max} or less`,
    shareTitle: "Zakat calculated with HisabBD",
    shareDue: (zakat: string, net: string, nisab: string, metal: string) =>
      `Zakat: ${zakat} (2.5% of net zakatable wealth ${net}; nisab ${nisab} on ${metal}). A general calculation, not a fatwa. Calculated with HisabBD’s Zakat Calculator.`,
    shareNotDue: (net: string, nisab: string, metal: string) =>
      `Zakat not due: net zakatable wealth ${net} is below the nisab of ${nisab} (${metal}). A general calculation, not a fatwa. Calculated with HisabBD’s Zakat Calculator.`,
  },
  bn: {
    submit: "যাকাত হিসাব করুন",
    basisLegend: "নিসাব যে ধাতুর হিসাবে",
    bases: { silver: "রুপা (52.5 ভরি)", gold: "সোনা (7.5 ভরি)" },
    basisSentence: {
      silver:
        "নিসাব = 52.5 ভরি (612.36 গ্রাম) রুপার দাম। এটি কম সীমা; বাংলাদেশের অনেক যাকাত সংস্থা এটি ব্যবহার করে।",
      gold: "নিসাব = 7.5 ভরি (87.48 গ্রাম) সোনার দাম। এটি বেশি সীমা; নগদ ও সঞ্চয়ের ক্ষেত্রে কিছু আলেম এটি পছন্দ করেন।",
    },
    basisAdvice: "কোনটি ব্যবহার করবেন তা নিয়ে আলেমদের মতভেদ আছে। নিজের অবস্থার জন্য আস্থাভাজন আলেমের কাছে জেনে নিন।",
    unitLegend: "সোনা ও রুপার ওজনের একক",
    units: { bhori: "ভরি", gram: "গ্রাম" },
    ownHeading: "আপনার সম্পদ (এক চান্দ্র বছর ধরে মালিকানায়)",
    owedHeading: "বাদ যাবে যা পরিশোধ করতে হবে",
    labels: {
      cash: "হাতে নগদ টাকা",
      bank: "ব্যাংকে জমা ও সঞ্চয়",
      goldWeight: "সোনার ওজন",
      goldPrice: "সোনার প্রতি ভরির দাম",
      silverWeight: "রুপার ওজন",
      silverPrice: "রুপার প্রতি ভরির দাম",
      business: "ব্যবসার পণ্য (বিক্রয়মূল্যে)",
      receivables: "আপনার পাওনা টাকা",
      other: "অন্যান্য যাকাতযোগ্য সম্পদ",
      debts: "এখন পরিশোধযোগ্য ঋণ ও বিল",
    },
    hints: {
      cash: "যা প্রযোজ্য নয় তা ফাঁকা রাখুন।",
      bank: "ডিপিএস, এফডিআর ও সঞ্চয়পত্রের আসল টাকাও ধরুন।",
      goldWeight: { bhori: "দশমিকে লিখুন: 2 ভরি 8 আনা = 2.5 ভরি।", gram: "1 ভরি = 11.664 গ্রাম।" },
      goldPrice: "আপনার সোনার মান অনুযায়ী বাজুস-এর আজকের প্রতি ভরির দাম।",
      silverWeight: { bhori: "দশমিকে লিখুন: 60 ভরি 8 আনা = 60.5 ভরি।", gram: "1 ভরি = 11.664 গ্রাম।" },
      silverPrice: "বাজুস-এর আজকের প্রতি ভরি রুপার দাম।",
      business: "বিক্রির জন্য রাখা পণ্য, আজ যে দামে বিক্রি হবে সেই দামে।",
      receivables: "শুধু যে ধার ফেরত পাবেন বলে আশা করেন।",
      other: "অন্য যা যাকাতযোগ্য মনে করেন, টাকায়।",
      debts: "এখনই শোধ করতে হবে এমন ঋণ, কিস্তি ও বিল।",
    },
    nisabNeeded: "নিসাব হিসাবের জন্য দরকার।",
    unitSuffix: { bhori: "ভরি", gram: "গ্রাম" },
    sourcesLead: "দাম ঘন ঘন বদলায় বলে কোনো দাম আগে থেকে বসানো নেই। আজকের সোনা ও রুপার দাম দেখুন:",
    bajusName: "বাজুস (bajus.org)",
    disclaimer:
      "এটি সাধারণ হিসাব, ফতোয়া নয়। বিশেষ ক্ষেত্রে, যেমন ব্যবহারের গয়না (এ নিয়ে আলেমদের মতভেদ আছে), পেনশন ও প্রভিডেন্ট ফান্ড, শেয়ার, জমি-বাড়ি ও দীর্ঘমেয়াদি ঋণের বিষয়ে আলেমের কাছে জেনে নিন।",
    announcement: (due: boolean, zakat: string) => (due ? `যাকাত দিতে হবে: ${zakat}।` : "এই হিসাবে যাকাত ফরজ হয়নি।"),
    placeholderTitleFirst: "যাকাতের হিসাব এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst:
      "নিসাবের ধাতু বেছে নিন, আপনার সম্পদ ও ঋণ এবং রুপা বা সোনার প্রতি ভরির দাম লিখে “যাকাত হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    titleDue: "যাকাত দিতে হবে (2.5%)",
    titleNotDue: "যাকাত ফরজ হয়নি",
    sentenceDue: (net: string, nisab: string) =>
      `আপনার নিট যাকাতযোগ্য সম্পদ ${net}, যা নিসাব ${nisab}-এর সমান বা বেশি, তাই এর 2.5% যাকাত।`,
    sentenceNotDue: (net: string, nisab: string) =>
      `আপনার নিট যাকাতযোগ্য সম্পদ ${net}, যা নিসাব ${nisab}-এর কম, তাই এই হিসাবে যাকাত ফরজ হয়নি।`,
    statNet: "নিট যাকাতযোগ্য সম্পদ",
    statNisab: { silver: "নিসাব (রুপা)", gold: "নিসাব (সোনা)" },
    statAssets: "মোট সম্পদ",
    statDebts: "এখন পরিশোধযোগ্য ঋণ",
    breakdownTitle: "বিস্তারিত",
    lineGold: (weight: string) => `সোনা (${weight} ভরি)`,
    lineSilver: (weight: string) => `রুপা (${weight} ভরি)`,
    lineTotal: "মোট সম্পদ",
    lineDebts: "বাদ: ঋণ ও বিল",
    lineNet: "নিট যাকাতযোগ্য সম্পদ",
    workedOutAs: "যেভাবে হিসাব হলো:",
    nisabWord: "নিসাব",
    zakatWord: "যাকাত",
    bhoriWord: "ভরি",
    metal: { silver: "রুপা", gold: "সোনা" },
    yearNote: "সম্পদ পূর্ণ এক চান্দ্র (হিজরি) বছর মালিকানায় থাকলে যাকাত ফরজ হয়। অঙ্কগুলো দেখানোর জন্য পয়সা পর্যন্ত রাউন্ড করা।",
    errLabels: {
      cash: "হাতে নগদ টাকা",
      bank: "ব্যাংকে জমা ও সঞ্চয়",
      goldWeight: "সোনার ওজন",
      goldPrice: "সোনার প্রতি ভরির দাম",
      silverWeight: "রুপার ওজন",
      silverPrice: "রুপার প্রতি ভরির দাম",
      business: "ব্যবসার পণ্য",
      receivables: "পাওনা টাকা",
      other: "অন্যান্য যাকাতযোগ্য সম্পদ",
      debts: "ঋণ ও বিল",
    },
    errNoAssets: "অন্তত একটি সম্পদ লিখুন, যেমন হাতে নগদ টাকা।",
    errNisab: {
      silver: "রুপার প্রতি ভরির দাম লিখুন: নিসাব 52.5 ভরি রুপা।",
      gold: "সোনার প্রতি ভরির দাম লিখুন: নিসাব 7.5 ভরি সোনা।",
    },
    errZero: "0 বা তার বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    shareTitle: "HisabBD দিয়ে যাকাত হিসাব",
    shareDue: (zakat: string, net: string, nisab: string, metal: string) =>
      `যাকাত: ${zakat} (নিট যাকাতযোগ্য সম্পদ ${net}-এর 2.5%; নিসাব ${nisab}, ${metal}র হিসাবে)। এটি সাধারণ হিসাব, ফতোয়া নয়। HisabBD-র যাকাত ক্যালকুলেটরে হিসাব করা।`,
    shareNotDue: (net: string, nisab: string, metal: string) =>
      `যাকাত ফরজ হয়নি: নিট যাকাতযোগ্য সম্পদ ${net}, নিসাব ${nisab}-এর কম (${metal})। এটি সাধারণ হিসাব, ফতোয়া নয়। HisabBD-র যাকাত ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

/** What FormField passes to its control. */
interface FieldControl {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

const link = "font-semibold text-brand-700 underline underline-offset-4";

function isWeight(field: ZakatField): field is "goldWeight" | "silverWeight" {
  return field === "goldWeight" || field === "silverWeight";
}

function errorMessage(t: Strings, locale: Locale, error: ZakatError, basis: NisabBasis, unit: ZakatWeightUnit): string {
  if (error.code === "no-assets") return t.errNoAssets;
  if (error.code === "needed-for-nisab") return t.errNisab[basis];
  const max = isWeight(error.field)
    ? unit === "gram"
      ? `${formatNumber(MAX_WEIGHT_GRAMS)} ${t.unitSuffix.gram}`
      : `${formatNumber(gramsToBhori(MAX_WEIGHT_GRAMS), { decimals: 0 })} ${t.unitSuffix.bhori}`
    : formatTaka(error.field === "goldPrice" || error.field === "silverPrice" ? MAX_PRICE_PER_BHORI : MAX_AMOUNT);
  return numberErrorMessage(error.code, { label: t.errLabels[error.field], min: t.errZero, max: t.errMax(max) }, locale);
}

function shareText(t: Strings, r: ZakatResult): string {
  return r.due
    ? t.shareDue(money(r.zakat), money(r.net), money(r.nisab), t.metal[r.basis])
    : t.shareNotDue(money(r.net), money(r.nisab), t.metal[r.basis]);
}

export function ZakatCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [basis, setBasis] = usePreference(BASIS_PREF);
  const [unit, setUnit] = usePreference(UNIT_PREF);
  const [values, setValues] = useState<Record<ZakatField, string>>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<ZakatField, React.RefObject<HTMLInputElement | null>> = {
    cash: useRef<HTMLInputElement>(null),
    bank: useRef<HTMLInputElement>(null),
    goldWeight: useRef<HTMLInputElement>(null),
    goldPrice: useRef<HTMLInputElement>(null),
    silverWeight: useRef<HTMLInputElement>(null),
    silverPrice: useRef<HTMLInputElement>(null),
    business: useRef<HTMLInputElement>(null),
    receivables: useRef<HTMLInputElement>(null),
    other: useRef<HTMLInputElement>(null),
    debts: useRef<HTMLInputElement>(null),
  };
  const { record } = useCalculationHistory();

  const run = () => calculateZakat({ basis, weightUnit: unit, ...values });
  const calc = submitted ? run() : null;
  const errorFor = (field: ZakatField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error, basis, unit) : undefined;
  };
  const result = calc?.ok ? calc.result : null;
  const nisabPriceField: ZakatField = basis === "gold" ? "goldPrice" : "silverPrice";

  function onSubmit() {
    setSubmitted(true);
    const check = run();
    if (check.ok) {
      setRevealCount((n) => n + 1);
      const typed = Object.fromEntries(FIELDS.filter((f) => values[f].trim()).map((f) => [f, values[f]]));
      record({ basis, unit, ...typed }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const savedBasis = BASIS_ORDER.find((b) => b === saved.basis);
    const savedUnit = UNIT_ORDER.find((u) => u === saved.unit);
    if (savedBasis) setBasis(savedBasis);
    if (savedUnit) setUnit(savedUnit);
    const next = { ...EMPTY };
    for (const field of FIELDS) {
      const value = saved[field];
      if (typeof value === "string") next[field] = value;
    }
    setValues(next);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered nisab basis and weight unit stay. */
  function onReset() {
    setValues(EMPTY);
    setSubmitted(false);
    setRevealCount(0);
    refs.cash.current?.focus();
  }

  function hintFor(field: ZakatField): string {
    if (isWeight(field)) return t.hints[field][unit];
    const hint = t.hints[field];
    return field === nisabPriceField ? `${hint} ${t.nisabNeeded}` : hint;
  }

  function renderField(field: ZakatField) {
    const weight = isWeight(field);
    return (
      <FormField key={field} id={FIELD_IDS[field]} label={t.labels[field]} hint={hintFor(field)} error={errorFor(field)}>
        {(control: FieldControl) => (
          <AffixInput
            {...control}
            ref={refs[field]}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            prefix={weight ? undefined : "৳"}
            suffix={weight ? t.unitSuffix[unit] : undefined}
            value={values[field]}
            onChange={(event) => {
              const value = event.target.value;
              setValues((current) => ({ ...current, [field]: value }));
            }}
          />
        )}
      </FormField>
    );
  }

  const ownFields = FIELDS.filter((f) => f !== "debts");

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl
          name="zakat-basis"
          legend={t.basisLegend}
          options={BASIS_ORDER.map((value) => ({ value, label: t.bases[value] }))}
          value={basis}
          onChange={setBasis}
        />
        <p className="mt-3 text-slate-700">{t.basisSentence[basis]}</p>
        <p className="mt-1 text-sm text-slate-600">{t.basisAdvice}</p>

        <div className="mt-4">
          <SegmentedControl
            name="zakat-unit"
            legend={t.unitLegend}
            options={UNIT_ORDER.map((value) => ({ value, label: t.units[value] }))}
            value={unit}
            onChange={setUnit}
          />
        </div>

        <h3 className="mt-6 font-display text-lg font-semibold text-slate-900">{t.ownHeading}</h3>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">{ownFields.map(renderField)}</div>

        <h3 className="mt-6 font-display text-lg font-semibold text-slate-900">{t.owedHeading}</h3>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">{renderField("debts")}</div>

        <p className="mt-5 text-sm text-slate-600">
          {t.sourcesLead}{" "}
          <a href={ZAKAT_SOURCES.bajus.url} target="_blank" rel="noopener" className={link}>
            {t.bajusName}
          </a>
          .
        </p>
        <p role="note" className="mt-3 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {t.disclaimer}
        </p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(result.due, money(result.zakat)) : ""}
        result={result && <ZakatResultView result={result} />}
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

function ZakatResultView({ result: r }: { result: ZakatResult }) {
  const t = STRINGS[useLocale()];
  const bhori = (value: number) => formatNumber(value, { decimals: 4 });
  const stats = [
    { label: t.statNet, value: money(r.net) },
    { label: t.statNisab[r.basis], value: money(r.nisab) },
    { label: t.statAssets, value: money(r.totalAssets) },
    { label: t.statDebts, value: money(r.debts) },
  ];
  const lines: { label: string; value: number }[] = [
    { label: t.labels.cash, value: r.cash },
    { label: t.labels.bank, value: r.bank },
    { label: t.lineGold(bhori(r.goldBhori)), value: r.goldValue },
    { label: t.lineSilver(bhori(r.silverBhori)), value: r.silverValue },
    { label: t.labels.business, value: r.business },
    { label: t.labels.receivables, value: r.receivables },
    { label: t.labels.other, value: r.other },
  ].filter((line) => line.value > 0);
  const working = [
    `${t.nisabWord} = ${formatNumber(NISAB_BHORI[r.basis])} ${t.bhoriWord} × ${money(r.nisabPricePerBhori)} = ${money(r.nisab)}`,
    r.due ? `${t.zakatWord} = ${money(r.net)} × 2.5% = ${money(r.zakat)}` : `${money(r.net)} < ${money(r.nisab)}`,
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={r.due ? t.titleDue : t.titleNotDue}
        titleId="zakat-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(r.zakat)}</p>}
      >
        <p className="mb-4 text-slate-800">
          {r.due ? t.sentenceDue(money(r.net), money(r.nisab)) : t.sentenceNotDue(money(r.net), money(r.nisab))}
        </p>
        <ResultStats items={stats} />

        <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-slate-800">
          <p className="text-sm text-slate-600">{t.breakdownTitle}</p>
          <dl className="mt-1 divide-y divide-slate-200">
            {lines.map((line) => (
              <div key={line.label} className="flex justify-between gap-4 py-1.5">
                <dt>{line.label}</dt>
                <dd className="font-medium">{money(line.value)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-1.5 font-semibold">
              <dt>{t.lineTotal}</dt>
              <dd>{money(r.totalAssets)}</dd>
            </div>
            {r.debts > 0 && (
              <div className="flex justify-between gap-4 py-1.5">
                <dt>{t.lineDebts}</dt>
                <dd className="font-medium">−{money(r.debts)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-1.5 font-semibold">
              <dt>{t.lineNet}</dt>
              <dd>{money(r.net)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-slate-800">
          <p className="text-sm text-slate-600">{t.workedOutAs}</p>
          {working.map((line) => (
            <p key={line} className="font-medium break-words">
              {line}
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">{t.yearNote}</p>
        <p className="mt-1 text-sm text-slate-600">{t.disclaimer}</p>
      </ResultPanel>
      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

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
import { formatNumber, formatPlainDate, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { parsePlainDate } from "@/lib/plain-date";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  BAJUS_SOURCE,
  calculateGoldValue,
  convertGoldWeight,
  GOLD_PURITIES,
  GOLD_RULES_CHECKED_ON,
  GOLD_VAT_SOURCES,
  MAX_PRICE_PER_BHORI,
  type GoldChargeType,
  type GoldError,
  type GoldField,
  type GoldMode,
  type GoldValueResult,
  type GoldVatType,
  type GoldWeight,
  type GoldWeightInput,
  type GoldWeightUnit,
} from "./logic";
import { MAX_WEIGHT_GRAMS, type TraditionalWeight } from "./units";

const SLUG = "gold-calculator";
const FIELD_IDS: Record<GoldField, string> = {
  bhori: "gold-bhori",
  ana: "gold-ana",
  roti: "gold-roti",
  point: "gold-point",
  grams: "gold-grams",
  price: "gold-price",
  making: "gold-making",
  vat: "gold-vat",
};
const PURITY_ID = "gold-purity";
const VAT_TYPE_ID = "gold-vat-type";
const MODE_ORDER: readonly GoldMode[] = ["value", "convert"];
const UNIT_ORDER: readonly GoldWeightUnit[] = ["traditional", "gram"];
const MAKING_ORDER: readonly GoldChargeType[] = ["percent", "per-bhori"];
const VAT_ORDER: readonly GoldVatType[] = ["included", "percent", "per-bhori"];
const TRADITIONAL_FIELDS = ["bhori", "ana", "roti", "point"] as const;
/** Mode, purity and weight unit are remembered in this browser; weights and prices are not. */
const MODE_PREF = choicePreference(SLUG, "mode", MODE_ORDER, "value");
const PURITY_PREF = choicePreference(SLUG, "purity", GOLD_PURITIES, "22k");
const UNIT_PREF = choicePreference(SLUG, "unit", UNIT_ORDER, "traditional");

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: { value: "Calculate price", convert: "Convert weight" },
    modeLegend: "What do you want to do?",
    modes: { value: "Price of gold", convert: "Convert units" },
    modeSentence: {
      value: "Work out what a piece of gold costs from its weight and today’s price per bhori.",
      convert: "Convert between bhori, ana, roti, point and grams.",
    },
    unitLegend: "Weight in",
    units: { traditional: "Bhori, ana, roti", gram: "Grams" },
    fields: { bhori: "Bhori", ana: "Ana", roti: "Roti", point: "Point", grams: "Weight in grams" },
    weightHint: "Fill in only what you have; blanks count as 0. 1 bhori = 16 ana, 1 ana = 6 roti, 1 roti = 10 point.",
    gramsHint: "1 bhori = 11.664 g.",
    gramsPlaceholder: "e.g. 10",
    purity: "Purity",
    purities: { "22k": "22 carat (22K)", "21k": "21 carat (21K)", "18k": "18 carat (18K)", traditional: "Traditional (sanatan)" },
    purityShort: { "22k": "22K", "21k": "21K", "18k": "18K", traditional: "traditional" },
    price: "Price per bhori",
    pricePlaceholder: "e.g. 2,20,000",
    priceHint: (purity: string) => `Today’s BAJUS price for ${purity} gold, per bhori (11.664 g).`,
    makingLegend: "Making charge (majuri) as",
    makingTypes: { percent: "% of gold price", "per-bhori": "৳ per bhori" },
    making: "Making charge (optional)",
    makingPlaceholder: { percent: "e.g. 8", "per-bhori": "e.g. 5,000" },
    makingHint: "Ask the shop; it depends on the design. Leave blank for none.",
    vatType: "VAT",
    vatTypes: {
      included: "Included in the price (BAJUS)",
      percent: "Add VAT as % of the bill",
      "per-bhori": "Add VAT in ৳ per bhori",
    },
    vatHints: {
      included: "BAJUS prices include VAT since June 2026, and shops may not add it again.",
      percent: "Enter the rate on your bill. It is applied to the gold price plus the making charge.",
      "per-bhori": "Enter the amount per bhori on your bill.",
    },
    vatRate: { percent: "VAT rate", "per-bhori": "VAT per bhori" },
    vatPlaceholder: { percent: "e.g. 5", "per-bhori": "e.g. 2,500" },
    sourcesValue: "Gold prices change often, so no price is filled in. Check today’s price per bhori at",
    bajusName: "BAJUS (bajus.org)",
    sourcesVat: (date: string) =>
      `VAT on gold has been a fixed ৳2,500 per bhori since the FY2026-27 budget, already inside BAJUS prices (checked on ${date}):`,
    sourcesUnits: "1 bhori (tola) = 11.664 g = 16 ana = 96 roti = 960 point. Ana, roti and point are the units jewellers in Bangladesh use.",
    announceValue: (total: string) => `Total price ${total}.`,
    announceConvert: (grams: string, traditional: string) => `${traditional} is ${grams}.`,
    placeholderTitleFirst: { value: "Your gold price will appear here", convert: "Your conversion will appear here" },
    placeholderTitleFix: "Almost there",
    placeholderFirst: {
      value: "Enter the weight and the price per bhori, then select Calculate price.",
      convert: "Enter a weight in bhori, ana, roti and point, or in grams, then select Convert weight.",
    },
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitleValue: (purity: string) => `Price of ${purity} gold`,
    resultTitleConvert: "Weight",
    statWeight: "Weight",
    statGrams: "In grams",
    statBhori: "In bhori",
    statTraditional: "Bhori, ana, roti, point",
    statTotalAna: "In ana",
    statTotalRoti: "In roti",
    statTotalPoint: "In point",
    statPrice: "Price per bhori",
    statGoldValue: "Gold price",
    statMaking: "Making charge",
    statVat: "VAT",
    vatIncluded: "Included in the price",
    statTotal: "Total",
    workedOutAs: "Worked out as:",
    goldWord: "Gold",
    makingWord: "Making",
    vatWord: "VAT",
    unitWords: { bhori: "bhori", ana: "ana", roti: "roti", point: "point" },
    gramUnit: "g",
    roundingNote: "Money is rounded to the paisa and weights to 4 decimals for display only.",
    scopeNote:
      "Not included: wastage (khad), stone weight, discounts, or the deduction a shop makes when it buys old gold back.",
    errLabels: {
      bhori: "bhori",
      ana: "ana",
      roti: "roti",
      point: "point",
      grams: "weight in grams",
      price: "price per bhori",
      making: "making charge",
      vat: "VAT",
    },
    errNoWeight: "Enter a weight: at least one of bhori, ana, roti or point.",
    errNoGrams: "Enter the weight in grams.",
    errZero: "0 or more",
    errPositive: "more than ৳0",
    errPercentMax: "100% or less",
    errMoneyMax: (max: string) => `${max} or less`,
    errWeightMax: (max: string) => `${max} g or less in total`,
    shareTitle: "Gold price calculated with HisabBD",
    shareValue: (weight: string, grams: string, purity: string, price: string, total: string) =>
      `${weight} (${grams}) of ${purity} gold at ${price} a bhori: ${total} in total. Calculated with HisabBD’s Gold Price & Bhori Calculator.`,
    shareConvert: (traditional: string, grams: string, bhori: string) =>
      `${traditional} = ${grams} (${bhori} bhori). Calculated with HisabBD’s Gold Price & Bhori Calculator.`,
  },
  bn: {
    submit: { value: "দাম হিসাব করুন", convert: "ওজন রূপান্তর করুন" },
    modeLegend: "কী করতে চান?",
    modes: { value: "সোনার দাম", convert: "একক রূপান্তর" },
    modeSentence: {
      value: "ওজন আর আজকের প্রতি ভরির দাম দিয়ে গয়না বা সোনার দাম বের করুন।",
      convert: "ভরি, আনা, রতি, পয়েন্ট আর গ্রামের মধ্যে রূপান্তর করুন।",
    },
    unitLegend: "ওজনের একক",
    units: { traditional: "ভরি, আনা, রতি", gram: "গ্রাম" },
    fields: { bhori: "ভরি", ana: "আনা", roti: "রতি", point: "পয়েন্ট", grams: "ওজন (গ্রাম)" },
    weightHint: "যা জানেন শুধু সেটুকু লিখুন; ফাঁকা ঘর 0 ধরা হবে। 1 ভরি = 16 আনা, 1 আনা = 6 রতি, 1 রতি = 10 পয়েন্ট।",
    gramsHint: "1 ভরি = 11.664 গ্রাম।",
    gramsPlaceholder: "যেমন 10",
    purity: "সোনার মান",
    purities: { "22k": "22 ক্যারেট", "21k": "21 ক্যারেট", "18k": "18 ক্যারেট", traditional: "সনাতন পদ্ধতি" },
    purityShort: { "22k": "22 ক্যারেট", "21k": "21 ক্যারেট", "18k": "18 ক্যারেট", traditional: "সনাতন" },
    price: "প্রতি ভরির দাম",
    pricePlaceholder: "যেমন 2,20,000",
    priceHint: (purity: string) => `বাজুস-এর আজকের ${purity} সোনার দাম, প্রতি ভরি (11.664 গ্রাম)।`,
    makingLegend: "মজুরি যেভাবে",
    makingTypes: { percent: "দামের %", "per-bhori": "প্রতি ভরি ৳" },
    making: "মজুরি (ঐচ্ছিক)",
    makingPlaceholder: { percent: "যেমন 8", "per-bhori": "যেমন 5,000" },
    makingHint: "দোকান থেকে জেনে নিন; ডিজাইনভেদে আলাদা হয়। না থাকলে ফাঁকা রাখুন।",
    vatType: "ভ্যাট",
    vatTypes: {
      included: "দামের মধ্যেই ধরা (বাজুস)",
      percent: "বিলের ওপর % হারে ভ্যাট যোগ",
      "per-bhori": "প্রতি ভরি ৳ হিসেবে ভ্যাট যোগ",
    },
    vatHints: {
      included: "জুন 2026 থেকে বাজুস-এর দামে ভ্যাট ধরা থাকে, দোকান আলাদা করে ভ্যাট নিতে পারে না।",
      percent: "বিলে যে হার লেখা সেটি দিন। সোনার দাম ও মজুরির যোগফলের ওপর ধরা হবে।",
      "per-bhori": "বিলে প্রতি ভরিতে যত টাকা লেখা সেটি দিন।",
    },
    vatRate: { percent: "ভ্যাটের হার", "per-bhori": "প্রতি ভরিতে ভ্যাট" },
    vatPlaceholder: { percent: "যেমন 5", "per-bhori": "যেমন 2,500" },
    sourcesValue: "সোনার দাম ঘন ঘন বদলায়, তাই কোনো দাম আগে থেকে বসানো নেই। আজকের প্রতি ভরির দাম দেখুন:",
    bajusName: "বাজুস (bajus.org)",
    sourcesVat: (date: string) =>
      `2026-27 অর্থবছরের বাজেট থেকে সোনায় ভ্যাট প্রতি ভরি নির্দিষ্ট ৳2,500, যা বাজুস-এর দামের মধ্যেই ধরা (${date}-এ যাচাই করা):`,
    sourcesUnits: "1 ভরি (তোলা) = 11.664 গ্রাম = 16 আনা = 96 রতি = 960 পয়েন্ট। বাংলাদেশের স্বর্ণকাররা এই এককগুলোই ব্যবহার করেন।",
    announceValue: (total: string) => `মোট দাম ${total}।`,
    announceConvert: (grams: string, traditional: string) => `${traditional} = ${grams}।`,
    placeholderTitleFirst: { value: "সোনার দাম এখানে দেখা যাবে", convert: "রূপান্তর এখানে দেখা যাবে" },
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: {
      value: "ওজন আর প্রতি ভরির দাম লিখে “দাম হিসাব করুন” চাপুন।",
      convert: "ভরি, আনা, রতি, পয়েন্ট বা গ্রামে ওজন লিখে “ওজন রূপান্তর করুন” চাপুন।",
    },
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitleValue: (purity: string) => `${purity} সোনার দাম`,
    resultTitleConvert: "ওজন",
    statWeight: "ওজন",
    statGrams: "গ্রামে",
    statBhori: "ভরিতে",
    statTraditional: "ভরি, আনা, রতি, পয়েন্ট",
    statTotalAna: "আনায়",
    statTotalRoti: "রতিতে",
    statTotalPoint: "পয়েন্টে",
    statPrice: "প্রতি ভরির দাম",
    statGoldValue: "সোনার দাম",
    statMaking: "মজুরি",
    statVat: "ভ্যাট",
    vatIncluded: "দামের মধ্যেই ধরা",
    statTotal: "মোট",
    workedOutAs: "যেভাবে হিসাব হলো:",
    goldWord: "সোনা",
    makingWord: "মজুরি",
    vatWord: "ভ্যাট",
    unitWords: { bhori: "ভরি", ana: "আনা", roti: "রতি", point: "পয়েন্ট" },
    gramUnit: "গ্রাম",
    roundingNote: "টাকা পয়সা পর্যন্ত আর ওজন 4 দশমিক ঘর পর্যন্ত শুধু দেখানোর জন্য রাউন্ড করা।",
    scopeNote: "এতে ধরা নেই: খাদ, পাথরের ওজন, ছাড়, কিংবা পুরোনো সোনা বিক্রির সময় দোকানের কাটা অংশ।",
    errLabels: {
      bhori: "ভরি",
      ana: "আনা",
      roti: "রতি",
      point: "পয়েন্ট",
      grams: "গ্রামে ওজন",
      price: "প্রতি ভরির দাম",
      making: "মজুরি",
      vat: "ভ্যাট",
    },
    errNoWeight: "ওজন লিখুন: ভরি, আনা, রতি বা পয়েন্টের অন্তত একটি।",
    errNoGrams: "গ্রামে ওজন লিখুন।",
    errZero: "0 বা তার বেশি",
    errPositive: "৳0-এর বেশি",
    errPercentMax: "100% বা তার কম",
    errMoneyMax: (max: string) => `${max} বা তার কম`,
    errWeightMax: (max: string) => `মোট ${max} গ্রাম বা তার কম`,
    shareTitle: "HisabBD দিয়ে সোনার দাম হিসাব",
    shareValue: (weight: string, grams: string, purity: string, price: string, total: string) =>
      `${weight} (${grams}) ${purity} সোনা, প্রতি ভরি ${price}: মোট ${total}। HisabBD-র সোনার দাম ও ভরি ক্যালকুলেটরে হিসাব করা।`,
    shareConvert: (traditional: string, grams: string, bhori: string) =>
      `${traditional} = ${grams} (${bhori} ভরি)। HisabBD-র সোনার দাম ও ভরি ক্যালকুলেটরে হিসাব করা।`,
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

/** "2 bhori 5 ana 3 roti", leaving out zero parts (but never empty). */
function traditionalText(t: Strings, w: TraditionalWeight): string {
  const parts = TRADITIONAL_FIELDS.filter((key) => w[key] !== 0).map(
    (key) => `${formatNumber(w[key], { decimals: 2 })} ${t.unitWords[key]}`,
  );
  return parts.length > 0 ? parts.join(" ") : `0 ${t.unitWords.point}`;
}

function gramsText(t: Strings, grams: number): string {
  return `${formatNumber(grams, { decimals: 4 })} ${t.gramUnit}`;
}

function bhoriNumber(bhori: number): string {
  return formatNumber(bhori, { decimals: 6 });
}

function errorMessage(t: Strings, locale: Locale, error: GoldError, makingType: GoldChargeType, vatType: GoldVatType) {
  if (error.code === "no-weight") return error.field === "grams" ? t.errNoGrams : t.errNoWeight;
  const label = t.errLabels[error.field];
  const percentRule = { label, min: t.errZero, max: t.errPercentMax };
  const moneyRule = { label, min: t.errZero, max: t.errMoneyMax(formatTaka(MAX_PRICE_PER_BHORI)) };
  switch (error.field) {
    case "price":
      return numberErrorMessage(error.code, { ...moneyRule, min: t.errPositive }, locale);
    case "making":
      return numberErrorMessage(error.code, makingType === "percent" ? percentRule : moneyRule, locale);
    case "vat":
      return numberErrorMessage(error.code, vatType === "percent" ? percentRule : moneyRule, locale);
    default:
      return numberErrorMessage(
        error.code,
        { label, min: t.errZero, max: t.errWeightMax(formatNumber(MAX_WEIGHT_GRAMS)) },
        locale,
      );
  }
}

function shareValueText(t: Strings, r: GoldValueResult): string {
  return t.shareValue(
    traditionalText(t, r.weight.breakdown),
    gramsText(t, r.weight.grams),
    t.purityShort[r.purity],
    money(r.pricePerBhori),
    money(r.total),
  );
}

function shareConvertText(t: Strings, w: GoldWeight): string {
  return t.shareConvert(traditionalText(t, w.breakdown), gramsText(t, w.grams), bhoriNumber(w.bhori));
}

export function GoldCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [mode, setMode] = usePreference(MODE_PREF);
  const [unit, setUnit] = usePreference(UNIT_PREF);
  const [purity, setPurity] = usePreference(PURITY_PREF);
  const [weight, setWeight] = useState<Record<"bhori" | "ana" | "roti" | "point" | "grams", string>>({
    bhori: "",
    ana: "",
    roti: "",
    point: "",
    grams: "",
  });
  const [price, setPrice] = useState("");
  const [makingType, setMakingType] = useState<GoldChargeType>("percent");
  const [making, setMaking] = useState("");
  const [vatType, setVatType] = useState<GoldVatType>("included");
  const [vat, setVat] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<GoldField, React.RefObject<HTMLInputElement | null>> = {
    bhori: useRef<HTMLInputElement>(null),
    ana: useRef<HTMLInputElement>(null),
    roti: useRef<HTMLInputElement>(null),
    point: useRef<HTMLInputElement>(null),
    grams: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
    making: useRef<HTMLInputElement>(null),
    vat: useRef<HTMLInputElement>(null),
  };
  const { record } = useCalculationHistory();

  const weightInput: GoldWeightInput = { unit, ...weight };
  const valueInput = { weight: weightInput, purity, price, makingType, making, vatType, vat };
  const run = () => (mode === "value" ? calculateGoldValue(valueInput) : convertGoldWeight(weightInput));
  const calc = submitted ? run() : null;
  const errorFor = (field: GoldField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error, makingType, vatType) : undefined;
  };
  const valueResult = calc?.ok && "result" in calc ? calc.result : null;
  const convertResult = calc?.ok && "weight" in calc ? calc.weight : null;
  const checkedOn = parsePlainDate(GOLD_RULES_CHECKED_ON);
  const checkedOnText = checkedOn ? formatPlainDate(checkedOn, { locale }) : GOLD_RULES_CHECKED_ON;

  function changeMode(next: GoldMode) {
    setMode(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  function changeUnit(next: GoldWeightUnit) {
    setUnit(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  function setWeightField(field: keyof typeof weight, value: string) {
    setWeight((current) => ({ ...current, [field]: value }));
  }

  function onSubmit() {
    setSubmitted(true);
    const check = run();
    if (check.ok) {
      setRevealCount((n) => n + 1);
      const weightValues: Record<string, string> =
        unit === "gram"
          ? { grams: weight.grams }
          : { bhori: weight.bhori, ana: weight.ana, roti: weight.roti, point: weight.point };
      if ("result" in check) {
        const vatValue: Record<string, string> = vatType === "included" ? {} : { vat };
        record(
          { mode, unit, purity, ...weightValues, price, makingType, making, vatType, ...vatValue },
          shareValueText(t, check.result),
        );
      } else {
        record({ mode, unit, ...weightValues }, shareConvertText(t, check.weight));
      }
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedMode = MODE_ORDER.find((m) => m === saved.mode);
    const savedUnit = UNIT_ORDER.find((u) => u === saved.unit);
    const savedPurity = GOLD_PURITIES.find((p) => p === saved.purity);
    if (savedMode) setMode(savedMode);
    if (savedUnit) setUnit(savedUnit);
    if (savedPurity) setPurity(savedPurity);
    setWeight({ bhori: text("bhori"), ana: text("ana"), roti: text("roti"), point: text("point"), grams: text("grams") });
    setPrice(text("price"));
    setMakingType(MAKING_ORDER.find((m) => m === saved.makingType) ?? "percent");
    setMaking(text("making"));
    setVatType(VAT_ORDER.find((v) => v === saved.vatType) ?? "included");
    setVat(text("vat"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered mode, unit and purity stay. */
  function onReset() {
    setWeight({ bhori: "", ana: "", roti: "", point: "", grams: "" });
    setPrice("");
    setMakingType("percent");
    setMaking("");
    setVatType("included");
    setVat("");
    setSubmitted(false);
    setRevealCount(0);
    (unit === "gram" ? refs.grams : refs.bhori).current?.focus();
  }

  /** Render prop for a FormField holding a numeric AffixInput. */
  function numberInput(
    field: GoldField,
    value: string,
    onChange: (v: string) => void,
    affix: { prefix?: string; suffix?: string },
    placeholder?: string,
  ) {
    return function renderNumberInput(control: FieldControl) {
      return (
        <AffixInput
          {...control}
          ref={refs[field]}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          {...affix}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    };
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit[mode]}>
        <SegmentedControl
          name="gold-mode"
          legend={t.modeLegend}
          options={MODE_ORDER.map((value) => ({ value, label: t.modes[value] }))}
          value={mode}
          onChange={changeMode}
        />
        <p className="mt-3 text-slate-700">{t.modeSentence[mode]}</p>

        <div className="mt-4">
          <SegmentedControl
            name="gold-unit"
            legend={t.unitLegend}
            options={UNIT_ORDER.map((value) => ({ value, label: t.units[value] }))}
            value={unit}
            onChange={changeUnit}
          />
        </div>

        {unit === "traditional" ? (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TRADITIONAL_FIELDS.map((field) => (
                <FormField key={field} id={FIELD_IDS[field]} label={t.fields[field]} error={errorFor(field)}>
                  {numberInput(field, weight[field], (v) => setWeightField(field, v), {}, "0")}
                </FormField>
              ))}
            </div>
            <p className="mt-1.5 text-sm text-slate-600">{t.weightHint}</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <FormField id={FIELD_IDS.grams} label={t.fields.grams} hint={t.gramsHint} error={errorFor("grams")}>
              {numberInput("grams", weight.grams, (v) => setWeightField("grams", v), { suffix: t.gramUnit }, t.gramsPlaceholder)}
            </FormField>
          </div>
        )}

        {mode === "value" && (
          <>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <FormField id={PURITY_ID} label={t.purity}>
                {(control) => (
                  <Select
                    {...control}
                    value={purity}
                    onChange={(event) => setPurity(GOLD_PURITIES.find((p) => p === event.target.value) ?? "22k")}
                  >
                    {GOLD_PURITIES.map((id) => (
                      <option key={id} value={id}>
                        {t.purities[id]}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField
                id={FIELD_IDS.price}
                label={t.price}
                hint={t.priceHint(t.purityShort[purity])}
                error={errorFor("price")}
              >
                {numberInput("price", price, setPrice, { prefix: "৳" }, t.pricePlaceholder)}
              </FormField>
            </div>

            <div className="mt-5">
              <SegmentedControl
                name="gold-making-type"
                legend={t.makingLegend}
                options={MAKING_ORDER.map((value) => ({ value, label: t.makingTypes[value] }))}
                value={makingType}
                onChange={setMakingType}
              />
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <FormField id={FIELD_IDS.making} label={t.making} hint={t.makingHint} error={errorFor("making")}>
                {numberInput(
                  "making",
                  making,
                  setMaking,
                  makingType === "percent" ? { suffix: "%" } : { prefix: "৳" },
                  t.makingPlaceholder[makingType],
                )}
              </FormField>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <FormField id={VAT_TYPE_ID} label={t.vatType} hint={t.vatHints[vatType]}>
                {(control) => (
                  <Select
                    {...control}
                    value={vatType}
                    onChange={(event) => setVatType(VAT_ORDER.find((v) => v === event.target.value) ?? "included")}
                  >
                    {VAT_ORDER.map((id) => (
                      <option key={id} value={id}>
                        {t.vatTypes[id]}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              {vatType !== "included" && (
                <FormField id={FIELD_IDS.vat} label={t.vatRate[vatType]} error={errorFor("vat")}>
                  {numberInput(
                    "vat",
                    vat,
                    setVat,
                    vatType === "percent" ? { suffix: "%" } : { prefix: "৳" },
                    t.vatPlaceholder[vatType],
                  )}
                </FormField>
              )}
            </div>
          </>
        )}

        {mode === "value" ? (
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>
              {t.sourcesValue}{" "}
              <a href={BAJUS_SOURCE.url} target="_blank" rel="noopener" className={link}>
                {t.bajusName}
              </a>
              .
            </p>
            <p>
              {t.sourcesVat(checkedOnText)}{" "}
              {GOLD_VAT_SOURCES.map((source, index) => (
                <span key={source.url}>
                  {index > 0 && "; "}
                  <a href={source.url} target="_blank" rel="noopener" className={link}>
                    {source.title}
                  </a>
                </span>
              ))}
              .
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">{t.sourcesUnits}</p>
        )}
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          valueResult
            ? t.announceValue(money(valueResult.total))
            : convertResult
              ? t.announceConvert(gramsText(t, convertResult.grams), traditionalText(t, convertResult.breakdown))
              : ""
        }
        result={
          valueResult ? (
            <GoldValueView result={valueResult} />
          ) : convertResult ? (
            <GoldConvertView weight={convertResult} enteredIn={unit} />
          ) : null
        }
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst[mode]}
            preview={<p className="font-display text-4xl font-bold tracking-tight">{mode === "value" ? "৳–" : "–"}</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst[mode]}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function GoldValueView({ result: r }: { result: GoldValueResult }) {
  const t = STRINGS[useLocale()];
  const purity = t.purityShort[r.purity];
  const weight = `${traditionalText(t, r.weight.breakdown)} (${gramsText(t, r.weight.grams)})`;
  const stats = [
    { label: t.statWeight, value: weight, wide: true },
    { label: t.statPrice, value: money(r.pricePerBhori) },
    { label: t.statGoldValue, value: money(r.goldValue) },
    { label: t.statMaking, value: money(r.makingCharge) },
    { label: t.statVat, value: r.vatType === "included" ? t.vatIncluded : money(r.vat) },
  ];
  const bhori = bhoriNumber(r.weight.bhori);
  const lines = [`${t.goldWord} = ${bhori} × ${money(r.pricePerBhori)} = ${money(r.goldValue)}`];
  if (r.makingCharge > 0) {
    lines.push(
      r.makingType === "percent"
        ? `${t.makingWord} = ${money(r.goldValue)} × ${formatNumber(r.makingRate, { decimals: 4 })}% = ${money(r.makingCharge)}`
        : `${t.makingWord} = ${bhori} × ${money(r.makingRate)} = ${money(r.makingCharge)}`,
    );
  }
  if (r.vatType !== "included") {
    lines.push(
      r.vatType === "percent"
        ? `${t.vatWord} = ${money(r.goldValue + r.makingCharge)} × ${formatNumber(r.vatRate, { decimals: 4 })}% = ${money(r.vat)}`
        : `${t.vatWord} = ${bhori} × ${money(r.vatRate)} = ${money(r.vat)}`,
    );
  }
  lines.push(
    `${t.statTotal} = ${[r.goldValue, r.makingCharge, r.vat].filter((v, i) => i === 0 || v > 0).map(money).join(" + ")} = ${money(r.total)}`,
  );
  const text = shareValueText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitleValue(purity)}
        titleId="gold-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(r.total)}</p>}
      >
        <ResultStats items={stats} />
        <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-slate-800">
          <p className="text-sm text-slate-600">{t.workedOutAs}</p>
          {lines.map((line) => (
            <p key={line} className="font-medium break-words">
              {line}
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">{t.roundingNote}</p>
        <p className="mt-1 text-sm text-slate-600">{t.scopeNote}</p>
      </ResultPanel>
      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

function GoldConvertView({ weight: w, enteredIn }: { weight: GoldWeight; enteredIn: GoldWeightUnit }) {
  const t = STRINGS[useLocale()];
  const traditional = traditionalText(t, w.breakdown);
  const grams = gramsText(t, w.grams);
  const stats = [
    enteredIn === "gram" ? { label: t.statGrams, value: grams } : { label: t.statTraditional, value: traditional },
    { label: t.statBhori, value: bhoriNumber(w.bhori) },
    { label: t.statTotalAna, value: formatNumber(w.totalAna, { decimals: 4 }) },
    { label: t.statTotalRoti, value: formatNumber(w.totalRoti, { decimals: 4 }) },
    { label: t.statTotalPoint, value: formatNumber(w.totalPoint, { decimals: 2 }) },
  ];
  const text = shareConvertText(t, w);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitleConvert}
        titleId="gold-result-heading"
        value={
          <p className="font-display text-4xl font-bold tracking-tight break-words sm:text-5xl">
            {enteredIn === "gram" ? traditional : grams}
          </p>
        }
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.roundingNote}</p>
      </ResultPanel>
      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

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
import { formatNumber } from "@/lib/format";
import { normalizeDigits } from "@/lib/number";
import { choicePreference, numberPreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  AREA_UNIT_ORDER,
  calculateLand,
  KATHA_PER_BIGHA,
  LENGTH_UNIT_ORDER,
  SHAPE_FIELDS,
  STANDARD_KATHA_SQ_FT,
  type AreaUnit,
  type LandError,
  type LandField,
  type LandInput,
  type LandMode,
  type LandResult,
  type LandShape,
  type LengthField,
  type LengthUnit,
} from "./logic";

const FIELD_IDS: Record<LandField, string> = {
  amount: "land-amount",
  length: "land-length",
  width: "land-width",
  north: "land-north",
  south: "land-south",
  east: "land-east",
  west: "land-west",
  sideA: "land-side-a",
  sideB: "land-side-b",
  sideC: "land-side-c",
  kathaSize: "land-katha-size",
};
const UNIT_SELECT_ID = "land-unit";

const MODE_ORDER: readonly LandMode[] = ["convert", "measure"];
const SHAPE_ORDER: readonly LandShape[] = ["rectangle", "four-sides", "triangle"];

/** Settings remembered in this browser (never the areas or measurements typed). */
const SCOPE = "land-calculator";
const MODE_PREF = choicePreference(SCOPE, "mode", MODE_ORDER, "convert");
const UNIT_PREF = choicePreference(SCOPE, "unit", AREA_UNIT_ORDER, "decimal");
const SHAPE_PREF = choicePreference(SCOPE, "shape", SHAPE_ORDER, "rectangle");
const LENGTH_UNIT_PREF = choicePreference(SCOPE, "length-unit", LENGTH_UNIT_ORDER, "ft");
/** The katha size is a unit definition, so it is remembered too. */
const KATHA_PREF = numberPreference(SCOPE, "katha-size", { min: 1, max: 10000 }, String(STANDARD_KATHA_SQ_FT));

/** The figures people ask for most, shown large: শতাংশ, কাঠা, বর্গফুট. */
const HEADLINE_UNITS: readonly AreaUnit[] = ["decimal", "katha", "sqft"];

/** Display decimals per unit: 4 for the land units, 2 for the small square units. */
const UNIT_DECIMALS: Record<AreaUnit, number> = {
  sqft: 2,
  sqm: 2,
  sqyd: 2,
  decimal: 4,
  ojutangsho: 2,
  katha: 4,
  bigha: 4,
  acre: 4,
  hectare: 4,
};

const EMPTY_LENGTHS: Record<LengthField, string> = {
  length: "",
  width: "",
  north: "",
  south: "",
  east: "",
  west: "",
  sideA: "",
  sideB: "",
  sideC: "",
};
const LENGTH_FIELDS = Object.keys(EMPTY_LENGTHS) as LengthField[];

interface FieldText {
  label: string;
  /** Lower-case name used inside error sentences. */
  noun: string;
  placeholder: string;
}

const STRINGS = {
  en: {
    submit: "Calculate area",
    modeLegend: "What do you want to do?",
    modes: { convert: "Convert units", measure: "Area from measurements" } as Record<LandMode, string>,
    amountLabel: "Area",
    amountNoun: "area",
    amountPlaceholder: "e.g. 5",
    unitLabel: "Unit",
    shapeLegend: "Shape of the plot",
    shapes: {
      rectangle: "Rectangle",
      "four-sides": "Four sides (approx.)",
      triangle: "Triangle",
    } as Record<LandShape, string>,
    shapeHints: {
      rectangle: "For a plot with square corners: enter the length and the width.",
      "four-sides":
        "Approximate. The north and south sides are averaged, the east and west sides are averaged, and the two averages are multiplied. Best for plots that are close to a rectangle.",
      triangle: "Enter all three sides. The area is worked out with Heron’s formula.",
    } as Record<LandShape, string>,
    lengthUnitLegend: "Sides measured in",
    lengthUnits: { ft: "Feet", haat: "Haat", yard: "Goj (yard)", m: "Metres" } as Record<LengthUnit, string>,
    lengthSuffix: { ft: "ft", haat: "haat", yard: "goj", m: "m" } as Record<LengthUnit, string>,
    lengthFactor: {
      ft: "",
      haat: "1 haat (cubit) = 18 inches = 1.5 ft.",
      yard: "1 goj (yard) = 3 ft.",
      m: "1 metre ≈ 3.2808 ft.",
    } as Record<LengthUnit, string>,
    fields: {
      length: { label: "Length", noun: "length", placeholder: "e.g. 60" },
      width: { label: "Width", noun: "width", placeholder: "e.g. 40" },
      north: { label: "North side", noun: "north side", placeholder: "e.g. 60" },
      south: { label: "South side", noun: "south side", placeholder: "e.g. 64" },
      east: { label: "East side", noun: "east side", placeholder: "e.g. 40" },
      west: { label: "West side", noun: "west side", placeholder: "e.g. 44" },
      sideA: { label: "Side 1", noun: "first side", placeholder: "e.g. 30" },
      sideB: { label: "Side 2", noun: "second side", placeholder: "e.g. 40" },
      sideC: { label: "Side 3", noun: "third side", placeholder: "e.g. 50" },
    } as Record<LengthField, FieldText>,
    kathaLabel: "Size of 1 katha",
    kathaNoun: "katha size",
    kathaSuffix: "sq ft",
    kathaHint:
      "720 sq ft is the standard katha in Bangladesh, and 1 bigha = 20 katha. The katha has varied by region, so if your deed or local surveyor uses a different size, enter it here. Only katha and bigha change.",
    unitNames: {
      sqft: "Square feet (sq ft)",
      sqm: "Square metres (sq m)",
      sqyd: "Square yards (sq yd)",
      decimal: "Decimal (shotangsho / shotok)",
      ojutangsho: "Ojutangsho (1/100 decimal)",
      katha: "Katha",
      bigha: "Bigha",
      acre: "Acre",
      hectare: "Hectare",
    } as Record<AreaUnit, string>,
    unitShort: {
      sqft: "sq ft",
      sqm: "sq m",
      sqyd: "sq yd",
      decimal: "decimal",
      ojutangsho: "ojutangsho",
      katha: "katha",
      bigha: "bigha",
      acre: "acre",
      hectare: "hectare",
    } as Record<AreaUnit, string>,
    errMoreThanZero: "more than 0",
    errKathaMin: "at least 1 sq ft",
    errKathaMax: "10,000 sq ft or less",
    errAreaTooLarge:
      "That area is more than the calculator can handle. Keep the total to 1,00,00,00,00,000 sq ft (10^12) or less.",
    errNotTriangle:
      "These three sides can’t make a triangle: the longest side must be shorter than the other two added together. Check the measurements.",
    placeholderTitleFirst: "The area will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter an area and its unit, or the plot’s measurements, then select Calculate area.",
    placeholderFix: "Fix the highlighted fields above and the area will show here.",
    convertTitle: (amount: string, unit: string) => `${amount} ${unit} in every unit`,
    measureTitles: {
      rectangle: "Area of the rectangular plot",
      "four-sides": "Approximate area of the plot",
      triangle: "Area of the triangular plot",
    } as Record<LandShape, string>,
    convertSentence: (lhs: string, chain: string) => `${lhs} = ${chain}.`,
    measureSentence: (chain: string, approximate: boolean) =>
      approximate ? `The plot is about ${chain}.` : `The plot is ${chain}.`,
    approxNote:
      "This uses the average of opposite sides, a shortcut that is close for plots near a rectangle but not exact for slanted or uneven shapes. For a more exact figure, split the plot into triangles along a diagonal.",
    tableCaption: "The same area in every unit",
    tableUnit: "Unit",
    tableArea: "Area",
    sidesEntered: "Sides entered",
    sidesInFeet: "Sides in feet",
    sidesFour: (n: string, s: string, e: string, w: string, u: string) => `N ${n}, S ${s}, E ${e}, W ${w} ${u}`,
    heron: (a: string, b: string, c: string, ft: string, area: string, sqft: string) =>
      `Heron’s formula with sides ${a}, ${b} and ${c} ${ft} = ${area} ${sqft}`,
    workedOutAs: "Worked out as:",
    kathaNoteStandard: "Using the standard katha of 720 sq ft, so 1 bigha = 20 katha = 14,400 sq ft.",
    kathaNoteCustom: (k: string, b: string) =>
      `Using your katha size of ${k} sq ft, so 1 bigha = 20 katha = ${b} sq ft. Only katha and bigha use this setting.`,
    disclaimer:
      "For estimates only. Confirm with a government surveyor and the deed (dalil) and khatian before buying, selling or registering land.",
    shareSides: (sides: string) => `Plot sides: ${sides}.`,
    shareKatha: (k: string) => `Katha size used: ${k} sq ft.`,
    shareSuffix: "An estimate; confirm with a surveyor and the deed. Calculated with HisabBD’s Land Area Calculator.",
    shareTitle: "Land area calculated with HisabBD",
  },
  bn: {
    submit: "জমির হিসাব করুন",
    modeLegend: "কী করতে চান?",
    modes: { convert: "একক রূপান্তর", measure: "মাপ দিয়ে জমি" } as Record<LandMode, string>,
    amountLabel: "জমির পরিমাণ",
    amountNoun: "জমির পরিমাণ",
    amountPlaceholder: "যেমন 5",
    unitLabel: "একক",
    shapeLegend: "জমির আকার",
    shapes: {
      rectangle: "আয়তাকার",
      "four-sides": "চার দিক (আনুমানিক)",
      triangle: "ত্রিভুজ",
    } as Record<LandShape, string>,
    shapeHints: {
      rectangle: "কোনাগুলো সমকোণ হলে দৈর্ঘ্য আর প্রস্থ লিখুন।",
      "four-sides":
        "আনুমানিক হিসাব। উত্তর ও দক্ষিণ দিকের গড়, আর পূর্ব ও পশ্চিম দিকের গড় নিয়ে গুণ করা হয়। প্রায়-আয়তাকার জমিতে সবচেয়ে ভালো কাজ করে।",
      triangle: "তিনটি বাহুর মাপই লিখুন। হেরনের সূত্রে ক্ষেত্রফল বের করা হয়।",
    } as Record<LandShape, string>,
    lengthUnitLegend: "যে এককে মাপা হয়েছে",
    lengthUnits: { ft: "ফুট", haat: "হাত", yard: "গজ", m: "মিটার" } as Record<LengthUnit, string>,
    lengthSuffix: { ft: "ফুট", haat: "হাত", yard: "গজ", m: "মি" } as Record<LengthUnit, string>,
    lengthFactor: {
      ft: "",
      haat: "1 হাত = 18 ইঞ্চি = 1.5 ফুট।",
      yard: "1 গজ = 3 ফুট।",
      m: "1 মিটার ≈ 3.2808 ফুট।",
    } as Record<LengthUnit, string>,
    fields: {
      length: { label: "দৈর্ঘ্য", noun: "দৈর্ঘ্য", placeholder: "যেমন 60" },
      width: { label: "প্রস্থ", noun: "প্রস্থ", placeholder: "যেমন 40" },
      north: { label: "উত্তর দিক", noun: "উত্তর দিকের মাপ", placeholder: "যেমন 60" },
      south: { label: "দক্ষিণ দিক", noun: "দক্ষিণ দিকের মাপ", placeholder: "যেমন 64" },
      east: { label: "পূর্ব দিক", noun: "পূর্ব দিকের মাপ", placeholder: "যেমন 40" },
      west: { label: "পশ্চিম দিক", noun: "পশ্চিম দিকের মাপ", placeholder: "যেমন 44" },
      sideA: { label: "বাহু 1", noun: "প্রথম বাহু", placeholder: "যেমন 30" },
      sideB: { label: "বাহু 2", noun: "দ্বিতীয় বাহু", placeholder: "যেমন 40" },
      sideC: { label: "বাহু 3", noun: "তৃতীয় বাহু", placeholder: "যেমন 50" },
    } as Record<LengthField, FieldText>,
    kathaLabel: "1 কাঠার মাপ",
    kathaNoun: "কাঠার মাপ",
    kathaSuffix: "বর্গফুট",
    kathaHint:
      "বাংলাদেশে প্রচলিত কাঠা 720 বর্গফুট, আর 1 বিঘা = 20 কাঠা। এলাকাভেদে কাঠার মাপ আলাদা হতে পারে, তাই আপনার দলিলে বা স্থানীয় আমিন অন্য মাপ ধরলে সেটি এখানে লিখুন। শুধু কাঠা আর বিঘার হিসাব বদলাবে।",
    unitNames: {
      sqft: "বর্গফুট",
      sqm: "বর্গমিটার",
      sqyd: "বর্গগজ",
      decimal: "শতাংশ (শতক / ডেসিমাল)",
      ojutangsho: "অযুতাংশ (শতাংশের 100 ভাগের 1)",
      katha: "কাঠা",
      bigha: "বিঘা",
      acre: "একর",
      hectare: "হেক্টর",
    } as Record<AreaUnit, string>,
    unitShort: {
      sqft: "বর্গফুট",
      sqm: "বর্গমিটার",
      sqyd: "বর্গগজ",
      decimal: "শতাংশ",
      ojutangsho: "অযুতাংশ",
      katha: "কাঠা",
      bigha: "বিঘা",
      acre: "একর",
      hectare: "হেক্টর",
    } as Record<AreaUnit, string>,
    errMoreThanZero: "0-এর বেশি",
    errKathaMin: "কমপক্ষে 1 বর্গফুট",
    errKathaMax: "10,000 বর্গফুট বা তার কম",
    errAreaTooLarge:
      "এত বড় জমি ক্যালকুলেটরের সীমার বাইরে। মোট পরিমাণ 1,00,00,00,00,000 বর্গফুট (10^12) বা তার কম রাখুন।",
    errNotTriangle:
      "এই তিন বাহু দিয়ে ত্রিভুজ হয় না: সবচেয়ে লম্বা বাহুটি বাকি দুটির যোগফলের চেয়ে ছোট হতে হবে। মাপগুলো আবার দেখুন।",
    placeholderTitleFirst: "জমির পরিমাণ এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "জমির পরিমাণ ও একক, অথবা জমির মাপ লিখে “জমির হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই জমির পরিমাণ এখানে দেখা যাবে।",
    convertTitle: (amount: string, unit: string) => `${amount} ${unit} সব এককে`,
    measureTitles: {
      rectangle: "আয়তাকার জমির পরিমাণ",
      "four-sides": "জমির আনুমানিক পরিমাণ",
      triangle: "ত্রিভুজাকার জমির পরিমাণ",
    } as Record<LandShape, string>,
    convertSentence: (lhs: string, chain: string) => `${lhs} = ${chain}।`,
    measureSentence: (chain: string, approximate: boolean) =>
      approximate ? `জমির পরিমাণ প্রায় ${chain}।` : `জমির পরিমাণ ${chain}।`,
    approxNote:
      "এখানে বিপরীত দিকগুলোর গড় নেওয়া হয়েছে। প্রায়-আয়তাকার জমিতে এটি কাছাকাছি হয়, কিন্তু হেলানো বা অসমান জমিতে পুরোপুরি সঠিক নয়। আরও সঠিক হিসাবের জন্য কোনাকুনি মেপে জমিকে ত্রিভুজে ভাগ করুন।",
    tableCaption: "একই জমি সব এককে",
    tableUnit: "একক",
    tableArea: "পরিমাণ",
    sidesEntered: "দেওয়া মাপ",
    sidesInFeet: "ফুটে মাপ",
    sidesFour: (n: string, s: string, e: string, w: string, u: string) => `উ ${n}, দ ${s}, পূ ${e}, প ${w} ${u}`,
    heron: (a: string, b: string, c: string, ft: string, area: string, sqft: string) =>
      `হেরনের সূত্রে ${a}, ${b} ও ${c} ${ft} বাহুর ত্রিভুজ = ${area} ${sqft}`,
    workedOutAs: "যেভাবে হিসাব হলো:",
    kathaNoteStandard: "প্রচলিত 720 বর্গফুটের কাঠা ধরা হয়েছে, তাই 1 বিঘা = 20 কাঠা = 14,400 বর্গফুট।",
    kathaNoteCustom: (k: string, b: string) =>
      `আপনার দেওয়া ${k} বর্গফুটের কাঠা ধরা হয়েছে, তাই 1 বিঘা = 20 কাঠা = ${b} বর্গফুট। শুধু কাঠা আর বিঘায় এই মাপ ব্যবহার হয়।`,
    disclaimer:
      "শুধু আনুমানিক হিসাবের জন্য। জমি কেনা, বেচা বা রেজিস্ট্রির আগে সরকারি সার্ভেয়ার দিয়ে মাপ এবং দলিল ও খতিয়ান মিলিয়ে নিশ্চিত হোন।",
    shareSides: (sides: string) => `জমির মাপ: ${sides}।`,
    shareKatha: (k: string) => `কাঠার মাপ ধরা হয়েছে ${k} বর্গফুট।`,
    shareSuffix: "এটি আনুমানিক হিসাব; সার্ভেয়ার ও দলিল দিয়ে নিশ্চিত হোন। HisabBD-র জমির পরিমাপ ক্যালকুলেটরে হিসাব করা।",
    shareTitle: "HisabBD দিয়ে জমির হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

/** Up to `decimals` decimals, trimmed. A non-zero value too small to show is written as "< 0.0001". */
function fmt(value: number, decimals = 4): string {
  const smallest = 10 ** -decimals;
  if (value !== 0 && Math.abs(value) < smallest) return `< ${formatNumber(smallest, { decimals })}`;
  return formatNumber(value, { decimals });
}

function fmtArea(value: number, unit: AreaUnit): string {
  return fmt(value, UNIT_DECIMALS[unit]);
}

function errorMessage(t: Strings, locale: Locale, error: LandError): string {
  switch (error.code) {
    case "not-a-triangle":
      return t.errNotTriangle;
    case "area-too-large":
      return t.errAreaTooLarge;
    default:
      if (error.field === "kathaSize") {
        return numberErrorMessage(error.code, { label: t.kathaNoun, min: t.errKathaMin, max: t.errKathaMax }, locale);
      }
      return numberErrorMessage(
        error.code,
        { label: error.field === "amount" ? t.amountNoun : t.fields[error.field].noun, min: t.errMoreThanZero },
        locale,
      );
  }
}

interface Summary {
  /** Heading above the answer. */
  title: string;
  /** Plain-language sentence with the headline figures (also the announcement). */
  sentence: string;
  /** Formula with the numbers filled in, for measurements only. */
  working: string | null;
  /** Sides as entered, and in feet when another unit was used. */
  sides: string | null;
  sidesFt: string | null;
}

/** "8.2645 decimal = 5 katha = 3,600 sq ft", leaving out the unit converted from. */
function headlineChain(t: Strings, r: LandResult): string {
  return HEADLINE_UNITS.filter((u) => r.mode !== "convert" || u !== r.unit)
    .map((u) => `${fmtArea(r.areas[u], u)} ${t.unitShort[u]}`)
    .join(" = ");
}

function sidesText(t: Strings, shape: LandShape, values: Partial<Record<LengthField, number>>, unit: string): string {
  const v = (field: LengthField) => fmt(values[field] ?? 0);
  switch (shape) {
    case "rectangle":
      return `${v("length")} × ${v("width")} ${unit}`;
    case "four-sides":
      return t.sidesFour(v("north"), v("south"), v("east"), v("west"), unit);
    case "triangle":
      return `${v("sideA")}, ${v("sideB")}, ${v("sideC")} ${unit}`;
  }
}

function summarize(t: Strings, r: LandResult): Summary {
  const chain = headlineChain(t, r);
  if (r.mode === "convert") {
    const lhs = `${fmt(r.amount, 6)} ${t.unitShort[r.unit]}`;
    return {
      title: t.convertTitle(fmt(r.amount, 6), t.unitShort[r.unit]),
      sentence: t.convertSentence(lhs, chain),
      working: null,
      sides: null,
      sidesFt: null,
    };
  }

  const ft = t.lengthSuffix.ft;
  const sqft = t.unitShort.sqft;
  const f = (field: LengthField) => fmt(r.lengthsFt[field] ?? 0);
  const area = fmtArea(r.areaSqFt, "sqft");
  let working: string;
  switch (r.shape) {
    case "rectangle":
      working = `${f("length")} ${ft} × ${f("width")} ${ft} = ${area} ${sqft}`;
      break;
    case "four-sides": {
      const ns = ((r.lengthsFt.north ?? 0) + (r.lengthsFt.south ?? 0)) / 2;
      const ew = ((r.lengthsFt.east ?? 0) + (r.lengthsFt.west ?? 0)) / 2;
      working = `(${f("north")} + ${f("south")}) ÷ 2 × (${f("east")} + ${f("west")}) ÷ 2 = ${fmt(ns)} × ${fmt(ew)} = ${area} ${sqft}`;
      break;
    }
    case "triangle":
      working = t.heron(f("sideA"), f("sideB"), f("sideC"), ft, area, sqft);
      break;
  }
  return {
    title: t.measureTitles[r.shape],
    sentence: t.measureSentence(chain, r.approximate),
    working,
    sides: sidesText(t, r.shape, r.lengths, t.lengthSuffix[r.lengthUnit]),
    sidesFt: r.lengthUnit === "ft" ? null : sidesText(t, r.shape, r.lengthsFt, ft),
  };
}

function shareText(t: Strings, r: LandResult): string {
  const s = summarize(t, r);
  return [s.sides && t.shareSides(s.sides), s.sentence, t.shareKatha(fmt(r.kathaSqFt)), t.shareSuffix]
    .filter(Boolean)
    .join(" ");
}

export function LandCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [mode, setMode] = usePreference(MODE_PREF);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = usePreference(UNIT_PREF);
  const [shape, setShape] = usePreference(SHAPE_PREF);
  const [lengthUnit, setLengthUnit] = usePreference(LENGTH_UNIT_PREF);
  const [lengths, setLengths] = useState<Record<LengthField, string>>(EMPTY_LENGTHS);
  const [rememberedKatha, setRememberedKatha] = usePreference(KATHA_PREF);
  /** The katha size as typed; null = show the remembered size. */
  const [typedKatha, setTypedKatha] = useState<string | null>(null);
  const kathaSize = typedKatha ?? rememberedKatha;
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<LandField, React.RefObject<HTMLInputElement | null>> = {
    amount: useRef<HTMLInputElement>(null),
    length: useRef<HTMLInputElement>(null),
    width: useRef<HTMLInputElement>(null),
    north: useRef<HTMLInputElement>(null),
    south: useRef<HTMLInputElement>(null),
    east: useRef<HTMLInputElement>(null),
    west: useRef<HTMLInputElement>(null),
    sideA: useRef<HTMLInputElement>(null),
    sideB: useRef<HTMLInputElement>(null),
    sideC: useRef<HTMLInputElement>(null),
    kathaSize: useRef<HTMLInputElement>(null),
  };
  const { record } = useCalculationHistory();

  const modeOptions = MODE_ORDER.map((value) => ({ value, label: t.modes[value] }));
  const shapeOptions = SHAPE_ORDER.map((value) => ({ value, label: t.shapes[value] }));
  const lengthUnitOptions = LENGTH_UNIT_ORDER.map((value) => ({ value, label: t.lengthUnits[value] }));

  const input: LandInput =
    mode === "convert" ? { mode, amount, unit, kathaSize } : { mode, shape, lengthUnit, lengths, kathaSize };
  const calc = submitted ? calculateLand(input) : null;
  const errorFor = (field: LandField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  /** A new mode or shape asks a different question, so the old answer is cleared. */
  function changeMode(next: LandMode) {
    setMode(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  function changeShape(next: LandShape) {
    setShape(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  /** Remembers a typed katha size once it is a valid one. */
  function changeKathaSize(value: string) {
    setTypedKatha(value);
    const normalized = normalizeDigits(value).trim();
    if (KATHA_PREF.isValid(normalized)) setRememberedKatha(normalized);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateLand(input);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      const measured: Record<string, string> =
        mode === "convert"
          ? { amount, unit }
          : { shape, lengthUnit, ...Object.fromEntries(SHAPE_FIELDS[shape].map((f) => [f, lengths[f]])) };
      record({ mode, ...measured, kathaSize }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /**
   * Fills the form from a saved calculation and shows its result. Sets the
   * mode and shape directly, since changeMode/changeShape would clear it.
   */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedMode = MODE_ORDER.find((m) => m === saved.mode);
    const savedUnit = AREA_UNIT_ORDER.find((u) => u === saved.unit);
    const savedShape = SHAPE_ORDER.find((s) => s === saved.shape);
    const savedLengthUnit = LENGTH_UNIT_ORDER.find((u) => u === saved.lengthUnit);
    if (savedMode) setMode(savedMode);
    if (savedUnit) setUnit(savedUnit);
    if (savedShape) setShape(savedShape);
    if (savedLengthUnit) setLengthUnit(savedLengthUnit);
    setAmount(text("amount"));
    setLengths(Object.fromEntries(LENGTH_FIELDS.map((f) => [f, text(f)])) as Record<LengthField, string>);
    if (text("kathaSize")) changeKathaSize(text("kathaSize"));
    else setTypedKatha(null);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered mode, units, shape and katha size stay. */
  function onReset() {
    setAmount("");
    setLengths(EMPTY_LENGTHS);
    setTypedKatha(null);
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl name="land-mode" legend={t.modeLegend} options={modeOptions} value={mode} onChange={changeMode} />

        {mode === "convert" ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField id={FIELD_IDS.amount} label={t.amountLabel} error={errorFor("amount")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.amount}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={t.amountPlaceholder}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              )}
            </FormField>
            <FormField id={UNIT_SELECT_ID} label={t.unitLabel}>
              {(control) => (
                <Select {...control} value={unit} onChange={(event) => setUnit(event.target.value as AreaUnit)}>
                  {AREA_UNIT_ORDER.map((value) => (
                    <option key={value} value={value}>
                      {t.unitNames[value]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <div>
              <SegmentedControl
                name="land-shape"
                legend={t.shapeLegend}
                options={shapeOptions}
                value={shape}
                onChange={changeShape}
              />
              <p className="mt-2 text-sm text-slate-600">{t.shapeHints[shape]}</p>
            </div>
            <div>
              <SegmentedControl
                name="land-length-unit"
                legend={t.lengthUnitLegend}
                options={lengthUnitOptions}
                value={lengthUnit}
                onChange={setLengthUnit}
              />
              {t.lengthFactor[lengthUnit] && <p className="mt-2 text-sm text-slate-600">{t.lengthFactor[lengthUnit]}</p>}
            </div>
            <div className={shape === "triangle" ? "grid gap-5 sm:grid-cols-3" : "grid gap-5 sm:grid-cols-2"}>
              {SHAPE_FIELDS[shape].map((field) => (
                <FormField key={field} id={FIELD_IDS[field]} label={t.fields[field].label} error={errorFor(field)}>
                  {(control) => (
                    <AffixInput
                      {...control}
                      ref={refs[field]}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      suffix={t.lengthSuffix[lengthUnit]}
                      placeholder={t.fields[field].placeholder}
                      value={lengths[field]}
                      onChange={(event) => {
                        const value = event.target.value;
                        setLengths((prev) => ({ ...prev, [field]: value }));
                      }}
                    />
                  )}
                </FormField>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-slate-200 pt-5 sm:max-w-sm">
          <FormField id={FIELD_IDS.kathaSize} label={t.kathaLabel} hint={t.kathaHint} error={errorFor("kathaSize")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.kathaSize}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix={t.kathaSuffix}
                value={kathaSize}
                onChange={(event) => changeKathaSize(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? summarize(t, result).sentence : ""}
        result={result && <LandResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function LandResultView({ result: r }: { result: LandResult }) {
  const t = STRINGS[useLocale()];
  const summary = summarize(t, r);
  const stats =
    summary.sides === null
      ? []
      : [
          { label: t.sidesEntered, value: summary.sides, wide: summary.sidesFt === null },
          ...(summary.sidesFt === null ? [] : [{ label: t.sidesInFeet, value: summary.sidesFt }]),
        ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={summary.title}
        titleId="land-result-heading"
        value={
          <div>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {fmtArea(r.areas.decimal, "decimal")}{" "}
              <span className="text-2xl font-semibold sm:text-3xl">{t.unitShort.decimal}</span>
            </p>
            <p className="mt-2 text-xl font-semibold break-words text-slate-800">
              {fmtArea(r.areas.katha, "katha")} {t.unitShort.katha} · {fmtArea(r.areas.sqft, "sqft")} {t.unitShort.sqft}
            </p>
          </div>
        }
      >
        <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">{summary.sentence}</p>
        {r.mode === "measure" && r.approximate && <p className="mt-3 text-sm text-slate-700">{t.approxNote}</p>}

        <div className="mt-5 overflow-x-auto rounded-xl bg-white/70 px-4 py-2">
          <table className="w-full min-w-[16rem] text-left text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 font-medium">
                  {t.tableUnit}
                </th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">
                  {t.tableArea}
                </th>
              </tr>
            </thead>
            <tbody>
              {AREA_UNIT_ORDER.map((u) => (
                <tr key={u} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 font-medium text-slate-900">
                    {t.unitNames[u]}
                  </th>
                  <td className="py-2 pl-3 text-right font-semibold break-all text-slate-900 tabular-nums">
                    {fmtArea(r.areas[u], u)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stats.length > 0 && <ResultStats items={stats} className="mt-5" />}
        {summary.working && (
          <p className="mt-4 text-sm text-slate-600">
            {t.workedOutAs} <span className="font-medium text-slate-800">{summary.working}</span>
          </p>
        )}
        <p className="mt-3 text-sm text-slate-600">
          {r.standardKatha
            ? t.kathaNoteStandard
            : t.kathaNoteCustom(fmt(r.kathaSqFt), fmt(r.kathaSqFt * KATHA_PER_BIGHA))}
        </p>
        <p className="mt-3 text-sm text-slate-600">{t.disclaimer}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

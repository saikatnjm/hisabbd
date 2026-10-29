"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { Button } from "@/components/ui/button";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPercent, formatPlainDate, formatTaka } from "@/lib/format";
import { normalizeDigits, parseNumberInput, roundTo } from "@/lib/number";
import { parsePlainDate } from "@/lib/plain-date";
import { choicePreference, numberPreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  BERC_LIFELINE_REVISION,
  BERC_RETAIL_ORDER,
  calculateElectricityBill,
  defaultTariffInput,
  MAX_DEMAND_RATE,
  MAX_LOAD_KW,
  MAX_METER_RENT,
  MAX_PERCENT,
  MAX_RATE,
  MAX_READING,
  MAX_RECHARGE,
  MAX_UNITS,
  METER_RENT,
  MODES,
  PAYMENTS,
  PHASES,
  RATE_IDS,
  rateField,
  TARIFF_CHECKED_ON,
  TBS_DPDC_METER_CHARGES,
  type ElectricityError,
  type ElectricityField,
  type ElectricityMode,
  type ElectricityResult,
  type Payment,
  type Phase,
  type RateId,
  type TariffField,
  type TariffInput,
} from "./logic";

const SLUG = "electricity-bill-calculator";
const TARIFF_FIELDS: readonly TariffField[] = [...RATE_IDS.map(rateField), "demand-rate", "meter-rent", "vat", "rebate"];
const FIELD_ORDER: readonly ElectricityField[] = ["units", "previous", "current", "amount", "load", ...TARIFF_FIELDS];
/**
 * Remembered in this browser: what you enter (units, readings or a recharge),
 * the meter's phase and payment type, and the sanctioned load (a property of
 * the connection, like a unit setting). Readings, units, recharge amounts and
 * tariff edits go to history only.
 */
const MODE_PREF = choicePreference(SLUG, "mode", MODES, "units");
const PHASE_PREF = choicePreference(SLUG, "phase", PHASES, "single");
const PAYMENT_PREF = choicePreference(SLUG, "payment", PAYMENTS, "postpaid");
const LOAD_PREF = numberPreference(SLUG, "load", { min: 0.01, max: MAX_LOAD_KW.three }, "");

const fieldId = (field: ElectricityField) => `electricity-${field}`;

/** Whole Taka without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

/** A rate per unit, always with 2 decimals: ৳8.50. */
function rateMoney(value: number): string {
  return formatTaka(value, { decimals: 4, minDecimals: 2 });
}

function unitsText(value: number): string {
  return formatNumber(value, { decimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate bill",
    modeLegend: "What do you know?",
    modes: { units: "Units used", readings: "Meter readings", recharge: "Recharge amount" },
    modeSentence: {
      units: "Enter this month’s units (kWh) from your bill or meter.",
      readings: "Enter last month’s and this month’s meter readings; the difference is the units used.",
      recharge: "Prepaid meter: see how many units a month’s recharge buys after the fixed charges.",
    },
    units: "Units used this month",
    unitsPlaceholder: "e.g. 200",
    unitsSuffix: "units",
    previous: "Previous reading",
    current: "Current reading",
    readingPlaceholder: { previous: "e.g. 12,345", current: "e.g. 12,545" },
    amount: "Recharge amount this month",
    amountPlaceholder: "e.g. 1,000",
    amountHint: "Everything you recharge in the month. The meter takes the month’s demand charge and meter rent from it.",
    load: "Sanctioned load",
    loadPlaceholder: "e.g. 2",
    loadHint: (single: string, three: string) =>
      `Printed on your bill or prepaid card (“sanctioned/approved load”). Up to ${single} kW single-phase, ${three} kW three-phase.`,
    phaseLegend: "Meter phase",
    phases: { single: "Single-phase", three: "Three-phase" },
    paymentLegend: "Meter type",
    payments: { postpaid: "Postpaid", prepaid: "Prepaid" },
    rechargeIsPrepaid: "Recharge amounts are for prepaid meters, so the 0.5% prepaid rebate is included.",
    editTariff: "Edit tariff",
    editTariffNote: (date: string) =>
      `Pre-filled with BERC’s residential (LT-A) rates from the June 2026 billing month, checked ${date}. Rates are per unit, before VAT. Change any figure to match your bill.`,
    rateLabels: {
      lifeline: "Lifeline: whole month 0–50 units",
      step1: "Step 1: 0–75 units",
      step2: "Step 2: 76–200 units",
      step3: "Step 3: 201–300 units",
      step4: "Step 4: 301–400 units",
      step5: "Step 5: 401–600 units",
      step6: "Step 6: above 600 units",
    } satisfies Record<RateId, string>,
    perUnit: "/unit",
    demandRate: "Demand charge per kW a month",
    demandRateHint: "BERC, unchanged in 2026.",
    meterRent: "Meter rent a month",
    meterRentHint: (single: string, three: string) =>
      `As reported for DPDC-supplied meters (${single} single-phase, ${three} three-phase). Enter 0 if you bought your meter.`,
    vat: "VAT",
    vatHint: "5% as reported; BERC says the government’s rate applies.",
    rebate: "Prepaid rebate",
    rebateHint: "BERC: 0.5% of the bill before VAT, prepaid meters only.",
    resetTariff: "Use BERC rates again",
    tariffReset: "Tariff reset to the listed rates.",
    errorsInTariff: "Check the highlighted figures in Edit tariff.",
    announcementBill: (total: string, units: string) => `Electricity bill ${total} for ${units} units.`,
    announcementRecharge: (units: string, amount: string) => `About ${units} units for a ${amount} recharge.`,
    placeholderTitleFirst: "Your bill will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the units (or readings) and your sanctioned load, then select Calculate bill.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitleBill: "Your electricity bill",
    resultTitleRecharge: "Units your recharge buys",
    unitsWord: "units",
    statUnits: "Units used",
    statEnergy: "Energy charge",
    statAverage: "Average per unit, all in",
    statFixed: "Demand charge + meter rent",
    statBill: "Bill for these units",
    statLeftover: "Left over",
    tableCaption: "Bill breakdown: each slab’s units × rate, then the other charges",
    colItem: "Item",
    colUnits: "Units",
    colRate: "Rate",
    colAmount: "Amount",
    energyCharge: "Energy charge",
    demandCharge: (kw: string, rate: string) => `Demand charge (${kw} kW × ${rate})`,
    meterRentLine: (phase: string) => `Meter rent (${phase})`,
    subtotal: "Bill before VAT",
    vatLine: (percent: string) => `VAT (${percent})`,
    rebateLine: (percent: string) => `Prepaid rebate (${percent})`,
    total: "Total",
    lifelineNote: "50 units or less: every unit is billed at the lifeline rate.",
    stepNote: "Each rate applies only to the units inside its slab.",
    asOf: (date: string) => `BERC LT-A rates for the June 2026 billing month (orders of 3 and 4 June 2026), checked ${date}.`,
    reportedNote: "Meter rent and VAT are as reported:",
    bercJune3: "BERC, 3 June 2026",
    bercJune4: "BERC, 4 June 2026",
    tbsLink: "The Business Standard, 31 August 2026",
    sourceWord: "Source",
    editedNote: "You edited the tariff, so this uses your figures.",
    differNote:
      "Your distribution company’s bill may differ: late-payment surcharge, arrears, adjustments, rounding or a different meter rent.",
    rechargeNote:
      "Assumes this is the month’s whole recharge. A later recharge in the same month buys units at the slab you have reached.",
    errUnitsLabel: "units used",
    errPreviousLabel: "previous reading",
    errCurrentLabel: "current reading",
    errAmountLabel: "recharge amount",
    errLoadLabel: "sanctioned load",
    errRateLabel: "rate",
    errDemandLabel: "demand charge",
    errMeterRentLabel: "meter rent",
    errVatLabel: "VAT rate",
    errRebateLabel: "rebate",
    errZeroOrMore: "0 or more",
    errMoreThanZero: "more than 0",
    errAtLeast: (min: string) => `at least ${min}`,
    errOrLess: (max: string) => `${max} or less`,
    errLoadMax: (max: string, phase: string) => `${max} kW or less on a ${phase.toLowerCase()} meter`,
    errBelowPrevious: "The current reading can’t be less than the previous reading.",
    errTooManyUnits: (max: string) => `The readings are more than ${max} units apart. Check both readings.`,
    errBelowFixed: (min: string) =>
      `That doesn’t cover the month’s fixed charges. With this load and meter, recharge at least ${min}.`,
    shareTitle: "Electricity bill calculated with HisabBD",
    shareBill: (units: string, kw: string, phase: string, payment: string, total: string) =>
      `${units} units (${kw} kW, ${phase.toLowerCase()}, ${payment.toLowerCase()}): electricity bill ${total} including VAT, at BERC’s June 2026 rates. Calculated with HisabBD’s Electricity Bill Calculator.`,
    shareRecharge: (amount: string, kw: string, phase: string, units: string) =>
      `A ${amount} prepaid recharge (${kw} kW, ${phase.toLowerCase()}) covers about ${units} units this month at BERC’s June 2026 rates. Calculated with HisabBD’s Electricity Bill Calculator.`,
  },
  bn: {
    submit: "বিল হিসাব করুন",
    modeLegend: "কোনটি জানা আছে?",
    modes: { units: "ব্যবহৃত ইউনিট", readings: "মিটার রিডিং", recharge: "রিচার্জের টাকা" },
    modeSentence: {
      units: "বিল বা মিটার থেকে এ মাসের ইউনিট (কিলোওয়াট-ঘণ্টা) লিখুন।",
      readings: "আগের মাসের ও এ মাসের মিটার রিডিং লিখুন; দুটির পার্থক্যই ব্যবহৃত ইউনিট।",
      recharge: "প্রিপেইড মিটার: নির্দিষ্ট চার্জ কাটার পর মাসের রিচার্জে কত ইউনিট পাবেন দেখুন।",
    },
    units: "এ মাসে ব্যবহৃত ইউনিট",
    unitsPlaceholder: "যেমন 200",
    unitsSuffix: "ইউনিট",
    previous: "আগের রিডিং",
    current: "বর্তমান রিডিং",
    readingPlaceholder: { previous: "যেমন 12,345", current: "যেমন 12,545" },
    amount: "এ মাসে রিচার্জের টাকা",
    amountPlaceholder: "যেমন 1,000",
    amountHint: "মাসে মোট যত রিচার্জ করবেন। মিটার এখান থেকেই মাসের ডিমান্ড চার্জ ও মিটার ভাড়া কাটে।",
    load: "অনুমোদিত লোড",
    loadPlaceholder: "যেমন 2",
    loadHint: (single: string, three: string) =>
      `বিলের কাগজে বা প্রিপেইড কার্ডে লেখা থাকে (“অনুমোদিত লোড”)। সিঙ্গেল ফেজে ${single} কিলোওয়াট, থ্রি ফেজে ${three} কিলোওয়াট পর্যন্ত।`,
    phaseLegend: "মিটারের ফেজ",
    phases: { single: "সিঙ্গেল ফেজ", three: "থ্রি ফেজ" },
    paymentLegend: "মিটারের ধরন",
    payments: { postpaid: "পোস্টপেইড", prepaid: "প্রিপেইড" },
    rechargeIsPrepaid: "রিচার্জ প্রিপেইড মিটারের জন্য, তাই 0.5% প্রিপেইড রিবেট ধরা হয়েছে।",
    editTariff: "ট্যারিফ বদলান",
    editTariffNote: (date: string) =>
      `জুন 2026 বিল মাস থেকে বিইআরসির আবাসিক (এলটি-এ) হার দিয়ে পূরণ করা, ${date}-এ যাচাই করা। হার প্রতি ইউনিটে, ভ্যাট ছাড়া। বিলের সঙ্গে মেলাতে যেকোনো অঙ্ক বদলান।`,
    rateLabels: {
      lifeline: "লাইফলাইন: মাসে মোট 0–50 ইউনিট",
      step1: "প্রথম ধাপ: 0–75 ইউনিট",
      step2: "দ্বিতীয় ধাপ: 76–200 ইউনিট",
      step3: "তৃতীয় ধাপ: 201–300 ইউনিট",
      step4: "চতুর্থ ধাপ: 301–400 ইউনিট",
      step5: "পঞ্চম ধাপ: 401–600 ইউনিট",
      step6: "ষষ্ঠ ধাপ: 600 ইউনিটের ওপরে",
    } satisfies Record<RateId, string>,
    perUnit: "/ইউনিট",
    demandRate: "প্রতি কিলোওয়াটে মাসিক ডিমান্ড চার্জ",
    demandRateHint: "বিইআরসি, 2026-এ অপরিবর্তিত।",
    meterRent: "মাসিক মিটার ভাড়া",
    meterRentHint: (single: string, three: string) =>
      `ডিপিডিসির দেওয়া মিটারের জন্য প্রকাশিত অঙ্ক (সিঙ্গেল ফেজ ${single}, থ্রি ফেজ ${three})। নিজে মিটার কিনলে 0 লিখুন।`,
    vat: "ভ্যাট",
    vatHint: "প্রকাশিত তথ্য অনুযায়ী 5%; বিইআরসি বলেছে সরকার-নির্ধারিত হার প্রযোজ্য।",
    rebate: "প্রিপেইড রিবেট",
    rebateHint: "বিইআরসি: ভ্যাটের আগের বিলের 0.5%, শুধু প্রিপেইড মিটারে।",
    resetTariff: "বিইআরসির হার আবার বসান",
    tariffReset: "তালিকার হারে ফিরিয়ে আনা হয়েছে।",
    errorsInTariff: "“ট্যারিফ বদলান” অংশে চিহ্নিত অঙ্কগুলো দেখুন।",
    announcementBill: (total: string, units: string) => `${units} ইউনিটে বিদ্যুৎ বিল ${total}।`,
    announcementRecharge: (units: string, amount: string) => `${amount} রিচার্জে প্রায় ${units} ইউনিট।`,
    placeholderTitleFirst: "আপনার বিল এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "ইউনিট (বা রিডিং) আর অনুমোদিত লোড লিখুন, তারপর “বিল হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitleBill: "আপনার বিদ্যুৎ বিল",
    resultTitleRecharge: "রিচার্জে যত ইউনিট পাবেন",
    unitsWord: "ইউনিট",
    statUnits: "ব্যবহৃত ইউনিট",
    statEnergy: "এনার্জি চার্জ",
    statAverage: "সবসহ ইউনিটপ্রতি গড়",
    statFixed: "ডিমান্ড চার্জ + মিটার ভাড়া",
    statBill: "এই ইউনিটের বিল",
    statLeftover: "বাকি থাকবে",
    tableCaption: "বিলের বিস্তারিত: প্রতি ধাপের ইউনিট × হার, তারপর অন্যান্য চার্জ",
    colItem: "বিবরণ",
    colUnits: "ইউনিট",
    colRate: "হার",
    colAmount: "টাকা",
    energyCharge: "এনার্জি চার্জ",
    demandCharge: (kw: string, rate: string) => `ডিমান্ড চার্জ (${kw} কিলোওয়াট × ${rate})`,
    meterRentLine: (phase: string) => `মিটার ভাড়া (${phase})`,
    subtotal: "ভ্যাটের আগে বিল",
    vatLine: (percent: string) => `ভ্যাট (${percent})`,
    rebateLine: (percent: string) => `প্রিপেইড রিবেট (${percent})`,
    total: "মোট",
    lifelineNote: "50 ইউনিট বা তার কম: সব ইউনিট লাইফলাইন হারে।",
    stepNote: "প্রতিটি হার শুধু সেই ধাপের ভেতরের ইউনিটে বসে।",
    asOf: (date: string) => `জুন 2026 বিল মাসের বিইআরসি এলটি-এ হার (3 ও 4 জুন 2026-এর আদেশ), ${date}-এ যাচাই করা।`,
    reportedNote: "মিটার ভাড়া ও ভ্যাট প্রকাশিত তথ্য অনুযায়ী:",
    bercJune3: "বিইআরসি, 3 জুন 2026",
    bercJune4: "বিইআরসি, 4 জুন 2026",
    tbsLink: "দ্য বিজনেস স্ট্যান্ডার্ড, 31 আগস্ট 2026",
    sourceWord: "সূত্র",
    editedNote: "আপনি ট্যারিফ বদলেছেন, তাই হিসাবটি আপনার অঙ্কে।",
    differNote: "আপনার বিতরণ কোম্পানির বিল ভিন্ন হতে পারে: বিলম্ব মাশুল, বকেয়া, সমন্বয়, রাউন্ডিং বা ভিন্ন মিটার ভাড়ার কারণে।",
    rechargeNote: "ধরা হয়েছে এটিই মাসের পুরো রিচার্জ। একই মাসে পরের রিচার্জে আপনি যে ধাপে আছেন সেই হারে ইউনিট পাবেন।",
    errUnitsLabel: "ব্যবহৃত ইউনিট",
    errPreviousLabel: "আগের রিডিং",
    errCurrentLabel: "বর্তমান রিডিং",
    errAmountLabel: "রিচার্জের টাকা",
    errLoadLabel: "অনুমোদিত লোড",
    errRateLabel: "হার",
    errDemandLabel: "ডিমান্ড চার্জ",
    errMeterRentLabel: "মিটার ভাড়া",
    errVatLabel: "ভ্যাটের হার",
    errRebateLabel: "রিবেট",
    errZeroOrMore: "0 বা তার বেশি",
    errMoreThanZero: "0-এর বেশি",
    errAtLeast: (min: string) => `কমপক্ষে ${min}`,
    errOrLess: (max: string) => `${max} বা তার কম`,
    errLoadMax: (max: string, phase: string) => `${phase} মিটারে ${max} কিলোওয়াট বা তার কম`,
    errBelowPrevious: "বর্তমান রিডিং আগের রিডিংয়ের চেয়ে কম হতে পারে না।",
    errTooManyUnits: (max: string) => `দুই রিডিংয়ের পার্থক্য ${max} ইউনিটের বেশি। দুটো রিডিং আবার দেখুন।`,
    errBelowFixed: (min: string) => `এতে মাসের নির্দিষ্ট চার্জই হয় না। এই লোড ও মিটারে কমপক্ষে ${min} রিচার্জ করুন।`,
    shareTitle: "HisabBD দিয়ে বিদ্যুৎ বিলের হিসাব",
    shareBill: (units: string, kw: string, phase: string, payment: string, total: string) =>
      `${units} ইউনিট (${kw} কিলোওয়াট, ${phase}, ${payment}): বিইআরসির জুন 2026-এর হারে ভ্যাটসহ বিদ্যুৎ বিল ${total}। HisabBD-র বিদ্যুৎ বিল ক্যালকুলেটরে হিসাব করা।`,
    shareRecharge: (amount: string, kw: string, phase: string, units: string) =>
      `${amount} প্রিপেইড রিচার্জে (${kw} কিলোওয়াট, ${phase}) বিইআরসির জুন 2026-এর হারে এ মাসে প্রায় ${units} ইউনিট। HisabBD-র বিদ্যুৎ বিল ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

const link = "font-semibold text-brand-700 underline underline-offset-4";

function rateLabel(t: Strings, field: TariffField): string | null {
  const id = RATE_IDS.find((r) => rateField(r) === field);
  return id ? t.rateLabels[id] : null;
}

function errorMessage(t: Strings, locale: Locale, phase: Phase, error: ElectricityError): string {
  const code = error.code;
  if (code === "below-previous") return t.errBelowPrevious;
  if (code === "too-many-units") return t.errTooManyUnits(formatNumber(MAX_UNITS));
  if (code === "below-fixed-charges") return t.errBelowFixed(money(error.minimum ?? 0));
  const n = (label: string, min: string, max: string) => numberErrorMessage(code, { label, min, max }, locale);
  switch (error.field) {
    case "units":
      return n(t.errUnitsLabel, t.errZeroOrMore, t.errOrLess(formatNumber(MAX_UNITS)));
    case "previous":
    case "current":
      return n(
        error.field === "previous" ? t.errPreviousLabel : t.errCurrentLabel,
        t.errZeroOrMore,
        t.errOrLess(formatNumber(MAX_READING)),
      );
    case "amount":
      return n(t.errAmountLabel, t.errAtLeast("৳1"), t.errOrLess(formatTaka(MAX_RECHARGE)));
    case "load":
      return n(t.errLoadLabel, t.errMoreThanZero, t.errLoadMax(formatNumber(MAX_LOAD_KW[phase]), t.phases[phase]));
    case "demand-rate":
      return n(t.errDemandLabel, t.errZeroOrMore, t.errOrLess(formatTaka(MAX_DEMAND_RATE)));
    case "meter-rent":
      return n(t.errMeterRentLabel, t.errZeroOrMore, t.errOrLess(formatTaka(MAX_METER_RENT)));
    case "vat":
      return n(t.errVatLabel, t.errZeroOrMore, t.errOrLess(formatPercent(MAX_PERCENT)));
    case "rebate":
      return n(t.errRebateLabel, t.errZeroOrMore, t.errOrLess(formatPercent(MAX_PERCENT)));
    default: {
      const label = rateLabel(t, error.field) ?? t.errRateLabel;
      return n(`${t.errRateLabel} (${label})`, t.errZeroOrMore, t.errOrLess(formatTaka(MAX_RATE)));
    }
  }
}

function checkedDate(locale: Locale): string {
  const date = parsePlainDate(TARIFF_CHECKED_ON);
  return date ? formatPlainDate(date, { locale }) : TARIFF_CHECKED_ON;
}

function shareText(t: Strings, r: ElectricityResult): string {
  const kw = formatNumber(r.bill.loadKw);
  const phase = t.phases[r.phase];
  if (r.recharge) return t.shareRecharge(money(r.recharge.amount), kw, phase, unitsText(r.bill.units));
  return t.shareBill(unitsText(r.bill.units), kw, phase, t.payments[r.payment], money(r.bill.total));
}

/** Tariff edits as saved in history: only the boxes the user changed. */
function encodeEdits(edits: Partial<Record<TariffField, string>>): string {
  return Object.keys(edits).length > 0 ? JSON.stringify(edits) : "";
}

function decodeEdits(text: string): Partial<Record<TariffField, string>> {
  if (!text) return {};
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") return {};
    const result: Partial<Record<TariffField, string>> = {};
    for (const field of TARIFF_FIELDS) {
      const value = (parsed as Record<string, unknown>)[field];
      if (typeof value === "string" && value.length <= 20) result[field] = value;
    }
    return result;
  } catch {
    return {};
  }
}

export function ElectricityCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [mode, setMode] = usePreference(MODE_PREF);
  const [phase, setPhase] = usePreference(PHASE_PREF);
  const [chosenPayment, setPayment] = usePreference(PAYMENT_PREF);
  const [rememberedLoad, setRememberedLoad] = usePreference(LOAD_PREF);
  const [units, setUnits] = useState("");
  const [previous, setPrevious] = useState("");
  const [current, setCurrent] = useState("");
  const [amount, setAmount] = useState("");
  /** What the user typed in the load box; null means "use the remembered load". */
  const [typedLoad, setTypedLoad] = useState<string | null>(null);
  /** Tariff boxes the user changed; the rest show the listed figures. */
  const [edits, setEdits] = useState<Partial<Record<TariffField, string>>>({});
  const [tariffStatus, setTariffStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const inputs = useRef<Partial<Record<ElectricityField, HTMLInputElement | null>>>({});
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const { record } = useCalculationHistory();

  const payment: Payment = mode === "recharge" ? "prepaid" : chosenPayment;
  const load = typedLoad ?? rememberedLoad;
  const defaults = defaultTariffInput(phase);
  const tariff: TariffInput = { ...defaults, ...edits };
  const edited = TARIFF_FIELDS.some((f) => edits[f] !== undefined && parseNumberInput(edits[f] ?? "") !== parseNumberInput(defaults[f]));

  const calcInput = { mode, units, previous, current, amount, load, phase, payment, tariff };
  const calc = submitted ? calculateElectricityBill(calcInput) : null;
  const errors = calc && !calc.ok ? calc.errors : [];
  const errorFor = (field: ElectricityField) => {
    const error = errors.find((e) => e.field === field);
    return error ? errorMessage(t, locale, phase, error) : undefined;
  };
  const tariffHasErrors = errors.some((e) => (TARIFF_FIELDS as readonly string[]).includes(e.field));
  const result = calc?.ok ? calc.result : null;

  const modeOptions = MODES.map((value) => ({ value, label: t.modes[value] }));
  const phaseOptions = PHASES.map((value) => ({ value, label: t.phases[value] }));
  const paymentOptions = PAYMENTS.map((value) => ({ value, label: t.payments[value] }));

  function setRef(field: ElectricityField) {
    return (el: HTMLInputElement | null) => {
      inputs.current[field] = el;
    };
  }

  function changeMode(next: ElectricityMode) {
    setMode(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  function setTariffField(field: TariffField, value: string) {
    setEdits((prev) => ({ ...prev, [field]: value }));
    setTariffStatus("");
  }

  function resetTariff() {
    setEdits({});
    setTariffStatus(t.tariffReset);
  }

  function rememberLoad(text: string) {
    const normalized = normalizeDigits(text).trim().replace(/,/g, "");
    if (LOAD_PREF.isValid(normalized)) setRememberedLoad(normalized);
  }

  function focusFirstError(list: readonly ElectricityError[]) {
    const first = FIELD_ORDER.find((field) => list.some((e) => e.field === field));
    if (!first) return;
    if ((TARIFF_FIELDS as readonly string[]).includes(first) && detailsRef.current) detailsRef.current.open = true;
    inputs.current[first]?.focus();
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateElectricityBill(calcInput);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      rememberLoad(load);
      record(
        { mode, units, previous, current, amount, load, phase, payment: chosenPayment, tariff: encodeEdits(edits) },
        shareText(t, check.result),
      );
    } else {
      focusFirstError(check.errors);
    }
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedMode = MODES.find((m) => m === saved.mode);
    const savedPhase = PHASES.find((p) => p === saved.phase);
    const savedPayment = PAYMENTS.find((p) => p === saved.payment);
    if (savedMode) setMode(savedMode);
    if (savedPhase) setPhase(savedPhase);
    if (savedPayment) setPayment(savedPayment);
    setUnits(text("units"));
    setPrevious(text("previous"));
    setCurrent(text("current"));
    setAmount(text("amount"));
    setTypedLoad(text("load"));
    setEdits(decodeEdits(text("tariff")));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed (tariff edits too); the remembered mode, meter and load stay. */
  function onReset() {
    setUnits("");
    setPrevious("");
    setCurrent("");
    setAmount("");
    setTypedLoad(null);
    setEdits({});
    setTariffStatus("");
    setSubmitted(false);
    setRevealCount(0);
    const first: ElectricityField = mode === "units" ? "units" : mode === "readings" ? "previous" : "amount";
    inputs.current[first]?.focus();
  }

  /** One numeric box, rendered inside FormField's render callback. */
  function numberInput(
    control: { id: string; "aria-invalid"?: true; "aria-describedby"?: string },
    field: ElectricityField,
    value: string,
    onChange: (v: string) => void,
    extra: { prefix?: string; suffix?: string; placeholder?: string },
  ) {
    return (
      <AffixInput
        {...control}
        ref={setRef(field)}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        prefix={extra.prefix}
        suffix={extra.suffix}
        placeholder={extra.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl name="electricity-mode" legend={t.modeLegend} options={modeOptions} value={mode} onChange={changeMode} />
        <p className="mt-3 text-slate-700">{t.modeSentence[mode]}</p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {mode === "units" && (
            <FormField id={fieldId("units")} label={t.units} error={errorFor("units")}>
              {(control) => numberInput(control, "units", units, setUnits, { suffix: t.unitsSuffix, placeholder: t.unitsPlaceholder })}
            </FormField>
          )}
          {mode === "readings" && (
            <>
              <FormField id={fieldId("previous")} label={t.previous} error={errorFor("previous")}>
                {(control) => numberInput(control, "previous", previous, setPrevious, { placeholder: t.readingPlaceholder.previous })}
              </FormField>
              <FormField id={fieldId("current")} label={t.current} error={errorFor("current")}>
                {(control) => numberInput(control, "current", current, setCurrent, { placeholder: t.readingPlaceholder.current })}
              </FormField>
            </>
          )}
          {mode === "recharge" && (
            <FormField id={fieldId("amount")} label={t.amount} hint={t.amountHint} error={errorFor("amount")}>
              {(control) => numberInput(control, "amount", amount, setAmount, { prefix: "৳", placeholder: t.amountPlaceholder })}
            </FormField>
          )}
          <FormField
            id={fieldId("load")}
            label={t.load}
            hint={t.loadHint(formatNumber(MAX_LOAD_KW.single), formatNumber(MAX_LOAD_KW.three))}
            error={errorFor("load")}
          >
            {(control) => numberInput(control, "load", load, setTypedLoad, { suffix: "kW", placeholder: t.loadPlaceholder })}
          </FormField>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-4">
          <SegmentedControl name="electricity-phase" legend={t.phaseLegend} options={phaseOptions} value={phase} onChange={setPhase} />
          {mode !== "recharge" && (
            <SegmentedControl
              name="electricity-payment"
              legend={t.paymentLegend}
              options={paymentOptions}
              value={chosenPayment}
              onChange={setPayment}
            />
          )}
        </div>
        {mode === "recharge" && <p className="mt-3 text-sm text-slate-600">{t.rechargeIsPrepaid}</p>}

        <details ref={detailsRef} className="mt-5 rounded-xl border border-slate-200 px-4 py-2">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-slate-900">{t.editTariff}</summary>
          <p className="mt-1 text-sm text-slate-600">{t.editTariffNote(checkedDate(locale))}</p>
          <div className="mt-4 grid gap-5 pb-3 sm:grid-cols-2">
            {RATE_IDS.map((id) => {
              const field = rateField(id);
              return (
                <FormField key={field} id={fieldId(field)} label={t.rateLabels[id]} error={errorFor(field)}>
                  {(control) => numberInput(control, field, tariff[field], (v) => setTariffField(field, v), { prefix: "৳", suffix: t.perUnit })}
                </FormField>
              );
            })}
            <FormField id={fieldId("demand-rate")} label={t.demandRate} hint={t.demandRateHint} error={errorFor("demand-rate")}>
              {(control) => numberInput(control, "demand-rate", tariff["demand-rate"], (v) => setTariffField("demand-rate", v), { prefix: "৳", suffix: "/kW" })}
            </FormField>
            <FormField
              id={fieldId("meter-rent")}
              label={t.meterRent}
              hint={t.meterRentHint(money(METER_RENT.single.value), money(METER_RENT.three.value))}
              error={errorFor("meter-rent")}
            >
              {(control) => numberInput(control, "meter-rent", tariff["meter-rent"], (v) => setTariffField("meter-rent", v), { prefix: "৳" })}
            </FormField>
            <FormField id={fieldId("vat")} label={t.vat} hint={t.vatHint} error={errorFor("vat")}>
              {(control) => numberInput(control, "vat", tariff.vat, (v) => setTariffField("vat", v), { suffix: "%" })}
            </FormField>
            <FormField id={fieldId("rebate")} label={t.rebate} hint={t.rebateHint} error={errorFor("rebate")}>
              {(control) => numberInput(control, "rebate", tariff.rebate, (v) => setTariffField("rebate", v), { suffix: "%" })}
            </FormField>
          </div>
          <div className="flex flex-wrap items-center gap-3 pb-3">
            <Button variant="secondary" onClick={resetTariff}>
              {t.resetTariff}
            </Button>
            <p role="status" className="text-sm text-slate-600">
              {tariffStatus}
            </p>
          </div>
        </details>
        {tariffHasErrors && <p className="mt-2 text-sm font-medium text-red-700">{t.errorsInTariff}</p>}

        <p className="mt-4 text-sm text-slate-600">
          <TariffSourceLine edited={edited} />
        </p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result
            ? result.recharge
              ? t.announcementRecharge(unitsText(result.bill.units), money(result.recharge.amount))
              : t.announcementBill(money(result.bill.total), unitsText(result.bill.units))
            : ""
        }
        result={result && <ElectricityResultView result={result} edited={edited} />}
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

/** "BERC LT-A rates … checked …. Meter rent and VAT as reported: …" with links. */
function TariffSourceLine({ edited }: { edited: boolean }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  return (
    <>
      {edited && `${t.editedNote} `}
      {t.asOf(checkedDate(locale))} {t.sourceWord}:{" "}
      <a href={BERC_RETAIL_ORDER.url} target="_blank" rel="noopener" className={link}>
        {t.bercJune3}
      </a>
      ,{" "}
      <a href={BERC_LIFELINE_REVISION.url} target="_blank" rel="noopener" className={link}>
        {t.bercJune4}
      </a>
      . {t.reportedNote}{" "}
      <a href={TBS_DPDC_METER_CHARGES.url} target="_blank" rel="noopener" className={link}>
        {t.tbsLink}
      </a>
      .
    </>
  );
}

function ElectricityResultView({ result: r, edited }: { result: ElectricityResult; edited: boolean }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const b = r.bill;
  const text = shareText(t, r);
  const fixed = b.demandCharge + b.meterRent;
  const stats = r.recharge
    ? [
        { label: t.statBill, value: money(b.total) },
        { label: t.statLeftover, value: money(r.recharge.leftover) },
        { label: t.statEnergy, value: money(b.energyCharge) },
        { label: t.statFixed, value: money(fixed) },
      ]
    : [
        { label: t.statUnits, value: unitsText(b.units) },
        { label: t.statEnergy, value: money(b.energyCharge) },
        { label: t.statFixed, value: money(fixed) },
        ...(b.averagePerUnit === null ? [] : [{ label: t.statAverage, value: rateMoney(roundTo(b.averagePerUnit, 2)) }]),
      ];
  const lifeline = b.lines[0]?.id === "lifeline";
  const th = "px-3 py-2 font-medium";
  const row = "border-b border-slate-200";

  return (
    <div className="space-y-4">
      <ResultPanel
        title={r.recharge ? t.resultTitleRecharge : t.resultTitleBill}
        titleId="electricity-result-heading"
        value={
          <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
            {r.recharge ? `${unitsText(b.units)} ${t.unitsWord}` : money(b.total)}
          </p>
        }
      >
        <ResultStats items={stats} />

        <div className="mt-4 overflow-x-auto rounded-xl bg-white/70 px-3 py-2">
          <table className="w-full min-w-[26rem] text-right text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className={`${th} pl-0 text-left`}>{t.colItem}</th>
                <th scope="col" className={th}>{t.colUnits}</th>
                <th scope="col" className={th}>{t.colRate}</th>
                <th scope="col" className={`${th} pr-0`}>{t.colAmount}</th>
              </tr>
            </thead>
            <tbody className="text-slate-800 tabular-nums">
              {b.lines.map((line) => (
                <tr key={line.id} className={row}>
                  <th scope="row" className="py-2 pr-3 text-left font-normal">{t.rateLabels[line.id]}</th>
                  <td className="px-3 py-2">{unitsText(line.units)}</td>
                  <td className="px-3 py-2">{rateMoney(line.rate)}</td>
                  <td className="py-2 pl-3">{money(line.amount)}</td>
                </tr>
              ))}
              <tr className={`${row} font-semibold`}>
                <th scope="row" colSpan={3} className="py-2 pr-3 text-left">{t.energyCharge}</th>
                <td className="py-2 pl-3">{money(b.energyCharge)}</td>
              </tr>
              <tr className={row}>
                <th scope="row" colSpan={3} className="py-2 pr-3 text-left font-normal">
                  {t.demandCharge(formatNumber(b.loadKw), money(b.demandChargePerKw))}
                </th>
                <td className="py-2 pl-3">{money(b.demandCharge)}</td>
              </tr>
              <tr className={row}>
                <th scope="row" colSpan={3} className="py-2 pr-3 text-left font-normal">{t.meterRentLine(t.phases[r.phase])}</th>
                <td className="py-2 pl-3">{money(b.meterRent)}</td>
              </tr>
              <tr className={`${row} font-semibold`}>
                <th scope="row" colSpan={3} className="py-2 pr-3 text-left">{t.subtotal}</th>
                <td className="py-2 pl-3">{money(b.subtotal)}</td>
              </tr>
              <tr className={row}>
                <th scope="row" colSpan={3} className="py-2 pr-3 text-left font-normal">{t.vatLine(formatPercent(b.vatPercent, { decimals: 4 }))}</th>
                <td className="py-2 pl-3">{money(b.vat)}</td>
              </tr>
              {r.payment === "prepaid" && (
                <tr className={row}>
                  <th scope="row" colSpan={3} className="py-2 pr-3 text-left font-normal">
                    {t.rebateLine(formatPercent(b.rebatePercent, { decimals: 4 }))}
                  </th>
                  <td className="py-2 pl-3">−{money(b.rebate)}</td>
                </tr>
              )}
              <tr className="font-bold text-slate-900">
                <th scope="row" colSpan={3} className="py-2 pr-3 text-left">{t.total}</th>
                <td className="py-2 pl-3">{money(b.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-slate-700">{lifeline ? t.lifelineNote : t.stepNote}</p>
        {r.recharge && <p className="mt-1 text-sm text-slate-700">{t.rechargeNote}</p>}
        <p className="mt-3 text-sm text-slate-600">
          <TariffSourceLine edited={edited} />
        </p>
        <p className="mt-1 text-sm text-slate-600">{t.differNote}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

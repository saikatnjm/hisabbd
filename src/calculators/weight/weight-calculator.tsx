"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { FormField, Input, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import { calculateWeight, MAX_VALUE, WEIGHT_UNITS, type WeightResult, type WeightUnit } from "./logic";

const SLUG = "weight-converter";
/** Remembered in this browser: the unit converted from. */
const UNIT_PREF = choicePreference(SLUG, "unit", WEIGHT_UNITS, "maund-market");

const VALUE_ID = "weight-value";
const UNIT_ID = "weight-unit";

/** Up to 4 decimals, without trailing zeros. */
const num = (value: number) => formatNumber(value, { decimals: 4 });

const STRINGS = {
  en: {
    submit: "Convert",
    value: "Weight",
    valuePlaceholder: "e.g. 2",
    unit: "Unit",
    units: {
      kg: "Kilogram (kg)",
      g: "Gram (g)",
      lb: "Pound (lb)",
      "maund-market": "Maund (মণ), market: 40 kg",
      maund: "Maund (মণ), old scale: 37.32 kg",
      seer: "Seer (সের), old scale",
      chatak: "Chatak (ছটাক), old scale",
      tola: "Tola (তোলা)",
    } satisfies Record<WeightUnit, string>,
    short: {
      kg: "kg",
      g: "g",
      lb: "lb",
      "maund-market": "market মণ",
      maund: "old-scale মণ",
      seer: "সের",
      chatak: "ছটাক",
      tola: "তোলা",
    } satisfies Record<WeightUnit, string>,
    errLabel: "weight",
    errMin: "more than 0",
    errMax: `${formatNumber(MAX_VALUE)} or less`,
    resultTitle: (v: string) => `${v} is`,
    marketLine: "In market মণ (40 kg)",
    traditionalLine: "On the old scale",
    breakdown: (m: string, s: string, c: string) => `${m} মণ ${s} সের ${c} ছটাক`,
    tableCaption: "The same weight in every unit",
    unitCol: "Unit",
    valueCol: "Weight",
    note: "Markets use a 40 kg মণ. সের and ছটাক are on the old scale (1 মণ = 40 সের = 37.32 kg). Agree the weight in kg before you buy or sell.",
    announcement: (v: string, kg: string) => `${v} is ${kg} kg.`,
    placeholderTitleFirst: "The conversion will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a weight, choose its unit, then select Convert.",
    placeholderFix: "Fix the highlighted weight above and the result will show here.",
    shareTitle: "Weight converted with HisabBD",
    shareText: (v: string, kg: string, market: string, old: string) =>
      `${v} = ${kg} kg = ${market} market মণ = ${old} (old scale). Converted with HisabBD’s Weight Converter.`,
  },
  bn: {
    submit: "রূপান্তর করুন",
    value: "ওজন",
    valuePlaceholder: "যেমন 2",
    unit: "একক",
    units: {
      kg: "কেজি",
      g: "গ্রাম",
      lb: "পাউন্ড",
      "maund-market": "মণ, বাজারের: 40 কেজি",
      maund: "মণ, পুরোনো মাপ: 37.32 কেজি",
      seer: "সের, পুরোনো মাপ",
      chatak: "ছটাক, পুরোনো মাপ",
      tola: "তোলা",
    } satisfies Record<WeightUnit, string>,
    short: {
      kg: "কেজি",
      g: "গ্রাম",
      lb: "পাউন্ড",
      "maund-market": "মণ (বাজারের)",
      maund: "মণ (পুরোনো মাপ)",
      seer: "সের",
      chatak: "ছটাক",
      tola: "তোলা",
    } satisfies Record<WeightUnit, string>,
    errLabel: "ওজন",
    errMin: "0-এর বেশি",
    errMax: `${formatNumber(MAX_VALUE)} বা তার কম`,
    resultTitle: (v: string) => `${v} সমান`,
    marketLine: "বাজারের মণে (40 কেজি)",
    traditionalLine: "পুরোনো মাপে",
    breakdown: (m: string, s: string, c: string) => `${m} মণ ${s} সের ${c} ছটাক`,
    tableCaption: "একই ওজন সব এককে",
    unitCol: "একক",
    valueCol: "ওজন",
    note: "বাজারে মণ 40 কেজি। সের ও ছটাক পুরোনো মাপে (1 মণ = 40 সের = 37.32 কেজি)। কেনাবেচার আগে কেজিতে ওজন ঠিক করে নিন।",
    announcement: (v: string, kg: string) => `${v} সমান ${kg} কেজি।`,
    placeholderTitleFirst: "রূপান্তর এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "ওজন লিখে একক বেছে নিন, তারপর “রূপান্তর করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ওজনটি ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে ওজন রূপান্তর",
    shareText: (v: string, kg: string, market: string, old: string) =>
      `${v} = ${kg} কেজি = বাজারের ${market} মণ = পুরোনো মাপে ${old}। HisabBD-র ওজন রূপান্তরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function inputText(t: Strings, r: WeightResult): string {
  return `${num(r.value)} ${t.short[r.unit]}`;
}

function breakdownText(t: Strings, r: WeightResult): string {
  return t.breakdown(num(r.traditional.maund), num(r.traditional.seer), formatNumber(r.traditional.chatak, { decimals: 2 }));
}

function shareText(t: Strings, r: WeightResult): string {
  return t.shareText(inputText(t, r), num(r.converted.kg), num(r.converted["maund-market"]), breakdownText(t, r));
}

export function WeightCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [value, setValue] = useState("");
  const [unit, setUnit] = usePreference(UNIT_PREF);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const valueRef = useRef<HTMLInputElement>(null);

  const calc = submitted ? calculateWeight(value, unit) : null;
  const error = calc && !calc.ok ? calc.errors[0] : undefined;
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateWeight(value, unit);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ value, unit }, shareText(t, check.result));
    } else {
      valueRef.current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    setValue(typeof saved.value === "string" ? saved.value : "");
    const savedUnit = typeof saved.unit === "string" ? saved.unit : "";
    if (UNIT_PREF.isValid(savedUnit)) setUnit(savedUnit);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setValue("");
    setSubmitted(false);
    setRevealCount(0);
    valueRef.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            id={VALUE_ID}
            label={t.value}
            error={error ? numberErrorMessage(error.code, { label: t.errLabel, min: t.errMin, max: t.errMax }, locale) : undefined}
          >
            {(control) => (
              <Input
                {...control}
                ref={valueRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={t.valuePlaceholder}
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={UNIT_ID} label={t.unit}>
            {(control) => (
              <Select
                {...control}
                value={unit}
                onChange={(event) => {
                  const next = WEIGHT_UNITS.find((u) => u === event.target.value);
                  if (next) setUnit(next);
                }}
              >
                {WEIGHT_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {t.units[u]}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(inputText(t, result), num(result.converted.kg)) : ""}
        result={result && <WeightResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">– kg</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function WeightResultView({ result: r }: { result: WeightResult }) {
  const t = STRINGS[useLocale()];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={t.resultTitle(inputText(t, r))}
        titleId="weight-result-heading"
        value={
          <div className="space-y-3">
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {num(r.converted.kg)} <span className="text-2xl">{t.short.kg}</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <p>
                <span className="block text-sm text-slate-600">{t.marketLine}</span>
                <span className="text-xl font-semibold text-slate-900">{num(r.converted["maund-market"])} মণ</span>
              </p>
              <p>
                <span className="block text-sm text-slate-600">{t.traditionalLine}</span>
                <span className="text-xl font-semibold text-slate-900">{breakdownText(t, r)}</span>
              </p>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[16rem] text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 text-left font-medium">{t.unitCol}</th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">{t.valueCol}</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHT_UNITS.map((u) => (
                <tr key={u} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">{t.units[u]}</th>
                  <td className="py-2 pl-3 text-right tabular-nums">{num(r.converted[u])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>
    </div>
  );
}

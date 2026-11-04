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
import { formatNumber, formatTaka } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateRod,
  DIAMETERS_MM,
  LENGTH_UNITS,
  MAX_BARS,
  MAX_LENGTH,
  MAX_PRICE_PER_TONNE,
  type Diameter,
  type LengthUnit,
  type RodError,
  type RodField,
  type RodResult,
} from "./logic";

const SLUG = "rod-weight-calculator";
const DIAMETER_KEYS = DIAMETERS_MM.map(String) as readonly string[];
/** Remembered in this browser: bar size and length unit. */
const DIAMETER_PREF = choicePreference(SLUG, "diameter", DIAMETER_KEYS, "12");
const UNIT_PREF = choicePreference(SLUG, "unit", LENGTH_UNITS, "ft");

const FIELD_IDS: Record<RodField, string> = {
  length: "rod-length",
  bars: "rod-bars",
  price: "rod-price",
};
const DIAMETER_ID = "rod-diameter";

const num = (value: number, decimals = 2) => formatNumber(value, { decimals });

const STRINGS = {
  en: {
    submit: "Calculate weight",
    diameter: "Rod size (diameter)",
    unitLegend: "Length in",
    units: { m: "Metres", ft: "Feet" } satisfies Record<LengthUnit, string>,
    unitShort: { m: "m", ft: "ft" } satisfies Record<LengthUnit, string>,
    length: "Length of one rod",
    bars: "Number of rods",
    barsSuffix: "rods",
    price: "Price per tonne (optional)",
    priceHint: "Enter your dealer’s price to see the cost.",
    errLength: "length",
    errBars: "number of rods",
    errPrice: "price per tonne",
    errLengthMin: "more than 0",
    errLengthMax: (unit: LengthUnit) => `${MAX_LENGTH[unit]} ${unit === "m" ? "m" : "ft"} or less`,
    errBarsMin: "at least 1",
    errBarsMax: `${formatNumber(MAX_BARS)} or less`,
    errPriceMin: "৳0 or more",
    errPriceMax: `${formatTaka(MAX_PRICE_PER_TONNE)} or less`,
    resultTitle: (bars: string, d: number, len: string) => `${bars} × ${d} mm, ${len} each`,
    kg: "kg",
    tonnes: (t: string) => `${t} tonnes`,
    perMetre: "Weight per metre",
    perFoot: "Weight per foot",
    totalLength: "Total length",
    cost: "Cost",
    note: "Theoretical weight from d² ÷ 162.2 (steel at 7,850 kg/m³). Real rods can differ slightly; for billing, go by the weighed weight.",
    announcement: (kg: string) => `Total weight about ${kg} kg.`,
    placeholderTitleFirst: "The rod weight will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Choose the rod size, enter the length and number of rods, then select Calculate weight.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Rod weight calculated with HisabBD",
    shareText: (head: string, kg: string, t: string, cost: string) =>
      `${head}: ${kg} kg (${t} tonnes)${cost}. Calculated with HisabBD’s Rod Weight Calculator.`,
    costPart: (cost: string) => `, cost ${cost}`,
  },
  bn: {
    submit: "ওজন হিসাব করুন",
    diameter: "রডের মাপ (ব্যাস)",
    unitLegend: "দৈর্ঘ্যের একক",
    units: { m: "মিটার", ft: "ফুট" } satisfies Record<LengthUnit, string>,
    unitShort: { m: "মিটার", ft: "ফুট" } satisfies Record<LengthUnit, string>,
    length: "একটি রডের দৈর্ঘ্য",
    bars: "রডের সংখ্যা",
    barsSuffix: "টি",
    price: "টনপ্রতি দাম (ঐচ্ছিক)",
    priceHint: "খরচ দেখতে ডিলারের দেওয়া দাম লিখুন।",
    errLength: "দৈর্ঘ্য",
    errBars: "রডের সংখ্যা",
    errPrice: "টনপ্রতি দাম",
    errLengthMin: "0-এর বেশি",
    errLengthMax: (unit: LengthUnit) => `${MAX_LENGTH[unit]} ${unit === "m" ? "মিটার" : "ফুট"} বা তার কম`,
    errBarsMin: "অন্তত 1",
    errBarsMax: `${formatNumber(MAX_BARS)} বা তার কম`,
    errPriceMin: "৳0 বা তার বেশি",
    errPriceMax: `${formatTaka(MAX_PRICE_PER_TONNE)} বা তার কম`,
    resultTitle: (bars: string, d: number, len: string) => `${bars}টি ${d} মিমি রড, প্রতিটি ${len}`,
    kg: "কেজি",
    tonnes: (t: string) => `${t} টন`,
    perMetre: "প্রতি মিটারে ওজন",
    perFoot: "প্রতি ফুটে ওজন",
    totalLength: "মোট দৈর্ঘ্য",
    cost: "খরচ",
    note: "d² ÷ 162.2 সূত্রে তাত্ত্বিক ওজন (ইস্পাত 7,850 কেজি/ঘনমিটার)। আসল রড সামান্য আলাদা হতে পারে; বিলের জন্য মেপে পাওয়া ওজনই ধরুন।",
    announcement: (kg: string) => `মোট ওজন প্রায় ${kg} কেজি।`,
    placeholderTitleFirst: "রডের ওজন এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "রডের মাপ বেছে নিয়ে দৈর্ঘ্য আর সংখ্যা লিখুন, তারপর “ওজন হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে রডের ওজন হিসাব",
    shareText: (head: string, kg: string, t: string, cost: string) =>
      `${head}: ${kg} কেজি (${t} টন)${cost}। HisabBD-র রডের ওজন ক্যালকুলেটরে হিসাব করা।`,
    costPart: (cost: string) => `, খরচ ${cost}`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, unit: LengthUnit, error: RodError): string {
  switch (error.field) {
    case "length":
      return numberErrorMessage(error.code, { label: t.errLength, min: t.errLengthMin, max: t.errLengthMax(unit) }, locale);
    case "bars":
      return numberErrorMessage(error.code, { label: t.errBars, min: t.errBarsMin, max: t.errBarsMax }, locale);
    case "price":
      return numberErrorMessage(error.code, { label: t.errPrice, min: t.errPriceMin, max: t.errPriceMax }, locale);
  }
}

function heading(t: Strings, r: RodResult): string {
  return t.resultTitle(formatNumber(r.bars), r.diameter, `${num(r.lengthPerBar)} ${t.unitShort[r.unit]}`);
}

function shareText(t: Strings, r: RodResult): string {
  return t.shareText(
    heading(t, r),
    num(r.totalKg),
    num(r.totalTonnes, 3),
    r.cost === null ? "" : t.costPart(formatTaka(r.cost)),
  );
}

export function RodCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [diameterKey, setDiameterKey] = usePreference(DIAMETER_PREF);
  const [unit, setUnit] = usePreference(UNIT_PREF);
  const [length, setLength] = useState("");
  const [bars, setBars] = useState("");
  const [price, setPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    length: useRef<HTMLInputElement>(null),
    bars: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
  };

  const diameter = (DIAMETERS_MM.find((d) => String(d) === diameterKey) ?? 12) as Diameter;
  const raw = { length, bars, price };
  const calc = submitted ? calculateRod(diameter, raw, unit) : null;
  const errorFor = (field: RodField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, unit, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateRod(diameter, raw, unit);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ diameter: diameterKey, unit, length, bars, price }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    if (DIAMETER_PREF.isValid(text("diameter"))) setDiameterKey(text("diameter"));
    const savedUnit = text("unit");
    if (UNIT_PREF.isValid(savedUnit)) setUnit(savedUnit);
    setLength(text("length"));
    setBars(text("bars"));
    setPrice(text("price"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered rod size and unit stay. */
  function onReset() {
    setLength("");
    setBars("");
    setPrice("");
    setSubmitted(false);
    setRevealCount(0);
    refs.length.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id={DIAMETER_ID} label={t.diameter}>
              {(control) => (
                <Select {...control} value={diameterKey} onChange={(event) => setDiameterKey(event.target.value)}>
                  {DIAMETERS_MM.map((d) => (
                    <option key={d} value={String(d)}>
                      {formatNumber(d)} mm
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <SegmentedControl
              name="rod-unit"
              legend={t.unitLegend}
              options={LENGTH_UNITS.map((value) => ({ value, label: t.units[value] }))}
              value={unit}
              onChange={setUnit}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id={FIELD_IDS.length} label={t.length} error={errorFor("length")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.length}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix={t.unitShort[unit]}
                  placeholder={unit === "ft" ? "40" : "12"}
                  value={length}
                  onChange={(event) => setLength(event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.bars} label={t.bars} error={errorFor("bars")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.bars}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  suffix={t.barsSuffix}
                  placeholder="40"
                  value={bars}
                  onChange={(event) => setBars(event.target.value)}
                />
              )}
            </FormField>
          </div>
          <FormField id={FIELD_IDS.price} label={t.price} hint={t.priceHint} error={errorFor("price")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.price}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(num(result.totalKg)) : ""}
        result={result && <RodResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">– {t.kg}</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function RodResultView({ result: r }: { result: RodResult }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.perMetre, value: `${num(r.kgPerMetre, 3)} ${t.kg}` },
    { label: t.perFoot, value: `${num(r.kgPerFoot, 3)} ${t.kg}` },
    { label: t.totalLength, value: `${num(r.totalMetres)} ${t.unitShort.m}` },
    ...(r.cost === null ? [] : [{ label: t.cost, value: formatTaka(r.cost) }]),
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={heading(t, r)}
        titleId="rod-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {num(r.totalKg)} <span className="text-2xl">{t.kg}</span>
            </p>
            <p className="mt-1 text-slate-700">{t.tonnes(num(r.totalTonnes, 3))}</p>
          </>
        }
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>
    </div>
  );
}

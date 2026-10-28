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
import { formatNumber } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateBmi,
  kgToLb,
  WEIGHT_RANGE_KG,
  type BmiCategoryId,
  type BmiError,
  type BmiField,
  type BmiResult,
  type HeightUnit,
  type WeightUnit,
} from "./logic";

/** Units are remembered in this browser; the measurements themselves only in the calculation history. */
const HEIGHT_UNIT = choicePreference<HeightUnit>("bmi-calculator", "heightUnit", ["cm", "ftin"], "cm");
const WEIGHT_UNIT = choicePreference<WeightUnit>("bmi-calculator", "weightUnit", ["kg", "lb"], "kg");

const FIELD_IDS: Record<BmiField, string> = {
  heightCm: "bmi-height-cm",
  heightFeet: "bmi-height-feet",
  heightInches: "bmi-height-inches",
  weight: "bmi-weight",
};

const HEIGHT_UNITS: readonly { value: HeightUnit; label: string }[] = [
  { value: "cm", label: "cm" },
  { value: "ftin", label: "ft + in" },
];
const WEIGHT_UNITS: readonly { value: WeightUnit; label: string }[] = [
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
];

const STRINGS = {
  en: {
    submit: "Calculate BMI",
    heightUnit: "Height unit",
    weightUnit: "Weight unit",
    height: "Height",
    feet: "Feet",
    inches: "Inches",
    weight: "Weight",
    heightPlaceholder: "e.g. 165",
    weightPlaceholderKg: "e.g. 62",
    weightPlaceholderLb: "e.g. 137",
    adultsNote: "For adults aged 18 and over.",
    announcement: (bmi: string, category: string) => `Your BMI is ${bmi}: ${category}.`,
    placeholderTitleFirst: "Your BMI will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter your height and weight, then select Calculate BMI.",
    placeholderFix: "Fix the highlighted fields above and your BMI will show here.",
    resultTitle: "Your body mass index",
    category: "Category",
    usedLabel: "Height and weight used",
    rangeLabel: "Healthy weight range for your height",
    rangeTo: "to",
    screeningNote:
      "BMI is a screening measure for adults, not a diagnosis. It isn’t meant for children, teenagers, pregnancy or very muscular people.",
    shareTitle: "BMI calculated with HisabBD",
    shareText: (bmi: string, category: string, cm: string, kg: string, min: string, max: string, unit: string) =>
      `BMI ${bmi} (${category}) at ${cm} cm and ${kg} kg. Healthy weight range for this height: ${min} to ${max} ${unit}. BMI is a screening measure, not a diagnosis. Calculated with HisabBD’s BMI Calculator.`,
    categoryNames: {
      underweight: "Underweight",
      healthy: "Healthy weight",
      overweight: "Overweight",
      obesity: "Obesity",
    } as Record<BmiCategoryId, string>,
    categoryNotes: {
      underweight:
        "This is below the adult healthy range. Some people are naturally slim, but if you have lost weight without trying or feel unwell, it’s worth talking to a doctor.",
      healthy:
        "This is within the adult healthy range. BMI doesn’t measure body fat, fitness or overall health, so it is only one piece of the picture.",
      overweight:
        "This is above the adult healthy range. BMI alone doesn’t show body fat or health, so look at it together with things like waist size, diet and activity, and ask a doctor if you’re unsure.",
      obesity:
        "On average, a higher BMI goes with a higher risk of some health problems, but BMI alone is not a diagnosis. A doctor can look at your whole health and suggest next steps.",
    } as Record<BmiCategoryId, string>,
    obesityClasses: { 1: "class I", 2: "class II", 3: "class III" } as Record<1 | 2 | 3, string>,
    bandRanges: {
      underweight: "below 18.5",
      healthy: "18.5 to 24.9",
      overweight: "25 to 29.9",
      obesity: "30 and above",
    } as Record<BmiCategoryId, string>,
    errHeightCmLabel: "height in centimetres",
    errHeightCmMin: "at least 50 cm",
    errHeightCmMax: "272 cm or less",
    errTotalHeight:
      "The total height must be between about 50 cm and 272 cm (roughly 1 ft 8 in to 8 ft 11 in).",
    errFeetLabel: "feet",
    errFeetMin: "at least 1",
    errFeetMax: "8 or less",
    errInchesLabel: "inches",
    errInchesMin: "0 or more",
    errInchesMax: "less than 12 (put whole feet in the feet box)",
    errWeightLabel: "weight",
    weightMin: (v: string) => `at least ${v}`,
    weightMax: (v: string) => `${v} or less`,
  },
  bn: {
    submit: "বিএমআই হিসাব করুন",
    heightUnit: "উচ্চতার একক",
    weightUnit: "ওজনের একক",
    height: "উচ্চতা",
    feet: "ফুট",
    inches: "ইঞ্চি",
    weight: "ওজন",
    heightPlaceholder: "যেমন 165",
    weightPlaceholderKg: "যেমন 62",
    weightPlaceholderLb: "যেমন 137",
    adultsNote: "১৮ বছর বা তার বেশি বয়সী প্রাপ্তবয়স্কদের জন্য।",
    announcement: (bmi: string, category: string) => `আপনার বিএমআই ${bmi}: ${category}।`,
    placeholderTitleFirst: "আপনার বিএমআই এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "উচ্চতা ও ওজন লিখে “বিএমআই হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই বিএমআই এখানে দেখা যাবে।",
    resultTitle: "আপনার বডি মাস ইনডেক্স",
    category: "ক্যাটাগরি",
    usedLabel: "যে উচ্চতা ও ওজন ধরা হয়েছে",
    rangeLabel: "আপনার উচ্চতায় স্বাস্থ্যকর ওজনের সীমা",
    rangeTo: "থেকে",
    screeningNote:
      "বিএমআই প্রাপ্তবয়স্কদের জন্য একটি প্রাথমিক যাচাই মাত্র, কোনো রোগনির্ণয় নয়। শিশু-কিশোর, গর্ভাবস্থা বা খুব পেশিবহুল মানুষের জন্য এটি প্রযোজ্য নয়।",
    shareTitle: "HisabBD দিয়ে বিএমআই হিসাব",
    shareText: (bmi: string, category: string, cm: string, kg: string, min: string, max: string, unit: string) =>
      `বিএমআই ${bmi} (${category}) — ${cm} সেমি, ${kg} কেজিতে। এই উচ্চতায় স্বাস্থ্যকর ওজনের সীমা: ${min} থেকে ${max} ${unit}। বিএমআই প্রাথমিক যাচাই মাত্র, রোগনির্ণয় নয়। HisabBD-র বিএমআই ক্যালকুলেটরে হিসাব করা।`,
    categoryNames: {
      underweight: "কম ওজন",
      healthy: "স্বাস্থ্যকর ওজন",
      overweight: "বাড়তি ওজন",
      obesity: "স্থূলতা",
    } as Record<BmiCategoryId, string>,
    categoryNotes: {
      underweight:
        "এটি প্রাপ্তবয়স্কদের স্বাস্থ্যকর সীমার নিচে। কেউ কেউ স্বাভাবিকভাবেই রোগা, তবে চেষ্টা ছাড়াই ওজন কমে গেলে বা অসুস্থ লাগলে ডাক্তারের সাথে কথা বলা ভালো।",
      healthy:
        "এটি প্রাপ্তবয়স্কদের স্বাস্থ্যকর সীমার মধ্যে। বিএমআই শরীরের চর্বি, ফিটনেস বা সার্বিক স্বাস্থ্য মাপে না, তাই এটি পুরো ছবির একটি অংশ মাত্র।",
      overweight:
        "এটি প্রাপ্তবয়স্কদের স্বাস্থ্যকর সীমার ওপরে। শুধু বিএমআই দিয়ে চর্বি বা স্বাস্থ্য বোঝা যায় না, তাই কোমরের মাপ, খাদ্যাভ্যাস ও চলাফেরার সাথে মিলিয়ে দেখুন, আর সংশয় থাকলে ডাক্তারকে জিজ্ঞেস করুন।",
      obesity:
        "গড়ে, বেশি বিএমআই-এর সাথে কিছু স্বাস্থ্য-ঝুঁকিও বাড়ে, তবে শুধু বিএমআই কোনো রোগনির্ণয় নয়। ডাক্তার আপনার সার্বিক স্বাস্থ্য দেখে পরবর্তী করণীয় বলতে পারবেন।",
    } as Record<BmiCategoryId, string>,
    obesityClasses: { 1: "ক্লাস I", 2: "ক্লাস II", 3: "ক্লাস III" } as Record<1 | 2 | 3, string>,
    bandRanges: {
      underweight: "18.5-এর নিচে",
      healthy: "18.5 থেকে 24.9",
      overweight: "25 থেকে 29.9",
      obesity: "30 বা তার বেশি",
    } as Record<BmiCategoryId, string>,
    errHeightCmLabel: "সেন্টিমিটারে উচ্চতা",
    errHeightCmMin: "কমপক্ষে 50 সেমি",
    errHeightCmMax: "272 সেমি বা তার কম",
    errTotalHeight: "মোট উচ্চতা মোটামুটি 50 থেকে 272 সেমির মধ্যে হতে হবে (প্রায় 1 ফুট 8 ইঞ্চি থেকে 8 ফুট 11 ইঞ্চি)।",
    errFeetLabel: "ফুট",
    errFeetMin: "কমপক্ষে 1",
    errFeetMax: "8 বা তার কম",
    errInchesLabel: "ইঞ্চি",
    errInchesMin: "0 বা তার বেশি",
    errInchesMax: "12-র কম (পুরো ফুট ফুটের ঘরে লিখুন)",
    errWeightLabel: "ওজন",
    weightMin: (v: string) => `কমপক্ষে ${v}`,
    weightMax: (v: string) => `${v} বা তার কম`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

/** The visual scale runs from BMI 15 to 40; values outside are pinned to the ends. */
const SCALE_MIN = 15;
const SCALE_MAX = 40;
const SCALE_BANDS: readonly { id: BmiCategoryId; from: number; to: number; color: string }[] = [
  { id: "underweight", from: 15, to: 18.5, color: "bg-sky-400" },
  { id: "healthy", from: 18.5, to: 25, color: "bg-emerald-500" },
  { id: "overweight", from: 25, to: 30, color: "bg-amber-400" },
  { id: "obesity", from: 30, to: 40, color: "bg-rose-500" },
];

function categoryLabel(t: Strings, r: BmiResult): string {
  const name = t.categoryNames[r.category];
  return r.obesityClass ? `${name} (${t.obesityClasses[r.obesityClass]})` : name;
}

function scalePercent(bmi: number): number {
  const clamped = Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX);
  return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

/** Weight limits as shown in messages, in the chosen unit (rounded inwards so they are valid). */
function weightLimits(t: Strings, unit: WeightUnit): { min: string; max: string } {
  if (unit === "kg") {
    return { min: t.weightMin(`${WEIGHT_RANGE_KG.min} kg`), max: t.weightMax(`${WEIGHT_RANGE_KG.max} kg`) };
  }
  const min = Math.ceil(kgToLb(WEIGHT_RANGE_KG.min) * 100) / 100;
  const max = Math.floor(kgToLb(WEIGHT_RANGE_KG.max) * 100) / 100;
  return { min: t.weightMin(`${formatNumber(min)} lb`), max: t.weightMax(`${formatNumber(max)} lb`) };
}

function errorMessage(t: Strings, locale: Locale, error: BmiError, weightUnit: WeightUnit): string {
  switch (error.field) {
    case "heightCm":
      return numberErrorMessage(
        error.code === "height-range" ? "invalid" : error.code,
        { label: t.errHeightCmLabel, min: t.errHeightCmMin, max: t.errHeightCmMax },
        locale,
      );
    case "heightFeet":
      if (error.code === "height-range") return t.errTotalHeight;
      return numberErrorMessage(error.code, { label: t.errFeetLabel, min: t.errFeetMin, max: t.errFeetMax }, locale);
    case "heightInches":
      return numberErrorMessage(
        error.code === "height-range" ? "invalid" : error.code,
        { label: t.errInchesLabel, min: t.errInchesMin, max: t.errInchesMax },
        locale,
      );
    case "weight":
      return numberErrorMessage(
        error.code === "height-range" ? "invalid" : error.code,
        { label: t.errWeightLabel, ...weightLimits(t, weightUnit) },
        locale,
      );
  }
}

function shareText(t: Strings, r: BmiResult): string {
  const range = r.healthyWeightRange;
  return t.shareText(
    formatNumber(r.bmiRounded, { decimals: 1, minDecimals: 1 }),
    categoryLabel(t, r),
    formatNumber(r.heightCm, { decimals: 1 }),
    formatNumber(r.weightKg, { decimals: 1 }),
    formatNumber(range.min, { decimals: 1 }),
    formatNumber(range.max, { decimals: 1 }),
    range.unit,
  );
}

export function BmiCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [heightUnit, setHeightUnit] = usePreference(HEIGHT_UNIT);
  const [heightCm, setHeightCm] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weightUnit, setWeightUnit] = usePreference(WEIGHT_UNIT);
  const [weight, setWeight] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs: Record<BmiField, React.RefObject<HTMLInputElement | null>> = {
    heightCm: useRef<HTMLInputElement>(null),
    heightFeet: useRef<HTMLInputElement>(null),
    heightInches: useRef<HTMLInputElement>(null),
    weight: useRef<HTMLInputElement>(null),
  };

  const input = { heightUnit, heightCm, heightFeet, heightInches, weightUnit, weight };
  const calc = submitted ? calculateBmi(input) : null;
  const errorFor = (field: BmiField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error, weightUnit) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateBmi(input);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      // Only the fields of the chosen height unit, so the same measurement isn't saved twice.
      record(
        heightUnit === "cm"
          ? { heightUnit, heightCm, weightUnit, weight }
          : { heightUnit, heightFeet, heightInches, weightUnit, weight },
        shareText(t, check.result),
      );
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const savedHeightUnit = saved.heightUnit ?? "";
    const savedWeightUnit = saved.weightUnit ?? "";
    if (HEIGHT_UNIT.isValid(savedHeightUnit)) setHeightUnit(savedHeightUnit);
    if (WEIGHT_UNIT.isValid(savedWeightUnit)) setWeightUnit(savedWeightUnit);
    setHeightCm(saved.heightCm ?? "");
    setHeightFeet(saved.heightFeet ?? "");
    setHeightInches(saved.heightInches ?? "");
    setWeight(saved.weight ?? "");
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears the measurements; the remembered units stay. */
  function onReset() {
    setHeightCm("");
    setHeightFeet("");
    setHeightInches("");
    setWeight("");
    setSubmitted(false);
    setRevealCount(0);
    refs.heightCm.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <SegmentedControl
              name="bmi-height-unit"
              legend={t.heightUnit}
              options={HEIGHT_UNITS}
              value={heightUnit}
              onChange={setHeightUnit}
            />
            {heightUnit === "cm" ? (
              <FormField id={FIELD_IDS.heightCm} label={t.height} error={errorFor("heightCm")}>
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.heightCm}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix="cm"
                    placeholder={t.heightPlaceholder}
                    value={heightCm}
                    onChange={(event) => setHeightCm(event.target.value)}
                  />
                )}
              </FormField>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <FormField id={FIELD_IDS.heightFeet} label={t.feet} error={errorFor("heightFeet")}>
                  {(control) => (
                    <AffixInput
                      {...control}
                      ref={refs.heightFeet}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      suffix="ft"
                      placeholder="5"
                      value={heightFeet}
                      onChange={(event) => setHeightFeet(event.target.value)}
                    />
                  )}
                </FormField>
                <FormField id={FIELD_IDS.heightInches} label={t.inches} error={errorFor("heightInches")}>
                  {(control) => (
                    <AffixInput
                      {...control}
                      ref={refs.heightInches}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      suffix="in"
                      placeholder="7"
                      value={heightInches}
                      onChange={(event) => setHeightInches(event.target.value)}
                    />
                  )}
                </FormField>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <SegmentedControl
              name="bmi-weight-unit"
              legend={t.weightUnit}
              options={WEIGHT_UNITS}
              value={weightUnit}
              onChange={setWeightUnit}
            />
            <FormField id={FIELD_IDS.weight} label={t.weight} error={errorFor("weight")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.weight}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix={weightUnit}
                  placeholder={weightUnit === "kg" ? t.weightPlaceholderKg : t.weightPlaceholderLb}
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                />
              )}
            </FormField>
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-600">{t.adultsNote}</p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(formatNumber(result.bmiRounded, { decimals: 1, minDecimals: 1 }), categoryLabel(t, result)) : ""}
        result={result && <BmiResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–.–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function BmiResultView({ result: r }: { result: BmiResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const range = r.healthyWeightRange;
  const stats = [
    { label: t.category, value: categoryLabel(t, r) },
    {
      label: t.usedLabel,
      value: `${formatNumber(r.heightCm, { decimals: 1 })} cm, ${formatNumber(r.weightKg, { decimals: 1 })} kg`,
    },
    {
      label: t.rangeLabel,
      value: `${formatNumber(range.min, { decimals: 1 })} ${t.rangeTo} ${formatNumber(range.max, { decimals: 1 })} ${range.unit}`,
      wide: true,
    },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="bmi-result-heading"
        value={
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              {formatNumber(r.bmiRounded, { decimals: 1, minDecimals: 1 })}
            </span>
            <span className="text-xl font-semibold text-slate-800">{categoryLabel(t, r)}</span>
          </p>
        }
      >
        <BmiScale bmi={r.bmiRounded} current={r.category} />
        <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-slate-800">{t.categoryNotes[r.category]}</p>
        <ResultStats items={stats} className="mt-5" />
        <p className="mt-4 text-sm text-slate-600">{t.screeningNote}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, r)} text={shareText(t, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

/** Decorative colour scale; the category is always also written as text. */
function BmiScale({ bmi, current }: { bmi: number; current: BmiCategoryId }) {
  const t = STRINGS[useLocale()];
  return (
    <div>
      <div aria-hidden="true" className="relative pt-3 pb-1">
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
          {SCALE_BANDS.map((band) => (
            <div
              key={band.id}
              className={band.color}
              style={{ width: `${((band.to - band.from) / (SCALE_MAX - SCALE_MIN)) * 100}%` }}
            />
          ))}
        </div>
        <div
          className="absolute top-0 bottom-0 -translate-x-1/2"
          style={{ left: `${scalePercent(bmi)}%` }}
        >
          <div className="mx-auto h-full w-1 rounded-full bg-slate-900 ring-2 ring-white" />
        </div>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
        {SCALE_BANDS.map((band) => (
          <li key={band.id} className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-3 shrink-0 rounded-full ${band.color}`} />
            <span className={band.id === current ? "font-semibold text-slate-900" : undefined}>
              {t.categoryNames[band.id]}: {t.bandRanges[band.id]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

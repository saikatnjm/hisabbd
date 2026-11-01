"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { AffixInput, FormField, SegmentedControl, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  ACTIVITY_LEVELS,
  calculateCalories,
  MAX_AGE,
  MAX_HEIGHT_CM,
  MAX_WEIGHT_KG,
  MIN_AGE,
  MIN_HEIGHT_CM,
  MIN_WEIGHT_KG,
  SEXES,
  type ActivityLevel,
  type CalorieError,
  type CalorieField,
  type CalorieResult,
  type Sex,
} from "./logic";

const SLUG = "calorie-calculator";
/** Remembered in this browser: the activity level (a setting, not a personal measurement). */
const ACTIVITY_PREF = choicePreference(SLUG, "activity", ACTIVITY_LEVELS, "light");

const FIELD_IDS: Record<CalorieField, string> = {
  age: "calorie-age",
  height: "calorie-height",
  weight: "calorie-weight",
};
const ACTIVITY_ID = "calorie-activity";

const kcal = (value: number) => formatNumber(value, { decimals: 0 });

const STRINGS = {
  en: {
    submit: "Calculate calories",
    sexLegend: "Sex",
    sexes: { male: "Male", female: "Female" } satisfies Record<Sex, string>,
    age: "Age",
    ageSuffix: "years",
    height: "Height",
    heightHint: "In feet and inches? Convert it with the Height Converter.",
    weight: "Weight",
    activity: "Activity",
    activities: {
      sedentary: "Sedentary: little or no exercise (× 1.2)",
      light: "Light: exercise 1–3 days a week (× 1.375)",
      moderate: "Moderate: exercise 3–5 days a week (× 1.55)",
      very: "Very active: hard exercise 6–7 days (× 1.725)",
      extra: "Extra active: hard daily exercise or physical job (× 1.9)",
    } satisfies Record<ActivityLevel, string>,
    activityShort: {
      sedentary: "Sedentary",
      light: "Light",
      moderate: "Moderate",
      very: "Very active",
      extra: "Extra active",
    } satisfies Record<ActivityLevel, string>,
    errAge: "age",
    errHeight: "height",
    errWeight: "weight",
    errAgeMin: `${MIN_AGE} or more (adults only)`,
    errAgeMax: `${MAX_AGE} or less`,
    errHeightMin: `at least ${MIN_HEIGHT_CM} cm`,
    errHeightMax: `${MAX_HEIGHT_CM} cm or less`,
    errWeightMin: `at least ${MIN_WEIGHT_KG} kg`,
    errWeightMax: `${MAX_WEIGHT_KG} kg or less`,
    unit: "kcal a day",
    resultTitle: (level: string) => `Calories a day to keep your weight (${level})`,
    bmr: (value: string) => `BMR (at rest): ${value} kcal a day`,
    tableCaption: "Daily calories at each activity level",
    levelCol: "Activity",
    kcalCol: "kcal a day",
    note: "An estimate: Mifflin–St Jeor (1990) for BMR, and the usual activity factors, which are a convention. Not for children or during pregnancy. For a diet plan, ask a doctor or nutritionist.",
    announcement: (daily: string, bmr: string) => `About ${daily} kcal a day. BMR ${bmr} kcal.`,
    placeholderTitleFirst: "Your daily calories will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter your age, height and weight, then select Calculate calories.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Calories calculated with HisabBD",
    shareText: (daily: string, level: string, bmr: string) =>
      `About ${daily} kcal a day to keep my weight (${level}); BMR ${bmr} kcal. Estimated with HisabBD’s Calorie Calculator.`,
  },
  bn: {
    submit: "ক্যালরি হিসাব করুন",
    sexLegend: "লিঙ্গ",
    sexes: { male: "পুরুষ", female: "নারী" } satisfies Record<Sex, string>,
    age: "বয়স",
    ageSuffix: "বছর",
    height: "উচ্চতা",
    heightHint: "ফুট-ইঞ্চিতে জানেন? উচ্চতা রূপান্তর দিয়ে সেমিতে নিন।",
    weight: "ওজন",
    activity: "কাজকর্মের মাত্রা",
    activities: {
      sedentary: "প্রায় বসে থাকা: ব্যায়াম নেই বললেই চলে (× 1.2)",
      light: "হালকা: সপ্তাহে 1–3 দিন ব্যায়াম (× 1.375)",
      moderate: "মাঝারি: সপ্তাহে 3–5 দিন ব্যায়াম (× 1.55)",
      very: "বেশি সক্রিয়: সপ্তাহে 6–7 দিন কঠোর ব্যায়াম (× 1.725)",
      extra: "খুব বেশি সক্রিয়: রোজ কঠোর ব্যায়াম বা শারীরিক পরিশ্রমের কাজ (× 1.9)",
    } satisfies Record<ActivityLevel, string>,
    activityShort: {
      sedentary: "প্রায় বসে থাকা",
      light: "হালকা",
      moderate: "মাঝারি",
      very: "বেশি সক্রিয়",
      extra: "খুব বেশি সক্রিয়",
    } satisfies Record<ActivityLevel, string>,
    errAge: "বয়স",
    errHeight: "উচ্চতা",
    errWeight: "ওজন",
    errAgeMin: `${MIN_AGE} বা তার বেশি (শুধু প্রাপ্তবয়স্ক)`,
    errAgeMax: `${MAX_AGE} বা তার কম`,
    errHeightMin: `অন্তত ${MIN_HEIGHT_CM} সেমি`,
    errHeightMax: `${MAX_HEIGHT_CM} সেমি বা তার কম`,
    errWeightMin: `অন্তত ${MIN_WEIGHT_KG} কেজি`,
    errWeightMax: `${MAX_WEIGHT_KG} কেজি বা তার কম`,
    unit: "কিলোক্যালরি/দিন",
    resultTitle: (level: string) => `ওজন ঠিক রাখতে দিনে ক্যালরি (${level})`,
    bmr: (value: string) => `বিএমআর (বিশ্রামে): দিনে ${value} কিলোক্যালরি`,
    tableCaption: "প্রতিটি কাজকর্মের মাত্রায় দৈনিক ক্যালরি",
    levelCol: "কাজকর্ম",
    kcalCol: "কিলোক্যালরি/দিন",
    note: "আনুমানিক হিসাব: বিএমআর মিফলিন–সেন্ট জিওর (1990) সূত্রে, আর প্রচলিত কাজকর্মের গুণক, যা একটি রীতি। শিশু বা গর্ভাবস্থার জন্য নয়। খাদ্য পরিকল্পনার জন্য ডাক্তার বা পুষ্টিবিদের পরামর্শ নিন।",
    announcement: (daily: string, bmr: string) => `দিনে প্রায় ${daily} কিলোক্যালরি। বিএমআর ${bmr} কিলোক্যালরি।`,
    placeholderTitleFirst: "দৈনিক ক্যালরি এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "বয়স, উচ্চতা আর ওজন লিখে “ক্যালরি হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে ক্যালরি হিসাব",
    shareText: (daily: string, level: string, bmr: string) =>
      `ওজন ঠিক রাখতে দিনে প্রায় ${daily} কিলোক্যালরি (${level}); বিএমআর ${bmr} কিলোক্যালরি। HisabBD-র ক্যালরি ক্যালকুলেটরে আনুমানিক হিসাব।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: CalorieError): string {
  switch (error.field) {
    case "age":
      return numberErrorMessage(error.code, { label: t.errAge, min: t.errAgeMin, max: t.errAgeMax }, locale);
    case "height":
      return numberErrorMessage(error.code, { label: t.errHeight, min: t.errHeightMin, max: t.errHeightMax }, locale);
    case "weight":
      return numberErrorMessage(error.code, { label: t.errWeight, min: t.errWeightMin, max: t.errWeightMax }, locale);
  }
}

function shareText(t: Strings, r: CalorieResult): string {
  return t.shareText(kcal(r.daily), t.activityShort[r.activity], kcal(r.bmr));
}

export function CalorieCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = usePreference(ACTIVITY_PREF);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    age: useRef<HTMLInputElement>(null),
    height: useRef<HTMLInputElement>(null),
    weight: useRef<HTMLInputElement>(null),
  };

  const raw = { age, height, weight };
  const calc = submitted ? calculateCalories(sex, raw, activity) : null;
  const errorFor = (field: CalorieField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateCalories(sex, raw, activity);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ sex, age, height, weight, activity }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedSex = SEXES.find((s) => s === text("sex"));
    if (savedSex) setSex(savedSex);
    setAge(text("age"));
    setHeight(text("height"));
    setWeight(text("weight"));
    const savedActivity = text("activity");
    if (ACTIVITY_PREF.isValid(savedActivity)) setActivity(savedActivity);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setAge("");
    setHeight("");
    setWeight("");
    setSubmitted(false);
    setRevealCount(0);
    refs.age.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-5">
          <SegmentedControl
            name="calorie-sex"
            legend={t.sexLegend}
            options={SEXES.map((value) => ({ value, label: t.sexes[value] }))}
            value={sex}
            onChange={setSex}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField id={FIELD_IDS.age} label={t.age} error={errorFor("age")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.age}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  suffix={t.ageSuffix}
                  placeholder="30"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.height} label={t.height} hint={t.heightHint} error={errorFor("height")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.height}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix="cm"
                  placeholder="165"
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.weight} label={t.weight} error={errorFor("weight")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.weight}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix="kg"
                  placeholder="65"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                />
              )}
            </FormField>
          </div>
          <FormField id={ACTIVITY_ID} label={t.activity}>
            {(control) => (
              <Select
                {...control}
                value={activity}
                onChange={(event) => {
                  const next = ACTIVITY_LEVELS.find((level) => level === event.target.value);
                  if (next) setActivity(next);
                }}
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {t.activities[level]}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(kcal(result.daily), kcal(result.bmr)) : ""}
        result={result && <CalorieResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">– kcal</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function CalorieResultView({ result: r }: { result: CalorieResult }) {
  const t = STRINGS[useLocale()];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(t.activityShort[r.activity])}
        titleId="calorie-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {kcal(r.daily)} <span className="text-xl font-semibold text-slate-700">{t.unit}</span>
            </p>
            <p className="mt-1 text-slate-700">{t.bmr(kcal(r.bmr))}</p>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[16rem] text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 text-left font-medium">{t.levelCol}</th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">{t.kcalCol}</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_LEVELS.map((level) => (
                <tr key={level} className={level === r.activity ? "bg-white/70 font-semibold" : undefined}>
                  <th scope="row" className="border-b border-slate-200 py-2 pr-3 text-left font-medium text-slate-900">
                    {t.activityShort[level]}
                  </th>
                  <td className="border-b border-slate-200 py-2 pl-3 text-right tabular-nums">{kcal(r.byActivity[level])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

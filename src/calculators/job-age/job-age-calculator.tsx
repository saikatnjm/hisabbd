"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, Input, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { countBn, formatPlainDate, joinList, pluralize } from "@/lib/format";
import { useToday } from "@/lib/use-today";
import {
  calculateJobAge,
  JOB_AGE_PRESETS,
  type JobAgeError,
  type JobAgeField,
  type JobAgeInput,
  type JobAgePresetId,
  type JobAgeResult,
  type YearsMonthsDays,
} from "./logic";

const FIELD_IDS: Record<JobAgeField, string> = {
  dateOfBirth: "job-age-date-of-birth",
  referenceDate: "job-age-reference-date",
  minAge: "job-age-min",
  maxAge: "job-age-max",
  relaxation: "job-age-relaxation",
};
const PRESET_ID = "job-age-preset";
const PRESET_IDS: readonly JobAgePresetId[] = ["bcs", "govt", "custom"];

/** All widget strings, per locale. The maths in logic.ts is language-free. */
const STRINGS = {
  en: {
    submit: "Check age limit",
    dob: "Date of birth",
    reference: "Age counted as on (circular date)",
    referenceHint: "The “age as on” date printed in the circular. Today by default.",
    preset: "Age limit",
    presets: {
      bcs: "BCS (21–32 years)",
      govt: "Other government jobs (18–32 years)",
      custom: "Custom",
    },
    presetHints: {
      bcs: "21 to 32 years on the circular’s date, as in recent BCS circulars. The circular’s own wording wins.",
      govt: "Maximum 32 for direct recruitment under the 2026 act; 18 is the usual minimum. Check the circular.",
      custom: "Enter the limits printed in the circular.",
    },
    minAge: "Minimum age",
    maxAge: "Maximum age",
    yearsSuffix: "years",
    relaxation: "Extra years allowed (optional)",
    relaxationHint:
      "Some quotas or posts allow extra years above the maximum; the circular states them. Leave blank for none.",
    errors: {
      missingDob: "Enter a full date of birth: day, month and year.",
      missingReference: "Enter the date the circular counts age on.",
      invalid: "This isn’t a real date. Check the day, month and 4-digit year.",
      dobAfterReference: "Date of birth can’t be later than the circular date.",
      maxBelowMin: "The maximum age can’t be less than the minimum age.",
      minLabel: "minimum age",
      maxLabel: "maximum age",
      limitMin: "0 or more",
      limitMax: "70 or less",
      relaxationLabel: "extra years",
      relaxationMin: "0 or more",
      relaxationMax: "10 or less",
    },
    year: (n: number) => pluralize(n, "year"),
    month: (n: number) => pluralize(n, "month"),
    day: (n: number) => pluralize(n, "day"),
    status: {
      eligible: "Eligible",
      "too-young": "Not eligible: under the minimum age",
      "too-old": "Not eligible: over the age limit",
    },
    announcement: (status: string, age: string, borderline: boolean) =>
      `${status}. Age on that date: ${age}.${borderline ? " Check the circular’s date-of-birth range." : ""}`,
    placeholderTitleFirst: "Your age-limit check will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a date of birth and the circular date, then select Check age limit.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    previewYears: "years",
    previewMonths: "months",
    previewDays: "days",
    resultTitle: (date: string) => `Age limit check as on ${date}`,
    ageLine: (age: string) => `Age on that date: ${age}`,
    window: (from: string, to: string) => (
      <>
        <strong>Eligible if born between</strong> {from} and {to}.
      </>
    ),
    untilMin: (age: number, date: string, span: string) => (
      <>
        <strong>Turns {age}</strong> on {date}, in {span}.
      </>
    ),
    overLimit: (age: number, date: string, span: string) => (
      <>
        <strong>Turned {age}</strong> on {date}: over the limit by {span}.
      </>
    ),
    turnedToday: (age: number) => (
      <>
        <strong>Turns {age}</strong> on this very date, so the limit is passed.
      </>
    ),
    passesLimit: (age: number, date: string) => (
      <>
        <strong>Turns {age}</strong> on {date}, when this upper limit is passed.
      </>
    ),
    borderline: (age: number) => (
      <>
        <strong>Check the circular.</strong> Some circulars read the upper limit as ‘must not have turned{" "}
        {age}’. Check the date-of-birth range printed in the circular.
      </>
    ),
    statLimit: "Age limit",
    statRelaxation: "Extra years",
    statEffectiveMax: "Highest age allowed",
    statReference: "Age counted as on",
    none: "None",
    limitRange: (min: number, max: number) => `${min}–${max} years`,
    circularWins: "The circular’s own age limit, date and date-of-birth range always win over this check.",
    shareTitle: "Job age limit checked with HisabBD",
    shareStatus: { eligible: "eligible", "too-young": "not eligible (too young)", "too-old": "not eligible (too old)" },
    shareText: (date: string, age: string, limit: string, status: string, from: string, to: string) =>
      `Age on ${date}: ${age}. Age limit ${limit}: ${status}. Eligible if born between ${from} and ${to}. Checked with HisabBD’s Government Job Age Calculator.`,
    shareRelaxation: (n: number) => ` (+${pluralize(n, "extra year")})`,
  },
  bn: {
    submit: "বয়সসীমা যাচাই করুন",
    dob: "জন্ম তারিখ",
    reference: "যে তারিখ ধরে বয়স গোনা হবে (বিজ্ঞপ্তির তারিখ)",
    referenceHint: "বিজ্ঞপ্তিতে যে তারিখে বয়স ধরার কথা লেখা আছে। শুরুতে আজকের তারিখ থাকে।",
    preset: "বয়সসীমা",
    presets: {
      bcs: "বিসিএস (21–32 বছর)",
      govt: "অন্যান্য সরকারি চাকরি (18–32 বছর)",
      custom: "নিজে লিখুন",
    },
    presetHints: {
      bcs: "সাম্প্রতিক বিসিএস বিজ্ঞপ্তির মতো, বিজ্ঞপ্তির তারিখে 21 থেকে 32 বছর। বিজ্ঞপ্তির কথাই চূড়ান্ত।",
      govt: "2026 সালের আইনে সরাসরি নিয়োগে সর্বোচ্চ 32; সর্বনিম্ন সাধারণত 18। বিজ্ঞপ্তি দেখে নিন।",
      custom: "বিজ্ঞপ্তিতে ছাপা বয়সসীমা লিখুন।",
    },
    minAge: "সর্বনিম্ন বয়স",
    maxAge: "সর্বোচ্চ বয়স",
    yearsSuffix: "বছর",
    relaxation: "অতিরিক্ত বয়স ছাড় (ঐচ্ছিক)",
    relaxationHint:
      "কিছু কোটা বা পদে সর্বোচ্চ বয়সের চেয়ে কয়েক বছর বেশি পর্যন্ত আবেদন করা যায়; বিজ্ঞপ্তিতে তা লেখা থাকে। না থাকলে ফাঁকা রাখুন।",
    errors: {
      missingDob: "পুরো জন্ম তারিখ লিখুন: দিন, মাস ও বছর।",
      missingReference: "বিজ্ঞপ্তি কোন তারিখ ধরে বয়স গোনে তা লিখুন।",
      invalid: "এটা সঠিক তারিখ নয়। দিন, মাস আর ৪ অঙ্কের বছর মিলিয়ে দেখুন।",
      dobAfterReference: "জন্ম তারিখ বিজ্ঞপ্তির তারিখের পরে হতে পারে না।",
      maxBelowMin: "সর্বোচ্চ বয়স সর্বনিম্ন বয়সের চেয়ে কম হতে পারে না।",
      minLabel: "সর্বনিম্ন বয়স",
      maxLabel: "সর্বোচ্চ বয়স",
      limitMin: "0 বা তার বেশি",
      limitMax: "70 বা তার কম",
      relaxationLabel: "অতিরিক্ত বছর",
      relaxationMin: "0 বা তার বেশি",
      relaxationMax: "10 বা তার কম",
    },
    year: (n: number) => countBn(n, "বছর"),
    month: (n: number) => countBn(n, "মাস"),
    day: (n: number) => countBn(n, "দিন"),
    status: {
      eligible: "যোগ্য",
      "too-young": "যোগ্য নন: সর্বনিম্ন বয়স হয়নি",
      "too-old": "যোগ্য নন: বয়সসীমা পেরিয়ে গেছে",
    },
    announcement: (status: string, age: string, borderline: boolean) =>
      `${status}। সেই তারিখে বয়স: ${age}।${borderline ? " বিজ্ঞপ্তির জন্ম তারিখের সীমা মিলিয়ে নিন।" : ""}`,
    placeholderTitleFirst: "বয়সসীমা যাচাইয়ের ফল এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "জন্ম তারিখ আর বিজ্ঞপ্তির তারিখ লিখে “বয়সসীমা যাচাই করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    previewYears: "বছর",
    previewMonths: "মাস",
    previewDays: "দিন",
    resultTitle: (date: string) => `${date} তারিখ ধরে বয়সসীমা যাচাই`,
    ageLine: (age: string) => `সেই তারিখে বয়স: ${age}`,
    window: (from: string, to: string) => (
      <>
        <strong>যোগ্য হতে জন্ম তারিখ</strong> {from} থেকে {to}-এর মধ্যে হতে হবে।
      </>
    ),
    untilMin: (age: number, date: string, span: string) => (
      <>
        <strong>{age} বছর পূর্ণ হবে</strong> {date} তারিখে, অর্থাৎ আর {span} পরে।
      </>
    ),
    overLimit: (age: number, date: string, span: string) => (
      <>
        <strong>{age} বছর পূর্ণ হয়েছে</strong> {date} তারিখে: সীমা পেরিয়েছে {span} আগে।
      </>
    ),
    turnedToday: (age: number) => (
      <>
        <strong>ঠিক এই তারিখেই {age} বছর পূর্ণ হচ্ছে</strong>, তাই সীমা পেরিয়ে গেছে।
      </>
    ),
    passesLimit: (age: number, date: string) => (
      <>
        <strong>{age} বছর পূর্ণ হবে</strong> {date} তারিখে, তখন এই সর্বোচ্চ সীমা পেরিয়ে যাবে।
      </>
    ),
    borderline: (age: number) => (
      <>
        <strong>বিজ্ঞপ্তি দেখে নিন।</strong> কোনো কোনো বিজ্ঞপ্তি সর্বোচ্চ সীমাকে “{age} বছর পূর্ণ হওয়া চলবে না”
        অর্থে পড়ে। বিজ্ঞপ্তিতে ছাপা জন্ম তারিখের সীমা মিলিয়ে নিন।
      </>
    ),
    statLimit: "বয়সসীমা",
    statRelaxation: "অতিরিক্ত ছাড়",
    statEffectiveMax: "সর্বোচ্চ অনুমোদিত বয়স",
    statReference: "যে তারিখ ধরে বয়স",
    none: "নেই",
    limitRange: (min: number, max: number) => `${min}–${max} বছর`,
    circularWins: "বিজ্ঞপ্তির নিজস্ব বয়সসীমা, তারিখ আর জন্ম তারিখের সীমাই সবসময় চূড়ান্ত।",
    shareTitle: "HisabBD দিয়ে চাকরির বয়সসীমা যাচাই",
    shareStatus: { eligible: "যোগ্য", "too-young": "যোগ্য নন (বয়স কম)", "too-old": "যোগ্য নন (বয়স বেশি)" },
    shareText: (date: string, age: string, limit: string, status: string, from: string, to: string) =>
      `${date} তারিখে বয়স: ${age}। বয়সসীমা ${limit}: ${status}। যোগ্য হতে জন্ম তারিখ ${from} থেকে ${to}-এর মধ্যে। HisabBD-র সরকারি চাকরির বয়স ক্যালকুলেটরে হিসাব করা।`,
    shareRelaxation: (n: number) => ` (+${countBn(n, "বছর ছাড়")})`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: JobAgeError): string {
  const { field, code } = error;
  if (code === "birth-after-reference-date") return t.errors.dobAfterReference;
  if (code === "less-than-min") return t.errors.maxBelowMin;
  switch (field) {
    case "dateOfBirth":
      return code === "missing" ? t.errors.missingDob : t.errors.invalid;
    case "referenceDate":
      return code === "missing" ? t.errors.missingReference : t.errors.invalid;
    case "minAge":
    case "maxAge":
      return numberErrorMessage(
        code,
        {
          label: field === "minAge" ? t.errors.minLabel : t.errors.maxLabel,
          min: t.errors.limitMin,
          max: t.errors.limitMax,
        },
        locale,
      );
    case "relaxation":
      return numberErrorMessage(
        code,
        { label: t.errors.relaxationLabel, min: t.errors.relaxationMin, max: t.errors.relaxationMax },
        locale,
      );
  }
}

function ageText(t: Strings, locale: Locale, age: YearsMonthsDays): string {
  return joinList([t.year(age.years), t.month(age.months), t.day(age.days)], locale);
}

/** A span with its zero parts left out ("4 months and 2 days"). */
function spanText(t: Strings, locale: Locale, span: YearsMonthsDays): string {
  const parts = [
    span.years > 0 && t.year(span.years),
    span.months > 0 && t.month(span.months),
    span.days > 0 && t.day(span.days),
  ].filter((part): part is string => Boolean(part));
  return joinList(parts, locale);
}

function limitText(t: Strings, r: JobAgeResult): string {
  return `${t.limitRange(r.minAge, r.maxAge)}${r.relaxationYears > 0 ? t.shareRelaxation(r.relaxationYears) : ""}`;
}

function shareText(t: Strings, locale: Locale, r: JobAgeResult): string {
  return t.shareText(
    formatPlainDate(r.referenceDate, { locale }),
    ageText(t, locale, r.age),
    limitText(t, r),
    t.shareStatus[r.status],
    formatPlainDate(r.bornOnOrAfter, { locale }),
    formatPlainDate(r.bornOnOrBefore, { locale }),
  );
}

export function JobAgeCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const today = useToday();
  const [dateOfBirth, setDateOfBirth] = useState("");
  /** null = follow today's date. */
  const [referenceDateInput, setReferenceDateInput] = useState<string | null>(null);
  const [preset, setPreset] = useState<JobAgePresetId>("bcs");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [relaxation, setRelaxation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  /** Increments on each successful check, to reveal and scroll to the result. */
  const [revealCount, setRevealCount] = useState(0);
  const refs = {
    dateOfBirth: useRef<HTMLInputElement>(null),
    referenceDate: useRef<HTMLInputElement>(null),
    minAge: useRef<HTMLInputElement>(null),
    maxAge: useRef<HTMLInputElement>(null),
    relaxation: useRef<HTMLInputElement>(null),
  };

  const referenceDate = referenceDateInput ?? today;
  const input: JobAgeInput = { dateOfBirth, referenceDate, preset, minAge, maxAge, relaxation };
  // After the first check, results and errors follow the inputs as they change.
  const calc = submitted ? calculateJobAge(input) : null;
  const errorFor = (field: JobAgeField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onPresetChange(value: string) {
    const next = PRESET_IDS.find((id) => id === value) ?? "bcs";
    // Switching to Custom starts from the limits that were showing, if the boxes are empty.
    if (next === "custom" && preset !== "custom" && !minAge.trim() && !maxAge.trim()) {
      setMinAge(String(JOB_AGE_PRESETS[preset].min));
      setMaxAge(String(JOB_AGE_PRESETS[preset].max));
    }
    setPreset(next);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateJobAge(input);
    if (check.ok) setRevealCount((n) => n + 1);
    else refs[check.errors[0]!.field].current?.focus();
  }

  function onReset() {
    setDateOfBirth("");
    setReferenceDateInput(null);
    setPreset("bcs");
    setMinAge("");
    setMaxAge("");
    setRelaxation("");
    setSubmitted(false);
    setRevealCount(0);
    refs.dateOfBirth.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.dateOfBirth} label={t.dob} error={errorFor("dateOfBirth")}>
            {(control) => (
              <Input
                {...control}
                ref={refs.dateOfBirth}
                type="date"
                value={dateOfBirth}
                max={referenceDate || undefined}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            )}
          </FormField>
          <FormField
            id={FIELD_IDS.referenceDate}
            label={t.reference}
            hint={t.referenceHint}
            error={errorFor("referenceDate")}
          >
            {(control) => (
              <Input
                {...control}
                ref={refs.referenceDate}
                type="date"
                value={referenceDate}
                onChange={(event) => setReferenceDateInput(event.target.value)}
              />
            )}
          </FormField>
          <div className="sm:col-span-2">
            <FormField id={PRESET_ID} label={t.preset} hint={t.presetHints[preset]}>
              {(control) => (
                <Select {...control} value={preset} onChange={(event) => onPresetChange(event.target.value)}>
                  {PRESET_IDS.map((id) => (
                    <option key={id} value={id}>
                      {t.presets[id]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>
          {preset === "custom" && (
            <>
              <FormField id={FIELD_IDS.minAge} label={t.minAge} error={errorFor("minAge")}>
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.minAge}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix={t.yearsSuffix}
                    value={minAge}
                    onChange={(event) => setMinAge(event.target.value)}
                  />
                )}
              </FormField>
              <FormField id={FIELD_IDS.maxAge} label={t.maxAge} error={errorFor("maxAge")}>
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.maxAge}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix={t.yearsSuffix}
                    value={maxAge}
                    onChange={(event) => setMaxAge(event.target.value)}
                  />
                )}
              </FormField>
            </>
          )}
          <FormField
            id={FIELD_IDS.relaxation}
            label={t.relaxation}
            hint={t.relaxationHint}
            error={errorFor("relaxation")}
          >
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.relaxation}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix={t.yearsSuffix}
                value={relaxation}
                onChange={(event) => setRelaxation(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result ? t.announcement(t.status[result.status], ageText(t, locale, result.age), result.borderline) : ""
        }
        result={result && <JobAgeResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={
              <p className="font-display text-3xl font-bold tracking-tight">
                – <span className="text-lg">{t.previewYears}</span> –{" "}
                <span className="text-lg">{t.previewMonths}</span> –{" "}
                <span className="text-lg">{t.previewDays}</span>
              </p>
            }
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function JobAgeResultView({ result: r }: { result: JobAgeResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const date = (d: JobAgeResult["referenceDate"]) => formatPlainDate(d, { locale });
  const turning = r.effectiveMaxAge + 1;
  const stats = [
    { label: t.statLimit, value: t.limitRange(r.minAge, r.maxAge) },
    { label: t.statRelaxation, value: r.relaxationYears > 0 ? t.year(r.relaxationYears) : t.none },
    { label: t.statEffectiveMax, value: t.year(r.effectiveMaxAge) },
    { label: t.statReference, value: date(r.referenceDate) },
  ];

  let statusNote: React.ReactNode;
  if (r.untilMinAge) {
    statusNote = t.untilMin(r.minAge, date(r.reachesMinAgeOn), spanText(t, locale, r.untilMinAge));
  } else if (r.overLimitBy) {
    const over = spanText(t, locale, r.overLimitBy);
    statusNote = over ? t.overLimit(turning, date(r.passesLimitOn), over) : t.turnedToday(turning);
  } else {
    statusNote = t.passesLimit(turning, date(r.passesLimitOn));
  }

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(date(r.referenceDate))}
        titleId="job-age-result-heading"
        value={
          <>
            <p
              className={cn(
                "font-display text-4xl font-bold tracking-tight sm:text-5xl",
                r.status === "eligible" ? "text-brand-800" : "text-red-700",
              )}
            >
              {t.status[r.status]}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{t.ageLine(ageText(t, locale, r.age))}</p>
          </>
        }
      >
        <div className="space-y-3">
          <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
            {t.window(date(r.bornOnOrAfter), date(r.bornOnOrBefore))}
          </p>
          <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">{statusNote}</p>
          {r.borderline && (
            <p role="note" className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-amber-950">
              {t.borderline(r.effectiveMaxAge)}
            </p>
          )}
        </div>
        <ResultStats items={stats} className="mt-5" />
        <p className="mt-4 text-sm text-slate-600">{t.circularWins}</p>
      </ResultPanel>

      <ResultActions
        key={shareText(t, locale, r)}
        text={shareText(t, locale, r)}
        shareTitle={t.shareTitle}
      />
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FormField, Input } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatNumber, formatPlainDate, joinList, pluralize, weekdayName } from "@/lib/format";
import { useToday } from "@/lib/use-today";
import { calculateAge, type AgeError, type AgeField, type AgeResult } from "./logic";

const FIELD_IDS: Record<AgeField, string> = {
  dateOfBirth: "age-date-of-birth",
  calculationDate: "age-calculation-date",
};

/** All widget strings, per locale. The maths in logic.ts is language-free. */
const STRINGS = {
  en: {
    submit: "Calculate age",
    dob: "Date of birth",
    asOf: "Calculate age as of",
    asOfHint: "Today by default. Any past or future date works.",
    errors: {
      missingDob: "Enter a full date of birth: day, month and year.",
      missingAsOf: "Enter the date to calculate the age on.",
      invalid: "This isn’t a real date. Check the day, month and 4-digit year.",
      dobInFuture: "Date of birth can’t be later than today.",
      asOfBeforeBirth: "This date is before the date of birth. Choose the birth date or a later day.",
    },
    year: (n: number) => pluralize(n, "year"),
    month: (n: number) => pluralize(n, "month"),
    day: (n: number) => pluralize(n, "day"),
    week: (n: number) => pluralize(n, "week"),
    completeMonth: (n: number) => pluralize(n, "complete month"),
    unitYear: (n: number) => (n === 1 ? "year" : "years"),
    unitMonth: (n: number) => (n === 1 ? "month" : "months"),
    unitDay: (n: number) => (n === 1 ? "day" : "days"),
    announcement: (age: string) => `Age: ${age}.`,
    placeholderTitleFirst: "Your age will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a date of birth, then select Calculate age.",
    placeholderFix: "Fix the highlighted date above and the age will show here.",
    previewYears: "years",
    previewMonths: "months",
    previewDays: "days",
    resultTitle: (date: string) => `Age as of ${date}`,
    birthdayToday: (turning: number) => (
      <>
        <strong>Birthday on this date:</strong> turning {turning}. Happy birthday!
      </>
    ),
    nextBirthday: (days: string, date: string, turning: number) => (
      <>
        <strong>Next birthday</strong> in {days}: {date} (turning {turning})
      </>
    ),
    totalDays: "Total days",
    totalWeeks: "Total weeks",
    totalMonths: "Total months",
    bornOn: "Born on a",
    weeksAnd: (weeks: string, days: string) => `${weeks} and ${days}`,
    totalsNote: (from: string, to: string) => `Totals count from ${from} to ${to}.`,
    shareTitle: "Age calculated with HisabBD",
    shareText: (asOf: string, age: string, born: string, total: string) =>
      `Age as of ${asOf}: ${age} (born ${born}). That’s ${total} in total. Calculated with HisabBD’s Age Calculator.`,
  },
  bn: {
    submit: "বয়স হিসাব করুন",
    dob: "জন্ম তারিখ",
    asOf: "যে তারিখে বয়স হিসাব হবে",
    asOfHint: "সাধারণত আজকের তারিখ। অতীত বা ভবিষ্যতের যেকোনো তারিখ দেওয়া যায়।",
    errors: {
      missingDob: "পুরো জন্ম তারিখ লিখুন: দিন, মাস ও বছর।",
      missingAsOf: "কোন তারিখে বয়স হিসাব হবে তা লিখুন।",
      invalid: "এটা সঠিক তারিখ নয়। দিন, মাস আর ৪ অঙ্কের বছর মিলিয়ে দেখুন।",
      dobInFuture: "জন্ম তারিখ আজকের পরে হতে পারে না।",
      asOfBeforeBirth: "এই তারিখ জন্ম তারিখের আগে। জন্ম তারিখ বা তার পরের কোনো দিন বেছে নিন।",
    },
    year: (n: number) => countBn(n, "বছর"),
    month: (n: number) => countBn(n, "মাস"),
    day: (n: number) => countBn(n, "দিন"),
    week: (n: number) => countBn(n, "সপ্তাহ"),
    completeMonth: (n: number) => countBn(n, "পূর্ণ মাস"),
    unitYear: () => "বছর",
    unitMonth: () => "মাস",
    unitDay: () => "দিন",
    announcement: (age: string) => `বয়স: ${age}।`,
    placeholderTitleFirst: "আপনার বয়স এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "জন্ম তারিখ লিখে “বয়স হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত তারিখটি ঠিক করলেই বয়স এখানে দেখা যাবে।",
    previewYears: "বছর",
    previewMonths: "মাস",
    previewDays: "দিন",
    resultTitle: (date: string) => `${date} তারিখে বয়স`,
    birthdayToday: (turning: number) => (
      <>
        <strong>এই তারিখেই জন্মদিন:</strong> {turning} বছরে পা দিচ্ছেন। শুভ জন্মদিন!
      </>
    ),
    nextBirthday: (days: string, date: string, turning: number) => (
      <>
        <strong>পরের জন্মদিন</strong> {days} পরে: {date} ({turning} বছরে পা দেবেন)
      </>
    ),
    totalDays: "মোট দিন",
    totalWeeks: "মোট সপ্তাহ",
    totalMonths: "মোট মাস",
    bornOn: "জন্মবার",
    weeksAnd: (weeks: string, days: string) => `${weeks} ${days}`,
    totalsNote: (from: string, to: string) => `${from} থেকে ${to} পর্যন্ত ধরে মোট হিসাব করা হয়েছে।`,
    shareTitle: "HisabBD দিয়ে বয়স হিসাব",
    shareText: (asOf: string, age: string, born: string, total: string) =>
      `${asOf} তারিখে বয়স: ${age} (জন্ম ${born})। মোট ${total}। HisabBD-র বয়স ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, error: AgeError): string {
  switch (error.code) {
    case "missing":
      return error.field === "dateOfBirth" ? t.errors.missingDob : t.errors.missingAsOf;
    case "invalid":
      return t.errors.invalid;
    case "birth-date-in-future":
      return t.errors.dobInFuture;
    case "calculation-date-before-birth":
      return t.errors.asOfBeforeBirth;
  }
}

function ageText(t: Strings, locale: Locale, r: AgeResult): string {
  return joinList([t.year(r.years), t.month(r.months), t.day(r.days)], locale);
}

function shareText(t: Strings, locale: Locale, r: AgeResult): string {
  return t.shareText(
    formatPlainDate(r.calculationDate, { locale }),
    ageText(t, locale, r),
    formatPlainDate(r.dateOfBirth, { locale }),
    t.day(r.totalDays),
  );
}

export function AgeCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const today = useToday();
  const [dateOfBirth, setDateOfBirth] = useState("");
  /** null = follow today's date. */
  const [calculationDateInput, setCalculationDateInput] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  /** Increments on each successful Calculate, to reveal and scroll to the result. */
  const [revealCount, setRevealCount] = useState(0);
  const dobRef = useRef<HTMLInputElement>(null);
  const asOfRef = useRef<HTMLInputElement>(null);

  const calculationDate = calculationDateInput ?? today;
  // After the first "Calculate", results and errors follow the inputs as they change.
  const calc = submitted ? calculateAge(dateOfBirth, calculationDate, today) : null;
  const errorFor = (field: AgeField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateAge(dateOfBirth, calculationDate, today);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      (check.errors[0]?.field === "calculationDate" ? asOfRef : dobRef).current?.focus();
    }
  }

  function onReset() {
    setDateOfBirth("");
    setCalculationDateInput(null);
    setSubmitted(false);
    setRevealCount(0);
    dobRef.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.dateOfBirth} label={t.dob} error={errorFor("dateOfBirth")}>
            {(control) => (
              <Input
                {...control}
                ref={dobRef}
                type="date"
                value={dateOfBirth}
                max={today || undefined}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            )}
          </FormField>
          <FormField
            id={FIELD_IDS.calculationDate}
            label={t.asOf}
            hint={t.asOfHint}
            error={errorFor("calculationDate")}
          >
            {(control) => (
              <Input
                {...control}
                ref={asOfRef}
                type="date"
                value={calculationDate}
                onChange={(event) => setCalculationDateInput(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(ageText(t, locale, result)) : ""}
        result={result && <AgeResultView result={result} />}
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

function AgeResultView({ result: r }: { result: AgeResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const units = [
    { value: r.years, label: t.unitYear(r.years) },
    { value: r.months, label: t.unitMonth(r.months) },
    { value: r.days, label: t.unitDay(r.days) },
  ];
  const birthday = r.nextBirthday;
  const stats = [
    { label: t.totalDays, value: t.day(r.totalDays) },
    {
      label: t.totalWeeks,
      value:
        r.remainingDaysAfterWeeks > 0
          ? t.weeksAnd(t.week(r.totalWeeks), t.day(r.remainingDaysAfterWeeks))
          : t.week(r.totalWeeks),
    },
    { label: t.totalMonths, value: t.completeMonth(r.totalMonths) },
    { label: t.bornOn, value: weekdayName(r.birthWeekday, locale) },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(formatPlainDate(r.calculationDate, { locale }))}
        titleId="age-result-heading"
        value={
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {units.map((unit) => (
              <span key={unit.label} className="whitespace-nowrap">
                <span className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
                  {formatNumber(unit.value)}
                </span>{" "}
                <span className="text-xl font-semibold text-slate-700">{unit.label}</span>
              </span>
            ))}
          </p>
        }
      >
        <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
          {birthday.daysAway === 0
            ? t.birthdayToday(birthday.turningAge)
            : t.nextBirthday(
                t.day(birthday.daysAway),
                formatPlainDate(birthday.date, { weekday: true, locale }),
                birthday.turningAge,
              )}
        </p>
        <ResultStats items={stats} className="mt-5" />
        <p className="mt-4 text-sm text-slate-600">
          {t.totalsNote(
            formatPlainDate(r.dateOfBirth, { locale }),
            formatPlainDate(r.calculationDate, { locale }),
          )}
        </p>
      </ResultPanel>

      <ResultActions
        key={shareText(t, locale, r)}
        text={shareText(t, locale, r)}
        shareTitle={t.shareTitle}
      />
    </div>
  );
}

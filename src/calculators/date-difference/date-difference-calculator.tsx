"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { ResultActions } from "@/components/calculator/result-actions";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FormField, Input } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatNumber, formatPlainDate, joinList, pluralize, weekdayName } from "@/lib/format";
import { dayOfWeek } from "@/lib/plain-date";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import { useToday } from "@/lib/use-today";
import {
  calculateDateDifference,
  type DateDifferenceError,
  type DateDifferenceField,
  type DateDifferenceResult,
} from "./logic";

/** Remembered in this browser: whether the end date is counted. */
const INCLUDE_END_DATE = choicePreference("date-difference-calculator", "includeEndDate", ["false", "true"] as const, "false");

const FIELD_IDS: Record<DateDifferenceField, string> = {
  startDate: "date-diff-start",
  endDate: "date-diff-end",
};

const STRINGS = {
  en: {
    submit: "Calculate difference",
    startDate: "Start date",
    endDate: "End date",
    endHint: "Today by default.",
    includeLabel: "Include the end date",
    includeHint: "Counts both the first and the last day, e.g. for leave or event days (adds 1 day).",
    errMissingStart: "Enter a full start date: day, month and year.",
    errMissingEnd: "Enter a full end date: day, month and year.",
    errInvalid: "This isn’t a real date. Check the day, month and 4-digit year.",
    zeroDays: "0 days",
    year: (n: number) => pluralize(n, "year"),
    month: (n: number) => pluralize(n, "month"),
    day: (n: number) => pluralize(n, "day"),
    week: (n: number) => pluralize(n, "week"),
    completeMonth: (n: number) => pluralize(n, "complete month"),
    announcement: (days: string, breakdown: string) => `${days}, or ${breakdown}.`,
    placeholderTitleFirst: "The difference will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Pick a start date and an end date, then select Calculate difference.",
    placeholderFix: "Fix the highlighted date above and the result will show here.",
    previewDays: "days",
    resultTitle: "Time between the dates",
    resultTitleIncluded: "Time between the dates (end date included)",
    unitDay: (n: number) => (n === 1 ? "day" : "days"),
    totalWeeks: "Total weeks",
    weeksAnd: (weeks: string, days: string) => `${weeks} and ${days}`,
    totalMonths: "Total months",
    excludingWeekend: "Excluding Fridays and Saturdays",
    start: "Start",
    end: "End",
    swapped: "The end date was before the start date, so the dates were swapped.",
    holidayNote: (weekday: string) => `Public holidays aren’t excluded. ${weekday} is the first day counted.`,
    shareIncluded: " (end date included)",
    shareText: (from: string, to: string, included: string, days: string, breakdown: string) =>
      `From ${from} to ${to}${included}: ${days}, or ${breakdown}. Calculated with HisabBD’s Date Difference Calculator.`,
    shareTitle: "Date difference from HisabBD",
  },
  bn: {
    submit: "ব্যবধান হিসাব করুন",
    startDate: "শুরুর তারিখ",
    endDate: "শেষ তারিখ",
    endHint: "সাধারণত আজকের তারিখ।",
    includeLabel: "শেষ তারিখও ধরুন",
    includeHint: "প্রথম ও শেষ — দুই দিনই গোনা হয়, যেমন ছুটি বা অনুষ্ঠানের দিনের জন্য (1 দিন যোগ হয়)।",
    errMissingStart: "পুরো শুরুর তারিখ লিখুন: দিন, মাস ও বছর।",
    errMissingEnd: "পুরো শেষ তারিখ লিখুন: দিন, মাস ও বছর।",
    errInvalid: "এটা সঠিক তারিখ নয়। দিন, মাস আর ৪ অঙ্কের বছর মিলিয়ে দেখুন।",
    zeroDays: "0 দিন",
    year: (n: number) => countBn(n, "বছর"),
    month: (n: number) => countBn(n, "মাস"),
    day: (n: number) => countBn(n, "দিন"),
    week: (n: number) => countBn(n, "সপ্তাহ"),
    completeMonth: (n: number) => countBn(n, "পূর্ণ মাস"),
    announcement: (days: string, breakdown: string) => `${days}, অর্থাৎ ${breakdown}।`,
    placeholderTitleFirst: "ব্যবধান এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "শুরুর ও শেষ তারিখ বেছে নিয়ে “ব্যবধান হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত তারিখটি ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    previewDays: "দিন",
    resultTitle: "দুই তারিখের মধ্যে সময়",
    resultTitleIncluded: "দুই তারিখের মধ্যে সময় (শেষ তারিখসহ)",
    unitDay: () => "দিন",
    totalWeeks: "মোট সপ্তাহ",
    weeksAnd: (weeks: string, days: string) => `${weeks} ${days}`,
    totalMonths: "মোট মাস",
    excludingWeekend: "শুক্র ও শনিবার বাদে",
    start: "শুরু",
    end: "শেষ",
    swapped: "শেষ তারিখটি শুরুর তারিখের আগে ছিল, তাই তারিখ দুটি অদল-বদল করা হয়েছে।",
    holidayNote: (weekday: string) => `সরকারি ছুটি বাদ দেওয়া হয়নি। গণনার প্রথম দিন ${weekday}।`,
    shareIncluded: " (শেষ তারিখসহ)",
    shareText: (from: string, to: string, included: string, days: string, breakdown: string) =>
      `${from} থেকে ${to}${included}: ${days}, অর্থাৎ ${breakdown}। HisabBD-র তারিখের ব্যবধান ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD থেকে তারিখের ব্যবধান",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, error: DateDifferenceError): string {
  if (error.code === "missing") {
    return error.field === "startDate" ? t.errMissingStart : t.errMissingEnd;
  }
  return t.errInvalid;
}

/** "1 year, 2 months and 3 days", leaving out zero units (but never empty). */
function breakdownText(t: Strings, locale: Locale, r: DateDifferenceResult): string {
  const parts = [
    r.years > 0 ? t.year(r.years) : "",
    r.months > 0 ? t.month(r.months) : "",
    r.days > 0 ? t.day(r.days) : "",
  ].filter(Boolean);
  return parts.length > 0 ? joinList(parts, locale) : t.zeroDays;
}

function shareText(t: Strings, locale: Locale, r: DateDifferenceResult): string {
  return t.shareText(
    formatPlainDate(r.start, { locale }),
    formatPlainDate(r.end, { locale }),
    r.includeEndDate ? t.shareIncluded : "",
    t.day(r.totalDays),
    breakdownText(t, locale, r),
  );
}

export function DateDifferenceCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const today = useToday();
  const [startDate, setStartDate] = useState("");
  /** null = follow today's date. */
  const [endDateInput, setEndDateInput] = useState<string | null>(null);
  const [includeEndDatePref, setIncludeEndDatePref] = usePreference(INCLUDE_END_DATE);
  const includeEndDate = includeEndDatePref === "true";
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const endDate = endDateInput ?? today;
  const calc = submitted ? calculateDateDifference(startDate, endDate, { includeEndDate }) : null;
  const errorFor = (field: DateDifferenceField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateDateDifference(startDate, endDate, { includeEndDate });
    if (check.ok) {
      setRevealCount((n) => n + 1);
      // The end date actually used (today's date if it was left alone), so "Use again" gives the same answer.
      record({ startDate, endDate, includeEndDate: includeEndDatePref }, shareText(t, locale, check.result));
    } else {
      (check.errors[0]?.field === "endDate" ? endRef : startRef).current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedInclude = text("includeEndDate");
    setStartDate(text("startDate"));
    setEndDateInput(typeof saved.endDate === "string" ? saved.endDate : null);
    if (INCLUDE_END_DATE.isValid(savedInclude)) setIncludeEndDatePref(savedInclude);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  // Keeps the remembered "include end date" choice; clears only the dates.
  function onReset() {
    setStartDate("");
    setEndDateInput(null);
    setSubmitted(false);
    setRevealCount(0);
    startRef.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.startDate} label={t.startDate} error={errorFor("startDate")}>
            {(control) => (
              <Input
                {...control}
                ref={startRef}
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            )}
          </FormField>
          <FormField
            id={FIELD_IDS.endDate}
            label={t.endDate}
            hint={t.endHint}
            error={errorFor("endDate")}
          >
            {(control) => (
              <Input
                {...control}
                ref={endRef}
                type="date"
                value={endDate}
                onChange={(event) => setEndDateInput(event.target.value)}
              />
            )}
          </FormField>
        </div>
        <label className="mt-5 flex min-h-11 cursor-pointer items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={includeEndDate}
            onChange={(event) => setIncludeEndDatePref(event.target.checked ? "true" : "false")}
            aria-describedby="date-diff-include-hint"
            className="mt-0.5 size-5 shrink-0 accent-brand-600"
          />
          <span>
            <span className="block font-medium text-slate-900">{t.includeLabel}</span>
            <span id="date-diff-include-hint" className="block text-sm text-slate-600">
              {t.includeHint}
            </span>
          </span>
        </label>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(t.day(result.totalDays), breakdownText(t, locale, result)) : ""}
        result={result && <DateDifferenceResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={
              <p className="font-display text-3xl font-bold tracking-tight">
                – <span className="text-lg">{t.previewDays}</span>
              </p>
            }
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function DateDifferenceResultView({ result: r }: { result: DateDifferenceResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const stats = [
    {
      label: t.totalWeeks,
      value:
        r.remainingDaysAfterWeeks > 0
          ? t.weeksAnd(t.week(r.totalWeeks), t.day(r.remainingDaysAfterWeeks))
          : t.week(r.totalWeeks),
    },
    { label: t.totalMonths, value: t.completeMonth(r.totalMonths) },
    {
      label: t.excludingWeekend,
      value: t.day(r.daysExcludingWeekend),
      wide: true,
    },
    { label: t.start, value: formatPlainDate(r.start, { weekday: true, locale }), wide: true },
    { label: t.end, value: formatPlainDate(r.end, { weekday: true, locale }), wide: true },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={r.includeEndDate ? t.resultTitleIncluded : t.resultTitle}
        titleId="date-diff-result-heading"
        value={
          <>
            <p>
              <span className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
                {formatNumber(r.totalDays)}
              </span>{" "}
              <span className="text-xl font-semibold text-slate-700">{t.unitDay(r.totalDays)}</span>
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{breakdownText(t, locale, r)}</p>
          </>
        }
      >
        {r.swapped && (
          <p className="mb-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-slate-800">{t.swapped}</p>
        )}
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.holidayNote(weekdayName(dayOfWeek(r.start), locale))}</p>
      </ResultPanel>
      <ResultActions key={shareText(t, locale, r)} text={shareText(t, locale, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

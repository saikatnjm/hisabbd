"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FormField, Input, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatNumber, formatPlainDate, pluralize } from "@/lib/format";
import { useToday } from "@/lib/use-today";
import {
  calculatePregnancy,
  PREGNANCY_MODES,
  type PregnancyError,
  type PregnancyField,
  type PregnancyMode,
  type PregnancyResult,
  type TermId,
} from "./logic";

const FIELD_IDS: Record<PregnancyField, string> = {
  date: "pregnancy-date",
  asOf: "pregnancy-as-of",
};

const TERM_ORDER: readonly TermId[] = ["earlyTerm", "fullTerm", "lateTerm", "postTerm"];

/** All widget strings, per locale. The maths in logic.ts is language-free. */
const STRINGS = {
  en: {
    submit: "Calculate due date",
    modeLegend: "I know",
    modes: { lmp: "First day of my last period", "due-date": "Due date from my doctor" } satisfies Record<PregnancyMode, string>,
    dateLabel: { lmp: "First day of your last period", "due-date": "Due date your doctor gave you" } satisfies Record<PregnancyMode, string>,
    asOf: "Count weeks as of",
    asOfHint: "Today by default.",
    privacy: "Nothing you enter is saved or sent anywhere, and this calculator keeps no history.",
    errors: {
      missingDate: { lmp: "Enter the first day of your last period.", "due-date": "Enter the due date your doctor gave you." },
      missingAsOf: "Enter the date to count the weeks on.",
      invalid: "This isn’t a real date. Check the day, month and 4-digit year.",
      lmpAfterAsOf: "The last period can’t start after the date you’re counting to.",
      lmpTooLongAgo: "That is more than 44 weeks before the date you’re counting to. Check the year.",
      dueTooFar: "That due date is more than 40 weeks away. Check the year.",
      dueTooLongAgo: "That due date passed more than 4 weeks ago. Check the year.",
    },
    week: (n: number) => pluralize(n, "week"),
    day: (n: number) => pluralize(n, "day"),
    weeksDays: (w: string, d: string) => `${w} ${d}`,
    unitWeeks: (n: number) => (n === 1 ? "week" : "weeks"),
    unitDays: (n: number) => (n === 1 ? "day" : "days"),
    resultTitle: (date: string) => `Pregnancy on ${date}`,
    dueDate: "Due date",
    trimester: "Trimester",
    trimesterName: { 1: "First", 2: "Second", 3: "Third" } as Record<1 | 2 | 3, string>,
    toGo: "Days to the due date",
    pastDue: (days: string) => `${days} past`,
    dueToday: "Due today",
    progress: (pct: string) => `${pct} of 40 weeks`,
    lmpUsed: "Last period (counted from)",
    termTitle: "When each stage of term starts",
    terms: {
      earlyTerm: "Early term (37 weeks)",
      fullTerm: "Full term (39 weeks)",
      lateTerm: "Late term (41 weeks)",
      postTerm: "Post-term (42 weeks)",
    } satisfies Record<TermId, string>,
    note: "An estimate from the 280-day rule. An early ultrasound date from your doctor is more accurate.",
    announcement: (weeks: string, due: string) => `${weeks} pregnant. Due date ${due}.`,
    placeholderTitleFirst: "Your due date will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a date, then select Calculate due date.",
    placeholderFix: "Fix the highlighted date above and the result will show here.",
    previewWeeks: "weeks",
    previewDays: "days",
    shareTitle: "Due date calculated with HisabBD",
    shareText: (due: string, weeks: string, asOf: string) =>
      `Due date: ${due}. ${weeks} pregnant on ${asOf}. Calculated with HisabBD’s Pregnancy Due Date Calculator.`,
  },
  bn: {
    submit: "ডেলিভারির তারিখ বের করুন",
    modeLegend: "আমি জানি",
    modes: { lmp: "শেষ মাসিকের প্রথম দিন", "due-date": "ডাক্তারের দেওয়া তারিখ" } satisfies Record<PregnancyMode, string>,
    dateLabel: { lmp: "শেষ মাসিক শুরুর তারিখ", "due-date": "ডাক্তারের দেওয়া সম্ভাব্য ডেলিভারির তারিখ" } satisfies Record<PregnancyMode, string>,
    asOf: "যে তারিখ পর্যন্ত সপ্তাহ গুনবেন",
    asOfHint: "সাধারণত আজকের তারিখ।",
    privacy: "আপনার লেখা কিছুই কোথাও জমা হয় না বা পাঠানো হয় না, আর এই ক্যালকুলেটর কোনো হিসাবের তালিকা রাখে না।",
    errors: {
      missingDate: { lmp: "শেষ মাসিকের প্রথম দিনের তারিখ লিখুন।", "due-date": "ডাক্তারের দেওয়া সম্ভাব্য ডেলিভারির তারিখ লিখুন।" },
      missingAsOf: "কোন তারিখ পর্যন্ত সপ্তাহ গুনবেন, তা লিখুন।",
      invalid: "এটা সঠিক তারিখ নয়। দিন, মাস আর 4 অঙ্কের বছর মিলিয়ে দেখুন।",
      lmpAfterAsOf: "শেষ মাসিক যে তারিখ পর্যন্ত গুনছেন তার পরে শুরু হতে পারে না।",
      lmpTooLongAgo: "এটি যে তারিখ পর্যন্ত গুনছেন তার 44 সপ্তাহেরও বেশি আগে। বছরটা মিলিয়ে দেখুন।",
      dueTooFar: "এই তারিখ 40 সপ্তাহেরও বেশি পরে। বছরটা মিলিয়ে দেখুন।",
      dueTooLongAgo: "এই তারিখ 4 সপ্তাহেরও বেশি আগে পার হয়ে গেছে। বছরটা মিলিয়ে দেখুন।",
    },
    week: (n: number) => countBn(n, "সপ্তাহ"),
    day: (n: number) => countBn(n, "দিন"),
    weeksDays: (w: string, d: string) => `${w} ${d}`,
    unitWeeks: () => "সপ্তাহ",
    unitDays: () => "দিন",
    resultTitle: (date: string) => `${date} তারিখে গর্ভকাল`,
    dueDate: "সম্ভাব্য ডেলিভারির তারিখ",
    trimester: "ত্রৈমাসিক",
    trimesterName: { 1: "প্রথম", 2: "দ্বিতীয়", 3: "তৃতীয়" } as Record<1 | 2 | 3, string>,
    toGo: "ডেলিভারির তারিখ পর্যন্ত বাকি",
    pastDue: (days: string) => `${days} পার হয়েছে`,
    dueToday: "আজই সম্ভাব্য তারিখ",
    progress: (pct: string) => `40 সপ্তাহের ${pct}`,
    lmpUsed: "শেষ মাসিক (যেদিন থেকে গোনা)",
    termTitle: "কোন পর্যায় কবে শুরু",
    terms: {
      earlyTerm: "আর্লি টার্ম (37 সপ্তাহ)",
      fullTerm: "ফুল টার্ম (39 সপ্তাহ)",
      lateTerm: "লেট টার্ম (41 সপ্তাহ)",
      postTerm: "পোস্ট-টার্ম (42 সপ্তাহ)",
    } satisfies Record<TermId, string>,
    note: "280 দিনের নিয়মে আনুমানিক হিসাব। ডাক্তারের দেওয়া আগের আলট্রাসনোগ্রামের তারিখ বেশি নির্ভুল।",
    announcement: (weeks: string, due: string) => `গর্ভকাল ${weeks}। সম্ভাব্য ডেলিভারির তারিখ ${due}।`,
    placeholderTitleFirst: "সম্ভাব্য ডেলিভারির তারিখ এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "তারিখ লিখে “ডেলিভারির তারিখ বের করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত তারিখটি ঠিক করলেই ফল এখানে দেখা যাবে।",
    previewWeeks: "সপ্তাহ",
    previewDays: "দিন",
    shareTitle: "HisabBD দিয়ে ডেলিভারির তারিখ হিসাব",
    shareText: (due: string, weeks: string, asOf: string) =>
      `সম্ভাব্য ডেলিভারির তারিখ: ${due}। ${asOf} তারিখে গর্ভকাল ${weeks}। HisabBD-র প্রেগন্যান্সি ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, mode: PregnancyMode, error: PregnancyError): string {
  switch (error.code) {
    case "missing":
      return error.field === "date" ? t.errors.missingDate[mode] : t.errors.missingAsOf;
    case "invalid":
      return t.errors.invalid;
    case "lmp-after-as-of":
      return t.errors.lmpAfterAsOf;
    case "lmp-too-long-ago":
      return t.errors.lmpTooLongAgo;
    case "due-too-far":
      return t.errors.dueTooFar;
    case "due-too-long-ago":
      return t.errors.dueTooLongAgo;
  }
}

function weeksText(t: Strings, r: PregnancyResult): string {
  return r.days > 0 ? t.weeksDays(t.week(r.weeks), t.day(r.days)) : t.week(r.weeks);
}

function shareText(t: Strings, locale: Locale, r: PregnancyResult): string {
  return t.shareText(
    formatPlainDate(r.dueDate, { weekday: true, locale }),
    weeksText(t, r),
    formatPlainDate(r.asOf, { locale }),
  );
}

export function PregnancyCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const today = useToday();
  // Deliberately not remembered and not added to recent calculations (privacy on shared devices).
  const [mode, setMode] = useState<PregnancyMode>("lmp");
  const [date, setDate] = useState("");
  /** null = follow today's date. */
  const [asOfInput, setAsOfInput] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const dateRef = useRef<HTMLInputElement>(null);
  const asOfRef = useRef<HTMLInputElement>(null);

  const asOf = asOfInput ?? today;
  const calc = submitted ? calculatePregnancy(mode, date, asOf) : null;
  const errorFor = (field: PregnancyField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, mode, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculatePregnancy(mode, date, asOf);
    if (check.ok) setRevealCount((n) => n + 1);
    else (check.errors[0]?.field === "asOf" ? asOfRef : dateRef).current?.focus();
  }

  function onReset() {
    setDate("");
    setAsOfInput(null);
    setSubmitted(false);
    setRevealCount(0);
    dateRef.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-5">
          <SegmentedControl
            name="pregnancy-mode"
            legend={t.modeLegend}
            options={PREGNANCY_MODES.map((value) => ({ value, label: t.modes[value] }))}
            value={mode}
            onChange={setMode}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id={FIELD_IDS.date} label={t.dateLabel[mode]} error={errorFor("date")}>
              {(control) => (
                <Input
                  {...control}
                  ref={dateRef}
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.asOf} label={t.asOf} hint={t.asOfHint} error={errorFor("asOf")}>
              {(control) => (
                <Input
                  {...control}
                  ref={asOfRef}
                  type="date"
                  value={asOf}
                  onChange={(event) => setAsOfInput(event.target.value)}
                />
              )}
            </FormField>
          </div>
          <p className="text-sm text-slate-600">{t.privacy}</p>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(weeksText(t, result), formatPlainDate(result.dueDate, { locale })) : ""}
        result={result && <PregnancyResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={
              <p className="font-display text-3xl font-bold tracking-tight">
                – <span className="text-lg">{t.previewWeeks}</span> – <span className="text-lg">{t.previewDays}</span>
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

function PregnancyResultView({ result: r }: { result: PregnancyResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const toGo = r.daysToDue > 0 ? t.day(r.daysToDue) : r.daysToDue === 0 ? t.dueToday : t.pastDue(t.day(-r.daysToDue));
  const stats = [
    { label: t.dueDate, value: formatPlainDate(r.dueDate, { weekday: true, locale }) },
    { label: t.trimester, value: t.trimesterName[r.trimester] },
    { label: t.toGo, value: toGo },
    { label: t.lmpUsed, value: formatPlainDate(r.lmp, { locale }) },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(formatPlainDate(r.asOf, { locale }))}
        titleId="pregnancy-result-heading"
        value={
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="whitespace-nowrap">
              <span className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{formatNumber(r.weeks)}</span>{" "}
              <span className="text-xl font-semibold text-slate-700">{t.unitWeeks(r.weeks)}</span>
            </span>
            <span className="whitespace-nowrap">
              <span className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{formatNumber(r.days)}</span>{" "}
              <span className="text-xl font-semibold text-slate-700">{t.unitDays(r.days)}</span>
            </span>
          </p>
        }
      >
        <div className="mt-1">
          <div
            className="h-2.5 overflow-hidden rounded-full bg-white/80"
            role="img"
            aria-label={t.progress(`${formatNumber(r.progressPercent, { decimals: 0 })}%`)}
          >
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${r.progressPercent}%` }} />
          </div>
          <p className="mt-1 text-sm text-slate-600">{t.progress(`${formatNumber(r.progressPercent, { decimals: 0 })}%`)}</p>
        </div>
        <ResultStats items={stats} className="mt-5" />
        <h3 className="mt-5 font-semibold text-slate-900">{t.termTitle}</h3>
        <ul className="mt-2 space-y-1 text-slate-800">
          {TERM_ORDER.map((id) => (
            <li key={id} className="flex flex-wrap justify-between gap-x-4">
              <span>{t.terms[id]}</span>
              <span className="font-semibold">{formatPlainDate(r.termStarts[id], { locale })}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, locale, r)} text={shareText(t, locale, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

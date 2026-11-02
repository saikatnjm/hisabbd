"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FormField, Input } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatPlainDate, joinList, pluralize } from "@/lib/format";
import type { CalendarDifference } from "@/lib/plain-date";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { useToday } from "@/lib/use-today";
import { calculateRetirement, type RetirementError, type RetirementField, type RetirementResult } from "./logic";

const FIELD_IDS: Record<RetirementField, string> = {
  dateOfBirth: "retirement-dob",
  joiningDate: "retirement-joining",
  asOf: "retirement-as-of",
};

const STRINGS = {
  en: {
    submit: "Find retirement date",
    dob: "Date of birth",
    freedomFighter: "I am a freedom fighter government servant (retire at 60)",
    joining: "Date you joined service (optional)",
    joiningHint: "For the 25-year optional retirement date.",
    asOf: "Count from",
    asOfHint: "Today by default.",
    errors: {
      missingDob: "Enter your date of birth.",
      missingAsOf: "Enter the date to count from.",
      invalid: "This isn’t a real date. Check the day, month and 4-digit year.",
      dobFuture: "Date of birth can’t be after the date you count from.",
      joiningFuture: "The joining date can’t be after the date you count from.",
      joiningBeforeBirth: "The joining date must be after the date of birth.",
    },
    year: (n: number) => pluralize(n, "year"),
    month: (n: number) => pluralize(n, "month"),
    day: (n: number) => pluralize(n, "day"),
    resultTitle: (age: number) => `Retirement on completing ${age} years`,
    left: (gap: string) => `${gap} left`,
    ago: (gap: string) => `Retired ${gap} ago`,
    today: "Retires today",
    prl: "PRL can run until (at most)",
    optional: "Optional retirement possible from",
    optionalReached: "reached",
    note: "The Act says “on completing 59 (or 60) years”; we show that birthday. Your office’s retirement order sets the exact last working day. Civil Service Act 2018, ss.43, 44, 47.",
    announcement: (date: string) => `Retirement date ${date}.`,
    placeholderTitleFirst: "Your retirement date will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter your date of birth, then select Find retirement date.",
    placeholderFix: "Fix the highlighted dates above and the result will show here.",
    shareTitle: "Retirement date from HisabBD",
    shareText: (date: string, status: string) => `Retirement date: ${date} (${status}). Worked out with HisabBD’s Government Retirement Date Calculator.`,
  },
  bn: {
    submit: "অবসরের তারিখ বের করুন",
    dob: "জন্ম তারিখ",
    freedomFighter: "আমি মুক্তিযোদ্ধা সরকারি কর্মচারী (60 বছরে অবসর)",
    joining: "চাকরিতে যোগদানের তারিখ (ঐচ্ছিক)",
    joiningHint: "25 বছরে ঐচ্ছিক অবসরের তারিখ দেখতে।",
    asOf: "যে তারিখ থেকে গুনবেন",
    asOfHint: "সাধারণত আজকের তারিখ।",
    errors: {
      missingDob: "জন্ম তারিখ লিখুন।",
      missingAsOf: "যে তারিখ থেকে গুনবেন তা লিখুন।",
      invalid: "এটা সঠিক তারিখ নয়। দিন, মাস আর 4 অঙ্কের বছর মিলিয়ে দেখুন।",
      dobFuture: "জন্ম তারিখ গোনার তারিখের পরে হতে পারে না।",
      joiningFuture: "যোগদানের তারিখ গোনার তারিখের পরে হতে পারে না।",
      joiningBeforeBirth: "যোগদানের তারিখ জন্ম তারিখের পরে হতে হবে।",
    },
    year: (n: number) => countBn(n, "বছর"),
    month: (n: number) => countBn(n, "মাস"),
    day: (n: number) => countBn(n, "দিন"),
    resultTitle: (age: number) => `${age} বছর পূর্তিতে অবসর`,
    left: (gap: string) => `আর ${gap} বাকি`,
    ago: (gap: string) => `${gap} আগে অবসর হয়েছে`,
    today: "আজই অবসর",
    prl: "পিআরএল সর্বোচ্চ যে তারিখ পর্যন্ত",
    optional: "ঐচ্ছিক অবসর নেওয়া যায় যে তারিখ থেকে",
    optionalReached: "পূর্ণ হয়েছে",
    note: "আইনে “59 (বা 60) বৎসর পূর্তিতে” বলা আছে; আমরা সেই জন্মদিনটি দেখাই। শেষ কর্মদিবস আপনার অফিসের অবসরের আদেশে ঠিক হয়। সরকারি চাকরি আইন 2018, ধারা 43, 44, 47।",
    announcement: (date: string) => `অবসরের তারিখ ${date}।`,
    placeholderTitleFirst: "অবসরের তারিখ এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "জন্ম তারিখ লিখে “অবসরের তারিখ বের করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত তারিখগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD-র অবসরের তারিখ",
    shareText: (date: string, status: string) => `অবসরের তারিখ: ${date} (${status})। HisabBD-র সরকারি চাকরির অবসরের তারিখ ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, error: RetirementError): string {
  switch (error.code) {
    case "missing":
      return error.field === "asOf" ? t.errors.missingAsOf : t.errors.missingDob;
    case "invalid":
      return t.errors.invalid;
    case "in-future":
      return error.field === "joiningDate" ? t.errors.joiningFuture : t.errors.dobFuture;
    case "joining-before-birth":
      return t.errors.joiningBeforeBirth;
  }
}

function gapText(t: Strings, locale: Locale, g: CalendarDifference): string {
  const parts = [g.years ? t.year(g.years) : "", g.months ? t.month(g.months) : "", g.days ? t.day(g.days) : ""].filter(Boolean);
  return joinList(parts.length ? parts : [t.day(0)], locale);
}

function statusText(t: Strings, locale: Locale, r: RetirementResult): string {
  if (r.gap.totalDays === 0) return t.today;
  return r.retired ? t.ago(gapText(t, locale, r.gap)) : t.left(gapText(t, locale, r.gap));
}

function shareText(t: Strings, locale: Locale, r: RetirementResult): string {
  return t.shareText(formatPlainDate(r.retirementDate, { weekday: true, locale }), statusText(t, locale, r));
}

export function RetirementCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const today = useToday();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [freedomFighter, setFreedomFighter] = useState(false);
  const [joiningDate, setJoiningDate] = useState("");
  const [asOfInput, setAsOfInput] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    dateOfBirth: useRef<HTMLInputElement>(null),
    joiningDate: useRef<HTMLInputElement>(null),
    asOf: useRef<HTMLInputElement>(null),
  };

  const asOf = asOfInput ?? today;
  const calc = submitted ? calculateRetirement(dateOfBirth, freedomFighter, joiningDate, asOf) : null;
  const errorFor = (field: RetirementField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateRetirement(dateOfBirth, freedomFighter, joiningDate, asOf);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      // An empty "count from" means today, so using it again counts from that day.
      record({ dateOfBirth, freedomFighter: freedomFighter ? "yes" : "no", joiningDate, asOf: asOfInput ?? "" }, shareText(t, locale, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    setDateOfBirth(text("dateOfBirth"));
    setFreedomFighter(text("freedomFighter") === "yes");
    setJoiningDate(text("joiningDate"));
    setAsOfInput(text("asOf") || null);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setDateOfBirth("");
    setFreedomFighter(false);
    setJoiningDate("");
    setAsOfInput(null);
    setSubmitted(false);
    setRevealCount(0);
    refs.dateOfBirth.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-5">
          <FormField id={FIELD_IDS.dateOfBirth} label={t.dob} error={errorFor("dateOfBirth")}>
            {(control) => (
              <Input {...control} ref={refs.dateOfBirth} type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
            )}
          </FormField>
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-base font-medium text-slate-800">
            <input
              type="checkbox"
              checked={freedomFighter}
              onChange={(event) => setFreedomFighter(event.target.checked)}
              className="size-5 accent-brand-600"
            />
            {t.freedomFighter}
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id={FIELD_IDS.joiningDate} label={t.joining} hint={t.joiningHint} error={errorFor("joiningDate")}>
              {(control) => (
                <Input {...control} ref={refs.joiningDate} type="date" value={joiningDate} onChange={(event) => setJoiningDate(event.target.value)} />
              )}
            </FormField>
            <FormField id={FIELD_IDS.asOf} label={t.asOf} hint={t.asOfHint} error={errorFor("asOf")}>
              {(control) => (
                <Input {...control} ref={refs.asOf} type="date" value={asOf} onChange={(event) => setAsOfInput(event.target.value)} />
              )}
            </FormField>
          </div>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(formatPlainDate(result.retirementDate, { locale })) : ""}
        result={result && <RetirementResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-3xl font-bold tracking-tight">– – –</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function RetirementResultView({ result: r }: { result: RetirementResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const stats = [
    { label: t.prl, value: formatPlainDate(r.prlUntil, { locale }) },
    ...(r.optionalFrom
      ? [
          {
            label: t.optional,
            value: `${formatPlainDate(r.optionalFrom, { locale })}${r.optionalReached ? ` (${t.optionalReached})` : ""}`,
          },
        ]
      : []),
  ];
  const text = shareText(t, locale, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(r.retirementAge)}
        titleId="retirement-result-heading"
        value={
          <>
            <p className="font-display text-4xl font-bold tracking-tight break-words sm:text-5xl">
              {formatPlainDate(r.retirementDate, { weekday: true, locale })}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{statusText(t, locale, r)}</p>
          </>
        }
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

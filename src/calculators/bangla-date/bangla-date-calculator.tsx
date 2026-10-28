"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FormField, Input, SegmentedControl, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatPlainDate, weekdayName } from "@/lib/format";
import { checkNumber } from "@/lib/number";
import { dayOfWeek, parsePlainDate } from "@/lib/plain-date";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import { useToday } from "@/lib/use-today";
import {
  BANGLA_MONTHS,
  MAX_BANGLA_YEAR,
  MIN_BANGLA_YEAR,
  banglaMonthLength,
  calculateBanglaDate,
  calculateGregorianDate,
  formatBanglaDateBn,
  formatBanglaDateWestern,
  isInBanglaRange,
  toBanglaDate,
  type BanglaDate,
  type BanglaDateCalculation,
  type BanglaDateResult,
} from "./logic";

type Mode = "toBangla" | "toGregorian";
type Field = "gregorianDate" | "banglaYear" | "banglaMonth" | "banglaDay";
type CalcError = Extract<BanglaDateCalculation, { ok: false }>["errors"][number];

const MODE_ORDER: readonly Mode[] = ["toBangla", "toGregorian"];
/** The conversion direction is remembered in this browser. */
const MODE_PREF = choicePreference("bangla-date-converter", "mode", MODE_ORDER, "toBangla");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const FIELD_IDS: Record<Field, string> = {
  gregorianDate: "bangla-date-gregorian",
  banglaYear: "bangla-date-year",
  banglaMonth: "bangla-date-month",
  banglaDay: "bangla-date-day",
};

const STRINGS = {
  en: {
    submit: "Convert date",
    todayTitle: "Today’s Bangla date",
    modeLegend: "Convert",
    modes: { toBangla: "English → Bangla", toGregorian: "Bangla → English" },
    gregorianDate: "English (Gregorian) date",
    gregorianHint: "Today by default.",
    banglaYear: "Bangla year (Bangabda)",
    banglaYearPlaceholder: "e.g. 1433",
    banglaMonth: "Bangla month",
    chooseMonth: "Choose a month",
    monthOption: (name: string, nameBn: string) => `${name} (${nameBn})`,
    banglaDay: "Day",
    banglaDayPlaceholder: "e.g. 12",
    dayHint: "Boishakh–Ashwin have 31 days, Falgun 29 (30 in a leap year), the rest 30.",
    monthLengthHint: (month: string, year: number, days: number) => `${month} ${year} has ${days} days.`,
    errMissingDate: "Enter a full date: day, month and year.",
    errInvalidDate: "This isn’t a real date. Check the day, month and 4-digit year.",
    errOutOfRange: "Pick a date from 14 April 594 to 13 April 8594.",
    yearLabel: "Bangla year",
    yearMin: `${MIN_BANGLA_YEAR} or more`,
    yearMax: `${MAX_BANGLA_YEAR} or less`,
    errMonth: "Choose a Bangla month.",
    dayLabel: "day",
    dayMin: "1 or more",
    dayMax: "31 or less",
    errDayNotInMonth: (month: string, year: number, days: number) =>
      `${month} ${year} has only ${days} days. Enter a day from 1 to ${days}.`,
    season: (b: BanglaDate) => `${b.season} (${b.seasonMeaning})`,
    placeholderTitleFirst: "The converted date will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Pick a date, then select Convert date.",
    placeholderFix: "Fix the highlighted field above and the result will show here.",
    resultTitleBangla: (gregorian: string) => `Bangla date on ${gregorian}`,
    resultTitleGregorian: (bangla: string) => `English date for ${bangla}`,
    westernDigits: "With English digits",
    seasonLabel: "Season",
    weekday: "Weekday",
    gregorianLabel: "English date",
    announcement: (gregorian: string, bangla: string) => `${gregorian} is ${bangla}.`,
    shareText: (gregorian: string, weekday: string, banglaBn: string, banglaWestern: string, season: string) =>
      `${gregorian} (${weekday}) is ${banglaBn} (${banglaWestern}), in ${season}. Converted with HisabBD’s Bangla Date Converter.`,
    shareTitle: "Bangla date from HisabBD",
  },
  bn: {
    submit: "তারিখ রূপান্তর করুন",
    todayTitle: "আজকের বাংলা তারিখ",
    modeLegend: "রূপান্তর",
    modes: { toBangla: "ইংরেজি → বাংলা", toGregorian: "বাংলা → ইংরেজি" },
    gregorianDate: "ইংরেজি তারিখ",
    gregorianHint: "সাধারণত আজকের তারিখ।",
    banglaYear: "বাংলা সাল (বঙ্গাব্দ)",
    banglaYearPlaceholder: "যেমন 1433",
    banglaMonth: "বাংলা মাস",
    chooseMonth: "মাস বেছে নিন",
    monthOption: (_name: string, nameBn: string) => nameBn,
    banglaDay: "তারিখ (দিন)",
    banglaDayPlaceholder: "যেমন 12",
    dayHint: "বৈশাখ থেকে আশ্বিন 31 দিনের, ফাল্গুন 29 দিনের (অধিবর্ষে 30), বাকিগুলো 30 দিনের।",
    monthLengthHint: (month: string, year: number, days: number) => `${month} ${year}-এ ${days} দিন।`,
    errMissingDate: "পুরো তারিখ লিখুন: দিন, মাস ও বছর।",
    errInvalidDate: "এটা সঠিক তারিখ নয়। দিন, মাস আর ৪ অঙ্কের বছর মিলিয়ে দেখুন।",
    errOutOfRange: "14 এপ্রিল 594 থেকে 13 এপ্রিল 8594-এর মধ্যে একটি তারিখ বেছে নিন।",
    yearLabel: "বাংলা সাল",
    yearMin: `${MIN_BANGLA_YEAR} বা তার বেশি`,
    yearMax: `${MAX_BANGLA_YEAR} বা তার কম`,
    errMonth: "একটি বাংলা মাস বেছে নিন।",
    dayLabel: "দিন",
    dayMin: "1 বা তার বেশি",
    dayMax: "31 বা তার কম",
    errDayNotInMonth: (month: string, year: number, days: number) =>
      `${month} ${year}-এ মাত্র ${days} দিন। 1 থেকে ${days}-এর মধ্যে দিন লিখুন।`,
    season: (b: BanglaDate) => `${b.seasonBn} ঋতু`,
    placeholderTitleFirst: "রূপান্তরিত তারিখ এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "একটি তারিখ বেছে নিয়ে “তারিখ রূপান্তর করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরটি ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitleBangla: (gregorian: string) => `${gregorian}-এর বাংলা তারিখ`,
    resultTitleGregorian: (bangla: string) => `${bangla}-এর ইংরেজি তারিখ`,
    westernDigits: "ইংরেজি অঙ্কে",
    seasonLabel: "ঋতু",
    weekday: "বার",
    gregorianLabel: "ইংরেজি তারিখ",
    announcement: (gregorian: string, bangla: string) => `${gregorian} হলো ${bangla}।`,
    shareText: (gregorian: string, weekday: string, banglaBn: string, banglaWestern: string, season: string) =>
      `${gregorian} (${weekday}) হলো ${banglaBn} (${banglaWestern}), ${season}। HisabBD-র বাংলা তারিখ রূপান্তরে হিসাব করা।`,
    shareTitle: "HisabBD থেকে বাংলা তারিখ",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: CalcError, year: string, month: string): string {
  switch (error.field) {
    case "gregorianDate":
      if (error.code === "missing") return t.errMissingDate;
      return error.code === "out-of-range" ? t.errOutOfRange : t.errInvalidDate;
    case "banglaYear":
      if (error.code === "day-not-in-month") return ""; // only reported on the day field
      return numberErrorMessage(error.code, { label: t.yearLabel, min: t.yearMin, max: t.yearMax }, locale);
    case "banglaMonth":
      return t.errMonth;
    case "banglaDay": {
      if (error.code !== "day-not-in-month") {
        return numberErrorMessage(error.code, { label: t.dayLabel, min: t.dayMin, max: t.dayMax }, locale);
      }
      // The day is 1–31 but too long for this month; logic only reports this
      // when the year and month are valid.
      const y = parseYear(year) ?? MIN_BANGLA_YEAR;
      const m = Number(month);
      const info = BANGLA_MONTHS[m - 1];
      const name = (locale === "bn" ? info?.nameBn : info?.name) ?? "";
      return t.errDayNotInMonth(name, y, banglaMonthLength(y, m));
    }
  }
}

/** The typed Bangla year as a number, or null when it isn't a valid year yet. */
function parseYear(raw: string): number | null {
  const year = checkNumber(raw, { min: MIN_BANGLA_YEAR, max: MAX_BANGLA_YEAR, integer: true });
  return year.ok ? year.value : null;
}

function shareText(t: Strings, locale: Locale, r: BanglaDateResult): string {
  return t.shareText(
    formatPlainDate(r.gregorian, { locale }),
    weekdayName(r.weekday, locale),
    formatBanglaDateBn(r.bangla),
    formatBanglaDateWestern(r.bangla, locale),
    t.season(r.bangla),
  );
}

export function BanglaDateCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const today = useToday();
  const [mode, setMode] = usePreference(MODE_PREF);
  /** null = follow today's date. */
  const [gregorianInput, setGregorianInput] = useState<string | null>(null);
  const [banglaYear, setBanglaYear] = useState("");
  const [banglaMonth, setBanglaMonth] = useState("");
  const [banglaDay, setBanglaDay] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs = {
    gregorianDate: useRef<HTMLInputElement>(null),
    banglaYear: useRef<HTMLInputElement>(null),
    banglaMonth: useRef<HTMLSelectElement>(null),
    banglaDay: useRef<HTMLInputElement>(null),
  };
  const { record } = useCalculationHistory();

  const gregorianDate = gregorianInput ?? today;
  const convert = () =>
    mode === "toBangla"
      ? calculateBanglaDate(gregorianDate)
      : calculateGregorianDate(banglaYear, banglaMonth, banglaDay);
  const calc = submitted ? convert() : null;
  const errorFor = (field: Field) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error, banglaYear, banglaMonth) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  // Live hint: the length of the chosen month once a valid year and month are entered.
  const hintYear = parseYear(banglaYear);
  const hintMonth = BANGLA_MONTHS[Number(banglaMonth) - 1];
  const dayHint =
    hintYear !== null && banglaMonth && hintMonth
      ? t.monthLengthHint(
          locale === "bn" ? hintMonth.nameBn : hintMonth.name,
          hintYear,
          banglaMonthLength(hintYear, Number(banglaMonth)),
        )
      : t.dayHint;

  function onSubmit() {
    setSubmitted(true);
    const check = convert();
    if (check.ok) {
      setRevealCount((n) => n + 1);
      const typed: Record<string, string> =
        mode === "toBangla" ? { gregorianDate } : { banglaYear, banglaMonth, banglaDay };
      record({ mode, ...typed }, shareText(t, locale, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onModeChange(next: Mode) {
    setMode(next);
    setSubmitted(false);
  }

  /**
   * Fills the form from a saved conversion and shows its result. Sets the
   * mode directly, since onModeChange would clear it.
   */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedMode = MODE_ORDER.find((m) => m === saved.mode);
    const month = text("banglaMonth");
    if (savedMode) setMode(savedMode);
    setGregorianInput(DATE_PATTERN.test(text("gregorianDate")) ? text("gregorianDate") : null);
    setBanglaYear(text("banglaYear"));
    setBanglaMonth(BANGLA_MONTHS.some((_, i) => String(i + 1) === month) ? month : "");
    setBanglaDay(text("banglaDay"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered direction stays. */
  function onReset() {
    setGregorianInput(null);
    setBanglaYear("");
    setBanglaMonth("");
    setBanglaDay("");
    setSubmitted(false);
    setRevealCount(0);
    (mode === "toBangla" ? refs.gregorianDate : refs.banglaYear).current?.focus();
  }

  return (
    <div>
      <TodayBanglaDate today={today} />
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="mb-5">
          <SegmentedControl
            name="bangla-date-mode"
            legend={t.modeLegend}
            options={[
              { value: "toBangla", label: t.modes.toBangla },
              { value: "toGregorian", label: t.modes.toGregorian },
            ]}
            value={mode}
            onChange={onModeChange}
          />
        </div>
        {mode === "toBangla" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id={FIELD_IDS.gregorianDate}
              label={t.gregorianDate}
              hint={t.gregorianHint}
              error={errorFor("gregorianDate")}
            >
              {(control) => (
                <Input
                  {...control}
                  ref={refs.gregorianDate}
                  type="date"
                  value={gregorianDate}
                  onChange={(event) => setGregorianInput(event.target.value)}
                />
              )}
            </FormField>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField id={FIELD_IDS.banglaYear} label={t.banglaYear} error={errorFor("banglaYear")}>
              {(control) => (
                <Input
                  {...control}
                  ref={refs.banglaYear}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={t.banglaYearPlaceholder}
                  value={banglaYear}
                  onChange={(event) => setBanglaYear(event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.banglaMonth} label={t.banglaMonth} error={errorFor("banglaMonth")}>
              {(control) => (
                <Select
                  {...control}
                  ref={refs.banglaMonth}
                  value={banglaMonth}
                  onChange={(event) => setBanglaMonth(event.target.value)}
                >
                  <option value="">{t.chooseMonth}</option>
                  {BANGLA_MONTHS.map((month, i) => (
                    <option key={month.name} value={String(i + 1)}>
                      {t.monthOption(month.name, month.nameBn)}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField id={FIELD_IDS.banglaDay} label={t.banglaDay} hint={dayHint} error={errorFor("banglaDay")}>
              {(control) => (
                <Input
                  {...control}
                  ref={refs.banglaDay}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={t.banglaDayPlaceholder}
                  value={banglaDay}
                  onChange={(event) => setBanglaDay(event.target.value)}
                />
              )}
            </FormField>
          </div>
        )}
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result
            ? t.announcement(
                formatPlainDate(result.gregorian, { locale }),
                locale === "bn" ? formatBanglaDateBn(result.bangla) : formatBanglaDateWestern(result.bangla, "en"),
              )
            : ""
        }
        result={result && <BanglaDateResultView result={result} mode={mode} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-3xl font-bold tracking-tight">– বঙ্গাব্দ</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

/**
 * Today's Bangla date, above the form. useToday() is "" during server
 * rendering, so this renders nothing until the page has hydrated.
 */
function TodayBanglaDate({ today }: { today: string }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const date = parsePlainDate(today);
  if (!date || !isInBanglaRange(date)) return null;
  const bangla = toBanglaDate(date);
  const details = [
    weekdayName(dayOfWeek(date), locale),
    formatBanglaDateWestern(bangla, locale),
    t.season(bangla),
    formatPlainDate(date, { locale }),
  ];

  return (
    <section
      aria-labelledby="bangla-date-today-heading"
      className="mb-5 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4"
    >
      <h2 id="bangla-date-today-heading" className="text-sm font-semibold text-brand-800">
        {t.todayTitle}
      </h2>
      <p lang="bn" className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {formatBanglaDateBn(bangla)}
      </p>
      <p className="mt-1 text-sm text-slate-700">{details.join(" · ")}</p>
    </section>
  );
}

function BanglaDateResultView({ result: r, mode }: { result: BanglaDateResult; mode: Mode }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const banglaBn = formatBanglaDateBn(r.bangla);
  const gregorian = formatPlainDate(r.gregorian, { locale });
  const western = formatBanglaDateWestern(r.bangla, locale);
  const weekday = weekdayName(r.weekday, locale);
  // The main value is the converted date; the stats hold whatever it doesn't show.
  const stats =
    mode === "toBangla"
      ? [
          { label: t.seasonLabel, value: t.season(r.bangla) },
          { label: t.weekday, value: weekday },
          { label: t.gregorianLabel, value: gregorian, wide: true },
        ]
      : [
          { label: t.westernDigits, value: western },
          { label: t.seasonLabel, value: t.season(r.bangla) },
          { label: t.weekday, value: weekday, wide: true },
        ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={mode === "toBangla" ? t.resultTitleBangla(gregorian) : t.resultTitleGregorian(banglaBn)}
        titleId="bangla-date-result-heading"
        value={
          mode === "toBangla" ? (
            <>
              <p lang="bn" className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {banglaBn}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{western}</p>
            </>
          ) : (
            <>
              <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{gregorian}</p>
              <p lang="bn" className="mt-1 text-lg font-semibold text-slate-800">
                {banglaBn}
              </p>
            </>
          )
        }
      >
        <ResultStats items={stats} />
      </ResultPanel>
      <ResultActions key={shareText(t, locale, r)} text={shareText(t, locale, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

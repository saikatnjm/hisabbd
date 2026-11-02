"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { AffixInput, FormField, Input } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatPlainDate } from "@/lib/format";
import type { PlainDate } from "@/lib/plain-date";
import { useToday } from "@/lib/use-today";
import {
  calculateOvulation,
  MAX_CYCLE,
  MIN_CYCLE,
  type OvulationError,
  type OvulationField,
  type OvulationResult,
} from "./logic";

const FIELD_IDS: Record<OvulationField, string> = {
  lastPeriod: "ovulation-last-period",
  cycle: "ovulation-cycle",
  asOf: "ovulation-as-of",
};

const STRINGS = {
  en: {
    submit: "Show my dates",
    lastPeriod: "First day of your last period",
    cycle: "Cycle length",
    cycleHint: "Days from the first day of one period to the first day of the next. 28 if you’re not sure.",
    daysSuffix: "days",
    asOf: "Today’s date",
    privacy: "Nothing you enter is saved or sent anywhere, and this calculator keeps no history.",
    errors: {
      missingDate: "Enter the first day of your last period.",
      missingAsOf: "Enter today’s date.",
      invalid: "This isn’t a real date. Check the day, month and 4-digit year.",
      afterAsOf: "The last period can’t start after today’s date.",
      tooLongAgo: "That is more than 90 days ago. Enter your most recent period.",
    },
    errCycle: "cycle length",
    errCycleMin: `${MIN_CYCLE} days or more`,
    errCycleMax: `${MAX_CYCLE} days or less`,
    resultTitle: "Your likely ovulation days",
    cycleDay: (n: number) => `Today is day ${n} of your cycle.`,
    range: (from: string, to: string) => `${from} – ${to}`,
    cycleN: (n: number) => (n === 1 ? "This cycle" : `Cycle ${n}`),
    ovulation: "Likely ovulation",
    nextPeriod: "Next period",
    irregular: "Your cycle is outside the 21–35 days the NHS calls normal, so these dates are harder to predict.",
    note: "Ovulation is usually 10–16 days before the next period (NHS). Sperm can survive up to 7 days, so the days before also count. Not contraception, not medical advice.",
    announcement: (range: string, next: string) => `Likely ovulation ${range}. Next period ${next}.`,
    placeholderTitleFirst: "Your dates will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the first day of your last period, then select Show my dates.",
    placeholderFix: "Fix the highlighted fields above and the dates will show here.",
    shareTitle: "Cycle dates from HisabBD",
    shareText: (range: string, next: string) => `Likely ovulation ${range}; next period ${next}. Estimated with HisabBD’s Ovulation Calculator.`,
  },
  bn: {
    submit: "তারিখ দেখুন",
    lastPeriod: "শেষ মাসিক শুরুর তারিখ",
    cycle: "চক্রের দৈর্ঘ্য",
    cycleHint: "এক মাসিকের প্রথম দিন থেকে পরের মাসিকের প্রথম দিন পর্যন্ত দিন। নিশ্চিত না হলে 28।",
    daysSuffix: "দিন",
    asOf: "আজকের তারিখ",
    privacy: "আপনার লেখা কিছুই কোথাও জমা হয় না বা পাঠানো হয় না, আর এই ক্যালকুলেটর কোনো হিসাবের তালিকা রাখে না।",
    errors: {
      missingDate: "শেষ মাসিক শুরুর তারিখ লিখুন।",
      missingAsOf: "আজকের তারিখ লিখুন।",
      invalid: "এটা সঠিক তারিখ নয়। দিন, মাস আর 4 অঙ্কের বছর মিলিয়ে দেখুন।",
      afterAsOf: "শেষ মাসিক আজকের তারিখের পরে শুরু হতে পারে না।",
      tooLongAgo: "এটি 90 দিনেরও বেশি আগে। সবচেয়ে সাম্প্রতিক মাসিকের তারিখ লিখুন।",
    },
    errCycle: "চক্রের দৈর্ঘ্য",
    errCycleMin: `${MIN_CYCLE} দিন বা তার বেশি`,
    errCycleMax: `${MAX_CYCLE} দিন বা তার কম`,
    resultTitle: "ডিম্বস্ফোটনের সম্ভাব্য দিন",
    cycleDay: (n: number) => `আজ আপনার চক্রের ${n}তম দিন।`,
    range: (from: string, to: string) => `${from} – ${to}`,
    cycleN: (n: number) => (n === 1 ? "এই চক্র" : `চক্র ${n}`),
    ovulation: "সম্ভাব্য ডিম্বস্ফোটন",
    nextPeriod: "পরের মাসিক",
    irregular: "আপনার চক্র এনএইচএসের বলা স্বাভাবিক 21–35 দিনের বাইরে, তাই এই তারিখগুলো আগাম বলা কঠিন।",
    note: "ডিম্বস্ফোটন সাধারণত পরের মাসিকের 10–16 দিন আগে হয় (এনএইচএস)। শুক্রাণু 7 দিন পর্যন্ত বাঁচতে পারে, তাই আগের দিনগুলোও ধর্তব্য। এটি জন্মনিয়ন্ত্রণ বা চিকিৎসা-পরামর্শ নয়।",
    announcement: (range: string, next: string) => `সম্ভাব্য ডিম্বস্ফোটন ${range}। পরের মাসিক ${next}।`,
    placeholderTitleFirst: "আপনার তারিখগুলো এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "শেষ মাসিক শুরুর তারিখ লিখে “তারিখ দেখুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই তারিখ এখানে দেখা যাবে।",
    shareTitle: "HisabBD-র মাসিক চক্রের তারিখ",
    shareText: (range: string, next: string) => `সম্ভাব্য ডিম্বস্ফোটন ${range}; পরের মাসিক ${next}। HisabBD-র ওভুলেশন ক্যালকুলেটরে আনুমানিক হিসাব।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: OvulationError): string {
  switch (error.code) {
    case "date-missing":
      return error.field === "asOf" ? t.errors.missingAsOf : t.errors.missingDate;
    case "date-invalid":
      return t.errors.invalid;
    case "after-as-of":
      return t.errors.afterAsOf;
    case "too-long-ago":
      return t.errors.tooLongAgo;
    default:
      return numberErrorMessage(error.code, { label: t.errCycle, min: t.errCycleMin, max: t.errCycleMax }, locale);
  }
}

function dateText(date: PlainDate, locale: Locale): string {
  return formatPlainDate(date, { locale });
}

function firstRange(t: Strings, locale: Locale, r: OvulationResult): string {
  const c = r.cycles[0]!;
  return t.range(dateText(c.ovulationFrom, locale), dateText(c.ovulationTo, locale));
}

function shareText(t: Strings, locale: Locale, r: OvulationResult): string {
  return t.shareText(firstRange(t, locale, r), dateText(r.cycles[0]!.nextPeriod, locale));
}

export function OvulationCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const today = useToday();
  // Deliberately not remembered and not added to recent calculations (privacy on shared devices).
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycle, setCycle] = useState("28");
  const [asOfInput, setAsOfInput] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs = {
    lastPeriod: useRef<HTMLInputElement>(null),
    cycle: useRef<HTMLInputElement>(null),
    asOf: useRef<HTMLInputElement>(null),
  };

  const asOf = asOfInput ?? today;
  const calc = submitted ? calculateOvulation(lastPeriod, cycle, asOf) : null;
  const errorFor = (field: OvulationField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateOvulation(lastPeriod, cycle, asOf);
    if (check.ok) setRevealCount((n) => n + 1);
    else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setLastPeriod("");
    setCycle("28");
    setAsOfInput(null);
    setSubmitted(false);
    setRevealCount(0);
    refs.lastPeriod.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id={FIELD_IDS.lastPeriod} label={t.lastPeriod} error={errorFor("lastPeriod")}>
              {(control) => (
                <Input
                  {...control}
                  ref={refs.lastPeriod}
                  type="date"
                  value={lastPeriod}
                  max={asOf || undefined}
                  onChange={(event) => setLastPeriod(event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.cycle} label={t.cycle} hint={t.cycleHint} error={errorFor("cycle")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.cycle}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  suffix={t.daysSuffix}
                  value={cycle}
                  onChange={(event) => setCycle(event.target.value)}
                />
              )}
            </FormField>
          </div>
          <FormField id={FIELD_IDS.asOf} label={t.asOf} error={errorFor("asOf")}>
            {(control) => (
              <Input {...control} ref={refs.asOf} type="date" value={asOf} onChange={(event) => setAsOfInput(event.target.value)} />
            )}
          </FormField>
          <p className="text-sm text-slate-600">{t.privacy}</p>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(firstRange(t, locale, result), dateText(result.cycles[0]!.nextPeriod, locale)) : ""}
        result={result && <OvulationResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-3xl font-bold tracking-tight">– – –</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function OvulationResultView({ result: r }: { result: OvulationResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const text = shareText(t, locale, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="ovulation-result-heading"
        value={
          <>
            <p className="font-display text-4xl font-bold tracking-tight break-words sm:text-5xl">{firstRange(t, locale, r)}</p>
            <p className="mt-1 text-slate-700">{t.cycleDay(r.cycleDay)}</p>
          </>
        }
      >
        <ul className="space-y-3">
          {r.cycles.map((c, i) => (
            <li key={i} className="rounded-xl bg-white/70 px-4 py-3">
              <p className="font-semibold text-slate-900">{t.cycleN(i + 1)}</p>
              <dl className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-600">{t.ovulation}</dt>
                  <dd className="font-semibold text-slate-900">{t.range(dateText(c.ovulationFrom, locale), dateText(c.ovulationTo, locale))}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">{t.nextPeriod}</dt>
                  <dd className="font-semibold text-slate-900">{formatPlainDate(c.nextPeriod, { weekday: true, locale })}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        {r.irregular && <p className="mt-4 font-semibold text-slate-800">{t.irregular}</p>}
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPercent } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculatePercentage,
  type PercentageDirection,
  type PercentageError,
  type PercentageField,
  type PercentageMode,
  type PercentageResult,
} from "./logic";

interface FieldConfig {
  label: string;
  /** Lower-case name used inside error sentences. */
  noun: string;
  suffix?: string;
  placeholder: string;
}

interface ModeConfig {
  label: string;
  /** The question in plain language. */
  sentence: string;
  a: FieldConfig;
  b: FieldConfig;
}

const MODE_ORDER: readonly PercentageMode[] = ["percent-of", "what-percent", "change", "increase-decrease", "reverse"];

/** Remembered in this browser: the last question chosen, and increase or decrease. */
const MODE = choicePreference("percentage-calculator", "mode", MODE_ORDER, "percent-of");
const DIRECTION = choicePreference("percentage-calculator", "direction", ["increase", "decrease"] as const, "increase");

const MODES: Record<Locale, Record<PercentageMode, ModeConfig>> = {
  en: {
    "percent-of": {
      label: "% of a number",
      sentence: "What is P% of Y?",
      a: { label: "Percentage (P)", noun: "percentage", suffix: "%", placeholder: "e.g. 15" },
      b: { label: "Number (Y)", noun: "number", placeholder: "e.g. 2,000" },
    },
    "what-percent": {
      label: "What percent",
      sentence: "X is what percent of Y?",
      a: { label: "Part (X)", noun: "part", placeholder: "e.g. 45" },
      b: { label: "Whole (Y)", noun: "whole", placeholder: "e.g. 60" },
    },
    change: {
      label: "% change",
      sentence: "What is the percentage change from A to B?",
      a: { label: "Starting value (A)", noun: "starting value", placeholder: "e.g. 80" },
      b: { label: "New value (B)", noun: "new value", placeholder: "e.g. 100" },
    },
    "increase-decrease": {
      label: "Increase / decrease",
      sentence: "Increase or decrease Y by P%.",
      a: { label: "Number (Y)", noun: "number", placeholder: "e.g. 1,000" },
      b: { label: "Percentage (P)", noun: "percentage", suffix: "%", placeholder: "e.g. 10" },
    },
    reverse: {
      label: "Find the whole",
      sentence: "X is P% of what number?",
      a: { label: "Amount (X)", noun: "amount", placeholder: "e.g. 25" },
      b: { label: "Percentage (P)", noun: "percentage", suffix: "%", placeholder: "e.g. 20" },
    },
  },
  bn: {
    "percent-of": {
      label: "সংখ্যার %",
      sentence: "Y-এর P% কত?",
      a: { label: "শতকরা (P)", noun: "শতকরা হার", suffix: "%", placeholder: "যেমন 15" },
      b: { label: "সংখ্যা (Y)", noun: "সংখ্যা", placeholder: "যেমন 2,000" },
    },
    "what-percent": {
      label: "কত শতাংশ",
      sentence: "X, Y-এর কত শতাংশ?",
      a: { label: "অংশ (X)", noun: "অংশ", placeholder: "যেমন 45" },
      b: { label: "পূর্ণ সংখ্যা (Y)", noun: "পূর্ণ সংখ্যা", placeholder: "যেমন 60" },
    },
    change: {
      label: "% পরিবর্তন",
      sentence: "A থেকে B-তে শতকরা পরিবর্তন কত?",
      a: { label: "শুরুর মান (A)", noun: "শুরুর মান", placeholder: "যেমন 80" },
      b: { label: "নতুন মান (B)", noun: "নতুন মান", placeholder: "যেমন 100" },
    },
    "increase-decrease": {
      label: "বাড়ানো / কমানো",
      sentence: "Y-কে P% বাড়ান বা কমান।",
      a: { label: "সংখ্যা (Y)", noun: "সংখ্যা", placeholder: "যেমন 1,000" },
      b: { label: "শতকরা (P)", noun: "শতকরা হার", suffix: "%", placeholder: "যেমন 10" },
    },
    reverse: {
      label: "পূর্ণ সংখ্যা খোঁজা",
      sentence: "X কোন সংখ্যার P%?",
      a: { label: "পরিমাণ (X)", noun: "পরিমাণ", placeholder: "যেমন 25" },
      b: { label: "শতকরা (P)", noun: "শতকরা হার", suffix: "%", placeholder: "যেমন 20" },
    },
  },
};

const STRINGS = {
  en: {
    submit: "Calculate",
    modeLegend: "What do you want to find?",
    directionLegend: "Increase or decrease?",
    increase: "Increase",
    decrease: "Decrease",
    placeholderTitleFirst: "Your answer will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Choose what to find, enter two numbers, then select Calculate.",
    placeholderFix: "Fix the highlighted fields above and the answer will show here.",
    workedOutAs: "Worked out as:",
    decreaseOverHundred: "Decreasing by more than 100% takes the number below zero, so the answer is negative.",
    shareSuffix: "Calculated with HisabBD’s Percentage Calculator.",
    shareTitle: "Percentage calculated with HisabBD",
    errOutOfRange:
      "This is outside what the calculator can handle. Use a number between −1,000,000,000,000 and 1,000,000,000,000 that isn’t extremely close to 0.",
    errNegative: "Enter a percentage of 0 or more. Choose Decrease to make the number smaller.",
    errZeroWhole: "The whole can’t be 0: there is no percentage of nothing.",
    errZeroStart: "The starting value can’t be 0: a percentage change from 0 is undefined.",
    errZeroPercent: "The percentage can’t be 0: the whole number can’t be found from 0%.",
    startingValue: "Starting value",
    newValue: "New value",
    difference: "Difference",
    higher: "higher",
    lower: "lower",
    startingNumber: "Starting number",
    amountAdded: "Amount added",
    amountRemoved: "Amount removed",
    percentOf: (p: string, y: string, v: string) => ({
      title: `${p}% of ${y}`,
      sentence: `${p}% of ${y} is ${v}.`,
    }),
    whatPercent: (x: string, y: string, p: string) => ({
      title: `${x} as a percentage of ${y}`,
      sentence: `${x} is ${p} of ${y}.`,
    }),
    changeTitle: (a: string, b: string) => `Change from ${a} to ${b}`,
    changeNone: (a: string, b: string) => `From ${a} to ${b} there is no change.`,
    changeSentence: (a: string, b: string, p: string, dir: "increase" | "decrease") =>
      `From ${a} to ${b} is a ${p} ${dir}.`,
    changeValue: (p: string, dir: "increase" | "decrease") => `${p} ${dir}`,
    incDec: (y: string, p: string, v: string, dir: "increase" | "decrease") => ({
      title: `${y} ${dir === "increase" ? "increased" : "decreased"} by ${p}%`,
      sentence: `${y} ${dir === "increase" ? "increased" : "decreased"} by ${p}% is ${v}.`,
    }),
    reverse: (x: string, p: string, w: string) => ({
      title: `${x} is ${p}% of`,
      sentence: `${x} is ${p}% of ${w}.`,
    }),
  },
  bn: {
    submit: "হিসাব করুন",
    modeLegend: "কী বের করতে চান?",
    directionLegend: "বাড়াবেন না কমাবেন?",
    increase: "বাড়ান",
    decrease: "কমান",
    placeholderTitleFirst: "আপনার উত্তর এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "কী বের করবেন বেছে নিন, দুটি সংখ্যা লিখুন, তারপর “হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই উত্তর এখানে দেখা যাবে।",
    workedOutAs: "যেভাবে হিসাব হলো:",
    decreaseOverHundred: "100%-এর বেশি কমালে সংখ্যাটি শূন্যের নিচে নেমে যায়, তাই উত্তর ঋণাত্মক।",
    shareSuffix: "HisabBD-র শতকরা ক্যালকুলেটরে হিসাব করা।",
    shareTitle: "HisabBD দিয়ে শতকরা হিসাব",
    errOutOfRange:
      "এটি ক্যালকুলেটরের সীমার বাইরে। −1,000,000,000,000 থেকে 1,000,000,000,000-এর মধ্যে এমন সংখ্যা দিন যা 0-এর খুব কাছাকাছি নয়।",
    errNegative: "শতকরা হার 0 বা তার বেশি দিন। সংখ্যা ছোট করতে চাইলে “কমান” বেছে নিন।",
    errZeroWhole: "পূর্ণ সংখ্যা 0 হতে পারে না: শূন্যের শতাংশ হয় না।",
    errZeroStart: "শুরুর মান 0 হতে পারে না: 0 থেকে শতকরা পরিবর্তন সংজ্ঞায়িত নয়।",
    errZeroPercent: "শতকরা হার 0 হতে পারে না: 0% থেকে পূর্ণ সংখ্যা বের করা যায় না।",
    startingValue: "শুরুর মান",
    newValue: "নতুন মান",
    difference: "পার্থক্য",
    higher: "বেশি",
    lower: "কম",
    startingNumber: "শুরুর সংখ্যা",
    amountAdded: "যোগ হয়েছে",
    amountRemoved: "বাদ গেছে",
    percentOf: (p: string, y: string, v: string) => ({
      title: `${y}-এর ${p}%`,
      sentence: `${y}-এর ${p}% হলো ${v}।`,
    }),
    whatPercent: (x: string, y: string, p: string) => ({
      title: `${y}-এর মধ্যে ${x} কত শতাংশ`,
      sentence: `${x} হলো ${y}-এর ${p}।`,
    }),
    changeTitle: (a: string, b: string) => `${a} থেকে ${b}-তে পরিবর্তন`,
    changeNone: (a: string, b: string) => `${a} থেকে ${b}-তে কোনো পরিবর্তন নেই।`,
    changeSentence: (a: string, b: string, p: string, dir: "increase" | "decrease") =>
      `${a} থেকে ${b} মানে ${p} ${dir === "increase" ? "বৃদ্ধি" : "হ্রাস"}।`,
    changeValue: (p: string, dir: "increase" | "decrease") =>
      `${p} ${dir === "increase" ? "বৃদ্ধি" : "হ্রাস"}`,
    incDec: (y: string, p: string, v: string, dir: "increase" | "decrease") => ({
      title: `${y}-কে ${p}% ${dir === "increase" ? "বাড়ালে" : "কমালে"}`,
      sentence: `${y}-কে ${p}% ${dir === "increase" ? "বাড়ালে" : "কমালে"} হয় ${v}।`,
    }),
    reverse: (x: string, p: string, w: string) => ({
      title: `${x} যে সংখ্যার ${p}%`,
      sentence: `${x} হলো ${w}-এর ${p}%।`,
    }),
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

const FIELD_IDS: Record<PercentageField, string> = { a: "percentage-a", b: "percentage-b" };

const SMALL = 0.0001;

/** Up to 4 decimals, trimmed. A non-zero value too small to show is written as "< 0.0001". */
function fmt(value: number): string {
  if (value !== 0 && Math.abs(value) < SMALL) return value > 0 ? `< ${SMALL}` : `> −${SMALL}`;
  return formatNumber(value, { decimals: 4 });
}

function fmtPercent(value: number): string {
  if (value !== 0 && Math.abs(value) < SMALL) return `${fmt(value)}%`;
  return formatPercent(value, { decimals: 4 });
}

function errorMessage(t: Strings, locale: Locale, mode: PercentageMode, error: PercentageError): string {
  const config = MODES[locale][mode][error.field];
  switch (error.code) {
    case "missing":
    case "invalid":
      return numberErrorMessage(error.code, { label: config.noun }, locale);
    case "out-of-range":
      return t.errOutOfRange;
    case "negative":
      return t.errNegative;
    case "zero":
      if (mode === "what-percent") return t.errZeroWhole;
      if (mode === "change") return t.errZeroStart;
      return t.errZeroPercent;
  }
}

interface Summary {
  /** Heading above the answer. */
  title: string;
  /** Answer, shown large. */
  value: string;
  /** Plain-language sentence with the numbers. */
  sentence: string;
  /** Formula with the numbers filled in (language-free). */
  working: string;
}

function summarize(t: Strings, r: PercentageResult): Summary {
  switch (r.mode) {
    case "percent-of": {
      const s = t.percentOf(fmt(r.percent), fmt(r.base), fmt(r.value));
      return {
        ...s,
        value: fmt(r.value),
        working: `${fmt(r.percent)} ÷ 100 × ${fmt(r.base)} = ${fmt(r.value)}`,
      };
    }
    case "what-percent": {
      const s = t.whatPercent(fmt(r.part), fmt(r.whole), fmtPercent(r.percent));
      return {
        ...s,
        value: fmtPercent(r.percent),
        working: `${fmt(r.part)} ÷ ${fmt(r.whole)} × 100 = ${fmtPercent(r.percent)}`,
      };
    }
    case "change": {
      const dir = r.direction;
      return {
        title: t.changeTitle(fmt(r.from), fmt(r.to)),
        value: dir === "none" ? "0%" : t.changeValue(fmtPercent(Math.abs(r.percent)), dir),
        sentence:
          dir === "none"
            ? t.changeNone(fmt(r.from), fmt(r.to))
            : t.changeSentence(fmt(r.from), fmt(r.to), fmtPercent(Math.abs(r.percent)), dir),
        working: `(${fmt(r.to)} − ${fmt(r.from)}) ÷ ${fmt(Math.abs(r.from))} × 100 = ${fmtPercent(r.percent)}`,
      };
    }
    case "increase-decrease": {
      const sign = r.direction === "increase" ? "+" : "−";
      const s = t.incDec(fmt(r.base), fmt(r.percent), fmt(r.value), r.direction);
      return {
        ...s,
        value: fmt(r.value),
        working: `${fmt(r.base)} × (1 ${sign} ${fmt(r.percent)} ÷ 100) = ${fmt(r.value)}`,
      };
    }
    case "reverse": {
      const s = t.reverse(fmt(r.part), fmt(r.percent), fmt(r.whole));
      return {
        ...s,
        value: fmt(r.whole),
        working: `${fmt(r.part)} ÷ (${fmt(r.percent)} ÷ 100) = ${fmt(r.whole)}`,
      };
    }
  }
}

/** The text copied or shared for a result. */
function shareText(t: Strings, r: PercentageResult): string {
  const summary = summarize(t, r);
  return `${summary.sentence} (${summary.working}). ${t.shareSuffix}`;
}

function extraStats(t: Strings, r: PercentageResult): { label: string; value: string; wide?: boolean }[] {
  switch (r.mode) {
    case "change":
      return [
        { label: t.startingValue, value: fmt(r.from) },
        { label: t.newValue, value: fmt(r.to) },
        {
          label: t.difference,
          value:
            r.direction === "none"
              ? "0"
              : `${fmt(Math.abs(r.difference))} ${r.direction === "increase" ? t.higher : t.lower}`,
          wide: true,
        },
      ];
    case "increase-decrease":
      return [
        { label: t.startingNumber, value: fmt(r.base) },
        { label: r.direction === "increase" ? t.amountAdded : t.amountRemoved, value: fmt(r.amount) },
      ];
    default:
      return [];
  }
}

export function PercentageCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const modes = MODES[locale];
  const [mode, setMode] = usePreference(MODE);
  const [direction, setDirection] = usePreference(DIRECTION);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs: Record<PercentageField, React.RefObject<HTMLInputElement | null>> = {
    a: useRef<HTMLInputElement>(null),
    b: useRef<HTMLInputElement>(null),
  };

  const modeOptions = MODE_ORDER.map((value) => ({ value, label: modes[value].label }));
  const directionOptions: readonly { value: PercentageDirection; label: string }[] = [
    { value: "increase", label: t.increase },
    { value: "decrease", label: t.decrease },
  ];

  const config = modes[mode];
  const calc = submitted ? calculatePercentage(mode, a, b, { direction }) : null;
  const errorFor = (field: PercentageField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, mode, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function changeMode(next: PercentageMode) {
    setMode(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculatePercentage(mode, a, b, { direction });
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ mode, a, b, direction }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /**
   * Fills the form from a saved calculation (values come from storage, so each
   * is checked) and shows the result. Sets the mode directly rather than via
   * changeMode, which would hide the result again.
   */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedMode = text("mode");
    const savedDirection = text("direction");
    if (MODE.isValid(savedMode)) setMode(savedMode);
    if (DIRECTION.isValid(savedDirection)) setDirection(savedDirection);
    setA(text("a"));
    setB(text("b"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  // Keeps the remembered mode and direction; clears only the numbers.
  function onReset() {
    setA("");
    setB("");
    setSubmitted(false);
    setRevealCount(0);
    refs.a.current?.focus();
  }

  const inputs: readonly { field: PercentageField; value: string; set: (value: string) => void }[] = [
    { field: "a", value: a, set: setA },
    { field: "b", value: b, set: setB },
  ];

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl
          name="percentage-mode"
          legend={t.modeLegend}
          options={modeOptions}
          value={mode}
          onChange={changeMode}
        />
        <p className="mt-4 font-display text-lg font-semibold text-slate-900">{config.sentence}</p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {inputs.map(({ field, value, set }) => (
            <FormField key={field} id={FIELD_IDS[field]} label={config[field].label} error={errorFor(field)}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs[field]}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix={config[field].suffix}
                  placeholder={config[field].placeholder}
                  value={value}
                  onChange={(event) => set(event.target.value)}
                />
              )}
            </FormField>
          ))}
        </div>

        {mode === "increase-decrease" && (
          <div className="mt-5">
            <SegmentedControl
              name="percentage-direction"
              legend={t.directionLegend}
              options={directionOptions}
              value={direction}
              onChange={setDirection}
            />
          </div>
        )}
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? summarize(t, result).sentence : ""}
        result={result && <PercentageResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function PercentageResultView({ result: r }: { result: PercentageResult }) {
  const t = STRINGS[useLocale()];
  const summary = summarize(t, r);
  const stats = extraStats(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={summary.title}
        titleId="percentage-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{summary.value}</p>}
      >
        <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">{summary.sentence}</p>
        {stats.length > 0 && <ResultStats items={stats} className="mt-5" />}
        <p className="mt-4 text-sm text-slate-600">
          {t.workedOutAs} <span className="font-medium text-slate-800">{summary.working}</span>
        </p>
        {r.mode === "increase-decrease" && r.decreaseOverHundred && (
          <p className="mt-3 text-sm text-slate-700">{t.decreaseOverHundred}</p>
        )}
      </ResultPanel>

      <ResultActions
        key={`${summary.sentence}|${summary.working}`}
        text={shareText(t, r)}
        shareTitle={t.shareTitle}
      />
    </div>
  );
}

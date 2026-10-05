"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { formatNumber, formatPercent } from "@/lib/format";
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

const MODES: Record<PercentageMode, ModeConfig> = {
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
};

const MODE_OPTIONS = MODE_ORDER.map((mode) => ({ value: mode, label: MODES[mode].label }));

const DIRECTION_OPTIONS: readonly { value: PercentageDirection; label: string }[] = [
  { value: "increase", label: "Increase" },
  { value: "decrease", label: "Decrease" },
];

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

function errorMessage(mode: PercentageMode, error: PercentageError): string {
  const config = MODES[mode][error.field];
  switch (error.code) {
    case "missing":
    case "invalid":
      return numberErrorMessage(error.code, { label: config.noun });
    case "out-of-range":
      return `This is outside what the calculator can handle. Use a number between −1,000,000,000,000 and 1,000,000,000,000 that isn’t extremely close to 0.`;
    case "negative":
      return "Enter a percentage of 0 or more. Choose Decrease to make the number smaller.";
    case "zero":
      if (mode === "what-percent") return "The whole can’t be 0: there is no percentage of nothing.";
      if (mode === "change") return "The starting value can’t be 0: a percentage change from 0 is undefined.";
      return "The percentage can’t be 0: the whole number can’t be found from 0%.";
  }
}

interface Summary {
  /** Heading above the answer. */
  title: string;
  /** Answer, shown large. */
  value: string;
  /** Plain-language sentence with the numbers. */
  sentence: string;
  /** Formula with the numbers filled in. */
  working: string;
}

function summarize(r: PercentageResult): Summary {
  switch (r.mode) {
    case "percent-of":
      return {
        title: `${fmt(r.percent)}% of ${fmt(r.base)}`,
        value: fmt(r.value),
        sentence: `${fmt(r.percent)}% of ${fmt(r.base)} is ${fmt(r.value)}.`,
        working: `${fmt(r.percent)} ÷ 100 × ${fmt(r.base)} = ${fmt(r.value)}`,
      };
    case "what-percent":
      return {
        title: `${fmt(r.part)} as a percentage of ${fmt(r.whole)}`,
        value: fmtPercent(r.percent),
        sentence: `${fmt(r.part)} is ${fmtPercent(r.percent)} of ${fmt(r.whole)}.`,
        working: `${fmt(r.part)} ÷ ${fmt(r.whole)} × 100 = ${fmtPercent(r.percent)}`,
      };
    case "change": {
      const word = r.direction === "none" ? "no change" : r.direction;
      const value =
        r.direction === "none" ? "0%" : `${fmtPercent(Math.abs(r.percent))} ${r.direction}`;
      return {
        title: `Change from ${fmt(r.from)} to ${fmt(r.to)}`,
        value,
        sentence:
          r.direction === "none"
            ? `From ${fmt(r.from)} to ${fmt(r.to)} there is no change.`
            : `From ${fmt(r.from)} to ${fmt(r.to)} is a ${fmtPercent(Math.abs(r.percent))} ${word}.`,
        working: `(${fmt(r.to)} − ${fmt(r.from)}) ÷ ${fmt(Math.abs(r.from))} × 100 = ${fmtPercent(r.percent)}`,
      };
    }
    case "increase-decrease": {
      const verb = r.direction === "increase" ? "increased" : "decreased";
      const sign = r.direction === "increase" ? "+" : "−";
      return {
        title: `${fmt(r.base)} ${verb} by ${fmt(r.percent)}%`,
        value: fmt(r.value),
        sentence: `${fmt(r.base)} ${verb} by ${fmt(r.percent)}% is ${fmt(r.value)}.`,
        working: `${fmt(r.base)} × (1 ${sign} ${fmt(r.percent)} ÷ 100) = ${fmt(r.value)}`,
      };
    }
    case "reverse":
      return {
        title: `${fmt(r.part)} is ${fmt(r.percent)}% of`,
        value: fmt(r.whole),
        sentence: `${fmt(r.part)} is ${fmt(r.percent)}% of ${fmt(r.whole)}.`,
        working: `${fmt(r.part)} ÷ (${fmt(r.percent)} ÷ 100) = ${fmt(r.whole)}`,
      };
  }
}

function extraStats(r: PercentageResult): { label: string; value: string; wide?: boolean }[] {
  switch (r.mode) {
    case "change":
      return [
        { label: "Starting value", value: fmt(r.from) },
        { label: "New value", value: fmt(r.to) },
        {
          label: "Difference",
          value:
            r.direction === "none"
              ? "0"
              : `${fmt(Math.abs(r.difference))} ${r.direction === "increase" ? "higher" : "lower"}`,
          wide: true,
        },
      ];
    case "increase-decrease":
      return [
        { label: "Starting number", value: fmt(r.base) },
        { label: r.direction === "increase" ? "Amount added" : "Amount removed", value: fmt(r.amount) },
      ];
    default:
      return [];
  }
}

export function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>("percent-of");
  const [direction, setDirection] = useState<PercentageDirection>("increase");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<PercentageField, React.RefObject<HTMLInputElement | null>> = {
    a: useRef<HTMLInputElement>(null),
    b: useRef<HTMLInputElement>(null),
  };

  const config = MODES[mode];
  const calc = submitted ? calculatePercentage(mode, a, b, { direction }) : null;
  const errorFor = (field: PercentageField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(mode, error) : undefined;
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
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setMode("percent-of");
    setDirection("increase");
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
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate">
        <SegmentedControl
          name="percentage-mode"
          legend="What do you want to find?"
          options={MODE_OPTIONS}
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
              legend="Increase or decrease?"
              options={DIRECTION_OPTIONS}
              value={direction}
              onChange={setDirection}
            />
          </div>
        )}
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? summarize(result).sentence : ""}
        result={result && <PercentageResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your answer will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–</p>}
          >
            {calc
              ? "Fix the highlighted fields above and the answer will show here."
              : "Choose what to find, enter two numbers, then select Calculate."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function PercentageResultView({ result: r }: { result: PercentageResult }) {
  const summary = summarize(r);
  const stats = extraStats(r);

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
          Worked out as: <span className="font-medium text-slate-800">{summary.working}</span>
        </p>
        {r.mode === "increase-decrease" && r.decreaseOverHundred && (
          <p className="mt-3 text-sm text-slate-700">
            Decreasing by more than 100% takes the number below zero, so the answer is negative.
          </p>
        )}
      </ResultPanel>

      <ResultActions
        key={`${summary.sentence}|${summary.working}`}
        text={`${summary.sentence} (${summary.working}). Calculated with HisabBD’s Percentage Calculator.`}
        shareTitle="Percentage calculated with HisabBD"
      />
    </div>
  );
}

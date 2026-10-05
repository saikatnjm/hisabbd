"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FormField, Input } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { formatNumber, formatPlainDate, joinList, pluralize, weekdayName } from "@/lib/format";
import { dayOfWeek } from "@/lib/plain-date";
import { useToday } from "@/lib/use-today";
import {
  calculateDateDifference,
  type DateDifferenceError,
  type DateDifferenceField,
  type DateDifferenceResult,
} from "./logic";

const FIELD_IDS: Record<DateDifferenceField, string> = {
  startDate: "date-diff-start",
  endDate: "date-diff-end",
};

function errorMessage(error: DateDifferenceError): string {
  if (error.code === "missing") {
    return error.field === "startDate"
      ? "Enter a full start date: day, month and year."
      : "Enter a full end date: day, month and year.";
  }
  return "This isn’t a real date. Check the day, month and 4-digit year.";
}

/** "1 year, 2 months and 3 days", leaving out zero units (but never empty). */
function breakdownText(r: DateDifferenceResult): string {
  const parts = [
    r.years > 0 ? pluralize(r.years, "year") : "",
    r.months > 0 ? pluralize(r.months, "month") : "",
    r.days > 0 ? pluralize(r.days, "day") : "",
  ].filter(Boolean);
  return parts.length > 0 ? joinList(parts) : "0 days";
}

function shareText(r: DateDifferenceResult): string {
  return (
    `From ${formatPlainDate(r.start)} to ${formatPlainDate(r.end)}` +
    `${r.includeEndDate ? " (end date included)" : ""}: ${pluralize(r.totalDays, "day")}, ` +
    `or ${breakdownText(r)}. Calculated with HisabBD’s Date Difference Calculator.`
  );
}

export function DateDifferenceCalculator() {
  const today = useToday();
  const [startDate, setStartDate] = useState("");
  /** null = follow today's date. */
  const [endDateInput, setEndDateInput] = useState<string | null>(null);
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const endDate = endDateInput ?? today;
  const calc = submitted ? calculateDateDifference(startDate, endDate, { includeEndDate }) : null;
  const errorFor = (field: DateDifferenceField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateDateDifference(startDate, endDate, { includeEndDate });
    if (check.ok) setRevealCount((n) => n + 1);
    else (check.errors[0]?.field === "endDate" ? endRef : startRef).current?.focus();
  }

  function onReset() {
    setStartDate("");
    setEndDateInput(null);
    setIncludeEndDate(false);
    setSubmitted(false);
    setRevealCount(0);
    startRef.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate difference">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.startDate} label="Start date" error={errorFor("startDate")}>
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
            label="End date"
            hint="Today by default."
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
            onChange={(event) => setIncludeEndDate(event.target.checked)}
            aria-describedby="date-diff-include-hint"
            className="mt-0.5 size-5 shrink-0 accent-brand-600"
          />
          <span>
            <span className="block font-medium text-slate-900">Include the end date</span>
            <span id="date-diff-include-hint" className="block text-sm text-slate-600">
              Counts both the first and the last day, e.g. for leave or event days (adds 1 day).
            </span>
          </span>
        </label>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? `${pluralize(result.totalDays, "day")}, or ${breakdownText(result)}.` : ""}
        result={result && <DateDifferenceResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "The difference will appear here"}
            preview={
              <p className="font-display text-3xl font-bold tracking-tight">
                – <span className="text-lg">days</span>
              </p>
            }
          >
            {calc
              ? "Fix the highlighted date above and the result will show here."
              : "Pick a start date and an end date, then select Calculate difference."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function DateDifferenceResultView({ result: r }: { result: DateDifferenceResult }) {
  const stats = [
    {
      label: "Total weeks",
      value:
        pluralize(r.totalWeeks, "week") +
        (r.remainingDaysAfterWeeks > 0 ? ` and ${pluralize(r.remainingDaysAfterWeeks, "day")}` : ""),
    },
    { label: "Total months", value: pluralize(r.totalMonths, "complete month") },
    {
      label: "Excluding Fridays and Saturdays",
      value: pluralize(r.daysExcludingWeekend, "day"),
      wide: true,
    },
    { label: "Start", value: formatPlainDate(r.start, { weekday: true }), wide: true },
    { label: "End", value: formatPlainDate(r.end, { weekday: true }), wide: true },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={r.includeEndDate ? "Time between the dates (end date included)" : "Time between the dates"}
        titleId="date-diff-result-heading"
        value={
          <>
            <p>
              <span className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
                {formatNumber(r.totalDays)}
              </span>{" "}
              <span className="text-xl font-semibold text-slate-700">{r.totalDays === 1 ? "day" : "days"}</span>
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{breakdownText(r)}</p>
          </>
        }
      >
        {r.swapped && (
          <p className="mb-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-slate-800">
            The end date was before the start date, so the dates were swapped.
          </p>
        )}
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">
          Public holidays aren’t excluded. {weekdayName(dayOfWeek(r.start))} is the first day counted.
        </p>
      </ResultPanel>
      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="Date difference from HisabBD" />
    </div>
  );
}

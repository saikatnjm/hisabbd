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
import { useToday } from "@/lib/use-today";
import { calculateAge, type AgeError, type AgeField, type AgeResult } from "./logic";

const FIELD_IDS: Record<AgeField, string> = {
  dateOfBirth: "age-date-of-birth",
  calculationDate: "age-calculation-date",
};

function errorMessage(error: AgeError): string {
  switch (error.code) {
    case "missing":
      return error.field === "dateOfBirth"
        ? "Enter a full date of birth: day, month and year."
        : "Enter the date to calculate the age on.";
    case "invalid":
      return "This isn’t a real date. Check the day, month and 4-digit year.";
    case "birth-date-in-future":
      return "Date of birth can’t be later than today.";
    case "calculation-date-before-birth":
      return "This date is before the date of birth. Choose the birth date or a later day.";
  }
}

function ageText(r: AgeResult): string {
  return joinList([pluralize(r.years, "year"), pluralize(r.months, "month"), pluralize(r.days, "day")]);
}

function shareText(r: AgeResult): string {
  return (
    `Age as of ${formatPlainDate(r.calculationDate)}: ${ageText(r)} ` +
    `(born ${formatPlainDate(r.dateOfBirth)}). ` +
    `That’s ${pluralize(r.totalDays, "day")} in total. Calculated with HisabBD’s Age Calculator.`
  );
}

export function AgeCalculator() {
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
    return error ? errorMessage(error) : undefined;
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
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate age">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.dateOfBirth} label="Date of birth" error={errorFor("dateOfBirth")}>
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
            label="Calculate age as of"
            hint="Today by default. Any past or future date works."
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
        announcement={result ? `Age: ${ageText(result)}.` : ""}
        result={result && <AgeResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your age will appear here"}
            preview={
              <p className="font-display text-3xl font-bold tracking-tight">
                – <span className="text-lg">years</span> – <span className="text-lg">months</span> –{" "}
                <span className="text-lg">days</span>
              </p>
            }
          >
            {calc
              ? "Fix the highlighted date above and the age will show here."
              : "Enter a date of birth, then select Calculate age."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function AgeResultView({ result: r }: { result: AgeResult }) {
  const units = [
    { value: r.years, label: r.years === 1 ? "year" : "years" },
    { value: r.months, label: r.months === 1 ? "month" : "months" },
    { value: r.days, label: r.days === 1 ? "day" : "days" },
  ];
  const birthday = r.nextBirthday;
  const stats = [
    { label: "Total days", value: pluralize(r.totalDays, "day") },
    {
      label: "Total weeks",
      value:
        pluralize(r.totalWeeks, "week") +
        (r.remainingDaysAfterWeeks > 0 ? ` and ${pluralize(r.remainingDaysAfterWeeks, "day")}` : ""),
    },
    { label: "Total months", value: pluralize(r.totalMonths, "complete month") },
    { label: "Born on a", value: weekdayName(r.birthWeekday) },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={`Age as of ${formatPlainDate(r.calculationDate)}`}
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
          {birthday.daysAway === 0 ? (
            <>
              <strong>Birthday on this date:</strong> turning {birthday.turningAge}. Happy birthday!
            </>
          ) : (
            <>
              <strong>Next birthday</strong> in {pluralize(birthday.daysAway, "day")}:{" "}
              {formatPlainDate(birthday.date, { weekday: true })} (turning {birthday.turningAge})
            </>
          )}
        </p>
        <ResultStats items={stats} className="mt-5" />
        <p className="mt-4 text-sm text-slate-600">
          Totals count from {formatPlainDate(r.dateOfBirth)} to {formatPlainDate(r.calculationDate)}.
        </p>
      </ResultPanel>

      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="Age calculated with HisabBD" />
    </div>
  );
}

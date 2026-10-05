"use client";

import { useEffect, useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { Button } from "@/components/ui/button";
import { AffixInput, FieldMessage, FormField, Input, Select, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { formatPercent, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { DEDUCTION_PRESET_NAMES } from "./deduction-presets";
import {
  calculateSalary,
  MAX_SALARY,
  type DeductionInput,
  type DeductionType,
  type SalaryError,
  type SalaryPeriod,
  type SalaryResult,
} from "./logic";

const GROSS_ID = "salary-gross";
const ADD_BUTTON_ID = "salary-add-deduction";
const TOTAL_ERROR_ID = "salary-deductions-error";

const PERIODS: readonly { value: SalaryPeriod; label: string }[] = [
  { value: "month", label: "per month" },
  { value: "year", label: "per year" },
];

const rowId = (id: number, part: "name" | "type" | "value") => `salary-deduction-${id}-${part}`;

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

function percent(value: number): string {
  return formatPercent(value, { decimals: 2 });
}

function deductionErrorMessage(error: Extract<SalaryError, { field: "deduction" }>, type: DeductionType): string {
  return numberErrorMessage(error.code, {
    label: type === "percent" ? "deduction percentage" : "deduction amount",
    min: type === "percent" ? "0% or more" : "৳0 or more",
    max: type === "percent" ? "100% or less" : `${formatTaka(MAX_SALARY)} or less`,
  });
}

function lineLabel(name: string, index: number): string {
  return name || `Deduction ${index + 1}`;
}

function shareText(r: SalaryResult): string {
  return (
    `Gross salary ${money(r.monthlyGross)} per month, deductions ${money(r.monthlyDeductions)}: ` +
    `estimated net ${money(r.monthlyNet)} per month (${money(r.annualNet)} per year, 12 equal months). ` +
    `Calculated with HisabBD’s Salary Calculator.`
  );
}

export function SalaryCalculator() {
  const [gross, setGross] = useState("");
  const [period, setPeriod] = useState<SalaryPeriod>("month");
  const [rows, setRows] = useState<DeductionInput[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const nextId = useRef(1);
  const pendingFocus = useRef<string | null>(null);
  const grossRef = useRef<HTMLInputElement>(null);

  /* Move focus to a control that only exists after the next render (a new row). */
  useEffect(() => {
    const target = pendingFocus.current;
    if (target) {
      pendingFocus.current = null;
      document.getElementById(target)?.focus();
    }
  }, [rows]);

  const calc = submitted ? calculateSalary({ gross, period, deductions: rows }) : null;
  const errors = calc && !calc.ok ? calc.errors : [];
  const grossError = errors.find((e) => e.field === "gross");
  const totalError = errors.find((e) => e.field === "total");
  const result = calc?.ok ? calc.result : null;

  function rowError(row: DeductionInput): string | undefined {
    const error = errors.find((e) => e.field === "deduction" && e.id === row.id);
    return error && error.field === "deduction" ? deductionErrorMessage(error, row.type) : undefined;
  }

  function addRow(name: string) {
    const id = nextId.current++;
    pendingFocus.current = rowId(id, name ? "value" : "name");
    setRows((current) => [...current, { id, name, type: "percent", value: "" }]);
  }

  function updateRow(id: number, patch: Partial<Omit<DeductionInput, "id">>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: number) {
    pendingFocus.current = ADD_BUTTON_ID;
    setRows((current) => current.filter((row) => row.id !== id));
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateSalary({ gross, period, deductions: rows });
    if (check.ok) {
      setRevealCount((n) => n + 1);
      return;
    }
    const first = check.errors[0];
    if (!first) return;
    if (first.field === "gross") grossRef.current?.focus();
    else if (first.field === "deduction") document.getElementById(rowId(first.id, "value"))?.focus();
    else {
      const firstRow = rows.find((row) => row.name.trim() !== "" || row.value.trim() !== "");
      (firstRow ? document.getElementById(rowId(firstRow.id, "value")) : document.getElementById(ADD_BUTTON_ID))?.focus();
    }
  }

  function onReset() {
    setGross("");
    setPeriod("month");
    setRows([]);
    setSubmitted(false);
    setRevealCount(0);
    grossRef.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate net salary">
        <div className="space-y-4 sm:max-w-[calc(50%-0.75rem)]">
          <SegmentedControl
            name="salary-period"
            legend="Gross salary is"
            options={PERIODS}
            value={period}
            onChange={setPeriod}
          />
          <FormField
            id={GROSS_ID}
            label="Gross salary"
            hint="Your pay before any deductions."
            error={grossError ? numberErrorMessage(grossError.code, {
              label: "gross salary",
              min: "more than ৳0",
              max: `${formatTaka(MAX_SALARY)} or less`,
            }) : undefined}
          >
            {(control) => (
              <AffixInput
                {...control}
                ref={grossRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder="e.g. 50,000"
                value={gross}
                onChange={(event) => setGross(event.target.value)}
              />
            )}
          </FormField>
        </div>

        <fieldset className="mt-8">
          <legend className="font-display text-lg font-semibold text-slate-900">Deductions (optional)</legend>
          <p className="mt-1 text-sm text-slate-600">
            Enter what is taken from your pay, for example from your payslip. Nothing is added automatically.
          </p>

          {rows.length > 0 && (
            <ul className="mt-4 space-y-4">
              {rows.map((row, index) => {
                const error = rowError(row);
                return (
                  <li key={row.id}>
                    <fieldset className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <legend className="px-1 text-sm font-semibold text-slate-700">Deduction {index + 1}</legend>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <FormField id={rowId(row.id, "name")} label="Name (optional)">
                          {(control) => (
                            <Input
                              {...control}
                              type="text"
                              autoComplete="off"
                              maxLength={60}
                              placeholder="e.g. Provident fund"
                              value={row.name}
                              onChange={(event) => updateRow(row.id, { name: event.target.value })}
                            />
                          )}
                        </FormField>
                        <FormField id={rowId(row.id, "type")} label="Type">
                          {(control) => (
                            <Select
                              {...control}
                              value={row.type}
                              onChange={(event) =>
                                updateRow(row.id, { type: event.target.value === "fixed" ? "fixed" : "percent" })
                              }
                            >
                              <option value="percent">% of gross</option>
                              <option value="fixed">Fixed amount per month</option>
                            </Select>
                          )}
                        </FormField>
                        <FormField id={rowId(row.id, "value")} label={row.type === "percent" ? "Percentage" : "Amount per month"} error={error}>
                          {(control) => (
                            <AffixInput
                              {...control}
                              aria-describedby={
                                [control["aria-describedby"], totalError && TOTAL_ERROR_ID].filter(Boolean).join(" ") ||
                                undefined
                              }
                              type="text"
                              inputMode="decimal"
                              autoComplete="off"
                              prefix={row.type === "fixed" ? "৳" : undefined}
                              suffix={row.type === "percent" ? "%" : undefined}
                              placeholder={row.type === "percent" ? "e.g. 10" : "e.g. 1,500"}
                              value={row.value}
                              onChange={(event) => updateRow(row.id, { value: event.target.value })}
                            />
                          )}
                        </FormField>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          aria-label={`Remove deduction ${index + 1}${row.name.trim() ? `: ${row.name.trim()}` : ""}`}
                          onClick={() => removeRow(row.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </fieldset>
                  </li>
                );
              })}
            </ul>
          )}

          {totalError && (
            <div className="mt-3">
              <FieldMessage id={TOTAL_ERROR_ID} error>
                Your deductions add up to more than the gross salary. Reduce a percentage or amount, or remove a
                deduction.
              </FieldMessage>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button id={ADD_BUTTON_ID} variant="secondary" onClick={() => addRow("")}>
              Add deduction
            </Button>
            <span className="text-sm text-slate-600">or quickly add:</span>
            {DEDUCTION_PRESET_NAMES.map((name) => (
              <Button key={name} variant="ghost" className="border border-slate-300" onClick={() => addRow(name)}>
                + {name}
              </Button>
            ))}
          </div>
        </fieldset>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result
            ? `Estimated net salary ${money(result.monthlyNet)} per month. Total deductions ${money(result.monthlyDeductions)}.`
            : ""
        }
        result={result && <SalaryResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your net salary will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc
              ? "Fix the highlighted fields above and your net salary will show here."
              : "Enter your gross salary and any deductions, then select Calculate net salary."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function SalaryResultView({ result: r }: { result: SalaryResult }) {
  const stats = [
    { label: "Monthly gross", value: money(r.monthlyGross) },
    {
      label: "Total monthly deductions",
      value: `${money(r.monthlyDeductions)} (${percent(r.deductionsPercentOfGross)} of gross)`,
    },
    { label: "Annual gross", value: money(r.annualGross) },
    { label: "Annual deductions", value: money(r.annualDeductions) },
    { label: "Annual net", value: money(r.annualNet), wide: true },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title="Estimated net salary per month"
        titleId="salary-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(r.monthlyNet)}</p>}
      >
        <ResultStats items={stats} />

        <div className="mt-5">
          <h3 className="text-sm font-medium text-slate-800">Monthly deductions</h3>
          {r.lines.length === 0 ? (
            <p className="mt-1 text-sm text-slate-600">No deductions were entered, so net equals gross.</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-200 rounded-xl bg-white/70 px-4">
              {r.lines.map((line, index) => (
                <li key={line.id} className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
                  <span>
                    <span className="font-medium text-slate-900">{lineLabel(line.name, index)}</span>{" "}
                    <span className="text-sm text-slate-600">
                      {line.type === "percent" ? `${percent(line.value)} of gross` : "fixed amount"}
                    </span>
                  </span>
                  <span className="font-semibold text-slate-900">{money(line.monthlyAmount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Yearly figures are monthly × 12 (12 equal months); festival bonuses are not included. Tax and other
          deductions are only what you entered.
        </p>
      </ResultPanel>

      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="Salary calculated with HisabBD" />
    </div>
  );
}

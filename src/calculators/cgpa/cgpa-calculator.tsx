"use client";

import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FieldMessage, Input, Label, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { useRowList } from "@/calculators/education/use-row-list";
import { formatNumber } from "@/lib/format";
import {
  calculateCgpa,
  MAX_TERM_CREDITS,
  MAX_TERMS,
  type CgpaError,
  type CgpaField,
  type CgpaResult,
  type ScaleMax,
  type TermRowInput,
} from "./logic";

const INITIAL_ROWS = 2;
const SCALE_OPTIONS = [
  { value: "4", label: "4.00 scale" },
  { value: "5", label: "5.00 scale" },
] as const;

const fieldId = (rowId: number, field: "name" | "gpa" | "credits") => `cgpa-term-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "name");
const createRow = (id: number): TermRowInput => ({ id, name: "", gpa: "", credits: "" });

const cgpaText = (value: number) => formatNumber(value, { decimals: 2, minDecimals: 2 });
const scaleText = (scale: ScaleMax) => formatNumber(scale, { minDecimals: 2 });

function errorMessage(error: CgpaError, termNumber: number, scale: ScaleMax): string {
  if (error.code === "no-terms") return "Enter at least one semester with a GPA and credits.";
  if (error.code === "too-many") return `You can add up to ${MAX_TERMS} semesters.`;
  switch (error.field) {
    case "gpa":
      return numberErrorMessage(error.code, {
        label: `GPA for semester ${termNumber}`,
        min: "0 or more",
        max: `${scaleText(scale)} or less`,
      });
    case "credits":
      return numberErrorMessage(error.code, {
        label: `credits for semester ${termNumber}`,
        min: "more than 0",
        max: `${MAX_TERM_CREDITS} or less`,
      });
    case "rows":
      return "Enter at least one semester with a GPA and credits.";
  }
}

function shareText(r: CgpaResult, scale: ScaleMax): string {
  return (
    `CGPA ${cgpaText(r.cgpa)} (out of ${scaleText(scale)}) from ${formatNumber(r.termCount)} ` +
    `${r.termCount === 1 ? "semester" : "semesters"} and ${formatNumber(r.totalCredits)} credits. ` +
    "Calculated with HisabBD’s CGPA Calculator."
  );
}

export function CgpaCalculator() {
  const list = useRowList<TermRowInput>({
    createRow,
    initialCount: INITIAL_ROWS,
    maxRows: MAX_TERMS,
    focusTargetId: firstFieldId,
  });
  const { rows } = list;
  const [scaleValue, setScaleValue] = useState<"4" | "5">("4");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const scale: ScaleMax = scaleValue === "5" ? 5 : 4;

  const calc = submitted ? calculateCgpa(rows, scale) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const errorFor = (rowId: number, field: CgpaField, termNumber: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(error, termNumber, scale) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateCgpa(rows, scale);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      return;
    }
    const first = check.errors[0];
    if (!first) return;
    const targetRow = first.rowId ?? rows[0]?.id;
    if (targetRow === undefined) return;
    document.getElementById(fieldId(targetRow, first.field === "credits" ? "credits" : "gpa"))?.focus();
  }

  function onReset() {
    list.resetRows();
    setScaleValue("4");
    setSubmitted(false);
    setRevealCount(0);
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate CGPA">
        <SegmentedControl
          name="cgpa-scale"
          legend="Grading scale"
          options={SCALE_OPTIONS}
          value={scaleValue}
          onChange={setScaleValue}
        />
        <p className="mt-3 mb-4 text-sm text-slate-600">
          Enter each semester’s GPA and the credits you completed in it. Leave unused rows empty.
        </p>

        <ul className="space-y-3" aria-label="Semesters">
          {rows.map((row, index) => {
            const n = index + 1;
            const gpaError = errorFor(row.id, "gpa", n);
            const creditsError = errorFor(row.id, "credits", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">Semester {n}</p>
                  <RemoveRowButton
                    label={`Remove semester ${n}`}
                    disabled={!list.canRemove}
                    onClick={() => list.removeRow(row.id)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_9rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">Semester {n} </span>Name (optional)
                    </Label>
                    <Input
                      id={fieldId(row.id, "name")}
                      type="text"
                      autoComplete="off"
                      maxLength={60}
                      placeholder={`Semester ${n}`}
                      value={row.name}
                      onChange={(event) => list.updateRow(row.id, { name: event.target.value })}
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "gpa")}>
                      <span className="sr-only">Semester {n} </span>GPA
                    </Label>
                    <Input
                      id={fieldId(row.id, "gpa")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder={scale === 5 ? "e.g. 4.50" : "e.g. 3.50"}
                      value={row.gpa}
                      aria-invalid={gpaError ? true : undefined}
                      aria-describedby={gpaError ? `${fieldId(row.id, "gpa")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { gpa: event.target.value })}
                    />
                    {gpaError && (
                      <FieldMessage id={`${fieldId(row.id, "gpa")}-error`} error>
                        {gpaError}
                      </FieldMessage>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "credits")}>
                      <span className="sr-only">Semester {n} </span>Credits
                    </Label>
                    <Input
                      id={fieldId(row.id, "credits")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 15"
                      value={row.credits}
                      aria-invalid={creditsError ? true : undefined}
                      aria-describedby={creditsError ? `${fieldId(row.id, "credits")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { credits: event.target.value })}
                    />
                    {creditsError && (
                      <FieldMessage id={`${fieldId(row.id, "credits")}-error`} error>
                        {creditsError}
                      </FieldMessage>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {listError && (
          <div className="mt-3">
            <FieldMessage id="cgpa-rows-error" error>
              {errorMessage(listError, 0, scale)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton
          label="Add semester"
          limitMessage={`You can add up to ${MAX_TERMS} semesters.`}
          disabled={!list.canAdd}
          onClick={list.addRow}
        />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? `Your CGPA is ${cgpaText(result.cgpa)} out of ${scaleText(scale)}.` : ""}
        result={result && <CgpaResultView result={result} scale={scale} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your CGPA will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–.––</p>}
          >
            {calc
              ? "Fix the highlighted fields above and your CGPA will show here."
              : "Enter each semester’s GPA and credits, then select Calculate CGPA."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function CgpaResultView({ result: r, scale }: { result: CgpaResult; scale: ScaleMax }) {
  const stats = [
    { label: "Total credits", value: formatNumber(r.totalCredits) },
    { label: "Semesters counted", value: formatNumber(r.termCount) },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={`Your CGPA (out of ${scaleText(scale)})`}
        titleId="cgpa-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{cgpaText(r.cgpa)}</p>}
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">
          Rounded to 2 decimals (half up). Some universities truncate instead, so your official CGPA may differ in
          the second decimal.
        </p>
      </ResultPanel>

      <ResultActions key={shareText(r, scale)} text={shareText(r, scale)} shareTitle="CGPA calculated with HisabBD" />
    </div>
  );
}

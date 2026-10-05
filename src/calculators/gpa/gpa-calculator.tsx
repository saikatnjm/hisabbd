"use client";

import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FieldMessage, Input, Label, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { DEFAULT_GRADING_SCALE } from "@/calculators/education/grading-scales";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { useRowList } from "@/calculators/education/use-row-list";
import { formatNumber } from "@/lib/format";
import {
  calculateGpa,
  MAX_COURSE_CREDITS,
  MAX_COURSES,
  type CourseRowInput,
  type GpaError,
  type GpaField,
  type GpaResult,
} from "./logic";

const SCALE = DEFAULT_GRADING_SCALE;
const INITIAL_ROWS = 3;

const fieldId = (rowId: number, field: "name" | "grade" | "credits") => `gpa-course-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "name");
const createRow = (id: number): CourseRowInput => ({ id, name: "", grade: "", credits: "" });

const gpaText = (value: number) => formatNumber(value, { decimals: 2, minDecimals: 2 });

function errorMessage(error: GpaError, courseNumber: number): string {
  switch (error.field) {
    case "grade":
      return error.code === "missing" ? `Choose a grade for course ${courseNumber}.` : `Choose one of the listed grades for course ${courseNumber}.`;
    case "credits":
      if (error.code === "no-courses" || error.code === "too-many") return "";
      return numberErrorMessage(error.code, {
        label: `credits for course ${courseNumber}`,
        min: "more than 0",
        max: `${MAX_COURSE_CREDITS} or less`,
      });
    case "rows":
      return error.code === "too-many"
        ? `You can add up to ${MAX_COURSES} courses.`
        : "Enter at least one course with a grade and credits.";
  }
}

function shareText(r: GpaResult): string {
  return (
    `GPA ${gpaText(r.gpa)} from ${formatNumber(r.courseCount)} ${r.courseCount === 1 ? "course" : "courses"} ` +
    `(${formatNumber(r.totalCredits)} credits, ${formatNumber(r.totalGradePoints)} grade points) on the Bangladesh UGC 4.00 scale. ` +
    "Calculated with HisabBD’s GPA Calculator."
  );
}

export function GpaCalculator() {
  const list = useRowList<CourseRowInput>({
    createRow,
    initialCount: INITIAL_ROWS,
    maxRows: MAX_COURSES,
    focusTargetId: firstFieldId,
  });
  const { rows } = list;
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  const calc = submitted ? calculateGpa(rows, SCALE) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const errorFor = (rowId: number, field: GpaField, courseNumber: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(error, courseNumber) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateGpa(rows, SCALE);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      return;
    }
    const first = check.errors[0];
    if (!first) return;
    const targetRow = first.rowId ?? rows[0]?.id;
    if (targetRow === undefined) return;
    const target = first.field === "credits" ? "credits" : "grade";
    document.getElementById(fieldId(targetRow, target))?.focus();
  }

  function onReset() {
    list.resetRows();
    setSubmitted(false);
    setRevealCount(0);
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate GPA">
        <p className="mb-4 text-sm text-slate-600">
          Grades follow the {SCALE.name}. Leave unused rows empty. An F counts as 0 points.
        </p>
        <ul className="space-y-3" aria-label="Courses">
          {rows.map((row, index) => {
            const n = index + 1;
            const gradeError = errorFor(row.id, "grade", n);
            const creditsError = errorFor(row.id, "credits", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">Course {n}</p>
                  <RemoveRowButton
                    label={`Remove course ${n}`}
                    disabled={!list.canRemove}
                    onClick={() => list.removeRow(row.id)}
                  />
                </div>
                <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_11rem_8rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">Course {n} </span>Name (optional)
                    </Label>
                    <Input
                      id={fieldId(row.id, "name")}
                      type="text"
                      autoComplete="off"
                      maxLength={60}
                      placeholder={`e.g. Course ${n}`}
                      value={row.name}
                      onChange={(event) => list.updateRow(row.id, { name: event.target.value })}
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "grade")}>
                      <span className="sr-only">Course {n} </span>Grade
                    </Label>
                    <Select
                      id={fieldId(row.id, "grade")}
                      value={row.grade}
                      aria-invalid={gradeError ? true : undefined}
                      aria-describedby={gradeError ? `${fieldId(row.id, "grade")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { grade: event.target.value })}
                    >
                      <option value="">Select</option>
                      {SCALE.grades.map((g) => (
                        <option key={g.letter} value={g.letter}>
                          {g.letter} ({formatNumber(g.point, { minDecimals: 2 })})
                        </option>
                      ))}
                    </Select>
                    {gradeError && (
                      <FieldMessage id={`${fieldId(row.id, "grade")}-error`} error>
                        {gradeError}
                      </FieldMessage>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "credits")}>
                      <span className="sr-only">Course {n} </span>Credits
                    </Label>
                    <Input
                      id={fieldId(row.id, "credits")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 3"
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
            <FieldMessage id="gpa-rows-error" error>
              {errorMessage(listError, 0)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton
          label="Add course"
          limitMessage={`You can add up to ${MAX_COURSES} courses.`}
          disabled={!list.canAdd}
          onClick={list.addRow}
        />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? `Your GPA is ${gpaText(result.gpa)}.` : ""}
        result={result && <GpaResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your GPA will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–.––</p>}
          >
            {calc
              ? "Fix the highlighted fields above and your GPA will show here."
              : "Choose a grade and enter the credits for each course, then select Calculate GPA."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function GpaResultView({ result: r }: { result: GpaResult }) {
  const stats = [
    { label: "Total credits", value: formatNumber(r.totalCredits) },
    { label: "Total grade points", value: formatNumber(r.totalGradePoints) },
    { label: "Courses counted", value: formatNumber(r.courseCount) },
    { label: "Scale", value: "4.00 (UGC uniform)" },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title="Your GPA"
        titleId="gpa-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{gpaText(r.gpa)}</p>}
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">
          Rounded to 2 decimals (half up). Some universities truncate instead, so your official GPA may differ in the
          second decimal.
        </p>
      </ResultPanel>

      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="GPA calculated with HisabBD" />
    </div>
  );
}

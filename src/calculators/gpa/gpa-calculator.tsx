"use client";

import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FieldMessage, Input, Label, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { DEFAULT_GRADING_SCALE } from "@/calculators/education/grading-scales";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { rowsFromJson, rowsToJson, useRowList } from "@/calculators/education/use-row-list";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatNumber, pluralize } from "@/lib/format";
import { useCalculationHistory } from "@/lib/use-calculation-history";
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

/** Row fields saved in the calculation history (as JSON, in this order). */
const SAVED_FIELDS = ["name", "grade", "credits"] as const;

const gpaText = (value: number) => formatNumber(value, { decimals: 2, minDecimals: 2 });

const STRINGS = {
  en: {
    submit: "Calculate GPA",
    intro: (scaleName: string) => `Grades follow the ${scaleName}. Leave unused rows empty. An F counts as 0 points.`,
    coursesLabel: "Courses",
    courseN: (n: number) => `Course ${n}`,
    removeCourse: (n: number) => `Remove course ${n}`,
    nameOptional: "Name (optional)",
    namePlaceholder: (n: number) => `e.g. Course ${n}`,
    grade: "Grade",
    select: "Select",
    credits: "Credits",
    creditsPlaceholder: "e.g. 3",
    addCourse: "Add course",
    limit: `You can add up to ${MAX_COURSES} courses.`,
    errChooseGrade: (n: number) => `Choose a grade for course ${n}.`,
    errListedGrade: (n: number) => `Choose one of the listed grades for course ${n}.`,
    errCreditsLabel: (n: number) => `credits for course ${n}`,
    errCreditsMin: "more than 0",
    errCreditsMax: `${MAX_COURSE_CREDITS} or less`,
    errNoCourses: "Enter at least one course with a grade and credits.",
    announcement: (gpa: string) => `Your GPA is ${gpa}.`,
    placeholderTitleFirst: "Your GPA will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Choose a grade and enter the credits for each course, then select Calculate GPA.",
    placeholderFix: "Fix the highlighted fields above and your GPA will show here.",
    resultTitle: "Your GPA",
    totalCredits: "Total credits",
    totalGradePoints: "Total grade points",
    coursesCounted: "Courses counted",
    scale: "Scale",
    scaleValue: "4.00 (UGC uniform)",
    roundingNote:
      "Rounded to 2 decimals (half up). Some universities truncate instead, so your official GPA may differ in the second decimal.",
    shareText: (gpa: string, courses: string, credits: string, points: string) =>
      `GPA ${gpa} from ${courses} (${credits} credits, ${points} grade points) on the Bangladesh UGC 4.00 scale. Calculated with HisabBD’s GPA Calculator.`,
    courseCount: (n: number) => pluralize(n, "course"),
    shareTitle: "GPA calculated with HisabBD",
  },
  bn: {
    submit: "জিপিএ হিসাব করুন",
    intro: (scaleName: string) => `গ্রেডগুলো ${scaleName} অনুযায়ী। অব্যবহৃত সারি ফাঁকা রাখুন। F মানে 0 পয়েন্ট।`,
    coursesLabel: "কোর্সসমূহ",
    courseN: (n: number) => `কোর্স ${n}`,
    removeCourse: (n: number) => `কোর্স ${n} সরান`,
    nameOptional: "নাম (ঐচ্ছিক)",
    namePlaceholder: (n: number) => `যেমন কোর্স ${n}`,
    grade: "গ্রেড",
    select: "বেছে নিন",
    credits: "ক্রেডিট",
    creditsPlaceholder: "যেমন 3",
    addCourse: "কোর্স যোগ করুন",
    limit: `সর্বোচ্চ ${MAX_COURSES}টি কোর্স যোগ করা যায়।`,
    errChooseGrade: (n: number) => `কোর্স ${n}-এর জন্য একটি গ্রেড বেছে নিন।`,
    errListedGrade: (n: number) => `কোর্স ${n}-এর জন্য তালিকার কোনো গ্রেড বেছে নিন।`,
    errCreditsLabel: (n: number) => `কোর্স ${n}-এর ক্রেডিট`,
    errCreditsMin: "0-র বেশি",
    errCreditsMax: `${MAX_COURSE_CREDITS} বা তার কম`,
    errNoCourses: "গ্রেড ও ক্রেডিটসহ অন্তত একটি কোর্স দিন।",
    announcement: (gpa: string) => `আপনার জিপিএ ${gpa}।`,
    placeholderTitleFirst: "আপনার জিপিএ এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "প্রতিটি কোর্সের গ্রেড বেছে নিয়ে ক্রেডিট লিখুন, তারপর “জিপিএ হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই জিপিএ এখানে দেখা যাবে।",
    resultTitle: "আপনার জিপিএ",
    totalCredits: "মোট ক্রেডিট",
    totalGradePoints: "মোট গ্রেড পয়েন্ট",
    coursesCounted: "গণনায় ধরা কোর্স",
    scale: "স্কেল",
    scaleValue: "৪.০০ (ইউজিসি অভিন্ন)",
    roundingNote:
      "২ দশমিকে রাউন্ড করা (হাফ-আপ)। কিছু বিশ্ববিদ্যালয় রাউন্ড না করে কেটে ফেলে, তাই আনুষ্ঠানিক জিপিএ দ্বিতীয় দশমিকে ভিন্ন হতে পারে।",
    shareText: (gpa: string, courses: string, credits: string, points: string) =>
      `জিপিএ ${gpa}, ${courses} থেকে (${credits} ক্রেডিট, ${points} গ্রেড পয়েন্ট), বাংলাদেশ ইউজিসি ৪.০০ স্কেলে। HisabBD-র জিপিএ ক্যালকুলেটরে হিসাব করা।`,
    courseCount: (n: number) => countBn(n, "কোর্স"),
    shareTitle: "HisabBD দিয়ে জিপিএ হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: GpaError, courseNumber: number): string {
  switch (error.field) {
    case "grade":
      return error.code === "missing" ? t.errChooseGrade(courseNumber) : t.errListedGrade(courseNumber);
    case "credits":
      if (error.code === "no-courses" || error.code === "too-many") return "";
      return numberErrorMessage(
        error.code,
        { label: t.errCreditsLabel(courseNumber), min: t.errCreditsMin, max: t.errCreditsMax },
        locale,
      );
    case "rows":
      return error.code === "too-many" ? t.limit : t.errNoCourses;
  }
}

function shareText(t: Strings, r: GpaResult): string {
  return t.shareText(
    gpaText(r.gpa),
    t.courseCount(r.courseCount),
    formatNumber(r.totalCredits),
    formatNumber(r.totalGradePoints),
  );
}

export function GpaCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const list = useRowList<CourseRowInput>({
    createRow,
    initialCount: INITIAL_ROWS,
    maxRows: MAX_COURSES,
    focusTargetId: firstFieldId,
  });
  const { rows } = list;
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();

  const calc = submitted ? calculateGpa(rows, SCALE) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const errorFor = (rowId: number, field: GpaField, courseNumber: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(t, locale, error, courseNumber) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateGpa(rows, SCALE);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ rows: rowsToJson(rows, SAVED_FIELDS) }, shareText(t, check.result));
      return;
    }
    const first = check.errors[0];
    if (!first) return;
    const targetRow = first.rowId ?? rows[0]?.id;
    if (targetRow === undefined) return;
    const target = first.field === "credits" ? "credits" : "grade";
    document.getElementById(fieldId(targetRow, target))?.focus();
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    list.replaceRows(rowsFromJson(saved.rows, SAVED_FIELDS));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    list.resetRows();
    setSubmitted(false);
    setRevealCount(0);
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <p className="mb-4 text-sm text-slate-600">
          {t.intro(locale === "bn" ? SCALE.nameBn : SCALE.name)}
        </p>
        <ul className="space-y-3" aria-label={t.coursesLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const gradeError = errorFor(row.id, "grade", n);
            const creditsError = errorFor(row.id, "credits", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.courseN(n)}</p>
                  <RemoveRowButton
                    label={t.removeCourse(n)}
                    disabled={!list.canRemove}
                    onClick={() => list.removeRow(row.id)}
                  />
                </div>
                <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_11rem_8rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">{t.courseN(n)} </span>{t.nameOptional}
                    </Label>
                    <Input
                      id={fieldId(row.id, "name")}
                      type="text"
                      autoComplete="off"
                      maxLength={60}
                      placeholder={t.namePlaceholder(n)}
                      value={row.name}
                      onChange={(event) => list.updateRow(row.id, { name: event.target.value })}
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "grade")}>
                      <span className="sr-only">{t.courseN(n)} </span>{t.grade}
                    </Label>
                    <Select
                      id={fieldId(row.id, "grade")}
                      value={row.grade}
                      aria-invalid={gradeError ? true : undefined}
                      aria-describedby={gradeError ? `${fieldId(row.id, "grade")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { grade: event.target.value })}
                    >
                      <option value="">{t.select}</option>
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
                      <span className="sr-only">{t.courseN(n)} </span>{t.credits}
                    </Label>
                    <Input
                      id={fieldId(row.id, "credits")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder={t.creditsPlaceholder}
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
              {errorMessage(t, locale, listError, 0)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton
          label={t.addCourse}
          limitMessage={t.limit}
          disabled={!list.canAdd}
          onClick={list.addRow}
        />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(gpaText(result.gpa)) : ""}
        result={result && <GpaResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–.––</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function GpaResultView({ result: r }: { result: GpaResult }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.totalCredits, value: formatNumber(r.totalCredits) },
    { label: t.totalGradePoints, value: formatNumber(r.totalGradePoints) },
    { label: t.coursesCounted, value: formatNumber(r.courseCount) },
    { label: t.scale, value: t.scaleValue },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="gpa-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{gpaText(r.gpa)}</p>}
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.roundingNote}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, r)} text={shareText(t, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

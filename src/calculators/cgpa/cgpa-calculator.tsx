"use client";

import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FieldMessage, Input, Label, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { rowsFromJson, rowsToJson, useRowList } from "@/calculators/education/use-row-list";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatNumber, pluralize } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
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

const fieldId = (rowId: number, field: "name" | "gpa" | "credits") => `cgpa-term-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "name");
const createRow = (id: number): TermRowInput => ({ id, name: "", gpa: "", credits: "" });

/** The grading scale is remembered in this browser. */
const SCALE_PREF = choicePreference("cgpa-calculator", "scale", ["4", "5"] as const, "4");
/** Row fields saved in the calculation history (as JSON, in this order). */
const SAVED_FIELDS = ["name", "gpa", "credits"] as const;

const cgpaText = (value: number) => formatNumber(value, { decimals: 2, minDecimals: 2 });
const scaleText = (scale: ScaleMax) => formatNumber(scale, { minDecimals: 2 });

const STRINGS = {
  en: {
    submit: "Calculate CGPA",
    scaleLegend: "Grading scale",
    scale4: "4.00 scale",
    scale5: "5.00 scale",
    intro: "Enter each semester’s GPA and the credits you completed in it. Leave unused rows empty.",
    semestersLabel: "Semesters",
    semesterN: (n: number) => `Semester ${n}`,
    removeSemester: (n: number) => `Remove semester ${n}`,
    nameOptional: "Name (optional)",
    gpa: "GPA",
    gpaPlaceholder4: "e.g. 3.50",
    gpaPlaceholder5: "e.g. 4.50",
    credits: "Credits",
    creditsPlaceholder: "e.g. 15",
    addSemester: "Add semester",
    limit: `You can add up to ${MAX_TERMS} semesters.`,
    errNoTerms: "Enter at least one semester with a GPA and credits.",
    errGpaLabel: (n: number) => `GPA for semester ${n}`,
    errGpaMin: "0 or more",
    errMax: (max: string) => `${max} or less`,
    errCreditsLabel: (n: number) => `credits for semester ${n}`,
    errCreditsMin: "more than 0",
    errCreditsMax: `${MAX_TERM_CREDITS} or less`,
    announcement: (cgpa: string, scale: string) => `Your CGPA is ${cgpa} out of ${scale}.`,
    placeholderTitleFirst: "Your CGPA will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter each semester’s GPA and credits, then select Calculate CGPA.",
    placeholderFix: "Fix the highlighted fields above and your CGPA will show here.",
    resultTitle: (scale: string) => `Your CGPA (out of ${scale})`,
    totalCredits: "Total credits",
    semestersCounted: "Semesters counted",
    roundingNote:
      "Rounded to 2 decimals (half up). Some universities truncate instead, so your official CGPA may differ in the second decimal.",
    termCount: (n: number) => pluralize(n, "semester"),
    shareText: (cgpa: string, scale: string, terms: string, credits: string) =>
      `CGPA ${cgpa} (out of ${scale}) from ${terms} and ${credits} credits. Calculated with HisabBD’s CGPA Calculator.`,
    shareTitle: "CGPA calculated with HisabBD",
  },
  bn: {
    submit: "সিজিপিএ হিসাব করুন",
    scaleLegend: "গ্রেডিং স্কেল",
    scale4: "৪.০০ স্কেল",
    scale5: "৫.০০ স্কেল",
    intro: "প্রতিটি সেমিস্টারের জিপিএ আর সেই সেমিস্টারে সম্পন্ন ক্রেডিট লিখুন। অব্যবহৃত সারি ফাঁকা রাখুন।",
    semestersLabel: "সেমিস্টারসমূহ",
    semesterN: (n: number) => `সেমিস্টার ${n}`,
    removeSemester: (n: number) => `সেমিস্টার ${n} সরান`,
    nameOptional: "নাম (ঐচ্ছিক)",
    gpa: "জিপিএ",
    gpaPlaceholder4: "যেমন 3.50",
    gpaPlaceholder5: "যেমন 4.50",
    credits: "ক্রেডিট",
    creditsPlaceholder: "যেমন 15",
    addSemester: "সেমিস্টার যোগ করুন",
    limit: `সর্বোচ্চ ${MAX_TERMS}টি সেমিস্টার যোগ করা যায়।`,
    errNoTerms: "জিপিএ ও ক্রেডিটসহ অন্তত একটি সেমিস্টার দিন।",
    errGpaLabel: (n: number) => `সেমিস্টার ${n}-এর জিপিএ`,
    errGpaMin: "0 বা তার বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errCreditsLabel: (n: number) => `সেমিস্টার ${n}-এর ক্রেডিট`,
    errCreditsMin: "0-র বেশি",
    errCreditsMax: `${MAX_TERM_CREDITS} বা তার কম`,
    announcement: (cgpa: string, scale: string) => `আপনার সিজিপিএ ${scale}-এর মধ্যে ${cgpa}।`,
    placeholderTitleFirst: "আপনার সিজিপিএ এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "প্রতিটি সেমিস্টারের জিপিএ ও ক্রেডিট লিখে “সিজিপিএ হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই সিজিপিএ এখানে দেখা যাবে।",
    resultTitle: (scale: string) => `আপনার সিজিপিএ (${scale}-এর মধ্যে)`,
    totalCredits: "মোট ক্রেডিট",
    semestersCounted: "গণনায় ধরা সেমিস্টার",
    roundingNote:
      "২ দশমিকে রাউন্ড করা (হাফ-আপ)। কিছু বিশ্ববিদ্যালয় রাউন্ড না করে কেটে ফেলে, তাই আনুষ্ঠানিক সিজিপিএ দ্বিতীয় দশমিকে ভিন্ন হতে পারে।",
    termCount: (n: number) => countBn(n, "সেমিস্টার"),
    shareText: (cgpa: string, scale: string, terms: string, credits: string) =>
      `সিজিপিএ ${cgpa} (${scale}-এর মধ্যে), ${terms} ও ${credits} ক্রেডিট থেকে। HisabBD-র সিজিপিএ ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD দিয়ে সিজিপিএ হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: CgpaError, termNumber: number, scale: ScaleMax): string {
  if (error.code === "no-terms") return t.errNoTerms;
  if (error.code === "too-many") return t.limit;
  switch (error.field) {
    case "gpa":
      return numberErrorMessage(
        error.code,
        { label: t.errGpaLabel(termNumber), min: t.errGpaMin, max: t.errMax(scaleText(scale)) },
        locale,
      );
    case "credits":
      return numberErrorMessage(
        error.code,
        { label: t.errCreditsLabel(termNumber), min: t.errCreditsMin, max: t.errCreditsMax },
        locale,
      );
    case "rows":
      return t.errNoTerms;
  }
}

function shareText(t: Strings, r: CgpaResult, scale: ScaleMax): string {
  return t.shareText(cgpaText(r.cgpa), scaleText(scale), t.termCount(r.termCount), formatNumber(r.totalCredits));
}

export function CgpaCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const scaleOptions = [
    { value: "4", label: t.scale4 },
    { value: "5", label: t.scale5 },
  ] as const;
  const list = useRowList<TermRowInput>({
    createRow,
    initialCount: INITIAL_ROWS,
    maxRows: MAX_TERMS,
    focusTargetId: firstFieldId,
  });
  const { rows } = list;
  const [scaleValue, setScaleValue] = usePreference(SCALE_PREF);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const scale: ScaleMax = scaleValue === "5" ? 5 : 4;

  const calc = submitted ? calculateCgpa(rows, scale) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const errorFor = (rowId: number, field: CgpaField, termNumber: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(t, locale, error, termNumber, scale) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateCgpa(rows, scale);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ scale: scaleValue, rows: rowsToJson(rows, SAVED_FIELDS) }, shareText(t, check.result, scale));
      return;
    }
    const first = check.errors[0];
    if (!first) return;
    const targetRow = first.rowId ?? rows[0]?.id;
    if (targetRow === undefined) return;
    document.getElementById(fieldId(targetRow, first.field === "credits" ? "credits" : "gpa"))?.focus();
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const savedScale = saved.scale ?? "";
    if (SCALE_PREF.isValid(savedScale)) setScaleValue(savedScale);
    list.replaceRows(rowsFromJson(saved.rows, SAVED_FIELDS));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears the semesters; the remembered scale stays. */
  function onReset() {
    list.resetRows();
    setSubmitted(false);
    setRevealCount(0);
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl
          name="cgpa-scale"
          legend={t.scaleLegend}
          options={scaleOptions}
          value={scaleValue}
          onChange={setScaleValue}
        />
        <p className="mt-3 mb-4 text-sm text-slate-600">{t.intro}</p>

        <ul className="space-y-3" aria-label={t.semestersLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const gpaError = errorFor(row.id, "gpa", n);
            const creditsError = errorFor(row.id, "credits", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.semesterN(n)}</p>
                  <RemoveRowButton
                    label={t.removeSemester(n)}
                    disabled={!list.canRemove}
                    onClick={() => list.removeRow(row.id)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_9rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">{t.semesterN(n)} </span>{t.nameOptional}
                    </Label>
                    <Input
                      id={fieldId(row.id, "name")}
                      type="text"
                      autoComplete="off"
                      maxLength={60}
                      placeholder={t.semesterN(n)}
                      value={row.name}
                      onChange={(event) => list.updateRow(row.id, { name: event.target.value })}
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "gpa")}>
                      <span className="sr-only">{t.semesterN(n)} </span>{t.gpa}
                    </Label>
                    <Input
                      id={fieldId(row.id, "gpa")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder={scale === 5 ? t.gpaPlaceholder5 : t.gpaPlaceholder4}
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
                      <span className="sr-only">{t.semesterN(n)} </span>{t.credits}
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
            <FieldMessage id="cgpa-rows-error" error>
              {errorMessage(t, locale, listError, 0, scale)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton
          label={t.addSemester}
          limitMessage={t.limit}
          disabled={!list.canAdd}
          onClick={list.addRow}
        />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(cgpaText(result.cgpa), scaleText(scale)) : ""}
        result={result && <CgpaResultView result={result} scale={scale} />}
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

function CgpaResultView({ result: r, scale }: { result: CgpaResult; scale: ScaleMax }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.totalCredits, value: formatNumber(r.totalCredits) },
    { label: t.semestersCounted, value: formatNumber(r.termCount) },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(scaleText(scale))}
        titleId="cgpa-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{cgpaText(r.cgpa)}</p>}
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.roundingNote}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, r, scale)} text={shareText(t, r, scale)} shareTitle={t.shareTitle} />
    </div>
  );
}

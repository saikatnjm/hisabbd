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
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatPercent, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { DEDUCTION_PRESETS } from "./deduction-presets";
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

const STRINGS = {
  en: {
    submit: "Calculate net salary",
    periodLegend: "Gross salary is",
    perMonth: "per month",
    perYear: "per year",
    gross: "Gross salary",
    grossHint: "Your pay before any deductions.",
    grossPlaceholder: "e.g. 50,000",
    deductionsLegend: "Deductions (optional)",
    deductionsIntro: "Enter what is taken from your pay, for example from your payslip. Nothing is added automatically.",
    deductionN: (n: number) => `Deduction ${n}`,
    nameOptional: "Name (optional)",
    namePlaceholder: "e.g. Provident fund",
    type: "Type",
    percentOfGross: "% of gross",
    fixedPerMonth: "Fixed amount per month",
    percentage: "Percentage",
    amountPerMonth: "Amount per month",
    percentPlaceholder: "e.g. 10",
    amountPlaceholder: "e.g. 1,500",
    removeLabel: (n: number, name: string) => `Remove deduction ${n}${name ? `: ${name}` : ""}`,
    remove: "Remove",
    totalError:
      "Your deductions add up to more than the gross salary. Reduce a percentage or amount, or remove a deduction.",
    addDeduction: "Add deduction",
    quickAdd: "or quickly add:",
    announcement: (net: string, deductions: string) =>
      `Estimated net salary ${net} per month. Total deductions ${deductions}.`,
    placeholderTitleFirst: "Your net salary will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter your gross salary and any deductions, then select Calculate net salary.",
    placeholderFix: "Fix the highlighted fields above and your net salary will show here.",
    resultTitle: "Estimated net salary per month",
    monthlyGross: "Monthly gross",
    totalMonthlyDeductions: "Total monthly deductions",
    ofGross: (pct: string) => `(${pct} of gross)`,
    annualGross: "Annual gross",
    annualDeductions: "Annual deductions",
    annualNet: "Annual net",
    monthlyDeductionsHeading: "Monthly deductions",
    noDeductions: "No deductions were entered, so net equals gross.",
    lineLabel: (name: string, index: number) => name || `Deduction ${index + 1}`,
    linePercent: (pct: string) => `${pct} of gross`,
    lineFixed: "fixed amount",
    yearlyNote:
      "Yearly figures are monthly × 12 (12 equal months); festival bonuses are not included. Tax and other deductions are only what you entered.",
    errGrossLabel: "gross salary",
    errGrossMin: "more than ৳0",
    errMax: (max: string) => `${max} or less`,
    errPctLabel: "deduction percentage",
    errPctMin: "0% or more",
    errPctMax: "100% or less",
    errAmountLabel: "deduction amount",
    errAmountMin: "৳0 or more",
    shareText: (gross: string, deductions: string, net: string, annual: string) =>
      `Gross salary ${gross} per month, deductions ${deductions}: estimated net ${net} per month (${annual} per year, 12 equal months). Calculated with HisabBD’s Salary Calculator.`,
    shareTitle: "Salary calculated with HisabBD",
  },
  bn: {
    submit: "নিট বেতন হিসাব করুন",
    periodLegend: "গ্রস বেতন",
    perMonth: "মাসে",
    perYear: "বছরে",
    gross: "গ্রস বেতন",
    grossHint: "কোনো কর্তনের আগে আপনার বেতন।",
    grossPlaceholder: "যেমন 50,000",
    deductionsLegend: "কর্তন (ঐচ্ছিক)",
    deductionsIntro: "বেতন থেকে যা কাটা হয় তা লিখুন, যেমন আপনার পে-স্লিপ থেকে। নিজে থেকে কিছুই যোগ হয় না।",
    deductionN: (n: number) => `কর্তন ${n}`,
    nameOptional: "নাম (ঐচ্ছিক)",
    namePlaceholder: "যেমন প্রভিডেন্ট ফান্ড",
    type: "ধরন",
    percentOfGross: "গ্রসের %",
    fixedPerMonth: "মাসে নির্দিষ্ট অঙ্ক",
    percentage: "শতকরা",
    amountPerMonth: "মাসিক অঙ্ক",
    percentPlaceholder: "যেমন 10",
    amountPlaceholder: "যেমন 1,500",
    removeLabel: (n: number, name: string) => `কর্তন ${n} সরান${name ? `: ${name}` : ""}`,
    remove: "সরান",
    totalError: "কর্তনগুলোর যোগফল গ্রস বেতনের চেয়ে বেশি। কোনো শতাংশ বা অঙ্ক কমান, অথবা একটি কর্তন সরিয়ে দিন।",
    addDeduction: "কর্তন যোগ করুন",
    quickAdd: "বা দ্রুত যোগ করুন:",
    announcement: (net: string, deductions: string) => `আনুমানিক নিট বেতন মাসে ${net}। মোট কর্তন ${deductions}।`,
    placeholderTitleFirst: "আপনার নিট বেতন এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "গ্রস বেতন ও কর্তনগুলো লিখে “নিট বেতন হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই নিট বেতন এখানে দেখা যাবে।",
    resultTitle: "আনুমানিক মাসিক নিট বেতন",
    monthlyGross: "মাসিক গ্রস",
    totalMonthlyDeductions: "মোট মাসিক কর্তন",
    ofGross: (pct: string) => `(গ্রসের ${pct})`,
    annualGross: "বাৎসরিক গ্রস",
    annualDeductions: "বাৎসরিক কর্তন",
    annualNet: "বাৎসরিক নিট",
    monthlyDeductionsHeading: "মাসিক কর্তন",
    noDeductions: "কোনো কর্তন দেওয়া হয়নি, তাই নিট আর গ্রস সমান।",
    lineLabel: (name: string, index: number) => name || `কর্তন ${index + 1}`,
    linePercent: (pct: string) => `গ্রসের ${pct}`,
    lineFixed: "নির্দিষ্ট অঙ্ক",
    yearlyNote:
      "বাৎসরিক অঙ্ক = মাসিক × 12 (12টি সমান মাস); উৎসব বোনাস ধরা হয়নি। ট্যাক্সসহ সব কর্তন শুধু আপনি যা লিখেছেন, তা-ই।",
    errGrossLabel: "গ্রস বেতন",
    errGrossMin: "৳0-র বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errPctLabel: "কর্তনের শতকরা হার",
    errPctMin: "0% বা তার বেশি",
    errPctMax: "100% বা তার কম",
    errAmountLabel: "কর্তনের অঙ্ক",
    errAmountMin: "৳0 বা তার বেশি",
    shareText: (gross: string, deductions: string, net: string, annual: string) =>
      `মাসে গ্রস বেতন ${gross}, কর্তন ${deductions}: আনুমানিক নিট মাসে ${net} (বছরে ${annual}, 12টি সমান মাস)। HisabBD-র বেতন ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD দিয়ে বেতনের হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

const rowId = (id: number, part: "name" | "type" | "value") => `salary-deduction-${id}-${part}`;

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

function percent(value: number): string {
  return formatPercent(value, { decimals: 2 });
}

function deductionErrorMessage(
  t: Strings,
  locale: Locale,
  error: Extract<SalaryError, { field: "deduction" }>,
  type: DeductionType,
): string {
  return numberErrorMessage(
    error.code,
    {
      label: type === "percent" ? t.errPctLabel : t.errAmountLabel,
      min: type === "percent" ? t.errPctMin : t.errAmountMin,
      max: type === "percent" ? t.errPctMax : t.errMax(formatTaka(MAX_SALARY)),
    },
    locale,
  );
}

function shareText(t: Strings, r: SalaryResult): string {
  return t.shareText(money(r.monthlyGross), money(r.monthlyDeductions), money(r.monthlyNet), money(r.annualNet));
}

export function SalaryCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const periods: readonly { value: SalaryPeriod; label: string }[] = [
    { value: "month", label: t.perMonth },
    { value: "year", label: t.perYear },
  ];
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
    return error && error.field === "deduction" ? deductionErrorMessage(t, locale, error, row.type) : undefined;
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
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-4 sm:max-w-[calc(50%-0.75rem)]">
          <SegmentedControl
            name="salary-period"
            legend={t.periodLegend}
            options={periods}
            value={period}
            onChange={setPeriod}
          />
          <FormField
            id={GROSS_ID}
            label={t.gross}
            hint={t.grossHint}
            error={
              grossError
                ? numberErrorMessage(
                    grossError.code,
                    { label: t.errGrossLabel, min: t.errGrossMin, max: t.errMax(formatTaka(MAX_SALARY)) },
                    locale,
                  )
                : undefined
            }
          >
            {(control) => (
              <AffixInput
                {...control}
                ref={grossRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.grossPlaceholder}
                value={gross}
                onChange={(event) => setGross(event.target.value)}
              />
            )}
          </FormField>
        </div>

        <fieldset className="mt-8">
          <legend className="font-display text-lg font-semibold text-slate-900">{t.deductionsLegend}</legend>
          <p className="mt-1 text-sm text-slate-600">{t.deductionsIntro}</p>

          {rows.length > 0 && (
            <ul className="mt-4 space-y-4">
              {rows.map((row, index) => {
                const error = rowError(row);
                return (
                  <li key={row.id}>
                    <fieldset className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <legend className="px-1 text-sm font-semibold text-slate-700">{t.deductionN(index + 1)}</legend>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <FormField id={rowId(row.id, "name")} label={t.nameOptional}>
                          {(control) => (
                            <Input
                              {...control}
                              type="text"
                              autoComplete="off"
                              maxLength={60}
                              placeholder={t.namePlaceholder}
                              value={row.name}
                              onChange={(event) => updateRow(row.id, { name: event.target.value })}
                            />
                          )}
                        </FormField>
                        <FormField id={rowId(row.id, "type")} label={t.type}>
                          {(control) => (
                            <Select
                              {...control}
                              value={row.type}
                              onChange={(event) =>
                                updateRow(row.id, { type: event.target.value === "fixed" ? "fixed" : "percent" })
                              }
                            >
                              <option value="percent">{t.percentOfGross}</option>
                              <option value="fixed">{t.fixedPerMonth}</option>
                            </Select>
                          )}
                        </FormField>
                        <FormField id={rowId(row.id, "value")} label={row.type === "percent" ? t.percentage : t.amountPerMonth} error={error}>
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
                              placeholder={row.type === "percent" ? t.percentPlaceholder : t.amountPlaceholder}
                              value={row.value}
                              onChange={(event) => updateRow(row.id, { value: event.target.value })}
                            />
                          )}
                        </FormField>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          aria-label={t.removeLabel(index + 1, row.name.trim())}
                          onClick={() => removeRow(row.id)}
                        >
                          {t.remove}
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
                {t.totalError}
              </FieldMessage>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button id={ADD_BUTTON_ID} variant="secondary" onClick={() => addRow("")}>
              {t.addDeduction}
            </Button>
            <span className="text-sm text-slate-600">{t.quickAdd}</span>
            {DEDUCTION_PRESETS.map((preset) => {
              const name = locale === "bn" ? preset.nameBn : preset.name;
              return (
                <Button key={preset.name} variant="ghost" className="border border-slate-300" onClick={() => addRow(name)}>
                  + {name}
                </Button>
              );
            })}
          </div>
        </fieldset>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(money(result.monthlyNet), money(result.monthlyDeductions)) : ""}
        result={result && <SalaryResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function SalaryResultView({ result: r }: { result: SalaryResult }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.monthlyGross, value: money(r.monthlyGross) },
    {
      label: t.totalMonthlyDeductions,
      value: `${money(r.monthlyDeductions)} ${t.ofGross(percent(r.deductionsPercentOfGross))}`,
    },
    { label: t.annualGross, value: money(r.annualGross) },
    { label: t.annualDeductions, value: money(r.annualDeductions) },
    { label: t.annualNet, value: money(r.annualNet), wide: true },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="salary-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(r.monthlyNet)}</p>}
      >
        <ResultStats items={stats} />

        <div className="mt-5">
          <h3 className="text-sm font-medium text-slate-800">{t.monthlyDeductionsHeading}</h3>
          {r.lines.length === 0 ? (
            <p className="mt-1 text-sm text-slate-600">{t.noDeductions}</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-200 rounded-xl bg-white/70 px-4">
              {r.lines.map((line, index) => (
                <li key={line.id} className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
                  <span>
                    <span className="font-medium text-slate-900">{t.lineLabel(line.name, index)}</span>{" "}
                    <span className="text-sm text-slate-600">
                      {line.type === "percent" ? t.linePercent(percent(line.value)) : t.lineFixed}
                    </span>
                  </span>
                  <span className="font-semibold text-slate-900">{money(line.monthlyAmount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600">{t.yearlyNote}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, r)} text={shareText(t, r)} shareTitle={t.shareTitle} />
    </div>
  );
}

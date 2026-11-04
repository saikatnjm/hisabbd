"use client";

import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FieldMessage, Label, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { rowsFromJson, rowsToJson, useRowList } from "@/calculators/education/use-row-list";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { calculateTimeTotal, MAX_HOURS, MAX_MINUTES, MAX_ROWS, type DurationRowInput, type TimeAddError, type TimeAddResult } from "./logic";

const INITIAL_ROWS = 3;
const SAVED_FIELDS = ["op", "hours", "minutes"] as const;
type RowField = "hours" | "minutes";
const fieldId = (rowId: number, field: RowField | "op") => `time-row-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "hours");
const createRow = (id: number): DurationRowInput => ({ id, op: "add", hours: "", minutes: "" });

const STRINGS = {
  en: {
    submit: "Add up time",
    intro: "Enter each time as hours and minutes. Choose − to subtract a row. Leave unused rows blank.",
    rowsLabel: "Times",
    timeN: (n: number) => `Time ${n}`,
    op: "Add or subtract",
    add: "+ Add",
    subtract: "− Subtract",
    hours: "Hours",
    minutes: "Minutes",
    hourUnit: "h",
    minuteUnit: "min",
    removeRow: (n: number) => `Remove time ${n}`,
    addRow: "Add time",
    limit: `Up to ${MAX_ROWS} times.`,
    errHours: (n: number) => `hours for time ${n}`,
    errMinutes: (n: number) => `minutes for time ${n}`,
    errMin: "0 or more",
    errMaxHours: `${formatNumber(MAX_HOURS)} or less`,
    errMaxMinutes: `${formatNumber(MAX_MINUTES)} or less`,
    errNoRows: "Enter at least one time.",
    errTooMany: `Enter up to ${MAX_ROWS} times.`,
    duration: (neg: boolean, h: number, m: number) => `${neg ? "−" : ""}${formatNumber(h)} h ${m} min`,
    resultTitle: "Total time",
    decimal: "Decimal hours",
    totalMinutes: "In minutes",
    inDays: "In days",
    days: (d: number, h: number, m: number) => `${d} ${d === 1 ? "day" : "days"} ${h} h ${m} min`,
    negativeNote: "More time was subtracted than added, so the total is negative.",
    announcement: (total: string) => `Total ${total}.`,
    placeholderTitleFirst: "The total will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter hours and minutes, then select Add up time.",
    placeholderFix: "Fix the highlighted fields above and the total will show here.",
    shareTitle: "Time total from HisabBD",
    shareText: (total: string, decimal: string) => `Total ${total} (${decimal} hours).\nAdded up with HisabBD’s Time Calculator.`,
  },
  bn: {
    submit: "সময় যোগ করুন",
    intro: "প্রতিটি সময় ঘণ্টা ও মিনিটে লিখুন। কোনো সারি বাদ দিতে − বেছে নিন। অপ্রয়োজনীয় সারি ফাঁকা রাখুন।",
    rowsLabel: "সময়গুলো",
    timeN: (n: number) => `সময় ${n}`,
    op: "যোগ না বিয়োগ",
    add: "+ যোগ",
    subtract: "− বিয়োগ",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    hourUnit: "ঘণ্টা",
    minuteUnit: "মিনিট",
    removeRow: (n: number) => `সময় ${n} বাদ দিন`,
    addRow: "আরেকটি সময় যোগ",
    limit: `সর্বোচ্চ ${MAX_ROWS}টি সময়।`,
    errHours: (n: number) => `সময় ${n}-এর ঘণ্টা`,
    errMinutes: (n: number) => `সময় ${n}-এর মিনিট`,
    errMin: "0 বা তার বেশি",
    errMaxHours: `${formatNumber(MAX_HOURS)} বা তার কম`,
    errMaxMinutes: `${formatNumber(MAX_MINUTES)} বা তার কম`,
    errNoRows: "অন্তত একটি সময় লিখুন।",
    errTooMany: `সর্বোচ্চ ${MAX_ROWS}টি সময় লিখুন।`,
    duration: (neg: boolean, h: number, m: number) => `${neg ? "−" : ""}${formatNumber(h)} ঘণ্টা ${m} মিনিট`,
    resultTitle: "মোট সময়",
    decimal: "দশমিক ঘণ্টা",
    totalMinutes: "মিনিটে",
    inDays: "দিনে",
    days: (d: number, h: number, m: number) => `${d} দিন ${h} ঘণ্টা ${m} মিনিট`,
    negativeNote: "যোগের চেয়ে বিয়োগ বেশি হয়েছে, তাই মোট সময় ঋণাত্মক।",
    announcement: (total: string) => `মোট ${total}।`,
    placeholderTitleFirst: "মোট সময় এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "ঘণ্টা ও মিনিট লিখে “সময় যোগ করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই মোট সময় এখানে দেখা যাবে।",
    shareTitle: "HisabBD-র সময়ের হিসাব",
    shareText: (total: string, decimal: string) => `মোট ${total} (${decimal} ঘণ্টা)।\nHisabBD-র সময় ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: TimeAddError, n: number): string {
  if (error.code === "no-rows") return t.errNoRows;
  if (error.code === "too-many") return t.errTooMany;
  return error.field === "hours"
    ? numberErrorMessage(error.code, { label: t.errHours(n), min: t.errMin, max: t.errMaxHours }, locale)
    : numberErrorMessage(error.code, { label: t.errMinutes(n), min: t.errMin, max: t.errMaxMinutes }, locale);
}

const totalText = (t: Strings, r: TimeAddResult) => t.duration(r.negative, r.hours, r.minutes);
const shareText = (t: Strings, r: TimeAddResult) => t.shareText(totalText(t, r), `${r.negative ? "−" : ""}${formatNumber(r.decimalHours)}`);

export function TimeAddCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const list = useRowList<DurationRowInput>({ createRow, initialCount: INITIAL_ROWS, maxRows: MAX_ROWS, focusTargetId: firstFieldId });
  const { rows } = list;
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();

  const calc = submitted ? calculateTimeTotal(rows) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const fieldError = (rowId: number, field: RowField, n: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(t, locale, error, n) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateTimeTotal(rows);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ rows: rowsToJson(rows, SAVED_FIELDS) }, shareText(t, check.result));
      return;
    }
    const first = check.errors[0];
    const target = first?.rowId ?? rows[0]?.id;
    const field = first && first.field !== "rows" ? first.field : "hours";
    if (target !== undefined) document.getElementById(fieldId(target, field))?.focus();
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
        <p className="mb-4 text-sm text-slate-600">{t.intro}</p>
        <ul className="space-y-3" aria-label={t.rowsLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const numberField = (field: RowField, label: string, unit: string) => {
              const id = fieldId(row.id, field);
              const error = fieldError(row.id, field, n);
              return (
                <div className="min-w-0">
                  <Label htmlFor={id}>
                    <span className="sr-only">{t.timeN(n)} </span>
                    {label}
                  </Label>
                  <AffixInput
                    id={id}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    suffix={unit}
                    value={row[field]}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    onChange={(event) => list.updateRow(row.id, { [field]: event.target.value })}
                  />
                  {error && (
                    <FieldMessage id={`${id}-error`} error>
                      {error}
                    </FieldMessage>
                  )}
                </div>
              );
            };
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.timeN(n)}</p>
                  <RemoveRowButton label={t.removeRow(n)} disabled={!list.canRemove} onClick={() => list.removeRow(row.id)} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={fieldId(row.id, "op")}>
                      <span className="sr-only">{t.timeN(n)} </span>
                      {t.op}
                    </Label>
                    <Select id={fieldId(row.id, "op")} value={row.op} onChange={(event) => list.updateRow(row.id, { op: event.target.value })}>
                      <option value="add">{t.add}</option>
                      <option value="subtract">{t.subtract}</option>
                    </Select>
                  </div>
                  {numberField("hours", t.hours, t.hourUnit)}
                  {numberField("minutes", t.minutes, t.minuteUnit)}
                </div>
              </li>
            );
          })}
        </ul>

        {listError && (
          <div className="mt-3">
            <FieldMessage id="time-rows-error" error>
              {errorMessage(t, locale, listError, 0)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton label={t.addRow} limitMessage={t.limit} disabled={!list.canAdd} onClick={list.addRow} />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(totalText(t, result)) : ""}
        result={result && <TimeAddResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">– h – min</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function TimeAddResultView({ result: r }: { result: TimeAddResult }) {
  const t = STRINGS[useLocale()];
  const text = shareText(t, r);
  const sign = r.negative ? "−" : "";
  const stats = [
    { label: t.decimal, value: `${sign}${formatNumber(r.decimalHours)}` },
    { label: t.totalMinutes, value: `${sign}${formatNumber(Math.abs(r.totalMinutes))}` },
    ...(r.days > 0 ? [{ label: t.inDays, value: `${sign}${t.days(r.days, r.dayHours, r.minutes)}` }] : []),
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={t.resultTitle}
        titleId="time-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{totalText(t, r)}</p>}
      >
        <ResultStats items={stats} />
        {r.negative && <p className="mt-4 text-slate-800">{t.negativeNote}</p>}
      </ResultPanel>
    </div>
  );
}

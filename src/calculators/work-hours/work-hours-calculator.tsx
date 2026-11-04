"use client";

import { LazyLink as Link } from "@/components/ui/lazy-link";
import { useState } from "react";
import { calculatorPath } from "@/calculators/paths";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FieldMessage, Input, Label } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { rowsFromJson, rowsToJson, useRowList } from "@/calculators/education/use-row-list";
import { useLocale } from "@/i18n/locale-context";
import { localePath, type Locale } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { calculateWorkHours, MAX_BREAK, MAX_DAYS, toHours, type DayRowInput, type WorkHoursError, type WorkHoursResult } from "./logic";

const INITIAL_ROWS = 6;
const SAVED_FIELDS = ["start", "end", "breakMinutes"] as const;
type RowField = (typeof SAVED_FIELDS)[number];
const fieldId = (rowId: number, field: RowField) => `work-day-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "start");
const createRow = (id: number): DayRowInput => ({ id, start: "", end: "", breakMinutes: "" });

const STRINGS = {
  en: {
    submit: "Calculate hours",
    intro: "Enter your start and finish time for each day (24-hour clock works too), and any break in minutes. Leave unused days blank.",
    daysLabel: "Days",
    dayN: (n: number) => `Day ${n}`,
    start: "Start",
    end: "Finish",
    breakLabel: "Break",
    minutes: "min",
    removeDay: (n: number) => `Remove day ${n}`,
    addDay: "Add day",
    limit: `Up to ${MAX_DAYS} days.`,
    errTimeMissing: "Enter a time.",
    errTimeInvalid: "Enter a time such as 08:30.",
    errSameTime: "Finish must differ from start.",
    errBreakTooLong: "The break must be shorter than the shift.",
    errBreak: (n: number) => `break on day ${n}`,
    errBreakMin: "0 minutes or more",
    errBreakMax: `${MAX_BREAK} minutes or less`,
    errNoDays: "Enter the start and finish time for at least one day.",
    errTooMany: `Enter up to ${MAX_DAYS} days.`,
    duration: (minutes: number) => `${Math.floor(minutes / 60)} h ${minutes % 60} min`,
    resultTitle: "Overtime hours (over 8 a day)",
    decimal: (h: string) => `${h} hours in decimal`,
    total: "Total worked",
    regular: "Regular hours",
    days: "Days",
    weekOver: (over: string) => `This week is ${over} over the normal 48 hours (section 102).`,
    weekWithin: "This week is within the normal 48 hours (section 102).",
    weekMax: "This is more than 60 hours, the most section 102 allows in any week.",
    dayMax: (n: number) => `${n === 1 ? "1 day is" : `${n} days are`} over 10 hours, the daily maximum with overtime (section 100).`,
    nextStep: "Turn these hours into taka:",
    nextLink: "overtime pay calculator",
    nextHint: (h: string) => ` (enter ${h} hours).`,
    tableCaption: "Hours worked and overtime for each day",
    dayCol: "Day",
    workedCol: "Worked",
    overtimeCol: "Overtime",
    night: "night shift",
    announcement: (ot: string, total: string) => `Overtime ${ot}. Total worked ${total}.`,
    placeholderTitleFirst: "Your hours will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter your start and finish times, then select Calculate hours.",
    placeholderFix: "Fix the highlighted fields above and your hours will show here.",
    shareTitle: "Work hours from HisabBD",
    shareText: (total: string, regular: string, ot: string, h: string) =>
      `Worked ${total}: ${regular} regular, ${ot} overtime (${h} hours).\nWorked out with HisabBD’s Work Hours Calculator.`,
  },
  bn: {
    submit: "ঘণ্টা হিসাব করুন",
    intro: "প্রতিদিন ঢোকা ও বের হওয়ার সময় লিখুন, আর বিরতি থাকলে মিনিটে। যে দিনগুলো লাগবে না সেগুলো ফাঁকা রাখুন।",
    daysLabel: "দিনগুলো",
    dayN: (n: number) => `দিন ${n}`,
    start: "শুরু",
    end: "শেষ",
    breakLabel: "বিরতি",
    minutes: "মিনিট",
    removeDay: (n: number) => `দিন ${n} বাদ দিন`,
    addDay: "দিন যোগ করুন",
    limit: `সর্বোচ্চ ${MAX_DAYS} দিন।`,
    errTimeMissing: "সময় লিখুন।",
    errTimeInvalid: "08:30-এর মতো করে সময় লিখুন।",
    errSameTime: "শেষের সময় শুরুর সময় থেকে আলাদা হতে হবে।",
    errBreakTooLong: "বিরতি শিফটের চেয়ে কম হতে হবে।",
    errBreak: (n: number) => `দিন ${n}-এর বিরতি`,
    errBreakMin: "0 মিনিট বা তার বেশি",
    errBreakMax: `${MAX_BREAK} মিনিট বা তার কম`,
    errNoDays: "অন্তত এক দিনের শুরু ও শেষের সময় লিখুন।",
    errTooMany: `সর্বোচ্চ ${MAX_DAYS} দিনের তথ্য লিখুন।`,
    duration: (minutes: number) => `${Math.floor(minutes / 60)} ঘণ্টা ${minutes % 60} মিনিট`,
    resultTitle: "ওভারটাইম ঘণ্টা (দিনে 8-এর বেশি)",
    decimal: (h: string) => `দশমিকে ${h} ঘণ্টা`,
    total: "মোট কাজ",
    regular: "সাধারণ কর্মঘণ্টা",
    days: "দিন",
    weekOver: (over: string) => `এই সপ্তাহে স্বাভাবিক 48 ঘণ্টার চেয়ে ${over} বেশি (ধারা 102)।`,
    weekWithin: "এই সপ্তাহ স্বাভাবিক 48 ঘণ্টার মধ্যে আছে (ধারা 102)।",
    weekMax: "এটি 60 ঘণ্টার বেশি; 102 ধারায় কোনো সপ্তাহে এর বেশি কাজ করানো যায় না।",
    dayMax: (n: number) => `${n} দিন 10 ঘণ্টার বেশি, যা ওভারটাইমসহ দৈনিক সর্বোচ্চ সীমা (ধারা 100)।`,
    nextStep: "এই ঘণ্টা টাকায় বদলাতে:",
    nextLink: "ওভারটাইম মজুরি ক্যালকুলেটর",
    nextHint: (h: string) => ` (${h} ঘণ্টা লিখুন)।`,
    tableCaption: "প্রতিদিনের কর্মঘণ্টা ও ওভারটাইম",
    dayCol: "দিন",
    workedCol: "কাজ",
    overtimeCol: "ওভারটাইম",
    night: "রাতের শিফট",
    announcement: (ot: string, total: string) => `ওভারটাইম ${ot}। মোট কাজ ${total}।`,
    placeholderTitleFirst: "আপনার কর্মঘণ্টা এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "ঢোকা ও বের হওয়ার সময় লিখে “ঘণ্টা হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই হিসাব এখানে দেখা যাবে।",
    shareTitle: "HisabBD-র কর্মঘণ্টার হিসাব",
    shareText: (total: string, regular: string, ot: string, h: string) =>
      `মোট কাজ ${total}: সাধারণ ${regular}, ওভারটাইম ${ot} (${h} ঘণ্টা)।\nHisabBD-র কর্মঘণ্টা ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: WorkHoursError, n: number): string {
  switch (error.code) {
    case "time-missing":
      return t.errTimeMissing;
    case "time-invalid":
      return t.errTimeInvalid;
    case "same-time":
      return t.errSameTime;
    case "break-too-long":
      return t.errBreakTooLong;
    case "no-days":
      return t.errNoDays;
    case "too-many":
      return t.errTooMany;
    default:
      return numberErrorMessage(error.code, { label: t.errBreak(n), min: t.errBreakMin, max: t.errBreakMax }, locale);
  }
}

function shareText(t: Strings, r: WorkHoursResult): string {
  return t.shareText(t.duration(r.totalMinutes), t.duration(r.regularMinutes), t.duration(r.overtimeMinutes), formatNumber(toHours(r.overtimeMinutes)));
}

export function WorkHoursCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const list = useRowList<DayRowInput>({ createRow, initialCount: INITIAL_ROWS, maxRows: MAX_DAYS, focusTargetId: firstFieldId });
  const { rows } = list;
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();

  const calc = submitted ? calculateWorkHours(rows) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const fieldError = (rowId: number, field: RowField, n: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(t, locale, error, n) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateWorkHours(rows);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ rows: rowsToJson(rows, SAVED_FIELDS) }, shareText(t, check.result));
      return;
    }
    const first = check.errors[0];
    const target = first?.rowId ?? rows[0]?.id;
    const field = first && first.field !== "rows" ? first.field : "start";
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
        <ul className="space-y-3" aria-label={t.daysLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const timeField = (field: "start" | "end", label: string) => {
              const id = fieldId(row.id, field);
              const error = fieldError(row.id, field, n);
              return (
                <div className="min-w-0">
                  <Label htmlFor={id}>
                    <span className="sr-only">{t.dayN(n)} </span>
                    {label}
                  </Label>
                  <Input
                    id={id}
                    type="time"
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
            const breakId = fieldId(row.id, "breakMinutes");
            const breakError = fieldError(row.id, "breakMinutes", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.dayN(n)}</p>
                  <RemoveRowButton label={t.removeDay(n)} disabled={!list.canRemove} onClick={() => list.removeRow(row.id)} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {timeField("start", t.start)}
                  {timeField("end", t.end)}
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={breakId}>
                      <span className="sr-only">{t.dayN(n)} </span>
                      {t.breakLabel}
                    </Label>
                    <AffixInput
                      id={breakId}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      suffix={t.minutes}
                      value={row.breakMinutes}
                      aria-invalid={breakError ? true : undefined}
                      aria-describedby={breakError ? `${breakId}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { breakMinutes: event.target.value })}
                    />
                    {breakError && (
                      <FieldMessage id={`${breakId}-error`} error>
                        {breakError}
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
            <FieldMessage id="work-days-error" error>
              {errorMessage(t, locale, listError, 0)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton label={t.addDay} limitMessage={t.limit} disabled={!list.canAdd} onClick={list.addRow} />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(t.duration(result.overtimeMinutes), t.duration(result.totalMinutes)) : ""}
        result={result && <WorkHoursResultView result={result} dayNumber={(rowId) => rows.findIndex((row) => row.id === rowId) + 1} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">– h</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function WorkHoursResultView({ result: r, dayNumber }: { result: WorkHoursResult; dayNumber: (rowId: number) => number }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const text = shareText(t, r);
  const otHours = formatNumber(toHours(r.overtimeMinutes));
  const longDays = r.days.filter((d) => d.overMax).length;
  const stats = [
    { label: t.total, value: t.duration(r.totalMinutes) },
    { label: t.regular, value: t.duration(r.regularMinutes) },
    { label: t.days, value: formatNumber(r.days.length) },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={t.resultTitle}
        titleId="work-hours-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{t.duration(r.overtimeMinutes)}</p>
            <p className="mt-1 font-semibold text-slate-700">{t.decimal(otHours)}</p>
          </>
        }
      >
        <ResultStats items={stats} />
        <ul className="mt-4 space-y-1 text-slate-800">
          {r.week && <li>{r.week.overNormalMinutes > 0 ? t.weekOver(t.duration(r.week.overNormalMinutes)) : t.weekWithin}</li>}
          {r.week?.overMax && <li className="font-semibold">{t.weekMax}</li>}
          {longDays > 0 && <li className="font-semibold">{t.dayMax(longDays)}</li>}
        </ul>
        {r.overtimeMinutes > 0 && (
          <p className="mt-3 text-slate-800">
            {t.nextStep}{" "}
            <Link href={localePath(locale, calculatorPath("overtime-calculator"))} className="font-semibold text-brand-700 underline underline-offset-4">
              {t.nextLink}
            </Link>
            {t.nextHint(otHours)}
          </p>
        )}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[18rem] text-right text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 text-left font-medium">{t.dayCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.workedCol}</th>
                <th scope="col" className="py-2 pl-2 font-medium">{t.overtimeCol}</th>
              </tr>
            </thead>
            <tbody>
              {r.days.map((d) => (
                <tr key={d.rowId} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">
                    {t.dayN(dayNumber(d.rowId))}
                    {d.overnight && <span className="block text-xs font-normal text-slate-600">{t.night}</span>}
                  </th>
                  <td className={d.overMax ? "px-2 py-2 font-semibold text-red-700 tabular-nums" : "px-2 py-2 tabular-nums"}>{t.duration(d.workedMinutes)}</td>
                  <td className="py-2 pl-2 font-semibold tabular-nums">{t.duration(d.overtimeMinutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultPanel>
    </div>
  );
}

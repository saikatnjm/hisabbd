"use client";

import { useState } from "react";
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
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatTaka } from "@/lib/format";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { calculateSplit, MAX_PAID, MAX_PEOPLE, type PersonRowInput, type SplitError, type SplitResult } from "./logic";

const INITIAL_ROWS = 4;
const SAVED_FIELDS = ["name", "paid"] as const;
const fieldId = (rowId: number, field: "name" | "paid") => `split-person-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "name");
const createRow = (id: number): PersonRowInput => ({ id, name: "", paid: "" });

/** ৳ with paisa only when there is a fraction. */
function money(value: number): string {
  return Number.isInteger(value) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Split the cost",
    intro: "Add everyone who shares the cost, with what each person paid. Leave the amount blank for someone who paid nothing.",
    peopleLabel: "People",
    personN: (n: number) => `Person ${n}`,
    nameOptional: "Name (optional)",
    namePlaceholder: (n: number) => `e.g. Person ${n}`,
    paid: "Paid",
    removePerson: (n: number) => `Remove person ${n}`,
    addPerson: "Add person",
    limit: `Up to ${MAX_PEOPLE} people.`,
    errPaid: (n: number) => `amount paid by person ${n}`,
    errMin: "৳0 or more",
    errMax: `${formatTaka(MAX_PAID)} or less`,
    errTooFew: "Enter at least 2 people.",
    errTooMany: `Enter up to ${MAX_PEOPLE} people.`,
    errNothingPaid: "Enter what at least one person paid.",
    resultTitle: "Each person’s share",
    total: "Total spent",
    people: "People",
    transfersTitle: "To settle up",
    pays: (from: string, to: string, amount: string) => `${from} pays ${to} ${amount}`,
    allEven: "Everyone is already even.",
    tableCaption: "What each person paid, their share and balance",
    nameCol: "Person",
    paidCol: "Paid",
    shareCol: "Share",
    balanceCol: "Balance",
    getsBack: (v: string) => `gets ${v}`,
    owes: (v: string) => `owes ${v}`,
    settled: "even",
    announcement: (share: string, n: number) => `${share} each. ${n} payments to settle up.`,
    placeholderTitleFirst: "The split will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter what each person paid, then select Split the cost.",
    placeholderFix: "Fix the highlighted fields above and the split will show here.",
    shareTitle: "Expense split from HisabBD",
    shareHead: (total: string, share: string) => `Total ${total}, ${share} each.`,
    shareTail: "Split with HisabBD’s Expense Split Calculator.",
  },
  bn: {
    submit: "খরচ ভাগ করুন",
    intro: "যাঁরা খরচ ভাগ করবেন সবাইকে যোগ করুন, প্রত্যেকে কত দিয়েছেন লিখুন। কেউ কিছু না দিলে টাকার ঘর ফাঁকা রাখুন।",
    peopleLabel: "সবাই",
    personN: (n: number) => `ব্যক্তি ${n}`,
    nameOptional: "নাম (ঐচ্ছিক)",
    namePlaceholder: (n: number) => `যেমন ব্যক্তি ${n}`,
    paid: "দিয়েছেন",
    removePerson: (n: number) => `ব্যক্তি ${n} বাদ দিন`,
    addPerson: "ব্যক্তি যোগ করুন",
    limit: `সর্বোচ্চ ${MAX_PEOPLE} জন।`,
    errPaid: (n: number) => `ব্যক্তি ${n}-এর দেওয়া টাকা`,
    errMin: "৳0 বা তার বেশি",
    errMax: `${formatTaka(MAX_PAID)} বা তার কম`,
    errTooFew: "অন্তত 2 জনের তথ্য লিখুন।",
    errTooMany: `সর্বোচ্চ ${MAX_PEOPLE} জনের তথ্য লিখুন।`,
    errNothingPaid: "অন্তত একজন কত দিয়েছেন তা লিখুন।",
    resultTitle: "জনপ্রতি ভাগ",
    total: "মোট খরচ",
    people: "মানুষ",
    transfersTitle: "হিসাব মেটাতে",
    pays: (from: string, to: string, amount: string) => `${from} দেবেন ${to}-কে ${amount}`,
    allEven: "সবার হিসাব আগেই মিটে আছে।",
    tableCaption: "প্রত্যেকে কত দিয়েছেন, তাঁর ভাগ আর ব্যালান্স",
    nameCol: "ব্যক্তি",
    paidCol: "দিয়েছেন",
    shareCol: "ভাগ",
    balanceCol: "ব্যালান্স",
    getsBack: (v: string) => `পাবেন ${v}`,
    owes: (v: string) => `দেবেন ${v}`,
    settled: "সমান",
    announcement: (share: string, n: number) => `জনপ্রতি ${share}। হিসাব মেটাতে ${n}টি লেনদেন।`,
    placeholderTitleFirst: "ভাগের হিসাব এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "প্রত্যেকে কত দিয়েছেন লিখে “খরচ ভাগ করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই হিসাব এখানে দেখা যাবে।",
    shareTitle: "HisabBD-র খরচ ভাগের হিসাব",
    shareHead: (total: string, share: string) => `মোট ${total}, জনপ্রতি ${share}।`,
    shareTail: "HisabBD-র খরচ ভাগাভাগি ক্যালকুলেটরে হিসাব করা।",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: SplitError, n: number): string {
  switch (error.code) {
    case "too-few":
      return t.errTooFew;
    case "too-many":
      return t.errTooMany;
    case "nothing-paid":
      return t.errNothingPaid;
    default:
      return numberErrorMessage(error.code, { label: t.errPaid(n), min: t.errMin, max: t.errMax }, locale);
  }
}

function personName(t: Strings, r: SplitResult, index: number): string {
  return r.people[index]?.name || t.personN(index + 1);
}

function balanceText(t: Strings, balance: number): string {
  if (balance === 0) return t.settled;
  return balance > 0 ? t.getsBack(money(balance)) : t.owes(money(-balance));
}

function shareText(t: Strings, r: SplitResult): string {
  const lines = r.transfers.map((tr) => t.pays(personName(t, r, tr.from), personName(t, r, tr.to), money(tr.amount)));
  return [t.shareHead(money(r.total), money(r.people[r.people.length - 1]!.share)), ...(lines.length ? lines : [t.allEven]), t.shareTail].join("\n");
}

export function SplitCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const list = useRowList<PersonRowInput>({ createRow, initialCount: INITIAL_ROWS, maxRows: MAX_PEOPLE, focusTargetId: firstFieldId });
  const { rows } = list;
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();

  const calc = submitted ? calculateSplit(rows) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const rowError = (rowId: number, n: number) => {
    const error = errorList.find((e) => e.rowId === rowId);
    return error ? errorMessage(t, locale, error, n) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateSplit(rows);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ rows: rowsToJson(rows, SAVED_FIELDS) }, shareText(t, check.result));
      return;
    }
    const first = check.errors[0];
    const target = first?.rowId ?? rows[0]?.id;
    if (target !== undefined) document.getElementById(fieldId(target, "paid"))?.focus();
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
        <ul className="space-y-3" aria-label={t.peopleLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const error = rowError(row.id, n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.personN(n)}</p>
                  <RemoveRowButton label={t.removePerson(n)} disabled={!list.canRemove} onClick={() => list.removeRow(row.id)} />
                </div>
                <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3">
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">{t.personN(n)} </span>
                      {t.nameOptional}
                    </Label>
                    <Input
                      id={fieldId(row.id, "name")}
                      type="text"
                      autoComplete="off"
                      maxLength={40}
                      placeholder={t.namePlaceholder(n)}
                      value={row.name}
                      onChange={(event) => list.updateRow(row.id, { name: event.target.value })}
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "paid")}>
                      <span className="sr-only">{t.personN(n)} </span>
                      {t.paid}
                    </Label>
                    <AffixInput
                      id={fieldId(row.id, "paid")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      prefix="৳"
                      value={row.paid}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${fieldId(row.id, "paid")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { paid: event.target.value })}
                    />
                    {error && (
                      <FieldMessage id={`${fieldId(row.id, "paid")}-error`} error>
                        {error}
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
            <FieldMessage id="split-rows-error" error>
              {errorMessage(t, locale, listError, 0)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton label={t.addPerson} limitMessage={t.limit} disabled={!list.canAdd} onClick={list.addRow} />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(money(result.people[result.people.length - 1]!.share), result.transfers.length) : ""}
        result={result && <SplitResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function SplitResultView({ result: r }: { result: SplitResult }) {
  const t = STRINGS[useLocale()];
  const text = shareText(t, r);
  const stats = [
    { label: t.total, value: money(r.total) },
    { label: t.people, value: formatNumber(r.people.length) },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={t.resultTitle}
        titleId="split-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(r.people[r.people.length - 1]!.share)}</p>}
      >
        <ResultStats items={stats} />
        <h3 className="mt-5 font-semibold text-slate-900">{t.transfersTitle}</h3>
        {r.transfers.length === 0 ? (
          <p className="mt-2 text-slate-800">{t.allEven}</p>
        ) : (
          <ol className="mt-2 space-y-1 text-slate-900">
            {r.transfers.map((tr, i) => (
              <li key={i} className="rounded-lg bg-white/70 px-3 py-2 font-semibold">
                {t.pays(personName(t, r, tr.from), personName(t, r, tr.to), money(tr.amount))}
              </li>
            ))}
          </ol>
        )}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[20rem] text-right text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 text-left font-medium">{t.nameCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.paidCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.shareCol}</th>
                <th scope="col" className="py-2 pl-2 font-medium">{t.balanceCol}</th>
              </tr>
            </thead>
            <tbody>
              {r.people.map((p, i) => (
                <tr key={p.rowId} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">{personName(t, r, i)}</th>
                  <td className="px-2 py-2 tabular-nums">{money(p.paid)}</td>
                  <td className="px-2 py-2 tabular-nums">{money(p.share)}</td>
                  <td className="py-2 pl-2 font-semibold">{balanceText(t, p.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultPanel>
    </div>
  );
}

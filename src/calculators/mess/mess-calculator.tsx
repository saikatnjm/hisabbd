"use client";

import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FieldMessage, FormField, Input, Label } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { rowsFromJson, rowsToJson, useRowList } from "@/calculators/education/use-row-list";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import {
  calculateMess,
  MAX_MEALS,
  MAX_MEMBERS,
  MAX_MONEY,
  type MemberRowInput,
  type MessError,
  type MessResult,
} from "./logic";

const INITIAL_ROWS = 4;
const SAVED_FIELDS = ["name", "meals", "deposit"] as const;
const BAZAR_ID = "mess-bazar";
const SHARED_ID = "mess-shared";

const fieldId = (rowId: number, field: "name" | "meals" | "deposit") => `mess-member-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "name");
const createRow = (id: number): MemberRowInput => ({ id, name: "", meals: "", deposit: "" });

/** ৳ with paisa only when there is a fraction. */
function money(value: number): string {
  const rounded = roundTo(value, 2);
  return Number.isInteger(rounded) ? formatTaka(rounded) : formatTaka(rounded, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate meals",
    bazar: "Total bazar cost this month",
    bazarHint: "All food shopping for the mess, including bazar members did themselves.",
    shared: "Fixed costs to split equally (optional)",
    sharedHint: "Cook, gas, internet and similar, if your mess splits them equally.",
    membersLabel: "Members",
    memberN: (n: number) => `Member ${n}`,
    nameOptional: "Name (optional)",
    namePlaceholder: (n: number) => `e.g. Member ${n}`,
    meals: "Meals",
    deposit: "Deposit (জমা)",
    removeMember: (n: number) => `Remove member ${n}`,
    addMember: "Add member",
    limit: `Up to ${MAX_MEMBERS} members.`,
    errBazar: "bazar cost",
    errShared: "fixed costs",
    errMeals: (n: number) => `meals for member ${n}`,
    errDeposit: (n: number) => `deposit for member ${n}`,
    errMoneyMin: "৳0 or more",
    errMoneyMax: `${formatTaka(MAX_MONEY)} or less`,
    errMealsMin: "0 or more",
    errMealsMax: `${formatNumber(MAX_MEALS)} or less`,
    errNoMembers: "Enter at least one member’s meals.",
    errNoMeals: "The total meals must be more than 0.",
    errTooMany: `Enter up to ${MAX_MEMBERS} members.`,
    resultTitle: "Meal rate this month",
    perMeal: "a meal",
    totalMeals: "Total meals",
    sharedEach: "Fixed costs per member",
    totalDeposit: "Total deposits",
    totalCost: "Total costs",
    cashLeft: "Cash left with the manager",
    shortfall: "Shortfall to collect",
    tableCaption: "Each member’s meals, cost, deposit and balance",
    nameCol: "Member",
    mealsCol: "Meals",
    costCol: "Cost",
    depositCol: "Deposit",
    balanceCol: "Balance",
    getsBack: (v: string) => `gets ${v}`,
    owes: (v: string) => `owes ${v}`,
    settled: "settled",
    note: "Balance = deposit − (meals × meal rate + fixed-cost share). Lines are rounded to the paisa.",
    announcement: (rate: string) => `Meal rate ${rate} a meal.`,
    placeholderTitleFirst: "The meal rate will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the bazar cost and each member’s meals, then select Calculate meals.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Mess meal account from HisabBD",
    shareHead: (rate: string, meals: string) => `Meal rate ${rate} (${meals} meals).`,
    shareLine: (name: string, cost: string, balance: string) => `${name}: cost ${cost}, ${balance}.`,
    shareTail: "Calculated with HisabBD’s Mess Meal Calculator.",
  },
  bn: {
    submit: "মিল হিসাব করুন",
    bazar: "এ মাসের মোট বাজার খরচ",
    bazarHint: "মেসের সব বাজার, সদস্যদের নিজে করা বাজারসহ।",
    shared: "সমান ভাগের স্থির খরচ (ঐচ্ছিক)",
    sharedHint: "বুয়া, গ্যাস, ইন্টারনেট ইত্যাদি, যদি আপনার মেসে সমান ভাগ হয়।",
    membersLabel: "সদস্যরা",
    memberN: (n: number) => `সদস্য ${n}`,
    nameOptional: "নাম (ঐচ্ছিক)",
    namePlaceholder: (n: number) => `যেমন সদস্য ${n}`,
    meals: "মিল",
    deposit: "জমা",
    removeMember: (n: number) => `সদস্য ${n} বাদ দিন`,
    addMember: "সদস্য যোগ করুন",
    limit: `সর্বোচ্চ ${MAX_MEMBERS} জন সদস্য।`,
    errBazar: "বাজার খরচ",
    errShared: "স্থির খরচ",
    errMeals: (n: number) => `সদস্য ${n}-এর মিল`,
    errDeposit: (n: number) => `সদস্য ${n}-এর জমা`,
    errMoneyMin: "৳0 বা তার বেশি",
    errMoneyMax: `${formatTaka(MAX_MONEY)} বা তার কম`,
    errMealsMin: "0 বা তার বেশি",
    errMealsMax: `${formatNumber(MAX_MEALS)} বা তার কম`,
    errNoMembers: "অন্তত একজন সদস্যের মিল লিখুন।",
    errNoMeals: "মোট মিল 0-এর বেশি হতে হবে।",
    errTooMany: `সর্বোচ্চ ${MAX_MEMBERS} জন সদস্য লিখুন।`,
    resultTitle: "এ মাসের মিল রেট",
    perMeal: "প্রতি মিল",
    totalMeals: "মোট মিল",
    sharedEach: "জনপ্রতি স্থির খরচ",
    totalDeposit: "মোট জমা",
    totalCost: "মোট খরচ",
    cashLeft: "ম্যানেজারের হাতে রইল",
    shortfall: "ঘাটতি, তুলতে হবে",
    tableCaption: "প্রত্যেক সদস্যের মিল, খরচ, জমা আর ব্যালান্স",
    nameCol: "সদস্য",
    mealsCol: "মিল",
    costCol: "খরচ",
    depositCol: "জমা",
    balanceCol: "ব্যালান্স",
    getsBack: (v: string) => `পাবেন ${v}`,
    owes: (v: string) => `দেবেন ${v}`,
    settled: "মিটে গেছে",
    note: "ব্যালান্স = জমা − (মিল × মিল রেট + স্থির খরচের ভাগ)। প্রতিটি লাইন পয়সা পর্যন্ত রাউন্ড করা।",
    announcement: (rate: string) => `মিল রেট প্রতি মিল ${rate}।`,
    placeholderTitleFirst: "মিল রেট এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "বাজার খরচ আর প্রত্যেকের মিল লিখে “মিল হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD-র মেসের মিল হিসাব",
    shareHead: (rate: string, meals: string) => `মিল রেট ${rate} (${meals} মিল)।`,
    shareLine: (name: string, cost: string, balance: string) => `${name}: খরচ ${cost}, ${balance}।`,
    shareTail: "HisabBD-র মেসের মিল ক্যালকুলেটরে হিসাব করা।",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: MessError, memberNumber: number): string {
  if (error.code === "no-members") return t.errNoMembers;
  if (error.code === "no-meals") return t.errNoMeals;
  if (error.code === "too-many") return t.errTooMany;
  const money = { min: t.errMoneyMin, max: t.errMoneyMax };
  switch (error.field) {
    case "bazar":
      return numberErrorMessage(error.code, { label: t.errBazar, ...money }, locale);
    case "shared":
      return numberErrorMessage(error.code, { label: t.errShared, ...money }, locale);
    case "meals":
      return numberErrorMessage(error.code, { label: t.errMeals(memberNumber), min: t.errMealsMin, max: t.errMealsMax }, locale);
    case "deposit":
      return numberErrorMessage(error.code, { label: t.errDeposit(memberNumber), ...money }, locale);
    default:
      return t.errNoMembers;
  }
}

function balanceText(t: Strings, balance: number): string {
  const rounded = roundTo(balance, 2);
  if (rounded === 0) return t.settled;
  return rounded > 0 ? t.getsBack(money(rounded)) : t.owes(money(-rounded));
}

function memberName(t: Strings, r: MessResult, index: number): string {
  return r.members[index]?.name || t.memberN(index + 1);
}

function shareText(t: Strings, r: MessResult): string {
  const lines = r.members.map((m, i) => t.shareLine(memberName(t, r, i), money(m.totalCost), balanceText(t, m.balance)));
  return [t.shareHead(money(r.mealRate), formatNumber(r.totalMeals)), ...lines, t.shareTail].join("\n");
}

export function MessCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const list = useRowList<MemberRowInput>({ createRow, initialCount: INITIAL_ROWS, maxRows: MAX_MEMBERS, focusTargetId: firstFieldId });
  const { rows } = list;
  const [bazar, setBazar] = useState("");
  const [shared, setShared] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();

  const calc = submitted ? calculateMess(rows, bazar, shared) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const rowError = (rowId: number, field: "meals" | "deposit", n: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(t, locale, error, n) : undefined;
  };
  const formError = (field: "bazar" | "shared" | "rows") => {
    const error = errorList.find((e) => e.rowId === null && e.field === field);
    return error ? errorMessage(t, locale, error, 0) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateMess(rows, bazar, shared);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ rows: rowsToJson(rows, SAVED_FIELDS), bazar, shared }, shareText(t, check.result));
      return;
    }
    const first = check.errors[0];
    if (!first) return;
    const target =
      first.rowId !== null
        ? fieldId(first.rowId, first.field === "deposit" ? "deposit" : "meals")
        : first.field === "shared"
          ? SHARED_ID
          : first.field === "bazar"
            ? BAZAR_ID
            : rows[0] && fieldId(rows[0].id, "meals");
    if (target) document.getElementById(target)?.focus();
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    list.replaceRows(rowsFromJson(saved.rows, SAVED_FIELDS));
    setBazar(typeof saved.bazar === "string" ? saved.bazar : "");
    setShared(typeof saved.shared === "string" ? saved.shared : "");
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    list.resetRows();
    setBazar("");
    setShared("");
    setSubmitted(false);
    setRevealCount(0);
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id={BAZAR_ID} label={t.bazar} hint={t.bazarHint} error={formError("bazar")}>
            {(control) => (
              <AffixInput
                {...control}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder="7,200"
                value={bazar}
                onChange={(event) => setBazar(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={SHARED_ID} label={t.shared} hint={t.sharedHint} error={formError("shared")}>
            {(control) => (
              <AffixInput
                {...control}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                value={shared}
                onChange={(event) => setShared(event.target.value)}
              />
            )}
          </FormField>
        </div>

        <ul className="mt-6 space-y-3" aria-label={t.membersLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const mealsError = rowError(row.id, "meals", n);
            const depositError = rowError(row.id, "deposit", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.memberN(n)}</p>
                  <RemoveRowButton label={t.removeMember(n)} disabled={!list.canRemove} onClick={() => list.removeRow(row.id)} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_7rem_9rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">{t.memberN(n)} </span>
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
                    <Label htmlFor={fieldId(row.id, "meals")}>
                      <span className="sr-only">{t.memberN(n)} </span>
                      {t.meals}
                    </Label>
                    <Input
                      id={fieldId(row.id, "meals")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={row.meals}
                      aria-invalid={mealsError ? true : undefined}
                      aria-describedby={mealsError ? `${fieldId(row.id, "meals")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { meals: event.target.value })}
                    />
                    {mealsError && (
                      <FieldMessage id={`${fieldId(row.id, "meals")}-error`} error>
                        {mealsError}
                      </FieldMessage>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "deposit")}>
                      <span className="sr-only">{t.memberN(n)} </span>
                      {t.deposit}
                    </Label>
                    <Input
                      id={fieldId(row.id, "deposit")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={row.deposit}
                      aria-invalid={depositError ? true : undefined}
                      aria-describedby={depositError ? `${fieldId(row.id, "deposit")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { deposit: event.target.value })}
                    />
                    {depositError && (
                      <FieldMessage id={`${fieldId(row.id, "deposit")}-error`} error>
                        {depositError}
                      </FieldMessage>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {formError("rows") && (
          <div className="mt-3">
            <FieldMessage id="mess-rows-error" error>
              {formError("rows")}
            </FieldMessage>
          </div>
        )}

        <AddRowButton label={t.addMember} limitMessage={t.limit} disabled={!list.canAdd} onClick={list.addRow} />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(money(result.mealRate)) : ""}
        result={result && <MessResultView result={result} />}
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

function MessResultView({ result: r }: { result: MessResult }) {
  const t = STRINGS[useLocale()];
  const cash = roundTo(r.cashBalance, 2);
  const stats = [
    { label: t.totalMeals, value: formatNumber(r.totalMeals) },
    ...(r.shared > 0 ? [{ label: t.sharedEach, value: money(r.sharedPerMember) }] : []),
    { label: t.totalDeposit, value: money(r.totalDeposit) },
    { label: t.totalCost, value: money(r.totalCost) },
    { label: cash < 0 ? t.shortfall : t.cashLeft, value: money(Math.abs(cash)) },
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={t.resultTitle}
        titleId="mess-result-heading"
        value={
          <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
            {money(r.mealRate)} <span className="text-xl font-semibold text-slate-700">{t.perMeal}</span>
          </p>
        }
      >
        <ResultStats items={stats} />
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[22rem] text-right text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 text-left font-medium">{t.nameCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.mealsCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.costCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.depositCol}</th>
                <th scope="col" className="py-2 pl-2 font-medium">{t.balanceCol}</th>
              </tr>
            </thead>
            <tbody>
              {r.members.map((m, i) => (
                <tr key={m.rowId} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">{memberName(t, r, i)}</th>
                  <td className="px-2 py-2 tabular-nums">{formatNumber(m.meals)}</td>
                  <td className="px-2 py-2 tabular-nums">{money(m.totalCost)}</td>
                  <td className="px-2 py-2 tabular-nums">{money(m.deposit)}</td>
                  <td className={roundTo(m.balance, 2) < 0 ? "py-2 pl-2 font-semibold text-red-700" : "py-2 pl-2 font-semibold text-brand-700"}>
                    {balanceText(t, m.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>
    </div>
  );
}

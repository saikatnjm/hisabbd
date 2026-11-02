import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Mess meal calculation rules (documented assumptions):
 *
 * 1. Meal rate = total bazar (food shopping) cost ÷ total meals eaten by all
 *    members in the month.
 * 2. Each member's meal cost = their meals × the meal rate. Meals may be
 *    fractions (e.g. 0.5 for a half meal), as some messes count them.
 * 3. Shared costs that don't depend on meals (cook/khala, gas, internet,
 *    utilities, rent if the mess pools it) are optional and split equally
 *    among the members entered. Messes that split them differently can leave
 *    the box blank and settle those separately; the page says so.
 * 4. Each member's deposit (জমা) is what they paid into the mess, including
 *    bazar they did themselves. Balance = deposit − (meal cost + shared
 *    share): positive means the mess owes them, negative means they owe.
 * 5. The balances add up to total deposits − total costs: the cash left with
 *    the manager (positive) or the shortfall to collect (negative).
 * 6. A row with every box blank is ignored; a row with a name or deposit needs
 *    meals. Deposit blank = ৳0. At least one member and at least one meal.
 * 7. Nothing is rounded here except floating-point noise; the UI shows Taka to
 *    the paisa and the meal rate to 2 decimals, so displayed lines can differ
 *    from the total by a paisa.
 * 8. Limits: up to 30 members; meals 0–1,000 each; money ৳0 to ৳1 crore.
 */

export const MAX_MEMBERS = 30;
export const MAX_MEALS = 1000;
export const MAX_MONEY = 10_000_000;

export interface MemberRowInput {
  id: number;
  name: string;
  meals: string;
  deposit: string;
}

export type MessField = "meals" | "deposit" | "bazar" | "shared" | "rows";
export type MessErrorCode = NumberErrorCode | "no-members" | "no-meals" | "too-many";

export interface MessError {
  /** Row the error belongs to, or null for a form-wide field. */
  rowId: number | null;
  field: MessField;
  code: MessErrorCode;
}

export interface MemberResult {
  rowId: number;
  name: string;
  meals: number;
  deposit: number;
  mealCost: number;
  sharedShare: number;
  totalCost: number;
  /** deposit − totalCost: positive = gets money back, negative = owes. */
  balance: number;
}

export interface MessResult {
  members: MemberResult[];
  totalMeals: number;
  bazar: number;
  shared: number;
  mealRate: number;
  sharedPerMember: number;
  totalDeposit: number;
  totalCost: number;
  /** totalDeposit − totalCost: cash left (positive) or shortfall (negative). */
  cashBalance: number;
}

export type MessCalculation = { ok: true; result: MessResult } | { ok: false; errors: MessError[] };

const clean = (value: number) => roundTo(value, 10);

export function isBlankMember(row: MemberRowInput): boolean {
  return !row.name.trim() && !row.meals.trim() && !row.deposit.trim();
}

export function calculateMess(rows: readonly MemberRowInput[], rawBazar: string, rawShared: string): MessCalculation {
  const errors: MessError[] = [];
  const bazar = checkNumber(rawBazar, { min: 0, max: MAX_MONEY });
  if (!bazar.ok) errors.push({ rowId: null, field: "bazar", code: bazar.code });
  const sharedBlank = !rawShared.trim();
  const shared = sharedBlank ? ({ ok: true, value: 0 } as const) : checkNumber(rawShared, { min: 0, max: MAX_MONEY });
  if (!shared.ok) errors.push({ rowId: null, field: "shared", code: shared.code });

  const filled = rows.filter((row) => !isBlankMember(row));
  if (rows.length > MAX_MEMBERS) errors.push({ rowId: null, field: "rows", code: "too-many" });
  else if (filled.length === 0) errors.push({ rowId: null, field: "rows", code: "no-members" });

  const parsed: { row: MemberRowInput; meals: number; deposit: number }[] = [];
  for (const row of filled) {
    const meals = checkNumber(row.meals, { min: 0, max: MAX_MEALS });
    if (!meals.ok) errors.push({ rowId: row.id, field: "meals", code: meals.code });
    const deposit = row.deposit.trim() ? checkNumber(row.deposit, { min: 0, max: MAX_MONEY }) : ({ ok: true, value: 0 } as const);
    if (!deposit.ok) errors.push({ rowId: row.id, field: "deposit", code: deposit.code });
    if (meals.ok && deposit.ok) parsed.push({ row, meals: meals.value, deposit: deposit.value });
  }
  if (errors.length > 0 || !bazar.ok || !shared.ok) return { ok: false, errors };

  const totalMeals = clean(parsed.reduce((sum, p) => sum + p.meals, 0));
  if (totalMeals === 0) return { ok: false, errors: [{ rowId: null, field: "rows", code: "no-meals" }] };

  const mealRate = clean(bazar.value / totalMeals);
  const sharedPerMember = clean(shared.value / parsed.length);
  const members = parsed.map(({ row, meals, deposit }) => {
    const mealCost = clean(meals * mealRate);
    const totalCost = clean(mealCost + sharedPerMember);
    return {
      rowId: row.id,
      name: row.name.trim(),
      meals,
      deposit,
      mealCost,
      sharedShare: sharedPerMember,
      totalCost,
      balance: clean(deposit - totalCost),
    };
  });
  const totalDeposit = clean(parsed.reduce((sum, p) => sum + p.deposit, 0));
  const totalCost = clean(bazar.value + shared.value);

  return {
    ok: true,
    result: {
      members,
      totalMeals,
      bazar: bazar.value,
      shared: shared.value,
      mealRate,
      sharedPerMember,
      totalDeposit,
      totalCost,
      cashBalance: clean(totalDeposit - totalCost),
    },
  };
}

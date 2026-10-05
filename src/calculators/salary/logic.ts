import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * Salary (gross → net) calculator rules and assumptions (documented):
 *
 * 1. The user enters gross salary per month or per year, plus any number of
 *    deductions. Each deduction is either a percentage of GROSS monthly salary
 *    or a fixed Taka amount per month.
 * 2. Yearly figures assume 12 equal months: monthly gross = yearly gross ÷ 12,
 *    yearly = monthly × 12. Festival bonuses, overtime, allowances that vary
 *    and mid-year changes are NOT included.
 * 3. Net monthly = monthly gross − total monthly deductions.
 * 4. NO statutory rules are built in. The calculator does not work out income
 *    tax, provident fund or any other legal deduction; the user supplies them
 *    (for example from a payslip or from the employer). Those rules change and
 *    vary, so they are intentionally not modelled.
 * 5. A row with both name and value blank is ignored. A row with only one of
 *    them filled must have a valid value (a missing value is an error).
 *    Percent values are 0–100; fixed values are 0 to 10^12.
 * 6. Total deductions may equal the gross salary (net = 0) but not exceed it.
 *    The comparison uses whole paisa so float noise never triggers an error.
 * 7. Nothing is rounded here; rounding is for display only.
 */

export const MAX_SALARY = 1_000_000_000_000;
export const MONTHS_PER_YEAR = 12;

export type SalaryPeriod = "month" | "year";
export type DeductionType = "percent" | "fixed";

/** A deduction row as typed by the user. `id` is stable for the life of the row. */
export interface DeductionInput {
  id: number;
  name: string;
  type: DeductionType;
  value: string;
}

export interface SalaryInputs {
  gross: string;
  period: SalaryPeriod;
  deductions: readonly DeductionInput[];
}

export type SalaryErrorCode = NumberErrorCode;

export type SalaryError =
  | { field: "gross"; code: SalaryErrorCode }
  | { field: "deduction"; id: number; code: SalaryErrorCode }
  | { field: "total"; code: "exceeds-gross" };

export interface DeductionLine {
  id: number;
  /** Trimmed name; may be empty. */
  name: string;
  type: DeductionType;
  /** The entered value (percent or Taka). */
  value: number;
  /** The amount taken off each month, in Taka. */
  monthlyAmount: number;
}

export interface SalaryResult {
  monthlyGross: number;
  monthlyDeductions: number;
  monthlyNet: number;
  annualGross: number;
  annualDeductions: number;
  annualNet: number;
  /** Total deductions as a percentage of gross. */
  deductionsPercentOfGross: number;
  lines: DeductionLine[];
}

export type SalaryCalculation = { ok: true; result: SalaryResult } | { ok: false; errors: SalaryError[] };

/** True when a row has neither a name nor a value, so it is ignored. */
export function isEmptyRow(row: DeductionInput): boolean {
  return row.name.trim() === "" && row.value.trim() === "";
}

/** Monthly Taka amount of one deduction. */
export function deductionAmount(type: DeductionType, value: number, monthlyGross: number): number {
  return type === "percent" ? (monthlyGross * value) / 100 : value;
}

const toPaisa = (taka: number) => Math.round(taka * 100);

export function calculateSalary(raw: SalaryInputs): SalaryCalculation {
  const errors: SalaryError[] = [];

  const gross = checkNumber(raw.gross, { min: 0, minExclusive: true, max: MAX_SALARY });
  if (!gross.ok) errors.push({ field: "gross", code: gross.code });

  const parsed: { row: DeductionInput; value: number }[] = [];
  for (const row of raw.deductions) {
    if (isEmptyRow(row)) continue;
    const check = checkNumber(row.value, { min: 0, max: row.type === "percent" ? 100 : MAX_SALARY });
    if (check.ok) parsed.push({ row, value: check.value });
    else errors.push({ field: "deduction", id: row.id, code: check.code });
  }

  if (!gross.ok || errors.length > 0) return { ok: false, errors };

  const annualGross = raw.period === "year" ? gross.value : gross.value * MONTHS_PER_YEAR;
  const monthlyGross = raw.period === "year" ? gross.value / MONTHS_PER_YEAR : gross.value;

  const lines: DeductionLine[] = parsed.map(({ row, value }) => ({
    id: row.id,
    name: row.name.trim(),
    type: row.type,
    value,
    monthlyAmount: deductionAmount(row.type, value, monthlyGross),
  }));
  const monthlyDeductions = lines.reduce((sum, line) => sum + line.monthlyAmount, 0);

  if (toPaisa(monthlyDeductions) > toPaisa(monthlyGross)) {
    return { ok: false, errors: [{ field: "total", code: "exceeds-gross" }] };
  }

  const monthlyNet = Math.max(0, monthlyGross - monthlyDeductions);
  const annualDeductions = monthlyDeductions * MONTHS_PER_YEAR;

  return {
    ok: true,
    result: {
      monthlyGross,
      monthlyDeductions,
      monthlyNet,
      annualGross,
      annualDeductions,
      annualNet: Math.max(0, annualGross - annualDeductions),
      deductionsPercentOfGross: (monthlyDeductions / monthlyGross) * 100,
      lines,
    },
  };
}

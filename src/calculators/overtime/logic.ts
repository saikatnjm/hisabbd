import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Overtime pay calculator rules and assumptions (documented):
 *
 * 1. Rate. Bangladesh Labour Act 2006, section 108(1): a worker who works
 *    beyond the hours set by the Act in a day or week is paid for the overtime
 *    "at twice the ordinary rate" of basic wage, dearness allowance and
 *    ad hoc or interim wage, if any. So the overtime base is
 *    basic + dearness/ad hoc/interim pay. House rent, medical, conveyance,
 *    food and other allowances are not in the base named by section 108.
 *    Source: https://bdlaws.minlaw.gov.bd/act-952/section-29435.html
 *    (checked 2 November 2026).
 * 2. Ordinary hourly rate = (basic + dearness) / hours in the month.
 *    Overtime hourly rate = 2 x ordinary hourly rate.
 *    Overtime pay = overtime rate x overtime hours.
 * 3. The monthly-hours divisor is a REQUIRED INPUT with no default. Section 108
 *    does not say how a monthly wage becomes an hourly rate, and no official
 *    text stating a divisor could be read on 2 November 2026. 208 is widely
 *    quoted (52 weeks x 48 hours / 12 months) in payroll guides, but only as a
 *    secondary source, so it is not guessed here. The page tells users to take
 *    the divisor from their employer's payslip, contract or wage notice.
 * 4. Piece-rate workers are outside section 108(1) (section 108(2), 2018
 *    amendment); this calculator is for time-rated, monthly-paid workers.
 * 5. Limits. Section 100: 8 hours a day, up to 10 with overtime. Section 102:
 *    48 hours a week, at most 60 in any week and 56 a week averaged over a
 *    year. These limits are explained, not enforced, because a month's hours
 *    do not say which weeks they fell in; the MAX_ constants below only reject
 *    typing mistakes.
 * 6. Dearness / ad hoc pay is optional; blank means 0.
 * 7. Overtime hours may be decimal (1.5 = 1 h 30 min).
 * 8. Rounding: only for display. Pay is rounded to the paisa, the two rates
 *    to 2 decimals. Pay is computed from the unrounded rate.
 * 9. Not modelled: holiday work (sections 103-118 have their own rules), tax,
 *    deductions, factory-specific agreements.
 */

export const MAX_WAGE = 10_000_000;
export const MAX_DIVISOR = 744; // 31 days x 24 hours
export const MAX_HOURS = 744;

export type OvertimeField = "basic" | "allowance" | "divisor" | "hours";
export interface OvertimeError {
  field: OvertimeField;
  code: NumberErrorCode;
}
export interface OvertimeResult {
  basic: number;
  allowance: number;
  /** basic + allowance */
  base: number;
  divisor: number;
  hours: number;
  /** Ordinary hourly rate (unrounded). */
  ordinaryRate: number;
  /** 2 x ordinary rate (unrounded). */
  overtimeRate: number;
  /** Overtime pay in taka, rounded to the paisa. */
  overtimePay: number;
}
export type OvertimeCalculation = { ok: true; result: OvertimeResult } | { ok: false; errors: OvertimeError[] };

/** Overtime pay for the formula in the rules block (unrounded). */
export function overtimePayFor(base: number, divisor: number, hours: number): number {
  return (base / divisor) * 2 * hours;
}

/** Validates the four inputs (allowance may be blank) and computes the rates and pay. */
export function calculateOvertime(
  rawBasic: string,
  rawAllowance: string,
  rawDivisor: string,
  rawHours: string,
): OvertimeCalculation {
  const errors: OvertimeError[] = [];
  const basic = checkNumber(rawBasic, { min: 0, minExclusive: true, max: MAX_WAGE });
  if (!basic.ok) errors.push({ field: "basic", code: basic.code });

  let allowanceValue = 0;
  if (rawAllowance.trim() !== "") {
    const allowance = checkNumber(rawAllowance, { min: 0, max: MAX_WAGE });
    if (allowance.ok) allowanceValue = allowance.value;
    else errors.push({ field: "allowance", code: allowance.code });
  }

  const divisor = checkNumber(rawDivisor, { min: 0, minExclusive: true, max: MAX_DIVISOR });
  if (!divisor.ok) errors.push({ field: "divisor", code: divisor.code });
  const hours = checkNumber(rawHours, { min: 0, minExclusive: true, max: MAX_HOURS });
  if (!hours.ok) errors.push({ field: "hours", code: hours.code });

  if (!basic.ok || !divisor.ok || !hours.ok || errors.length > 0) return { ok: false, errors };

  const base = basic.value + allowanceValue;
  const ordinaryRate = base / divisor.value;
  return {
    ok: true,
    result: {
      basic: basic.value,
      allowance: allowanceValue,
      base,
      divisor: divisor.value,
      hours: hours.value,
      ordinaryRate,
      overtimeRate: ordinaryRate * 2,
      overtimePay: roundTo(overtimePayFor(base, divisor.value, hours.value), 2),
    },
  };
}

import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Job exit benefit calculator rules and assumptions (documented).
 * Source: Bangladesh Labour Act 2006 as shown on bdlaws.minlaw.gov.bd, which
 * included the Labour (Amendment) Act 2026 (Act 43 of 2026) when read on
 * 2 November 2026. Section quotes are on the content pages; URLs in sources.ts.
 *
 * 1. Scope. Permanent workers (স্থায়ী শ্রমিক) paid monthly, covered by the
 *    Labour Act. Government employees and workers under other laws or
 *    contracts are outside it. Temporary workers, probationers and workers
 *    paid by other periods have different notice rules and are not modelled.
 * 2. Which wage. Section 14(3) (replaced by the 2026 amendment): for the
 *    "wages" in sections 22, 23, 26 and 27 and for compensation under 19, 20
 *    and 23, "wages" means the last monthly basic wage, dearness allowance
 *    and ad hoc or interim wage, if any, before the exit. So the base is
 *    basic + dearness/ad hoc. House rent, medical and other allowances are
 *    not in it. Dearness/ad hoc is optional here; blank means 0.
 * 3. A day's wage. The Act does NOT say how to turn a monthly wage into a
 *    day's wage for sections 20, 22, 26 and 27. (Section 48(2) divides by 26,
 *    but only for maternity benefit.) So the divisor is a REQUIRED INPUT with
 *    no default: 30 and 26 are both used in practice; the user takes it from
 *    their payslip, contract or HR. Day's wage = (basic + dearness) / divisor.
 * 4. Retrenchment (ছাঁটাই), section 20(2): for a worker with at least one
 *    year of continuous service, 30 days' wages for each year of service, or
 *    gratuity if payable, whichever is higher. Notice: one month in writing,
 *    or wages for the notice period instead. One month = the monthly wage
 *    (section 2(49A): "month" is a calendar month). Section 20(3) (extra 15
 *    days for lay-off retrenchment under 16(7)) is not modelled.
 * 5. Discharge (ডিসচার্জ), section 22(2): ill-health or incapacity certified
 *    by a registered doctor. At least one year of continuous service: 30
 *    days' wages for each year of service, or gratuity if payable, whichever
 *    is higher. No notice period is stated.
 * 6. Termination by the employer, not for misconduct, section 26: notice of
 *    120 days (permanent worker paid monthly), or wages for the notice period
 *    instead (26(3)); and compensation (26(4)): 30 days' wages for each
 *    completed year, or gratuity if payable, whichever is higher, on top of
 *    other benefits.
 * 7. Resignation (ইস্তফা), section 27(4) as replaced in 2026: for each
 *    completed year of service, 7 days' wages if the worker served up to 3
 *    years; 15 days' if more than 3 but less than 10 years; 30 days' wages
 *    or gratuity if payable, whichever is higher, if 10 years or more. The
 *    rate for the worker's total service applies to every completed year (the
 *    text is not marginal). Notice: 60 days in writing; leaving without
 *    notice means paying the employer wages for the notice period (27(3)).
 *    That amount is shown as owed by the worker and netted off in the total,
 *    as an estimate; the Act says the worker pays the employer.
 * 8. Completed years. Compensation counts only completed years of service
 *    (sections 26(4) and 27(4) say "প্রত্যেক সম্পূর্ণ বৎসর"; sections 20 and
 *    22 say "প্রত্যেক বৎসর", and we count completed years there too, with
 *    the one-year minimum they state). Service is entered as years + months
 *    + optional days. Continuity is assumed; the "240 days in 12 months" test
 *    of section 14(1) is not modelled.
 * 9. Gratuity. Section 2(10): for each full year of service or service of
 *    more than six months over it, at least 30 days' wages at the last wage
 *    rate, or 45 days' wages where service is more than 10 years. Whether a
 *    worker is entitled to gratuity at all is "if payable": it depends on the
 *    employer's rules, so it is a yes/no input, off by default. When on, it
 *    is compared with the compensation above and the higher amount is used,
 *    as sections 20, 22, 26 and 27(4)(c) say. Our reading: the 45 days apply
 *    to every year when service is over 10 years (not only years beyond ten),
 *    "more than six months" means 6 months and at least a day, and gratuity
 *    needs at least one completed year. Employer schemes can pay more than
 *    the Act's minimum; that is outside this tool.
 *    Under resignation, gratuity applies only from 10 years (27(4)(c)).
 * 10. Rounding: each amount to the paisa, only at the end. The total is the
 *    sum of the rounded lines.
 * 11. Not modelled: dismissal (section 23, depends on a proven misconduct
 *    process), death (19), retirement (28), lay-off, closure (28A),
 *    provident fund, unused leave pay (section 11), bonuses, tax, and the
 *    30-working-day payment deadline (section 30; the page mentions it).
 */

export const MAX_WAGE = 10_000_000;
export const MAX_DIVISOR = 31;
export const MAX_YEARS = 60;

export const EXIT_TYPES = ["resignation", "termination", "retrenchment", "discharge"] as const;
export type ExitType = (typeof EXIT_TYPES)[number];

export const NOTICE_DAYS = { resignation: 60, termination: 120 } as const;

export type SettlementField = "exit" | "basic" | "allowance" | "years" | "months" | "days" | "divisor";
export interface SettlementError {
  field: SettlementField;
  code: NumberErrorCode;
}

export interface SettlementInput {
  exit: string;
  basic: string;
  allowance: string;
  years: string;
  months: string;
  days: string;
  divisor: string;
  /** Employer's gratuity applies ("if payable"). */
  gratuity: boolean;
  /** Notice was given by the employer, or served by the worker (ignored for discharge). */
  notice: boolean;
}

export type NoticeKind = "none" | "paid-to-worker" | "owed-by-worker";

export interface SettlementResult {
  exit: ExitType;
  /** basic + dearness/ad hoc */
  wage: number;
  /** wage / divisor (unrounded) */
  dailyWage: number;
  divisor: number;
  service: { years: number; months: number; days: number };
  /** Completed years used for compensation. */
  completedYears: number;
  /** False when there is no completed year of service, so no compensation. */
  eligible: boolean;
  /** Days of wages per completed year under the section. */
  compensationDaysPerYear: number;
  compensation: number;
  /** Present only when the gratuity option is on and applies to this exit and service. */
  gratuity: { yearsCounted: number; daysPerYear: number; amount: number } | null;
  /** Which figure is used as the benefit. */
  basis: "compensation" | "gratuity" | "none";
  benefit: number;
  /** Section of the Act for the benefit line, e.g. "26(4)". */
  benefitSection: string;
  noticeKind: NoticeKind;
  /** Days of wages for notice, or null when notice is a month (retrenchment). */
  noticeDays: number | null;
  noticeAmount: number;
  noticeSection: string | null;
  /** benefit + notice paid to the worker - notice owed by the worker. May be negative. */
  total: number;
}

export type SettlementCalculation =
  | { ok: true; result: SettlementResult }
  | { ok: false; errors: SettlementError[] };

const BENEFIT_SECTION: Record<ExitType, string> = {
  resignation: "27(4)",
  termination: "26(4)",
  retrenchment: "20(2)(c)",
  discharge: "22(2)",
};

/** Resignation days per completed year by total service (section 27(4)). */
export function resignationDaysPerYear(years: number, months: number, days: number): number {
  const extra = months > 0 || days > 0;
  if (years > 3 || (years === 3 && extra)) return years >= 10 ? 30 : 15;
  return 7;
}

/** Validates the inputs and computes the settlement. */
export function calculateSettlement(input: SettlementInput): SettlementCalculation {
  const errors: SettlementError[] = [];
  const exit = (EXIT_TYPES as readonly string[]).includes(input.exit) ? (input.exit as ExitType) : null;
  if (!exit) errors.push({ field: "exit", code: input.exit ? "invalid" : "missing" });

  const basic = checkNumber(input.basic, { min: 0, minExclusive: true, max: MAX_WAGE });
  if (!basic.ok) errors.push({ field: "basic", code: basic.code });

  let allowanceValue = 0;
  if (input.allowance.trim() !== "") {
    const allowance = checkNumber(input.allowance, { min: 0, max: MAX_WAGE });
    if (allowance.ok) allowanceValue = allowance.value;
    else errors.push({ field: "allowance", code: allowance.code });
  }

  const years = checkNumber(input.years, { min: 0, max: MAX_YEARS, integer: true });
  if (!years.ok) errors.push({ field: "years", code: years.code });

  let monthsValue = 0;
  if (input.months.trim() !== "") {
    const months = checkNumber(input.months, { min: 0, max: 11, integer: true });
    if (months.ok) monthsValue = months.value;
    else errors.push({ field: "months", code: months.code });
  }
  let daysValue = 0;
  if (input.days.trim() !== "") {
    const days = checkNumber(input.days, { min: 0, max: 30, integer: true });
    if (days.ok) daysValue = days.value;
    else errors.push({ field: "days", code: days.code });
  }

  const divisor = checkNumber(input.divisor, { min: 0, minExclusive: true, max: MAX_DIVISOR });
  if (!divisor.ok) errors.push({ field: "divisor", code: divisor.code });

  if (!exit || !basic.ok || !years.ok || !divisor.ok || errors.length > 0) return { ok: false, errors };

  const y = years.value;
  const m = monthsValue;
  const d = daysValue;
  const extra = m > 0 || d > 0;
  const wage = basic.value + allowanceValue;
  const dailyWage = wage / divisor.value;

  // Rule 8: completed years only (sections 20 and 22 also state a one-year minimum).
  const eligible = y >= 1;
  const compensationDaysPerYear = exit === "resignation" ? resignationDaysPerYear(y, m, d) : 30;
  const compensation = roundTo(eligible ? y * compensationDaysPerYear * dailyWage : 0, 2);

  // Rule 9: gratuity, only where the section says "or gratuity".
  const gratuityAllowed = input.gratuity && y >= 1 && (exit !== "resignation" || y >= 10);
  let gratuity: SettlementResult["gratuity"] = null;
  if (gratuityAllowed) {
    const overSixMonths = m > 6 || (m === 6 && d > 0);
    const overTenYears = y > 10 || (y === 10 && extra);
    const yearsCounted = y + (overSixMonths ? 1 : 0);
    const daysPerYear = overTenYears ? 45 : 30;
    gratuity = { yearsCounted, daysPerYear, amount: roundTo(yearsCounted * daysPerYear * dailyWage, 2) };
  }

  const useGratuity = gratuity !== null && gratuity.amount > compensation;
  const benefit = useGratuity && gratuity ? gratuity.amount : compensation;
  const basis = benefit <= 0 ? "none" : useGratuity ? "gratuity" : "compensation";

  // Notice (rules 4, 6, 7). Only when notice was not given or served.
  let noticeKind: NoticeKind = "none";
  let noticeDays: number | null = null;
  let noticeAmount = 0;
  let noticeSection: string | null = null;
  if (!input.notice) {
    if (exit === "retrenchment" && y >= 1) {
      noticeKind = "paid-to-worker";
      noticeAmount = roundTo(wage, 2);
      noticeSection = "20(2)(a)";
    } else if (exit === "termination") {
      noticeKind = "paid-to-worker";
      noticeDays = NOTICE_DAYS.termination;
      noticeAmount = roundTo(NOTICE_DAYS.termination * dailyWage, 2);
      noticeSection = "26(1), 26(3)";
    } else if (exit === "resignation") {
      noticeKind = "owed-by-worker";
      noticeDays = NOTICE_DAYS.resignation;
      noticeAmount = roundTo(NOTICE_DAYS.resignation * dailyWage, 2);
      noticeSection = "27(1), 27(3)";
    }
  }

  const total = roundTo(
    benefit +
      (noticeKind === "paid-to-worker" ? noticeAmount : 0) -
      (noticeKind === "owed-by-worker" ? noticeAmount : 0),
    2,
  );

  return {
    ok: true,
    result: {
      exit,
      wage,
      dailyWage,
      divisor: divisor.value,
      service: { years: y, months: m, days: d },
      completedYears: y,
      eligible,
      compensationDaysPerYear,
      compensation,
      gratuity,
      basis,
      benefit,
      benefitSection: useGratuity ? "2(10)" : BENEFIT_SECTION[exit],
      noticeKind,
      noticeDays,
      noticeAmount,
      noticeSection,
      total,
    },
  };
}

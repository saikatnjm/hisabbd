import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Flat rate to real (reducing-balance) interest rate: rules and assumptions (documented):
 *
 * 1. A FLAT rate charges interest on the original loan amount for the whole
 *    term, however much has already been repaid:
 *      years          = term in months ÷ 12
 *      total interest = P × flat rate × years
 *      total payable  = P + total interest
 *      instalment     = total payable ÷ N        (N equal instalments)
 * 2. Instalments are monthly (N = months, 12 a year) or weekly. Weekly means
 *    52 a year, so N = months × 52 ÷ 12 rounded to the nearest whole
 *    instalment (at least 1). Lenders count weeks differently (some use 50);
 *    this is a stated assumption, not a rule of any lender. The flat interest
 *    always uses the real term (months ÷ 12), not the rounded count.
 * 3. An optional UPFRONT FEE (processing, insurance, form fee) is deducted from
 *    the money handed over: received = P − fee. Interest and instalments are
 *    still based on P, because that is the amount the lender records.
 * 4. The REAL rate is the periodic rate i that makes the present value of the
 *    N instalments (paid at the END of each period, the first one a period
 *    after disbursement) equal to the money actually received:
 *      received = instalment × (1 − (1 + i)^−N) ÷ i
 *    The right side is strictly decreasing in i, so a bracketing bisection
 *    always finds the single root. It stops at relative width 1e-14 or after
 *    MAX_ITERATIONS steps, far tighter than the 2 decimals shown.
 * 5. Nominal yearly rate (APR) = i × periods per year (12 or 52). Effective
 *    yearly rate = (1 + i)^periods − 1. The nominal figure is the one to compare
 *    with a lender's quoted "declining balance" rate; the effective figure also
 *    counts the compounding of the instalments.
 * 6. 0% flat and no fee gives 0% real. A fee with 0% flat still gives a
 *    positive real rate because you repay more than you received.
 * 7. Limits: amount ৳0.01 to ৳1 lakh crore; flat rate 0–MAX_FLAT_RATE%; term a
 *    whole number of months, 1–MAX_TERM_MONTHS; fee 0 up to (but not including)
 *    the amount.
 * 8. NOT modelled: late fees, insurance premiums charged per instalment,
 *    grace periods, rounded instalments, lender-specific day counts or any
 *    legal limit on rates. Results estimate the standard method only.
 */

export const MAX_AMOUNT = 1_000_000_000_000;
export const MAX_FLAT_RATE = 100;
export const MAX_TERM_MONTHS = 360;
export const MAX_ITERATIONS = 400;
export const WEEKS_PER_YEAR = 52;

export const FREQUENCIES = ["monthly", "weekly"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

/** Instalments in a year. */
export const PERIODS_PER_YEAR: Readonly<Record<Frequency, number>> = { monthly: 12, weekly: WEEKS_PER_YEAR };

export type FlatRateField = "amount" | "rate" | "months" | "fee";
export type FlatRateErrorCode = NumberErrorCode | "fee-too-large";

export interface FlatRateError {
  field: FlatRateField;
  code: FlatRateErrorCode;
}

export interface FlatRateResult {
  amount: number;
  flatRatePercent: number;
  months: number;
  frequency: Frequency;
  fee: number;
  /** Money actually received: amount − fee. */
  received: number;
  instalmentCount: number;
  instalment: number;
  totalInterest: number;
  totalPayable: number;
  /** Everything paid beyond what was received: total payable − received (interest plus fee). */
  totalCost: number;
  /** Real rate per instalment period, in %. */
  periodicRatePercent: number;
  /** Real nominal yearly rate (periodic × periods a year), in %. */
  realRatePercent: number;
  /** Real effective yearly rate (1 + i)^periods − 1, in %. */
  effectiveAnnualRatePercent: number;
}

export type FlatRateCalculation = { ok: true; result: FlatRateResult } | { ok: false; errors: FlatRateError[] };

/** Number of equal instalments for a term in months. */
export function instalmentCount(months: number, frequency: Frequency): number {
  if (frequency === "monthly") return months;
  return Math.max(1, Math.round((months * WEEKS_PER_YEAR) / 12));
}

/** Present value of `count` instalments at periodic rate `i` (a fraction, i ≥ 0). */
export function presentValue(instalment: number, i: number, count: number): number {
  if (i < 1e-12) return instalment * count;
  return (instalment * -Math.expm1(-count * Math.log1p(i))) / i;
}

/**
 * Periodic rate (a fraction) at which `count` instalments of `instalment` are
 * worth `received` today. Returns 0 when the instalments sum to no more than
 * `received`. Requires received > 0 and instalment > 0.
 */
export function solvePeriodicRate(received: number, instalment: number, count: number): number {
  if (instalment * count <= received) return 0;
  let lo = 0;
  let hi = 1;
  while (presentValue(instalment, hi, count) > received && hi < 1e9) {
    lo = hi;
    hi *= 2;
  }
  for (let step = 0; step < MAX_ITERATIONS && hi - lo > 1e-14 * hi; step++) {
    const mid = (lo + hi) / 2;
    if (presentValue(instalment, mid, count) > received) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Validates the inputs and converts a flat rate to the real rate. `rawFee` may be blank (no fee). */
export function calculateFlatRate(
  rawAmount: string,
  rawRate: string,
  rawMonths: string,
  frequency: Frequency,
  rawFee: string,
): FlatRateCalculation {
  const errors: FlatRateError[] = [];
  const amount = checkNumber(rawAmount, { min: 0.01, max: MAX_AMOUNT });
  if (!amount.ok) errors.push({ field: "amount", code: amount.code });
  const rate = checkNumber(rawRate, { min: 0, max: MAX_FLAT_RATE });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });
  const months = checkNumber(rawMonths, { min: 1, max: MAX_TERM_MONTHS, integer: true });
  if (!months.ok) errors.push({ field: "months", code: months.code });
  const fee = rawFee.trim() === "" ? ({ ok: true, value: 0 } as const) : checkNumber(rawFee, { min: 0, max: MAX_AMOUNT });
  if (!fee.ok) errors.push({ field: "fee", code: fee.code });
  else if (amount.ok && fee.value >= amount.value) errors.push({ field: "fee", code: "fee-too-large" });
  if (!amount.ok || !rate.ok || !months.ok || !fee.ok || errors.length > 0) return { ok: false, errors };

  const P = amount.value;
  const received = P - fee.value;
  const totalInterest = (P * rate.value * (months.value / 12)) / 100;
  const totalPayable = P + totalInterest;
  const count = instalmentCount(months.value, frequency);
  const instalment = totalPayable / count;
  const periods = PERIODS_PER_YEAR[frequency];
  const i = solvePeriodicRate(received, instalment, count);

  return {
    ok: true,
    result: {
      amount: P,
      flatRatePercent: rate.value,
      months: months.value,
      frequency,
      fee: fee.value,
      received,
      instalmentCount: count,
      instalment,
      totalInterest,
      totalPayable,
      totalCost: totalPayable - received,
      periodicRatePercent: i * 100,
      realRatePercent: i * periods * 100,
      effectiveAnnualRatePercent: roundTo(Math.expm1(periods * Math.log1p(i)) * 100, 10),
    },
  };
}

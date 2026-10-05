import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * EMI / loan calculator rules and assumptions (documented):
 *
 * 1. Method: standard REDUCING-BALANCE loan with equal monthly instalments,
 *    paid at the end of each month, the first one a month after disbursement.
 *      r   = monthly interest rate as a fraction
 *            (yearly rate ÷ 12 ÷ 100, or the monthly rate ÷ 100)
 *      n   = number of monthly instalments
 *      EMI = P · r · (1 + r)^n ÷ ((1 + r)^n − 1)      (r > 0)
 *      EMI = P ÷ n                                    (r = 0)
 *    It is evaluated as P · r ÷ (1 − (1 + r)^−n) using log1p/expm1, which is
 *    algebraically identical but stays accurate for tiny rates and cannot overflow.
 * 2. Total payment = EMI × n, using the UNROUNDED EMI. Total interest = total
 *    payment − P. Nothing is rounded here; rounding is for display only.
 * 3. A yearly summary splits each instalment into principal and interest
 *    (interest = balance × r, principal = EMI − interest), computed in closed
 *    form for accuracy. The last year may hold fewer than 12 instalments; the
 *    closing balance is exactly 0.
 * 4. A yearly rate is a nominal rate compounded monthly (÷ 12). It is not an
 *    effective annual rate (APR/APY).
 * 5. NOT modelled: processing fees, insurance, charges, flat-rate loans,
 *    changing (floating) rates, grace periods, part-payments, day-count
 *    conventions, or rounding of instalments by a lender. Results are an
 *    estimate of the standard method, not any specific lender's terms.
 * 6. Limits: loan amount above 0 and up to 10^12 Taka; interest rate 0–100%;
 *    tenure a whole number of 1–600 months (up to 50 years).
 */

export const MAX_LOAN = 1_000_000_000_000;
export const MAX_RATE_PERCENT = 100;
export const MAX_TENURE_MONTHS = 600;
export const MAX_TENURE_YEARS = 50;

export type RateUnit = "year" | "month";
export type TenureUnit = "years" | "months";

export type EmiField = "amount" | "rate" | "tenure";
export type EmiErrorCode = NumberErrorCode;

export interface EmiError {
  field: EmiField;
  code: EmiErrorCode;
}

export interface EmiInputs {
  amount: string;
  rate: string;
  rateUnit: RateUnit;
  tenure: string;
  tenureUnit: TenureUnit;
}

export interface YearRow {
  /** 1-based loan year. */
  year: number;
  /** Instalments paid in this year (12, or fewer in the last year). */
  instalments: number;
  principalPaid: number;
  interestPaid: number;
  /** Balance still owed after the last instalment of this year. */
  remainingBalance: number;
}

export interface EmiResult {
  amount: number;
  /** Interest rate as entered, with its unit. */
  rateInput: number;
  rateUnit: RateUnit;
  /** Monthly rate as a percentage, e.g. 0.75 for 9% per year. */
  monthlyRatePercent: number;
  months: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  principalSharePercent: number;
  interestSharePercent: number;
  schedule: YearRow[];
}

export type EmiCalculation = { ok: true; result: EmiResult } | { ok: false; errors: EmiError[] };

/** Monthly rate as a fraction for a rate given in percent per year or per month. */
export function monthlyRate(ratePercent: number, unit: RateUnit): number {
  return unit === "year" ? ratePercent / 12 / 100 : ratePercent / 100;
}

/** Total number of monthly instalments for a tenure in years or months. */
export function tenureToMonths(tenure: number, unit: TenureUnit): number {
  return unit === "years" ? tenure * 12 : tenure;
}

/** Equal monthly instalment on a reducing balance. `rate` is the monthly rate as a fraction. */
export function calculateEmi(principal: number, rate: number, months: number): number {
  if (rate === 0) return principal / months;
  return (principal * rate) / -Math.expm1(-months * Math.log1p(rate));
}

/**
 * Year-by-year principal, interest and closing balance for the whole loan.
 * Uses the closed form of the reducing-balance schedule: the principal part
 * of instalment k is (EMI − P·r)·(1 + r)^(k−1), and EMI − P·r is evaluated as
 * P·r ÷ ((1 + r)^n − 1). Unlike subtracting month by month, this stays exact
 * even at very high rates over long tenures, so the principal parts always add
 * up to the loan amount.
 */
export function yearlySchedule(principal: number, rate: number, months: number, emi: number): YearRow[] {
  const growthLog = Math.log1p(rate);
  const firstPrincipal = rate === 0 ? principal / months : (principal * rate) / Math.expm1(months * growthLog);
  /** Principal repaid by the end of month k. */
  const repaidAfter = (k: number) =>
    rate === 0 ? firstPrincipal * k : (firstPrincipal * Math.expm1(k * growthLog)) / rate;

  const rows: YearRow[] = [];
  for (let startMonth = 1; startMonth <= months; startMonth += 12) {
    const endMonth = Math.min(startMonth + 11, months);
    const instalments = endMonth - startMonth + 1;
    const isLast = endMonth === months;
    const principalPaid = (isLast ? principal : repaidAfter(endMonth)) - repaidAfter(startMonth - 1);
    rows.push({
      year: Math.ceil(endMonth / 12),
      instalments,
      principalPaid,
      interestPaid: emi * instalments - principalPaid,
      remainingBalance: isLast ? 0 : Math.max(0, principal - repaidAfter(endMonth)),
    });
  }
  return rows;
}

export function calculateLoan(raw: EmiInputs): EmiCalculation {
  const errors: EmiError[] = [];

  const amount = checkNumber(raw.amount, { min: 0, minExclusive: true, max: MAX_LOAN });
  if (!amount.ok) errors.push({ field: "amount", code: amount.code });

  const rate = checkNumber(raw.rate, { min: 0, max: MAX_RATE_PERCENT });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });

  const maxTenure = raw.tenureUnit === "years" ? MAX_TENURE_YEARS : MAX_TENURE_MONTHS;
  const tenure = checkNumber(raw.tenure, { min: 1, max: maxTenure, integer: true });
  if (!tenure.ok) errors.push({ field: "tenure", code: tenure.code });

  if (!amount.ok || !rate.ok || !tenure.ok) return { ok: false, errors };

  const months = tenureToMonths(tenure.value, raw.tenureUnit);
  const r = monthlyRate(rate.value, raw.rateUnit);
  const emi = calculateEmi(amount.value, r, months);
  const totalPayment = r === 0 ? amount.value : emi * months;
  const totalInterest = Math.max(0, totalPayment - amount.value);
  const principalShare = (amount.value / totalPayment) * 100;

  return {
    ok: true,
    result: {
      amount: amount.value,
      rateInput: rate.value,
      rateUnit: raw.rateUnit,
      monthlyRatePercent: r * 100,
      months,
      emi,
      totalInterest,
      totalPayment,
      principalSharePercent: principalShare,
      interestSharePercent: 100 - principalShare,
      schedule: yearlySchedule(amount.value, r, months, emi),
    },
  };
}

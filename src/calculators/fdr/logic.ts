import { checkNumber, type NumberErrorCode } from "@/lib/number";
import { exciseForBalance, type ExciseBand, type ExciseMode, EXCISE_BANDS } from "./deposit-tax";

/*
 * FDR (fixed deposit) calculator rules and assumptions (documented):
 *
 * 1. Inputs: principal P (Taka), yearly interest rate R% (r = R ÷ 100),
 *    term n in whole months, and how interest is handled:
 *      simple     interest is not added to the deposit (paid out, or paid
 *                 at maturity): value after k months = P × (1 + r × k ÷ 12)
 *      monthly / quarterly / yearly
 *                 interest is credited and reinvested every p = 1, 3 or 12
 *                 months: value = P × (1 + r × p ÷ 12)^⌊k ÷ p⌋ × (1 + r × (k mod p) ÷ 12)
 *    A part period at the end (e.g. 18 months with yearly compounding) earns
 *    simple interest for the months it lasts. The rate is a nominal yearly
 *    rate; a month is 1/12 of a year (no day count).
 * 2. Maturity value (before tax) = value after n months. Gross interest =
 *    maturity value − P. With simple interest the interest is the same
 *    whether it is paid out along the way or at the end.
 * 3. Tax at source = tax rate × gross interest (a rate the user picks or
 *    types; presets in deposit-tax.ts). Banks deduct it each time they credit
 *    interest; when interest is reinvested, the tax taken earlier no longer
 *    earns interest, so a bank's net figure can be slightly lower. This is
 *    deliberately not modelled so that the before-tax figures match the
 *    usual formula.
 * 4. Excise duty is charged per account per calendar year on the highest
 *    balance. Estimated here as one charge per started 12 months of the term
 *    (⌈n ÷ 12⌉ charges), each on the value at the end of that term-year
 *    (the highest value in it, since it only grows), using the band table
 *    passed in. Real charges depend on how many 31 Decembers fall inside the
 *    term. The user can instead enter a total, or leave excise out.
 * 5. Net amount received = maturity value − tax − excise. Net interest = net
 *    amount − P. Nothing is rounded here; rounding is for display only.
 * 6. NOT modelled: day-count conventions (actual/360, actual/365), bank
 *    rounding, early encashment penalties, account fees, zakat, changing
 *    rates on renewal, and different tax rates for companies or trusts
 *    (enter those as a custom rate).
 * 7. Limits: principal above ৳0 up to 10^12; rate 0–100%; term 1–360 months
 *    (whole months); tax rate 0–100%; custom excise ৳0 up to 10^12.
 */

export const MAX_PRINCIPAL = 1_000_000_000_000;
export const MAX_RATE_PERCENT = 100;
export const MAX_TERM_MONTHS = 360;
export const MAX_TAX_PERCENT = 100;
export const MAX_EXCISE = 1_000_000_000_000;

export type Compounding = "simple" | "monthly" | "quarterly" | "yearly";
export const COMPOUNDING_OPTIONS: readonly Compounding[] = ["simple", "monthly", "quarterly", "yearly"];

/** Months between interest credits for each compounding choice (simple: never). */
export const COMPOUNDING_MONTHS: Record<Exclude<Compounding, "simple">, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

export type FdrField = "principal" | "rate" | "term" | "tax" | "excise";

export interface FdrError {
  field: FdrField;
  code: NumberErrorCode;
}

export interface FdrInputs {
  principal: string;
  /** Yearly interest rate in percent. */
  rate: string;
  /** Term in whole months. */
  termMonths: string;
  compounding: Compounding;
  /** Tax at source in percent. */
  taxRate: string;
  exciseMode: ExciseMode;
  /** Total excise duty in Taka; read only when exciseMode is "custom". */
  exciseAmount: string;
}

export interface FdrYearRow {
  /** 1-based year of the term. */
  year: number;
  /** Months of the term in this year (12, or fewer in the last year). */
  months: number;
  /** Interest earned in this year, before tax. */
  interest: number;
  /** Value of the deposit at the end of this year (or at maturity). */
  balance: number;
  /** Estimated excise duty for this year (0 unless the band table is used). */
  excise: number;
}

export interface FdrResult {
  principal: number;
  ratePercent: number;
  months: number;
  compounding: Compounding;
  taxPercent: number;
  exciseMode: ExciseMode;
  /** Value at maturity before tax and excise. */
  maturityValue: number;
  grossInterest: number;
  tax: number;
  excise: number;
  /** Amount received after tax and excise (maturity value − tax − excise). */
  netAmount: number;
  /** netAmount − principal. Can be negative if excise exceeds the interest. */
  netInterest: number;
  /** Effective yearly rate before tax: (1 + r·p/12)^(12/p) − 1 for compounding, R for simple. */
  effectiveAnnualRatePercent: number;
  schedule: FdrYearRow[];
}

export type FdrCalculation = { ok: true; result: FdrResult } | { ok: false; errors: FdrError[] };

/** Value of a deposit of `principal` after `months`, before tax (rule 1). `rate` is a yearly fraction. */
export function fdrValue(principal: number, rate: number, months: number, compounding: Compounding): number {
  if (compounding === "simple") return principal * (1 + (rate * months) / 12);
  const period = COMPOUNDING_MONTHS[compounding];
  const fullPeriods = Math.floor(months / period);
  const rest = months - fullPeriods * period;
  return principal * (1 + (rate * period) / 12) ** fullPeriods * (1 + (rate * rest) / 12);
}

/** Effective yearly rate (fraction) before tax for a nominal yearly `rate` (fraction). */
export function effectiveAnnualRate(rate: number, compounding: Compounding): number {
  if (compounding === "simple") return rate;
  const period = COMPOUNDING_MONTHS[compounding];
  return (1 + (rate * period) / 12) ** (12 / period) - 1;
}

/** Year-by-year interest, closing value and estimated excise (rule 4). */
export function fdrSchedule(
  principal: number,
  rate: number,
  months: number,
  compounding: Compounding,
  bands: readonly ExciseBand[] | null,
): FdrYearRow[] {
  const rows: FdrYearRow[] = [];
  let previous = principal;
  for (let year = 1; (year - 1) * 12 < months; year++) {
    const end = Math.min(year * 12, months);
    const balance = fdrValue(principal, rate, end, compounding);
    rows.push({
      year,
      months: end - (year - 1) * 12,
      interest: balance - previous,
      balance,
      excise: bands ? exciseForBalance(balance, bands) : 0,
    });
    previous = balance;
  }
  return rows;
}

/** Validates raw input and works out the FDR maturity, tax, excise and net amount. */
export function calculateFdr(raw: FdrInputs, bands: readonly ExciseBand[] = EXCISE_BANDS): FdrCalculation {
  const errors: FdrError[] = [];

  const principal = checkNumber(raw.principal, { min: 0, minExclusive: true, max: MAX_PRINCIPAL });
  if (!principal.ok) errors.push({ field: "principal", code: principal.code });

  const rate = checkNumber(raw.rate, { min: 0, max: MAX_RATE_PERCENT });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });

  const term = checkNumber(raw.termMonths, { min: 1, max: MAX_TERM_MONTHS, integer: true });
  if (!term.ok) errors.push({ field: "term", code: term.code });

  const tax = checkNumber(raw.taxRate, { min: 0, max: MAX_TAX_PERCENT });
  if (!tax.ok) errors.push({ field: "tax", code: tax.code });

  const excise = raw.exciseMode === "custom" ? checkNumber(raw.exciseAmount, { min: 0, max: MAX_EXCISE }) : null;
  if (excise && !excise.ok) errors.push({ field: "excise", code: excise.code });

  if (!principal.ok || !rate.ok || !term.ok || !tax.ok || (excise && !excise.ok)) return { ok: false, errors };

  const r = rate.value / 100;
  const months = term.value;
  const schedule = fdrSchedule(principal.value, r, months, raw.compounding, raw.exciseMode === "bands" ? bands : null);
  const maturityValue = fdrValue(principal.value, r, months, raw.compounding);
  const grossInterest = maturityValue - principal.value;
  const taxAmount = (grossInterest * tax.value) / 100;
  const exciseAmount =
    raw.exciseMode === "custom" && excise?.ok
      ? excise.value
      : schedule.reduce((sum, row) => sum + row.excise, 0);
  const netAmount = maturityValue - taxAmount - exciseAmount;

  return {
    ok: true,
    result: {
      principal: principal.value,
      ratePercent: rate.value,
      months,
      compounding: raw.compounding,
      taxPercent: tax.value,
      exciseMode: raw.exciseMode,
      maturityValue,
      grossInterest,
      tax: taxAmount,
      excise: exciseAmount,
      netAmount,
      netInterest: netAmount - principal.value,
      effectiveAnnualRatePercent: effectiveAnnualRate(r, raw.compounding) * 100,
      schedule,
    },
  };
}

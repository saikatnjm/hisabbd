import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Simple and compound interest rules (documented assumptions):
 *
 * 1. Notation follows the Bangladesh school textbooks (মুনাফা chapter):
 *    P = principal (আসল), r = yearly rate as a decimal (r% ÷ 100), n = years.
 * 2. Simple interest: I = P × r × n; amount A = P + I = P(1 + rn).
 * 3. Compound interest, compounded m times a year (1 yearly, 2 half-yearly,
 *    4 quarterly, 12 monthly): C = P(1 + r/m)^(m × n); interest = C − P.
 *    With m = 1 this is the textbook C = P(1 + r)ⁿ.
 * 4. n may be a fraction of a year (e.g. 2.5). The compound formula is then
 *    applied with a fractional exponent, the standard continuous extension;
 *    banks may treat part periods differently, so the page says so.
 * 5. The year-by-year table has one row per whole year and a last row for any
 *    remaining part year, at most MAX_YEARS rows.
 * 6. Nothing is rounded here except floating-point noise (10 decimals); the UI
 *    shows Taka to the paisa.
 * 7. Limits: principal ৳0.01 to ৳1 lakh crore; rate 0–100% a year; time
 *    more than 0 and up to 50 years.
 * 8. No bank rates or taxes are built in: banks set their own rates and how
 *    often they compound, and source tax on bank interest is covered by the
 *    FDR and DPS calculators.
 */

export const MAX_PRINCIPAL = 1_000_000_000_000;
export const MAX_RATE = 100;
export const MAX_YEARS = 50;

export const COMPOUNDING = ["yearly", "half-yearly", "quarterly", "monthly"] as const;
export type Compounding = (typeof COMPOUNDING)[number];

/** Compounding periods in a year. */
export const PERIODS_PER_YEAR: Readonly<Record<Compounding, number>> = {
  yearly: 1,
  "half-yearly": 2,
  quarterly: 4,
  monthly: 12,
};

export type InterestField = "principal" | "rate" | "years";

export interface InterestError {
  field: InterestField;
  code: NumberErrorCode;
}

export interface InterestYearRow {
  /** Time from the start in years (1, 2, … and the final part year, e.g. 2.5). */
  years: number;
  simpleAmount: number;
  compoundAmount: number;
}

export interface InterestResult {
  principal: number;
  ratePercent: number;
  years: number;
  compounding: Compounding;
  simpleInterest: number;
  simpleAmount: number;
  compoundInterest: number;
  compoundAmount: number;
  /** compoundInterest − simpleInterest (0 or more for a positive rate). */
  difference: number;
  /** Yearly rate that gives the same growth with yearly compounding, in %. */
  effectiveAnnualRatePercent: number;
  schedule: InterestYearRow[];
}

export type InterestCalculation = { ok: true; result: InterestResult } | { ok: false; errors: InterestError[] };

const clean = (value: number) => roundTo(value, 10);

/** Simple interest I = P × r × n, with the rate in %. */
export function simpleInterest(principal: number, ratePercent: number, years: number): number {
  return clean((principal * ratePercent * years) / 100);
}

/** Compound amount C = P(1 + r/m)^(m × n), with the rate in %. */
export function compoundAmount(principal: number, ratePercent: number, years: number, compounding: Compounding): number {
  const m = PERIODS_PER_YEAR[compounding];
  return clean(principal * (1 + ratePercent / 100 / m) ** (m * years));
}

/** Validates the three numbers and computes both kinds of interest and the year-by-year table. */
export function calculateInterest(
  rawPrincipal: string,
  rawRate: string,
  rawYears: string,
  compounding: Compounding,
): InterestCalculation {
  const errors: InterestError[] = [];
  const principal = checkNumber(rawPrincipal, { min: 0.01, max: MAX_PRINCIPAL });
  if (!principal.ok) errors.push({ field: "principal", code: principal.code });
  const rate = checkNumber(rawRate, { min: 0, max: MAX_RATE });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });
  const years = checkNumber(rawYears, { min: 0, minExclusive: true, max: MAX_YEARS });
  if (!years.ok) errors.push({ field: "years", code: years.code });
  if (!principal.ok || !rate.ok || !years.ok) return { ok: false, errors };

  const P = principal.value;
  const r = rate.value;
  const n = years.value;
  const si = simpleInterest(P, r, n);
  const ca = compoundAmount(P, r, n, compounding);
  const marks = Array.from({ length: Math.floor(n) }, (_, i) => i + 1);
  if (n % 1 !== 0) marks.push(n);
  const m = PERIODS_PER_YEAR[compounding];

  return {
    ok: true,
    result: {
      principal: P,
      ratePercent: r,
      years: n,
      compounding,
      simpleInterest: si,
      simpleAmount: clean(P + si),
      compoundInterest: clean(ca - P),
      compoundAmount: ca,
      difference: clean(ca - P - si),
      effectiveAnnualRatePercent: clean(((1 + r / 100 / m) ** m - 1) * 100),
      schedule: marks.map((t) => ({
        years: t,
        simpleAmount: clean(P + simpleInterest(P, r, t)),
        compoundAmount: compoundAmount(P, r, t, compounding),
      })),
    },
  };
}

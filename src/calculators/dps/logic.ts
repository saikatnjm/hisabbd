import { checkNumber, type NumberErrorCode } from "@/lib/number";
import { exciseForBalance, EXCISE_BANDS, type ExciseBand, type ExciseMode } from "@/calculators/fdr/deposit-tax";

/*
 * DPS (monthly deposit scheme) calculator rules and assumptions (documented):
 *
 * 1. Timing: the same instalment A is paid at the START of every month for
 *    n = 12 × years months (an annuity-due), and the scheme matures at the
 *    END of month n, one month after the last instalment. Each instalment
 *    earns interest for the month it is paid in.
 * 2. Interest: yearly nominal rate R% (r = R ÷ 100), monthly rate i = r ÷ 12.
 *    Each month's interest = balance × i, where the balance includes that
 *    month's instalment. Interest is credited (added to the balance, so it
 *    earns interest too) every p months: p = 1 (monthly), 3 (quarterly) or
 *    12 (yearly). Between credits it accrues without compounding.
 *    With monthly compounding this is the standard annuity-due formula:
 *      maturity = A × ((1 + i)^n − 1) ÷ i × (1 + i)          (i > 0)
 *      maturity = A × n                                       (i = 0)
 *    Quarterly and yearly use the same month-by-month rule (exact, no
 *    closed form needed for at most 360 months). Most calculators and many
 *    bank tables compound monthly, but this is not confirmed by an official
 *    source, so it is a choice and the page says to check your bank.
 * 3. Total deposits = A × n. Gross interest = maturity − total deposits.
 * 4. Tax at source = tax rate × gross interest (rate chosen or typed by the
 *    user; presets in fdr/deposit-tax.ts). Banks deduct it when interest is
 *    credited; if your bank does that during the term, the tax taken stops
 *    earning interest and its net figure is slightly lower. Not modelled.
 * 5. Excise duty: one charge per scheme year, on the balance at the end of
 *    that year (the highest balance in it), from the band table passed in.
 *    Real charges are per calendar year (Jan–Dec), so the count depends on
 *    the opening month. The user can instead enter a total, or leave it out.
 * 6. Net amount received = maturity − tax − excise. Nothing is rounded here;
 *    rounding is for display only.
 * 7. NOT modelled: late or missed instalments and their fines, early
 *    closure rules, bank-specific maturity tables, day count, fees, and the
 *    different rates banks set for different tenures.
 * 8. Limits: instalment above ৳0 up to 10^10; rate 0–100%; tenure 1–30
 *    whole years; tax rate 0–100%; custom excise ৳0 up to 10^12.
 */

export const MAX_INSTALMENT = 10_000_000_000;
export const MAX_RATE_PERCENT = 100;
export const MAX_TENURE_YEARS = 30;
export const MAX_TAX_PERCENT = 100;
export const MAX_EXCISE = 1_000_000_000_000;

export type DpsCompounding = "monthly" | "quarterly" | "yearly";
export const DPS_COMPOUNDING_OPTIONS: readonly DpsCompounding[] = ["monthly", "quarterly", "yearly"];

/** Months between interest credits. */
export const DPS_COMPOUNDING_MONTHS: Record<DpsCompounding, number> = { monthly: 1, quarterly: 3, yearly: 12 };

export type DpsField = "instalment" | "rate" | "tenure" | "tax" | "excise";

export interface DpsError {
  field: DpsField;
  code: NumberErrorCode;
}

export interface DpsInputs {
  instalment: string;
  /** Yearly interest rate in percent. */
  rate: string;
  /** Tenure in whole years. */
  tenureYears: string;
  compounding: DpsCompounding;
  /** Tax at source in percent. */
  taxRate: string;
  exciseMode: ExciseMode;
  /** Total excise duty in Taka; read only when exciseMode is "custom". */
  exciseAmount: string;
}

export interface DpsYearRow {
  /** 1-based scheme year. */
  year: number;
  /** Instalments paid in this year (always 12). */
  deposits: number;
  /** Interest earned in this year, before tax. */
  interest: number;
  /** Total paid in so far. */
  totalDeposits: number;
  /** Balance at the end of this year, including interest (before tax). */
  balance: number;
  /** Estimated excise duty for this year (0 unless the band table is used). */
  excise: number;
}

export interface DpsResult {
  instalment: number;
  ratePercent: number;
  years: number;
  months: number;
  compounding: DpsCompounding;
  taxPercent: number;
  exciseMode: ExciseMode;
  totalDeposits: number;
  /** Value at maturity before tax and excise. */
  maturityValue: number;
  grossInterest: number;
  tax: number;
  excise: number;
  /** Amount received after tax and excise. */
  netAmount: number;
  /** netAmount − totalDeposits. */
  netInterest: number;
  schedule: DpsYearRow[];
}

export type DpsCalculation = { ok: true; result: DpsResult } | { ok: false; errors: DpsError[] };

/**
 * Closed-form maturity value for monthly compounding (rule 2):
 * A × ((1 + i)^n − 1) ÷ i × (1 + i), with i the monthly rate as a fraction.
 * Uses expm1/log1p so tiny rates stay accurate.
 */
export function dpsMaturityMonthly(instalment: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return instalment * months;
  return ((instalment * Math.expm1(months * Math.log1p(monthlyRate))) / monthlyRate) * (1 + monthlyRate);
}

/**
 * Balance at the end of every month (index k − 1 for month k), including
 * interest accrued but not yet credited. `rate` is the yearly rate as a fraction.
 */
export function dpsMonthlyBalances(
  instalment: number,
  rate: number,
  months: number,
  compounding: DpsCompounding,
): number[] {
  const i = rate / 12;
  const period = DPS_COMPOUNDING_MONTHS[compounding];
  const balances: number[] = [];
  let credited = 0;
  let accrued = 0;
  for (let month = 1; month <= months; month++) {
    credited += instalment;
    accrued += credited * i;
    if (month % period === 0 || month === months) {
      credited += accrued;
      accrued = 0;
    }
    balances.push(credited + accrued);
  }
  return balances;
}

/** Year-by-year deposits, interest, balance and estimated excise (rule 5). */
export function dpsSchedule(
  instalment: number,
  rate: number,
  years: number,
  compounding: DpsCompounding,
  bands: readonly ExciseBand[] | null,
): DpsYearRow[] {
  const months = years * 12;
  const balances = compounding === "monthly" ? null : dpsMonthlyBalances(instalment, rate, months, compounding);
  const balanceAfter = (month: number) =>
    balances ? (balances[month - 1] ?? 0) : dpsMaturityMonthly(instalment, rate / 12, month);

  const rows: DpsYearRow[] = [];
  let previous = 0;
  for (let year = 1; year <= years; year++) {
    const balance = balanceAfter(year * 12);
    const deposits = instalment * 12;
    rows.push({
      year,
      deposits,
      interest: balance - previous - deposits,
      totalDeposits: instalment * 12 * year,
      balance,
      excise: bands ? exciseForBalance(balance, bands) : 0,
    });
    previous = balance;
  }
  return rows;
}

/** Validates raw input and works out the DPS maturity, interest, tax, excise and net amount. */
export function calculateDps(raw: DpsInputs, bands: readonly ExciseBand[] = EXCISE_BANDS): DpsCalculation {
  const errors: DpsError[] = [];

  const instalment = checkNumber(raw.instalment, { min: 0, minExclusive: true, max: MAX_INSTALMENT });
  if (!instalment.ok) errors.push({ field: "instalment", code: instalment.code });

  const rate = checkNumber(raw.rate, { min: 0, max: MAX_RATE_PERCENT });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });

  const tenure = checkNumber(raw.tenureYears, { min: 1, max: MAX_TENURE_YEARS, integer: true });
  if (!tenure.ok) errors.push({ field: "tenure", code: tenure.code });

  const tax = checkNumber(raw.taxRate, { min: 0, max: MAX_TAX_PERCENT });
  if (!tax.ok) errors.push({ field: "tax", code: tax.code });

  const excise = raw.exciseMode === "custom" ? checkNumber(raw.exciseAmount, { min: 0, max: MAX_EXCISE }) : null;
  if (excise && !excise.ok) errors.push({ field: "excise", code: excise.code });

  if (!instalment.ok || !rate.ok || !tenure.ok || !tax.ok || (excise && !excise.ok)) return { ok: false, errors };

  const r = rate.value / 100;
  const years = tenure.value;
  const months = years * 12;
  const schedule = dpsSchedule(instalment.value, r, years, raw.compounding, raw.exciseMode === "bands" ? bands : null);
  const maturityValue = schedule.at(-1)?.balance ?? 0;
  const totalDeposits = instalment.value * months;
  const grossInterest = maturityValue - totalDeposits;
  const taxAmount = (grossInterest * tax.value) / 100;
  const exciseAmount =
    raw.exciseMode === "custom" && excise?.ok
      ? excise.value
      : schedule.reduce((sum, row) => sum + row.excise, 0);
  const netAmount = maturityValue - taxAmount - exciseAmount;

  return {
    ok: true,
    result: {
      instalment: instalment.value,
      ratePercent: rate.value,
      years,
      months,
      compounding: raw.compounding,
      taxPercent: tax.value,
      exciseMode: raw.exciseMode,
      totalDeposits,
      maturityValue,
      grossInterest,
      tax: taxAmount,
      excise: exciseAmount,
      netAmount,
      netInterest: netAmount - totalDeposits,
      schedule,
    },
  };
}

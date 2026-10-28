import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * Sanchayapatra (national savings certificate) profit calculator rules and
 * assumptions (documented):
 *
 * 1. Rates are DATA, not logic. SANCHAYAPATRA_SCHEMES below holds the year-end
 *    profit rates from the Internal Resources Division (IRD) order no.
 *    08.00.0000.000.041.22.0006.20.85 of 30 June 2025, effective 1 July 2025,
 *    as republished on each scheme's National Savings Directorate (NSD) sheet.
 *    The government kept these rates unchanged in January 2026 and again for
 *    July–December 2026 (reported 2 July 2026). Rates are reviewed every six
 *    months; a certificate keeps the rate of its issue date for its whole term.
 * 2. Each scheme has two tiers, decided by the investor's CUMULATIVE investment
 *    across all national savings schemes (not just this certificate): up to
 *    ৳7,50,000, and above ৳7,50,000. An amount above ৳7,50,000 is always in the
 *    upper tier.
 * 3. The rate held to maturity is the last year-end rate (e.g. 11.93% a year for
 *    Paribar, up to ৳7.5 lakh). The calculator assumes the certificate is held to
 *    maturity and uses that rate, which the user can override (for example with
 *    the rate printed on an older certificate).
 * 4. Profit is SIMPLE (no compounding): yearly profit = amount × rate ÷ 100.
 *    - monthly payout (Paribar, Pensioner):  per month   = yearly ÷ 12, 60 payments
 *    - quarterly payout (3-month):            per quarter = yearly ÷ 4,  12 payments
 *    - at maturity (5-year Bangladesh):       once        = yearly × 5
 *    The NSD scheme sheets describe no compounding, and periodic schemes pay
 *    profit out rather than adding it to the principal.
 * 5. Source tax = gross profit × tax rate ÷ 100, deducted from every payment.
 *    Net profit = gross − tax. Total received over the term = amount + total net
 *    profit. The principal comes back at maturity.
 * 6. Source tax is an input, pre-filled with 10% (SOURCE_TAX_RULES.standard):
 *    the Income Tax Act 2023 section 105 rate, which NBR confirmed (Feb 2026)
 *    for a total investment above ৳5 lakh and which the FY2026-27 Finance Bill
 *    applied to all certificates. Lower rates that applied before the 2026-27
 *    budget (5% for a total up to ৳5 lakh; 0% for Pensioner up to ৳5 lakh) are
 *    data with sources, but whether they still apply after 1 July 2026 could not
 *    be confirmed from an official source, so they are not pre-filled.
 * 7. Early encashment: the official sheets say profit is then recalculated at
 *    the year-end rate for the completed years, and any extra profit already
 *    paid is deducted from the principal. That is NOT modelled here.
 * 8. Limits: amount ৳1,000 to ৳1,00,00,00,000 (10^9); rate 0–100%; tax 0–100%.
 *    Official purchase limits (e.g. ৳30 lakh single for Bangladesh Sanchayapatra)
 *    are shown as information, not enforced.
 * 9. No rounding in logic. Paisa rounding happens only when figures are shown,
 *    so a rounded total can differ by a paisa from rounded payment × count.
 */

export interface SanchayapatraSource {
  title: string;
  url: string;
}

export type SchemeId = "bangladesh" | "threeMonth" | "paribar" | "pensioner";
export type Payout = "monthly" | "quarterly" | "maturity";
export type RateTier = "upTo" | "above";

export interface SanchayapatraScheme {
  id: SchemeId;
  name: string;
  nameBn: string;
  tenureMonths: number;
  payout: Payout;
  /**
   * Year-end profit rates (% a year) by tier: index 0 is "after year 1", the
   * last entry is the rate held to maturity.
   */
  rateTiers: Record<RateTier, readonly number[]>;
  /** Smallest certificate denomination (information only). */
  minDenomination: number;
  /** Official purchase ceiling in a single name (information only). */
  singleNameLimit: number;
  /** Official purchase ceiling in joint names, if joint purchase is allowed. */
  jointNameLimit: number | null;
  source: SanchayapatraSource;
  /** Date the rates took effect (YYYY-MM-DD). */
  effectiveFrom: string;
  /** Date the source was last checked (YYYY-MM-DD). */
  checkedOn: string;
}

/** Date every figure in this file was last checked against its source. */
export const SANCHAYAPATRA_CHECKED_ON = "2026-10-28";
/** Date the current rates took effect. */
export const RATES_EFFECTIVE_FROM = "2025-07-01";

/** Cumulative investment that separates the two rate tiers: ৳7,50,000. */
export const RATE_TIER_LIMIT = 750_000;

const NSD_FILES = "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nationalsavings";

/** The rate order itself (IRD, 30 June 2025), as published by NSD. */
export const IRD_RATE_ORDER: SanchayapatraSource = {
  title: "IRD order no. 08.00.0000.000.041.22.0006.20.85, 30 June 2025 (rates from 1 July 2025)",
  url: `${NSD_FILES}/2024/12/5123d60a893e49c2923d35d7e0c1b833.pdf`,
};

/** NSD page listing the rate order and every scheme sheet. */
export const NSD_SCHEMES_PAGE: SanchayapatraSource = {
  title: "National Savings Directorate: Savings certificates (সঞ্চয়পত্রসমূহ)",
  url: "https://nationalsavings.gov.bd/pages/static-pages/%E0%A6%B8%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A7%9F%E0%A6%AA%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%B8%E0%A6%AE%E0%A7%82%E0%A6%B9-f4u5hn-6a73fa5597bfb19c478c1c10",
};

/** Report that the rates were kept unchanged for July–December 2026. */
export const RATES_UNCHANGED_2026: SanchayapatraSource = {
  title: "Bangla Tribune, 2 July 2026: সঞ্চয়পত্রের মুনাফার হার অপরিবর্তিত",
  url: "https://www.banglatribune.com/business/money-and-investment/954941",
};

/**
 * The four savings certificates. Review after every six-monthly rate decision
 * (January and July).
 */
export const SANCHAYAPATRA_SCHEMES = {
  bangladesh: {
    id: "bangladesh",
    name: "5-year Bangladesh Sanchayapatra",
    nameBn: "5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্র",
    tenureMonths: 60,
    payout: "maturity",
    rateTiers: { upTo: [9.74, 10.21, 10.72, 11.26, 11.83], above: [9.72, 10.19, 10.7, 11.23, 11.8] },
    minDenomination: 10,
    singleNameLimit: 3_000_000,
    jointNameLimit: 6_000_000,
    source: {
      title: "NSD scheme sheet: 5-year Bangladesh Sanchayapatra",
      url: `${NSD_FILES}/2024/12/2fe2b79cf9e544b78ced08ddf6da94f5.pdf`,
    },
    effectiveFrom: RATES_EFFECTIVE_FROM,
    checkedOn: SANCHAYAPATRA_CHECKED_ON,
  },
  threeMonth: {
    id: "threeMonth",
    name: "3-month profit-bearing Sanchayapatra",
    nameBn: "তিন মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র",
    tenureMonths: 36,
    payout: "quarterly",
    rateTiers: { upTo: [10.65, 11.22, 11.82], above: [10.6, 11.16, 11.77] },
    minDenomination: 100_000,
    singleNameLimit: 3_000_000,
    jointNameLimit: 6_000_000,
    source: {
      title: "NSD scheme sheet: 3-month profit-bearing Sanchayapatra",
      url: `${NSD_FILES}/2026/5/68bc11a3-6064-4175-8ab5-d22ba356b26f.pdf`,
    },
    effectiveFrom: RATES_EFFECTIVE_FROM,
    checkedOn: SANCHAYAPATRA_CHECKED_ON,
  },
  paribar: {
    id: "paribar",
    name: "Paribar (Family) Sanchayapatra",
    nameBn: "পরিবার সঞ্চয়পত্র",
    tenureMonths: 60,
    payout: "monthly",
    rateTiers: { upTo: [9.81, 10.29, 10.8, 11.35, 11.93], above: [9.72, 10.19, 10.7, 11.23, 11.8] },
    minDenomination: 10_000,
    singleNameLimit: 4_500_000,
    jointNameLimit: null,
    source: {
      title: "NSD scheme sheet: Paribar Sanchayapatra",
      url: `${NSD_FILES}/2024/12/2a27049e274a4773a99603bd4d30125c.pdf`,
    },
    effectiveFrom: RATES_EFFECTIVE_FROM,
    checkedOn: SANCHAYAPATRA_CHECKED_ON,
  },
  pensioner: {
    id: "pensioner",
    name: "Pensioner Sanchayapatra",
    nameBn: "পেনশনার সঞ্চয়পত্র",
    tenureMonths: 60,
    payout: "monthly",
    rateTiers: { upTo: [9.84, 10.32, 10.84, 11.39, 11.98], above: [9.72, 10.19, 10.7, 11.23, 11.8] },
    minDenomination: 50_000,
    singleNameLimit: 5_000_000,
    jointNameLimit: null,
    source: {
      title: "NSD scheme sheet: Pensioner Sanchayapatra",
      url: `${NSD_FILES}/2026/3/cbf7785e-3f30-4697-94f8-ddc97c82ca6f.pdf`,
    },
    effectiveFrom: RATES_EFFECTIVE_FROM,
    checkedOn: SANCHAYAPATRA_CHECKED_ON,
  },
} as const satisfies Record<SchemeId, SanchayapatraScheme>;

export const SCHEME_IDS: readonly SchemeId[] = ["paribar", "bangladesh", "threeMonth", "pensioner"];

/**
 * Combined ceiling for Bangladesh, 3-month and Paribar certificates together
 * (NSD Paribar sheet): ৳50 lakh in a single name or ৳1 crore jointly.
 */
export const COMBINED_LIMIT = { single: 5_000_000, joint: 10_000_000 } as const;

export interface SourceTaxRule {
  /** Tax rate in percent. */
  value: number;
  /** Plain English description of when the rule applies (the widget shows its own translations). */
  appliesTo: string;
  /** Cumulative investment ceiling for the rule, if any. */
  upTo: number | null;
  source: SanchayapatraSource;
  /** Date of the source (YYYY-MM-DD). */
  asOf: string;
  /** False when the rule could not be confirmed as still in force after the FY2026-27 budget. */
  confirmedForFy2026_27: boolean;
  checkedOn: string;
}

/**
 * Source tax on profit. Only `standard` is pre-filled. The others are shown as
 * information because their status after 1 July 2026 is unconfirmed.
 */
export const SOURCE_TAX_RULES = {
  standard: {
    value: 10,
    appliesTo: "Income Tax Act 2023, section 105; total investment above ৳5 lakh, and all certificates under the FY2026-27 Finance Bill",
    upTo: null,
    source: {
      title: "Bangla Tribune, 3 February 2026: NBR on source tax on savings certificate profit",
      url: "https://www.banglatribune.com/business/news/932412",
    },
    asOf: "2026-02-03",
    confirmedForFy2026_27: true,
    checkedOn: SANCHAYAPATRA_CHECKED_ON,
  },
  smallHolder: {
    value: 5,
    appliesTo: "Total savings-certificate investment up to ৳5 lakh (NBR clarification, February 2026)",
    upTo: 500_000,
    source: {
      title: "Bangla Tribune, 3 February 2026: NBR on source tax on savings certificate profit",
      url: "https://www.banglatribune.com/business/news/932412",
    },
    asOf: "2026-02-03",
    confirmedForFy2026_27: false,
    checkedOn: SANCHAYAPATRA_CHECKED_ON,
  },
  pensionerSmall: {
    value: 0,
    appliesTo: "Pensioner Sanchayapatra, total investment up to ৳5 lakh (NSD sheet)",
    upTo: 500_000,
    source: SANCHAYAPATRA_SCHEMES.pensioner.source,
    asOf: "2026-04-08",
    confirmedForFy2026_27: false,
    checkedOn: SANCHAYAPATRA_CHECKED_ON,
  },
} as const satisfies Record<string, SourceTaxRule>;

/** Report on the FY2026-27 Finance Bill changes (10% for all; advance, not final, tax). */
export const BUDGET_2026_TAX_REPORT: SanchayapatraSource = {
  title: "Prothom Alo, 13 June 2026: Advance tax on savings certificate profits increased",
  url: "https://en.prothomalo.com/business/local/73pkxu6ic5",
};

/** The tax rate the widget pre-fills. */
export const DEFAULT_TAX_RATE = SOURCE_TAX_RULES.standard.value;

/** Every source used on the page, without duplicates. */
export const SANCHAYAPATRA_SOURCES: readonly SanchayapatraSource[] = [
  IRD_RATE_ORDER,
  NSD_SCHEMES_PAGE,
  RATES_UNCHANGED_2026,
  SOURCE_TAX_RULES.standard.source,
  BUDGET_2026_TAX_REPORT,
];

export const MIN_AMOUNT = 1_000;
export const MAX_AMOUNT = 1_000_000_000;
export const MIN_RATE = 0;
export const MAX_RATE = 100;
export const MIN_TAX = 0;
export const MAX_TAX = 100;

/** Number of profit payments over the full term. */
export function payoutCount(scheme: SanchayapatraScheme): number {
  switch (scheme.payout) {
    case "monthly":
      return scheme.tenureMonths;
    case "quarterly":
      return scheme.tenureMonths / 3;
    case "maturity":
      return 1;
  }
}

/**
 * The rate tier that applies. An amount above ৳7,50,000 is always "above";
 * otherwise it depends on the investor's other certificates (`holding`).
 */
export function rateTierFor(amount: number | null, holding: RateTier): RateTier {
  return amount !== null && amount > RATE_TIER_LIMIT ? "above" : holding;
}

/** Official rate (% a year) for a certificate held to maturity. */
export function maturityRate(schemeId: SchemeId, tier: RateTier): number {
  const rates = SANCHAYAPATRA_SCHEMES[schemeId].rateTiers[tier];
  return rates[rates.length - 1]!;
}

/** Simple yearly profit (unrounded): amount × rate ÷ 100. */
export function yearlyProfit(amount: number, rate: number): number {
  return (amount * rate) / 100;
}

export type SanchayapatraField = "amount" | "rate" | "tax";

export interface SanchayapatraError {
  field: SanchayapatraField;
  code: NumberErrorCode;
}

export interface SanchayapatraInputs {
  scheme: SchemeId;
  amount: string;
  /** Profit rate, % a year. */
  rate: string;
  /** Source tax, % of profit. */
  tax: string;
}

/** All money values are unrounded; round only for display. */
export interface SanchayapatraResult {
  scheme: SchemeId;
  payout: Payout;
  amount: number;
  rate: number;
  taxRate: number;
  tenureMonths: number;
  /** Number of profit payments over the term (60, 12 or 1). */
  payments: number;
  grossPerPayment: number;
  taxPerPayment: number;
  netPerPayment: number;
  totalGross: number;
  totalTax: number;
  totalNet: number;
  /** Amount + total net profit: everything received over the term. */
  totalReceived: number;
  /** Paid out on the maturity date: principal, plus all net profit for a maturity scheme. */
  receivedAtMaturity: number;
}

export type SanchayapatraCalculation =
  | { ok: true; result: SanchayapatraResult }
  | { ok: false; errors: SanchayapatraError[] };

/** Validates raw input and works out profit, source tax and totals for a certificate held to maturity. */
export function calculateSanchayapatra(inputs: SanchayapatraInputs): SanchayapatraCalculation {
  const errors: SanchayapatraError[] = [];
  const amount = checkNumber(inputs.amount, { min: MIN_AMOUNT, max: MAX_AMOUNT });
  if (!amount.ok) errors.push({ field: "amount", code: amount.code });
  const rate = checkNumber(inputs.rate, { min: MIN_RATE, max: MAX_RATE });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });
  const tax = checkNumber(inputs.tax, { min: MIN_TAX, max: MAX_TAX });
  if (!tax.ok) errors.push({ field: "tax", code: tax.code });
  if (!amount.ok || !rate.ok || !tax.ok) return { ok: false, errors };

  const scheme: SanchayapatraScheme = SANCHAYAPATRA_SCHEMES[inputs.scheme];
  const years = scheme.tenureMonths / 12;
  const payments = payoutCount(scheme);
  const totalGross = yearlyProfit(amount.value, rate.value) * years;
  const grossPerPayment = totalGross / payments;
  const taxShare = tax.value / 100;
  const taxPerPayment = grossPerPayment * taxShare;
  const totalTax = totalGross * taxShare;
  const totalNet = totalGross - totalTax;

  return {
    ok: true,
    result: {
      scheme: scheme.id,
      payout: scheme.payout,
      amount: amount.value,
      rate: rate.value,
      taxRate: tax.value,
      tenureMonths: scheme.tenureMonths,
      payments,
      grossPerPayment,
      taxPerPayment,
      netPerPayment: grossPerPayment - taxPerPayment,
      totalGross,
      totalTax,
      totalNet,
      totalReceived: amount.value + totalNet,
      receivedAtMaturity: scheme.payout === "maturity" ? amount.value + totalNet : amount.value,
    },
  };
}

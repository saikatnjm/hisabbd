/*
 * Tax at source and excise duty on bank deposits in Bangladesh, as dated,
 * sourced data. Shared by the FDR and DPS calculators. Pure: no React, no
 * clock, no UI strings (labels here are plain English data descriptions; the
 * widgets show their own translated names).
 *
 * 1. Tax deducted at source (TDS) on interest on savings and fixed deposits,
 *    Income Tax Act 2023, section 102 (replaced section 53F of the 1984
 *    Ordinance). For individuals the rate is 10%. Where a depositor who must
 *    file a return cannot show proof of submission of return (PSR), the bank
 *    deducts at a rate 50% higher (section 142), i.e. 15%. Companies, trusts
 *    and associations of persons pay 20% (not offered as a preset here; enter
 *    it as a custom rate). The old "10% with TIN / 15% without TIN" wording is
 *    from the 1984 Ordinance; the 2023 Act ties the higher rate to the PSR.
 *    No single NBR page with the current chart could be fetched on the check
 *    date, so the presets cite the sources listed below. Which balance (if
 *    any) triggers the PSR requirement for deposits was NOT confirmed (the
 *    2022 rule was "credit balance above ৳10 lakh"), so the calculator asks
 *    the user which case applies instead of deciding it.
 * 2. Excise duty on bank balances (Excise and Salt Act 1944, schedule as
 *    amended by the yearly Finance Act). A fixed Taka amount per account per
 *    calendar year, charged once if the balance reaches a band at any time
 *    from January to December, usually deducted in December. It applies to
 *    savings accounts, FDRs and DPS accounts alike. Bands (upper limit
 *    inclusive, "three lakh and one taka to five lakh taka" wording):
 *      up to ৳4,00,000            nil   (৳3,00,000 until June 2026)
 *      ৳4,00,001 – ৳5,00,000      ৳150
 *      ৳5,00,001 – ৳10,00,000     ৳500
 *      ৳10,00,001 – ৳50,00,000    ৳3,000
 *      ৳50,00,001 – ৳1 crore      ৳5,000
 *      ৳1 crore – ৳2 crore        ৳10,000
 *      ৳2 crore – ৳5 crore        ৳20,000
 *      above ৳5 crore             ৳50,000
 *    The ৳4 lakh threshold comes from the Finance Bill 2026 (FY2026-27),
 *    which Parliament passed on 29 June 2026; the enacted schedule text itself
 *    could not be checked, so the page says "as reported". Bands above ৳5 lakh
 *    are reported unchanged from FY2025-26.
 * 3. Every figure is a default that the user can change or switch off.
 *    Review after every budget (usually June, effective 1 July).
 */

export interface DepositSource {
  title: string;
  url: string;
  /** Publication date of the source (YYYY-MM-DD). */
  published: string;
}

/** Date every figure in this file was last checked against its sources. */
export const DEPOSIT_TAX_CHECKED_ON = "2026-10-28";

const DAILY_STAR_TDS: DepositSource = {
  title: "The Daily Star: Time to review tax deduction at source provisions on bank and NBFI deposits",
  url: "https://www.thedailystar.net/business/news/time-review-tax-deduction-source-provisions-bank-and-nbfi-deposits-4192886",
  published: "2026-06-07",
};

const DHAKA_TRIBUNE_PSR: DepositSource = {
  title: "Dhaka Tribune: Banks warned on source tax deduction from deposit",
  url: "https://www.dhakatribune.com/business/banks/417157/banks-warned-on-source-tax-deduction-from-deposit",
  published: "2026-08-10",
};

const PROTHOM_ALO_EXCISE: DepositSource = {
  title: "Prothom Alo: Excise duty will now be applicable if account balance exceeds Tk 300,000",
  url: "https://en.prothomalo.com/business/local/yqc5rc3749",
  published: "2025-10-23",
};

const DAILY_STAR_EXCISE_2026: DepositSource = {
  title: "The Daily Star: Excise duty exemption threshold on bank deposits rises to Tk 4 lakh",
  url: "https://www.thedailystar.net/business/bangladesh-budget-2026-27/news/excise-duty-exemption-threshold-bank-deposits-rises-tk-4-lakh-4196436",
  published: "2026-06-11",
};

const KPMG_FINANCE_BILL_2026: DepositSource = {
  title: "KPMG Bangladesh (Rahman Rahman Huq): Salient features of Finance Bill 2026",
  url: "https://assets.kpmg.com/content/dam/kpmg/bd/pdf/Salient_features_of_Finance_Bill_2026(Tax-and_VAT).pdf",
  published: "2026-06-14",
};

const FE_FINANCE_BILL_PASSED: DepositSource = {
  title: "The Financial Express: Parliament approves Finance Bill 2026 with 64 amendments",
  url: "https://thefinancialexpress.com.bd/national/parliament-approves-finance-bill-2026-with-64-amendments",
  published: "2026-06-29",
};

export interface TaxPreset {
  /** Rate in percent. */
  value: number;
  label: string;
  sources: readonly DepositSource[];
  checkedOn: string;
}

/** Source tax presets for an individual depositor. "custom" lets the user type any rate. */
export const SOURCE_TAX_PRESETS = {
  standard: {
    value: 10,
    label: "Individual: 10% (proof of return given, or not required)",
    sources: [DAILY_STAR_TDS],
    checkedOn: DEPOSIT_TAX_CHECKED_ON,
  },
  noReturnProof: {
    value: 15,
    label: "Individual without proof of return where one is required: 15% (10% + 50%)",
    sources: [DAILY_STAR_TDS, DHAKA_TRIBUNE_PSR],
    checkedOn: DEPOSIT_TAX_CHECKED_ON,
  },
} as const satisfies Record<string, TaxPreset>;

export type TaxPresetId = keyof typeof SOURCE_TAX_PRESETS | "custom";
export const TAX_PRESET_IDS: readonly TaxPresetId[] = ["standard", "noReturnProof", "custom"];

/** Sources for the tax presets, without duplicates (for "Sources" lists). */
export const SOURCE_TAX_SOURCES: readonly DepositSource[] = [DAILY_STAR_TDS, DHAKA_TRIBUNE_PSR];

export interface ExciseBand {
  /** Highest balance in this band, inclusive; null for the top band. */
  upTo: number | null;
  /** Duty in Taka for the year. */
  duty: number;
}

/** Excise duty bands for FY2026-27 (from 1 July 2026), as reported. Ordered by `upTo`. */
export const EXCISE_BANDS: readonly ExciseBand[] = [
  { upTo: 400_000, duty: 0 },
  { upTo: 500_000, duty: 150 },
  { upTo: 1_000_000, duty: 500 },
  { upTo: 5_000_000, duty: 3_000 },
  { upTo: 10_000_000, duty: 5_000 },
  { upTo: 20_000_000, duty: 10_000 },
  { upTo: 50_000_000, duty: 20_000 },
  { upTo: null, duty: 50_000 },
];

/** Balance up to which no excise duty is charged. */
export const EXCISE_FREE_LIMIT = 400_000;

export const EXCISE_TABLE = {
  bands: EXCISE_BANDS,
  /** First day of the fiscal year the threshold applies to. */
  effectiveFrom: "2026-07-01",
  checkedOn: DEPOSIT_TAX_CHECKED_ON,
  sources: [DAILY_STAR_EXCISE_2026, KPMG_FINANCE_BILL_2026, FE_FINANCE_BILL_PASSED, PROTHOM_ALO_EXCISE],
} as const;

/** How excise duty is included: estimated from the band table, a total the user enters, or left out. */
export type ExciseMode = "bands" | "custom" | "none";
export const EXCISE_MODES: readonly ExciseMode[] = ["bands", "custom", "none"];

/** Excise duty for one year on an account whose highest balance that year is `balance`. */
export function exciseForBalance(balance: number, bands: readonly ExciseBand[] = EXCISE_BANDS): number {
  for (const band of bands) {
    if (band.upTo === null || balance <= band.upTo) return band.duty;
  }
  return bands.at(-1)?.duty ?? 0;
}

export interface ExciseBandRange {
  /** Lowest balance in the band (0 for the first band). */
  from: number;
  /** Highest balance in the band, inclusive; null for the top band. */
  to: number | null;
  duty: number;
}

/** The bands as from–to ranges, for tables on the page. */
export function exciseBandRanges(bands: readonly ExciseBand[] = EXCISE_BANDS): ExciseBandRange[] {
  return bands.map((band, index) => {
    const previous = index > 0 ? bands[index - 1]?.upTo : null;
    return { from: previous == null ? 0 : previous + 1, to: band.upTo, duty: band.duty };
  });
}

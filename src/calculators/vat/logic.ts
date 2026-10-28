import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * VAT calculator rules and assumptions (documented):
 *
 * 1. Two directions ("modes"), with the rate r in percent:
 *      add     price excluding VAT (net) → VAT = net × r ÷ 100,
 *              price including VAT (gross) = net + VAT
 *      remove  price including VAT (gross) → VAT = gross × r ÷ (100 + r),
 *              net = gross − VAT
 *    Removing VAT is NOT "take r% of the gross": 15% of ৳1,150 is ৳172.50, but
 *    the VAT inside ৳1,150 at 15% is ৳150 (1,150 × 15 ÷ 115).
 * 2. Money is treated to the nearest paisa (2 decimals, half away from zero).
 *    The entered amount is rounded to paisa first. The VAT is then rounded to
 *    paisa, and the other figure is the sum (add) or difference (remove) of the
 *    rounded amounts, so net + VAT = gross exactly.
 * 3. Limits: amount from ৳0.01 (one paisa) to 1,000,000,000,000 (10^12); rate
 *    from 0 to 100 (inclusive), decimals allowed (e.g. 7.5).
 * 4. The rate is always an input. The presets below are data with a source and
 *    a "checked on" date; the widget pre-fills from them and the user can enter
 *    any other rate. The standard rate (15%) is set by the Value Added Tax and
 *    Supplementary Duty Act, 2012. Reduced rates apply only to some goods and
 *    services listed by NBR; which rate applies is not modelled here.
 * 5. Deliberately NOT modelled: supplementary duty (SD), advance tax (AT), VAT
 *    deduction at source, truncated or tariff values, fixed per-unit VAT,
 *    turnover tax and input-tax credit. Some products carry SD or use a
 *    different base; businesses should follow NBR rules and their accountant.
 */

export interface VatRateSource {
  title: string;
  url: string;
}

export interface VatRatePreset {
  /** Rate in percent. */
  value: number;
  /** Plain English description of the data row (the widget shows its own translated names). */
  label: string;
  source: VatRateSource;
  /** Date the source was last checked (YYYY-MM-DD). */
  checkedOn: string;
}

const NBR_VAT_FAQ: VatRateSource = {
  title: "National Board of Revenue (NBR): VAT FAQ",
  url: "https://nbr.gov.bd/faq/vat-faq/eng",
};

const PWC_BANGLADESH_OTHER_TAXES: VatRateSource = {
  title: "PwC Worldwide Tax Summaries: Bangladesh, Other taxes (last reviewed 31 July 2026)",
  url: "https://taxsummaries.pwc.com/bangladesh/corporate/other-taxes",
};

/** Date every preset below was last checked against its source. */
export const VAT_RATES_CHECKED_ON = "2026-10-28";

/**
 * Rate presets. Review these whenever a budget or Finance Act changes VAT
 * (usually from 1 July). The reduced rates (PwC also lists 1.5%, 2%, 2.4% and
 * 4.5%) apply only to specific goods and services; use "Custom" for those.
 */
export const VAT_RATE_PRESETS = {
  standard: {
    value: 15,
    label: "Standard rate",
    source: NBR_VAT_FAQ,
    checkedOn: VAT_RATES_CHECKED_ON,
  },
  reduced10: {
    value: 10,
    label: "Reduced rate (some goods and services)",
    source: PWC_BANGLADESH_OTHER_TAXES,
    checkedOn: VAT_RATES_CHECKED_ON,
  },
  reduced7_5: {
    value: 7.5,
    label: "Reduced rate (some goods and services)",
    source: PWC_BANGLADESH_OTHER_TAXES,
    checkedOn: VAT_RATES_CHECKED_ON,
  },
  reduced5: {
    value: 5,
    label: "Reduced rate (some goods and services)",
    source: PWC_BANGLADESH_OTHER_TAXES,
    checkedOn: VAT_RATES_CHECKED_ON,
  },
} as const satisfies Record<string, VatRatePreset>;

export type VatPresetId = keyof typeof VAT_RATE_PRESETS | "custom";

/** Every source used by the presets, without duplicates (for "Sources" lists). */
export const VAT_RATE_SOURCES: readonly VatRateSource[] = [NBR_VAT_FAQ, PWC_BANGLADESH_OTHER_TAXES];

export type VatMode = "add" | "remove";

/** Smallest accepted amount: one paisa. */
export const MIN_AMOUNT = 0.01;
export const MAX_AMOUNT = 1_000_000_000_000;
export const MIN_RATE = 0;
export const MAX_RATE = 100;

export type VatField = "amount" | "rate";

export interface VatError {
  field: VatField;
  code: NumberErrorCode;
}

export interface VatResult {
  mode: VatMode;
  /** VAT rate in percent, as entered. */
  rate: number;
  /** Price excluding VAT, in paisa precision. */
  net: number;
  /** VAT amount, rounded to paisa. */
  vat: number;
  /** Price including VAT, in paisa precision. net + vat === gross. */
  gross: number;
}

export type VatCalculation = { ok: true; result: VatResult } | { ok: false; errors: VatError[] };

/** VAT on a price that excludes VAT (unrounded): net × r ÷ 100. */
export function vatOnNet(net: number, rate: number): number {
  return (net * rate) / 100;
}

/** VAT contained in a price that includes VAT (unrounded): gross × r ÷ (100 + r). */
export function vatInGross(gross: number, rate: number): number {
  return (gross * rate) / (100 + rate);
}

/**
 * Validates raw input and adds VAT to a net price ("add") or takes it out of
 * a VAT-inclusive price ("remove").
 */
export function calculateVat(mode: VatMode, rawAmount: string, rawRate: string): VatCalculation {
  const errors: VatError[] = [];
  const amount = checkNumber(rawAmount, { min: MIN_AMOUNT, max: MAX_AMOUNT });
  if (!amount.ok) errors.push({ field: "amount", code: amount.code });
  const rate = checkNumber(rawRate, { min: MIN_RATE, max: MAX_RATE });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });
  if (!amount.ok || !rate.ok) return { ok: false, errors };

  const entered = roundTo(amount.value, 2);
  const r = rate.value;

  if (mode === "add") {
    const vat = roundTo(vatOnNet(entered, r), 2);
    return { ok: true, result: { mode, rate: r, net: entered, vat, gross: roundTo(entered + vat, 2) } };
  }

  const vat = roundTo(vatInGross(entered, r), 2);
  return { ok: true, result: { mode, rate: r, net: roundTo(entered - vat, 2), vat, gross: entered } };
}

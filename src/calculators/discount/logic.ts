import { checkNumber, roundTo } from "@/lib/number";

/*
 * Discount calculator rules and assumptions (documented):
 *
 * 1. Price after one discount = price × (1 − d / 100).
 * 2. An optional second ("extra") discount is applied to the ALREADY reduced
 *    price, not to the original: final = price × (1 − d1 / 100) × (1 − d2 / 100).
 *    So 20% then an extra 10% takes 10% off ৳800, not off ৳1,000.
 * 3. Total effective discount % = (price − final) ÷ price × 100
 *                                = 100 − (100 − d1)(100 − d2) ÷ 100.
 *    It is always less than d1 + d2 (20% then 10% = 28%, not 30%) unless one of
 *    them is 0 or one of them is 100.
 * 4. Money is treated to the nearest paisa (2 decimals, half away from zero):
 *    the entered price is rounded to paisa first, then the first-stage price
 *    and the final price are rounded for display, and "you save" is the
 *    difference of the rounded amounts so the three figures always add up.
 *    The effective percentage is worked out from the percentages themselves,
 *    never from the rounded amounts.
 * 5. Limits: price from ৳0.01 (one paisa) to 1,000,000,000,000 (10^12);
 *    each discount from 0 to 100 (inclusive). The extra discount is only
 *    read when it is switched on; otherwise it is ignored.
 */

/** Smallest accepted price: one paisa. */
export const MIN_PRICE = 0.01;
export const MAX_PRICE = 1_000_000_000_000;

export type DiscountField = "price" | "discount" | "extraDiscount";
export type DiscountErrorCode = "missing" | "invalid" | "too-small" | "too-large" | "not-integer";

export interface DiscountError {
  field: DiscountField;
  code: DiscountErrorCode;
}

export interface DiscountResult {
  /** Original price, rounded to paisa. */
  originalPrice: number;
  discountPercent: number;
  /** Null when the extra discount is off. */
  extraDiscountPercent: number | null;
  /** Price after the first discount only, rounded to paisa. */
  priceAfterFirstDiscount: number;
  /** Price to pay, rounded to paisa. */
  finalPrice: number;
  /** originalPrice − finalPrice, in paisa precision. */
  youSave: number;
  /** Total discount as a percentage of the original price. */
  effectivePercent: number;
  /** discount + extra discount added up (what people wrongly expect). */
  simpleSumPercent: number;
}

export type DiscountCalculation = { ok: true; result: DiscountResult } | { ok: false; errors: DiscountError[] };

/** Final price after applying each percentage in turn (unrounded). */
export function applyDiscounts(price: number, percents: readonly number[]): number {
  return percents.reduce((current, percent) => current * (1 - percent / 100), price);
}

/** Combined discount % for stacked discounts: 100 − (100 − d1)(100 − d2) ÷ 100, etc. */
export function combinedDiscountPercent(percents: readonly number[]): number {
  const remaining = percents.reduce((left, percent) => (left * (100 - percent)) / 100, 100);
  return 100 - remaining;
}

/**
 * Validates raw input and calculates the discount.
 * @param rawExtraDiscount Pass null when "Add an extra discount" is off.
 */
export function calculateDiscount(
  rawPrice: string,
  rawDiscount: string,
  rawExtraDiscount: string | null,
): DiscountCalculation {
  const errors: DiscountError[] = [];
  const price = checkNumber(rawPrice, { min: MIN_PRICE, max: MAX_PRICE });
  if (!price.ok) errors.push({ field: "price", code: price.code });
  const discount = checkNumber(rawDiscount, { min: 0, max: 100 });
  if (!discount.ok) errors.push({ field: "discount", code: discount.code });
  const extra = rawExtraDiscount === null ? null : checkNumber(rawExtraDiscount, { min: 0, max: 100 });
  if (extra && !extra.ok) errors.push({ field: "extraDiscount", code: extra.code });

  if (errors.length > 0 || !price.ok || !discount.ok || (extra && !extra.ok)) return { ok: false, errors };

  const extraPercent = extra && extra.ok ? extra.value : null;
  const percents = extraPercent === null ? [discount.value] : [discount.value, extraPercent];

  const originalPrice = roundTo(price.value, 2);
  const priceAfterFirstDiscount = roundTo(applyDiscounts(originalPrice, [discount.value]), 2);
  const finalPrice = roundTo(applyDiscounts(originalPrice, percents), 2);

  return {
    ok: true,
    result: {
      originalPrice,
      discountPercent: discount.value,
      extraDiscountPercent: extraPercent,
      priceAfterFirstDiscount,
      finalPrice,
      youSave: roundTo(originalPrice - finalPrice, 2),
      effectivePercent: combinedDiscountPercent(percents),
      simpleSumPercent: discount.value + (extraPercent ?? 0),
    },
  };
}

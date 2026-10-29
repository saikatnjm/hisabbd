import { checkNumber, type NumberErrorCode } from "@/lib/number";
import {
  bhoriBreakdown,
  bhoriToGrams,
  fromBhori,
  gramsToBhori,
  MAX_WEIGHT_GRAMS,
  traditionalToBhori,
  type TraditionalWeight,
} from "./units";

/*
 * Gold Price & Bhori calculator rules and assumptions (documented, checked
 * 29 October 2026):
 *
 * 1. Units come from ./units.ts: 1 bhori = 11.664 g = 16 ana = 96 roti =
 *    960 point (1 ana = 6 roti, 1 roti = 10 point). Sources are listed there.
 * 2. A weight is entered either as bhori + ana + roti + point ("traditional";
 *    each part optional, blank = 0, decimals allowed, parts above 15 ana etc.
 *    carry over) or as grams. It must be more than 0 and at most
 *    MAX_WEIGHT_GRAMS. All parts blank or 0 is the "no-weight" error, reported
 *    on the first weight field.
 * 3. Convert mode: the weight in grams, in bhori (decimal), as whole bhori /
 *    ana / roti + point, and as totals in ana, roti and point.
 * 4. Price mode (all money unrounded here; the UI rounds for display):
 *      gold value     = weight in bhori × price per bhori
 *      making charge  = none, gold value × m ÷ 100, or weight in bhori × ৳m
 *      VAT            = none ("included"), (gold value + making) × v ÷ 100,
 *                       or weight in bhori × ৳v
 *      total          = gold value + making charge + VAT
 * 5. NO price is preset: gold prices change several times a month. The user
 *    enters the price per bhori for the purity they chose (22K, 21K, 18K or
 *    traditional/সনাতন, the four grades BAJUS publishes); the page links to
 *    BAJUS (https://www.bajus.org) to check today's price. The purity is only
 *    a label for the result; it does not change the maths.
 * 6. Making charge (মজুরি) is never preset. Since the June 2026 notices BAJUS
 *    says making charges depend on the design (Daily Observer, 18 June 2026,
 *    https://observerbd.com/news/579924). Blank = no making charge.
 * 7. VAT on gold ornaments. The FY2026-27 Finance Bill, passed on 29 June
 *    2026, replaced the 5% VAT on the sale price of gold with a fixed VAT of
 *    Tk 2,500 per bhori (silver Tk 100 per bhori) (The Daily Star, 30 June
 *    2026, https://www.thedailystar.net/business/news/govt-fixes-flat-vat-gold-diamonds-silver-4212521).
 *    BAJUS now publishes VAT-inclusive prices and says jewellers may not
 *    collect VAT separately (Daily Observer, 18 June 2026; TBS / UNB, 9 July
 *    2026, https://www.tbsnews.net/bangladesh/gold-prices-fall-again-bajus-slashes-rates-1483916).
 *    So the default is "VAT included in the price" (nothing added). Because
 *    we could not read the NBR order itself, the VAT is not preset: anyone
 *    whose bill adds VAT can choose "% of the price" or "৳ per bhori" and type
 *    what the bill shows. Whether VAT also applies to the making charge is
 *    not modelled beyond that choice.
 * 8. Limits: price per bhori more than ৳0 and at most ৳10 crore; making and
 *    VAT 0–100% or ৳0 to ৳10 crore per bhori.
 * 9. Deliberately NOT modelled: buy-back deductions (jewellers usually deduct
 *    a share when buying old gold), wastage (খাদ), stone weight, hallmark
 *    checks, and any discount.
 */

export type GoldMode = "value" | "convert";
export type GoldWeightUnit = "traditional" | "gram";
export type GoldPurity = "22k" | "21k" | "18k" | "traditional";
export type GoldChargeType = "percent" | "per-bhori";
export type GoldVatType = "included" | "percent" | "per-bhori";

export const GOLD_PURITIES: readonly GoldPurity[] = ["22k", "21k", "18k", "traditional"];

/** BAJUS, where today's price per bhori for each purity is published. */
export const BAJUS_SOURCE = { title: "Bangladesh Jewellers Association (BAJUS)", url: "https://www.bajus.org" } as const;

/** The dated sources behind rule 7 (VAT). */
export const GOLD_VAT_SOURCES = [
  {
    title: "The Daily Star, 30 June 2026: Govt fixes flat VAT on gold, diamonds, silver",
    url: "https://www.thedailystar.net/business/news/govt-fixes-flat-vat-gold-diamonds-silver-4212521",
  },
  {
    title: "TBS / UNB, 9 July 2026: Gold prices fall again as Bajus slashes rates",
    url: "https://www.tbsnews.net/bangladesh/gold-prices-fall-again-bajus-slashes-rates-1483916",
  },
] as const;

/** Fixed VAT on gold reported for FY2026-27 (rule 7). Shown as information, never applied automatically. */
export const REPORTED_FIXED_GOLD_VAT_PER_BHORI = 2_500;
export const GOLD_RULES_CHECKED_ON = "2026-10-29";

export const MAX_PRICE_PER_BHORI = 100_000_000;
export const MAX_PERCENT = 100;

export type GoldWeightField = "bhori" | "ana" | "roti" | "point" | "grams";
export type GoldField = GoldWeightField | "price" | "making" | "vat";
export type GoldErrorCode = NumberErrorCode | "no-weight";

export interface GoldError {
  field: GoldField;
  code: GoldErrorCode;
}

/** Raw weight fields as typed. Only the fields of `unit` are read. */
export interface GoldWeightInput {
  unit: GoldWeightUnit;
  bhori?: string;
  ana?: string;
  roti?: string;
  point?: string;
  grams?: string;
}

export interface GoldWeight {
  /** Total weight in bhori (unrounded). */
  bhori: number;
  /** Total weight in grams (unrounded). */
  grams: number;
  /** Whole bhori, ana, roti and point (point to 2 decimals), as jewellers write it. */
  breakdown: TraditionalWeight;
  /** The same weight as a total number of ana, roti or point (unrounded). */
  totalAna: number;
  totalRoti: number;
  totalPoint: number;
}

export type GoldWeightCheck = { ok: true; weight: GoldWeight } | { ok: false; errors: GoldError[] };

/** A blank optional part counts as 0; anything typed must be a number ≥ 0. */
function optionalPart(raw: string | undefined) {
  const text = raw ?? "";
  if (!text.trim()) return { ok: true as const, value: 0 };
  return checkNumber(text, { min: 0 });
}

/** Builds every view of a weight from its total in bhori. */
export function describeWeight(bhori: number): GoldWeight {
  return {
    bhori,
    grams: bhoriToGrams(bhori),
    breakdown: bhoriBreakdown(bhori),
    totalAna: fromBhori(bhori, "ana"),
    totalRoti: fromBhori(bhori, "roti"),
    totalPoint: fromBhori(bhori, "point"),
  };
}

/** Validates a weight (rule 2). Errors on every bad part are reported together. */
export function checkGoldWeight(input: GoldWeightInput): GoldWeightCheck {
  const errors: GoldError[] = [];
  let bhori: number;
  let firstField: GoldWeightField;

  if (input.unit === "gram") {
    firstField = "grams";
    const grams = optionalPart(input.grams);
    if (!grams.ok) return { ok: false, errors: [{ field: "grams", code: grams.code }] };
    bhori = gramsToBhori(grams.value);
  } else {
    firstField = "bhori";
    const parts = {} as Record<"bhori" | "ana" | "roti" | "point", number>;
    for (const field of ["bhori", "ana", "roti", "point"] as const) {
      const part = optionalPart(input[field]);
      if (part.ok) parts[field] = part.value;
      else errors.push({ field, code: part.code });
    }
    if (errors.length > 0) return { ok: false, errors };
    bhori = traditionalToBhori(parts);
  }

  if (bhori <= 0) return { ok: false, errors: [{ field: firstField, code: "no-weight" }] };
  if (bhoriToGrams(bhori) > MAX_WEIGHT_GRAMS) return { ok: false, errors: [{ field: firstField, code: "too-large" }] };
  return { ok: true, weight: describeWeight(bhori) };
}

/** Convert mode (rule 3). */
export function convertGoldWeight(input: GoldWeightInput): GoldWeightCheck {
  return checkGoldWeight(input);
}

export interface GoldValueInput {
  weight: GoldWeightInput;
  purity: GoldPurity;
  /** Price per bhori in Taka, as typed. Required. */
  price: string;
  makingType: GoldChargeType;
  /** Making charge as typed; blank = none. */
  making: string;
  vatType: GoldVatType;
  /** VAT as typed; read only when vatType isn't "included", and then required. */
  vat: string;
}

export interface GoldValueResult {
  weight: GoldWeight;
  purity: GoldPurity;
  pricePerBhori: number;
  /** weight × price per bhori. */
  goldValue: number;
  makingType: GoldChargeType;
  /** The rate as entered (percent or ৳ per bhori); 0 when blank. */
  makingRate: number;
  makingCharge: number;
  vatType: GoldVatType;
  /** The VAT rate as entered (percent or ৳ per bhori); 0 when included. */
  vatRate: number;
  vat: number;
  total: number;
}

export type GoldValueCalculation = { ok: true; result: GoldValueResult } | { ok: false; errors: GoldError[] };

/** Gold value of a weight: bhori × price per bhori (unrounded). */
export function goldValue(bhori: number, pricePerBhori: number): number {
  return bhori * pricePerBhori;
}

/** Making charge (unrounded): a percentage of the gold value, or Taka per bhori. */
export function makingCharge(type: GoldChargeType, rate: number, bhori: number, value: number): number {
  return type === "percent" ? (value * rate) / 100 : bhori * rate;
}

/** VAT (unrounded): none, a percentage of gold value + making, or Taka per bhori. */
export function goldVat(type: GoldVatType, rate: number, bhori: number, base: number): number {
  if (type === "included") return 0;
  return type === "percent" ? (base * rate) / 100 : bhori * rate;
}

function chargeRule(type: GoldChargeType | GoldVatType) {
  return { min: 0, max: type === "percent" ? MAX_PERCENT : MAX_PRICE_PER_BHORI };
}

/** Price mode (rule 4). Validates everything and reports all errors together. */
export function calculateGoldValue(input: GoldValueInput): GoldValueCalculation {
  const weight = checkGoldWeight(input.weight);
  const errors: GoldError[] = weight.ok ? [] : [...weight.errors];

  const price = checkNumber(input.price, { min: 0, minExclusive: true, max: MAX_PRICE_PER_BHORI });
  if (!price.ok) errors.push({ field: "price", code: price.code });

  const making = input.making.trim()
    ? checkNumber(input.making, chargeRule(input.makingType))
    : ({ ok: true, value: 0 } as const);
  if (!making.ok) errors.push({ field: "making", code: making.code });

  const vat =
    input.vatType === "included"
      ? ({ ok: true, value: 0 } as const)
      : checkNumber(input.vat, chargeRule(input.vatType));
  if (!vat.ok) errors.push({ field: "vat", code: vat.code });

  if (!weight.ok || !price.ok || !making.ok || !vat.ok) return { ok: false, errors };

  const bhori = weight.weight.bhori;
  const value = goldValue(bhori, price.value);
  const charge = makingCharge(input.makingType, making.value, bhori, value);
  const vatAmount = goldVat(input.vatType, vat.value, bhori, value + charge);

  return {
    ok: true,
    result: {
      weight: weight.weight,
      purity: input.purity,
      pricePerBhori: price.value,
      goldValue: value,
      makingType: input.makingType,
      makingRate: making.value,
      makingCharge: charge,
      vatType: input.vatType,
      vatRate: vat.value,
      vat: vatAmount,
      total: value + charge + vatAmount,
    },
  };
}

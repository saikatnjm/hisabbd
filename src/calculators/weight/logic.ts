import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Weight conversion rules (documented assumptions):
 *
 * 1. Markets across Bangladesh use a 40 kg মণ (maund): Dhaka Times reported
 *    in October 2020 that the mango market at Baneshwar, the last exception,
 *    moved to 40 kg too. This is "market মণ".
 * 2. The traditional units are built on the tola, fixed in 1833 (Regulation
 *    VII) at 180 troy grains = 11.6638038 g: 1 ছটাক = 5 তোলা, 1 সের = 16 ছটাক
 *    = 80 তোলা = 933.104304 g, 1 মণ = 40 সের = 37.32417216 kg (exactly
 *    82 2/7 lb). This is "traditional মণ". সের, ছটাক and তোলা are given only on
 *    this traditional basis.
 * 3. 1 lb = 0.45359237 kg exactly (international pound).
 * 4. A value is converted to grams, then to every unit. The traditional
 *    breakdown splits it into whole মণ and সের, then ছটাক (2 decimals).
 * 5. Nothing is rounded here except floating-point noise (10 decimals); the UI
 *    shows up to 4 decimals.
 * 6. Limits: more than 0, up to 10 crore (1,00,00,00,000) of the chosen unit.
 * 7. Local practice can differ (e.g. an extra "ঢলন" weight per মণ in some
 *    markets in the past); the page says to agree the weight before trading.
 */

export const GRAMS_PER_TOLA = 11.6638038;
export const GRAMS_PER_POUND = 453.59237;
export const MAX_VALUE = 1_000_000_000;

export const WEIGHT_UNITS = ["kg", "g", "lb", "maund-market", "maund", "seer", "chatak", "tola"] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

/** Grams in one of each unit. */
export const GRAMS_PER_UNIT: Readonly<Record<WeightUnit, number>> = {
  kg: 1000,
  g: 1,
  lb: GRAMS_PER_POUND,
  "maund-market": 40_000,
  maund: 3200 * GRAMS_PER_TOLA,
  seer: 80 * GRAMS_PER_TOLA,
  chatak: 5 * GRAMS_PER_TOLA,
  tola: GRAMS_PER_TOLA,
};

export interface WeightError {
  field: "value";
  code: NumberErrorCode;
}

export interface TraditionalBreakdown {
  maund: number;
  seer: number;
  /** ছটাক left over, to 2 decimals. */
  chatak: number;
}

export interface WeightResult {
  value: number;
  unit: WeightUnit;
  grams: number;
  /** The same weight in every unit. */
  converted: Readonly<Record<WeightUnit, number>>;
  traditional: TraditionalBreakdown;
}

export type WeightCalculation = { ok: true; result: WeightResult } | { ok: false; errors: WeightError[] };

const clean = (value: number) => roundTo(value, 10);

/** Converts a weight from one unit to another. */
export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  return clean((value * GRAMS_PER_UNIT[from]) / GRAMS_PER_UNIT[to]);
}

/** Whole traditional মণ, whole সের, then ছটাক (2 decimals). */
export function traditionalBreakdown(grams: number): TraditionalBreakdown {
  const chatakTotal = roundTo(grams / GRAMS_PER_UNIT.chatak, 2);
  const maund = Math.floor(chatakTotal / 640);
  const seer = Math.floor((chatakTotal - maund * 640) / 16);
  return { maund, seer, chatak: roundTo(chatakTotal - maund * 640 - seer * 16, 2) };
}

export function calculateWeight(rawValue: string, unit: WeightUnit): WeightCalculation {
  const value = checkNumber(rawValue, { min: 0, minExclusive: true, max: MAX_VALUE });
  if (!value.ok) return { ok: false, errors: [{ field: "value", code: value.code }] };
  const grams = clean(value.value * GRAMS_PER_UNIT[unit]);
  const converted = Object.fromEntries(WEIGHT_UNITS.map((u) => [u, convertWeight(value.value, unit, u)])) as Record<
    WeightUnit,
    number
  >;
  return { ok: true, result: { value: value.value, unit, grams, converted, traditional: traditionalBreakdown(grams) } };
}

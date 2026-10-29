/*
 * Traditional Bangladeshi gold and silver weight units (pure, shared by the
 * Gold and Zakat calculators). Checked on 29 October 2026.
 *
 * 1. 1 bhori (ভরি, also called vori; the same weight as the tola) = 11.664 g.
 *    This is the weight BAJUS (Bangladesh Jewellers Association) quotes every
 *    price against: "per bhori (11.664 grams)", e.g. the Daily Observer,
 *    18 June 2026 (https://observerbd.com/news/579924) and TBS / UNB,
 *    9 July 2026 (https://www.tbsnews.net/bangladesh/gold-prices-fall-again-bajus-slashes-rates-1483916).
 * 2. 1 bhori = 16 ana (আনা); 1 ana = 6 roti (রতি); 1 roti = 10 point (পয়েন্ট).
 *    So 1 bhori = 96 roti = 960 point, which matches Wikipedia, "Bhori"
 *    (https://en.wikipedia.org/wiki/Bhori, checked 29 Oct 2026: "1 bhori is
 *    equal to 16 ana … 96 ratti … 960 points"). In grams:
 *      1 ana   = 11.664 ÷ 16  = 0.729 g
 *      1 roti  = 11.664 ÷ 96  = 0.1215 g
 *      1 point = 11.664 ÷ 960 = 0.01215 g
 *    The point is a jewellers' unit and is the least standardised: we use the
 *    most widely documented "10 point = 1 roti". Some shops also write
 *    weights in grams only.
 * 3. Elsewhere the numbers differ (Pakistan's tola is commonly taken as
 *    12.5 g in jewellery trade), so this module is for Bangladesh only.
 * 4. Everything here is exact arithmetic on those definitions. Nothing is
 *    rounded except in `bhoriBreakdown`, which must produce whole ana and roti
 *    (see its comment).
 */

export const GRAMS_PER_BHORI = 11.664;
export const ANA_PER_BHORI = 16;
export const ROTI_PER_ANA = 6;
export const POINT_PER_ROTI = 10;
export const ROTI_PER_BHORI = ANA_PER_BHORI * ROTI_PER_ANA; // 96
export const POINT_PER_BHORI = ROTI_PER_BHORI * POINT_PER_ROTI; // 960
export const POINT_PER_ANA = ROTI_PER_ANA * POINT_PER_ROTI; // 60

/** Largest weight either calculator accepts: 1,000 tonnes, far above any real holding. */
export const MAX_WEIGHT_GRAMS = 1_000_000_000;

export type GoldUnit = "bhori" | "ana" | "roti" | "point" | "gram";

export const GOLD_UNIT_ORDER: readonly GoldUnit[] = ["bhori", "ana", "roti", "point", "gram"];

/** How many bhori one of each unit is. */
export const BHORI_PER_UNIT: Readonly<Record<GoldUnit, number>> = {
  bhori: 1,
  ana: 1 / ANA_PER_BHORI,
  roti: 1 / ROTI_PER_BHORI,
  point: 1 / POINT_PER_BHORI,
  gram: 1 / GRAMS_PER_BHORI,
};

/** Grams in one of each unit (bhori 11.664, ana 0.729, roti 0.1215, point 0.01215, gram 1). */
export const GRAMS_PER_UNIT: Readonly<Record<GoldUnit, number>> = {
  bhori: GRAMS_PER_BHORI,
  ana: GRAMS_PER_BHORI / ANA_PER_BHORI,
  roti: GRAMS_PER_BHORI / ROTI_PER_BHORI,
  point: GRAMS_PER_BHORI / POINT_PER_BHORI,
  gram: 1,
};

/** Grams → bhori (unrounded). 11.664 g → 1. */
export function gramsToBhori(grams: number): number {
  return grams / GRAMS_PER_BHORI;
}

/** Bhori → grams (unrounded). 1 → 11.664 g. */
export function bhoriToGrams(bhori: number): number {
  return bhori * GRAMS_PER_BHORI;
}

/** An amount in any unit → bhori. Grams are divided (not multiplied by a reciprocal) to keep 11.664 g → exactly 1. */
export function toBhori(value: number, unit: GoldUnit): number {
  if (unit === "gram") return gramsToBhori(value);
  if (unit === "bhori") return value;
  const perBhori = unit === "ana" ? ANA_PER_BHORI : unit === "roti" ? ROTI_PER_BHORI : POINT_PER_BHORI;
  return value / perBhori;
}

/** Bhori → an amount in any unit (unrounded). */
export function fromBhori(bhori: number, unit: GoldUnit): number {
  switch (unit) {
    case "bhori":
      return bhori;
    case "ana":
      return bhori * ANA_PER_BHORI;
    case "roti":
      return bhori * ROTI_PER_BHORI;
    case "point":
      return bhori * POINT_PER_BHORI;
    case "gram":
      return bhoriToGrams(bhori);
  }
}

/** A traditional weight, e.g. 2 bhori 5 ana 3 roti 4 point. All parts are non-negative. */
export interface TraditionalWeight {
  bhori: number;
  ana: number;
  roti: number;
  point: number;
}

/** bhori + ana ÷ 16 + roti ÷ 96 + point ÷ 960 (unrounded). Parts above 15 ana etc. simply carry over. */
export function traditionalToBhori(weight: TraditionalWeight): number {
  return (
    weight.bhori +
    weight.ana / ANA_PER_BHORI +
    weight.roti / ROTI_PER_BHORI +
    weight.point / POINT_PER_BHORI
  );
}

/**
 * Splits a weight in bhori into whole bhori, whole ana (0–15), whole roti
 * (0–5) and point (0 to under 10, possibly with decimals), the way jewellers
 * write it. The total in points is rounded to `pointDecimals` (default 2)
 * FIRST, so floating-point noise never turns 9.9999… point into a displayed
 * "10 point" or drops a whole roti. 1.5 bhori → 1 bhori 8 ana 0 roti 0 point;
 * 1 g → 0 bhori 1 ana 2 roti 2.3 point (82.30 point in all).
 */
export function bhoriBreakdown(bhori: number, pointDecimals = 2): TraditionalWeight {
  const scale = 10 ** pointDecimals;
  // Work in integer hundredths of a point to avoid floating-point remainders.
  const units = Math.round(Math.max(0, bhori) * POINT_PER_BHORI * scale);
  const perBhori = POINT_PER_BHORI * scale;
  const perAna = POINT_PER_ANA * scale;
  const perRoti = POINT_PER_ROTI * scale;
  const wholeBhori = Math.floor(units / perBhori);
  let rest = units - wholeBhori * perBhori;
  const ana = Math.floor(rest / perAna);
  rest -= ana * perAna;
  const roti = Math.floor(rest / perRoti);
  rest -= roti * perRoti;
  return { bhori: wholeBhori, ana, roti, point: rest / scale };
}

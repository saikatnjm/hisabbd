import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * Land area calculator rules and assumptions (documented):
 *
 * 1. Every area unit is defined as a number of square feet (AREA_UNIT_SQ_FT
 *    below). The metric units are exact: 1 ft = 0.3048 m, so 1 sq m =
 *    1 / 0.3048² sq ft (≈ 10.7639) and 1 hectare = 10,000 sq m (≈ 1,07,639.104 sq ft).
 *    The local units are the standard Bangladesh values:
 *      1 decimal (শতাংশ / শতক)  = 435.6 sq ft  (1/100 acre)
 *      1 ojutangsho (অযুতাংশ)  = 4.356 sq ft  (1/100 decimal)
 *      1 katha (কাঠা)          = 720 sq ft
 *      1 bigha (বিঘা)          = 20 katha = 14,400 sq ft
 *      1 acre (একর)            = 100 decimal = 43,560 sq ft
 *      1 sq yard (বর্গগজ)       = 9 sq ft
 * 2. Katha and bigha VARY BY REGION. 720 sq ft is only the default: the katha
 *    size is an input (1 to 10,000 sq ft) and a bigha is always 20 of those
 *    katha. Changing the katha size changes the katha and bigha figures only.
 * 3. 1 bigha = 14,400 / 435.6 ≈ 33.0579 decimal. The everyday "1 bigha = 33
 *    decimal" is a rounded figure; nothing here uses it.
 * 4. Convert mode: an amount greater than 0 in any unit. Area from
 *    measurements: every side greater than 0, in feet, haat (হাত, cubit =
 *    1.5 ft = 18 in), goj (গজ, yard = 3 ft) or metres. Sides are converted to
 *    feet first, then the area is worked out in square feet.
 *      rectangle   length × width
 *      four-sides  average(north, south) × average(east, west). This is the
 *                  surveyors' shortcut for plots that are close to a rectangle.
 *                  It is APPROXIMATE: four sides alone don't fix a shape, and
 *                  the result is exact only when opposite sides are parallel
 *                  and the corners are square.
 *      triangle    Heron's formula on three sides (the numerically stable form
 *                  after sorting a ≥ b ≥ c). The sides must satisfy the
 *                  triangle inequality strictly; a flat "triangle" is rejected
 *                  as "not-a-triangle" on its longest side.
 * 5. The total area must be at most 10^12 sq ft (MAX_AREA_SQ_FT), in any mode.
 *    Anything larger, or any result that isn't a finite positive number, is
 *    rejected rather than returned.
 * 6. Nothing is rounded here; the UI rounds for display.
 */

export type AreaUnit = "sqft" | "sqm" | "sqyd" | "decimal" | "ojutangsho" | "katha" | "bigha" | "acre" | "hectare";
export type LengthUnit = "ft" | "haat" | "yard" | "m";
export type LandMode = "convert" | "measure";
export type LandShape = "rectangle" | "four-sides" | "triangle";

/** Exact by definition of the international foot. */
export const METRES_PER_FOOT = 0.3048;
export const SQ_FT_PER_SQ_M = 1 / (METRES_PER_FOOT * METRES_PER_FOOT);

export const STANDARD_KATHA_SQ_FT = 720;
export const KATHA_PER_BIGHA = 20;
export const KATHA_SIZE_RANGE = { min: 1, max: 10_000 } as const;
export const MAX_AREA_SQ_FT = 1_000_000_000_000;

/** Display and table order. */
export const AREA_UNIT_ORDER: readonly AreaUnit[] = [
  "sqft",
  "sqm",
  "sqyd",
  "decimal",
  "ojutangsho",
  "katha",
  "bigha",
  "acre",
  "hectare",
];

/**
 * Square feet in one of each unit, with the standard 720 sq ft katha (rule 1).
 * Use `areaUnitSizes(kathaSqFt)` when the katha size is a setting.
 */
export const AREA_UNIT_SQ_FT: Readonly<Record<AreaUnit, number>> = {
  sqft: 1,
  sqm: SQ_FT_PER_SQ_M,
  sqyd: 9,
  decimal: 435.6,
  ojutangsho: 4.356,
  katha: STANDARD_KATHA_SQ_FT,
  bigha: STANDARD_KATHA_SQ_FT * KATHA_PER_BIGHA,
  acre: 43_560,
  hectare: 10_000 * SQ_FT_PER_SQ_M,
};

export const LENGTH_UNIT_ORDER: readonly LengthUnit[] = ["ft", "haat", "yard", "m"];

/** Feet in one of each length unit. */
export const LENGTH_UNIT_FT: Readonly<Record<LengthUnit, number>> = {
  ft: 1,
  haat: 1.5,
  yard: 3,
  m: 1 / METRES_PER_FOOT,
};

export type LengthField = "length" | "width" | "north" | "south" | "east" | "west" | "sideA" | "sideB" | "sideC";

/** The side fields each shape uses, in form order. */
export const SHAPE_FIELDS: Readonly<Record<LandShape, readonly LengthField[]>> = {
  rectangle: ["length", "width"],
  "four-sides": ["north", "south", "east", "west"],
  triangle: ["sideA", "sideB", "sideC"],
};

export type LandField = "amount" | LengthField | "kathaSize";
export type LandErrorCode =
  | NumberErrorCode
  /** The three sides break the triangle inequality. */
  | "not-a-triangle"
  /** The total area is above MAX_AREA_SQ_FT (or not a finite positive number). */
  | "area-too-large";

export interface LandError {
  field: LandField;
  code: LandErrorCode;
}

export type LandInput =
  | {
      mode: "convert";
      amount: string;
      unit: AreaUnit;
      /** Square feet in one katha. */
      kathaSize: string;
    }
  | {
      mode: "measure";
      shape: LandShape;
      lengthUnit: LengthUnit;
      /** Raw side values; only the fields of `shape` are read. Missing ones count as empty. */
      lengths: Partial<Record<LengthField, string>>;
      kathaSize: string;
    };

interface LandAreas {
  /** Full-precision area in square feet. */
  areaSqFt: number;
  /** The same area in every unit (katha and bigha use `kathaSqFt`). */
  areas: Record<AreaUnit, number>;
  kathaSqFt: number;
  /** True when the katha size is the standard 720 sq ft. */
  standardKatha: boolean;
}

export type LandResult = LandAreas &
  (
    | { mode: "convert"; amount: number; unit: AreaUnit }
    | {
        mode: "measure";
        shape: LandShape;
        lengthUnit: LengthUnit;
        /** Sides as entered, in `lengthUnit`. */
        lengths: Partial<Record<LengthField, number>>;
        /** The same sides in feet. */
        lengthsFt: Partial<Record<LengthField, number>>;
        /** True for the four-sides average method. */
        approximate: boolean;
      }
  );

export type LandCalculation = { ok: true; result: LandResult } | { ok: false; errors: LandError[] };

/** Square feet in one of each unit, for a given katha size (bigha = 20 katha). */
export function areaUnitSizes(kathaSqFt: number = STANDARD_KATHA_SQ_FT): Record<AreaUnit, number> {
  return { ...AREA_UNIT_SQ_FT, katha: kathaSqFt, bigha: kathaSqFt * KATHA_PER_BIGHA };
}

/** An amount in `unit` to square feet. */
export function toSquareFeet(amount: number, unit: AreaUnit, kathaSqFt: number = STANDARD_KATHA_SQ_FT): number {
  return amount * areaUnitSizes(kathaSqFt)[unit];
}

/** Square feet to an amount in `unit`. */
export function fromSquareFeet(sqFt: number, unit: AreaUnit, kathaSqFt: number = STANDARD_KATHA_SQ_FT): number {
  return sqFt / areaUnitSizes(kathaSqFt)[unit];
}

/** One area in square feet expressed in every unit. */
export function convertAll(sqFt: number, kathaSqFt: number = STANDARD_KATHA_SQ_FT): Record<AreaUnit, number> {
  const sizes = areaUnitSizes(kathaSqFt);
  const out = {} as Record<AreaUnit, number>;
  for (const unit of AREA_UNIT_ORDER) out[unit] = sqFt / sizes[unit];
  return out;
}

/** Length × width. */
export function rectangleArea(length: number, width: number): number {
  return length * width;
}

/** Approximate area of a near-rectangular plot: average of opposite sides multiplied (rule 4). */
export function fourSidesArea(north: number, south: number, east: number, west: number): number {
  return ((north + south) / 2) * ((east + west) / 2);
}

/**
 * Triangle area from three sides (Heron's formula, stable form), or null when
 * the sides can't make a triangle (including a flat one with zero area).
 */
export function heronArea(a: number, b: number, c: number): number | null {
  const [x, y, z] = [a, b, c].sort((p, q) => q - p) as [number, number, number];
  if (!(z > 0) || x >= y + z) return null;
  const area = Math.sqrt((x + (y + z)) * (z - (x - y)) * (z + (x - y)) * (x + (y - z))) / 4;
  return area > 0 ? area : null;
}

/** Validates the raw form values and works out the area in every unit. */
export function calculateLand(input: LandInput): LandCalculation {
  const errors: LandError[] = [];
  const katha = checkNumber(input.kathaSize, KATHA_SIZE_RANGE);
  const kathaSqFt = katha.ok ? katha.value : null;

  if (input.mode === "convert") {
    const amount = checkNumber(input.amount, { min: 0, minExclusive: true });
    let areaSqFt: number | null = null;
    if (!amount.ok) {
      errors.push({ field: "amount", code: amount.code });
    } else if (kathaSqFt !== null || (input.unit !== "katha" && input.unit !== "bigha")) {
      // Katha and bigha need a valid katha size before the area can be checked.
      const sqFt = toSquareFeet(amount.value, input.unit, kathaSqFt ?? STANDARD_KATHA_SQ_FT);
      if (inRange(sqFt)) areaSqFt = sqFt;
      else errors.push({ field: "amount", code: "area-too-large" });
    }
    if (!katha.ok) errors.push({ field: "kathaSize", code: katha.code });
    if (errors.length > 0 || !amount.ok || areaSqFt === null || kathaSqFt === null) return { ok: false, errors };

    return {
      ok: true,
      result: { mode: "convert", amount: amount.value, unit: input.unit, ...areas(areaSqFt, kathaSqFt) },
    };
  }

  const fields = SHAPE_FIELDS[input.shape];
  const lengths: Partial<Record<LengthField, number>> = {};
  const lengthsFt: Partial<Record<LengthField, number>> = {};
  for (const field of fields) {
    const check = checkNumber(input.lengths[field] ?? "", { min: 0, minExclusive: true });
    if (check.ok) {
      lengths[field] = check.value;
      lengthsFt[field] = check.value * LENGTH_UNIT_FT[input.lengthUnit];
    } else {
      errors.push({ field, code: check.code });
    }
  }

  let areaSqFt: number | null = null;
  if (errors.length === 0) {
    const ft = (field: LengthField) => lengthsFt[field] ?? 0;
    let raw: number | null;
    switch (input.shape) {
      case "rectangle":
        raw = rectangleArea(ft("length"), ft("width"));
        break;
      case "four-sides":
        raw = fourSidesArea(ft("north"), ft("south"), ft("east"), ft("west"));
        break;
      case "triangle":
        raw = heronArea(ft("sideA"), ft("sideB"), ft("sideC"));
        if (raw === null) errors.push({ field: longestSide(lengthsFt), code: "not-a-triangle" });
        break;
    }
    if (raw !== null) {
      if (inRange(raw)) areaSqFt = raw;
      else errors.push({ field: fields[0]!, code: "area-too-large" });
    }
  }
  if (!katha.ok) errors.push({ field: "kathaSize", code: katha.code });
  if (errors.length > 0 || areaSqFt === null || kathaSqFt === null) return { ok: false, errors };

  return {
    ok: true,
    result: {
      mode: "measure",
      shape: input.shape,
      lengthUnit: input.lengthUnit,
      lengths,
      lengthsFt,
      approximate: input.shape === "four-sides",
      ...areas(areaSqFt, kathaSqFt),
    },
  };
}

/** Finite, positive and not above the limit (rule 5). */
function inRange(sqFt: number): boolean {
  return Number.isFinite(sqFt) && sqFt > 0 && sqFt <= MAX_AREA_SQ_FT;
}

function areas(areaSqFt: number, kathaSqFt: number): LandAreas {
  return {
    areaSqFt,
    areas: convertAll(areaSqFt, kathaSqFt),
    kathaSqFt,
    standardKatha: kathaSqFt === STANDARD_KATHA_SQ_FT,
  };
}

/** The triangle side field with the largest value (the first one on a tie). */
function longestSide(lengthsFt: Partial<Record<LengthField, number>>): LengthField {
  const sides: LengthField[] = ["sideA", "sideB", "sideC"];
  return sides.reduce((best, side) => ((lengthsFt[side] ?? 0) > (lengthsFt[best] ?? 0) ? side : best));
}

import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Unit price comparison rules (documented assumptions):
 *
 * 1. Each option is a price (৳) for a quantity in a unit. Its unit price is
 *    price ÷ quantity, worked out in the smallest unit (g, ml or piece) and
 *    then shown per kg, per litre or per piece, plus per 100 g or per 100 ml.
 * 2. Units are in three groups: weight (g, kg), volume (ml, litre) and count
 *    (piece, dozen, hali). Only options in the same group can be compared;
 *    mixing groups is an error because there is no honest conversion
 *    (a litre of oil is not a kilo of rice).
 * 3. Conversions: 1 kg = 1,000 g, 1 litre = 1,000 ml, 1 dozen = 12 pieces and
 *    1 hali = 4 pieces. Hali and dozen are standard counting words in
 *    Bangladesh (eggs, bananas, oranges). Traditional sher/maund are not used.
 * 4. The cheapest option is the lowest unit price. Options with the same unit
 *    price (within a tiny tolerance for floating-point noise) tie and share
 *    a rank; ranks go 1, 1, 3.
 * 5. Saving = dearest unit price − cheapest unit price, per kg / litre /
 *    piece, and as a percentage of the dearest unit price. "More than the
 *    cheapest" = (unit price − cheapest) ÷ cheapest, as a percentage.
 * 6. Only the unit price is compared. The calculator does not know quality,
 *    brand, shelf life, or whether you will use the whole big pack before it
 *    spoils; a cheaper unit price is not a saving if food is wasted.
 * 7. A row with name, price and quantity all blank is ignored. 2 to 10 options
 *    are needed. Price and quantity must be more than zero.
 * 8. Limits: price up to ৳1 crore; quantity up to 10 lakh in the chosen unit.
 *    Nothing is rounded here; the widget rounds for display.
 */

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 10;
export const MAX_PRICE = 10_000_000;
export const MAX_QUANTITY = 1_000_000;

export const UNIT_IDS = ["g", "kg", "ml", "l", "piece", "dozen", "hali"] as const;
export type UnitId = (typeof UNIT_IDS)[number];
export type UnitGroup = "weight" | "volume" | "count";

/** Each unit's group and how many smallest units (g, ml, piece) it holds. */
export const UNITS: Record<UnitId, { group: UnitGroup; size: number }> = {
  g: { group: "weight", size: 1 },
  kg: { group: "weight", size: 1000 },
  ml: { group: "volume", size: 1 },
  l: { group: "volume", size: 1000 },
  piece: { group: "count", size: 1 },
  dozen: { group: "count", size: 12 },
  hali: { group: "count", size: 4 },
};

export function isUnitId(value: string): value is UnitId {
  return (UNIT_IDS as readonly string[]).includes(value);
}

/** Size, in smallest units, of the main unit prices are shown in (kg, litre, piece). */
export const GROUP_MAIN_SIZE: Record<UnitGroup, number> = { weight: 1000, volume: 1000, count: 1 };
/** Size of the small "per 100" figure, or null for count (per piece only). */
export const GROUP_SMALL_SIZE: Record<UnitGroup, number | null> = { weight: 100, volume: 100, count: null };

export interface OptionRowInput {
  id: number;
  name: string;
  price: string;
  quantity: string;
  unit: string;
}

export type UnitPriceErrorCode = NumberErrorCode | "too-few" | "too-many" | "mixed-groups" | "bad-unit";

export interface UnitPriceError {
  /** Null for errors about the whole list. */
  rowId: number | null;
  field: "price" | "quantity" | "unit" | "rows";
  code: UnitPriceErrorCode;
}

export interface OptionResult {
  rowId: number;
  /** Position of the row in the form, from 1 (blank rows count). */
  position: number;
  name: string;
  price: number;
  quantity: number;
  unit: UnitId;
  /** Price per kg, per litre or per piece (not rounded). */
  perMain: number;
  /** Price per 100 g or per 100 ml; null for count. */
  perSmall: number | null;
  /** 1 = cheapest; ties share a rank. */
  rank: number;
  isCheapest: boolean;
  /** How much more than the cheapest, in percent (0 for the cheapest). */
  morePercent: number;
}

export interface UnitPriceResult {
  group: UnitGroup;
  /** In the order entered. */
  options: OptionResult[];
  /** Indexes into `options`, cheapest first (ties keep entered order). */
  order: number[];
  /** Every option has the same unit price. */
  allSame: boolean;
  /** Dearest − cheapest unit price per main unit. */
  savingPerMain: number;
  /** Saving as a percentage of the dearest unit price. */
  savingPercent: number;
}

export type UnitPriceCalculation = { ok: true; result: UnitPriceResult } | { ok: false; errors: UnitPriceError[] };

export function isBlankOption(row: OptionRowInput): boolean {
  return !row.name.trim() && !row.price.trim() && !row.quantity.trim();
}

/** Same unit price, ignoring floating-point noise. */
function sameValue(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b));
}

export function calculateUnitPrice(rows: readonly OptionRowInput[]): UnitPriceCalculation {
  const errors: UnitPriceError[] = [];
  const filled = rows.map((row, i) => ({ row, position: i + 1 })).filter(({ row }) => !isBlankOption(row));
  if (rows.length > MAX_OPTIONS) errors.push({ rowId: null, field: "rows", code: "too-many" });
  else if (filled.length < MIN_OPTIONS) errors.push({ rowId: null, field: "rows", code: "too-few" });

  const parsed: { row: OptionRowInput; position: number; price: number; quantity: number; unit: UnitId }[] = [];
  for (const { row, position } of filled) {
    const price = checkNumber(row.price, { min: 0, minExclusive: true, max: MAX_PRICE });
    const quantity = checkNumber(row.quantity, { min: 0, minExclusive: true, max: MAX_QUANTITY });
    const unit = isUnitId(row.unit) ? row.unit : null;
    if (!price.ok) errors.push({ rowId: row.id, field: "price", code: price.code });
    if (!quantity.ok) errors.push({ rowId: row.id, field: "quantity", code: quantity.code });
    if (!unit) errors.push({ rowId: row.id, field: "unit", code: "bad-unit" });
    if (price.ok && quantity.ok && unit) parsed.push({ row, position, price: price.value, quantity: quantity.value, unit });
  }

  const groups = new Set(filled.flatMap(({ row }) => (isUnitId(row.unit) ? [UNITS[row.unit].group] : [])));
  if (groups.size > 1) errors.push({ rowId: null, field: "rows", code: "mixed-groups" });
  if (errors.length > 0) return { ok: false, errors };

  const group = UNITS[parsed[0]!.unit].group;
  const small = GROUP_SMALL_SIZE[group];
  const mainSize = GROUP_MAIN_SIZE[group];
  const perBase = parsed.map((p) => p.price / (p.quantity * UNITS[p.unit].size));
  const cheapest = Math.min(...perBase);
  const dearest = Math.max(...perBase);

  const options: OptionResult[] = parsed.map((p, i) => {
    const value = perBase[i]!;
    const isCheapest = sameValue(value, cheapest);
    return {
      rowId: p.row.id,
      position: p.position,
      name: p.row.name.trim(),
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,
      perMain: value * mainSize,
      perSmall: small === null ? null : value * small,
      rank: 1 + perBase.filter((other) => other < value && !sameValue(other, value)).length,
      isCheapest,
      morePercent: isCheapest ? 0 : ((value - cheapest) / cheapest) * 100,
    };
  });

  const order = options.map((_, i) => i).sort((a, b) => options[a]!.rank - options[b]!.rank || a - b);
  const allSame = sameValue(cheapest, dearest);
  return {
    ok: true,
    result: {
      group,
      options,
      order,
      allSame,
      savingPerMain: allSame ? 0 : (dearest - cheapest) * mainSize,
      savingPercent: allSame ? 0 : roundTo(((dearest - cheapest) / dearest) * 100, 10),
    },
  };
}

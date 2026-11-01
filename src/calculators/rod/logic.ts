import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Steel rod (rebar) weight rules (documented assumptions):
 *
 * 1. Theoretical weight from the bar's cross-section and the density of
 *    steel, 7,850 kg/m³: kg per metre = π/4 × d² × 7,850 ÷ 1,000,000, with d
 *    in mm. That is d² ÷ 162.2 (the familiar "d²/162"), or d² ÷ 532.1 per
 *    foot. It gives 0.617 kg/m for 10 mm and 0.888 for 12 mm, the nominal
 *    figures in rebar weight tables.
 * 2. Real bars can weigh slightly more or less (rolling tolerance); for
 *    buying and billing, the weighed or certified weight counts. The page says
 *    so.
 * 3. Length per bar in metres or feet (1 ft = 0.3048 m), times the number of
 *    bars (whole number).
 * 4. Cost is optional: weight in tonnes × the price per tonne the user enters
 *    (prices change and differ by dealer, so none is built in).
 * 5. Diameters offered: 6, 8, 10, 12, 16, 20, 22, 25, 28 and 32 mm.
 * 6. Limits: length more than 0 and up to 100 m or 330 ft per bar; 1 to
 *    1,00,000 bars; price ৳0 to ৳10 lakh per tonne.
 */

export const STEEL_DENSITY_KG_M3 = 7850;
export const DIAMETERS_MM = [6, 8, 10, 12, 16, 20, 22, 25, 28, 32] as const;
export type Diameter = (typeof DIAMETERS_MM)[number];
export const METRES_PER_FOOT = 0.3048;
export const MAX_LENGTH: Readonly<Record<LengthUnit, number>> = { m: 100, ft: 330 };
export const MAX_BARS = 100_000;
export const MAX_PRICE_PER_TONNE = 1_000_000;

export type LengthUnit = "m" | "ft";
export const LENGTH_UNITS: readonly LengthUnit[] = ["m", "ft"];

export type RodField = "length" | "bars" | "price";

export interface RodError {
  field: RodField;
  code: NumberErrorCode;
}

export interface RodResult {
  diameter: Diameter;
  lengthPerBar: number;
  unit: LengthUnit;
  bars: number;
  kgPerMetre: number;
  kgPerFoot: number;
  totalMetres: number;
  totalKg: number;
  totalTonnes: number;
  /** Price per tonne entered, or null when left blank. */
  pricePerTonne: number | null;
  cost: number | null;
}

export type RodCalculation = { ok: true; result: RodResult } | { ok: false; errors: RodError[] };

const clean = (value: number) => roundTo(value, 10);

/** Theoretical weight of a steel bar in kg per metre (d in mm). */
export function kgPerMetre(diameterMm: number): number {
  return clean((Math.PI / 4) * diameterMm * diameterMm * STEEL_DENSITY_KG_M3 * 1e-6);
}

export function calculateRod(
  diameter: Diameter,
  raw: { length: string; bars: string; price: string },
  unit: LengthUnit,
): RodCalculation {
  const errors: RodError[] = [];
  const length = checkNumber(raw.length, { min: 0, minExclusive: true, max: MAX_LENGTH[unit] });
  if (!length.ok) errors.push({ field: "length", code: length.code });
  const bars = checkNumber(raw.bars, { min: 1, max: MAX_BARS, integer: true });
  if (!bars.ok) errors.push({ field: "bars", code: bars.code });
  const priceBlank = !raw.price.trim();
  const price = priceBlank ? null : checkNumber(raw.price, { min: 0, max: MAX_PRICE_PER_TONNE });
  if (price && !price.ok) errors.push({ field: "price", code: price.code });
  if (!length.ok || !bars.ok || (price && !price.ok)) return { ok: false, errors };

  const perMetre = kgPerMetre(diameter);
  const totalMetres = clean(length.value * (unit === "ft" ? METRES_PER_FOOT : 1) * bars.value);
  const totalKg = clean(perMetre * totalMetres);
  const totalTonnes = clean(totalKg / 1000);
  const pricePerTonne = price && price.ok ? price.value : null;
  return {
    ok: true,
    result: {
      diameter,
      lengthPerBar: length.value,
      unit,
      bars: bars.value,
      kgPerMetre: perMetre,
      kgPerFoot: clean(perMetre * METRES_PER_FOOT),
      totalMetres,
      totalKg,
      totalTonnes,
      pricePerTonne,
      cost: pricePerTonne === null ? null : clean(totalTonnes * pricePerTonne),
    },
  };
}

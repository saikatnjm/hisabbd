import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Height and length conversion rules (documented assumptions):
 *
 * 1. 1 inch = 2.54 cm exactly (international inch); 1 foot = 12 inches.
 * 2. হাত (cubit) = 18 inches and গজ (yard) = 3 feet = 36 inches, the same
 *    values as the land calculator.
 * 3. Two ways in: feet + inches (inches may be blank = 0, and may have
 *    decimals), or centimetres.
 * 4. Feet and inches are shown with inches to 1 decimal. The total is rounded
 *    first, so 64.96 in shows as 5 ft 5 in, never as 5 ft 12 in.
 * 5. Limits: feet 0–9 (whole), inches 0 to under 12, total height more than
 *    0; centimetres more than 0 and up to 300.
 */

export const CM_PER_INCH = 2.54;
export const INCHES_PER_FOOT = 12;
export const INCHES_PER_HAAT = 18;
export const INCHES_PER_GOJ = 36;
export const MAX_FEET = 9;
export const MAX_CM = 300;

export type HeightMode = "ft-in" | "cm";
export const HEIGHT_MODES: readonly HeightMode[] = ["ft-in", "cm"];

export type HeightField = "feet" | "inches" | "cm";
export type HeightErrorCode = NumberErrorCode | "zero";

export interface HeightError {
  field: HeightField;
  code: HeightErrorCode;
}

export interface HeightResult {
  mode: HeightMode;
  totalInches: number;
  cm: number;
  m: number;
  /** Whole feet and the inches left over (1 decimal), from the rounded total. */
  feet: number;
  inches: number;
  haat: number;
  goj: number;
}

export type HeightCalculation = { ok: true; result: HeightResult } | { ok: false; errors: HeightError[] };

const clean = (value: number) => roundTo(value, 10);

/** Feet and inches (1 decimal) for a number of inches, rounding the total first. */
export function feetAndInches(totalInches: number): { feet: number; inches: number } {
  const rounded = roundTo(totalInches, 1);
  const feet = Math.floor(rounded / INCHES_PER_FOOT);
  return { feet, inches: roundTo(rounded - feet * INCHES_PER_FOOT, 1) };
}

function resultFor(mode: HeightMode, totalInches: number): HeightResult {
  const cm = clean(totalInches * CM_PER_INCH);
  return {
    mode,
    totalInches: clean(totalInches),
    cm,
    m: clean(cm / 100),
    ...feetAndInches(totalInches),
    haat: clean(totalInches / INCHES_PER_HAAT),
    goj: clean(totalInches / INCHES_PER_GOJ),
  };
}

/** From feet + inches, or from centimetres (by `mode`). */
export function calculateHeight(mode: HeightMode, raw: { feet: string; inches: string; cm: string }): HeightCalculation {
  if (mode === "cm") {
    const cm = checkNumber(raw.cm, { min: 0, minExclusive: true, max: MAX_CM });
    if (!cm.ok) return { ok: false, errors: [{ field: "cm", code: cm.code }] };
    return { ok: true, result: resultFor(mode, cm.value / CM_PER_INCH) };
  }
  const errors: HeightError[] = [];
  const feet = checkNumber(raw.feet, { min: 0, max: MAX_FEET, integer: true });
  if (!feet.ok) errors.push({ field: "feet", code: feet.code });
  const inchesBlank = !raw.inches.trim();
  const inches = inchesBlank ? ({ ok: true, value: 0 } as const) : checkNumber(raw.inches, { min: 0, max: 12 });
  if (!inches.ok) errors.push({ field: "inches", code: inches.code });
  else if (inches.value >= 12) errors.push({ field: "inches", code: "too-large" });
  if (errors.length > 0 || !feet.ok || !inches.ok) return { ok: false, errors };
  const total = feet.value * INCHES_PER_FOOT + inches.value;
  if (total === 0) return { ok: false, errors: [{ field: "feet", code: "zero" }] };
  return { ok: true, result: resultFor(mode, total) };
}

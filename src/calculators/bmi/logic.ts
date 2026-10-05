import { checkNumber, normalizeDigits, parseNumberInput, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * BMI rules and assumptions (documented):
 *
 * 1. BMI = weight in kg / (height in metres)². Weight and height are converted
 *    with exact factors: 1 in = 2.54 cm, 1 lb = 0.45359237 kg.
 * 2. Accepted ranges (reasonable adult values, to catch typos, not medical limits):
 *      height  50 to 272 cm      (ft + in: feet 1 to 8, inches 0 up to but not
 *                                 including 12, and the total must also be 50–272 cm)
 *      weight  2 to 650 kg       (pounds are converted first, then checked)
 *    Inches may be left empty when feet is given; empty inches count as 0.
 *    Feet must be a whole number; inches may have decimals.
 * 3. Categories are the WHO adult cut-offs: under 18.5 Underweight; 18.5 to 24.9
 *    Healthy weight; 25 to 29.9 Overweight; 30 and above Obesity (class I 30 to
 *    34.9, class II 35 to 39.9, class III 40 and above). They are for adults only.
 * 4. The category is chosen from the BMI ROUNDED to 1 decimal, the same number
 *    that is shown, so the number and the category always agree. Example: a BMI
 *    of 24.96 is shown as 25.0 and is classed as Overweight.
 * 5. Healthy weight range for a height = BMI 18.5 to 24.9 multiplied by height²,
 *    returned in the user's weight unit. These are the edges of the Healthy
 *    weight band as published (24.9 is used for the top, not 25).
 */

export type HeightUnit = "cm" | "ftin";
export type WeightUnit = "kg" | "lb";

export const CM_PER_INCH = 2.54;
export const KG_PER_LB = 0.45359237;
export const INCHES_PER_FOOT = 12;

export const HEIGHT_RANGE_CM = { min: 50, max: 272 } as const;
export const WEIGHT_RANGE_KG = { min: 2, max: 650 } as const;
export const FEET_RANGE = { min: 1, max: 8 } as const;

/** Edges of the Healthy weight band, used for the healthy weight range. */
export const HEALTHY_BMI = { min: 18.5, max: 24.9 } as const;

export type BmiCategoryId = "underweight" | "healthy" | "overweight" | "obesity";
export type ObesityClass = 1 | 2 | 3;

export interface BmiInput {
  heightUnit: HeightUnit;
  /** Used when heightUnit is "cm". */
  heightCm: string;
  /** Used when heightUnit is "ftin". */
  heightFeet: string;
  heightInches: string;
  weightUnit: WeightUnit;
  weight: string;
}

export interface BmiResult {
  /** Full-precision BMI. */
  bmi: number;
  /** BMI rounded to 1 decimal: the value shown and classified. */
  bmiRounded: number;
  category: BmiCategoryId;
  /** Only set when category is "obesity". */
  obesityClass: ObesityClass | null;
  heightCm: number;
  weightKg: number;
  weightUnit: WeightUnit;
  /** Healthy weight for this height, in the user's weight unit. */
  healthyWeightRange: { min: number; max: number; unit: WeightUnit };
}

export type BmiField = "heightCm" | "heightFeet" | "heightInches" | "weight";
export type BmiErrorCode = NumberErrorCode | "height-range";

export interface BmiError {
  field: BmiField;
  code: BmiErrorCode;
}

export type BmiCalculation = { ok: true; result: BmiResult } | { ok: false; errors: BmiError[] };

/** Feet and inches to centimetres. */
export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * INCHES_PER_FOOT + inches) * CM_PER_INCH;
}

export function lbToKg(pounds: number): number {
  return pounds * KG_PER_LB;
}

export function kgToLb(kilograms: number): number {
  return kilograms / KG_PER_LB;
}

/** BMI from kilograms and centimetres. Both must be greater than 0. */
export function bmiFromMetric(weightKg: number, heightCm: number): number {
  if (!(weightKg > 0) || !(heightCm > 0)) {
    throw new RangeError("weightKg and heightCm must be greater than 0");
  }
  const metres = heightCm / 100;
  return weightKg / (metres * metres);
}

/** WHO adult category for a BMI. Pass the BMI rounded to 1 decimal (rule 4). */
export function classifyBmi(bmiRounded: number): { category: BmiCategoryId; obesityClass: ObesityClass | null } {
  if (bmiRounded < 18.5) return { category: "underweight", obesityClass: null };
  if (bmiRounded < 25) return { category: "healthy", obesityClass: null };
  if (bmiRounded < 30) return { category: "overweight", obesityClass: null };
  if (bmiRounded < 35) return { category: "obesity", obesityClass: 1 };
  if (bmiRounded < 40) return { category: "obesity", obesityClass: 2 };
  return { category: "obesity", obesityClass: 3 };
}

/** Weight range in kg that gives a BMI of 18.5 to 24.9 at this height. */
export function healthyWeightRangeKg(heightCm: number): { min: number; max: number } {
  const metres = heightCm / 100;
  const squared = metres * metres;
  return { min: HEALTHY_BMI.min * squared, max: HEALTHY_BMI.max * squared };
}

/** Validates the raw form values and calculates BMI. */
export function calculateBmi(input: BmiInput): BmiCalculation {
  const errors: BmiError[] = [];
  let heightCm: number | null = null;

  if (input.heightUnit === "cm") {
    const check = checkNumber(input.heightCm, { min: HEIGHT_RANGE_CM.min, max: HEIGHT_RANGE_CM.max });
    if (check.ok) heightCm = check.value;
    else errors.push({ field: "heightCm", code: check.code });
  } else {
    const feet = checkNumber(input.heightFeet, { min: FEET_RANGE.min, max: FEET_RANGE.max, integer: true });
    if (!feet.ok) errors.push({ field: "heightFeet", code: feet.code });

    // Empty inches count as 0 (rule 2).
    const inchesEmpty = !normalizeDigits(input.heightInches).trim();
    const inchesValue = inchesEmpty ? 0 : parseNumberInput(input.heightInches);
    let inches: number | null = null;
    if (inchesValue === null) errors.push({ field: "heightInches", code: "invalid" });
    else if (inchesValue < 0) errors.push({ field: "heightInches", code: "too-small" });
    else if (inchesValue >= INCHES_PER_FOOT) errors.push({ field: "heightInches", code: "too-large" });
    else inches = inchesValue;

    if (feet.ok && inches !== null) {
      const total = feetInchesToCm(feet.value, inches);
      if (total < HEIGHT_RANGE_CM.min || total > HEIGHT_RANGE_CM.max) {
        errors.push({ field: "heightFeet", code: "height-range" });
      } else {
        heightCm = total;
      }
    }
  }

  let weightKg: number | null = null;
  const weight = checkNumber(input.weight);
  if (!weight.ok) {
    errors.push({ field: "weight", code: weight.code });
  } else {
    const kg = input.weightUnit === "kg" ? weight.value : lbToKg(weight.value);
    if (kg < WEIGHT_RANGE_KG.min) errors.push({ field: "weight", code: "too-small" });
    else if (kg > WEIGHT_RANGE_KG.max) errors.push({ field: "weight", code: "too-large" });
    else weightKg = kg;
  }

  if (errors.length > 0 || heightCm === null || weightKg === null) return { ok: false, errors };

  const bmi = bmiFromMetric(weightKg, heightCm);
  const bmiRounded = roundTo(bmi, 1);
  const { category, obesityClass } = classifyBmi(bmiRounded);
  const rangeKg = healthyWeightRangeKg(heightCm);
  const toUnit = (kg: number) => (input.weightUnit === "kg" ? kg : kgToLb(kg));

  return {
    ok: true,
    result: {
      bmi,
      bmiRounded,
      category,
      obesityClass,
      heightCm,
      weightKg,
      weightUnit: input.weightUnit,
      healthyWeightRange: { min: toUnit(rangeKg.min), max: toUnit(rangeKg.max), unit: input.weightUnit },
    },
  };
}

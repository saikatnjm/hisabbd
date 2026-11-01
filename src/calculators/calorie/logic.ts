import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Calorie (energy) needs rules (documented assumptions):
 *
 * 1. Resting energy (BMR/REE) by the Mifflin–St Jeor equation (Mifflin et al.,
 *    Am J Clin Nutr 1990;51(2):241–7): 10 × weight (kg) + 6.25 × height (cm)
 *    − 5 × age (years), plus 5 for men or minus 161 for women. It was derived
 *    from 498 healthy adults aged 19–78.
 * 2. Daily calories = BMR × an activity factor. The factors (1.2 sedentary,
 *    1.375 light, 1.55 moderate, 1.725 very active, 1.9 extra active) are a
 *    widely used convention, NOT part of the 1990 paper; the page says so.
 * 3. Adults only: age 18–80 (close to the study's range). Not for children
 *    or during pregnancy or breastfeeding, which the page states.
 * 4. Results are kcal per day, rounded to whole kcal for display; nothing is
 *    rounded here except floating-point noise.
 * 5. Limits: height 100–250 cm, weight 20–300 kg.
 * 6. No weight-loss targets or diet advice: the page shows maintenance needs
 *    only and points to a doctor or dietitian.
 */

export const MIN_AGE = 18;
export const MAX_AGE = 80;
export const MIN_HEIGHT_CM = 100;
export const MAX_HEIGHT_CM = 250;
export const MIN_WEIGHT_KG = 20;
export const MAX_WEIGHT_KG = 300;

export type Sex = "male" | "female";
export const SEXES: readonly Sex[] = ["male", "female"];

export const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "very", "extra"] as const;
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

/** Conventional activity factors (not from the 1990 paper). */
export const ACTIVITY_FACTORS: Readonly<Record<ActivityLevel, number>> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export type CalorieField = "age" | "height" | "weight";

export interface CalorieError {
  field: CalorieField;
  code: NumberErrorCode;
}

export interface CalorieResult {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
  /** Resting energy, kcal per day. */
  bmr: number;
  /** BMR × the chosen activity factor, kcal per day. */
  daily: number;
  /** Daily calories at every activity level. */
  byActivity: Readonly<Record<ActivityLevel, number>>;
}

export type CalorieCalculation = { ok: true; result: CalorieResult } | { ok: false; errors: CalorieError[] };

const clean = (value: number) => roundTo(value, 10);

/** Mifflin–St Jeor resting energy, kcal per day. */
export function mifflinStJeor(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  return clean(10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161));
}

export function calculateCalories(
  sex: Sex,
  raw: { age: string; height: string; weight: string },
  activity: ActivityLevel,
): CalorieCalculation {
  const errors: CalorieError[] = [];
  const age = checkNumber(raw.age, { min: MIN_AGE, max: MAX_AGE, integer: true });
  if (!age.ok) errors.push({ field: "age", code: age.code });
  const height = checkNumber(raw.height, { min: MIN_HEIGHT_CM, max: MAX_HEIGHT_CM });
  if (!height.ok) errors.push({ field: "height", code: height.code });
  const weight = checkNumber(raw.weight, { min: MIN_WEIGHT_KG, max: MAX_WEIGHT_KG });
  if (!weight.ok) errors.push({ field: "weight", code: weight.code });
  if (!age.ok || !height.ok || !weight.ok) return { ok: false, errors };

  const bmr = mifflinStJeor(sex, weight.value, height.value, age.value);
  const byActivity = Object.fromEntries(ACTIVITY_LEVELS.map((level) => [level, clean(bmr * ACTIVITY_FACTORS[level])])) as Record<
    ActivityLevel,
    number
  >;
  return {
    ok: true,
    result: { sex, age: age.value, heightCm: height.value, weightKg: weight.value, activity, bmr, daily: byActivity[activity], byActivity },
  };
}

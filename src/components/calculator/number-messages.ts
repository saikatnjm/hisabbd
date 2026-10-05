import type { NumberErrorCode } from "@/lib/number";

/**
 * Friendly messages for number-field problems, shared by all calculators.
 * `label` is lower-case and read in a sentence, e.g. "loan amount".
 * `min`/`max` complete "must be …", e.g. { min: "more than ৳0", max: "100% or less" }.
 */
export function numberErrorMessage(
  code: NumberErrorCode,
  field: { label: string; min?: string; max?: string },
): string {
  switch (code) {
    case "missing":
      return `Enter the ${field.label}.`;
    case "invalid":
      return `Enter the ${field.label} as a number, for example 25000 or 12.5.`;
    case "not-integer":
      return `Enter the ${field.label} as a whole number.`;
    case "too-small":
      return field.min ? `The ${field.label} must be ${field.min}.` : `The ${field.label} is too small.`;
    case "too-large":
      return field.max ? `The ${field.label} must be ${field.max}.` : `The ${field.label} is too large.`;
  }
}

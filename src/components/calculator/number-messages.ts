import type { Locale } from "@/i18n/locales";
import type { NumberErrorCode } from "@/lib/number";

/**
 * Friendly messages for number-field problems, shared by all calculators.
 * `label` is lower-case and read in a sentence, e.g. "loan amount" / "লোনের পরিমাণ".
 * `min`/`max` complete "must be …", e.g. { min: "more than ৳0", max: "100% or less" }.
 * Pass labels and min/max in the same language as `locale`.
 */
export function numberErrorMessage(
  code: NumberErrorCode,
  field: { label: string; min?: string; max?: string },
  locale: Locale = "en",
): string {
  if (locale === "bn") {
    switch (code) {
      case "missing":
        return `${field.label} লিখুন।`;
      case "invalid":
        return `${field.label} সংখ্যায় লিখুন, যেমন 25000 বা 12.5।`;
      case "not-integer":
        return `${field.label} পূর্ণ সংখ্যায় লিখুন।`;
      case "too-small":
        return field.min ? `${field.label} ${field.min} হতে হবে।` : `${field.label} খুব ছোট।`;
      case "too-large":
        return field.max ? `${field.label} ${field.max} হতে হবে।` : `${field.label} খুব বড়।`;
    }
  }
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

/**
 * Parsing and validating numbers typed by users.
 * Accepts Bangla digits (০–৯), thousands separators (25,000 or 1,00,000) and
 * surrounding spaces. Pure functions: no DOM, no UI strings.
 */

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Converts Bangla digits to ASCII digits: "১২৫" → "125". */
export function normalizeDigits(value: string): string {
  return value.replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d)));
}

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

/**
 * Parses a user-typed number. Returns null for empty or malformed input
 * (never NaN or Infinity). Commas are treated as thousands separators.
 */
export function parseNumberInput(value: string): number | null {
  const cleaned = normalizeDigits(value).trim().replace(/[,\s]/g, "");
  if (!NUMBER_PATTERN.test(cleaned)) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export type NumberErrorCode = "missing" | "invalid" | "too-small" | "too-large" | "not-integer";

export interface NumberRule {
  min?: number;
  /** When true, the value must be strictly greater than `min`. */
  minExclusive?: boolean;
  max?: number;
  integer?: boolean;
}

export type NumberCheck = { ok: true; value: number } | { ok: false; code: NumberErrorCode };

/** Parses and checks a number against simple rules. */
export function checkNumber(raw: string, rule: NumberRule = {}): NumberCheck {
  if (!normalizeDigits(raw).trim()) return { ok: false, code: "missing" };
  const value = parseNumberInput(raw);
  if (value === null) return { ok: false, code: "invalid" };
  if (rule.integer && !Number.isInteger(value)) return { ok: false, code: "not-integer" };
  if (rule.min !== undefined && (rule.minExclusive ? value <= rule.min : value < rule.min)) {
    return { ok: false, code: "too-small" };
  }
  if (rule.max !== undefined && value > rule.max) return { ok: false, code: "too-large" };
  return { ok: true, value };
}

/**
 * Rounds half away from zero to a number of decimal places, using the
 * decimal representation so 1.005 → 1.01 and 2.675 → 2.68 (plain
 * Math.round(x * 100) / 100 gets these wrong). Use for presentation and money.
 */
export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return value;
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  const text = String(abs);
  const rounded = text.includes("e")
    ? Math.round(abs * 10 ** decimals) / 10 ** decimals
    : Number(`${Math.round(Number(`${text}e${decimals}`))}e-${decimals}`);
  const result = sign * rounded;
  return Object.is(result, -0) ? 0 : result;
}

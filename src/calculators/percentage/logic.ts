import { checkNumber, roundTo } from "@/lib/number";

/*
 * Percentage calculator rules and assumptions (documented):
 *
 * Modes (A and B are the two boxes, in the order they appear in the sentence):
 *   percent-of         What is A% of B?                 result = A / 100 × B
 *   what-percent       A is what percent of B?          result = A / B × 100          (B ≠ 0)
 *   change             Percentage change from A to B    result = (B − A) / |A| × 100  (A ≠ 0)
 *   increase-decrease  Increase/decrease A by B%        result = A × (1 ± B / 100)
 *   reverse            A is B% of what number?          result = A / (B / 100)        (B ≠ 0)
 *
 * Choices:
 * 1. Decimals and negative numbers are accepted wherever they have a meaning.
 *    The only exception is "increase-decrease", where the percentage B must be
 *    0 or more (the increase/decrease choice already gives the direction).
 * 2. Percentage change divides by |A|, the size of the starting value, so going
 *    from −50 to −25 is +50% (the value rose). The sign of the result always
 *    matches the direction of the move.
 * 3. A change whose difference is zero when rounded to 10 decimals is "none"
 *    with a percentage of exactly 0. This hides floating-point noise such as
 *    0.1 + 0.2 versus 0.3 in what is really "no change".
 * 4. Decreasing by more than 100% gives a negative number. It is mathematically
 *    right, so it is returned, with `decreaseOverHundred` set so the UI can say so.
 * 5. Numbers must have a magnitude of at most 1,000,000,000,000 (10^12). Any
 *    result that would not be a finite number is rejected, never returned.
 * 6. Nothing is rounded here; the UI rounds for display.
 */

export type PercentageMode = "percent-of" | "what-percent" | "change" | "increase-decrease" | "reverse";
export type PercentageDirection = "increase" | "decrease";
export type ChangeDirection = PercentageDirection | "none";

export const MAX_ABSOLUTE_VALUE = 1_000_000_000_000;

/** Floating-point noise below this size (as a difference) counts as "no change". */
const SAME_VALUE_DECIMALS = 10;

export type PercentageField = "a" | "b";
export type PercentageErrorCode =
  | "missing"
  | "invalid"
  /** Beyond ±MAX_ABSOLUTE_VALUE, or the result is too large to show. */
  | "out-of-range"
  /** Must not be 0 (it would mean dividing by zero). */
  | "zero"
  /** Must be 0 or more. */
  | "negative";

export interface PercentageError {
  field: PercentageField;
  code: PercentageErrorCode;
}

export interface PercentageOptions {
  /** Only used by "increase-decrease". Defaults to "increase". */
  direction?: PercentageDirection;
}

export type PercentageResult =
  | { mode: "percent-of"; percent: number; base: number; value: number }
  | { mode: "what-percent"; part: number; whole: number; percent: number }
  | {
      mode: "change";
      from: number;
      to: number;
      /** to − from (signed). */
      difference: number;
      /** Signed percentage change. */
      percent: number;
      direction: ChangeDirection;
    }
  | {
      mode: "increase-decrease";
      base: number;
      percent: number;
      direction: PercentageDirection;
      /** Size of the amount added or removed (never negative). */
      amount: number;
      value: number;
      /** True when decreasing by more than 100%. */
      decreaseOverHundred: boolean;
    }
  | { mode: "reverse"; part: number; percent: number; whole: number };

export type PercentageCalculation =
  | { ok: true; result: PercentageResult }
  | { ok: false; errors: PercentageError[] };

/** P% of Y. */
export function percentOf(percent: number, base: number): number {
  return (percent / 100) * base;
}

/** X as a percentage of Y. Y must not be 0. */
export function whatPercent(part: number, whole: number): number {
  if (whole === 0) throw new RangeError("whole must not be 0");
  return (part / whole) * 100;
}

/** Signed percentage change from `from` to `to`. `from` must not be 0. */
export function percentChange(from: number, to: number): number {
  if (from === 0) throw new RangeError("from must not be 0");
  return ((to - from) / Math.abs(from)) * 100;
}

/** Y increased or decreased by P%. */
export function applyPercentage(base: number, percent: number, direction: PercentageDirection): number {
  const factor = direction === "increase" ? 1 + percent / 100 : 1 - percent / 100;
  return base * factor;
}

/** The number of which `part` is `percent`%. `percent` must not be 0. */
export function wholeFromPart(part: number, percent: number): number {
  if (percent === 0) throw new RangeError("percent must not be 0");
  return part / (percent / 100);
}

type Parsed = { ok: true; value: number } | { ok: false; code: PercentageErrorCode };

function parse(raw: string): Parsed {
  const check = checkNumber(raw, { min: -MAX_ABSOLUTE_VALUE, max: MAX_ABSOLUTE_VALUE });
  if (check.ok) return { ok: true, value: check.value };
  const code: PercentageErrorCode =
    check.code === "too-small" || check.code === "too-large" ? "out-of-range" : check.code === "missing" ? "missing" : "invalid";
  return { ok: false, code };
}

/**
 * Validates the two raw inputs for a mode and calculates the answer.
 * `rawA` and `rawB` follow the order of the sentence for that mode (see top of file).
 */
export function calculatePercentage(
  mode: PercentageMode,
  rawA: string,
  rawB: string,
  options: PercentageOptions = {},
): PercentageCalculation {
  const errors: PercentageError[] = [];
  const a = parse(rawA);
  const b = parse(rawB);
  if (!a.ok) errors.push({ field: "a", code: a.code });
  if (!b.ok) errors.push({ field: "b", code: b.code });
  if (!a.ok || !b.ok) return { ok: false, errors };

  const x = a.value;
  const y = b.value;
  const fail = (field: PercentageField, code: PercentageErrorCode): PercentageCalculation => ({
    ok: false,
    errors: [{ field, code }],
  });
  const finite = (...values: number[]) => values.every((v) => Number.isFinite(v));

  switch (mode) {
    case "percent-of": {
      const value = percentOf(x, y);
      if (!finite(value)) return fail("b", "out-of-range");
      return { ok: true, result: { mode, percent: x, base: y, value } };
    }
    case "what-percent": {
      if (y === 0) return fail("b", "zero");
      const percent = whatPercent(x, y);
      if (!finite(percent)) return fail("b", "out-of-range");
      return { ok: true, result: { mode, part: x, whole: y, percent } };
    }
    case "change": {
      if (x === 0) return fail("a", "zero");
      const difference = y - x;
      const same = roundTo(difference, SAME_VALUE_DECIMALS) === 0;
      const percent = same ? 0 : percentChange(x, y);
      if (!finite(difference, percent)) return fail("b", "out-of-range");
      const direction: ChangeDirection = same ? "none" : difference > 0 ? "increase" : "decrease";
      return { ok: true, result: { mode, from: x, to: y, difference: same ? 0 : difference, percent, direction } };
    }
    case "increase-decrease": {
      if (y < 0) return fail("b", "negative");
      const direction = options.direction ?? "increase";
      const value = applyPercentage(x, y, direction);
      const amount = Math.abs(percentOf(y, x));
      if (!finite(value, amount)) return fail("b", "out-of-range");
      return {
        ok: true,
        result: {
          mode,
          base: x,
          percent: y,
          direction,
          amount,
          value,
          decreaseOverHundred: direction === "decrease" && y > 100,
        },
      };
    }
    case "reverse": {
      if (y === 0) return fail("b", "zero");
      const whole = wholeFromPart(x, y);
      if (!finite(whole)) return fail("b", "out-of-range");
      return { ok: true, result: { mode, part: x, percent: y, whole } };
    }
  }
}

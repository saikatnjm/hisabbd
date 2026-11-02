import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * Hours and minutes calculator rules (documented assumptions):
 *
 * 1. Each row is a duration: whole hours and whole minutes, added or
 *    subtracted. Minutes may be 60 or more (90 minutes = 1 hour 30 minutes).
 * 2. Total minutes = sum of ±(hours × 60 + minutes). The total may be negative
 *    when more is subtracted than added; it is shown with a minus sign.
 * 3. The total is shown as hours and minutes, as decimal hours (to 2 places:
 *    1 h 30 min = 1.5), as minutes, and as days of 24 hours when 24 hours or more.
 * 4. Blank rows are ignored; a row with only hours or only minutes treats the
 *    other as 0. These are durations, not clock times, so there is no midnight
 *    rollover (the work hours calculator handles start and finish times).
 * 5. Limits: 1 to 20 rows; hours 0 to 100,000; minutes 0 to 100,000.
 */

export const MAX_ROWS = 20;
export const MAX_HOURS = 100_000;
export const MAX_MINUTES = 100_000;

export const OPERATIONS = ["add", "subtract"] as const;
export type Operation = (typeof OPERATIONS)[number];

export interface DurationRowInput {
  id: number;
  op: string;
  hours: string;
  minutes: string;
}

export type TimeAddField = "hours" | "minutes" | "rows";
export type TimeAddErrorCode = NumberErrorCode | "no-rows" | "too-many";

export interface TimeAddError {
  rowId: number | null;
  field: TimeAddField;
  code: TimeAddErrorCode;
}

export interface TimeAddResult {
  /** Signed total in minutes. */
  totalMinutes: number;
  /** Parts of |total|. */
  hours: number;
  minutes: number;
  /** Decimal hours of |total|, to 2 places. */
  decimalHours: number;
  /** Whole 24-hour days, remaining hours and minutes of |total|. */
  days: number;
  dayHours: number;
  negative: boolean;
  rowCount: number;
}

export type TimeAddCalculation = { ok: true; result: TimeAddResult } | { ok: false; errors: TimeAddError[] };

export function isBlankRow(row: DurationRowInput): boolean {
  return !row.hours.trim() && !row.minutes.trim();
}

export function calculateTimeTotal(rows: readonly DurationRowInput[]): TimeAddCalculation {
  const errors: TimeAddError[] = [];
  const filled = rows.filter((row) => !isBlankRow(row));
  if (rows.length > MAX_ROWS) errors.push({ rowId: null, field: "rows", code: "too-many" });
  else if (filled.length === 0) errors.push({ rowId: null, field: "rows", code: "no-rows" });

  let total = 0;
  for (const row of filled) {
    const h = row.hours.trim() ? checkNumber(row.hours, { min: 0, max: MAX_HOURS, integer: true }) : ({ ok: true, value: 0 } as const);
    const m = row.minutes.trim() ? checkNumber(row.minutes, { min: 0, max: MAX_MINUTES, integer: true }) : ({ ok: true, value: 0 } as const);
    if (!h.ok) errors.push({ rowId: row.id, field: "hours", code: h.code });
    if (!m.ok) errors.push({ rowId: row.id, field: "minutes", code: m.code });
    if (!h.ok || !m.ok) continue;
    const minutes = h.value * 60 + m.value;
    total += row.op === "subtract" ? -minutes : minutes;
  }
  if (errors.length > 0) return { ok: false, errors };

  const abs = Math.abs(total);
  const hours = Math.floor(abs / 60);
  return {
    ok: true,
    result: {
      totalMinutes: total,
      hours,
      minutes: abs % 60,
      decimalHours: Math.round((abs / 60) * 100) / 100,
      days: Math.floor(hours / 24),
      dayHours: hours % 24,
      negative: total < 0,
      rowCount: filled.length,
    },
  };
}

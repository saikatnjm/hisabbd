import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * Work hours and overtime hours rules (documented assumptions):
 *
 * 1. Each day: hours worked = end time − start time − break minutes. Times
 *    are "HH:MM" (24-hour). If the end time is earlier than the start time,
 *    the shift runs past midnight (e.g. 20:00 to 04:00 = 8 hours). The same
 *    start and end time is an error.
 * 2. Labour Act 2006 s.100: an adult worker normally works no more than 8
 *    hours a day, and up to 10 with overtime (s.108). Daily overtime = hours
 *    worked beyond 8 that day. Days over 10 hours are flagged.
 * 3. s.102: normally no more than 48 hours a week, and never more than 60 in
 *    any week. For up to 7 days entered, the week's total is compared with 48
 *    and 60. Section 108 pays overtime for work beyond the hours set "in any
 *    day or week"; we add up daily overtime, and show the weekly figure for
 *    information. The employer's attendance records decide.
 * 4. Break minutes are entered by the user (blank = 0); the calculator does
 *    not deduct breaks on its own. A break must be shorter than the shift.
 * 5. Everything is counted in whole minutes and shown as hours and minutes
 *    and as decimal hours (to 2 decimals) for the overtime calculator.
 * 6. Limits: 1 to 31 days; break 0 to 600 minutes.
 */

export const NORMAL_DAILY_MINUTES = 8 * 60;
export const MAX_DAILY_MINUTES = 10 * 60;
export const NORMAL_WEEKLY_MINUTES = 48 * 60;
export const MAX_WEEKLY_MINUTES = 60 * 60;
export const MAX_DAYS = 31;
export const MAX_BREAK = 600;

export interface DayRowInput {
  id: number;
  start: string;
  end: string;
  breakMinutes: string;
}

export type WorkHoursField = "start" | "end" | "breakMinutes" | "rows";
export type WorkHoursErrorCode = NumberErrorCode | "time-missing" | "time-invalid" | "same-time" | "break-too-long" | "no-days" | "too-many";

export interface WorkHoursError {
  rowId: number | null;
  field: WorkHoursField;
  code: WorkHoursErrorCode;
}

export interface DayResult {
  rowId: number;
  workedMinutes: number;
  overtimeMinutes: number;
  overnight: boolean;
  /** Over the 10-hour daily maximum of s.100. */
  overMax: boolean;
}

export interface WorkHoursResult {
  days: DayResult[];
  totalMinutes: number;
  regularMinutes: number;
  overtimeMinutes: number;
  /** Only when 7 or fewer days were entered (one week). */
  week: { overNormalMinutes: number; overMax: boolean } | null;
}

export type WorkHoursCalculation = { ok: true; result: WorkHoursResult } | { ok: false; errors: WorkHoursError[] };

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Minutes after midnight for "HH:MM", or null. */
export function parseTime(raw: string): number | null {
  const m = TIME.exec(raw.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export function isBlankDay(row: DayRowInput): boolean {
  return !row.start.trim() && !row.end.trim() && !row.breakMinutes.trim();
}

/** Decimal hours to 2 places, e.g. 150 minutes → 2.5. */
export function toHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

export function calculateWorkHours(rows: readonly DayRowInput[]): WorkHoursCalculation {
  const errors: WorkHoursError[] = [];
  const filled = rows.filter((row) => !isBlankDay(row));
  if (rows.length > MAX_DAYS) errors.push({ rowId: null, field: "rows", code: "too-many" });
  else if (filled.length === 0) errors.push({ rowId: null, field: "rows", code: "no-days" });

  const days: DayResult[] = [];
  for (const row of filled) {
    const start = row.start.trim() ? parseTime(row.start) : null;
    const end = row.end.trim() ? parseTime(row.end) : null;
    if (!row.start.trim()) errors.push({ rowId: row.id, field: "start", code: "time-missing" });
    else if (start === null) errors.push({ rowId: row.id, field: "start", code: "time-invalid" });
    if (!row.end.trim()) errors.push({ rowId: row.id, field: "end", code: "time-missing" });
    else if (end === null) errors.push({ rowId: row.id, field: "end", code: "time-invalid" });
    const brk = row.breakMinutes.trim() ? checkNumber(row.breakMinutes, { min: 0, max: MAX_BREAK, integer: true }) : ({ ok: true, value: 0 } as const);
    if (!brk.ok) errors.push({ rowId: row.id, field: "breakMinutes", code: brk.code });
    if (start === null || end === null || !brk.ok) continue;
    if (start === end) {
      errors.push({ rowId: row.id, field: "end", code: "same-time" });
      continue;
    }
    const overnight = end < start;
    const span = overnight ? end + 1440 - start : end - start;
    if (brk.value >= span) {
      errors.push({ rowId: row.id, field: "breakMinutes", code: "break-too-long" });
      continue;
    }
    const worked = span - brk.value;
    days.push({
      rowId: row.id,
      workedMinutes: worked,
      overtimeMinutes: Math.max(0, worked - NORMAL_DAILY_MINUTES),
      overnight,
      overMax: worked > MAX_DAILY_MINUTES,
    });
  }
  if (errors.length > 0) return { ok: false, errors };

  const totalMinutes = days.reduce((sum, d) => sum + d.workedMinutes, 0);
  const overtimeMinutes = days.reduce((sum, d) => sum + d.overtimeMinutes, 0);
  return {
    ok: true,
    result: {
      days,
      totalMinutes,
      regularMinutes: totalMinutes - overtimeMinutes,
      overtimeMinutes,
      week:
        days.length <= 7
          ? { overNormalMinutes: Math.max(0, totalMinutes - NORMAL_WEEKLY_MINUTES), overMax: totalMinutes > MAX_WEEKLY_MINUTES }
          : null,
    },
  };
}

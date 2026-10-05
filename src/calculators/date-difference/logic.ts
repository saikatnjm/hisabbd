import {
  addDays,
  calendarDifference,
  comparePlainDates,
  dayOfWeek,
  parsePlainDate,
  toDayNumber,
  type PlainDate,
} from "@/lib/plain-date";

/*
 * Date difference rules (documented assumptions):
 *
 * 1. By default the end date is not counted: 1 Jan → 2 Jan is 1 day.
 *    With `includeEndDate`, both the start and end dates are counted, which is
 *    the same as measuring to the day after the end date (1 Jan → 2 Jan = 2 days).
 * 2. Years, months and days are calendar units (see calendarDifference):
 *    complete months, with month-end clamping, then leftover days.
 * 3. If the end date is before the start date, the dates are swapped and the
 *    result says so (`swapped`), rather than showing a negative duration.
 * 4. "Days excluding Fridays and Saturdays" counts days whose weekday is
 *    Sunday–Thursday, Bangladesh's usual working week. Public holidays are not
 *    known to the calculator and are not excluded.
 * 5. Plain calendar dates only: no times or timezones.
 */

/** Friday (5) and Saturday (6). */
export const WEEKEND_DAYS: readonly number[] = [5, 6];

export interface DateDifferenceResult {
  start: PlainDate;
  end: PlainDate;
  /** True when the user's dates were in reverse order and have been swapped. */
  swapped: boolean;
  includeEndDate: boolean;
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  totalWeeks: number;
  remainingDaysAfterWeeks: number;
  /** Days counted that fall Sunday–Thursday. */
  daysExcludingWeekend: number;
}

export type DateDifferenceField = "startDate" | "endDate";

export interface DateDifferenceError {
  field: DateDifferenceField;
  code: "missing" | "invalid";
}

export type DateDifferenceCalculation =
  | { ok: true; result: DateDifferenceResult }
  | { ok: false; errors: DateDifferenceError[] };

/**
 * Counts days in [first, first + count) whose weekday is not in `excluded`.
 * Whole weeks are counted arithmetically; only the remainder is iterated.
 */
export function countDaysExcluding(
  first: PlainDate,
  count: number,
  excluded: readonly number[] = WEEKEND_DAYS,
): number {
  if (count <= 0) return 0;
  const fullWeeks = Math.floor(count / 7);
  let total = fullWeeks * (7 - new Set(excluded).size);
  const startWeekday = dayOfWeek(first);
  for (let i = 0; i < count % 7; i++) {
    if (!excluded.includes((startWeekday + fullWeeks * 7 + i) % 7)) total += 1;
  }
  return total;
}

/** Difference between two valid dates (any order). */
export function getDateDifference(
  a: PlainDate,
  b: PlainDate,
  includeEndDate = false,
): DateDifferenceResult {
  const swapped = comparePlainDates(b, a) < 0;
  const start = swapped ? b : a;
  const end = swapped ? a : b;
  const measuredTo = includeEndDate ? addDays(end, 1) : end;
  const diff = calendarDifference(start, measuredTo);

  return {
    start,
    end,
    swapped,
    includeEndDate,
    years: diff.years,
    months: diff.months,
    days: diff.days,
    totalMonths: diff.totalMonths,
    totalDays: diff.totalDays,
    totalWeeks: Math.floor(diff.totalDays / 7),
    remainingDaysAfterWeeks: diff.totalDays % 7,
    daysExcludingWeekend: countDaysExcluding(start, toDayNumber(measuredTo) - toDayNumber(start)),
  };
}

/** Validates "YYYY-MM-DD" input and calculates the difference. */
export function calculateDateDifference(
  startDate: string,
  endDate: string,
  options: { includeEndDate?: boolean } = {},
): DateDifferenceCalculation {
  const errors: DateDifferenceError[] = [];
  const start = parsePlainDate(startDate);
  const end = parsePlainDate(endDate);

  if (!startDate.trim()) errors.push({ field: "startDate", code: "missing" });
  else if (!start) errors.push({ field: "startDate", code: "invalid" });
  if (!endDate.trim()) errors.push({ field: "endDate", code: "missing" });
  else if (!end) errors.push({ field: "endDate", code: "invalid" });

  if (errors.length > 0 || !start || !end) return { ok: false, errors };
  return { ok: true, result: getDateDifference(start, end, options.includeEndDate ?? false) };
}

/**
 * Calendar dates without time or timezone ("plain dates").
 *
 * Date-only maths is done on { year, month, day } numbers and a day count,
 * never on JavaScript timestamps, so results cannot shift by a day because of
 * the user's timezone or daylight-saving changes.
 * Uses the proleptic Gregorian calendar for years 1–9999 (the range a native
 * <input type="date"> produces).
 */

export interface PlainDate {
  year: number;
  /** 1–12 */
  month: number;
  /** 1–31 */
  day: number;
}

export const MIN_YEAR = 1;
export const MAX_YEAR = 9999;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function isValidPlainDate(date: PlainDate): boolean {
  const { year, month, day } = date;
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    year >= MIN_YEAR &&
    year <= MAX_YEAR &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses "YYYY-MM-DD". Returns null for malformed or impossible dates (e.g. 2023-02-29). */
export function parsePlainDate(value: string): PlainDate | null {
  const match = ISO_DATE.exec(value.trim());
  if (!match) return null;
  const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  return isValidPlainDate(date) ? date : null;
}

export function toIsoDate({ year, month, day }: PlainDate): string {
  const pad = (n: number, width: number) => String(n).padStart(width, "0");
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

/** Negative if a < b, 0 if equal, positive if a > b. */
export function comparePlainDates(a: PlainDate, b: PlainDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

/**
 * Days since 1970-01-01 (can be negative). Integer-only algorithm
 * ("days from civil", H. Hinnant), independent of Date and timezones.
 */
export function toDayNumber({ year, month, day }: PlainDate): number {
  const y = month <= 2 ? year - 1 : year;
  const era = Math.floor(y / 400);
  const yearOfEra = y - era * 400;
  const shiftedMonth = month > 2 ? month - 3 : month + 9;
  const dayOfYear = Math.floor((153 * shiftedMonth + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

/** Whole days from a to b (positive when b is later). */
export function daysBetween(a: PlainDate, b: PlainDate): number {
  return toDayNumber(b) - toDayNumber(a);
}

/** 0 = Sunday … 6 = Saturday. */
export function dayOfWeek(date: PlainDate): number {
  // 1970-01-01 was a Thursday (4).
  return (((toDayNumber(date) + 4) % 7) + 7) % 7;
}

/**
 * Adds calendar months. If the target month is shorter, the day is clamped to
 * its last day: 31 Jan + 1 month = 28 Feb (29 Feb in leap years).
 */
export function addMonths(date: PlainDate, months: number): PlainDate {
  const index = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

export interface CalendarDifference {
  years: number;
  months: number;
  days: number;
  /** Complete calendar months. */
  totalMonths: number;
  /** Exact days. */
  totalDays: number;
}

/**
 * Calendar difference from `from` to `to` (to must not be earlier):
 * complete years and months (with end-of-month clamping, see addMonths),
 * then the remaining days. Never approximates with days / 365.
 */
export function calendarDifference(from: PlainDate, to: PlainDate): CalendarDifference {
  if (comparePlainDates(to, from) < 0) throw new RangeError("`to` must be on or after `from`");
  let totalMonths = (to.year - from.year) * 12 + (to.month - from.month);
  if (totalMonths > 0 && comparePlainDates(addMonths(from, totalMonths), to) > 0) totalMonths -= 1;
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: daysBetween(addMonths(from, totalMonths), to),
    totalMonths,
    totalDays: daysBetween(from, to),
  };
}

/** Adds (or subtracts) whole days. */
export function addDays(date: PlainDate, days: number): PlainDate {
  return fromDayNumber(toDayNumber(date) + days);
}

/** Inverse of toDayNumber ("civil from days", H. Hinnant). */
export function fromDayNumber(dayNumber: number): PlainDate {
  const z = dayNumber + 719468;
  const era = Math.floor(z / 146097);
  const dayOfEra = z - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra - Math.floor(dayOfEra / 1460) + Math.floor(dayOfEra / 36524) - Math.floor(dayOfEra / 146096)) / 365,
  );
  const dayOfYear = dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const mp = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * mp + 2) / 5) + 1;
  const month = mp < 10 ? mp + 3 : mp - 9;
  const year = yearOfEra + era * 400 + (month <= 2 ? 1 : 0);
  return { year, month, day };
}

import {
  addMonths,
  calendarDifference,
  comparePlainDates,
  dayOfWeek,
  daysBetween,
  parsePlainDate,
  type PlainDate,
} from "@/lib/plain-date";

/*
 * Age calculation rules (documented assumptions):
 *
 * 1. Age is counted in whole calendar months from the date of birth, then the
 *    remaining days. It never divides days by 365, so leap years and month
 *    lengths are always exact.
 * 2. A monthly "anniversary" that falls on a day the month doesn't have moves
 *    to that month's last day. Example: born 31 Jan → 1 month old on 28/29 Feb.
 * 3. Someone born on 29 February has their birthday on 28 February in non-leap
 *    years. Some legal systems use 1 March instead; we use 28 February
 *    consistently and say so in the FAQ.
 * 4. The calculation date counts as a full day of the period, so same-day
 *    birth and calculation dates give an age of 0 days.
 * 5. Dates are plain calendar dates (no time or timezone). "Today" is passed in
 *    by the caller, so this module never reads the clock.
 */

export interface AgeResult {
  dateOfBirth: PlainDate;
  calculationDate: PlainDate;
  years: number;
  months: number;
  days: number;
  /** Complete calendar months between the two dates. */
  totalMonths: number;
  /** Exact days between the two dates. */
  totalDays: number;
  totalWeeks: number;
  /** Days left over after whole weeks (0–6). */
  remainingDaysAfterWeeks: number;
  /** 0 = Sunday … 6 = Saturday. */
  birthWeekday: number;
  nextBirthday: {
    date: PlainDate;
    daysAway: number;
    /** Age reached on that birthday. */
    turningAge: number;
  };
}

export type AgeField = "dateOfBirth" | "calculationDate";

export type AgeErrorCode =
  | "missing"
  | "invalid"
  | "birth-date-in-future"
  | "calculation-date-before-birth";

export interface AgeError {
  field: AgeField;
  code: AgeErrorCode;
}

export type AgeCalculation = { ok: true; result: AgeResult } | { ok: false; errors: AgeError[] };

/** The birthday (rule 3) on or after `onOrAfter`, ignoring the day of birth itself. */
function nextBirthdayOnOrAfter(birth: PlainDate, onOrAfter: PlainDate): PlainDate {
  let years = Math.max(onOrAfter.year - birth.year, 1);
  let candidate = addMonths(birth, years * 12);
  if (comparePlainDates(candidate, onOrAfter) < 0) {
    years += 1;
    candidate = addMonths(birth, years * 12);
  }
  return candidate;
}

/**
 * Age breakdown between two valid dates where calculationDate >= dateOfBirth.
 * Use `calculateAge` for raw user input.
 */
export function getAgeBreakdown(dateOfBirth: PlainDate, calculationDate: PlainDate): AgeResult {
  if (comparePlainDates(calculationDate, dateOfBirth) < 0) {
    throw new RangeError("calculationDate must be on or after dateOfBirth");
  }

  const { years, months, days, totalMonths, totalDays } = calendarDifference(
    dateOfBirth,
    calculationDate,
  );
  const birthday = nextBirthdayOnOrAfter(dateOfBirth, calculationDate);

  return {
    dateOfBirth,
    calculationDate,
    years,
    months,
    days,
    totalMonths,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    remainingDaysAfterWeeks: totalDays % 7,
    birthWeekday: dayOfWeek(dateOfBirth),
    nextBirthday: {
      date: birthday,
      daysAway: daysBetween(calculationDate, birthday),
      turningAge: birthday.year - dateOfBirth.year,
    },
  };
}

/**
 * Validates "YYYY-MM-DD" input and calculates age.
 * @param today The user's current local date ("YYYY-MM-DD"); a date of birth after it is rejected.
 */
export function calculateAge(
  dateOfBirth: string,
  calculationDate: string,
  today: string,
): AgeCalculation {
  const errors: AgeError[] = [];
  const birth = parsePlainDate(dateOfBirth);
  const asOf = parsePlainDate(calculationDate);
  const now = parsePlainDate(today);

  if (!dateOfBirth.trim()) errors.push({ field: "dateOfBirth", code: "missing" });
  else if (!birth) errors.push({ field: "dateOfBirth", code: "invalid" });
  else if (now && comparePlainDates(birth, now) > 0) {
    errors.push({ field: "dateOfBirth", code: "birth-date-in-future" });
  }

  if (!calculationDate.trim()) errors.push({ field: "calculationDate", code: "missing" });
  else if (!asOf) errors.push({ field: "calculationDate", code: "invalid" });
  else if (birth && errors.length === 0 && comparePlainDates(asOf, birth) < 0) {
    errors.push({ field: "calculationDate", code: "calculation-date-before-birth" });
  }

  if (errors.length > 0 || !birth || !asOf) return { ok: false, errors };
  return { ok: true, result: getAgeBreakdown(birth, asOf) };
}

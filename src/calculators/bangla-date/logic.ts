import { checkNumber, type NumberErrorCode } from "@/lib/number";
import {
  comparePlainDates,
  dayOfWeek,
  fromDayNumber,
  isLeapYear,
  parsePlainDate,
  toDayNumber,
  type PlainDate,
} from "@/lib/plain-date";

/*
 * Bangla date (Bangabda, বঙ্গাব্দ) rules: the revised calendar used officially
 * in Bangladesh, as revised by Bangla Academy in 2019 (documented assumptions):
 *
 * 1. The Bangla year starts on 14 April (Gregorian) = 1 Boishakh, every year.
 * 2. Month lengths: Boishakh, Joishtho, Asharh, Srabon, Bhadro and Ashwin have
 *    31 days each. Kartik, Agrahayan, Poush, Magh and Chaitra have 30 days.
 *    Falgun has 29 days, or 30 in a leap year.
 * 3. Leap rule: Falgun has 30 days when it contains 29 February, i.e. when the
 *    Gregorian year in which that Falgun falls (Bangla year + 594) is a
 *    Gregorian leap year. The press reports describe the leap year as "every
 *    four years" / "divisible by 4 and not by 100"; we use the full Gregorian
 *    rule (2000 and 2400 are leap years) because the stated aim of the
 *    revision is to keep both calendars in step, and only that rule keeps
 *    1 Boishakh on 14 April forever.
 * 4. With these lengths each month starts on the same Gregorian date every
 *    year (e.g. 1 Poush = 16 December), and the national days fall on fixed
 *    Bangla dates: 21 February = 8 Falgun, 26 March = 12 Chaitra,
 *    16 December = 1 Poush, 14 April = 1 Boishakh.
 * 5. Year: Bangabda = Gregorian year − 593 on or after 14 April, otherwise
 *    Gregorian year − 594 (14 April 2026 starts 1433).
 * 6. Seasons (ঋতু): two months each, starting from Boishakh: Grishma (গ্রীষ্ম),
 *    Borsha (বর্ষা), Shorot (শরৎ), Hemonto (হেমন্ত), Sheet (শীত), Boshonto (বসন্ত).
 * 7. Range: Bangabda 1–8000, i.e. 14 April 594 to 13 April 8594 (Gregorian).
 *    That is narrower than the 1–9999 range plain-date supports, so it is the
 *    limit. The rules are applied proleptically: dates before the 2019
 *    revision (and before Bangladesh's earlier 1987 adoption of the Bangla
 *    Academy calendar) were written by older rules and may differ by a day.
 * 8. This is the Bangladesh calendar. The traditional (Surya Siddhanta based)
 *    calendar used in West Bengal and India has variable month lengths, so
 *    its dates can differ; it is not modelled.
 * 9. Bangla digits: a Bangla date is conventionally written with Bangla
 *    digits ("১২ কার্তিক ১৪৩৩ বঙ্গাব্দ"), so this calculator shows that form
 *    as its main output. That is a deliberate exception to the site-wide
 *    convention of Western digits in Bangla text; the Western-digit form
 *    ("12 Kartik 1433" / "12 কার্তিক 1433") is shown alongside it.
 * 10. Exact maths only: dates are converted through day numbers
 *    (toDayNumber / fromDayNumber), never Date timestamps.
 *
 * Sources: Dhaka Tribune, "Ashshin in 31 days in revised Bangla calendar"
 * (22 October 2019, quoting Bangla Academy secretary Mohammad Anwar Hossain);
 * The Daily Star, "Pahela Falgun, Valentine's Day: '2 days' in 24 hours"
 * (February 2020, on the fixed 8 Falgun / 12 Chaitra / 1 Poush anchors).
 */

export const MIN_BANGLA_YEAR = 1;
export const MAX_BANGLA_YEAR = 8000;
/** Bangabda = Gregorian year − 593 from 14 April (rule 5). */
export const BANGABDA_OFFSET = 593;

export interface BanglaMonth {
  /** English transliteration, e.g. "Boishakh". */
  name: string;
  /** Bangla name, e.g. "বৈশাখ". */
  nameBn: string;
}

/** The 12 Bangla months, index 0 = Boishakh. */
export const BANGLA_MONTHS: readonly BanglaMonth[] = [
  { name: "Boishakh", nameBn: "বৈশাখ" },
  { name: "Joishtho", nameBn: "জ্যৈষ্ঠ" },
  { name: "Asharh", nameBn: "আষাঢ়" },
  { name: "Srabon", nameBn: "শ্রাবণ" },
  { name: "Bhadro", nameBn: "ভাদ্র" },
  { name: "Ashwin", nameBn: "আশ্বিন" },
  { name: "Kartik", nameBn: "কার্তিক" },
  { name: "Agrahayan", nameBn: "অগ্রহায়ণ" },
  { name: "Poush", nameBn: "পৌষ" },
  { name: "Magh", nameBn: "মাঘ" },
  { name: "Falgun", nameBn: "ফাল্গুন" },
  { name: "Chaitra", nameBn: "চৈত্র" },
];

export interface BanglaSeason {
  /** Transliteration, e.g. "Grishma". */
  name: string;
  nameBn: string;
  /** Plain-English meaning, e.g. "summer". */
  meaning: string;
}

/** The six seasons, two months each from Boishakh (rule 6). */
export const BANGLA_SEASONS: readonly BanglaSeason[] = [
  { name: "Grishma", nameBn: "গ্রীষ্ম", meaning: "summer" },
  { name: "Borsha", nameBn: "বর্ষা", meaning: "monsoon" },
  { name: "Shorot", nameBn: "শরৎ", meaning: "autumn" },
  { name: "Hemonto", nameBn: "হেমন্ত", meaning: "late autumn" },
  { name: "Sheet", nameBn: "শীত", meaning: "winter" },
  { name: "Boshonto", nameBn: "বসন্ত", meaning: "spring" },
];

/** Index of Falgun in BANGLA_MONTHS + 1. */
const FALGUN = 11;

export interface BanglaDateParts {
  year: number;
  /** 1 = Boishakh … 12 = Chaitra */
  month: number;
  day: number;
}

export interface BanglaDate extends BanglaDateParts {
  monthName: string;
  monthNameBn: string;
  /** Season transliteration, e.g. "Hemonto". */
  season: string;
  seasonBn: string;
  /** Plain-English meaning of the season, e.g. "late autumn". */
  seasonMeaning: string;
}

/** True when Falgun of this Bangla year has 30 days (rule 3). */
export function isBanglaLeapYear(banglaYear: number): boolean {
  return isLeapYear(banglaYear + BANGABDA_OFFSET + 1);
}

/** Days in a Bangla month (rule 2). `month` is 1–12. */
export function banglaMonthLength(banglaYear: number, month: number): number {
  if (month <= 6) return 31;
  if (month === FALGUN) return isBanglaLeapYear(banglaYear) ? 30 : 29;
  return 30;
}

/** 1 Boishakh of a Bangla year as a Gregorian date: always 14 April (rule 1). */
export function banglaYearStart(banglaYear: number): PlainDate {
  return { year: banglaYear + BANGABDA_OFFSET, month: 4, day: 14 };
}

/** First and last Gregorian dates the converter supports (rule 7). */
export const MIN_GREGORIAN_DATE: PlainDate = banglaYearStart(MIN_BANGLA_YEAR);
export const MAX_GREGORIAN_DATE: PlainDate = { year: MAX_BANGLA_YEAR + BANGABDA_OFFSET + 1, month: 4, day: 13 };

/** True when a Gregorian date falls within Bangabda 1–8000. */
export function isInBanglaRange(date: PlainDate): boolean {
  return comparePlainDates(date, MIN_GREGORIAN_DATE) >= 0 && comparePlainDates(date, MAX_GREGORIAN_DATE) <= 0;
}

function describe({ year, month, day }: BanglaDateParts): BanglaDate {
  const monthInfo = BANGLA_MONTHS[month - 1]!;
  const season = BANGLA_SEASONS[Math.floor((month - 1) / 2)]!;
  return {
    year,
    month,
    day,
    monthName: monthInfo.name,
    monthNameBn: monthInfo.nameBn,
    season: season.name,
    seasonBn: season.nameBn,
    seasonMeaning: season.meaning,
  };
}

/**
 * Converts a valid Gregorian date to the revised Bangla calendar.
 * Throws RangeError outside Bangabda 1–8000 (check with isInBanglaRange).
 */
export function toBanglaDate(date: PlainDate): BanglaDate {
  if (!isInBanglaRange(date)) throw new RangeError("Date is outside Bangabda 1–8000");
  const onOrAfterNewYear = date.month > 4 || (date.month === 4 && date.day >= 14);
  const year = date.year - BANGABDA_OFFSET - (onOrAfterNewYear ? 0 : 1);
  let remaining = toDayNumber(date) - toDayNumber(banglaYearStart(year));
  let month = 1;
  while (remaining >= banglaMonthLength(year, month)) {
    remaining -= banglaMonthLength(year, month);
    month += 1;
  }
  return describe({ year, month, day: remaining + 1 });
}

export type BanglaDateErrorCode = NumberErrorCode | "day-not-in-month";

export type BanglaDateField = "banglaYear" | "banglaMonth" | "banglaDay";

export interface BanglaDateError {
  field: BanglaDateField;
  code: BanglaDateErrorCode;
}

export type FromBanglaDate =
  | { ok: true; date: PlainDate }
  | { ok: false; errors: BanglaDateError[] };

/**
 * Converts a Bangla date to the Gregorian calendar. The day must exist in that
 * month of that year: Falgun 30 only in a leap year, Kartik 31 never.
 * Year must be a whole number 1–8000, month 1–12 and day 1–31.
 */
export function fromBanglaDate({ year, month, day }: BanglaDateParts): FromBanglaDate {
  const errors: BanglaDateError[] = [];
  if (!Number.isInteger(year)) errors.push({ field: "banglaYear", code: "not-integer" });
  else if (year < MIN_BANGLA_YEAR) errors.push({ field: "banglaYear", code: "too-small" });
  else if (year > MAX_BANGLA_YEAR) errors.push({ field: "banglaYear", code: "too-large" });

  if (!Number.isInteger(month) || month < 1 || month > 12) errors.push({ field: "banglaMonth", code: "invalid" });

  if (!Number.isInteger(day)) errors.push({ field: "banglaDay", code: "not-integer" });
  else if (day < 1) errors.push({ field: "banglaDay", code: "too-small" });
  else if (day > 31) errors.push({ field: "banglaDay", code: "too-large" });
  else if (errors.length === 0 && day > banglaMonthLength(year, month)) {
    errors.push({ field: "banglaDay", code: "day-not-in-month" });
  }

  if (errors.length > 0) return { ok: false, errors };

  let offset = day - 1;
  for (let m = 1; m < month; m++) offset += banglaMonthLength(year, m);
  return { ok: true, date: fromDayNumber(toDayNumber(banglaYearStart(year)) + offset) };
}

/** One conversion, either direction: both dates plus the weekday (0 = Sunday). */
export interface BanglaDateResult {
  gregorian: PlainDate;
  bangla: BanglaDate;
  weekday: number;
}

export type GregorianDateErrorCode = "missing" | "invalid" | "out-of-range";

export type BanglaDateCalculation =
  | { ok: true; result: BanglaDateResult }
  | { ok: false; errors: ({ field: "gregorianDate"; code: GregorianDateErrorCode } | BanglaDateError)[] };

function resultFor(gregorian: PlainDate): BanglaDateResult {
  return { gregorian, bangla: toBanglaDate(gregorian), weekday: dayOfWeek(gregorian) };
}

/** Validates a "YYYY-MM-DD" Gregorian date and converts it to Bangla. */
export function calculateBanglaDate(gregorianDate: string): BanglaDateCalculation {
  if (!gregorianDate.trim()) return { ok: false, errors: [{ field: "gregorianDate", code: "missing" }] };
  const date = parsePlainDate(gregorianDate);
  if (!date) return { ok: false, errors: [{ field: "gregorianDate", code: "invalid" }] };
  if (!isInBanglaRange(date)) return { ok: false, errors: [{ field: "gregorianDate", code: "out-of-range" }] };
  return { ok: true, result: resultFor(date) };
}

/**
 * Validates raw Bangla year, month ("1"–"12" from a select) and day, then
 * converts to Gregorian. Accepts Bangla digits ("১৪৩৩"). Reports every field.
 */
export function calculateGregorianDate(rawYear: string, rawMonth: string, rawDay: string): BanglaDateCalculation {
  const errors: BanglaDateError[] = [];
  const year = checkNumber(rawYear, { min: MIN_BANGLA_YEAR, max: MAX_BANGLA_YEAR, integer: true });
  if (!year.ok) errors.push({ field: "banglaYear", code: year.code });
  const month = checkNumber(rawMonth, { min: 1, max: 12, integer: true });
  if (!month.ok) errors.push({ field: "banglaMonth", code: month.code === "missing" ? "missing" : "invalid" });
  const day = checkNumber(rawDay, { min: 1, max: 31, integer: true });
  if (!day.ok) errors.push({ field: "banglaDay", code: day.code });
  if (!year.ok || !month.ok || !day.ok) return { ok: false, errors };

  const converted = fromBanglaDate({ year: year.value, month: month.value, day: day.value });
  if (!converted.ok) return converted;
  return { ok: true, result: resultFor(converted.date) };
}

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Converts ASCII digits to Bangla digits, leaving other characters: "12 1433" → "১২ ১৪৩৩". */
export function toBanglaDigits(text: string | number): string {
  return String(text).replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)]!);
}

/** The conventional written form, in Bangla digits (rule 9): "১২ কার্তিক ১৪৩৩ বঙ্গাব্দ". */
export function formatBanglaDateBn(date: BanglaDateParts): string {
  const month = BANGLA_MONTHS[date.month - 1]!;
  return `${toBanglaDigits(date.day)} ${month.nameBn} ${toBanglaDigits(date.year)} বঙ্গাব্দ`;
}

/** Western digits with the month in English or Bangla: "12 Kartik 1433" / "12 কার্তিক 1433". */
export function formatBanglaDateWestern(date: BanglaDateParts, monthNames: "en" | "bn"): string {
  const month = BANGLA_MONTHS[date.month - 1]!;
  return `${date.day} ${monthNames === "bn" ? month.nameBn : month.name} ${date.year}`;
}

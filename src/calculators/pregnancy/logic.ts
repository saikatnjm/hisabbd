import { addDays, comparePlainDates, daysBetween, parsePlainDate, type PlainDate } from "@/lib/plain-date";

/*
 * Pregnancy due date rules (documented assumptions):
 *
 * 1. Due date (EDD) = first day of the last menstrual period (LMP) + 280 days
 *    (40 weeks). This is the convention in ACOG Committee Opinion No. 700,
 *    "Methods for estimating the due date" (2017, with AIUM and SMFM).
 * 2. No adjustment for cycle length. Many websites add (cycle − 28) days, but
 *    we found no authoritative source for that rule, so we leave it out and
 *    say so. ACOG: a first-trimester ultrasound is more accurate than the LMP,
 *    and a date set by ultrasound or IVF should be used instead; the "due date
 *    from my doctor" mode takes such a date as given.
 * 3. "Due date" mode works backwards: the LMP-equivalent date = EDD − 280 days,
 *    and everything else follows from it.
 * 4. Gestational age = days from the LMP to the "as of" date (today by
 *    default), shown as completed weeks + days ("24 weeks 3 days").
 * 5. Trimesters (ACOG): first up to 13 weeks 6 days, second 14w0d–27w6d,
 *    third from 28w0d.
 * 6. Term categories (ACOG Committee Opinion No. 579, 2013): early term
 *    37w0d–38w6d, full term 39w0d–40w6d, late term 41w0d–41w6d, post-term
 *    from 42w0d. We give the date each one starts.
 * 7. Limits: the LMP can't be after the "as of" date, nor more than 44 weeks
 *    (308 days) before it; in due date mode the EDD can be at most 280 days
 *    after and 28 days before the "as of" date. Plain dates only; "today" is
 *    passed in by the caller.
 * 8. This is general information, not medical advice; the page says so.
 */

export const PREGNANCY_DAYS = 280;
export const MAX_DAYS_SINCE_LMP = 308;
export const MAX_DAYS_PAST_DUE = 28;

/** Week (completed) at which each trimester and term category starts. */
export const SECOND_TRIMESTER_WEEK = 14;
export const THIRD_TRIMESTER_WEEK = 28;
export const TERM_WEEKS = { earlyTerm: 37, fullTerm: 39, lateTerm: 41, postTerm: 42 } as const;

export type PregnancyMode = "lmp" | "due-date";
export const PREGNANCY_MODES: readonly PregnancyMode[] = ["lmp", "due-date"];

export type PregnancyField = "date" | "asOf";
export type PregnancyErrorCode = "missing" | "invalid" | "lmp-after-as-of" | "lmp-too-long-ago" | "due-too-far" | "due-too-long-ago";

export interface PregnancyError {
  field: PregnancyField;
  code: PregnancyErrorCode;
}

export type TermId = keyof typeof TERM_WEEKS;

export interface PregnancyResult {
  mode: PregnancyMode;
  /** The LMP entered, or the LMP-equivalent worked back from the due date. */
  lmp: PlainDate;
  dueDate: PlainDate;
  asOf: PlainDate;
  /** Days from the LMP to the "as of" date. */
  gestationalDays: number;
  /** Completed weeks and the days after them. */
  weeks: number;
  days: number;
  trimester: 1 | 2 | 3;
  /** Days from the "as of" date to the due date; negative once it has passed. */
  daysToDue: number;
  /** Share of the 280 days completed, 0–100 (capped). */
  progressPercent: number;
  /** Date each term category starts. */
  termStarts: Record<TermId, PlainDate>;
}

export type PregnancyCalculation = { ok: true; result: PregnancyResult } | { ok: false; errors: PregnancyError[] };

/** Due date from the first day of the last period. */
export function dueDateFromLmp(lmp: PlainDate): PlainDate {
  return addDays(lmp, PREGNANCY_DAYS);
}

/** The LMP-equivalent date for a known due date. */
export function lmpFromDueDate(dueDate: PlainDate): PlainDate {
  return addDays(dueDate, -PREGNANCY_DAYS);
}

/** Trimester for a gestational age in days. */
export function trimesterFor(gestationalDays: number): 1 | 2 | 3 {
  if (gestationalDays < SECOND_TRIMESTER_WEEK * 7) return 1;
  if (gestationalDays < THIRD_TRIMESTER_WEEK * 7) return 2;
  return 3;
}

/**
 * Due date, gestational age and trimester. `rawDate` is the LMP or the due
 * date (by `mode`), `rawAsOf` the day to measure on (YYYY-MM-DD).
 */
export function calculatePregnancy(mode: PregnancyMode, rawDate: string, rawAsOf: string): PregnancyCalculation {
  const errors: PregnancyError[] = [];
  const date = rawDate.trim() ? parsePlainDate(rawDate.trim()) : null;
  const asOf = rawAsOf.trim() ? parsePlainDate(rawAsOf.trim()) : null;
  if (!rawDate.trim()) errors.push({ field: "date", code: "missing" });
  else if (!date) errors.push({ field: "date", code: "invalid" });
  if (!rawAsOf.trim()) errors.push({ field: "asOf", code: "missing" });
  else if (!asOf) errors.push({ field: "asOf", code: "invalid" });
  if (!date || !asOf) return { ok: false, errors };

  const lmp = mode === "lmp" ? date : lmpFromDueDate(date);
  const gestationalDays = daysBetween(lmp, asOf);
  if (mode === "lmp") {
    if (comparePlainDates(lmp, asOf) > 0) errors.push({ field: "date", code: "lmp-after-as-of" });
    else if (gestationalDays > MAX_DAYS_SINCE_LMP) errors.push({ field: "date", code: "lmp-too-long-ago" });
  } else {
    const daysToDue = daysBetween(asOf, date);
    if (daysToDue > PREGNANCY_DAYS) errors.push({ field: "date", code: "due-too-far" });
    else if (daysToDue < -MAX_DAYS_PAST_DUE) errors.push({ field: "date", code: "due-too-long-ago" });
  }
  if (errors.length > 0) return { ok: false, errors };

  const dueDate = dueDateFromLmp(lmp);
  const termStarts = Object.fromEntries(
    (Object.keys(TERM_WEEKS) as TermId[]).map((id) => [id, addDays(lmp, TERM_WEEKS[id] * 7)]),
  ) as Record<TermId, PlainDate>;

  return {
    ok: true,
    result: {
      mode,
      lmp,
      dueDate,
      asOf,
      gestationalDays,
      weeks: Math.floor(gestationalDays / 7),
      days: gestationalDays % 7,
      trimester: trimesterFor(gestationalDays),
      daysToDue: daysBetween(asOf, dueDate),
      progressPercent: Math.min(100, (gestationalDays / PREGNANCY_DAYS) * 100),
      termStarts,
    },
  };
}

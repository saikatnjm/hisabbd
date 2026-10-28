import { checkNumber, normalizeDigits, type NumberErrorCode } from "@/lib/number";
import {
  addDays,
  addMonths,
  calendarDifference,
  comparePlainDates,
  parsePlainDate,
  type PlainDate,
} from "@/lib/plain-date";

/*
 * Government job age-limit rules (documented assumptions):
 *
 * 1. Age is the calendar age on the circular's reference ("age as on") date,
 *    counted exactly like the Age Calculator: complete years, then complete
 *    months, then days. A birthday on 29 February falls on 28 February in
 *    common years (addMonths clamping), so both calculators always agree.
 * 2. effectiveMax = max + relaxation (extra years a quota or post allows).
 * 3. Eligible when completed years >= min AND completed years <= effectiveMax.
 *    Someone aged 32 years 11 months is "32", so they meet a 32 maximum; they
 *    stop meeting it on their 33rd birthday.
 * 4. `borderline` is true when completed years === effectiveMax. Some circulars
 *    read the upper limit as "must not have turned N" instead, and we could not
 *    verify an official convention, so the page warns the user to check the
 *    date-of-birth range printed in the circular. The circular's wording wins.
 * 5. The eligible date-of-birth window on the reference date is
 *      bornOnOrAfter  = (reference − (effectiveMax + 1) years) + 1 day
 *      bornOnOrBefore =  reference − min years
 *    using addMonths(×12). Around 29 February that subtraction can land one
 *    day off the completed-years rule (e.g. reference 28 Feb 2025: someone born
 *    29 Feb 1992 turned 33 that day), so each end is nudged by at most a day
 *    until it agrees with rule 3 exactly.
 * 6. Limits: min and max are whole years 0–70 with min <= max; relaxation is a
 *    whole number of years 0–10, blank = 0.
 * 7. Presets (below) are the common published limits, not legal advice. The
 *    circular's own age limit, reference date and relaxations always win.
 * 8. Dates are plain calendar dates (no time or timezone). "Today" is chosen by
 *    the widget as the default reference date; this module never reads the clock.
 */

/**
 * Preset age limits.
 * - Maximum age 32 for direct recruitment to government jobs under the 2026
 *   act: https://www.jagonews24.com/en/national/news/91510
 * - BCS 21–32 as on the circular's date (51st special BCS circular):
 *   https://www.thedailystar.net/news/governance/news/51st-special-bcs-circular-issued-5000-health-cadre-posts-4281956
 * - The 18 minimum for other government jobs is the common circular minimum,
 *   not a single rule; the widget tells users to check the circular.
 */
export const JOB_AGE_PRESETS = {
  bcs: { min: 21, max: 32 },
  govt: { min: 18, max: 32 },
} as const;

export type JobAgePresetId = keyof typeof JOB_AGE_PRESETS | "custom";

export const MIN_AGE_LIMIT = 0;
export const MAX_AGE_LIMIT = 70;
export const MAX_RELAXATION_YEARS = 10;

export interface JobAgeInput {
  dateOfBirth: string;
  /** The circular's "age as on" date ("YYYY-MM-DD"). */
  referenceDate: string;
  preset: JobAgePresetId;
  /** Used only when preset is "custom". */
  minAge: string;
  /** Used only when preset is "custom". */
  maxAge: string;
  /** Extra years allowed; blank = 0. */
  relaxation: string;
}

/** A calendar span: complete years, then months, then days. */
export interface YearsMonthsDays {
  years: number;
  months: number;
  days: number;
}

export type JobAgeStatus = "eligible" | "too-young" | "too-old";

export interface JobAgeResult {
  dateOfBirth: PlainDate;
  referenceDate: PlainDate;
  /** Age on the reference date (rule 1). */
  age: YearsMonthsDays;
  minAge: number;
  maxAge: number;
  relaxationYears: number;
  /** maxAge + relaxationYears (rule 2). */
  effectiveMaxAge: number;
  status: JobAgeStatus;
  /** Completed years equal effectiveMaxAge: the upper-limit wording matters (rule 4). */
  borderline: boolean;
  /** Earliest date of birth that is eligible on the reference date. */
  bornOnOrAfter: PlainDate;
  /** Latest date of birth that is eligible on the reference date. */
  bornOnOrBefore: PlainDate;
  /** Birthday on which the person reaches minAge. */
  reachesMinAgeOn: PlainDate;
  /** Birthday on which the person turns effectiveMaxAge + 1 and passes the limit. */
  passesLimitOn: PlainDate;
  /** Time from the reference date until reachesMinAgeOn; set only when too young. */
  untilMinAge: YearsMonthsDays | null;
  /** Time from passesLimitOn to the reference date; set only when too old. */
  overLimitBy: YearsMonthsDays | null;
}

export type JobAgeField = "dateOfBirth" | "referenceDate" | "minAge" | "maxAge" | "relaxation";

export type JobAgeErrorCode = NumberErrorCode | "birth-after-reference-date" | "less-than-min";

export interface JobAgeError {
  field: JobAgeField;
  code: JobAgeErrorCode;
}

export type JobAgeCalculation = { ok: true; result: JobAgeResult } | { ok: false; errors: JobAgeError[] };

/** The birthday on which someone born on `birth` turns `years` (rule 1 clamping). */
export function birthdayAt(birth: PlainDate, years: number): PlainDate {
  return addMonths(birth, years * 12);
}

/**
 * The latest date of birth that is at least `years` old on `reference` (rule 5).
 * Starts from reference − years and steps forward past a 29 February that
 * also qualifies; the loop runs at most once.
 */
export function latestBirthWithAge(reference: PlainDate, years: number): PlainDate {
  let birth = addMonths(reference, -years * 12);
  while (comparePlainDates(birthdayAt(addDays(birth, 1), years), reference) <= 0) {
    birth = addDays(birth, 1);
  }
  return birth;
}

/**
 * Age-limit check between two valid dates where referenceDate >= dateOfBirth.
 * Use `calculateJobAge` for raw user input.
 */
export function checkJobAge(
  dateOfBirth: PlainDate,
  referenceDate: PlainDate,
  limits: { minAge: number; maxAge: number; relaxationYears: number },
): JobAgeResult {
  if (comparePlainDates(referenceDate, dateOfBirth) < 0) {
    throw new RangeError("referenceDate must be on or after dateOfBirth");
  }
  const { minAge, maxAge, relaxationYears } = limits;
  const effectiveMaxAge = maxAge + relaxationYears;
  const { years, months, days } = calendarDifference(dateOfBirth, referenceDate);

  const status: JobAgeStatus =
    years < minAge ? "too-young" : years > effectiveMaxAge ? "too-old" : "eligible";
  const reachesMinAgeOn = birthdayAt(dateOfBirth, minAge);
  const passesLimitOn = birthdayAt(dateOfBirth, effectiveMaxAge + 1);
  const span = (from: PlainDate, to: PlainDate): YearsMonthsDays => {
    const d = calendarDifference(from, to);
    return { years: d.years, months: d.months, days: d.days };
  };

  return {
    dateOfBirth,
    referenceDate,
    age: { years, months, days },
    minAge,
    maxAge,
    relaxationYears,
    effectiveMaxAge,
    status,
    borderline: status === "eligible" && years === effectiveMaxAge,
    bornOnOrAfter: addDays(latestBirthWithAge(referenceDate, effectiveMaxAge + 1), 1),
    bornOnOrBefore: latestBirthWithAge(referenceDate, minAge),
    reachesMinAgeOn,
    passesLimitOn,
    untilMinAge: status === "too-young" ? span(referenceDate, reachesMinAgeOn) : null,
    overLimitBy: status === "too-old" ? span(passesLimitOn, referenceDate) : null,
  };
}

/** Validates the raw form values and checks the age limit. */
export function calculateJobAge(input: JobAgeInput): JobAgeCalculation {
  const errors: JobAgeError[] = [];
  const birth = parsePlainDate(input.dateOfBirth);
  const reference = parsePlainDate(input.referenceDate);

  if (!input.dateOfBirth.trim()) errors.push({ field: "dateOfBirth", code: "missing" });
  else if (!birth) errors.push({ field: "dateOfBirth", code: "invalid" });
  else if (reference && comparePlainDates(birth, reference) > 0) {
    errors.push({ field: "dateOfBirth", code: "birth-after-reference-date" });
  }

  if (!input.referenceDate.trim()) errors.push({ field: "referenceDate", code: "missing" });
  else if (!reference) errors.push({ field: "referenceDate", code: "invalid" });

  let minAge: number | null = null;
  let maxAge: number | null = null;
  if (input.preset === "custom") {
    const rule = { min: MIN_AGE_LIMIT, max: MAX_AGE_LIMIT, integer: true };
    const min = checkNumber(input.minAge, rule);
    const max = checkNumber(input.maxAge, rule);
    if (!min.ok) errors.push({ field: "minAge", code: min.code });
    if (!max.ok) errors.push({ field: "maxAge", code: max.code });
    else if (min.ok && max.value < min.value) errors.push({ field: "maxAge", code: "less-than-min" });
    else if (min.ok) {
      minAge = min.value;
      maxAge = max.value;
    }
  } else {
    minAge = JOB_AGE_PRESETS[input.preset].min;
    maxAge = JOB_AGE_PRESETS[input.preset].max;
  }

  // Blank relaxation counts as 0 (rule 6).
  let relaxationYears: number | null = 0;
  if (normalizeDigits(input.relaxation).trim()) {
    const relaxation = checkNumber(input.relaxation, { min: 0, max: MAX_RELAXATION_YEARS, integer: true });
    if (relaxation.ok) relaxationYears = relaxation.value;
    else {
      relaxationYears = null;
      errors.push({ field: "relaxation", code: relaxation.code });
    }
  }

  if (errors.length > 0 || !birth || !reference || minAge === null || maxAge === null || relaxationYears === null) {
    return { ok: false, errors };
  }
  return { ok: true, result: checkJobAge(birth, reference, { minAge, maxAge, relaxationYears }) };
}

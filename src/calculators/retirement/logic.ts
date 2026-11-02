import { addMonths, calendarDifference, comparePlainDates, parsePlainDate, type CalendarDifference, type PlainDate } from "@/lib/plain-date";

/*
 * Government retirement date rules (Civil Service Act 2018, সরকারি চাকরি আইন,
 * 2018, Act No. 57 of 2018, read on bdlaws on 2 November 2026):
 *
 * 1. s.43(1): a government servant retires on completing 59 years of age; a
 *    freedom fighter government servant on completing 60 years.
 * 2. The Act doesn't say which calendar day "completing 59 years" falls on.
 *    We show the date the person turns 59 (or 60), their birthday, and the
 *    page says the office's retirement order sets the exact last working day.
 *    A 29 February birthday falls on 28 February in other years.
 * 3. s.47: after retiring, post-retirement leave (অবসর-উত্তর ছুটি, PRL) of up
 *    to 1 year, subject to the rules. We show the latest date it could run to
 *    (retirement date + 1 year); the actual length depends on leave due.
 * 4. s.44: optional retirement any time after completing 25 years of service,
 *    with at least 30 days' written notice, which can't be withdrawn. Shown
 *    only if a joining date is given, as the date 25 years after joining.
 * 5. s.3(3): the Act doesn't apply to, among others, the judiciary, defence,
 *    public universities, autonomous bodies and state enterprises, local
 *    government, project posts, and contract, ad hoc or temporary jobs; the
 *    page lists them.
 * 6. Plain dates only; "today" is passed in. Date of birth can't be after
 *    today; a joining date must be after the date of birth and not after today.
 */

export const RETIREMENT_AGE = 59;
export const FREEDOM_FIGHTER_RETIREMENT_AGE = 60;
export const OPTIONAL_RETIREMENT_YEARS = 25;
export const PRL_MAX_YEARS = 1;

export type RetirementField = "dateOfBirth" | "joiningDate" | "asOf";
export type RetirementErrorCode = "missing" | "invalid" | "in-future" | "joining-before-birth";

export interface RetirementError {
  field: RetirementField;
  code: RetirementErrorCode;
}

export interface RetirementResult {
  dateOfBirth: PlainDate;
  asOf: PlainDate;
  freedomFighter: boolean;
  retirementAge: number;
  retirementDate: PlainDate;
  /** Latest date PRL could last to (retirement date + 1 year). */
  prlUntil: PlainDate;
  /** Already past the retirement date on the "as of" date. */
  retired: boolean;
  /** Time from "as of" to the retirement date (future), or since it (past). */
  gap: CalendarDifference;
  /** Date 25 years after joining, if a joining date was given. */
  optionalFrom: PlainDate | null;
  optionalReached: boolean;
}

export type RetirementCalculation = { ok: true; result: RetirementResult } | { ok: false; errors: RetirementError[] };

/** The date someone turns `years` old (their birthday that year). */
export function dateAtAge(dateOfBirth: PlainDate, years: number): PlainDate {
  return addMonths(dateOfBirth, years * 12);
}

function readDate(raw: string, field: RetirementField, errors: RetirementError[], required: boolean): PlainDate | null {
  if (!raw.trim()) {
    if (required) errors.push({ field, code: "missing" });
    return null;
  }
  const date = parsePlainDate(raw.trim());
  if (!date) errors.push({ field, code: "invalid" });
  return date;
}

export function calculateRetirement(
  rawDateOfBirth: string,
  freedomFighter: boolean,
  rawJoiningDate: string,
  rawAsOf: string,
): RetirementCalculation {
  const errors: RetirementError[] = [];
  const dateOfBirth = readDate(rawDateOfBirth, "dateOfBirth", errors, true);
  const joining = readDate(rawJoiningDate, "joiningDate", errors, false);
  const asOf = readDate(rawAsOf, "asOf", errors, true);
  if (dateOfBirth && asOf && comparePlainDates(dateOfBirth, asOf) > 0) errors.push({ field: "dateOfBirth", code: "in-future" });
  if (joining && asOf && comparePlainDates(joining, asOf) > 0) errors.push({ field: "joiningDate", code: "in-future" });
  else if (joining && dateOfBirth && comparePlainDates(joining, dateOfBirth) <= 0) {
    errors.push({ field: "joiningDate", code: "joining-before-birth" });
  }
  if (errors.length > 0 || !dateOfBirth || !asOf) return { ok: false, errors };

  const retirementAge = freedomFighter ? FREEDOM_FIGHTER_RETIREMENT_AGE : RETIREMENT_AGE;
  const retirementDate = dateAtAge(dateOfBirth, retirementAge);
  const retired = comparePlainDates(asOf, retirementDate) >= 0;
  const optionalFrom = joining ? addMonths(joining, OPTIONAL_RETIREMENT_YEARS * 12) : null;

  return {
    ok: true,
    result: {
      dateOfBirth,
      asOf,
      freedomFighter,
      retirementAge,
      retirementDate,
      prlUntil: addMonths(retirementDate, PRL_MAX_YEARS * 12),
      retired,
      gap: retired ? calendarDifference(retirementDate, asOf) : calendarDifference(asOf, retirementDate),
      optionalFrom,
      optionalReached: optionalFrom !== null && comparePlainDates(asOf, optionalFrom) >= 0,
    },
  };
}

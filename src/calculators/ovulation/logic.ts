import { addDays, comparePlainDates, daysBetween, parsePlainDate, type PlainDate } from "@/lib/plain-date";
import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * Ovulation and fertile-days rules (documented assumptions):
 *
 * 1. Next period = first day of the last period + cycle length (days).
 * 2. Likely ovulation: the NHS says it happens "around 10 to 16 days before
 *    the next period" in most women, so we show that 7-day range, not a single
 *    day. For a regular 28-day cycle that is days 12–18, around day 14
 *    (NHS, "Periods and fertility in the menstrual cycle", reviewed 5 Jan 2023).
 * 3. Sperm can survive up to 7 days (same NHS page), so sex in the days before
 *    ovulation can also lead to pregnancy; the page says so instead of
 *    inventing a precise "fertile window".
 * 4. Cycle length 20–45 days is accepted; the NHS calls 21–35 normal, and the
 *    result flags cycles outside that range as harder to predict.
 * 5. The last period can't be after the "as of" date nor more than 90 days
 *    before it. Three cycles are shown, starting from the last period.
 * 6. This is not contraception and not medical advice; the page says so.
 *    Plain dates only; "today" is passed in by the caller.
 */

export const MIN_CYCLE = 20;
export const MAX_CYCLE = 45;
export const NORMAL_CYCLE_MIN = 21;
export const NORMAL_CYCLE_MAX = 35;
export const OVULATION_DAYS_BEFORE = { earliest: 16, latest: 10 } as const;
export const MAX_DAYS_SINCE_PERIOD = 90;
export const CYCLES_SHOWN = 3;

export type OvulationField = "lastPeriod" | "cycle" | "asOf";
export type OvulationErrorCode = NumberErrorCode | "date-missing" | "date-invalid" | "after-as-of" | "too-long-ago";

export interface OvulationError {
  field: OvulationField;
  code: OvulationErrorCode;
}

export interface CycleEstimate {
  periodStart: PlainDate;
  /** First and last day of the likely ovulation range. */
  ovulationFrom: PlainDate;
  ovulationTo: PlainDate;
  nextPeriod: PlainDate;
}

export interface OvulationResult {
  lastPeriod: PlainDate;
  cycleLength: number;
  asOf: PlainDate;
  /** Day of the current cycle on the "as of" date (day 1 = first day of the period). */
  cycleDay: number;
  /** Outside the NHS's 21–35 day normal range. */
  irregular: boolean;
  cycles: CycleEstimate[];
}

export type OvulationCalculation = { ok: true; result: OvulationResult } | { ok: false; errors: OvulationError[] };

/** The likely ovulation range and next period for a cycle starting on `periodStart`. */
export function cycleEstimate(periodStart: PlainDate, cycleLength: number): CycleEstimate {
  const nextPeriod = addDays(periodStart, cycleLength);
  return {
    periodStart,
    ovulationFrom: addDays(nextPeriod, -OVULATION_DAYS_BEFORE.earliest),
    ovulationTo: addDays(nextPeriod, -OVULATION_DAYS_BEFORE.latest),
    nextPeriod,
  };
}

function parseDate(raw: string, field: OvulationField, errors: OvulationError[]): PlainDate | null {
  if (!raw.trim()) {
    errors.push({ field, code: "date-missing" });
    return null;
  }
  const date = parsePlainDate(raw.trim());
  if (!date) errors.push({ field, code: "date-invalid" });
  return date;
}

export function calculateOvulation(rawLastPeriod: string, rawCycle: string, rawAsOf: string): OvulationCalculation {
  const errors: OvulationError[] = [];
  const lastPeriod = parseDate(rawLastPeriod, "lastPeriod", errors);
  const cycle = checkNumber(rawCycle, { min: MIN_CYCLE, max: MAX_CYCLE, integer: true });
  if (!cycle.ok) errors.push({ field: "cycle", code: cycle.code });
  const asOf = parseDate(rawAsOf, "asOf", errors);
  if (lastPeriod && asOf) {
    if (comparePlainDates(lastPeriod, asOf) > 0) errors.push({ field: "lastPeriod", code: "after-as-of" });
    else if (daysBetween(lastPeriod, asOf) > MAX_DAYS_SINCE_PERIOD) errors.push({ field: "lastPeriod", code: "too-long-ago" });
  }
  if (errors.length > 0 || !lastPeriod || !asOf || !cycle.ok) return { ok: false, errors };

  const cycles: CycleEstimate[] = [];
  let start = lastPeriod;
  for (let i = 0; i < CYCLES_SHOWN; i += 1) {
    const estimate = cycleEstimate(start, cycle.value);
    cycles.push(estimate);
    start = estimate.nextPeriod;
  }
  return {
    ok: true,
    result: {
      lastPeriod,
      cycleLength: cycle.value,
      asOf,
      cycleDay: (daysBetween(lastPeriod, asOf) % cycle.value) + 1,
      irregular: cycle.value < NORMAL_CYCLE_MIN || cycle.value > NORMAL_CYCLE_MAX,
      cycles,
    },
  };
}

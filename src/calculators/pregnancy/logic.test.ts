import { describe, expect, it } from "vitest";
import { parsePlainDate } from "@/lib/plain-date";
import {
  calculatePregnancy,
  dueDateFromLmp,
  lmpFromDueDate,
  MAX_DAYS_PAST_DUE,
  MAX_DAYS_SINCE_LMP,
  trimesterFor,
  type PregnancyCalculation,
} from "./logic";

const d = (iso: string) => parsePlainDate(iso)!;

function ok(calc: PregnancyCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: PregnancyCalculation) => (calc.ok ? [] : calc.errors);

describe("dueDateFromLmp / lmpFromDueDate", () => {
  it("adds and removes 280 days across months and years", () => {
    expect(dueDateFromLmp(d("2026-06-01"))).toEqual(d("2027-03-08"));
    expect(dueDateFromLmp(d("2026-01-01"))).toEqual(d("2026-10-08"));
    expect(lmpFromDueDate(d("2027-05-20"))).toEqual(d("2026-08-13"));
  });

  it("handles a leap day in between", () => {
    // 2028 is a leap year: 1 June 2027 + 280 days lands on 7 March 2028.
    expect(dueDateFromLmp(d("2027-06-01"))).toEqual(d("2028-03-07"));
  });
});

describe("trimesterFor", () => {
  it("uses 14w0d and 28w0d as the boundaries", () => {
    expect(trimesterFor(0)).toBe(1);
    expect(trimesterFor(13 * 7 + 6)).toBe(1);
    expect(trimesterFor(14 * 7)).toBe(2);
    expect(trimesterFor(27 * 7 + 6)).toBe(2);
    expect(trimesterFor(28 * 7)).toBe(3);
  });
});

describe("calculatePregnancy", () => {
  it("works out the page's example: LMP 1 June 2026, as of 1 November 2026", () => {
    const r = ok(calculatePregnancy("lmp", "2026-06-01", "2026-11-01"));
    expect(r.dueDate).toEqual(d("2027-03-08"));
    expect(r.gestationalDays).toBe(153);
    expect([r.weeks, r.days]).toEqual([21, 6]);
    expect(r.trimester).toBe(2);
    expect(r.daysToDue).toBe(127);
    expect(r.progressPercent).toBeCloseTo(54.642857, 5);
    expect(r.termStarts).toEqual({
      earlyTerm: d("2027-02-15"),
      fullTerm: d("2027-03-01"),
      lateTerm: d("2027-03-15"),
      postTerm: d("2027-03-22"),
    });
  });

  it("works back from a due date: due 20 May 2027, as of 1 November 2026", () => {
    const r = ok(calculatePregnancy("due-date", "2027-05-20", "2026-11-01"));
    expect(r.lmp).toEqual(d("2026-08-13"));
    expect(r.dueDate).toEqual(d("2027-05-20"));
    expect([r.weeks, r.days]).toEqual([11, 3]);
    expect(r.trimester).toBe(1);
  });

  it("allows the LMP on the as-of date (0 weeks) and up to 44 weeks before", () => {
    expect(ok(calculatePregnancy("lmp", "2026-11-01", "2026-11-01")).gestationalDays).toBe(0);
    const far = ok(calculatePregnancy("lmp", "2025-12-28", "2026-11-01"));
    expect(far.gestationalDays).toBe(MAX_DAYS_SINCE_LMP);
    expect(far.daysToDue).toBe(-28);
    expect(far.progressPercent).toBe(100);
  });

  it("rejects an LMP after the as-of date or more than 44 weeks before it", () => {
    expect(errors(calculatePregnancy("lmp", "2026-11-02", "2026-11-01"))).toEqual([{ field: "date", code: "lmp-after-as-of" }]);
    expect(errors(calculatePregnancy("lmp", "2025-12-27", "2026-11-01"))).toEqual([{ field: "date", code: "lmp-too-long-ago" }]);
  });

  it("limits a due date to 280 days ahead and 28 days past", () => {
    expect(calculatePregnancy("due-date", "2027-08-08", "2026-11-01").ok).toBe(true);
    expect(errors(calculatePregnancy("due-date", "2027-08-09", "2026-11-01"))).toEqual([{ field: "date", code: "due-too-far" }]);
    expect(calculatePregnancy("due-date", "2026-10-04", "2026-11-01").ok).toBe(true);
    expect(MAX_DAYS_PAST_DUE).toBe(28);
    expect(errors(calculatePregnancy("due-date", "2026-10-03", "2026-11-01"))).toEqual([{ field: "date", code: "due-too-long-ago" }]);
  });

  it("reports missing and invalid dates together", () => {
    expect(errors(calculatePregnancy("lmp", "", ""))).toEqual([
      { field: "date", code: "missing" },
      { field: "asOf", code: "missing" },
    ]);
    expect(errors(calculatePregnancy("lmp", "2026-02-30", "2026-13-01"))).toEqual([
      { field: "date", code: "invalid" },
      { field: "asOf", code: "invalid" },
    ]);
  });
});

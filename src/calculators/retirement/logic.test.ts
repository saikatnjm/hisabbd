import { describe, expect, it } from "vitest";
import { parsePlainDate } from "@/lib/plain-date";
import { calculateRetirement, dateAtAge, type RetirementCalculation } from "./logic";

const d = (iso: string) => parsePlainDate(iso)!;

function ok(calc: RetirementCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: RetirementCalculation) => (calc.ok ? [] : calc.errors);

describe("dateAtAge", () => {
  it("is the birthday that year, with 29 February moving to 28 February", () => {
    expect(dateAtAge(d("1970-05-15"), 59)).toEqual(d("2029-05-15"));
    expect(dateAtAge(d("1968-02-29"), 59)).toEqual(d("2027-02-28"));
  });
});

describe("calculateRetirement", () => {
  it("works out the page's example: born 15 May 1970, joined 1 July 1996, on 2 November 2026", () => {
    const r = ok(calculateRetirement("1970-05-15", false, "1996-07-01", "2026-11-02"));
    expect(r.retirementAge).toBe(59);
    expect(r.retirementDate).toEqual(d("2029-05-15"));
    expect(r.prlUntil).toEqual(d("2030-05-15"));
    expect(r.retired).toBe(false);
    expect([r.gap.years, r.gap.months, r.gap.days]).toEqual([2, 6, 13]);
    expect(r.optionalFrom).toEqual(d("2021-07-01"));
    expect(r.optionalReached).toBe(true);
  });

  it("uses 60 years for a freedom fighter", () => {
    const r = ok(calculateRetirement("1970-05-15", true, "", "2026-11-02"));
    expect(r.retirementAge).toBe(60);
    expect(r.retirementDate).toEqual(d("2030-05-15"));
    expect(r.optionalFrom).toBeNull();
  });

  it("says when someone has already retired", () => {
    const r = ok(calculateRetirement("1965-01-10", false, "", "2026-11-02"));
    expect(r.retired).toBe(true);
    expect(r.retirementDate).toEqual(d("2024-01-10"));
    expect([r.gap.years, r.gap.months, r.gap.days]).toEqual([2, 9, 23]);
  });

  it("counts the retirement date itself as retired", () => {
    expect(ok(calculateRetirement("1967-11-02", false, "", "2026-11-02")).retired).toBe(true);
  });

  it("checks the dates", () => {
    expect(errors(calculateRetirement("", false, "", ""))).toEqual([
      { field: "dateOfBirth", code: "missing" },
      { field: "asOf", code: "missing" },
    ]);
    expect(errors(calculateRetirement("2027-01-01", false, "2027-02-01", "2026-11-02"))).toEqual([
      { field: "dateOfBirth", code: "in-future" },
      { field: "joiningDate", code: "in-future" },
    ]);
    expect(errors(calculateRetirement("1970-05-15", false, "1970-05-15", "2026-11-02"))).toEqual([
      { field: "joiningDate", code: "joining-before-birth" },
    ]);
    expect(errors(calculateRetirement("1970-02-30", false, "x", "2026-11-02"))).toEqual([
      { field: "dateOfBirth", code: "invalid" },
      { field: "joiningDate", code: "invalid" },
    ]);
  });
});

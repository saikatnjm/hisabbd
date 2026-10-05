import { describe, expect, it } from "vitest";
import { parsePlainDate, type PlainDate } from "@/lib/plain-date";
import { calculateDateDifference, countDaysExcluding, getDateDifference } from "./logic";

function d(iso: string): PlainDate {
  const date = parsePlainDate(iso);
  if (!date) throw new Error(iso);
  return date;
}

function diff(a: string, b: string, includeEndDate = false) {
  const calc = calculateDateDifference(a, b, { includeEndDate });
  if (!calc.ok) throw new Error(JSON.stringify(calc.errors));
  return calc.result;
}

describe("date difference", () => {
  it("counts calendar years, months and days", () => {
    const r = diff("2026-01-01", "2026-12-25");
    expect([r.years, r.months, r.days]).toEqual([0, 11, 24]);
    expect(r.totalDays).toBe(358);
    expect(r.totalWeeks).toBe(51);
    expect(r.remainingDaysAfterWeeks).toBe(1);
  });

  it("handles long spans exactly", () => {
    const r = diff("2000-01-01", "2026-10-05");
    expect([r.years, r.months, r.days]).toEqual([26, 9, 4]);
    expect(r.totalDays).toBe(9774);
    expect(r.daysExcludingWeekend).toBe(6981);
  });

  it("same date is zero, or one day when the end date is included", () => {
    expect(diff("2026-10-05", "2026-10-05").totalDays).toBe(0);
    const inclusive = diff("2026-10-05", "2026-10-05", true);
    expect(inclusive.totalDays).toBe(1);
    expect([inclusive.years, inclusive.months, inclusive.days]).toEqual([0, 0, 1]);
  });

  it("including the end date adds exactly one day", () => {
    expect(diff("2026-01-01", "2026-01-02").totalDays).toBe(1);
    expect(diff("2026-01-01", "2026-01-02", true).totalDays).toBe(2);
    const month = diff("2026-01-01", "2026-01-31", true);
    expect([month.years, month.months, month.days, month.totalDays]).toEqual([0, 1, 0, 31]);
  });

  it("handles leap years and month lengths", () => {
    expect(diff("2024-02-01", "2024-03-01").totalDays).toBe(29);
    expect(diff("2023-02-01", "2023-03-01").totalDays).toBe(28);
    expect(diff("2024-01-01", "2025-01-01").totalDays).toBe(366);
    const r = diff("2024-01-31", "2024-02-29");
    expect([r.months, r.days]).toEqual([1, 0]);
  });

  it("swaps reversed dates and says so", () => {
    const r = diff("2026-12-25", "2026-01-01");
    expect(r.swapped).toBe(true);
    expect(r.totalDays).toBe(358);
    expect(r.start).toEqual(d("2026-01-01"));
    expect(diff("2026-01-01", "2026-12-25").swapped).toBe(false);
  });
});

describe("days excluding Fridays and Saturdays", () => {
  it("counts five days in any full week", () => {
    expect(countDaysExcluding(d("2026-10-04"), 7)).toBe(5); // Sunday start
    expect(countDaysExcluding(d("2026-10-09"), 7)).toBe(5); // Friday start
    expect(countDaysExcluding(d("2026-10-04"), 70)).toBe(50);
  });

  it("handles partial weeks", () => {
    expect(countDaysExcluding(d("2026-10-09"), 2)).toBe(0); // Fri + Sat
    expect(countDaysExcluding(d("2026-10-08"), 3)).toBe(1); // Thu, Fri, Sat
    expect(countDaysExcluding(d("2026-10-04"), 0)).toBe(0);
  });

  it("follows the include-end-date choice", () => {
    // Thu 1 Jan 2026 → Fri 2 Jan 2026
    expect(diff("2026-01-01", "2026-01-02").daysExcludingWeekend).toBe(1);
    expect(diff("2026-01-01", "2026-01-02", true).daysExcludingWeekend).toBe(1);
    expect(getDateDifference(d("2026-01-01"), d("2026-12-25")).daysExcludingWeekend).toBe(256);
  });
});

describe("validation", () => {
  it("reports missing and invalid dates per field", () => {
    expect(calculateDateDifference("", "", {})).toEqual({
      ok: false,
      errors: [
        { field: "startDate", code: "missing" },
        { field: "endDate", code: "missing" },
      ],
    });
    expect(calculateDateDifference("2026-02-30", "2026-01-01")).toEqual({
      ok: false,
      errors: [{ field: "startDate", code: "invalid" }],
    });
    expect(calculateDateDifference("2026-01-01", "26-1-1")).toEqual({
      ok: false,
      errors: [{ field: "endDate", code: "invalid" }],
    });
  });
});

import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  calendarDifference,
  fromDayNumber,
  dayOfWeek,
  daysBetween,
  daysInMonth,
  isLeapYear,
  parsePlainDate,
  toDayNumber,
  toIsoDate,
} from "./plain-date";

const d = (iso: string) => {
  const date = parsePlainDate(iso);
  if (!date) throw new Error(`bad test date ${iso}`);
  return date;
};

describe("plain dates", () => {
  it("knows leap years", () => {
    expect([2024, 2000, 1600].map(isLeapYear)).toEqual([true, true, true]);
    expect([2023, 1900, 2100].map(isLeapYear)).toEqual([false, false, false]);
  });

  it("knows month lengths", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
    expect(daysInMonth(2023, 4)).toBe(30);
    expect(daysInMonth(2023, 12)).toBe(31);
  });

  it("parses valid ISO dates and round-trips them", () => {
    expect(toIsoDate(d("2024-02-29"))).toBe("2024-02-29");
    expect(toIsoDate(d("0001-01-01"))).toBe("0001-01-01");
  });

  it("rejects malformed and impossible dates", () => {
    for (const bad of ["", "2023-02-29", "2023-13-01", "2023-04-31", "2023-00-10", "0000-01-01", "23-1-1", "2023/01/01", "abc"]) {
      expect(parsePlainDate(bad)).toBe(null);
    }
  });

  it("counts days without timezone effects", () => {
    expect(toDayNumber(d("1970-01-01"))).toBe(0);
    expect(toDayNumber(d("2000-03-01"))).toBe(11017);
    expect(daysBetween(d("2023-01-01"), d("2024-01-01"))).toBe(365);
    expect(daysBetween(d("2024-01-01"), d("2025-01-01"))).toBe(366);
    expect(daysBetween(d("1900-02-28"), d("1900-03-01"))).toBe(1);
  });

  it("matches the JavaScript calendar on a range of dates", () => {
    for (const iso of ["1899-12-31", "1969-12-31", "2000-02-29", "2038-01-19", "2100-03-01"]) {
      const [y, m, day] = iso.split("-").map(Number) as [number, number, number];
      expect(toDayNumber(d(iso))).toBe(Date.UTC(y, m - 1, day) / 86_400_000);
    }
  });

  it("finds the day of the week", () => {
    expect(dayOfWeek(d("1970-01-01"))).toBe(4); // Thursday
    expect(dayOfWeek(d("2026-10-05"))).toBe(1); // Monday
    expect(dayOfWeek(d("1900-01-01"))).toBe(1); // Monday
  });

  it("adds months with end-of-month clamping", () => {
    expect(toIsoDate(addMonths(d("2023-01-31"), 1))).toBe("2023-02-28");
    expect(toIsoDate(addMonths(d("2024-01-31"), 1))).toBe("2024-02-29");
    expect(toIsoDate(addMonths(d("2024-02-29"), 12))).toBe("2025-02-28");
    expect(toIsoDate(addMonths(d("2023-11-15"), 3))).toBe("2024-02-15");
  });

  it("converts day numbers back to dates", () => {
    for (const iso of ["1970-01-01", "2000-02-29", "1900-03-01", "0001-01-01", "9999-12-31", "2026-10-05"]) {
      expect(toIsoDate(fromDayNumber(toDayNumber(d(iso))))).toBe(iso);
    }
    expect(toIsoDate(addDays(d("2024-02-28"), 1))).toBe("2024-02-29");
    expect(toIsoDate(addDays(d("2023-12-31"), 1))).toBe("2024-01-01");
    expect(toIsoDate(addDays(d("2024-03-01"), -1))).toBe("2024-02-29");
  });

  it("computes calendar differences", () => {
    expect(calendarDifference(d("2026-01-31"), d("2026-03-01"))).toEqual({
      years: 0, months: 1, days: 1, totalMonths: 1, totalDays: 29,
    });
    expect(calendarDifference(d("2020-02-29"), d("2026-10-05"))).toEqual({
      years: 6, months: 7, days: 6, totalMonths: 79, totalDays: 2410,
    });
    expect(() => calendarDifference(d("2026-01-02"), d("2026-01-01"))).toThrow(RangeError);
  });
});

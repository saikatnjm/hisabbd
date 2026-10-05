import { describe, expect, it } from "vitest";
import { toIsoDate } from "@/lib/plain-date";
import { calculateAge, getAgeBreakdown, type AgeCalculation } from "./logic";

const TODAY = "2026-10-05";

function age(dob: string, asOf: string, today = TODAY) {
  const calc = calculateAge(dob, asOf, today);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

/** [years, months, days] */
const ymd = (dob: string, asOf: string) => {
  const r = age(dob, asOf);
  return [r.years, r.months, r.days];
};

const errors = (calc: AgeCalculation) => (calc.ok ? [] : calc.errors);

describe("normal cases", () => {
  it("exact whole years", () => {
    expect(ymd("2000-06-15", "2026-06-15")).toEqual([26, 0, 0]);
    expect(ymd("2023-03-10", "2024-03-10")).toEqual([1, 0, 0]);
  });

  it("years, months and days", () => {
    expect(ymd("1995-08-15", "2026-10-05")).toEqual([31, 1, 20]);
    expect(ymd("1998-05-23", "2026-10-05")).toEqual([28, 4, 12]);
  });

  it("less than one year", () => {
    expect(ymd("2026-01-20", "2026-10-05")).toEqual([0, 8, 15]);
    expect(ymd("2023-03-10", "2024-03-09")).toEqual([0, 11, 28]);
  });

  it("many years", () => {
    expect(ymd("1930-12-25", "2026-10-05")).toEqual([95, 9, 10]);
  });

  it("allows a calculation date in the future", () => {
    expect(ymd("2000-01-01", "2050-06-15")).toEqual([50, 5, 14]);
  });
});

describe("boundaries", () => {
  it("same birth and calculation date", () => {
    const r = age("2026-10-05", "2026-10-05");
    expect([r.years, r.months, r.days, r.totalDays, r.totalWeeks, r.totalMonths]).toEqual([0, 0, 0, 0, 0, 0]);
    expect(toIsoDate(r.nextBirthday.date)).toBe("2027-10-05");
    expect(r.nextBirthday.turningAge).toBe(1);
  });

  it("one day apart", () => {
    expect(ymd("2026-10-04", "2026-10-05")).toEqual([0, 0, 1]);
    expect(age("2026-10-04", "2026-10-05").totalDays).toBe(1);
  });

  it("month boundaries", () => {
    expect(ymd("2026-09-05", "2026-10-04")).toEqual([0, 0, 29]);
    expect(ymd("2026-09-05", "2026-10-05")).toEqual([0, 1, 0]);
    expect(ymd("2025-12-15", "2026-01-14")).toEqual([0, 0, 30]);
  });

  it("year boundaries", () => {
    expect(ymd("2025-12-31", "2026-01-01")).toEqual([0, 0, 1]);
    expect(ymd("1999-12-31", "2000-12-31")).toEqual([1, 0, 0]);
    expect(ymd("1999-12-31", "2000-12-30")).toEqual([0, 11, 30]);
  });

  it("end-of-month birth dates use the last day of shorter months", () => {
    expect(ymd("2026-01-31", "2026-02-28")).toEqual([0, 1, 0]);
    expect(ymd("2026-01-31", "2026-03-01")).toEqual([0, 1, 1]);
    expect(ymd("2026-01-31", "2026-03-31")).toEqual([0, 2, 0]);
    expect(ymd("2026-03-31", "2026-04-30")).toEqual([0, 1, 0]);
    expect(ymd("2025-08-31", "2026-02-28")).toEqual([0, 6, 0]);
    expect(ymd("2025-08-31", "2026-02-27")).toEqual([0, 5, 27]);
  });
});

describe("leap years", () => {
  it("a leap year has 366 days, a common year 365", () => {
    expect(age("2024-01-01", "2025-01-01").totalDays).toBe(366);
    expect(age("2023-01-01", "2024-01-01").totalDays).toBe(365);
    expect(age("1900-01-01", "1901-01-01").totalDays).toBe(365); // 1900 is not a leap year
    expect(age("2000-01-01", "2001-01-01").totalDays).toBe(366); // 2000 is
  });

  it("around 28 February and 1 March", () => {
    expect(ymd("2024-02-28", "2024-03-01")).toEqual([0, 0, 2]); // leap year
    expect(ymd("2023-02-28", "2023-03-01")).toEqual([0, 0, 1]); // common year
    expect(ymd("2023-02-28", "2024-02-28")).toEqual([1, 0, 0]);
    expect(ymd("2023-03-01", "2024-02-29")).toEqual([0, 11, 28]);
    expect(ymd("2023-03-01", "2024-03-01")).toEqual([1, 0, 0]);
  });

  it("29 February birthdays fall on 28 February in common years", () => {
    expect(ymd("2000-02-29", "2001-02-27")).toEqual([0, 11, 29]);
    expect(ymd("2000-02-29", "2001-02-28")).toEqual([1, 0, 0]);
    expect(ymd("2000-02-29", "2001-03-01")).toEqual([1, 0, 1]);
    expect(ymd("2000-02-29", "2004-02-28")).toEqual([3, 11, 30]);
    expect(ymd("2000-02-29", "2004-02-29")).toEqual([4, 0, 0]);
    const r = age("2000-02-29", "2026-10-05");
    expect(toIsoDate(r.nextBirthday.date)).toBe("2027-02-28");
    expect(r.nextBirthday.turningAge).toBe(27);
    expect(toIsoDate(age("2000-02-29", "2027-12-01").nextBirthday.date)).toBe("2028-02-29");
  });

  it("differs from the days ÷ 365 shortcut", () => {
    const r = age("2000-01-01", "2025-12-31");
    expect(r.totalDays).toBe(9496);
    expect(r.totalDays / 365).toBeGreaterThan(26); // the shortcut says 26…
    expect([r.years, r.months, r.days]).toEqual([25, 11, 30]); // …but the birthday is tomorrow
  });
});

describe("totals and extras", () => {
  it("totals are exact", () => {
    const r = age("1998-05-23", "2026-10-05");
    expect(r.totalDays).toBe(10362);
    expect(r.totalWeeks).toBe(1480);
    expect(r.remainingDaysAfterWeeks).toBe(2);
    expect(r.totalMonths).toBe(28 * 12 + 4);
    expect(r.birthWeekday).toBe(6); // Saturday
  });

  it("next birthday is the calculation date itself when they match", () => {
    const r = age("1990-10-05", "2026-10-05");
    expect(r.nextBirthday.daysAway).toBe(0);
    expect(r.nextBirthday.turningAge).toBe(36);
  });

  it("next birthday rolls into next year", () => {
    const r = age("1990-03-01", "2026-10-05");
    expect(toIsoDate(r.nextBirthday.date)).toBe("2027-03-01");
    expect(r.nextBirthday.daysAway).toBe(147);
  });

  it("getAgeBreakdown refuses reversed dates instead of returning nonsense", () => {
    expect(() =>
      getAgeBreakdown({ year: 2000, month: 1, day: 2 }, { year: 2000, month: 1, day: 1 }),
    ).toThrow(RangeError);
  });
});

describe("validation", () => {
  it("calculation date before date of birth", () => {
    expect(errors(calculateAge("2000-05-10", "2000-05-09", TODAY))).toEqual([
      { field: "calculationDate", code: "calculation-date-before-birth" },
    ]);
  });

  it("date of birth in the future", () => {
    expect(errors(calculateAge("2026-10-06", "2030-01-01", TODAY))).toEqual([
      { field: "dateOfBirth", code: "birth-date-in-future" },
    ]);
    expect(calculateAge("2026-10-05", "2026-10-05", TODAY).ok).toBe(true);
  });

  it("reports only the birth-date problem when it makes the order check meaningless", () => {
    expect(errors(calculateAge("2027-01-01", "2026-01-01", TODAY))).toEqual([
      { field: "dateOfBirth", code: "birth-date-in-future" },
    ]);
  });

  it("invalid dates", () => {
    expect(errors(calculateAge("2023-02-29", "2024-13-01", TODAY))).toEqual([
      { field: "dateOfBirth", code: "invalid" },
      { field: "calculationDate", code: "invalid" },
    ]);
    for (const bad of ["1990-04-31", "not a date", "275760-01-01", "1990-1-5"]) {
      expect(errors(calculateAge(bad, "2026-01-01", TODAY))).toEqual([
        { field: "dateOfBirth", code: "invalid" },
      ]);
    }
  });

  it("missing values", () => {
    expect(errors(calculateAge("", "", TODAY))).toEqual([
      { field: "dateOfBirth", code: "missing" },
      { field: "calculationDate", code: "missing" },
    ]);
    expect(errors(calculateAge("  ", "2026-01-01", TODAY))).toEqual([
      { field: "dateOfBirth", code: "missing" },
    ]);
  });
});

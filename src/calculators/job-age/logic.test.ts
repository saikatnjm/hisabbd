import { describe, expect, it } from "vitest";
import { addDays, comparePlainDates, parsePlainDate, toIsoDate } from "@/lib/plain-date";
import {
  calculateJobAge,
  checkJobAge,
  latestBirthWithAge,
  type JobAgeCalculation,
  type JobAgeInput,
} from "./logic";

const BASE: JobAgeInput = {
  dateOfBirth: "",
  referenceDate: "2026-11-01",
  preset: "bcs",
  minAge: "",
  maxAge: "",
  relaxation: "",
};

function check(overrides: Partial<JobAgeInput>) {
  const calc = calculateJobAge({ ...BASE, ...overrides });
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: JobAgeCalculation) => (calc.ok ? [] : calc.errors);
const ymd = (span: { years: number; months: number; days: number } | null) =>
  span && [span.years, span.months, span.days];
const iso = toIsoDate;

describe("worked example (content and FAQ)", () => {
  it("born 20 May 1994, BCS circular dated 1 November 2026: 32 years 5 months 12 days, eligible but borderline", () => {
    const r = check({ dateOfBirth: "1994-05-20" });
    expect(ymd(r.age)).toEqual([32, 5, 12]);
    expect([r.minAge, r.maxAge, r.relaxationYears, r.effectiveMaxAge]).toEqual([21, 32, 0, 32]);
    expect(r.status).toBe("eligible");
    expect(r.borderline).toBe(true);
    expect(iso(r.bornOnOrAfter)).toBe("1993-11-02");
    expect(iso(r.bornOnOrBefore)).toBe("2005-11-01");
    expect(iso(r.reachesMinAgeOn)).toBe("2015-05-20");
    expect(iso(r.passesLimitOn)).toBe("2027-05-20");
    expect(r.untilMinAge).toBeNull();
    expect(r.overLimitBy).toBeNull();
  });

  it("the same person with 2 extra years of relaxation is no longer borderline", () => {
    const r = check({ dateOfBirth: "1994-05-20", relaxation: "2" });
    expect(r.effectiveMaxAge).toBe(34);
    expect(r.status).toBe("eligible");
    expect(r.borderline).toBe(false);
    expect(iso(r.bornOnOrAfter)).toBe("1991-11-02");
    expect(iso(r.passesLimitOn)).toBe("2029-05-20");
  });

  it("too young for BCS but eligible for other government jobs", () => {
    const bcs = check({ dateOfBirth: "2006-03-15" });
    expect(ymd(bcs.age)).toEqual([20, 7, 17]);
    expect(bcs.status).toBe("too-young");
    expect(bcs.borderline).toBe(false);
    expect(iso(bcs.reachesMinAgeOn)).toBe("2027-03-15");
    expect(ymd(bcs.untilMinAge)).toEqual([0, 4, 14]);

    const govt = check({ dateOfBirth: "2006-03-15", preset: "govt" });
    expect([govt.minAge, govt.maxAge]).toEqual([18, 32]);
    expect(govt.status).toBe("eligible");
    expect(iso(govt.bornOnOrBefore)).toBe("2008-11-01");
  });

  it("too old: passed the limit on the 33rd birthday", () => {
    const r = check({ dateOfBirth: "1993-06-30" });
    expect(ymd(r.age)).toEqual([33, 4, 2]);
    expect(r.status).toBe("too-old");
    expect(r.borderline).toBe(false);
    expect(iso(r.passesLimitOn)).toBe("2026-06-30");
    expect(ymd(r.overLimitBy)).toEqual([0, 4, 2]);
    expect(r.untilMinAge).toBeNull();
    // One extra year of relaxation brings them back in, on the borderline.
    const relaxed = check({ dateOfBirth: "1993-06-30", relaxation: "1" });
    expect(relaxed.status).toBe("eligible");
    expect(relaxed.borderline).toBe(true);
  });
});

describe("exact boundary days", () => {
  it("the day before turning the minimum age is too young; the birthday itself is eligible", () => {
    expect(check({ dateOfBirth: "2005-11-01", referenceDate: "2026-10-31" }).status).toBe("too-young");
    expect(check({ dateOfBirth: "2005-11-01", referenceDate: "2026-11-01" }).status).toBe("eligible");
    // Same thing from the date-of-birth side on a fixed circular date.
    expect(check({ dateOfBirth: "2005-11-02" }).status).toBe("too-young");
  });

  it("32 years 11 months 29 days still meets a 32 maximum; turning 33 does not", () => {
    const dayBefore = check({ dateOfBirth: "1994-05-20", referenceDate: "2027-05-19" });
    expect(ymd(dayBefore.age)).toEqual([32, 11, 29]);
    expect(dayBefore.status).toBe("eligible");
    expect(dayBefore.borderline).toBe(true);

    const birthday = check({ dateOfBirth: "1994-05-20", referenceDate: "2027-05-20" });
    expect(ymd(birthday.age)).toEqual([33, 0, 0]);
    expect(birthday.status).toBe("too-old");
    expect(ymd(birthday.overLimitBy)).toEqual([0, 0, 0]);
  });

  it("turning effectiveMax + 1 with relaxation", () => {
    const input = { dateOfBirth: "1990-01-10", referenceDate: "2025-01-09", relaxation: "3" };
    expect(check(input).status).toBe("eligible"); // 34 years 11 months, max 35
    expect(check({ ...input, referenceDate: "2026-01-09" }).status).toBe("eligible"); // 35, borderline
    expect(check({ ...input, referenceDate: "2026-01-09" }).borderline).toBe(true);
    expect(check({ ...input, referenceDate: "2026-01-10" }).status).toBe("too-old"); // turned 36
  });

  it("born on the reference date is age 0", () => {
    expect(ymd(check({ dateOfBirth: "2026-11-01" }).age)).toEqual([0, 0, 0]);
    const zero = check({ dateOfBirth: "2026-11-01", preset: "custom", minAge: "0", maxAge: "0" });
    expect(zero.status).toBe("eligible");
    expect(zero.borderline).toBe(true);
  });

  it("the eligible window matches the status for every birth date around both ends", () => {
    const cases = [
      { referenceDate: "2026-11-01", preset: "bcs" as const, relaxation: "" },
      { referenceDate: "2025-02-28", preset: "bcs" as const, relaxation: "" },
      { referenceDate: "2024-02-29", preset: "govt" as const, relaxation: "2" },
      { referenceDate: "2025-03-01", preset: "bcs" as const, relaxation: "1" },
    ];
    for (const c of cases) {
      const window = check({ ...c, dateOfBirth: "2000-01-01" });
      for (const edge of [window.bornOnOrAfter, window.bornOnOrBefore]) {
        for (let offset = -4; offset <= 4; offset++) {
          const birth = addDays(edge, offset);
          const inWindow =
            comparePlainDates(birth, window.bornOnOrAfter) >= 0 &&
            comparePlainDates(birth, window.bornOnOrBefore) <= 0;
          const status = check({ ...c, dateOfBirth: iso(birth) }).status;
          expect(status === "eligible", `${c.referenceDate} born ${iso(birth)}`).toBe(inWindow);
        }
      }
    }
  });
});

describe("leap-day births and reference dates", () => {
  it("someone born 29 February turns 21 on 28 February in a common year (same as the Age Calculator)", () => {
    expect(check({ dateOfBirth: "2004-02-29", referenceDate: "2025-02-27" }).status).toBe("too-young");
    const r = check({ dateOfBirth: "2004-02-29", referenceDate: "2025-02-28" });
    expect(ymd(r.age)).toEqual([21, 0, 0]);
    expect(r.status).toBe("eligible");
    expect(iso(check({ dateOfBirth: "2004-02-29", referenceDate: "2024-11-01" }).reachesMinAgeOn)).toBe(
      "2025-02-28",
    );
  });

  it("window on 28 Feb 2025 includes a 29 Feb 2004 birth at the young end and excludes 29 Feb 1992 at the old end", () => {
    const r = check({ dateOfBirth: "2000-01-01", referenceDate: "2025-02-28" });
    // Plain "reference − N years" would give 28 Feb 2004 and 29 Feb 1992 + 1 day = 29 Feb 1992.
    expect(iso(r.bornOnOrBefore)).toBe("2004-02-29");
    expect(iso(r.bornOnOrAfter)).toBe("1992-03-01");

    const leapling = check({ dateOfBirth: "1992-02-29", referenceDate: "2025-02-28" });
    expect(leapling.status).toBe("too-old");
    expect(iso(leapling.passesLimitOn)).toBe("2025-02-28");
    const nextDay = check({ dateOfBirth: "1992-03-01", referenceDate: "2025-02-28" });
    expect(ymd(nextDay.age)).toEqual([32, 11, 27]);
    expect(nextDay.status).toBe("eligible");
  });

  it("window on 29 Feb 2024 when the birth years are common years", () => {
    const r = check({ dateOfBirth: "2000-01-01", referenceDate: "2024-02-29" });
    expect(iso(r.bornOnOrBefore)).toBe("2003-02-28");
    expect(iso(r.bornOnOrAfter)).toBe("1991-03-01");
    expect(check({ dateOfBirth: "1991-02-28", referenceDate: "2024-02-29" }).status).toBe("too-old");
  });

  it("latestBirthWithAge steps forward over 29 February only when it qualifies", () => {
    const ref = parsePlainDate("2025-02-28")!;
    expect(iso(latestBirthWithAge(ref, 21))).toBe("2004-02-29");
    expect(iso(latestBirthWithAge(ref, 20))).toBe("2005-02-28"); // 2005 has no 29 Feb
    expect(iso(latestBirthWithAge(parsePlainDate("2026-11-01")!, 21))).toBe("2005-11-01");
  });
});

describe("custom limits and relaxation", () => {
  it("uses custom whole-year limits, including Bangla digits", () => {
    const r = check({ dateOfBirth: "1994-05-20", preset: "custom", minAge: "১৮", maxAge: "30" });
    expect([r.minAge, r.maxAge]).toEqual([18, 30]);
    expect(r.status).toBe("too-old");
    expect(check({ dateOfBirth: "1994-05-20", preset: "custom", minAge: "18", maxAge: "35" }).status).toBe(
      "eligible",
    );
  });

  it("min equal to max is allowed", () => {
    const r = check({ dateOfBirth: "1994-05-20", preset: "custom", minAge: "32", maxAge: "32" });
    expect(r.status).toBe("eligible");
    expect(r.borderline).toBe(true);
  });

  it("ignores the custom fields for presets", () => {
    expect(check({ dateOfBirth: "1994-05-20", minAge: "abc", maxAge: "-5" }).maxAge).toBe(32);
  });

  it("blank relaxation is 0; Bangla digits work; the limits are 0–10 whole years", () => {
    expect(check({ dateOfBirth: "1994-05-20", relaxation: "  " }).relaxationYears).toBe(0);
    expect(check({ dateOfBirth: "1994-05-20", relaxation: "0" }).effectiveMaxAge).toBe(32);
    expect(check({ dateOfBirth: "1994-05-20", relaxation: "১০" }).effectiveMaxAge).toBe(42);
    const relax = (relaxation: string) => errors(calculateJobAge({ ...BASE, dateOfBirth: "1994-05-20", relaxation }));
    expect(relax("11")).toEqual([{ field: "relaxation", code: "too-large" }]);
    expect(relax("-1")).toEqual([{ field: "relaxation", code: "too-small" }]);
    expect(relax("2.5")).toEqual([{ field: "relaxation", code: "not-integer" }]);
    expect(relax("two")).toEqual([{ field: "relaxation", code: "invalid" }]);
  });
});

describe("validation", () => {
  const custom = (minAge: string, maxAge: string) =>
    errors(calculateJobAge({ ...BASE, dateOfBirth: "1994-05-20", preset: "custom", minAge, maxAge }));

  it("min greater than max is an error on max", () => {
    expect(custom("30", "25")).toEqual([{ field: "maxAge", code: "less-than-min" }]);
  });

  it("custom limits must be whole numbers from 0 to 70", () => {
    expect(custom("", "")).toEqual([
      { field: "minAge", code: "missing" },
      { field: "maxAge", code: "missing" },
    ]);
    expect(custom("-1", "71")).toEqual([
      { field: "minAge", code: "too-small" },
      { field: "maxAge", code: "too-large" },
    ]);
    expect(custom("21.5", "x")).toEqual([
      { field: "minAge", code: "not-integer" },
      { field: "maxAge", code: "invalid" },
    ]);
    expect(custom("0", "70")).toEqual([]);
  });

  it("date of birth after the reference date", () => {
    expect(errors(calculateJobAge({ ...BASE, dateOfBirth: "2026-11-02" }))).toEqual([
      { field: "dateOfBirth", code: "birth-after-reference-date" },
    ]);
  });

  it("invalid dates", () => {
    expect(errors(calculateJobAge({ ...BASE, dateOfBirth: "2023-02-29", referenceDate: "2026-13-01" }))).toEqual([
      { field: "dateOfBirth", code: "invalid" },
      { field: "referenceDate", code: "invalid" },
    ]);
    for (const bad of ["1990-04-31", "not a date", "1990-1-5"]) {
      expect(errors(calculateJobAge({ ...BASE, dateOfBirth: bad }))).toEqual([{ field: "dateOfBirth", code: "invalid" }]);
    }
  });

  it("missing values, and all errors reported together", () => {
    expect(errors(calculateJobAge({ ...BASE, referenceDate: " " }))).toEqual([
      { field: "dateOfBirth", code: "missing" },
      { field: "referenceDate", code: "missing" },
    ]);
    expect(
      errors(
        calculateJobAge({ dateOfBirth: "", referenceDate: "", preset: "custom", minAge: "40", maxAge: "30", relaxation: "20" }),
      ),
    ).toEqual([
      { field: "dateOfBirth", code: "missing" },
      { field: "referenceDate", code: "missing" },
      { field: "maxAge", code: "less-than-min" },
      { field: "relaxation", code: "too-large" },
    ]);
  });

  it("checkJobAge refuses reversed dates instead of returning nonsense", () => {
    expect(() =>
      checkJobAge({ year: 2000, month: 1, day: 2 }, { year: 2000, month: 1, day: 1 }, {
        minAge: 21,
        maxAge: 32,
        relaxationYears: 0,
      }),
    ).toThrow(RangeError);
  });
});

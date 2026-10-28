import { describe, expect, it } from "vitest";
import { addDays, parsePlainDate, toIsoDate, type PlainDate } from "@/lib/plain-date";
import {
  banglaMonthLength,
  calculateBanglaDate,
  calculateGregorianDate,
  formatBanglaDateBn,
  formatBanglaDateWestern,
  fromBanglaDate,
  isBanglaLeapYear,
  isInBanglaRange,
  toBanglaDate,
  toBanglaDigits,
} from "./logic";

function d(iso: string): PlainDate {
  const date = parsePlainDate(iso);
  if (!date) throw new Error(iso);
  return date;
}

/** "28 Oct 2026" → [day, month, year] in Bangla. */
function bangla(iso: string): [number, number, number] {
  const b = toBanglaDate(d(iso));
  return [b.day, b.month, b.year];
}

function gregorian(year: number, month: number, day: number): string {
  const r = fromBanglaDate({ year, month, day });
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return toIsoDate(r.date);
}

describe("national day anchors", () => {
  it.each([2020, 2026, 2027, 2028, 2031, 2100])("hold in %i", (year) => {
    expect(bangla(`${year}-02-21`).slice(0, 2)).toEqual([8, 11]); // 8 Falgun
    expect(bangla(`${year}-03-26`).slice(0, 2)).toEqual([12, 12]); // 12 Chaitra
    expect(bangla(`${year}-12-16`).slice(0, 2)).toEqual([1, 9]); // 1 Poush
    expect(bangla(`${year}-04-14`).slice(0, 2)).toEqual([1, 1]); // 1 Boishakh
  });

  it("matches the worked examples", () => {
    expect(bangla("2026-10-28")).toEqual([12, 7, 1433]); // 12 Kartik 1433
    expect(bangla("2026-12-16")).toEqual([1, 9, 1433]); // 1 Poush 1433
    expect(bangla("2027-02-21")).toEqual([8, 11, 1433]); // 8 Falgun 1433
    expect(bangla("2027-04-14")).toEqual([1, 1, 1434]); // 1 Boishakh 1434
    expect(bangla("2026-02-14")).toEqual([1, 11, 1432]); // Pohela Falgun
  });

  it("fills in names and season", () => {
    expect(toBanglaDate(d("2026-10-28"))).toEqual({
      year: 1433,
      month: 7,
      day: 12,
      monthName: "Kartik",
      monthNameBn: "কার্তিক",
      season: "Hemonto",
      seasonBn: "হেমন্ত",
      seasonMeaning: "late autumn",
    });
    expect(toBanglaDate(d("2026-04-14")).seasonBn).toBe("গ্রীষ্ম");
    expect(toBanglaDate(d("2026-07-20")).seasonBn).toBe("বর্ষা"); // Srabon
    expect(toBanglaDate(d("2026-09-20")).seasonBn).toBe("শরৎ"); // Ashwin
    expect(toBanglaDate(d("2027-01-20")).seasonBn).toBe("শীত"); // Magh
    expect(toBanglaDate(d("2027-03-20")).seasonBn).toBe("বসন্ত"); // Chaitra
  });
});

describe("month start dates in a non-leap year", () => {
  it("each month starts on the same Gregorian date", () => {
    const starts = [
      "2026-04-14", "2026-05-15", "2026-06-15", "2026-07-16", "2026-08-16", "2026-09-16",
      "2026-10-17", "2026-11-16", "2026-12-16", "2027-01-15", "2027-02-14", "2027-03-15",
    ];
    starts.forEach((iso, i) => {
      expect(gregorian(1433, i + 1, 1)).toBe(iso);
      expect(bangla(iso)).toEqual([1, i + 1, 1433]);
    });
    expect(gregorian(1433, 12, 30)).toBe("2027-04-13");
  });
});

describe("year boundary", () => {
  it("13 April is the last day of Chaitra, 14 April starts the new year", () => {
    expect(bangla("2026-04-13")).toEqual([30, 12, 1432]);
    expect(bangla("2026-04-14")).toEqual([1, 1, 1433]);
    expect(bangla("2027-04-13")).toEqual([30, 12, 1433]);
    expect(bangla("2027-04-14")).toEqual([1, 1, 1434]);
    expect(bangla("2026-01-01")[2]).toBe(1432);
    expect(bangla("2026-12-31")[2]).toBe(1433);
  });
});

describe("leap Falgun", () => {
  it("Falgun has 30 days when it contains 29 February", () => {
    expect(isBanglaLeapYear(1434)).toBe(true); // Falgun 1434 is Feb–Mar 2028
    expect(isBanglaLeapYear(1433)).toBe(false);
    expect(isBanglaLeapYear(1406)).toBe(true); // 2000 is a leap year
    expect(isBanglaLeapYear(1506)).toBe(false); // 2100 is not
    expect(banglaMonthLength(1434, 11)).toBe(30);
    expect(banglaMonthLength(1433, 11)).toBe(29);
  });

  it("places 29 February 2028 on 16 Falgun 1434", () => {
    expect(bangla("2028-02-29")).toEqual([16, 11, 1434]);
    expect(gregorian(1434, 11, 16)).toBe("2028-02-29");
    expect(bangla("2028-03-14")).toEqual([30, 11, 1434]);
    expect(bangla("2028-03-15")).toEqual([1, 12, 1434]); // Chaitra still starts on 15 March
    expect(bangla("2027-03-14")).toEqual([29, 11, 1433]);
  });
});

describe("round trip", () => {
  it("every day from 2020-01-01 to 2030-12-31 converts there and back", () => {
    let date = d("2020-01-01");
    let count = 0;
    let previous = toBanglaDate(addDays(date, -1));
    while (toIsoDate(date) <= "2030-12-31") {
      const b = toBanglaDate(date);
      const back = fromBanglaDate(b);
      expect(back).toEqual({ ok: true, date });
      // Consecutive days: either the next day of the month, or day 1 of the next month.
      if (b.day !== 1) expect([b.year, b.month, b.day - 1]).toEqual([previous.year, previous.month, previous.day]);
      else expect(previous.day).toBe(banglaMonthLength(previous.year, previous.month));
      previous = b;
      date = addDays(date, 1);
      count += 1;
    }
    expect(count).toBe(4018);
  });

  it("works at the ends of the range", () => {
    expect(bangla("0594-04-14")).toEqual([1, 1, 1]);
    expect(bangla("8594-04-13")).toEqual([30, 12, 8000]);
    expect(gregorian(1, 1, 1)).toBe("0594-04-14");
    expect(gregorian(8000, 12, 30)).toBe("8594-04-13");
    expect(isInBanglaRange(d("0594-04-13"))).toBe(false);
    expect(isInBanglaRange(d("8594-04-14"))).toBe(false);
    expect(() => toBanglaDate(d("0594-04-13"))).toThrow(RangeError);
  });
});

describe("invalid Bangla dates", () => {
  it("rejects Falgun 30 in a non-leap year but accepts it in a leap year", () => {
    expect(fromBanglaDate({ year: 1433, month: 11, day: 30 })).toEqual({
      ok: false,
      errors: [{ field: "banglaDay", code: "day-not-in-month" }],
    });
    expect(gregorian(1434, 11, 30)).toBe("2028-03-14");
  });

  it("rejects day 31 in a 30-day month", () => {
    expect(fromBanglaDate({ year: 1433, month: 7, day: 31 })).toEqual({
      ok: false,
      errors: [{ field: "banglaDay", code: "day-not-in-month" }],
    });
    expect(gregorian(1433, 6, 31)).toBe("2026-10-16");
  });

  it("rejects month 13, day 32 and out-of-range years", () => {
    expect(fromBanglaDate({ year: 1433, month: 13, day: 1 })).toEqual({
      ok: false,
      errors: [{ field: "banglaMonth", code: "invalid" }],
    });
    expect(fromBanglaDate({ year: 1433, month: 1, day: 32 })).toEqual({
      ok: false,
      errors: [{ field: "banglaDay", code: "too-large" }],
    });
    expect(fromBanglaDate({ year: 0, month: 0, day: 0 })).toEqual({
      ok: false,
      errors: [
        { field: "banglaYear", code: "too-small" },
        { field: "banglaMonth", code: "invalid" },
        { field: "banglaDay", code: "too-small" },
      ],
    });
    expect(fromBanglaDate({ year: 8001, month: 1, day: 1.5 })).toEqual({
      ok: false,
      errors: [
        { field: "banglaYear", code: "too-large" },
        { field: "banglaDay", code: "not-integer" },
      ],
    });
  });
});

describe("calculate (form input)", () => {
  it("converts a Gregorian date string", () => {
    const calc = calculateBanglaDate("2026-10-28");
    expect(calc.ok && calc.result.bangla.day).toBe(12);
    expect(calc.ok && calc.result.weekday).toBe(3); // Wednesday
  });

  it("reports Gregorian errors", () => {
    expect(calculateBanglaDate("")).toEqual({ ok: false, errors: [{ field: "gregorianDate", code: "missing" }] });
    expect(calculateBanglaDate("2026-02-30")).toEqual({
      ok: false,
      errors: [{ field: "gregorianDate", code: "invalid" }],
    });
    expect(calculateBanglaDate("0500-01-01")).toEqual({
      ok: false,
      errors: [{ field: "gregorianDate", code: "out-of-range" }],
    });
  });

  it("converts Bangla input, including Bangla digits", () => {
    const calc = calculateGregorianDate("১৪৩৩", "7", "১২");
    expect(calc.ok && toIsoDate(calc.result.gregorian)).toBe("2026-10-28");
    expect(calc.ok && calc.result.bangla.monthNameBn).toBe("কার্তিক");
  });

  it("reports every Bangla field error together", () => {
    expect(calculateGregorianDate("", "", "")).toEqual({
      ok: false,
      errors: [
        { field: "banglaYear", code: "missing" },
        { field: "banglaMonth", code: "missing" },
        { field: "banglaDay", code: "missing" },
      ],
    });
    expect(calculateGregorianDate("abc", "13", "32")).toEqual({
      ok: false,
      errors: [
        { field: "banglaYear", code: "invalid" },
        { field: "banglaMonth", code: "invalid" },
        { field: "banglaDay", code: "too-large" },
      ],
    });
    expect(calculateGregorianDate("1433", "11", "30")).toEqual({
      ok: false,
      errors: [{ field: "banglaDay", code: "day-not-in-month" }],
    });
  });
});

describe("formatting", () => {
  it("converts digits to Bangla", () => {
    expect(toBanglaDigits("0123456789")).toBe("০১২৩৪৫৬৭৮৯");
    expect(toBanglaDigits(1433)).toBe("১৪৩৩");
    expect(toBanglaDigits("12 কার্তিক")).toBe("১২ কার্তিক");
  });

  it("writes both forms of a Bangla date", () => {
    const date = toBanglaDate(d("2026-10-28"));
    expect(formatBanglaDateBn(date)).toBe("১২ কার্তিক ১৪৩৩ বঙ্গাব্দ");
    expect(formatBanglaDateWestern(date, "en")).toBe("12 Kartik 1433");
    expect(formatBanglaDateWestern(date, "bn")).toBe("12 কার্তিক 1433");
  });
});

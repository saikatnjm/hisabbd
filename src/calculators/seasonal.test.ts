import { describe, expect, it } from "vitest";
import { getCalculator } from "./registry";
import { activeSeasons, isInSeason, SEASONS, type Season } from "./seasonal";

const date = (year: number, month: number, day: number) => ({ year, month, day });
const ids = (year: number, month: number, day: number) => activeSeasons(date(year, month, day)).map((s) => s.id);

describe("seasons", () => {
  it("only reference calculators that exist", () => {
    for (const season of SEASONS) for (const slug of season.slugs) expect(getCalculator(slug)?.slug, `${season.id}: ${slug}`).toBe(slug);
  });

  it("finds the right seasons through the year", () => {
    expect(ids(2026, 10, 29)).toEqual(["hsc-results"]);
    expect(ids(2027, 1, 5)).toEqual(["hsc-results"]);
    expect(ids(2027, 1, 20)).toEqual(["hsc-results", "ramadan-1448"]);
    expect(ids(2027, 2, 20)).toEqual(["ramadan-1448"]);
    expect(ids(2027, 4, 10)).toEqual(["pohela-boishakh"]);
    expect(ids(2027, 6, 15)).toEqual(["ssc-results", "budget"]);
    expect(ids(2027, 9, 1)).toEqual([]);
  });

  it("handles windows that wrap the year end and one-year windows", () => {
    const wrap: Season = { id: "w", label: "", labelBn: "", from: "12-20", to: "01-10", slugs: [] };
    expect(isInSeason(wrap, date(2026, 12, 25))).toBe(true);
    expect(isInSeason(wrap, date(2027, 1, 10))).toBe(true);
    expect(isInSeason(wrap, date(2027, 1, 11))).toBe(false);
    const once: Season = { id: "o", label: "", labelBn: "", from: "2027-01-10", to: "2027-03-12", slugs: [] };
    expect(isInSeason(once, date(2028, 2, 1))).toBe(false);
    expect(isInSeason(once, date(2027, 3, 12))).toBe(true);
  });
});

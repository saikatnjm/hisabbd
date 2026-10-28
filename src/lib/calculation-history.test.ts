import { describe, expect, it } from "vitest";
import { MAX_HISTORY, MAX_PER_CALCULATOR, sanitizeHistory, withEntry, type HistoryEntry } from "./calculation-history";

function entry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: "a1",
    slug: "age-calculator",
    at: 1_000,
    locale: "en",
    inputs: { dateOfBirth: "1995-06-15" },
    summary: "31 years 4 months 13 days.",
    ...overrides,
  };
}

describe("sanitizeHistory", () => {
  it("keeps well-formed entries, newest first", () => {
    const list = sanitizeHistory([entry({ id: "old", at: 1 }), entry({ id: "new", at: 2, inputs: { dateOfBirth: "2000-01-01" } })]);
    expect(list.map((e) => e.id)).toEqual(["new", "old"]);
  });

  it("drops malformed entries", () => {
    const bad = [
      null,
      "x",
      { ...entry(), slug: "Bad Slug" },
      { ...entry(), locale: "fr" },
      { ...entry(), at: "yesterday" },
      { ...entry(), summary: "x".repeat(401) },
      { ...entry(), inputs: { dateOfBirth: 5 } },
      { ...entry(), inputs: ["1995-06-15"] },
      { ...entry(), inputs: { "bad key!": "x" } },
    ];
    expect(sanitizeHistory(bad)).toEqual([]);
    expect(sanitizeHistory({ not: "an array" })).toEqual([]);
  });
});

describe("withEntry", () => {
  it("adds at the front", () => {
    const list = withEntry([entry({ id: "a", at: 1 })], entry({ id: "b", at: 2, inputs: { dateOfBirth: "2000-01-01" } }));
    expect(list.map((e) => e.id)).toEqual(["b", "a"]);
  });

  it("moves a repeated calculation to the front instead of duplicating it", () => {
    const list = withEntry([entry({ id: "a", at: 1 }), entry({ id: "x", at: 0, slug: "bmi-calculator" })], entry({ id: "b", at: 2 }));
    expect(list.map((e) => e.id)).toEqual(["b", "x"]);
  });

  it("keeps at most MAX_PER_CALCULATOR per calculator and MAX_HISTORY overall", () => {
    let list: HistoryEntry[] = [];
    for (let i = 0; i < 10; i++) list = withEntry(list, entry({ id: `a${i}`, at: i, inputs: { n: String(i) } }));
    expect(list).toHaveLength(MAX_PER_CALCULATOR);
    expect(list[0]?.id).toBe("a9");

    let mixed: HistoryEntry[] = [];
    for (let i = 0; i < 60; i++) {
      mixed = withEntry(mixed, entry({ id: `m${i}`, at: i, slug: `calc-${i % 12}`, inputs: { n: String(i) } }));
    }
    expect(mixed.length).toBeLessThanOrEqual(MAX_HISTORY);
    expect(mixed[0]?.id).toBe("m59");
  });
});

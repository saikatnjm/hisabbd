import { describe, expect, it } from "vitest";
import { calculateCash, DENOMINATIONS, MAX_COUNT } from "./logic";

describe("calculateCash", () => {
  it("adds up the worked example: ৳5,800", () => {
    const calc = calculateCash({ "note-1000": "3", "note-500": "4", "note-100": "7", "note-20": "5" });
    expect(calc.ok).toBe(true);
    if (!calc.ok) return;
    expect(calc.result.total).toBe(5800);
    expect(calc.result.noteCount).toBe(19);
    expect(calc.result.coinCount).toBe(0);
    expect(calc.result.rows.map((r) => r.subtotal)).toEqual([3000, 2000, 700, 100]);
  });

  it("separates notes and coins, and treats blanks as 0", () => {
    const calc = calculateCash({ "note-5": "2", "coin-5": "3", "coin-2": "", "coin-1": "4" });
    expect(calc.ok && calc.result.total).toBe(10 + 15 + 4);
    expect(calc.ok && calc.result.noteCount).toBe(2);
    expect(calc.ok && calc.result.coinCount).toBe(7);
  });

  it("accepts Bangla digits and grouping", () => {
    const calc = calculateCash({ "note-1000": "১০", "note-500": "1,000" });
    expect(calc.ok && calc.result.total).toBe(10_000 + 500_000);
  });

  it("accepts the limit and rejects just above it", () => {
    expect(calculateCash({ "note-1000": String(MAX_COUNT) }).ok).toBe(true);
    const bad = calculateCash({ "note-1000": String(MAX_COUNT + 1) });
    expect(!bad.ok && bad.errors).toEqual([{ field: "note-1000", code: "too-large" }]);
  });

  it("rejects negatives, decimals and text, all together", () => {
    const bad = calculateCash({ "note-500": "-1", "note-100": "2.5", "coin-1": "abc" });
    expect(!bad.ok && bad.errors).toEqual([
      { field: "note-500", code: "too-small" },
      { field: "note-100", code: "not-integer" },
      { field: "coin-1", code: "invalid" },
    ]);
  });

  it("needs at least one count above 0", () => {
    expect(calculateCash({}).ok).toBe(false);
    const zero = calculateCash({ "note-500": "0" });
    expect(!zero.ok && zero.errors[0]?.code).toBe("none");
  });

  it("lists 12 unique denominations", () => {
    expect(DENOMINATIONS).toHaveLength(12);
    expect(new Set(DENOMINATIONS.map((d) => d.id)).size).toBe(12);
  });
});

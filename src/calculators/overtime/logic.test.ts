import { describe, expect, it } from "vitest";
import { calculateOvertime, MAX_DIVISOR, MAX_HOURS, MAX_WAGE, overtimePayFor } from "./logic";

function ok(...args: Parameters<typeof calculateOvertime>) {
  const calc = calculateOvertime(...args);
  if (!calc.ok) throw new Error(JSON.stringify(calc.errors));
  return calc.result;
}

describe("worked example (same numbers as the page and FAQs)", () => {
  it("basic 10,000 + dearness 400, divisor 208, 12.5 hours", () => {
    const r = ok("10000", "400", "208", "12.5");
    expect(r.base).toBe(10400);
    expect(r.ordinaryRate).toBeCloseTo(50, 10);
    expect(r.overtimeRate).toBeCloseTo(100, 10);
    expect(r.overtimePay).toBe(1250);
  });
  it("basic 12,500 with divisor 208 (FAQ)", () => {
    const r = ok("12500", "", "208", "1");
    expect(r.allowance).toBe(0);
    expect(r.ordinaryRate).toBeCloseTo(60.0961538462, 8);
    expect(r.overtimeRate).toBeCloseTo(120.1923076923, 8);
  });
  it("basic only, 8,500 / 208 x 2 x 20", () => {
    const r = ok("8500", "", "208", "20");
    expect(r.ordinaryRate).toBeCloseTo(40.8653846154, 8);
    expect(r.overtimePay).toBe(1634.62);
  });
});

describe("overtimePayFor", () => {
  it("is base / divisor x 2 x hours", () => {
    expect(overtimePayFor(10400, 208, 1)).toBeCloseTo(100, 10);
  });
});

describe("validation", () => {
  it("reports every missing field except the optional allowance", () => {
    const c = calculateOvertime("", "", "", "");
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.errors.map((e) => e.field)).toEqual(["basic", "divisor", "hours"]);
  });
  it("flags an invalid allowance", () => {
    const c = calculateOvertime("10000", "abc", "208", "5");
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.errors).toEqual([{ field: "allowance", code: "invalid" }]);
  });
  it("rejects zero and negative values", () => {
    const c = calculateOvertime("0", "-1", "0", "0");
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.map((e) => `${e.field}:${e.code}`)).toEqual([
      "basic:too-small",
      "allowance:too-small",
      "divisor:too-small",
      "hours:too-small",
    ]);
  });
  it("enforces maximums", () => {
    expect(calculateOvertime(String(MAX_WAGE), "", String(MAX_DIVISOR), String(MAX_HOURS)).ok).toBe(true);
    const c = calculateOvertime(String(MAX_WAGE + 1), "", String(MAX_DIVISOR + 1), String(MAX_HOURS + 1));
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.every((e) => e.code === "too-large")).toBe(true);
  });
  it("accepts Bangla digits and lakh grouping", () => {
    expect(ok("১০,০০০", "৪০০", "২০৮", "১২.৫").overtimePay).toBe(1250);
    expect(ok("1,04,000", "", "208", "1").overtimePay).toBe(1000);
  });
  it("rounds pay to the paisa from the unrounded rate", () => {
    expect(ok("10000", "", "208", "1").overtimePay).toBe(96.15);
  });
});

import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import { calculateInterest, compoundAmount, simpleInterest, type InterestCalculation } from "./logic";

function ok(calc: InterestCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: InterestCalculation) => (calc.ok ? [] : calc.errors);
const paisa = (n: number) => roundTo(n, 2);

describe("formulas", () => {
  it("matches the textbook example: ৳200 at 10% for 3 years", () => {
    expect(simpleInterest(200, 10, 3)).toBe(60);
    expect(paisa(compoundAmount(200, 10, 3, "yearly") - 200)).toBe(66.2);
  });

  it("compounds more often for a higher amount", () => {
    expect(paisa(compoundAmount(100000, 9, 5, "yearly"))).toBe(153862.4);
    expect(paisa(compoundAmount(100000, 9, 5, "half-yearly"))).toBe(155296.94);
    expect(paisa(compoundAmount(100000, 9, 5, "quarterly"))).toBe(156050.92);
    expect(paisa(compoundAmount(100000, 9, 5, "monthly"))).toBe(156568.1);
  });
});

describe("calculateInterest", () => {
  it("works out the page's example: ৳1,00,000 at 9% for 5 years, yearly", () => {
    const r = ok(calculateInterest("1,00,000", "9", "5", "yearly"));
    expect(r.simpleInterest).toBe(45000);
    expect(r.simpleAmount).toBe(145000);
    expect(paisa(r.compoundInterest)).toBe(53862.4);
    expect(paisa(r.compoundAmount)).toBe(153862.4);
    expect(paisa(r.difference)).toBe(8862.4);
    expect(r.effectiveAnnualRatePercent).toBe(9);
    expect(r.schedule.map((row) => [row.years, row.simpleAmount, paisa(row.compoundAmount)])).toEqual([
      [1, 109000, 109000],
      [2, 118000, 118810],
      [3, 127000, 129502.9],
      [4, 136000, 141158.16],
      [5, 145000, 153862.4],
    ]);
  });

  it("gives the monthly effective yearly rate", () => {
    const r = ok(calculateInterest("100000", "9", "5", "monthly"));
    expect(roundTo(r.effectiveAnnualRatePercent, 4)).toBe(9.3807);
  });

  it("handles part years with a final table row", () => {
    const r = ok(calculateInterest("5000", "8", "2.5", "yearly"));
    expect(r.simpleInterest).toBe(1000);
    expect(paisa(r.compoundAmount)).toBe(6060.79);
    expect(r.schedule.map((row) => row.years)).toEqual([1, 2, 2.5]);
    expect(ok(calculateInterest("5000", "8", "0.5", "yearly")).schedule.map((row) => row.years)).toEqual([0.5]);
  });

  it("allows a 0% rate (no interest)", () => {
    const r = ok(calculateInterest("1000", "0", "3", "monthly"));
    expect([r.simpleInterest, r.compoundInterest, r.difference]).toEqual([0, 0, 0]);
  });

  it("accepts Bangla digits", () => {
    expect(ok(calculateInterest("২০০", "১০", "৩", "yearly")).simpleInterest).toBe(60);
  });

  it("checks limits and reports every error together", () => {
    expect(errors(calculateInterest("", "", "", "yearly"))).toEqual([
      { field: "principal", code: "missing" },
      { field: "rate", code: "missing" },
      { field: "years", code: "missing" },
    ]);
    expect(errors(calculateInterest("0", "101", "0", "yearly"))).toEqual([
      { field: "principal", code: "too-small" },
      { field: "rate", code: "too-large" },
      { field: "years", code: "too-small" },
    ]);
    expect(errors(calculateInterest("abc", "-1", "51", "yearly"))).toEqual([
      { field: "principal", code: "invalid" },
      { field: "rate", code: "too-small" },
      { field: "years", code: "too-large" },
    ]);
    expect(calculateInterest("1000000000000", "100", "50", "monthly").ok).toBe(true);
  });
});

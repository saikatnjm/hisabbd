import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import { calculateWeight, convertWeight, GRAMS_PER_UNIT, traditionalBreakdown, type WeightCalculation } from "./logic";

function ok(calc: WeightCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const r4 = (n: number) => roundTo(n, 4);

describe("units", () => {
  it("builds the traditional units from the 180-grain tola", () => {
    expect(r4(GRAMS_PER_UNIT.seer)).toBe(933.1043);
    expect(r4(GRAMS_PER_UNIT.chatak)).toBe(58.319);
    expect(r4(GRAMS_PER_UNIT.maund / 1000)).toBe(37.3242);
    // The traditional maund is exactly 82 2/7 lb.
    expect(r4(convertWeight(1, "maund", "lb"))).toBe(r4(82 + 2 / 7));
  });

  it("uses a 40 kg market মণ", () => {
    expect(convertWeight(1, "maund-market", "kg")).toBe(40);
    expect(r4(convertWeight(1, "maund-market", "lb"))).toBe(88.1849);
    expect(convertWeight(2, "maund-market", "kg")).toBe(80);
    expect(r4(convertWeight(2, "maund", "kg"))).toBe(74.6483);
  });
});

describe("calculateWeight", () => {
  it("works out the page's example: 100 kg", () => {
    const r = ok(calculateWeight("100", "kg"));
    expect(r.converted["maund-market"]).toBe(2.5);
    expect(r4(r.converted.maund)).toBe(2.6792);
    expect(r4(r.converted.seer)).toBe(107.1692);
    expect(r4(r.converted.lb)).toBe(220.4623);
    expect(r.traditional).toEqual({ maund: 2, seer: 27, chatak: 2.71 });
  });

  it("splits 1 traditional মণ exactly", () => {
    expect(ok(calculateWeight("1", "maund")).traditional).toEqual({ maund: 1, seer: 0, chatak: 0 });
    expect(traditionalBreakdown(GRAMS_PER_UNIT.seer * 16.5)).toEqual({ maund: 0, seer: 16, chatak: 8 });
  });

  it("accepts Bangla digits and grouping", () => {
    expect(ok(calculateWeight("১,০০০", "g")).converted.kg).toBe(1);
  });

  it("rejects missing, zero, invalid and too-large values", () => {
    expect(calculateWeight("", "kg")).toEqual({ ok: false, errors: [{ field: "value", code: "missing" }] });
    expect(calculateWeight("0", "kg")).toEqual({ ok: false, errors: [{ field: "value", code: "too-small" }] });
    expect(calculateWeight("x", "kg")).toEqual({ ok: false, errors: [{ field: "value", code: "invalid" }] });
    expect(calculateWeight("1000000001", "kg")).toEqual({ ok: false, errors: [{ field: "value", code: "too-large" }] });
  });
});

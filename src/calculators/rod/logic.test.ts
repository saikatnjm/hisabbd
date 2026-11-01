import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import { calculateRod, DIAMETERS_MM, kgPerMetre, type RodCalculation } from "./logic";

function ok(calc: RodCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: RodCalculation) => (calc.ok ? [] : calc.errors);
const r3 = (n: number) => roundTo(n, 3);

describe("kgPerMetre", () => {
  it("matches the nominal rebar table and d²/162.2", () => {
    expect(DIAMETERS_MM.map((d) => r3(kgPerMetre(d)))).toEqual([0.222, 0.395, 0.617, 0.888, 1.578, 2.466, 2.984, 3.853, 4.834, 6.313]);
    expect(roundTo(144 / kgPerMetre(12), 1)).toBe(162.2);
  });
});

describe("calculateRod", () => {
  it("works out the page's example: 40 bars of 12 mm, 40 ft each, at ৳1,00,000 a tonne", () => {
    const r = ok(calculateRod(12, { length: "40", bars: "40", price: "1,00,000" }, "ft"));
    expect(r3(r.kgPerFoot)).toBe(0.271);
    expect(r.totalMetres).toBe(487.68);
    expect(roundTo(r.totalKg, 2)).toBe(432.97);
    expect(roundTo(r.cost ?? 0, 0)).toBe(43297);
  });

  it("works in metres without a price", () => {
    const r = ok(calculateRod(16, { length: "12", bars: "20", price: "" }, "m"));
    expect(r.totalMetres).toBe(240);
    expect(roundTo(r.totalKg, 2)).toBe(378.8);
    expect(r.cost).toBeNull();
  });

  it("accepts Bangla digits", () => {
    expect(ok(calculateRod(10, { length: "১০", bars: "১০", price: "" }, "m")).totalMetres).toBe(100);
  });

  it("checks the limits and reports every error together", () => {
    expect(errors(calculateRod(12, { length: "", bars: "", price: "x" }, "m"))).toEqual([
      { field: "length", code: "missing" },
      { field: "bars", code: "missing" },
      { field: "price", code: "invalid" },
    ]);
    expect(errors(calculateRod(12, { length: "101", bars: "1.5", price: "-1" }, "m"))).toEqual([
      { field: "length", code: "too-large" },
      { field: "bars", code: "not-integer" },
      { field: "price", code: "too-small" },
    ]);
    expect(calculateRod(12, { length: "330", bars: "100000", price: "1000000" }, "ft").ok).toBe(true);
    expect(errors(calculateRod(12, { length: "331", bars: "0", price: "" }, "ft"))).toEqual([
      { field: "length", code: "too-large" },
      { field: "bars", code: "too-small" },
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import { calculateHeight, feetAndInches, type HeightCalculation } from "./logic";

function ok(calc: HeightCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: HeightCalculation) => (calc.ok ? [] : calc.errors);
const r = (n: number, d = 2) => roundTo(n, d);
const ftIn = (feet: string, inches: string) => calculateHeight("ft-in", { feet, inches, cm: "" });
const cm = (value: string) => calculateHeight("cm", { feet: "", inches: "", cm: value });

describe("calculateHeight", () => {
  it("works out the page's example: 5 ft 4 in", () => {
    const h = ok(ftIn("5", "4"));
    expect(h.totalInches).toBe(64);
    expect(h.cm).toBe(162.56);
    expect(h.m).toBe(1.6256);
    expect([h.feet, h.inches]).toEqual([5, 4]);
    expect(r(h.haat, 3)).toBe(3.556);
    expect(r(h.goj, 3)).toBe(1.778);
  });

  it("converts other common heights", () => {
    expect(ok(ftIn("5", "6")).cm).toBe(167.64);
    expect(ok(ftIn("5", "2")).cm).toBe(157.48);
    expect(ok(ftIn("6", "")).cm).toBe(182.88);
    expect(ok(ftIn("5", "4.5")).cm).toBe(163.83);
  });

  it("goes from centimetres to feet and inches", () => {
    const h = ok(cm("165"));
    expect(r(h.totalInches)).toBe(64.96);
    expect([h.feet, h.inches]).toEqual([5, 5]);
    expect([ok(cm("170")).feet, ok(cm("170")).inches]).toEqual([5, 6.9]);
    expect([ok(cm("152.4")).feet, ok(cm("152.4")).inches]).toEqual([5, 0]);
  });

  it("never shows 12 inches after rounding", () => {
    expect(feetAndInches(71.96)).toEqual({ feet: 6, inches: 0 });
    expect(feetAndInches(71.94)).toEqual({ feet: 5, inches: 11.9 });
  });

  it("accepts Bangla digits", () => {
    expect(ok(ftIn("৫", "৪")).cm).toBe(162.56);
  });

  it("checks the limits", () => {
    expect(errors(ftIn("", ""))).toEqual([{ field: "feet", code: "missing" }]);
    expect(errors(ftIn("0", "0"))).toEqual([{ field: "feet", code: "zero" }]);
    expect(errors(ftIn("5.5", "12"))).toEqual([
      { field: "feet", code: "not-integer" },
      { field: "inches", code: "too-large" },
    ]);
    expect(errors(ftIn("10", "-1"))).toEqual([
      { field: "feet", code: "too-large" },
      { field: "inches", code: "too-small" },
    ]);
    expect(errors(cm(""))).toEqual([{ field: "cm", code: "missing" }]);
    expect(errors(cm("0"))).toEqual([{ field: "cm", code: "too-small" }]);
    expect(errors(cm("301"))).toEqual([{ field: "cm", code: "too-large" }]);
  });
});

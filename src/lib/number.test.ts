import { describe, expect, it } from "vitest";
import { checkNumber, normalizeDigits, parseNumberInput, roundTo } from "./number";

describe("parseNumberInput", () => {
  it("parses plain, decimal and signed numbers", () => {
    expect(parseNumberInput("42")).toBe(42);
    expect(parseNumberInput(" 3.75 ")).toBe(3.75);
    expect(parseNumberInput(".5")).toBe(0.5);
    expect(parseNumberInput("-12")).toBe(-12);
  });

  it("accepts thousands separators and Bangla digits", () => {
    expect(parseNumberInput("25,000")).toBe(25000);
    expect(parseNumberInput("1,00,000")).toBe(100000);
    expect(parseNumberInput("১২৫০.৫")).toBe(1250.5);
    expect(parseNumberInput("২৫,০০০")).toBe(25000);
    expect(normalizeDigits("২০২৬")).toBe("2026");
  });

  it("rejects empty and malformed input", () => {
    for (const bad of ["", " ", "abc", "1.2.3", "1e5", "--1", "Infinity", "NaN", "5%"]) {
      expect(parseNumberInput(bad)).toBe(null);
    }
  });
});

describe("checkNumber", () => {
  it("reports missing, invalid and range problems", () => {
    expect(checkNumber("")).toEqual({ ok: false, code: "missing" });
    expect(checkNumber("x")).toEqual({ ok: false, code: "invalid" });
    expect(checkNumber("-1", { min: 0 })).toEqual({ ok: false, code: "too-small" });
    expect(checkNumber("0", { min: 0, minExclusive: true })).toEqual({ ok: false, code: "too-small" });
    expect(checkNumber("101", { max: 100 })).toEqual({ ok: false, code: "too-large" });
    expect(checkNumber("2.5", { integer: true })).toEqual({ ok: false, code: "not-integer" });
    expect(checkNumber("0", { min: 0 })).toEqual({ ok: true, value: 0 });
  });
});

describe("roundTo", () => {
  it("rounds half away from zero without float surprises", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(0.1 + 0.2, 2)).toBe(0.3);
    expect(roundTo(-2.5, 0)).toBe(-3);
    expect(roundTo(12345.675, 2)).toBe(12345.68);
    expect(roundTo(2.675, 2)).toBe(2.68);
    expect(roundTo(1e-7, 2)).toBe(0);
    expect(Object.is(roundTo(-0.001, 2), 0)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import {
  applyPercentage,
  calculatePercentage,
  MAX_ABSOLUTE_VALUE,
  percentChange,
  percentOf,
  whatPercent,
  wholeFromPart,
  type PercentageCalculation,
  type PercentageDirection,
  type PercentageMode,
  type PercentageResult,
} from "./logic";

function ok(mode: PercentageMode, a: string, b: string, direction?: PercentageDirection): PercentageResult {
  const calc = calculatePercentage(mode, a, b, direction ? { direction } : {});
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: PercentageCalculation) => (calc.ok ? [] : calc.errors);

/** Narrowing helpers so tests can read the fields of each result type. */
function percentOfResult(a: string, b: string) {
  const r = ok("percent-of", a, b);
  if (r.mode !== "percent-of") throw new Error("wrong mode");
  return r;
}
function whatPercentResult(a: string, b: string) {
  const r = ok("what-percent", a, b);
  if (r.mode !== "what-percent") throw new Error("wrong mode");
  return r;
}
function changeResult(a: string, b: string) {
  const r = ok("change", a, b);
  if (r.mode !== "change") throw new Error("wrong mode");
  return r;
}
function adjustResult(a: string, b: string, direction?: PercentageDirection) {
  const r = ok("increase-decrease", a, b, direction);
  if (r.mode !== "increase-decrease") throw new Error("wrong mode");
  return r;
}
function reverseResult(a: string, b: string) {
  const r = ok("reverse", a, b);
  if (r.mode !== "reverse") throw new Error("wrong mode");
  return r;
}

describe("core functions", () => {
  it("percentOf", () => {
    expect(percentOf(15, 80)).toBe(12);
    expect(percentOf(0, 80)).toBe(0);
    expect(percentOf(100, 37)).toBe(37);
    expect(percentOf(12.5, 240)).toBe(30);
  });

  it("whatPercent", () => {
    expect(whatPercent(25, 200)).toBe(12.5);
    expect(whatPercent(1, 3)).toBeCloseTo(33.3333333333, 8);
    expect(() => whatPercent(5, 0)).toThrow();
  });

  it("percentChange", () => {
    expect(percentChange(80, 100)).toBe(25);
    expect(percentChange(100, 80)).toBe(-20);
    expect(percentChange(-50, -25)).toBe(50);
    expect(() => percentChange(0, 5)).toThrow();
  });

  it("applyPercentage", () => {
    expect(applyPercentage(1000, 10, "increase")).toBeCloseTo(1100, 10);
    expect(applyPercentage(1000, 10, "decrease")).toBeCloseTo(900, 10);
  });

  it("wholeFromPart", () => {
    expect(wholeFromPart(25, 20)).toBe(125);
    expect(() => wholeFromPart(5, 0)).toThrow();
  });
});

describe("percent-of: what is P% of Y", () => {
  it("normal values", () => {
    expect(percentOfResult("15", "80").value).toBe(12);
    expect(percentOfResult("12.5", "240").value).toBe(30);
    expect(percentOfResult("150", "40").value).toBe(60);
    expect(percentOfResult("100", "250").value).toBe(250);
  });

  it("zero", () => {
    expect(percentOfResult("0", "500").value).toBe(0);
    expect(percentOfResult("20", "0").value).toBe(0);
  });

  it("negative numbers", () => {
    expect(percentOfResult("-20", "50").value).toBe(-10);
    expect(percentOfResult("50", "-80").value).toBe(-40);
    expect(percentOfResult("-10", "-300").value).toBe(30);
  });

  it("decimals and floating-point style inputs", () => {
    expect(percentOfResult("0.1", "0.2").value).toBeCloseTo(0.0002, 12);
    expect(percentOfResult("7.5", "125000").value).toBeCloseTo(9375, 8);
    expect(percentOfResult("33.333", "300").value).toBeCloseTo(99.999, 8);
  });

  it("echoes the inputs", () => {
    const r = percentOfResult("15", "80");
    expect([r.percent, r.base]).toEqual([15, 80]);
  });
});

describe("what-percent: X is what percent of Y", () => {
  it("normal values", () => {
    expect(whatPercentResult("25", "200").percent).toBe(12.5);
    expect(whatPercentResult("50", "20").percent).toBe(250);
    expect(whatPercentResult("0", "5").percent).toBe(0);
    expect(whatPercentResult("45", "60").percent).toBe(75);
  });

  it("repeating decimals stay precise", () => {
    expect(whatPercentResult("1", "3").percent).toBeCloseTo(33.3333333333, 8);
    expect(whatPercentResult("2", "3").percent).toBeCloseTo(66.6666666667, 8);
  });

  it("floating-point style inputs", () => {
    expect(whatPercentResult("0.3", "0.6").percent).toBeCloseTo(50, 10);
    expect(whatPercentResult("0.1", "0.3").percent).toBeCloseTo(33.3333333333, 8);
    expect(whatPercentResult("0.2", "0.1").percent).toBeCloseTo(200, 10);
  });

  it("negative numbers", () => {
    expect(whatPercentResult("-10", "40").percent).toBe(-25);
    expect(whatPercentResult("5", "-20").percent).toBe(-25);
    expect(whatPercentResult("-10", "-40").percent).toBe(25);
  });

  it("rejects dividing by zero", () => {
    expect(errors(calculatePercentage("what-percent", "5", "0"))).toEqual([{ field: "b", code: "zero" }]);
    expect(errors(calculatePercentage("what-percent", "0", "0"))).toEqual([{ field: "b", code: "zero" }]);
  });
});

describe("change: percentage change from A to B", () => {
  it("increase", () => {
    const r = changeResult("80", "100");
    expect(r.percent).toBe(25);
    expect(r.difference).toBe(20);
    expect(r.direction).toBe("increase");
    expect(changeResult("200", "250").percent).toBe(25);
  });

  it("decrease", () => {
    const r = changeResult("100", "80");
    expect(r.percent).toBe(-20);
    expect(r.difference).toBe(-20);
    expect(r.direction).toBe("decrease");
    expect(changeResult("20", "0").percent).toBe(-100);
  });

  it("no change", () => {
    const r = changeResult("50", "50");
    expect(r.percent).toBe(0);
    expect(r.difference).toBe(0);
    expect(r.direction).toBe("none");
  });

  it("floating-point noise is not a change", () => {
    const r = changeResult("0.3", "0.30000000000000004");
    expect(r.direction).toBe("none");
    expect(r.percent).toBe(0);
    expect(r.difference).toBe(0);
  });

  it("small real changes are still changes", () => {
    const r = changeResult("100", "100.001");
    expect(r.direction).toBe("increase");
    expect(r.percent).toBeCloseTo(0.001, 8);
  });

  it("decimals", () => {
    const r = changeResult("0.1", "0.3");
    expect(r.percent).toBeCloseTo(200, 8);
    expect(r.difference).toBeCloseTo(0.2, 10);
    expect(changeResult("12.5", "15").percent).toBeCloseTo(20, 10);
  });

  it("uses the size of the starting value for negatives", () => {
    expect(changeResult("-50", "-25").percent).toBe(50);
    expect(changeResult("-50", "-25").direction).toBe("increase");
    expect(changeResult("-50", "-75").percent).toBe(-50);
    expect(changeResult("-50", "-75").direction).toBe("decrease");
    expect(changeResult("10", "-10").percent).toBe(-200);
    expect(changeResult("-10", "10").percent).toBe(200);
  });

  it("rejects a starting value of zero", () => {
    expect(errors(calculatePercentage("change", "0", "5"))).toEqual([{ field: "a", code: "zero" }]);
  });
});

describe("increase-decrease: change Y by P%", () => {
  it("increase", () => {
    const r = adjustResult("1000", "10", "increase");
    expect(r.value).toBeCloseTo(1100, 10);
    expect(r.amount).toBeCloseTo(100, 10);
    expect(r.direction).toBe("increase");
    expect(r.decreaseOverHundred).toBe(false);
  });

  it("decrease", () => {
    const r = adjustResult("200", "15", "decrease");
    expect(r.value).toBeCloseTo(170, 10);
    expect(r.amount).toBeCloseTo(30, 10);
    expect(r.direction).toBe("decrease");
  });

  it("defaults to increase", () => {
    expect(adjustResult("100", "50").value).toBeCloseTo(150, 10);
    expect(adjustResult("100", "50").direction).toBe("increase");
  });

  it("zero percent changes nothing", () => {
    const r = adjustResult("250", "0", "increase");
    expect(r.value).toBe(250);
    expect(r.amount).toBe(0);
  });

  it("decimals", () => {
    expect(adjustResult("4999", "15", "increase").value).toBeCloseTo(5748.85, 8);
    expect(adjustResult("19.99", "20", "increase").value).toBeCloseTo(23.988, 8);
    expect(adjustResult("0.1", "200", "increase").value).toBeCloseTo(0.3, 12);
  });

  it("a negative starting value moves away from or towards zero", () => {
    const up = adjustResult("-100", "10", "increase");
    expect(up.value).toBeCloseTo(-110, 10);
    expect(up.amount).toBeCloseTo(10, 10);
    expect(adjustResult("-100", "10", "decrease").value).toBeCloseTo(-90, 10);
  });

  it("decreasing by exactly 100% gives zero", () => {
    const r = adjustResult("100", "100", "decrease");
    expect(r.value).toBe(0);
    expect(r.decreaseOverHundred).toBe(false);
  });

  it("decreasing by more than 100% goes below zero and is flagged", () => {
    const r = adjustResult("100", "150", "decrease");
    expect(r.value).toBe(-50);
    expect(r.amount).toBe(150);
    expect(r.decreaseOverHundred).toBe(true);
    expect(adjustResult("100", "150", "increase").decreaseOverHundred).toBe(false);
  });

  it("rejects a negative percentage", () => {
    expect(errors(calculatePercentage("increase-decrease", "100", "-5"))).toEqual([{ field: "b", code: "negative" }]);
  });
});

describe("reverse: X is P% of what number", () => {
  it("normal values", () => {
    expect(reverseResult("25", "20").whole).toBe(125);
    expect(reverseResult("50", "100").whole).toBe(50);
    expect(reverseResult("15", "150").whole).toBe(10);
    expect(reverseResult("12", "12.5").whole).toBe(96);
  });

  it("zero part", () => {
    expect(reverseResult("0", "20").whole).toBe(0);
  });

  it("negative numbers", () => {
    expect(reverseResult("-5", "-10").whole).toBeCloseTo(50, 10);
    expect(reverseResult("-5", "10").whole).toBeCloseTo(-50, 10);
  });

  it("floating-point style inputs", () => {
    expect(reverseResult("0.3", "50").whole).toBeCloseTo(0.6, 12);
    expect(reverseResult("1", "3").whole).toBeCloseTo(33.3333333333, 8);
  });

  it("rejects a percentage of zero", () => {
    expect(errors(calculatePercentage("reverse", "5", "0"))).toEqual([{ field: "b", code: "zero" }]);
  });
});

describe("input validation", () => {
  it("reports missing and invalid fields", () => {
    expect(errors(calculatePercentage("percent-of", "", "50"))).toEqual([{ field: "a", code: "missing" }]);
    expect(errors(calculatePercentage("percent-of", "10", "  "))).toEqual([{ field: "b", code: "missing" }]);
    expect(errors(calculatePercentage("percent-of", "", ""))).toEqual([
      { field: "a", code: "missing" },
      { field: "b", code: "missing" },
    ]);
    expect(errors(calculatePercentage("change", "abc", "5"))).toEqual([{ field: "a", code: "invalid" }]);
    expect(errors(calculatePercentage("change", "5", "1.2.3"))).toEqual([{ field: "b", code: "invalid" }]);
    expect(errors(calculatePercentage("reverse", "10%", "5"))).toEqual([{ field: "a", code: "invalid" }]);
  });

  it("reports every field problem together, before mode rules", () => {
    expect(errors(calculatePercentage("change", "", "x"))).toEqual([
      { field: "a", code: "missing" },
      { field: "b", code: "invalid" },
    ]);
  });

  it("accepts commas and Bangla digits", () => {
    expect(percentOfResult("১০", "২০০").value).toBe(20);
    expect(percentOfResult("10", "1,00,000").value).toBe(10000);
    expect(percentOfResult("10", "25,000").value).toBe(2500);
  });

  it("limits the size of numbers", () => {
    expect(percentOfResult("100", String(MAX_ABSOLUTE_VALUE)).value).toBe(MAX_ABSOLUTE_VALUE);
    expect(errors(calculatePercentage("percent-of", "10", "1000000000001"))).toEqual([
      { field: "b", code: "out-of-range" },
    ]);
    expect(errors(calculatePercentage("percent-of", "-1000000000001", "5"))).toEqual([
      { field: "a", code: "out-of-range" },
    ]);
  });

  it("never returns an infinite result", () => {
    const tiny = `0.${"0".repeat(319)}1`;
    expect(errors(calculatePercentage("reverse", "1", tiny))).toEqual([{ field: "b", code: "out-of-range" }]);
    expect(errors(calculatePercentage("what-percent", "1000000000000", tiny))).toEqual([
      { field: "b", code: "out-of-range" },
    ]);
  });

  it("keeps large valid results finite", () => {
    const r = percentOfResult("1000000000000", "1000000000000");
    expect(Number.isFinite(r.value)).toBe(true);
    expect(r.value).toBe(10000000000000000000000);
  });
});

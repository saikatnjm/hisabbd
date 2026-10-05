import { describe, expect, it } from "vitest";
import { formatNumber, formatPercent, formatTaka, joinList, pluralize } from "./format";

describe("formatNumber", () => {
  it("uses Bangladeshi grouping and trims decimals", () => {
    expect(formatNumber(25000)).toBe("25,000");
    expect(formatNumber(100000)).toBe("1,00,000");
    expect(formatNumber(12345678.9)).toBe("1,23,45,678.9");
    expect(formatNumber(3.14159)).toBe("3.14");
    expect(formatNumber(2, { minDecimals: 2 })).toBe("2.00");
    expect(formatNumber(0.1 + 0.2)).toBe("0.3");
  });

  it("never shows NaN, Infinity or -0", () => {
    expect(formatNumber(Number.NaN)).toBe("–");
    expect(formatNumber(Infinity)).toBe("–");
    expect(formatNumber(-0.001)).toBe("0");
  });
});

describe("formatTaka and formatPercent", () => {
  it("formats Taka", () => {
    expect(formatTaka(25000)).toBe("৳25,000");
    expect(formatTaka(1250.5)).toBe("৳1,251");
    expect(formatTaka(1250.5, { decimals: 2, minDecimals: 2 })).toBe("৳1,250.50");
    expect(formatTaka(-500)).toBe("−৳500");
    expect(formatTaka(-0.2)).toBe("৳0");
  });

  it("formats percentages", () => {
    expect(formatPercent(12.5)).toBe("12.5%");
    expect(formatPercent(33.33333)).toBe("33.33%");
  });
});

describe("text helpers", () => {
  it("pluralizes and joins", () => {
    expect(pluralize(1, "year")).toBe("1 year");
    expect(pluralize(1500, "day")).toBe("1,500 days");
    expect(joinList(["a", "b", "c"])).toBe("a, b and c");
  });
});

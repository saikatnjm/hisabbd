import { describe, expect, it } from "vitest";
import { calculatorPages } from "./page-registry";
import { calculators } from "./registry";

describe("calculator page registry", () => {
  it("has an entry for every published calculator (drives /bn routes)", () => {
    for (const calc of calculators) {
      expect(calculatorPages[calc.slug]?.meta.slug, calc.slug).toBe(calc.slug);
    }
    expect(Object.keys(calculatorPages)).toHaveLength(calculators.length);
  });
});

import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { calculatorPath, calculators, getRelatedCalculators, validateRegistry } from "./registry";
import { CATEGORY_IDS, type CalculatorMeta } from "./types";

function makeCalc(overrides: Partial<CalculatorMeta> = {}): CalculatorMeta {
  return {
    slug: "sample-calculator",
    name: "Sample Calculator",
    nameBn: "নমুনা ক্যালকুলেটর",
    category: "everyday",
    icon: "percent",
    summary: "Sample.",
    keywords: ["sample"],
    seo: { title: "Sample Calculator", description: "Sample description." },
    addedOn: "2026-01-15",
    related: [],
    ...overrides,
  };
}

describe("calculator registry", () => {
  it("is valid", () => {
    expect(validateRegistry(calculators)).toEqual([]);
  });

  it("has a route for every calculator", () => {
    for (const calc of calculators) {
      const page = join(process.cwd(), "src/app/calculators", calc.slug, "page.tsx");
      expect(existsSync(page)).toBe(true);
    }
  });

  it("never lists a calculator as related to itself", () => {
    for (const calc of calculators) {
      expect(getRelatedCalculators(calc).some((c) => c.slug === calc.slug)).toBe(false);
    }
  });

  it("defines every category exactly once", () => {
    expect(categories.map((c) => c.id).sort()).toEqual([...CATEGORY_IDS].sort());
  });
});

describe("validateRegistry", () => {
  it("accepts a valid list", () => {
    const list = [makeCalc({ related: ["b-calculator"] }), makeCalc({ slug: "b-calculator" })];
    expect(validateRegistry(list)).toEqual([]);
  });

  it("rejects duplicate slugs", () => {
    expect(validateRegistry([makeCalc(), makeCalc()])).toHaveLength(1);
  });

  it("rejects malformed slugs", () => {
    for (const slug of ["Age", "age_calc", "-age", "age-", "age--calc", ""]) {
      expect(validateRegistry([makeCalc({ slug })]).length).toBeGreaterThan(0);
    }
  });

  it("rejects unknown and self related links", () => {
    expect(validateRegistry([makeCalc({ related: ["missing"] })])).toHaveLength(1);
    expect(validateRegistry([makeCalc({ related: ["sample-calculator"] })])).toHaveLength(1);
  });

  it("rejects invalid addedOn dates", () => {
    for (const addedOn of ["2026-1-5", "2026-02-30", "15-01-2026", ""]) {
      expect(validateRegistry([makeCalc({ addedOn })])).toHaveLength(1);
    }
  });

  it("rejects empty SEO fields", () => {
    expect(validateRegistry([makeCalc({ seo: { title: " ", description: "x" } })])).toHaveLength(1);
  });
});

describe("calculatorPath", () => {
  it("builds a path under /calculators", () => {
    expect(calculatorPath("age-calculator")).toBe("/calculators/age-calculator");
  });
});

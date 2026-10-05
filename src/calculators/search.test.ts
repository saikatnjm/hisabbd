import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import {
  buildCategorySearchIndex,
  normalizeQuery,
  searchCalculators,
  searchCategories,
  type SearchItem,
} from "./search";

const items: SearchItem[] = [
  {
    slug: "age-calculator",
    href: "/calculators/age-calculator",
    name: "Age Calculator",
    nameBn: "বয়স ক্যালকুলেটর",
    summary: "Find your exact age in years, months and days.",
    keywords: ["birthday", "dob"],
    icon: "calendar",
    categoryId: "date-time",
    categoryName: "Date & Time",
  },
  {
    slug: "emi-calculator",
    href: "/calculators/emi-calculator",
    name: "EMI Calculator",
    nameBn: "ইএমআই ক্যালকুলেটর",
    summary: "Monthly loan installment.",
    keywords: ["loan", "kisti", "কিস্তি"],
    icon: "landmark",
    categoryId: "finance",
    categoryName: "Finance",
  },
  {
    slug: "percentage-calculator",
    href: "/calculators/percentage-calculator",
    name: "Percentage Calculator",
    nameBn: "শতাংশ ক্যালকুলেটর",
    summary: "Work out percentages quickly.",
    keywords: ["percent"],
    icon: "percent",
    categoryId: "everyday",
    categoryName: "Everyday",
  },
];

const slugs = (q: string) => searchCalculators(items, q).map((i) => i.slug);

describe("searchCalculators", () => {
  it("returns nothing for an empty query", () => {
    expect(slugs("   ")).toEqual([]);
  });

  it("matches names case-insensitively", () => {
    expect(slugs("AGE")).toEqual(["age-calculator"]);
  });

  it("matches summary and category text", () => {
    expect(slugs("loan")).toEqual(["emi-calculator"]);
    expect(slugs("finance")).toEqual(["emi-calculator"]);
  });

  it("matches keywords, including Bangla", () => {
    expect(slugs("dob")).toEqual(["age-calculator"]);
    expect(slugs("কিস্তি")).toEqual(["emi-calculator"]);
  });

  it("matches Bangla names", () => {
    expect(slugs("বয়স")).toEqual(["age-calculator"]);
  });

  it("matches word starts only, not mid-word", () => {
    expect(slugs("cent")).toEqual([]);
    expect(slugs("perc")).toEqual(["percentage-calculator"]);
  });

  it("ignores punctuation in queries", () => {
    expect(slugs("date & time")).toEqual(["age-calculator"]);
  });

  it("requires every word to match", () => {
    expect(slugs("age loan")).toEqual([]);
  });

  it("ranks name-prefix matches first", () => {
    expect(slugs("calculator")[0]).toBe("age-calculator");
    expect(slugs("per")[0]).toBe("percentage-calculator");
  });

  it("respects the limit", () => {
    expect(searchCalculators(items, "calculator", 2)).toHaveLength(2);
  });
});

describe("normalizeQuery", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeQuery("  Age   Calc ")).toBe("age calc");
  });
});

describe("searchCategories", () => {
  const index = buildCategorySearchIndex(categories);
  const ids = (q: string) => searchCategories(index, q).map((c) => c.id);

  it("matches category names and descriptions", () => {
    expect(ids("health")).toEqual(["health"]);
    expect(ids("loan")).toEqual(["finance"]);
    expect(ids("gpa")).toEqual(["education"]);
  });

  it("links to the category page", () => {
    expect(index.find((c) => c.id === "education")?.href).toBe("/categories/education");
  });
});

import { describe, expect, it } from "vitest";
import { calculators } from "@/calculators/registry";
import { guidePages } from "./page-registry";
import { guidePath, guides, validateGuides } from "./registry";
import type { GuideMeta } from "./types";

const calculatorSlugs = calculators.map((c) => c.slug);

function makeGuide(overrides: Partial<GuideMeta> = {}): GuideMeta {
  return {
    slug: "sample-guide",
    title: "Sample guide",
    titleBn: "নমুনা গাইড",
    summary: "Sample.",
    summaryBn: "নমুনা।",
    answer: "Sample answer.",
    answerBn: "নমুনা উত্তর।",
    seo: { title: "Sample guide", description: "Sample description." },
    seoBn: { title: "নমুনা গাইড", description: "নমুনা বর্ণনা।" },
    calculator: "age-calculator",
    publishedOn: "2026-10-28",
    ...overrides,
  };
}

describe("guides", () => {
  it("are valid", () => {
    expect(validateGuides(guides, calculatorSlugs)).toEqual([]);
  });

  it("each have article components in both languages", () => {
    for (const guide of guides) expect(guidePages[guide.slug]?.meta.slug, guide.slug).toBe(guide.slug);
    expect(Object.keys(guidePages)).toHaveLength(guides.length);
  });
});

describe("validateGuides", () => {
  it("accepts a valid guide", () => {
    expect(validateGuides([makeGuide()], calculatorSlugs)).toEqual([]);
  });

  it("rejects duplicates, bad slugs, unknown calculators and bad dates", () => {
    expect(validateGuides([makeGuide(), makeGuide()], calculatorSlugs)).toHaveLength(1);
    expect(validateGuides([makeGuide({ slug: "Bad_Slug" })], calculatorSlugs)).toHaveLength(1);
    expect(validateGuides([makeGuide({ calculator: "missing-calculator" })], calculatorSlugs)).toHaveLength(1);
    expect(validateGuides([makeGuide({ publishedOn: "2026-02-30" })], calculatorSlugs)).toHaveLength(1);
    expect(validateGuides([makeGuide({ updatedOn: "2026-10-01" })], calculatorSlugs)).toHaveLength(1);
  });

  it("rejects empty Bangla text", () => {
    expect(validateGuides([makeGuide({ titleBn: " " })], calculatorSlugs)).toHaveLength(1);
  });
});

describe("guidePath", () => {
  it("builds a path under /guides", () => {
    expect(guidePath("land-measurement-units")).toBe("/guides/land-measurement-units");
  });
});

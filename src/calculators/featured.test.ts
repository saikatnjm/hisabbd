import { describe, expect, it } from "vitest";
import { featuredSlugs } from "./featured";
import { getCalculator } from "./registry";

describe("featured calculators", () => {
  it("only references calculators that exist", () => {
    for (const slug of featuredSlugs) expect(getCalculator(slug)?.slug).toBe(slug);
  });

  it("has no duplicates", () => {
    expect(new Set(featuredSlugs).size).toBe(featuredSlugs.length);
  });
});

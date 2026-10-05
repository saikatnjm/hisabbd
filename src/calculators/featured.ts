import { calculators, getCalculator } from "./registry";
import type { CalculatorMeta } from "./types";

/**
 * Editor-picked starting points shown on the homepage and as search suggestions.
 * This is a curated list, not usage data. Slugs must exist in the registry.
 * Replace with real popularity data later if it becomes available.
 */
export const featuredSlugs: readonly string[] = [
  "age-calculator",
  "bmi-calculator",
  "gpa-calculator",
  "emi-calculator",
  "percentage-calculator",
  "salary-calculator",
];

const FALLBACK_LIMIT = 6;

/** Featured calculators, or the first few registry entries if none are picked yet. */
export function getFeaturedCalculators(): CalculatorMeta[] {
  const picked = featuredSlugs
    .map((slug) => getCalculator(slug))
    .filter((c): c is CalculatorMeta => c !== undefined);
  return picked.length > 0 ? picked : calculators.slice(0, FALLBACK_LIMIT);
}

/** Every calculator not in the featured list, in registry order. */
export function getOtherCalculators(): CalculatorMeta[] {
  const featured = new Set(getFeaturedCalculators().map((c) => c.slug));
  return calculators.filter((c) => !featured.has(c.slug));
}

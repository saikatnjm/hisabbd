import type { CategoryId } from "./types";

/** Listing page of all calculators. */
export const CALCULATORS_PATH = "/calculators";

/** URL path for a calculator page, e.g. "age-calculator" → "/calculators/age-calculator". */
export function calculatorPath(slug: string): string {
  return `${CALCULATORS_PATH}/${slug}`;
}

/** Element id of a category's card on the homepage. */
export function categoryAnchorId(id: CategoryId): string {
  return `category-${id}`;
}

/** URL of a category page, e.g. "/categories/finance". */
export function categoryHref(id: CategoryId): string {
  return `/categories/${id}`;
}

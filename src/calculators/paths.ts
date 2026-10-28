import type { CategoryId } from "./types";

/** Listing page of all calculators. */
export const CALCULATORS_PATH = "/calculators";

/** URL path for a calculator page, e.g. "age-calculator" → "/calculators/age-calculator". */
export function calculatorPath(slug: string): string {
  return `${CALCULATORS_PATH}/${slug}`;
}

/** Frameable widget-only page for other websites, e.g. ("bn", "age-calculator") → "/embed/bn/age-calculator". */
export function embedPath(locale: "en" | "bn", slug: string): string {
  return `/embed/${locale}/${slug}`;
}

const EMBED_PATH = /^\/embed\/(en|bn)\/([a-z0-9-]+)\/?$/;

/**
 * The full calculator page for a pathname: an embed path maps to its real page
 * ("/embed/bn/age-calculator" → "/bn/calculators/age-calculator"); any other
 * pathname is returned unchanged. Used so shared links never point at an embed.
 */
export function shareablePath(pathname: string): string {
  const match = EMBED_PATH.exec(pathname);
  if (!match) return pathname;
  const page = calculatorPath(match[2] ?? "");
  return match[1] === "bn" ? `/bn${page}` : page;
}

/** Element id of a category's card on the homepage. */
export function categoryAnchorId(id: CategoryId): string {
  return `category-${id}`;
}

/** URL of a category page, e.g. "/categories/finance". */
export function categoryHref(id: CategoryId): string {
  return `/categories/${id}`;
}

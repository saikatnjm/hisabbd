export const CATEGORY_IDS = ["health", "education", "finance", "everyday", "date-time"] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  name: string;
  nameBn: string;
  description: string;
}

/** Icon keys a calculator can use (rendered by components/calculator/calculator-icon.tsx). */
export const CALCULATOR_ICONS = [
  "calendar",
  "calendar-range",
  "scale",
  "graduation",
  "book",
  "percent",
  "tag",
  "trending",
  "landmark",
  "wallet",
] as const;

export type CalculatorIconName = (typeof CALCULATOR_ICONS)[number];

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Server-safe calculator metadata. Contains no React components so it can be
 * imported anywhere (routes, sitemap, metadata) without adding client JS.
 * Canonical URLs are derived from `slug` — never stored separately.
 */
export interface CalculatorMeta {
  /** Unique id and URL segment, e.g. "age-calculator" → /calculators/age-calculator */
  slug: string;
  name: string;
  nameBn: string;
  category: CategoryId;
  icon: CalculatorIconName;
  /** One sentence used as the page intro, in cards and in search. */
  summary: string;
  /** Extra search terms: synonyms, abbreviations, Bangla words. Not shown. */
  keywords: readonly string[];
  seo: {
    title: string;
    description: string;
  };
  /** Publish date (YYYY-MM-DD). Drives "Recently added" — real data only. */
  addedOn: string;
  /** Slugs of related calculators (must exist in the registry). */
  related: readonly string[];
  faqs?: readonly FaqItem[];
}

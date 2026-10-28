export const CATEGORY_IDS = ["health", "education", "finance", "everyday", "date-time"] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
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
  "briefcase",
  "certificate",
  "land",
  "text",
  "receipt",
  "calendar-day",
] as const;

export type CalculatorIconName = (typeof CALCULATOR_ICONS)[number];

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoFields {
  title: string;
  description: string;
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
  /** Bangla version of `summary`, used on /bn pages. */
  summaryBn: string;
  /** Extra search terms: synonyms, abbreviations, Bangla words. Not shown. */
  keywords: readonly string[];
  seo: SeoFields;
  /** Bangla SEO title and description, used on /bn pages. */
  seoBn: SeoFields;
  /** Publish date (YYYY-MM-DD). Drives "Recently added" — real data only. */
  addedOn: string;
  /**
   * Last date the rules or figures were checked (YYYY-MM-DD), on or after
   * `addedOn`. Set it when a calculator depends on rules that change (age
   * limits, rates). Shown as "Last reviewed" and used as the sitemap lastModified.
   */
  updatedOn?: string;
  /** Slugs of related calculators (must exist in the registry). */
  related: readonly string[];
  faqs?: readonly FaqItem[];
  /** Bangla FAQs shown (and marked up) on /bn pages. */
  faqsBn?: readonly FaqItem[];
}

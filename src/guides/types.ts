import type { SeoFields } from "@/calculators/types";

/**
 * Server-safe guide metadata (no React), like CalculatorMeta. A guide is an
 * explanatory article that answers a common question and sends the reader to
 * one calculator. URLs are derived from `slug`: /guides/<slug> and
 * /bn/guides/<slug>.
 */
export interface GuideMeta {
  /** Unique id and URL segment, e.g. "government-job-age-limit". */
  slug: string;
  /** H1 and card title. */
  title: string;
  titleBn: string;
  /** One or two sentences: page intro, card text. */
  summary: string;
  summaryBn: string;
  /**
   * The direct answer, shown first on the page: 2–3 sentences with the key
   * formula or number and a worked figure, readable on its own. Search
   * snippets and AI answers quote passages like this. Plain text, no links.
   */
  answer: string;
  answerBn: string;
  seo: SeoFields;
  seoBn: SeoFields;
  /** Slug of the calculator this guide leads to (must exist in the calculator registry). */
  calculator: string;
  /** Publish date (YYYY-MM-DD). */
  publishedOn: string;
  /** Last substantive review (YYYY-MM-DD), on or after publishedOn. */
  updatedOn?: string;
}

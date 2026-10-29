import { describe, expect, it } from "vitest";
import { guides } from "@/guides/registry";
import { calculators, getRelatedCalculators } from "./registry";
import type { SeoFields } from "./types";

/*
 * Automated part of AGENTS.md hard rule 10 ("Every page is an SEO landing
 * page for a real search"). These are the checks a test can make; the rest of
 * the checklist (search intent, worked example, sources) is for review.
 */

const BANGLA = /[ঀ-৿]/;

function seoProblems(label: string, seo: SeoFields, locale: "en" | "bn"): string[] {
  const problems: string[] = [];
  const { title, description } = seo;
  if (title.length < 20 || title.length > 60) problems.push(`${label} ${locale} title is ${title.length} chars (20–60)`);
  if (/HisabBD/i.test(title)) problems.push(`${label} ${locale} title includes the site name (the layout adds it)`);
  const [min, max] = locale === "en" ? [100, 165] : [90, 175];
  if (description.length < min || description.length > max) {
    problems.push(`${label} ${locale} description is ${description.length} chars (${min}–${max})`);
  }
  if (locale === "bn" && !BANGLA.test(title)) problems.push(`${label} bn title has no Bangla`);
  return problems;
}

describe("SEO landing-page criteria", () => {
  it("calculators have well-sized, unique titles and descriptions in both languages", () => {
    const problems = calculators.flatMap((c) => [...seoProblems(c.slug, c.seo, "en"), ...seoProblems(c.slug, c.seoBn, "bn")]);
    expect(problems).toEqual([]);
  });

  it("guides have well-sized titles and descriptions in both languages", () => {
    const problems = guides.flatMap((g) => [...seoProblems(g.slug, g.seo, "en"), ...seoProblems(g.slug, g.seoBn, "bn")]);
    expect(problems).toEqual([]);
  });

  it("no two pages share a title in the same language", () => {
    for (const locale of ["en", "bn"] as const) {
      const titles = [
        ...calculators.map((c) => (locale === "en" ? c.seo : c.seoBn).title),
        ...guides.map((g) => (locale === "en" ? g.seo : g.seoBn).title),
      ];
      const duplicates = titles.filter((t, i) => titles.indexOf(t) !== i);
      expect(duplicates, locale).toEqual([]);
    }
  });

  it("calculators target Bangla and English searches (keywords)", () => {
    const problems = calculators
      .filter((c) => c.keywords.length < 5 || c.keywords.filter((k) => BANGLA.test(k)).length < 2)
      .map((c) => `${c.slug}: needs at least 5 keywords incl. 2 in Bangla`);
    expect(problems).toEqual([]);
  });

  it("calculators answer follow-up questions in both languages (FAQs)", () => {
    const problems = calculators
      .filter((c) => (c.faqs?.length ?? 0) < 5 || c.faqs?.length !== c.faqsBn?.length)
      .map((c) => `${c.slug}: ${c.faqs?.length ?? 0} EN / ${c.faqsBn?.length ?? 0} BN FAQs (need ≥ 5, equal)`);
    expect(problems).toEqual([]);
  });

  it("every calculator is linked from at least two other pages (shown related links and guides)", () => {
    const inbound = new Map<string, number>();
    const add = (slug: string) => inbound.set(slug, (inbound.get(slug) ?? 0) + 1);
    // Only the related calculators a page actually shows count (the first 3).
    for (const calc of calculators) getRelatedCalculators(calc).forEach((r) => add(r.slug));
    for (const guide of guides) add(guide.calculator);
    const problems = calculators
      .filter((c) => (inbound.get(c.slug) ?? 0) < 2)
      .map((c) => `${c.slug}: linked from ${inbound.get(c.slug) ?? 0} page(s); add it near the start of a related list (only 3 are shown) or write a guide`);
    expect(problems).toEqual([]);
  });
});

import { getCategory } from "./categories";
import { localePath, type Locale } from "@/i18n/locales";
import { calculatorPath, categoryHref } from "./paths";
import type { CalculatorIconName, CalculatorMeta, Category, CategoryId } from "./types";

/** Minimal, serializable calculator data passed to the client-side search. */
export interface SearchItem {
  slug: string;
  href: string;
  name: string;
  nameBn: string;
  summary: string;
  keywords: readonly string[];
  icon: CalculatorIconName;
  categoryId: CategoryId;
  categoryName: string;
}

export interface CategorySearchItem {
  id: CategoryId;
  href: string;
  name: string;
  nameBn: string;
  description: string;
}

/**
 * `locale` localizes what the search shows (name, summary, category, links);
 * `name`/`nameBn` always carry both languages so matching works in either.
 */
export function buildSearchIndex(list: readonly CalculatorMeta[], locale: Locale = "en"): SearchItem[] {
  return list.map((calc) => ({
    slug: calc.slug,
    href: localePath(locale, calculatorPath(calc.slug)),
    name: locale === "bn" ? calc.nameBn : calc.name,
    nameBn: locale === "bn" ? calc.name : calc.nameBn,
    summary: locale === "bn" ? calc.summaryBn : calc.summary,
    keywords: calc.keywords,
    icon: calc.icon,
    categoryId: calc.category,
    categoryName: locale === "bn" ? getCategory(calc.category).nameBn : getCategory(calc.category).name,
  }));
}

export function buildCategorySearchIndex(list: readonly Category[], locale: Locale = "en"): CategorySearchItem[] {
  return list.map((category) => ({
    id: category.id,
    href: localePath(locale, categoryHref(category.id)),
    name: locale === "bn" ? category.nameBn : category.name,
    nameBn: locale === "bn" ? category.name : category.nameBn,
    description: locale === "bn" ? category.descriptionBn : category.description,
  }));
}

export function normalizeQuery(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

/** Splits text into lowercase words on whitespace and punctuation (Bangla-safe). */
function toWords(value: string): string[] {
  return normalizeQuery(value)
    .split(/[^\p{L}\p{M}\p{N}]+/u)
    .filter(Boolean);
}

/**
 * Every query word must match the start of a word in the item's text
 * (so "age" finds "Age Calculator" but not "percentage").
 * Name matches rank above other text matches.
 */
function rank<T>(
  items: readonly T[],
  query: string,
  limit: number,
  fields: (item: T) => { name: string; text: string[] },
): T[] {
  const queryWords = toWords(query);
  if (queryWords.length === 0) return [];
  const q = queryWords.join(" ");

  return items
    .map((item) => {
      const { name, text } = fields(item);
      const nameWords = toWords(name);
      const words = toWords([name, ...text].join(" "));
      if (!queryWords.every((qw) => words.some((w) => w.startsWith(qw)))) return null;
      const score = nameWords.join(" ").startsWith(q)
        ? 3
        : queryWords.every((qw) => nameWords.some((w) => w.startsWith(qw)))
          ? 2
          : 1;
      return { item, score, name };
    })
    .filter((r): r is { item: T; score: number; name: string } => r !== null)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((r) => r.item);
}

export function searchCalculators(
  items: readonly SearchItem[],
  query: string,
  limit = 6,
): SearchItem[] {
  return rank(items, query, limit, (i) => ({
    name: i.name,
    text: [i.nameBn, i.summary, i.categoryName, i.slug, ...i.keywords],
  }));
}

export function searchCategories(
  items: readonly CategorySearchItem[],
  query: string,
  limit = 3,
): CategorySearchItem[] {
  return rank(items, query, limit, (i) => ({
    name: i.name,
    text: [i.nameBn, i.description, i.id],
  }));
}

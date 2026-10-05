import { ageCalculator } from "./age/meta";
import { bmiCalculator } from "./bmi/meta";
import { cgpaCalculator } from "./cgpa/meta";
import { dateDifferenceCalculator } from "./date-difference/meta";
import { discountCalculator } from "./discount/meta";
import { emiCalculator } from "./emi/meta";
import { gpaCalculator } from "./gpa/meta";
import { percentageCalculator } from "./percentage/meta";
import { profitLossCalculator } from "./profit-loss/meta";
import { salaryCalculator } from "./salary/meta";
import { CATEGORY_IDS, type CalculatorMeta, type CategoryId } from "./types";

export { calculatorPath } from "./paths";

/**
 * Registry of all published calculators.
 * Each calculator lives in `src/calculators/<name>/` (meta, logic, tests, UI)
 * and has a route at `src/app/calculators/<slug>/page.tsx`. Only its metadata
 * is imported here, so this file stays free of client code.
 */
export const calculators: readonly CalculatorMeta[] = [
  ageCalculator,
  bmiCalculator,
  gpaCalculator,
  cgpaCalculator,
  percentageCalculator,
  discountCalculator,
  profitLossCalculator,
  emiCalculator,
  salaryCalculator,
  dateDifferenceCalculator,
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Returns a list of problems; empty means the registry is valid. */
export function validateRegistry(list: readonly CalculatorMeta[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const calc of list) {
    if (!SLUG_PATTERN.test(calc.slug)) errors.push(`Invalid slug: "${calc.slug}"`);
    if (slugs.has(calc.slug)) errors.push(`Duplicate slug: "${calc.slug}"`);
    slugs.add(calc.slug);

    if (!(CATEGORY_IDS as readonly string[]).includes(calc.category)) {
      errors.push(`Unknown category "${calc.category}" in "${calc.slug}"`);
    }
    if (!calc.name.trim() || !calc.seo.title.trim() || !calc.seo.description.trim()) {
      errors.push(`Missing name or SEO fields in "${calc.slug}"`);
    }
    if (calc.keywords.length === 0) errors.push(`No search keywords in "${calc.slug}"`);
    if (!isValidIsoDate(calc.addedOn)) {
      errors.push(`Invalid addedOn date "${calc.addedOn}" in "${calc.slug}"`);
    }
  }

  for (const calc of list) {
    for (const rel of calc.related) {
      if (rel === calc.slug) errors.push(`"${calc.slug}" lists itself as related`);
      else if (!slugs.has(rel)) errors.push(`"${calc.slug}" has unknown related slug "${rel}"`);
    }
  }

  return errors;
}

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: CategoryId): CalculatorMeta[] {
  return calculators.filter((c) => c.category === category);
}

/**
 * Related calculators: explicit `related` slugs first, then others from the
 * same category. Never includes the calculator itself.
 */
export function getRelatedCalculators(calc: CalculatorMeta, limit = 3): CalculatorMeta[] {
  const explicit = calc.related
    .map((slug) => getCalculator(slug))
    .filter((c): c is CalculatorMeta => c !== undefined);
  const sameCategory = calculators.filter(
    (c) => c.category === calc.category && c.slug !== calc.slug && !calc.related.includes(c.slug),
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

/** Most recently published calculators, newest first. */
export function getRecentlyAdded(limit: number): CalculatorMeta[] {
  return [...calculators]
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

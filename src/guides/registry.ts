import { ageFromDateOfBirthGuide } from "./age-from-date-of-birth/meta";
import { cgpaCalculationGuide } from "./cgpa-calculation/meta";
import { howEmiIsCalculatedGuide } from "./how-emi-is-calculated/meta";
import { percentageCalculationGuide } from "./percentage-calculation/meta";
import { governmentJobAgeLimitGuide } from "./government-job-age-limit/meta";
import { landMeasurementUnitsGuide } from "./land-measurement-units/meta";
import { sscHscGpaCalculationGuide } from "./ssc-hsc-gpa-calculation/meta";
import type { GuideMeta } from "./types";

export { GUIDES_PATH, guidePath } from "./paths";

/**
 * Published guides, newest last. Each lives in `src/guides/<slug>/` (meta,
 * content, content.bn) and is listed in page-registry.tsx. Only metadata is
 * imported here, so routes, the sitemap and calculator pages can use it
 * without pulling in article content.
 */
export const guides: readonly GuideMeta[] = [
  governmentJobAgeLimitGuide,
  sscHscGpaCalculationGuide,
  landMeasurementUnitsGuide,
  ageFromDateOfBirthGuide,
  cgpaCalculationGuide,
  howEmiIsCalculatedGuide,
  percentageCalculationGuide,
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Returns a list of problems; empty means the guides are valid. */
export function validateGuides(list: readonly GuideMeta[], calculatorSlugs: readonly string[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const guide of list) {
    if (!SLUG_PATTERN.test(guide.slug)) errors.push(`Invalid guide slug: "${guide.slug}"`);
    if (slugs.has(guide.slug)) errors.push(`Duplicate guide slug: "${guide.slug}"`);
    slugs.add(guide.slug);

    const texts = [guide.title, guide.titleBn, guide.summary, guide.summaryBn, guide.seo.title, guide.seo.description, guide.seoBn.title, guide.seoBn.description];
    if (texts.some((text) => !text.trim())) errors.push(`Missing title, summary or SEO text in guide "${guide.slug}"`);
    if (!calculatorSlugs.includes(guide.calculator)) {
      errors.push(`Guide "${guide.slug}" links to unknown calculator "${guide.calculator}"`);
    }
    if (!isValidIsoDate(guide.publishedOn)) errors.push(`Invalid publishedOn "${guide.publishedOn}" in guide "${guide.slug}"`);
    if (guide.updatedOn !== undefined && (!isValidIsoDate(guide.updatedOn) || guide.updatedOn < guide.publishedOn)) {
      errors.push(`Invalid updatedOn "${guide.updatedOn}" in guide "${guide.slug}"`);
    }
  }
  return errors;
}

export function getGuide(slug: string): GuideMeta | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Guides that lead to a calculator (shown on that calculator's page). */
export function getGuidesForCalculator(calculatorSlug: string): GuideMeta[] {
  return guides.filter((g) => g.calculator === calculatorSlug);
}

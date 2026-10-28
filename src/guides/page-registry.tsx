import type { ComponentType } from "react";
import { AgeFromDateOfBirthGuideContent } from "./age-from-date-of-birth/content";
import { AgeFromDateOfBirthGuideContentBn } from "./age-from-date-of-birth/content.bn";
import { ageFromDateOfBirthGuide } from "./age-from-date-of-birth/meta";
import { CgpaCalculationGuideContent } from "./cgpa-calculation/content";
import { CgpaCalculationGuideContentBn } from "./cgpa-calculation/content.bn";
import { cgpaCalculationGuide } from "./cgpa-calculation/meta";
import { HowEmiIsCalculatedGuideContent } from "./how-emi-is-calculated/content";
import { HowEmiIsCalculatedGuideContentBn } from "./how-emi-is-calculated/content.bn";
import { howEmiIsCalculatedGuide } from "./how-emi-is-calculated/meta";
import { PercentageCalculationGuideContent } from "./percentage-calculation/content";
import { PercentageCalculationGuideContentBn } from "./percentage-calculation/content.bn";
import { percentageCalculationGuide } from "./percentage-calculation/meta";
import { GovernmentJobAgeLimitGuideContent } from "./government-job-age-limit/content";
import { GovernmentJobAgeLimitGuideContentBn } from "./government-job-age-limit/content.bn";
import { governmentJobAgeLimitGuide } from "./government-job-age-limit/meta";
import { LandMeasurementUnitsGuideContent } from "./land-measurement-units/content";
import { LandMeasurementUnitsGuideContentBn } from "./land-measurement-units/content.bn";
import { landMeasurementUnitsGuide } from "./land-measurement-units/meta";
import { SscHscGpaCalculationGuideContent } from "./ssc-hsc-gpa-calculation/content";
import { SscHscGpaCalculationGuideContentBn } from "./ssc-hsc-gpa-calculation/content.bn";
import { sscHscGpaCalculationGuide } from "./ssc-hsc-gpa-calculation/meta";
import type { GuideMeta } from "./types";

export interface GuidePageEntry {
  meta: GuideMeta;
  /** English article (Server Component). */
  Content: ComponentType;
  /** Bangla article (Server Component). */
  ContentBn: ComponentType;
}

/**
 * slug → article components, used by the guide routes in both locales.
 * Keep in sync with `guides` in registry.ts; the guides test checks both.
 */
const entries: GuidePageEntry[] = [
  { meta: governmentJobAgeLimitGuide, Content: GovernmentJobAgeLimitGuideContent, ContentBn: GovernmentJobAgeLimitGuideContentBn },
  { meta: sscHscGpaCalculationGuide, Content: SscHscGpaCalculationGuideContent, ContentBn: SscHscGpaCalculationGuideContentBn },
  { meta: landMeasurementUnitsGuide, Content: LandMeasurementUnitsGuideContent, ContentBn: LandMeasurementUnitsGuideContentBn },
  { meta: ageFromDateOfBirthGuide, Content: AgeFromDateOfBirthGuideContent, ContentBn: AgeFromDateOfBirthGuideContentBn },
  { meta: cgpaCalculationGuide, Content: CgpaCalculationGuideContent, ContentBn: CgpaCalculationGuideContentBn },
  { meta: howEmiIsCalculatedGuide, Content: HowEmiIsCalculatedGuideContent, ContentBn: HowEmiIsCalculatedGuideContentBn },
  { meta: percentageCalculationGuide, Content: PercentageCalculationGuideContent, ContentBn: PercentageCalculationGuideContentBn },
];

export const guidePages: Record<string, GuidePageEntry> = Object.fromEntries(
  entries.map((entry) => [entry.meta.slug, entry]),
);

import type { ComponentType } from "react";
import { SanchayapatraProfitGuideContent } from "./sanchayapatra-profit/content";
import { SanchayapatraProfitGuideContentBn } from "./sanchayapatra-profit/content.bn";
import { sanchayapatraProfitGuide } from "./sanchayapatra-profit/meta";
import { FdrVsDpsGuideContent } from "./fdr-vs-dps/content";
import { FdrVsDpsGuideContentBn } from "./fdr-vs-dps/content.bn";
import { fdrVsDpsGuide } from "./fdr-vs-dps/meta";
import { BkashCashOutChargeGuideContent } from "./bkash-cash-out-charge/content";
import { BkashCashOutChargeGuideContentBn } from "./bkash-cash-out-charge/content.bn";
import { bkashCashOutChargeGuide } from "./bkash-cash-out-charge/meta";
import { VatCalculationGuideContent } from "./vat-calculation/content";
import { VatCalculationGuideContentBn } from "./vat-calculation/content.bn";
import { vatCalculationGuide } from "./vat-calculation/meta";
import { ZakatNisabGuideContent } from "./zakat-nisab/content";
import { ZakatNisabGuideContentBn } from "./zakat-nisab/content.bn";
import { zakatNisabGuide } from "./zakat-nisab/meta";
import { BmiExplainedGuideContent } from "./bmi-explained/content";
import { BmiExplainedGuideContentBn } from "./bmi-explained/content.bn";
import { bmiExplainedGuide } from "./bmi-explained/meta";
import { BanglaCalendarGuideContent } from "./bangla-calendar/content";
import { BanglaCalendarGuideContentBn } from "./bangla-calendar/content.bn";
import { banglaCalendarGuide } from "./bangla-calendar/meta";
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
  { meta: sanchayapatraProfitGuide, Content: SanchayapatraProfitGuideContent, ContentBn: SanchayapatraProfitGuideContentBn },
  { meta: fdrVsDpsGuide, Content: FdrVsDpsGuideContent, ContentBn: FdrVsDpsGuideContentBn },
  { meta: bkashCashOutChargeGuide, Content: BkashCashOutChargeGuideContent, ContentBn: BkashCashOutChargeGuideContentBn },
  { meta: vatCalculationGuide, Content: VatCalculationGuideContent, ContentBn: VatCalculationGuideContentBn },
  { meta: zakatNisabGuide, Content: ZakatNisabGuideContent, ContentBn: ZakatNisabGuideContentBn },
  { meta: bmiExplainedGuide, Content: BmiExplainedGuideContent, ContentBn: BmiExplainedGuideContentBn },
  { meta: banglaCalendarGuide, Content: BanglaCalendarGuideContent, ContentBn: BanglaCalendarGuideContentBn },
];

export const guidePages: Record<string, GuidePageEntry> = Object.fromEntries(
  entries.map((entry) => [entry.meta.slug, entry]),
);

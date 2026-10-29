import type { ComponentType } from "react";
import { DiscountCalculationGuideContent } from "./discount-calculation/content";
import { DiscountCalculationGuideContentBn } from "./discount-calculation/content.bn";
import { discountCalculationGuide } from "./discount-calculation/meta";
import { ProfitLossCalculationGuideContent } from "./profit-loss-calculation/content";
import { ProfitLossCalculationGuideContentBn } from "./profit-loss-calculation/content.bn";
import { profitLossCalculationGuide } from "./profit-loss-calculation/meta";
import { SalaryGrossToNetGuideContent } from "./salary-gross-to-net/content";
import { SalaryGrossToNetGuideContentBn } from "./salary-gross-to-net/content.bn";
import { salaryGrossToNetGuide } from "./salary-gross-to-net/meta";
import { DaysBetweenDatesGuideContent } from "./days-between-dates/content";
import { DaysBetweenDatesGuideContentBn } from "./days-between-dates/content.bn";
import { daysBetweenDatesGuide } from "./days-between-dates/meta";
import { ChequeAmountInWordsGuideContent } from "./cheque-amount-in-words/content";
import { ChequeAmountInWordsGuideContentBn } from "./cheque-amount-in-words/content.bn";
import { chequeAmountInWordsGuide } from "./cheque-amount-in-words/meta";
import { GoldBhoriGramGuideContent } from "./gold-bhori-gram/content";
import { GoldBhoriGramGuideContentBn } from "./gold-bhori-gram/content.bn";
import { goldBhoriGramGuide } from "./gold-bhori-gram/meta";
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
import { BoardChallengeGpaGuideContent } from "./board-challenge-gpa/content";
import { BoardChallengeGpaGuideContentBn } from "./board-challenge-gpa/content.bn";
import { boardChallengeGpaGuide } from "./board-challenge-gpa/meta";
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
  { meta: discountCalculationGuide, Content: DiscountCalculationGuideContent, ContentBn: DiscountCalculationGuideContentBn },
  { meta: profitLossCalculationGuide, Content: ProfitLossCalculationGuideContent, ContentBn: ProfitLossCalculationGuideContentBn },
  { meta: salaryGrossToNetGuide, Content: SalaryGrossToNetGuideContent, ContentBn: SalaryGrossToNetGuideContentBn },
  { meta: daysBetweenDatesGuide, Content: DaysBetweenDatesGuideContent, ContentBn: DaysBetweenDatesGuideContentBn },
  { meta: chequeAmountInWordsGuide, Content: ChequeAmountInWordsGuideContent, ContentBn: ChequeAmountInWordsGuideContentBn },
  { meta: goldBhoriGramGuide, Content: GoldBhoriGramGuideContent, ContentBn: GoldBhoriGramGuideContentBn },
  { meta: boardChallengeGpaGuide, Content: BoardChallengeGpaGuideContent, ContentBn: BoardChallengeGpaGuideContentBn },
];

export const guidePages: Record<string, GuidePageEntry> = Object.fromEntries(
  entries.map((entry) => [entry.meta.slug, entry]),
);

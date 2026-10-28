import type { ComponentType } from "react";
import { AgeCalculator } from "./age/age-calculator";
import { AgeCalculatorContent } from "./age/content";
import { AgeCalculatorContentBn } from "./age/content.bn";
import { ageCalculator } from "./age/meta";
import { AmountInWordsCalculator } from "./amount-in-words/amount-in-words-calculator";
import { AmountInWordsContent } from "./amount-in-words/content";
import { AmountInWordsContentBn } from "./amount-in-words/content.bn";
import { amountInWordsCalculator } from "./amount-in-words/meta";
import { BanglaDateCalculator } from "./bangla-date/bangla-date-calculator";
import { BanglaDateCalculatorContent } from "./bangla-date/content";
import { BanglaDateCalculatorContentBn } from "./bangla-date/content.bn";
import { banglaDateCalculator } from "./bangla-date/meta";
import { BmiCalculator } from "./bmi/bmi-calculator";
import { BmiCalculatorContent } from "./bmi/content";
import { BmiCalculatorContentBn } from "./bmi/content.bn";
import { bmiCalculator } from "./bmi/meta";
import { CgpaCalculator } from "./cgpa/cgpa-calculator";
import { CgpaCalculatorContent } from "./cgpa/content";
import { CgpaCalculatorContentBn } from "./cgpa/content.bn";
import { cgpaCalculator } from "./cgpa/meta";
import { DateDifferenceCalculator } from "./date-difference/date-difference-calculator";
import { DateDifferenceContent } from "./date-difference/content";
import { DateDifferenceContentBn } from "./date-difference/content.bn";
import { dateDifferenceCalculator } from "./date-difference/meta";
import { DiscountCalculator } from "./discount/discount-calculator";
import { DiscountCalculatorContent } from "./discount/content";
import { DiscountCalculatorContentBn } from "./discount/content.bn";
import { discountCalculator } from "./discount/meta";
import { EmiCalculator } from "./emi/emi-calculator";
import { EmiCalculatorContent } from "./emi/content";
import { EmiCalculatorContentBn } from "./emi/content.bn";
import { emiCalculator } from "./emi/meta";
import { GpaCalculator } from "./gpa/gpa-calculator";
import { GpaCalculatorContent } from "./gpa/content";
import { GpaCalculatorContentBn } from "./gpa/content.bn";
import { gpaCalculator } from "./gpa/meta";
import { JobAgeCalculator } from "./job-age/job-age-calculator";
import { JobAgeCalculatorContent } from "./job-age/content";
import { JobAgeCalculatorContentBn } from "./job-age/content.bn";
import { jobAgeCalculator } from "./job-age/meta";
import { LandCalculator } from "./land/land-calculator";
import { LandCalculatorContent } from "./land/content";
import { LandCalculatorContentBn } from "./land/content.bn";
import { landCalculator } from "./land/meta";
import { PercentageCalculator } from "./percentage/percentage-calculator";
import { PercentageCalculatorContent } from "./percentage/content";
import { PercentageCalculatorContentBn } from "./percentage/content.bn";
import { percentageCalculator } from "./percentage/meta";
import { ProfitLossCalculator } from "./profit-loss/profit-loss-calculator";
import { ProfitLossCalculatorContent } from "./profit-loss/content";
import { ProfitLossCalculatorContentBn } from "./profit-loss/content.bn";
import { profitLossCalculator } from "./profit-loss/meta";
import { SalaryCalculator } from "./salary/salary-calculator";
import { SalaryCalculatorContent } from "./salary/content";
import { SalaryCalculatorContentBn } from "./salary/content.bn";
import { salaryCalculator } from "./salary/meta";
import { SscHscGpaCalculator } from "./ssc-hsc-gpa/ssc-hsc-gpa-calculator";
import { SscHscGpaCalculatorContent } from "./ssc-hsc-gpa/content";
import { SscHscGpaCalculatorContentBn } from "./ssc-hsc-gpa/content.bn";
import { sscHscGpaCalculator } from "./ssc-hsc-gpa/meta";
import { VatCalculator } from "./vat/vat-calculator";
import { VatCalculatorContent } from "./vat/content";
import { VatCalculatorContentBn } from "./vat/content.bn";
import { vatCalculator } from "./vat/meta";
import type { CalculatorMeta } from "./types";

export interface CalculatorPageEntry {
  meta: CalculatorMeta;
  /** The interactive widget (Client Component, localized via useLocale). */
  Calculator: ComponentType;
  /** English explanatory content (Server Component). */
  Content: ComponentType;
  /** Bangla explanatory content; falls back to English until translated. */
  ContentBn: ComponentType;
}

/**
 * slug → page pieces, used by the /bn/calculators/[slug] route (the English
 * routes are individual files under src/app/(en)/calculators). Keep in sync
 * with `calculators` in registry.ts; the registry test checks both.
 */
export const calculatorPages: Record<string, CalculatorPageEntry> = Object.fromEntries(
  (
    [
      { meta: ageCalculator, Calculator: AgeCalculator, Content: AgeCalculatorContent, ContentBn: AgeCalculatorContentBn },
      { meta: bmiCalculator, Calculator: BmiCalculator, Content: BmiCalculatorContent, ContentBn: BmiCalculatorContentBn },
      { meta: gpaCalculator, Calculator: GpaCalculator, Content: GpaCalculatorContent, ContentBn: GpaCalculatorContentBn },
      { meta: cgpaCalculator, Calculator: CgpaCalculator, Content: CgpaCalculatorContent, ContentBn: CgpaCalculatorContentBn },
      { meta: percentageCalculator, Calculator: PercentageCalculator, Content: PercentageCalculatorContent, ContentBn: PercentageCalculatorContentBn },
      { meta: discountCalculator, Calculator: DiscountCalculator, Content: DiscountCalculatorContent, ContentBn: DiscountCalculatorContentBn },
      { meta: profitLossCalculator, Calculator: ProfitLossCalculator, Content: ProfitLossCalculatorContent, ContentBn: ProfitLossCalculatorContentBn },
      { meta: emiCalculator, Calculator: EmiCalculator, Content: EmiCalculatorContent, ContentBn: EmiCalculatorContentBn },
      { meta: salaryCalculator, Calculator: SalaryCalculator, Content: SalaryCalculatorContent, ContentBn: SalaryCalculatorContentBn },
      { meta: dateDifferenceCalculator, Calculator: DateDifferenceCalculator, Content: DateDifferenceContent, ContentBn: DateDifferenceContentBn },
      { meta: jobAgeCalculator, Calculator: JobAgeCalculator, Content: JobAgeCalculatorContent, ContentBn: JobAgeCalculatorContentBn },
      { meta: sscHscGpaCalculator, Calculator: SscHscGpaCalculator, Content: SscHscGpaCalculatorContent, ContentBn: SscHscGpaCalculatorContentBn },
      { meta: landCalculator, Calculator: LandCalculator, Content: LandCalculatorContent, ContentBn: LandCalculatorContentBn },
      { meta: amountInWordsCalculator, Calculator: AmountInWordsCalculator, Content: AmountInWordsContent, ContentBn: AmountInWordsContentBn },
      { meta: vatCalculator, Calculator: VatCalculator, Content: VatCalculatorContent, ContentBn: VatCalculatorContentBn },
      { meta: banglaDateCalculator, Calculator: BanglaDateCalculator, Content: BanglaDateCalculatorContent, ContentBn: BanglaDateCalculatorContentBn },
    ] satisfies CalculatorPageEntry[]
  ).map((entry) => [entry.meta.slug, entry]),
);

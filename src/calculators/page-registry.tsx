import type { ComponentType } from "react";
import { AgeCalculator } from "./age/age-calculator";
import { AgeCalculatorContent } from "./age/content";
import { AgeCalculatorContentBn } from "./age/content.bn";
import { ageCalculator } from "./age/meta";
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
    ] satisfies CalculatorPageEntry[]
  ).map((entry) => [entry.meta.slug, entry]),
);

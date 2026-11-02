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
import { DpsCalculator } from "./dps/dps-calculator";
import { DpsCalculatorContent } from "./dps/content";
import { DpsCalculatorContentBn } from "./dps/content.bn";
import { dpsCalculator } from "./dps/meta";
import { ElectricityCalculator } from "./electricity/electricity-calculator";
import { ElectricityCalculatorContent } from "./electricity/content";
import { ElectricityCalculatorContentBn } from "./electricity/content.bn";
import { electricityCalculator } from "./electricity/meta";
import { PregnancyCalculator } from "./pregnancy/pregnancy-calculator";
import { PregnancyCalculatorContent } from "./pregnancy/content";
import { PregnancyCalculatorContentBn } from "./pregnancy/content.bn";
import { pregnancyCalculator } from "./pregnancy/meta";
import { EmiCalculator } from "./emi/emi-calculator";
import { EmiCalculatorContent } from "./emi/content";
import { EmiCalculatorContentBn } from "./emi/content.bn";
import { emiCalculator } from "./emi/meta";
import { FdrCalculator } from "./fdr/fdr-calculator";
import { FdrCalculatorContent } from "./fdr/content";
import { FdrCalculatorContentBn } from "./fdr/content.bn";
import { fdrCalculator } from "./fdr/meta";
import { GoldCalculator } from "./gold/gold-calculator";
import { GoldCalculatorContent } from "./gold/content";
import { GoldCalculatorContentBn } from "./gold/content.bn";
import { goldCalculator } from "./gold/meta";
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
import { MfsChargeCalculator } from "./mfs-charge/mfs-charge-calculator";
import { MfsChargeCalculatorContent } from "./mfs-charge/content";
import { MfsChargeCalculatorContentBn } from "./mfs-charge/content.bn";
import { mfsChargeCalculator } from "./mfs-charge/meta";
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
import { SanchayapatraCalculator } from "./sanchayapatra/sanchayapatra-calculator";
import { SanchayapatraCalculatorContent } from "./sanchayapatra/content";
import { SanchayapatraCalculatorContentBn } from "./sanchayapatra/content.bn";
import { sanchayapatraCalculator } from "./sanchayapatra/meta";
import { SscHscGpaCalculator } from "./ssc-hsc-gpa/ssc-hsc-gpa-calculator";
import { SscHscGpaCalculatorContent } from "./ssc-hsc-gpa/content";
import { SscHscGpaCalculatorContentBn } from "./ssc-hsc-gpa/content.bn";
import { sscHscGpaCalculator } from "./ssc-hsc-gpa/meta";
import { VatCalculator } from "./vat/vat-calculator";
import { VatCalculatorContent } from "./vat/content";
import { VatCalculatorContentBn } from "./vat/content.bn";
import { vatCalculator } from "./vat/meta";
import { ZakatCalculator } from "./zakat/zakat-calculator";
import { ZakatCalculatorContent } from "./zakat/content";
import { ZakatCalculatorContentBn } from "./zakat/content.bn";
import { zakatCalculator } from "./zakat/meta";
import { InterestCalculator } from "./interest/interest-calculator";
import { InterestCalculatorContent } from "./interest/content";
import { InterestCalculatorContentBn } from "./interest/content.bn";
import { interestCalculator } from "./interest/meta";
import { OvertimeCalculator } from "./overtime/overtime-calculator";
import { OvertimeCalculatorContent } from "./overtime/content";
import { OvertimeCalculatorContentBn } from "./overtime/content.bn";
import { overtimeCalculator } from "./overtime/meta";
import { LeaveCalculator } from "./leave/leave-calculator";
import { LeaveCalculatorContent } from "./leave/content";
import { LeaveCalculatorContentBn } from "./leave/content.bn";
import { leaveCalculator } from "./leave/meta";
import { SettlementCalculator } from "./settlement/settlement-calculator";
import { SettlementCalculatorContent } from "./settlement/content";
import { SettlementCalculatorContentBn } from "./settlement/content.bn";
import { settlementCalculator } from "./settlement/meta";
import { WeightCalculator } from "./weight/weight-calculator";
import { WeightCalculatorContent } from "./weight/content";
import { WeightCalculatorContentBn } from "./weight/content.bn";
import { weightConverter } from "./weight/meta";
import { HeightCalculator } from "./height/height-calculator";
import { HeightCalculatorContent } from "./height/content";
import { HeightCalculatorContentBn } from "./height/content.bn";
import { heightConverter } from "./height/meta";
import { TemperatureCalculator } from "./temperature/temperature-calculator";
import { TemperatureCalculatorContent } from "./temperature/content";
import { TemperatureCalculatorContentBn } from "./temperature/content.bn";
import { temperatureConverter } from "./temperature/meta";
import { CalorieCalculator } from "./calorie/calorie-calculator";
import { CalorieCalculatorContent } from "./calorie/content";
import { CalorieCalculatorContentBn } from "./calorie/content.bn";
import { calorieCalculator } from "./calorie/meta";
import { RodCalculator } from "./rod/rod-calculator";
import { RodCalculatorContent } from "./rod/content";
import { RodCalculatorContentBn } from "./rod/content.bn";
import { rodWeightCalculator } from "./rod/meta";
import { MessCalculator } from "./mess/mess-calculator";
import { MessCalculatorContent } from "./mess/content";
import { MessCalculatorContentBn } from "./mess/content.bn";
import { messMealCalculator } from "./mess/meta";
import { CashCalculator } from "./cash/cash-calculator";
import { CashCalculatorContent } from "./cash/content";
import { CashCalculatorContentBn } from "./cash/content.bn";
import { cashCounter } from "./cash/meta";
import { OvulationCalculator } from "./ovulation/ovulation-calculator";
import { OvulationCalculatorContent } from "./ovulation/content";
import { OvulationCalculatorContentBn } from "./ovulation/content.bn";
import { ovulationCalculator } from "./ovulation/meta";
import { SplitCalculator } from "./split/split-calculator";
import { SplitCalculatorContent } from "./split/content";
import { SplitCalculatorContentBn } from "./split/content.bn";
import { expenseSplitCalculator } from "./split/meta";
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
      { meta: sanchayapatraCalculator, Calculator: SanchayapatraCalculator, Content: SanchayapatraCalculatorContent, ContentBn: SanchayapatraCalculatorContentBn },
      { meta: mfsChargeCalculator, Calculator: MfsChargeCalculator, Content: MfsChargeCalculatorContent, ContentBn: MfsChargeCalculatorContentBn },
      { meta: fdrCalculator, Calculator: FdrCalculator, Content: FdrCalculatorContent, ContentBn: FdrCalculatorContentBn },
      { meta: dpsCalculator, Calculator: DpsCalculator, Content: DpsCalculatorContent, ContentBn: DpsCalculatorContentBn },
      { meta: zakatCalculator, Calculator: ZakatCalculator, Content: ZakatCalculatorContent, ContentBn: ZakatCalculatorContentBn },
      { meta: goldCalculator, Calculator: GoldCalculator, Content: GoldCalculatorContent, ContentBn: GoldCalculatorContentBn },
      { meta: electricityCalculator, Calculator: ElectricityCalculator, Content: ElectricityCalculatorContent, ContentBn: ElectricityCalculatorContentBn },
      { meta: pregnancyCalculator, Calculator: PregnancyCalculator, Content: PregnancyCalculatorContent, ContentBn: PregnancyCalculatorContentBn },
      { meta: interestCalculator, Calculator: InterestCalculator, Content: InterestCalculatorContent, ContentBn: InterestCalculatorContentBn },
      { meta: overtimeCalculator, Calculator: OvertimeCalculator, Content: OvertimeCalculatorContent, ContentBn: OvertimeCalculatorContentBn },
      { meta: leaveCalculator, Calculator: LeaveCalculator, Content: LeaveCalculatorContent, ContentBn: LeaveCalculatorContentBn },
      { meta: settlementCalculator, Calculator: SettlementCalculator, Content: SettlementCalculatorContent, ContentBn: SettlementCalculatorContentBn },
      { meta: weightConverter, Calculator: WeightCalculator, Content: WeightCalculatorContent, ContentBn: WeightCalculatorContentBn },
      { meta: heightConverter, Calculator: HeightCalculator, Content: HeightCalculatorContent, ContentBn: HeightCalculatorContentBn },
      { meta: temperatureConverter, Calculator: TemperatureCalculator, Content: TemperatureCalculatorContent, ContentBn: TemperatureCalculatorContentBn },
      { meta: calorieCalculator, Calculator: CalorieCalculator, Content: CalorieCalculatorContent, ContentBn: CalorieCalculatorContentBn },
      { meta: rodWeightCalculator, Calculator: RodCalculator, Content: RodCalculatorContent, ContentBn: RodCalculatorContentBn },
      { meta: messMealCalculator, Calculator: MessCalculator, Content: MessCalculatorContent, ContentBn: MessCalculatorContentBn },
      { meta: cashCounter, Calculator: CashCalculator, Content: CashCalculatorContent, ContentBn: CashCalculatorContentBn },
      { meta: ovulationCalculator, Calculator: OvulationCalculator, Content: OvulationCalculatorContent, ContentBn: OvulationCalculatorContentBn },
      { meta: expenseSplitCalculator, Calculator: SplitCalculator, Content: SplitCalculatorContent, ContentBn: SplitCalculatorContentBn },
    ] satisfies CalculatorPageEntry[]
  ).map((entry) => [entry.meta.slug, entry]),
);

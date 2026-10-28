import { DateDifferenceCalculator } from "@/calculators/date-difference/date-difference-calculator";
import { DateDifferenceContent } from "@/calculators/date-difference/content";
import { dateDifferenceCalculator } from "@/calculators/date-difference/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(dateDifferenceCalculator);

export default function DateDifferenceCalculatorPage() {
  return (
    <CalculatorPage calculator={dateDifferenceCalculator} content={<DateDifferenceContent />}>
      <DateDifferenceCalculator />
    </CalculatorPage>
  );
}

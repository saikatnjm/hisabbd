import { PercentageCalculatorContent } from "@/calculators/percentage/content";
import { percentageCalculator } from "@/calculators/percentage/meta";
import { PercentageCalculator } from "@/calculators/percentage/percentage-calculator";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(percentageCalculator);

export default function PercentageCalculatorPage() {
  return (
    <CalculatorPage calculator={percentageCalculator} content={<PercentageCalculatorContent />}>
      <PercentageCalculator />
    </CalculatorPage>
  );
}

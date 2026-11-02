import { SplitCalculator } from "@/calculators/split/split-calculator";
import { SplitCalculatorContent } from "@/calculators/split/content";
import { expenseSplitCalculator } from "@/calculators/split/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(expenseSplitCalculator);

export default function SplitCalculatorPage() {
  return (
    <CalculatorPage calculator={expenseSplitCalculator} content={<SplitCalculatorContent />}>
      <SplitCalculator />
    </CalculatorPage>
  );
}

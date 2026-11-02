import { MessCalculator } from "@/calculators/mess/mess-calculator";
import { MessCalculatorContent } from "@/calculators/mess/content";
import { messMealCalculator } from "@/calculators/mess/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(messMealCalculator);

export default function MessCalculatorPage() {
  return (
    <CalculatorPage calculator={messMealCalculator} content={<MessCalculatorContent />}>
      <MessCalculator />
    </CalculatorPage>
  );
}

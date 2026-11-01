import { RodCalculator } from "@/calculators/rod/rod-calculator";
import { RodCalculatorContent } from "@/calculators/rod/content";
import { rodWeightCalculator } from "@/calculators/rod/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(rodWeightCalculator);

export default function RodCalculatorPage() {
  return (
    <CalculatorPage calculator={rodWeightCalculator} content={<RodCalculatorContent />}>
      <RodCalculator />
    </CalculatorPage>
  );
}

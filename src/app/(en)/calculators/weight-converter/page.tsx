import { WeightCalculator } from "@/calculators/weight/weight-calculator";
import { WeightCalculatorContent } from "@/calculators/weight/content";
import { weightConverter } from "@/calculators/weight/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(weightConverter);

export default function WeightCalculatorPage() {
  return (
    <CalculatorPage calculator={weightConverter} content={<WeightCalculatorContent />}>
      <WeightCalculator />
    </CalculatorPage>
  );
}

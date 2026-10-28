import { DpsCalculatorContent } from "@/calculators/dps/content";
import { DpsCalculator } from "@/calculators/dps/dps-calculator";
import { dpsCalculator } from "@/calculators/dps/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(dpsCalculator);

export default function DpsCalculatorPage() {
  return (
    <CalculatorPage calculator={dpsCalculator} content={<DpsCalculatorContent />}>
      <DpsCalculator />
    </CalculatorPage>
  );
}

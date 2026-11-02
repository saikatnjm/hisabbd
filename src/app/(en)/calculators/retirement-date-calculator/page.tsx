import { RetirementCalculator } from "@/calculators/retirement/retirement-calculator";
import { RetirementCalculatorContent } from "@/calculators/retirement/content";
import { retirementCalculator } from "@/calculators/retirement/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(retirementCalculator);

export default function RetirementCalculatorPage() {
  return (
    <CalculatorPage calculator={retirementCalculator} content={<RetirementCalculatorContent />}>
      <RetirementCalculator />
    </CalculatorPage>
  );
}

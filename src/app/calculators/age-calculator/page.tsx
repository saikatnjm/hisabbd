import { AgeCalculator } from "@/calculators/age/age-calculator";
import { AgeCalculatorContent } from "@/calculators/age/content";
import { ageCalculator } from "@/calculators/age/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(ageCalculator);

export default function AgeCalculatorPage() {
  return (
    <CalculatorPage calculator={ageCalculator} content={<AgeCalculatorContent />}>
      <AgeCalculator />
    </CalculatorPage>
  );
}

import { LandCalculatorContent } from "@/calculators/land/content";
import { LandCalculator } from "@/calculators/land/land-calculator";
import { landCalculator } from "@/calculators/land/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(landCalculator);

export default function LandCalculatorPage() {
  return (
    <CalculatorPage calculator={landCalculator} content={<LandCalculatorContent />}>
      <LandCalculator />
    </CalculatorPage>
  );
}

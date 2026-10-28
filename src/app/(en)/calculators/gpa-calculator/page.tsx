import { GpaCalculator } from "@/calculators/gpa/gpa-calculator";
import { GpaCalculatorContent } from "@/calculators/gpa/content";
import { gpaCalculator } from "@/calculators/gpa/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(gpaCalculator);

export default function GpaCalculatorPage() {
  return (
    <CalculatorPage calculator={gpaCalculator} content={<GpaCalculatorContent />}>
      <GpaCalculator />
    </CalculatorPage>
  );
}

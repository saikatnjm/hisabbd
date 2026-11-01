import { InterestCalculator } from "@/calculators/interest/interest-calculator";
import { InterestCalculatorContent } from "@/calculators/interest/content";
import { interestCalculator } from "@/calculators/interest/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(interestCalculator);

export default function InterestCalculatorPage() {
  return (
    <CalculatorPage calculator={interestCalculator} content={<InterestCalculatorContent />}>
      <InterestCalculator />
    </CalculatorPage>
  );
}

import { TimeAddCalculator } from "@/calculators/time-add/time-add-calculator";
import { TimeAddCalculatorContent } from "@/calculators/time-add/content";
import { timeAddCalculator } from "@/calculators/time-add/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(timeAddCalculator);

export default function TimeAddCalculatorPage() {
  return (
    <CalculatorPage calculator={timeAddCalculator} content={<TimeAddCalculatorContent />}>
      <TimeAddCalculator />
    </CalculatorPage>
  );
}

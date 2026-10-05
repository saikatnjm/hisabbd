import { BmiCalculator } from "@/calculators/bmi/bmi-calculator";
import { BmiCalculatorContent } from "@/calculators/bmi/content";
import { bmiCalculator } from "@/calculators/bmi/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(bmiCalculator);

export default function BmiCalculatorPage() {
  return (
    <CalculatorPage calculator={bmiCalculator} content={<BmiCalculatorContent />}>
      <BmiCalculator />
    </CalculatorPage>
  );
}

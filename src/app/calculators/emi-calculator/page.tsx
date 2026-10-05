import { EmiCalculator } from "@/calculators/emi/emi-calculator";
import { EmiCalculatorContent } from "@/calculators/emi/content";
import { emiCalculator } from "@/calculators/emi/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(emiCalculator);

export default function EmiCalculatorPage() {
  return (
    <CalculatorPage calculator={emiCalculator} content={<EmiCalculatorContent />}>
      <EmiCalculator />
    </CalculatorPage>
  );
}

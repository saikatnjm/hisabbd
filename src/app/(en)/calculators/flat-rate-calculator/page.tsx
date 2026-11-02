import { FlatRateCalculator } from "@/calculators/flat-rate/flat-rate-calculator";
import { FlatRateCalculatorContent } from "@/calculators/flat-rate/content";
import { flatRateCalculator } from "@/calculators/flat-rate/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(flatRateCalculator);

export default function FlatRateCalculatorPage() {
  return (
    <CalculatorPage calculator={flatRateCalculator} content={<FlatRateCalculatorContent />}>
      <FlatRateCalculator />
    </CalculatorPage>
  );
}

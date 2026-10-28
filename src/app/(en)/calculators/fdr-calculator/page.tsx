import { FdrCalculatorContent } from "@/calculators/fdr/content";
import { FdrCalculator } from "@/calculators/fdr/fdr-calculator";
import { fdrCalculator } from "@/calculators/fdr/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(fdrCalculator);

export default function FdrCalculatorPage() {
  return (
    <CalculatorPage calculator={fdrCalculator} content={<FdrCalculatorContent />}>
      <FdrCalculator />
    </CalculatorPage>
  );
}

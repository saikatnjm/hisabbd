import { VatCalculator } from "@/calculators/vat/vat-calculator";
import { VatCalculatorContent } from "@/calculators/vat/content";
import { vatCalculator } from "@/calculators/vat/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(vatCalculator);

export default function VatCalculatorPage() {
  return (
    <CalculatorPage calculator={vatCalculator} content={<VatCalculatorContent />}>
      <VatCalculator />
    </CalculatorPage>
  );
}

import { ZakatCalculator } from "@/calculators/zakat/zakat-calculator";
import { ZakatCalculatorContent } from "@/calculators/zakat/content";
import { zakatCalculator } from "@/calculators/zakat/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(zakatCalculator);

export default function ZakatCalculatorPage() {
  return (
    <CalculatorPage calculator={zakatCalculator} content={<ZakatCalculatorContent />}>
      <ZakatCalculator />
    </CalculatorPage>
  );
}

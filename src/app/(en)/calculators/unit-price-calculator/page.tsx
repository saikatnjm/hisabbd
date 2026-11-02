import { UnitPriceCalculator } from "@/calculators/unit-price/unit-price-calculator";
import { UnitPriceCalculatorContent } from "@/calculators/unit-price/content";
import { unitPriceCalculator } from "@/calculators/unit-price/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(unitPriceCalculator);

export default function UnitPriceCalculatorPage() {
  return (
    <CalculatorPage calculator={unitPriceCalculator} content={<UnitPriceCalculatorContent />}>
      <UnitPriceCalculator />
    </CalculatorPage>
  );
}

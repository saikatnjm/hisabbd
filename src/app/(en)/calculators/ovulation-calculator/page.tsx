import { OvulationCalculator } from "@/calculators/ovulation/ovulation-calculator";
import { OvulationCalculatorContent } from "@/calculators/ovulation/content";
import { ovulationCalculator } from "@/calculators/ovulation/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(ovulationCalculator);

export default function OvulationCalculatorPage() {
  return (
    <CalculatorPage calculator={ovulationCalculator} content={<OvulationCalculatorContent />}>
      <OvulationCalculator />
    </CalculatorPage>
  );
}

import { OvertimeCalculator } from "@/calculators/overtime/overtime-calculator";
import { OvertimeCalculatorContent } from "@/calculators/overtime/content";
import { overtimeCalculator } from "@/calculators/overtime/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(overtimeCalculator);

export default function OvertimeCalculatorPage() {
  return (
    <CalculatorPage calculator={overtimeCalculator} content={<OvertimeCalculatorContent />}>
      <OvertimeCalculator />
    </CalculatorPage>
  );
}

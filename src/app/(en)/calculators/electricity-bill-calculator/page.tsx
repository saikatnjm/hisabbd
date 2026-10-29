import { ElectricityCalculator } from "@/calculators/electricity/electricity-calculator";
import { ElectricityCalculatorContent } from "@/calculators/electricity/content";
import { electricityCalculator } from "@/calculators/electricity/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(electricityCalculator);

export default function ElectricityBillCalculatorPage() {
  return (
    <CalculatorPage calculator={electricityCalculator} content={<ElectricityCalculatorContent />}>
      <ElectricityCalculator />
    </CalculatorPage>
  );
}

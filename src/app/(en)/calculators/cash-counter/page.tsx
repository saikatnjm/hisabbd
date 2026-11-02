import { CashCalculator } from "@/calculators/cash/cash-calculator";
import { CashCalculatorContent } from "@/calculators/cash/content";
import { cashCounter } from "@/calculators/cash/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(cashCounter);

export default function CashCounterPage() {
  return (
    <CalculatorPage calculator={cashCounter} content={<CashCalculatorContent />}>
      <CashCalculator />
    </CalculatorPage>
  );
}

import { ProfitLossCalculatorContent } from "@/calculators/profit-loss/content";
import { profitLossCalculator } from "@/calculators/profit-loss/meta";
import { ProfitLossCalculator } from "@/calculators/profit-loss/profit-loss-calculator";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(profitLossCalculator);

export default function ProfitLossCalculatorPage() {
  return (
    <CalculatorPage calculator={profitLossCalculator} content={<ProfitLossCalculatorContent />}>
      <ProfitLossCalculator />
    </CalculatorPage>
  );
}

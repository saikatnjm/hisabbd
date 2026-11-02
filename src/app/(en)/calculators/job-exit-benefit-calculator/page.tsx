import { SettlementCalculator } from "@/calculators/settlement/settlement-calculator";
import { SettlementCalculatorContent } from "@/calculators/settlement/content";
import { settlementCalculator } from "@/calculators/settlement/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(settlementCalculator);

export default function JobExitBenefitCalculatorPage() {
  return (
    <CalculatorPage calculator={settlementCalculator} content={<SettlementCalculatorContent />}>
      <SettlementCalculator />
    </CalculatorPage>
  );
}

import { GoldCalculator } from "@/calculators/gold/gold-calculator";
import { GoldCalculatorContent } from "@/calculators/gold/content";
import { goldCalculator } from "@/calculators/gold/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(goldCalculator);

export default function GoldCalculatorPage() {
  return (
    <CalculatorPage calculator={goldCalculator} content={<GoldCalculatorContent />}>
      <GoldCalculator />
    </CalculatorPage>
  );
}

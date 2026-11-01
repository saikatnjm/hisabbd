import { PregnancyCalculator } from "@/calculators/pregnancy/pregnancy-calculator";
import { PregnancyCalculatorContent } from "@/calculators/pregnancy/content";
import { pregnancyCalculator } from "@/calculators/pregnancy/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(pregnancyCalculator);

export default function PregnancyCalculatorPage() {
  return (
    <CalculatorPage calculator={pregnancyCalculator} content={<PregnancyCalculatorContent />}>
      <PregnancyCalculator />
    </CalculatorPage>
  );
}

import { BanglaDateCalculator } from "@/calculators/bangla-date/bangla-date-calculator";
import { BanglaDateCalculatorContent } from "@/calculators/bangla-date/content";
import { banglaDateCalculator } from "@/calculators/bangla-date/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(banglaDateCalculator);

export default function BanglaDateConverterPage() {
  return (
    <CalculatorPage calculator={banglaDateCalculator} content={<BanglaDateCalculatorContent />}>
      <BanglaDateCalculator />
    </CalculatorPage>
  );
}

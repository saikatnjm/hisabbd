import { SanchayapatraCalculator } from "@/calculators/sanchayapatra/sanchayapatra-calculator";
import { SanchayapatraCalculatorContent } from "@/calculators/sanchayapatra/content";
import { sanchayapatraCalculator } from "@/calculators/sanchayapatra/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(sanchayapatraCalculator);

export default function SanchayapatraCalculatorPage() {
  return (
    <CalculatorPage calculator={sanchayapatraCalculator} content={<SanchayapatraCalculatorContent />}>
      <SanchayapatraCalculator />
    </CalculatorPage>
  );
}

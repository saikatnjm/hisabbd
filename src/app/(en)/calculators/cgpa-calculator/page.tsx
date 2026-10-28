import { CgpaCalculator } from "@/calculators/cgpa/cgpa-calculator";
import { CgpaCalculatorContent } from "@/calculators/cgpa/content";
import { cgpaCalculator } from "@/calculators/cgpa/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(cgpaCalculator);

export default function CgpaCalculatorPage() {
  return (
    <CalculatorPage calculator={cgpaCalculator} content={<CgpaCalculatorContent />}>
      <CgpaCalculator />
    </CalculatorPage>
  );
}

import { SscHscGpaCalculator } from "@/calculators/ssc-hsc-gpa/ssc-hsc-gpa-calculator";
import { SscHscGpaCalculatorContent } from "@/calculators/ssc-hsc-gpa/content";
import { sscHscGpaCalculator } from "@/calculators/ssc-hsc-gpa/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(sscHscGpaCalculator);

export default function SscHscGpaCalculatorPage() {
  return (
    <CalculatorPage calculator={sscHscGpaCalculator} content={<SscHscGpaCalculatorContent />}>
      <SscHscGpaCalculator />
    </CalculatorPage>
  );
}

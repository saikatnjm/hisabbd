import { SalaryCalculatorContent } from "@/calculators/salary/content";
import { salaryCalculator } from "@/calculators/salary/meta";
import { SalaryCalculator } from "@/calculators/salary/salary-calculator";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(salaryCalculator);

export default function SalaryCalculatorPage() {
  return (
    <CalculatorPage calculator={salaryCalculator} content={<SalaryCalculatorContent />}>
      <SalaryCalculator />
    </CalculatorPage>
  );
}

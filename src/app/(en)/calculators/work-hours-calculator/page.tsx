import { WorkHoursCalculator } from "@/calculators/work-hours/work-hours-calculator";
import { WorkHoursCalculatorContent } from "@/calculators/work-hours/content";
import { workHoursCalculator } from "@/calculators/work-hours/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(workHoursCalculator);

export default function WorkHoursCalculatorPage() {
  return (
    <CalculatorPage calculator={workHoursCalculator} content={<WorkHoursCalculatorContent />}>
      <WorkHoursCalculator />
    </CalculatorPage>
  );
}

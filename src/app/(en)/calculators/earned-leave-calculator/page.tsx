import { LeaveCalculator } from "@/calculators/leave/leave-calculator";
import { LeaveCalculatorContent } from "@/calculators/leave/content";
import { leaveCalculator } from "@/calculators/leave/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(leaveCalculator);

export default function EarnedLeaveCalculatorPage() {
  return (
    <CalculatorPage calculator={leaveCalculator} content={<LeaveCalculatorContent />}>
      <LeaveCalculator />
    </CalculatorPage>
  );
}

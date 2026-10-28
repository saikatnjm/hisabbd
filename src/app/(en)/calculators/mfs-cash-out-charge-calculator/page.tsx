import { MfsChargeCalculator } from "@/calculators/mfs-charge/mfs-charge-calculator";
import { MfsChargeCalculatorContent } from "@/calculators/mfs-charge/content";
import { mfsChargeCalculator } from "@/calculators/mfs-charge/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(mfsChargeCalculator);

export default function MfsChargeCalculatorPage() {
  return (
    <CalculatorPage calculator={mfsChargeCalculator} content={<MfsChargeCalculatorContent />}>
      <MfsChargeCalculator />
    </CalculatorPage>
  );
}

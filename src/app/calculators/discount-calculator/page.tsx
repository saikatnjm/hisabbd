import { DiscountCalculator } from "@/calculators/discount/discount-calculator";
import { DiscountCalculatorContent } from "@/calculators/discount/content";
import { discountCalculator } from "@/calculators/discount/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(discountCalculator);

export default function DiscountCalculatorPage() {
  return (
    <CalculatorPage calculator={discountCalculator} content={<DiscountCalculatorContent />}>
      <DiscountCalculator />
    </CalculatorPage>
  );
}

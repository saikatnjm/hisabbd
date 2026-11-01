import { HeightCalculator } from "@/calculators/height/height-calculator";
import { HeightCalculatorContent } from "@/calculators/height/content";
import { heightConverter } from "@/calculators/height/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(heightConverter);

export default function HeightCalculatorPage() {
  return (
    <CalculatorPage calculator={heightConverter} content={<HeightCalculatorContent />}>
      <HeightCalculator />
    </CalculatorPage>
  );
}

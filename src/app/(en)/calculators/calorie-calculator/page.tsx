import { CalorieCalculator } from "@/calculators/calorie/calorie-calculator";
import { CalorieCalculatorContent } from "@/calculators/calorie/content";
import { calorieCalculator } from "@/calculators/calorie/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(calorieCalculator);

export default function CalorieCalculatorPage() {
  return (
    <CalculatorPage calculator={calorieCalculator} content={<CalorieCalculatorContent />}>
      <CalorieCalculator />
    </CalculatorPage>
  );
}

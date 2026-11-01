import { TemperatureCalculator } from "@/calculators/temperature/temperature-calculator";
import { TemperatureCalculatorContent } from "@/calculators/temperature/content";
import { temperatureConverter } from "@/calculators/temperature/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(temperatureConverter);

export default function TemperatureCalculatorPage() {
  return (
    <CalculatorPage calculator={temperatureConverter} content={<TemperatureCalculatorContent />}>
      <TemperatureCalculator />
    </CalculatorPage>
  );
}

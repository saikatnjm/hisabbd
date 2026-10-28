import { AmountInWordsCalculator } from "@/calculators/amount-in-words/amount-in-words-calculator";
import { AmountInWordsContent } from "@/calculators/amount-in-words/content";
import { amountInWordsCalculator } from "@/calculators/amount-in-words/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(amountInWordsCalculator);

export default function AmountInWordsPage() {
  return (
    <CalculatorPage calculator={amountInWordsCalculator} content={<AmountInWordsContent />}>
      <AmountInWordsCalculator />
    </CalculatorPage>
  );
}

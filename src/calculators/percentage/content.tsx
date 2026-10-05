import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the Percentage Calculator page (Server Component, no JS). */
export function PercentageCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="Percentage formulas">
        <p>
          “Percent” means “out of 100”. Pick the question you are asking and the calculator uses the
          matching formula:
        </p>
        <ul>
          <li>
            <strong>What is P% of Y?</strong> P ÷ 100 × Y
          </li>
          <li>
            <strong>X is what percent of Y?</strong> X ÷ Y × 100 (Y can’t be 0)
          </li>
          <li>
            <strong>Percentage change from A to B:</strong> (B − A) ÷ A × 100, using the size of A (A
            can’t be 0)
          </li>
          <li>
            <strong>Increase or decrease Y by P%:</strong> Y × (1 + P ÷ 100) to increase, or Y × (1 −
            P ÷ 100) to decrease
          </li>
          <li>
            <strong>X is P% of what number?</strong> X ÷ (P ÷ 100) (P can’t be 0)
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose what you want to find. The sentence under the choices shows the question.</li>
          <li>Fill in the two boxes. Decimals and negative numbers are allowed where they make sense.</li>
          <li>Select Calculate. The answer, a sentence and the working appear below.</li>
        </ol>
        <p>
          When you change what you want to find, the earlier answer is cleared so it can’t be
          mistaken for the new question.
        </p>
      </ContentSection>

      <ContentSection id="examples" title="Worked examples">
        <h3>Percent of a number</h3>
        <p>
          15% of 2,000 = 15 ÷ 100 × 2,000 = <strong>300</strong>.
        </p>

        <h3>What percent</h3>
        <p>
          45 out of 60 = 45 ÷ 60 × 100 = <strong>75%</strong>.
        </p>

        <h3>Percentage change</h3>
        <p>
          From 80 to 100: (100 − 80) ÷ 80 × 100 = <strong>25% increase</strong>. From 100 back to 80:
          (80 − 100) ÷ 100 × 100 = <strong>20% decrease</strong>. The two percentages differ because
          the starting number is different each time.
        </p>

        <h3>Increase or decrease by a percent</h3>
        <p>
          1,000 increased by 10% = 1,000 × 1.10 = <strong>1,100</strong>. Decreasing that 1,100 by 10%
          gives 990, not 1,000, for the same reason.
        </p>

        <h3>Finding the whole</h3>
        <p>
          If 25 is 20% of a number, the number is 25 ÷ 0.20 = <strong>125</strong>.
        </p>
      </ContentSection>
    </>
  );
}

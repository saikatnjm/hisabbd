import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** English guide: the five everyday percentage calculations (Server Component, no JS). */
export function PercentageCalculationGuideContent() {
  const calculator = localePath("en", calculatorPath("percentage-calculator"));

  return (
    <>
      <ContentSection id="basics" title="What a percentage is, and which formula to use">
        <p>
          A percentage (%) means “out of 100”. 15% is 15 out of 100, or 15 ÷ 100 = 0.15. Almost every
          percentage sum comes down to one question: <strong>which number is the base, or “whole”?</strong>{" "}
          Get that right and the rest is simple division and multiplication. Nearly every everyday question
          is one of these 5:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Question</th>
                <th scope="col" className={head}>Formula</th>
                <th scope="col" className={head}>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>What is P% of Y?</td><td className={cell}>P ÷ 100 × Y</td><td className={cell}>15% of 2,000 = 300</td></tr>
              <tr><td className={cell}>X is what percent of Y?</td><td className={cell}>X ÷ Y × 100</td><td className={cell}>45 out of 60 = 75%</td></tr>
              <tr><td className={cell}>By what percent did A change to B?</td><td className={cell}>(B − A) ÷ A × 100</td><td className={cell}>80 to 100 = 25% increase</td></tr>
              <tr><td className={cell}>Y increased or decreased by P%?</td><td className={cell}>Y × (1 ± P ÷ 100)</td><td className={cell}>1,000 + 10% = 1,100</td></tr>
              <tr><td className={cell}>X is P% of what number?</td><td className={cell}>X ÷ (P ÷ 100)</td><td className={cell}>25 is 20% of 125</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Choose the question and enter two numbers, and the{" "}
          <Link href={calculator} className={link}>
            Percentage Calculator
          </Link>{" "}
          does all 5 with the working shown. Below, each one is worked by hand.
        </p>
      </ContentSection>

      <ContentSection id="percent-of" title="1. A percent of a number, and 2. what percent">
        <h3>What is P% of Y</h3>
        <p>
          Divide the percentage by 100 and multiply by the number. 15% of 2,000 = 15 ÷ 100 × 2,000 ={" "}
          <strong>300</strong>. And 12.5% of 240 = 0.125 × 240 = <strong>30</strong>.
        </p>
        <p>
          A quick mental check: 10% means divide by 10. 10% of 2,000 is 200, 5% is half that, 100, so 15% is
          200 + 100 = 300.
        </p>
        <h3>X is what percent of Y</h3>
        <p>
          Divide the part by the whole and multiply by 100. Scoring 45 in a 60-mark exam is 45 ÷ 60 × 100 ={" "}
          <strong>75%</strong>. The whole can’t be 0. If the part is bigger than the whole, the answer is
          over 100%: 50 is 250% of 20.
        </p>
      </ContentSection>

      <ContentSection id="change" title="3. Percentage increase or decrease">
        <p>
          <strong>Percentage change = (new value − starting value) ÷ starting value × 100.</strong> A
          positive answer is an increase, a negative one a decrease.
        </p>
        <ul>
          <li>
            From 80 to 100: (100 − 80) ÷ 80 × 100 = <strong>25% increase</strong>.
          </li>
          <li>
            From 100 to 80: (80 − 100) ÷ 100 × 100 = −20%, that is a <strong>20% decrease</strong>.
          </li>
        </ul>
        <p>
          The difference is 20 both times, but the percentages differ, because you divide by the starting
          value and the starting value is different each time. If the starting value is 0, there is no
          percentage change. If it is negative, the calculator divides by its size, so going from −50 to −25
          is a 50% increase, because the value really did go up.
        </p>
      </ContentSection>

      <ContentSection id="increase-decrease" title="4. Increasing or decreasing a number by a percent">
        <p>
          To increase, multiply by (1 + P ÷ 100); to decrease, multiply by (1 − P ÷ 100). That saves working
          out the percentage separately and then adding or subtracting it.
        </p>
        <ul>
          <li>
            1,000 increased by 10%: 1,000 × 1.10 = <strong>1,100</strong>.
          </li>
          <li>
            200 decreased by 15%: 200 × 0.85 = <strong>170</strong> (30 less).
          </li>
        </ul>
        <p>
          Decreasing by more than 100% takes you below zero: 100 decreased by 150% is −50. That is correct
          maths, but things like prices or weights can’t go below zero, so if you get an answer like this,
          check the question again.
        </p>
      </ContentSection>

      <ContentSection id="reverse" title="5. Reverse percentage: finding the original number">
        <p>
          When you know a part and its percentage but not the whole, divide the part by (percentage ÷ 100). If
          25 is 20% of a number, the number is 25 ÷ 0.20 = <strong>125</strong>.
        </p>
        <p>
          Shops make you do this often. If the price after a 15% discount is ৳170, you are paying 85% of the
          original price. So the original price = 170 ÷ 0.85 = <strong>৳200</strong>. To see the sale price
          and how much you save directly, the{" "}
          <Link href={localePath("en", calculatorPath("discount-calculator"))} className={link}>
            Discount Calculator
          </Link>{" "}
          helps.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Adding and subtracting percentage changes.</strong> 100 increased by 25% is 125, but
            decreasing that by 25% takes off 25% of 125, which is 31.25, leaving 93.75, not 100. Getting back
            to 100 takes a 20% decrease. In the same way, two 10% rises make 21%, not 20% (1,000 → 1,100 →
            1,210).
          </li>
          <li>
            <strong>Mixing up percent and percentage points.</strong> An interest rate going from 9% to 10%
            is a rise of 1 percentage point. As a percentage change it is (10 − 9) ÷ 9 × 100 ≈ 11.11%. Check
            which one a news report or offer means.
          </li>
          <li>
            <strong>Using the wrong base in a reverse percentage.</strong> Adding 15% back on to a ৳170 sale
            price gives ৳195.50, not the original ৳200, because the 15% was of ৳200, not ৳170. Divide, don’t
            add.
          </li>
          <li>
            <strong>Dividing a change by the new value.</strong> The rise from 80 to 100 is 20 ÷ 80 = 25%,
            not 20 ÷ 100 = 20%. Always divide by the starting value.
          </li>
        </ul>
        <h3>3 steps before any percentage sum</h3>
        <ol>
          <li>Decide which number is the base, or “whole”: the starting price, the total marks, or an unknown original.</li>
          <li>Check whether you know the percentage or are looking for it, and pick the formula from the table above.</li>
          <li>Check the answer makes sense, for example with a rough 10% estimate.</li>
        </ol>
        <p>
          Rather than working it by hand, enter your numbers in the{" "}
          <Link href={calculator} className={link}>
            Percentage Calculator
          </Link>
          . Alongside the answer you get a sentence and the full working, so it is always clear which number
          was used as the base.
        </p>
      </ContentSection>
    </>
  );
}

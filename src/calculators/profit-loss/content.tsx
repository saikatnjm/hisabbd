import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the Profit and Loss Calculator page (Server Component, no JS). */
export function ProfitLossCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How profit and loss are calculated">
        <ul>
          <li>
            <strong>Profit or loss = selling price − cost price.</strong> Positive is a profit,
            negative is a loss, and zero is break-even.
          </li>
          <li>
            <strong>Profit % on cost = profit ÷ cost price × 100.</strong> The same formula gives the
            loss % when there is a loss.
          </li>
          <li>
            <strong>Profit margin = profit ÷ selling price × 100.</strong> It is not defined when the
            selling price is ৳0.
          </li>
        </ul>

        <h3>Worked example</h3>
        <p>
          A product costs ৳800 and sells for ৳1,000. The profit is 1,000 − 800 = <strong>৳200</strong>.
          On cost, that is 200 ÷ 800 × 100 = <strong>25%</strong>. As a margin on the selling price,
          it is 200 ÷ 1,000 × 100 = <strong>20%</strong>.
        </p>
        <p>
          If the same product is sold for ৳600 instead, the loss is ৳200, which is 200 ÷ 800 × 100 ={" "}
          <strong>25%</strong> of the cost.
        </p>
      </ContentSection>

      <ContentSection id="margin-vs-markup" title="Profit margin vs markup">
        <p>
          People often mix these up. Both start from the same profit, but they divide by different
          prices, so the percentages differ:
        </p>
        <ul>
          <li>The percentage on cost (markup) says how much you added to what you paid.</li>
          <li>The margin says what share of the selling price is profit.</li>
        </ul>
        <p>
          Doubling your money is a 100% markup but only a 50% margin: buy at ৳250, sell at ৳500, and
          half of the selling price is profit. A margin can never reach 100%; a markup can be any
          size.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the cost price: what you paid, including any delivery or packaging you want counted.</li>
          <li>Enter the selling price. It can be ৳0 if the item was given away.</li>
          <li>Select Calculate profit or loss.</li>
        </ol>
        <p>
          Both prices are rounded to the nearest paisa before they are compared. It is break-even only
          when they are exactly equal after that, so small rounding differences never show up as a
          false profit or loss.
        </p>
      </ContentSection>
    </>
  );
}

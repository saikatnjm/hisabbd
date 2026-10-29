import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Same deal, two percentages: profit on cost (markup) vs profit on selling price (margin). */
const DEALS: readonly [cost: string, selling: string, profit: string, markup: string, margin: string][] = [
  ["80", "100", "20", "25%", "20%"],
  ["800", "1,000", "200", "25%", "20%"],
  ["12.50", "15", "2.50", "20%", "16.67%"],
  ["250", "500", "250", "100%", "50%"],
  ["50", "200", "150", "300%", "75%"],
];

/** English guide: profit and loss, profit percentage, markup vs margin (Server Component, no JS). */
export function ProfitLossCalculationGuideContent() {
  const calculator = localePath("en", calculatorPath("profit-loss-calculator"));

  return (
    <>
      <ContentSection id="basics" title="The basic profit and loss formula">
        <p>
          What you paid is the <strong>cost price</strong>; what you sold for is the <strong>selling price</strong>.
          The difference is your profit or loss:
        </p>
        <p>
          <strong>Profit or loss = selling price − cost price</strong>
        </p>
        <p>A positive result is a profit, a negative one is a loss, and zero is break-even.</p>
        <ul>
          <li>Bought for ৳80, sold for ৳100: profit 100 − 80 = ৳20.</li>
          <li>An item that cost ৳800 sold for ৳1,000: profit ৳200.</li>
          <li>The same ৳800 item sold for ৳600: 600 − 800 = −200, a loss of ৳200.</li>
        </ul>
        <p>
          The cost price should include everything you spent on that item, not just its purchase price: delivery,
          packaging, a share of rent. Otherwise you show a profit on paper but not in your pocket. Enter the two prices
          in the{" "}
          <Link href={calculator} className={link}>
            Profit and Loss Calculator
          </Link>{" "}
          to see the profit or loss in Taka, the percentage and the margin together.
        </p>
      </ContentSection>

      <ContentSection id="percent" title="How to find the profit or loss percentage">
        <p>
          <strong>Profit (or loss) % = profit (or loss) ÷ cost price × 100</strong>
        </p>
        <p>
          In school profit and loss sums, unless a question says otherwise, the percentage is always{" "}
          <strong>on the cost price</strong>. The reason is simple: the question is what percentage you got back on the
          money you put in.
        </p>
        <ul>
          <li>
            Cost ৳80, selling ৳100: 20 ÷ 80 × 100 = <strong>25% profit</strong>.
          </li>
          <li>
            Cost ৳800, loss ৳200: 200 ÷ 800 × 100 = <strong>25% loss</strong>.
          </li>
          <li>
            Cost ৳100, selling ৳80: a ৳20 loss, which is a <strong>20% loss</strong>.
          </li>
          <li>
            Giving away an item that cost ৳500 is a ৳500 loss, or <strong>100%</strong> of the cost. A loss can never be
            more than 100%, but a profit can easily be.
          </li>
        </ul>
        <h3>Working backwards from a profit percentage</h3>
        <p>
          <strong>Selling price = cost × (1 + profit% ÷ 100)</strong> and{" "}
          <strong>cost = selling price ÷ (1 + profit% ÷ 100)</strong>; for a loss, subtract instead of adding. To make
          25% on an ৳800 item, sell it for 800 × 1.25 = ৳1,000. If something sold for ৳80 at a 20% loss, it cost 80 ÷
          0.80 = ৳100. You can do these reverse sums in the{" "}
          <Link href={localePath("en", calculatorPath("percentage-calculator"))} className={link}>
            Percentage Calculator
          </Link>{" "}
          too.
        </p>
      </ContentSection>

      <ContentSection id="worked" title="Profit and loss sums: two step-by-step examples">
        <h3>1. Buying in bulk and selling singly</h3>
        <p>A shopkeeper buys 12 pens for ৳150 and sells each one for ৳15. What is the profit percentage?</p>
        <ol>
          <li>Cost of one pen = 150 ÷ 12 = ৳12.50.</li>
          <li>Profit on each = 15 − 12.50 = ৳2.50.</li>
          <li>Profit % = 2.50 ÷ 12.50 × 100 = <strong>20%</strong>.</li>
          <li>Check: total sales 12 × 15 = ৳180, total profit ৳30, and 30 ÷ 150 × 100 = 20%. It matches.</li>
        </ol>
        <p>
          Whether you work per item or in total, the percentage is the same. Just make sure both prices are for the same
          quantity: don’t compare the price of one pen with the price of a dozen.
        </p>
        <h3>2. The price that turns a loss into a profit</h3>
        <p>An item sold for ৳900 made a 10% loss. What price would have made a 10% profit?</p>
        <ol>
          <li>৳900 is 90% of the cost, so the cost = 900 ÷ 0.90 = ৳1,000.</li>
          <li>At a 10% profit, the selling price = 1,000 × 1.10 = <strong>৳1,100</strong>.</li>
        </ol>
        <p>
          Adding 20% to ৳900 to get ৳1,080 is wrong here, because both percentages are on the cost, not on ৳900. Finding
          the cost first is the key to this kind of sum.
        </p>
      </ContentSection>

      <ContentSection id="markup-vs-margin" title="Markup vs margin: one profit, two percentages">
        <p>Businesses use two percentages, and mixing them up is the most common mistake:</p>
        <ul>
          <li>
            <strong>Markup = profit ÷ cost price × 100.</strong> How much you added on top of what you paid. The
            “profit percentage” above is this.
          </li>
          <li>
            <strong>Margin = profit ÷ selling price × 100.</strong> How much of the sale money you keep as profit.
          </li>
        </ul>
        <p>
          Both are useful. Markup is easier for setting prices, because you add a percentage straight onto what you paid.
          Margin is better for seeing how much of a month’s total sales you kept as profit. The profit is the same, but
          it is divided by a different price, so the numbers differ:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Cost (৳)</th>
                <th scope="col" className={headNum}>Selling (৳)</th>
                <th scope="col" className={headNum}>Profit (৳)</th>
                <th scope="col" className={headNum}>Markup</th>
                <th scope="col" className={headNum}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {DEALS.map(([cost, selling, profit, markup, margin]) => (
                <tr key={cost}>
                  <th scope="row" className={`${cell} font-normal`}>{cost}</th>
                  <td className={num}>{selling}</td>
                  <td className={num}>{profit}</td>
                  <td className={num}>{markup}</td>
                  <td className={num}>{margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Doubling the price is a 100% markup but only a 50% margin. Margin can never reach 100%, because the profit
          can never be bigger than the selling price; markup has no upper limit. To convert one into the other:
        </p>
        <ul>
          <li>Margin = markup ÷ (100 + markup) × 100. For example 25 ÷ 125 × 100 = 20%.</li>
          <li>Markup = margin ÷ (100 − margin) × 100. For example 20 ÷ 80 × 100 = 25%.</li>
        </ul>
      </ContentSection>

      <ContentSection id="target-price" title="The selling price for a target margin">
        <p>
          When planning, many businesses set their profit target as a margin, such as “a quarter of every sale is
          profit”. For a 25% <em>margin</em> on an ৳800 item, the sum is not 800 × 1.25:
        </p>
        <p>
          <strong>Selling price = cost price ÷ (1 − margin ÷ 100)</strong>
        </p>
        <p>
          800 ÷ 0.75 = <strong>৳1,066.67</strong>. Check: the profit is ৳266.67, which is 25% of ৳1,066.67. Selling at
          ৳1,000 instead gives a 25% markup but only a 20% margin. Always make sure which percentage is meant.
        </p>
      </ContentSection>

      <ContentSection id="discount" title="How a discount eats into profit">
        <p>
          A discount on the marked price cuts profit much faster than its percentage suggests. Take an ৳800 item marked
          at ৳1,000 (a 25% markup):
        </p>
        <ul>
          <li>Sold at 10% off for ৳900: profit ৳100, or 12.5% on cost.</li>
          <li>
            Sold at 20% off for ৳800: no profit at all, exactly <strong>break-even</strong>. A 20% discount is enough
            to wipe out a 25% markup.
          </li>
          <li>Sold at 25% off for ৳750: not just no profit but a ৳50 loss, or 6.25% of the cost.</li>
        </ul>
        <p>
          Work out the price after the discount in the{" "}
          <Link href={localePath("en", calculatorPath("discount-calculator"))} className={link}>
            Discount Calculator
          </Link>
          , then use that as the selling price to check your profit.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common profit and loss mistakes">
        <ul>
          <li>
            <strong>Dividing by the selling price for profit percentage.</strong> ৳80 → ৳100 is a 25% profit, not 20%;
            20% is the margin.
          </li>
          <li>
            <strong>Working out loss percentage on the selling price.</strong> ৳100 → ৳80 is a 20% loss on cost; ৳20 ÷
            ৳80 = 25% is wrong.
          </li>
          <li>
            <strong>Treating a 25% markup as a 25% margin.</strong> You keep less from every sale than you planned.
          </li>
          <li>
            <strong>Leaving out other costs.</strong> If delivery, packaging or online payment charges are not in the
            cost price, the profit looks bigger than it is.
          </li>
          <li>
            <strong>Counting a VAT-inclusive price as income.</strong> An item bought for ৳800 excluding VAT and sold
            for ৳1,150 including VAT brings in ৳1,000, a profit of ৳200, not ৳350.
          </li>
        </ul>
        <p>
          Check any cost and selling price in the{" "}
          <Link href={calculator} className={link}>
            Profit and Loss Calculator
          </Link>
          : it shows the profit or loss in Taka, the percentage on cost and the margin, to the paisa.
        </p>
      </ContentSection>
    </>
  );
}

import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { VAT_RATE_PRESETS } from "@/calculators/vat/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** VAT-inclusive prices at 15%: the wrong "15% of the total" vs the VAT actually inside. */
const MISTAKES: readonly [gross: string, wrong: string, right: string, net: string][] = [
  ["1,150", "172.50", "150", "1,000"],
  ["2,300", "345", "300", "2,000"],
  ["5,750", "862.50", "750", "5,000"],
  ["11,500", "1,725", "1,500", "10,000"],
];

/** English guide: how VAT is added and removed (Server Component, no JS). */
export function VatCalculationGuideContent() {
  const calculator = localePath("en", calculatorPath("vat-calculator"));

  return (
    <>
      <ContentSection id="rate" title="What VAT is, and the rate">
        <p>
          VAT (value added tax, called mushak or musok in Bangla) is a tax on the price of goods and
          services that the buyer pays and the seller passes on to the government. Under the Value Added
          Tax and Supplementary Duty Act, 2012 the standard rate is{" "}
          <strong>{VAT_RATE_PRESETS.standard.value}%</strong>. Some goods and services have reduced rates
          such as 10%, 7.5% or 5%; which rate applies to an item comes from NBR’s lists or the VAT invoice.
        </p>
        <p>
          There are two everyday questions: <strong>adding</strong> VAT to a price that excludes it, and{" "}
          <strong>removing</strong> the VAT from a price that already includes it. They use different
          formulas. The{" "}
          <Link href={calculator} className={link}>
            VAT Calculator
          </Link>{" "}
          does both in one click; here is how to do them by hand.
        </p>
      </ContentSection>

      <ContentSection id="add" title="Adding VAT to a price">
        <p>
          <strong>VAT = price excluding VAT × rate ÷ 100</strong>
        </p>
        <p>
          <strong>Price including VAT = price excluding VAT + VAT = price excluding VAT × (1 + rate ÷ 100)</strong>
        </p>
        <ul>
          <li>৳1,000 at 15%: 1,000 × 15 ÷ 100 = ৳150 VAT, so ৳1,150 including VAT. In one step: 1,000 × 1.15.</li>
          <li>
            With paisa: ৳2,499.50 × 0.15 = 374.925, rounded to ৳374.93 VAT, so <strong>৳2,874.43</strong>{" "}
            including VAT.
          </li>
          <li>৳1,000 at 7.5%: ৳75 VAT, ৳1,075 including VAT.</li>
        </ul>
        <p>
          How paisa are rounded: round the VAT to the nearest paisa first (halves go up), then add it to the
          price. That way the price before VAT plus the VAT always equals the VAT-inclusive price exactly,
          and the receipt never ends up a paisa out.
        </p>
      </ContentSection>

      <ContentSection id="remove" title="Taking VAT out of a VAT-inclusive price">
        <p>When a price already includes VAT (a receipt that says “incl. VAT”, for example), the VAT inside it is:</p>
        <p>
          <strong>VAT = price including VAT × rate ÷ (100 + rate)</strong>
        </p>
        <p>
          <strong>Price excluding VAT = price including VAT ÷ (1 + rate ÷ 100)</strong>
        </p>
        <ul>
          <li>৳1,150 at 15%: 1,150 × 15 ÷ 115 = ৳150 VAT, so the price before VAT is ৳1,000.</li>
          <li>
            ৳1,000 at 15%: 1,000 × 15 ÷ 115 = 130.434…, rounded to ৳130.43 VAT, so{" "}
            <strong>৳869.57</strong> before VAT.
          </li>
        </ul>
        <h3>Shortcuts worth remembering</h3>
        <ul>
          <li>15%: 15 ÷ 115 = 3 ÷ 23, so VAT = price including VAT × 3 ÷ 23.</li>
          <li>10%: VAT = price including VAT ÷ 11 (৳500 in ৳5,500).</li>
          <li>7.5%: VAT = price including VAT × 3 ÷ 43 (৳300 in ৳4,300).</li>
          <li>5%: VAT = price including VAT ÷ 21 (৳100 in ৳2,100).</li>
        </ul>
        <h3>Checking a receipt</h3>
        <ol>
          <li>The receipt total is ৳3,450, marked “including 15% VAT”.</li>
          <li>VAT = 3,450 × 3 ÷ 23 = ৳450.</li>
          <li>Price before VAT = 3,450 − 450 = ৳3,000.</li>
          <li>Check: 3,000 × 1.15 = ৳3,450. It matches, so the sum is right.</li>
        </ol>
        <p>
          That last step is the useful one: if multiplying the price before VAT by (1 + rate ÷ 100) gives
          back the total, you have removed the VAT correctly.
        </p>
      </ContentSection>

      <ContentSection id="common-mistake" title="The common mistake: taking 15% of the total">
        <p>
          To remove VAT, many people take 15% of the VAT-inclusive price. That overstates the VAT, because
          the 15% was charged on the price <em>before</em> VAT, which is smaller than the total. 15% of
          ৳1,150 is ৳172.50, but only ৳150 of it is VAT; taking away ৳172.50 leaves ৳977.50, not the real
          ৳1,000.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Price incl. VAT (৳)</th>
                <th scope="col" className={headNum}>Wrong: 15% of total (৳)</th>
                <th scope="col" className={headNum}>Correct VAT (৳)</th>
                <th scope="col" className={headNum}>Price excl. VAT (৳)</th>
              </tr>
            </thead>
            <tbody>
              {MISTAKES.map(([gross, wrong, right, net]) => (
                <tr key={gross}>
                  <th scope="row" className={`${cell} font-normal`}>{gross}</th>
                  <td className={num}>{wrong}</td>
                  <td className={num}>{right}</td>
                  <td className={num}>{net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The reason is simple: the VAT-inclusive price is 115% of the price before VAT. Think of the total
          as 115 parts: 100 are the price and 15 are VAT, so the VAT is 15/115 of the total, not 15/100.
          The wrong answer is always 15% higher than the real VAT. So remember:{" "}
          <strong>to remove VAT, divide by 115, not 100</strong> (by 100 + rate for other rates).
        </p>
      </ContentSection>

      <ContentSection id="discount-profit" title="VAT with discounts and profit">
        <h3>VAT after a discount</h3>
        <p>
          A ৳2,500 shirt with 20% off costs ৳2,000, and 15% VAT on that makes ৳2,300. Both steps are
          multiplications, so adding VAT first and then taking the discount gives the same ৳2,300. What does
          not work is treating “20% off and 15% VAT” as a net 5% off: 2,500 × 0.95 = ৳2,375 is wrong. To see
          the discount on its own, use the{" "}
          <Link href={localePath("en", calculatorPath("discount-calculator"))} className={link}>
            Discount Calculator
          </Link>
          .
        </p>
        <h3>A seller’s profit</h3>
        <p>
          When you sell at a VAT-inclusive price, the VAT inside belongs to the government, not to you. An
          item bought for ৳800 excluding VAT and sold for ৳1,150 including VAT brings in ৳1,000, a profit of
          ৳200 (25% on cost), not ৳350. Do this sum in the{" "}
          <Link href={localePath("en", calculatorPath("profit-loss-calculator"))} className={link}>
            Profit and Loss Calculator
          </Link>{" "}
          with prices before VAT. Registered businesses also deal with things like input tax credit; ask your
          accountant about those.
        </p>
      </ContentSection>

      <ContentSection id="limits" title="What this simple sum leaves out">
        <p>
          The formulas above add or remove VAT at one rate. Some products involve more: supplementary duty
          (SD), advance tax, VAT deducted at source, a fixed VAT per unit, or VAT on a tariff or truncated
          value instead of the price. Whether a printed price (MRP) already includes VAT also depends on the
          product and NBR rules. Businesses should follow NBR rules and their accountant.
        </p>
        <p>
          To check an everyday receipt, enter your amount and rate in the{" "}
          <Link href={calculator} className={link}>
            VAT Calculator
          </Link>
          : it shows the VAT, both prices and the formula with your numbers, to the paisa.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <p>
          Standard rate of 15%:{" "}
          <a href={VAT_RATE_PRESETS.standard.source.url} target="_blank" rel="noopener" className={link}>
            NBR VAT FAQ
          </a>
          . Reduced rates of 1.5%, 2%, 2.4%, 4.5%, 5%, 7.5% and 10% for specific goods and services:{" "}
          <a href={VAT_RATE_PRESETS.reduced10.source.url} target="_blank" rel="noopener" className={link}>
            PwC Worldwide Tax Summaries, Bangladesh
          </a>{" "}
          (last reviewed 31 July 2026). Both checked on 28 October 2026. Rates can change with each budget;
          NBR’s current rules always prevail.
        </p>
      </ContentSection>
    </>
  );
}

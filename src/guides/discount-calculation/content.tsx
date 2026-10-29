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

/** Stacked discounts on ৳1,000: what people expect (the sum) vs the real total discount. */
const STACKED: readonly [offer: string, expected: string, pay: string, real: string][] = [
  ["20% + 10%", "30%", "720", "28%"],
  ["10% + 20%", "30%", "720", "28%"],
  ["30% + 20%", "50%", "560", "44%"],
  ["50% + 50%", "100%", "250", "75%"],
];

/** English guide: how a discount is worked out, and why stacked discounts don't add up (Server Component, no JS). */
export function DiscountCalculationGuideContent() {
  const calculator = localePath("en", calculatorPath("discount-calculator"));

  return (
    <>
      <ContentSection id="price-after-discount" title="The formula for the price after a discount">
        <p>
          A sign that says “20% off” means you pay ৳20 less for every ৳100 of the original price. There are two
          formulas:
        </p>
        <p>
          <strong>Saving = original price × discount ÷ 100</strong>
        </p>
        <p>
          <strong>Price after discount = original price × (1 − discount ÷ 100)</strong>
        </p>
        <ul>
          <li>
            A ৳2,500 shirt with 20% off: saving 2,500 × 20 ÷ 100 = ৳500, price 2,500 × 0.80 ={" "}
            <strong>৳2,000</strong>.
          </li>
          <li>
            ৳1,000 with 20% off: 1,000 × 0.80 = <strong>৳800</strong>, a saving of ৳200.
          </li>
        </ul>
        <p>
          The second formula is the handy one: 20% off means you pay 80%, so multiply by 0.80 in one step. 15% off is
          × 0.85, 25% off is × 0.75 and 40% off is × 0.60. Enter a price and a percentage in the{" "}
          <Link href={calculator} className={link}>
            Discount Calculator
          </Link>{" "}
          and it shows the final price and your saving together.
        </p>
      </ContentSection>

      <ContentSection id="paisa" title="How much you save, and the paisa">
        <p>
          When the price doesn’t come out in whole Taka, you get paisa. ৳999 with 15% off: 999 × 0.85 ={" "}
          <strong>৳849.15</strong>, and the saving is 999 − 849.15 = <strong>৳149.85</strong>. The two add back up to
          exactly ৳999, which is the easiest way to check your sum.
        </p>
        <p>
          Round to the nearest paisa (halves go up). Round the final price first and then subtract it from the original
          to get the saving; that way the receipt never ends up a paisa out.
        </p>
        <h3>Quick mental maths</h3>
        <ul>
          <li>10% means divide by 10: 10% of ৳2,500 = ৳250.</li>
          <li>20% is double that: ৳500. 5% is half of it: ৳125.</li>
          <li>So 15% = 250 + 125 = ৳375, and 25% = 500 + 125 = ৳625.</li>
        </ul>
        <p>
          The same trick for 30% off ৳1,800: 10% = ৳180, so 30% = ৳540 and the price is 1,800 − 540 = ৳1,260. Having
          a rough figure in your head before you check the till or a calculator makes a big mistake easy to spot.
        </p>
      </ContentSection>

      <ContentSection id="stacked" title="Why 20% + 10% off is not 30% off">
        <p>
          Many offers read “20% off, plus an extra 10% with your card”. The second discount is taken off the price that
          is <em>already reduced</em>, not off the original:
        </p>
        <ol>
          <li>৳1,000 with 20% off: ৳800.</li>
          <li>Now 10% of ৳800 = ৳80, not ৳100.</li>
          <li>
            You pay 800 − 80 = <strong>৳720</strong> and save ৳280, a total discount of <strong>28%</strong>.
          </li>
        </ol>
        <p>
          <strong>Final price = original × (1 − first ÷ 100) × (1 − second ÷ 100)</strong>
        </p>
        <p>
          <strong>Total discount % = 100 − (100 − first) × (100 − second) ÷ 100</strong>
        </p>
        <p>For 20% and 10%: 100 − 80 × 90 ÷ 100 = 100 − 72 = 28%. A few offers side by side on ৳1,000:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Offer</th>
                <th scope="col" className={headNum}>Looks like</th>
                <th scope="col" className={headNum}>You pay (৳)</th>
                <th scope="col" className={headNum}>Real discount</th>
              </tr>
            </thead>
            <tbody>
              {STACKED.map(([offer, expected, pay, real]) => (
                <tr key={offer}>
                  <th scope="row" className={`${cell} font-normal`}>{offer}</th>
                  <td className={num}>{expected}</td>
                  <td className={num}>{pay}</td>
                  <td className={num}>{real}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The order doesn’t matter, because both steps are multiplications: 10% and then 20% also leaves ৳720. And two
          50% discounts never make an item free: ৳400 with 50% + 50% off is ৳100, a 75% discount. Turn on “Add an extra
          discount” in the{" "}
          <Link href={calculator} className={link}>
            Discount Calculator
          </Link>{" "}
          to see the true combined percentage next to the simple sum.
        </p>
        <p>
          So if one shop offers a straight 30% off and another offers 20% + 10%, at the same starting price the first is
          cheaper: ৳700 against ৳720 on ৳1,000.
        </p>
      </ContentSection>

      <ContentSection id="offers" title="Other offers as a percentage: buy one get one, cashback">
        <p>Not every offer is written as “% off”. Turning each one into a percentage makes deals easy to compare:</p>
        <ul>
          <li>
            <strong>Buy one, get one free:</strong> you get two items for the price of one, so each is 50% off. It is
            only a saving if you actually need both.
          </li>
          <li>
            <strong>Buy two, get one free:</strong> you get three for the price of two. At ৳300 each, ৳900 worth of
            goods costs ৳600, a discount of 300 ÷ 900 × 100 = about <strong>33.33%</strong>, not 50%.
          </li>
          <li>
            <strong>Cashback with a cap:</strong> with “10% cashback, up to ৳150”, spending ৳2,500 would earn ৳250 at
            10%, but you get ৳150, which is really 150 ÷ 2,500 × 100 = <strong>6%</strong>. Cashback usually arrives
            later in your account; it doesn’t lower the price at the till.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="vat" title="Discounts and VAT together">
        <p>
          When a receipt has both a discount and VAT, treat them as two separate multiplications. A ৳2,500 shirt with
          20% off is ৳2,000, and 15% VAT on that makes ৳2,300. Adding VAT first and then taking the discount gives the
          same ৳2,300. What doesn’t work is reading “20% off and 15% VAT” as a net 5% off: 2,500 × 0.95 = ৳2,375 is
          wrong. To see the VAT part on its own, use the{" "}
          <Link href={localePath("en", calculatorPath("vat-calculator"))} className={link}>
            VAT Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="original-price" title="Finding the original price from a sale price">
        <p>
          If a tag shows only the price after the discount, work backwards. A price after 20% off is 80% of the
          original, so:
        </p>
        <p>
          <strong>Original price = sale price ÷ (1 − discount ÷ 100)</strong>
        </p>
        <p>
          If ৳2,000 is the price after 20% off, the original was 2,000 ÷ 0.80 = <strong>৳2,500</strong>. You can do
          this reverse sum with the “Find the whole” option in the{" "}
          <Link href={localePath("en", calculatorPath("percentage-calculator"))} className={link}>
            Percentage Calculator
          </Link>
          : 2,000 is 80% of what number?
        </p>
        <p>
          To check, multiply back: 2,500 × 0.80 = ৳2,000. If it matches, you have the right original price. When a tag
          shows an old price crossed out next to a new one, the same check tells you whether the advertised discount
          matches the real one.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common discount mistakes">
        <ul>
          <li>
            <strong>Adding two discounts together.</strong> 20% + 10% is 28%, not 30%; the second one comes off the
            lower price.
          </li>
          <li>
            <strong>Adding the percentage back to find the original price.</strong> ৳2,000 plus 20% is ৳2,400, not
            ৳2,500, because the 20% was taken off the larger price. Divide by 0.80 instead.
          </li>
          <li>
            <strong>Letting a discount and VAT cancel out.</strong> 20% off and 15% VAT is not 5% off; multiply them
            separately.
          </li>
          <li>
            <strong>Choosing between “৳500 off” and “20% off” without checking.</strong> A flat amount doesn’t depend
            on the price. At ৳2,500 they are equal; above that 20% saves more, below it ৳500 does.
          </li>
          <li>
            <strong>Reading “up to 50% off” as 50% off everything.</strong> Usually only a few items get the top
            discount; check the rate on the tag of the item you want.
          </li>
        </ul>
        <p>
          To check a deal while you’re still in the shop, enter the price and percentage in the{" "}
          <Link href={calculator} className={link}>
            Discount Calculator
          </Link>
          . Everything is worked out on your phone, and nothing you type is sent anywhere.
        </p>
      </ContentSection>
    </>
  );
}

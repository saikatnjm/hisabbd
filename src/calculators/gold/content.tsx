import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { BAJUS_SOURCE, GOLD_VAT_SOURCES } from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const OBSERVER_18_JUNE = "https://observerbd.com/news/579924";
const WIKIPEDIA_BHORI = "https://en.wikipedia.org/wiki/Bhori";

/** Explanatory content for the Gold Price & Bhori Calculator page (Server Component, no JS). */
export function GoldCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How gold weight and price are calculated">
        <h3>Bhori, ana, roti and point</h3>
        <p>
          In Bangladesh gold is weighed in <strong>bhori</strong> (ভরি, also called a tola or vori). BAJUS, the
          Bangladesh Jewellers Association, quotes every price per bhori of <strong>11.664 grams</strong>.
          Smaller weights are written in ana, roti and point:
        </p>
        <ul>
          <li>
            <strong>1 bhori = 16 ana = 11.664 g</strong>
          </li>
          <li>
            <strong>1 ana = 6 roti = 0.729 g</strong>
          </li>
          <li>
            <strong>1 roti = 10 point = 0.1215 g</strong>
          </li>
          <li>
            <strong>1 point = 0.01215 g</strong> (1 bhori = 96 roti = 960 point)
          </li>
        </ul>
        <p>
          <strong>Weight in bhori = bhori + ana ÷ 16 + roti ÷ 96 + point ÷ 960</strong>, and{" "}
          <strong>grams = bhori × 11.664</strong>.
        </p>
        <p>
          Example: 2 bhori 5 ana 3 roti = 2 + 5 ÷ 16 + 3 ÷ 96 = 2.34375 bhori = <strong>27.3375 g</strong>. The
          other way, 10 g ÷ 11.664 = 0.8573 bhori, which a jeweller writes as{" "}
          <strong>13 ana 4 roti 3.05 point</strong>.
        </p>

        <h3>The price of a piece of gold</h3>
        <p>
          <strong>Gold price = weight in bhori × price per bhori</strong>
        </p>
        <p>
          <strong>Total = gold price + making charge (+ VAT, only if your bill adds it)</strong>
        </p>
        <p>
          Example with an <em>example</em> price of ৳2,20,000 a bhori for 22 carat (check today’s real price):
          1 bhori 8 ana is 1.5 bhori, so the gold costs 1.5 × 2,20,000 = ৳3,30,000. An 8% making charge adds
          ৳26,400, for <strong>৳3,56,400</strong> in total. A making charge of ৳5,000 per bhori instead would add
          ৳7,500, for ৳3,37,500.
        </p>
      </ContentSection>

      <ContentSection id="price-and-purity" title="Today’s gold price and purity">
        <p>
          Gold prices in Bangladesh are set by BAJUS and change often, sometimes several times a month. So this
          page never fills in a price: check today’s price per bhori at{" "}
          <a href={BAJUS_SOURCE.url} target="_blank" rel="noopener" className={link}>
            bajus.org
          </a>{" "}
          (newspapers also report every change) and enter it.
        </p>
        <p>
          BAJUS publishes a separate price for four grades. Carat measures purity out of 24: <strong>22 carat</strong>{" "}
          is about 91.7% gold, <strong>21 carat</strong> 87.5% and <strong>18 carat</strong> 75%.{" "}
          <strong>Traditional (sanatan)</strong> gold is the lowest of the four and the cheapest per bhori. Pick
          the purity on your receipt and enter that price; the purity itself doesn’t change the maths.
        </p>
      </ContentSection>

      <ContentSection id="vat-and-making" title="VAT and making charge (majuri)">
        <p>
          <strong>VAT.</strong> Gold used to carry 5% VAT on the sale price. The FY2026-27 budget replaced it with
          a fixed VAT of <strong>৳2,500 per bhori</strong> on gold (৳100 per bhori on silver); the Finance Bill
          passed on 29 June 2026. BAJUS has published <strong>VAT-inclusive prices</strong> since 18 June 2026
          and says shops may not collect VAT separately. So the calculator’s default is “Included in the price
          (BAJUS)” and adds nothing. If your bill does add VAT, choose “Add VAT as % of the bill” (applied to the
          gold price plus the making charge) or “Add VAT in ৳ per bhori” and type the figure on the bill.
        </p>
        <p>
          <strong>Making charge.</strong> The jeweller’s charge for making the piece depends on the design and
          the shop, so nothing is filled in. Enter it as a percentage of the gold price or as Taka per bhori,
          or leave it blank. To check what percentage a quoted charge is, use the{" "}
          <Link href={calculatorPath("percentage-calculator")} className={link}>
            Percentage Calculator
          </Link>
          ; for VAT on other goods, the{" "}
          <Link href={calculatorPath("vat-calculator")} className={link}>
            VAT Calculator
          </Link>
          .
        </p>
        <p>
          Not included: wastage (khad), the weight of stones, discounts, and the deduction a shop makes when it
          buys old gold back. Ask the shop about these before you buy or sell.
        </p>
      </ContentSection>

      <ContentSection id="zakat" title="Gold and zakat">
        <p>
          The zakat nisab is 7.5 bhori (87.48 g) of gold or 52.5 bhori (612.36 g) of silver. To include your gold
          in a zakat calculation, convert its weight to bhori here, then use the{" "}
          <Link href={calculatorPath("zakat-calculator")} className={link}>
            Zakat Calculator
          </Link>
          , which values it at the price you enter and compares your wealth with the nisab.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose Price of gold (to work out a cost) or Convert units (weight only).</li>
          <li>
            Choose how you’ll enter the weight: Bhori, ana, roti (fill in any of Bhori, Ana, Roti and Point;
            blanks count as 0) or Grams.
          </li>
          <li>For a price: choose the purity and enter the Price per bhori from BAJUS.</li>
          <li>Optionally add the making charge, and change the VAT option only if your bill adds VAT.</li>
          <li>Select Calculate price or Convert weight.</li>
        </ol>
        <p>
          Calculations keep full precision; money is rounded to the paisa and weights to 4 decimals only for
          display. Mode, purity and weight unit are remembered on this device; prices and weights are kept only
          in your recent calculations, which you can turn off.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            Units (11.664 g, 16 ana, 96 roti, 960 point):{" "}
            <a href={WIKIPEDIA_BHORI} target="_blank" rel="noopener" className={link}>
              Wikipedia, “Bhori”
            </a>
            , and BAJUS price notices that quote “per bhori (11.664 grams)”.
          </li>
          <li>
            VAT-inclusive BAJUS prices from 18 June 2026:{" "}
            <a href={OBSERVER_18_JUNE} target="_blank" rel="noopener" className={link}>
              The Daily Observer, 18 June 2026
            </a>
            .
          </li>
          {GOLD_VAT_SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>
            </li>
          ))}
        </ul>
        <p>
          All checked on 29 October 2026. We could not read the NBR order itself, so if your bill differs, the
          bill and NBR’s current rules decide.
        </p>
      </ContentSection>
    </>
  );
}

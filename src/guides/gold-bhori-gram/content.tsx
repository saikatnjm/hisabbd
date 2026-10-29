import Link from "next/link";
import { BAJUS_SOURCE, GOLD_VAT_SOURCES } from "@/calculators/gold/logic";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

const OBSERVER_18_JUNE = "https://observerbd.com/news/579924";
const WIKIPEDIA_BHORI = "https://en.wikipedia.org/wiki/Bhori";
const IFB_ZAKAT_POLICY = "https://www.islamicfoundation.gov.bd/pages/policies/6922d8fedbfbab28ce047438";

/** Units as in src/calculators/gold/units.ts: 1 bhori = 11.664 g = 16 ana = 96 roti = 960 point. */
const UNITS: readonly [unit: string, inSmaller: string, grams: string][] = [
  ["1 bhori (ভরি)", "16 ana", "11.664"],
  ["1 ana (আনা)", "6 roti", "0.729"],
  ["1 roti (রতি)", "10 point", "0.1215"],
  ["1 point (পয়েন্ট)", "—", "0.01215"],
];

/** English guide: bhori, ana, roti and point in grams, carat, and working out a gold price (Server Component, no JS). */
export function GoldBhoriGramGuideContent() {
  const calculator = localePath("en", calculatorPath("gold-calculator"));

  return (
    <>
      <ContentSection id="answer" title="The short answer: 1 bhori = 11.664 grams">
        <p>
          In Bangladesh, <strong>one bhori of gold is 11.664 grams</strong>. The bhori (also written vori) is the
          same weight as the tola. BAJUS, the Bangladesh Jewellers Association, writes “per bhori (11.664
          grams)” in every price notice, so shop prices, receipts and news reports all use this bhori.
        </p>
        <p>
          Websites from other countries may use a different tola (Pakistan’s jewellery trade commonly takes it
          as 12.5 g), so for Bangladesh always use 11.664 g. To convert bhori to grams, or ana and roti to a
          price, use the{" "}
          <Link href={calculator} className={link}>
            Gold Price &amp; Bhori Calculator
          </Link>
          ; it does exactly the sums below.
        </p>
      </ContentSection>

      <ContentSection id="units" title="Bhori, ana, roti and point in grams">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Unit</th>
                <th scope="col" className={head}>Equals</th>
                <th scope="col" className={headNum}>Grams</th>
              </tr>
            </thead>
            <tbody>
              {UNITS.map(([unit, inSmaller, grams]) => (
                <tr key={unit}>
                  <th scope="row" className={`${cell} font-normal`}>{unit}</th>
                  <td className={cell}>{inSmaller}</td>
                  <td className={num}>{grams}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          So 1 bhori = 16 ana = 96 roti = 960 point. Two formulas cover every conversion:{" "}
          <strong>weight in bhori = bhori + ana ÷ 16 + roti ÷ 96 + point ÷ 960</strong>, and{" "}
          <strong>grams = bhori × 11.664</strong>.
        </p>
        <p>
          The point is a jewellers’ unit and the least standardised of the four; we use the most widely
          documented “10 point = 1 roti”. Many shops now also write weights in grams only.
        </p>
      </ContentSection>

      <ContentSection id="convert" title="Converting ana and roti: worked examples">
        <h3>Ana and roti to grams</h3>
        <p>
          A receipt says 2 bhori 5 ana 3 roti. In bhori: 2 + 5 ÷ 16 + 3 ÷ 96 = 2.34375 bhori. In grams: 2.34375
          × 11.664 = <strong>27.3375 g</strong>. The same weight is 37.5 ana, 225 roti or 2,250 point in all.
        </p>
        <h3>Grams to ana and roti</h3>
        <p>
          Say a chain weighs 10 g. 10 ÷ 11.664 = 0.8573 bhori, so less than one bhori. To split it, go to
          points first: 10 ÷ 0.01215 = 823.05 point. An ana is 60 point, so that is 13 ana (780 point), leaving
          43.05 point = 4 roti 3.05 point. A jeweller writes <strong>13 ana 4 roti 3.05 point</strong>.
        </p>
        <p>
          In the same way, 1 g = 82.30 point = <strong>1 ana 2 roti 2.3 point</strong>, and 1.5 bhori is 1 bhori
          8 ana.
        </p>
      </ContentSection>

      <ContentSection id="price" title="Working out a gold price: carat, weight and making charge">
        <p>
          BAJUS publishes a separate price for four grades. Carat measures purity out of 24:{" "}
          <strong>22 carat</strong> is about 91.7% gold, <strong>21 carat</strong> 87.5% and{" "}
          <strong>18 carat</strong> 75%. <strong>Traditional (sanatan)</strong> gold is the lowest of the four
          and the cheapest per bhori. The weight maths is the same for every grade; just use the price for the
          grade on your receipt.
        </p>
        <p>
          <strong>Gold price = weight in bhori × price per bhori</strong>;{" "}
          <strong>total = gold price + making charge</strong>.
        </p>
        <p>
          The prices below are <em>examples only</em>, not today’s price. Gold prices change often, so check
          today’s price per bhori on the{" "}
          <a href={BAJUS_SOURCE.url} target="_blank" rel="noopener" className={link}>
            BAJUS website
          </a>
          .
        </p>
        <ul>
          <li>
            At an example price of ৳2,20,000 a bhori for 22 carat, 1 bhori 8 ana = 1.5 bhori, so the gold costs
            1.5 × 2,20,000 = <strong>৳3,30,000</strong>.
          </li>
          <li>
            An 8% making charge adds ৳26,400, for <strong>৳3,56,400</strong> in total. A making charge of ৳5,000
            per bhori would add 1.5 × 5,000 = ৳7,500 instead, for ৳3,37,500.
          </li>
          <li>
            For a weight in grams, convert to bhori first: at an example ৳2,33,280 a bhori, 5 g = 5 ÷ 11.664
            bhori, which costs exactly <strong>৳1,00,000</strong>.
          </li>
        </ul>
        <p>
          The making charge (majuri) depends on the design and the shop, so ask. Wastage (khad), stone weight,
          discounts and the deduction a shop makes when it buys old gold back are not part of these sums.
        </p>
      </ContentSection>

      <ContentSection id="vat" title="VAT on gold: already in the price">
        <p>
          Gold used to carry 5% VAT on the sale price. The FY2026-27 budget replaced it with a fixed VAT of{" "}
          <strong>৳2,500 per bhori</strong> on gold (৳100 per bhori on silver); the Finance Bill passed on 29 June
          2026. BAJUS has published <strong>VAT-inclusive prices</strong> since 18 June 2026 and says shops may
          not collect VAT separately.
        </p>
        <p>
          So if you work from the BAJUS price, you normally add no VAT. If your bill does add VAT, go by the
          bill: in the example above, 5% on the ৳3,56,400 of gold and making would be ৳17,820, for ৳3,74,220;
          without making, ৳2,500 per bhori on 1.5 bhori would be ৳3,750, for ৳3,33,750. We could not read the NBR
          order itself, so if your bill differs, the bill and NBR’s current rules decide.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Taking a bhori as 10 or 12 grams.</strong> 10 g is only 13 ana 4 roti 3.05 point, not a full
            bhori.
          </li>
          <li>
            <strong>Thinking an ana is a tenth of a bhori.</strong> There are 16 ana in a bhori, so 8 ana is half a
            bhori.
          </li>
          <li>
            <strong>Mixing up per-gram and per-bhori prices.</strong> Price per gram = price per bhori ÷ 11.664.
          </li>
          <li>
            <strong>Using the wrong grade’s price.</strong> Pricing 21 or 18 carat jewellery at the 22 carat rate
            overstates its value.
          </li>
          <li>
            <strong>Adding VAT twice.</strong> BAJUS prices already include it.
          </li>
          <li>
            <strong>Using the wrong unit for zakat.</strong> The gold nisab is 7.5 bhori, which is 87.48 g. Convert
            your weight to bhori and enter it in the{" "}
            <Link href={localePath("en", calculatorPath("zakat-calculator"))} className={link}>
              Zakat Calculator
            </Link>
            , which values it at the price you enter and compares it with the nisab.
          </li>
        </ul>
        <p>
          Before you buy, or to check a receipt, enter the weight and today’s price in the{" "}
          <Link href={calculator} className={link}>
            Gold Price &amp; Bhori Calculator
          </Link>
          . You’ll see grams, bhori, ana-roti-point and the total with making charge together. It is free, needs
          no signup, and your weights and prices never leave your device.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources and dates">
        <ul>
          <li>
            Units (11.664 g, 16 ana, 96 roti, 960 point):{" "}
            <a href={WIKIPEDIA_BHORI} target="_blank" rel="noopener" className={link}>
              Wikipedia, “Bhori”
            </a>
            , and BAJUS price notices that quote “per bhori (11.664 grams)”.
          </li>
          <li>
            Today’s price and the four grades:{" "}
            <a href={BAJUS_SOURCE.url} target="_blank" rel="noopener" className={link}>
              {BAJUS_SOURCE.title}
            </a>{" "}
            (prices change often).
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
          <li>
            Gold nisab:{" "}
            <a href={IFB_ZAKAT_POLICY} target="_blank" rel="noopener" className={link}>
              Islamic Foundation Bangladesh, Zakat Fund: Introduction and Guideline
            </a>{" "}
            (in Bangla; 9th edition, February 2025).
          </li>
        </ul>
        <p>
          All checked on 29 October 2026. Prices here are examples only; before you buy or sell, check today’s
          BAJUS price and the shop’s receipt.
        </p>
      </ContentSection>
    </>
  );
}

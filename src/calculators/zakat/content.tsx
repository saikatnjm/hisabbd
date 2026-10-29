import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { ZAKAT_SOURCES } from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const S = ZAKAT_SOURCES;

/** Explanatory content for the Zakat Calculator page (Server Component, no JS). */
export function ZakatCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How zakat is calculated">
        <p>
          <strong>Net zakatable wealth = what you own − debts and bills due now</strong>
        </p>
        <p>
          <strong>If net zakatable wealth ≥ nisab: zakat = net zakatable wealth × 2.5%</strong> (one-fortieth)
        </p>
        <p>
          Zakat is due on wealth you have held for a full lunar (Hijri) year. The calculator does not track dates;
          use the figures on the day your zakat year completes.
        </p>

        <h3>Worked example</h3>
        <p>
          The prices here are <em>examples</em>, not today’s prices. Suppose you have ৳50,000 in cash, ৳3,00,000
          in bank savings and 2 bhori of gold, and you owe ৳50,000 that is due now. At ৳2,00,000 a bhori the gold
          is worth ৳4,00,000, so you own ৳7,50,000 and your net zakatable wealth is <strong>৳7,00,000</strong>.
        </p>
        <ul>
          <li>
            <strong>Silver nisab</strong> at ৳4,000 a bhori of silver: 52.5 × 4,000 = ৳2,10,000. ৳7,00,000 is above
            it, so zakat is 7,00,000 × 2.5% = <strong>৳17,500</strong>.
          </li>
          <li>
            <strong>Gold nisab</strong> at ৳2,00,000 a bhori of gold: 7.5 × 2,00,000 = ৳15,00,000. ৳7,00,000 is
            below it, so on this basis <strong>no zakat is due</strong>.
          </li>
        </ul>
        <p>The same wealth gives different answers, which is why the nisab basis matters.</p>
      </ContentSection>

      <ContentSection id="nisab" title="The nisab: silver or gold?">
        <p>
          The nisab is the minimum wealth on which zakat becomes due: <strong>7.5 bhori (87.48 g) of gold</strong>{" "}
          or <strong>52.5 bhori (612.36 g) of silver</strong>, with 1 bhori (tola) = 11.664 g. In Taka, the
          nisab is that weight × today’s price per bhori, so it moves with the market.
        </p>
        <p>
          Scholars differ on which to use. The silver nisab is far lower, so more people pay zakat, and many
          organisations collecting zakat in Bangladesh encourage it. Others prefer the gold nisab so that people
          with small savings aren’t made zakat payers. There is no national nisab guideline. The calculator lets
          you choose either and shows the amount; <strong>ask a scholar you trust for your situation</strong>.
        </p>
        <p>
          <strong>Nisab for 2026–27 (1448 AH).</strong> Islamic Foundation Bangladesh announces the fitra rates
          each Ramadan (for 1447 AH on 25 February 2026), but we found no Islamic Foundation announcement of a
          zakat nisab amount in Taka for 1447 or 1448 (checked 29 October 2026). So no amount is filled in: enter
          today’s price per bhori from{" "}
          <a href={S.bajus.url} target="_blank" rel="noopener" className={link}>
            BAJUS
          </a>{" "}
          and the calculator works out the nisab.
        </p>
      </ContentSection>

      <ContentSection id="what-counts" title="What to include">
        <ul>
          <li>
            <strong>Cash in hand</strong>, and <strong>bank balances and savings</strong>, including the principal
            in DPS, FDR and Sanchayapatra (see the{" "}
            <Link href={calculatorPath("dps-calculator")} className={link}>
              DPS Calculator
            </Link>{" "}
            and{" "}
            <Link href={calculatorPath("sanchayapatra-calculator")} className={link}>
              Sanchayapatra Profit Calculator
            </Link>{" "}
            for what yours has grown to).
          </li>
          <li>
            <strong>Gold and silver</strong>, by weight in bhori or grams and the price per bhori. To turn ana and
            roti into bhori, use the{" "}
            <Link href={calculatorPath("gold-calculator")} className={link}>
              Gold Price &amp; Bhori Calculator
            </Link>
            .
          </li>
          <li>
            <strong>Business stock</strong> held for sale, at what it would sell for today.
          </li>
          <li>
            <strong>Money owed to you</strong> that you expect to get back.
          </li>
          <li>
            <strong>Other zakatable assets</strong>, in Taka.
          </li>
          <li>
            Then subtract <strong>debts and bills due now</strong>.
          </li>
        </ul>
        <p>
          Your home, furniture, car, clothes and tools you work with are basic needs and are not entered here.
        </p>
      </ContentSection>

      <ContentSection id="ask-a-scholar" title="Not a fatwa: ask about special cases">
        <p>
          This is a general calculation of the widely documented basics. It does not decide religious questions.
          Ask a scholar about, for example:
        </p>
        <ul>
          <li>
            <strong>Jewellery for personal use.</strong> Scholars differ: some count all gold and silver
            jewellery, others exempt jewellery worn in normal use.
          </li>
          <li>Pension, gratuity and provident funds you can’t yet withdraw.</li>
          <li>Long-term loans such as a home loan, and how much of them to subtract.</li>
          <li>Profit or interest built up in savings schemes, shares, crypto, and property or rental income.</li>
          <li>Which day’s price to use, and the selling or the buy-back price of gold and silver.</li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose the nisab basis: Silver (52.5 bhori) or Gold (7.5 bhori).</li>
          <li>Choose whether you’ll enter gold and silver weight in Bhori or Grams.</li>
          <li>
            Fill in what applies: Cash in hand, Bank balances and savings, gold and silver weights and prices,
            Business stock, Money owed to you and Other zakatable assets. Leave the rest blank.
          </li>
          <li>
            Enter the price per bhori of the metal you chose for the nisab (Silver price per bhori or Gold price
            per bhori), even if you own none of it.
          </li>
          <li>Enter Debts and bills due now, then select Calculate zakat.</li>
        </ol>
        <p>
          Calculations keep full precision and are rounded to the paisa only for display. The nisab basis and
          weight unit are remembered on this device; amounts are kept only in your recent calculations, which you
          can turn off.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            Rate of one-fortieth after a year, on 200 dirhams of silver and 20 dinars of gold:{" "}
            <a href={S.hadith.url} target="_blank" rel="noopener" className={link}>
              {S.hadith.title}
            </a>
            .
          </li>
          <li>
            Nisab of 7.5 tola of gold or 52.5 tola of silver:{" "}
            <a href={S.nisabBasics.url} target="_blank" rel="noopener" className={link}>
              {S.nisabBasics.title}
            </a>
            .
          </li>
          <li>
            Silver and gold nisab, and why scholars differ:{" "}
            <a href={S.nisabDebate.url} target="_blank" rel="noopener" className={link}>
              {S.nisabDebate.title}
            </a>
            ; no national nisab guideline:{" "}
            <a href={S.noNationalGuideline.url} target="_blank" rel="noopener" className={link}>
              {S.noNationalGuideline.title}
            </a>
            .
          </li>
          <li>
            Islamic Foundation fitra rates for 1447 AH:{" "}
            <a href={S.fitra1447.url} target="_blank" rel="noopener" className={link}>
              {S.fitra1447.title}
            </a>
            .
          </li>
        </ul>
        <p>All checked on 29 October 2026.</p>
      </ContentSection>
    </>
  );
}

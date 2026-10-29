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

const IFB_ZAKAT_POLICY = "https://www.islamicfoundation.gov.bd/pages/policies/6922d8fedbfbab28ce047438";
const BAJUS_PRICE = "https://www.bajus.org/gold-price";
const BANGLA_TRIBUNE_2025 = "https://www.banglatribune.com/others/religion/891062";

/** Worked example with illustrative prices: 22-carat gold ৳2,25,000 and silver ৳3,800 per bhori. */
const ASSETS: readonly [item: string, amount: string][] = [
  ["Cash at home", "40,000"],
  ["Bank savings account", "1,50,000"],
  ["Sanchayapatra (principal)", "2,00,000"],
  ["Gold jewellery, 2 bhori × ৳2,25,000", "4,50,000"],
  ["Less: debts due now", "−30,000"],
];

/** English guide: zakat nisab and how to calculate zakat (Server Component, no JS). */
export function ZakatNisabGuideContent() {
  const calculator = localePath("en", calculatorPath("zakat-calculator"));
  const gold = localePath("en", calculatorPath("gold-calculator"));

  return (
    <>
      <ContentSection id="who" title="Who has to pay zakat">
        <p>
          According to the Islamic Foundation Bangladesh booklet “Zakat Fund: Introduction and Guideline”
          (Zakat Tahabil Porichiti O Nitimala), zakat becomes due when a person:
        </p>
        <ul>
          <li>is Muslim, adult and of sound mind;</li>
          <li>
            owns wealth of at least the <strong>nisab</strong> over and above basic needs such as food,
            clothing, the home they live in, tools of their trade and vehicles they use;
          </li>
          <li>still has the nisab after paying off debts;</li>
          <li>has full ownership of that wealth; and</li>
          <li>
            has held the nisab for <strong>one full lunar year</strong> from the day they first owned it.
            The booklet adds that if wealth dips below the nisab during the year but is at or above it at
            the start and the end, zakat is still due.
          </li>
        </ul>
        <p>
          Many people pay zakat in Ramadan, but the date to calculate on is the day your own zakat year
          completes. To work it out with your own figures, use the{" "}
          <Link href={calculator} className={link}>
            Zakat Calculator
          </Link>
          ; the rules behind it are explained below.
        </p>
      </ContentSection>

      <ContentSection id="nisab" title="The nisab: 7.5 bhori of gold, 52.5 bhori of silver">
        <ul>
          <li>
            <strong>Gold nisab:</strong> 7.5 bhori (tola), which is 87.48 grams.
          </li>
          <li>
            <strong>Silver nisab:</strong> 52.5 bhori, about 612.36 grams (taking 1 bhori as 11.664 grams).
          </li>
        </ul>
        <p>
          <strong>Nisab in Taka = nisab in bhori × today’s price per bhori</strong>
        </p>
        <p>
          If you own only gold, the gold nisab applies. For cash, bank balances, trade goods or a mix of
          assets, the Islamic Foundation’s guideline says to use whichever nisab is worth less, and since
          silver is currently worth less, the silver nisab is the deciding one. Some people use the gold
          nisab for cash too. Scholars differ on this, so ask a scholar you trust. The worked example below
          shows both.
        </p>
        <h3>What is this year’s nisab in Taka?</h3>
        <p>
          Gold and silver prices change, so the nisab in Taka changes too. As of 29 October 2026 we found no
          fixed Taka nisab on the Islamic Foundation’s website for 1447 AH (Ramadan 2026) or 1448 AH (Ramadan
          2027, expected around February subject to moon sighting); its guideline states the nisab in bhori.
          Taka figures in the press usually come from private organisations, worked out at one day’s price.
          In Ramadan 2025, for example, one Shariah research organisation put the silver nisab at ৳88,000
          using a wholesale silver price of ৳1,680 per bhori; silver is now far dearer than that. So work it
          out yourself at the price on your zakat date.
        </p>
        <p>
          The Bangladesh Jewellers Association (BAJUS) publishes gold and silver prices, currently per gram.
          Multiply the price per gram by 11.664 to get the price per bhori. BAJUS lists separate prices for
          22, 21 and 18 carat and traditional metal, and which price you use (retail or wholesale) changes
          the nisab; ask your scholar about that too. For bhori and gram sums, the{" "}
          <Link href={gold} className={link}>
            Gold Price Calculator
          </Link>{" "}
          helps.
        </p>
      </ContentSection>

      <ContentSection id="assets" title="Which wealth counts, and which does not">
        <p>The Islamic Foundation’s guideline lists as zakatable:</p>
        <ul>
          <li>gold and silver, in any form;</li>
          <li>cash, money in any account at a local or foreign bank, bonds, debentures, treasury bills and money paid into insurance policies;</li>
          <li>money owed to you that you can expect to get back;</li>
          <li>goods, land and flats bought or made for sale, and shares, at market value.</li>
        </ul>
        <p>
          There is no zakat on the home you live in, furniture and household items, clothes you wear, a car
          you use, tools of your work, or land that is not held for trade.
        </p>
        <h3>Jewellery in personal use: scholars differ</h3>
        <p>
          The Islamic Foundation’s guideline says the same rule applies to all gold and silver jewellery,
          and that zakat is due on gold in use too. Other scholars and schools of thought hold that
          jewellery worn for personal use is exempt. This guide gives no religious ruling; ask a scholar you
          trust which view to follow in your situation.
        </p>
      </ContentSection>

      <ContentSection id="how" title="Working out 2.5%, step by step">
        <ol>
          <li>On the day your zakat year completes, list all your zakatable wealth.</li>
          <li>Convert gold and silver to Taka at that day’s price: bhori × price per bhori.</li>
          <li>Add cash, bank balances, sanchayapatra, money owed to you and trade goods.</li>
          <li>Subtract debts that are due now. Ask a scholar how to treat long-term loans.</li>
          <li>If what remains is at or above the nisab, zakat is due.</li>
          <li>
            <strong>Zakat = net zakatable wealth × 2.5 ÷ 100</strong>, which is ৳25 per ৳1,000, or the total
            divided by 40.
          </li>
        </ol>
        <p>
          To see how much is in your savings certificates and the profit they pay each year, check the{" "}
          <Link href={localePath("en", calculatorPath("sanchayapatra-calculator"))} className={link}>
            Sanchayapatra Profit Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example (illustrative prices)">
        <p>
          <strong>These prices are only for illustration, not today’s rates:</strong> suppose 22-carat gold
          is ৳2,25,000 per bhori and silver is ৳3,800 per bhori. Then the silver nisab is 52.5 × 3,800 ={" "}
          <strong>৳1,99,500</strong> and the gold nisab is 7.5 × 2,25,000 = <strong>৳16,87,500</strong>.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Wealth</th>
                <th scope="col" className={headNum}>Taka (৳)</th>
              </tr>
            </thead>
            <tbody>
              {ASSETS.map(([item, amount]) => (
                <tr key={item}>
                  <th scope="row" className={`${cell} font-normal`}>{item}</th>
                  <td className={num}>{amount}</td>
                </tr>
              ))}
              <tr>
                <th scope="row" className={`${cell} font-semibold text-slate-900`}>Net zakatable wealth</th>
                <td className={`${num} font-semibold text-slate-900`}>8,10,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul>
          <li>
            <strong>Silver nisab, jewellery included:</strong> ৳8,10,000 is above the nisab, so zakat =
            8,10,000 × 2.5% = <strong>৳20,250</strong>. To check: ৳8,10,000 is 810 thousands, and 810 × ৳25
            = ৳20,250.
          </li>
          <li>
            <strong>Silver nisab, jewellery in personal use left out</strong> (for those who follow that
            view): 8,10,000 − 4,50,000 = ৳3,60,000, so zakat is <strong>৳9,000</strong>.
          </li>
          <li>
            <strong>Gold nisab:</strong> both ৳8,10,000 and ৳3,60,000 are below ৳16,87,500, so on this view
            no zakat is due.
          </li>
        </ul>
        <p>
          Because the same wealth gives such different answers, settle which basis you follow first. Then
          enter your figures and the price on your zakat date in the{" "}
          <Link href={calculator} className={link}>
            Zakat Calculator
          </Link>
          . Your numbers stay on your phone or computer.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources and dates">
        <ul>
          <li>
            Conditions, nisab, zakatable and exempt wealth, jewellery:{" "}
            <a href={IFB_ZAKAT_POLICY} target="_blank" rel="noopener" className={link}>
              Islamic Foundation Bangladesh, Zakat Fund: Introduction and Guideline
            </a>{" "}
            (in Bangla; 9th edition, February 2025; viewed 29 October 2026).
          </li>
          <li>
            Gold and silver prices:{" "}
            <a href={BAJUS_PRICE} target="_blank" rel="noopener" className={link}>
              Bangladesh Jewellers Association (BAJUS)
            </a>{" "}
            (prices change often; viewed 29 October 2026).
          </li>
          <li>
            The ৳88,000 silver-based nisab for 2025:{" "}
            <a href={BANGLA_TRIBUNE_2025} target="_blank" rel="noopener" className={link}>
              Bangla Tribune, 21 March 2025
            </a>{" "}
            (in Bangla).
          </li>
        </ul>
        <p>
          This guide explains the arithmetic only and gives no religious ruling. For your own situation,
          ask a scholar you trust.
        </p>
      </ContentSection>
    </>
  );
}

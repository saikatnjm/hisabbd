import Link from "next/link";
import { EXCISE_TABLE, exciseBandRanges, SOURCE_TAX_SOURCES } from "@/calculators/fdr/deposit-tax";
import { calculatorPath } from "@/calculators/paths";
import { IRD_RATE_ORDER, SOURCE_TAX_RULES } from "@/calculators/sanchayapatra/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatPlainDate, formatTaka } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Side-by-side features: topic, FDR, DPS, Sanchayapatra (facts from the three calculators' pages). */
const COMPARISON: readonly [topic: string, fdr: string, dps: string, sanchayapatra: string][] = [
  ["How you put money in", "One lump sum", "The same instalment every month", "One lump sum"],
  ["Who sets the rate", "Each bank", "Each bank", "The government, reviewed every 6 months"],
  ["Interest or profit", "Simple, or compound if reinvested", "Compound (monthly, quarterly or yearly)", "Simple"],
  ["When you receive it", "Along the way, or at maturity", "All at maturity", "Monthly, quarterly or at maturity"],
  ["Source tax", "Section 102: 10%, or 15% without proof of return", "Section 102: 10%, or 15% without proof of return", "Section 105: 10% (lower rates reported in some cases)"],
  ["Encashing early", "On the bank’s terms, possibly at a lower rate", "On the bank’s terms, possibly at a lower rate", "Lower rate for completed years; extra profit taken from the principal"],
];

function publishedOn(iso: string): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date) : iso;
}

/** English guide: how FDR and DPS returns are calculated and compared (Server Component, no JS). */
export function FdrVsDpsGuideContent() {
  const calculator = localePath("en", calculatorPath("dps-calculator"));
  const fdr = localePath("en", calculatorPath("fdr-calculator"));
  const sanchayapatra = localePath("en", calculatorPath("sanchayapatra-calculator"));

  return (
    <>
      <ContentSection id="difference" title="FDR and DPS: the basic difference">
        <p>
          Both are bank deposits, but you pay in differently. With an <strong>FDR</strong> (fixed deposit
          receipt, ফিক্সড ডিপোজিট) you place one lump sum for a fixed term. With a <strong>DPS</strong> (deposit
          pension scheme, a monthly savings scheme) you pay the same instalment every month and get your
          deposits and interest back together at maturity.
        </p>
        <p>
          That is why “which earns more?” cannot be answered from the interest rate alone. In an FDR, all of
          your money earns interest from day one; in a DPS, each instalment earns interest only from the month
          you pay it. The sums work differently, and which one fits depends on whether you already have the
          money in hand or will save it from your income each month. To try your own instalment, use the{" "}
          <Link href={calculator} className={link}>
            DPS calculator
          </Link>
          . Below, both calculations step by step.
        </p>
      </ContentSection>

      <ContentSection id="fdr" title="How FDR interest is calculated">
        <p>
          <strong>Simple interest = deposit × yearly rate ÷ 100 × months ÷ 12.</strong> If the bank adds the
          interest to your deposit every p months (1, 3 or 12), it compounds:{" "}
          <strong>maturity value = deposit × (1 + rate ÷ 100 × p ÷ 12)^(number of credits)</strong>.
        </p>
        <ul>
          <li>
            <strong>৳1,00,000 for 1 year at 9%, simple:</strong> interest ৳9,000, 10% tax ৳900, no excise. You
            receive <strong>৳1,08,100</strong>.
          </li>
          <li>
            <strong>৳5,00,000 for 3 years at 10%, reinvested quarterly:</strong> 5,00,000 × 1.025^12 ≈
            ৳6,72,444, so interest is about ৳1,72,444, tax about ৳17,244 and estimated excise ৳1,500. You
            receive about <strong>৳6,53,700</strong>.
          </li>
        </ul>
        <p>
          Compounding quarterly makes 10% a year worth about 10.38% a year before tax. For your own deposit,
          use the{" "}
          <Link href={fdr} className={link}>
            FDR calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="dps" title="How DPS interest is calculated">
        <p>
          Each instalment is paid at the start of the month and earns interest from that month; the scheme
          matures one month after the last instalment. With monthly compounding:
        </p>
        <p>
          <strong>Maturity value = A × ((1 + i)ⁿ − 1) ÷ i × (1 + i)</strong>, where A is the monthly
          instalment, i = yearly rate ÷ 12 ÷ 100 and n = years × 12.
        </p>
        <ul>
          <li>
            <strong>৳5,000 a month for 5 years at 9%:</strong> you pay in ৳3,00,000 and it grows to about
            ৳3,79,949, so interest is about ৳79,949 and tax about ৳7,995. The balance never goes above ৳4 lakh,
            so there is no excise. You receive about <strong>৳3,71,954</strong>.
          </li>
          <li>
            <strong>৳10,000 a month for 5 years at 10%:</strong> you pay in ৳6,00,000 and it grows to about
            ৳7,80,824, with interest of about ৳1,80,824, tax ৳18,082 and estimated excise ৳1,150. You receive
            about <strong>৳7,61,591</strong>.
          </li>
        </ul>
        <p>
          In the first example the first ৳5,000 earns interest for all 60 months, but the last ৳5,000 for
          only 1 month. So at the same rate, DPS interest looks small next to the total paid in; that is how
          the sum works, not a sign of a worse return. How often interest is credited matters too: the same
          DPS reaches about ৳3,79,278 with quarterly compounding and about ৳3,76,588 with yearly compounding.
        </p>
      </ContentSection>

      <ContentSection id="tax-and-excise" title="Source tax and excise duty">
        <p>
          Under section 102 of the Income Tax Act 2023, banks deduct <strong>10%</strong> source tax from both
          FDR and DPS interest. If you must file a return but do not give the bank proof of return submission
          (PSR), section 142 makes it <strong>15%</strong>. On the ৳1,00,000 FDR above, the tax would then be
          ৳1,350, leaving ৳1,07,650.
        </p>
        <p>
          Excise duty is charged on each account once per calendar year, based on the highest balance that
          year. The FY2026-27 bands, as reported:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Highest balance in the year</th>
                <th scope="col" className={headNum}>Excise duty</th>
              </tr>
            </thead>
            <tbody>
              {exciseBandRanges().map((band) => (
                <tr key={band.from}>
                  <th scope="row" className={`${cell} font-normal`}>
                    {band.to === null
                      ? `Above ${formatTaka(band.from - 1)}`
                      : band.from === 0
                        ? `Up to ${formatTaka(band.to)}`
                        : `${formatTaka(band.from)} to ${formatTaka(band.to)}`}
                  </th>
                  <td className={num}>{band.duty === 0 ? "Nil" : formatTaka(band.duty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The duty is a fixed Taka amount, not a share of the interest. In the ৳10,000-a-month DPS, the
          balance passes ৳4 lakh in year 3 (৳150) and ৳5 lakh in years 4 and 5 (৳500 each). How many times it is
          actually charged depends on how many Decembers fall inside the term.
        </p>
      </ContentSection>

      <ContentSection id="sanchayapatra" title="How Sanchayapatra compares">
        <p>
          Sanchayapatra is not a bank deposit but a government savings scheme. The government sets its rate,
          profit is simple, and the rate on the day you buy holds for the whole term. For example, ৳1,00,000
          in the 5-year Bangladesh Sanchayapatra at 11.83% pays ৳1,53,235 at maturity after 10% source tax. For
          your own amount, use the{" "}
          <Link href={sanchayapatra} className={link}>
            Sanchayapatra Profit Calculator
          </Link>
          .
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className={head}>Feature</th>
                <th scope="col" className={head}>FDR</th>
                <th scope="col" className={head}>DPS</th>
                <th scope="col" className={head}>Sanchayapatra</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([topic, fdrText, dpsText, sanchayapatraText]) => (
                <tr key={topic}>
                  <th scope="row" className={`${cell} font-normal`}>{topic}</th>
                  <td className={cell}>{fdrText}</td>
                  <td className={cell}>{dpsText}</td>
                  <td className={cell}>{sanchayapatraText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="compare" title="What to line up before you compare">
        <ul>
          <li>
            <strong>The same term and amount.</strong> A 1-year FDR and a 5-year DPS are not directly
            comparable.
          </li>
          <li>
            <strong>What you receive after tax and excise.</strong> Compare net amounts, not gross interest.
          </li>
          <li>
            <strong>How often interest compounds.</strong> At the same rate, monthly compounding earns a little
            more.
          </li>
          <li>
            <strong>Early encashment terms.</strong> If you need the money before maturity, all three may pay
            less.
          </li>
          <li>
            <strong>Your bank’s rate and method.</strong> Rates differ between banks, and day counts or
            rounding change the figures slightly.
          </li>
          <li>
            <strong>The rate on renewal.</strong> A renewed FDR may get a new rate; a Sanchayapatra keeps the
            rate of its issue date until maturity.
          </li>
          <li>
            <strong>Missed instalments.</strong> A bank may charge a late fee on a DPS; the calculator assumes
            every instalment is paid on time.
          </li>
        </ul>
        <p>
          To see the net amount of a monthly saving at your bank’s rate, enter the instalment, rate, term and
          tax in the{" "}
          <Link href={calculator} className={link}>
            DPS calculator
          </Link>
          . This guide explains the arithmetic only; it does not recommend any product and is not investment
          advice.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          {[...SOURCE_TAX_SOURCES, ...EXCISE_TABLE.sources].map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>{" "}
              ({publishedOn(source.published)})
            </li>
          ))}
          <li>
            Sanchayapatra rates:{" "}
            <a href={IRD_RATE_ORDER.url} target="_blank" rel="noopener" className={link}>
              Internal Resources Division order
            </a>{" "}
            (30 June 2025); source tax:{" "}
            <a href={SOURCE_TAX_RULES.standard.source.url} target="_blank" rel="noopener" className={link}>
              Bangla Tribune
            </a>{" "}
            (3 February 2026).
          </li>
        </ul>
        <p>
          Tax and excise checked on 28 October 2026. They can change with each budget, and bank interest rates
          change often, so ask your bank for its latest rate. What your bank deducts is final.
        </p>
      </ContentSection>
    </>
  );
}

import Link from "next/link";
import {
  EXCISE_TABLE,
  exciseBandRanges,
  SOURCE_TAX_PRESETS,
  SOURCE_TAX_SOURCES,
} from "@/calculators/fdr/deposit-tax";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatPlainDate, formatTaka } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";

const link = "font-semibold text-brand-700 underline underline-offset-4";

function publishedOn(iso: string): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date) : iso;
}

/** Explanatory content for the DPS Calculator page (Server Component, no JS). */
export function DpsCalculatorContent() {
  const fdr = localePath("en", calculatorPath("fdr-calculator"));
  const sanchayapatra = localePath("en", calculatorPath("sanchayapatra-calculator"));
  const emi = localePath("en", calculatorPath("emi-calculator"));

  return (
    <>
      <ContentSection id="how-it-works" title="How DPS maturity is calculated">
        <p>
          A DPS (deposit pension scheme, মাসিক সঞ্চয় স্কিম) is a monthly savings plan: you pay the same
          instalment every month for a fixed number of years, and the bank pays the deposits plus interest at
          the end.
        </p>
        <p>
          <strong>Timing assumed:</strong> each instalment is paid at the <em>start</em> of the month, so it earns
          interest for that month, and the scheme matures one month after the last instalment. In maths terms
          this is an annuity-due. With interest compounded monthly:
        </p>
        <p>
          <strong>Maturity value = A × ((1 + i)ⁿ − 1) ÷ i × (1 + i)</strong>
        </p>
        <ul>
          <li>
            <strong>A</strong> is the monthly instalment.
          </li>
          <li>
            <strong>i</strong> is the monthly rate: yearly rate ÷ 12 ÷ 100.
          </li>
          <li>
            <strong>n</strong> is the number of instalments: years × 12.
          </li>
        </ul>
        <p>
          Total deposits = A × n, interest = maturity value − total deposits, and{" "}
          <strong>you receive = maturity value − tax at source − excise duty</strong>. With quarterly or yearly
          compounding, interest builds up each month but is added to the balance only every 3 or 12 months.
        </p>

        <h3>Example 1: ৳5,000 a month for 5 years at 9%</h3>
        <p>
          i = 9 ÷ 12 ÷ 100 = 0.0075 and n = 60. Maturity = 5,000 × (1.0075⁶⁰ − 1) ÷ 0.0075 × 1.0075 ≈{" "}
          <strong>৳3,79,949</strong>. You deposit ৳3,00,000, so the interest is about ৳79,949. Tax at 10% is
          about ৳7,995. The balance is about ৳63,007, ৳1,31,924, ৳2,07,307, ৳2,89,761 and ৳3,79,949 at the end
          of each year, never above ৳4 lakh, so there is no excise duty. You receive about{" "}
          <strong>৳3,71,954</strong>. With quarterly compounding the maturity value would be about ৳3,79,278,
          and with yearly about ৳3,76,588.
        </p>
        <h3>Example 2: ৳10,000 a month for 5 years at 10%</h3>
        <p>
          The DPS grows to about <strong>৳7,80,824</strong> on deposits of ৳6,00,000: about ৳1,80,824 of
          interest and ৳18,082 of tax at 10%. The year-end balance passes ৳4 lakh in year 3 (about ৳4,21,300,
          excise ৳150) and ৳5 lakh in years 4 and 5 (৳500 each), so the estimated excise is ৳1,150. You receive
          about <strong>৳7,61,591</strong>.
        </p>
      </ContentSection>

      <ContentSection id="compounding" title="Monthly or quarterly compounding?">
        <p>
          Banks in Bangladesh set their own DPS terms. Monthly compounding is what most DPS calculators and many
          bank tables use, so it is selected first, but we could not confirm a single rule from an official
          source. If your DPS form or bank says quarterly or yearly, choose that: less frequent compounding gives
          slightly less interest.
        </p>
      </ContentSection>

      <ContentSection id="tax-and-excise" title="Tax at source and excise duty on a DPS">
        <h3>Tax deducted at source</h3>
        <p>
          Banks deduct tax from deposit interest under section 102 of the Income Tax Act 2023:{" "}
          <strong>{SOURCE_TAX_PRESETS.standard.value}%</strong> for individuals. If you are required to file a
          tax return but do not give the bank proof of return submission (PSR), it deducts 50% more under
          section 142: <strong>{SOURCE_TAX_PRESETS.noReturnProof.value}%</strong>. The old “10% with TIN, 15%
          without” rule came from the Income Tax Ordinance 1984. Companies and trusts pay 20%; use “Other rate”.
        </p>
        <p>
          The calculator takes the tax from the total interest. If your bank deducts it each time interest is
          credited during the scheme, the tax taken stops earning interest and the bank’s net figure is a little
          lower.
        </p>
        <h3>Excise duty</h3>
        <p>
          Excise duty is charged once per calendar year on each account, including DPS accounts, if the balance
          reaches a band at any time from January to December. It is usually deducted in December. The bands for
          FY2026-27 (from 1 July 2026), as reported:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] text-left text-sm">
            <caption className="sr-only">Excise duty on bank balances for FY2026-27, as reported</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 font-medium">Highest balance in the year</th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">Excise duty</th>
              </tr>
            </thead>
            <tbody>
              {exciseBandRanges().map((band) => (
                <tr key={band.from} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 font-normal">
                    {band.to === null
                      ? `Above ${formatTaka(band.from - 1)}`
                      : band.from === 0
                        ? `Up to ${formatTaka(band.to)}`
                        : `${formatTaka(band.from)} to ${formatTaka(band.to)}`}
                  </th>
                  <td className="py-2 pl-3 text-right">{band.duty === 0 ? "Nil" : formatTaka(band.duty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The ৳4 lakh threshold (up from ৳3 lakh) was in the Finance Bill 2026, passed on 29 June 2026; we could
          not check the enacted schedule text, and the other bands are reported unchanged from FY2025-26. The
          calculator estimates one charge per scheme year on that year’s closing balance, which is the highest
          balance in the year because a DPS only grows. The real count depends on the month you start. You can
          enter your own total or leave excise out.
        </p>
      </ContentSection>

      <ContentSection id="bank-differences" title="Your bank’s figures may differ">
        <p>Treat the result as a close estimate. Your bank’s DPS table or statement may differ because it:</p>
        <ul>
          <li>compounds quarterly, or counts interest by days instead of months;</li>
          <li>rounds every month, or deducts tax as interest is credited;</li>
          <li>sets a different rate for each tenure, or charges fees;</li>
          <li>charges late fees for missed instalments, or a lower rate if you close early.</li>
        </ul>
        <p>
          Rates differ between banks and change often, so there are no rate presets here: use the rate your bank
          quotes for your tenure.
        </p>
      </ContentSection>

      <ContentSection id="compare" title="DPS, FDR or Sanchayapatra?">
        <p>
          A DPS suits saving a fixed amount from your income every month. If you already have a lump sum, see
          what it earns as a fixed deposit with the{" "}
          <Link href={fdr} className={link}>
            FDR calculator
          </Link>
          . Government savings certificates pay their own rates with their own limits and tax rules; compare
          them with the{" "}
          <Link href={sanchayapatra} className={link}>
            Sanchayapatra calculator
          </Link>
          . If you are weighing a monthly DPS against paying off a loan faster, the{" "}
          <Link href={emi} className={link}>
            EMI calculator
          </Link>{" "}
          shows what the loan costs.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the monthly instalment in Taka.</li>
          <li>Enter the interest rate per year that your bank quotes for the tenure.</li>
          <li>Enter the tenure in whole years (1 to 30).</li>
          <li>Choose monthly, quarterly or yearly compounding (monthly if unsure).</li>
          <li>Choose the tax at source (10%, 15% or another rate) and how to include excise duty.</li>
          <li>Select Calculate DPS to see the amount you receive and the year-by-year table.</li>
        </ol>
        <p>
          The compounding, tax and excise choices are remembered in this browser. Amounts you type stay on your
          device and are never sent anywhere.
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
        </ul>
        <p>
          All checked on 28 October 2026. Figures can change with each budget, and your bank’s deduction is
          final.
        </p>
      </ContentSection>
    </>
  );
}

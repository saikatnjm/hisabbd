import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatPlainDate, formatTaka } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";
import { EXCISE_TABLE, exciseBandRanges, SOURCE_TAX_PRESETS, SOURCE_TAX_SOURCES } from "./deposit-tax";

const link = "font-semibold text-brand-700 underline underline-offset-4";

function publishedOn(iso: string): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date) : iso;
}

/** Explanatory content for the FDR Calculator page (Server Component, no JS). */
export function FdrCalculatorContent() {
  const dps = localePath("en", calculatorPath("dps-calculator"));
  const sanchayapatra = localePath("en", calculatorPath("sanchayapatra-calculator"));
  const emi = localePath("en", calculatorPath("emi-calculator"));

  return (
    <>
      <ContentSection id="how-it-works" title="How FDR interest is calculated">
        <p>
          An FDR (fixed deposit receipt, ফিক্সড ডিপোজিট) earns a fixed yearly rate for a fixed term. Interest
          is worked out month by month, with a month as 1/12 of a year.
        </p>
        <h3>Simple interest (paid out, or paid at maturity)</h3>
        <p>
          <strong>Interest = deposit × yearly rate ÷ 100 × months ÷ 12</strong>
        </p>
        <h3>Interest reinvested (compounded)</h3>
        <p>
          If the bank adds the interest to your deposit every p months (1, 3 or 12), each credit earns interest
          too:
        </p>
        <p>
          <strong>Maturity value = deposit × (1 + rate ÷ 100 × p ÷ 12)^(number of credits)</strong>
        </p>
        <p>
          If the term is not a whole number of periods (for example 18 months with yearly compounding), the
          last part period earns simple interest.
        </p>
        <h3>After tax and excise</h3>
        <p>
          <strong>You receive = maturity value − tax at source − excise duty</strong>, where tax at source =
          interest × tax rate.
        </p>

        <h3>Example 1: ৳1,00,000 for 1 year at 9%</h3>
        <p>
          Simple interest: 1,00,000 × 9 ÷ 100 × 12 ÷ 12 = <strong>৳9,000</strong>. Tax at 10% is ৳900. The
          balance stays under ৳4 lakh, so there is no excise duty. You receive <strong>৳1,08,100</strong>.
          Without proof of return where one is required (15%), the tax is ৳1,350 and you receive ৳1,07,650.
        </p>
        <h3>Example 2: ৳5,00,000 for 3 years at 10%, reinvested quarterly</h3>
        <p>
          5,00,000 × (1 + 0.10 × 3 ÷ 12)^12 = 5,00,000 × 1.025^12 ≈ <strong>৳6,72,444</strong>, so the interest
          is about ৳1,72,444. Tax at 10% is about ৳17,244. The balance is about ৳5,51,906, ৳6,09,201 and
          ৳6,72,444 at the end of each year, all in the ৳5–10 lakh band, so the estimated excise duty is ৳500 a
          year, ৳1,500 in total. You receive about <strong>৳6,53,700</strong>. Compounding quarterly makes 10% a
          year worth about 10.38% a year before tax.
        </p>
      </ContentSection>

      <ContentSection id="tax-and-excise" title="Tax at source and excise duty on an FDR">
        <h3>Tax deducted at source</h3>
        <p>
          Banks deduct tax from FDR and savings interest under section 102 of the Income Tax Act 2023. For an
          individual the rate is <strong>{SOURCE_TAX_PRESETS.standard.value}%</strong> of the interest. If you
          are required to file a tax return but do not give the bank proof of return submission (PSR), the bank
          deducts 50% more under section 142: <strong>{SOURCE_TAX_PRESETS.noReturnProof.value}%</strong>.
          Companies, trusts and associations of persons pay 20%; choose “Other rate” for that.
        </p>
        <p>
          You may have heard “10% with TIN, 15% without”. That was the rule under the old Income Tax Ordinance
          1984. We could not confirm from the sources below which balance makes a PSR necessary for deposits,
          so the calculator lets you choose.
        </p>
        <h3>Excise duty</h3>
        <p>
          Excise duty is a fixed charge per account per calendar year, taken once if the balance reaches a band
          at any time from January to December. Banks usually deduct it in December. It applies to FDRs, DPS
          and savings accounts. The bands below apply for FY2026-27 (from 1 July 2026), as reported:
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
          The ৳4 lakh threshold (up from ৳3 lakh) was in the Finance Bill 2026, which Parliament passed on 29
          June 2026. We could not check the enacted schedule text itself, and the other bands are reported as
          unchanged from FY2025-26. The calculator estimates one charge for each year of the term, on the
          balance at the end of that year; how many Decembers your FDR actually spans decides the real count.
          You can enter your own total or leave excise out.
        </p>
      </ContentSection>

      <ContentSection id="bank-differences" title="Your bank’s figures may differ">
        <p>
          This calculator uses the standard monthly method, so treat its result as a close estimate. Your
          bank’s statement may differ slightly because:
        </p>
        <ul>
          <li>it counts interest by days (on a 365- or 360-day year) rather than months;</li>
          <li>it rounds at each interest credit;</li>
          <li>
            it deducts tax each time interest is credited, so the tax no longer earns interest when interest is
            reinvested;
          </li>
          <li>it charges fees, or applies excise duty in a different calendar year;</li>
          <li>your FDR is renewed at a new rate, or encashed early at a lower rate.</li>
        </ul>
        <p>
          Interest rates differ between banks and change often, so there are no rate presets here: use the
          rate your bank quotes for your amount and term.
        </p>
      </ContentSection>

      <ContentSection id="compare" title="FDR, DPS or Sanchayapatra?">
        <p>
          An FDR suits a lump sum you can leave untouched for a fixed term. If you would rather save a fixed
          amount every month, a deposit pension scheme works differently: see what it grows to with the{" "}
          <Link href={dps} className={link}>
            DPS calculator
          </Link>
          . Government savings certificates have their own rates, investment limits and tax rules; compare them
          with the{" "}
          <Link href={sanchayapatra} className={link}>
            Sanchayapatra calculator
          </Link>
          . Planning a loan against your FDR instead of breaking it? The{" "}
          <Link href={emi} className={link}>
            EMI calculator
          </Link>{" "}
          shows the monthly instalment.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the deposit amount in Taka.</li>
          <li>Enter the interest rate per year that your bank quotes.</li>
          <li>Choose the term (3 months to 3 years), or Other to type any number of months.</li>
          <li>Choose how interest is paid: simple, or reinvested monthly, every 3 months or every year.</li>
          <li>Choose the tax at source (10%, 15% or another rate) and how to include excise duty.</li>
          <li>
            Select Calculate FDR. Open “See year-by-year breakdown” for the interest, balance and excise for
            each year.
          </li>
        </ol>
        <p>
          The term, interest type, tax and excise choices are remembered in this browser. Amounts you type stay
          on your device and are never sent anywhere.
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
          All checked on 28 October 2026. The tax rates follow the Income Tax Act 2023 as amended by the
          Finance Ordinance 2025; the excise bands follow the Finance Act 2026. Figures can change with each
          budget, and your bank’s deduction is final.
        </p>
      </ContentSection>
    </>
  );
}

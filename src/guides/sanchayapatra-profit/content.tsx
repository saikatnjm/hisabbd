import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import {
  BUDGET_2026_TAX_REPORT,
  IRD_RATE_ORDER,
  NSD_SCHEMES_PAGE,
  RATES_UNCHANGED_2026,
  SOURCE_TAX_RULES,
} from "@/calculators/sanchayapatra/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Rate held to maturity (% a year), IRD order of 30 June 2025: scheme, payout, up to ৳7.5 lakh, above. */
const RATES: readonly [scheme: string, payout: string, upTo: string, above: string][] = [
  ["Pensioner Sanchayapatra (5 years)", "Monthly", "11.98%", "11.80%"],
  ["Paribar (Family) Sanchayapatra (5 years)", "Monthly", "11.93%", "11.80%"],
  ["5-year Bangladesh Sanchayapatra", "All at maturity", "11.83%", "11.80%"],
  ["3-month profit-bearing (3 years)", "Every 3 months", "11.82%", "11.77%"],
];

/** ৳1,00,000 in each scheme at the rate up to ৳7.5 lakh, 10% source tax (from the calculator's tests). */
const EXAMPLES: readonly [scheme: string, perPayment: string, net: string, total: string][] = [
  ["Paribar, monthly", "৳894.75 a month", "৳53,685", "৳1,53,685"],
  ["3-month, quarterly", "৳2,659.50 a quarter", "৳31,914", "৳1,31,914"],
  ["Bangladesh, at maturity", "৳53,235 once", "৳53,235", "৳1,53,235"],
];

/** English guide: how Sanchayapatra profit and source tax are calculated (Server Component, no JS). */
export function SanchayapatraProfitGuideContent() {
  const calculator = localePath("en", calculatorPath("sanchayapatra-calculator"));
  const fdr = localePath("en", calculatorPath("fdr-calculator"));
  const dps = localePath("en", calculatorPath("dps-calculator"));

  return (
    <>
      <ContentSection id="formula" title="The Sanchayapatra profit formula">
        <p>
          Sanchayapatra (national savings certificate, সঞ্চয়পত্র) profit is <strong>simple</strong>: the same
          amount on your investment every year, with no compounding. Profit is paid out to you rather than
          added to the principal.
        </p>
        <p>
          <strong>Yearly profit = amount × rate ÷ 100</strong>
        </p>
        <ul>
          <li>
            <strong>Paribar and Pensioner Sanchayapatra</strong> pay monthly: yearly profit ÷ 12, 60 payments.
          </li>
          <li>
            <strong>The 3-month profit-bearing Sanchayapatra</strong> pays every 3 months: yearly profit ÷ 4,
            12 payments over 3 years.
          </li>
          <li>
            <strong>The 5-year Bangladesh Sanchayapatra</strong> pays all its profit at maturity, with the
            principal: yearly profit × 5.
          </li>
        </ul>
        <p>
          Source tax is deducted from every payment, and the full principal comes back at maturity. To try
          your own figures straight away, use the{" "}
          <Link href={calculator} className={link}>
            Sanchayapatra Profit Calculator
          </Link>
          . Below are the same sums worked by hand.
        </p>
      </ContentSection>

      <ContentSection id="rates" title="Sanchayapatra profit rates 2026">
        <p>
          The rates come from the Internal Resources Division order of 30 June 2025 and have applied since{" "}
          <strong>1 July 2025</strong>. The government kept them unchanged in January 2026 and again for
          July–December 2026. These are the yearly rates if you hold the certificate to maturity:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Certificate</th>
                <th scope="col" className={head}>Profit paid</th>
                <th scope="col" className={headNum}>Up to ৳7.5 lakh</th>
                <th scope="col" className={headNum}>Above ৳7.5 lakh</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map(([scheme, payout, upTo, above]) => (
                <tr key={scheme}>
                  <th scope="row" className={`${cell} font-normal`}>{scheme}</th>
                  <td className={cell}>{payout}</td>
                  <td className={num}>{upTo}</td>
                  <td className={num}>{above}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>The ৳7.5 lakh tier</strong> depends on your cumulative investment across all national
          savings schemes, not only the certificate you are buying. If your total, including earlier
          certificates, is above ৳7,50,000, the lower rate applies. Rates are reviewed every six months, but a
          certificate keeps the rate of its issue date for its whole term, so for one bought before 1 July
          2025, use the rate printed on it.
        </p>
        <p>
          Paribar Sanchayapatra can be bought by Bangladeshi women aged 18 or over, any person with a
          disability and any citizen aged 65 or over, up to ৳45 lakh in a single name. Pensioner Sanchayapatra
          is for retired government and semi-government employees and certain others, up to ৳50 lakh.
        </p>
      </ContentSection>

      <ContentSection id="examples" title="Worked examples: monthly, quarterly and maturity profit on ৳1 lakh">
        <h3>Paribar Sanchayapatra: monthly profit</h3>
        <ol>
          <li>Yearly profit: 1,00,000 × 11.93 ÷ 100 = ৳11,930.</li>
          <li>Per month: 11,930 ÷ 12 = ৳994.17.</li>
          <li>
            10% source tax: ৳99.42, so you receive <strong>৳894.75 a month</strong>.
          </li>
          <li>Over 5 years: ৳59,650 profit, ৳5,965 tax, ৳53,685 net; ৳1,53,685 with the principal.</li>
        </ol>
        <h3>3-month profit-bearing: quarterly profit</h3>
        <p>
          At 11.82%, the yearly profit is ৳11,820, so each quarter pays 11,820 ÷ 4 = ৳2,955. After 10% tax
          (৳295.50) you receive <strong>৳2,659.50</strong>. Over 3 years: ৳35,460 profit, ৳3,546 tax and
          ৳31,914 net.
        </p>
        <h3>5-year Bangladesh Sanchayapatra: at maturity</h3>
        <p>
          At 11.83%, 1,00,000 × 11.83 ÷ 100 × 5 = ৳59,150. After 10% tax (৳5,915) you receive{" "}
          <strong>৳1,53,235</strong> in one go at maturity.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>৳1,00,000, 10% tax</th>
                <th scope="col" className={headNum}>Each payment</th>
                <th scope="col" className={headNum}>Total net profit</th>
                <th scope="col" className={headNum}>With principal</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map(([scheme, perPayment, net, total]) => (
                <tr key={scheme}>
                  <th scope="row" className={`${cell} font-normal`}>{scheme}</th>
                  <td className={num}>{perPayment}</td>
                  <td className={num}>{net}</td>
                  <td className={num}>{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Larger amounts earn a little less: ৳10,00,000 in Paribar is in the upper tier at 11.80%, so it pays
          ৳9,833.33 a month, or <strong>৳8,850 a month</strong> after ৳983.33 tax.
        </p>
        <h3>Step by step for your own certificate</h3>
        <ol>
          <li>Check whether your total across all certificates is up to or above ৳7.5 lakh, and pick the rate.</li>
          <li>Amount × rate ÷ 100 = yearly profit.</li>
          <li>Divide by 12 for monthly, by 4 for quarterly, or multiply by 5 for maturity.</li>
          <li>Take the source tax off each payment; the rest is what you receive.</li>
        </ol>
      </ContentSection>

      <ContentSection id="tax" title="How much source tax is deducted">
        <p>
          Source tax is deducted from every profit payment under section 105 of the Income Tax Act 2023. The
          calculator pre-fills <strong>{SOURCE_TAX_RULES.standard.value}%</strong>, but other rates have been
          reported for some cases:
        </p>
        <ul>
          <li>
            NBR said in February 2026 that the rate is {SOURCE_TAX_RULES.smallHolder.value}% when your total
            savings-certificate investment is up to ৳5 lakh, and 10% above that.
          </li>
          <li>
            The NSD sheet says Pensioner Sanchayapatra has no source tax for a total up to ৳5 lakh. Then
            ৳5,00,000 at 11.98% pays ৳4,991.67 a month, the full ৳2,99,500 over 5 years.
          </li>
          <li>
            The FY2026-27 Finance Bill was reported to apply 10% to all certificates as an advance, not final,
            tax. Whether the 5% and 0% rates still apply could not be confirmed from an official source.
          </li>
        </ul>
        <p>
          So use the rate your savings office or bank actually deducts, which is shown on your profit
          statement. For your full tax position, ask a tax adviser.
        </p>
      </ContentSection>

      <ContentSection id="early-encashment" title="Encashing early earns less">
        <p>
          All the figures above assume you hold to maturity. According to the National Savings Directorate
          scheme sheets, if you encash early, profit is recalculated at the lower year-end rate for the years
          you have completed, and any extra profit already paid is deducted from your principal. For example,
          Paribar up to ৳7.5 lakh earns 9.81% after 1 year, not 11.93%. Ask your savings office for the exact
          figure before you encash.
        </p>
      </ContentSection>

      <ContentSection id="compare" title="How this differs from an FDR or DPS">
        <ul>
          <li>
            <strong>Who sets the rate:</strong> the government sets Sanchayapatra rates, the same at every
            office. Each bank sets its own FDR and DPS rates.
          </li>
          <li>
            <strong>Simple or compound:</strong> Sanchayapatra profit is simple. FDR interest compounds when it
            is reinvested, and in a DPS each monthly instalment earns interest for a different length of time.
          </li>
          <li>
            <strong>Tax:</strong> section 105 for Sanchayapatra; section 102 for bank deposits (usually 10%, or
            15% without proof of return where one is required). Bank accounts also pay excise duty once a
            year when the balance goes above ৳4 lakh.
          </li>
        </ul>
        <p>
          To see what the same amount earns in a bank, use the{" "}
          <Link href={fdr} className={link}>
            FDR calculator
          </Link>
          , or the{" "}
          <Link href={dps} className={link}>
            DPS calculator
          </Link>{" "}
          if you save monthly. To change the certificate, amount, tier and tax rate and see the monthly or
          maturity profit, go to the{" "}
          <Link href={calculator} className={link}>
            Sanchayapatra Profit Calculator
          </Link>
          . This guide explains the arithmetic only; it is not investment advice.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            Rates:{" "}
            <a href={IRD_RATE_ORDER.url} target="_blank" rel="noopener" className={link}>
              Internal Resources Division order
            </a>
            , 30 June 2025, effective 1 July 2025.
          </li>
          <li>
            Payouts, early encashment and Pensioner tax:{" "}
            <a href={NSD_SCHEMES_PAGE.url} target="_blank" rel="noopener" className={link}>
              National Savings Directorate scheme sheets
            </a>{" "}
            (page updated 9 August 2026).
          </li>
          <li>
            Rates unchanged for July–December 2026:{" "}
            <a href={RATES_UNCHANGED_2026.url} target="_blank" rel="noopener" className={link}>
              Bangla Tribune
            </a>
            , 2 July 2026.
          </li>
          <li>
            Source tax:{" "}
            <a href={SOURCE_TAX_RULES.standard.source.url} target="_blank" rel="noopener" className={link}>
              Bangla Tribune (NBR letter)
            </a>
            , 3 February 2026; FY2026-27 budget:{" "}
            <a href={BUDGET_2026_TAX_REPORT.url} target="_blank" rel="noopener" className={link}>
              Prothom Alo
            </a>
            , 13 June 2026.
          </li>
        </ul>
        <p>
          Rates and tax checked on 28 October 2026. Rates are reviewed every January and July and tax can
          change with each budget, so check the latest order before you buy. The rate printed on your
          certificate is final.
        </p>
      </ContentSection>
    </>
  );
}

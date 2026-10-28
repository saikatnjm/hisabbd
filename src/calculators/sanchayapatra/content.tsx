import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { formatNumber } from "@/lib/format";
import {
  BUDGET_2026_TAX_REPORT,
  IRD_RATE_ORDER,
  NSD_SCHEMES_PAGE,
  RATES_UNCHANGED_2026,
  SANCHAYAPATRA_SCHEMES,
  SCHEME_IDS,
  SOURCE_TAX_RULES,
  type RateTier,
} from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const cell = "px-3 py-2";
const TIER_LABELS: Record<RateTier, string> = { upTo: "Up to ৳7.5 lakh", above: "Above ৳7.5 lakh" };

function rate(value: number | undefined): string {
  return value === undefined ? "–" : `${formatNumber(value, { decimals: 2, minDecimals: 2 })}%`;
}

/** Explanatory content for the Sanchayapatra Profit Calculator page (Server Component, no JS). */
export function SanchayapatraCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How Sanchayapatra profit is calculated">
        <p>
          Savings certificates pay <strong>simple profit</strong>: the same amount every year, worked
          out on what you invested. Nothing is compounded.
        </p>
        <p>
          <strong>Profit per year = amount × rate ÷ 100</strong>
        </p>
        <ul>
          <li>
            <strong>Paribar and Pensioner Sanchayapatra</strong> pay it every month: yearly profit ÷ 12,
            for 60 months.
          </li>
          <li>
            <strong>3-month profit-bearing Sanchayapatra</strong> pays it every 3 months: yearly profit ÷
            4, for 12 quarters (3 years).
          </li>
          <li>
            <strong>5-year Bangladesh Sanchayapatra</strong> pays all of it at maturity: yearly profit ×
            5, with your principal.
          </li>
        </ul>
        <p>
          <strong>Source tax = profit × tax rate ÷ 100</strong>, deducted from every payment. Your
          principal comes back in full at maturity.
        </p>

        <h3>Monthly: Paribar Sanchayapatra, ৳1,00,000</h3>
        <p>
          At 11.93%: ৳1,00,000 × 11.93 ÷ 100 = ৳11,930 a year, so ৳11,930 ÷ 12 = ৳994.17 a month. A 10%
          source tax takes ৳99.42, leaving <strong>৳894.75 a month</strong>. Over 5 years: ৳59,650
          profit, ৳5,965 tax and ৳53,685 net, so ৳1,53,685 in all with your principal.
        </p>

        <h3>Quarterly: 3-month profit-bearing Sanchayapatra, ৳1,00,000</h3>
        <p>
          At 11.82%: ৳11,820 a year, so ৳11,820 ÷ 4 = ৳2,955 every 3 months. After 10% source tax
          (৳295.50) you receive <strong>৳2,659.50 a quarter</strong>. Over 3 years: ৳35,460 profit, ৳3,546
          tax and ৳31,914 net.
        </p>

        <h3>At maturity: 5-year Bangladesh Sanchayapatra, ৳1,00,000</h3>
        <p>
          At 11.83%: ৳11,830 a year × 5 = ৳59,150 of profit. After 10% source tax (৳5,915) you receive{" "}
          <strong>৳1,53,235 at maturity</strong>.
        </p>

        <h3>Above ৳7.5 lakh, and with no tax</h3>
        <p>
          ৳10,00,000 in Paribar is in the upper tier, at 11.80%: ৳9,833.33 a month, ৳983.33 tax and{" "}
          <strong>৳8,850 a month</strong> after 10% tax. ৳5,00,000 in Pensioner Sanchayapatra at 11.98%
          with 0% tax pays ৳4,991.67 a month, ৳2,99,500 over 5 years.
        </p>
      </ContentSection>

      <ContentSection id="rates" title="Sanchayapatra profit rates 2026">
        <p>
          The Internal Resources Division set these year-end rates in its order of 30 June 2025,
          effective <strong>1 July 2025</strong>. The government kept them unchanged in January 2026 and
          again for July–December 2026 (checked on 28 October 2026). The last column is the rate you
          get if you hold the certificate to maturity; the earlier columns apply if you encash after
          that many years.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Year-end profit rates per year for each savings certificate, by total investment
            </caption>
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={`${cell} font-semibold`}>Certificate</th>
                <th scope="col" className={`${cell} font-semibold`}>Total investment</th>
                {[1, 2, 3, 4, 5].map((year) => (
                  <th key={year} scope="col" className={`${cell} text-right font-semibold`}>
                    Year {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SCHEME_IDS.flatMap((id) =>
                (["upTo", "above"] as const).map((tier) => {
                  const scheme = SANCHAYAPATRA_SCHEMES[id];
                  const rates: readonly number[] = scheme.rateTiers[tier];
                  return (
                    <tr key={`${id}-${tier}`}>
                      <th scope="row" className={`${cell} font-normal`}>{scheme.name}</th>
                      <td className={cell}>{TIER_LABELS[tier]}</td>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <td key={i} className={`${cell} text-right tabular-nums`}>
                          {rate(rates[i])}
                        </td>
                      ))}
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
        <p>
          The 3-month scheme runs for 3 years, so it has no year 4 or 5 rate. Rates are reviewed every
          six months. A certificate keeps the rate of the day it was bought for its whole term; a
          reinvestment gets the rate of the reinvestment date.
        </p>
      </ContentSection>

      <ContentSection id="tier" title="The ৳7.5 lakh tier">
        <p>
          Each certificate has two sets of rates: one for a total investment up to ৳7,50,000 and a
          slightly lower one above that. The total is your <strong>cumulative investment across all
          national savings schemes</strong>, including certificates you already hold, not just the one
          you are buying. If your total is above ৳7,50,000, choose “Above ৳7,50,000” in the calculator.
          An amount above ৳7,50,000 on its own is always in the upper tier.
        </p>
      </ContentSection>

      <ContentSection id="tax" title="Source tax on Sanchayapatra profit">
        <p>
          Source tax is deducted from each profit payment under section 105 of the Income Tax Act 2023.
          The calculator pre-fills <strong>{SOURCE_TAX_RULES.standard.value}%</strong>, the section 105
          rate. You can change it.
        </p>
        <ul>
          <li>
            NBR said in February 2026 that the rate is {SOURCE_TAX_RULES.smallHolder.value}% when your
            total investment in all savings certificates is up to ৳5 lakh, and 10% above that.
          </li>
          <li>
            The NSD Pensioner Sanchayapatra sheet says no source tax is deducted when your total
            Pensioner investment is up to ৳5 lakh, and 10% above that.
          </li>
          <li>
            The FY2026-27 Finance Bill was reported to deduct 10% on all certificates and to treat it as
            advance tax rather than final tax, so you may owe more, or get a refund, when you file your
            return. Reports conflict on whether the 5% and 0% rates still apply, and we could not confirm
            it from an official source.
          </li>
        </ul>
        <p>
          So check the rate your savings office or bank actually deducts, shown on your profit
          statement, and enter it. For your full tax position, ask a tax adviser.
        </p>
      </ContentSection>

      <ContentSection id="early-encashment" title="Encashing before maturity">
        <p>
          According to the National Savings Directorate scheme sheets, if you encash early you get the
          year-end rate for the years you completed (the earlier columns in the table above), not the
          maturity rate. If you have already received more profit than that, the difference is deducted
          from your principal. For example, Paribar up to ৳7.5 lakh pays 9.81% after 1 year instead of
          11.93%.
        </p>
        <p>
          This calculator assumes you hold the certificate to maturity. Ask your savings office for the
          exact amount before encashing early.
        </p>
      </ContentSection>

      <ContentSection id="your-certificate" title="Check your certificate’s printed rate">
        <p>
          The rates above are for certificates bought from 1 July 2025. Older certificates keep the rate
          of the day they were bought until they mature, so if yours was bought earlier, enter the rate
          printed on it (or on your profit statement) instead.
        </p>
      </ContentSection>

      <ContentSection id="who-can-buy" title="Who can buy, and how much">
        <ul>
          <li>
            <strong>Paribar (Family):</strong> Bangladeshi women aged 18 or over, any person with a
            disability, and any citizen aged 65 or over. Up to ৳45 lakh in a single name; no joint
            purchase.
          </li>
          <li>
            <strong>Pensioner:</strong> retired government, semi-government and autonomous-body employees,
            retired Supreme Court judges and armed forces members, and family pension holders. Up to ৳50
            lakh from gratuity and provident fund money.
          </li>
          <li>
            <strong>5-year Bangladesh and 3-month:</strong> any Bangladeshi citizen and some institutions.
            Up to ৳30 lakh single or ৳60 lakh joint.
          </li>
        </ul>
        <p>
          Bangladesh, 3-month and Paribar certificates together are capped at ৳50 lakh in a single name
          or ৳1 crore jointly. The calculator shows these limits as information only.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose the savings certificate. Your choice is remembered on this device.</li>
          <li>Enter the investment amount in Taka.</li>
          <li>Choose whether your total in all savings certificates is up to or above ৳7,50,000.</li>
          <li>
            Check the profit rate (pre-filled with the official rate) and the source tax (pre-filled with
            10%), and change them if your certificate or statement shows different figures.
          </li>
          <li>Select Calculate profit to see each payment, the totals and the working.</li>
        </ol>
        <p>
          Comparing with a bank? Try the{" "}
          <Link href={calculatorPath("fdr-calculator")} className={link}>
            FDR calculator
          </Link>{" "}
          for a fixed deposit, or the{" "}
          <Link href={calculatorPath("dps-calculator")} className={link}>
            DPS calculator
          </Link>{" "}
          for a monthly savings scheme. Planning a loan instead? Use the{" "}
          <Link href={calculatorPath("emi-calculator")} className={link}>
            EMI calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            Rates:{" "}
            <a href={IRD_RATE_ORDER.url} target="_blank" rel="noopener" className={link}>
              Internal Resources Division order no. 08.00.0000.000.041.22.0006.20.85
            </a>{" "}
            of 30 June 2025, effective 1 July 2025, published by the National Savings Directorate.
          </li>
          <li>
            Payout frequency, tenure, early encashment, Pensioner tax and purchase limits:{" "}
            <a href={NSD_SCHEMES_PAGE.url} target="_blank" rel="noopener" className={link}>
              National Savings Directorate scheme sheets
            </a>{" "}
            (page updated 9 August 2026).
          </li>
          <li>
            Rates unchanged for July–December 2026:{" "}
            <a href={RATES_UNCHANGED_2026.url} target="_blank" rel="noopener" className={link}>
              Bangla Tribune, 2 July 2026
            </a>
            .
          </li>
          <li>
            Source tax of 5% up to ৳5 lakh and 10% above:{" "}
            <a href={SOURCE_TAX_RULES.standard.source.url} target="_blank" rel="noopener" className={link}>
              Bangla Tribune, 3 February 2026 (NBR letter)
            </a>
            . FY2026-27 budget changes:{" "}
            <a href={BUDGET_2026_TAX_REPORT.url} target="_blank" rel="noopener" className={link}>
              Prothom Alo, 13 June 2026
            </a>
            .
          </li>
        </ul>
        <p>
          All checked on 28 October 2026. The official order and your certificate always decide; rates
          are reviewed every January and July.
        </p>
      </ContentSection>
    </>
  );
}

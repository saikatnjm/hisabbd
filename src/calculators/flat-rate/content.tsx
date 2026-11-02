import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Same figures as the logic tests: [loan, flat, term, instalments, real rate, effective rate]. */
const EXAMPLES: readonly [string, string, string, string, string, string][] = [
  ["৳1,00,000", "12%", "12 months, monthly", "৳9,333.33 × 12", "21.46%", "23.70%"],
  ["৳1,00,000 less ৳2,000 fee", "12%", "12 months, monthly", "৳9,333.33 × 12", "25.40%", "28.58%"],
  ["৳2,00,000", "10%", "24 months, monthly", "৳10,000 × 24", "18.16%", "19.75%"],
  ["৳50,000", "15%", "12 months, weekly", "৳1,105.77 × 52", "28.14%", "32.40%"],
];

/** Explanatory content for the Flat Rate to Real Interest Rate Calculator (Server Component, no JS). */
export function FlatRateCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="How a flat rate becomes a real rate">
        <p>
          A flat rate charges interest on the <strong>original</strong> loan for the whole term. NGO, microfinance,
          and some car and consumer loans are often quoted this way, with weekly or monthly instalments.
        </p>
        <ul>
          <li>
            <strong>Total flat interest = loan × flat rate × years</strong>, where years = months ÷ 12.
          </li>
          <li>
            <strong>Instalment = (loan + total interest) ÷ number of instalments.</strong>
          </li>
          <li>
            <strong>Real rate:</strong> the rate i per instalment at which the instalments are worth exactly the money
            you received, <strong>received = instalment × (1 − (1 + i)<sup>−N</sup>) ÷ i</strong>. There is no
            closed-form answer for i, so the calculator solves it by bisection.
          </li>
          <li>
            <strong>Real yearly rate = i × instalments a year</strong> (12 monthly, 52 weekly). The{" "}
            <strong>effective yearly rate</strong> is (1 + i)<sup>instalments a year</sup> − 1.
          </li>
        </ul>
        <p>
          Money received is the loan minus any upfront fee. The interest and instalment still use the full loan.
        </p>
      </ContentSection>

      <ContentSection id="example-monthly" title="Example: ৳1,00,000 at 12% flat, monthly">
        <ol>
          <li>Interest = 1,00,000 × 12% × 1 year = ৳12,000.</li>
          <li>Instalment = (1,00,000 + 12,000) ÷ 12 = ৳9,333.33.</li>
          <li>
            The rate per month that makes 12 instalments of ৳9,333.33 worth ৳1,00,000 is about 1.788%, so the real
            yearly rate is 1.788% × 12 = <strong>21.46%</strong>. With monthly compounding the effective yearly rate is
            23.70%.
          </li>
        </ol>
      </ContentSection>

      <ContentSection id="example-weekly" title="Example: ৳50,000 at 15% flat, weekly">
        <p>
          Weekly means 52 instalments a year, so 12 months is 52 instalments. Interest = 50,000 × 15% = ৳7,500 and the
          instalment is (50,000 + 7,500) ÷ 52 = ৳1,105.77. The weekly rate that matches is about 0.541%, so the real
          yearly rate is 0.541% × 52 = <strong>28.14%</strong>, nearly double the quoted 15%.
        </p>
      </ContentSection>

      <ContentSection id="examples" title="More examples side by side">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Loan</th>
                <th scope="col" className={headNum}>Flat rate</th>
                <th scope="col" className={head}>Term</th>
                <th scope="col" className={headNum}>Instalments</th>
                <th scope="col" className={headNum}>Real rate</th>
                <th scope="col" className={headNum}>Effective rate</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map(([loan, flat, term, instalments, real, effective]) => (
                <tr key={loan}>
                  <th scope="row" className={`${cell} font-normal`}>{loan}</th>
                  <td className={num}>{flat}</td>
                  <td className={cell}>{term}</td>
                  <td className={num}>{instalments}</td>
                  <td className={num}>{real}</td>
                  <td className={num}>{effective}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="why-understates" title="Why a flat rate understates the cost">
        <p>
          Each instalment repays part of the loan, so what you owe shrinks. A flat rate ignores that and keeps charging
          on the full amount. In the ৳1,00,000 example you pay ৳12,000 of interest, yet on average you hold only about
          ৳54,167 of the loan. For a monthly loan repaid over a year at 5% to 30% flat, the real rate is about 1.7 to 1.8
          times the flat rate.
          An upfront fee pushes it higher still, because you receive less than you repay.
        </p>
        <p>
          For how flat and reducing-balance loans compare, and how an EMI is worked out, read{" "}
          <Link href={localePath("en", guidePath("how-emi-is-calculated"))} className={link}>
            How an EMI is calculated
          </Link>
          . For a loan quoted on the reducing balance, use the{" "}
          <Link href={en("emi-calculator")} className={link}>
            EMI Calculator
          </Link>
          , and for plain simple or compound interest the{" "}
          <Link href={en("interest-calculator")} className={link}>
            Interest Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="Assumptions">
        <ul>
          <li>Instalments are equal and paid at the end of each month or week; the first falls one period after you receive the money.</li>
          <li>Weekly means 52 instalments a year, so the count is months × 52 ÷ 12, rounded. Your lender may count weeks differently.</li>
          <li>Late fees, insurance charged per instalment, grace periods and part-payments are not included.</li>
          <li>This page does not state any legal limit on rates. Ask your lender for its written schedule and compare the real rate with it.</li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the loan amount. Bangla digits and 1,00,000-style grouping both work.</li>
          <li>Enter the flat interest rate a year, for example 12.</li>
          <li>Enter the loan term in whole months.</li>
          <li>Choose Monthly or Weekly instalments.</li>
          <li>Enter any upfront fee taken out of the loan, or leave it blank.</li>
          <li>Select Find the real rate to see the instalment, total repayment and the real yearly rate.</li>
        </ol>
      </ContentSection>
    </>
  );
}

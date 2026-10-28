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

/** ৳5,00,000 at 9% a year for 5 years, by loan year (rounded to the nearest Taka). */
const YEARS: readonly [year: string, principal: string, interest: string, balance: string][] = [
  ["1", "82,915", "41,635", "4,17,085"],
  ["2", "90,693", "33,857", "3,26,392"],
  ["3", "99,201", "25,349", "2,27,191"],
  ["4", "1,08,506", "16,044", "1,18,685"],
  ["5", "1,18,685", "5,865", "0"],
];

/** English guide: how a reducing-balance EMI is calculated (Server Component, no JS). */
export function HowEmiIsCalculatedGuideContent() {
  const calculator = localePath("en", calculatorPath("emi-calculator"));

  return (
    <>
      <ContentSection id="formula" title="What an EMI is, and the formula">
        <p>
          An EMI (equated monthly instalment) is the same amount you pay every month until a loan is fully
          repaid. With the standard <strong>reducing-balance</strong> method, each month’s interest is
          charged only on what you still owe. Every instalment first pays that month’s interest, and the
          rest reduces the principal (the amount borrowed).
        </p>
        <p>
          <strong>EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</strong>
        </p>
        <ul>
          <li>
            <strong>P</strong> = the loan amount (principal).
          </li>
          <li>
            <strong>r</strong> = the monthly interest rate as a fraction: yearly rate ÷ 12 ÷ 100.
          </li>
          <li>
            <strong>n</strong> = the number of monthly instalments (years × 12).
          </li>
        </ul>
        <p>
          At 0% interest the formula simplifies to EMI = P ÷ n. To see the answer for your own loan straight
          away, use the{" "}
          <Link href={calculator} className={link}>
            EMI / Loan Calculator
          </Link>
          . Below, the same sum is worked by hand.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: ৳5,00,000 at 9% a year for 5 years">
        <ol>
          <li>Monthly rate: r = 9 ÷ 12 ÷ 100 = 0.0075, that is 0.75% a month.</li>
          <li>Number of instalments: n = 5 × 12 = 60.</li>
          <li>(1 + r)ⁿ = 1.0075⁶⁰ ≈ 1.565681.</li>
          <li>
            EMI = 5,00,000 × 0.0075 × 1.565681 ÷ (1.565681 − 1) = 3,750 × 1.565681 ÷ 0.565681 ≈{" "}
            <strong>৳10,379.18</strong>.
          </li>
          <li>Total payment = 10,379.18 × 60 ≈ ৳6,22,751.</li>
          <li>
            Total interest = 6,22,751 − 5,00,000 ≈ <strong>৳1,22,751</strong>.
          </li>
        </ol>
        <p>
          So about 19.7% of everything you pay over the 5 years is interest. Rounded, the instalment is
          ৳10,379 a month.
        </p>
      </ContentSection>

      <ContentSection id="split" title="How each instalment splits into interest and principal">
        <p>Each month, interest is worked out on the balance first, and the rest of the EMI reduces the principal:</p>
        <ul>
          <li>Month 1 interest: 5,00,000 × 0.0075 = ৳3,750.</li>
          <li>Month 1 principal repaid: 10,379.18 − 3,750 = ৳6,629.18.</li>
          <li>Balance left: 5,00,000 − 6,629.18 = ৳4,93,370.82.</li>
          <li>Month 2 interest: 4,93,370.82 × 0.0075 ≈ ৳3,700.28, so about ৳6,678.90 goes to principal.</li>
        </ul>
        <p>
          The instalment stays the same, but each month the interest part shrinks a little and the principal
          part grows. In the last (60th) instalment the interest is only about ৳77.26. Added up by year:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Year</th>
                <th scope="col" className={headNum}>Principal repaid (৳)</th>
                <th scope="col" className={headNum}>Interest (৳)</th>
                <th scope="col" className={headNum}>Balance at year end (৳)</th>
              </tr>
            </thead>
            <tbody>
              {YEARS.map(([year, principal, interest, balance]) => (
                <tr key={year}>
                  <th scope="row" className={`${cell} font-normal`}>{year}</th>
                  <td className={num}>{principal}</td>
                  <td className={num}>{interest}</td>
                  <td className={num}>{balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Each figure is rounded to the nearest Taka, so the interest column adds up to ৳1,22,750, ৳1 short of
          the total interest. In year 1 just over a third of what you pay is interest; in year 5 it is under
          5%.
        </p>
      </ContentSection>

      <ContentSection id="flat-vs-reducing" title="Flat rate vs reducing balance">
        <p>
          With a <strong>flat rate</strong>, interest is charged on the original loan amount for the whole
          tenure, however much you have repaid. The principal and total interest are then added and divided
          by the number of instalments. With a <strong>reducing balance</strong>, interest is charged only on
          what is left. So the same percentage on paper costs much more as a flat rate.
        </p>
        <p>
          <strong>An illustrative comparison only</strong> (not any lender’s terms): the same ৳5,00,000 at 9%
          for 5 years. As a flat rate, interest = 5,00,000 × 9% × 5 = ৳2,25,000, and the instalment = (5,00,000
          + 2,25,000) ÷ 60 ≈ ৳12,083.33.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>9%, 5 years</th>
                <th scope="col" className={headNum}>Reducing balance</th>
                <th scope="col" className={headNum}>Flat rate</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row" className={`${cell} font-normal`}>Monthly instalment</th><td className={num}>৳10,379</td><td className={num}>৳12,083</td></tr>
              <tr><th scope="row" className={`${cell} font-normal`}>Total interest</th><td className={num}>৳1,22,751</td><td className={num}>৳2,25,000</td></tr>
              <tr><th scope="row" className={`${cell} font-normal`}>Total payment</th><td className={num}>৳6,22,751</td><td className={num}>৳7,25,000</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The same “9%” as a flat rate costs about ৳1,02,249 more in interest. To get a ৳12,083 instalment on
          a reducing balance, the rate would have to be about 15.7% a year. When you compare offers, ask
          which method is used and the total amount payable, not just the percentage.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: work out your own EMI">
        <ol>
          <li>Take the loan amount (P), interest rate and tenure from your loan offer.</li>
          <li>If the rate is yearly, divide by 12 and by 100 to get r; if it is monthly, divide by 100 only.</li>
          <li>Turn the tenure into months: n = years × 12.</li>
          <li>Work out (1 + r)ⁿ, then put it into the formula to get the EMI.</li>
          <li>Total payment = EMI × n, and total interest = total payment − P.</li>
          <li>Any month’s interest = the balance at that point × r; the EMI minus that is the principal repaid.</li>
        </ol>
        <p>
          The same formula shows what a different tenure does. Over 3 years, the loan above has an EMI of
          about ৳15,900 and total interest of about ৳72,395; over 7 years, the EMI falls to about ৳8,045 but
          total interest rises to about ৳1,75,741. A longer tenure lowers the instalment and raises the total
          interest.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Mixing up flat and reducing rates.</strong> “9% interest” means two very different costs
            under the two methods, as the comparison above shows.
          </li>
          <li>
            <strong>Mixing up yearly and monthly rates.</strong> 9% a year is 0.75% a month. A rate of 1% a
            month is the same as 12% a year, not 1% a year.
          </li>
          <li>
            <strong>Treating the quoted rate as the effective yearly rate.</strong> 9% a year compounded
            monthly works out to an effective rate of about 9.38%.
          </li>
          <li>
            <strong>Forgetting fees and insurance.</strong> Processing fees, insurance and other charges are
            not part of the EMI formula. Add them separately to see the real cost, and ask the lender for the
            total amount payable.
          </li>
          <li>
            <strong>Expecting your bank’s schedule to match exactly.</strong> A lender’s actual schedule can
            differ a little because of how it rounds instalments, counts days, sets the first instalment date
            or changes a floating rate.
          </li>
          <li>
            <strong>Looking only at the instalment.</strong> The EMI comes out of your take-home pay. Check
            your net salary with the{" "}
            <Link href={localePath("en", calculatorPath("salary-calculator"))} className={link}>
              Salary Calculator
            </Link>{" "}
            first, then decide what instalment you can comfortably afford.
          </li>
        </ul>
        <p>
          Rather than working it by hand, enter your loan amount, rate and tenure in the{" "}
          <Link href={calculator} className={link}>
            EMI / Loan Calculator
          </Link>{" "}
          to see the monthly instalment, total interest, total payment and the year-by-year split of principal
          and interest together. For the final figures, always go by your loan agreement.
        </p>
      </ContentSection>
    </>
  );
}

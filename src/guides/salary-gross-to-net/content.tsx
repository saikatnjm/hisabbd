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

/** The Salary Calculator's worked example (illustrative figures, not real rates): month and year. */
const EXAMPLE: readonly [label: string, monthly: string, yearly: string][] = [
  ["Gross salary", "50,000", "6,00,000"],
  ["Provident fund (10% of gross)", "5,000", "60,000"],
  ["Income tax (TDS), fixed", "1,500", "18,000"],
  ["Loan instalment, fixed", "8,000", "96,000"],
  ["Total deductions (29% of gross)", "14,500", "1,74,000"],
  ["Net (take-home) salary", "35,500", "4,26,000"],
];

/** English guide: gross vs net salary and the usual deductions (Server Component, no JS). */
export function SalaryGrossToNetGuideContent() {
  const calculator = localePath("en", calculatorPath("salary-calculator"));

  return (
    <>
      <ContentSection id="gross-vs-net" title="What gross and net salary mean">
        <p>
          <strong>Gross salary</strong> is your total pay before anything is taken off. On many payslips it is the sum
          of several parts: basic salary, house rent allowance, medical allowance, conveyance and so on. How much each
          part is varies from employer to employer.
        </p>
        <p>
          <strong>Net salary</strong>, also called take-home or in-hand pay, is what actually reaches your bank or
          mobile account after every deduction:
        </p>
        <p>
          <strong>Net salary = gross salary − total deductions</strong>
        </p>
        <p>
          Offer letters usually state the gross, but a household budget runs on the net. That is why it matters how
          much is cut from your salary. To work it out with your own figures, use the{" "}
          <Link href={calculator} className={link}>
            Salary Calculator
          </Link>
          ; here is how to do it by hand.
        </p>
      </ContentSection>

      <ContentSection id="deductions" title="What is usually deducted from a salary">
        <p>
          These deductions are common. No rates are given here, because they depend on the rules, the employer and
          your own income, and they change over time. You will find your real figures on your payslip, in your
          appointment letter, or from your office’s HR or accounts team.
        </p>
        <ul>
          <li>
            <strong>Provident fund (PF):</strong> part of your salary is saved in your name. The rate, and whether it
            is worked out on basic salary or on gross, is set out in your employer’s PF policy. Many employers also make
            their own contribution; that part is not taken out of your pay.
          </li>
          <li>
            <strong>Income tax (TDS):</strong> your employer estimates your yearly income tax and deducts it at source
            from your salary. It is not an extra cost: it is your own income tax, just taken month by month. The amount
            depends on your total income, your investments and that year’s tax rules, so don’t guess yours from someone
            else’s.
          </li>
          <li>
            <strong>Loan instalment:</strong> the monthly instalment on an office or bank loan, usually the same amount
            each month.
          </li>
          <li>
            <strong>Other:</strong> repayment of a salary advance, welfare fund contributions, a deduction for unpaid
            leave and the like.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="percent-or-fixed" title="A percentage or a fixed amount">
        <p>Each deduction works in one of two ways:</p>
        <ul>
          <li>
            <strong>A percentage of gross:</strong> deduction = gross × rate ÷ 100. With a ৳50,000 gross and 10%, the
            deduction is ৳5,000.
          </li>
          <li>
            <strong>A fixed amount per month:</strong> for example ৳1,500 of tax or an ৳8,000 instalment. It stays the
            same even if the gross changes.
          </li>
        </ul>
        <p>
          If your PF is taken from basic salary, entering it as a percentage of gross will overstate it. In that case,
          enter the fixed Taka amount your payslip shows. Total deductions can never be more than the gross; if they
          are, one of the figures has been entered wrongly.
        </p>
      </ContentSection>

      <ContentSection id="worked-example" title="Example: from ৳50,000 gross to net">
        <p>
          These figures only show how the sum works; they are not real rates. A gross of ৳50,000 a month, with 10% of
          gross to PF, ৳1,500 a month of income tax and an ৳8,000 loan instalment:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Item</th>
                <th scope="col" className={headNum}>Per month (৳)</th>
                <th scope="col" className={headNum}>Per year (৳)</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE.map(([label, monthly, yearly]) => (
                <tr key={label}>
                  <th scope="row" className={`${cell} font-normal`}>{label}</th>
                  <td className={num}>{monthly}</td>
                  <td className={num}>{yearly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ol>
          <li>PF: 50,000 × 10 ÷ 100 = ৳5,000.</li>
          <li>Total deductions: 5,000 + 1,500 + 8,000 = ৳14,500, which is 14,500 ÷ 50,000 × 100 = 29% of gross.</li>
          <li>
            Net: 50,000 − 14,500 = <strong>৳35,500</strong> a month, or ৳4,26,000 a year.
          </li>
        </ol>
        <p>
          So on a ৳50,000 salary with these deductions, ৳35,500 reaches you each month. Different rates or amounts give
          a different result, so redo the sum with the figures from your own payslip.
        </p>
      </ContentSection>

      <ContentSection id="payslip" title="How to check your payslip">
        <p>To see whether the money that reached your account is right, go through your payslip in four steps:</p>
        <ol>
          <li>Add up every earnings line (basic salary and each allowance). The total should equal your gross salary.</li>
          <li>Add up every deduction line: PF, income tax, instalments and anything else listed.</li>
          <li>Take the total deductions away from the gross. That is your net salary.</li>
          <li>Compare the net figure with the amount paid into your bank or mobile account.</li>
        </ol>
        <p>
          If they don’t match, the usual reasons are unpaid leave, arrears from an earlier month, a one-off deduction
          or a tax adjustment. Once you know which line differs, it is much easier to ask the accounts team a specific
          question.
        </p>
      </ContentSection>

      <ContentSection id="monthly-yearly" title="Monthly vs yearly salary">
        <p>
          <strong>Yearly = monthly × 12</strong> and <strong>monthly = yearly ÷ 12</strong>, assuming 12 equal months.
          A gross of ৳6,00,000 a year is ৳50,000 a month, and the deductions above give the same result. On ৳1,20,000 a
          year with a 10% deduction, the monthly gross is ৳10,000, the deduction ৳1,000 a month and ৳12,000 a year.
        </p>
        <p>
          This simple multiplication leaves out festival bonuses, overtime, raises during the year and irregular
          allowances. Some offer letters quote a yearly “package” that may include bonuses or the employer’s
          contributions; dividing that by 12 will not give your monthly take-home pay. Ask HR what the package
          includes.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common salary mistakes">
        <ul>
          <li>
            <strong>Budgeting or planning a loan on the gross.</strong> Bills and instalments are paid from the net.
            Before taking a new loan, check the instalment in the{" "}
            <Link href={localePath("en", calculatorPath("emi-calculator"))} className={link}>
              EMI Calculator
            </Link>{" "}
            and compare it with your net salary.
          </li>
          <li>
            <strong>Treating PF taken from basic as a percentage of gross.</strong> The deduction looks bigger and the
            net smaller than they really are.
          </li>
          <li>
            <strong>Assuming a friend’s or colleague’s income tax.</strong> Even on the same salary, tax differs with
            investments and other income.
          </li>
          <li>
            <strong>Dividing a yearly package by 12 to get monthly net pay.</strong> If the package includes bonuses,
            the monthly figure will be lower.
          </li>
          <li>
            <strong>Thinking of PF as money lost.</strong> It is your own saving; it just doesn’t reach you this month.
            To save a fixed amount each month on top, see what it grows to in the{" "}
            <Link href={localePath("en", calculatorPath("dps-calculator"))} className={link}>
              DPS Calculator
            </Link>
            .
          </li>
        </ul>
        <p>
          Enter the figures from your payslip in the{" "}
          <Link href={calculator} className={link}>
            Salary Calculator
          </Link>{" "}
          to see your monthly and yearly net salary and each deduction separately. Everything is worked out on your
          phone, and no salary details are sent anywhere.
        </p>
      </ContentSection>
    </>
  );
}

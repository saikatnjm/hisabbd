import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the Salary Calculator page (Server Component, no JS). */
export function SalaryCalculatorContent() {
  return (
    <>
      <ContentSection id="gross-vs-net" title="Gross salary vs net salary">
        <p>
          <strong>Gross salary</strong> is your pay before anything is taken off. <strong>Net salary</strong>,
          often called take-home pay, is what reaches you after deductions.
        </p>
        <p>
          <strong>Net salary = gross salary − total deductions</strong>
        </p>
        <p>
          A deduction can be a percentage of gross (for example a provident fund contribution) or a fixed
          amount each month (for example a loan instalment). This calculator handles both.
        </p>
      </ContentSection>

      <ContentSection id="no-tax" title="What this calculator does not do">
        <p>
          It does <strong>not</strong> compute Bangladesh income tax or any other statutory deduction for
          you. Tax slabs, provident fund rates and similar rules change over time and depend on your
          employer and your own situation, so they are not built in.
        </p>
        <p>
          You enter the deductions yourself, for example from your payslip or by asking your employer’s
          accounts team. The result is an estimate based only on the numbers you provide.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter your gross salary and choose whether it is per month or per year.</li>
          <li>
            Select “Add deduction” (or a quick-add button such as “Provident fund”) for each deduction. Leave
            the name blank if you like.
          </li>
          <li>
            For each row, choose “% of gross” or a fixed amount per month and enter the value from your
            payslip. Remove rows you don’t need.
          </li>
          <li>Select Calculate net salary to see your monthly and yearly figures and each deduction.</li>
        </ol>
        <p>
          Yearly figures are the monthly figures × 12, assuming 12 equal months. Festival bonuses, overtime
          and raises during the year are not included. Rows left completely empty are ignored.
        </p>
      </ContentSection>

      <ContentSection id="worked-example" title="Worked example">
        <p>
          These figures are only to show the arithmetic, not real rates. Gross salary ৳50,000 per month with:
        </p>
        <ul>
          <li>a deduction of 10% of gross: ৳5,000;</li>
          <li>a fixed deduction of ৳1,500;</li>
          <li>a fixed loan instalment of ৳8,000.</li>
        </ul>
        <p>
          Total deductions are 5,000 + 1,500 + 8,000 = <strong>৳14,500</strong>, which is 29% of gross. Net
          salary is 50,000 − 14,500 = <strong>৳35,500</strong> a month. Over 12 months: gross ৳6,00,000,
          deductions ৳1,74,000 and net <strong>৳4,26,000</strong>.
        </p>
      </ContentSection>
    </>
  );
}

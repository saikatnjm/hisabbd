import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the EMI / Loan Calculator page (Server Component, no JS). */
export function EmiCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How EMI is calculated">
        <p>
          This calculator uses the standard <strong>reducing-balance</strong> method. Interest is charged
          each month on the amount you still owe, and every instalment is the same size.
        </p>
        <p>
          <strong>EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</strong>
        </p>
        <ul>
          <li>
            <strong>P</strong> is the loan amount (principal).
          </li>
          <li>
            <strong>r</strong> is the monthly interest rate as a fraction: the yearly rate ÷ 12 ÷ 100, or
            the monthly rate ÷ 100.
          </li>
          <li>
            <strong>n</strong> is the number of monthly instalments.
          </li>
        </ul>
        <p>
          With a 0% rate the formula simplifies to EMI = P ÷ n. Total payment is EMI × n and total
          interest is total payment − P.
        </p>

        <h3>Worked example</h3>
        <p>
          A loan of ৳5,00,000 at 9% per year for 5 years: r = 9 ÷ 12 ÷ 100 = 0.0075 and n = 60. The EMI is{" "}
          <strong>৳10,379</strong> a month (10,379.18 before rounding). Over 60 months you pay{" "}
          <strong>৳6,22,751</strong>, of which <strong>৳1,22,751</strong> is interest. In the first year
          about ৳82,915 goes to principal and ৳41,635 to interest, leaving ৳4,17,085 to repay.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the loan amount in Taka.</li>
          <li>Enter the interest rate and choose whether it is per year or per month, as in your loan offer.</li>
          <li>Enter the tenure as a whole number and choose years or months (up to 50 years).</li>
          <li>
            Select Calculate EMI. Open “See year-by-year breakdown” to see how much principal and interest
            you pay each year and what remains.
          </li>
        </ol>
      </ContentSection>

      <ContentSection id="flat-vs-reducing" title="Flat rate vs reducing balance">
        <p>
          With a <strong>reducing-balance</strong> loan, interest each month is worked out on the
          outstanding balance, which falls as you repay. With a <strong>flat-rate</strong> loan, interest
          is worked out on the original amount for the whole tenure and then spread over the instalments.
        </p>
        <p>
          The same quoted percentage therefore costs more under a flat rate, because you keep paying
          interest on money you have already repaid. When comparing offers, check which method each lender
          uses and ask for the total amount payable.
        </p>
      </ContentSection>

      <ContentSection id="limits" title="What this calculator does not include">
        <p>
          The result is an estimate based on the standard formula. It does not represent any specific
          bank’s or lender’s terms. Real EMIs can differ because of:
        </p>
        <ul>
          <li>processing fees, insurance and other charges;</li>
          <li>flat-rate loans, or rates that change during the loan;</li>
          <li>how the lender rounds instalments, counts days or times the first payment;</li>
          <li>grace periods and part-payments.</li>
        </ul>
        <p>Always confirm the final figures in your loan agreement.</p>
      </ContentSection>
    </>
  );
}

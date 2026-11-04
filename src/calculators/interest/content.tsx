import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** ৳1,00,000 at 9% a year: amount at the end of each year (same figures as the logic tests). */
const YEARS: readonly [year: string, simple: string, compound: string][] = [
  ["1", "1,09,000", "1,09,000"],
  ["2", "1,18,000", "1,18,810"],
  ["3", "1,27,000", "1,29,502.90"],
  ["4", "1,36,000", "1,41,158.16"],
  ["5", "1,45,000", "1,53,862.40"],
];

/** Explanatory content for the Simple and Compound Interest Calculator (Server Component, no JS). */
export function InterestCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="Simple and compound interest formulas">
        <p>In textbook notation: P = principal, r = yearly rate as a decimal (10% = 0.10), n = years.</p>
        <ul>
          <li>
            <strong>Simple interest I = Pnr</strong>, and the amount A = P + I = P(1 + nr).
          </li>
          <li>
            <strong>Compound amount C = P(1 + r)ⁿ</strong>, and the compound interest is C − P.
          </li>
        </ul>
        <h3>A textbook-style example</h3>
        <p>৳200 at 10% for 3 years:</p>
        <ol>
          <li>Simple interest = 200 × 3 × 0.10 = ৳60; the amount is ৳260.</li>
          <li>Compound amount = 200 × (1.10)³ = 200 × 1.331 = ৳266.20; compound interest ৳66.20.</li>
          <li>The difference is ৳66.20 − ৳60 = ৳6.20, because from the second year interest is also earned on interest.</li>
        </ol>
      </ContentSection>

      <ContentSection id="lakh-example" title="Example: ৳1,00,000 at 9% for 5 years">
        <p>The amount at the end of each year, simple and compounded yearly:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Year</th>
                <th scope="col" className={headNum}>Simple (৳)</th>
                <th scope="col" className={headNum}>Compound (৳)</th>
              </tr>
            </thead>
            <tbody>
              {YEARS.map(([year, simple, compound]) => (
                <tr key={year}>
                  <td className={cell}>{year}</td>
                  <td className={num}>{simple}</td>
                  <td className={num}>{compound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Over 5 years simple interest is ৳45,000 and compound interest ৳53,862.40, a difference of ৳8,862.40. The two
          are equal after the first year, and the gap grows every year after that.
        </p>
      </ContentSection>

      <ContentSection id="compounding" title="How often interest is compounded">
        <p>
          Compounded m times a year, <strong>C = P(1 + r/m)^(m × n)</strong>. The same ৳1,00,000 at 9% for 5 years earns:
        </p>
        <ul>
          <li>Yearly (m = 1): ৳53,862.40</li>
          <li>Half-yearly (m = 2): ৳55,296.94</li>
          <li>Quarterly (m = 4): ৳56,050.92</li>
          <li>Monthly (m = 12): ৳56,568.10</li>
        </ul>
        <p>
          The more often interest is compounded, the more you earn. 9% compounded monthly works out to about 9.38% a
          year; the calculator shows this as the “effective yearly rate”.
        </p>
      </ContentSection>

      <ContentSection id="unknowns" title="Finding the rate, time or principal">
        <p>Rearrange the simple interest formula to find the unknown:</p>
        <ul>
          <li>Rate r = I ÷ (P × n). If ৳200 earns ৳60 in 3 years, r = 60 ÷ 600 = 0.10, which is 10%.</li>
          <li>Time n = I ÷ (P × r).</li>
          <li>Principal P = I ÷ (n × r).</li>
        </ul>
        <p>
          The{" "}
          <Link href={en("percentage-calculator")} className={link}>
            Percentage Calculator
          </Link>{" "}
          helps turn percentages into decimals and back.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Multiplying by the rate as a whole number.</strong> In the formula r is a decimal: 9% is 0.09, not 9.
            In the calculator, just enter 9.
          </li>
          <li>
            <strong>Not turning months into years.</strong> 18 months is 1.5 years; enter 1.5 as the time.
          </li>
          <li>
            <strong>Assuming compound interest is the same every year.</strong> Each year’s compound interest is more
            than the year before.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="banks" title="Bank FDRs, DPS and loans">
        <p>
          Banks set their own rate and compounding, and deduct source tax from interest. For figures with the tax, use
          the{" "}
          <Link href={en("fdr-calculator")} className={link}>
            FDR Calculator
          </Link>{" "}
          and the{" "}
          <Link href={en("dps-calculator")} className={link}>
            DPS Calculator
          </Link>
          . For a loan’s monthly instalment, use the{" "}
          <Link href={en("emi-calculator")} className={link}>
            EMI Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the principal. Bangla digits and 1,00,000-style grouping both work.</li>
          <li>Enter the yearly interest rate as a percentage, e.g. 9.</li>
          <li>Enter the time in years; fractions work, e.g. 2.5.</li>
          <li>Choose how often interest is compounded; textbook problems use “Yearly”.</li>
          <li>
            Select Calculate interest to see simple and compound interest, the amounts, the difference and a
            year-by-year table.
          </li>
        </ol>
      </ContentSection>
    </>
  );
}

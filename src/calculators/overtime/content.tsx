import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { OVERTIME_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Overtime Pay Calculator (Server Component, no JS). Figures match logic.test.ts. */
export function OvertimeCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="How overtime pay is worked out">
        <p>
          <strong>Overtime pay = (basic wage + dearness allowance) ÷ hours in the month × 2 × overtime hours.</strong>
        </p>
        <ul>
          <li>Ordinary rate an hour = (basic + dearness or ad hoc pay) ÷ hours in the month.</li>
          <li>Overtime rate an hour = 2 × the ordinary rate.</li>
          <li>Overtime pay = overtime rate × overtime hours.</li>
        </ul>
        <h3>A worked example</h3>
        <p>Basic ৳10,000, dearness allowance ৳400, 208 hours in the month, 12.5 overtime hours:</p>
        <ol>
          <li>Base: ৳10,000 + ৳400 = ৳10,400.</li>
          <li>Ordinary rate: ৳10,400 ÷ 208 = ৳50 an hour.</li>
          <li>Overtime rate: 2 × ৳50 = ৳100 an hour.</li>
          <li>Overtime pay: ৳100 × 12.5 = ৳1,250.</li>
        </ol>
        <p>
          Taking the overtime on top of your pay? Use the{" "}
          <Link href={en("salary-calculator")} className={link}>
            salary calculator
          </Link>{" "}
          to see the take-home figure after deductions.
        </p>
      </ContentSection>

      <ContentSection id="what-counts" title="What counts in the base">
        <p>
          Section 108(1) of the Bangladesh Labour Act 2006 says overtime is paid at twice the ordinary rate of{" "}
          <em>“মূল মজুরী ও মহার্ঘভাতা এবং এডহক বা অন্তবর্তী মজুরী, যদি থাকে”</em>: basic wage, dearness
          allowance and ad hoc or interim wage, if any. House rent, medical, conveyance and food allowances are not
          named, so this calculator does not include them. Enter only the dearness or ad hoc part in the optional
          field.
        </p>
        <p>
          Section 108(2), added in 2018, says the 2× rule does not apply to workers paid at piece rate, so this
          calculator is for time-rated, monthly-paid workers.
        </p>
      </ContentSection>

      <ContentSection id="divisor" title="Why you enter the hours in a month yourself">
        <p>
          Section 108 gives the 2× rate but does not say how a monthly wage becomes an hourly one. Payroll guides
          often divide by 208 (52 weeks × 48 hours ÷ 12 months), but we could not read that in an official text on 2
          November 2026, and a wrong divisor changes every taka of the answer. So there is no default: take the number
          from your payslip, contract or wage notice, or ask your employer.
        </p>
      </ContentSection>

      <ContentSection id="limits" title="Working-hour limits">
        <ul>
          <li>Section 100: normally 8 hours a day, and up to 10 hours a day when overtime is worked.</li>
          <li>Section 101: a break of 1 hour (or two of half an hour) for work over 6 hours, and 30 minutes over 5 hours.</li>
          <li>Section 102: normally 48 hours a week, at most 60 in any week and 56 a week on average over a year.</li>
        </ul>
        <p>
          These limits depend on which days and weeks the hours fall in, so this calculator does not check them; the work hours calculator does. Work on
          weekly or festival holidays has its own rules in the Act; enter only hours your payslip treats as ordinary
          overtime.
        </p>
      </ContentSection>

      <ContentSection id="rules-checked" title="Rules checked on 2 November 2026">
        <p>
          We read sections 100, 101, 102 and 108 on the government’s Laws of Bangladesh site on 2 November 2026. This
          page is general information, not legal advice. Your employer’s payslip and the law decide what you are paid.
          If you think you are underpaid, talk to your employer, your union or the labour office.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter your monthly basic wage.</li>
          <li>Enter the dearness or ad hoc allowance, or leave it blank.</li>
          <li>Enter the hours in a month from your payslip or contract.</li>
          <li>
            Enter your overtime hours, decimals allowed (1.5 = 1 hour 30 minutes). Not sure of the total? Add up your
            start and finish times in the{" "}
            <Link href={en("work-hours-calculator")} className={link}>
              work hours calculator
            </Link>
            .
          </li>
          <li>Select Calculate overtime to see the two hourly rates and the pay.</li>
        </ol>
        <p>
          Your figures stay in your browser. They are saved only in your recent calculations on this device, which you
          can turn off.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          {[S.section108, S.section100, S.section101, S.section102].map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>
            </li>
          ))}
          <li>
            Secondary only, not an official text:{" "}
            <a href={S.divisor.url} target="_blank" rel="noopener" className={link}>
              {S.divisor.title}
            </a>
            .
          </li>
        </ul>
        <p>All checked on 2 November 2026.</p>
      </ContentSection>
    </>
  );
}

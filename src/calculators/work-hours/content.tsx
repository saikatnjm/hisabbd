import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { OVERTIME_SOURCES as S } from "@/calculators/overtime/sources";
import { guidePath } from "@/guides/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Work Hours Calculator (Server Component, no JS). Figures match logic.test.ts. */
export function WorkHoursCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="How working hours and overtime hours are counted">
        <p>
          <strong>Hours worked = finish time − start time − break.</strong> Overtime hours for a day = hours worked
          beyond 8. The days are then added up.
        </p>
        <ul>
          <li>If the finish time is earlier than the start time, the shift ran past midnight.</li>
          <li>Breaks are only taken off if you enter them, in minutes.</li>
          <li>Totals are shown in hours and minutes, and the overtime also in decimal hours (1 h 30 min = 1.5).</li>
        </ul>
        <h3>A worked example</h3>
        <p>A garment worker works 8:00 to 19:00 six days a week, with a 1-hour lunch break:</p>
        <ol>
          <li>Each day: 19:00 − 8:00 = 11 hours, minus 1 hour break = 10 hours worked.</li>
          <li>Overtime each day: 10 − 8 = 2 hours.</li>
          <li>The week: 6 × 10 = 60 hours worked, 48 regular and 12 overtime.</li>
          <li>60 hours is the most section 102 allows in any week, so this week is at the limit.</li>
        </ol>
        <p>
          Then put the 12 hours into the{" "}
          <Link href={en("overtime-calculator")} className={link}>
            overtime pay calculator
          </Link>{" "}
          to see them in taka, and the{" "}
          <Link href={en("salary-calculator")} className={link}>
            salary calculator
          </Link>{" "}
          for the month’s take-home pay.
        </p>
      </ContentSection>

      <ContentSection id="limits" title="What the Labour Act says about hours">
        <ul>
          <li>
            Section 100: an adult worker normally works no more than 8 hours a day, and up to 10 hours a day when
            overtime is worked under section 108.
          </li>
          <li>
            Section 101: a worker need not work more than 6 hours a day without a 1-hour break, or more than 5 hours
            without a 30-minute break (the full rules, including two half-hour breaks, are in the section).
          </li>
          <li>
            Section 102: normally no more than 48 hours a week; with overtime no more than 60 hours in any week, and an
            average of no more than 56 a week over a year.
          </li>
          <li>Section 108: overtime is paid at twice the ordinary rate of basic wage and dearness allowance.</li>
        </ul>
        <p>
          The calculator flags a day over 10 hours and, when you enter up to 7 days, a week over 48 or 60 hours. Some
          sectors and shift systems have exceptions in the Act, so treat the flags as a guide.
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="Assumptions">
        <ul>
          <li>Overtime is counted day by day, as hours beyond 8 in that day. The weekly total is shown for information.</li>
          <li>Whether a break counts as working time depends on your workplace, so you decide what to enter.</li>
          <li>Work on a weekly holiday or festival holiday has its own rules in the Act and is not treated separately here.</li>
          <li>Your employer’s attendance records and payslip are what count.</li>
        </ul>
        <p>
          Keeping track of leave as well? The{" "}
          <Link href={en("earned-leave-calculator")} className={link}>
            earned leave calculator
          </Link>{" "}
          works out annual leave from days worked, and the{" "}
          <Link href={localePath("en", guidePath("labour-act-2026-amendment"))} className={link}>
            Labour Act 2026 guide
          </Link>{" "}
          covers what changed this year.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>For each day, enter the time you started and finished.</li>
          <li>Enter your break in minutes, or leave it blank.</li>
          <li>Add more days (up to 31) or leave unused rows blank.</li>
          <li>Select Calculate hours to see total, regular and overtime hours, day by day.</li>
        </ol>
        <p>Your times stay in your browser. They are saved only in your recent calculations on this device, which you can turn off.</p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          {[S.section100, S.section101, S.section102, S.section108].map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>
            </li>
          ))}
        </ul>
        <p>
          Read on the government’s Laws of Bangladesh site on 2 November 2026. This page is general information, not
          legal advice.
        </p>
      </ContentSection>
    </>
  );
}

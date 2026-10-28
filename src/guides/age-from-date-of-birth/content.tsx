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

/** English guide: how to work out age in years, months and days from a date of birth (Server Component, no JS). */
export function AgeFromDateOfBirthGuideContent() {
  const calculator = localePath("en", calculatorPath("age-calculator"));

  return (
    <>
      <ContentSection id="rule" title="The rule: complete years, then complete months, then days">
        <p>
          To work out age from a date of birth, count forward on the calendar. First see how many birthdays
          have passed: that is the number of <strong>complete years</strong>. From the last birthday, count
          how many times the same day of the month has come round: those are the{" "}
          <strong>complete months</strong>. Whatever is left over is the <strong>days</strong>.
        </p>
        <p>
          If the date of birth and the date you are measuring to are the same, the age is 0 days; you don’t
          add the last day on top. To skip the counting and see the answer straight away, use the{" "}
          <Link href={calculator} className={link}>
            Age Calculator
          </Link>
          . It follows exactly the rules below.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: 23 May 1998 to 5 October 2026">
        <p>Suppose someone was born on 23 May 1998 and we want their age on 5 October 2026.</p>
        <h3>Method 1: count forward</h3>
        <ol>
          <li>23 May 1998 to 23 May 2026 is 28 complete years.</li>
          <li>
            23 May 2026 to 23 September 2026 is 4 complete months. 23 October hasn’t arrived yet, so it is
            not 5.
          </li>
          <li>
            23 September to 5 October: September has 30 days, so 7 days are left in September, plus 5 in
            October, which makes 12 days.
          </li>
        </ol>
        <p>
          The age is <strong>28 years 4 months 12 days</strong>. In total that is 10,362 days, or 1,480 weeks
          and 2 days.
        </p>
        <h3>Method 2: subtract (the school method)</h3>
        <p>
          Subtract the date of birth from the calculation date. You can’t take 23 from 5 in the days column,
          so borrow from the month before. That month is September, which has 30 days, so the days become
          5 + 30 = 35 and the month drops from 10 to 9.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Step</th>
                <th scope="col" className={headNum}>Years</th>
                <th scope="col" className={headNum}>Months</th>
                <th scope="col" className={headNum}>Days</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>Calculation date</td><td className={num}>2026</td><td className={num}>10</td><td className={num}>5</td></tr>
              <tr><td className={cell}>After borrowing September’s 30 days</td><td className={num}>2026</td><td className={num}>9</td><td className={num}>35</td></tr>
              <tr><td className={cell}>Date of birth (subtract)</td><td className={num}>1998</td><td className={num}>5</td><td className={num}>23</td></tr>
              <tr><td className={cell}><strong>Age</strong></td><td className={num}><strong>28</strong></td><td className={num}><strong>4</strong></td><td className={num}><strong>12</strong></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          If the months column won’t subtract either, borrow 1 year and add 12 to the months. Both methods give
          the same answer, but when you borrow, always use the number of days in the month{" "}
          <strong>just before</strong> the calculation month. Borrowing 30 every time doesn’t work.
        </p>
      </ContentSection>

      <ContentSection id="month-end" title="Born at the end of a month">
        <p>
          Not every month has a 31st. When a month doesn’t have your day of birth, the month is complete on its{" "}
          <strong>last day</strong>. Take someone born on 31 January 2026:
        </p>
        <ul>
          <li>On 28 February 2026 they are 1 month old (February has no 31st, so its last day, the 28th, counts).</li>
          <li>On 1 March 2026 they are 1 month 1 day old.</li>
          <li>On 31 March 2026 they are 2 months old; March has a 31st, so the month completes on the 31st again.</li>
        </ul>
        <p>
          The subtraction method can trip up on dates like these. Taking 31 January from 1 March, even after
          borrowing February’s 28 days, the days column is 29 − 31, which is negative. If you were born on the
          29th, 30th or 31st, counting forward is the safer method.
        </p>
      </ContentSection>

      <ContentSection id="leap-day" title="Leap years and 29 February birthdays">
        <p>
          A year divisible by 4 is usually a leap year (366 days, with 29 days in February). Century years are
          leap years only if they divide by 400: 2000 was a leap year, 1900 was not.
        </p>
        <p>
          If you were born on 29 February, we take your birthday as <strong>28 February</strong> in common
          years. For someone born on 29 February 2000:
        </p>
        <ul>
          <li>On 27 February 2001 they are 0 years 11 months 29 days old.</li>
          <li>On 28 February 2001 they turn 1.</li>
          <li>
            On 28 February 2004 they are 3 years 11 months 30 days old, because 2004 is a leap year and the
            birthday falls on 29 February 2004.
          </li>
        </ul>
        <p>
          Some organisations and legal systems use 1 March instead of 28 February in common years. If one day
          matters for something official, check that organisation’s rule.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: work out your own age">
        <ol>
          <li>Write down the date of birth and the date you want the age on.</li>
          <li>Find the last birthday on or before that date, and count the complete years up to it.</li>
          <li>
            From that birthday, count complete months on the same day of the month. If a month doesn’t have
            that day, use its last day.
          </li>
          <li>Count the days from the last complete month to the calculation date, using each month’s real length.</li>
          <li>If you were born on 29 February, use 28 February as the birthday in common years.</li>
        </ol>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Dividing the total days by 365.</strong> Someone born on 1 January 2000 has lived 9,496 days
            by 31 December 2025. 9,496 ÷ 365 = 26.02, which suggests 26 years, yet their 26th birthday is the
            next day. The real age is 25 years 11 months 30 days. The extra leap days add up and cause the error.
          </li>
          <li>
            <strong>Treating every month as 30 days.</strong> Months have 28, 29, 30 or 31 days. Borrowing the
            wrong month’s length moves the days figure by a day or two.
          </li>
          <li>
            <strong>Adding the last day on top.</strong> For age, you reach each year on the birthday itself;
            counting “both days” gives one day too many. To count the days between two dates with or without
            the end date, use the{" "}
            <Link href={localePath("en", calculatorPath("date-difference-calculator"))} className={link}>
              Date Difference Calculator
            </Link>
            .
          </li>
          <li>
            <strong>Forgetting the 29 February birthday.</strong> With 28 February as the birthday in common
            years, the age goes up every year, not once every four years.
          </li>
        </ul>
        <p>
          To check your hand calculation, or to find an age on a past or future date, enter the date of birth
          in the{" "}
          <Link href={calculator} className={link}>
            Age Calculator
          </Link>
          . You’ll see the years, months and days, the total days and weeks, and your next birthday together.
          Nothing you enter is sent anywhere.
        </p>
      </ContentSection>
    </>
  );
}

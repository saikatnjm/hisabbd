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

/** English guide: counting the days, months and working days between two dates (Server Component, no JS). */
export function DaysBetweenDatesGuideContent() {
  const calculator = localePath("en", calculatorPath("date-difference-calculator"));

  return (
    <>
      <ContentSection id="answer" title="First decide: count the end date or not">
        <p>
          Before you count the days between two dates, decide one thing: <strong>is the end date counted?</strong>{" "}
          By the usual rule it is not. From 1 January to 2 January is <strong>1 day</strong>, the same as counting
          the nights in between. For leave, events or a rental period, though, both the first and the last day
          count, so the same dates give <strong>2 days</strong>.
        </p>
        <p>
          The easy way to remember it: counting the end date always <strong>adds exactly 1 day</strong>. The same
          date twice is 0 days, or 1 day with the end date counted. For an instant answer, use the{" "}
          <Link href={calculator} className={link}>
            Date Difference Calculator
          </Link>{" "}
          and tick “Include the end date” to switch between the two. Below is how the same sums work by hand.
        </p>
      </ContentSection>

      <ContentSection id="by-hand" title="Counting by hand: 1 January to 25 December 2026">
        <p>
          There are three parts: the days left in the first month, the days in each full month in between, and
          the days in the last month. Use each month’s real length; don’t treat every month as 30 days.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Part</th>
                <th scope="col" className={headNum}>Days</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>1 January to 31 January (31 − 1)</td><td className={num}>30</td></tr>
              <tr><td className={cell}>February to November (28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30)</td><td className={num}>303</td></tr>
              <tr><td className={cell}>25 days of December</td><td className={num}>25</td></tr>
              <tr><td className={cell}><strong>Total (end date not counted)</strong></td><td className={num}><strong>358</strong></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The answer is <strong>358 days</strong>, or 51 weeks and 1 day. Counting 25 December as well gives{" "}
          <strong>359 days</strong>. 2026 is a common year, so February has 28 days; in a leap year you would use 29.
        </p>
      </ContentSection>

      <ContentSection id="months-and-days" title="Months and days: calendar months, not 30 days">
        <p>
          Besides the total, people often want “how many months and days”. Months are counted on the calendar: a
          month is complete when the same day of the month comes round again. 15 March to 15 April is 1 month,
          even though March has 31 days.
        </p>
        <ul>
          <li>
            1 January to 1 December 2026 is 11 complete months, then 24 days to 25 December:{" "}
            <strong>11 months 24 days</strong> (358 days).
          </li>
          <li>
            1 January to 31 January 2026, counting the end date: <strong>1 month 0 days</strong>, 31 days in all.
          </li>
          <li>
            If the start day doesn’t exist in a later month, that month’s last day completes it: 31 January 2024
            to 29 February 2024 is <strong>1 month</strong>.
          </li>
          <li>
            Long spans work the same way: 1 January 2000 to 5 October 2026 is{" "}
            <strong>26 years 9 months 4 days</strong>, or 9,774 days.
          </li>
        </ul>
        <h3>Leap years add a day</h3>
        <p>
          A year divisible by 4 is usually a leap year; century years only if they divide by 400. So 1 February
          to 1 March 2024 is 29 days, but in 2023 it is 28. 1 January 2024 to 1 January 2025 is a full 366 days.
        </p>
      </ContentSection>

      <ContentSection id="working-days" title="Working days: leaving out Fridays and Saturdays">
        <p>
          Bangladesh’s usual working week runs from Sunday to Thursday. To count working days, take{" "}
          <strong>5 days for every full week</strong>, then check the leftover days one by one to see whether
          any is a Friday or Saturday.
        </p>
        <ol>
          <li>
            1 January to 25 December 2026: 358 days = 51 weeks and 1 day. 51 × 5 = 255. The leftover day falls on
            the same weekday the count started on; 1 January 2026 was a Thursday, so add 1. That makes{" "}
            <strong>256 working days</strong>.
          </li>
          <li>
            1 January 2000 to 5 October 2026: 9,774 days = 1,396 weeks and 2 days. 1,396 × 5 = 6,980. 1 January
            2000 was a Saturday, so the 2 leftover days are a Saturday and a Sunday; only the Sunday counts. That
            makes <strong>6,981 working days</strong>.
          </li>
          <li>
            For short spans, just count: the 3 days from Thursday 8 October 2026 (Thursday, Friday, Saturday)
            hold only 1 working day.
          </li>
        </ol>
        <p>
          Counting the end date adds 1 to the total, but if that day is a Friday or Saturday it adds no working
          day. From Thursday 1 January to Friday 2 January 2026 there is 1 working day either way.
        </p>
        <p>
          <strong>Public holidays are not taken out.</strong> Eid, Puja and other government holidays move from
          year to year, and many offices have their own days off. If you need exact working days, check your
          organisation’s holiday list and subtract those days yourself.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: how many days between two dates">
        <ol>
          <li>Write down the start and end dates. If the end comes first, swap them.</li>
          <li>Decide whether the end date counts. For leave or a fixed period, it usually does.</li>
          <li>Add the days left in the first month, the real days of the months between, and the days in the last month.</li>
          <li>If the end date counts, add 1.</li>
          <li>For working days: full weeks × 5, plus the Sundays to Thursdays among the leftover days.</li>
          <li>Finally, subtract public and office holidays yourself.</li>
        </ol>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Mixing up the end-date rule.</strong> Leave from the 4th to the 8th is 5 days, but 8 − 4 gives
            4. Check which rule the form or office expects.
          </li>
          <li>
            <strong>Treating every month as 30 days.</strong> Taking 1 January to 25 December 2026 as 11 × 30 + 24
            gives 354, four days short of the real 358.
          </li>
          <li>
            <strong>Forgetting leap years.</strong> Over several years, every 29 February adds a day.
          </li>
          <li>
            <strong>Counting working days without checking weekdays.</strong> Dividing by 7 and multiplying by 5
            loses the leftover days; you have to know which weekday the count starts on.
          </li>
          <li>
            <strong>Confusing age with a day count.</strong> For age, a year is complete on the birthday itself,
            with no extra day added. For exact age in years, months and days, use the{" "}
            <Link href={localePath("en", calculatorPath("age-calculator"))} className={link}>
              Age Calculator
            </Link>
            ; for the Bangla calendar date of either day, the{" "}
            <Link href={localePath("en", calculatorPath("bangla-date-converter"))} className={link}>
              Bangla Date Converter
            </Link>
            .
          </li>
        </ul>
        <p>
          To check your sums, enter both dates in the{" "}
          <Link href={calculator} className={link}>
            Date Difference Calculator
          </Link>
          . You’ll see the total days, weeks, years-months-days and the days excluding Fridays and Saturdays
          together. It is free, needs no signup, and your dates are never sent anywhere.
        </p>
      </ContentSection>
    </>
  );
}

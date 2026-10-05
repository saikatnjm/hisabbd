import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the Age Calculator page (Server Component, no JS). */
export function AgeCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How your age is worked out">
        <p>The calculator counts on the calendar, the same way you would by hand:</p>
        <ol>
          <li>Count the complete years from the date of birth.</li>
          <li>Count the complete months since the last birthday.</li>
          <li>Count the days left over, up to the “as of” date.</li>
        </ol>
        <p>
          For example, someone born on 15 August 1995 is 31 years old on 15 August 2026, then 1
          month more on 15 September, plus 20 days to 5 October. Their age on 5 October 2026 is{" "}
          <strong>31 years, 1 month and 20 days</strong>.
        </p>

        <h3>Why not just divide the days by 365?</h3>
        <p>
          Because years aren’t all 365 days long, and months range from 28 to 31 days. Someone born
          on 1 January 2000 has lived 9,496 days by 31 December 2025. Divided by 365, that’s just
          over 26, but their 26th birthday is the next day. Their real age is{" "}
          <strong>25 years, 11 months and 30 days</strong>.
        </p>

        <h3>Leap years and 29 February</h3>
        <p>
          A leap year has 366 days. The calculator counts 29 February whenever it’s on the calendar,
          so the total days are always exact. If you were born on 29 February, your birthday is taken
          as 28 February in other years, so you still get a year older every year.
        </p>

        <h3>What “age as of” means</h3>
        <p>
          It’s the date the age is measured on. It starts as today, but you can pick any date on or
          after the date of birth to see how old someone was, or will be, on that day.
        </p>
      </ContentSection>

      <ContentSection id="common-uses" title="Common uses">
        <ul>
          <li>Checking your exact age today.</li>
          <li>Finding your age on a specific date, such as an application deadline.</li>
          <li>Planning a birthday: see the date and how many days are left.</li>
          <li>School and college admission forms.</li>
          <li>Job applications that ask for age in years, months and days.</li>
          <li>Other paperwork that needs an exact age.</li>
        </ul>
      </ContentSection>
    </>
  );
}

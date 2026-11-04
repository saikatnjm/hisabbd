import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Time Calculator (Server Component, no JS). Figures match logic.test.ts. */
export function TimeAddCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="How to add hours and minutes">
        <p>
          <strong>Add the hours, add the minutes, then turn every 60 minutes into 1 hour.</strong> To subtract,
          borrow 1 hour as 60 minutes when the minutes run short.
        </p>
        <h3>A worked example</h3>
        <p>Three study sessions: 2 h 45 min, 3 h 30 min and 1 h 50 min.</p>
        <ol>
          <li>Hours: 2 + 3 + 1 = 6.</li>
          <li>Minutes: 45 + 30 + 50 = 125 = 2 h 5 min.</li>
          <li>Total: 6 h + 2 h 5 min = 8 h 5 min.</li>
          <li>Decimal hours: 485 minutes ÷ 60 = 8.08 hours.</li>
        </ol>
        <p>Subtracting: 8 h 0 min − 1 h 15 min. Borrow an hour: 7 h 60 min − 1 h 15 min = 6 h 45 min, or 6.75 hours.</p>
      </ContentSection>

      <ContentSection id="decimal-hours" title="Minutes to decimal hours">
        <p>Decimal hours = minutes ÷ 60. Timesheets, payslips and overtime sheets often use them.</p>
        <ul>
          <li>15 minutes = 0.25 hours</li>
          <li>30 minutes = 0.5 hours</li>
          <li>45 minutes = 0.75 hours</li>
          <li>5 minutes ≈ 0.08 hours (shown to 2 decimal places)</li>
        </ul>
        <p>
          Got your overtime as hours and minutes? Turn it into decimal hours here, then use the{" "}
          <Link href={en("overtime-calculator")} className={link}>
            overtime pay calculator
          </Link>
          . To count hours from start and finish times, with breaks and night shifts, use the{" "}
          <Link href={en("work-hours-calculator")} className={link}>
            work hours calculator
          </Link>{" "}
          instead.
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="Assumptions">
        <ul>
          <li>Each row is a length of time, not a clock time, so nothing rolls over at midnight.</li>
          <li>Hours and minutes are whole numbers; minutes may be 60 or more.</li>
          <li>A day is 24 hours. Whole days are shown once the total reaches 24 hours.</li>
          <li>
            For gaps between calendar dates, in days, months and years, use the{" "}
            <Link href={en("date-difference-calculator")} className={link}>
              date difference calculator
            </Link>
            .
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the hours and minutes of each time.</li>
          <li>Choose − Subtract for any row to take away.</li>
          <li>Add more rows (up to 20) or leave unused rows blank.</li>
          <li>Select Add up time to see the total, decimal hours and minutes.</li>
        </ol>
        <p>The sum runs in your browser. Recent calculations are kept only on this device, and you can turn that off.</p>
      </ContentSection>
    </>
  );
}

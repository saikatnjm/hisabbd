import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the Date Difference Calculator (Server Component). */
export function DateDifferenceContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the difference is counted">
        <p>
          The calculator counts on the real calendar. It finds the complete years and months between
          your dates, then the days left over, and separately the exact number of days.
        </p>
        <ul>
          <li>
            <strong>End date not included</strong> (default): 1 January to 2 January is 1 day, the
            same as counting the nights in between.
          </li>
          <li>
            <strong>End date included</strong>: both days count, so the same dates give 2 days. Use
            this for leave, event days or a rental period.
          </li>
          <li>Leap years are handled: 29 February is counted whenever it falls in the range.</li>
          <li>If the end date comes first, the dates are swapped and the result tells you.</li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use it">
        <ol>
          <li>Choose the start date.</li>
          <li>Choose the end date, or leave it as today.</li>
          <li>Tick “Include the end date” if both days should count.</li>
          <li>
            Select <strong>Calculate difference</strong>. The result updates as you change the dates.
          </li>
        </ol>
      </ContentSection>

      <ContentSection id="example" title="A worked example">
        <p>From 1 January 2026 to 25 December 2026, without the end date:</p>
        <ul>
          <li>1 January to 1 December is 11 complete months.</li>
          <li>1 December to 25 December is 24 days.</li>
          <li>In total that’s 358 days, or 51 weeks and 1 day.</li>
          <li>256 of those days fall from Sunday to Thursday.</li>
        </ul>
        <p>
          Ticking “Include the end date” counts 25 December too, giving <strong>359 days</strong>.
        </p>
      </ContentSection>
    </>
  );
}

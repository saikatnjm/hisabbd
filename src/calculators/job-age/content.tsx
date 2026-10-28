import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the Government Job Age Calculator page (Server Component, no JS). */
export function JobAgeCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How your age is counted on the circular date">
        <p>
          The calculator works out your exact age on the date the circular names, the same way the
          Age Calculator does: complete years, then complete months, then the days left over. Then it
          compares the <strong>completed years</strong> with the limit:
        </p>
        <ol>
          <li>You meet the minimum once you have had that birthday.</li>
          <li>
            You meet the maximum until your next birthday after it. With a maximum of 32, someone aged
            32 years and 11 months still counts as 32; they pass the limit on their 33rd birthday.
          </li>
          <li>Any extra years of relaxation are added to the maximum.</li>
        </ol>
        <p>
          For example, someone born on 20 May 1994 is <strong>32 years, 5 months and 12 days</strong>{" "}
          old on 1 November 2026. Their completed age is 32, so they meet a BCS limit of 21–32 years
          counted on that date. For that circular, anyone born from{" "}
          <strong>2 November 1993 to 1 November 2005</strong> is within the limit. This person turns
          33 on 20 May 2027, so a later circular counting age on or after that day would need
          relaxation for them to apply.
        </p>
      </ContentSection>

      <ContentSection id="circular-date" title="Why the circular’s date matters">
        <p>
          Age limits are checked on one fixed date that the circular states, often written as “age as
          on” a date. For BCS it has been the circular’s own date. It is not necessarily today or the
          last day to apply, so the same person can be eligible for one circular and not for another
          published a few weeks later. Always enter the date printed in the circular you are applying
          to.
        </p>
        <p>
          The preset limits follow recent rules: <strong>21–32 years</strong> for BCS, and a maximum
          of <strong>32</strong> for direct recruitment to government jobs under the 2026 act. The
          minimum of 18 for other government jobs is the common circular minimum, not a single rule.
          If a circular says something different, choose <strong>Custom</strong> and enter its
          limits. <strong>The circular’s own wording always wins over this calculator.</strong>
        </p>
      </ContentSection>

      <ContentSection id="relaxation" title="Extra years (age relaxation)">
        <p>
          Some quotas or posts allow candidates to be a few years older than the normal maximum. The
          circular says who qualifies and by how many years. Enter that number in{" "}
          <strong>Extra years allowed</strong> and the maximum goes up by it: a 32 maximum with 2
          extra years becomes 34. Leave the box blank if no relaxation applies to you.
        </p>
      </ContentSection>

      <ContentSection id="borderline" title="If you are in your last year">
        <p>
          When your completed age equals the maximum (for example, 32 with a 32 limit), the
          calculator shows you as eligible but adds a warning. It reads a 32 limit as 32 completed
          years, which lasts until the 33rd birthday, but some circulars read it as “must not have
          turned 32”. We could not confirm a single official rule, so compare your date of birth with the
          date-of-birth range printed in the circular. If they disagree, the circular is right.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use it">
        <ol>
          <li>Enter your date of birth as it appears on your certificates.</li>
          <li>
            Enter the circular’s “age as on” date in <strong>Age counted as on</strong>.
          </li>
          <li>
            Choose the <strong>Age limit</strong>: BCS, other government jobs, or Custom with the
            circular’s own limits.
          </li>
          <li>Add any extra years of relaxation the circular gives you.</li>
          <li>
            Select <strong>Check age limit</strong> to see your age, whether you are eligible and the
            date-of-birth range that is eligible.
          </li>
        </ol>
      </ContentSection>
    </>
  );
}

import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** English guide: how government job and BCS age limits are counted (Server Component, no JS). */
export function GovernmentJobAgeLimitGuideContent() {
  const calculator = localePath("en", calculatorPath("government-job-age-calculator"));

  return (
    <>
      <ContentSection id="rule" title="The basic rule: age is counted on the circular’s date">
        <p>
          Every government job circular gives an age limit and a date, often written as “the
          candidate’s age must be between 21 and 32 years as on” a given date. Your age is measured on
          exactly that date. Your age today, or on the last day to apply, does not decide whether you
          are eligible.
        </p>
        <p>
          Age is counted in <strong>completed years</strong>: the number of birthdays you have had by
          that date. Someone who is 32 years and 11 months old is still 32 in completed years; they
          become 33 on their 33rd birthday. To check your own date of birth against a circular in a
          minute, use the{" "}
          <Link href={calculator} className={link}>
            Government Job Age Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="limits" title="Current limits: BCS and other government jobs">
        <ul>
          <li>
            <strong>Maximum age 32:</strong> under the 2026 act, the maximum age for direct recruitment
            to government jobs is 32.
          </li>
          <li>
            <strong>BCS 21–32 years:</strong> recent BCS circulars set 21 to 32 years, counted on the
            circular’s own date.
          </li>
          <li>
            <strong>Minimum age:</strong> for other government jobs the minimum is usually 18, but that
            is the common circular minimum, not a single rule. It can differ by post.
          </li>
          <li>
            <strong>Age relaxation:</strong> some quotas or posts allow candidates a few years above the
            normal maximum. Each circular states who qualifies and by how many years. We don’t assume
            any figure here; go by what your circular says.
          </li>
        </ul>
        <p>
          Each circular sets its own limit, reference date and relaxation rules. If the circular and a
          rule you read elsewhere disagree, <strong>the circular wins</strong>.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: age on 1 November 2026">
        <p>
          Suppose a BCS circular sets 21–32 years, counted on 1 November 2026. Here are three
          candidates.
        </p>
        <h3>Candidate 1: born 20 May 1994</h3>
        <ol>
          <li>From 20 May 1994 to 20 May 2026 is 32 complete years.</li>
          <li>From 20 May 2026 to 20 October 2026 is 5 complete months.</li>
          <li>From 20 October to 1 November is 12 days.</li>
        </ol>
        <p>
          Their age is <strong>32 years, 5 months and 12 days</strong>, which is 32 in completed years.
          They are within the 21–32 limit, but in their last year. They turn 33 on 20 May 2027, so a
          circular that counts age on or after that day would need relaxation for them to apply.
        </p>
        <h3>Candidate 2: born 15 March 2006</h3>
        <p>
          Their age is 20 years, 7 months and 17 days. They have not reached 21, so they are too young
          for this BCS circular; they turn 21 on 15 March 2027. On the same date they do meet an 18–32
          limit for another government job.
        </p>
        <h3>Candidate 3: born 30 June 1993</h3>
        <p>
          Their age is 33 years, 4 months and 2 days. They turned 33 on 30 June 2026, so they are over
          the 32 limit. If the circular gives them 1 year of relaxation, their maximum becomes 33 and
          they are back within the limit (again in their last year).
        </p>
        <h3>The eligible date-of-birth range</h3>
        <p>
          Working the same rule backwards gives every birth date that qualifies. For 21–32 counted on 1
          November 2026, anyone born from <strong>2 November 1993 to 1 November 2005</strong> is within
          the limit. Someone born on 1 November 1993 turns 33 that very day, so they are out. If the
          circular allowed 2 years of relaxation, the maximum would be 34 and the range would start
          from 2 November 1991.
        </p>
      </ContentSection>

      <ContentSection id="borderline" title="Careful if you are in your last year">
        <p>
          When your completed age equals the maximum exactly (32 with a 32 limit), the usual reading
          says you are eligible. But some circulars word the limit as “must not have turned 32”. Read
          that way, someone like Candidate 1 could be excluded. We could not confirm a single official
          rule on this.
        </p>
        <p>
          So in this situation, look for the <strong>date-of-birth range</strong> printed in the
          circular (for example “born between one date and another”) and compare your own date of
          birth. If the circular prints such a range or clear wording, follow it, not a calculator or a
          guide.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: check your own age">
        <ol>
          <li>
            Find the age-limit part of the circular: the minimum and maximum age, and the date on which
            age is counted.
          </li>
          <li>Take your date of birth exactly as it appears on your certificates.</li>
          <li>
            Count the complete years to that date, then complete months, then the days left over. If
            you only want your age, the{" "}
            <Link href={localePath("en", calculatorPath("age-calculator"))} className={link}>
              Age Calculator
            </Link>{" "}
            counts it the same way.
          </li>
          <li>Compare the completed years with the minimum and maximum.</li>
          <li>If the circular gives you relaxation, add those years to the maximum.</li>
          <li>
            If your age equals the maximum exactly, check the date-of-birth range printed in the
            circular.
          </li>
        </ol>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Using today’s date.</strong> A gap of a few weeks between the circular’s date and
            today can turn someone from eligible to not eligible.
          </li>
          <li>
            <strong>Using the last day to apply.</strong> Unless the circular says so, the deadline is
            not the date on which age is counted.
          </li>
          <li>
            <strong>Giving up at 32 years and 5 months.</strong> That is 32 in completed years. If you
            are in your last year, just confirm with the printed date-of-birth range.
          </li>
          <li>
            <strong>Dividing days by 365.</strong> Leap years make that one day out near a birthday,
            which is exactly where it matters. Count birthdays instead.
          </li>
          <li>
            <strong>Relying on relaxation figures you heard from others.</strong> Check how many years
            your quota or post gets in your own circular.
          </li>
        </ul>
        <p>
          Once you have the circular, enter your date of birth, its “age as on” date and its limits in
          the{" "}
          <Link href={calculator} className={link}>
            Government Job Age Calculator
          </Link>{" "}
          to see your exact age, whether you are eligible and the eligible date-of-birth range in one
          go. Nothing you enter leaves your browser.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <p>
          Maximum age 32 for direct recruitment to government jobs (2026 act):{" "}
          <a
            href="https://www.jagonews24.com/en/national/news/91510"
            target="_blank"
            rel="noopener"
            className={link}
          >
            Jago News 24
          </a>
          . BCS 21–32 years as on the circular’s date (51st special BCS circular):{" "}
          <a
            href="https://www.thedailystar.net/news/governance/news/51st-special-bcs-circular-issued-5000-health-cadre-posts-4281956"
            target="_blank"
            rel="noopener"
            className={link}
          >
            The Daily Star
          </a>
          . Rules can change; the wording of the circular you are applying to always decides.
        </p>
      </ContentSection>
    </>
  );
}

import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";
import { BOARD_CHALLENGE_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** One grade higher: change in GPA for 6 main subjects (HSC), before the 5.00 cap. Same figures as the Bangla page. */
const STEPS: readonly [change: string, main: string, fourth: string][] = [
  ["F → D", "Fail becomes a pass", "No change"],
  ["D → C", "+1 ÷ 6 ≈ +0.17", "No change"],
  ["C → B", "+1 ÷ 6 ≈ +0.17", "+1 ÷ 6 ≈ +0.17"],
  ["B → A-", "+0.5 ÷ 6 ≈ +0.08", "+0.5 ÷ 6 ≈ +0.08"],
  ["A- → A", "+0.5 ÷ 6 ≈ +0.08", "+0.5 ÷ 6 ≈ +0.08"],
  ["A → A+", "+1 ÷ 6 ≈ +0.17", "+1 ÷ 6 ≈ +0.17"],
];

/** English guide: how much a board challenge can change an SSC/HSC GPA (Server Component, no JS). */
export function BoardChallengeGpaGuideContent() {
  const calculator = localePath("en", calculatorPath("ssc-hsc-gpa-calculator"));

  return (
    <>
      <ContentSection id="dates" title="HSC 2026: results and application dates">
        <ul>
          <li>
            <strong>Results:</strong> Saturday 31 October 2026, 11:00 am, on the boards’ websites, including{" "}
            <a href={S.results.url} target="_blank" rel="noopener" className={link}>
              {S.results.title}
            </a>
            .
          </li>
          <li>
            <strong>Board challenge applications:</strong> 1 to 7 November 2026.
          </li>
        </ul>
        <p>
          The boards announce the application process and the fee per paper in their notice. The 2026 notice had not
          been published by 29 October, so we don’t print a fee in advance. Last year (2025) applications were online
          only, a two-paper subject needed both papers, and once paid an application could not be cancelled or
          refunded. Check this year’s rules in the notice.
        </p>
      </ContentSection>

      <ContentSection id="what-is-checked" title="What a board challenge checks">
        <p>
          Re-scrutiny used to mean no fresh marking. Officials checked that the marks for every question were added up
          correctly and transferred correctly. The Dhaka board chairman said so for the 2024 HSC.
        </p>
        <p>
          For SSC 2026 that changed: the head of the inter-board coordination committee said the scripts submitted for
          re-scrutiny were re-evaluated. We found no official statement on whether HSC 2026 follows the same rule, or
          on whether a re-evaluated mark can go down. Check the board’s notice.
        </p>
      </ContentSection>

      <ContentSection id="table" title="How much one grade higher adds">
        <p>
          These figures assume HSC’s 6 main subjects. The 4th subject only adds the part of its grade point above 2.00 as
          a bonus, so a change at C or below makes no difference there.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Grade change</th>
                <th scope="col" className={head}>In a main subject</th>
                <th scope="col" className={head}>In the 4th subject</th>
              </tr>
            </thead>
            <tbody>
              {STEPS.map(([change, main, fourth]) => (
                <tr key={change}>
                  <td className={cell}>{change}</td>
                  <td className={cell}>{main}</td>
                  <td className={cell}>{fourth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          These are before the 5.00 cap; a GPA never goes above 5.00. Boards show 2 decimals, so the change you see can
          be 0.08 or 0.09, or 0.16 or 0.17. With more main subjects, as in SSC, the same change adds less: divide by
          your own number of main subjects.
        </p>
      </ContentSection>

      <ContentSection id="examples" title="Three examples">
        <h3>1. A- to A: GPA 4.75 becomes 4.83</h3>
        <p>
          A science student has Bangla A, English A-, ICT A+, Physics A, Chemistry A+, Higher Math A+, and Biology as
          the 4th subject with an A. The main subjects give 26.5 points and the bonus is 2, so the GPA is (26.5 + 2) ÷ 6
          = 4.75.
        </p>
        <ul>
          <li>English A- to A: (27 + 2) ÷ 6 = 4.833…, so <strong>4.83</strong>.</li>
          <li>Bangla A to A+: (27.5 + 2) ÷ 6 = 4.916…, so <strong>4.92</strong>.</li>
          <li>Biology (4th subject) A to A+: (26.5 + 3) ÷ 6 = <strong>4.92</strong>.</li>
        </ul>
        <p>
          Notice that a better 4th subject raises the overall GPA but leaves the GPA without the 4th subject (4.42 here)
          unchanged. If an admission circular asks for the GPA without the 4th subject, only a main-subject change helps.
        </p>

        <h3>2. One F: a fail becomes GPA 2.83</h3>
        <p>
          A business studies student has Bangla B, English F, ICT A-, Accounting B, Finance A-, Business Organisation
          B, and Economics as the 4th subject with a C. The F in English means a fail. If English becomes a D, the main
          subjects give 3 + 1 + 3.5 + 3 + 3.5 + 3 = 17 points, the C in the 4th subject adds no bonus, and the GPA is
          17 ÷ 6 = 2.833…, so <strong>2.83, a pass</strong>. This is where a board challenge makes the biggest
          difference.
        </p>

        <h3>3. Already 5.00: the GPA can’t change</h3>
        <p>
          English A, the other five main subjects A+ and an A+ in the 4th subject: (29 + 3) ÷ 6 = 5.33, shown as 5.00.
          If English becomes A+, it is (30 + 3) ÷ 6 = 5.50, still 5.00. Only the subject grade changes, which can matter
          if a circular asks for a minimum grade in that subject.
        </p>
      </ContentSection>

      <ContentSection id="should-you-apply" title="Should you apply? Three questions">
        <ol>
          <li>
            <strong>Do you have an F in a main subject that you believe you passed?</strong> This is where a board
            challenge can change the most.
          </li>
          <li>
            <strong>Are you just below the minimum GPA or subject grade for an admission you want?</strong> Use the
            table above to see whether one grade higher would clear it. Check whether the circular asks for the overall
            GPA or the GPA without the 4th subject.
          </li>
          <li>
            <strong>Is a grade much lower than you expected?</strong> If you missed a grade by a mark or two, an
            addition error alone could explain it.
          </li>
        </ol>
        <p>
          On the other hand, if your GPA is already 5.00, or the subject is your 4th subject and could only rise as far
          as C, your GPA will not change. Do this sum before you pay. For the full rules, read{" "}
          <Link href={localePath("en", guidePath("ssc-hsc-gpa-calculation"))} className={link}>
            how SSC and HSC GPA is calculated
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Check your own case in a minute">
        <ol>
          <li>
            In the{" "}
            <Link href={calculator} className={link}>
              GPA calculator
            </Link>
            , enter the grades of all your main subjects and your 4th subject from your marksheet. Make sure the GPA
            matches your board result.
          </li>
          <li>Raise the grade of the subject you would challenge by one step and calculate again.</li>
          <li>Compare the two GPAs. Your earlier calculation stays under “Your recent calculations”.</li>
        </ol>
        <p>
          Your grades and GPA never leave your phone or computer. Recent calculations are kept only on this device, and
          you can clear them.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources and dates">
        <p>Everything here was checked on 29 October 2026. The board’s notice is final.</p>
        <ul>
          <li>
            Results and application dates:{" "}
            <a href={S.dates.url} target="_blank" rel="noopener" className={link}>
              {S.dates.title}
            </a>
            .
          </li>
          <li>
            Re-scrutiny only re-checking the addition (HSC 2024):{" "}
            <a href={S.recheckOnly.url} target="_blank" rel="noopener" className={link}>
              {S.recheckOnly.title}
            </a>{" "}
            (Bangla).
          </li>
          <li>
            Scripts re-evaluated for SSC 2026:{" "}
            <a href={S.ssc2026Reevaluated.url} target="_blank" rel="noopener" className={link}>
              {S.ssc2026Reevaluated.title}
            </a>
            .
          </li>
          <li>
            The 2025 application process:{" "}
            <a href={S.process2025.url} target="_blank" rel="noopener" className={link}>
              {S.process2025.title}
            </a>
            .
          </li>
          <li>
            GPA rules: widely published board practice, which our{" "}
            <Link href={calculator} className={link}>
              calculator
            </Link>{" "}
            follows. We could not find an official circular stating them online.
          </li>
        </ul>
      </ContentSection>
    </>
  );
}

import Link from "next/link";
import { ContentSection } from "@/components/ui/content-section";
import { BOARD_CHALLENGE_SOURCES } from "@/guides/board-challenge-gpa/sources";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const cell = "px-3 py-2";
const head = "px-3 py-2 font-semibold";

/** Explanatory content for the SSC & HSC GPA Calculator page (Server Component, no JS). */
export function SscHscGpaCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How SSC and HSC GPA is calculated">
        <p>
          <strong>GPA = (Σ main subject grade points + 4th subject bonus) ÷ number of main subjects</strong>, capped
          at 5.00.
        </p>
        <p>
          Main subjects are your compulsory and group subjects. The 4th (optional) subject only adds a bonus: the part
          of its grade point above 2.00. It is not counted when dividing, so it can raise your GPA but never lower it.
          Because of the cap, 5.00 is the maximum GPA.
        </p>

        <h3>Worked example (HSC, Science)</h3>
        <ul>
          <li>Bangla: A (4.00)</li>
          <li>English: A- (3.50)</li>
          <li>ICT: A+ (5.00)</li>
          <li>Physics: A (4.00)</li>
          <li>Chemistry: A+ (5.00)</li>
          <li>Higher Math: A+ (5.00)</li>
          <li>Biology (4th subject): A (4.00), so the bonus is 4.00 − 2.00 = 2.00</li>
        </ul>
        <p>
          The 6 main subjects add up to 26.50 points. Without the 4th subject the GPA would be 26.5 ÷ 6 = 4.416…,
          shown as 4.42. With the bonus it is (26.5 + 2) ÷ 6 = 28.5 ÷ 6 = <strong>4.75</strong>, so the 4th subject
          added 0.33.
        </p>

        <h3>When the cap applies</h3>
        <p>
          Now take A+ in Bangla, ICT, Physics, Chemistry and Higher Math, an A in English, and A+ in Biology as the 4th
          subject. The main subjects give 29 points (4.83 on their own) and the 4th subject adds 3, so (29 + 3) ÷ 6 =
          5.33. That is above the maximum, so the GPA is <strong>5.00</strong>. This is how a student can reach GPA
          5.00 without an A+ in every main subject.
        </p>
      </ContentSection>

      <ContentSection id="grade-scale" title="Board grade points (5.00 scale)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={head}>Marks</th>
                <th scope="col" className={head}>Letter grade</th>
                <th scope="col" className={head}>Grade point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className={cell}>80–100</td><td className={cell}>A+</td><td className={cell}>5.00</td></tr>
              <tr><td className={cell}>70–79</td><td className={cell}>A</td><td className={cell}>4.00</td></tr>
              <tr><td className={cell}>60–69</td><td className={cell}>A-</td><td className={cell}>3.50</td></tr>
              <tr><td className={cell}>50–59</td><td className={cell}>B</td><td className={cell}>3.00</td></tr>
              <tr><td className={cell}>40–49</td><td className={cell}>C</td><td className={cell}>2.00</td></tr>
              <tr><td className={cell}>33–39</td><td className={cell}>D</td><td className={cell}>1.00</td></tr>
              <tr><td className={cell}>0–32</td><td className={cell}>F</td><td className={cell}>0.00</td></tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="fourth-subject" title="The 4th (optional) subject bonus">
        <p>Only the part of the 4th subject’s grade point above 2.00 is added to your total:</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={head}>4th subject grade</th>
                <th scope="col" className={head}>Grade point</th>
                <th scope="col" className={head}>Bonus added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className={cell}>A+</td><td className={cell}>5.00</td><td className={cell}>+3.00</td></tr>
              <tr><td className={cell}>A</td><td className={cell}>4.00</td><td className={cell}>+2.00</td></tr>
              <tr><td className={cell}>A-</td><td className={cell}>3.50</td><td className={cell}>+1.50</td></tr>
              <tr><td className={cell}>B</td><td className={cell}>3.00</td><td className={cell}>+1.00</td></tr>
              <tr><td className={cell}>C, D or F</td><td className={cell}>2.00 or less</td><td className={cell}>0</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The bonus is added to the points, not to the number of subjects. An F in the 4th subject simply adds nothing;
          it does not make you fail.
        </p>
      </ContentSection>

      <ContentSection id="rules-to-know" title="Fails, two-paper subjects and rounding">
        <ul>
          <li>
            <strong>An F in any main subject means a fail.</strong> The result is a fail with GPA 0.00, however good
            the other grades are. The calculator lists which subjects were F.
          </li>
          <li>
            <strong>Two-paper subjects count once.</strong> Bangla 1st and 2nd paper, English 1st and 2nd paper and
            similar subjects are one subject with one combined grade. Enter that combined grade from your marksheet, not
            each paper.
          </li>
          <li>
            <strong>The divisor is the number of main subjects you enter.</strong> HSC usually has 6 main subjects and
            SSC has more, depending on your group and year. The calculator starts with 6 rows for HSC and 9 for SSC, but
            you can add or remove rows.
          </li>
          <li>
            <strong>2 decimals.</strong> Boards publish GPA to 2 decimals. The calculator rounds half up for display.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="official-rules" title="Where these rules come from">
        <p>
          These rules match widely published Bangladesh education-board practice for SSC, HSC and equivalent exams
          such as Dakhil and Alim. We could not find an official circular that states them online, and boards can
          change their rules, so treat this as an estimate. Check your board’s result notice: your official result is
          the one that counts.
        </p>
      </ContentSection>

      <ContentSection id="results-and-challenge" title="Results and board challenge">
        <p>
          Board results are published on{" "}
          <a href={BOARD_CHALLENGE_SOURCES.results.url} target="_blank" rel="noopener" className={link}>
            {BOARD_CHALLENGE_SOURCES.results.title}
          </a>{" "}
          and each board’s website. HSC 2026 results come out on 31 October 2026, and board challenge applications run
          from 1 to 7 November (
          <a href={BOARD_CHALLENGE_SOURCES.dates.url} target="_blank" rel="noopener" className={link}>
            {BOARD_CHALLENGE_SOURCES.dates.title}
          </a>
          ).
        </p>
        <p>
          Thinking of a challenge? Change one grade above and compare the GPAs, or read{" "}
          <Link href={localePath("en", guidePath("board-challenge-gpa"))} className={link}>
            how much a board challenge can change your GPA
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose your exam, SSC or HSC. It only changes how many rows you start with.</li>
          <li>For each main subject, choose your grade. The name is optional.</li>
          <li>Use Add subject for more rows, or leave extra rows empty. They are ignored.</li>
          <li>Choose your 4th subject grade, or leave it as No 4th subject.</li>
          <li>
            Select Calculate GPA to see your GPA, whether you passed, the 4th subject bonus and your GPA without the
            4th subject.
          </li>
        </ol>
        <p>
          This calculator is for school and college board results. For university semester results with credits, use
          the GPA or CGPA calculator.
        </p>
      </ContentSection>
    </>
  );
}

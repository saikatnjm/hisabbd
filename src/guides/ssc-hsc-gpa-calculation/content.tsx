import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** English guide: how SSC and HSC GPA is calculated with the 4th subject (Server Component, no JS). */
export function SscHscGpaCalculationGuideContent() {
  const calculator = localePath("en", calculatorPath("ssc-hsc-gpa-calculator"));

  return (
    <>
      <ContentSection id="rule" title="The formula in one line">
        <p>
          <strong>
            GPA = (sum of main subject grade points + 4th subject bonus) ÷ number of main subjects
          </strong>
          , and however high that comes out, the maximum is 5.00.
        </p>
        <p>
          Main subjects are your compulsory and group subjects. The 4th (optional) subject does not add
          its full grade point, only the part above 2.00, as a bonus. It is also left out when you
          divide. Once those two points are clear, SSC and HSC GPA is easy to work out. To do it straight
          from your own grades, use the{" "}
          <Link href={calculator} className={link}>
            SSC &amp; HSC GPA Calculator
          </Link>
          .
        </p>
        <p>
          These rules match widely published education-board practice for SSC, HSC and equivalent exams
          such as Dakhil and Alim. We could not find an official circular stating them online, so check
          your board’s result notice. Your board’s published result is the one that counts.
        </p>
      </ContentSection>

      <ContentSection id="grade-points" title="Grade points and the 4th subject bonus">
        <p>
          The points for each letter grade on the board’s 5.00 scale, and the bonus it earns as a 4th
          subject:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Marks</th>
                <th scope="col" className={head}>Grade</th>
                <th scope="col" className={head}>Grade point</th>
                <th scope="col" className={head}>Bonus as 4th subject</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>80–100</td><td className={cell}>A+</td><td className={cell}>5.00</td><td className={cell}>+3.00</td></tr>
              <tr><td className={cell}>70–79</td><td className={cell}>A</td><td className={cell}>4.00</td><td className={cell}>+2.00</td></tr>
              <tr><td className={cell}>60–69</td><td className={cell}>A-</td><td className={cell}>3.50</td><td className={cell}>+1.50</td></tr>
              <tr><td className={cell}>50–59</td><td className={cell}>B</td><td className={cell}>3.00</td><td className={cell}>+1.00</td></tr>
              <tr><td className={cell}>40–49</td><td className={cell}>C</td><td className={cell}>2.00</td><td className={cell}>0</td></tr>
              <tr><td className={cell}>33–39</td><td className={cell}>D</td><td className={cell}>1.00</td><td className={cell}>0</td></tr>
              <tr><td className={cell}>0–32</td><td className={cell}>F</td><td className={cell}>0.00</td><td className={cell}>0</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The bonus rule: <strong>bonus = 4th subject grade point − 2.00</strong>, but never below zero.
          So a C, D or F in the 4th subject adds nothing, and takes nothing away either. An F in the 4th
          subject does not make you fail.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: HSC Science, 6 main subjects">
        <p>Suppose a student’s results are:</p>
        <ul>
          <li>Bangla: A (4.00)</li>
          <li>English: A- (3.50)</li>
          <li>ICT: A+ (5.00)</li>
          <li>Physics: A (4.00)</li>
          <li>Chemistry: A+ (5.00)</li>
          <li>Higher Math: A+ (5.00)</li>
          <li>Biology (4th subject): A (4.00)</li>
        </ul>
        <ol>
          <li>Add the main subject points: 4 + 3.5 + 5 + 4 + 5 + 5 = 26.50.</li>
          <li>Work out the 4th subject bonus: 4.00 − 2.00 = 2.00.</li>
          <li>Total: 26.5 + 2 = 28.50.</li>
          <li>
            Divide by the number of main subjects only: 28.5 ÷ 6 = <strong>4.75</strong>.
          </li>
        </ol>
        <p>
          Without the 4th subject the GPA would be 26.5 ÷ 6 = 4.416…, which is 4.42 to two decimals. So
          the 4th subject raised the GPA by 0.33 here.
        </p>
        <h3>When the 5.00 cap applies</h3>
        <p>
          Now take A+ in Bangla, ICT, Physics, Chemistry and Higher Math, an A in English, and A+ in
          Biology as the 4th subject. The main subjects give 29 points (a GPA of 4.83 on their own) and
          the bonus is 3, so (29 + 3) ÷ 6 = 5.33. That is above 5.00, so the GPA is{" "}
          <strong>5.00</strong>. This is how a student can reach GPA 5.00 without an A+ in every main
          subject.
        </p>
        <h3>Why the 4th subject can’t lower your GPA</h3>
        <p>
          If the 4th subject were averaged in like the others, a poor grade there would pull the GPA
          down. But it is not in the divisor, and the bonus never goes below zero. So in the first
          example, a C or F in Biology instead of an A would leave the GPA equal to the GPA without the
          4th subject, 4.42, and no lower.
        </p>
      </ContentSection>

      <ContentSection id="without-fourth" title="What “GPA without 4th subject” means">
        <p>
          Your real GPA is the one with the 4th subject. “GPA without 4th subject” is simply the sum of
          the main subject points ÷ the number of main subjects, with no bonus. In the example above it
          is 4.42, against 4.75 with the 4th subject.
        </p>
        <p>
          Some admission circulars ask for the GPA without the 4th subject, for eligibility or for
          working out marks. Which one is needed, and how it is used, differs from circular to circular,
          so check the one you are applying to. We don’t assume any admission formula here.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: work out your own GPA">
        <ol>
          <li>
            Take the letter grade for each main subject from your marksheet. For a two-paper subject,
            take the combined grade.
          </li>
          <li>If any main subject is F, stop: the result is a fail, with GPA 0.00.</li>
          <li>Turn each grade into points using the table above and add them up.</li>
          <li>Take 2 away from the 4th subject’s points; if anything is left, add it to the total.</li>
          <li>Divide the total by the number of main subjects (not counting the 4th subject).</li>
          <li>If the answer is above 5.00, it is 5.00. Boards show GPA to two decimals.</li>
        </ol>
        <p>
          How many subjects you divide by depends on your main subjects. HSC usually has 6 (Bangla,
          English, ICT and three group subjects), and SSC has more, depending on your group and year.
          Divide by however many main subjects are on your marksheet; there is no fixed number to
          remember.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Counting the 4th subject in the divisor.</strong> Seeing 7 subjects including the
            4th, as in the example, and dividing by 7 gives a GPA that is too low. Divide by the main
            subjects only: 6 in the example.
          </li>
          <li>
            <strong>Adding the 4th subject’s full points.</strong> An A adds 2, not 4.
          </li>
          <li>
            <strong>Counting two papers as two subjects.</strong> Bangla 1st and 2nd paper are one
            subject with one combined grade.
          </li>
          <li>
            <strong>Averaging despite an F in a main subject.</strong> One F in a main subject means a
            fail, however good the other grades are.
          </li>
          <li>
            <strong>Expecting more than 5.00.</strong> Whatever the total, the GPA stops at 5.00.
          </li>
          <li>
            <strong>Mixing it up with university rules.</strong> Universities weight grades by credits;
            for that, use the{" "}
            <Link href={localePath("en", calculatorPath("gpa-calculator"))} className={link}>
              GPA Calculator
            </Link>
            .
          </li>
        </ul>
        <p>
          Rather than doing it by hand, enter your grades in the{" "}
          <Link href={calculator} className={link}>
            SSC &amp; HSC GPA Calculator
          </Link>{" "}
          to see your GPA, whether you passed, the 4th subject bonus and your GPA without the 4th
          subject together. For your official result, always go by your board’s published result and
          notice.
        </p>
      </ContentSection>
    </>
  );
}

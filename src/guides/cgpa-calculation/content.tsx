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

/** English guide: how CGPA is calculated from semester GPAs and credits (Server Component, no JS). */
export function CgpaCalculationGuideContent() {
  const calculator = localePath("en", calculatorPath("cgpa-calculator"));

  return (
    <>
      <ContentSection id="rule" title="The formula: a credit-weighted average">
        <p>
          <strong>CGPA = Σ (semester GPA × semester credits) ÷ Σ credits</strong>
        </p>
        <p>
          In words: multiply each semester’s GPA by that semester’s credits, add up the results, then divide by
          the total credits. This is a weighted average: a semester with more credits has more influence on
          your CGPA. An 18-credit semester carries twice the course load of a 9-credit one, so it makes sense to
          count it twice as much.
        </p>
        <p>
          If you already have your semester GPAs and credits, the{" "}
          <Link href={calculator} className={link}>
            CGPA Calculator
          </Link>{" "}
          does this for you. Below is the same calculation by hand.
        </p>
      </ContentSection>

      <ContentSection id="scale" title="The UGC 4.00 scale">
        <p>
          Bangladesh’s University Grants Commission (UGC) has published a uniform grading system, which many
          universities in the country use:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Marks</th>
                <th scope="col" className={head}>Letter grade</th>
                <th scope="col" className={headNum}>Grade point</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>80–100</td><td className={cell}>A+</td><td className={num}>4.00</td></tr>
              <tr><td className={cell}>75–79</td><td className={cell}>A</td><td className={num}>3.75</td></tr>
              <tr><td className={cell}>70–74</td><td className={cell}>A-</td><td className={num}>3.50</td></tr>
              <tr><td className={cell}>65–69</td><td className={cell}>B+</td><td className={num}>3.25</td></tr>
              <tr><td className={cell}>60–64</td><td className={cell}>B</td><td className={num}>3.00</td></tr>
              <tr><td className={cell}>55–59</td><td className={cell}>B-</td><td className={num}>2.75</td></tr>
              <tr><td className={cell}>50–54</td><td className={cell}>C+</td><td className={num}>2.50</td></tr>
              <tr><td className={cell}>45–49</td><td className={cell}>C</td><td className={num}>2.25</td></tr>
              <tr><td className={cell}>40–44</td><td className={cell}>D</td><td className={num}>2.00</td></tr>
              <tr><td className={cell}>Below 40</td><td className={cell}>F</td><td className={num}>0.00</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Not every university follows it. Some use different mark ranges or extra grades, and some report
          results on a 5.00 scale. Check your own university’s handbook or result sheet. The CGPA formula itself
          is the same on any scale.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: from courses to GPA, from semesters to CGPA">
        <h3>Step 1: one semester’s GPA</h3>
        <p>A semester GPA follows the same rule, with courses in place of semesters:</p>
        <ul>
          <li>Course 1: A (3.75) × 3 credits = 11.25</li>
          <li>Course 2: B+ (3.25) × 3 credits = 9.75</li>
          <li>Course 3: A- (3.50) × 3 credits = 10.50</li>
          <li>Course 4: B (3.00) × 1.5 credits = 4.50</li>
        </ul>
        <p>
          Total grade points are 36.00 over 10.5 credits, so the GPA = 36 ÷ 10.5 = 3.428…, or{" "}
          <strong>3.43</strong> to two decimals. To do this from letter grades, use the{" "}
          <Link href={localePath("en", calculatorPath("gpa-calculator"))} className={link}>
            GPA Calculator
          </Link>
          .
        </p>

        <h3>Step 2: combine the semesters into a CGPA</h3>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Semester</th>
                <th scope="col" className={headNum}>GPA</th>
                <th scope="col" className={headNum}>Credits</th>
                <th scope="col" className={headNum}>GPA × credits</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>Semester 1</td><td className={num}>3.50</td><td className={num}>12</td><td className={num}>42.00</td></tr>
              <tr><td className={cell}>Semester 2</td><td className={num}>4.00</td><td className={num}>18</td><td className={num}>72.00</td></tr>
              <tr><td className={cell}><strong>Total</strong></td><td className={num}></td><td className={num}><strong>30</strong></td><td className={num}><strong>114.00</strong></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          CGPA = 114 ÷ 30 = <strong>3.80</strong>. Notice that a plain average of the two GPAs would be 3.75;
          the real CGPA is higher because the bigger semester was the 4.00 one.
        </p>

        <h3>Step 3: add a new semester to your current CGPA</h3>
        <p>
          You don’t need every old semester. Treat your current CGPA and the total credits completed so far as
          one semester. With a CGPA of 3.40 over 60 credits and a new semester of 3.80 over 15 credits: (3.40 ×
          60 + 3.80 × 15) ÷ 75 = (204 + 57) ÷ 75 = 261 ÷ 75 = <strong>3.48</strong>. Entering every old semester separately would give
          exactly the same result, because current CGPA × total credits is simply the sum of all the earlier
          semesters’ GPA × credits.
        </p>
      </ContentSection>

      <ContentSection id="rounding" title="Rounding or truncating?">
        <p>
          The division often runs to many decimals, so the answer has to be brought to two. There are two
          methods in use:
        </p>
        <ul>
          <li>
            <strong>Rounding (half up):</strong> if the third decimal is 5 or more, the second goes up by 1.
            3.428… becomes 3.43.
          </li>
          <li>
            <strong>Truncating:</strong> the digits after the second decimal are simply dropped. 3.428…
            becomes 3.42.
          </li>
        </ul>
        <p>
          Our calculator rounds to two decimals. Some universities truncate, so your official CGPA can be 0.01
          lower; check your handbook to see which applies. One more point: if you round each semester GPA first
          and then work out the CGPA, the last digit can come out slightly different. Where you can, divide the
          total grade points of all courses by the total credits; with unrounded semester GPAs the two methods
          give exactly the same answer. Your university’s published CGPA is the one that counts.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: work out your own CGPA">
        <ol>
          <li>From your result sheets, take each semester’s GPA and its credits.</li>
          <li>Multiply each GPA by its credits.</li>
          <li>Add up those results, and separately add up all the credits.</li>
          <li>Divide the first total by the total credits.</li>
          <li>Round or truncate to two decimals, following your university’s rule.</li>
        </ol>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Averaging GPAs without credits.</strong> With 3.80 on 9 credits and 3.00 on 18 credits, the
            plain average is (3.80 + 3.00) ÷ 2 = 3.40, but the correct CGPA is (3.80 × 9 + 3.00 × 18) ÷ 27 =
            88.2 ÷ 27 = 3.27. The two only match when every semester has the same credits.
          </li>
          <li>
            <strong>Mixing scales.</strong> You can’t average GPAs on the 4.00 scale with GPAs on the 5.00
            scale, and an SSC or HSC GPA out of 5.00 doesn’t combine with a university CGPA either. We don’t
            assume any official formula for converting between scales; if you need one, ask the institution
            concerned.
          </li>
          <li>
            <strong>Confusing rounding with truncation.</strong> The correct CGPA above, 3.266…, is 3.27 when
            rounded and 3.26 when truncated. Don’t assume your official result shows 3.27.
          </li>
          <li>
            <strong>Dropping the credits of a failed course.</strong> In a semester GPA an F adds no points, but
            its credits stay in the divisor. Whether a retake replaces the old grade or is averaged with it is up
            to your university’s policy.
          </li>
        </ul>
        <p>
          Rather than multiplying and dividing by hand, enter each semester’s GPA and credits in the{" "}
          <Link href={calculator} className={link}>
            CGPA Calculator
          </Link>{" "}
          to see your CGPA and total credits straight away, on a 4.00 or 5.00 scale. Nothing you enter is sent
          anywhere.
        </p>
      </ContentSection>
    </>
  );
}

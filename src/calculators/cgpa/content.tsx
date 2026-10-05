import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the CGPA Calculator page (Server Component, no JS). */
export function CgpaCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How CGPA is calculated">
        <p>
          <strong>CGPA = Σ (semester GPA × semester credits) ÷ Σ credits</strong>
        </p>
        <p>
          Each semester counts in proportion to the credits you completed in it. Multiply every semester’s GPA by
          its credits, add the results, and divide by the total credits.
        </p>

        <h3>Worked example</h3>
        <p>
          Semester 1: 3.50 on 12 credits gives 42.00. Semester 2: 4.00 on 18 credits gives 72.00. Total = 114.00 over
          30 credits, so CGPA = 114 ÷ 30 = <strong>3.80</strong>.
        </p>
      </ContentSection>

      <ContentSection id="not-a-simple-average" title="Why not just average the GPAs?">
        <p>
          A plain average treats every semester equally, which is only right when all semesters have the same
          credits. Take 3.80 on 9 credits and 3.00 on 18 credits:
        </p>
        <ul>
          <li>Plain average: (3.80 + 3.00) ÷ 2 = 3.40 (wrong)</li>
          <li>Weighted: (3.80 × 9 + 3.00 × 18) ÷ 27 = 88.2 ÷ 27 = 3.27 (correct)</li>
        </ul>
        <p>The heavier semester pulls the CGPA towards its own GPA, so the correct answer is lower.</p>
      </ContentSection>

      <ContentSection id="add-a-semester" title="Adding a new semester to your current CGPA">
        <p>
          You don’t need every old semester. Enter your current CGPA and the total credits you have completed as
          one row, then add the new semester as another row. This gives exactly the same result as entering each
          semester separately.
        </p>
        <p>
          Example: a current CGPA of 3.40 over 60 credits plus a new semester of 3.80 over 15 credits gives (3.40 ×
          60 + 3.80 × 15) ÷ 75 = 261 ÷ 75 = <strong>3.48</strong>.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Pick your grading scale, 4.00 or 5.00. It sets the highest GPA you can enter.</li>
          <li>For each semester, enter the GPA and the credits completed. The name is optional.</li>
          <li>Use Add semester for more rows, or leave extra rows empty. They are ignored.</li>
          <li>Select Calculate CGPA to see your CGPA and total credits.</li>
        </ol>
        <p>
          The CGPA is rounded to 2 decimals (half up). Some institutions truncate instead. If you need to work out a
          semester GPA from letter grades first, use the GPA calculator.
        </p>
      </ContentSection>
    </>
  );
}

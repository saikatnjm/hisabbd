import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the GPA Calculator page (Server Component, no JS). */
export function GpaCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How GPA is calculated">
        <p>
          <strong>GPA = Σ (grade point × credits) ÷ Σ credits</strong>
        </p>
        <p>
          For each course, multiply its grade point by its credits. Add those results to get the total grade
          points, then divide by the total credits.
        </p>

        <h3>Worked example</h3>
        <ul>
          <li>Course 1: A (3.75) × 3 credits = 11.25</li>
          <li>Course 2: B+ (3.25) × 3 credits = 9.75</li>
          <li>Course 3: A- (3.50) × 3 credits = 10.50</li>
          <li>Course 4: B (3.00) × 1.5 credits = 4.50</li>
        </ul>
        <p>
          Total grade points = 36.00 and total credits = 10.5, so GPA = 36 ÷ 10.5 = 3.428…, shown as{" "}
          <strong>3.43</strong>. Truncated to two decimals it would be 3.42, which is why an official figure can
          differ slightly from a rounded one.
        </p>
      </ContentSection>

      <ContentSection id="grade-scale" title="Grade scale used">
        <p>
          The calculator uses the uniform 4.00 grading scale published by Bangladesh’s University Grants
          Commission, which many universities follow. Your university may use different cut-offs, so check your
          own handbook.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Marks</th>
                <th scope="col" className="px-3 py-2 font-semibold">Letter grade</th>
                <th scope="col" className="px-3 py-2 font-semibold">Grade point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="px-3 py-2">80–100</td><td className="px-3 py-2">A+</td><td className="px-3 py-2">4.00</td></tr>
              <tr><td className="px-3 py-2">75–79</td><td className="px-3 py-2">A</td><td className="px-3 py-2">3.75</td></tr>
              <tr><td className="px-3 py-2">70–74</td><td className="px-3 py-2">A-</td><td className="px-3 py-2">3.50</td></tr>
              <tr><td className="px-3 py-2">65–69</td><td className="px-3 py-2">B+</td><td className="px-3 py-2">3.25</td></tr>
              <tr><td className="px-3 py-2">60–64</td><td className="px-3 py-2">B</td><td className="px-3 py-2">3.00</td></tr>
              <tr><td className="px-3 py-2">55–59</td><td className="px-3 py-2">B-</td><td className="px-3 py-2">2.75</td></tr>
              <tr><td className="px-3 py-2">50–54</td><td className="px-3 py-2">C+</td><td className="px-3 py-2">2.50</td></tr>
              <tr><td className="px-3 py-2">45–49</td><td className="px-3 py-2">C</td><td className="px-3 py-2">2.25</td></tr>
              <tr><td className="px-3 py-2">40–44</td><td className="px-3 py-2">D</td><td className="px-3 py-2">2.00</td></tr>
              <tr><td className="px-3 py-2">Below 40</td><td className="px-3 py-2">F</td><td className="px-3 py-2">0.00</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          This calculator is for university-style letter grades and credits. It is not meant for SSC or HSC
          results, which follow their own rules.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>For each course, choose the grade you got.</li>
          <li>Enter its credits, for example 3, 1.5 or 0.75. The name is optional.</li>
          <li>Use Add course for more rows, or leave extra rows empty. They are ignored.</li>
          <li>Select Calculate GPA to see your GPA, total credits and grade points.</li>
        </ol>
        <p>
          A course with an F still counts: it adds no grade points but its credits stay in the total. If you
          want to see the effect of a retake, replace the grade and calculate again. To combine several
          semesters, use the CGPA calculator.
        </p>
        <p>
          The GPA is rounded to 2 decimals (half up). Some institutions truncate instead.
        </p>
      </ContentSection>
    </>
  );
}

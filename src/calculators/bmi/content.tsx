import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the BMI Calculator page (Server Component, no JS). */
export function BmiCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How BMI is calculated">
        <p>Body mass index (BMI) compares your weight with your height:</p>
        <p>
          <strong>BMI = weight in kg ÷ (height in metres × height in metres)</strong>
        </p>
        <p>
          If you enter feet and inches or pounds, they are converted exactly first: 1 inch is 2.54
          cm and 1 pound is 0.45359237 kg.
        </p>

        <h3>Worked example</h3>
        <p>
          A person who is 170 cm (1.70 m) tall and weighs 70 kg: 1.70 × 1.70 = 2.89, and 70 ÷ 2.89 ={" "}
          <strong>24.2</strong>. That is in the healthy weight range. At 170 cm, the healthy range
          is about 53.5 kg to 72.0 kg.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose your height unit (cm, or feet and inches) and enter your height.</li>
          <li>Choose kg or lb and enter your weight.</li>
          <li>Select Calculate BMI. The result updates as you change the numbers.</li>
        </ol>
        <p>
          Inches can be left empty if you are exactly a whole number of feet tall. The calculator
          accepts heights from 50 to 272 cm and weights from 2 to 650 kg; these limits only catch
          typing mistakes.
        </p>
      </ContentSection>

      <ContentSection id="categories" title="BMI categories for adults">
        <p>
          This calculator uses the World Health Organization (WHO) adult categories. Your category is
          decided by the BMI shown on screen, rounded to one decimal place, so the number and the
          category always match.
        </p>
        <ul>
          <li>
            <strong>Underweight:</strong> below 18.5
          </li>
          <li>
            <strong>Healthy weight:</strong> 18.5 to 24.9
          </li>
          <li>
            <strong>Overweight:</strong> 25 to 29.9
          </li>
          <li>
            <strong>Obesity:</strong> 30 and above (class I: 30 to 34.9, class II: 35 to 39.9, class
            III: 40 and above)
          </li>
        </ul>
        <p>
          The healthy weight range shown in your result is the weight that gives a BMI of 18.5 to 24.9
          at your height.
        </p>
      </ContentSection>

      <ContentSection id="limits" title="What BMI can and can’t tell you">
        <p>
          BMI is a screening measure, not a diagnosis. It is a quick way to see whether weight might
          be worth discussing with a health professional, but it does not measure body fat, where fat
          is carried, fitness or overall health.
        </p>
        <ul>
          <li>The categories are for adults aged 18 and over, not children or teenagers.</li>
          <li>BMI is not suitable during pregnancy.</li>
          <li>
            Very muscular people can have a high BMI without having much body fat, and older adults
            can have a healthy-looking BMI with low muscle.
          </li>
        </ul>

        <h3>Background on Asian populations</h3>
        <p>
          A WHO expert consultation in 2004 noted that many Asian populations have a higher risk of
          some health problems at a lower BMI than the standard cut-offs suggest, and proposed
          additional public-health cut-off points of 23 and 27.5. This calculator keeps the standard
          WHO categories above. If you want to know what BMI means for you, ask a doctor.
        </p>
      </ContentSection>
    </>
  );
}

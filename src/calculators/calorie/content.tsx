import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { CALORIE_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Calorie Calculator (Server Component, no JS). */
export function CalorieCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));
  return (
    <>
      <ContentSection id="how-it-works" title="How daily calories are worked out">
        <p>In two steps:</p>
        <ol>
          <li>
            <strong>BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age</strong>, + 5 for men, − 161 for women
            (Mifflin–St Jeor, 1990).
          </li>
          <li>
            <strong>Daily calories = BMR × activity factor</strong> (1.2 to 1.9).
          </li>
        </ol>
        <h3>Examples</h3>
        <ul>
          <li>
            Man, 30, 170 cm, 70 kg: BMR = 700 + 1,062.5 − 150 + 5 = 1,617.5, about 1,618 kcal. With moderate activity ×
            1.55 = <strong>about 2,507 kcal</strong> a day.
          </li>
          <li>
            Woman, 30, 155 cm, 55 kg: BMR = 550 + 968.75 − 150 − 161 = 1,207.75, about 1,208. With light activity × 1.375
            = <strong>about 1,661 kcal</strong>.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="limits" title="The limits of this estimate">
        <ul>
          <li>It is an estimate; two people of the same age and size can need different amounts.</li>
          <li>The activity factors (1.2, 1.375, 1.55, 1.725, 1.9) are a widely used convention, not part of the Mifflin–St Jeor study.</li>
          <li>The equation came from healthy adults aged 19–78, so the calculator takes ages 18–80.</li>
          <li>For children, pregnancy, breastfeeding or any health condition, ask a doctor or nutritionist.</li>
        </ul>
      </ContentSection>

      <ContentSection id="related" title="Other height and weight tools">
        <p>
          If you know your height in feet and inches, convert it with the{" "}
          <Link href={en("height-converter")} className={link}>
            Height Converter
          </Link>
          ; for weights in other units, the{" "}
          <Link href={en("weight-converter")} className={link}>
            Weight Converter
          </Link>
          . To see how your weight compares with your height, use the{" "}
          <Link href={en("bmi-calculator")} className={link}>
            BMI Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose your sex; the equation has a different constant for men and women.</li>
          <li>Enter your age in years, height in cm and weight in kg. Bangla digits work.</li>
          <li>Choose your activity level.</li>
          <li>Select Calculate calories to see your daily calories, BMR and a table for every activity level.</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="Source">
        <p>
          <a href={S.mifflin.url} target="_blank" rel="noopener" className={link}>
            {S.mifflin.title}
          </a>
          . Checked on 1 November 2026.
        </p>
      </ContentSection>
    </>
  );
}

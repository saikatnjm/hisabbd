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

/** Height, cm, healthy weight in kg and lb (BMI 18.5 to 24.9 × height², as the calculator's logic.ts rule 5). */
const HEALTHY_ROWS: readonly [height: string, cm: string, kg: string, lb: string][] = [
  ["5 ft 0 in", "152.4", "43.0 – 57.8", "94.7 – 127.5"],
  ["5 ft 2 in", "157.5", "45.9 – 61.8", "101.1 – 136.1"],
  ["5 ft 4 in", "162.6", "48.9 – 65.8", "107.8 – 145.1"],
  ["5 ft 6 in", "167.6", "52.0 – 70.0", "114.6 – 154.3"],
  ["5 ft 8 in", "172.7", "55.2 – 74.3", "121.7 – 163.8"],
  ["5 ft 10 in", "177.8", "58.5 – 78.7", "128.9 – 173.5"],
  ["6 ft 0 in", "182.9", "61.9 – 83.3", "136.4 – 183.6"],
];

/** English guide: what BMI is, how it is calculated, the WHO adult categories and its limits (Server Component, no JS). */
export function BmiExplainedGuideContent() {
  const calculator = localePath("en", calculatorPath("bmi-calculator"));

  return (
    <>
      <ContentSection id="what" title="What BMI is and why it is used">
        <p>
          BMI (body mass index) is a single number that compares your weight with your height. The same weight
          means something different on a tall person and a short one; BMI puts the two together so you can see
          whether weight is low, about right or high for your height. All it needs is a tape measure and a
          scale, which is why doctors’ chambers, gyms and health surveys use it so widely.
        </p>
        <p>
          Keep in mind that BMI is a <strong>screening number for adults</strong>, not a diagnosis. It doesn’t
          measure body fat; it only suggests whether weight is worth talking to a doctor about. To see your own
          number straight away, use the{" "}
          <Link href={calculator} className={link}>
            BMI Calculator
          </Link>
          . It follows exactly the rules below, and what you type never leaves your phone or computer.
        </p>
      </ContentSection>

      <ContentSection id="formula" title="The BMI formula, with a worked example">
        <p>
          <strong>BMI = weight in kg ÷ (height in metres × height in metres)</strong>
        </p>
        <p>If you know your height in centimetres, divide by 100 first: 170 cm = 1.70 m.</p>
        <ol>
          <li>Square the height: 1.70 × 1.70 = 2.89.</li>
          <li>Divide the weight by it: 70 kg ÷ 2.89 = 24.22.</li>
          <li>To one decimal place the BMI is <strong>24.2</strong>, which is in the healthy weight band.</li>
        </ol>
        <p>Here is what happens when the weight changes at the same height:</p>
        <ul>
          <li>170 cm, 50 kg: 50 ÷ 2.89 = <strong>17.3</strong>, which is underweight.</li>
          <li>175 cm, 100 kg: 100 ÷ (1.75 × 1.75) = 100 ÷ 3.0625 = <strong>32.7</strong>, which is obesity class I.</li>
        </ul>
      </ContentSection>

      <ContentSection id="feet-pounds" title="Calculating BMI in feet, inches and pounds">
        <p>
          In Bangladesh, height is usually given in feet and inches, and many scales show pounds. Convert them
          before using the formula:
        </p>
        <ul>
          <li>Height: total inches = feet × 12 + inches, then 1 inch = 2.54 cm.</li>
          <li>Weight: 1 pound = 0.45359237 kg.</li>
        </ul>
        <p>Example: 5 ft 7 in tall, weighing 154 lb.</p>
        <ol>
          <li>5 × 12 + 7 = 67 inches; 67 × 2.54 = 170.18 cm, or 1.7018 m.</li>
          <li>154 × 0.45359237 = 69.85 kg.</li>
          <li>1.7018 × 1.7018 = 2.896; 69.85 ÷ 2.896 = <strong>24.1</strong>, a healthy weight.</li>
        </ol>
        <p>
          Another: at 6 ft (182.88 cm) and 90 kg, the BMI is <strong>26.9</strong>, in the overweight band. If
          there are no extra inches, count them as 0.
        </p>
        <p>
          BMI is only as good as the measurements. Measure height without shoes, standing straight with your
          back against a wall. Weigh yourself in light clothes, ideally in the morning before eating and on the
          same scale each time, so day-to-day swings matter less. A guessed height that is an inch or two out can
          move BMI by about a point: at 70 kg, 5 ft 7 in gives 24.2 but 5 ft 8 in gives 23.5.
        </p>
      </ContentSection>

      <ContentSection id="categories" title="WHO categories: what BMI is normal">
        <p>The World Health Organization (WHO) groups adult BMI like this:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>BMI</th>
                <th scope="col" className={head}>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>Below 18.5</td><td className={cell}>Underweight</td></tr>
              <tr><td className={cell}>18.5 – 24.9</td><td className={cell}><strong>Healthy (normal) weight</strong></td></tr>
              <tr><td className={cell}>25.0 – 29.9</td><td className={cell}>Overweight</td></tr>
              <tr><td className={cell}>30.0 – 34.9</td><td className={cell}>Obesity class I</td></tr>
              <tr><td className={cell}>35.0 – 39.9</td><td className={cell}>Obesity class II</td></tr>
              <tr><td className={cell}>40 or more</td><td className={cell}>Obesity class III</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          So for an adult, a BMI of <strong>18.5 to 24.9</strong> counts as normal. WHO’s own table calls that
          band “normal weight” and 25 to 29.9 “pre-obesity”; our calculator shows them as Healthy weight and
          Overweight.
        </p>
        <p>
          The category is decided by the BMI rounded to one decimal place, so the number you see and the
          category always match. A BMI that works out at 24.95 is shown as 25.0 and classed as overweight.
        </p>
        <p>
          A WHO expert consultation in 2004 noted that many Asian populations face higher risk of some health
          problems at a lower BMI, and proposed extra public-health cut-off points of 23 and 27.5. Treat that as
          background, and ask a doctor what it means for you.
        </p>
      </ContentSection>

      <ContentSection id="healthy-weight" title="Healthy weight for your height">
        <p>Turn the formula round and you get the healthy weight range for any height:</p>
        <p>
          <strong>Healthy weight = 18.5 × height² to 24.9 × height²</strong> (height in metres)
        </p>
        <p>
          At 170 cm: 18.5 × 2.89 = 53.5 kg and 24.9 × 2.89 = 72.0 kg. For someone <strong>5 ft 6 in</strong> tall
          (66 inches = 167.64 cm), 1.6764 × 1.6764 = 2.810, so a healthy weight is about{" "}
          <strong>52.0 to 70.0 kg</strong> (114.6 to 154.3 lb).
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Height</th>
                <th scope="col" className={headNum}>cm</th>
                <th scope="col" className={headNum}>kg</th>
                <th scope="col" className={headNum}>lb</th>
              </tr>
            </thead>
            <tbody>
              {HEALTHY_ROWS.map(([height, cm, kg, lb]) => (
                <tr key={height}>
                  <td className={cell}>{height}</td>
                  <td className={num}>{cm}</td>
                  <td className={num}>{kg}</td>
                  <td className={num}>{lb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          This is a range, not one “ideal weight”. Where you sit inside it depends on your build, age and
          health. For any other height, enter your height and weight in the{" "}
          <Link href={calculator} className={link}>
            BMI Calculator
          </Link>
          ; alongside your BMI it shows the healthy weight range in kg or lb.
        </p>
      </ContentSection>

      <ContentSection id="limits" title="What BMI doesn’t tell you">
        <p>BMI only looks at weight and height, so it misses a lot:</p>
        <ul>
          <li>
            <strong>Muscle versus fat.</strong> Athletes and people who do heavy physical work can have a high BMI
            with little body fat, because muscle is heavy.
          </li>
          <li>
            <strong>Age.</strong> Older adults lose muscle, so a normal-looking BMI can hide more body fat.
          </li>
          <li>
            <strong>Where fat is carried.</strong> Fat around the waist carries more risk, and BMI can’t see it.
          </li>
          <li>
            <strong>Pregnancy.</strong> These BMI categories don’t apply during pregnancy.
          </li>
          <li>
            <strong>Children and teenagers.</strong> Their BMI is compared with growth charts for their age and
            sex, not with the table above. That needs their exact age in years and months, which you can find
            with the{" "}
            <Link href={localePath("en", calculatorPath("age-calculator"))} className={link}>
              Age Calculator
            </Link>
            ; leave reading the chart to a doctor or health worker.
          </li>
        </ul>
        <p>
          So a low or high BMI is no reason to panic, and a normal one is no guarantee of good health. If you
          are worried about your weight, diet or any symptoms, <strong>talk to a doctor</strong>. They will look
          at your waist, blood pressure, blood tests and history as well as your BMI.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <p>
          Adult BMI categories (below 18.5 to 40 and above, classes I–III):{" "}
          <a
            href="https://www.who.int/europe/news-room/fact-sheets/item/nutrition---maintaining-a-healthy-lifestyle"
            target="_blank"
            rel="noopener"
            className={link}
          >
            WHO Europe, “Nutrition for a healthy life”
          </a>{" "}
          (18 July 2025; checked 29 October 2026). Conversion factors are the international definitions: 1 inch
          = 2.54 cm, 1 pound = 0.45359237 kg. This guide is not medical advice.
        </p>
      </ContentSection>
    </>
  );
}

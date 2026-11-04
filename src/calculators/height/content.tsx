import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[16rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Common heights: feet-inches → cm (feet × 12 + inches) × 2.54, same as the logic. */
const HEIGHTS: readonly [ftIn: string, cm: string][] = [
  ["5 ft 0 in", "152.40"],
  ["5 ft 2 in", "157.48"],
  ["5 ft 4 in", "162.56"],
  ["5 ft 6 in", "167.64"],
  ["5 ft 8 in", "172.72"],
  ["5 ft 10 in", "177.80"],
  ["6 ft 0 in", "182.88"],
];

/** Explanatory content for the Height Converter (Server Component, no JS). */
export function HeightCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="Feet and inches to cm: the formula">
        <p>
          <strong>cm = (feet × 12 + inches) × 2.54</strong>
        </p>
        <p>1 foot = 12 inches and 1 inch = exactly 2.54 centimetres. To go back, divide the cm by 2.54 to get inches.</p>
        <h3>Example: 5 ft 4 in</h3>
        <ol>
          <li>In inches: 5 × 12 + 4 = 64 inches.</li>
          <li>In cm: 64 × 2.54 = <strong>162.56 cm</strong>, or 1.6256 m.</li>
        </ol>
        <h3>The other way: 165 cm</h3>
        <ol>
          <li>In inches: 165 ÷ 2.54 = 64.96 inches.</li>
          <li>64.96 ÷ 12 = 5 feet with 4.96 inches over, 5.0 to one decimal, so about <strong>5 ft 5 in</strong>.</li>
        </ol>
      </ContentSection>

      <ContentSection id="table" title="Common heights in cm">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Feet and inches</th>
                <th scope="col" className={headNum}>cm</th>
              </tr>
            </thead>
            <tbody>
              {HEIGHTS.map(([ftIn, cm]) => (
                <tr key={ftIn}>
                  <td className={cell}>{ftIn}</td>
                  <td className={num}>{cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Job circulars usually give height in feet and inches; check the exact figure in the circular you are applying
          for. To check the age limit, use the{" "}
          <Link href={localePath("en", calculatorPath("government-job-age-calculator"))} className={link}>
            Government Job Age Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="haat-goj" title="হাত (haat) and গজ (goj)">
        <ul>
          <li>1 হাত = 18 inches = 1.5 feet = 45.72 cm.</li>
          <li>1 গজ = 2 হাত = 3 feet = 36 inches = 91.44 cm.</li>
        </ul>
        <p>
          The হাত can vary by area, so use feet or metres for deeds and official work. For land, use the{" "}
          <Link href={localePath("en", calculatorPath("land-calculator"))} className={link}>
            Land Area Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="bmi" title="Using your height for BMI">
        <p>
          With your height in cm and your weight, use the{" "}
          <Link href={localePath("en", calculatorPath("bmi-calculator"))} className={link}>
            BMI Calculator
          </Link>
          ; it also takes feet and inches directly. If your weight is in মণ or সের, convert it to kg first with the{" "}
          <Link href={localePath("en", calculatorPath("weight-converter"))} className={link}>
            Weight Converter
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose “Feet and inches” or “Centimetres”.</li>
          <li>Enter feet and inches (leave inches blank for 0), or the height in cm. Bangla digits work.</li>
          <li>Select Convert height to see cm or feet and inches, metres, total inches, হাত and গজ.</li>
        </ol>
      </ContentSection>
    </>
  );
}

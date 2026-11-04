import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { FEVER_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[16rem] text-left text-sm";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const cell = "border-b border-slate-200 py-2 pr-3";

/** °F → °C, (F − 32) × 5 ÷ 9 to 2 decimals; fever from 38 °C (NHS). Same figures as the logic tests. */
const READINGS: readonly [f: string, c: string, fever: boolean][] = [
  ["97", "36.11", false],
  ["98", "36.67", false],
  ["98.6", "37.00", false],
  ["99", "37.22", false],
  ["100", "37.78", false],
  ["100.4", "38.00", true],
  ["101", "38.33", true],
  ["102", "38.89", true],
  ["103", "39.44", true],
  ["104", "40.00", true],
  ["105", "40.56", true],
];

/** Explanatory content for the Fever Temperature Converter (Server Component, no JS). */
export function TemperatureCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="Fahrenheit to Celsius: the formula">
        <p>
          <strong>°C = (°F − 32) × 5 ÷ 9</strong>, and the other way <strong>°F = °C × 9 ÷ 5 + 32</strong>.
        </p>
        <h3>Example: 102 °F</h3>
        <ol>
          <li>102 − 32 = 70.</li>
          <li>70 × 5 ÷ 9 = <strong>38.89 °C</strong>.</li>
          <li>That is above 38 °C, so it is a high temperature (fever) by the NHS definition.</li>
        </ol>
      </ContentSection>

      <ContentSection id="table" title="Thermometer readings in °F and °C">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={headNum}>°F</th>
                <th scope="col" className={headNum}>°C</th>
                <th scope="col" className={head}>By the NHS definition</th>
              </tr>
            </thead>
            <tbody>
              {READINGS.map(([f, c, fever]) => (
                <tr key={f}>
                  <td className={num}>{f}</td>
                  <td className={num}>{c}</td>
                  <td className={cell}>{fever ? "Fever" : "Not a fever"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Note that a “100 degree fever” is 37.78 °C, just under the 38 °C line. A line is used because body temperature
          varies a little from person to person and through the day.
        </p>
      </ContentSection>

      <ContentSection id="children" title="Fever in babies: when not to wait">
        <p>The NHS says to get medical help straight away if:</p>
        <ul>
          <li>a baby under 3 months has a temperature of 38 °C (100.4 °F) or higher;</li>
          <li>a baby of 3 to 6 months has 39 °C (102.2 °F) or higher.</li>
        </ul>
        <p>
          For adults, see a doctor if a high temperature isn’t getting better with care at home, or is getting worse. In
          Bangladesh, contact a doctor or your nearest health centre. This page does not diagnose anything.
        </p>
      </ContentSection>

      <ContentSection id="more" title="Other useful calculators">
        <p>
          To find a child’s age in months and days, use the{" "}
          <Link href={localePath("en", calculatorPath("age-calculator"))} className={link}>
            Age Calculator
          </Link>
          ; for adults’ weight and height, the{" "}
          <Link href={localePath("en", calculatorPath("bmi-calculator"))} className={link}>
            BMI Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose what your thermometer reads in: °F or °C.</li>
          <li>Enter the temperature, e.g. 102. Bangla digits work.</li>
          <li>Select Convert to see the other unit and, for a body temperature, whether it counts as a fever.</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            <a href={S.adults.url} target="_blank" rel="noopener" className={link}>
              {S.adults.title}
            </a>{" "}
            (reviewed 19 October 2026).
          </li>
          <li>
            <a href={S.children.url} target="_blank" rel="noopener" className={link}>
              {S.children.title}
            </a>{" "}
            (reviewed 3 January 2024).
          </li>
        </ul>
        <p>Checked on 1 November 2026.</p>
      </ContentSection>
    </>
  );
}

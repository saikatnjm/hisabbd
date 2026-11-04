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

/** Bangla explanatory content for the Fever Temperature Converter (Server Component, no JS). */
export function TemperatureCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="ফারেনহাইট থেকে সেলসিয়াস: সূত্র">
        <p>
          <strong>°C = (°F − 32) × 5 ÷ 9</strong>, আর উল্টো দিকে <strong>°F = °C × 9 ÷ 5 + 32</strong>।
        </p>
        <h3>উদাহরণ: 102 °F</h3>
        <ol>
          <li>102 − 32 = 70।</li>
          <li>70 × 5 ÷ 9 = <strong>38.89 °C</strong>।</li>
          <li>এটি 38 °C-এর বেশি, তাই এনএইচএসের সংজ্ঞায় উচ্চ তাপমাত্রা (জ্বর)।</li>
        </ol>
      </ContentSection>

      <ContentSection id="table" title="থার্মোমিটারের তাপমাত্রা: ফারেনহাইট আর সেলসিয়াস">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={headNum}>°F</th>
                <th scope="col" className={headNum}>°C</th>
                <th scope="col" className={head}>এনএইচএসের সংজ্ঞায়</th>
              </tr>
            </thead>
            <tbody>
              {READINGS.map(([f, c, fever]) => (
                <tr key={f}>
                  <td className={num}>{f}</td>
                  <td className={num}>{c}</td>
                  <td className={cell}>{fever ? "জ্বর" : "জ্বর নয়"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          খেয়াল করুন, “100 ডিগ্রি জ্বর” আসলে 37.78 °C, 38 °C সীমার সামান্য নিচে। এই সীমা ধরা হয় কারণ শরীরের তাপমাত্রা
          মানুষভেদে আর দিনের সময়ভেদে কিছুটা বদলায়।
        </p>
      </ContentSection>

      <ContentSection id="children" title="শিশুর জ্বর: কখন দেরি করবেন না">
        <p>এনএইচএসের পরামর্শ অনুযায়ী দেরি না করে চিকিৎসকের সাহায্য নিন যদি:</p>
        <ul>
          <li>শিশুর বয়স 3 মাসের কম আর তাপমাত্রা 38 °C (100.4 °F) বা বেশি;</li>
          <li>শিশুর বয়স 3 থেকে 6 মাস আর তাপমাত্রা 39 °C (102.2 °F) বা বেশি।</li>
        </ul>
        <p>
          বড়দের ক্ষেত্রে ঘরে যত্ন নেওয়ার পরও জ্বর না কমলে বা বাড়লে ডাক্তার দেখান। বাংলাদেশে ডাক্তার বা নিকটস্থ
          স্বাস্থ্যকেন্দ্রে যোগাযোগ করুন। এই পাতা রোগনির্ণয় করে না।
        </p>
      </ContentSection>

      <ContentSection id="more" title="আরও কাজের হিসাব">
        <p>
          শিশুর বয়স মাস ও দিনে জানতে{" "}
          <Link href={localePath("bn", calculatorPath("age-calculator"))} className={link}>
            বয়স ক্যালকুলেটর
          </Link>
          , আর ওজন-উচ্চতা দিয়ে বড়দের{" "}
          <Link href={localePath("bn", calculatorPath("bmi-calculator"))} className={link}>
            বিএমআই
          </Link>{" "}
          দেখুন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>থার্মোমিটার কোন এককে দেখায় বেছে নিন: °F বা °C।</li>
          <li>তাপমাত্রা লিখুন, যেমন 102। বাংলা অঙ্কও চলে।</li>
          <li>“রূপান্তর করুন” চাপলে অন্য এককে তাপমাত্রা আর শরীরের তাপমাত্রা হলে জ্বর কি না দেখা যাবে।</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            <a href={S.adults.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.adults.title}
            </a>{" "}
            (19 অক্টোবর 2026-এ পর্যালোচিত)।
          </li>
          <li>
            <a href={S.children.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.children.title}
            </a>{" "}
            (3 জানুয়ারি 2024-এ পর্যালোচিত)।
          </li>
        </ul>
        <p>1 নভেম্বর 2026-এ যাচাই করা।</p>
      </ContentSection>
    </>
  );
}

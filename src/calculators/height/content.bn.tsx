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
  ["5 ফুট 0 ইঞ্চি", "152.40"],
  ["5 ফুট 2 ইঞ্চি", "157.48"],
  ["5 ফুট 4 ইঞ্চি", "162.56"],
  ["5 ফুট 6 ইঞ্চি", "167.64"],
  ["5 ফুট 8 ইঞ্চি", "172.72"],
  ["5 ফুট 10 ইঞ্চি", "177.80"],
  ["6 ফুট 0 ইঞ্চি", "182.88"],
];

/** Bangla explanatory content for the Height Converter (Server Component, no JS). */
export function HeightCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="ফুট-ইঞ্চি থেকে সেমি: সূত্র">
        <p>
          <strong>সেমি = (ফুট × 12 + ইঞ্চি) × 2.54</strong>
        </p>
        <p>1 ফুট = 12 ইঞ্চি, আর 1 ইঞ্চি = ঠিক 2.54 সেন্টিমিটার। উল্টো দিকে সেমিকে 2.54 দিয়ে ভাগ করলে ইঞ্চি পাবেন।</p>
        <h3>উদাহরণ: 5 ফুট 4 ইঞ্চি</h3>
        <ol>
          <li>ইঞ্চিতে: 5 × 12 + 4 = 64 ইঞ্চি।</li>
          <li>সেমিতে: 64 × 2.54 = <strong>162.56 সেমি</strong>, অর্থাৎ 1.6256 মিটার।</li>
        </ol>
        <h3>উল্টো উদাহরণ: 165 সেমি</h3>
        <ol>
          <li>ইঞ্চিতে: 165 ÷ 2.54 = 64.96 ইঞ্চি।</li>
          <li>64.96 ÷ 12 = 5 ফুট, বাকি 4.96 ইঞ্চি, যা এক দশমিকে 5.0, তাই প্রায় <strong>5 ফুট 5 ইঞ্চি</strong>।</li>
        </ol>
      </ContentSection>

      <ContentSection id="table" title="সাধারণ উচ্চতা সেমিতে">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>ফুট-ইঞ্চি</th>
                <th scope="col" className={headNum}>সেমি</th>
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
          চাকরির সার্কুলারে উচ্চতা সাধারণত ফুট-ইঞ্চিতে লেখা থাকে; যে সার্কুলারে আবেদন করছেন, তার ঠিক সংখ্যাটি দেখুন। বয়সসীমা
          মেলাতে{" "}
          <Link href={localePath("bn", calculatorPath("government-job-age-calculator"))} className={link}>
            সরকারি চাকরির বয়স ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="haat-goj" title="হাত আর গজ">
        <ul>
          <li>1 হাত = 18 ইঞ্চি = 1.5 ফুট = 45.72 সেমি।</li>
          <li>1 গজ = 2 হাত = 3 ফুট = 36 ইঞ্চি = 91.44 সেমি।</li>
        </ul>
        <p>
          হাতের মাপ এলাকাভেদে আলাদা হতে পারে, তাই দলিল বা দাপ্তরিক কাজে ফুট বা মিটার ব্যবহার করুন। জমির মাপের জন্য{" "}
          <Link href={localePath("bn", calculatorPath("land-calculator"))} className={link}>
            জমির পরিমাপ ক্যালকুলেটর
          </Link>{" "}
          দেখুন।
        </p>
      </ContentSection>

      <ContentSection id="bmi" title="উচ্চতা দিয়ে বিএমআই">
        <p>
          উচ্চতা সেমিতে পেলে ওজনসহ{" "}
          <Link href={localePath("bn", calculatorPath("bmi-calculator"))} className={link}>
            বিএমআই ক্যালকুলেটরে
          </Link>{" "}
          দিন; সেখানে ফুট-ইঞ্চিও সরাসরি দেওয়া যায়। ওজন মণ বা সেরে থাকলে আগে{" "}
          <Link href={localePath("bn", calculatorPath("weight-converter"))} className={link}>
            ওজন রূপান্তর
          </Link>{" "}
          দিয়ে কেজিতে নিন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>“ফুট-ইঞ্চি” বা “সেন্টিমিটার” বেছে নিন।</li>
          <li>ফুট আর ইঞ্চি লিখুন (ইঞ্চি না থাকলে ফাঁকা রাখুন), অথবা সেমিতে উচ্চতা লিখুন। বাংলা অঙ্কও চলে।</li>
          <li>“উচ্চতা রূপান্তর করুন” চাপলে সেমি বা ফুট-ইঞ্চি, মিটার, মোট ইঞ্চি, হাত আর গজ দেখা যাবে।</li>
        </ol>
      </ContentSection>
    </>
  );
}

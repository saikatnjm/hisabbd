import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { WEIGHT_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Bangla explanatory content for the Weight Converter (Server Component, no JS). */
export function WeightCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="1 মণ কত কেজি: দুই রকম মণ">
        <ul>
          <li>
            <strong>বাজারের মণ = 40 কেজি।</strong> ধান, চাল, পেঁয়াজসহ সারা দেশের বাজারে এই হিসাবই চলে। 2 মণ = 80 কেজি, 100
            কেজি = 2.5 মণ।
          </li>
          <li>
            <strong>পুরোনো মাপের মণ = 40 সের = 37.32 কেজি।</strong> এটি তোলা থেকে আসা পুরোনো মাপ, যা পুরোনো দলিল আর অঙ্কের
            বইয়ে দেখা যায়।
          </li>
        </ul>
        <h3>উদাহরণ: 100 কেজি</h3>
        <ol>
          <li>বাজারের হিসাবে: 100 ÷ 40 = 2.5 মণ।</li>
          <li>পুরোনো মাপে: 100 ÷ 37.32 = 2.68 মণ, অর্থাৎ 2 মণ 27 সের 2.71 ছটাক।</li>
          <li>পাউন্ডে: 100 ÷ 0.4536 = 220.46 পাউন্ড।</li>
        </ol>
      </ContentSection>

      <ContentSection id="units" title="পুরোনো মাপের একক">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>একক</th>
                <th scope="col" className={head}>সমান</th>
                <th scope="col" className={head}>গ্রামে</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>1 তোলা</td><td className={cell}>180 গ্রেইন</td><td className={cell}>11.66 গ্রাম</td></tr>
              <tr><td className={cell}>1 ছটাক</td><td className={cell}>5 তোলা</td><td className={cell}>58.32 গ্রাম</td></tr>
              <tr><td className={cell}>1 সের</td><td className={cell}>16 ছটাক = 80 তোলা</td><td className={cell}>933.10 গ্রাম</td></tr>
              <tr><td className={cell}>1 মণ</td><td className={cell}>40 সের</td><td className={cell}>37.32 কেজি</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          তোলার ওজন 1833 সালে 180 গ্রেইন (11.6638 গ্রাম) নির্দিষ্ট করা হয়; বাকি এককগুলো তার গুণিতক। সোনার এক ভরিও এক তোলার
          সমান, তাই সোনার হিসাবে{" "}
          <Link href={localePath("bn", calculatorPath("gold-calculator"))} className={link}>
            সোনার দাম ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="market-practice" title="বাজারে ওজনের কয়েকটি কথা">
        <ul>
          <li>
            কোনো কোনো বাজারে আগে মণপ্রতি বাড়তি ওজন (ঢলন) নেওয়া হতো, যেমন রাজশাহীর বানেশ্বরে আমের মণ 46–48 কেজি ধরা হতো;
            2020 সালে সেখানে 40 কেজিতে মণ ধরার সিদ্ধান্ত হয়।
          </li>
          <li>
            জমির মাপের মতো ওজনের পুরোনো এককও এলাকাভেদে আলাদা হতে পারে; জমির হিসাবের জন্য{" "}
            <Link href={localePath("bn", calculatorPath("land-calculator"))} className={link}>
              জমির পরিমাপ ক্যালকুলেটর
            </Link>{" "}
            দেখুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>ওজন লিখুন। বাংলা অঙ্কও চলে।</li>
          <li>কোন এককে লিখেছেন তা বেছে নিন: বাজারের মণ, পুরোনো মাপের মণ, সের, ছটাক, তোলা, কেজি, গ্রাম বা পাউন্ড।</li>
          <li>“রূপান্তর করুন” চাপলে কেজি, বাজারের মণ, পুরোনো মাপে মণ-সের-ছটাক আর সব এককের টেবিল দেখা যাবে।</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            বাজারের 40 কেজির মণ:{" "}
            <a href={S.market.url} target="_blank" rel="noopener" className={link}>
              {S.market.title}
            </a>{" "}
            ও{" "}
            <a href={S.baneshwar.url} target="_blank" rel="noopener" className={link}>
              {S.baneshwar.title}
            </a>
            ।
          </li>
          <li>
            পুরোনো মাপ (তোলা, সের, মণ):{" "}
            <a href={S.traditional.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.traditional.title}
            </a>
            ।
          </li>
        </ul>
        <p>1 নভেম্বর 2026-এ যাচাই করা।</p>
      </ContentSection>
    </>
  );
}

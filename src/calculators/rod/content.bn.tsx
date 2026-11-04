import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { DIAMETERS_MM, kgPerMetre, METRES_PER_FOOT } from "./logic";
import { ROD_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";
const three = (value: number) => formatNumber(value, { decimals: 3, minDecimals: 3 });

/** Bangla explanatory content for the Rod Weight Calculator (Server Component, no JS). */
export function RodCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="রডের ওজন বের করার সূত্র">
        <p>
          <strong>প্রতি মিটারে ওজন (কেজি) = d² ÷ 162</strong>, যেখানে d হলো রডের ব্যাস মিলিমিটারে। প্রতি ফুটে{" "}
          <strong>d² ÷ 532</strong>।
        </p>
        <p>
          সূত্রটি আসে রডের প্রস্থচ্ছেদের ক্ষেত্রফল (π/4 × d²) আর ইস্পাতের ঘনত্ব (7,850 কেজি/ঘনমিটার) থেকে; ঠিকভাবে ধ্রুবকটি
          162.2। ক্যালকুলেটর পুরো সূত্রটিই ব্যবহার করে।
        </p>
        <h3>উদাহরণ: 40 ফুটের 40টি 12 মিমি রড</h3>
        <ol>
          <li>প্রতি ফুটে ওজন: 12² ÷ 532 = 144 ÷ 532 = প্রায় 0.271 কেজি।</li>
          <li>মোট দৈর্ঘ্য: 40 × 40 = 1,600 ফুট (487.68 মিটার)।</li>
          <li>মোট ওজন: প্রায় <strong>432.97 কেজি</strong>, অর্থাৎ 0.433 টন।</li>
          <li>টনপ্রতি ৳1,00,000 দাম ধরলে (শুধু উদাহরণ): 0.433 × 1,00,000 = প্রায় ৳43,297।</li>
        </ol>
      </ContentSection>

      <ContentSection id="table" title="মাপ অনুযায়ী রডের ওজন">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={headNum}>ব্যাস (মিমি)</th>
                <th scope="col" className={headNum}>কেজি/মিটার</th>
                <th scope="col" className={headNum}>কেজি/ফুট</th>
              </tr>
            </thead>
            <tbody>
              {DIAMETERS_MM.map((d) => (
                <tr key={d}>
                  <td className={num}>{d}</td>
                  <td className={num}>{three(kgPerMetre(d))}</td>
                  <td className={num}>{three(kgPerMetre(d) * METRES_PER_FOOT)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>এগুলো তাত্ত্বিক ওজন; রড তৈরির সহনশীলতার কারণে আসল ওজন সামান্য কম-বেশি হতে পারে।</p>
      </ContentSection>

      <ContentSection id="buying" title="কেনার আগে">
        <ul>
          <li>রডের দাম বদলায় আর ব্র্যান্ড ও ডিলারভেদে আলাদা; ক্যালকুলেটরে কোনো দাম আগে থেকে বসানো নেই। যে দাম জেনেছেন সেটি লিখুন।</li>
          <li>বিল আর ডেলিভারির সময় মেপে পাওয়া ওজন মিলিয়ে নিন।</li>
          <li>
            কত রড লাগবে তা নকশার ওপর নির্ভর করে; প্রকৌশলীর তৈরি রডের তালিকা (বার বেন্ডিং শিডিউল) থেকে দৈর্ঘ্য আর সংখ্যা নিন।
          </li>
          <li>
            টাকার অঙ্ক কথায় লিখতে{" "}
            <Link href={localePath("bn", calculatorPath("amount-in-words"))} className={link}>
              টাকা কথায় ক্যালকুলেটর
            </Link>
            , আর জমির মাপের জন্য{" "}
            <Link href={localePath("bn", calculatorPath("land-calculator"))} className={link}>
              জমির পরিমাপ ক্যালকুলেটর
            </Link>{" "}
            ব্যবহার করুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>রডের মাপ (ব্যাস) বেছে নিন, আর দৈর্ঘ্য ফুটে না মিটারে দেবেন তা ঠিক করুন।</li>
          <li>একটি রডের দৈর্ঘ্য আর রডের সংখ্যা লিখুন। বাংলা অঙ্কও চলে।</li>
          <li>খরচ জানতে চাইলে টনপ্রতি দাম লিখুন, না হলে ফাঁকা রাখুন।</li>
          <li>“ওজন হিসাব করুন” চাপলে মোট কেজি ও টন, প্রতি মিটার ও ফুটে ওজন আর খরচ দেখা যাবে।</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            <a href={S.bangla.url} target="_blank" rel="noopener" className={link}>
              {S.bangla.title}
            </a>
            ।
          </li>
          <li>
            মাপভিত্তিক নামমাত্র ওজনের টেবিল:{" "}
            <a href={S.table.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.table.title}
            </a>
            ।
          </li>
        </ul>
        <p>1 নভেম্বর 2026-এ যাচাই করা।</p>
      </ContentSection>
    </>
  );
}

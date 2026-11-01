import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { PREGNANCY_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Bangla explanatory content for the Pregnancy Due Date Calculator page (Server Component, no JS). */
export function PregnancyCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="ডেলিভারির তারিখ যেভাবে হিসাব হয়">
        <p>
          <strong>সম্ভাব্য ডেলিভারির তারিখ = শেষ মাসিকের প্রথম দিন + 280 দিন (40 সপ্তাহ)</strong>
        </p>
        <p>
          গর্ভকাল গোনা হয় শেষ মাসিকের প্রথম দিন থেকে, গর্ভধারণের দিন থেকে নয়, কারণ প্রথম তারিখটি সাধারণত জানা থাকে।
          এখন কত সপ্তাহ চলছে, তা হলো সেদিন থেকে আজ পর্যন্ত দিন ÷ 7: পূর্ণ সপ্তাহ আর বাকি দিন।
        </p>
        <h3>উদাহরণ</h3>
        <ol>
          <li>শেষ মাসিক শুরু হয়েছিল 1 জুন 2026।</li>
          <li>1 জুন 2026 + 280 দিন = <strong>8 মার্চ 2027</strong> (সোমবার), সম্ভাব্য ডেলিভারির তারিখ।</li>
          <li>1 নভেম্বর 2026-এ 1 জুন থেকে 153 দিন: 153 ÷ 7 = 21 সপ্তাহ, বাকি 6 দিন, অর্থাৎ <strong>21 সপ্তাহ 6 দিন</strong>।</li>
          <li>21 সপ্তাহ হলো দ্বিতীয় ত্রৈমাসিক; ডেলিভারির তারিখ পর্যন্ত বাকি 127 দিন।</li>
        </ol>
        <p>
          ডাক্তার আলট্রাসনোগ্রাম দেখে তারিখ দিয়ে থাকলে “ডাক্তারের দেওয়া তারিখ” বেছে নিন। ক্যালকুলেটর সেই তারিখ থেকে 280
          দিন পিছিয়ে গুনে এখন কত সপ্তাহ চলছে দেখাবে। যেমন সম্ভাব্য তারিখ 20 মে 2027 হলে 1 নভেম্বর 2026-এ 11 সপ্তাহ 3
          দিন, প্রথম ত্রৈমাসিক।
        </p>
      </ContentSection>

      <ContentSection id="stages" title="ত্রৈমাসিক আর টার্মের হিসাব">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>পর্যায়</th>
                <th scope="col" className={head}>সপ্তাহ</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>প্রথম ত্রৈমাসিক</td><td className={cell}>13 সপ্তাহ 6 দিন পর্যন্ত</td></tr>
              <tr><td className={cell}>দ্বিতীয় ত্রৈমাসিক</td><td className={cell}>14 সপ্তাহ থেকে 27 সপ্তাহ 6 দিন</td></tr>
              <tr><td className={cell}>তৃতীয় ত্রৈমাসিক</td><td className={cell}>28 সপ্তাহ থেকে প্রসব পর্যন্ত</td></tr>
              <tr><td className={cell}>আর্লি টার্ম</td><td className={cell}>37 সপ্তাহ থেকে 38 সপ্তাহ 6 দিন</td></tr>
              <tr><td className={cell}>ফুল টার্ম</td><td className={cell}>39 সপ্তাহ থেকে 40 সপ্তাহ 6 দিন</td></tr>
              <tr><td className={cell}>লেট টার্ম</td><td className={cell}>41 সপ্তাহ থেকে 41 সপ্তাহ 6 দিন</td></tr>
              <tr><td className={cell}>পোস্ট-টার্ম</td><td className={cell}>42 সপ্তাহ থেকে</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          সম্ভাব্য তারিখটি ঠিক 40 সপ্তাহে পড়ে, যা ফুল টার্মের মাঝামাঝি। তাই তারিখটিকে একটি নির্দিষ্ট দিন না ভেবে একটি সময়ের
          মাঝখান হিসেবে দেখুন।
        </p>
      </ContentSection>

      <ContentSection id="accuracy" title="কখন ডাক্তারের তারিখ বেশি নির্ভুল">
        <ul>
          <li>
            <strong>প্রথম ত্রৈমাসিকের আলট্রাসনোগ্রাম</strong> মাসিকের তারিখের চেয়ে বেশি নির্ভুল। এসিওজির নির্দেশনায় দুই
            তারিখে পার্থক্য থাকলে আলট্রাসনোগ্রামের তারিখই ব্যবহার করতে বলা হয়েছে।
          </li>
          <li>
            <strong>মাসিক অনিয়মিত হলে</strong> বা শেষ মাসিকের তারিখ নিশ্চিত না হলে 280 দিনের হিসাব কম নির্ভুল হয়। অনেক
            ওয়েবসাইট চক্রের দৈর্ঘ্য অনুযায়ী দিন যোগ-বিয়োগ করে, কিন্তু এর কোনো নির্ভরযোগ্য সূত্র আমরা পাইনি, তাই করি না।
          </li>
          <li>
            <strong>আইভিএফে</strong> ভ্রূণ প্রতিস্থাপনের তারিখ থেকে হিসাব হয়; ডাক্তারের দেওয়া তারিখটিই ব্যবহার করুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="care" title="এই হিসাব কী নয়">
        <p>
          এই ক্যালকুলেটর শুধু তারিখের হিসাব দেয়; এটি ডাক্তারি পরামর্শ বা গর্ভকালীন চেকআপের বিকল্প নয়। বিশ্ব স্বাস্থ্য সংস্থা
          গর্ভাবস্থায় অন্তত আটবার স্বাস্থ্যকর্মীর সঙ্গে সাক্ষাতের পরামর্শ দেয়। কোনো দুশ্চিন্তা হলে ডাক্তার বা নিকটস্থ
          স্বাস্থ্যকেন্দ্রে যোগাযোগ করুন।
        </p>
        <p>
          ওজনের হিসাবের জন্য{" "}
          <Link href={localePath("bn", calculatorPath("bmi-calculator"))} className={link}>
            বিএমআই ক্যালকুলেটর
          </Link>{" "}
          গর্ভাবস্থায় প্রযোজ্য নয়; গর্ভাবস্থার আগের ওজন নিয়ে ডাক্তারের সঙ্গে কথা বলুন। দুই তারিখের মধ্যে দিন গুনতে{" "}
          <Link href={localePath("bn", calculatorPath("date-difference-calculator"))} className={link}>
            তারিখের ব্যবধান ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>“শেষ মাসিকের প্রথম দিন” বা “ডাক্তারের দেওয়া তারিখ” বেছে নিন।</li>
          <li>তারিখটি লিখুন। কোন তারিখ পর্যন্ত গুনবেন, তা সাধারণত আজ; চাইলে বদলাতে পারেন।</li>
          <li>“ডেলিভারির তারিখ বের করুন” চাপুন: কত সপ্তাহ, সম্ভাব্য তারিখ, ত্রৈমাসিক, বাকি দিন আর টার্মের তারিখগুলো দেখা যাবে।</li>
        </ol>
        <p>
          আপনার দেওয়া তারিখ কোথাও পাঠানো হয় না। গোপনীয়তার জন্য এই ক্যালকুলেটর “আপনার সাম্প্রতিক হিসাব” তালিকায়ও কিছু রাখে
          না।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            280 দিনের নিয়ম ও আলট্রাসনোগ্রামের তারিখ:{" "}
            <a href={S.dueDate.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.dueDate.title}
            </a>
            ।
          </li>
          <li>
            টার্মের শ্রেণি:{" "}
            <a href={S.term.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.term.title}
            </a>
            ।
          </li>
          <li>
            গর্ভকালীন সাক্ষাৎ:{" "}
            <a href={S.antenatal.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.antenatal.title}
            </a>
            ।
          </li>
        </ul>
        <p>1 নভেম্বর 2026-এ যাচাই করা।</p>
      </ContentSection>
    </>
  );
}

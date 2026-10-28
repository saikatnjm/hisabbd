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

/** Bangla guide: how CGPA is calculated from semester GPAs and credits (Server Component, no JS). */
export function CgpaCalculationGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("cgpa-calculator"));

  return (
    <>
      <ContentSection id="rule" title="মূল সূত্র: ক্রেডিট অনুযায়ী ভারিত গড়">
        <p>
          <strong>সিজিপিএ = Σ (সেমিস্টারের জিপিএ × সেমিস্টারের ক্রেডিট) ÷ Σ ক্রেডিট</strong>
        </p>
        <p>
          অর্থাৎ প্রতিটি সেমিস্টারের জিপিএ-কে সেই সেমিস্টারের ক্রেডিট দিয়ে গুণ করুন, গুণফলগুলো যোগ করুন, তারপর মোট
          ক্রেডিট দিয়ে ভাগ করুন। একে বলে ভারিত গড় (weighted average): যে সেমিস্টারে ক্রেডিট বেশি, সিজিপিএ-তে তার
          প্রভাবও বেশি। 18 ক্রেডিটের সেমিস্টারে কোর্সের ভার 9 ক্রেডিটের সেমিস্টারের দ্বিগুণ, তাই সেটাকে দ্বিগুণ
          গোনাই যুক্তিসংগত।
        </p>
        <p>
          সেমিস্টারের জিপিএ আর ক্রেডিট হাতে থাকলে সরাসরি{" "}
          <Link href={calculator} className={link}>
            সিজিপিএ ক্যালকুলেটর
          </Link>{" "}
          দিয়ে হিসাব করতে পারেন। নিচে একই হিসাব হাতে কীভাবে হয়, তা দেখানো হলো।
        </p>
      </ContentSection>

      <ContentSection id="scale" title="ইউজিসির ৪.০০ স্কেল">
        <p>
          বাংলাদেশের বিশ্ববিদ্যালয় মঞ্জুরি কমিশন (ইউজিসি) একটি অভিন্ন গ্রেডিং পদ্ধতি প্রকাশ করেছে, যা দেশের অনেক
          বিশ্ববিদ্যালয় ব্যবহার করে:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>নম্বর</th>
                <th scope="col" className={head}>লেটার গ্রেড</th>
                <th scope="col" className={headNum}>গ্রেড পয়েন্ট</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>80–100</td><td className={cell}>A+</td><td className={num}>4.00</td></tr>
              <tr><td className={cell}>75–79</td><td className={cell}>A</td><td className={num}>3.75</td></tr>
              <tr><td className={cell}>70–74</td><td className={cell}>A-</td><td className={num}>3.50</td></tr>
              <tr><td className={cell}>65–69</td><td className={cell}>B+</td><td className={num}>3.25</td></tr>
              <tr><td className={cell}>60–64</td><td className={cell}>B</td><td className={num}>3.00</td></tr>
              <tr><td className={cell}>55–59</td><td className={cell}>B-</td><td className={num}>2.75</td></tr>
              <tr><td className={cell}>50–54</td><td className={cell}>C+</td><td className={num}>2.50</td></tr>
              <tr><td className={cell}>45–49</td><td className={cell}>C</td><td className={num}>2.25</td></tr>
              <tr><td className={cell}>40–44</td><td className={cell}>D</td><td className={num}>2.00</td></tr>
              <tr><td className={cell}>40-এর নিচে</td><td className={cell}>F</td><td className={num}>0.00</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          সব বিশ্ববিদ্যালয় এই স্কেল মানে না। কোথাও নম্বরের সীমা আলাদা, কোথাও বাড়তি গ্রেড আছে, কোথাও ফল দেওয়া হয়
          ৫.০০ স্কেলে। তাই নিজের বিশ্ববিদ্যালয়ের হ্যান্ডবুক বা রেজাল্ট শিট দেখে নিন। তবে সিজিপিএ-র সূত্র যেকোনো
          স্কেলে একই।
        </p>
      </ContentSection>

      <ContentSection id="example" title="উদাহরণ: কোর্স থেকে জিপিএ, সেমিস্টার থেকে সিজিপিএ">
        <h3>ধাপ 1: এক সেমিস্টারের জিপিএ</h3>
        <p>সেমিস্টারের জিপিএ-ও একই নিয়মে আসে, শুধু সেমিস্টারের জায়গায় কোর্স:</p>
        <ul>
          <li>কোর্স 1: A (3.75) × 3 ক্রেডিট = 11.25</li>
          <li>কোর্স 2: B+ (3.25) × 3 ক্রেডিট = 9.75</li>
          <li>কোর্স 3: A- (3.50) × 3 ক্রেডিট = 10.50</li>
          <li>কোর্স 4: B (3.00) × 1.5 ক্রেডিট = 4.50</li>
        </ul>
        <p>
          মোট গ্রেড পয়েন্ট 36.00, মোট ক্রেডিট 10.5, তাই জিপিএ = 36 ÷ 10.5 = 3.428…, দুই দশমিকে{" "}
          <strong>3.43</strong>। লেটার গ্রেড থেকে এই হিসাবটা করতে{" "}
          <Link href={localePath("bn", calculatorPath("gpa-calculator"))} className={link}>
            জিপিএ ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করতে পারেন।
        </p>

        <h3>ধাপ 2: সেমিস্টারগুলো মিলিয়ে সিজিপিএ</h3>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>সেমিস্টার</th>
                <th scope="col" className={headNum}>জিপিএ</th>
                <th scope="col" className={headNum}>ক্রেডিট</th>
                <th scope="col" className={headNum}>জিপিএ × ক্রেডিট</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>সেমিস্টার 1</td><td className={num}>3.50</td><td className={num}>12</td><td className={num}>42.00</td></tr>
              <tr><td className={cell}>সেমিস্টার 2</td><td className={num}>4.00</td><td className={num}>18</td><td className={num}>72.00</td></tr>
              <tr><td className={cell}><strong>মোট</strong></td><td className={num}></td><td className={num}><strong>30</strong></td><td className={num}><strong>114.00</strong></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          সিজিপিএ = 114 ÷ 30 = <strong>3.80</strong>। খেয়াল করুন, দুই জিপিএ-র সাধারণ গড় হতো 3.75; বেশি ক্রেডিটের
          সেমিস্টারটি 4.00 বলে আসল সিজিপিএ বেশি।
        </p>

        <h3>ধাপ 3: বর্তমান সিজিপিএ-র সঙ্গে নতুন সেমিস্টার</h3>
        <p>
          পুরোনো সব সেমিস্টার আলাদা করে লাগে না। বর্তমান সিজিপিএ আর এ পর্যন্ত সম্পন্ন মোট ক্রেডিটকে একটা সেমিস্টার
          ধরুন। 60 ক্রেডিটে সিজিপিএ 3.40, নতুন সেমিস্টারে 15 ক্রেডিটে 3.80 হলে: (3.40 × 60 + 3.80 × 15) ÷ 75 =
          (204 + 57) ÷ 75 = 261 ÷ 75 = <strong>3.48</strong>। প্রতিটি পুরোনো সেমিস্টার আলাদা করে লিখলেও ঠিক একই ফল
          আসত, কারণ বর্তমান সিজিপিএ × মোট ক্রেডিট আসলে আগের সব সেমিস্টারের গুণফলের যোগফল।
        </p>
      </ContentSection>

      <ContentSection id="rounding" title="রাউন্ডিং না কেটে ফেলা (truncation)?">
        <p>
          ভাগফল প্রায়ই অনেক দশমিক পর্যন্ত যায়, তাই দুই দশমিকে আনতে হয়। দুটো উপায় চালু আছে:
        </p>
        <ul>
          <li>
            <strong>রাউন্ডিং (হাফ-আপ):</strong> তৃতীয় দশমিক 5 বা বেশি হলে দ্বিতীয় দশমিক 1 বাড়ে। 3.428… হয় 3.43।
          </li>
          <li>
            <strong>কেটে ফেলা (truncation):</strong> দুই দশমিকের পরের অঙ্কগুলো শুধু বাদ দেওয়া হয়। 3.428… হয় 3.42।
          </li>
        </ul>
        <p>
          আমাদের ক্যালকুলেটর দুই দশমিকে রাউন্ড করে। কিছু বিশ্ববিদ্যালয় কেটে ফেলে, তাই আপনার আনুষ্ঠানিক সিজিপিএ 0.01
          কম আসতে পারে। কোনটা মানা হয়, হ্যান্ডবুকে দেখে নিন। আরেকটা কথা: প্রতিটি সেমিস্টারের জিপিএ আগে রাউন্ড করে
          তারপর সিজিপিএ বের করলে শেষ অঙ্কে সামান্য পার্থক্য হতে পারে। সম্ভব হলে সব কোর্সের মোট গ্রেড পয়েন্ট ÷ মোট
          ক্রেডিট দিয়ে হিসাব করুন; সেমিস্টারের জিপিএ রাউন্ড না করা থাকলে দুই হিসাব হুবহু এক। বিশ্ববিদ্যালয়ের প্রকাশিত
          সিজিপিএ-ই চূড়ান্ত।
        </p>
      </ContentSection>

      <ContentSection id="steps" title="ধাপে ধাপে নিজের সিজিপিএ হিসাব">
        <ol>
          <li>রেজাল্ট শিট থেকে প্রতিটি সেমিস্টারের জিপিএ আর সেই সেমিস্টারের ক্রেডিট নিন।</li>
          <li>প্রতিটি জিপিএ-কে তার ক্রেডিট দিয়ে গুণ করুন।</li>
          <li>গুণফলগুলো যোগ করুন, আর আলাদাভাবে সব ক্রেডিট যোগ করুন।</li>
          <li>প্রথম যোগফলকে মোট ক্রেডিট দিয়ে ভাগ করুন।</li>
          <li>বিশ্ববিদ্যালয়ের নিয়ম অনুযায়ী দুই দশমিকে রাউন্ড করুন বা কেটে ফেলুন।</li>
        </ol>
      </ContentSection>

      <ContentSection id="mistakes" title="যে ভুলগুলো প্রায়ই হয়">
        <ul>
          <li>
            <strong>ক্রেডিট ছাড়া জিপিএ-গুলোর সাধারণ গড় করা।</strong> 9 ক্রেডিটে 3.80 আর 18 ক্রেডিটে 3.00 হলে সাধারণ
            গড় (3.80 + 3.00) ÷ 2 = 3.40, কিন্তু সঠিক সিজিপিএ (3.80 × 9 + 3.00 × 18) ÷ 27 = 88.2 ÷ 27 = 3.27। সব
            সেমিস্টারের ক্রেডিট সমান হলেই কেবল দুটো মেলে।
          </li>
          <li>
            <strong>স্কেল মিশিয়ে ফেলা।</strong> ৪.০০ স্কেলের জিপিএ আর ৫.০০ স্কেলের জিপিএ একসঙ্গে গড় করা যায় না।
            এসএসসি-এইচএসসির 5.00 জিপিএ-ও বিশ্ববিদ্যালয়ের সিজিপিএ-র সঙ্গে মেলে না। এক স্কেল থেকে আরেক স্কেলে
            রূপান্তরের কোনো একক সরকারি সূত্র আমরা ধরে নিচ্ছি না; দরকার হলে সংশ্লিষ্ট প্রতিষ্ঠানকে জিজ্ঞেস করুন।
          </li>
          <li>
            <strong>রাউন্ডিং আর কেটে ফেলা গুলিয়ে ফেলা।</strong> ওপরের সঠিক সিজিপিএ 3.266… রাউন্ড করলে 3.27, কেটে
            ফেললে 3.26। 3.27 দেখে ধরে নেবেন না যে আনুষ্ঠানিক ফলও তা-ই।
          </li>
          <li>
            <strong>F পাওয়া কোর্সের ক্রেডিট বাদ দেওয়া।</strong> সেমিস্টারের জিপিএ-তে F কোনো পয়েন্ট যোগ করে না,
            কিন্তু তার ক্রেডিট ভাগের সংখ্যায় থাকে। রিটেকের পর পুরোনো গ্রেড বদলায় নাকি দুটোর গড় হয়, তা বিশ্ববিদ্যালয়ের
            নীতি।
          </li>
        </ul>
        <p>
          হাতে গুণ-ভাগ না করে প্রতিটি সেমিস্টারের জিপিএ আর ক্রেডিট{" "}
          <Link href={calculator} className={link}>
            সিজিপিএ ক্যালকুলেটরে
          </Link>{" "}
          লিখুন; ৪.০০ বা ৫.০০ স্কেলে সিজিপিএ আর মোট ক্রেডিট সঙ্গে সঙ্গে দেখা যাবে। আপনি যা লেখেন তা কোথাও পাঠানো
          হয় না।
        </p>
      </ContentSection>
    </>
  );
}

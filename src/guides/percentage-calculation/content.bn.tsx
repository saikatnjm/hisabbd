import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Bangla guide: the five everyday percentage calculations (Server Component, no JS). */
export function PercentageCalculationGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("percentage-calculator"));

  return (
    <>
      <ContentSection id="basics" title="শতাংশ মানে কী, আর কোন হিসাবে কোন সূত্র">
        <p>
          শতাংশ বা পার্সেন্ট (%) মানে “প্রতি 100-এ কত”। 15% মানে 100-এর মধ্যে 15, অর্থাৎ 15 ÷ 100 = 0.15। প্রায়
          সব শতাংশের হিসাবে আসল প্রশ্ন একটাই: <strong>কোন সংখ্যাটা ভিত্তি বা “পুরো”?</strong> সেটা ঠিক থাকলে বাকিটা
          সোজা ভাগ-গুণ। প্রতিদিনের প্রায় সব প্রশ্ন নিচের 5টি হিসাবের কোনো একটি:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>প্রশ্ন</th>
                <th scope="col" className={head}>সূত্র</th>
                <th scope="col" className={head}>উদাহরণ</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>Y-এর P% কত?</td><td className={cell}>P ÷ 100 × Y</td><td className={cell}>2,000-এর 15% = 300</td></tr>
              <tr><td className={cell}>X, Y-এর কত শতাংশ?</td><td className={cell}>X ÷ Y × 100</td><td className={cell}>60-এর মধ্যে 45 = 75%</td></tr>
              <tr><td className={cell}>A থেকে B-তে কত শতাংশ বদলাল?</td><td className={cell}>(B − A) ÷ A × 100</td><td className={cell}>80 থেকে 100 = 25% বৃদ্ধি</td></tr>
              <tr><td className={cell}>Y-কে P% বাড়ালে বা কমালে?</td><td className={cell}>Y × (1 ± P ÷ 100)</td><td className={cell}>1,000 + 10% = 1,100</td></tr>
              <tr><td className={cell}>X কোন সংখ্যার P%?</td><td className={cell}>X ÷ (P ÷ 100)</td><td className={cell}>25 হলো 125-এর 20%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          প্রশ্ন বেছে দুটি সংখ্যা দিলেই{" "}
          <Link href={calculator} className={link}>
            শতকরা ক্যালকুলেটর
          </Link>{" "}
          এই 5টি হিসাব পুরো ধাপসহ করে দেয়। নিচে প্রতিটি হাতে করে দেখানো হলো।
        </p>
      </ContentSection>

      <ContentSection id="percent-of" title="1. কোনো সংখ্যার শতাংশ, আর 2. কত শতাংশ">
        <h3>Y-এর P% কত</h3>
        <p>
          শতাংশকে 100 দিয়ে ভাগ করে সংখ্যাটি দিয়ে গুণ করুন। 2,000-এর 15% = 15 ÷ 100 × 2,000 ={" "}
          <strong>300</strong>। আবার 240-এর 12.5% = 0.125 × 240 = <strong>30</strong>।
        </p>
        <p>
          মাথায় যাচাইয়ের সহজ কৌশল: 10% মানে 10 দিয়ে ভাগ। 2,000-এর 10% = 200, 5% তার অর্ধেক = 100, তাই 15% = 200 +
          100 = 300।
        </p>
        <h3>X, Y-এর কত শতাংশ</h3>
        <p>
          অংশকে পুরো দিয়ে ভাগ করে 100 দিয়ে গুণ করুন। 60 নম্বরের পরীক্ষায় 45 পেলে 45 ÷ 60 × 100 ={" "}
          <strong>75%</strong>। “পুরো” সংখ্যাটি 0 হতে পারে না। অংশটা পুরোর চেয়ে বড় হলে উত্তর 100%-এর বেশি হয়: 20-এর
          তুলনায় 50 হলো 250%।
        </p>
      </ContentSection>

      <ContentSection id="change" title="3. শতকরা বৃদ্ধি বা হ্রাস">
        <p>
          <strong>শতকরা পরিবর্তন = (নতুন মান − শুরুর মান) ÷ শুরুর মান × 100।</strong> উত্তর ধনাত্মক হলে বৃদ্ধি,
          ঋণাত্মক হলে হ্রাস।
        </p>
        <ul>
          <li>
            80 থেকে 100: (100 − 80) ÷ 80 × 100 = <strong>25% বৃদ্ধি</strong>।
          </li>
          <li>
            100 থেকে 80: (80 − 100) ÷ 100 × 100 = −20%, অর্থাৎ <strong>20% হ্রাস</strong>।
          </li>
        </ul>
        <p>
          দুবারই পার্থক্য 20, কিন্তু শতাংশ আলাদা, কারণ ভাগ হয় শুরুর মান দিয়ে, আর দুবার শুরুর মান আলাদা। শুরুর মান 0
          হলে শতকরা পরিবর্তন বের করা যায় না। শুরুর মান ঋণাত্মক হলে ক্যালকুলেটর তার পরম মান দিয়ে ভাগ করে, তাই −50
          থেকে −25 হলো 50% বৃদ্ধি, কারণ মানটা আসলে বেড়েছে।
        </p>
      </ContentSection>

      <ContentSection id="increase-decrease" title="4. কোনো সংখ্যাকে শতাংশ হারে বাড়ানো বা কমানো">
        <p>
          বাড়াতে গুণ করুন (1 + P ÷ 100) দিয়ে, কমাতে (1 − P ÷ 100) দিয়ে। এতে আলাদা করে শতাংশ বের করে যোগ-বিয়োগ
          করার ধাপটা লাগে না।
        </p>
        <ul>
          <li>
            1,000-কে 10% বাড়ালে: 1,000 × 1.10 = <strong>1,100</strong>।
          </li>
          <li>
            200-কে 15% কমালে: 200 × 0.85 = <strong>170</strong> (কমল 30)।
          </li>
        </ul>
        <p>
          100%-এর বেশি কমালে উত্তর শূন্যের নিচে যায়: 100-কে 150% কমালে হয় −50। গণিতে এটা ঠিক, কিন্তু দাম বা ওজনের
          মতো জিনিস শূন্যের নিচে নামে না। এমন উত্তর এলে প্রশ্নটা আবার দেখুন।
        </p>
      </ContentSection>

      <ContentSection id="reverse" title="5. উল্টো হিসাব: আসল সংখ্যা বের করা">
        <p>
          যখন অংশ আর তার শতাংশ জানা, কিন্তু পুরোটা জানা নেই, তখন অংশকে (শতাংশ ÷ 100) দিয়ে ভাগ করুন। 25 যদি কোনো
          সংখ্যার 20% হয়, সংখ্যাটি 25 ÷ 0.20 = <strong>125</strong>।
        </p>
        <p>
          দোকানে প্রায়ই এই হিসাব লাগে। 15% ছাড়ের পর দাম ৳170 হলে আপনি দিচ্ছেন আগের দামের 85%। তাই আগের দাম = 170 ÷
          0.85 = <strong>৳200</strong>। ছাড়ের পর দাম আর কত টাকা বাঁচল, তা সরাসরি দেখতে{" "}
          <Link href={localePath("bn", calculatorPath("discount-calculator"))} className={link}>
            ছাড় ক্যালকুলেটর
          </Link>{" "}
          কাজে লাগবে।
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="যে ভুলগুলো প্রায়ই হয়">
        <ul>
          <li>
            <strong>শতকরা পরিবর্তন সরাসরি যোগ-বিয়োগ করা।</strong> 100-কে 25% বাড়ালে 125, তারপর 25% কমালে 125-এর 25%
            = 31.25 বাদ যায়, থাকে 93.75, 100 নয়। 100-তে ফিরতে লাগে 20% হ্রাস। একইভাবে দুবার 10% বাড়লে মোট বৃদ্ধি 20%
            নয়, 21% (1,000 → 1,100 → 1,210)।
          </li>
          <li>
            <strong>শতাংশ আর শতাংশ পয়েন্ট গুলিয়ে ফেলা।</strong> সুদের হার 9% থেকে 10% হলে সেটা 1 শতাংশ পয়েন্ট
            বৃদ্ধি। কিন্তু শতকরা পরিবর্তন হিসেবে (10 − 9) ÷ 9 × 100 ≈ 11.11% বৃদ্ধি। খবর বা অফারে কোনটা বলা হচ্ছে,
            দেখে নিন।
          </li>
          <li>
            <strong>উল্টো হিসাবে ভুল ভিত্তি ধরা।</strong> ছাড়ের পর ৳170-এর সঙ্গে 15% যোগ করলে আসে ৳195.50, আসল দাম
            ৳200 নয়। কারণ 15% ছিল ৳200-এর, ৳170-এর নয়। ভাগ করুন, যোগ নয়।
          </li>
          <li>
            <strong>পরিবর্তনে নতুন মান দিয়ে ভাগ করা।</strong> 80 থেকে 100-তে বৃদ্ধি 20 ÷ 80 = 25%, 20 ÷ 100 = 20%
            নয়। সবসময় শুরুর মান দিয়ে ভাগ করুন।
          </li>
        </ul>
        <h3>যেকোনো শতাংশ হিসাবের আগে 3টি ধাপ</h3>
        <ol>
          <li>ঠিক করুন ভিত্তি বা “পুরো” কোনটা: শুরুর দাম, মোট নম্বর, নাকি অজানা আসল সংখ্যা।</li>
          <li>দেখুন শতাংশটা জানা, নাকি সেটাই খুঁজছেন; তা দেখে ওপরের টেবিল থেকে সূত্র বাছুন।</li>
          <li>উত্তরটা যুক্তিসংগত কি না মিলিয়ে নিন, যেমন 10% দিয়ে মোটামুটি আন্দাজ করে।</li>
        </ol>
        <p>
          হাতে হিসাব না করে আপনার সংখ্যাগুলো{" "}
          <Link href={calculator} className={link}>
            শতকরা ক্যালকুলেটরে
          </Link>{" "}
          দিন: উত্তরের সঙ্গে একটি বাক্য আর পুরো হিসাবটাও দেখা যাবে, তাই কোন সংখ্যা ভিত্তি ধরা হলো তা স্পষ্ট থাকে।
        </p>
      </ContentSection>
    </>
  );
}

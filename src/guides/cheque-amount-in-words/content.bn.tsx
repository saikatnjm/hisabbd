import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Amounts as figures, Bangla words and English words (all match the Taka Amount in Words logic). */
const AMOUNTS: readonly [figures: string, bangla: string, english: string][] = [
  ["1,000", "এক হাজার টাকা মাত্র", "One Thousand Taka Only"],
  ["50,000", "পঞ্চাশ হাজার টাকা মাত্র", "Fifty Thousand Taka Only"],
  ["1,00,000", "এক লক্ষ টাকা মাত্র", "One Lakh Taka Only"],
  ["10,00,000", "দশ লক্ষ টাকা মাত্র", "Ten Lakh Taka Only"],
  ["1,00,00,000", "এক কোটি টাকা মাত্র", "One Crore Taka Only"],
  ["10,05,00,200", "দশ কোটি পাঁচ লক্ষ দুইশত টাকা মাত্র", "Ten Crore Five Lakh Two Hundred Taka Only"],
];

/** Bangla guide: writing a Taka amount in words on a cheque (Server Component, no JS). */
export function ChequeAmountInWordsGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("amount-in-words"));

  return (
    <>
      <ContentSection id="rule" title="মূল নিয়ম: কোটি, লক্ষ, হাজার, শত — তারপর “টাকা … মাত্র”">
        <p>
          চেকে টাকার অঙ্ক কথায় লিখতে অঙ্কটিকে বাংলাদেশের প্রচলিত ভাগে ভাঙুন, বাঁ দিক থেকে:{" "}
          <strong>কোটি, লক্ষ, হাজার, শত</strong>, তারপর শেষ দুই অঙ্ক। প্রতিটি ভাগ কথায় লিখে শেষে “টাকা”, পয়সা থাকলে
          পয়সা, আর একদম শেষে <strong>“মাত্র”</strong> (ইংরেজিতে <strong>“Only”</strong>)। যে ভাগ শূন্য, সেটি বাদ যায়।
        </p>
        <p>
          যেমন <strong>১ লক্ষ টাকা</strong> (1,00,000) কথায়: <strong>এক লক্ষ টাকা মাত্র</strong>, ইংরেজিতে{" "}
          <strong>One Lakh Taka Only</strong>। যেকোনো অঙ্ক সঙ্গে সঙ্গে বাংলা ও ইংরেজি কথায় পেতে{" "}
          <Link href={calculator} className={link}>
            টাকা কথায় লেখার ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন; নিচের নিয়মেই লেখে, আর ফলাফল সরাসরি কপি করা যায়।
        </p>
      </ContentSection>

      <ContentSection id="example" title="উদাহরণ: ৳1,25,300.50 কথায়">
        <p>অঙ্কটি ভাগে ভাঙলে:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>ভাগ</th>
                <th scope="col" className={headNum}>অঙ্ক</th>
                <th scope="col" className={head}>কথায়</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>লক্ষ</td><td className={num}>1</td><td className={cell}>এক লক্ষ</td></tr>
              <tr><td className={cell}>হাজার</td><td className={num}>25</td><td className={cell}>পঁচিশ হাজার</td></tr>
              <tr><td className={cell}>শত</td><td className={num}>3</td><td className={cell}>তিনশত</td></tr>
              <tr><td className={cell}>শেষ দুই অঙ্ক</td><td className={num}>00</td><td className={cell}>(বাদ)</td></tr>
              <tr><td className={cell}>পয়সা</td><td className={num}>50</td><td className={cell}>পঞ্চাশ পয়সা</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          বাংলায়: <strong>এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র</strong>।
        </p>
        <p>
          ইংরেজিতে: <strong>One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only</strong>। ইংরেজিতে
          টাকা আর পয়সার মাঝে “and” বসে, কিন্তু সংখ্যার ভেতরে নয়: 101 হলো “One Hundred One”। 21 থেকে 99 পর্যন্ত
          হাইফেন দিয়ে লেখা হয়, যেমন Twenty-Five।
        </p>
        <p>
          বাংলা অঙ্কে একই পরিমাণ <strong>১,২৫,৩০০.৫০</strong>। অঙ্কের ঘরে লেখার জন্য ক্যালকুলেটর বাংলা ও ইংরেজি দুই
          অঙ্কেই দেখায়। যাঁরা মিলিয়ন পদ্ধতিতে ভাবেন, তাঁদের জন্য একই অঙ্ক ইংরেজিতে: One Hundred Twenty-Five Thousand
          Three Hundred Taka and Fifty Paisa Only। তবে বাংলাদেশের চেকে সাধারণত লক্ষ-কোটির রূপটিই লেখা হয়।
        </p>
      </ContentSection>

      <ContentSection id="lakh-crore" title="লক্ষ-কোটির অঙ্ক কথায়: সাধারণ কিছু উদাহরণ">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={headNum}>৳</th>
                <th scope="col" className={head}>বাংলা</th>
                <th scope="col" className={head}>English</th>
              </tr>
            </thead>
            <tbody>
              {AMOUNTS.map(([figures, bangla, english]) => (
                <tr key={figures}>
                  <td className={num}>{figures}</td>
                  <td className={cell}>{bangla}</td>
                  <td className={cell}>{english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          শেষ সারিতে দেখুন, হাজারের ঘর শূন্য বলে “হাজার” শব্দটিই আসেনি। শতক লেখা হয় “একশত, দুইশত … নয়শত”। কথ্য
          ভাষায় “একশো” বা “লাখ” বেশি চলে; “লাখ” আর “লক্ষ” একই অর্থ, তবে চেক ও দলিলে “লক্ষ” ও “শত” বেশি দেখা যায়।
        </p>
        <p>
          এক হাজার কোটি বা তার বেশি হলে কত কোটি, সেটিও লক্ষ-হাজারে লেখা হয়: ৳1,000 কোটি হলো{" "}
          <strong>এক হাজার কোটি টাকা মাত্র</strong>।
        </p>
        <h3>লক্ষ-কোটি আর মিলিয়ন-বিলিয়ন</h3>
        <p>
          বিদেশি ইনভয়েস বা ইংরেজি খবরে অঙ্ক থাকে মিলিয়নে, তাই এই মিলগুলো মনে রাখুন: 1 লক্ষ = 1,00,000 = 100 হাজার;{" "}
          <strong>10 লক্ষ = 1 মিলিয়ন</strong>; <strong>1 কোটি = 10 মিলিয়ন</strong>; 100 কোটি = 1 বিলিয়ন। চেকে
          লেখার আগে মিলিয়নের অঙ্ককে লক্ষ-কোটিতে বদলে নিন, তারপর কথায় লিখুন।
        </p>
      </ContentSection>

      <ContentSection id="steps" title="ধাপে ধাপে: যেকোনো অঙ্ক কথায় লিখুন">
        <ol>
          <li>অঙ্কটি লক্ষ-কোটির কমা দিয়ে লিখুন, যেমন 10,05,00,200। এতে কোন ঘরে কত, এক নজরে দেখা যায়।</li>
          <li>বাঁ দিক থেকে প্রতিটি ভাগ পড়ুন: কোটি, লক্ষ, হাজার, শত, তারপর শেষ দুই অঙ্ক।</li>
          <li>প্রতিটি ভাগের পরে তার নাম বসান (কোটি, লক্ষ, হাজার, শত)। যে ভাগ শূন্য, সেটি পুরো বাদ দিন।</li>
          <li>এরপর “টাকা” লিখুন। দশমিকের পর অঙ্ক থাকলে সেটি কথায় লিখে “পয়সা” যোগ করুন।</li>
          <li>শেষে “মাত্র” (বা “Only”) লিখে বাকি লাইনে দাগ টানুন।</li>
          <li>কথা থেকে আবার অঙ্কে ফিরে গিয়ে মিলিয়ে নিন: দুটো একই হলে তবেই চেকে লিখুন।</li>
        </ol>
      </ContentSection>

      <ContentSection id="paisa" title="পয়সা লেখার নিয়ম">
        <ul>
          <li>
            দশমিকের পরের দুই অঙ্কই পয়সা। ৳10.50 = <strong>দশ টাকা পঞ্চাশ পয়সা মাত্র</strong> (Ten Taka and Fifty Paisa
            Only)। 10.5 লিখলেও এটি 50 পয়সা, 5 পয়সা নয়।
          </li>
          <li>
            এক টাকার কম হলে শুধু পয়সা: ৳0.05 = <strong>পাঁচ পয়সা মাত্র</strong>, ৳0.29 ={" "}
            <strong>ঊনত্রিশ পয়সা মাত্র</strong>।
          </li>
          <li>
            পয়সা না থাকলে বাদ দিন: ৳2,500.00 = <strong>দুই হাজার পাঁচশত টাকা মাত্র</strong>।
          </li>
          <li>এক টাকা = 100 পয়সা, তাই দশমিকের পর দুই ঘরের বেশি চেকে লেখা যায় না; আগে পয়সায় রাউন্ড করুন।</li>
        </ul>
      </ContentSection>

      <ContentSection id="on-the-cheque" title="চেকে যেভাবে বসাবেন: কথার লাইন ও অঙ্কের ঘর">
        <ol>
          <li>
            <strong>কথার লাইন:</strong> লাইনের একদম শুরু থেকে লিখুন, শব্দের মাঝে বাড়তি ফাঁক রাখবেন না। শুরুতে “টাকা”
            বা “Taka” ছাপা থাকলে তার পরে লিখুন।
          </li>
          <li>
            <strong>শেষে “মাত্র” বা “Only”</strong> লিখুন, তারপর বাকি ফাঁকা জায়গায় একটি দাগ টানুন, যাতে কেউ “এক হাজার
            টাকা”-র পরে “পাঁচশত” জুড়ে দিতে না পারে।
          </li>
          <li>
            <strong>অঙ্কের ঘর:</strong> ছাপা ৳ বা “Tk.”-এর ঠিক পাশে লক্ষ-কোটির কমাসহ লিখুন, যেমন 1,25,300.50। পুরো
            টাকার পরে অনেকে “/-” দেন (1,25,300/-)।
          </li>
          <li>
            <strong>কথা আর অঙ্ক মিলিয়ে নিন।</strong> দুটো না মিললে ব্যাংক চেক ফেরত দিতে পারে।
          </li>
        </ol>
        <p>
          কোন ভাষায় লিখবেন, বাংলা অঙ্ক চলবে কি না, ভুল কাটা যাবে কি না — এসব বিষয়ে <strong>আপনার ব্যাংকের নিজস্ব
          নির্দেশনাই চূড়ান্ত</strong>। এখানের নিয়মগুলো সাধারণ চর্চা; ব্যাংকের নির্দেশনা আলাদা হলে সেটিই মানুন।
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="যে ভুলগুলো প্রায়ই হয়">
        <ul>
          <li>
            <strong>মিলিয়ন আর লক্ষ গুলিয়ে ফেলা।</strong> 1,000,000 মানে 10,00,000, অর্থাৎ দশ লক্ষ, এক লক্ষ নয়। অঙ্কের ঘরে
            লক্ষ-কোটির কমা ব্যবহার করলে এই ভুল কম হয়।
          </li>
          <li>
            <strong>বানান ভুল।</strong> 29 ঊনত্রিশ, 39 ঊনচল্লিশ, 45 পঁয়তাল্লিশ, 59 ঊনষাট, 99 নিরানব্বই। ইংরেজিতে
            “Forty”, “Fourty” নয়; “Ninety”, “Ninty” নয়।
          </li>
          <li>
            <strong>শেষে “মাত্র” না লেখা বা ফাঁক রেখে দেওয়া।</strong> এতে পরে শব্দ যোগ করার সুযোগ থাকে।
          </li>
          <li>
            <strong>পয়সা ভুল পড়া।</strong> .5 মানে 50 পয়সা। আবার 1.234-এর মতো তিন দশমিক চেকে লেখা যায় না।
          </li>
          <li>
            <strong>ভুলের ওপর ঘষামাজা।</strong> কাটাকুটি বা ওভাররাইট না করে ব্যাংককে জিজ্ঞেস করুন, নয়তো নতুন চেক লিখুন।
          </li>
          <li>
            <strong>ভ্যাটসহ মোট অঙ্ক না মিলিয়েই লেখা।</strong> বিল বা ইনভয়েসে ভ্যাট যোগ হলে আগে{" "}
            <Link href={localePath("bn", calculatorPath("vat-calculator"))} className={link}>
              ভ্যাট ক্যালকুলেটরে
            </Link>{" "}
            মোট অঙ্ক মিলিয়ে নিন, তারপর সেটি কথায় লিখুন।
          </li>
        </ul>
        <p>
          চেক লেখার আগে অঙ্কটি{" "}
          <Link href={calculator} className={link}>
            টাকা কথায় লেখার ক্যালকুলেটরে
          </Link>{" "}
          দিন: বাংলা ও ইংরেজি কথা, মিলিয়ন পদ্ধতির ইংরেজি, আর বাংলা ও ইংরেজি অঙ্ক একসঙ্গে পাবেন, ঠিক যতটা কপি করতে চান।
          এটি বিনামূল্যে, সাইন আপ লাগে না, আর আপনার অঙ্ক কোথাও পাঠানো হয় না।
        </p>
      </ContentSection>
    </>
  );
}

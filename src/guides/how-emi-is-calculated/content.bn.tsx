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

/** ৳5,00,000 at 9% a year for 5 years, by loan year (rounded to the nearest Taka). */
const YEARS: readonly [year: string, principal: string, interest: string, balance: string][] = [
  ["1", "82,915", "41,635", "4,17,085"],
  ["2", "90,693", "33,857", "3,26,392"],
  ["3", "99,201", "25,349", "2,27,191"],
  ["4", "1,08,506", "16,044", "1,18,685"],
  ["5", "1,18,685", "5,865", "0"],
];

/** Bangla guide: how a reducing-balance EMI is calculated (Server Component, no JS). */
export function HowEmiIsCalculatedGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("emi-calculator"));

  return (
    <>
      <ContentSection id="formula" title="ইএমআই কী, আর সূত্রটা কী">
        <p>
          ইএমআই (ইকুয়েটেড মান্থলি ইনস্টলমেন্ট) হলো লোন পুরো শোধ না হওয়া পর্যন্ত প্রতি মাসে দেওয়া একই অঙ্কের
          কিস্তি। প্রচলিত <strong>রিডিউসিং-ব্যালান্স</strong> পদ্ধতিতে প্রতি মাসের সুদ ধরা হয় শুধু যত টাকা তখনো
          বাকি আছে তার ওপর। প্রতিটি কিস্তি থেকে আগে সেই মাসের সুদ যায়, বাকিটা আসল (মূল ঋণ) কমায়।
        </p>
        <p>
          <strong>ইএমআই = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</strong>
        </p>
        <ul>
          <li>
            <strong>P</strong> = লোনের পরিমাণ (আসল)।
          </li>
          <li>
            <strong>r</strong> = মাসিক সুদের হার, ভগ্নাংশে: বাৎসরিক হার ÷ 12 ÷ 100।
          </li>
          <li>
            <strong>n</strong> = মোট মাসিক কিস্তির সংখ্যা (বছর × 12)।
          </li>
        </ul>
        <p>
          সুদ 0% হলে সূত্রটি সহজ হয়ে দাঁড়ায় ইএমআই = P ÷ n। নিজের লোনের অঙ্ক দিয়ে সঙ্গে সঙ্গে হিসাব দেখতে{" "}
          <Link href={calculator} className={link}>
            ইএমআই / লোন ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন। নিচে একই হিসাব হাতে করে দেখানো হলো।
        </p>
      </ContentSection>

      <ContentSection id="example" title="উদাহরণ: ৳5,00,000 লোন, বছরে 9%, 5 বছর">
        <ol>
          <li>মাসিক হার: r = 9 ÷ 12 ÷ 100 = 0.0075, অর্থাৎ মাসে 0.75%।</li>
          <li>কিস্তির সংখ্যা: n = 5 × 12 = 60।</li>
          <li>(1 + r)ⁿ = 1.0075⁶⁰ ≈ 1.565681।</li>
          <li>
            ইএমআই = 5,00,000 × 0.0075 × 1.565681 ÷ (1.565681 − 1) = 3,750 × 1.565681 ÷ 0.565681 ≈{" "}
            <strong>৳10,379.18</strong>।
          </li>
          <li>মোট পরিশোধ = 10,379.18 × 60 ≈ ৳6,22,751।</li>
          <li>
            মোট সুদ = 6,22,751 − 5,00,000 ≈ <strong>৳1,22,751</strong>।
          </li>
        </ol>
        <p>
          অর্থাৎ 5 বছরে আপনি যা দেবেন তার প্রায় 19.7% সুদ। কিস্তি রাউন্ড করলে মাসে ৳10,379 ধরা যায়।
        </p>
      </ContentSection>

      <ContentSection id="split" title="প্রতি কিস্তিতে সুদ আর আসলের ভাগ">
        <p>প্রতি মাসে আগে বকেয়ার ওপর সুদ হিসাব হয়, তারপর ইএমআইয়ের বাকি অংশ আসল কমায়:</p>
        <ul>
          <li>প্রথম মাসের সুদ: 5,00,000 × 0.0075 = ৳3,750।</li>
          <li>প্রথম মাসে আসল শোধ: 10,379.18 − 3,750 = ৳6,629.18।</li>
          <li>বাকি থাকে: 5,00,000 − 6,629.18 = ৳4,93,370.82।</li>
          <li>দ্বিতীয় মাসের সুদ: 4,93,370.82 × 0.0075 ≈ ৳3,700.28, তাই আসলে যায় প্রায় ৳6,678.90।</li>
        </ul>
        <p>
          কিস্তি একই থাকে, কিন্তু প্রতি মাসে সুদের অংশ একটু কমে আর আসলের অংশ বাড়ে। শেষ, অর্থাৎ 60তম
          কিস্তিতে সুদ মাত্র প্রায় ৳77.26। বছর ধরে যোগ করলে ছবিটা এমন:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>বছর</th>
                <th scope="col" className={headNum}>আসল শোধ (৳)</th>
                <th scope="col" className={headNum}>সুদ (৳)</th>
                <th scope="col" className={headNum}>বছর শেষে বাকি (৳)</th>
              </tr>
            </thead>
            <tbody>
              {YEARS.map(([year, principal, interest, balance]) => (
                <tr key={year}>
                  <th scope="row" className={`${cell} font-normal`}>{year}</th>
                  <td className={num}>{principal}</td>
                  <td className={num}>{interest}</td>
                  <td className={num}>{balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          প্রতিটি ঘর নিকটতম টাকায় রাউন্ড করা, তাই সুদের ঘরগুলো যোগ করলে ৳1,22,750 আসে, মোট সুদের চেয়ে ৳1 কম।
          প্রথম বছরে কিস্তির এক-তৃতীয়াংশের বেশি যায় সুদে, শেষ বছরে 5%-এরও কম।
        </p>
      </ContentSection>

      <ContentSection id="flat-vs-reducing" title="ফ্ল্যাট রেট বনাম রিডিউসিং ব্যালান্স">
        <p>
          <strong>ফ্ল্যাট রেটে</strong> সুদ ধরা হয় পুরো মেয়াদ জুড়ে মূল লোনের ওপর, যত টাকাই শোধ করুন না কেন।
          তারপর আসল আর মোট সুদ যোগ করে কিস্তির সংখ্যা দিয়ে ভাগ করা হয়। <strong>রিডিউসিং ব্যালান্সে</strong> সুদ
          ধরা হয় শুধু বাকি টাকার ওপর। তাই কাগজে একই শতাংশ লেখা থাকলেও ফ্ল্যাট রেটে মোট খরচ অনেক বেশি পড়ে।
        </p>
        <p>
          <strong>শুধু বোঝার জন্য একটি তুলনা</strong> (কোনো নির্দিষ্ট ঋণদাতার শর্ত নয়): ওপরের একই ৳5,00,000, 9%, 5
          বছর। ফ্ল্যাট হিসাবে সুদ = 5,00,000 × 9% × 5 = ৳2,25,000, আর কিস্তি = (5,00,000 + 2,25,000) ÷ 60 ≈
          ৳12,083.33।
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>9%, 5 বছর</th>
                <th scope="col" className={headNum}>রিডিউসিং ব্যালান্স</th>
                <th scope="col" className={headNum}>ফ্ল্যাট রেট</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row" className={`${cell} font-normal`}>মাসিক কিস্তি</th><td className={num}>৳10,379</td><td className={num}>৳12,083</td></tr>
              <tr><th scope="row" className={`${cell} font-normal`}>মোট সুদ</th><td className={num}>৳1,22,751</td><td className={num}>৳2,25,000</td></tr>
              <tr><th scope="row" className={`${cell} font-normal`}>মোট পরিশোধ</th><td className={num}>৳6,22,751</td><td className={num}>৳7,25,000</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          একই “9%” ফ্ল্যাট রেটে প্রায় ৳1,02,249 বেশি সুদ। রিডিউসিং-ব্যালান্সে মাসে ৳12,083 কিস্তি হতে হলে হার
          লাগত বছরে প্রায় 15.7%। তাই অফার তুলনা করার সময় শুধু শতাংশ নয়, কোন পদ্ধতি আর মোট কত দিতে হবে, তা
          জেনে নিন।
        </p>
      </ContentSection>

      <ContentSection id="steps" title="ধাপে ধাপে নিজের ইএমআই হিসাব">
        <ol>
          <li>লোন অফার থেকে লোনের পরিমাণ (P), সুদের হার আর মেয়াদ নিন।</li>
          <li>হার বছরে দেওয়া থাকলে 12 আর 100 দিয়ে ভাগ করে r বের করুন; মাসে দেওয়া থাকলে শুধু 100 দিয়ে ভাগ করুন।</li>
          <li>মেয়াদকে মাসে বদলান: n = বছর × 12।</li>
          <li>(1 + r)ⁿ বের করুন, তারপর সূত্রে বসিয়ে ইএমআই হিসাব করুন।</li>
          <li>মোট পরিশোধ = ইএমআই × n, আর মোট সুদ = মোট পরিশোধ − P।</li>
          <li>যেকোনো মাসের সুদ = তখনকার বকেয়া × r; ইএমআই থেকে তা বাদ দিলে সেই মাসের আসল শোধ।</li>
        </ol>
        <p>
          মেয়াদ বদলালে কী হয়, তাও একই সূত্রে দেখা যায়। ওপরের লোন 3 বছরে নিলে কিস্তি প্রায় ৳15,900 আর মোট সুদ
          প্রায় ৳72,395; 7 বছরে নিলে কিস্তি প্রায় ৳8,045 কিন্তু মোট সুদ প্রায় ৳1,75,741। মেয়াদ বাড়লে কিস্তি কমে,
          মোট সুদ বাড়ে।
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="যে ভুলগুলো প্রায়ই হয়">
        <ul>
          <li>
            <strong>ফ্ল্যাট আর রিডিউসিং রেট গুলিয়ে ফেলা।</strong> “9% সুদ” দুই পদ্ধতিতে দুই রকম খরচ বোঝায়, ওপরের
            তুলনার মতো।
          </li>
          <li>
            <strong>বছরের আর মাসের হার মিশিয়ে ফেলা।</strong> বছরে 9% মানে মাসে 0.75%। মাসে 1% লেখা থাকলে সেটা
            বছরে 12%-এর সমান, বছরে 1% নয়।
          </li>
          <li>
            <strong>ঘোষিত হারকে কার্যকর বার্ষিক হার ভাবা।</strong> বছরে 9% মাসে মাসে চক্রবৃদ্ধি হলে কার্যকর হার
            দাঁড়ায় প্রায় 9.38%।
          </li>
          <li>
            <strong>ফি আর বিমা ভুলে যাওয়া।</strong> প্রসেসিং ফি, বিমা বা অন্য চার্জ ইএমআই সূত্রে নেই। লোনের আসল
            খরচ জানতে এগুলো আলাদা করে যোগ করুন, আর ঋণদাতার কাছে মোট পরিশোধের অঙ্ক চেয়ে নিন।
          </li>
          <li>
            <strong>ব্যাংকের শিডিউল হুবহু মিলবে ভাবা।</strong> ঋণদাতার আসল শিডিউল কিস্তি রাউন্ড করা, দিন গোনার
            পদ্ধতি, প্রথম কিস্তির তারিখ বা পরিবর্তনশীল হারের কারণে কিছুটা আলাদা হতে পারে।
          </li>
          <li>
            <strong>শুধু কিস্তির অঙ্ক দেখা।</strong> কিস্তি আপনার হাতে পাওয়া বেতন থেকেই যাবে। আগে{" "}
            <Link href={localePath("bn", calculatorPath("salary-calculator"))} className={link}>
              বেতন ক্যালকুলেটরে
            </Link>{" "}
            নিট বেতন দেখে নিন, তারপর ভাবুন কত কিস্তি স্বচ্ছন্দে দিতে পারবেন।
          </li>
        </ul>
        <p>
          হাতে হিসাব না করে আপনার লোনের পরিমাণ, হার আর মেয়াদ{" "}
          <Link href={calculator} className={link}>
            ইএমআই / লোন ক্যালকুলেটরে
          </Link>{" "}
          দিন: মাসিক কিস্তি, মোট সুদ, মোট পরিশোধ আর বছরভিত্তিক আসল-সুদের ভাগ একসঙ্গে দেখা যাবে। চূড়ান্ত অঙ্কের
          জন্য সবসময় আপনার লোন চুক্তি দেখুন।
        </p>
      </ContentSection>
    </>
  );
}

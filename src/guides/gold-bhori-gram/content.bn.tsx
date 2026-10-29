import Link from "next/link";
import { BAJUS_SOURCE, GOLD_VAT_SOURCES } from "@/calculators/gold/logic";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

const OBSERVER_18_JUNE = "https://observerbd.com/news/579924";
const WIKIPEDIA_BHORI = "https://en.wikipedia.org/wiki/Bhori";
const IFB_ZAKAT_POLICY = "https://www.islamicfoundation.gov.bd/pages/policies/6922d8fedbfbab28ce047438";

/** Units as in src/calculators/gold/units.ts: 1 bhori = 11.664 g = 16 ana = 96 roti = 960 point. */
const UNITS: readonly [unit: string, inSmaller: string, grams: string][] = [
  ["1 ভরি", "16 আনা", "11.664"],
  ["1 আনা", "6 রতি", "0.729"],
  ["1 রতি", "10 পয়েন্ট", "0.1215"],
  ["1 পয়েন্ট", "—", "0.01215"],
];

/** Bangla guide: bhori, ana, roti and point in grams, carat, and working out a gold price (Server Component, no JS). */
export function GoldBhoriGramGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("gold-calculator"));

  return (
    <>
      <ContentSection id="answer" title="সংক্ষেপে: এক ভরি = 11.664 গ্রাম">
        <p>
          বাংলাদেশে <strong>এক ভরি সোনা = 11.664 গ্রাম</strong>। ভরিকে তোলাও বলা হয়, ওজন একই। বাংলাদেশ জুয়েলার্স
          সমিতি (বাজুস) প্রতিটি দামের বিজ্ঞপ্তিতে লেখে “প্রতি ভরি (11.664 গ্রাম)”, তাই দোকানের দাম, রসিদ আর পত্রিকার
          খবর, সবই এই ভরি ধরে।
        </p>
        <p>
          অন্য দেশের ওয়েবসাইটে তোলার মাপ আলাদা হতে পারে (যেমন পাকিস্তানের গয়নার বাজারে তোলা সাধারণত 12.5 গ্রাম ধরা
          হয়), তাই বাংলাদেশের হিসাবে 11.664 গ্রামই নিন। ভরি থেকে গ্রাম, বা আনা-রতি থেকে দাম, সরাসরি বের করতে{" "}
          <Link href={calculator} className={link}>
            সোনার দাম ও ভরি ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন; নিচের হিসাবগুলো সেটিই করে।
        </p>
      </ContentSection>

      <ContentSection id="units" title="ভরি, আনা, রতি ও পয়েন্ট: কোনটি কত গ্রাম">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>একক</th>
                <th scope="col" className={head}>সমান</th>
                <th scope="col" className={headNum}>গ্রাম</th>
              </tr>
            </thead>
            <tbody>
              {UNITS.map(([unit, inSmaller, grams]) => (
                <tr key={unit}>
                  <th scope="row" className={`${cell} font-normal`}>{unit}</th>
                  <td className={cell}>{inSmaller}</td>
                  <td className={num}>{grams}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          অর্থাৎ 1 ভরি = 16 আনা = 96 রতি = 960 পয়েন্ট। দুটি সূত্রেই সব হিসাব হয়:{" "}
          <strong>ভরিতে ওজন = ভরি + আনা ÷ 16 + রতি ÷ 96 + পয়েন্ট ÷ 960</strong>, আর{" "}
          <strong>গ্রাম = ভরি × 11.664</strong>।
        </p>
        <p>
          পয়েন্ট স্বর্ণকারদের একক, আর চারটির মধ্যে এটিই সবচেয়ে কম মানসম্মত; এখানে সবচেয়ে প্রচলিত “10 পয়েন্ট = 1
          রতি” ধরা হয়েছে। অনেক দোকান এখন শুধু গ্রামেও ওজন লেখে।
        </p>
      </ContentSection>

      <ContentSection id="convert" title="আনা রতি হিসাব: উদাহরণ">
        <h3>আনা-রতি থেকে গ্রাম</h3>
        <p>
          রসিদে লেখা 2 ভরি 5 আনা 3 রতি। ভরিতে: 2 + 5 ÷ 16 + 3 ÷ 96 = 2.34375 ভরি। গ্রামে: 2.34375 × 11.664 ={" "}
          <strong>27.3375 গ্রাম</strong>। একই ওজন মোট 37.5 আনা, 225 রতি বা 2,250 পয়েন্ট।
        </p>
        <h3>গ্রাম থেকে আনা-রতি</h3>
        <p>
          ধরুন একটি চেইনের ওজন 10 গ্রাম। 10 ÷ 11.664 = 0.8573 ভরি, অর্থাৎ এক ভরির কম। আনা-রতিতে ভাঙতে আগে পয়েন্টে
          নিন: 10 ÷ 0.01215 = 823.05 পয়েন্ট। এক আনায় 60 পয়েন্ট, তাই 13 আনা (780 পয়েন্ট), বাকি 43.05 পয়েন্ট = 4 রতি
          3.05 পয়েন্ট। স্বর্ণকার লিখবেন <strong>13 আনা 4 রতি 3.05 পয়েন্ট</strong>।
        </p>
        <p>
          একইভাবে 1 গ্রাম = 82.30 পয়েন্ট = <strong>1 আনা 2 রতি 2.3 পয়েন্ট</strong>, আর 1.5 ভরি = 1 ভরি 8 আনা।
        </p>
      </ContentSection>

      <ContentSection id="price" title="সোনার দাম হিসাব: ক্যারেট, ওজন ও মজুরি">
        <p>
          বাজুস চারটি মানের আলাদা দাম প্রকাশ করে। ক্যারেট হলো 24 ভাগের কত ভাগ খাঁটি সোনা: <strong>22 ক্যারেটে</strong>{" "}
          প্রায় 91.7%, <strong>21 ক্যারেটে</strong> 87.5%, <strong>18 ক্যারেটে</strong> 75%।{" "}
          <strong>সনাতন পদ্ধতির</strong> সোনা চারটির মধ্যে সবচেয়ে নিচের মান এবং প্রতি ভরিতে সবচেয়ে সস্তা। ওজনের হিসাব
          মানভেদে বদলায় না; শুধু রসিদের মান অনুযায়ী সেই মানের দাম নিতে হয়।
        </p>
        <p>
          <strong>সোনার দাম = ভরিতে ওজন × প্রতি ভরির দাম</strong>; <strong>মোট = সোনার দাম + মজুরি</strong>।
        </p>
        <p>
          নিচের দাম <em>শুধু উদাহরণ</em>, আজকের দাম নয়। সোনার দাম ঘন ঘন বদলায়, তাই আজকের প্রতি ভরির দাম দেখুন{" "}
          <a href={BAJUS_SOURCE.url} target="_blank" rel="noopener" className={link}>
            বাজুস-এর ওয়েবসাইটে
          </a>
          ।
        </p>
        <ul>
          <li>
            উদাহরণ-দাম 22 ক্যারেট প্রতি ভরি ৳2,20,000 ধরলে, 1 ভরি 8 আনা = 1.5 ভরি, সোনার দাম 1.5 × 2,20,000 ={" "}
            <strong>৳3,30,000</strong>।
          </li>
          <li>
            মজুরি 8% হলে যোগ হয় ৳26,400, মোট <strong>৳3,56,400</strong>। মজুরি প্রতি ভরি ৳5,000 হলে যোগ হয় 1.5 ×
            5,000 = ৳7,500, মোট ৳3,37,500।
          </li>
          <li>
            গ্রামে ওজন হলে আগে ভরিতে নিন: উদাহরণ-দাম প্রতি ভরি ৳2,33,280 হলে 5 গ্রাম = 5 ÷ 11.664 ভরি, দাম ঠিক{" "}
            <strong>৳1,00,000</strong>।
          </li>
        </ul>
        <p>
          মজুরি ডিজাইন ও দোকানভেদে আলাদা, তাই দোকান থেকে জেনে নিন। খাদ, পাথরের ওজন, ছাড় বা পুরোনো সোনা ফেরত দেওয়ার
          সময় দোকানের কাটা অংশ এই হিসাবে ধরা নেই।
        </p>
      </ContentSection>

      <ContentSection id="vat" title="সোনার ভ্যাট: দামের মধ্যেই ধরা">
        <p>
          আগে সোনার বিক্রয়মূল্যের ওপর 5% ভ্যাট ছিল। 2026-27 অর্থবছরের বাজেটে এর বদলে সোনায় প্রতি ভরি নির্দিষ্ট{" "}
          <strong>৳2,500</strong> ভ্যাট করা হয় (রুপায় প্রতি ভরি ৳100); অর্থ বিল পাস হয় 29 জুন 2026। 18 জুন 2026 থেকে
          বাজুস <strong>ভ্যাটসহ দাম</strong> প্রকাশ করছে এবং বলেছে দোকান আলাদা করে ভ্যাট নিতে পারবে না।
        </p>
        <p>
          তাই বাজুস-এর দাম ধরে হিসাব করলে সাধারণত ভ্যাট আলাদা যোগ করতে হয় না। আপনার বিলে তবু ভ্যাট যোগ থাকলে বিলের অঙ্কই
          মানুন: যেমন উপরের উদাহরণে সোনা ও মজুরির ৳3,56,400-এর ওপর 5% যোগ হলে ৳17,820, মোট ৳3,74,220; আর মজুরি ছাড়া
          প্রতি ভরি ৳2,500 যোগ হলে 1.5 ভরিতে ৳3,750, মোট ৳3,33,750। NBR-এর আদেশটি আমরা সরাসরি পড়তে পারিনি, তাই বিল
          অন্যরকম হলে বিল ও NBR-এর বর্তমান নিয়মই চূড়ান্ত।
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="যে ভুলগুলো প্রায়ই হয়">
        <ul>
          <li>
            <strong>এক ভরিকে 10 বা 12 গ্রাম ধরা।</strong> 10 গ্রাম আসলে 13 আনা 4 রতি 3.05 পয়েন্ট, পুরো এক ভরি নয়।
          </li>
          <li>
            <strong>এক আনাকে ভরির দশ ভাগের এক ভাগ ভাবা।</strong> ভরিতে 16 আনা, তাই 8 আনা মানে আধা ভরি।
          </li>
          <li>
            <strong>প্রতি গ্রাম আর প্রতি ভরির দাম গুলিয়ে ফেলা।</strong> প্রতি গ্রামের দাম = প্রতি ভরির দাম ÷ 11.664।
          </li>
          <li>
            <strong>ভুল মানের দাম নেওয়া।</strong> 21 বা 18 ক্যারেটের গয়নায় 22 ক্যারেটের দাম বসালে হিসাব বেশি আসে।
          </li>
          <li>
            <strong>ভ্যাট দুইবার যোগ করা।</strong> বাজুস-এর দামে ভ্যাট আগেই ধরা আছে।
          </li>
          <li>
            <strong>যাকাতের হিসাবে ওজন ভুল এককে নেওয়া।</strong> সোনার নিসাব 7.5 ভরি, অর্থাৎ 87.48 গ্রাম। ওজন ভরিতে
            মিলিয়ে{" "}
            <Link href={localePath("bn", calculatorPath("zakat-calculator"))} className={link}>
              যাকাত ক্যালকুলেটরে
            </Link>{" "}
            দিন; সেটি আপনার দেওয়া দামে মূল্য ধরে নিসাবের সঙ্গে মিলিয়ে দেখায়।
          </li>
        </ul>
        <p>
          কেনার আগে বা রসিদ মিলিয়ে দেখতে ওজন আর আজকের দাম দিয়ে{" "}
          <Link href={calculator} className={link}>
            সোনার দাম ও ভরি ক্যালকুলেটরে
          </Link>{" "}
          হিসাব করুন: গ্রাম, ভরি, আনা-রতি-পয়েন্ট আর মজুরিসহ মোট দাম একসঙ্গে দেখা যাবে। এটি বিনামূল্যে, সাইন আপ লাগে
          না, আর আপনার ওজন বা দাম কোথাও পাঠানো হয় না।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র ও তারিখ">
        <ul>
          <li>
            একক (11.664 গ্রাম, 16 আনা, 96 রতি, 960 পয়েন্ট):{" "}
            <a href={WIKIPEDIA_BHORI} target="_blank" rel="noopener" className={link}>
              Wikipedia, “Bhori”
            </a>
            , এবং বাজুস-এর দামের বিজ্ঞপ্তি, যেখানে লেখা থাকে “প্রতি ভরি (11.664 গ্রাম)”।
          </li>
          <li>
            আজকের দাম ও চারটি মান:{" "}
            <a href={BAJUS_SOURCE.url} target="_blank" rel="noopener" className={link}>
              বাংলাদেশ জুয়েলার্স সমিতি (বাজুস)
            </a>{" "}
            (দাম নিয়মিত বদলায়)।
          </li>
          <li>
            18 জুন 2026 থেকে বাজুস-এর ভ্যাটসহ দাম:{" "}
            <a href={OBSERVER_18_JUNE} target="_blank" rel="noopener" className={link}>
              The Daily Observer, 18 June 2026
            </a>
            ।
          </li>
          {GOLD_VAT_SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>
            </li>
          ))}
          <li>
            সোনার নিসাব:{" "}
            <a href={IFB_ZAKAT_POLICY} target="_blank" rel="noopener" className={link}>
              ইসলামিক ফাউন্ডেশন বাংলাদেশ, যাকাত তহবিল পরিচিতি ও নীতিমালা
            </a>{" "}
            (9ম সংস্করণ, ফেব্রুয়ারি 2025)।
          </li>
        </ul>
        <p>
          সবগুলো 29 অক্টোবর 2026-এ যাচাই করা। এখানের দাম শুধু উদাহরণ; কেনাবেচার আগে বাজুস-এর আজকের দাম আর দোকানের
          রসিদ মিলিয়ে নিন।
        </p>
      </ContentSection>
    </>
  );
}

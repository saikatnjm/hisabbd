import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Same figures as the logic tests: [loan, flat, term, instalments, real rate, effective rate]. */
const EXAMPLES: readonly [string, string, string, string, string, string][] = [
  ["৳1,00,000", "12%", "12 মাস, মাসিক", "৳9,333.33 × 12", "21.46%", "23.70%"],
  ["৳1,00,000, ফি ৳2,000 বাদে", "12%", "12 মাস, মাসিক", "৳9,333.33 × 12", "25.40%", "28.58%"],
  ["৳2,00,000", "10%", "24 মাস, মাসিক", "৳10,000 × 24", "18.16%", "19.75%"],
  ["৳50,000", "15%", "12 মাস, সাপ্তাহিক", "৳1,105.77 × 52", "28.14%", "32.40%"],
];

/** Explanatory content (Bangla) for the Flat Rate to Real Interest Rate Calculator (Server Component, no JS). */
export function FlatRateCalculatorContentBn() {
  const bn = (slug: string) => localePath("bn", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="ফ্ল্যাট রেট থেকে আসল হার কীভাবে বের হয়">
        <p>
          ফ্ল্যাট রেটে পুরো মেয়াদ জুড়ে <strong>মূল</strong> ঋণের ওপর সুদ ধরা হয়। এনজিও, ক্ষুদ্রঋণ আর কিছু গাড়ি ও
          ভোগ্যপণ্যের ঋণে সাপ্তাহিক বা মাসিক কিস্তিসহ প্রায়ই এভাবে হার বলা হয়।
        </p>
        <ul>
          <li>
            <strong>মোট ফ্ল্যাট সুদ = ঋণ × ফ্ল্যাট রেট × বছর</strong>, যেখানে বছর = মাস ÷ 12।
          </li>
          <li>
            <strong>কিস্তি = (ঋণ + মোট সুদ) ÷ কিস্তির সংখ্যা।</strong>
          </li>
          <li>
            <strong>আসল হার:</strong> প্রতি কিস্তির যে হার i-তে কিস্তিগুলোর বর্তমান মূল্য আপনার পাওয়া টাকার সমান হয়,{" "}
            <strong>পাওয়া টাকা = কিস্তি × (1 − (1 + i)<sup>−N</sup>) ÷ i</strong>। i-এর সরাসরি সূত্র নেই, তাই
            ক্যালকুলেটর বাইসেকশন পদ্ধতিতে বের করে।
          </li>
          <li>
            <strong>আসল বার্ষিক হার = i × বছরের কিস্তির সংখ্যা</strong> (মাসিক 12, সাপ্তাহিক 52)।{" "}
            <strong>কার্যকর বার্ষিক হার</strong> হলো (1 + i)<sup>বছরের কিস্তির সংখ্যা</sup> − 1।
          </li>
        </ul>
        <p>পাওয়া টাকা হলো ঋণ থেকে অগ্রিম ফি বাদ দেওয়া টাকা। সুদ আর কিস্তি কিন্তু পুরো ঋণের ওপরেই ধরা হয়।</p>
      </ContentSection>

      <ContentSection id="example-monthly" title="উদাহরণ: ৳1,00,000, 12% ফ্ল্যাট, মাসিক">
        <ol>
          <li>সুদ = 1,00,000 × 12% × 1 বছর = ৳12,000।</li>
          <li>কিস্তি = (1,00,000 + 12,000) ÷ 12 = ৳9,333.33।</li>
          <li>
            ৳9,333.33-এর 12টি কিস্তির মূল্য ৳1,00,000-এর সমান হওয়ার মাসিক হার প্রায় 1.788%, তাই আসল বার্ষিক হার 1.788% ×
            12 = <strong>21.46%</strong>। মাসিক চক্রবৃদ্ধি ধরলে কার্যকর বার্ষিক হার 23.70%।
          </li>
        </ol>
      </ContentSection>

      <ContentSection id="example-weekly" title="উদাহরণ: ৳50,000, 15% ফ্ল্যাট, সাপ্তাহিক">
        <p>
          সাপ্তাহিক মানে বছরে 52টি কিস্তি, তাই 12 মাসে 52টি কিস্তি। সুদ = 50,000 × 15% = ৳7,500 আর কিস্তি = (50,000 +
          7,500) ÷ 52 = ৳1,105.77। মিলে যাওয়া সাপ্তাহিক হার প্রায় 0.541%, তাই আসল বার্ষিক হার 0.541% × 52 ={" "}
          <strong>28.14%</strong>, বলা 15%-এর প্রায় দ্বিগুণ।
        </p>
      </ContentSection>

      <ContentSection id="examples" title="আরও কয়েকটি উদাহরণ পাশাপাশি">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>ঋণ</th>
                <th scope="col" className={headNum}>ফ্ল্যাট রেট</th>
                <th scope="col" className={head}>মেয়াদ</th>
                <th scope="col" className={headNum}>কিস্তি</th>
                <th scope="col" className={headNum}>আসল হার</th>
                <th scope="col" className={headNum}>কার্যকর হার</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map(([loan, flat, term, instalments, real, effective]) => (
                <tr key={loan}>
                  <th scope="row" className={`${cell} font-normal`}>{loan}</th>
                  <td className={num}>{flat}</td>
                  <td className={cell}>{term}</td>
                  <td className={num}>{instalments}</td>
                  <td className={num}>{real}</td>
                  <td className={num}>{effective}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="why-understates" title="ফ্ল্যাট রেট কেন খরচ কম দেখায়">
        <p>
          প্রতিটি কিস্তিতে ঋণের কিছু অংশ শোধ হয়, তাই আপনার বাকি ঋণ কমে। ফ্ল্যাট রেট সেটা গোনে না, পুরো টাকার ওপরেই সুদ
          ধরে। ৳1,00,000-এর উদাহরণে সুদ ৳12,000, অথচ গড়ে আপনার হাতে থাকে ঋণের প্রায় ৳54,000। এক বছরে শোধ হওয়া মাসিক
          কিস্তির ঋণে আসল হার মোটামুটি ফ্ল্যাট রেটের 1.8 গুণ। অগ্রিম ফি থাকলে আরও বাড়ে, কারণ আপনি যা পান তার চেয়ে বেশি
          ফেরত দেন।
        </p>
        <p>
          ফ্ল্যাট আর ক্রমহ্রাসমান স্থিতির ঋণের তুলনা এবং ইএমআই কীভাবে হিসাব হয় জানতে পড়ুন{" "}
          <Link href={localePath("bn", guidePath("how-emi-is-calculated"))} className={link}>
            ইএমআই কীভাবে হিসাব করা হয়
          </Link>
          । ক্রমহ্রাসমান স্থিতির হারে বলা ঋণের জন্য{" "}
          <Link href={bn("emi-calculator")} className={link}>
            ইএমআই ক্যালকুলেটর
          </Link>
          , আর সাধারণ সরল বা চক্রবৃদ্ধি মুনাফার জন্য{" "}
          <Link href={bn("interest-calculator")} className={link}>
            মুনাফা ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="ধরে নেওয়া শর্ত">
        <ul>
          <li>কিস্তি সমান, প্রতি মাস বা সপ্তাহের শেষে দেওয়া হয়; টাকা পাওয়ার এক পর্ব পরে প্রথম কিস্তি।</li>
          <li>সাপ্তাহিক মানে বছরে 52টি কিস্তি, তাই সংখ্যা = মাস × 52 ÷ 12, কাছের পূর্ণ সংখ্যায়। আপনার ঋণদাতা সপ্তাহ অন্যভাবে গুনতে পারে।</li>
          <li>বিলম্ব ফি, প্রতি কিস্তিতে নেওয়া বিমা, গ্রেস পিরিয়ড আর আংশিক পরিশোধ ধরা হয়নি।</li>
          <li>এই পাতা সুদের হারের কোনো আইনি সীমা বলে না। ঋণদাতার লিখিত কিস্তির তালিকা চেয়ে নিয়ে আসল হারের সঙ্গে মেলান।</li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর ব্যবহারের নিয়ম">
        <ol>
          <li>ঋণের পরিমাণ লিখুন। বাংলা অঙ্ক আর 1,00,000-ধরনের কমা দুটোই চলে।</li>
          <li>বার্ষিক ফ্ল্যাট সুদের হার লিখুন, যেমন 12।</li>
          <li>ঋণের মেয়াদ পূর্ণ মাসে লিখুন।</li>
          <li>মাসিক বা সাপ্তাহিক কিস্তি বেছে নিন।</li>
          <li>ঋণ থেকে কেটে নেওয়া অগ্রিম ফি থাকলে লিখুন, না থাকলে ফাঁকা রাখুন।</li>
          <li>“আসল হার বের করুন” চেপে কিস্তি, মোট পরিশোধ আর আসল বার্ষিক হার দেখুন।</li>
        </ol>
      </ContentSection>
    </>
  );
}

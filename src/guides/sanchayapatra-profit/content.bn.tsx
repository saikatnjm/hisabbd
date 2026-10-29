import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import {
  BUDGET_2026_TAX_REPORT,
  IRD_RATE_ORDER,
  NSD_SCHEMES_PAGE,
  RATES_UNCHANGED_2026,
  SOURCE_TAX_RULES,
} from "@/calculators/sanchayapatra/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Rate held to maturity (% a year), IRD order of 30 June 2025: scheme, payout, up to ৳7.5 lakh, above. */
const RATES: readonly [scheme: string, payout: string, upTo: string, above: string][] = [
  ["পেনশনার সঞ্চয়পত্র (5 বছর)", "মাসে মাসে", "11.98%", "11.80%"],
  ["পরিবার সঞ্চয়পত্র (5 বছর)", "মাসে মাসে", "11.93%", "11.80%"],
  ["5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্র", "মেয়াদ শেষে একসাথে", "11.83%", "11.80%"],
  ["তিন মাস অন্তর মুনাফাভিত্তিক (3 বছর)", "প্রতি 3 মাসে", "11.82%", "11.77%"],
];

/** ৳1,00,000 in each scheme at the rate up to ৳7.5 lakh, 10% source tax (from the calculator's tests). */
const EXAMPLES: readonly [scheme: string, perPayment: string, net: string, total: string][] = [
  ["পরিবার, মাসিক", "৳894.75 (মাসে)", "৳53,685", "৳1,53,685"],
  ["তিন মাস অন্তর", "৳2,659.50 (3 মাসে)", "৳31,914", "৳1,31,914"],
  ["বাংলাদেশ, মেয়াদ শেষে", "৳53,235 (একবার)", "৳53,235", "৳1,53,235"],
];

/** Bangla guide: how Sanchayapatra profit and source tax are calculated (Server Component, no JS). */
export function SanchayapatraProfitGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("sanchayapatra-calculator"));
  const fdr = localePath("bn", calculatorPath("fdr-calculator"));
  const dps = localePath("bn", calculatorPath("dps-calculator"));

  return (
    <>
      <ContentSection id="formula" title="সঞ্চয়পত্রের মুনাফার সূত্র">
        <p>
          সঞ্চয়পত্রে মুনাফা হয় <strong>সরল হারে</strong>: প্রতি বছর বিনিয়োগের ওপর একই অঙ্ক, কোনো চক্রবৃদ্ধি নেই।
          মুনাফা আসলের সঙ্গে যোগ হয় না, আপনাকে দিয়ে দেওয়া হয়।
        </p>
        <p>
          <strong>বছরে মুনাফা = বিনিয়োগ × হার ÷ 100</strong>
        </p>
        <ul>
          <li>
            <strong>পরিবার ও পেনশনার সঞ্চয়পত্র:</strong> মাসে মাসে, বছরের মুনাফা ÷ 12, মোট 60 বার।
          </li>
          <li>
            <strong>তিন মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র:</strong> প্রতি 3 মাসে, বছরের মুনাফা ÷ 4, 3 বছরে মোট 12
            বার।
          </li>
          <li>
            <strong>5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্র:</strong> পুরো মুনাফা মেয়াদ শেষে আসলের সঙ্গে, বছরের মুনাফা × 5।
          </li>
        </ul>
        <p>
          প্রতিটি মুনাফা থেকে উৎসে কর কেটে বাকিটা হাতে আসে, আর মেয়াদ শেষে আসল পুরোটা ফেরত পান। নিজের অঙ্ক দিয়ে
          সঙ্গে সঙ্গে দেখতে{" "}
          <Link href={calculator} className={link}>
            সঞ্চয়পত্রের মুনাফা ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন। নিচে একই হিসাব হাতে করে দেখানো হলো।
        </p>
      </ContentSection>

      <ContentSection id="rates" title="সঞ্চয়পত্রের মুনাফার হার 2026">
        <p>
          অভ্যন্তরীণ সম্পদ বিভাগের 30 জুন 2025-এর প্রজ্ঞাপনের হার <strong>1 জুলাই 2025</strong> থেকে কার্যকর। সরকার
          জানুয়ারি 2026-এ এবং জুলাই–ডিসেম্বর 2026-এর জন্যও এই হার অপরিবর্তিত রেখেছে। নিচে মেয়াদ পূর্ণ করলে প্রাপ্য
          বার্ষিক হার:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>সঞ্চয়পত্র</th>
                <th scope="col" className={head}>মুনাফা পান</th>
                <th scope="col" className={headNum}>৳7.5 লাখ পর্যন্ত</th>
                <th scope="col" className={headNum}>৳7.5 লাখের বেশি</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map(([scheme, payout, upTo, above]) => (
                <tr key={scheme}>
                  <th scope="row" className={`${cell} font-normal`}>{scheme}</th>
                  <td className={cell}>{payout}</td>
                  <td className={num}>{upTo}</td>
                  <td className={num}>{above}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>৳7.5 লাখের ধাপ</strong> ঠিক হয় সব জাতীয় সঞ্চয় স্কিমে আপনার ক্রমপুঞ্জিভূত মোট বিনিয়োগ দিয়ে, শুধু
          যে সঞ্চয়পত্রটি কিনছেন তা দিয়ে নয়। আগের কেনাসহ মোট ৳7,50,000-এর বেশি হলে নিচের হার প্রযোজ্য। হার প্রতি ছয়
          মাসে পর্যালোচনা হয়, তবে কেনার দিনের হার পুরো মেয়াদে বহাল থাকে। তাই 1 জুলাই 2025-এর আগে কেনা
          সঞ্চয়পত্রে ছাপা পুরোনো হারটিই ধরুন।
        </p>
        <p>
          পরিবার সঞ্চয়পত্র কিনতে পারেন 18 বছর বা তার বেশি বয়সী বাংলাদেশি নারী, যেকোনো শারীরিক প্রতিবন্ধী এবং 65
          বছর বা তার বেশি বয়সী যেকোনো নাগরিক, একক নামে সর্বোচ্চ ৳45 লাখ। পেনশনার সঞ্চয়পত্র অবসরপ্রাপ্ত সরকারি ও
          আধা-সরকারি কর্মচারীসহ কয়েকটি শ্রেণির জন্য, সর্বোচ্চ ৳50 লাখ।
        </p>
      </ContentSection>

      <ContentSection id="examples" title="উদাহরণ: ৳1 লাখে মাসিক, ত্রৈমাসিক ও মেয়াদ শেষে কত">
        <h3>পরিবার সঞ্চয়পত্র: মাসিক মুনাফা</h3>
        <ol>
          <li>বছরে মুনাফা: 1,00,000 × 11.93 ÷ 100 = ৳11,930।</li>
          <li>মাসে: 11,930 ÷ 12 = ৳994.17।</li>
          <li>10% উৎসে কর: ৳99.42, তাই হাতে মাসে <strong>৳894.75</strong>।</li>
          <li>5 বছরে মুনাফা ৳59,650, কর ৳5,965, নিট ৳53,685; আসলসহ মোট ৳1,53,685।</li>
        </ol>
        <h3>তিন মাস অন্তর মুনাফাভিত্তিক: ত্রৈমাসিক মুনাফা</h3>
        <p>
          11.82% হারে বছরে ৳11,820, তাই প্রতি 3 মাসে 11,820 ÷ 4 = ৳2,955। 10% কর ৳295.50 কাটার পর{" "}
          <strong>৳2,659.50</strong>। 3 বছরে মুনাফা ৳35,460, কর ৳3,546, নিট ৳31,914।
        </p>
        <h3>5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্র: মেয়াদ শেষে</h3>
        <p>
          11.83% হারে 1,00,000 × 11.83 ÷ 100 × 5 = ৳59,150। 10% কর ৳5,915 কাটার পর মেয়াদ শেষে একসাথে{" "}
          <strong>৳1,53,235</strong>।
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>৳1,00,000, 10% কর</th>
                <th scope="col" className={headNum}>প্রতিবার হাতে</th>
                <th scope="col" className={headNum}>মোট নিট মুনাফা</th>
                <th scope="col" className={headNum}>আসলসহ মোট</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map(([scheme, perPayment, net, total]) => (
                <tr key={scheme}>
                  <th scope="row" className={`${cell} font-normal`}>{scheme}</th>
                  <td className={num}>{perPayment}</td>
                  <td className={num}>{net}</td>
                  <td className={num}>{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          বড় অঙ্কে হার একটু কম: পরিবার সঞ্চয়পত্রে ৳10,00,000 ঊর্ধ্ব ধাপে পড়ে, 11.80% হারে মাসে ৳9,833.33, কর
          ৳983.33 বাদে হাতে <strong>মাসে ৳8,850</strong>।
        </p>
        <h3>নিজের সঞ্চয়পত্রের হিসাব ধাপে ধাপে</h3>
        <ol>
          <li>সব সঞ্চয়পত্র মিলিয়ে মোট বিনিয়োগ ৳7.5 লাখের কম না বেশি, দেখে সঠিক হার নিন।</li>
          <li>বিনিয়োগ × হার ÷ 100 = বছরের মুনাফা।</li>
          <li>মাসিক হলে ÷ 12, ত্রৈমাসিক হলে ÷ 4, মেয়াদ শেষে হলে × 5।</li>
          <li>প্রতিটি মুনাফা থেকে করের হার অনুযায়ী উৎসে কর বাদ দিন; বাকিটা হাতে আসবে।</li>
        </ol>
      </ContentSection>

      <ContentSection id="tax" title="উৎসে কর কত কাটে">
        <p>
          আয়কর আইন 2023-এর ধারা 105 অনুযায়ী প্রতিটি মুনাফা থেকে উৎসে কর কাটা হয়। ক্যালকুলেটরে{" "}
          <strong>{SOURCE_TAX_RULES.standard.value}%</strong> আগে থেকে বসানো থাকে, তবে কিছু ক্ষেত্রে হার আলাদা বলে
          জানা গেছে:
        </p>
        <ul>
          <li>
            NBR ফেব্রুয়ারি 2026-এ জানিয়েছিল, সব সঞ্চয়পত্রে মোট বিনিয়োগ ৳5 লাখ পর্যন্ত হলে{" "}
            {SOURCE_TAX_RULES.smallHolder.value}%, তার বেশি হলে 10%।
          </li>
          <li>
            NSD-র তথ্যপত্র অনুযায়ী পেনশনার সঞ্চয়পত্রে মোট ৳5 লাখ পর্যন্ত উৎসে কর নেই। তখন ৳5,00,000-এ 11.98% হারে
            মাসে ৳4,991.67, 5 বছরে পুরো ৳2,99,500 হাতে আসে।
          </li>
          <li>
            2026-27 অর্থবিলে সব সঞ্চয়পত্রে 10% কেটে তাকে চূড়ান্ত নয়, অগ্রিম কর ধরার খবর এসেছে। 5% ও 0% হার এখনও
            বহাল কি না, তা সরকারি সূত্র থেকে নিশ্চিত করা যায়নি।
          </li>
        </ul>
        <p>
          তাই মুনাফার বিবরণীতে আপনার সঞ্চয় অফিস বা ব্যাংক আসলে যে হারে কাটে, সেটিই হিসাবে ধরুন। পুরো কর হিসাবের
          জন্য কর পরামর্শকের সাহায্য নিন।
        </p>
      </ContentSection>

      <ContentSection id="early-encashment" title="মেয়াদের আগে ভাঙালে মুনাফা কমে">
        <p>
          ওপরের সব হিসাব মেয়াদ পূর্ণ করলে। জাতীয় সঞ্চয় অধিদপ্তরের স্কিম তথ্যপত্র অনুযায়ী আগে ভাঙালে যত বছর পূর্ণ
          হয়েছে, সেই বছরের কম হারে মুনাফা হিসাব হয়, আর আগে বেশি দেওয়া মুনাফা আসল থেকে কেটে নেওয়া হয়। যেমন, ৳7.5
          লাখ পর্যন্ত পরিবার সঞ্চয়পত্রে 1 বছর পর হার 11.93% নয়, 9.81%। ভাঙানোর আগে সঠিক অঙ্ক সঞ্চয় অফিস থেকে
          জেনে নিন।
        </p>
      </ContentSection>

      <ContentSection id="compare" title="এফডিআর ও ডিপিএস থেকে হিসাবে পার্থক্য">
        <ul>
          <li>
            <strong>হার কে ঠিক করে:</strong> সঞ্চয়পত্রের হার সরকার ঠিক করে, সব অফিসে এক। ব্যাংকের এফডিআর ও ডিপিএসের
            হার প্রতিটি ব্যাংক নিজে ঠিক করে।
          </li>
          <li>
            <strong>সরল না চক্রবৃদ্ধি:</strong> সঞ্চয়পত্রে সরল মুনাফা। এফডিআরে সুদ জমায় যোগ হলে চক্রবৃদ্ধি হয়, আর
            ডিপিএসে প্রতি মাসের কিস্তি আলাদা সময় ধরে সুদ পায়।
          </li>
          <li>
            <strong>কর:</strong> সঞ্চয়পত্রে ধারা 105, ব্যাংক আমানতে ধারা 102 (সাধারণত 10%, রিটার্নের প্রমাণ না দিলে
            15%)। ব্যাংক হিসাবের ব্যালান্স ৳4 লাখ ছাড়ালে বছরে আবগারি শুল্কও কাটে।
          </li>
        </ul>
        <p>
          একই অঙ্ক ব্যাংকে রাখলে কত আসে দেখতে{" "}
          <Link href={fdr} className={link}>
            এফডিআর ক্যালকুলেটর
          </Link>
          , আর প্রতি মাসে জমালে{" "}
          <Link href={dps} className={link}>
            ডিপিএস ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন। সঞ্চয়পত্রের ধরন, অঙ্ক, ধাপ ও করের হার বদলে মাসিক বা মেয়াদ শেষের মুনাফা দেখতে{" "}
          <Link href={calculator} className={link}>
            সঞ্চয়পত্রের মুনাফা ক্যালকুলেটরে
          </Link>{" "}
          যান। এই লেখা শুধু হিসাব বোঝানোর জন্য, বিনিয়োগ পরামর্শ নয়।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            হার:{" "}
            <a href={IRD_RATE_ORDER.url} target="_blank" rel="noopener" className={link}>
              অভ্যন্তরীণ সম্পদ বিভাগের প্রজ্ঞাপন
            </a>
            , 30 জুন 2025, কার্যকর 1 জুলাই 2025।
          </li>
          <li>
            মুনাফা দেওয়ার ধরন, আগে ভাঙানো ও পেনশনারের কর:{" "}
            <a href={NSD_SCHEMES_PAGE.url} target="_blank" rel="noopener" className={link}>
              জাতীয় সঞ্চয় অধিদপ্তরের স্কিম তথ্যপত্র
            </a>{" "}
            (পাতা হালনাগাদ 9 আগস্ট 2026)।
          </li>
          <li>
            জুলাই–ডিসেম্বর 2026-এ হার অপরিবর্তিত:{" "}
            <a href={RATES_UNCHANGED_2026.url} target="_blank" rel="noopener" className={link}>
              বাংলা ট্রিবিউন
            </a>
            , 2 জুলাই 2026।
          </li>
          <li>
            উৎসে কর:{" "}
            <a href={SOURCE_TAX_RULES.standard.source.url} target="_blank" rel="noopener" className={link}>
              বাংলা ট্রিবিউন (NBR-এর চিঠি)
            </a>
            , 3 ফেব্রুয়ারি 2026; 2026-27 বাজেট:{" "}
            <a href={BUDGET_2026_TAX_REPORT.url} target="_blank" rel="noopener" className={link}>
              প্রথম আলো
            </a>
            , 13 জুন 2026।
          </li>
        </ul>
        <p>
          হার ও কর 28 অক্টোবর 2026-এ যাচাই করা। প্রতি জানুয়ারি ও জুলাইয়ে হার পর্যালোচনা হয়, আর বাজেটে কর বদলাতে
          পারে, তাই কেনার আগে সর্বশেষ প্রজ্ঞাপন দেখে নিন। আপনার সঞ্চয়পত্রে ছাপা হারই চূড়ান্ত।
        </p>
      </ContentSection>
    </>
  );
}

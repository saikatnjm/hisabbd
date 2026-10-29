import Link from "next/link";
import { EXCISE_TABLE, exciseBandRanges, SOURCE_TAX_SOURCES } from "@/calculators/fdr/deposit-tax";
import { calculatorPath } from "@/calculators/paths";
import { IRD_RATE_ORDER, SOURCE_TAX_RULES } from "@/calculators/sanchayapatra/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatPlainDate, formatTaka } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Side-by-side features: topic, FDR, DPS, Sanchayapatra (facts from the three calculators' pages). */
const COMPARISON: readonly [topic: string, fdr: string, dps: string, sanchayapatra: string][] = [
  ["কীভাবে জমা দেন", "একবারে এককালীন", "প্রতি মাসে একই কিস্তি", "একবারে এককালীন"],
  ["হার কে ঠিক করে", "প্রতিটি ব্যাংক", "প্রতিটি ব্যাংক", "সরকার, প্রতি 6 মাসে পর্যালোচনা"],
  ["সুদ বা মুনাফার ধরন", "সরল, বা সুদ জমায় যোগ হলে চক্রবৃদ্ধি", "চক্রবৃদ্ধি (মাসিক, ত্রৈমাসিক বা বার্ষিক)", "সরল"],
  ["কখন হাতে পান", "নিয়মিত, বা মেয়াদ শেষে", "মেয়াদ শেষে একসাথে", "মাসে, 3 মাসে বা মেয়াদ শেষে"],
  ["উৎসে কর", "ধারা 102: 10%, রিটার্নের প্রমাণ না দিলে 15%", "ধারা 102: 10%, রিটার্নের প্রমাণ না দিলে 15%", "ধারা 105: 10% (কিছু ক্ষেত্রে কম হারের খবর)"],
  ["আগে ভাঙালে", "ব্যাংকের শর্তে, কম হার হতে পারে", "ব্যাংকের শর্তে, কম হার হতে পারে", "পূর্ণ বছরের কম হার; বাড়তি মুনাফা আসল থেকে কাটা"],
];

function publishedOn(iso: string): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date, { locale: "bn" }) : iso;
}

/** Bangla guide: how FDR and DPS returns are calculated and compared (Server Component, no JS). */
export function FdrVsDpsGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("dps-calculator"));
  const fdr = localePath("bn", calculatorPath("fdr-calculator"));
  const sanchayapatra = localePath("bn", calculatorPath("sanchayapatra-calculator"));

  return (
    <>
      <ContentSection id="difference" title="এফডিআর আর ডিপিএস: মূল পার্থক্য">
        <p>
          দুটিই ব্যাংকের আমানত, কিন্তু টাকা জমার ধরন আলাদা। <strong>এফডিআরে</strong> (ফিক্সড ডিপোজিট বা স্থায়ী
          আমানত) একটি এককালীন অঙ্ক নির্দিষ্ট মেয়াদে রাখেন। <strong>ডিপিএসে</strong> (ডিপোজিট পেনশন স্কিম বা মাসিক
          সঞ্চয় স্কিম) প্রতি মাসে একই কিস্তি জমা দেন, আর মেয়াদ শেষে জমা ও সুদ একসাথে পান।
        </p>
        <p>
          তাই “কোনটিতে বেশি লাভ” প্রশ্নের উত্তর শুধু সুদের হার দেখে মেলে না। এফডিআরে পুরো টাকা প্রথম দিন থেকে সুদ
          পায়; ডিপিএসে প্রতিটি কিস্তি শুধু জমার মাস থেকে সুদ পায়। দুটির হিসাব আলাদা, আর কোনটি আপনার জন্য মানানসই
          তা নির্ভর করে টাকা এখন একসাথে আছে, নাকি আয় থেকে প্রতি মাসে জমাবেন, তার ওপর। নিজের কিস্তি দিয়ে দেখতে{" "}
          <Link href={calculator} className={link}>
            ডিপিএস ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন। নিচে দুটির হিসাব ধাপে ধাপে।
        </p>
      </ContentSection>

      <ContentSection id="fdr" title="এফডিআরের সুদ যেভাবে হিসাব হয়">
        <p>
          <strong>সরল সুদ = জমা × বার্ষিক হার ÷ 100 × মাস ÷ 12</strong>। ব্যাংক প্রতি p মাসে (1, 3 বা 12) সুদ জমায়
          যোগ করলে চক্রবৃদ্ধি হয়:{" "}
          <strong>মেয়াদ শেষে = জমা × (1 + হার ÷ 100 × p ÷ 12)^(সুদ যোগের সংখ্যা)</strong>।
        </p>
        <ul>
          <li>
            <strong>৳1,00,000, 1 বছর, 9%, সরল:</strong> সুদ ৳9,000, 10% কর ৳900, আবগারি নেই। হাতে{" "}
            <strong>৳1,08,100</strong>।
          </li>
          <li>
            <strong>৳5,00,000, 3 বছর, 10%, প্রতি 3 মাসে সুদ যোগ:</strong> 5,00,000 × 1.025^12 ≈ ৳6,72,444, সুদ প্রায়
            ৳1,72,444, কর প্রায় ৳17,244, আবগারি আনুমানিক ৳1,500। হাতে প্রায় <strong>৳6,53,700</strong>।
          </li>
        </ul>
        <p>
          ত্রৈমাসিক চক্রবৃদ্ধিতে বছরে 10% কর বাদের আগে প্রায় 10.38%-এর সমান হয়। নিজের অঙ্কে দেখতে{" "}
          <Link href={fdr} className={link}>
            এফডিআর ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="dps" title="ডিপিএসের সুদ যেভাবে হিসাব হয়">
        <p>
          প্রতিটি কিস্তি মাসের শুরুতে জমা হয় আর সেই মাস থেকে সুদ পায়; শেষ কিস্তির এক মাস পরে মেয়াদ পূর্ণ হয়।
          মাসিক চক্রবৃদ্ধিতে:
        </p>
        <p>
          <strong>মেয়াদ শেষে = A × ((1 + i)ⁿ − 1) ÷ i × (1 + i)</strong>, যেখানে A মাসিক কিস্তি, i = বার্ষিক হার ÷
          12 ÷ 100, আর n = বছর × 12।
        </p>
        <ul>
          <li>
            <strong>মাসে ৳5,000, 5 বছর, 9%:</strong> মোট জমা ৳3,00,000, মেয়াদ শেষে প্রায় ৳3,79,949, সুদ প্রায় ৳79,949,
            কর প্রায় ৳7,995। ব্যালান্স কখনো ৳4 লাখ ছাড়ায় না, তাই আবগারি নেই। হাতে প্রায় <strong>৳3,71,954</strong>।
          </li>
          <li>
            <strong>মাসে ৳10,000, 5 বছর, 10%:</strong> মোট জমা ৳6,00,000, মেয়াদ শেষে প্রায় ৳7,80,824, সুদ প্রায়
            ৳1,80,824, কর ৳18,082, আবগারি আনুমানিক ৳1,150। হাতে প্রায় <strong>৳7,61,591</strong>।
          </li>
        </ul>
        <p>
          প্রথম উদাহরণে প্রথম ৳5,000 পুরো 60 মাস সুদ পায়, কিন্তু শেষ ৳5,000 পায় মাত্র 1 মাস। তাই একই হারে ডিপিএসের
          মোট সুদ মোট জমার তুলনায় কম দেখায়; এটি হিসাবের ধরন, কম লাভের প্রমাণ নয়। চক্রবৃদ্ধির ধরনও প্রভাব ফেলে:
          একই ডিপিএস ত্রৈমাসিক চক্রবৃদ্ধিতে প্রায় ৳3,79,278, আর বার্ষিকে প্রায় ৳3,76,588।
        </p>
      </ContentSection>

      <ContentSection id="tax-and-excise" title="উৎসে কর ও আবগারি শুল্ক">
        <p>
          আয়কর আইন 2023-এর ধারা 102 অনুযায়ী এফডিআর ও ডিপিএস দুটিতেই ব্যাংক সুদ থেকে <strong>10%</strong> উৎসে কর
          কাটে। রিটার্ন দাখিল বাধ্যতামূলক হলেও রিটার্ন জমার প্রমাণ (PSR) না দিলে ধারা 142 অনুযায়ী{" "}
          <strong>15%</strong>। তখন ওপরের ৳1,00,000-এর এফডিআরে কর ৳1,350, হাতে ৳1,07,650।
        </p>
        <p>
          আবগারি শুল্ক প্রতিটি হিসাবে ক্যালেন্ডার বছরে একবার কাটে, সেই বছরের সর্বোচ্চ ব্যালান্স অনুযায়ী। 2026-27
          অর্থবছরের প্রকাশিত স্ল্যাব:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>বছরে সর্বোচ্চ ব্যালান্স</th>
                <th scope="col" className={headNum}>আবগারি শুল্ক</th>
              </tr>
            </thead>
            <tbody>
              {exciseBandRanges().map((band) => (
                <tr key={band.from}>
                  <th scope="row" className={`${cell} font-normal`}>
                    {band.to === null
                      ? `${formatTaka(band.from - 1)}-এর বেশি`
                      : band.from === 0
                        ? `${formatTaka(band.to)} পর্যন্ত`
                        : `${formatTaka(band.from)} থেকে ${formatTaka(band.to)}`}
                  </th>
                  <td className={num}>{band.duty === 0 ? "নেই" : formatTaka(band.duty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          শুল্কটি নির্দিষ্ট টাকার অঙ্ক, সুদের শতাংশ নয়। যেমন, মাসে ৳10,000-এর ডিপিএসে তৃতীয় বছরে ব্যালান্স ৳4 লাখ ছাড়ায় (৳150), চতুর্থ ও
          পঞ্চম বছরে ৳5 লাখ (প্রতিবার ৳500)। কতবার কাটবে তা নির্ভর করে মেয়াদে কয়টি ডিসেম্বর পড়ে তার ওপর।
        </p>
      </ContentSection>

      <ContentSection id="sanchayapatra" title="সঞ্চয়পত্রের সঙ্গে তুলনা">
        <p>
          সঞ্চয়পত্র ব্যাংক আমানত নয়, সরকারি সঞ্চয় স্কিম। এর হার সরকার ঠিক করে, মুনাফা সরল, আর কেনার দিনের হার পুরো
          মেয়াদে বহাল থাকে। যেমন, 5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্রে ৳1,00,000 11.83% হারে 10% উৎসে কর বাদে মেয়াদ
          শেষে দেয় ৳1,53,235। নিজের অঙ্কে দেখতে{" "}
          <Link href={sanchayapatra} className={link}>
            সঞ্চয়পত্রের মুনাফা ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className={head}>বিষয়</th>
                <th scope="col" className={head}>এফডিআর</th>
                <th scope="col" className={head}>ডিপিএস</th>
                <th scope="col" className={head}>সঞ্চয়পত্র</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([topic, fdrText, dpsText, sanchayapatraText]) => (
                <tr key={topic}>
                  <th scope="row" className={`${cell} font-normal`}>{topic}</th>
                  <td className={cell}>{fdrText}</td>
                  <td className={cell}>{dpsText}</td>
                  <td className={cell}>{sanchayapatraText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="compare" title="তুলনা করার আগে যা মিলিয়ে নেবেন">
        <ul>
          <li>
            <strong>একই মেয়াদ ও একই টাকা।</strong> 1 বছরের এফডিআর আর 5 বছরের ডিপিএস সরাসরি তুলনীয় নয়।
          </li>
          <li>
            <strong>কর ও আবগারির পরে হাতে কত।</strong> মোট সুদ নয়, নিট অঙ্ক তুলনা করুন।
          </li>
          <li>
            <strong>চক্রবৃদ্ধি কত ঘন ঘন।</strong> একই হারে মাসিক চক্রবৃদ্ধিতে একটু বেশি আসে।
          </li>
          <li>
            <strong>আগে ভাঙানোর শর্ত।</strong> মেয়াদের আগে টাকা লাগলে তিনটিতেই কম আসতে পারে।
          </li>
          <li>
            <strong>ব্যাংকের হার ও হিসাব।</strong> ব্যাংকভেদে হার আলাদা, আর দিন গোনা বা রাউন্ডিংয়ে অঙ্ক কিছুটা বদলায়।
          </li>
          <li>
            <strong>নবায়নের হার।</strong> এফডিআর নবায়নের সময় নতুন হার প্রযোজ্য হতে পারে; সঞ্চয়পত্রে কেনার দিনের হার
            মেয়াদ শেষ পর্যন্ত থাকে।
          </li>
          <li>
            <strong>কিস্তি বাদ পড়লে।</strong> ডিপিএসে কিস্তি দেরিতে দিলে ব্যাংক বিলম্ব ফি নিতে পারে; ক্যালকুলেটর ধরে নেয়
            সব কিস্তি সময়মতো জমা হয়েছে।
          </li>
        </ul>
        <p>
          আপনার ব্যাংকের হার দিয়ে মাসিক সঞ্চয়ের নিট অঙ্ক দেখতে{" "}
          <Link href={calculator} className={link}>
            ডিপিএস ক্যালকুলেটরে
          </Link>{" "}
          কিস্তি, হার, মেয়াদ ও কর দিন। এই লেখা শুধু হিসাব বোঝানোর জন্য, কোনো পণ্যের সুপারিশ বা বিনিয়োগ পরামর্শ নয়।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          {[...SOURCE_TAX_SOURCES, ...EXCISE_TABLE.sources].map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>{" "}
              ({publishedOn(source.published)})
            </li>
          ))}
          <li>
            সঞ্চয়পত্রের হার:{" "}
            <a href={IRD_RATE_ORDER.url} target="_blank" rel="noopener" className={link}>
              অভ্যন্তরীণ সম্পদ বিভাগের প্রজ্ঞাপন
            </a>{" "}
            (30 জুন 2025); উৎসে কর:{" "}
            <a href={SOURCE_TAX_RULES.standard.source.url} target="_blank" rel="noopener" className={link}>
              বাংলা ট্রিবিউন
            </a>{" "}
            (3 ফেব্রুয়ারি 2026)।
          </li>
        </ul>
        <p>
          কর ও আবগারির হার 28 অক্টোবর 2026-এ যাচাই করা। প্রতি বাজেটে এগুলো বদলাতে পারে, আর ব্যাংকের সুদের হার প্রায়ই
          বদলায়, তাই সর্বশেষ হার ব্যাংক থেকে জেনে নিন। ব্যাংক যা কাটে সেটিই চূড়ান্ত।
        </p>
      </ContentSection>
    </>
  );
}

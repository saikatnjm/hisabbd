import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { VAT_RATE_PRESETS } from "@/calculators/vat/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** VAT-inclusive prices at 15%: the wrong "15% of the total" vs the VAT actually inside. */
const MISTAKES: readonly [gross: string, wrong: string, right: string, net: string][] = [
  ["1,150", "172.50", "150", "1,000"],
  ["2,300", "345", "300", "2,000"],
  ["5,750", "862.50", "750", "5,000"],
  ["11,500", "1,725", "1,500", "10,000"],
];

/** Bangla guide: how VAT is added and removed (Server Component, no JS). */
export function VatCalculationGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("vat-calculator"));

  return (
    <>
      <ContentSection id="rate" title="ভ্যাট কী, আর হার কত">
        <p>
          ভ্যাট (মূল্য সংযোজন কর বা মূসক) হলো পণ্য বা সেবার দামের ওপর ধরা কর, যা ক্রেতা দেন আর বিক্রেতা সরকারকে
          জমা দেন। মূল্য সংযোজন কর ও সম্পূরক শুল্ক আইন, 2012 অনুযায়ী সাধারণ হার{" "}
          <strong>{VAT_RATE_PRESETS.standard.value}%</strong>। কিছু পণ্য ও সেবায় 10%, 7.5% বা 5%-এর মতো
          হ্রাসকৃত হারও আছে; কোনটিতে কোন হার, তা NBR-এর তালিকা বা ভ্যাট চালান থেকে জানতে হয়।
        </p>
        <p>
          হিসাবের প্রশ্ন সাধারণত দুটি: ভ্যাট ছাড়া দামের ওপর ভ্যাট <strong>যোগ</strong> করা, আর ভ্যাটসহ দামের ভেতর
          থেকে ভ্যাট <strong>বাদ</strong> দেওয়া। দুটির সূত্র আলাদা। দুটোই এক ক্লিকে করতে{" "}
          <Link href={calculator} className={link}>
            ভ্যাট ক্যালকুলেটর
          </Link>{" "}
          আছে; নিচে হাতে করার নিয়ম।
        </p>
      </ContentSection>

      <ContentSection id="add" title="দামের ওপর ভ্যাট যোগের নিয়ম">
        <p>
          <strong>ভ্যাট = ভ্যাট ছাড়া দাম × হার ÷ 100</strong>
        </p>
        <p>
          <strong>ভ্যাটসহ দাম = ভ্যাট ছাড়া দাম + ভ্যাট = ভ্যাট ছাড়া দাম × (1 + হার ÷ 100)</strong>
        </p>
        <ul>
          <li>৳1,000-এ 15%: 1,000 × 15 ÷ 100 = ৳150 ভ্যাট, ভ্যাটসহ দাম ৳1,150। এক ধাপে: 1,000 × 1.15।</li>
          <li>
            পয়সাসহ: ৳2,499.50 × 0.15 = 374.925, রাউন্ড করে ভ্যাট ৳374.93, ভ্যাটসহ দাম <strong>৳2,874.43</strong>।
          </li>
          <li>7.5% হারে ৳1,000: ভ্যাট ৳75, ভ্যাটসহ দাম ৳1,075।</li>
        </ul>
        <p>
          পয়সা কীভাবে রাউন্ড হয়: প্রথমে ভ্যাট নিকটতম পয়সায় রাউন্ড করুন (অর্ধেক হলে ওপরের দিকে), তারপর তা
          দামের সাথে যোগ করুন। তাহলে ভ্যাট ছাড়া দাম + ভ্যাট সবসময় ঠিক ভ্যাটসহ দামের সমান থাকে, রসিদের অঙ্কে এক
          পয়সাও গরমিল হয় না।
        </p>
      </ContentSection>

      <ContentSection id="remove" title="ভ্যাটসহ দাম থেকে ভ্যাট বাদের নিয়ম">
        <p>
          দামে ভ্যাট আগেই ধরা থাকলে (যেমন রসিদে “ভ্যাটসহ” লেখা), ভেতরের ভ্যাট বের করার সূত্র:
        </p>
        <p>
          <strong>ভ্যাট = ভ্যাটসহ দাম × হার ÷ (100 + হার)</strong>
        </p>
        <p>
          <strong>ভ্যাট ছাড়া দাম = ভ্যাটসহ দাম ÷ (1 + হার ÷ 100)</strong>
        </p>
        <ul>
          <li>৳1,150, 15%: 1,150 × 15 ÷ 115 = ৳150 ভ্যাট, তাই ভ্যাট ছাড়া দাম ৳1,000।</li>
          <li>
            ৳1,000, 15%: 1,000 × 15 ÷ 115 = 130.434…, রাউন্ড করে ভ্যাট ৳130.43, ভ্যাট ছাড়া দাম{" "}
            <strong>৳869.57</strong>।
          </li>
        </ul>
        <h3>মনে রাখার সহজ কৌশল</h3>
        <ul>
          <li>15%: 15 ÷ 115 = 3 ÷ 23, তাই ভ্যাট = ভ্যাটসহ দাম × 3 ÷ 23।</li>
          <li>10%: ভ্যাট = ভ্যাটসহ দাম ÷ 11 (৳5,500-এ ৳500)।</li>
          <li>7.5%: ভ্যাট = ভ্যাটসহ দাম × 3 ÷ 43 (৳4,300-এ ৳300)।</li>
          <li>5%: ভ্যাট = ভ্যাটসহ দাম ÷ 21 (৳2,100-এ ৳100)।</li>
        </ul>
        <h3>একটি রসিদ মেলানো</h3>
        <ol>
          <li>রসিদে মোট ৳3,450, লেখা “15% ভ্যাটসহ”।</li>
          <li>ভ্যাট = 3,450 × 3 ÷ 23 = ৳450।</li>
          <li>ভ্যাট ছাড়া দাম = 3,450 − 450 = ৳3,000।</li>
          <li>যাচাই: 3,000 × 1.15 = ৳3,450। মিলে গেছে, তাই হিসাব ঠিক।</li>
        </ol>
        <p>
          শেষ ধাপটিই সবচেয়ে কাজের: ভ্যাট ছাড়া দামকে (1 + হার ÷ 100) দিয়ে গুণ করে আবার মোট দাম পেলে বুঝবেন ভ্যাট
          ঠিকভাবে বাদ দিয়েছেন।
        </p>
      </ContentSection>

      <ContentSection id="common-mistake" title="সবচেয়ে সাধারণ ভুল: মোট দামের 15% ধরা">
        <p>
          ভ্যাট বাদ দিতে অনেকে ভ্যাটসহ দামের সরাসরি 15% নিয়ে নেন। এতে উত্তর বেশি আসে, কারণ 15% ধরা হয়েছিল ভ্যাট{" "}
          <em>ছাড়া</em> দামের ওপর, যা মোট দামের চেয়ে ছোট। ৳1,150-এর 15% হলো ৳172.50, অথচ ভেতরে ভ্যাট মাত্র ৳150;
          ৳172.50 বাদ দিলে থাকে ৳977.50, আসল ৳1,000 নয়।
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>ভ্যাটসহ দাম (৳)</th>
                <th scope="col" className={headNum}>ভুল: মোটের 15% (৳)</th>
                <th scope="col" className={headNum}>সঠিক ভ্যাট (৳)</th>
                <th scope="col" className={headNum}>ভ্যাট ছাড়া দাম (৳)</th>
              </tr>
            </thead>
            <tbody>
              {MISTAKES.map(([gross, wrong, right, net]) => (
                <tr key={gross}>
                  <th scope="row" className={`${cell} font-normal`}>{gross}</th>
                  <td className={num}>{wrong}</td>
                  <td className={num}>{right}</td>
                  <td className={num}>{net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          কারণটা সহজ: ভ্যাটসহ দাম হলো ভ্যাট ছাড়া দামের 115%। অর্থাৎ মোট দামকে 115 ভাগ ভাবলে তার 100 ভাগ আসল দাম
          আর 15 ভাগ ভ্যাট, তাই ভ্যাট মোটের 15/115 অংশ, 15/100 নয়। ভুল উত্তর সবসময় সঠিক ভ্যাটের চেয়ে 15% বেশি হয়। তাই মনে রাখুন: <strong>ভ্যাট বাদ দিতে 100 নয়, 115
          দিয়ে ভাগ করুন</strong> (অন্য হারে 100 + হার)।
        </p>
      </ContentSection>

      <ContentSection id="discount-profit" title="ছাড় ও লাভের হিসাবে ভ্যাট">
        <h3>ছাড়ের পর ভ্যাট</h3>
        <p>
          ৳2,500-এর শার্টে 20% ছাড় দিলে দাম ৳2,000, তার ওপর 15% ভ্যাট যোগে ৳2,300। দুটোই গুণ, তাই আগে ভ্যাট
          যোগ করে পরে ছাড় দিলেও একই ৳2,300 আসে। কিন্তু “20% ছাড় আর 15% ভ্যাট মানে মোট 5% ছাড়” ভেবে 2,500 ×
          0.95 = ৳2,375 ধরলে ভুল হয়। ছাড়ের অঙ্ক আলাদা করে দেখতে{" "}
          <Link href={localePath("bn", calculatorPath("discount-calculator"))} className={link}>
            ছাড় ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
        <h3>বিক্রেতার লাভ</h3>
        <p>
          ভ্যাটসহ দামে বিক্রি করলে ভেতরের ভ্যাট সরকারের প্রাপ্য, বিক্রেতার আয় নয়। ভ্যাট ছাড়া ৳800-এ কেনা পণ্য
          ভ্যাটসহ ৳1,150-এ বেচলে আয় ৳1,000, লাভ ৳200 (খরচের 25%), ৳350 নয়। এই হিসাব{" "}
          <Link href={localePath("bn", calculatorPath("profit-loss-calculator"))} className={link}>
            লাভ-ক্ষতি ক্যালকুলেটরে
          </Link>{" "}
          ভ্যাট ছাড়া দাম দিয়ে করুন। নিবন্ধিত ব্যবসায় উপকরণ কর রেয়াতের মতো বিষয় থাকে, যা হিসাবরক্ষকের কাছে জেনে
          নিন।
        </p>
      </ContentSection>

      <ContentSection id="limits" title="যা এই সহজ হিসাবে ধরা নেই">
        <p>
          ওপরের সূত্র শুধু একটি হারে ভ্যাট যোগ বা বাদ করে। কিছু পণ্যে এর বাইরেও বিষয় থাকে: সম্পূরক শুল্ক (SD),
          অগ্রিম কর, উৎসে ভ্যাট কর্তন, প্রতি একক নির্দিষ্ট ভ্যাট, কিংবা দামের বদলে ট্যারিফ বা সংকুচিত মূল্যের
          ওপর ভ্যাট। ছাপা দামে (MRP) ভ্যাট ধরা আছে কি না, তাও পণ্য ও NBR-এর নিয়মের ওপর নির্ভর করে। ব্যবসার
          ক্ষেত্রে NBR-এর নিয়ম ও নিজের হিসাবরক্ষকের পরামর্শ মানুন।
        </p>
        <p>
          দৈনন্দিন রসিদ মেলাতে আপনার অঙ্ক আর হার{" "}
          <Link href={calculator} className={link}>
            ভ্যাট ক্যালকুলেটরে
          </Link>{" "}
          দিন: ভ্যাট, দুই দাম আর আপনার সংখ্যাসহ সূত্র পয়সা পর্যন্ত দেখা যাবে।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <p>
          সাধারণ হার 15%:{" "}
          <a href={VAT_RATE_PRESETS.standard.source.url} target="_blank" rel="noopener" className={link}>
            NBR-এর ভ্যাট FAQ
          </a>
          । নির্দিষ্ট পণ্য ও সেবার হ্রাসকৃত হার (1.5%, 2%, 2.4%, 4.5%, 5%, 7.5% ও 10%):{" "}
          <a href={VAT_RATE_PRESETS.reduced10.source.url} target="_blank" rel="noopener" className={link}>
            PwC Worldwide Tax Summaries, Bangladesh
          </a>{" "}
          (সর্বশেষ পর্যালোচনা 31 জুলাই 2026)। দুটিই 28 অক্টোবর 2026-এ যাচাই করা। প্রতি বাজেটে হার বদলাতে পারে;
          NBR-এর বর্তমান নিয়মই চূড়ান্ত।
        </p>
      </ContentSection>
    </>
  );
}

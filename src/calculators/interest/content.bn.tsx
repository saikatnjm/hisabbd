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

/** ৳1,00,000 at 9% a year: amount at the end of each year (same figures as the logic tests). */
const YEARS: readonly [year: string, simple: string, compound: string][] = [
  ["1", "1,09,000", "1,09,000"],
  ["2", "1,18,000", "1,18,810"],
  ["3", "1,27,000", "1,29,502.90"],
  ["4", "1,36,000", "1,41,158.16"],
  ["5", "1,45,000", "1,53,862.40"],
];

/** Bangla explanatory content for the Simple and Compound Interest Calculator (Server Component, no JS). */
export function InterestCalculatorContentBn() {
  const bn = (slug: string) => localePath("bn", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="সরল ও চক্রবৃদ্ধি মুনাফার সূত্র">
        <p>পাঠ্যবইয়ের সংকেতে: P = আসল, r = বার্ষিক মুনাফার হার (দশমিকে, যেমন 10% = 0.10), n = বছর।</p>
        <ul>
          <li>
            <strong>সরল মুনাফা I = Pnr</strong>, আর মুনাফা-আসল A = P + I = P(1 + nr)।
          </li>
          <li>
            <strong>চক্রবৃদ্ধি মূলধন C = P(1 + r)ⁿ</strong>, আর চক্রবৃদ্ধি মুনাফা = C − P।
          </li>
        </ul>
        <h3>পাঠ্যবইয়ের মতো একটি উদাহরণ</h3>
        <p>৳200-এর 10% হারে 3 বছরে:</p>
        <ol>
          <li>সরল মুনাফা = 200 × 3 × 0.10 = ৳60; মুনাফা-আসল ৳260।</li>
          <li>চক্রবৃদ্ধি মূলধন = 200 × (1.10)³ = 200 × 1.331 = ৳266.20; চক্রবৃদ্ধি মুনাফা ৳66.20।</li>
          <li>পার্থক্য ৳66.20 − ৳60 = ৳6.20। দ্বিতীয় বছর থেকে আগের মুনাফার ওপরও মুনাফা হয় বলে এই পার্থক্য।</li>
        </ol>
      </ContentSection>

      <ContentSection id="lakh-example" title="উদাহরণ: ৳1,00,000, 9% হারে 5 বছর">
        <p>প্রতি বছর শেষে মুনাফা-আসল, সরল আর বার্ষিক চক্রবৃদ্ধিতে:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>বছর</th>
                <th scope="col" className={headNum}>সরল (৳)</th>
                <th scope="col" className={headNum}>চক্রবৃদ্ধি (৳)</th>
              </tr>
            </thead>
            <tbody>
              {YEARS.map(([year, simple, compound]) => (
                <tr key={year}>
                  <td className={cell}>{year}</td>
                  <td className={num}>{simple}</td>
                  <td className={num}>{compound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          5 বছরে সরল মুনাফা ৳45,000, চক্রবৃদ্ধি মুনাফা ৳53,862.40: পার্থক্য ৳8,862.40। প্রথম বছরে দুটো সমান; এরপর পার্থক্য
          প্রতি বছর বাড়তে থাকে।
        </p>
      </ContentSection>

      <ContentSection id="compounding" title="বছরে কয়বার চক্রবৃদ্ধি হয়, তাতে কী বদলায়">
        <p>
          বছরে m বার চক্রবৃদ্ধি হলে <strong>C = P(1 + r/m)^(m × n)</strong>। একই ৳1,00,000, 9% হারে 5 বছরে চক্রবৃদ্ধি
          মুনাফা:
        </p>
        <ul>
          <li>বার্ষিক (m = 1): ৳53,862.40</li>
          <li>ষাণ্মাসিক (m = 2): ৳55,296.94</li>
          <li>ত্রৈমাসিক (m = 4): ৳56,050.92</li>
          <li>মাসিক (m = 12): ৳56,568.10</li>
        </ul>
        <p>
          যত ঘন ঘন চক্রবৃদ্ধি, মুনাফা তত বেশি। মাসিক 9% হার বছরে কার্যত প্রায় 9.38%-এর সমান; ক্যালকুলেটর এটি “কার্যকর
          বার্ষিক হার” হিসেবে দেখায়।
        </p>
      </ContentSection>

      <ContentSection id="unknowns" title="হার, সময় বা আসল অজানা হলে">
        <p>সরল মুনাফার সূত্র ঘুরিয়ে লিখলেই অজানা রাশি বের হয়:</p>
        <ul>
          <li>হার r = I ÷ (P × n), যেমন ৳200-এ 3 বছরে ৳60 মুনাফা হলে r = 60 ÷ 600 = 0.10, অর্থাৎ 10%।</li>
          <li>সময় n = I ÷ (P × r)।</li>
          <li>আসল P = I ÷ (n × r)।</li>
        </ul>
        <p>
          শতাংশ থেকে দশমিকে বদলানোর জন্য{" "}
          <Link href={bn("percentage-calculator")} className={link}>
            শতকরা ক্যালকুলেটর
          </Link>{" "}
          কাজে লাগবে।
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="যে ভুলগুলো প্রায়ই হয়">
        <ul>
          <li>
            <strong>হার শতাংশে রেখেই গুণ করা।</strong> সূত্রে r দশমিকে: 9% মানে 0.09, 9 নয়। ক্যালকুলেটরে শুধু 9 লিখুন।
          </li>
          <li>
            <strong>মাসকে বছরে না বদলানো।</strong> 18 মাস = 1.5 বছর; সময়ের ঘরে 1.5 লিখুন।
          </li>
          <li>
            <strong>চক্রবৃদ্ধিতে মুনাফা প্রতি বছর একই ধরা।</strong> চক্রবৃদ্ধিতে প্রতি বছরের মুনাফা আগের বছরের চেয়ে বেশি।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="banks" title="ব্যাংকের এফডিআর, ডিপিএস আর ঋণ">
        <p>
          ব্যাংক নিজের হার আর চক্রবৃদ্ধির নিয়ম ঠিক করে, আর মুনাফা থেকে উৎসে কর কাটে। করসহ হিসাবের জন্য{" "}
          <Link href={bn("fdr-calculator")} className={link}>
            এফডিআর ক্যালকুলেটর
          </Link>{" "}
          ও{" "}
          <Link href={bn("dps-calculator")} className={link}>
            ডিপিএস ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন। ঋণের মাসিক কিস্তি জানতে{" "}
          <Link href={bn("emi-calculator")} className={link}>
            ইএমআই ক্যালকুলেটর
          </Link>{" "}
          দেখুন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>আসল টাকার পরিমাণ লিখুন। বাংলা অঙ্ক আর 1,00,000 লেখার ধরন দুটোই চলে।</li>
          <li>বার্ষিক মুনাফার হার শতাংশে লিখুন, যেমন 9।</li>
          <li>সময় বছরে লিখুন; ভগ্নাংশও চলে, যেমন 2.5।</li>
          <li>চক্রবৃদ্ধি কতবার হয় বেছে নিন; পাঠ্যবইয়ের অঙ্কে “বার্ষিক”।</li>
          <li>“মুনাফা হিসাব করুন” চাপলে সরল ও চক্রবৃদ্ধি মুনাফা, মুনাফা-আসল, পার্থক্য আর বছরওয়ারি টেবিল দেখা যাবে।</li>
        </ol>
      </ContentSection>
    </>
  );
}

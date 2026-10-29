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

/** Stacked discounts on ৳1,000: what people expect (the sum) vs the real total discount. */
const STACKED: readonly [offer: string, expected: string, pay: string, real: string][] = [
  ["20% + 10%", "30%", "720", "28%"],
  ["10% + 20%", "30%", "720", "28%"],
  ["30% + 20%", "50%", "560", "44%"],
  ["50% + 50%", "100%", "250", "75%"],
];

/** Bangla guide: how a discount is worked out, and why stacked discounts don't add up (Server Component, no JS). */
export function DiscountCalculationGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("discount-calculator"));

  return (
    <>
      <ContentSection id="price-after-discount" title="ছাড়ের পর দাম বের করার সূত্র">
        <p>
          দোকানে “20% ছাড়” বা “20 percent off” লেখা মানে আসল দামের প্রতি ৳100-এ ৳20 কম দিতে হবে। হিসাবের সূত্র দুটি:
        </p>
        <p>
          <strong>সাশ্রয় = আসল দাম × ছাড় ÷ 100</strong>
        </p>
        <p>
          <strong>ছাড়ের পর দাম = আসল দাম × (1 − ছাড় ÷ 100)</strong>
        </p>
        <ul>
          <li>
            ৳2,500-এর শার্টে 20% ছাড়: সাশ্রয় 2,500 × 20 ÷ 100 = ৳500, দাম 2,500 × 0.80 ={" "}
            <strong>৳2,000</strong>।
          </li>
          <li>
            ৳1,000-এ 20% ছাড়: 1,000 × 0.80 = <strong>৳800</strong>, সাশ্রয় ৳200।
          </li>
        </ul>
        <p>
          দ্বিতীয় সূত্রটাই বেশি কাজের: 20% ছাড় মানে আপনি দাম দিচ্ছেন 80%, তাই সরাসরি 0.80 দিয়ে গুণ করলেই চলে। 15% ছাড়ে
          0.85, 25%-এ 0.75, 40%-এ 0.60। দাম আর শতাংশ দিলে{" "}
          <Link href={calculator} className={link}>
            ছাড় ক্যালকুলেটর
          </Link>{" "}
          চূড়ান্ত দাম আর সাশ্রয় দুটোই একসাথে দেখায়।
        </p>
      </ContentSection>

      <ContentSection id="paisa" title="কত টাকা বাঁচল, আর পয়সার হিসাব">
        <p>
          দাম পুরো টাকায় না মিললে পয়সা আসে। ৳999-এর জিনিসে 15% ছাড়: 999 × 0.85 = <strong>৳849.15</strong>, আর সাশ্রয়
          999 − 849.15 = <strong>৳149.85</strong>। দুটো যোগ করলে আবার ঠিক ৳999 হয়, এটাই হিসাব মেলানোর সহজ উপায়।
        </p>
        <p>
          অঙ্ক রাউন্ড করার সময় নিকটতম পয়সায় নিন (অর্ধেক হলে ওপরের দিকে)। আগে চূড়ান্ত দাম রাউন্ড করে তারপর আসল দাম থেকে বাদ
          দিয়ে সাশ্রয় বের করুন, তাহলে রসিদে এক পয়সাও গরমিল থাকবে না।
        </p>
        <h3>মাথায় দ্রুত হিসাব</h3>
        <ul>
          <li>10% মানে 10 দিয়ে ভাগ: ৳2,500-এর 10% = ৳250।</li>
          <li>20% মানে তার দ্বিগুণ: ৳500। 5% মানে অর্ধেক: ৳125।</li>
          <li>তাই 15% = 250 + 125 = ৳375, আর 25% = 500 + 125 = ৳625।</li>
        </ul>
        <p>
          একই কৌশলে ৳1,800-এ 30% ছাড়: 10% = ৳180, তাই 30% = ৳540, আর দাম 1,800 − 540 = ৳1,260। দোকানের মেশিনে বা
          ক্যালকুলেটরে মেলানোর আগে মাথায় এমন একটা আন্দাজ থাকলে বড় ভুল সহজে চোখে পড়ে।
        </p>
      </ContentSection>

      <ContentSection id="stacked" title="20% + 10% ছাড় কেন 30% নয়">
        <p>
          অনেক অফারে লেখা থাকে “20% ছাড়, সাথে কার্ডে আরও 10%”। দ্বিতীয় ছাড়টি ধরা হয় <em>আগে থেকেই কমে আসা</em> দামের
          ওপর, আসল দামের ওপর নয়:
        </p>
        <ol>
          <li>৳1,000-এ 20% ছাড়: দাম ৳800।</li>
          <li>এবার ৳800-এর 10% = ৳80, ৳100 নয়।</li>
          <li>আপনি দেন 800 − 80 = <strong>৳720</strong>, সাশ্রয় ৳280, অর্থাৎ মোট ছাড় <strong>28%</strong>।</li>
        </ol>
        <p>
          <strong>চূড়ান্ত দাম = আসল দাম × (1 − প্রথম ÷ 100) × (1 − দ্বিতীয় ÷ 100)</strong>
        </p>
        <p>
          <strong>মোট ছাড় % = 100 − (100 − প্রথম) × (100 − দ্বিতীয়) ÷ 100</strong>
        </p>
        <p>20% আর 10%-এ: 100 − 80 × 90 ÷ 100 = 100 − 72 = 28%। ৳1,000-এ কয়েকটি অফার পাশাপাশি:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>অফার</th>
                <th scope="col" className={headNum}>মনে হয়</th>
                <th scope="col" className={headNum}>দিতে হয় (৳)</th>
                <th scope="col" className={headNum}>আসল ছাড়</th>
              </tr>
            </thead>
            <tbody>
              {STACKED.map(([offer, expected, pay, real]) => (
                <tr key={offer}>
                  <th scope="row" className={`${cell} font-normal`}>{offer}</th>
                  <td className={num}>{expected}</td>
                  <td className={num}>{pay}</td>
                  <td className={num}>{real}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          দুটি ছাড়ের ক্রমে কিছু যায় আসে না, কারণ দুটোই গুণ: 10% তারপর 20% ধরলেও সেই ৳720। আর দুটি 50% ছাড় মিলে কখনো
          “ফ্রি” হয় না: ৳400-এর জিনিস 50% + 50% ছাড়ে ৳100, মোট ছাড় 75%।{" "}
          <Link href={calculator} className={link}>
            ছাড় ক্যালকুলেটরে
          </Link>{" "}
          “অতিরিক্ত ছাড় যোগ করুন” চালু করলে আসল মোট শতাংশ আর যোগফলের পার্থক্য দুটোই দেখা যায়।
        </p>
        <p>
          তাই এক দোকানে সরাসরি 30% ছাড় আর আরেক দোকানে 20% + 10% থাকলে, দাম সমান হলে প্রথমটিতেই খরচ কম: ৳1,000-এ ৳700
          বনাম ৳720।
        </p>
      </ContentSection>

      <ContentSection id="offers" title="অন্য অফারগুলো শতাংশে কত: এক কিনলে এক ফ্রি, ক্যাশব্যাক">
        <p>সব অফার “% ছাড়” লিখে আসে না। শতাংশে বদলে নিলে কোনটা আসলে কত সস্তা, তা মেলানো সহজ হয়:</p>
        <ul>
          <li>
            <strong>এক কিনলে এক ফ্রি:</strong> দুটি জিনিস পান একটির দামে, তাই প্রতিটিতে 50% ছাড়। তবে এটা লাভ শুধু তখনই,
            যখন দুটোই আপনার দরকার।
          </li>
          <li>
            <strong>দুটি কিনলে একটি ফ্রি:</strong> তিনটি পান দুটির দামে। ৳300 করে হলে ৳900-এর জিনিস ৳600-এ, অর্থাৎ ছাড়
            300 ÷ 900 × 100 = প্রায় <strong>33.33%</strong>, 50% নয়।
          </li>
          <li>
            <strong>সর্বোচ্চ সীমাসহ ক্যাশব্যাক:</strong> “10% ক্যাশব্যাক, সর্বোচ্চ ৳150” অফারে ৳2,500 খরচ করলে 10% হিসাবে
            ৳250 হতো, কিন্তু পাবেন ৳150, যা আসলে 150 ÷ 2,500 × 100 = <strong>6%</strong>। ক্যাশব্যাক সাধারণত পরে
            অ্যাকাউন্টে আসে, দোকানের দাম কমায় না।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="vat" title="ছাড়ের সাথে ভ্যাট">
        <p>
          রসিদে ছাড় আর ভ্যাট দুটোই থাকলে দুটোকে আলাদা গুণ হিসেবে ধরুন। ৳2,500-এর শার্টে 20% ছাড়ে ৳2,000, তার ওপর 15%
          ভ্যাটে ৳2,300। আগে ভ্যাট পরে ছাড় ধরলেও একই ৳2,300। কিন্তু “20% ছাড় আর 15% ভ্যাট মানে মোট 5% ছাড়” ভেবে 2,500 ×
          0.95 = ৳2,375 ধরা ভুল। ভ্যাটের অংশ আলাদা করে দেখতে{" "}
          <Link href={localePath("bn", calculatorPath("vat-calculator"))} className={link}>
            ভ্যাট ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="original-price" title="ছাড়ের দাম থেকে আসল দাম">
        <p>
          ট্যাগে শুধু ছাড়ের পরের দাম লেখা থাকলে উল্টো হিসাব করতে হয়। 20% ছাড়ের পরের দাম আসল দামের 80%, তাই:
        </p>
        <p>
          <strong>আসল দাম = ছাড়ের পর দাম ÷ (1 − ছাড় ÷ 100)</strong>
        </p>
        <p>
          ৳2,000 যদি 20% ছাড়ের পরের দাম হয়, আসল দাম 2,000 ÷ 0.80 = <strong>৳2,500</strong>। এই উল্টো হিসাবটা{" "}
          <Link href={localePath("bn", calculatorPath("percentage-calculator"))} className={link}>
            শতকরা ক্যালকুলেটরের
          </Link>{" "}
          “পূর্ণ সংখ্যা খোঁজা” অপশনে করা যায়: 2,000 হলো কোন সংখ্যার 80%?
        </p>
        <p>
          যাচাই করতে উল্টো দিকে গুণ করুন: 2,500 × 0.80 = ৳2,000। মিলে গেলে বুঝবেন আসল দাম ঠিক বের করেছেন। দোকানের ট্যাগে
          আগের দাম কেটে নতুন দাম লেখা থাকলে এই একই যাচাইয়ে দেখা যায়, বলা ছাড়ের হার আর আসল ছাড় মিলছে কি না।
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="ছাড় হিসাবের সাধারণ ভুল">
        <ul>
          <li>
            <strong>দুটি ছাড় যোগ করে ফেলা।</strong> 20% + 10% = 28%, 30% নয়; দ্বিতীয়টি কমে আসা দামের ওপর ধরা হয়।
          </li>
          <li>
            <strong>আসল দাম বের করতে শতাংশ আবার যোগ করা।</strong> ৳2,000-এ 20% যোগ করলে ৳2,400 আসে, ৳2,500 নয়। কারণ
            20% ছাড় ধরা হয়েছিল বড় দামের ওপর; উল্টো হিসাবে 0.80 দিয়ে ভাগ করতে হয়।
          </li>
          <li>
            <strong>ছাড় আর ভ্যাট কাটাকাটি করা।</strong> 20% ছাড় আর 15% ভ্যাট মানে 5% ছাড় নয়; দুটো আলাদা করে গুণ করুন।
          </li>
          <li>
            <strong>“৳500 ছাড়” আর “20% ছাড়” না মিলিয়ে বেছে নেওয়া।</strong> নির্দিষ্ট টাকার ছাড় দামের ওপর নির্ভর করে না।
            ৳2,500-এ দুটো সমান, এর চেয়ে বেশি দামে 20% ভালো, কম দামে ৳500 ভালো।
          </li>
          <li>
            <strong>“সর্বোচ্চ 50% ছাড়” মানে সব পণ্যে 50% ধরা।</strong> সাধারণত কয়েকটি পণ্যেই সর্বোচ্চ ছাড় থাকে; নিজের
            জিনিসের ট্যাগে আসল হারটি দেখে হিসাব করুন।
          </li>
        </ul>
        <p>
          দোকানে দাঁড়িয়ে দ্রুত মিলিয়ে নিতে দাম আর শতাংশ{" "}
          <Link href={calculator} className={link}>
            ছাড় ক্যালকুলেটরে
          </Link>{" "}
          দিন। সব হিসাব আপনার ফোনেই হয়, কোনো তথ্য কোথাও পাঠানো হয় না।
        </p>
      </ContentSection>
    </>
  );
}

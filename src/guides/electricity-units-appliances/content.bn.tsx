import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { LT_A_RATES, SLAB_IDS, VAT_PERCENT, type SlabId } from "@/calculators/electricity/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { APPLIANCE_EXAMPLES, DAYS_PER_MONTH, monthlyUnits } from "./examples";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

const APPLIANCE_NAMES: Record<(typeof APPLIANCE_EXAMPLES)[number]["id"], string> = {
  led: "এলইডি বাল্ব",
  fan: "সিলিং ফ্যান",
  tv: "টিভি",
  "rice-cooker": "রাইস কুকার",
  ac: "এসি",
};

const SLAB_RANGES: Record<SlabId, string> = {
  step1: "1–75",
  step2: "76–200",
  step3: "201–300",
  step4: "301–400",
  step5: "401–600",
  step6: "600-এর ওপরে",
};

/** ৳ for one more unit in a slab, VAT included. */
function perUnitWithVat(id: SlabId): string {
  return formatNumber(roundTo(LT_A_RATES[id].value * (1 + VAT_PERCENT.value / 100), 2), { decimals: 2, minDecimals: 2 });
}

/** Bangla guide: appliance units from watts and hours, and what they add to a bill (Server Component, no JS). */
export function ElectricityUnitsAppliancesGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("electricity-bill-calculator"));

  return (
    <>
      <ContentSection id="unit" title="1 ইউনিট বিদ্যুৎ মানে কী">
        <p>
          বিলের 1 ইউনিট হলো 1 কিলোওয়াট-ঘণ্টা (kWh): 1,000 ওয়াটের কোনো যন্ত্র টানা এক ঘণ্টা চললে যতটা বিদ্যুৎ লাগে।
          তাই যেকোনো যন্ত্রের খরচ বের করার সূত্র একটাই:
        </p>
        <p>
          <strong>ইউনিট = ওয়াট × চালানোর ঘণ্টা ÷ 1,000</strong>
        </p>
        <p>
          মাসের হিসাবে দিনের ইউনিটকে দিনের সংখ্যা দিয়ে গুণ করুন। এখানে আমরা মাস ধরছি {DAYS_PER_MONTH} দিন। যেমন 75
          ওয়াটের ফ্যান দিনে 10 ঘণ্টা চললে দিনে 75 × 10 ÷ 1,000 = 0.75 ইউনিট, মাসে 0.75 × 30 = 22.5 ইউনিট।
        </p>
      </ContentSection>

      <ContentSection id="watts" title="যন্ত্রের ওয়াট কোথায় পাবেন">
        <p>
          যন্ত্রের গায়ের লেবেলে বা ম্যানুয়ালে “Rated power” বা “Power input” লেখা ওয়াটের সংখ্যাটি নিন। এসির ক্ষেত্রে
          কুলিং ক্ষমতা (BTU বা টন) নয়, ইনপুট পাওয়ার (ওয়াট) দেখুন।
        </p>
        <p>
          লেবেলের ওয়াট হলো যন্ত্র পুরোদমে চললে কত টানে। এসি আর ফ্রিজের কম্প্রেসর ঘর বা ভেতরটা ঠান্ডা হয়ে গেলে
          থেমে থেমে চলে, আর ইনভার্টার এসি তখন কম টানে। তাই এই সূত্রে পাওয়া ইউনিট সর্বোচ্চ সীমা; আসল খরচ সাধারণত
          কম। ফ্রিজের লেবেলে বছরে কত kWh লেখা থাকলে সেটিকে 12 দিয়ে ভাগ করলেই মাসের ইউনিট পাবেন।
        </p>
      </ContentSection>

      <ContentSection id="examples" title="কোন যন্ত্রে মাসে কত ইউনিট: উদাহরণ">
        <p>নিচের ওয়াট শুধু উদাহরণ; হিসাবের আগে আপনার যন্ত্রের লেবেল দেখে নিন।</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>যন্ত্র</th>
                <th scope="col" className={headNum}>ওয়াট</th>
                <th scope="col" className={headNum}>দিনে ঘণ্টা</th>
                <th scope="col" className={headNum}>মাসে ইউনিট</th>
              </tr>
            </thead>
            <tbody>
              {APPLIANCE_EXAMPLES.map((a) => (
                <tr key={a.id}>
                  <td className={cell}>{APPLIANCE_NAMES[a.id]}</td>
                  <td className={num}>{formatNumber(a.watts)}</td>
                  <td className={num}>{formatNumber(a.hoursPerDay)}</td>
                  <td className={num}>{formatNumber(monthlyUnits(a.watts, a.hoursPerDay))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          খেয়াল করুন, একটি এসি একাই বাকি সব যন্ত্রের কয়েক গুণ ইউনিট নিতে পারে। বাল্ব বা ফ্যান কম চালিয়ে যা বাঁচে, এসি
          এক ঘণ্টা কম চালালে তার চেয়ে অনেক বেশি বাঁচে।
        </p>
      </ContentSection>

      <ContentSection id="bill" title="বিলে কত টাকা যোগ হয়: বাড়তি ইউনিট পড়ে ওপরের ধাপে">
        <p>
          বাসার বিদ্যুতের দাম ধাপে ধাপে বাড়ে। নতুন যন্ত্রের ইউনিট বিলে যোগ হয় আপনার আগের ব্যবহারের ওপরে, তাই সেগুলোর
          দাম ধরা হয় ওপরের ধাপের হারে, গড় হারে নয়। জুন 2026 বিল মাস থেকে বিইআরসির হারে প্রতিটি বাড়তি
          ইউনিটের দাম, {VAT_PERCENT.value}% ভ্যাটসহ:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>মাসে মোট ইউনিট</th>
                <th scope="col" className={headNum}>প্রতি ইউনিট (৳)</th>
                <th scope="col" className={headNum}>ভ্যাটসহ (৳)</th>
              </tr>
            </thead>
            <tbody>
              {SLAB_IDS.map((id) => (
                <tr key={id}>
                  <td className={cell}>{SLAB_RANGES[id]}</td>
                  <td className={num}>{formatNumber(LT_A_RATES[id].value, { decimals: 2, minDecimals: 2 })}</td>
                  <td className={num}>{perUnitWithVat(id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>উদাহরণ: 150 ইউনিটের বাসায় একটি এসি</h3>
        <p>
          একটি বাসায় এসি ছাড়া মাসে 150 ইউনিট লাগে (2 কিলোওয়াট অনুমোদিত লোড, সিঙ্গেল ফেজ, পোস্টপেইড মিটার, ৳40
          মিটার ভাড়া, 5% ভ্যাট)। বিল ৳1,213.80। এবার 1,500 ওয়াটের এসি দিনে 8 ঘণ্টা চললে আরও 360 ইউনিট, মোট 510
          ইউনিট, আর বিল দাঁড়ায় <strong>৳5,359.31</strong>।
        </p>
        <p>
          অর্থাৎ এসির জন্য বাড়তি ৳4,145.51, ইউনিটপ্রতি প্রায় ৳11.52। এর কারণ এসির ইউনিটগুলো পড়েছে 151 থেকে 510
          পর্যন্ত, যার একটা বড় অংশ 401–600 ধাপে, যেখানে প্রতি ইউনিট ৳15.01। একই এসি কম ব্যবহারের বাসায় চালালে
          ইউনিটপ্রতি খরচ কম পড়ত।
        </p>
        <h3>উদাহরণ: লাইফলাইনের বাসায় একটি ফ্যান</h3>
        <p>
          যে বাসায় মাসে 40 ইউনিট লাগে, তার পুরো ব্যবহার লাইফলাইন হারে (৳4.63), বিল ৳324.66। এখানে 22.5 ইউনিটের একটি
          ফ্যান যোগ হলে মোট 62.5 ইউনিট; 50 ছাড়িয়ে যাওয়ায় পুরো মাস চলে যায় সাধারণ ধাপে, আর বিল হয় ৳475.39। ফ্যানের
          22.5 ইউনিটে বাড়তি ৳150.73। লাইফলাইনের সীমায় এক ইউনিটও গুরুত্বপূর্ণ: 50 ইউনিটে বিল ৳373.28, 51 ইউনিটে
          ৳411.87।
        </p>
      </ContentSection>

      <ContentSection id="save" title="কোথায় কমালে বিল সবচেয়ে বেশি কমে">
        <ul>
          <li>
            <strong>মাসের ব্যবহার 400 ইউনিটের ওপরে গেলে</strong> ওপরের প্রতিটি ইউনিটের দাম ভ্যাটসহ প্রায় ৳
            {perUnitWithVat("step5")}, 600-এর ওপরে ৳{perUnitWithVat("step6")}। এখানে কমানো প্রতিটি ইউনিট প্রথম ধাপের
            একটি ইউনিটের (৳{perUnitWithVat("step1")}) প্রায় তিন গুণ টাকা বাঁচায়।
          </li>
          <li>
            <strong>বড় যন্ত্রের ঘণ্টা কমান।</strong> 1,500 ওয়াটের এসি এক ঘণ্টা কম চালালে দিনে 1.5 ইউনিট, মাসে 45 ইউনিট
            কম।
          </li>
          <li>
            <strong>লাইফলাইনের কাছাকাছি থাকলে 50 ইউনিটের নিচে থাকার চেষ্টা করুন</strong>, কারণ 51 ইউনিট হলেই সব ইউনিট
            বেশি দামে ধরা হয়।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="steps" title="নিজের বিলে এক মিনিটে হিসাব">
        <ol>
          <li>যন্ত্রের লেবেল থেকে ওয়াট নিন, আর দিনে কত ঘণ্টা চলে তা ঠিক করুন।</li>
          <li>ইউনিট = ওয়াট × ঘণ্টা ÷ 1,000 × 30 দিয়ে মাসের ইউনিট বের করুন।</li>
          <li>
            <Link href={calculator} className={link}>
              বিদ্যুৎ বিল ক্যালকুলেটরে
            </Link>{" "}
            আগে আপনার স্বাভাবিক মাসের ইউনিট দিন, তারপর সেই ইউনিটের সঙ্গে যন্ত্রের ইউনিট যোগ করে আবার হিসাব করুন। দুই
            বিলের পার্থক্যই যন্ত্রটির আসল খরচ।
          </li>
        </ol>
        <p>
          ক্যালকুলেটরে বিইআরসির হার, ডিমান্ড চার্জ, মিটার ভাড়া আর ভ্যাট তারিখ ও সূত্রসহ আগে থেকে বসানো থাকে, আর আপনার
          কোম্পানির বিলের সঙ্গে না মিললে প্রতিটি অঙ্ক বদলানো যায়। আপনার দেওয়া সংখ্যা এই ডিভাইসের বাইরে কোথাও যায়
          না।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র ও তারিখ">
        <p>
          বিদ্যুতের হার বিইআরসির 3 জুন 2026-এর আদেশ ও 4 জুন 2026-এর সংশোধন থেকে নেওয়া, 29 অক্টোবর 2026-এ যাচাই করা।
          5% ভ্যাট আর ৳40 মিটার ভাড়া প্রকাশিত প্রতিবেদন থেকে; বিস্তারিত সূত্রের তালিকা{" "}
          <Link href={`${calculator}#sources-heading`} className={link}>
            ক্যালকুলেটরের পাতায়
          </Link>{" "}
          আছে। যন্ত্রের ওয়াট শুধু উদাহরণ, কোনো নির্দিষ্ট ব্র্যান্ড বা মডেলের নয়।
        </p>
      </ContentSection>
    </>
  );
}

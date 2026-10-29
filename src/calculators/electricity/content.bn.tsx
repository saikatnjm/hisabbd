import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import {
  AMAR_DESH_METER_RENT,
  BERC_CONDITIONS,
  BERC_LIFELINE_REVISION,
  BERC_NOTIFICATIONS_PAGE,
  BERC_RETAIL_ORDER,
  DAILY_STAR_SLAB_EXAMPLE,
  DAILY_STAR_SLABS_KEPT,
  DPDC_TARIFF_PAGE,
  LT_A_RATES,
  RATE_IDS,
  TBS_DPDC_METER_CHARGES,
  type RateId,
  type TariffSource,
} from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const cell = "px-3 py-2";

const SLAB_NAMES: Record<RateId, [string, string]> = {
  lifeline: ["লাইফলাইন", "মাসে মোট 0–50 ইউনিট"],
  step1: ["প্রথম ধাপ", "0–75 ইউনিট"],
  step2: ["দ্বিতীয় ধাপ", "76–200 ইউনিট"],
  step3: ["তৃতীয় ধাপ", "201–300 ইউনিট"],
  step4: ["চতুর্থ ধাপ", "301–400 ইউনিট"],
  step5: ["পঞ্চম ধাপ", "401–600 ইউনিট"],
  step6: ["ষষ্ঠ ধাপ", "600 ইউনিটের ওপরে"],
};

/** Source titles are kept in the source's own language (English), with a Bangla label before them. */
function SourceLink({ source }: { source: TariffSource }) {
  return (
    <a href={source.url} target="_blank" rel="noopener" className={link} lang="en">
      {source.title}
    </a>
  );
}

/** Bangla explanatory content for the Electricity Bill Calculator page (Server Component, no JS). */
export function ElectricityCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="বিদ্যুৎ বিল যেভাবে হিসাব হয়">
        <p>বাংলাদেশে বাসার বিদ্যুৎ বিলের চারটি অংশ:</p>
        <p>
          <strong>বিল = এনার্জি চার্জ (ধাপে ধাপে) + ডিমান্ড চার্জ + মিটার ভাড়া + ভ্যাট − প্রিপেইড রিবেট</strong>
        </p>
        <ul>
          <li>
            <strong>এনার্জি চার্জ:</strong> যত ইউনিট (কিলোওয়াট-ঘণ্টা) ব্যবহার করেছেন, ধাপে ধাপে দাম। প্রতিটি হার শুধু
            সেই ধাপের ভেতরের ইউনিটে বসে: প্রথম 75 ইউনিট এক হারে, পরের 125 ইউনিট পরের হারে, এভাবে।
          </li>
          <li>
            <strong>ডিমান্ড চার্জ:</strong> অনুমোদিত লোড (কিলোওয়াট) × মাসে ৳42 — ব্যবহার যা-ই হোক।
          </li>
          <li>
            <strong>মিটার ভাড়া:</strong> কোম্পানির দেওয়া মিটারের নির্দিষ্ট মাসিক ভাড়া।
          </li>
          <li>
            ওপরের সবকিছুর ওপর <strong>ভ্যাট</strong>, আর প্রিপেইড মিটারে <strong>0.5% রিবেট</strong>।
          </li>
        </ul>

        <h3>উদাহরণ: 200 ইউনিট, 2 কিলোওয়াট, সিঙ্গেল ফেজ, পোস্টপেইড</h3>
        <ol>
          <li>প্রথম ধাপ: 75 ইউনিট × ৳5.26 = ৳394.50</li>
          <li>দ্বিতীয় ধাপ: বাকি 125 ইউনিট × ৳8.50 = ৳1,062.50</li>
          <li>এনার্জি চার্জ: ৳394.50 + ৳1,062.50 = ৳1,457</li>
          <li>ডিমান্ড চার্জ: 2 কিলোওয়াট × ৳42 = ৳84; মিটার ভাড়া ৳40; ভ্যাটের আগে বিল ৳1,581</li>
          <li>5% ভ্যাট: ৳1,581 × 5 ÷ 100 = ৳79.05</li>
          <li>
            <strong>মোট: ৳1,660.05</strong>, সবসহ ইউনিটপ্রতি প্রায় ৳8.30
          </li>
        </ol>
        <p>
          প্রিপেইড মিটারে একই মাসে ভ্যাটের আগের ৳1,581-এর ওপর 0.5% রিবেট (৳7.91) পাবেন, তাই মোট{" "}
          <strong>৳1,652.14</strong>। 350 ইউনিটে এনার্জি চার্জ ৳394.50 + ৳1,062.50 + 100 × ৳9.10 + 50 × ৳9.62 =
          ৳2,848; 700 ইউনিটে ৳8,066।
        </p>
        <p>
          200 ইউনিট ব্যবহার করলে সব 200 ইউনিটে ৳8.50 বসে না: দ্য ডেইলি স্টারের 200 ইউনিটের হিসাবে প্রথম 75 ইউনিট
          কম হারে আর শুধু বাকি 125 ইউনিট বেশি হারে ধরা হয়েছে, আর জুন 2026-এ বিইআরসি এই ধাপের সুবিধা তুলে দেওয়ার
          প্রস্তাব নাকচ করেছে।
        </p>
      </ContentSection>

      <ContentSection id="rates" title="ইউনিট প্রতি বিদ্যুতের দাম 2026 (বিইআরসির আবাসিক ট্যারিফ)">
        <p>
          বাংলাদেশ এনার্জি রেগুলেটরী কমিশন (বিইআরসি) <strong>জুন 2026 বিল মাস থেকে</strong> নিম্নচাপের আবাসিক
          (এলটি-এ) গ্রাহকদের জন্য এই হার ঠিক করেছে — বিউবো, পল্লী বিদ্যুৎ, ডিপিডিসি, ডেসকো, ওজোপাডিকো ও নেসকো সবার
          জন্য। হার প্রতি ইউনিটে, ভ্যাট ছাড়া।
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <caption className="sr-only">জুন 2026 থেকে বিইআরসির আবাসিক (এলটি-এ) বিদ্যুতের ইউনিটপ্রতি দাম</caption>
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={`${cell} font-semibold`}>ধাপ</th>
                <th scope="col" className={`${cell} font-semibold`}>মাসের ইউনিট</th>
                <th scope="col" className={`${cell} text-right font-semibold`}>প্রতি ইউনিট ৳</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {RATE_IDS.map((id) => (
                <tr key={id}>
                  <th scope="row" className={`${cell} font-normal`}>{SLAB_NAMES[id][0]}</th>
                  <td className={cell}>{SLAB_NAMES[id][1]}</td>
                  <td className={`${cell} text-right tabular-nums`}>
                    {formatNumber(LT_A_RATES[id].value, { decimals: 2, minDecimals: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          ডিমান্ড চার্জ <strong>অনুমোদিত লোডের প্রতি কিলোওয়াটে মাসে ৳42</strong>, 2026-এ অপরিবর্তিত। বিইআরসি 3 জুন
          2026-এ খুচরা দাম বাড়ায়, তারপর 4 জুন লাইফলাইনের হার ৳4.63 (৳5.32-এর বদলে) আর প্রথম ধাপের হার ৳5.26
          (৳6.18-এর বদলে) বহাল রাখে। এই টেবিলের সব অঙ্ক ওই দুটি অফিসিয়াল আদেশ থেকে নেওয়া।
        </p>
      </ContentSection>

      <ContentSection id="lifeline" title="লাইফলাইনের নিয়ম (50 ইউনিট বা কম)">
        <p>
          <strong>মাসের মোট ব্যবহার 50 ইউনিট বা তার কম</strong> হলে সব ইউনিটে লাইফলাইন হার ৳4.63 বসে: 45 ইউনিটে
          45 × ৳4.63 = ৳208.35, আর 50 ইউনিটে ৳231.50 — অন্যান্য চার্জ বাদে।
        </p>
        <p>
          বিইআরসির আদেশে আছে, লাইফলাইন গ্রাহক ছাড়া অন্য কোনো আবাসিক গ্রাহক এই হার পাবেন না। তাই 51 ইউনিট হলেই
          পুরো মাস ধাপের হিসাবে যায়: 51 × ৳5.26 = ৳268.26। 50 ইউনিটের কাছাকাছি থাকলে কয়েক ইউনিট বাঁচালেই এনার্জি
          চার্জ ৳30-এর বেশি কমতে পারে।
        </p>
      </ContentSection>

      <ContentSection id="charges" title="ডিমান্ড চার্জ, মিটার ভাড়া ও ভ্যাট">
        <ul>
          <li>
            <strong>ডিমান্ড চার্জ (অফিসিয়াল):</strong> অনুমোদিত লোডের প্রতি কিলোওয়াটে মাসে ৳42 — ব্যবহারের ওপর নয়,
            অনুমোদিত লোডের ওপর। লোড লেখা থাকে বিলের কাগজে বা প্রিপেইড কার্ডে। অনুমোদিত লোডের বেশি ব্যবহার করলে
            বাড়তি লোডে দ্বিগুণ ডিমান্ড চার্জ (এখানে ধরা হয়নি)।
          </li>
          <li>
            <strong>মিটার ভাড়া (প্রকাশিত তথ্য):</strong> বিইআরসির 2026-এর শর্তাবলিতে মিটার ভাড়ার “প্রচলিত নিয়ম”
            বহাল আছে, অঙ্ক বলা নেই; নিজে মিটার কিনলে ভাড়া নেই। ডিপিডিসি 31 আগস্ট 2026-এ জানিয়েছে, তাদের সিঙ্গেল
            ফেজ মিটারের ভাড়া মাসে ৳40, থ্রি ফেজে ৳250। অন্য কোম্পানিতে ভিন্ন হতে পারে, তাই ক্যালকুলেটরে এগুলো পূরণ
            করা থাকলেও বদলানো যায়।
          </li>
          <li>
            <strong>ভ্যাট (প্রকাশিত তথ্য):</strong> বিইআরসি বলেছে সরকার-নির্ধারিত হারে ভ্যাট বসবে। ডিপিডিসি ও সংবাদ
            প্রতিবেদন অনুযায়ী হার 5%, এনার্জি চার্জ, ডিমান্ড চার্জ ও মিটার ভাড়ার ওপর। অন্য কিছুর ভ্যাটের জন্য{" "}
            <Link href={localePath("bn", calculatorPath("vat-calculator"))} className={link}>
              ভ্যাট ক্যালকুলেটর
            </Link>{" "}
            ব্যবহার করুন বা পড়ুন{" "}
            <Link href={localePath("bn", guidePath("vat-calculation"))} className={link}>
              ভ্যাট কীভাবে হিসাব হয়
            </Link>
            ।
          </li>
          <li>
            <strong>বিলম্ব মাশুল (অফিসিয়াল, এখানে ধরা হয়নি):</strong> দেরিতে বিল দিলে একবার 5%।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="prepaid-postpaid" title="প্রিপেইড বনাম পোস্টপেইড মিটার">
        <p>
          হার একই। <strong>প্রিপেইড</strong> মিটারে দুটি জিনিস আলাদা:
        </p>
        <ul>
          <li>
            ভ্যাটের আগের বিলের ওপর <strong>0.5% রিবেট</strong> (বিইআরসি)। ওপরের উদাহরণে ৳7.91।
          </li>
          <li>
            মাসের <strong>ডিমান্ড চার্জ ও মিটার ভাড়া মাসের প্রথম রিচার্জ থেকে কাটে</strong> (কোনো মাসে রিচার্জ না
            করলে পরের রিচার্জে সেই মাসেরটাও কাটে), তাই ছোট প্রথম রিচার্জে প্রত্যাশার চেয়ে কম ইউনিট পাবেন।
          </li>
        </ul>
        <p>
          <strong>৳1,000-এ কত ইউনিট?</strong> 2 কিলোওয়াটের সিঙ্গেল ফেজ প্রিপেইড মিটারে মাসে মোট ৳1,000 রিচার্জ করলে
          প্রায় <strong>126.58 ইউনিট</strong>: ৳84 ডিমান্ড চার্জ + ৳40 মিটার ভাড়া + 126.58 ইউনিটের ধাপভিত্তিক চার্জ,
          তার ওপর 5% ভ্যাট ও 0.5% রিবেট বাদে ঠিক ৳1,000। যেকোনো অঙ্কের জন্য ক্যালকুলেটরে “রিচার্জের টাকা” বেছে নিন।
          ৳129.58-এর কম রিচার্জে মাসের নির্দিষ্ট চার্জই হয় না। মিটার ভ্যাট একটু ভিন্নভাবে ভাগ করতে পারে, তাই এটিকে
          আনুমানিক ধরুন।
        </p>
      </ContentSection>

      <ContentSection id="read-meter" title="মিটার পড়ার কয়েকটি টিপস">
        <ul>
          <li>
            <strong>পোস্টপেইড:</strong> প্রতি মাসে একই দিনে kWh রিডিং লিখে রাখুন। এ মাসের রিডিং থেকে আগের মাসেরটা
            বাদ দিলেই ব্যবহৃত ইউনিট; ক্যালকুলেটরে “মিটার রিডিং” বেছে দুটোই লিখুন।
          </li>
          <li>
            শুধু kWh-এর ঘর পড়ুন (দশমিক বা লাল অঙ্কের আগের সংখ্যা) — কিছু ডিজিটাল মিটার পালা করে যে ভোল্টেজ, কারেন্ট
            বা কিলোওয়াট দেখায়, সেগুলো নয়।
          </li>
          <li>
            <strong>প্রিপেইড:</strong> মিটারে বাকি ব্যালেন্স আর কোড চাপলে এ মাসের ইউনিট দেখা যায়। কোড মিটারের ব্র্যান্ড
            অনুযায়ী আলাদা; আপনার কোম্পানির নির্দেশিকায় তালিকা থাকে।
          </li>
          <li>
            অনুমোদিত লোড ও মিটারের ফেজ বিলের কাগজে বা প্রিপেইড কার্ডে লেখা থাকে। ব্যবহার বারবার অনুমোদিত লোড ছাড়ালে
            লোড বদলের আবেদন করুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="bill-may-differ" title="কোম্পানির বিল কেন ভিন্ন হতে পারে">
        <p>
          এই ক্যালকুলেটর বিইআরসির প্রকাশিত হার হুবহু প্রয়োগ করে। তবু আপনার বিতরণ কোম্পানির বিল ভিন্ন হতে পারে —
          বিলম্ব মাশুল, বকেয়া, আগের আনুমানিক রিডিংয়ের সমন্বয়, পূর্ণ টাকায় রাউন্ডিং, ভিন্ন মিটার ভাড়া, দাম বদলের
          মাসে বিলের দিন ভাগ, বা প্রিপেইড মিটারে ভ্যাট ও নির্দিষ্ট চার্জ রিচার্জে রিচার্জে ভাগ হওয়ার কারণে। বিলে অন্য
          অঙ্ক থাকলে “ট্যারিফ বদলান” খুলে সেগুলো লিখুন।
        </p>
        <p>
          আয়ের কত অংশ বিদ্যুতে যায় দেখতে{" "}
          <Link href={localePath("bn", calculatorPath("salary-calculator"))} className={link}>
            বেতন ক্যালকুলেটরে
          </Link>{" "}
          হাতে পাওয়া বেতন আর{" "}
          <Link href={localePath("bn", calculatorPath("percentage-calculator"))} className={link}>
            শতাংশ ক্যালকুলেটরে
          </Link>{" "}
          অংশটি হিসাব করুন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>“ব্যবহৃত ইউনিট”, “মিটার রিডিং” বা “রিচার্জের টাকা” (প্রিপেইড) বেছে নিন।</li>
          <li>এ মাসের ইউনিট, দুটি রিডিং, বা রিচার্জের টাকা লিখুন। বাংলা অঙ্কেও লেখা যায়।</li>
          <li>অনুমোদিত লোড কিলোওয়াটে লিখুন (বিল বা প্রিপেইড কার্ড থেকে)।</li>
          <li>সিঙ্গেল ফেজ বা থ্রি ফেজ, আর পোস্টপেইড বা প্রিপেইড বেছে নিন।</li>
          <li>চাইলে “ট্যারিফ বদলান” খুলে যেকোনো হার, ডিমান্ড চার্জ, মিটার ভাড়া, ভ্যাট বা রিবেট বদলান।</li>
          <li>“বিল হিসাব করুন” চাপলে মোট বিল, প্রতি ধাপের হিসাব আর সব চার্জ দেখা যাবে।</li>
        </ol>
        <p>
          ক্যালকুলেটর এই ব্রাউজারে আপনার মিটারের ধরন ও অনুমোদিত লোড মনে রাখে, আর আপনার লেখা কিছুই ডিভাইসের বাইরে
          যায় না।
        </p>
        <p>
          নতুন এসি বা ফ্রিজে বিল কত বাড়বে জানতে চান? ওয়াট আর ঘণ্টা থেকে ইউনিট বের করার নিয়ম পড়ুন{" "}
          <Link href={localePath("bn", guidePath("electricity-units-appliances"))} className={link}>
            এসি, ফ্যান, ফ্রিজে কত ইউনিট বিদ্যুৎ খরচ হয়
          </Link>{" "}
          গাইডে, তারপর সেই ইউনিট আপনার স্বাভাবিক ইউনিটের সঙ্গে যোগ করে এখানে হিসাব করুন।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র ও তারিখ">
        <p>সব অঙ্ক 29 অক্টোবর 2026-এ যাচাই করা।</p>
        <ul>
          <li>
            অফিসিয়াল: <SourceLink source={BERC_RETAIL_ORDER} /> (দ্বিতীয় ধাপ থেকে ওপরের হার, ডিমান্ড চার্জ)।
          </li>
          <li>
            অফিসিয়াল: <SourceLink source={BERC_LIFELINE_REVISION} /> (লাইফলাইন ৳4.63 ও প্রথম ধাপ ৳5.26)।
          </li>
          <li>
            অফিসিয়াল: <SourceLink source={BERC_CONDITIONS} /> (0.5% প্রিপেইড রিবেট, সরকার-নির্ধারিত হারে ভ্যাট,
            মিটার ভাড়ার নিয়ম, 5% বিলম্ব মাশুল)।
          </li>
          <li>
            অফিসিয়াল তালিকা: <SourceLink source={BERC_NOTIFICATIONS_PAGE} /> ও <SourceLink source={DPDC_TARIFF_PAGE} />।
          </li>
          <li>
            প্রকাশিত তথ্য (মিটার ভাড়া ৳40/৳250, ভ্যাট 5%): <SourceLink source={TBS_DPDC_METER_CHARGES} /> ও{" "}
            <SourceLink source={AMAR_DESH_METER_RENT} />।
          </li>
          <li>
            ধাপের হিসাবপদ্ধতি: <SourceLink source={DAILY_STAR_SLAB_EXAMPLE} /> ও <SourceLink source={DAILY_STAR_SLABS_KEPT} />।
          </li>
        </ul>
      </ContentSection>
    </>
  );
}

import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatPlainDate, formatTaka } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";
import { EXCISE_TABLE, exciseBandRanges, SOURCE_TAX_PRESETS, SOURCE_TAX_SOURCES } from "./deposit-tax";

const link = "font-semibold text-brand-700 underline underline-offset-4";

function publishedOn(iso: string): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date, { locale: "bn" }) : iso;
}

/** Bangla explanatory content for the FDR Calculator page (Server Component, no JS). */
export function FdrCalculatorContentBn() {
  const dps = localePath("bn", calculatorPath("dps-calculator"));
  const sanchayapatra = localePath("bn", calculatorPath("sanchayapatra-calculator"));
  const emi = localePath("bn", calculatorPath("emi-calculator"));

  return (
    <>
      <ContentSection id="how-it-works" title="এফডিআরের সুদ যেভাবে হিসাব হয়">
        <p>
          এফডিআর (ফিক্সড ডিপোজিট বা স্থায়ী আমানত) নির্দিষ্ট মেয়াদে নির্দিষ্ট বার্ষিক হারে সুদ দেয়। এখানে সুদ মাস
          ধরে হিসাব করা হয়, এক মাস = বছরের 1/12 অংশ।
        </p>
        <h3>সরল সুদ (তুলে নেওয়া হয় বা মেয়াদ শেষে একসাথে)</h3>
        <p>
          <strong>সুদ = জমা × বার্ষিক হার ÷ 100 × মাস ÷ 12</strong>
        </p>
        <h3>সুদ জমায় যোগ হলে (চক্রবৃদ্ধি)</h3>
        <p>ব্যাংক প্রতি p মাসে (1, 3 বা 12) সুদ জমার সাথে যোগ করলে প্রতিবারের সুদও সুদ আনে:</p>
        <p>
          <strong>মেয়াদ শেষের অঙ্ক = জমা × (1 + হার ÷ 100 × p ÷ 12)^(সুদ যোগের সংখ্যা)</strong>
        </p>
        <p>
          মেয়াদ পুরো পর্বে ভাগ না হলে (যেমন বার্ষিক চক্রবৃদ্ধিতে 18 মাস) শেষের আংশিক সময়ে সরল সুদ ধরা হয়।
        </p>
        <h3>কর ও আবগারি বাদে</h3>
        <p>
          <strong>হাতে পাবেন = মেয়াদ শেষের অঙ্ক − উৎসে কর − আবগারি শুল্ক</strong>, যেখানে উৎসে কর = সুদ ×
          করের হার।
        </p>

        <h3>উদাহরণ 1: ৳1,00,000, 1 বছর, 9%</h3>
        <p>
          সরল সুদ: 1,00,000 × 9 ÷ 100 × 12 ÷ 12 = <strong>৳9,000</strong>। 10% কর ৳900। ব্যালান্স ৳4 লাখের নিচে,
          তাই আবগারি শুল্ক নেই। হাতে পাবেন <strong>৳1,08,100</strong>। প্রয়োজন থাকা সত্ত্বেও রিটার্নের প্রমাণ না
          দিলে (15%) কর ৳1,350, হাতে ৳1,07,650।
        </p>
        <h3>উদাহরণ 2: ৳5,00,000, 3 বছর, 10%, প্রতি 3 মাসে সুদ যোগ</h3>
        <p>
          5,00,000 × (1 + 0.10 × 3 ÷ 12)^12 = 5,00,000 × 1.025^12 ≈ <strong>৳6,72,444</strong>, অর্থাৎ সুদ প্রায়
          ৳1,72,444। 10% কর প্রায় ৳17,244। প্রতি বছর শেষে ব্যালান্স প্রায় ৳5,51,906, ৳6,09,201 ও ৳6,72,444 —
          সবই ৳5–10 লাখের স্ল্যাবে, তাই আনুমানিক আবগারি বছরে ৳500, মোট ৳1,500। হাতে পাবেন প্রায়{" "}
          <strong>৳6,53,700</strong>। ত্রৈমাসিক চক্রবৃদ্ধিতে বছরে 10% কর বাদের আগে প্রায় 10.38%-এর সমান হয়।
        </p>
      </ContentSection>

      <ContentSection id="tax-and-excise" title="এফডিআরে উৎসে কর ও আবগারি শুল্ক">
        <h3>উৎসে কর</h3>
        <p>
          আয়কর আইন 2023-এর ধারা 102 অনুযায়ী ব্যাংক এফডিআর ও সঞ্চয়ী হিসাবের সুদ থেকে কর কাটে। ব্যক্তির ক্ষেত্রে
          হার সুদের <strong>{SOURCE_TAX_PRESETS.standard.value}%</strong>। রিটার্ন দাখিল বাধ্যতামূলক হলেও ব্যাংকে
          রিটার্ন জমার প্রমাণ (PSR) না দিলে ধারা 142 অনুযায়ী 50% বেশি কাটে:{" "}
          <strong>{SOURCE_TAX_PRESETS.noReturnProof.value}%</strong>। কোম্পানি, ট্রাস্ট ও ব্যক্তিসংঘের হার 20%;
          সেজন্য “অন্য হার” বেছে নিন।
        </p>
        <p>
          “টিআইএন থাকলে 10%, না থাকলে 15%” — এটি পুরোনো আয়কর অধ্যাদেশ 1984-এর নিয়ম ছিল। আমানতের ক্ষেত্রে কত
          ব্যালান্সে PSR লাগে, নিচের সূত্রগুলো থেকে তা নিশ্চিত করা যায়নি, তাই কোন হার প্রযোজ্য তা আপনি বেছে নিন।
        </p>
        <h3>আবগারি শুল্ক</h3>
        <p>
          আবগারি শুল্ক প্রতিটি হিসাবের ওপর প্রতি ক্যালেন্ডার বছরে একবারের নির্দিষ্ট চার্জ — জানুয়ারি থেকে ডিসেম্বরের
          মধ্যে কোনো সময় ব্যালান্স কোনো স্ল্যাবে পৌঁছালে একবার কাটে, সাধারণত ডিসেম্বরে। এফডিআর, ডিপিএস ও সঞ্চয়ী
          হিসাব — সবেই প্রযোজ্য। 2026-27 অর্থবছরের (1 জুলাই 2026 থেকে) প্রকাশিত স্ল্যাব:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] text-left text-sm">
            <caption className="sr-only">2026-27 অর্থবছরে ব্যাংক ব্যালান্সের ওপর আবগারি শুল্ক (প্রকাশিত তথ্য অনুযায়ী)</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-3 font-medium">বছরে সর্বোচ্চ ব্যালান্স</th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">আবগারি শুল্ক</th>
              </tr>
            </thead>
            <tbody>
              {exciseBandRanges().map((band) => (
                <tr key={band.from} className="border-b border-slate-200 last:border-0">
                  <th scope="row" className="py-2 pr-3 font-normal">
                    {band.to === null
                      ? `${formatTaka(band.from - 1)}-এর বেশি`
                      : band.from === 0
                        ? `${formatTaka(band.to)} পর্যন্ত`
                        : `${formatTaka(band.from)} থেকে ${formatTaka(band.to)}`}
                  </th>
                  <td className="py-2 pl-3 text-right">{band.duty === 0 ? "নেই" : formatTaka(band.duty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          ৳4 লাখের সীমা (আগে ৳3 লাখ) অর্থ বিল 2026-এ ছিল, যা সংসদে 29 জুন 2026-এ পাস হয়। পাস হওয়া আইনের তফসিলের
          মূল পাঠ আমরা মিলিয়ে দেখতে পারিনি; বাকি স্ল্যাবগুলো 2025-26 থেকে অপরিবর্তিত বলে প্রকাশিত। ক্যালকুলেটর
          মেয়াদের প্রতি বছরের জন্য একবার, সেই বছর শেষের ব্যালান্সে আবগারি অনুমান করে; আসলে কতবার কাটবে তা নির্ভর
          করে আপনার এফডিআর কয়টি ডিসেম্বর পার করে তার ওপর। চাইলে নিজের অঙ্ক লিখতে বা আবগারি বাদ দিতে পারেন।
        </p>
      </ContentSection>

      <ContentSection id="bank-differences" title="আপনার ব্যাংকের অঙ্ক আলাদা হতে পারে">
        <p>এই ক্যালকুলেটর প্রচলিত মাসিক পদ্ধতি ব্যবহার করে, তাই ফলাফলকে কাছাকাছি অনুমান ধরুন। ব্যাংকের স্টেটমেন্ট সামান্য আলাদা হতে পারে, কারণ ব্যাংক:</p>
        <ul>
          <li>মাসের বদলে দিন গুনে (বছরে 365 বা 360 দিন) সুদ হিসাব করতে পারে;</li>
          <li>প্রতিবার সুদ যোগের সময় রাউন্ড করতে পারে;</li>
          <li>প্রতিবার সুদ জমার সময় কর কাটতে পারে, ফলে সুদ জমায় যোগ হলে কাটা করের ওপর আর সুদ আসে না;</li>
          <li>ফি নিতে পারে, বা অন্য ক্যালেন্ডার বছরে আবগারি কাটতে পারে;</li>
          <li>নবায়নের সময় নতুন হার দিতে পারে, বা আগে ভাঙলে কম হার দিতে পারে।</li>
        </ul>
        <p>
          সুদের হার ব্যাংকভেদে আলাদা ও প্রায়ই বদলায়, তাই এখানে নির্ধারিত হার নেই: আপনার অঙ্ক ও মেয়াদের জন্য ব্যাংক যে
          হার বলছে সেটিই দিন।
        </p>
      </ContentSection>

      <ContentSection id="compare" title="এফডিআর, ডিপিএস নাকি সঞ্চয়পত্র?">
        <p>
          একসাথে বড় অঙ্ক নির্দিষ্ট মেয়াদে রেখে দিতে চাইলে এফডিআর উপযোগী। প্রতি মাসে নির্দিষ্ট অঙ্ক জমাতে চাইলে
          ডিপিএস অন্যভাবে বাড়ে — দেখুন{" "}
          <Link href={dps} className={link}>
            ডিপিএস ক্যালকুলেটরে
          </Link>
          । সরকারি সঞ্চয়পত্রের হার, বিনিয়োগ-সীমা ও কর নিয়ম আলাদা; তুলনা করুন{" "}
          <Link href={sanchayapatra} className={link}>
            সঞ্চয়পত্র ক্যালকুলেটরে
          </Link>
          । এফডিআর না ভেঙে তার বিপরীতে লোন নেওয়ার কথা ভাবছেন? মাসিক কিস্তি দেখুন{" "}
          <Link href={emi} className={link}>
            ইএমআই ক্যালকুলেটরে
          </Link>
          ।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটরটি যেভাবে ব্যবহার করবেন">
        <ol>
          <li>টাকায় জমার পরিমাণ লিখুন।</li>
          <li>ব্যাংক যে বার্ষিক সুদের হার বলছে সেটি লিখুন।</li>
          <li>মেয়াদ বেছে নিন (3 মাস থেকে 3 বছর), অথবা “অন্য” বেছে যেকোনো মাস লিখুন।</li>
          <li>সুদ কীভাবে দেওয়া হয় বেছে নিন: সরল, অথবা প্রতি মাসে, 3 মাসে বা বছরে জমায় যোগ।</li>
          <li>উৎসে কর (10%, 15% বা অন্য হার) আর আবগারি শুল্ক কীভাবে ধরবেন বেছে নিন।</li>
          <li>“এফডিআর হিসাব করুন” চাপুন। “বছরভিত্তিক হিসাব দেখুন” খুললে প্রতি বছরের সুদ, ব্যালান্স ও আবগারি দেখা যাবে।</li>
        </ol>
        <p>
          মেয়াদ, সুদের ধরন, কর ও আবগারির পছন্দ এই ব্রাউজারে মনে রাখা হয়। আপনার লেখা অঙ্ক আপনার ডিভাইসেই থাকে, কোথাও
          পাঠানো হয় না।
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
        </ul>
        <p>
          সবগুলো 28 অক্টোবর 2026-এ যাচাই করা। করের হার আয়কর আইন 2023 (অর্থ অধ্যাদেশ 2025 দ্বারা সংশোধিত) অনুযায়ী;
          আবগারির স্ল্যাব অর্থ আইন 2026 অনুযায়ী। প্রতি বাজেটে এগুলো বদলাতে পারে, আর ব্যাংক যা কাটে সেটিই চূড়ান্ত।
        </p>
      </ContentSection>
    </>
  );
}

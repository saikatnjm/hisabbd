import Link from "next/link";
import {
  EXCISE_TABLE,
  exciseBandRanges,
  SOURCE_TAX_PRESETS,
  SOURCE_TAX_SOURCES,
} from "@/calculators/fdr/deposit-tax";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatPlainDate, formatTaka } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";

const link = "font-semibold text-brand-700 underline underline-offset-4";

function publishedOn(iso: string): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date, { locale: "bn" }) : iso;
}

/** Bangla explanatory content for the DPS Calculator page (Server Component, no JS). */
export function DpsCalculatorContentBn() {
  const fdr = localePath("bn", calculatorPath("fdr-calculator"));
  const sanchayapatra = localePath("bn", calculatorPath("sanchayapatra-calculator"));
  const emi = localePath("bn", calculatorPath("emi-calculator"));

  return (
    <>
      <ContentSection id="how-it-works" title="ডিপিএসের মেয়াদ শেষের অঙ্ক যেভাবে হিসাব হয়">
        <p>
          ডিপিএস (ডিপোজিট পেনশন স্কিম বা মাসিক সঞ্চয় স্কিম) হলো মাসিক সঞ্চয়ের পরিকল্পনা: নির্দিষ্ট বছর ধরে প্রতি মাসে
          একই অঙ্ক জমা দেন, আর মেয়াদ শেষে ব্যাংক জমা ও সুদ একসাথে দেয়।
        </p>
        <p>
          <strong>সময় যেভাবে ধরা হয়েছে:</strong> প্রতিটি কিস্তি মাসের <em>শুরুতে</em> জমা হয়, তাই সেই মাসের সুদও পায়;
          আর শেষ কিস্তির এক মাস পরে মেয়াদ পূর্ণ হয় (গণিতের ভাষায় annuity-due)। মাসিক চক্রবৃদ্ধিতে:
        </p>
        <p>
          <strong>মেয়াদ শেষের অঙ্ক = A × ((1 + i)ⁿ − 1) ÷ i × (1 + i)</strong>
        </p>
        <ul>
          <li>
            <strong>A</strong> হলো মাসিক কিস্তি।
          </li>
          <li>
            <strong>i</strong> হলো মাসিক হার: বার্ষিক হার ÷ 12 ÷ 100।
          </li>
          <li>
            <strong>n</strong> হলো কিস্তির সংখ্যা: বছর × 12।
          </li>
        </ul>
        <p>
          মোট জমা = A × n, সুদ = মেয়াদ শেষের অঙ্ক − মোট জমা, আর{" "}
          <strong>হাতে পাবেন = মেয়াদ শেষের অঙ্ক − উৎসে কর − আবগারি শুল্ক</strong>। ত্রৈমাসিক বা বার্ষিক চক্রবৃদ্ধিতে সুদ
          প্রতি মাসে জমে, কিন্তু ব্যালান্সে যোগ হয় প্রতি 3 বা 12 মাসে।
        </p>

        <h3>উদাহরণ 1: মাসে ৳5,000, 5 বছর, 9%</h3>
        <p>
          i = 9 ÷ 12 ÷ 100 = 0.0075, n = 60। মেয়াদ শেষে = 5,000 × (1.0075⁶⁰ − 1) ÷ 0.0075 × 1.0075 ≈{" "}
          <strong>৳3,79,949</strong>। আপনি জমা দেন ৳3,00,000, তাই সুদ প্রায় ৳79,949। 10% কর প্রায় ৳7,995। প্রতি বছর
          শেষে ব্যালান্স প্রায় ৳63,007, ৳1,31,924, ৳2,07,307, ৳2,89,761 ও ৳3,79,949 — কখনো ৳4 লাখ ছাড়ায় না, তাই
          আবগারি শুল্ক নেই। হাতে পাবেন প্রায় <strong>৳3,71,954</strong>। ত্রৈমাসিক চক্রবৃদ্ধিতে মেয়াদ শেষের অঙ্ক হতো
          প্রায় ৳3,79,278, আর বার্ষিকে প্রায় ৳3,76,588।
        </p>
        <h3>উদাহরণ 2: মাসে ৳10,000, 5 বছর, 10%</h3>
        <p>
          ৳6,00,000 জমায় ডিপিএস দাঁড়ায় প্রায় <strong>৳7,80,824</strong>: সুদ প্রায় ৳1,80,824, 10% কর ৳18,082। বছর
          শেষের ব্যালান্স তৃতীয় বছরে ৳4 লাখ ছাড়ায় (প্রায় ৳4,21,300, আবগারি ৳150), আর চতুর্থ ও পঞ্চম বছরে ৳5 লাখ
          (প্রতিবার ৳500), তাই আনুমানিক আবগারি ৳1,150। হাতে পাবেন প্রায় <strong>৳7,61,591</strong>।
        </p>
      </ContentSection>

      <ContentSection id="compounding" title="মাসিক নাকি ত্রৈমাসিক চক্রবৃদ্ধি?">
        <p>
          বাংলাদেশে প্রতিটি ব্যাংক নিজের ডিপিএস শর্ত ঠিক করে। বেশিরভাগ ডিপিএস ক্যালকুলেটর ও অনেক ব্যাংকের টেবিল মাসিক
          চক্রবৃদ্ধি ধরে, তাই এখানে সেটিই শুরুতে বাছাই করা, তবে সরকারি কোনো সূত্র থেকে একক নিয়ম আমরা নিশ্চিত করতে
          পারিনি। আপনার ডিপিএস ফর্মে বা ব্যাংকে ত্রৈমাসিক বা বার্ষিক বললে সেটি বেছে নিন: কম ঘন ঘন চক্রবৃদ্ধিতে সুদ
          সামান্য কম আসে।
        </p>
      </ContentSection>

      <ContentSection id="tax-and-excise" title="ডিপিএসে উৎসে কর ও আবগারি শুল্ক">
        <h3>উৎসে কর</h3>
        <p>
          আয়কর আইন 2023-এর ধারা 102 অনুযায়ী ব্যাংক আমানতের সুদ থেকে কর কাটে: ব্যক্তির ক্ষেত্রে{" "}
          <strong>{SOURCE_TAX_PRESETS.standard.value}%</strong>। রিটার্ন দাখিল বাধ্যতামূলক হলেও ব্যাংকে রিটার্ন জমার
          প্রমাণ (PSR) না দিলে ধারা 142 অনুযায়ী 50% বেশি:{" "}
          <strong>{SOURCE_TAX_PRESETS.noReturnProof.value}%</strong>। “টিআইএন থাকলে 10%, না থাকলে 15%” নিয়মটি পুরোনো
          আয়কর অধ্যাদেশ 1984-এর। কোম্পানি ও ট্রাস্টের হার 20%; “অন্য হার” ব্যবহার করুন।
        </p>
        <p>
          ক্যালকুলেটর মোট সুদ থেকে কর কাটে। আপনার ব্যাংক যদি মেয়াদের মধ্যে প্রতিবার সুদ জমার সময় কর কাটে, তাহলে কাটা
          করের ওপর আর সুদ আসে না, ফলে ব্যাংকের অঙ্ক সামান্য কম হয়।
        </p>
        <h3>আবগারি শুল্ক</h3>
        <p>
          জানুয়ারি থেকে ডিসেম্বরের মধ্যে কোনো সময় ব্যালান্স কোনো স্ল্যাবে পৌঁছালে প্রতিটি হিসাবে — ডিপিএসসহ — বছরে
          একবার আবগারি শুল্ক কাটে, সাধারণত ডিসেম্বরে। 2026-27 অর্থবছরের (1 জুলাই 2026 থেকে) প্রকাশিত স্ল্যাব:
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
          ৳4 লাখের সীমা (আগে ৳3 লাখ) অর্থ বিল 2026-এ ছিল, যা 29 জুন 2026-এ পাস হয়; পাস হওয়া তফসিলের মূল পাঠ আমরা
          মিলিয়ে দেখতে পারিনি, আর বাকি স্ল্যাবগুলো 2025-26 থেকে অপরিবর্তিত বলে প্রকাশিত। ক্যালকুলেটর স্কিমের প্রতি বছরে
          একবার, সেই বছর শেষের ব্যালান্সে আবগারি অনুমান করে — ডিপিএস শুধু বাড়ে, তাই বছর শেষের ব্যালান্সই সেই বছরের
          সর্বোচ্চ। আসলে কতবার কাটবে তা নির্ভর করে কোন মাসে শুরু করেছেন তার ওপর। চাইলে নিজের অঙ্ক লিখতে বা আবগারি বাদ
          দিতে পারেন।
        </p>
      </ContentSection>

      <ContentSection id="bank-differences" title="আপনার ব্যাংকের অঙ্ক আলাদা হতে পারে">
        <p>ফলাফলকে কাছাকাছি অনুমান ধরুন। ব্যাংকের ডিপিএস টেবিল বা স্টেটমেন্ট আলাদা হতে পারে, কারণ ব্যাংক:</p>
        <ul>
          <li>ত্রৈমাসিক চক্রবৃদ্ধি ধরতে পারে, বা মাসের বদলে দিন গুনে সুদ হিসাব করতে পারে;</li>
          <li>প্রতি মাসে রাউন্ড করতে পারে, বা সুদ জমার সময় কর কাটতে পারে;</li>
          <li>মেয়াদভেদে আলাদা হার দিতে পারে, বা ফি নিতে পারে;</li>
          <li>কিস্তি বাদ পড়লে বিলম্ব ফি নিতে পারে, বা আগে ভাঙলে কম হার দিতে পারে।</li>
        </ul>
        <p>
          সুদের হার ব্যাংকভেদে আলাদা ও প্রায়ই বদলায়, তাই এখানে নির্ধারিত হার নেই: আপনার মেয়াদের জন্য ব্যাংক যে হার
          বলছে সেটিই দিন।
        </p>
      </ContentSection>

      <ContentSection id="compare" title="ডিপিএস, এফডিআর নাকি সঞ্চয়পত্র?">
        <p>
          আয় থেকে প্রতি মাসে নির্দিষ্ট অঙ্ক জমাতে ডিপিএস উপযোগী। হাতে আগে থেকেই বড় অঙ্ক থাকলে ফিক্সড ডিপোজিটে কত আসে
          দেখুন{" "}
          <Link href={fdr} className={link}>
            এফডিআর ক্যালকুলেটরে
          </Link>
          । সরকারি সঞ্চয়পত্রের হার, সীমা ও কর নিয়ম আলাদা; তুলনা করুন{" "}
          <Link href={sanchayapatra} className={link}>
            সঞ্চয়পত্র ক্যালকুলেটরে
          </Link>
          । মাসিক ডিপিএস নাকি লোন আগে শোধ — ভাবছেন? লোনের খরচ দেখুন{" "}
          <Link href={emi} className={link}>
            ইএমআই ক্যালকুলেটরে
          </Link>
          ।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটরটি যেভাবে ব্যবহার করবেন">
        <ol>
          <li>টাকায় মাসিক কিস্তি লিখুন।</li>
          <li>এই মেয়াদের জন্য ব্যাংক যে বার্ষিক সুদের হার বলছে সেটি লিখুন।</li>
          <li>মেয়াদ পূর্ণ বছরে লিখুন (1 থেকে 30)।</li>
          <li>মাসিক, ত্রৈমাসিক বা বার্ষিক চক্রবৃদ্ধি বেছে নিন (নিশ্চিত না হলে মাসিক)।</li>
          <li>উৎসে কর (10%, 15% বা অন্য হার) আর আবগারি শুল্ক কীভাবে ধরবেন বেছে নিন।</li>
          <li>“ডিপিএস হিসাব করুন” চাপুন; হাতে কত পাবেন আর বছরভিত্তিক টেবিল দেখা যাবে।</li>
        </ol>
        <p>
          চক্রবৃদ্ধি, কর ও আবগারির পছন্দ এই ব্রাউজারে মনে রাখা হয়। আপনার লেখা অঙ্ক আপনার ডিভাইসেই থাকে, কোথাও পাঠানো
          হয় না।
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
        <p>সবগুলো 28 অক্টোবর 2026-এ যাচাই করা। প্রতি বাজেটে এগুলো বদলাতে পারে, আর ব্যাংক যা কাটে সেটিই চূড়ান্ত।</p>
      </ContentSection>
    </>
  );
}

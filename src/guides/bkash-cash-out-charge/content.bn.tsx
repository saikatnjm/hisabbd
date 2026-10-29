import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { BKASH_NEWS_SOURCE, MFS_CHARGE_PRESETS as P } from "@/calculators/mfs-charge/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Official cash-out rates checked on 28 October 2026 (same figures as the calculator's presets). */
const RATES: readonly [channel: string, perThousand: string, percent: string, onTenThousand: string][] = [
  ["বিকাশ, প্রিয় এজেন্ট", "13.95", "1.395%", "139.50"],
  ["বিকাশ, অন্য এজেন্ট", "18.50", "1.85%", "185.00"],
  ["নগদ, USSD *167# ও ইসলামিক অ্যাপ", "15.00", "1.5%", "150.00"],
  ["রকেট, এজেন্ট", "16.70", "1.67%", "167.00"],
  ["রকেট, DBBL এটিএম বা শাখা", "9.00", "0.9%", "90.00"],
  ["উপায়, এজেন্ট", "14.00", "1.4%", "140.00"],
  ["উপায়, UCB এটিএম", "8.00", "0.8%", "80.00"],
];

/** bKash charge on common amounts: Priyo Agent (৳13.95) vs any other agent (৳18.50). */
const AMOUNTS: readonly [amount: string, priyo: string, other: string][] = [
  ["1,000", "13.95", "18.50"],
  ["2,000", "27.90", "37.00"],
  ["5,000", "69.75", "92.50"],
  ["10,000", "139.50", "185.00"],
  ["20,000", "279.00", "370.00"],
];

/** Bangla guide: bKash, Nagad, Rocket and Upay cash-out charges (Server Component, no JS). */
export function BkashCashOutChargeGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("mfs-cash-out-charge-calculator"));

  return (
    <>
      <ContentSection id="rates" title="ক্যাশ আউট চার্জ কত: এক নজরে">
        <p>
          মোবাইল ব্যাংকিংয়ে ক্যাশ আউট চার্জ ধরা হয় <strong>প্রতি ৳1,000-এ কত টাকা</strong>, আর যেকোনো অঙ্কে সেই
          অনুপাতেই কাটে। নিচের হারগুলো প্রতিটি প্রতিষ্ঠানের নিজস্ব ওয়েবসাইটে 28 অক্টোবর 2026-এ যাচাই করা।
          বিকাশ, নগদ ও রকেটের হারে ভ্যাট ধরা আছে; উপায়ের পেজে ভ্যাট আলাদা কি না বলা নেই।
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>প্রতিষ্ঠান ও মাধ্যম</th>
                <th scope="col" className={headNum}>প্রতি ৳1,000-এ (৳)</th>
                <th scope="col" className={headNum}>শতকরা</th>
                <th scope="col" className={headNum}>৳10,000-এ (৳)</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map(([channel, perThousand, percent, onTenThousand]) => (
                <tr key={channel}>
                  <th scope="row" className={`${cell} font-normal`}>{channel}</th>
                  <td className={num}>{perThousand}</td>
                  <td className={num}>{percent}</td>
                  <td className={num}>{onTenThousand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          তাই সরাসরি উত্তর: <strong>1000 টাকায় বিকাশ চার্জ প্রিয় এজেন্টে ৳13.95, অন্য এজেন্টে ৳18.50</strong>।
          রকেট ও উপায়ের হার সাধারণ (প্রাইমারি) অ্যাকাউন্টের; বেতন, উপবৃত্তি বা রেমিট্যান্সের টাকায় হার আলাদা হতে
          পারে। সাধারণ নগদ অ্যাপের হার নগদের ইংরেজি ও বাংলা পেজে ভিন্ন ছিল, আর বিকাশের এটিএম চার্জের বর্তমান
          হারও নিশ্চিত করা যায়নি, তাই এ দুটি এখানে দেওয়া হয়নি; অ্যাপে দেখে নিন।
        </p>
      </ContentSection>

      <ContentSection id="formula" title="চার্জ কীভাবে হিসাব হয়">
        <p>
          <strong>চার্জ = টাকার পরিমাণ × প্রতি ৳1,000-এর হার ÷ 1,000</strong>
        </p>
        <p>
          <strong>ব্যালেন্স থেকে কাটবে = টাকার পরিমাণ + চার্জ</strong>
        </p>
        <p>
          চার্জ নগদ টাকার ভেতর থেকে নয়, ওপরে আলাদা করে ব্যালেন্স থেকে কাটে। তাই ৳5,000 হাতে পেতে চাইলে
          অ্যাকাউন্টে ৳5,000-এর বেশি থাকতে হবে। প্রতি ৳1,000-এর হারকে 10 দিয়ে ভাগ করলে শতকরা হার পাবেন: ৳18.50
          মানে 1.85%। উল্টোভাবে, রকেট ও উপায় হার দেয় শতাংশে; শতাংশকে 10 দিয়ে গুণ করলে প্রতি ৳1,000-এর চার্জ
          পাবেন, যেমন 1.67% মানে ৳16.70। অন্য যেকোনো শতাংশের হিসাবে{" "}
          <Link href={localePath("bn", calculatorPath("percentage-calculator"))} className={link}>
            শতকরা ক্যালকুলেটর
          </Link>{" "}
          কাজে লাগবে।
        </p>
        <h3>উদাহরণ</h3>
        <ul>
          <li>বিকাশ প্রিয় এজেন্ট থেকে ৳1,000: চার্জ ৳13.95, ব্যালেন্স থেকে কাটবে ৳1,013.95।</li>
          <li>বিকাশের অন্য এজেন্ট থেকে ৳5,000: 5,000 × 18.50 ÷ 1,000 = ৳92.50, কাটবে ৳5,092.50।</li>
          <li>রকেট এজেন্ট থেকে ৳2,500, 1.67% হারে: চার্জ ৳41.75, কাটবে ৳2,541.75।</li>
          <li>নগদে USSD দিয়ে ৳3,000, ৳15 হারে: চার্জ ৳45, কাটবে ৳3,045।</li>
        </ul>
        <p>বিকাশে প্রচলিত কিছু অঙ্কে চার্জ:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>ক্যাশ আউট (৳)</th>
                <th scope="col" className={headNum}>প্রিয় এজেন্টে (৳)</th>
                <th scope="col" className={headNum}>অন্য এজেন্টে (৳)</th>
              </tr>
            </thead>
            <tbody>
              {AMOUNTS.map(([amount, priyo, other]) => (
                <tr key={amount}>
                  <th scope="row" className={`${cell} font-normal`}>{amount}</th>
                  <td className={num}>{priyo}</td>
                  <td className={num}>{other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          যেকোনো অঙ্ক আর যেকোনো প্রতিষ্ঠানের চার্জ এক ক্লিকে দেখতে{" "}
          <Link href={calculator} className={link}>
            বিকাশ ও নগদ ক্যাশ আউট চার্জ ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন। হার সেখানে তারিখ ও সূত্রসহ আগে থেকে বসানো থাকে।
        </p>
      </ContentSection>

      <ContentSection id="from-balance" title="ব্যালেন্স থেকে সর্বোচ্চ কত তোলা যাবে">
        <p>
          উল্টো প্রশ্নও প্রায়ই আসে: অ্যাকাউন্টে যা আছে, চার্জ বাদে তার থেকে কত টাকা হাতে পাব?
        </p>
        <p>
          <strong>নগদ ≈ ব্যালেন্স ÷ (1 + হার ÷ 1,000)</strong>
        </p>
        <ul>
          <li>
            ৳10,000 ব্যালেন্স, বিকাশের অন্য এজেন্ট (৳18.50): 10,000 ÷ 1.0185 ≈ <strong>৳9,818.36</strong>। এর চার্জ
            ৳181.64, মোট ঠিক ৳10,000। এজেন্ট নোটে টাকা দেন, তাই পূর্ণ টাকায় তুলুন ৳9,818 (চার্জ ৳181.63, ব্যালেন্সে
            থাকবে ৳0.37)।
          </li>
          <li>
            ৳5,000 ব্যালেন্স, প্রিয় এজেন্ট (৳13.95): 5,000 ÷ 1.01395 ≈ <strong>৳4,931.21</strong>, চার্জ ৳68.79।
          </li>
        </ul>
        <p>
          প্রতিষ্ঠানগুলো চার্জ কীভাবে রাউন্ড করে তা প্রকাশ করে না, তাই অ্যাপের অঙ্কে কয়েক পয়সা পার্থক্য হতে পারে।
        </p>
      </ContentSection>

      <ContentSection id="priyo-agent" title="বিকাশ প্রিয় এজেন্ট: কী, কীভাবে সেট করবেন">
        <p>
          বিকাশ অ্যাপে (ক্যাশ আউট → প্রিয় এজেন্ট) বা *247# ডায়াল করে (মাই বিকাশ → প্রিয় নম্বর) যেকোনো{" "}
          <strong>2টি এজেন্ট নম্বর</strong> প্রিয় এজেন্ট করা যায়। তাদের কাছ থেকে প্রতি ক্যালেন্ডার মাসে মোট{" "}
          <strong>৳50,000 পর্যন্ত</strong> ক্যাশ আউটে চার্জ প্রতি ৳1,000-এ ৳18.50-এর বদলে ৳13.95।
        </p>
        <p>
          খেয়াল রাখুন: কোনো লেনদেনে মাসের ৳50,000 সীমা পার হলে <strong>সেই পুরো লেনদেনে</strong> ৳18.50 হারে চার্জ
          কাটে, শুধু সীমার বাইরের অংশে নয়।
        </p>
        <h3>বছরে কত সাশ্রয়</h3>
        <p>
          ধরুন প্রতি মাসে ৳20,000 তোলেন। অন্য এজেন্টে চার্জ মাসে ৳370, প্রিয় এজেন্টে ৳279, অর্থাৎ মাসে ৳91 কম। 12
          মাসে সাশ্রয় দাঁড়ায় <strong>৳1,092</strong>, শুধু দুটি নম্বর একবার সেট করে রাখলেই।
        </p>
        <h3>উদাহরণ: সীমার কাছাকাছি থাকলে</h3>
        <p>
          ধরুন এ মাসে প্রিয় এজেন্ট থেকে আগেই ৳45,000 তুলেছেন, এখন আরও ৳10,000 দরকার।
        </p>
        <ol>
          <li>পুরো ৳10,000 একবারে প্রিয় এজেন্ট থেকে: লেনদেনটি সীমা পার করে, তাই চার্জ 10,000 × 18.50 ÷ 1,000 = ৳185।</li>
          <li>
            আগে প্রিয় এজেন্ট থেকে ঠিক ৳5,000 (সীমা পূর্ণ হয়, পার হয় না): ৳69.75। বাকি ৳5,000 পরে: ৳92.50। মোট
            ৳162.25, অর্থাৎ ৳22.75 কম।
          </li>
        </ol>
        <p>মাসের হিসাব রাখা কঠিন হলে অ্যাপের লেনদেনের ইতিহাস দেখে নিন।</p>
      </ContentSection>

      <ContentSection id="pay-less" title="কম খরচে টাকা তোলার অফিশিয়াল উপায়">
        <ul>
          <li>
            <strong>বিকাশ:</strong> নিয়মিত যে এজেন্টের কাছে যান, তাদের 2টি নম্বর প্রিয় এজেন্ট করুন। মাসে ৳50,000
            পর্যন্ত প্রতি হাজারে ৳4.55 কম।
          </li>
          <li>
            <strong>রকেট:</strong> DBBL এটিএম বা শাখা থেকে তুললে 0.9%, এজেন্টে 1.67%। ৳10,000-এ পার্থক্য ৳77।
          </li>
          <li>
            <strong>উপায়:</strong> UCB এটিএমে 0.8%, এজেন্টে 1.4%। ৳10,000-এ পার্থক্য ৳60।
          </li>
          <li>
            <strong>নগদ:</strong> USSD *167# ও নগদ ইসলামিক অ্যাপে ভ্যাটসহ ৳15। সাধারণ অ্যাপের হার অ্যাপে মিলিয়ে
            তারপর বেছে নিন। নগদ বলে, তাদের ওয়েবসাইটের চার্জই চূড়ান্ত।
          </li>
          <li>
            <strong>সেন্ড মানি আলাদা:</strong> সেন্ড মানির চার্জ ক্যাশ আউটের নিয়মে কাটে না; বর্তমান চার্জ অ্যাপে
            দেখে নিন।
          </li>
        </ul>
        <p>
          অফার বা ক্যাম্পেইনের ছাড় সাময়িক, আর মাঝে মাঝে শুধু অ্যাপের নোটিশে আসে। বড় অঙ্ক তোলার আগে অ্যাপে
          দেখানো চার্জ মিলিয়ে নিন, আর অন্য হার দেখালে সেটিই{" "}
          <Link href={calculator} className={link}>
            ক্যাশ আউট চার্জ ক্যালকুলেটরে
          </Link>{" "}
          লিখে হিসাব করুন।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র ও তারিখ">
        <p>
          প্রতিটি হার 28 অক্টোবর 2026-এ যাচাই করা। প্রতিষ্ঠানগুলো মাঝে মাঝে চার্জ বদলায়; প্রতিষ্ঠানের নিজস্ব
          অ্যাপ ও ওয়েবসাইটের হারই চূড়ান্ত।
        </p>
        <ul>
          <li>
            বিকাশ:{" "}
            <a href={P["bkash-priyo"].source.url} target="_blank" rel="noopener" className={link}>
              {P["bkash-priyo"].source.title}
            </a>
            ; প্রিয় এজেন্টের হার ও সীমা নিশ্চিত করে{" "}
            <a href={BKASH_NEWS_SOURCE.url} target="_blank" rel="noopener" className={link}>
              {BKASH_NEWS_SOURCE.title}
            </a>
            ।
          </li>
          <li>
            নগদ:{" "}
            <a href={P["nagad-ussd"].source.url} target="_blank" rel="noopener" className={link}>
              {P["nagad-ussd"].source.title}
            </a>
            ।
          </li>
          <li>
            রকেট:{" "}
            <a href={P["rocket-agent"].source.url} target="_blank" rel="noopener" className={link}>
              {P["rocket-agent"].source.title}
            </a>
            ।
          </li>
          <li>
            উপায়:{" "}
            <a href={P["upay-agent"].source.url} target="_blank" rel="noopener" className={link}>
              {P["upay-agent"].source.title}
            </a>
            ।
          </li>
        </ul>
      </ContentSection>
    </>
  );
}

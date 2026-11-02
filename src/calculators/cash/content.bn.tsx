import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { CASH_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Bangla explanatory content for the Cash Counter (Server Component, no JS). */
export function CashCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="টাকা গণনা ক্যালকুলেটর কীভাবে কাজ করে">
        <p>
          প্রতিটি নোট বা কয়েনের মূল্যমানকে তার সংখ্যা দিয়ে গুণ করা হয় (মূল্যমান × সংখ্যা = উপমোট)। উপমোটগুলো যোগ করলেই মোট
          টাকা, আর নোট ও কয়েনের সংখ্যা আলাদা করে দেখানো হয়। ফাঁকা ঘর 0 ধরা হয়।
        </p>
        <h3>উদাহরণ</h3>
        <p>আপনার কাছে 1000 টাকার 3টি, 500 টাকার 4টি, 100 টাকার 7টি আর 20 টাকার 5টি নোট আছে।</p>
        <ol>
          <li>3 × ৳1000 = ৳3,000</li>
          <li>4 × ৳500 = ৳2,000</li>
          <li>7 × ৳100 = ৳700</li>
          <li>5 × ৳20 = ৳100</li>
          <li>মোট: ৳3,000 + ৳2,000 + ৳700 + ৳100 = ৳5,800, মোট 19টি নোট।</li>
        </ol>
        <p>
          চেক বা রসিদে মোট টাকা কথায় লিখতে{" "}
          <Link href={localePath("bn", calculatorPath("amount-in-words"))} className={link}>
            টাকা কথায় লেখার ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="denominations" title="যেসব নোট ও কয়েন গোনা যায়">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>ধরন</th>
                <th scope="col" className={head}>মূল্যমান</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>নোট</td><td className={cell}>৳1000, ৳500, ৳200, ৳100, ৳50, ৳20, ৳10, ৳5, ৳2</td></tr>
              <tr><td className={cell}>কয়েন</td><td className={cell}>৳5, ৳2, ৳1</td></tr>
            </tbody>
          </table>
        </div>
        <ul>
          <li>বাংলাদেশ ব্যাংক 5 থেকে 1000 টাকা পর্যন্ত নোট ছাপে, 200 টাকার নোটও এর মধ্যে আছে।</li>
          <li>
            2025 থেকে ছাড়া নতুন নকশার নোট পুরোনো নোটের পাশাপাশি বৈধ মুদ্রা, তাই একই মূল্যমানের পুরোনো ও নতুন নোট একই ঘরে
            ধরুন।
          </li>
          <li>এই ক্যালকুলেটর জাল নোট ধরতে পারে না। আপনার লেখা সংখ্যা শুধু যোগ করে।</li>
        </ul>
      </ContentSection>

      <ContentSection id="tips" title="টাকা গোনার কিছু পরামর্শ">
        <ul>
          <li>
            নোট 100টির বান্ডিলে গুনুন। 500 টাকার 5 বান্ডিল থাকলে “৳500 নোট” ঘরে 500 লিখুন: 500 × ৳500 = ৳2,50,000।
          </li>
          <li>প্রতিটি মূল্যমান আলাদা করে, বড় থেকে ছোট ক্রমে গুনুন, তাহলে হিসাব গুলিয়ে যাবে না।</li>
          <li>অঙ্কটা গুরুত্বপূর্ণ হলে দুবার গুনে দুটি মোট মিলিয়ে নিন।</li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="কীভাবে ব্যবহার করবেন">
        <ol>
          <li>“৳1000 নোট”, “৳500 নোট” ইত্যাদি ঘরে নোট কয়টি আছে লিখুন। বাংলা সংখ্যাও চলবে।</li>
          <li>“৳5 কয়েন”, “৳2 কয়েন” ও “৳1 কয়েন” ঘরে কয়েনের সংখ্যা লিখুন। যেগুলো নেই সেগুলো ফাঁকা রাখুন।</li>
          <li>“টাকা গুনুন” চাপলে মোট টাকা, নোট ও কয়েনের সংখ্যা আর মূল্যমান অনুযায়ী টেবিল দেখতে পাবেন।</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="তথ্যসূত্র">
        <ul>
          <li>
            নোট:{" "}
            <a href={S.notes.url} target="_blank" rel="noopener" className={link}>
              {S.notes.title}
            </a>{" "}
            ও{" "}
            <a href={S.twoHundred.url} target="_blank" rel="noopener" className={link}>
              {S.twoHundred.title}
            </a>
            (ইংরেজি)।
          </li>
          <li>
            কয়েন:{" "}
            <a href={S.coins.url} target="_blank" rel="noopener" className={link}>
              {S.coins.title}
            </a>
            (ইংরেজি)।
          </li>
          <li>
            নতুন নকশার নোট:{" "}
            <a href={S.newDesign.url} target="_blank" rel="noopener" className={link}>
              {S.newDesign.title}
            </a>
            (ইংরেজি)।
          </li>
        </ul>
        <p>2 নভেম্বর 2026-এ যাচাই করা।</p>
      </ContentSection>
    </>
  );
}

import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-right text-sm";
const cell = "border-b border-slate-200 py-2 pr-3 tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** The page's worked example (same figures as the logic tests): ৳7,200 bazar, 180 meals, ৳2,000 fixed costs. */
const MEMBERS: readonly [name: string, meals: string, cost: string, deposit: string, balance: string][] = [
  ["রহিম", "60", "2,900", "3,000", "পাবেন ৳100"],
  ["করিম", "45", "2,300", "2,500", "পাবেন ৳200"],
  ["জামাল", "50", "2,500", "2,000", "দেবেন ৳500"],
  ["সালাম", "25", "1,500", "1,500", "মিটে গেছে"],
];

/** Bangla explanatory content for the Mess Meal Calculator (Server Component, no JS). */
export function MessCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="মেসের মিল হিসাবের নিয়ম">
        <ol>
          <li>
            <strong>মিল রেট = মাসের মোট বাজার খরচ ÷ সবার মোট মিল</strong>
          </li>
          <li>
            <strong>সদস্যের খরচ = তাঁর মিল × মিল রেট + স্থির খরচের ভাগ</strong> (বুয়া, গ্যাস, ইন্টারনেট ইত্যাদি সমান ভাগে)
          </li>
          <li>
            <strong>ব্যালান্স = জমা − খরচ।</strong> ধনাত্মক হলে তিনি টাকা ফেরত পাবেন, ঋণাত্মক হলে দেবেন।
          </li>
        </ol>
        <p>
          জমা মানে সদস্য মেসে যত টাকা দিয়েছেন, তিনি নিজে বাজার করে থাকলে সেই খরচসহ। সবার ব্যালান্স যোগ করলে পাওয়া যায় মোট জমা −
          মোট খরচ, অর্থাৎ ম্যানেজারের হাতে কত রইল বা কত ঘাটতি।
        </p>
      </ContentSection>

      <ContentSection id="example" title="উদাহরণ: 4 জনের মেস">
        <p>
          মাসে বাজার খরচ ৳7,200, সবার মোট মিল 180, তাই মিল রেট 7,200 ÷ 180 = <strong>৳40</strong>। বুয়া আর গ্যাস মিলিয়ে স্থির
          খরচ ৳2,000, জনপ্রতি ৳500।
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={`${head} text-left`}>সদস্য</th>
                <th scope="col" className={head}>মিল</th>
                <th scope="col" className={head}>খরচ (৳)</th>
                <th scope="col" className={head}>জমা (৳)</th>
                <th scope="col" className={head}>ব্যালান্স</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map(([name, meals, cost, deposit, balance]) => (
                <tr key={name}>
                  <td className={`${cell} text-left`}>{name}</td>
                  <td className={cell}>{meals}</td>
                  <td className={cell}>{cost}</td>
                  <td className={cell}>{deposit}</td>
                  <td className={cell}>{balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          রহিমের খরচ: 60 × ৳40 = ৳2,400, তার সঙ্গে ৳500 = ৳2,900; জমা ৳3,000, তাই তিনি ৳100 ফেরত পাবেন। মোট জমা ৳9,000 আর মোট খরচ
          ৳9,200, তাই মেসে ৳200 ঘাটতি, যা জামালের ৳500 আর রহিম-করিমের ফেরতের পার্থক্যের সমান।
        </p>
      </ContentSection>

      <ContentSection id="tips" title="ঝামেলা এড়ানোর কয়েকটি নিয়ম">
        <ul>
          <li>প্রতিদিনের মিল খাতায় বা গ্রুপে লিখে রাখুন; মাস শেষে মনে করে লিখলে ভুল হয়।</li>
          <li>অতিথির মিল যিনি অতিথি এনেছেন তাঁর মিলে যোগ করুন। আধা মিল 0.5 ধরা যায়।</li>
          <li>সদস্যের নিজের করা বাজারের রসিদ রাখুন, আর সেই খরচ বাজার খরচ ও তাঁর জমা দুই জায়গাতেই ধরুন।</li>
          <li>স্থির খরচ কীভাবে ভাগ হবে (সমান, নাকি মিল অনুযায়ী), মাসের শুরুতেই ঠিক করে নিন।</li>
          <li>
            মাস শেষে ফলের লেখাটি কপি করে মেসের গ্রুপে শেয়ার করুন; শতকরা হিসাবের জন্য{" "}
            <Link href={localePath("bn", calculatorPath("percentage-calculator"))} className={link}>
              শতকরা ক্যালকুলেটর
            </Link>
            , আর মেসের বিদ্যুৎ বিলের জন্য{" "}
            <Link href={localePath("bn", calculatorPath("electricity-bill-calculator"))} className={link}>
              বিদ্যুৎ বিল ক্যালকুলেটর
            </Link>{" "}
            দেখুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>এ মাসের মোট বাজার খরচ লিখুন।</li>
          <li>সমান ভাগের স্থির খরচ থাকলে লিখুন, না থাকলে ফাঁকা রাখুন।</li>
          <li>প্রত্যেক সদস্যের নাম (ঐচ্ছিক), মিল আর জমা লিখুন; দরকার হলে “সদস্য যোগ করুন” চাপুন।</li>
          <li>“মিল হিসাব করুন” চাপলে মিল রেট, প্রত্যেকের খরচ ও ব্যালান্স আর ম্যানেজারের হাতের টাকা দেখা যাবে।</li>
        </ol>
        <p>সব হিসাব আপনার ফোনেই হয়; নাম বা টাকার অঙ্ক কোথাও পাঠানো হয় না।</p>
      </ContentSection>
    </>
  );
}

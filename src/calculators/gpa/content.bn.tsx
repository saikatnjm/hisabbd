import { ContentSection } from "@/components/ui/content-section";

/** Bangla explanatory content for the GPA Calculator page (Server Component, no JS). */
export function GpaCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="জিপিএ যেভাবে হিসাব হয়">
        <p>
          <strong>জিপিএ = Σ (গ্রেড পয়েন্ট × ক্রেডিট) ÷ Σ ক্রেডিট</strong>
        </p>
        <p>
          প্রতিটি কোর্সের গ্রেড পয়েন্টকে তার ক্রেডিট দিয়ে গুণ করুন। সেগুলো যোগ করলে মোট গ্রেড পয়েন্ট
          পাওয়া যায়, তারপর মোট ক্রেডিট দিয়ে ভাগ করুন।
        </p>

        <h3>একটি উদাহরণ</h3>
        <ul>
          <li>কোর্স ১: A (3.75) × 3 ক্রেডিট = 11.25</li>
          <li>কোর্স ২: B+ (3.25) × 3 ক্রেডিট = 9.75</li>
          <li>কোর্স ৩: A- (3.50) × 3 ক্রেডিট = 10.50</li>
          <li>কোর্স ৪: B (3.00) × 1.5 ক্রেডিট = 4.50</li>
        </ul>
        <p>
          মোট গ্রেড পয়েন্ট = 36.00 আর মোট ক্রেডিট = 10.5, তাই জিপিএ = 36 ÷ 10.5 = 3.428…, দেখানো হয়{" "}
          <strong>3.43</strong>। দুই দশমিকে কেটে ফেললে হতো 3.42 — এজন্যই আনুষ্ঠানিক সংখ্যা রাউন্ড করা
          সংখ্যার চেয়ে সামান্য ভিন্ন হতে পারে।
        </p>
      </ContentSection>

      <ContentSection id="grade-scale" title="যে গ্রেড স্কেল ব্যবহার হয়েছে">
        <p>
          ক্যালকুলেটরটি বাংলাদেশের বিশ্ববিদ্যালয় মঞ্জুরি কমিশনের প্রকাশিত অভিন্ন ৪.০০ গ্রেডিং স্কেল
          ব্যবহার করে, যা অনেক বিশ্ববিদ্যালয় অনুসরণ করে। আপনার বিশ্ববিদ্যালয়ের সীমারেখা ভিন্ন হতে
          পারে, তাই নিজের হ্যান্ডবুক দেখে নিন।
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">নম্বর</th>
                <th scope="col" className="px-3 py-2 font-semibold">লেটার গ্রেড</th>
                <th scope="col" className="px-3 py-2 font-semibold">গ্রেড পয়েন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="px-3 py-2">80–100</td><td className="px-3 py-2">A+</td><td className="px-3 py-2">4.00</td></tr>
              <tr><td className="px-3 py-2">75–79</td><td className="px-3 py-2">A</td><td className="px-3 py-2">3.75</td></tr>
              <tr><td className="px-3 py-2">70–74</td><td className="px-3 py-2">A-</td><td className="px-3 py-2">3.50</td></tr>
              <tr><td className="px-3 py-2">65–69</td><td className="px-3 py-2">B+</td><td className="px-3 py-2">3.25</td></tr>
              <tr><td className="px-3 py-2">60–64</td><td className="px-3 py-2">B</td><td className="px-3 py-2">3.00</td></tr>
              <tr><td className="px-3 py-2">55–59</td><td className="px-3 py-2">B-</td><td className="px-3 py-2">2.75</td></tr>
              <tr><td className="px-3 py-2">50–54</td><td className="px-3 py-2">C+</td><td className="px-3 py-2">2.50</td></tr>
              <tr><td className="px-3 py-2">45–49</td><td className="px-3 py-2">C</td><td className="px-3 py-2">2.25</td></tr>
              <tr><td className="px-3 py-2">40–44</td><td className="px-3 py-2">D</td><td className="px-3 py-2">2.00</td></tr>
              <tr><td className="px-3 py-2">40-এর নিচে</td><td className="px-3 py-2">F</td><td className="px-3 py-2">0.00</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          এই ক্যালকুলেটর বিশ্ববিদ্যালয়ের লেটার গ্রেড ও ক্রেডিটের জন্য। এসএসসি বা এইচএসসি ফলাফলের
          নিয়ম আলাদা — সেগুলোর জন্য এসএসসি ও এইচএসসি জিপিএ ক্যালকুলেটর ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটরটি যেভাবে ব্যবহার করবেন">
        <ol>
          <li>প্রতিটি কোর্সে আপনার পাওয়া গ্রেডটি বেছে নিন।</li>
          <li>কোর্সের ক্রেডিট লিখুন, যেমন 3, 1.5 বা 0.75। নাম ঐচ্ছিক।</li>
          <li>আরও সারির জন্য “কোর্স যোগ করুন” চাপুন, বা বাড়তি সারি ফাঁকা রাখুন — সেগুলো বাদ যায়।</li>
          <li>“জিপিএ হিসাব করুন” চাপলে জিপিএ, মোট ক্রেডিট আর গ্রেড পয়েন্ট দেখা যাবে।</li>
        </ol>
        <p>
          F পাওয়া কোর্সও গণনায় ধরা হয়: গ্রেড পয়েন্ট যোগ হয় না, কিন্তু ক্রেডিট মোটে থেকে যায়।
          রিটেকের প্রভাব দেখতে চাইলে গ্রেডটি বদলে আবার হিসাব করুন। কয়েকটি সেমিস্টার একসাথে করতে
          সিজিপিএ ক্যালকুলেটর ব্যবহার করুন।
        </p>
        <p>জিপিএ ২ দশমিকে রাউন্ড করা হয় (হাফ-আপ)। কিছু প্রতিষ্ঠান রাউন্ড না করে কেটে ফেলে।</p>
      </ContentSection>
    </>
  );
}

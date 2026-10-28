import { ContentSection } from "@/components/ui/content-section";

const cell = "px-3 py-2";
const head = "px-3 py-2 font-semibold";

/** Bangla explanatory content for the SSC & HSC GPA Calculator page (Server Component, no JS). */
export function SscHscGpaCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="এসএসসি ও এইচএসসি জিপিএ যেভাবে হিসাব হয়">
        <p>
          <strong>জিপিএ = (Σ মূল বিষয়ের গ্রেড পয়েন্ট + চতুর্থ বিষয়ের বোনাস) ÷ মূল বিষয়ের সংখ্যা</strong>, সর্বোচ্চ
          5.00।
        </p>
        <p>
          মূল বিষয় মানে আপনার আবশ্যিক ও বিভাগভিত্তিক বিষয়। চতুর্থ (ঐচ্ছিক) বিষয় শুধু বোনাস যোগ করে: এর গ্রেড
          পয়েন্টের 2.00-এর ওপরের অংশটুকু। ভাগ করার সময় এটি গোনা হয় না, তাই এটি জিপিএ বাড়াতে পারে, কখনো কমায় না।
          সীমা থাকায় সর্বোচ্চ জিপিএ 5.00।
        </p>

        <h3>একটি উদাহরণ (এইচএসসি, বিজ্ঞান)</h3>
        <ul>
          <li>বাংলা: A (4.00)</li>
          <li>ইংরেজি: A- (3.50)</li>
          <li>আইসিটি: A+ (5.00)</li>
          <li>পদার্থবিজ্ঞান: A (4.00)</li>
          <li>রসায়ন: A+ (5.00)</li>
          <li>উচ্চতর গণিত: A+ (5.00)</li>
          <li>জীববিজ্ঞান (চতুর্থ বিষয়): A (4.00), তাই বোনাস 4.00 − 2.00 = 2.00</li>
        </ul>
        <p>
          6টি মূল বিষয়ে মোট 26.50 পয়েন্ট। চতুর্থ বিষয় ছাড়া জিপিএ হতো 26.5 ÷ 6 = 4.416…, দেখানো হয় 4.42। বোনাসসহ
          (26.5 + 2) ÷ 6 = 28.5 ÷ 6 = <strong>4.75</strong> — অর্থাৎ চতুর্থ বিষয় যোগ করেছে 0.33।
        </p>

        <h3>যখন সীমা কাজ করে</h3>
        <p>
          এবার ধরুন বাংলা, আইসিটি, পদার্থবিজ্ঞান, রসায়ন ও উচ্চতর গণিতে A+, ইংরেজিতে A, আর চতুর্থ বিষয় জীববিজ্ঞানে
          A+। মূল বিষয়ে 29 পয়েন্ট (শুধু এগুলোতে 4.83), চতুর্থ বিষয় যোগ করে 3, তাই (29 + 3) ÷ 6 = 5.33। এটি
          সর্বোচ্চের বেশি, তাই জিপিএ <strong>5.00</strong>। এভাবেই সব মূল বিষয়ে A+ না পেয়েও জিপিএ 5.00 পাওয়া যায়।
        </p>
      </ContentSection>

      <ContentSection id="grade-scale" title="বোর্ডের গ্রেড পয়েন্ট (৫.০০ স্কেল)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={head}>নম্বর</th>
                <th scope="col" className={head}>লেটার গ্রেড</th>
                <th scope="col" className={head}>গ্রেড পয়েন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className={cell}>80–100</td><td className={cell}>A+</td><td className={cell}>5.00</td></tr>
              <tr><td className={cell}>70–79</td><td className={cell}>A</td><td className={cell}>4.00</td></tr>
              <tr><td className={cell}>60–69</td><td className={cell}>A-</td><td className={cell}>3.50</td></tr>
              <tr><td className={cell}>50–59</td><td className={cell}>B</td><td className={cell}>3.00</td></tr>
              <tr><td className={cell}>40–49</td><td className={cell}>C</td><td className={cell}>2.00</td></tr>
              <tr><td className={cell}>33–39</td><td className={cell}>D</td><td className={cell}>1.00</td></tr>
              <tr><td className={cell}>0–32</td><td className={cell}>F</td><td className={cell}>0.00</td></tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="fourth-subject" title="চতুর্থ (ঐচ্ছিক) বিষয়ের বোনাস">
        <p>চতুর্থ বিষয়ের গ্রেড পয়েন্টের শুধু 2.00-এর ওপরের অংশটুকু মোটের সাথে যোগ হয়:</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={head}>চতুর্থ বিষয়ের গ্রেড</th>
                <th scope="col" className={head}>গ্রেড পয়েন্ট</th>
                <th scope="col" className={head}>বোনাস যোগ হয়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className={cell}>A+</td><td className={cell}>5.00</td><td className={cell}>+3.00</td></tr>
              <tr><td className={cell}>A</td><td className={cell}>4.00</td><td className={cell}>+2.00</td></tr>
              <tr><td className={cell}>A-</td><td className={cell}>3.50</td><td className={cell}>+1.50</td></tr>
              <tr><td className={cell}>B</td><td className={cell}>3.00</td><td className={cell}>+1.00</td></tr>
              <tr><td className={cell}>C, D বা F</td><td className={cell}>2.00 বা কম</td><td className={cell}>0</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          বোনাস যোগ হয় পয়েন্টের সাথে, বিষয়ের সংখ্যার সাথে নয়। চতুর্থ বিষয়ে F পেলে শুধু কিছু যোগ হয় না; এতে ফেল
          হয় না।
        </p>
      </ContentSection>

      <ContentSection id="rules-to-know" title="ফেল, দুই পত্রের বিষয় ও রাউন্ডিং">
        <ul>
          <li>
            <strong>কোনো মূল বিষয়ে F মানে ফেল।</strong> অন্য গ্রেড যত ভালোই হোক, ফলাফল ফেল আর জিপিএ 0.00।
            ক্যালকুলেটর জানিয়ে দেয় কোন কোন বিষয়ে F।
          </li>
          <li>
            <strong>দুই পত্রের বিষয় একবারই গোনা হয়।</strong> বাংলা ১ম ও ২য় পত্র, ইংরেজি ১ম ও ২য় পত্র এবং এ ধরনের
            বিষয় একটি বিষয়, একটি সম্মিলিত গ্রেড। প্রতিটি পত্র আলাদা নয়, মার্কশিটের সম্মিলিত গ্রেডটি লিখুন।
          </li>
          <li>
            <strong>আপনি যতগুলো মূল বিষয় দেবেন, ততগুলো দিয়েই ভাগ হবে।</strong> এইচএসসিতে সাধারণত 6টি মূল বিষয়,
            এসএসসিতে বিভাগ ও বছরভেদে আরও বেশি। ক্যালকুলেটর এইচএসসিতে 6টি আর এসএসসিতে 9টি সারি দিয়ে শুরু করে, তবে
            সারি যোগ বা বাদ দেওয়া যায়।
          </li>
          <li>
            <strong>2 দশমিক।</strong> বোর্ড জিপিএ 2 দশমিক পর্যন্ত প্রকাশ করে। ক্যালকুলেটর দেখানোর সময় হাফ-আপ রাউন্ড
            করে।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="official-rules" title="এই নিয়মগুলো কোথা থেকে">
        <p>
          এই নিয়মগুলো এসএসসি, এইচএসসি এবং দাখিল ও আলিমের মতো সমমানের পরীক্ষায় বহুল প্রচলিত বাংলাদেশের শিক্ষা
          বোর্ডের চর্চার সাথে মেলে। নিয়মগুলো জানিয়ে কোনো আনুষ্ঠানিক প্রজ্ঞাপন আমরা অনলাইনে পাইনি, আর বোর্ড নিয়ম
          বদলাতে পারে, তাই এটিকে একটি আনুমানিক হিসাব হিসেবে নিন। নিজের বোর্ডের ফলাফল বিজ্ঞপ্তি দেখুন: আপনার
          আনুষ্ঠানিক ফলাফলই চূড়ান্ত।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটরটি যেভাবে ব্যবহার করবেন">
        <ol>
          <li>পরীক্ষা বেছে নিন, এসএসসি বা এইচএসসি। এতে শুধু শুরুর সারির সংখ্যা বদলায়।</li>
          <li>প্রতিটি মূল বিষয়ের গ্রেড বেছে নিন। নাম ঐচ্ছিক।</li>
          <li>আরও সারির জন্য “বিষয় যোগ করুন” চাপুন, বা বাড়তি সারি ফাঁকা রাখুন — সেগুলো বাদ যায়।</li>
          <li>চতুর্থ বিষয়ের গ্রেড বেছে নিন, অথবা “চতুর্থ বিষয় নেই” রেখে দিন।</li>
          <li>
            “জিপিএ হিসাব করুন” চাপলে জিপিএ, পাস না ফেল, চতুর্থ বিষয়ের বোনাস আর চতুর্থ বিষয় ছাড়া জিপিএ দেখা যাবে।
          </li>
        </ol>
        <p>
          এই ক্যালকুলেটর স্কুল-কলেজের বোর্ড পরীক্ষার ফলাফলের জন্য। ক্রেডিটসহ বিশ্ববিদ্যালয়ের সেমিস্টার ফলাফলের জন্য
          জিপিএ বা সিজিপিএ ক্যালকুলেটর ব্যবহার করুন।
        </p>
      </ContentSection>
    </>
  );
}

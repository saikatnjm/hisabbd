import { ContentSection } from "@/components/ui/content-section";

const cell = "px-3 py-2";

/** Bangla explanatory content for the Taka Amount in Words page (Server Component, no JS). */
export function AmountInWordsContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="টাকার অঙ্ক যেভাবে কথায় লেখা হয়">
        <p>
          অঙ্কটিকে বাংলাদেশে প্রচলিত ভাগে ভাগ করা হয়, বাঁ দিক থেকে:{" "}
          <strong>কোটি, লক্ষ, হাজার, শত</strong>, তারপর শেষের দুই অঙ্ক। প্রতিটি ভাগ কথায় লিখে তারপর
          আসে “টাকা”, পয়সা (থাকলে) আর “মাত্র”।
        </p>
        <p>
          <strong>1,25,300.50 = 1 লক্ষ + 25 হাজার + 3 শত, আর 50 পয়সা</strong>
        </p>
        <p>
          কথায়: <strong>এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র</strong>। ইংরেজিতে:{" "}
          <strong lang="en">One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only</strong>।
        </p>

        <h3>কয়েকটি উদাহরণ</h3>
        <ul>
          <li>৳0: শূন্য টাকা মাত্র (Zero Taka Only)</li>
          <li>৳21: একুশ টাকা মাত্র (Twenty-One Taka Only)</li>
          <li>৳101: একশত এক টাকা মাত্র (One Hundred One Taka Only)</li>
          <li>৳999: নয়শত নিরানব্বই টাকা মাত্র (Nine Hundred Ninety-Nine Taka Only)</li>
          <li>৳1,00,000: এক লক্ষ টাকা মাত্র (One Lakh Taka Only)</li>
          <li>৳1,00,00,000: এক কোটি টাকা মাত্র (One Crore Taka Only)</li>
          <li>৳0.29: ঊনত্রিশ পয়সা মাত্র (Twenty-Nine Paisa Only)</li>
          <li>৳0.05: পাঁচ পয়সা মাত্র (Five Paisa Only)</li>
        </ul>
        <p>
          1 থেকে 99 পর্যন্ত বাংলা সংখ্যার নাম অনিয়মিত (যেমন ঊনত্রিশ, সাঁইত্রিশ, নিরানব্বই), তাই প্রতিটি
          আলাদা করে মিলিয়ে দেখা হয়েছে। পয়সা আপনার লেখা অঙ্ক থেকে হুবহু নেওয়া হয়, তাই 0.29 সবসময় 29
          পয়সাই হয়।
        </p>
      </ContentSection>

      <ContentSection id="cheque" title="বাংলাদেশি চেকে টাকার অঙ্ক যেভাবে লিখবেন">
        <ol>
          <li>
            <strong>কথার লাইন:</strong> লাইনের একদম শুরু থেকে লিখুন, শব্দের মাঝে বাড়তি ফাঁক রাখবেন না।
            লাইনের শুরুতে “টাকা” বা “Taka” ছাপা থাকলে তার পরে লিখুন; না থাকলে ক্যালকুলেটরের মতো “টাকা”
            শব্দটিও লিখুন।
          </li>
          <li>
            <strong>শেষে “মাত্র” লিখুন</strong> (ইংরেজিতে “Only”), তারপর বাকি ফাঁকা জায়গায় একটি দাগ টেনে
            দিন, যাতে পরে কিছু যোগ করা না যায়।
          </li>
          <li>
            <strong>অঙ্কের ঘর:</strong> ছাপা ৳ বা “Tk.”-এর ঠিক পাশে লক্ষ-কোটির কমাসহ লিখুন, যেমন
            1,25,300.50। পুরো টাকার অঙ্কের পরে অনেকে “/-” দেন (1,25,300/-), যাতে অঙ্কটি বন্ধ হয়ে যায়।
          </li>
          <li>
            <strong>কথা আর অঙ্ক মিলতে হবে।</strong> দুটো না মিললে ব্যাংক চেক ফেরত দিতে পারে, তাই দুটোই
            একই ফলাফল থেকে কপি করুন।
          </li>
        </ol>
        <p>
          আপনার ব্যাংকের নিজস্ব নির্দেশনা থাকতে পারে (যেমন কোন ভাষায় লিখতে হবে); সেগুলো এই সাধারণ নিয়ম
          থেকে আলাদা হলে ব্যাংকের নির্দেশনাই মানুন।
        </p>
      </ContentSection>

      <ContentSection id="lakh-crore-million" title="লক্ষ-কোটি বনাম মিলিয়ন-বিলিয়ন">
        <p>
          বাংলাদেশে অঙ্ক ভাগ করা হয় 1,00,00,000 এভাবে (লক্ষ ও কোটি), আর আন্তর্জাতিক পদ্ধতিতে
          10,000,000 এভাবে (হাজার ও মিলিয়ন)। ক্যালকুলেটর দুই পদ্ধতির লেখাই দেখায়।
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={`${cell} font-semibold`}>বাংলাদেশি পদ্ধতি</th>
                <th scope="col" className={`${cell} font-semibold`}>অঙ্কে</th>
                <th scope="col" className={`${cell} font-semibold`}>আন্তর্জাতিক</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className={cell}>1 হাজার</td><td className={cell}>1,000</td><td className={cell}>1 thousand</td></tr>
              <tr><td className={cell}>1 লক্ষ (লাখ)</td><td className={cell}>1,00,000</td><td className={cell}>100 thousand</td></tr>
              <tr><td className={cell}>10 লক্ষ</td><td className={cell}>10,00,000</td><td className={cell}>1 million</td></tr>
              <tr><td className={cell}>1 কোটি</td><td className={cell}>1,00,00,000</td><td className={cell}>10 million</td></tr>
              <tr><td className={cell}>10 কোটি</td><td className={cell}>10,00,00,000</td><td className={cell}>100 million</td></tr>
              <tr><td className={cell}>100 কোটি</td><td className={cell}>1,00,00,00,000</td><td className={cell}>1 billion</td></tr>
              <tr><td className={cell}>1,000 কোটি</td><td className={cell}>10,00,00,00,000</td><td className={cell}>10 billion</td></tr>
              <tr><td className={cell}>1 লক্ষ কোটি</td><td className={cell}>10,00,00,00,00,000</td><td className={cell}>1 trillion</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          কোটির ওপরে, কত কোটি সেই সংখ্যাটিও লক্ষ-হাজার দিয়ে লেখা হয়, তাই “কোটি” আবার আসে: ৳1,000 কোটি
          হলো <strong>এক হাজার কোটি টাকা মাত্র</strong>। ক্যালকুলেটর ৳9,99,99,99,99,999.99 পর্যন্ত, অর্থাৎ
          এক লক্ষ কোটির ঠিক নিচ পর্যন্ত লিখতে পারে।
        </p>
        <p>
          এই ক্যালকুলেটর “লক্ষ” লেখে, যা চেকসহ আনুষ্ঠানিক লেখায় বেশি দেখা যায়। “লাখ”-ও একই অর্থে সমান
          প্রচলিত। শত লেখা হয় “একশত, দুইশত … নয়শত” এভাবে; কথ্য “একশো” বা “একশ”-ও একই অর্থ বহন করে।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটরটি যেভাবে ব্যবহার করবেন">
        <ol>
          <li>টাকার পরিমাণ লিখুন, পয়সার জন্য দশমিকের পর সর্বোচ্চ 2 ঘর। বাংলা অঙ্ক ও কমা চলবে।</li>
          <li>“কথায় লিখুন” চাপুন।</li>
          <li>প্রতিটি লেখার পাশের “কপি” বোতাম দিয়ে বাংলা বা ইংরেজি কথা কপি করুন, অথবা “ফলাফল কপি করুন” দিয়ে দুটোই।</li>
          <li>চেকের অঙ্কের ঘরের জন্য “ইংরেজি অঙ্কে” বা “বাংলা অঙ্কে” দেখুন।</li>
        </ol>
      </ContentSection>
    </>
  );
}

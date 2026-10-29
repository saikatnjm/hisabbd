import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Height, cm, healthy weight in kg and lb (BMI 18.5 to 24.9 × height², as the calculator's logic.ts rule 5). */
const HEALTHY_ROWS: readonly [height: string, cm: string, kg: string, lb: string][] = [
  ["5 ফুট 0 ইঞ্চি", "152.4", "43.0 – 57.8", "94.7 – 127.5"],
  ["5 ফুট 2 ইঞ্চি", "157.5", "45.9 – 61.8", "101.1 – 136.1"],
  ["5 ফুট 4 ইঞ্চি", "162.6", "48.9 – 65.8", "107.8 – 145.1"],
  ["5 ফুট 6 ইঞ্চি", "167.6", "52.0 – 70.0", "114.6 – 154.3"],
  ["5 ফুট 8 ইঞ্চি", "172.7", "55.2 – 74.3", "121.7 – 163.8"],
  ["5 ফুট 10 ইঞ্চি", "177.8", "58.5 – 78.7", "128.9 – 173.5"],
  ["6 ফুট 0 ইঞ্চি", "182.9", "61.9 – 83.3", "136.4 – 183.6"],
];

/** Bangla guide: what BMI is, how it is calculated, the WHO adult categories and its limits (Server Component, no JS). */
export function BmiExplainedGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("bmi-calculator"));

  return (
    <>
      <ContentSection id="what" title="বিএমআই কী, আর কেন মাপা হয়">
        <p>
          বিএমআই (বডি মাস ইনডেক্স) একটি সংখ্যা, যা আপনার ওজনকে উচ্চতার সঙ্গে তুলনা করে। একই ওজন লম্বা মানুষের জন্য
          এক রকম, খাটো মানুষের জন্য আরেক রকম; বিএমআই দুটোকে একটা সংখ্যায় এনে দেখায় ওজন উচ্চতার তুলনায় কম, ঠিকঠাক
          না বেশি। এর জন্য শুধু একটা ফিতা আর ওজন মাপার যন্ত্র লাগে, তাই ডাক্তারের চেম্বার, জিম আর স্বাস্থ্য জরিপে এটি
          সবচেয়ে বেশি ব্যবহৃত মাপগুলোর একটি।
        </p>
        <p>
          মনে রাখুন, বিএমআই <strong>প্রাপ্তবয়স্কদের জন্য একটি প্রাথমিক যাচাই</strong>, রোগনির্ণয় নয়। এটি শরীরের
          চর্বি মাপে না; শুধু বলে ওজন নিয়ে ডাক্তারের সঙ্গে কথা বলা দরকার কি না। নিজের সংখ্যা সরাসরি দেখতে আমাদের{" "}
          <Link href={calculator} className={link}>
            বিএমআই ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন; নিচের নিয়মেই হিসাব করে, আর আপনি যা লেখেন তা আপনার ফোন বা কম্পিউটারের বাইরে যায় না।
        </p>
      </ContentSection>

      <ContentSection id="formula" title="বিএমআই হিসাবের সূত্র ও উদাহরণ">
        <p>
          <strong>বিএমআই = ওজন (কেজি) ÷ (উচ্চতা মিটারে × উচ্চতা মিটারে)</strong>
        </p>
        <p>উচ্চতা সেন্টিমিটারে জানা থাকলে আগে 100 দিয়ে ভাগ করে মিটার করুন: 170 সেমি = 1.70 মিটার।</p>
        <ol>
          <li>উচ্চতার বর্গ: 1.70 × 1.70 = 2.89।</li>
          <li>ওজনকে এ দিয়ে ভাগ: 70 কেজি ÷ 2.89 = 24.22।</li>
          <li>এক দশমিক পর্যন্ত রাখলে বিএমআই <strong>24.2</strong>, যা স্বাস্থ্যকর ওজনের শ্রেণিতে পড়ে।</li>
        </ol>
        <p>একই উচ্চতায় ওজন বদলালে কী হয়, দেখুন:</p>
        <ul>
          <li>170 সেমি, 50 কেজি: 50 ÷ 2.89 = <strong>17.3</strong>, অর্থাৎ কম ওজন।</li>
          <li>175 সেমি, 100 কেজি: 100 ÷ (1.75 × 1.75) = 100 ÷ 3.0625 = <strong>32.7</strong>, অর্থাৎ স্থূলতা ক্লাস I।</li>
        </ul>
      </ContentSection>

      <ContentSection id="feet-pounds" title="ফুট-ইঞ্চি ও পাউন্ডে বিএমআই হিসাব">
        <p>
          বাংলাদেশে উচ্চতা সাধারণত ফুট-ইঞ্চিতে বলা হয়, আর অনেক মেশিনে ওজন আসে পাউন্ডে। সূত্রে বসানোর আগে এগুলো
          রূপান্তর করুন:
        </p>
        <ul>
          <li>উচ্চতা: মোট ইঞ্চি = ফুট × 12 + ইঞ্চি; তারপর 1 ইঞ্চি = 2.54 সেমি।</li>
          <li>ওজন: 1 পাউন্ড = 0.45359237 কেজি।</li>
        </ul>
        <p>উদাহরণ: উচ্চতা 5 ফুট 7 ইঞ্চি, ওজন 154 পাউন্ড।</p>
        <ol>
          <li>5 × 12 + 7 = 67 ইঞ্চি; 67 × 2.54 = 170.18 সেমি, অর্থাৎ 1.7018 মিটার।</li>
          <li>154 × 0.45359237 = 69.85 কেজি।</li>
          <li>1.7018 × 1.7018 = 2.896; 69.85 ÷ 2.896 = <strong>24.1</strong>, স্বাস্থ্যকর ওজন।</li>
        </ol>
        <p>
          আরেকটি: 6 ফুট (182.88 সেমি) উচ্চতায় 90 কেজি হলে বিএমআই <strong>26.9</strong>, যা বাড়তি ওজনের শ্রেণিতে।
          ইঞ্চির ঘরে কিছু না থাকলে 0 ধরুন।
        </p>
        <p>
          মাপ ঠিক না হলে বিএমআই-ও ঠিক আসে না। জুতা খুলে, দেয়ালে পিঠ ঠেকিয়ে সোজা দাঁড়িয়ে উচ্চতা মাপুন। ওজন নিন হালকা কাপড়ে,
          সম্ভব হলে সকালে খাওয়ার আগে, আর প্রতিবার একই যন্ত্রে; তাহলে দিনভেদে ওঠানামা কম হবে। আন্দাজে বলা উচ্চতা এক-দুই ইঞ্চি
          এদিক-ওদিক হলে বিএমআই প্রায় এক পয়েন্ট সরে যেতে পারে: 70 কেজিতে 5 ফুট 7 ইঞ্চিতে 24.2, কিন্তু 5 ফুট 8 ইঞ্চিতে 23.5।
        </p>
      </ContentSection>

      <ContentSection id="categories" title="WHO শ্রেণি: বিএমআই কত হলে স্বাভাবিক">
        <p>বিশ্ব স্বাস্থ্য সংস্থা (WHO) প্রাপ্তবয়স্কদের বিএমআই এভাবে ভাগ করে:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>বিএমআই</th>
                <th scope="col" className={head}>শ্রেণি</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>18.5-এর নিচে</td><td className={cell}>কম ওজন</td></tr>
              <tr><td className={cell}>18.5 – 24.9</td><td className={cell}><strong>স্বাস্থ্যকর (স্বাভাবিক) ওজন</strong></td></tr>
              <tr><td className={cell}>25.0 – 29.9</td><td className={cell}>বাড়তি ওজন</td></tr>
              <tr><td className={cell}>30.0 – 34.9</td><td className={cell}>স্থূলতা ক্লাস I</td></tr>
              <tr><td className={cell}>35.0 – 39.9</td><td className={cell}>স্থূলতা ক্লাস II</td></tr>
              <tr><td className={cell}>40 বা বেশি</td><td className={cell}>স্থূলতা ক্লাস III</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          অর্থাৎ প্রাপ্তবয়স্কের বিএমআই <strong>18.5 থেকে 24.9</strong> হলে স্বাভাবিক ধরা হয়। WHO-র তালিকায় এই
          শ্রেণির নাম “normal weight”, আর 25 থেকে 29.9-এর নাম “pre-obesity”; আমাদের ক্যালকুলেটরে এগুলো “স্বাস্থ্যকর
          ওজন” ও “বাড়তি ওজন” নামে দেখায়।
        </p>
        <p>
          শ্রেণি ঠিক হয় এক দশমিকে গোল করা সংখ্যা দিয়ে, যাতে দেখানো সংখ্যা আর শ্রেণি মেলে। যেমন হিসাবে 24.95 এলে তা
          25.0 দেখায়, তাই শ্রেণি বাড়তি ওজন।
        </p>
        <p>
          2004 সালে WHO-র এক বিশেষজ্ঞ পরামর্শসভা বলেছিল, অনেক এশীয় জনগোষ্ঠীতে এর চেয়ে কম বিএমআইতেই কিছু
          স্বাস্থ্য-ঝুঁকি বাড়ে, আর জনস্বাস্থ্যের কাজে 23 ও 27.5 বাড়তি সীমারেখা প্রস্তাব করেছিল। এটা পটভূমি হিসেবে জানুন;
          আপনার ক্ষেত্রে এর মানে কী, ডাক্তারকে জিজ্ঞেস করুন।
        </p>
      </ContentSection>

      <ContentSection id="healthy-weight" title="উচ্চতা অনুযায়ী স্বাস্থ্যকর ওজন কত">
        <p>সূত্রটি উল্টে নিলেই কোনো উচ্চতায় স্বাস্থ্যকর ওজনের সীমা পাওয়া যায়:</p>
        <p>
          <strong>স্বাস্থ্যকর ওজন = 18.5 × উচ্চতা² থেকে 24.9 × উচ্চতা²</strong> (উচ্চতা মিটারে)
        </p>
        <p>
          170 সেমিতে: 18.5 × 2.89 = 53.5 কেজি, আর 24.9 × 2.89 = 72.0 কেজি। ধরা যাক কারও উচ্চতা{" "}
          <strong>5 ফুট 6 ইঞ্চি</strong> (66 ইঞ্চি = 167.64 সেমি)। 1.6764 × 1.6764 = 2.810, তাই স্বাস্থ্যকর ওজন মোটামুটি{" "}
          <strong>52.0 থেকে 70.0 কেজি</strong> (114.6 থেকে 154.3 পাউন্ড)।
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>উচ্চতা</th>
                <th scope="col" className={headNum}>সেমি</th>
                <th scope="col" className={headNum}>কেজি</th>
                <th scope="col" className={headNum}>পাউন্ড</th>
              </tr>
            </thead>
            <tbody>
              {HEALTHY_ROWS.map(([height, cm, kg, lb]) => (
                <tr key={height}>
                  <td className={cell}>{height}</td>
                  <td className={num}>{cm}</td>
                  <td className={num}>{kg}</td>
                  <td className={num}>{lb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          এটা একটা সীমা, কোনো একটি “আদর্শ ওজন” নয়। এর ভেতরে কোথায় থাকা ভালো, তা শরীরের গঠন, বয়স ও স্বাস্থ্যের ওপর
          নির্ভর করে। অন্য যেকোনো উচ্চতার সীমা পেতে{" "}
          <Link href={calculator} className={link}>
            বিএমআই ক্যালকুলেটরে
          </Link>{" "}
          উচ্চতা ও ওজন লিখুন; বিএমআই-এর সঙ্গে কেজি বা পাউন্ডে স্বাস্থ্যকর ওজনের সীমাও দেখাবে।
        </p>
      </ContentSection>

      <ContentSection id="limits" title="বিএমআই যা বলে না">
        <p>বিএমআই শুধু ওজন আর উচ্চতা দেখে, তাই অনেক কিছু এর চোখ এড়িয়ে যায়:</p>
        <ul>
          <li>
            <strong>পেশি আর চর্বির পার্থক্য।</strong> খেলোয়াড় বা ভারী কাজ করা মানুষের পেশি বেশি বলে চর্বি কম থাকলেও
            বিএমআই বেশি আসতে পারে।
          </li>
          <li>
            <strong>বয়স।</strong> বয়স্কদের পেশি কমে যায়, তাই বিএমআই স্বাভাবিক দেখালেও শরীরে চর্বি বেশি থাকতে পারে।
          </li>
          <li>
            <strong>চর্বি কোথায় জমেছে।</strong> পেটের চারপাশের চর্বি বেশি ঝুঁকির, কিন্তু বিএমআই তা ধরে না।
          </li>
          <li>
            <strong>গর্ভাবস্থা।</strong> গর্ভাবস্থায় বিএমআই-এর এই শ্রেণিগুলো প্রযোজ্য নয়।
          </li>
          <li>
            <strong>শিশু ও কিশোর।</strong> তাদের বিএমআই বয়স ও লিঙ্গ অনুযায়ী আলাদা গ্রোথ চার্টে মেলানো হয়, ওপরের সারণিতে
            নয়। সে জন্য বছর ও মাসে সঠিক বয়স লাগে, যা{" "}
            <Link href={localePath("bn", calculatorPath("age-calculator"))} className={link}>
              বয়স ক্যালকুলেটর
            </Link>{" "}
            দিয়ে বের করতে পারেন; চার্ট মেলানোর কাজটি ডাক্তার বা স্বাস্থ্যকর্মীকে করতে দিন।
          </li>
        </ul>
        <p>
          তাই বিএমআই কম বা বেশি এলে ভয় পাওয়ার কিছু নেই, আবার স্বাভাবিক এলেও তা পুরো স্বাস্থ্যের নিশ্চয়তা নয়। ওজন,
          খাওয়াদাওয়া বা কোনো উপসর্গ নিয়ে চিন্তা থাকলে <strong>ডাক্তারের সঙ্গে কথা বলুন</strong>; তিনি বিএমআই-এর
          পাশাপাশি কোমরের মাপ, রক্তচাপ, রক্তের পরীক্ষা আর আপনার ইতিহাসও দেখবেন।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <p>
          প্রাপ্তবয়স্কদের বিএমআই শ্রেণি (18.5-এর নিচে থেকে 40-এর ওপরে, ক্লাস I–III):{" "}
          <a
            href="https://www.who.int/europe/news-room/fact-sheets/item/nutrition---maintaining-a-healthy-lifestyle"
            target="_blank"
            rel="noopener"
            className={link}
          >
            WHO Europe, “Nutrition for a healthy life”
          </a>{" "}
          (18 জুলাই 2025; আমরা দেখেছি 29 অক্টোবর 2026)। রূপান্তরের হার আন্তর্জাতিক সংজ্ঞা অনুযায়ী: 1 ইঞ্চি = 2.54 সেমি,
          1 পাউন্ড = 0.45359237 কেজি। এই লেখা চিকিৎসা-পরামর্শ নয়।
        </p>
      </ContentSection>
    </>
  );
}

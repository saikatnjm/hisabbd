import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Bangla explanatory content for the Unit Price Calculator (Server Component, no JS). */
export function UnitPriceCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="তুলনা কীভাবে হয়">
        <ol>
          <li>
            <strong>একক দাম = দাম ÷ পরিমাণ</strong>, দেখানো হয় কেজি, লিটার বা পিস প্রতি। ওজন ও তরলের জন্য 100 গ্রাম বা 100 মিলি
            প্রতি দামও দেখানো হয়।
          </li>
          <li>যে অপশনের একক দাম সবচেয়ে কম সেটাই সবচেয়ে সস্তা। একক দাম সমান হলে অপশনগুলো সমান ধরা হয়।</li>
          <li>
            <strong>সাশ্রয় = সবচেয়ে দামির একক দাম − সবচেয়ে সস্তার একক দাম</strong>, আর সবচেয়ে দামির দামের শতাংশেও দেখানো হয়।
          </li>
        </ol>
        <h3>উদাহরণ: 1 kg না 5 kg চাল</h3>
        <p>
          1 kg-এর প্যাক ৳78 আর 5 kg-এর বস্তা ৳370। 1 kg-এর প্যাকে কেজি প্রতি ৳78 ÷ 1 = ৳78। 5 kg-এর বস্তায় ৳370 ÷ 5 ={" "}
          <strong>কেজি প্রতি ৳74</strong>, তাই বস্তাই সস্তা। কেজি প্রতি ৳4 বাঁচে, যা সবচেয়ে দামি দামের ৳4 ÷ ৳78 ={" "}
          <strong>5.13%</strong>। 1 kg-এর প্যাক বস্তার চেয়ে 5.41% বেশি দামি।
        </p>
      </ContentSection>

      <ContentSection id="units" title="একক আর তার মানে">
        <ul>
          <li>
            <strong>ওজন:</strong> গ্রাম ও কেজি। 1 কেজি = 1,000 গ্রাম।
          </li>
          <li>
            <strong>তরল:</strong> মিলি ও লিটার। 1 লিটার = 1,000 মিলি।
          </li>
          <li>
            <strong>গণনা:</strong> পিস, ডজন ও হালি। <strong>1 ডজন = 12 পিস</strong> আর <strong>1 হালি = 4 পিস</strong>। ডিম, কলা,
            কমলার হিসাবে বাংলাদেশে এই শব্দগুলোই চলে।
          </li>
        </ul>
        <p>
          সব অপশন একই ধরনের এককে হতে হবে। এক কেজি চাল আর এক লিটার তেল ন্যায্যভাবে তুলনা করা যায় না, তাই ক্যালকুলেটর আন্দাজ না করে একক
          ঠিক করতে বলে। সের, মণের মতো পুরোনো একক নেই: আগে কেজিতে বদলে নিন।
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="ক্যালকুলেটর যা জানে না">
        <ul>
          <li>শুধু দাম তুলনা করা হয়, ব্র্যান্ড, মান বা তাজা কি না দেখা হয় না।</li>
          <li>কম একক দামে সাশ্রয় তখনই, যখন পুরো প্যাক ব্যবহার করবেন। খাবার নষ্ট হলে যা বাঁচে তার চেয়ে বেশি যায়।</li>
          <li>দাম আপনার লেখা দামই। দোকানের দাম বদলায়, তাই সেদিনের লেবেল দেখে নিন।</li>
          <li>
            কোনো প্যাকে ছাড় থাকলে আগে{" "}
            <Link href={localePath("bn", calculatorPath("discount-calculator"))} className={link}>
              ডিসকাউন্ট ক্যালকুলেটরে
            </Link>{" "}
            দাম বের করে এখানে লিখুন। একটা অপশন কত শতাংশ দামি তা দেখতে{" "}
            <Link href={localePath("bn", calculatorPath("percentage-calculator"))} className={link}>
              শতাংশ ক্যালকুলেটর
            </Link>{" "}
            কাজে লাগবে, আর মেসের বাজারের খরচ মিল ধরে ভাগ করতে{" "}
            <Link href={localePath("bn", calculatorPath("mess-meal-calculator"))} className={link}>
              মেস মিল ক্যালকুলেটর
            </Link>{" "}
            আছে।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>প্রতিটা অপশনে নাম (ঐচ্ছিক), দাম, পরিমাণ আর একক লিখুন।</li>
          <li>আরও প্যাকের জন্য “অপশন যোগ করুন” চাপুন (সর্বোচ্চ 10টি), বাদ দিতে বাদ দেওয়ার বোতাম চাপুন।</li>
          <li>“দাম তুলনা করুন” চেপে দেখুন কোনটা সস্তা, প্রতিটার একক দাম আর কত সাশ্রয় হবে।</li>
        </ol>
        <p>সব হিসাব আপনার ফোনেই হয়; দাম কোথাও পাঠানো হয় না।</p>
      </ContentSection>
    </>
  );
}

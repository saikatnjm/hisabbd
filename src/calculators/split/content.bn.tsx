import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Bangla explanatory content for the Expense Split Calculator (Server Component, no JS). */
export function SplitCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="খরচ ভাগের নিয়ম">
        <ol>
          <li>
            <strong>জনপ্রতি ভাগ = মোট খরচ ÷ মানুষের সংখ্যা।</strong>
          </li>
          <li>
            <strong>ব্যালান্স = যা দিয়েছেন − ভাগ।</strong> ধনাত্মক হলে তিনি পাবেন, ঋণাত্মক হলে দেবেন।
          </li>
          <li>যিনি সবচেয়ে বেশি দেবেন তিনি সবচেয়ে বেশি পাওনাদারকে দেন, এভাবে সবার হিসাব মেটা পর্যন্ত।</li>
        </ol>
        <h3>উদাহরণ: 4 জনের ৳12,000-এর ট্যুর</h3>
        <p>
          রহিম ৳6,000, করিম ৳4,000, জামাল ৳2,000 দিয়েছেন, সালাম কিছু দেননি। জনপ্রতি ভাগ ৳12,000 ÷ 4 = ৳3,000। রহিম পাবেন
          ৳3,000, করিম ৳1,000; জামাল দেবেন ৳1,000, সালাম ৳3,000। হিসাব মেটাতে মাত্র দুটি লেনদেন:{" "}
          <strong>সালাম দেবেন রহিমকে ৳3,000, জামাল দেবেন করিমকে ৳1,000।</strong>
        </p>
      </ContentSection>

      <ContentSection id="tips" title="ঝামেলা ছাড়া হিসাবের কয়েকটি কথা">
        <ul>
          <li>যাত্রা শুরুর আগেই ঠিক করে নিন কোন খরচ সবার মধ্যে সমান ভাগ হবে।</li>
          <li>কে কোন খরচ দিলেন, ফোনে বা খাতায় তখনই লিখে রাখুন।</li>
          <li>ভাগ পয়সা পর্যন্ত মেলাতে ক্যালকুলেটর বাড়তি পয়সা প্রথম দিকের মানুষদের ভাগে এক পয়সা করে যোগ করে।</li>
          <li>
            মেসে যাঁরা আলাদা সংখ্যক মিল খান, তাঁদের জন্য{" "}
            <Link href={localePath("bn", calculatorPath("mess-meal-calculator"))} className={link}>
              মেসের মিল ক্যালকুলেটর
            </Link>{" "}
            মিল অনুযায়ী হিসাব করে; নগদ টাকা গুনতে{" "}
            <Link href={localePath("bn", calculatorPath("cash-counter"))} className={link}>
              টাকা গণনা ক্যালকুলেটর
            </Link>{" "}
            দেখুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>প্রত্যেকের নাম (ঐচ্ছিক) আর কত টাকা দিয়েছেন লিখুন; কেউ কিছু না দিলে টাকার ঘর ফাঁকা রাখুন।</li>
          <li>আরও মানুষ থাকলে “ব্যক্তি যোগ করুন” চাপুন।</li>
          <li>“খরচ ভাগ করুন” চাপলে জনপ্রতি ভাগ, প্রত্যেকের ব্যালান্স আর কে কাকে কত দেবেন দেখা যাবে; লেখাটি কপি করে গ্রুপে পাঠান।</li>
        </ol>
        <p>সব হিসাব আপনার ফোনেই হয়; নাম বা টাকার অঙ্ক কোথাও পাঠানো হয় না।</p>
      </ContentSection>
    </>
  );
}

import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** সময় ক্যালকুলেটরের বাংলা ব্যাখ্যা (Server Component)। সংখ্যাগুলো logic.test.ts-এর সঙ্গে মেলে। */
export function TimeAddCalculatorContentBn() {
  const bn = (slug: string) => localePath("bn", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="ঘণ্টা ও মিনিট কীভাবে যোগ করবেন">
        <p>
          <strong>ঘণ্টা যোগ করুন, মিনিট যোগ করুন, তারপর প্রতি 60 মিনিটকে 1 ঘণ্টা বানান।</strong> বিয়োগের সময় মিনিটে না
          কুলালে 1 ঘণ্টাকে 60 মিনিট হিসেবে ধার নিন।
        </p>
        <h3>একটি উদাহরণ</h3>
        <p>তিন দফা পড়া: 2 ঘণ্টা 45 মিনিট, 3 ঘণ্টা 30 মিনিট আর 1 ঘণ্টা 50 মিনিট।</p>
        <ol>
          <li>ঘণ্টা: 2 + 3 + 1 = 6।</li>
          <li>মিনিট: 45 + 30 + 50 = 125 = 2 ঘণ্টা 5 মিনিট।</li>
          <li>মোট: 6 ঘণ্টা + 2 ঘণ্টা 5 মিনিট = 8 ঘণ্টা 5 মিনিট।</li>
          <li>দশমিক ঘণ্টা: 485 মিনিট ÷ 60 = 8.08 ঘণ্টা।</li>
        </ol>
        <p>বিয়োগ: 8 ঘণ্টা 0 মিনিট − 1 ঘণ্টা 15 মিনিট। এক ঘণ্টা ধার নিয়ে: 7 ঘণ্টা 60 মিনিট − 1 ঘণ্টা 15 মিনিট = 6 ঘণ্টা 45 মিনিট, বা 6.75 ঘণ্টা।</p>
      </ContentSection>

      <ContentSection id="decimal-hours" title="মিনিট থেকে দশমিক ঘণ্টা">
        <p>দশমিক ঘণ্টা = মিনিট ÷ 60। টাইমশিট, পে-স্লিপ ও ওভারটাইম শিটে প্রায়ই এভাবে লেখা হয়।</p>
        <ul>
          <li>15 মিনিট = 0.25 ঘণ্টা</li>
          <li>30 মিনিট = 0.5 ঘণ্টা</li>
          <li>45 মিনিট = 0.75 ঘণ্টা</li>
          <li>5 মিনিট ≈ 0.08 ঘণ্টা (2 দশমিক ঘর পর্যন্ত দেখানো)</li>
        </ul>
        <p>
          ওভারটাইম ঘণ্টা-মিনিটে আছে? এখানে দশমিক ঘণ্টায় বদলে{" "}
          <Link href={bn("overtime-calculator")} className={link}>
            ওভারটাইম মজুরি ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন। শুরু ও শেষের সময় থেকে, বিরতি ও রাতের শিফটসহ ঘণ্টা গুনতে{" "}
          <Link href={bn("work-hours-calculator")} className={link}>
            কর্মঘণ্টা ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="অনুমানগুলো">
        <ul>
          <li>প্রতিটি সারি সময়ের পরিমাণ, ঘড়ির সময় নয়, তাই মাঝরাতে কিছু ঘুরে যায় না।</li>
          <li>ঘণ্টা ও মিনিট পূর্ণসংখ্যা; মিনিট 60 বা তার বেশিও হতে পারে।</li>
          <li>এক দিন = 24 ঘণ্টা। মোট 24 ঘণ্টা ছুঁলে পূর্ণ দিনও দেখানো হয়।</li>
          <li>
            দুই তারিখের মাঝে কত দিন, মাস ও বছর, তা জানতে{" "}
            <Link href={bn("date-difference-calculator")} className={link}>
              তারিখের পার্থক্য ক্যালকুলেটর
            </Link>{" "}
            ব্যবহার করুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর কীভাবে ব্যবহার করবেন">
        <ol>
          <li>প্রতিটি সময়ের ঘণ্টা ও মিনিট লিখুন।</li>
          <li>যে সারি বাদ দেবেন সেখানে “− বিয়োগ” বেছে নিন।</li>
          <li>আরও সারি যোগ করুন (সর্বোচ্চ 20), অথবা অপ্রয়োজনীয় সারি ফাঁকা রাখুন।</li>
          <li>“সময় যোগ করুন” চাপলে মোট সময়, দশমিক ঘণ্টা ও মিনিট দেখা যাবে।</li>
        </ol>
        <p>হিসাব আপনার ব্রাউজারেই হয়। সাম্প্রতিক হিসাব শুধু এই ডিভাইসে থাকে, চাইলে বন্ধ করতে পারেন।</p>
      </ContentSection>
    </>
  );
}

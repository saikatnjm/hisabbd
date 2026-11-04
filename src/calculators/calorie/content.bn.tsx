import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { CALORIE_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Bangla explanatory content for the Calorie Calculator (Server Component, no JS). */
export function CalorieCalculatorContentBn() {
  const bn = (slug: string) => localePath("bn", calculatorPath(slug));
  return (
    <>
      <ContentSection id="how-it-works" title="দৈনিক ক্যালরি যেভাবে হিসাব হয়">
        <p>দুই ধাপে:</p>
        <ol>
          <li>
            <strong>বিএমআর = 10 × ওজন (কেজি) + 6.25 × উচ্চতা (সেমি) − 5 × বয়স</strong>, পুরুষের জন্য + 5, নারীর জন্য −
            161 (মিফলিন–সেন্ট জিওর, 1990)।
          </li>
          <li>
            <strong>দৈনিক ক্যালরি = বিএমআর × কাজকর্মের গুণক</strong> (1.2 থেকে 1.9)।
          </li>
        </ol>
        <h3>উদাহরণ</h3>
        <ul>
          <li>
            পুরুষ, 30 বছর, 170 সেমি, 70 কেজি: বিএমআর = 700 + 1,062.5 − 150 + 5 = 1,617.5, প্রায় 1,618 কিলোক্যালরি। মাঝারি
            কাজকর্মে × 1.55 = <strong>প্রায় 2,507 কিলোক্যালরি</strong> দিনে।
          </li>
          <li>
            নারী, 30 বছর, 155 সেমি, 55 কেজি: বিএমআর = 550 + 968.75 − 150 − 161 = 1,207.75, প্রায় 1,208। হালকা কাজকর্মে × 1.375
            = <strong>প্রায় 1,661 কিলোক্যালরি</strong>।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="limits" title="এই হিসাবের সীমা">
        <ul>
          <li>এটি আনুমানিক হিসাব; একই বয়স-ওজনের দুজনের আসল চাহিদা আলাদা হতে পারে।</li>
          <li>
            কাজকর্মের গুণকগুলো (1.2, 1.375, 1.55, 1.725, 1.9) বহুল প্রচলিত রীতি, মিফলিন–সেন্ট জিওরের গবেষণার অংশ নয়।
          </li>
          <li>সূত্রটি 19–78 বছর বয়সী সুস্থ প্রাপ্তবয়স্কদের তথ্য থেকে তৈরি; তাই ক্যালকুলেটর 18–80 বছরের জন্য।</li>
          <li>শিশু, গর্ভাবস্থা বা বুকের দুধ খাওয়ানোর সময়, কিংবা কোনো রোগ থাকলে ডাক্তার বা পুষ্টিবিদের পরামর্শ নিন।</li>
        </ul>
      </ContentSection>

      <ContentSection id="related" title="উচ্চতা-ওজনের অন্য হিসাব">
        <p>
          উচ্চতা ফুট-ইঞ্চিতে জানলে{" "}
          <Link href={bn("height-converter")} className={link}>
            উচ্চতা রূপান্তর
          </Link>{" "}
          দিয়ে সেমিতে নিন, আর ওজন অন্য এককে থাকলে{" "}
          <Link href={bn("weight-converter")} className={link}>
            ওজন রূপান্তর
          </Link>{" "}
          ব্যবহার করুন। ওজন উচ্চতার তুলনায় কেমন, তা দেখতে{" "}
          <Link href={bn("bmi-calculator")} className={link}>
            বিএমআই ক্যালকুলেটর
          </Link>{" "}
          দেখুন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>লিঙ্গ বেছে নিন; সূত্রে পুরুষ আর নারীর জন্য আলাদা ধ্রুবক আছে।</li>
          <li>বয়স (বছরে), উচ্চতা (সেমিতে) আর ওজন (কেজিতে) লিখুন। বাংলা অঙ্কও চলে।</li>
          <li>কাজকর্মের মাত্রা বেছে নিন।</li>
          <li>“ক্যালরি হিসাব করুন” চাপলে দৈনিক ক্যালরি, বিএমআর আর সব মাত্রার টেবিল দেখা যাবে।</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <p>
          <a href={S.mifflin.url} target="_blank" rel="noopener" className={link} lang="en">
            {S.mifflin.title}
          </a>
          । 1 নভেম্বর 2026-এ যাচাই করা।
        </p>
      </ContentSection>
    </>
  );
}

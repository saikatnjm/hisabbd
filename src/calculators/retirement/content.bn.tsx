import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { RETIREMENT_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Bangla explanatory content for the Government Retirement Date Calculator (Server Component, no JS). */
export function RetirementCalculatorContentBn() {
  return (
    <>
      <ContentSection id="rules" title="অবসরের নিয়ম: সরকারি চাকরি আইন 2018">
        <ul>
          <li>
            <strong>ধারা 43:</strong> সরকারি কর্মচারী 59 বছর পূর্তিতে, আর মুক্তিযোদ্ধা সরকারি কর্মচারী 60 বছর পূর্তিতে অবসর গ্রহণ
            করেন।
          </li>
          <li>
            <strong>ধারা 47:</strong> অবসরের পর বিধি সাপেক্ষে সর্বোচ্চ 1 বছর অবসর-উত্তর ছুটি (পিআরএল)।
          </li>
          <li>
            <strong>ধারা 44:</strong> চাকরির 25 বছর পূর্ণ হওয়ার পর যেকোনো সময়, অন্তত 30 দিন আগে লিখিতভাবে জানিয়ে ঐচ্ছিক অবসর;
            জানানোর পর তা বদলানো বা প্রত্যাহার করা যায় না।
          </li>
        </ul>
        <p>
          আইনে “59 বৎসর পূর্তিতে” বলা আছে, কিন্তু সেটি ঠিক কোন তারিখ তা নয়। তাই আমরা আপনার 59 (বা 60) বছর পূর্ণ হওয়ার তারিখ, অর্থাৎ
          সেই বছরের জন্মদিন দেখাই; শেষ কর্মদিবস আপনার অফিসের অবসরের আদেশেই ঠিক হয়।
        </p>
      </ContentSection>

      <ContentSection id="example" title="উদাহরণ">
        <p>
          জন্ম 15 মে 1970, চাকরিতে যোগদান 1 জুলাই 1996। অবসরের তারিখ 15 মে 2029 (59 বছর পূর্তি); 2 নভেম্বর 2026 থেকে আর 2 বছর 6
          মাস 13 দিন বাকি। পিআরএল সর্বোচ্চ 15 মে 2030 পর্যন্ত। 25 বছর পূর্ণ হয়েছে 1 জুলাই 2021-এ, তাই চাইলে 30 দিনের লিখিত নোটিশে
          ঐচ্ছিক অবসর নেওয়া যায়। মুক্তিযোদ্ধা হলে অবসর 15 মে 2030।
        </p>
      </ContentSection>

      <ContentSection id="who" title="কাদের জন্য এই নিয়ম নয়">
        <p>
          3(3) ধারা অনুযায়ী, অন্য আইন বা চুক্তিতে ভিন্ন কিছু না থাকলে এই আইন প্রযোজ্য নয়: সংবিধান দ্বারা সৃষ্ট পদ, বিচার-কর্ম বিভাগ,
          প্রতিরক্ষা-কর্ম বিভাগ, পাবলিক বিশ্ববিদ্যালয়, জাতীয় সংসদ সচিবালয়, সুপ্রীম কোর্ট, নির্বাচন কমিশন সচিবালয়, স্ব-শাসিত
          সংস্থা ও রাষ্ট্রায়ত্ত প্রতিষ্ঠান, স্থানীয় সরকার প্রতিষ্ঠান, উন্নয়ন প্রকল্পের চাকরি, আর এ্যাপ্রেনটিস, চুক্তি, এডহক বা
          অস্থায়ী চাকরি। এঁদের নিজস্ব বিধি দেখুন।
        </p>
        <p>
          সরকারি চাকরিতে ঢোকার বয়সসীমা দেখতে{" "}
          <Link href={localePath("bn", calculatorPath("government-job-age-calculator"))} className={link}>
            সরকারি চাকরির বয়স ক্যালকুলেটর
          </Link>
          , আর সঠিক বয়স জানতে{" "}
          <Link href={localePath("bn", calculatorPath("age-calculator"))} className={link}>
            বয়স ক্যালকুলেটর
          </Link>{" "}
          দেখুন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>জন্ম তারিখ লিখুন; মুক্তিযোদ্ধা সরকারি কর্মচারী হলে ঘরটিতে টিক দিন।</li>
          <li>25 বছরে ঐচ্ছিক অবসরের তারিখ দেখতে চাইলে চাকরিতে যোগদানের তারিখ লিখুন।</li>
          <li>“অবসরের তারিখ বের করুন” চাপলে অবসরের তারিখ, কত বাকি, পিআরএল সর্বোচ্চ কবে পর্যন্ত আর ঐচ্ছিক অবসরের তারিখ দেখা যাবে।</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <p>
          <a href={S.act.url} target="_blank" rel="noopener" className={link}>
            {S.act.title}
          </a>
          , ধারা 3(3), 43, 44, 47। 2 নভেম্বর 2026-এ পড়া ও যাচাই করা। এটি আইনি পরামর্শ নয়।
        </p>
      </ContentSection>
    </>
  );
}

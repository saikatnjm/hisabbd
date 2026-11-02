import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";
import { LABOUR_2026_SOURCES as S } from "../labour-act-2026-amendment/sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Bangla guide: how gratuity is calculated under the Labour Act (Server Component, no JS). */
export function GratuityCalculationGuideContentBn() {
  const exit = localePath("bn", calculatorPath("job-exit-benefit-calculator"));

  return (
    <>
      <ContentSection id="definition" title="আইনে গ্র্যাচুইটির সংজ্ঞা">
        <p>বাংলাদেশ শ্রম আইন 2006-এর 2(10) ধারায় বলা আছে:</p>
        <blockquote className="border-l-4 border-brand-200 pl-4 text-slate-800">
          “গ্রাচুইটি” অর্থ কোন শ্রমিকের প্রতি পূর্ণ বৎসর চাকুরী অথবা ছয় মাসের অতিরিক্ত সময়ের চাকুরীর জন্য তাহার সর্বশেষ প্রাপ্ত
          মজুরী হারে ন্যূনতম 30 দিনের মজুরী অথবা 10 বৎসরের অধিককাল চাকুরীর ক্ষেত্রে তাহার সর্বশেষ প্রাপ্ত মজুরী হারে 45 দিনের
          মজুরী যাহা উক্ত শ্রমিককে তাহার চাকুরীর অবসানে প্রদেয়।
        </blockquote>
      </ContentSection>

      <ContentSection id="formula" title="হিসাবের সূত্র">
        <p>
          <strong>গ্র্যাচুইটি = গোনা বছর × বছরে দিন × দৈনিক মজুরি</strong>
        </p>
        <ul>
          <li>
            <strong>গোনা বছর:</strong> প্রতিটি পূর্ণ বছর, আর শেষে ছয় মাসের বেশি থাকলে আরও এক বছর। 8 বছর 7 মাস = 9 বছর; 8 বছর 5
            মাস = 8 বছর।
          </li>
          <li>
            <strong>বছরে দিন:</strong> ন্যূনতম 30 দিন; চাকরি 10 বছরের বেশি হলে 45 দিন। আমরা সংজ্ঞার ভাষা অনুযায়ী 45 দিন প্রতিটি
            গোনা বছরে ধরি।
          </li>
          <li>
            <strong>দৈনিক মজুরি:</strong> সর্বশেষ মজুরির হার থেকে। চাকরি অবসানের সুবিধার জন্য 14(3) ধারা মজুরি বলতে সর্বশেষ মাসিক
            মূল মজুরি, মহার্ঘ ভাতা আর এডহক বা অন্তর্বর্তী মজুরি বোঝায়। মাসিক মজুরিকে কত দিন দিয়ে ভাগ করে দৈনিক মজুরি হবে, আইনে বলা
            নেই; আপনার মালিক যে সংখ্যা ব্যবহার করেন (প্রায়ই 30 বা 26) সেটিই ধরুন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="examples" title="দুটি উদাহরণ">
        <h3>1. 8 বছর 7 মাস, মজুরি ৳15,000</h3>
        <p>
          মূল মজুরি ৳14,000 আর মহার্ঘ ভাতা ৳1,000, মোট ৳15,000; 30 দিয়ে ভাগ করলে দৈনিক ৳500। গোনা বছর 9 (7 মাস ছয় মাসের বেশি),
          10 বছরের কম তাই বছরে 30 দিন: 9 × 30 × ৳500 = <strong>৳1,35,000</strong>।
        </p>
        <h3>2. 12 বছর 7 মাস, মজুরি ৳30,000</h3>
        <p>
          দৈনিক ৳30,000 ÷ 30 = ৳1,000। গোনা বছর 13, চাকরি 10 বছরের বেশি তাই বছরে 45 দিন: 13 × 45 × ৳1,000 ={" "}
          <strong>৳5,85,000</strong>।
        </p>
      </ContentSection>

      <ContentSection id="when" title="কখন গ্র্যাচুইটি পাবেন">
        <ul>
          <li>
            ছাঁটাই (20 ধারা), ডিসচার্জ (22), মালিকের চাকরি অবসান (26) আর মৃত্যু (19)-তে আইন ক্ষতিপূরণ দেয় “অথবা গ্রাচ্যুইটি, যদি
            প্রদেয় হয়, যাহা অধিক হইবে”: যেটি বেশি সেটি।
          </li>
          <li>
            ইস্তফায় (27 ধারা) 10 বছর বা বেশি চাকরিতে 30 দিনের মজুরি বা গ্র্যাচুইটি, যেটি বেশি; এর কম চাকরিতে 7 বা 15 দিনের মজুরি,
            2026 সালের সংশোধন অনুযায়ী।{" "}
            <Link href={localePath("bn", guidePath("labour-act-2026-amendment"))} className={link}>
              শ্রম আইন সংশোধন 2026
            </Link>{" "}
            দেখুন।
          </li>
          <li>
            আইন “যদি প্রদেয় হয়” বলে, অর্থাৎ প্রতিটি মালিকের গ্র্যাচুইটি ব্যবস্থা থাকতেই হবে এমন কথা এই ধারাগুলোতে নেই। আপনার
            নিয়োগপত্র বা চাকরিবিধিতে গ্র্যাচুইটির কথা আছে কি না দেখুন।
          </li>
        </ul>
        <p>
          নিজের মজুরি আর চাকরির মেয়াদ দিয়ে ক্ষতিপূরণ ও গ্র্যাচুইটি তুলনা করতে{" "}
          <Link href={exit} className={link}>
            চাকরি ছাড়লে কত টাকা পাবেন ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="note" title="মনে রাখুন">
        <p>
          এটি আইনের সাধারণ ব্যাখ্যা, আইনি পরামর্শ নয়। সরকারি কর্মচারীদের পেনশন-গ্র্যাচুইটি আলাদা বিধিতে চলে, এই হিসাব তাঁদের জন্য
          নয়। আপনার নিয়োগপত্র, চাকরিবিধি আর আদালতের সিদ্ধান্তই চূড়ান্ত।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            <a href={S.act.url} target="_blank" rel="noopener" className={link}>
              {S.act.title}
            </a>{" "}
            (ধারা 2(10), 14(3), 19, 20, 22, 26, 27)
          </li>
          <li>
            <a href={S.amendment.url} target="_blank" rel="noopener" className={link}>
              {S.amendment.title}
            </a>
          </li>
        </ul>
        <p>2 নভেম্বর 2026-এ পড়া ও যাচাই করা।</p>
      </ContentSection>
    </>
  );
}

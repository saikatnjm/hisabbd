import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { OVULATION_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Bangla explanatory content for the Ovulation Calculator (Server Component, no JS). */
export function OvulationCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="ডিম্বস্ফোটনের দিন যেভাবে হিসাব হয়">
        <ol>
          <li>
            <strong>পরের মাসিক = শেষ মাসিকের প্রথম দিন + চক্রের দৈর্ঘ্য।</strong>
          </li>
          <li>
            <strong>সম্ভাব্য ডিম্বস্ফোটন = পরের মাসিকের 16 দিন আগে থেকে 10 দিন আগে পর্যন্ত।</strong> এনএইচএস জানায়,
            বেশিরভাগ নারীর ডিম্বস্ফোটন পরের মাসিকের মোটামুটি 10 থেকে 16 দিন আগে হয়; তাই আমরা একটি নির্দিষ্ট দিন না বলে এই
            সময়টুকু দেখাই।
          </li>
        </ol>
        <h3>উদাহরণ</h3>
        <p>
          শেষ মাসিক 20 অক্টোবর 2026, চক্র 28 দিন। পরের মাসিক 20 অক্টোবর + 28 দিন = <strong>17 নভেম্বর</strong>। সম্ভাব্য
          ডিম্বস্ফোটন 17 নভেম্বরের 16 থেকে 10 দিন আগে, অর্থাৎ <strong>1 থেকে 7 নভেম্বর</strong> (চক্রের 13 থেকে 19তম দিন,
          14তম দিনের আশপাশে)। এর পরের চক্রে 29 নভেম্বর থেকে 5 ডিসেম্বর, পরের মাসিক 15 ডিসেম্বর।
        </p>
      </ContentSection>

      <ContentSection id="fertile" title="উর্বর সময় আর এর সীমা">
        <ul>
          <li>শুক্রাণু 7 দিন পর্যন্ত বাঁচতে পারে, তাই ডিম্বস্ফোটনের আগের কয়েক দিনের মিলনেও গর্ভধারণ হতে পারে।</li>
          <li>সন্তান নিতে চাইলে এনএইচএস নির্দিষ্ট একটি দিন না ধরে প্রতি 2–3 দিন অন্তর মিলনের পরামর্শ দেয়।</li>
          <li>এনএইচএসের মতে 21 থেকে 35 দিনের চক্র স্বাভাবিক। চক্র এর বাইরে বা অনিয়মিত হলে তারিখগুলো কম নির্ভরযোগ্য।</li>
          <li>
            এটি জন্মনিয়ন্ত্রণ পদ্ধতি নয়: ডিম্বস্ফোটন আগে বা পরে হতে পারে। নির্ভরযোগ্য পদ্ধতির জন্য ডাক্তার বা পরিবার পরিকল্পনা
            কেন্দ্রের পরামর্শ নিন।
          </li>
        </ul>
        <p>
          গর্ভধারণ হয়ে থাকলে সম্ভাব্য ডেলিভারির তারিখ আর এখন কত সপ্তাহ চলছে, তা দেখতে{" "}
          <Link href={localePath("bn", calculatorPath("pregnancy-calculator"))} className={link}>
            প্রেগন্যান্সি ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন; দুই তারিখের মাঝে দিন গুনতে{" "}
          <Link href={localePath("bn", calculatorPath("date-difference-calculator"))} className={link}>
            তারিখের ব্যবধান ক্যালকুলেটর
          </Link>
          ।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটর যেভাবে ব্যবহার করবেন">
        <ol>
          <li>শেষ মাসিক শুরুর তারিখ লিখুন।</li>
          <li>চক্রের দৈর্ঘ্য দিনে লিখুন (নিশ্চিত না হলে 28 রেখে দিন)।</li>
          <li>“তারিখ দেখুন” চাপলে ডিম্বস্ফোটনের সম্ভাব্য দিন, চক্রের আজ কততম দিন, আর পরের তিনটি মাসিকের তারিখ দেখা যাবে।</li>
        </ol>
        <p>আপনার দেওয়া তারিখ কোথাও পাঠানো হয় না, আর গোপনীয়তার জন্য কোনো হিসাবের তালিকাও রাখা হয় না।</p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            <a href={S.cycle.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.cycle.title}
            </a>{" "}
            (5 জানুয়ারি 2023-এ পর্যালোচিত)।
          </li>
          <li>
            <a href={S.trying.url} target="_blank" rel="noopener" className={link} lang="en">
              {S.trying.title}
            </a>{" "}
            (2 জুন 2026-এ পর্যালোচিত)।
          </li>
        </ul>
        <p>2 নভেম্বর 2026-এ যাচাই করা। এটি চিকিৎসা-পরামর্শ নয়।</p>
      </ContentSection>
    </>
  );
}

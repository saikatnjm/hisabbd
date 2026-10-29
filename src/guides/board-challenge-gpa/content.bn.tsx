import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";
import { BOARD_CHALLENGE_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** One grade higher: change in GPA for 6 main subjects (HSC), before the 5.00 cap. Same figures as the English page. */
const STEPS: readonly [change: string, main: string, fourth: string][] = [
  ["F → D", "ফেল থেকে পাস", "কোনো বদল নেই"],
  ["D → C", "+1 ÷ 6 ≈ +0.17", "কোনো বদল নেই"],
  ["C → B", "+1 ÷ 6 ≈ +0.17", "+1 ÷ 6 ≈ +0.17"],
  ["B → A-", "+0.5 ÷ 6 ≈ +0.08", "+0.5 ÷ 6 ≈ +0.08"],
  ["A- → A", "+0.5 ÷ 6 ≈ +0.08", "+0.5 ÷ 6 ≈ +0.08"],
  ["A → A+", "+1 ÷ 6 ≈ +0.17", "+1 ÷ 6 ≈ +0.17"],
];

/** Bangla guide: how much a board challenge can change an SSC/HSC GPA (Server Component, no JS). */
export function BoardChallengeGpaGuideContentBn() {
  const calculator = localePath("bn", calculatorPath("ssc-hsc-gpa-calculator"));

  return (
    <>
      <ContentSection id="dates" title="এইচএসসি 2026: ফল ও আবেদনের তারিখ">
        <ul>
          <li>
            <strong>ফল প্রকাশ:</strong> শনিবার, 31 অক্টোবর 2026, বেলা 11টা। ফল দেখা যাবে{" "}
            <a href={S.results.url} target="_blank" rel="noopener" className={link}>
              {S.results.title}
            </a>{" "}
            সহ বোর্ডগুলোর ওয়েবসাইটে।
          </li>
          <li>
            <strong>খাতা চ্যালেঞ্জের আবেদন:</strong> 1 থেকে 7 নভেম্বর 2026।
          </li>
        </ul>
        <p>
          আবেদনের পদ্ধতি আর প্রতি পত্রের ফি বোর্ডের বিজ্ঞপ্তিতে জানানো হয়। 29 অক্টোবর পর্যন্ত 2026-এর বিজ্ঞপ্তি
          প্রকাশ হয়নি, তাই আমরা আগাম কোনো ফি লিখছি না। গত বছর (2025) আবেদন হয়েছিল শুধু অনলাইনে; দুই পত্রের
          বিষয়ে দুটো পত্রের জন্যই আবেদন করতে হয়েছিল, আর ফি জমা দেওয়ার পর আবেদন বাতিল বা ফি ফেরত হয়নি। এবারের
          নিয়ম বিজ্ঞপ্তিতে মিলিয়ে নিন।
        </p>
      </ContentSection>

      <ContentSection id="what-is-checked" title="খাতা চ্যালেঞ্জে কী যাচাই হয়">
        <p>
          আগে পুনঃনিরীক্ষায় খাতা নতুন করে মূল্যায়ন করা হতো না। দেখা হতো প্রতিটি প্রশ্নে পাওয়া নম্বর ঠিকভাবে যোগ
          হয়েছে কি না, আর নম্বর ঠিকঠাক ওঠানো হয়েছে কি না। ঢাকা বোর্ডের চেয়ারম্যান 2024 সালের এইচএসসির সময় এ কথা
          জানিয়েছিলেন।
        </p>
        <p>
          2026 সালের এসএসসিতে নিয়ম বদলেছে: পুনঃনিরীক্ষার জন্য জমা পড়া খাতাগুলো নতুন করে মূল্যায়ন করা হয়েছে বলে
          আন্তঃশিক্ষা বোর্ড সমন্বয় কমিটির সভাপতি জানিয়েছেন। এইচএসসি 2026-এও একই নিয়ম চলবে কি না, আর নতুন মূল্যায়নে
          নম্বর কমতে পারে কি না, তা আমরা কোনো আনুষ্ঠানিক সূত্রে পাইনি। বোর্ডের বিজ্ঞপ্তিতে দেখে নিন।
        </p>
      </ContentSection>

      <ContentSection id="table" title="এক গ্রেড বাড়লে জিপিএ কত বাড়ে">
        <p>
          এইচএসসির 6টি মূল বিষয় ধরে হিসাব। চতুর্থ বিষয়ে শুধু 2.00-এর ওপরের অংশ বোনাস হিসেবে যোগ হয়, তাই সেখানে C
          বা তার নিচের গ্রেডে বদল কোনো কাজে আসে না।
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>গ্রেডের বদল</th>
                <th scope="col" className={head}>মূল বিষয়ে</th>
                <th scope="col" className={head}>চতুর্থ বিষয়ে</th>
              </tr>
            </thead>
            <tbody>
              {STEPS.map(([change, main, fourth]) => (
                <tr key={change}>
                  <td className={cell}>{change}</td>
                  <td className={cell}>{main}</td>
                  <td className={cell}>{fourth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          এগুলো 5.00-এর সীমার আগের হিসাব; জিপিএ 5.00-এর বেশি হয় না। বোর্ড দুই দশমিক পর্যন্ত দেখায়, তাই দেখানো
          জিপিএ-তে বদলটা 0.08 বা 0.09, অথবা 0.16 বা 0.17 হতে পারে। এসএসসির মতো যেখানে মূল বিষয় বেশি, সেখানে একই
          বদলে জিপিএ বাড়ে আরও কম: নিজের মূল বিষয়ের সংখ্যা দিয়ে ভাগ করুন।
        </p>
      </ContentSection>

      <ContentSection id="examples" title="তিনটি উদাহরণ">
        <h3>1. A- থেকে A: জিপিএ 4.75 থেকে 4.83</h3>
        <p>
          বিজ্ঞান বিভাগের এক শিক্ষার্থীর গ্রেড: বাংলা A, ইংরেজি A-, আইসিটি A+, পদার্থবিজ্ঞান A, রসায়ন A+, উচ্চতর
          গণিত A+, আর চতুর্থ বিষয় জীববিজ্ঞানে A। মূল বিষয়ে 26.5 পয়েন্ট, বোনাস 2, জিপিএ (26.5 + 2) ÷ 6 = 4.75।
        </p>
        <ul>
          <li>ইংরেজি A- থেকে A হলে: (27 + 2) ÷ 6 = 4.833…, অর্থাৎ <strong>4.83</strong>।</li>
          <li>বাংলা A থেকে A+ হলে: (27.5 + 2) ÷ 6 = 4.916…, অর্থাৎ <strong>4.92</strong>।</li>
          <li>চতুর্থ বিষয় জীববিজ্ঞান A থেকে A+ হলে: (26.5 + 3) ÷ 6 = <strong>4.92</strong>।</li>
        </ul>
        <p>
          খেয়াল করুন, চতুর্থ বিষয় বদলালে মোট জিপিএ বাড়ে, কিন্তু চতুর্থ বিষয় ছাড়া জিপিএ (এখানে 4.42) একই থাকে।
          কোনো ভর্তি সার্কুলার চতুর্থ বিষয় ছাড়া জিপিএ চাইলে শুধু মূল বিষয়ের বদলই সেটা বাড়ায়।
        </p>

        <h3>2. একটি F: ফেল থেকে জিপিএ 2.83</h3>
        <p>
          ব্যবসায় শিক্ষার এক শিক্ষার্থী: বাংলা B, ইংরেজি F, আইসিটি A-, হিসাববিজ্ঞান B, ফিন্যান্স A-, ব্যবসায়
          সংগঠন B, চতুর্থ বিষয় অর্থনীতিতে C। ইংরেজিতে F থাকায় ফল ফেল। ইংরেজি F থেকে D হলে মূল বিষয়ে 3 + 1 + 3.5 +
          3 + 3.5 + 3 = 17 পয়েন্ট, চতুর্থ বিষয়ে C তাই বোনাস 0, জিপিএ 17 ÷ 6 = 2.833…, অর্থাৎ{" "}
          <strong>2.83, পাস</strong>। খাতা চ্যালেঞ্জে সবচেয়ে বড় পার্থক্য এখানেই হয়।
        </p>

        <h3>3. জিপিএ আগেই 5.00: জিপিএ বদলায় না</h3>
        <p>
          ইংরেজিতে A, বাকি পাঁচটি মূল বিষয়ে A+, চতুর্থ বিষয়ে A+। হিসাব (29 + 3) ÷ 6 = 5.33, দেখানো হয় 5.00।
          ইংরেজি A+ হলেও (30 + 3) ÷ 6 = 5.50, জিপিএ সেই 5.00-ই। বদলাবে শুধু বিষয়ের গ্রেড, যা কোনো সার্কুলার
          নির্দিষ্ট বিষয়ে গ্রেড চাইলে কাজে লাগতে পারে।
        </p>
      </ContentSection>

      <ContentSection id="should-you-apply" title="আবেদন করবেন কি না: তিনটি প্রশ্ন">
        <ol>
          <li>
            <strong>কোনো মূল বিষয়ে F আছে, অথচ আপনার ধারণা আপনি পাস করেছেন?</strong> এখানেই খাতা চ্যালেঞ্জ সবচেয়ে
            বেশি বদলাতে পারে।
          </li>
          <li>
            <strong>যে ভর্তি পরীক্ষায় আবেদন করবেন, তার ন্যূনতম জিপিএ বা কোনো বিষয়ের গ্রেড থেকে আপনি সামান্য
            নিচে?</strong> ওপরের টেবিল দেখে হিসাব করুন এক গ্রেড বাড়লে সেই সীমা পার হয় কি না। সার্কুলার মোট জিপিএ
            চায় নাকি চতুর্থ বিষয় ছাড়া জিপিএ, সেটাও দেখুন।
          </li>
          <li>
            <strong>কোনো বিষয়ের গ্রেড আপনার প্রত্যাশার চেয়ে অনেক কম?</strong> এক-দুই নম্বরের জন্য গ্রেড আটকে থাকলে
            যোগে ভুলেই তা হতে পারে।
          </li>
        </ol>
        <p>
          উল্টো দিকে, জিপিএ আগেই 5.00 হলে, বা যে বিষয়ে আবেদন করছেন সেটি চতুর্থ বিষয় এবং বড়জোর C পর্যন্ত উঠতে পারে,
          তাহলে জিপিএ বদলাবে না। ফি দেওয়ার আগে এই হিসাবটা করে নিন। জিপিএ কীভাবে হিসাব হয়, তা বিস্তারিত পড়ুন{" "}
          <Link href={localePath("bn", guidePath("ssc-hsc-gpa-calculation"))} className={link}>
            এসএসসি ও এইচএসসি জিপিএ হিসাবের নিয়ম
          </Link>{" "}
          গাইডে।
        </p>
      </ContentSection>

      <ContentSection id="steps" title="নিজের হিসাব এক মিনিটে">
        <ol>
          <li>
            <Link href={calculator} className={link}>
              জিপিএ ক্যালকুলেটরে
            </Link>{" "}
            মার্কশিটের সব মূল বিষয় আর চতুর্থ বিষয়ের গ্রেড দিন। জিপিএ যেন বোর্ডের ফলের সঙ্গে মেলে।
          </li>
          <li>যে বিষয়ে চ্যালেঞ্জ করবেন, তার গ্রেড এক ধাপ বাড়িয়ে আবার হিসাব করুন।</li>
          <li>দুটো জিপিএ তুলনা করুন। আগের হিসাব “আপনার সাম্প্রতিক হিসাব” অংশে থেকে যায়।</li>
        </ol>
        <p>
          আপনার গ্রেড আর জিপিএ আপনার ফোন বা কম্পিউটারের বাইরে কোথাও যায় না; সাম্প্রতিক হিসাব শুধু এই ডিভাইসে
          থাকে, আর চাইলে মুছে ফেলা যায়।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র ও তারিখ">
        <p>সব তথ্য 29 অক্টোবর 2026-এ যাচাই করা। বোর্ডের বিজ্ঞপ্তিই চূড়ান্ত।</p>
        <ul>
          <li>
            ফল প্রকাশ ও আবেদনের তারিখ:{" "}
            <a href={S.dates.url} target="_blank" rel="noopener" className={link}>
              {S.dates.title}
            </a>
            ।
          </li>
          <li>
            পুনঃনিরীক্ষায় শুধু নম্বর যোগ যাচাই (এইচএসসি 2024):{" "}
            <a href={S.recheckOnly.url} target="_blank" rel="noopener" className={link}>
              {S.recheckOnly.title}
            </a>
            ।
          </li>
          <li>
            এসএসসি 2026-এ খাতা নতুন করে মূল্যায়ন:{" "}
            <a href={S.ssc2026Reevaluated.url} target="_blank" rel="noopener" className={link}>
              {S.ssc2026Reevaluated.title}
            </a>
            ।
          </li>
          <li>
            2025-এর আবেদন পদ্ধতি:{" "}
            <a href={S.process2025.url} target="_blank" rel="noopener" className={link}>
              {S.process2025.title}
            </a>
            ।
          </li>
          <li>
            জিপিএ-র নিয়ম: বহুল প্রচলিত বোর্ডের চর্চা, যা আমাদের{" "}
            <Link href={calculator} className={link}>
              ক্যালকুলেটর
            </Link>{" "}
            মেনে চলে। নিয়মগুলো জানিয়ে কোনো আনুষ্ঠানিক প্রজ্ঞাপন আমরা অনলাইনে পাইনি।
          </li>
        </ul>
      </ContentSection>
    </>
  );
}

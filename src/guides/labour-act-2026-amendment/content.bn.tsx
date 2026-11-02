import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { LABOUR_2026_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3 align-top";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Each change: topic, what the 2026 Act says now, section. Quoted from Act No. 43 of 2026. */
const CHANGES: readonly [topic: string, now: string, section: string][] = [
  ["ইস্তফায় ক্ষতিপূরণ (স্থায়ী শ্রমিক)", "প্রতি সম্পূর্ণ বছরে: 3 বছর পর্যন্ত চাকরিতে 7 দিনের মজুরি; 3-এর বেশি কিন্তু 10 বছরের কমে 15 দিনের; 10 বছর বা বেশিতে 30 দিনের মজুরি বা গ্র্যাচুইটি, যেটি বেশি। অন্য সব সুবিধার অতিরিক্ত।", "27(4)"],
  ["ক্ষতিপূরণে কোন মজুরি", "চাকরি অবসানের আগের সর্বশেষ মাসিক মূল মজুরি ও মহার্ঘ ভাতা, আর এডহক বা অন্তর্বর্তী মজুরি থাকলে তা।", "14(3)"],
  ["“এক বছর” চাকরি কাকে বলে", "আগের 12 পঞ্জিকা মাসে বাস্তবে অন্তত 240 দিন কাজ (আর 6 মাসে অন্তত 120 দিন কাজ হলে “ছয় মাস”)।", "14(1)"],
  ["উৎসব ছুটি", "বছরে 13 দিন (আগে “এগারো” দিন)।", "118(1)"],
  ["প্রসূতি ছুটি", "মোট 120 দিন (আগে “ষোল সপ্তাহ”); প্রসবের আগে ও পরে 60 দিন করে (আগে “আট সপ্তাহ”)।", "46, 47, 14(2)"],
  ["অর্জিত ছুটিতে প্রসূতি ছুটি", "অনধিক 120 দিনের প্রসূতি ছুটিও কাজের দিন বলে গণ্য।", "117(8)(ঘ)"],
];

/** Bangla guide: what the Labour (Amendment) Act 2026 changed for pay and leave (Server Component, no JS). */
export function LabourAct2026AmendmentGuideContentBn() {
  const exit = localePath("bn", calculatorPath("job-exit-benefit-calculator"));

  return (
    <>
      <ContentSection id="when" title="আইনটি কবে থেকে কার্যকর">
        <p>
          বাংলাদেশ শ্রম (সংশোধন) আইন, 2026 হলো 2026 সনের 43 নং আইন, তারিখ 10 এপ্রিল 2026। আইনটির 1(2) ধারায় বলা আছে,
          “ইহা অবিলম্বে কার্যকর হইবে।” এখানে শুধু শ্রমিকের টাকা আর ছুটি নিয়ে যে পরিবর্তনগুলো আমাদের ক্যালকুলেটরের সঙ্গে জড়িত,
          সেগুলো তুলে ধরা হলো; ট্রেড ইউনিয়নসহ অন্য পরিবর্তনের জন্য পুরো আইন পড়ুন।
        </p>
      </ContentSection>

      <ContentSection id="changes" title="কী কী বদলাল">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>বিষয়</th>
                <th scope="col" className={head}>এখন আইনে যা আছে</th>
                <th scope="col" className={head}>ধারা</th>
              </tr>
            </thead>
            <tbody>
              {CHANGES.map(([topic, now, section]) => (
                <tr key={topic}>
                  <td className={`${cell} font-medium text-slate-900`}>{topic}</td>
                  <td className={cell}>{now}</td>
                  <td className={`${cell} whitespace-nowrap`}>{section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="resignation" title="ইস্তফা দিলে কত পাবেন: উদাহরণ">
        <p>
          নতুন 27(4) উপ-ধারার মূল কথা: <strong>প্রথম সম্পূর্ণ বছর থেকেই</strong> ইস্তফায় ক্ষতিপূরণ, আর হার নির্ভর করে মোট
          চাকরির মেয়াদের ওপর। ইস্তফার আগে 60 দিনের লিখিত নোটিশ দেওয়ার নিয়ম 27(1) উপ-ধারায় আছে।
        </p>
        <ol>
          <li>একজন স্থায়ী শ্রমিক 4 বছর 8 মাস চাকরি করে নোটিশ দিয়ে ইস্তফা দিলেন; শেষ মাসিক মূল মজুরি ৳20,000।</li>
          <li>সম্পূর্ণ বছর 4, যা 3-এর বেশি আর 10-এর কম, তাই প্রতি বছরে 15 দিনের মজুরি।</li>
          <li>
            আইনে মাসিক মজুরি থেকে দৈনিক মজুরি বের করার নিয়ম বলা নেই। আপনার মালিক 30 দিন দিয়ে ভাগ করলে দৈনিক মজুরি ৳20,000 ÷ 30 =
            ৳666.67।
          </li>
          <li>
            ক্ষতিপূরণ = 4 × 15 × ৳666.67 = <strong>৳40,000</strong>।
          </li>
        </ol>
        <p>
          নিজের মজুরি আর চাকরির মেয়াদ দিয়ে হিসাব করতে{" "}
          <Link href={exit} className={link}>
            চাকরি ছাড়লে কত টাকা পাবেন ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন; ছাঁটাই, ডিসচার্জ আর মালিকের চাকরি অবসানের হিসাবও সেখানে আছে।
        </p>
      </ContentSection>

      <ContentSection id="leave" title="ছুটির পরিবর্তন">
        <ul>
          <li>উৎসব ছুটি এখন বছরে 13 দিন; উৎসবের দিনে কাজ করালে বিকল্প ছুটি আর ক্ষতিপূরণের নিয়ম 118 ধারায়।</li>
          <li>প্রসূতি ছুটি এখন 120 দিন, আর এই ছুটির দিনগুলো অর্জিত ছুটির হিসাবে কাজের দিন বলে ধরা হয়।</li>
          <li>
            অর্জিত ছুটি কত জমল আর চাকরি ছাড়লে তার টাকা কত, দেখতে{" "}
            <Link href={localePath("bn", calculatorPath("earned-leave-calculator"))} className={link}>
              অর্জিত ছুটি ক্যালকুলেটর
            </Link>
            ; ওভারটাইমের জন্য{" "}
            <Link href={localePath("bn", calculatorPath("overtime-calculator"))} className={link}>
              ওভারটাইম ক্যালকুলেটর
            </Link>
            ।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="note" title="মনে রাখুন">
        <p>
          এটি আইনের সাধারণ ব্যাখ্যা, আইনি পরামর্শ নয়। 10 এপ্রিল 2026-এর আগে চাকরি শেষ হলে তখনকার আইন প্রযোজ্য হতে পারে। আপনার
          নিয়োগপত্র, চাকরিবিধি আর আদালতের সিদ্ধান্তই চূড়ান্ত; সন্দেহ থাকলে শ্রম আদালত বা আইনজীবীর পরামর্শ নিন।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র">
        <ul>
          <li>
            <a href={S.amendment.url} target="_blank" rel="noopener" className={link}>
              {S.amendment.title}
            </a>
          </li>
          <li>
            <a href={S.act.url} target="_blank" rel="noopener" className={link}>
              {S.act.title}
            </a>
          </li>
        </ul>
        <p>2 নভেম্বর 2026-এ পড়া ও যাচাই করা।</p>
      </ContentSection>
    </>
  );
}

import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath, guides } from "@/guides/registry";
import { localePath, type Locale } from "@/i18n/locales";
import { formatPlainDate } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

const STRINGS = {
  en: {
    title: "How We Check Our Numbers",
    intro:
      "Every figure on HisabBD comes from a formula you can see or from an official, dated source. Here is how we work, and when each rule was last reviewed.",
    rulesTitle: "Our rules",
    rules: [
      "Every calculator shows its formula and a worked example on its page, and automated tests check that the calculator gives exactly those numbers.",
      "Figures that change by law or order (rates, charges, limits, fees) come from the official notice, with the date we checked it. The page shows “Rules last reviewed”.",
      "We don’t guess. If we can’t find the official text, we don’t publish the figure: the income tax calculator, for example, waits for the Finance Act’s rate schedule.",
      "Where a figure is only reported (for example a meter rent quoted in the news) the page says so, and you can change any pre-filled figure to match your own bill or notice.",
      "Health pages use published medical formulas and guidance (ACOG, NHS, WHO, the Mifflin–St Jeor equation) and say clearly that they are not medical advice.",
      "What you type never leaves your device. No inputs or results are sent to a server, put in links or recorded in analytics.",
    ],
    testsTitle: "How every change is tested",
    tests:
      "Before anything ships, the calculation tests, a type check and a production build must pass, and a browser test opens every calculator in Bangla and English, checks an empty form shows an error and checks a real calculation shows a result.",
    reviewedTitle: "When each rule was last reviewed",
    reviewedIntro: "Calculators and guides whose figures depend on a rule, order or notice, newest review first:",
    page: "Page",
    reviewed: "Last reviewed",
    calculatorsTitle: "Calculators",
    guidesTitle: "Guides",
    whenTitle: "When rules change",
    when:
      "We re-check figures when the source changes: after each budget (from July), each BERC tariff order, each Sanchayapatra rate notice (January and July), each BCS circular and each board notice. Until a page is updated, the date above tells you how fresh it is, and the official notice always wins.",
  },
  bn: {
    title: "আমরা কীভাবে হিসাব যাচাই করি",
    intro:
      "HisabBD-র প্রতিটি সংখ্যা আসে দেখা যায় এমন সূত্র থেকে, নয়তো তারিখসহ অফিশিয়াল উৎস থেকে। আমরা কীভাবে কাজ করি, আর কোন নিয়ম শেষ কবে যাচাই হয়েছে, তা এখানে।",
    rulesTitle: "আমাদের নিয়ম",
    rules: [
      "প্রতিটি ক্যালকুলেটরের পাতায় সূত্র আর একটি উদাহরণ থাকে, আর স্বয়ংক্রিয় পরীক্ষা দেখে নেয় ক্যালকুলেটর ঠিক সেই সংখ্যাগুলোই দেয়।",
      "যে সংখ্যা আইন বা আদেশে বদলায় (হার, চার্জ, সীমা, ফি), তা নেওয়া হয় অফিশিয়াল বিজ্ঞপ্তি থেকে, যাচাইয়ের তারিখসহ। পাতায় “নিয়ম সর্বশেষ যাচাই” তারিখ দেখানো হয়।",
      "আমরা অনুমান করি না। অফিশিয়াল লেখা না পেলে সংখ্যাটি প্রকাশ করি না; যেমন আয়কর ক্যালকুলেটর অর্থ আইনের করহারের তফসিলের অপেক্ষায় আছে।",
      "কোনো সংখ্যা শুধু সংবাদে প্রকাশিত হলে (যেমন মিটার ভাড়া) পাতায় তা বলা থাকে, আর আগে থেকে বসানো যেকোনো সংখ্যা নিজের বিল বা বিজ্ঞপ্তি অনুযায়ী বদলানো যায়।",
      "স্বাস্থ্যের পাতাগুলো প্রকাশিত চিকিৎসা-সূত্র ও নির্দেশনা (এসিওজি, এনএইচএস, বিশ্ব স্বাস্থ্য সংস্থা, মিফলিন–সেন্ট জিওর সূত্র) ব্যবহার করে, আর স্পষ্ট বলে যে এগুলো চিকিৎসা-পরামর্শ নয়।",
      "আপনার লেখা কিছুই আপনার ডিভাইসের বাইরে যায় না। কোনো ইনপুট বা ফল সার্ভারে পাঠানো, লিংকে রাখা বা অ্যানালিটিক্সে রেকর্ড করা হয় না।",
    ],
    testsTitle: "প্রতিটি পরিবর্তন যেভাবে পরীক্ষা হয়",
    tests:
      "কোনো কিছু প্রকাশের আগে হিসাবের পরীক্ষা, টাইপ যাচাই আর প্রোডাকশন বিল্ড পাস করতে হয়, আর ব্রাউজার-পরীক্ষা প্রতিটি ক্যালকুলেটর বাংলা ও ইংরেজিতে খুলে দেখে ফাঁকা ফর্মে ত্রুটি আর সঠিক তথ্যে ফল দেখায় কি না।",
    reviewedTitle: "কোন নিয়ম শেষ কবে যাচাই হয়েছে",
    reviewedIntro: "যেসব ক্যালকুলেটর ও গাইডের সংখ্যা কোনো নিয়ম, আদেশ বা বিজ্ঞপ্তির ওপর নির্ভর করে, সাম্প্রতিক যাচাই আগে:",
    page: "পাতা",
    reviewed: "সর্বশেষ যাচাই",
    calculatorsTitle: "ক্যালকুলেটর",
    guidesTitle: "গাইড",
    whenTitle: "নিয়ম বদলালে",
    when:
      "উৎস বদলালে আমরা সংখ্যা আবার যাচাই করি: প্রতি বাজেটের পর (জুলাই থেকে), বিইআরসির প্রতিটি ট্যারিফ আদেশের পর, সঞ্চয়পত্রের হারের প্রতিটি বিজ্ঞপ্তির পর (জানুয়ারি ও জুলাই), প্রতিটি বিসিএস সার্কুলার আর বোর্ডের বিজ্ঞপ্তির পর। পাতা হালনাগাদ না হওয়া পর্যন্ত ওপরের তারিখ দেখে বুঝবেন তথ্য কতটা নতুন; অফিশিয়াল বিজ্ঞপ্তিই সবসময় চূড়ান্ত।",
  },
} as const;

interface ReviewedItem {
  key: string;
  name: string;
  href: string;
  date: string;
}

function byNewest(a: ReviewedItem, b: ReviewedItem): number {
  return b.date.localeCompare(a.date) || a.name.localeCompare(b.name);
}

/** "How we check our numbers": principles plus every rule review date, generated from the registries. */
export function MethodologyPage({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const bn = locale === "bn";
  const reviewedCalculators: ReviewedItem[] = calculators
    .filter((c) => c.updatedOn)
    .map((c) => ({ key: c.slug, name: bn ? c.nameBn : c.name, href: localePath(locale, calculatorPath(c.slug)), date: c.updatedOn! }))
    .sort(byNewest);
  const reviewedGuides: ReviewedItem[] = guides
    .filter((g) => g.updatedOn)
    .map((g) => ({ key: g.slug, name: bn ? g.titleBn : g.title, href: localePath(locale, guidePath(g.slug)), date: g.updatedOn! }))
    .sort(byNewest);
  const date = (iso: string) => {
    const parsed = parsePlainDate(iso);
    return parsed ? formatPlainDate(parsed, { locale }) : iso;
  };

  const reviewTable = (items: ReviewedItem[]) => (
    <div className="overflow-x-auto">
      <table className={table}>
        <thead>
          <tr>
            <th scope="col" className={head}>{t.page}</th>
            <th scope="col" className={head}>{t.reviewed}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <td className={cell}>
                <Link href={item.href} className={link}>
                  {item.name}
                </Link>
              </td>
              <td className={`${cell} whitespace-nowrap`}>{date(item.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ProsePage locale={locale} title={t.title} intro={t.intro}>
      <ContentSection id="rules" title={t.rulesTitle}>
        <ul>
          {t.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </ContentSection>
      <ContentSection id="tests" title={t.testsTitle}>
        <p>{t.tests}</p>
      </ContentSection>
      <ContentSection id="reviewed" title={t.reviewedTitle}>
        <p>{t.reviewedIntro}</p>
        <h3>{t.calculatorsTitle}</h3>
        {reviewTable(reviewedCalculators)}
        {reviewedGuides.length > 0 && (
          <>
            <h3>{t.guidesTitle}</h3>
            {reviewTable(reviewedGuides)}
          </>
        )}
      </ContentSection>
      <ContentSection id="when" title={t.whenTitle}>
        <p>{t.when}</p>
      </ContentSection>
    </ProsePage>
  );
}

import { categories } from "@/calculators/categories";
import { getFeaturedCalculators, getOtherCalculators } from "@/calculators/featured";
import { calculatorPath, categoryHref } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { buildCategorySearchIndex, buildSearchIndex } from "@/calculators/search";
import type { CalculatorMeta } from "@/calculators/types";
import { upcomingCalculatorNames } from "@/calculators/upcoming";
import { CalculatorList } from "@/components/calculator/calculator-list";
import { CalculatorSearch } from "@/components/calculator/calculator-search";
import { QuickPicks, type QuickPick } from "@/components/calculator/quick-picks";
import { CategoryList } from "@/components/calculator/category-list";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { BoltIcon, PhoneIcon, TagIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { localePath, type Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { websiteSchema } from "@/lib/seo/structured-data";

/** Decorative keypad in the hero. Colours reuse the category tokens. */
const heroKeys = [
  { glyph: "+", className: "bg-health-soft text-health-ink -rotate-6" },
  { glyph: "−", className: "bg-education-soft text-education-ink rotate-3 mt-6" },
  { glyph: "×", className: "bg-finance-soft text-finance-ink -rotate-3" },
  { glyph: "÷", className: "bg-date-time-soft text-date-time-ink rotate-6 -mt-3" },
  { glyph: "%", className: "bg-everyday-soft text-everyday-ink -rotate-2 mt-4" },
  { glyph: "=", className: "bg-brand-600 text-white rotate-3" },
] as const;

interface HomeStrings {
  heroBadgeEquals: string;
  heroIntro: string;
  categoriesTitle: string;
  categoriesDescription: string;
  startTitle: string;
  startDescription: string;
  startDescriptionEmpty: string;
  moreTitle: string;
  whyHeadingParts: [string, string, string];
  benefits: readonly { title: string; text: string }[];
  aboutTitle: string;
  aboutP1: React.ReactNode;
  aboutP2: string;
  upcomingNote: (names: string) => string;
  upcomingHeading: string;
  upcomingIntro: string;
  listJoiner: string;
}

const STRINGS: Record<Locale, HomeStrings> = {
  en: {
    heroBadgeEquals: "calculation",
    heroIntro: "Need to calculate something? Find a calculator and get your answer in seconds.",
    categoriesTitle: "What are you figuring out today?",
    categoriesDescription: "Pick a topic to see its calculators.",
    startTitle: "Good places to start",
    startDescription: "Handy calculators to try first.",
    startDescriptionEmpty: "We’re building HisabBD one calculator at a time.",
    moreTitle: "More calculators",
    whyHeadingParts: ["Simple", "fast", "free"],
    benefits: [
      { title: "Free, no signup", text: "Every calculator is free to use. No account, no app to install." },
      {
        title: "Instant results",
        text: "The maths runs in your browser, so answers appear straight away. What you type isn’t sent to a server.",
      },
      {
        title: "Easy on any phone",
        text: "Big inputs, clear results and short explanations, made for phones first.",
      },
      {
        title: "Made for Bangladesh",
        text: "Taka amounts, day-month-year dates and the calculations people here use every day.",
      },
    ],
    aboutTitle: `About ${siteConfig.name}`,
    aboutP1: (
      <>
        <span lang="bn">হিসাব</span> (hisab) is the Bangla word for calculation. {siteConfig.name} is a
        growing set of free calculators for everyday life in Bangladesh: the sums you’d otherwise work
        out on a phone calculator, in a notebook margin or in a spreadsheet.
      </>
    ),
    aboutP2:
      "Each calculator gives a clear answer and a short explanation of how it was worked out. No calculator gymnastics required.",
    upcomingNote: (names) => `Our first calculators are on the way: ${names} come first.`,
    upcomingHeading: "The first calculators are on the way",
    upcomingIntro: "Here’s what’s coming, in order:",
    listJoiner: " and ",
  },
  bn: {
    heroBadgeEquals: "ক্যালকুলেশন",
    heroIntro: "কিছু হিসাব করা দরকার? ক্যালকুলেটর খুঁজে নিন, সেকেন্ডেই উত্তর পেয়ে যান।",
    categoriesTitle: "আজ কী হিসাব করছেন?",
    categoriesDescription: "বিষয় বেছে নিলেই তার ক্যালকুলেটরগুলো দেখতে পাবেন।",
    startTitle: "শুরু করার জন্য ভালো কিছু",
    startDescription: "প্রথমে দেখার মতো কাজের কিছু ক্যালকুলেটর।",
    startDescriptionEmpty: "আমরা একটার পর একটা ক্যালকুলেটর দিয়ে HisabBD গড়ে তুলছি।",
    moreTitle: "আরও ক্যালকুলেটর",
    whyHeadingParts: ["সহজ", "দ্রুত", "ফ্রি"],
    benefits: [
      {
        title: "ফ্রি, সাইনআপ ছাড়া",
        text: "প্রতিটি ক্যালকুলেটর ফ্রি। কোনো অ্যাকাউন্ট লাগে না, অ্যাপ ইনস্টলও করতে হয় না।",
      },
      {
        title: "সাথে সাথে ফলাফল",
        text: "হিসাবটা আপনার ব্রাউজারেই হয়, তাই উত্তর আসে সাথে সাথে। আপনি যা লেখেন তা কোনো সার্ভারে পাঠানো হয় না।",
      },
      {
        title: "যেকোনো ফোনে সহজ",
        text: "বড় ইনপুট, পরিষ্কার ফলাফল আর ছোট ব্যাখ্যা — প্রথমেই ফোনের কথা ভেবে বানানো।",
      },
      {
        title: "বাংলাদেশের জন্য তৈরি",
        text: "টাকার অঙ্ক, দিন-মাস-বছর তারিখ আর এখানকার মানুষের রোজকার হিসাব।",
      },
    ],
    aboutTitle: `${siteConfig.name} সম্পর্কে`,
    aboutP1: (
      <>
        হিসাব — ক্যালকুলেশনের বাংলা শব্দটাই আমাদের নাম। {siteConfig.name} হলো বাংলাদেশের দৈনন্দিন জীবনের
        জন্য ক্রমবর্ধমান একগুচ্ছ ফ্রি ক্যালকুলেটর: যে হিসাবগুলো আপনি নইলে ফোনের ক্যালকুলেটরে, খাতার কোণে বা
        স্প্রেডশিটে করতেন।
      </>
    ),
    aboutP2:
      "প্রতিটি ক্যালকুলেটর পরিষ্কার উত্তর দেয়, সাথে ছোট করে বুঝিয়ে দেয় হিসাবটা কীভাবে হলো। ক্যালকুলেটর নিয়ে কসরত করতে হয় না।",
    upcomingNote: (names) => `আমাদের প্রথম ক্যালকুলেটরগুলো আসছে: শুরুতে থাকছে ${names}।`,
    upcomingHeading: "প্রথম ক্যালকুলেটরগুলো আসছে",
    upcomingIntro: "যা যা আসছে, ক্রম অনুযায়ী:",
    listJoiner: " ও ",
  },
};

function formatList(items: readonly string[], joiner: string): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")}${joiner}${items.at(-1)}`;
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const bn = locale === "bn";
  const tagline = bn ? siteConfig.taglineBn : siteConfig.tagline;
  const featured = getFeaturedCalculators();
  const hasCalculators = calculators.length > 0;
  const others = getOtherCalculators();
  const upcomingNote = hasCalculators
    ? undefined
    : t.upcomingNote(formatList(upcomingCalculatorNames.slice(0, 3), t.listJoiner));

  const toQuickPick = (calc: CalculatorMeta): QuickPick => ({
    slug: calc.slug,
    href: localePath(locale, calculatorPath(calc.slug)),
    label: bn ? calc.nameBn.replace(/ ক্যালকুলেটর$/, "") : calc.name.replace(/ Calculator$/, ""),
  });

  return (
    <>
      <JsonLd schemas={[websiteSchema(locale)]} />
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-brand-100 bg-brand-50 bg-graph"
      >
        {/* Faint symbols on small screens, where the keypad is hidden */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 right-3 font-display text-7xl font-bold text-brand-600/10 select-none lg:hidden"
        >
          <span className="inline-block -rotate-12">+</span>
          <span className="ml-3 inline-block translate-y-8 rotate-6">÷</span>
        </div>

        <Container className="relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
              <span lang="bn" className="font-semibold text-slate-900">
                হিসাব
              </span>
              <span aria-hidden="true" className="font-bold text-coral-500">
                =
              </span>
              <span>{t.heroBadgeEquals}</span>
            </p>
            <h1
              id="hero-heading"
              className="mt-4 max-w-xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-slate-900 sm:text-6xl"
            >
              {tagline}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-pretty text-slate-700">{t.heroIntro}</p>

            <div className="mt-8 max-w-xl">
              <CalculatorSearch
                calculators={buildSearchIndex(calculators, locale)}
                categories={buildCategorySearchIndex(categories, locale)}
                suggestions={buildSearchIndex(featured, locale)}
                upcomingNote={upcomingNote}
              />
              {featured.length > 0 ? (
                <QuickPicks featured={featured.map(toQuickPick)} all={calculators.map(toQuickPick)} />
              ) : (
                <p className="mt-4 text-sm text-slate-600">{upcomingNote}</p>
              )}
            </div>
          </div>

          <div aria-hidden="true" className="hidden justify-self-center lg:block">
            <div className="grid grid-cols-3 gap-4 select-none">
              {heroKeys.map((key, index) => (
                <span
                  key={key.glyph}
                  style={{ animationDelay: `${index * 70}ms` }}
                  className={cn(
                    "key-drop flex size-24 items-center justify-center rounded-3xl font-display text-5xl font-bold shadow-key xl:size-28 xl:text-6xl",
                    key.className,
                  )}
                >
                  {key.glyph}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Section id="categories" title={t.categoriesTitle} description={t.categoriesDescription}>
        <CategoryList locale={locale} getHref={(category) => localePath(locale, categoryHref(category.id))} />
      </Section>

      <Section
        id="calculators"
        title={t.startTitle}
        description={hasCalculators ? t.startDescription : t.startDescriptionEmpty}
        className="pt-0 sm:pt-0"
      >
        <CalculatorList
          calculators={featured}
          locale={locale}
          emptyState={
            <div className="rounded-2xl border-2 border-dashed border-slate-300 p-5 sm:p-6">
              <h3 className="font-display text-lg font-semibold text-slate-900">{t.upcomingHeading}</h3>
              <p className="mt-1 text-slate-600">{t.upcomingIntro}</p>
              <ol className="mt-4 flex flex-wrap gap-2">
                {upcomingCalculatorNames.map((name) => (
                  <li
                    key={name}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    {name}
                  </li>
                ))}
              </ol>
            </div>
          }
        />
      </Section>

      {others.length > 0 && (
        <Section id="more-calculators" title={t.moreTitle} className="pt-0 sm:pt-0">
          <CalculatorList calculators={others} locale={locale} />
        </Section>
      )}

      {/* Why HisabBD */}
      <section aria-labelledby="why-heading" className="bg-brand-800 py-12 text-white sm:py-16">
        <Container>
          <h2
            id="why-heading"
            className="max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl"
          >
            {t.whyHeadingParts[0]} <span className="text-sun-300">+</span> {t.whyHeadingParts[1]}{" "}
            <span className="text-sun-300">+</span> {t.whyHeadingParts[2]}{" "}
            <span className="text-sun-300">=</span> {siteConfig.name}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.benefits.map((benefit, index) => (
              <li key={benefit.title}>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-sun-300">
                  {benefitIcon(index)}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-1 text-sm text-brand-100">{benefit.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* About */}
      <section aria-labelledby="about-heading" id="about" className="scroll-mt-4 py-12 sm:py-16">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12">
          <p
            aria-hidden="true"
            lang="bn"
            className="hidden font-display text-8xl font-bold text-brand-100 select-none lg:block"
          >
            হিসাব
          </p>
          <div className="max-w-2xl">
            <h2
              id="about-heading"
              className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              {t.aboutTitle}
            </h2>
            <p className="mt-4 text-lg text-pretty text-slate-700">{t.aboutP1}</p>
            <p className="mt-3 text-lg text-pretty text-slate-700">{t.aboutP2}</p>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Benefit icons by position (same visuals in both languages). */
function benefitIcon(index: number): React.ReactNode {
  switch (index) {
    case 0:
      return <TagIcon className="size-6" />;
    case 1:
      return <BoltIcon className="size-6" />;
    case 2:
      return <PhoneIcon className="size-6" />;
    default:
      return (
        <span className="font-display text-2xl leading-none font-bold" lang="bn">
          ৳
        </span>
      );
  }
}

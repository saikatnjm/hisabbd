import type { Metadata } from "next";
import { categories } from "@/calculators/categories";
import { getFeaturedCalculators, getOtherCalculators } from "@/calculators/featured";
import { OG_IMAGE } from "@/calculators/metadata";
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
import { cn } from "@/lib/cn";
import { websiteSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_BD",
    url: "/",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [OG_IMAGE.url],
  },
};

/** Decorative keypad in the hero. Colours reuse the category tokens. */
const heroKeys = [
  { glyph: "+", className: "bg-health-soft text-health-ink -rotate-6" },
  { glyph: "−", className: "bg-education-soft text-education-ink rotate-3 mt-6" },
  { glyph: "×", className: "bg-finance-soft text-finance-ink -rotate-3" },
  { glyph: "÷", className: "bg-date-time-soft text-date-time-ink rotate-6 -mt-3" },
  { glyph: "%", className: "bg-everyday-soft text-everyday-ink -rotate-2 mt-4" },
  { glyph: "=", className: "bg-brand-600 text-white rotate-3" },
] as const;

const benefits = [
  {
    title: "Free, no signup",
    text: "Every calculator is free to use. No account, no app to install.",
    icon: <TagIcon className="size-6" />,
  },
  {
    title: "Instant results",
    text: "The maths runs in your browser, so answers appear straight away. What you type isn’t sent to a server.",
    icon: <BoltIcon className="size-6" />,
  },
  {
    title: "Easy on any phone",
    text: "Big inputs, clear results and short explanations, made for phones first.",
    icon: <PhoneIcon className="size-6" />,
  },
  {
    title: "Made for Bangladesh",
    text: "Taka amounts, day-month-year dates and the calculations people here use every day.",
    icon: (
      <span className="font-display text-2xl leading-none font-bold" lang="bn">
        ৳
      </span>
    ),
  },
] as const;

function formatList(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function toQuickPick(calc: CalculatorMeta): QuickPick {
  return { slug: calc.slug, href: calculatorPath(calc.slug), label: calc.name.replace(/ Calculator$/, "") };
}

export default function HomePage() {
  const featured = getFeaturedCalculators();
  const hasCalculators = calculators.length > 0;
  const others = getOtherCalculators();
  const upcomingNote = hasCalculators
    ? undefined
    : `Our first calculators are on the way: ${formatList(upcomingCalculatorNames.slice(0, 3))} come first.`;

  return (
    <>
      <JsonLd schemas={[websiteSchema()]} />
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
              <span>calculation</span>
            </p>
            <h1
              id="hero-heading"
              className="mt-4 max-w-xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-slate-900 sm:text-6xl"
            >
              {siteConfig.tagline}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-pretty text-slate-700">
              Need to calculate something? Find a calculator and get your answer in seconds.
            </p>

            <div className="mt-8 max-w-xl">
              <CalculatorSearch
                calculators={buildSearchIndex(calculators)}
                categories={buildCategorySearchIndex(categories)}
                suggestions={buildSearchIndex(featured)}
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

      <Section
        id="categories"
        title="What are you figuring out today?"
        description="Pick a topic to see its calculators."
      >
        <CategoryList getHref={(category) => categoryHref(category.id)} />
      </Section>

      <Section
        id="calculators"
        title="Good places to start"
        description={
          hasCalculators
            ? "Handy calculators to try first."
            : "We’re building HisabBD one calculator at a time."
        }
        className="pt-0 sm:pt-0"
      >
        <CalculatorList
          calculators={featured}
          emptyState={
            <div className="rounded-2xl border-2 border-dashed border-slate-300 p-5 sm:p-6">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                The first calculators are on the way
              </h3>
              <p className="mt-1 text-slate-600">Here’s what’s coming, in order:</p>
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
        <Section id="more-calculators" title="More calculators" className="pt-0 sm:pt-0">
          <CalculatorList calculators={others} />
        </Section>
      )}

      {/* Why HisabBD */}
      <section aria-labelledby="why-heading" className="bg-brand-800 py-12 text-white sm:py-16">
        <Container>
          <h2
            id="why-heading"
            className="max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl"
          >
            Simple <span className="text-sun-300">+</span> fast <span className="text-sun-300">+</span>{" "}
            free <span className="text-sun-300">=</span> {siteConfig.name}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <li key={benefit.title}>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-sun-300">
                  {benefit.icon}
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
              About {siteConfig.name}
            </h2>
            <p className="mt-4 text-lg text-pretty text-slate-700">
              <span lang="bn">হিসাব</span> (hisab) is the Bangla word for calculation. {siteConfig.name}{" "}
              is a growing set of free calculators for everyday life in Bangladesh: the sums you’d
              otherwise work out on a phone calculator, in a notebook margin or in a spreadsheet.
            </p>
            <p className="mt-3 text-lg text-pretty text-slate-700">
              Each calculator gives a clear answer and a short explanation of how it was worked
              out. No calculator gymnastics required.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

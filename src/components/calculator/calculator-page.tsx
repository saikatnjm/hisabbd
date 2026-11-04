import { LazyLink as Link } from "@/components/ui/lazy-link";
import { getCategory } from "@/calculators/categories";
import { CALCULATORS_PATH, calculatorPath, categoryHref } from "@/calculators/paths";
import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { CalculatorProvider } from "@/components/calculator/calculator-context";
import { CalculatorPageActions } from "@/components/calculator/calculator-page-actions";
import { EmbedCode } from "@/components/calculator/embed-code";
import { FaqList } from "@/components/calculator/faq-list";
import { NextCalculators } from "@/components/calculator/next-calculators";
import { RelatedCalculators } from "@/components/calculator/related-calculators";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { breadcrumbSchema, calculatorSchema, faqSchema } from "@/lib/seo/structured-data";
import { guidePath, getGuidesForCalculator } from "@/guides/registry";
import { absoluteUrl } from "@/config/site";
import { formatPlainDate } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

/**
 * Shared page shell for every calculator: breadcrumb, H1 and intro from the
 * registry, the interactive calculator, explanatory content, FAQ and related
 * calculators, plus matching structured data. Each calculator route only
 * supplies its widget and content.
 */
export function CalculatorPage({
  calculator,
  children,
  content,
  locale = "en",
}: {
  calculator: CalculatorMeta;
  /** The interactive calculator (a small Client Component). */
  children: React.ReactNode;
  /** Explanatory content (Server Component). */
  content?: React.ReactNode;
  locale?: Locale;
}) {
  const t = ui[locale];
  const bn = locale === "bn";
  const category = getCategory(calculator.category);
  const faqs = (bn ? calculator.faqsBn : calculator.faqs) ?? [];
  const name = bn ? calculator.nameBn : calculator.name;
  const reviewed = calculator.updatedOn ? parsePlainDate(calculator.updatedOn) : null;
  const calculatorGuides = getGuidesForCalculator(calculator.slug);
  const crumbs = [
    { name: t.nav.home, path: localePath(locale, "/") },
    { name: t.nav.calculators, path: localePath(locale, CALCULATORS_PATH) },
    { name, path: localePath(locale, calculatorPath(calculator.slug)) },
  ];

  return (
    <article>
      <JsonLd
        schemas={[
          calculatorSchema(calculator, locale),
          breadcrumbSchema(crumbs),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
        ]}
      />
      {/* Compact on phones so the first field is on the first screen; page tools sit under the calculator. */}
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-4 sm:py-8">
          <div className="hidden sm:block">
            <Breadcrumbs
              items={[
                { name: t.nav.home, href: localePath(locale, "/") },
                { name: t.nav.calculators, href: localePath(locale, CALCULATORS_PATH) },
                { name },
              ]}
            />
          </div>
          <div className="flex items-center gap-3 sm:mt-6 sm:gap-4">
            <CalculatorIconTile icon={calculator.icon} category={calculator.category} size="lg" className="bg-white" />
            <div className="min-w-0">
              <h1
                lang={locale}
                className="font-display text-2xl leading-tight font-bold tracking-tight text-balance text-slate-900 sm:text-5xl"
              >
                {name}
              </h1>
              <p lang={bn ? "en" : "bn"} className="hidden text-sm text-slate-600 sm:block">
                {bn ? calculator.name : calculator.nameBn}
              </p>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-base text-pretty text-slate-700 sm:mt-4 sm:text-lg">{bn ? calculator.summaryBn : calculator.summary}</p>
          {reviewed && <p className="mt-1 text-sm text-slate-600 sm:mt-2">{t.calculatorPage.lastReviewed(formatPlainDate(reviewed, { locale }))}</p>}
        </Container>
      </div>

      <Container className="py-5 sm:py-10">
        <div className="max-w-3xl">
          <CalculatorProvider slug={calculator.slug} name={name}>
            {children}
          </CalculatorProvider>
          <div className="mt-6 print:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={localePath(locale, categoryHref(category.id))}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-1 pr-3 pl-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-brand-800"
              >
                <CategoryIcon category={category.id} size="sm" />
                {t.calculatorPage.moreInCategory(bn ? category.nameBn : category.name)}
              </Link>
            </div>
            <CalculatorPageActions slug={calculator.slug} name={name} />
            {calculatorGuides.length > 0 && (
              <ul className="mt-3 space-y-1">
                {calculatorGuides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={localePath(locale, guidePath(guide.slug))}
                      className="text-sm font-semibold text-brand-700 underline underline-offset-4"
                    >
                      {t.guides.readGuide(bn ? guide.titleBn : guide.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <NextCalculators calculator={calculator} locale={locale} />
          <p className="mt-6 hidden text-sm text-slate-600 print:block">
            {name} · HisabBD · {absoluteUrl(localePath(locale, calculatorPath(calculator.slug)))}
          </p>
        </div>
      </Container>

      <Container className="pb-12 sm:pb-16 print:hidden">
        <div className="max-w-3xl space-y-10 sm:space-y-12">
          {content}

          {faqs.length > 0 && (
            <section aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900"
              >
                {t.calculatorPage.faqHeading}
              </h2>
              <FaqList items={faqs} />
            </section>
          )}
        </div>

        <RelatedCalculators calculator={calculator} locale={locale} className="mt-12" />
        <div className="max-w-3xl">
          <EmbedCode slug={calculator.slug} name={name} locale={locale} />
        </div>
      </Container>
    </article>
  );
}

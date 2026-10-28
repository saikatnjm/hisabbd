import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { getCalculator } from "@/calculators/registry";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { GUIDES_PATH, guidePath, guides } from "@/guides/registry";
import type { GuideMeta } from "@/guides/types";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import { formatPlainDate } from "@/lib/format";
import { parsePlainDate } from "@/lib/plain-date";
import { articleSchema, breadcrumbSchema, organizationSchema } from "@/lib/seo/structured-data";

function displayDate(iso: string, locale: Locale): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date, { locale }) : iso;
}

/**
 * A guide article: breadcrumb, H1, summary and dates, the article itself, a
 * call to action for its calculator, and other guides. Article and
 * BreadcrumbList structured data match what is shown.
 */
export function GuidePage({ guide, locale, content }: { guide: GuideMeta; locale: Locale; content: React.ReactNode }) {
  const t = ui[locale];
  const bn = locale === "bn";
  const title = bn ? guide.titleBn : guide.title;
  const calculator = getCalculator(guide.calculator);
  const calculatorName = calculator ? (bn ? calculator.nameBn : calculator.name) : "";
  const others = guides.filter((g) => g.slug !== guide.slug);
  const crumbs = [
    { name: t.nav.home, path: localePath(locale, "/") },
    { name: t.nav.guides, path: localePath(locale, GUIDES_PATH) },
    { name: title, path: localePath(locale, guidePath(guide.slug)) },
  ];

  return (
    <article>
      <JsonLd schemas={[organizationSchema(), articleSchema(guide, locale), breadcrumbSchema(crumbs)]} />
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-5 sm:py-8">
          <Breadcrumbs
            items={[
              { name: t.nav.home, href: localePath(locale, "/") },
              { name: t.nav.guides, href: localePath(locale, GUIDES_PATH) },
              { name: title },
            ]}
          />
          <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:mt-6 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-pretty text-slate-700">{bn ? guide.summaryBn : guide.summary}</p>
          <p className="mt-2 text-sm text-slate-600">
            {t.guides.published(displayDate(guide.publishedOn, locale))}
            {guide.updatedOn && ` · ${t.guides.updated(displayDate(guide.updatedOn, locale))}`}
          </p>
        </Container>
      </div>

      <Container className="py-8 sm:py-12">
        <div className="max-w-3xl space-y-10 sm:space-y-12">
          {content}

          {calculator && (
            <Link
              href={localePath(locale, calculatorPath(calculator.slug))}
              className="group flex items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 font-semibold text-slate-900 shadow-lift transition-colors hover:border-brand-400 sm:p-5"
            >
              <CalculatorIconTile icon={calculator.icon} category={calculator.category} size="lg" className="bg-white" />
              <span className="min-w-0 flex-1 font-display text-lg leading-snug sm:text-xl">
                {t.guides.useCalculator(calculatorName)}
              </span>
              <ArrowRightIcon className="size-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          {others.length > 0 && (
            <nav aria-labelledby="more-guides-heading">
              <h2 id="more-guides-heading" className="font-display text-xl font-bold text-slate-900">
                {t.guides.moreGuides}
              </h2>
              <ul className="mt-3 space-y-2">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={localePath(locale, guidePath(g.slug))}
                      className="font-semibold text-brand-700 underline underline-offset-4"
                    >
                      {bn ? g.titleBn : g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Container>
    </article>
  );
}

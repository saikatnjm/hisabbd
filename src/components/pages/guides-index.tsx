import Link from "next/link";
import { categories } from "@/calculators/categories";
import { categoryHref } from "@/calculators/paths";
import { getCalculator } from "@/calculators/registry";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { cardClasses } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { GUIDES_PATH, guidePath, guides } from "@/guides/registry";
import type { GuideMeta } from "@/guides/types";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import { cn } from "@/lib/cn";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

/** The /guides hub, shared by both locales: guides grouped by their calculator's category. */
export function GuidesIndexPage({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const bn = locale === "bn";

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: t.nav.home, path: localePath(locale, "/") },
            { name: t.nav.guides, path: localePath(locale, GUIDES_PATH) },
          ]),
        ]}
      />
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-6 sm:py-10">
          <Breadcrumbs items={[{ name: t.nav.home, href: localePath(locale, "/") }, { name: t.nav.guides }]} />
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t.guides.hubTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-700">{t.guides.hubIntro}</p>
        </Container>
      </div>
      <Container className="space-y-12 py-10 sm:py-14">
        {categories.map((category) => {
          const inCategory = guides.filter((g) => getCalculator(g.calculator)?.category === category.id);
          if (inCategory.length === 0) return null;
          const headingId = `guides-${category.id}`;
          return (
            <section key={category.id} aria-labelledby={headingId}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 id={headingId} className="font-display text-2xl font-bold tracking-tight text-slate-900">
                  {bn ? category.nameBn : category.name}
                </h2>
                <Link
                  href={localePath(locale, categoryHref(category.id))}
                  className="text-sm font-semibold text-brand-700 underline underline-offset-4"
                >
                  {t.calculatorPage.moreInCategory(bn ? category.nameBn : category.name)}
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inCategory.map((guide) => (
                  <GuideCard key={guide.slug} guide={guide} locale={locale} />
                ))}
              </ul>
            </section>
          );
        })}
      </Container>
    </>
  );
}

function GuideCard({ guide, locale }: { guide: GuideMeta; locale: Locale }) {
  const bn = locale === "bn";
  const calculator = getCalculator(guide.calculator);
  return (
    <li>
      <Link
        href={localePath(locale, guidePath(guide.slug))}
        className={cn(cardClasses, "flex h-full flex-col gap-3 p-5 transition-colors hover:border-brand-300 hover:bg-brand-50")}
      >
        {calculator && <CalculatorIconTile icon={calculator.icon} category={calculator.category} />}
        <h3 className="font-display text-lg leading-snug font-semibold text-slate-900">{bn ? guide.titleBn : guide.title}</h3>
        <p className="text-sm text-slate-700">{bn ? guide.summaryBn : guide.summary}</p>
      </Link>
    </li>
  );
}

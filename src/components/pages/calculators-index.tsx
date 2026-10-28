import Link from "next/link";
import { categories } from "@/calculators/categories";
import { CALCULATORS_PATH, categoryHref } from "@/calculators/paths";
import { getCalculatorsByCategory } from "@/calculators/registry";
import { CalculatorList } from "@/components/calculator/calculator-list";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

const STRINGS = {
  en: { h1: "All calculators", intro: "Every HisabBD calculator, grouped by topic." },
  bn: { h1: "সব ক্যালকুলেটর", intro: "HisabBD-র সব ক্যালকুলেটর, বিষয় অনুযায়ী সাজানো।" },
} satisfies Record<Locale, { h1: string; intro: string }>;

/** The /calculators index, shared by both locales. */
export function CalculatorsIndexPage({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const nav = ui[locale].nav;
  const groups = categories
    .map((category) => ({ category, items: getCalculatorsByCategory(category.id) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: nav.home, path: localePath(locale, "/") },
            { name: nav.calculators, path: localePath(locale, CALCULATORS_PATH) },
          ]),
        ]}
      />
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-6 sm:py-10">
          <Breadcrumbs
            items={[{ name: nav.home, href: localePath(locale, "/") }, { name: nav.calculators }]}
          />
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t.h1}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-700">{t.intro}</p>
        </Container>
      </div>
      <Container className="space-y-10 py-10 sm:py-14">
        {groups.map(({ category, items }) => (
          <section key={category.id} aria-labelledby={`group-${category.id}`}>
            <h2
              id={`group-${category.id}`}
              className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900"
            >
              <Link
                href={localePath(locale, categoryHref(category.id))}
                className="underline-offset-4 hover:text-brand-800 hover:underline"
              >
                {locale === "bn" ? category.nameBn : category.name}
              </Link>
            </h2>
            <CalculatorList calculators={items} headingLevel="h3" locale={locale} />
          </section>
        ))}
      </Container>
    </>
  );
}

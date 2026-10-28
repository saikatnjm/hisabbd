import Link from "next/link";
import { categories } from "@/calculators/categories";
import { CALCULATORS_PATH, categoryHref } from "@/calculators/paths";
import { getCalculatorsByCategory } from "@/calculators/registry";
import type { Category } from "@/calculators/types";
import { CalculatorList } from "@/components/calculator/calculator-list";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

interface CategoryStrings {
  heading: (name: string) => string;
  empty: string;
  browseAll: string;
  otherCategories: string;
}

const STRINGS: Record<Locale, CategoryStrings> = {
  en: {
    heading: (name) => `${name} calculators`,
    empty: "No calculators in this category yet.",
    browseAll: "Browse all calculators",
    otherCategories: "Other categories",
  },
  bn: {
    heading: (name) => `${name} বিভাগের ক্যালকুলেটর`,
    empty: "এই বিভাগে এখনো কোনো ক্যালকুলেটর নেই।",
    browseAll: "সব ক্যালকুলেটর দেখুন",
    otherCategories: "অন্যান্য বিভাগ",
  },
};

/** A /categories/<id> page, shared by both locales. */
export function CategoryPageView({ category, locale }: { category: Category; locale: Locale }) {
  const t = STRINGS[locale];
  const nav = ui[locale].nav;
  const bn = locale === "bn";
  const name = bn ? category.nameBn : category.name;
  const items = getCalculatorsByCategory(category.id);
  const others = categories.filter((c) => c.id !== category.id);
  const crumbs = [
    { name: nav.home, path: localePath(locale, "/") },
    { name: nav.calculators, path: localePath(locale, CALCULATORS_PATH) },
    { name, path: localePath(locale, categoryHref(category.id)) },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(crumbs)]} />
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-5 sm:py-8">
          <Breadcrumbs
            items={[
              { name: nav.home, href: localePath(locale, "/") },
              { name: nav.calculators, href: localePath(locale, CALCULATORS_PATH) },
              { name },
            ]}
          />
          <div className="mt-4 flex items-center gap-4 sm:mt-6">
            <CategoryIcon category={category.id} size="lg" className="bg-white" />
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {t.heading(name)}
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-slate-700 sm:mt-4">
            {bn ? category.descriptionBn : category.description}
          </p>
        </Container>
      </div>

      <Container className="py-8 sm:py-12">
        <CalculatorList
          calculators={items}
          headingLevel="h2"
          locale={locale}
          emptyState={
            <p className="rounded-2xl border-2 border-dashed border-slate-300 p-5 text-slate-700">
              {t.empty}{" "}
              <Link
                href={localePath(locale, CALCULATORS_PATH)}
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                {t.browseAll}
              </Link>
              .
            </p>
          }
        />

        <nav aria-labelledby="other-categories" className="mt-12">
          <h2 id="other-categories" className="mb-3 font-display text-xl font-bold text-slate-900">
            {t.otherCategories}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.id}>
                <Link
                  href={localePath(locale, categoryHref(c.id))}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 font-semibold text-slate-800 transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <CategoryIcon category={c.id} size="sm" />
                  {locale === "bn" ? c.nameBn : c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/calculators/categories";
import { pageMetadata } from "@/calculators/metadata";
import { CALCULATORS_PATH, categoryHref } from "@/calculators/paths";
import { getCalculatorsByCategory } from "@/calculators/registry";
import { CATEGORY_IDS } from "@/calculators/types";
import { CalculatorList } from "@/components/calculator/calculator-list";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

type Params = Promise<{ category: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_IDS.map((category) => ({ category }));
}

function findCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = findCategory((await params).category);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name} Calculators`,
    description: `${category.description} Free, fast and easy to use on any phone.`,
    path: categoryHref(category.id),
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const category = findCategory((await params).category);
  if (!category) notFound();
  const items = getCalculatorsByCategory(category.id);
  const others = categories.filter((c) => c.id !== category.id);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: CALCULATORS_PATH },
    { name: category.name, path: categoryHref(category.id) },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(crumbs)]} />
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-5 sm:py-8">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Calculators", href: CALCULATORS_PATH },
              { name: category.name },
            ]}
          />
          <div className="mt-4 flex items-center gap-4 sm:mt-6">
            <CategoryIcon category={category.id} size="lg" className="bg-white" />
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {category.name} calculators
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-slate-700 sm:mt-4">{category.description}</p>
        </Container>
      </div>

      <Container className="py-8 sm:py-12">
        <CalculatorList
          calculators={items}
          headingLevel="h2"
          emptyState={
            <p className="rounded-2xl border-2 border-dashed border-slate-300 p-5 text-slate-700">
              No calculators in this category yet.{" "}
              <Link href={CALCULATORS_PATH} className="font-semibold text-brand-700 underline underline-offset-4">
                Browse all calculators
              </Link>
              .
            </p>
          }
        />

        <nav aria-labelledby="other-categories" className="mt-12">
          <h2 id="other-categories" className="mb-3 font-display text-xl font-bold text-slate-900">
            Other categories
          </h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.id}>
                <Link
                  href={categoryHref(c.id)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 font-semibold text-slate-800 transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <CategoryIcon category={c.id} size="sm" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </>
  );
}

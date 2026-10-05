import Link from "next/link";
import { categories } from "@/calculators/categories";
import { pageMetadata } from "@/calculators/metadata";
import { CALCULATORS_PATH, categoryHref } from "@/calculators/paths";
import { getCalculatorsByCategory } from "@/calculators/registry";
import { CalculatorList } from "@/components/calculator/calculator-list";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata = pageMetadata({
  title: "All Calculators",
  description:
    "Every free HisabBD calculator in one place: health, education, finance, everyday and date calculators, grouped by topic.",
  path: CALCULATORS_PATH,
});

export default function CalculatorsPage() {
  const groups = categories
    .map((category) => ({ category, items: getCalculatorsByCategory(category.id) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Calculators", path: CALCULATORS_PATH },
          ]),
        ]}
      />
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-6 sm:py-10">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Calculators" }]} />
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            All calculators
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-700">
            Every HisabBD calculator, grouped by topic.
          </p>
        </Container>
      </div>
      <Container className="space-y-10 py-10 sm:py-14">
        {groups.map(({ category, items }) => (
          <section key={category.id} aria-labelledby={`group-${category.id}`}>
            <h2
              id={`group-${category.id}`}
              className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900"
            >
              <Link href={categoryHref(category.id)} className="underline-offset-4 hover:text-brand-800 hover:underline">
                {category.name}
              </Link>
            </h2>
            <CalculatorList calculators={items} headingLevel="h3" />
          </section>
        ))}
      </Container>
    </>
  );
}

import Link from "next/link";
import { getCategory } from "@/calculators/categories";
import { CALCULATORS_PATH, calculatorPath, categoryHref } from "@/calculators/paths";
import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { CalculatorProvider } from "@/components/calculator/calculator-context";
import { CalculatorPageActions } from "@/components/calculator/calculator-page-actions";
import { FaqList } from "@/components/calculator/faq-list";
import { NextCalculators } from "@/components/calculator/next-calculators";
import { RelatedCalculators } from "@/components/calculator/related-calculators";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { breadcrumbSchema, calculatorSchema, faqSchema } from "@/lib/seo/structured-data";

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
}: {
  calculator: CalculatorMeta;
  /** The interactive calculator (a small Client Component). */
  children: React.ReactNode;
  /** Explanatory content (Server Component). */
  content?: React.ReactNode;
}) {
  const category = getCategory(calculator.category);
  const faqs = calculator.faqs ?? [];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: CALCULATORS_PATH },
    { name: calculator.name, path: calculatorPath(calculator.slug) },
  ];

  return (
    <article>
      <JsonLd
        schemas={[
          calculatorSchema(calculator),
          breadcrumbSchema(crumbs),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
        ]}
      />
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-5 sm:py-8">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Calculators", href: CALCULATORS_PATH },
              { name: calculator.name },
            ]}
          />
          <div className="mt-4 flex items-center gap-4 sm:mt-6">
            <CalculatorIconTile icon={calculator.icon} category={calculator.category} size="lg" className="bg-white" />
            <div className="min-w-0">
              <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl">
                {calculator.name}
              </h1>
              <p lang="bn" className="text-sm text-slate-600">
                {calculator.nameBn}
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-pretty text-slate-700 sm:mt-4">{calculator.summary}</p>
          <Link
            href={categoryHref(category.id)}
            className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg bg-white/80 py-1 pr-3 pl-1 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-brand-800"
          >
            <CategoryIcon category={category.id} size="sm" />
            More {category.name} calculators
          </Link>
          <CalculatorPageActions slug={calculator.slug} name={calculator.name} />
        </Container>
      </div>

      <Container className="py-6 sm:py-10">
        <div className="max-w-3xl">
          <CalculatorProvider slug={calculator.slug}>{children}</CalculatorProvider>
          <NextCalculators calculator={calculator} />
        </div>
      </Container>

      <Container className="pb-12 sm:pb-16">
        <div className="max-w-3xl space-y-10 sm:space-y-12">
          {content}

          {faqs.length > 0 && (
            <section aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900"
              >
                Frequently asked questions
              </h2>
              <FaqList items={faqs} />
            </section>
          )}
        </div>

        <RelatedCalculators calculator={calculator} className="mt-12" />
      </Container>
    </article>
  );
}

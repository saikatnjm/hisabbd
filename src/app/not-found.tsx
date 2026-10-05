import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/calculators/categories";
import { getFeaturedCalculators } from "@/calculators/featured";
import { CALCULATORS_PATH } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { buildCategorySearchIndex, buildSearchIndex } from "@/calculators/search";
import { CalculatorList } from "@/components/calculator/calculator-list";
import { CalculatorSearch } from "@/components/calculator/calculator-search";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** 404: helps visitors find a calculator instead of a dead end. */
export default function NotFound() {
  return (
    <>
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-10 sm:py-14">
          <p className="font-display text-6xl font-bold text-brand-600" aria-hidden="true">
            4 ÷ 0 ?
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            This page doesn’t exist
          </h1>
          <p className="mt-3 max-w-xl text-lg text-slate-700">
            The link may be old or mistyped. Search for the calculator you need, or browse them all.
          </p>
          <div className="mt-6 max-w-xl">
            <CalculatorSearch
              calculators={buildSearchIndex(calculators)}
              categories={buildCategorySearchIndex(categories)}
              suggestions={buildSearchIndex(getFeaturedCalculators())}
            />
          </div>
          <Link href={CALCULATORS_PATH} className={buttonClasses({ variant: "secondary", className: "mt-6" })}>
            See all calculators
          </Link>
        </Container>
      </div>
      <Container className="py-10 sm:py-14">
        <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900">
          Popular starting points
        </h2>
        <CalculatorList calculators={getFeaturedCalculators()} />
      </Container>
    </>
  );
}

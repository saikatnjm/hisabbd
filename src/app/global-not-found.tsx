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
import { LocaleShell } from "@/components/layout/locale-shell";
import { RootDocument, rootMetadata } from "@/components/layout/root-document";
import { localePath } from "@/i18n/locales";

export const metadata: Metadata = {
  ...rootMetadata("en"),
  title: "Page not found | HisabBD",
  robots: { index: false },
};

/**
 * 404 for any unmatched URL, English and Bangla alike. With one root layout
 * per locale there is no shared layout to render it, so this file renders the
 * whole document itself (needs `experimental.globalNotFound`). It can't tell
 * which locale was requested, so it says the key line in both languages.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <LocaleShell locale="en">
        <div className="border-b border-brand-100 bg-brand-50 bg-graph">
          <Container className="py-10 sm:py-14">
            <p className="font-display text-6xl font-bold text-brand-600" aria-hidden="true">
              4 ÷ 0 ?
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              This page doesn’t exist
            </h1>
            <p lang="bn" className="mt-2 font-display text-xl font-semibold text-slate-700">
              এই পেজটি খুঁজে পাওয়া যায়নি।{" "}
              <Link href={localePath("bn", "/")} className="text-brand-700 underline underline-offset-4">
                বাংলা হোমপেজে যান
              </Link>
            </p>
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
      </LocaleShell>
    </RootDocument>
  );
}

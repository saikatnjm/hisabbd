import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorMetadata } from "@/calculators/metadata";
import { calculatorPages } from "@/calculators/page-registry";
import { calculators } from "@/calculators/registry";
import { CalculatorPage } from "@/components/calculator/calculator-page";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return calculators.map((calc) => ({ slug: calc.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const entry = calculatorPages[(await params).slug];
  if (!entry) return {};
  return calculatorMetadata(entry.meta, "bn");
}

/** Bangla calculator pages: one dynamic route over the page registry. */
export default async function BanglaCalculatorPage({ params }: { params: Params }) {
  const entry = calculatorPages[(await params).slug];
  if (!entry) notFound();
  const { meta, Calculator, ContentBn } = entry;
  return (
    <CalculatorPage calculator={meta} locale="bn" content={<ContentBn />}>
      <Calculator />
    </CalculatorPage>
  );
}

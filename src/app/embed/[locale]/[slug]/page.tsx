import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorPages } from "@/calculators/page-registry";
import { calculatorPath } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { CalculatorProvider } from "@/components/calculator/calculator-context";
import { absoluteUrl, siteConfig } from "@/config/site";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return calculators.map((calc) => ({ slug: calc.slug }));
}

async function resolve(params: Params) {
  const { locale, slug } = await params;
  const entry = calculatorPages[slug];
  if (!entry || (locale !== "en" && locale !== "bn")) return null;
  return { entry, locale: locale as Locale };
}

/** Embeds are never indexed; the canonical points search engines at the full page. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { entry, locale } = found;
  return {
    metadataBase: new URL(siteConfig.url),
    title: `${locale === "bn" ? entry.meta.nameBn : entry.meta.name} | ${siteConfig.name}`,
    robots: { index: false, follow: true },
    alternates: { canonical: localePath(locale, calculatorPath(entry.meta.slug)) },
  };
}

/** The calculator widget alone, plus an attribution link to the full page. */
export default async function EmbedPage({ params }: { params: Params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { entry, locale } = found;
  const { meta, Calculator } = entry;
  const name = locale === "bn" ? meta.nameBn : meta.name;

  return (
    <main className="p-3 sm:p-4">
      <CalculatorProvider slug={meta.slug}>
        <Calculator />
      </CalculatorProvider>
      <p className="mt-4 text-sm text-slate-600">
        <a
          href={absoluteUrl(localePath(locale, calculatorPath(meta.slug)))}
          target="_blank"
          rel="noopener"
          className="font-semibold text-brand-700 underline underline-offset-4"
        >
          {ui[locale].embed.poweredBy(name)}
        </a>
      </p>
    </main>
  );
}

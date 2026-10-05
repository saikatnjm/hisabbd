import type { CalculatorMeta, FaqItem } from "@/calculators/types";
import { calculatorPath } from "@/calculators/paths";
import { absoluteUrl, siteConfig } from "@/config/site";

/*
 * schema.org structured data built from registry data, so it always matches
 * what the page shows. Kept deliberately small: WebSite (home),
 * WebApplication (each calculator), BreadcrumbList and FAQPage (only when the
 * FAQs are visible on the page).
 */

type Schema = Record<string, unknown>;

export interface BreadcrumbEntry {
  name: string;
  /** Site-relative path. */
  path: string;
}

export function websiteSchema(): Schema {
  return {
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.language,
  };
}

export function calculatorSchema(calc: CalculatorMeta): Schema {
  return {
    "@type": "WebApplication",
    name: calc.name,
    url: absoluteUrl(calculatorPath(calc.slug)),
    description: calc.seo.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: siteConfig.currency },
  };
}

export function breadcrumbSchema(items: readonly BreadcrumbEntry[]): Schema {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: readonly FaqItem[]): Schema {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Combines schemas into one JSON-LD document. */
export function schemaGraph(schemas: readonly Schema[]): Schema {
  return { "@context": "https://schema.org", "@graph": schemas };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so it can't close the tag. */
export function serializeJsonLd(data: Schema): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

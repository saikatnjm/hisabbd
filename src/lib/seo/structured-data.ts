import type { CalculatorMeta, FaqItem } from "@/calculators/types";
import { calculatorPath } from "@/calculators/paths";
import { absoluteUrl, siteConfig } from "@/config/site";
import { guidePath } from "@/guides/paths";
import type { GuideMeta } from "@/guides/types";
import { localePath, type Locale } from "@/i18n/locales";

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

export function websiteSchema(locale: Locale = "en"): Schema {
  return {
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(localePath(locale, "/")),
    description: locale === "bn" ? siteConfig.descriptionBn : siteConfig.description,
    inLanguage: locale,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

/** The publisher behind the site; linked from WebSite via `publisher`. */
export function organizationSchema(): Schema {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
  };
}

/** A guide article, published by the site's Organization. */
export function articleSchema(guide: GuideMeta, locale: Locale = "en"): Schema {
  const bn = locale === "bn";
  return {
    "@type": "Article",
    headline: bn ? guide.titleBn : guide.title,
    description: bn ? guide.seoBn.description : guide.seo.description,
    url: absoluteUrl(localePath(locale, guidePath(guide.slug))),
    inLanguage: locale,
    datePublished: guide.publishedOn,
    dateModified: guide.updatedOn ?? guide.publishedOn,
    author: { "@id": `${absoluteUrl("/")}#organization` },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    image: absoluteUrl("/og.png"),
  };
}

export function calculatorSchema(calc: CalculatorMeta, locale: Locale = "en"): Schema {
  return {
    "@type": "WebApplication",
    name: locale === "bn" ? calc.nameBn : calc.name,
    url: absoluteUrl(localePath(locale, calculatorPath(calc.slug))),
    description: locale === "bn" ? calc.seoBn.description : calc.seo.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: locale,
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

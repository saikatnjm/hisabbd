import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE, HREFLANG, localePath, OG_LOCALE, type Locale } from "@/i18n/locales";
import { calculatorPath } from "./paths";
import type { CalculatorMeta } from "./types";

/** Shared Open Graph image (public/og.png), used by every page. */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: `${siteConfig.name}: ${siteConfig.tagline}` };

/**
 * Page metadata (title, description, canonical, hreflang, Open Graph, Twitter)
 * for any page. `path` is the English (default-locale) path; the canonical and
 * language alternates for both locales are derived from it.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale = DEFAULT_LOCALE,
}: {
  /** Page title without the site name (the layout template appends it). */
  title: string;
  description: string;
  /** English path of the page, e.g. "/calculators/age-calculator". */
  path: string;
  locale?: Locale;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const canonical = localePath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        [HREFLANG.en]: localePath("en", path),
        [HREFLANG.bn]: localePath("bn", path),
        "x-default": localePath("en", path),
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[locale === "en" ? "bn" : "en"],
      url: canonical,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}

export function calculatorMetadata(calc: CalculatorMeta, locale: Locale = DEFAULT_LOCALE): Metadata {
  const seo = locale === "bn" ? calc.seoBn : calc.seo;
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: calculatorPath(calc.slug),
    locale,
  });
}

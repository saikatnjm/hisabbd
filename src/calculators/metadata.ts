import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE, HREFLANG, localePath, OG_LOCALE, type Locale } from "@/i18n/locales";
import { calculatorPath } from "./paths";
import type { GuideMeta } from "@/guides/types";
import type { CalculatorMeta } from "./types";

/** Size of every social preview image (the Facebook / WhatsApp large-card size). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Shared Open Graph image (public/og.png): the fallback for pages without their
 * own image (about, categories, the calculator index…).
 */
export const OG_IMAGE = { url: "/og.png", ...OG_IMAGE_SIZE, alt: `${siteConfig.name}: ${siteConfig.tagline}` };

/** A page's own social preview image: a URL under /og/ plus its alt text. */
export interface OgImage {
  url: string;
  alt: string;
}

/**
 * Per-page social preview images are static PNGs in public/og/, one per page
 * and locale, rendered in Chromium by scripts/og/og-images.spec.ts
 * (`docker compose run --rm e2e npm run og`). They are not drawn with
 * next/og because its renderer (Satori) can't shape Bengali conjuncts.
 * src/calculators/og-images.test.ts fails when a page's file is missing.
 */
const OG_DIR = "/og";
const OG_EXT = "png";

/** Social preview image of a calculator page: /og/<slug>.<locale>.png */
export function calculatorOgImage(calc: Pick<CalculatorMeta, "slug" | "name" | "nameBn">, locale: Locale): OgImage {
  return { url: `${OG_DIR}/${calc.slug}.${locale}.${OG_EXT}`, alt: locale === "bn" ? calc.nameBn : calc.name };
}

/** Social preview image of a guide page: /og/guides/<slug>.<locale>.png */
export function guideOgImage(guide: Pick<GuideMeta, "slug" | "title" | "titleBn">, locale: Locale): OgImage {
  return { url: `${OG_DIR}/guides/${guide.slug}.${locale}.${OG_EXT}`, alt: locale === "bn" ? guide.titleBn : guide.title };
}

/** Social preview image of the home page: /og/home.<locale>.png */
export function homeOgImage(locale: Locale): OgImage {
  return {
    url: `${OG_DIR}/home.${locale}.${OG_EXT}`,
    alt: `${siteConfig.name}: ${locale === "bn" ? siteConfig.taglineBn : siteConfig.tagline}`,
  };
}

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
  image,
}: {
  /** Page title without the site name (the layout template appends it). */
  title: string;
  description: string;
  /** English path of the page, e.g. "/calculators/age-calculator". */
  path: string;
  locale?: Locale;
  /** The page's own social preview image; defaults to the shared OG_IMAGE. */
  image?: OgImage;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const ogImage = image ? { ...image, ...OG_IMAGE_SIZE } : OG_IMAGE;
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
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage.url] },
  };
}

export function calculatorMetadata(calc: CalculatorMeta, locale: Locale = DEFAULT_LOCALE): Metadata {
  const seo = locale === "bn" ? calc.seoBn : calc.seo;
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: calculatorPath(calc.slug),
    locale,
    image: calculatorOgImage(calc, locale),
  });
}

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { calculatorPath } from "./paths";
import type { CalculatorMeta } from "./types";

/** Shared Open Graph image (public/og.png), used by every page. */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: `${siteConfig.name}: ${siteConfig.tagline}` };

/** Page metadata (title, description, canonical, Open Graph, Twitter) for any page. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Page title without the site name (the layout template appends it). */
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_BD",
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}

export function calculatorMetadata(calc: CalculatorMeta): Metadata {
  return pageMetadata({
    title: calc.seo.title,
    description: calc.seo.description,
    path: calculatorPath(calc.slug),
  });
}

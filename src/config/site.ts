/**
 * Single source of truth for site-wide identity and URLs.
 * SEO metadata, canonical URLs, sitemap and structured data should all read from here.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Provided automatically by Vercel (server-side only).
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "HisabBD",
  tagline: "Free Online Calculators for Bangladesh",
  description:
    "Free online calculators for Bangladesh: age, BMI, GPA, CGPA, percentage, discount, profit and loss, loan EMI, salary and date difference. Fast, mobile friendly, no signup.",
  url: resolveSiteUrl(),
  locale: "en-BD",
  language: "en",
  currency: "BDT",
  timeZone: "Asia/Dhaka",
} as const;

/** Builds an absolute URL from a site-relative path, e.g. "/age-calculator". */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? siteConfig.url : `${siteConfig.url}${normalized}`;
}

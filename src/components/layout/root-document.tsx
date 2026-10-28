import type { Metadata, Viewport } from "next";
import { Anek_Bangla } from "next/font/google";
import { OG_IMAGE } from "@/calculators/metadata";
import { siteConfig } from "@/config/site";
import { AnalyticsScript } from "@/components/analytics/analytics-script";
import { HTML_LANG, OG_LOCALE, type Locale } from "@/i18n/locales";
import "@/app/globals.css";

/**
 * Display face for headings. Latin + Bengali subsets so Bangla headings on
 * /bn pages (and Bangla accents elsewhere) render in the same face;
 * body text uses the system stack.
 */
const displayFont = Anek_Bangla({
  subsets: ["latin", "bengali"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-anek",
});

/**
 * Search Console / Bing Webmaster ownership tags, from environment variables
 * set in Vercel (only the token value, e.g. "AbC123…"). Omitted when unset.
 */
function siteVerification(): Metadata["verification"] {
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  const bing = process.env.BING_SITE_VERIFICATION;
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

/** Site-wide metadata for a locale's root layout. Pages override title, description and alternates. */
export function rootMetadata(locale: Locale): Metadata {
  const bn = locale === "bn";
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${bn ? siteConfig.taglineBn : siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: bn ? siteConfig.descriptionBn : siteConfig.description,
    applicationName: siteConfig.name,
    // Numbers on calculator pages shouldn't turn into phone-number links on iOS.
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: OG_LOCALE[locale],
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
    verification: siteVerification(),
  };
}

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006a4e",
};

/**
 * The <html> document for one locale. Each locale has its own root layout
 * (src/app/(en) and src/app/bn), so the server HTML carries the right
 * `lang` without any client-side fix-up.
 */
export function RootDocument({
  locale,
  analytics = true,
  children,
}: {
  locale: Locale;
  /** False for embeds on other sites: no analytics scripts or cookies there. */
  analytics?: boolean;
  children: React.ReactNode;
}) {
  return (
    <html lang={HTML_LANG[locale]} className={displayFont.variable}>
      <body className="flex min-h-dvh flex-col bg-white font-sans text-slate-900 antialiased">
        {children}
        {analytics && <AnalyticsScript />}
      </body>
    </html>
  );
}

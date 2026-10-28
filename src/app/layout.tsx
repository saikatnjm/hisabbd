import type { Metadata, Viewport } from "next";
import { Anek_Bangla } from "next/font/google";
import { OG_IMAGE } from "@/calculators/metadata";
import { siteConfig } from "@/config/site";
import { AnalyticsScript } from "@/components/analytics/analytics-script";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // Numbers on calculator pages shouldn't turn into phone-number links on iOS.
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_BD",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  verification: siteVerification(),
};

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006a4e",
};

/**
 * Root layout: document shell only. The locale layouts — src/app/(en) and
 * src/app/bn — add the header, footer and skip link in the right language.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.language} className={displayFont.variable}>
      <body className="flex min-h-dvh flex-col bg-white font-sans text-slate-900 antialiased">
        {children}
        <AnalyticsScript />
      </body>
    </html>
  );
}

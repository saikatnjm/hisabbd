import type { Metadata, Viewport } from "next";
import { Anek_Bangla } from "next/font/google";
import { OG_IMAGE } from "@/calculators/metadata";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

/** Display face for headings. Latin subset only; body text uses the system stack. */
const displayFont = Anek_Bangla({
  subsets: ["latin"],
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006a4e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.language} className={displayFont.variable}>
      <body className="flex min-h-dvh flex-col bg-white font-sans text-slate-900 antialiased">
        <a
          href="#main"
          className="sr-only rounded-xl bg-white px-4 py-3 font-semibold text-brand-700 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:shadow"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

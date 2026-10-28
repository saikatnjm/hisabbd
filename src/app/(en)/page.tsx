import type { Metadata } from "next";
import { OG_IMAGE } from "@/calculators/metadata";
import { HomePage } from "@/components/home/home-page";
import { siteConfig } from "@/config/site";
import { HREFLANG } from "@/i18n/locales";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { [HREFLANG.en]: "/", [HREFLANG.bn]: "/bn", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_BD",
    alternateLocale: "bn_BD",
    url: "/",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [OG_IMAGE.url],
  },
};

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}

import type { Metadata } from "next";
import { OG_IMAGE } from "@/calculators/metadata";
import { HomePage } from "@/components/home/home-page";
import { siteConfig } from "@/config/site";
import { HREFLANG } from "@/i18n/locales";

export const metadata: Metadata = {
  description: siteConfig.descriptionBn,
  alternates: {
    canonical: "/bn",
    languages: { [HREFLANG.en]: "/", [HREFLANG.bn]: "/bn", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "bn_BD",
    alternateLocale: "en_BD",
    url: "/bn",
    title: `${siteConfig.name}: ${siteConfig.taglineBn}`,
    description: siteConfig.descriptionBn,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: ${siteConfig.taglineBn}`,
    description: siteConfig.descriptionBn,
    images: [OG_IMAGE.url],
  },
};

export default function BanglaHomePage() {
  return <HomePage locale="bn" />;
}

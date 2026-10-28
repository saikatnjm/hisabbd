import type { Metadata } from "next";
import { homeOgImage, OG_IMAGE_SIZE } from "@/calculators/metadata";
import { HomePage } from "@/components/home/home-page";
import { siteConfig } from "@/config/site";
import { HREFLANG } from "@/i18n/locales";

const ogImage = homeOgImage("en");

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
    images: [{ ...ogImage, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [ogImage.url],
  },
};

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}

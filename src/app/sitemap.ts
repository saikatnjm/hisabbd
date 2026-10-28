import type { MetadataRoute } from "next";
import { categories } from "@/calculators/categories";
import { CALCULATORS_PATH, calculatorPath, categoryHref } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { absoluteUrl } from "@/config/site";
import { localePath, LOCALES } from "@/i18n/locales";

/** One sitemap entry per locale for the path, each carrying hreflang alternates. */
function localizedEntries(path: string, lastModified?: string): MetadataRoute.Sitemap {
  const alternates = {
    languages: {
      "en-BD": absoluteUrl(localePath("en", path)),
      "bn-BD": absoluteUrl(localePath("bn", path)),
      "x-default": absoluteUrl(localePath("en", path)),
    },
  };
  return LOCALES.map((locale) => ({
    url: absoluteUrl(localePath(locale, path)),
    ...(lastModified ? { lastModified } : {}),
    alternates,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", CALCULATORS_PATH, "/about", "/privacy", "/terms"];
  return [
    ...pages.flatMap((path) => localizedEntries(path)),
    ...categories.flatMap((c) => localizedEntries(categoryHref(c.id))),
    ...calculators.flatMap((calc) => localizedEntries(calculatorPath(calc.slug), calc.updatedOn ?? calc.addedOn)),
  ];
}

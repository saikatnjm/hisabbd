import type { MetadataRoute } from "next";
import { categories } from "@/calculators/categories";
import { CALCULATORS_PATH, calculatorPath, categoryHref } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { absoluteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", CALCULATORS_PATH, "/about", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({ url: absoluteUrl(path) })),
    ...categories.map((c) => ({ url: absoluteUrl(categoryHref(c.id)) })),
    ...calculators.map((calc) => ({
      url: absoluteUrl(calculatorPath(calc.slug)),
      lastModified: calc.addedOn,
    })),
  ];
}

import { categories } from "@/calculators/categories";
import { CALCULATORS_PATH, categoryHref } from "@/calculators/paths";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

export interface NavLink {
  name: string;
  href: string;
}

/** Single source for site navigation (header, mobile menu, footer). */
export function primaryNav(locale: Locale): readonly NavLink[] {
  const t = ui[locale].nav;
  return [
    { name: t.allCalculators, href: localePath(locale, CALCULATORS_PATH) },
    { name: t.about, href: localePath(locale, "/about") },
  ];
}

export function categoryNav(locale: Locale): readonly (NavLink & { id: (typeof categories)[number]["id"] })[] {
  return categories.map((c) => ({
    id: c.id,
    name: locale === "bn" ? c.nameBn : c.name,
    href: localePath(locale, categoryHref(c.id)),
  }));
}

export function legalNav(locale: Locale): readonly NavLink[] {
  const t = ui[locale].nav;
  return [
    { name: t.about, href: localePath(locale, "/about") },
    { name: t.privacy, href: localePath(locale, "/privacy") },
    { name: t.terms, href: localePath(locale, "/terms") },
  ];
}

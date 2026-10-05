import { categories } from "@/calculators/categories";
import { CALCULATORS_PATH, categoryHref } from "@/calculators/paths";

/** Single source for site navigation (header, mobile menu, footer). */
export const primaryNav = [
  { name: "All calculators", href: CALCULATORS_PATH },
  { name: "About", href: "/about" },
] as const;

export const categoryNav = categories.map((c) => ({ id: c.id, name: c.name, href: categoryHref(c.id) }));

export const legalNav = [
  { name: "About", href: "/about" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
] as const;

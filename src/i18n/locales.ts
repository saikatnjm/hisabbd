/**
 * Locale support. English lives at "/", Bangla at "/bn/…" — the same page
 * exists at both paths and each links to the other via hreflang alternates.
 */

export const LOCALES = ["en", "bn"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

const BN_PREFIX = "/bn";

/** Prefixes a site-relative path for the locale, e.g. ("bn", "/about") → "/bn/about". */
export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return normalized;
  return normalized === "/" ? BN_PREFIX : `${BN_PREFIX}${normalized}`;
}

/** Locale of a pathname ("/bn" and "/bn/…" are Bangla; everything else English). */
export function pathnameLocale(pathname: string): Locale {
  return pathname === BN_PREFIX || pathname.startsWith(`${BN_PREFIX}/`) ? "bn" : "en";
}

/** The same pathname in the other locale, for the language switcher. */
export function switchLocalePath(pathname: string): string {
  if (pathnameLocale(pathname) === "bn") {
    const stripped = pathname.slice(BN_PREFIX.length);
    return stripped === "" ? "/" : stripped;
  }
  return localePath("bn", pathname);
}

/** BCP 47 / Open Graph helpers. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_BD", bn: "bn_BD" };
export const HREFLANG: Record<Locale, string> = { en: "en-BD", bn: "bn-BD" };
export const HTML_LANG: Record<Locale, string> = { en: "en", bn: "bn" };

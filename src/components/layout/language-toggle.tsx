"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/locale-context";
import { switchLocalePath } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

/**
 * Switches between English and Bangla, keeping the visitor on the same page.
 * A plain link (no cookie, no redirect): both versions are real, indexable pages.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = ui[locale].nav;

  return (
    <Link
      href={switchLocalePath(pathname)}
      hrefLang={locale === "en" ? "bn" : "en"}
      aria-label={t.switchLocaleLabel}
      className={className}
    >
      <span aria-hidden="true" className="font-bold">
        অ/A
      </span>
      {t.switchLocale}
    </Link>
  );
}

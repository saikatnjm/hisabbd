import Link from "next/link";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { primaryNav } from "@/components/layout/nav-links";
import { Container } from "@/components/ui/container";
import { SearchIcon } from "@/components/ui/icons";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

const navLinkClasses =
  "inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = ui[locale].nav;
  return (
    <header className="relative border-b border-slate-200 bg-white print:hidden">
      <Container className="flex h-16 items-center justify-between gap-2">
        <Logo locale={locale} />
        <div className="flex items-center gap-1">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {primaryNav(locale).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={navLinkClasses}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageToggle className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800" />
          <Link
            href={localePath(locale, "/#calculator-search")}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 px-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-sun-300"
          >
            <SearchIcon className="size-5" />
            <span className="sr-only sm:not-sr-only">{t.search}</span>
          </Link>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}

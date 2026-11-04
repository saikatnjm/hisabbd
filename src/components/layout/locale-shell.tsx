import { LocaleProvider } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import { calculators } from "@/calculators/registry";
import { BottomBar } from "@/components/layout/bottom-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/** Chrome shared by the English and Bangla layouts: skip link, header, main, footer and the phone bottom bar. */
export function LocaleShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <LocaleProvider locale={locale}>
      <a
        href="#main"
        className="sr-only rounded-xl bg-white px-4 py-3 font-semibold text-brand-700 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:shadow"
      >
        {ui[locale].skipToContent}
      </a>
      <SiteHeader locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
      {/* Room for the fixed bottom bar on phones, so it never covers the footer. */}
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden print:hidden" />
      <BottomBar calculators={calculators.map((c) => [c.slug, locale === "bn" ? c.nameBn : c.name] as const)} />
    </LocaleProvider>
  );
}

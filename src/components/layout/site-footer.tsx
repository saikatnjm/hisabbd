import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { categoryNav, legalNav } from "@/components/layout/nav-links";
import { Container } from "@/components/ui/container";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

/** Fixed when the page is built (pages are static). */
const COPYRIGHT_YEAR = new Date().getFullYear();

const footerLinkClasses = "text-slate-700 underline-offset-4 hover:text-brand-800 hover:underline";

function FooterNav({
  id,
  title,
  links,
}: {
  id: string;
  title: string;
  links: readonly { name: string; href: string }[];
}) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="font-display font-semibold text-slate-900">
        {title}
      </h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={footerLinkClasses}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = ui[locale].footer;
  const calculatorLinks = calculators.map((c) => ({
    name: locale === "bn" ? c.nameBn : c.name,
    href: localePath(locale, calculatorPath(c.slug)),
  }));

  return (
    <footer className="border-t border-brand-100 bg-brand-50 print:hidden">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo locale={locale} />
          <p className="mt-3 max-w-xs text-sm text-slate-700" lang={locale}>
            {locale === "bn" ? siteConfig.taglineBn : siteConfig.tagline}.{" "}
            <span lang="bn">{locale === "bn" ? t.hisabMeans : null}</span>
            {locale === "en" && (
              <>
                <span lang="bn">হিসাব</span> = calculation.
              </>
            )}
          </p>
        </div>
        <FooterNav id="footer-calculators" title={t.calculators} links={calculatorLinks} />
        <FooterNav id="footer-categories" title={t.categories} links={categoryNav(locale)} />
        <FooterNav id="footer-site" title={siteConfig.name} links={legalNav(locale)} />
      </Container>

      <Container>
        <div className="border-t border-brand-100 py-6 text-sm text-slate-600">
          <p>{t.disclaimer}</p>
          <p className="mt-2">
            © {COPYRIGHT_YEAR} {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { categoryNav, legalNav } from "@/components/layout/nav-links";
import { Container } from "@/components/ui/container";

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

export function SiteFooter() {
  const calculatorLinks = calculators.map((c) => ({ name: c.name, href: calculatorPath(c.slug) }));

  return (
    <footer className="border-t border-brand-100 bg-brand-50">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-slate-700">
            {siteConfig.tagline}. <span lang="bn">হিসাব</span> = calculation.
          </p>
        </div>
        <FooterNav id="footer-calculators" title="Calculators" links={calculatorLinks} />
        <FooterNav id="footer-categories" title="Categories" links={categoryNav} />
        <FooterNav id="footer-site" title="HisabBD" links={legalNav} />
      </Container>

      <Container>
        <div className="border-t border-brand-100 py-6 text-sm text-slate-600">
          <p>
            Results are for general information. For important financial, health or academic
            decisions, confirm with the relevant institution or a qualified professional.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p>
              © {COPYRIGHT_YEAR} {siteConfig.name}
            </p>
            <p>
              Made by{" "}
              <a
                href="https://github.com/saikatnjm"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                @saikatnjm
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

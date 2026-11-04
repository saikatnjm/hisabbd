import { LazyLink as Link } from "@/components/ui/lazy-link";
import { getCategory } from "@/calculators/categories";
import { calculatorPath } from "@/calculators/paths";
import type { CalculatorMeta } from "@/calculators/types";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { categoryTheme } from "@/components/calculator/category-theme";
import { cn } from "@/lib/cn";
import { localePath, type Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

/**
 * Whole card is one link. From sm up it shows a visible "Open calculator" cue,
 * so it works without hover on touch screens; on phones it is a compact row. Heading level fits the surrounding outline.
 */
export function CalculatorCard({
  calculator,
  headingLevel = "h3",
  linkAttributes,
  locale = "en",
}: {
  calculator: CalculatorMeta;
  headingLevel?: "h2" | "h3" | "h4";
  /** Extra data-* attributes for the link (e.g. analytics). */
  linkAttributes?: Record<`data-${string}`, string>;
  locale?: Locale;
}) {
  const Heading = headingLevel;
  const theme = categoryTheme[calculator.category];
  const category = getCategory(calculator.category);

  // A compact row on phones (icon, name, one-line summary), the full card from sm up.
  return (
    <Link
      {...linkAttributes}
      href={localePath(locale, calculatorPath(calculator.slug))}
      className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition duration-200 hover:border-slate-300 hover:shadow-lift sm:flex-col sm:items-stretch sm:gap-0 sm:p-5 motion-safe:hover:-translate-y-0.5"
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <CalculatorIconTile
          icon={calculator.icon}
          category={calculator.category}
          size="lg"
          className="transition-transform duration-200 motion-safe:group-hover:-rotate-6"
        />
        <span className="hidden sm:block">
          <Badge className={cn(theme.soft, theme.ink)}>{locale === "bn" ? category.nameBn : category.name}</Badge>
        </span>
      </div>
      <div className="min-w-0 sm:mt-4 sm:flex sm:flex-1 sm:flex-col">
        <Heading className="font-display text-base leading-snug font-semibold text-slate-900 sm:text-lg">
          {locale === "bn" ? calculator.nameBn : calculator.name}
        </Heading>
        <p className="mt-0.5 line-clamp-1 text-sm text-slate-600 sm:mt-1 sm:line-clamp-none">
          {locale === "bn" ? calculator.summaryBn : calculator.summary}
        </p>
        <span className="mt-auto hidden items-center gap-1 pt-4 text-sm font-semibold text-brand-700 sm:inline-flex">
          {ui[locale].card.open}
          <ArrowRightIcon className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

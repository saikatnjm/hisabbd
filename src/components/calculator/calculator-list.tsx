import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorCard } from "@/components/calculator/calculator-card";
import type { Locale } from "@/i18n/locales";

/** Responsive grid of calculator cards. Used on the homepage, category pages and related sections. */
export function CalculatorList({
  calculators,
  emptyState,
  headingLevel,
  linkAttributes,
  locale = "en",
}: {
  calculators: readonly CalculatorMeta[];
  emptyState?: React.ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
  /** Per-card data-* attributes for the link (e.g. analytics). */
  linkAttributes?: (calc: CalculatorMeta) => Record<`data-${string}`, string>;
  locale?: Locale;
}) {
  if (calculators.length === 0) return emptyState ?? null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {calculators.map((calc) => (
        <li key={calc.slug}>
          <CalculatorCard calculator={calc} headingLevel={headingLevel} linkAttributes={linkAttributes?.(calc)} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

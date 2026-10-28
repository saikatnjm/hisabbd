import { cn } from "@/lib/cn";
import { getRelatedCalculators } from "@/calculators/registry";
import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorList } from "@/components/calculator/calculator-list";
import { relatedLinkAttributes } from "@/lib/analytics";
import type { Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

/** Related calculators from the registry. Renders nothing until there are any. */
export function RelatedCalculators({
  calculator,
  className,
  locale = "en",
}: {
  calculator: CalculatorMeta;
  className?: string;
  locale?: Locale;
}) {
  const related = getRelatedCalculators(calculator);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className={cn(className, "print:hidden")}>
      <h2 id="related-heading" className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900">
        {ui[locale].calculatorPage.related}
      </h2>
      <CalculatorList
        calculators={related}
        locale={locale}
        linkAttributes={(calc) => relatedLinkAttributes(calculator.slug, calc.slug, "related")}
      />
    </section>
  );
}

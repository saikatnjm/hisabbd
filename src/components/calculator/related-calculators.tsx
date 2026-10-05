import { getRelatedCalculators } from "@/calculators/registry";
import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorList } from "@/components/calculator/calculator-list";

/** Related calculators from the registry. Renders nothing until there are any. */
export function RelatedCalculators({
  calculator,
  className,
}: {
  calculator: CalculatorMeta;
  className?: string;
}) {
  const related = getRelatedCalculators(calculator);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className={className}>
      <h2 id="related-heading" className="mb-4 font-display text-2xl font-bold tracking-tight text-slate-900">
        Related calculators
      </h2>
      <CalculatorList calculators={related} />
    </section>
  );
}

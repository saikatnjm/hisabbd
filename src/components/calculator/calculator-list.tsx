import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorCard } from "@/components/calculator/calculator-card";

/** Responsive grid of calculator cards. Used on the homepage, category pages and related sections. */
export function CalculatorList({
  calculators,
  emptyState,
  headingLevel,
}: {
  calculators: readonly CalculatorMeta[];
  emptyState?: React.ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  if (calculators.length === 0) return emptyState ?? null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {calculators.map((calc) => (
        <li key={calc.slug}>
          <CalculatorCard calculator={calc} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

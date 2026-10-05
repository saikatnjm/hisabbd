import Link from "next/link";
import { getCategory } from "@/calculators/categories";
import { calculatorPath } from "@/calculators/paths";
import type { CalculatorMeta } from "@/calculators/types";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { categoryTheme } from "@/components/calculator/category-theme";
import { cn } from "@/lib/cn";

/**
 * Whole card is one link with a visible "Open calculator" cue, so it works
 * without hover on touch screens. Heading level fits the surrounding outline.
 */
export function CalculatorCard({
  calculator,
  headingLevel = "h3",
}: {
  calculator: CalculatorMeta;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  const Heading = headingLevel;
  const theme = categoryTheme[calculator.category];

  return (
    <Link
      href={calculatorPath(calculator.slug)}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-slate-300 hover:shadow-lift motion-safe:hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <CalculatorIconTile
          icon={calculator.icon}
          category={calculator.category}
          size="lg"
          className="transition-transform duration-200 motion-safe:group-hover:-rotate-6"
        />
        <Badge className={cn(theme.soft, theme.ink)}>{getCategory(calculator.category).name}</Badge>
      </div>
      <Heading className="mt-4 font-display text-lg font-semibold text-slate-900">
        {calculator.name}
      </Heading>
      <p className="mt-1 text-sm text-slate-600">{calculator.summary}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700">
        Open calculator
        <ArrowRightIcon className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

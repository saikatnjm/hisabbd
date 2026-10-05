import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { getRelatedCalculators } from "@/calculators/registry";
import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { ArrowRightIcon } from "@/components/ui/icons";
import { relatedLinkAttributes } from "@/lib/analytics";

/**
 * "Try next" links shown right under a calculator, so the next useful
 * calculator is one tap away after getting a result. Server-rendered links.
 */
export function NextCalculators({ calculator }: { calculator: CalculatorMeta }) {
  const next = getRelatedCalculators(calculator, 3);
  if (next.length === 0) return null;

  return (
    <nav aria-labelledby="next-calculators-heading" className="mt-8">
      <h2 id="next-calculators-heading" className="font-display text-lg font-semibold text-slate-900">
        Try next
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {next.map((calc) => (
          <li key={calc.slug}>
            <Link
              {...relatedLinkAttributes(calculator.slug, calc.slug, "next")}
              href={calculatorPath(calc.slug)}
              className="group flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              <CalculatorIconTile icon={calc.icon} category={calc.category} size="sm" />
              <span className="min-w-0 flex-1 leading-snug">{calc.name}</span>
              <ArrowRightIcon className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

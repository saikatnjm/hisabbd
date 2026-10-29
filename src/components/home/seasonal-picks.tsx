"use client";

import Link from "next/link";
import { activeSeasons } from "@/calculators/seasonal";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import type { RecentCalculatorLink } from "@/components/home/home-recent-calculations";
import { Container } from "@/components/ui/container";
import { useLocale } from "@/i18n/locale-context";
import { parsePlainDate } from "@/lib/plain-date";
import { useToday } from "@/lib/use-today";

const STRINGS = {
  en: { title: "Useful right now" },
  bn: { title: "এখন যা কাজে লাগবে" },
} as const;

/**
 * Calculators for the current season (exam results, Ramadan, Pohela
 * Boishakh, the budget), worked out from the visitor's date so the static
 * page never goes stale. Renders nothing out of season or on the server.
 */
export function SeasonalPicks({ calculators }: { calculators: readonly RecentCalculatorLink[] }) {
  const locale = useLocale();
  const today = parsePlainDate(useToday());
  if (!today) return null;

  const bySlug = new Map(calculators.map((c) => [c.slug, c]));
  const seasons = activeSeasons(today);
  const seen = new Set<string>();
  const picks = seasons.flatMap((season) =>
    season.slugs
      .filter((slug) => bySlug.has(slug) && !seen.has(slug) && seen.add(slug))
      .map((slug) => ({ season, calc: bySlug.get(slug)! })),
  );
  if (picks.length === 0) return null;

  return (
    <section aria-labelledby="seasonal-heading" className="border-b border-slate-100 bg-white">
      <Container className="py-6 sm:py-8">
        <h2 id="seasonal-heading" className="font-display text-xl font-bold tracking-tight text-slate-900">
          {STRINGS[locale].title}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {picks.map(({ season, calc }) => (
            <li key={calc.slug}>
              <Link
                href={calc.href}
                className="inline-flex min-h-12 items-center gap-3 rounded-xl border-2 border-slate-200 bg-white py-1.5 pr-4 pl-1.5 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <CalculatorIconTile icon={calc.icon} category={calc.category} size="sm" />
                <span className="leading-tight">
                  <span className="block font-semibold text-slate-900">{calc.name}</span>
                  <span className="block text-xs text-slate-600">{locale === "bn" ? season.labelBn : season.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

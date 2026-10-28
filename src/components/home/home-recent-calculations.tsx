"use client";

import Link from "next/link";
import type { CalculatorIconName, CategoryId } from "@/calculators/types";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { Container } from "@/components/ui/container";
import { useLocale } from "@/i18n/locale-context";
import { ui } from "@/i18n/ui";
import { formatTimeAgo } from "@/lib/format";
import { useAllCalculationHistory } from "@/lib/use-calculation-history";
import { useNow } from "@/lib/use-now";

export interface RecentCalculatorLink {
  slug: string;
  name: string;
  href: string;
  icon: CalculatorIconName;
  category: CategoryId;
}

const SHOWN = 4;

/**
 * "Your recent calculations" on the homepage, from this browser's history.
 * Each links to its calculator, where "Use again" refills the form. Renders
 * nothing for first-time visitors (and during server rendering).
 */
export function HomeRecentCalculations({ calculators }: { calculators: readonly RecentCalculatorLink[] }) {
  const t = ui[useLocale()].history;
  const locale = useLocale();
  const now = useNow();
  const entries = useAllCalculationHistory();
  const bySlug = new Map(calculators.map((c) => [c.slug, c]));
  const shown = entries.filter((e) => bySlug.has(e.slug)).slice(0, SHOWN);

  if (shown.length === 0 || now === 0) return null;

  return (
    <section aria-labelledby="home-recent-heading" className="border-b border-slate-100 bg-white">
      <Container className="py-8 sm:py-10">
        <h2 id="home-recent-heading" className="font-display text-2xl font-bold tracking-tight text-slate-900">
          {t.homeTitle}
        </h2>
        <p className="mt-1 text-slate-600">{t.homeIntro}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {shown.map((entry) => {
            const calc = bySlug.get(entry.slug)!;
            return (
              <li key={entry.id}>
                <Link
                  href={calc.href}
                  className="flex h-full items-start gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <CalculatorIconTile icon={calc.icon} category={calc.category} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">{calc.name}</span>
                    <span lang={entry.locale} className="mt-0.5 line-clamp-2 block text-sm text-slate-700">
                      {entry.summary}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">{formatTimeAgo(entry.at, now, locale)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

"use client";

import Link from "next/link";
import { StarIcon } from "@/components/ui/icons";
import { useSavedCalculators } from "@/lib/use-saved-calculators";

export interface QuickPick {
  slug: string;
  href: string;
  label: string;
}

const MAX_PICKS = 6;
const chipClasses =
  "inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3 font-medium text-slate-800 transition-colors hover:border-brand-400 hover:bg-brand-50";

/**
 * The chip row under the homepage search. Shows editor picks ("Try") until the
 * visitor has favourites or recently used calculators in this browser, then
 * shows those instead, in the same single row (no layout jump).
 */
export function QuickPicks({ featured, all }: { featured: readonly QuickPick[]; all: readonly QuickPick[] }) {
  const favorites = useSavedCalculators("favorites");
  const recent = useSavedCalculators("recent");
  const bySlug = new Map(all.map((item) => [item.slug, item]));

  const personal = [...new Set([...favorites, ...recent])]
    .map((slug) => bySlug.get(slug))
    .filter((item): item is QuickPick => item !== undefined)
    .slice(0, MAX_PICKS);
  const showPersonal = personal.length > 0;
  const items = showPersonal ? personal : featured.slice(0, MAX_PICKS);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-slate-600">{showPersonal ? "Your calculators:" : "Try:"}</span>
      {items.map((item) => (
        <Link key={item.slug} href={item.href} className={chipClasses}>
          {showPersonal && favorites.includes(item.slug) && (
            <StarIcon className="size-4 fill-sun-300 text-finance-ink" aria-label="Saved" role="img" />
          )}
          {item.label}
        </Link>
      ))}
    </div>
  );
}

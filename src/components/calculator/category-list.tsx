import Link from "next/link";
import { categories } from "@/calculators/categories";
import { categoryAnchorId } from "@/calculators/paths";
import { getCalculatorsByCategory } from "@/calculators/registry";
import type { Category } from "@/calculators/types";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { categoryTheme } from "@/components/calculator/category-theme";
import { cn } from "@/lib/cn";

function CategoryCardBody({ category, count }: { category: Category; count: number }) {
  const theme = categoryTheme[category.id];
  return (
    <>
      <CategoryIcon category={category.id} className="bg-white/80" />
      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold text-slate-900">{category.name}</h3>
        <p className="mt-0.5 text-sm text-slate-700">{category.description}</p>
        <p className={cn("mt-2 text-xs font-semibold", theme.ink)}>
          {count === 0 ? "Coming soon" : `${count} calculator${count === 1 ? "" : "s"}`}
        </p>
      </div>
    </>
  );
}

/**
 * Category tiles. Counts come from calculator metadata, so new calculators
 * appear automatically. Pass `getHref` once category pages exist.
 */
export function CategoryList({ getHref }: { getHref?: (category: Category) => string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {categories.map((category) => {
        const count = getCalculatorsByCategory(category.id).length;
        const href = getHref?.(category);
        const classes = cn(
          "flex h-full scroll-mt-6 gap-4 rounded-2xl p-4 lg:flex-col lg:p-5",
          categoryTheme[category.id].soft,
        );
        return (
          <li key={category.id}>
            {href ? (
              <Link
                href={href}
                id={categoryAnchorId(category.id)}
                className={cn(classes, "transition duration-200 hover:shadow-lift motion-safe:hover:-translate-y-0.5")}
              >
                <CategoryCardBody category={category} count={count} />
              </Link>
            ) : (
              <div id={categoryAnchorId(category.id)} tabIndex={-1} className={classes}>
                <CategoryCardBody category={category} count={count} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { calculatorPath } from "@/calculators/paths";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { categoryNav, primaryNav } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { HomeIcon, MenuIcon, SearchIcon, StarIcon } from "@/components/ui/icons";
import { LazyLink as Link } from "@/components/ui/lazy-link";
import { useLocale } from "@/i18n/locale-context";
import { localePath } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import { cn } from "@/lib/cn";
import { useSavedCalculators } from "@/lib/use-saved-calculators";

type Panel = "saved" | "menu";

const itemClasses = (active: boolean) =>
  cn(
    "flex min-h-16 w-full flex-col items-center justify-center gap-0.5 text-xs font-semibold transition-colors",
    active ? "text-brand-700" : "text-slate-600 hover:text-slate-900",
  );
const panelClasses =
  "fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white px-4 pt-4 pb-5 shadow-lift";
const panelLinkClasses = "flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-slate-900 hover:bg-brand-50";

/**
 * App-style bar on phones (hidden from md up, where the header has the
 * links): Home, Search, Saved (favourites and recent calculators kept on this
 * device) and Menu (pages, categories, theme). A panel closes on navigation,
 * on Escape, on a tap outside it and when a link is chosen.
 */
export function BottomBar({ calculators }: { calculators: readonly (readonly [slug: string, name: string])[] }) {
  const locale = useLocale();
  const t = ui[locale];
  const pathname = usePathname();
  const savedId = useId();
  const menuId = useId();
  const buttons = useRef<Record<Panel, HTMLButtonElement | null>>({ saved: null, menu: null });
  /** Which panel is open, and on which page; a different page means closed. */
  const [panel, setPanel] = useState<{ name: Panel; on: string } | null>(null);
  const open = panel?.on === pathname ? panel.name : null;
  const close = () => setPanel(null);
  const toggle = (name: Panel) => setPanel(open === name ? null : { name, on: pathname });
  const home = localePath(locale, "/");

  return (
    <div
      className="md:hidden print:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          close();
          buttons.current[open]?.focus();
        }
      }}
    >
      {open && <div aria-hidden="true" className="fixed inset-0 z-30 bg-black/40" onClick={close} />}

      <div id={savedId} hidden={open !== "saved"} className={panelClasses}>
        {open === "saved" && <SavedPanel calculators={calculators} onChoose={close} />}
      </div>

      <div id={menuId} hidden={open !== "menu"} className={panelClasses}>
        <nav aria-label={t.nav.menu}>
          <ul className="space-y-1">
            {primaryNav(locale).map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className={panelLinkClasses}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-2 px-3 text-sm font-semibold text-slate-600">{t.nav.categories}</p>
          <ul className="grid grid-cols-2 gap-1">
            {categoryNav(locale).map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className={cn(panelLinkClasses, "px-2 font-medium text-slate-800")}>
                  <CategoryIcon category={item.id} size="sm" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-5 px-3">
          <ThemeToggle />
        </div>
      </div>

      <nav
        aria-label={t.bottomBar.label}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid grid-cols-4">
          <li>
            <Link href={home} aria-current={pathname === home ? "page" : undefined} className={itemClasses(!open && pathname === home)}>
              <HomeIcon className="size-5" />
              {t.nav.home}
            </Link>
          </li>
          <li>
            <Link href={localePath(locale, "/#calculator-search")} className={itemClasses(false)}>
              <SearchIcon className="size-5" />
              {t.nav.search}
            </Link>
          </li>
          {(["saved", "menu"] as const).map((name) => (
            <li key={name}>
              <button
                ref={(el) => {
                  buttons.current[name] = el;
                }}
                type="button"
                aria-expanded={open === name}
                aria-controls={name === "saved" ? savedId : menuId}
                onClick={() => toggle(name)}
                className={itemClasses(open === name)}
              >
                {name === "saved" ? <StarIcon className="size-5" /> : <MenuIcon className="size-5" />}
                {name === "saved" ? t.bottomBar.saved : t.nav.menu}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/** Favourites, then recently used calculators, from this browser's storage. */
function SavedPanel({
  calculators,
  onChoose,
}: {
  calculators: readonly (readonly [slug: string, name: string])[];
  onChoose: () => void;
}) {
  const locale = useLocale();
  const t = ui[locale].bottomBar;
  const names = new Map(calculators);
  const favorites = useSavedCalculators("favorites").filter((slug) => names.has(slug));
  const recent = useSavedCalculators("recent").filter((slug) => names.has(slug) && !favorites.includes(slug));

  if (favorites.length === 0 && recent.length === 0) return <p className="px-3 text-slate-700">{t.savedEmpty}</p>;

  const list = (title: string, slugs: readonly string[]) =>
    slugs.length > 0 && (
      <section className="mb-4 last:mb-0">
        <h2 className="mb-1 px-3 text-sm font-semibold text-slate-600">{title}</h2>
        <ul className="space-y-1">
          {slugs.map((slug) => (
            <li key={slug}>
              <Link href={localePath(locale, calculatorPath(slug))} onClick={onChoose} className={panelLinkClasses}>
                {names.get(slug)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );

  return (
    <>
      {list(t.savedTitle, favorites)}
      {list(t.recentTitle, recent)}
    </>
  );
}

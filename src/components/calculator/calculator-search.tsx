"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import {
  searchCalculators,
  searchCategories,
  type CategorySearchItem,
  type SearchItem,
} from "@/calculators/search";
import type { CalculatorIconName, CategoryId } from "@/calculators/types";
import { CalculatorIconTile } from "@/components/calculator/calculator-icon";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface Option {
  key: string;
  kind: "calculator" | "category";
  href: string;
  label: string;
  detail: string;
  categoryId: CategoryId;
  icon?: CalculatorIconName;
}

interface CalculatorSearchProps {
  calculators: readonly SearchItem[];
  categories: readonly CategorySearchItem[];
  /** Shown when the field is focused but empty. */
  suggestions: readonly SearchItem[];
  /** Shown while no calculators exist yet. */
  upcomingNote?: string;
}

const toCalculatorOption = (item: SearchItem): Option => ({
  key: `calc-${item.slug}`,
  kind: "calculator",
  href: item.href,
  label: item.name,
  detail: item.categoryName,
  categoryId: item.categoryId,
  icon: item.icon,
});

const toCategoryOption = (item: CategorySearchItem): Option => ({
  key: `cat-${item.id}`,
  kind: "category",
  href: item.href,
  label: item.name,
  detail: "Category",
  categoryId: item.id,
});

/** Accessible combobox over the calculator registry (lightweight client-side filter). */
export function CalculatorSearch({
  calculators,
  categories,
  suggestions,
  upcomingNote,
}: CalculatorSearchProps) {
  const router = useRouter();
  const baseId = useId();
  const inputId = "calculator-search";
  const listId = `${baseId}-list`;
  const statusId = `${baseId}-status`;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();
  const options: Option[] = trimmed
    ? [
        ...searchCalculators(calculators, trimmed).map(toCalculatorOption),
        ...searchCategories(categories, trimmed).map(toCategoryOption),
      ]
    : suggestions.map(toCalculatorOption);

  const showList = open && options.length > 0;

  let message = "";
  if (trimmed && options.length === 0) message = `Nothing matches “${trimmed}” yet. Try another word.`;
  else if (!trimmed && options.length === 0 && upcomingNote) message = upcomingNote;

  const status = showList
    ? `${options.length} suggestion${options.length === 1 ? "" : "s"}. Use up and down arrows to choose.`
    : message;

  function go(option: Option | undefined) {
    if (!option) return;
    setOpen(false);
    if (option.kind === "category") window.location.assign(option.href);
    else router.push(option.href);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      if (options.length) setActive((i) => (i + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (options.length) setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (event.key === "Escape") {
      // First Escape closes the list; the next one clears the field.
      event.preventDefault();
      if (open) setOpen(false);
      else setQuery("");
      setActive(-1);
    }
  }

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        go(options[active] ?? (trimmed ? options[0] : undefined));
      }}
    >
      <label htmlFor={inputId} className="mb-2 block font-display text-lg font-semibold text-slate-900">
        What do you want to calculate?
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-brand-600" />
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          aria-describedby={statusId}
          autoComplete="off"
          enterKeyHint="go"
          placeholder="Try age, BMI, GPA or loan"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="block h-14 w-full rounded-2xl border-2 border-slate-900 bg-white pr-4 pl-13 text-lg text-slate-900 shadow-[0_4px_0_0_var(--color-slate-900)] transition-shadow placeholder:text-slate-500 focus:shadow-[0_4px_0_0_var(--color-brand-600)] focus-visible:border-brand-600 sm:h-16"
        />
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {status}
      </p>

      {open && !showList && trimmed && message && (
        <p className="mt-3 rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-700">{message}</p>
      )}

      <ul
        id={listId}
        role="listbox"
        aria-label="Suggestions"
        hidden={!showList}
        className="absolute inset-x-0 top-full z-20 mt-3 max-h-80 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lift"
      >
        {options.map((option, index) => (
          <li
            key={option.key}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={index === active}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => go(option)}
            onMouseMove={() => setActive(index)}
            className={cn(
              "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-2",
              index === active && "bg-brand-50",
            )}
          >
            {option.icon ? (
              <CalculatorIconTile icon={option.icon} category={option.categoryId} size="sm" />
            ) : (
              <CategoryIcon category={option.categoryId} size="sm" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-slate-900">{option.label}</span>
              <span className="block text-sm text-slate-600">{option.detail}</span>
            </span>
            <ArrowRightIcon
              className={cn("size-4 shrink-0", index === active ? "text-brand-600" : "text-slate-300")}
            />
          </li>
        ))}
      </ul>
    </form>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { CategoryIcon } from "@/components/calculator/category-icon";
import { categoryNav, primaryNav } from "@/components/layout/nav-links";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

/**
 * Small-screen navigation. Closes on navigation (the pathname changes),
 * on Escape, and when a link is chosen.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  /** The page the menu was opened on; a different page means it's closed. */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);

  return (
    <div
      className="md:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          close();
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpenOn(open ? null : pathname)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-900 hover:bg-brand-50"
      >
        {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        Menu
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 border-b border-slate-200 bg-white shadow-lift"
      >
        <nav aria-label="Menu" className="mx-auto max-w-5xl px-4 py-4">
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="flex min-h-12 items-center rounded-xl px-3 font-semibold text-slate-900 hover:bg-brand-50"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-2 px-3 text-sm font-semibold text-slate-500">Categories</p>
          <ul className="grid grid-cols-2 gap-1">
            {categoryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="flex min-h-12 items-center gap-2 rounded-xl px-2 font-medium text-slate-800 hover:bg-brand-50"
                >
                  <CategoryIcon category={item.id} size="sm" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
